/**
 * Dashboard Service
 *
 * Provides dashboard CRUD operations, widget management, configuration persistence,
 * and state management for the D3 dashboards application.
 */

import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { IDashboard, IDashboardConfig, IDashboardState } from '../entities/dashboard.interface';
import { ID3Widget } from '../entities/widget.interface';
import {
  DashboardServiceError,
  DashboardValidationError,
  DashboardNotFoundError,
  ConcurrentModificationError,
  WidgetValidationError,
  WidgetIdConflictError,
  WidgetNotFoundError,
  IDashboardStorage,
  InMemoryDashboardStorage,
  LocalStorageDashboardStorage,
} from './dashboard.service.types';
import { validateDashboard, validateWidget, generateUUID } from '../utils/dashboard-validator.util';
import { IValidationResult } from '../entities/data-source.interface';

/**
 * Dashboard Service
 */
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private storage: IDashboardStorage;
  private state$: BehaviorSubject<IDashboardState>;

  constructor() {
    // Initialize storage (use localStorage if available, otherwise in-memory)
    if (typeof localStorage !== 'undefined') {
      this.storage = new LocalStorageDashboardStorage();
    } else {
      this.storage = new InMemoryDashboardStorage();
    }

    // Initialize state
    this.state$ = new BehaviorSubject<IDashboardState>({
      activeDashboardId: null,
      editMode: false,
      filters: [],
      selectedWidgets: [],
    });
  }

  /**
   * Creates a new dashboard with the provided configuration
   * @param config Dashboard configuration
   * @returns Observable that emits the created dashboard ID
   */
  create(config: IDashboardConfig): Observable<string> {
    // Create dashboard object with generated ID and timestamps
    const now = new Date();
    const dashboard: IDashboard = {
      id: generateUUID(),
      title: config.title,
      description: config.description,
      widgets: config.widgets || [],
      layout: config.layout,
      filters: config.filters || [],
      version: 1,
      createdAt: now,
      updatedAt: now,
      metadata: config.metadata || {},
    };

    // Validate dashboard
    const validation = validateDashboard(dashboard);
    if (!validation.valid) {
      return throwError(() => new DashboardValidationError(validation.errors));
    }

    // Save to storage
    return this.storage.save(dashboard).pipe(
      catchError((error) => {
        if (error instanceof DashboardServiceError) {
          return throwError(() => error);
        }
        return throwError(
          () =>
            new DashboardServiceError(
              `Failed to save dashboard: ${error instanceof Error ? error.message : String(error)}`,
              'SAVE_ERROR',
              true,
              dashboard.id,
            ),
        );
      }),
    );
  }

  /**
   * Validates a dashboard configuration
   * @param dashboard Dashboard to validate
   * @returns Validation result
   */
  validateDashboard(dashboard: IDashboard | IDashboardConfig): IValidationResult {
    return validateDashboard(dashboard);
  }

  /**
   * Loads a dashboard by ID
   * @param id Dashboard ID
   * @returns Observable that emits the dashboard configuration
   */
  load(id: string): Observable<IDashboard> {
    return this.storage.load(id).pipe(
      map((dashboard) => {
        if (!dashboard) {
          throw new DashboardNotFoundError(id);
        }

        // Validate loaded dashboard to reject corrupted data
        const validation = validateDashboard(dashboard);
        if (!validation.valid) {
          throw new DashboardValidationError(validation.errors);
        }

        return dashboard;
      }),
      catchError((error) => {
        if (error instanceof DashboardServiceError) {
          return throwError(() => error);
        }
        return throwError(
          () =>
            new DashboardServiceError(
              `Failed to load dashboard: ${error instanceof Error ? error.message : String(error)}`,
              'LOAD_ERROR',
              true,
              id,
            ),
        );
      }),
    );
  }

  /**
   * Lists all saved dashboards
   * @returns Observable that emits array of all dashboards
   */
  list(): Observable<IDashboard[]> {
    return this.storage.list().pipe(
      map((dashboards) => {
        // Validate all dashboards and filter out corrupted ones
        return dashboards.filter((dashboard) => {
          const validation = validateDashboard(dashboard);
          return validation.valid;
        });
      }),
      catchError((error) => {
        return throwError(
          () =>
            new DashboardServiceError(
              `Failed to list dashboards: ${error instanceof Error ? error.message : String(error)}`,
              'LIST_ERROR',
              true,
            ),
        );
      }),
    );
  }

  /**
   * Updates an existing dashboard
   * @param dashboard Dashboard object with updated configuration
   * @returns Observable that emits the updated dashboard
   */
  update(dashboard: IDashboard): Observable<IDashboard> {
    // Validate dashboard configuration
    const validation = validateDashboard(dashboard);
    if (!validation.valid) {
      return throwError(() => new DashboardValidationError(validation.errors));
    }

    // Load existing dashboard to check version
    return this.storage.load(dashboard.id).pipe(
      map((existing) => {
        if (!existing) {
          throw new DashboardNotFoundError(dashboard.id);
        }

        // Check for concurrent modifications (version mismatch)
        if (existing.version !== dashboard.version) {
          throw new ConcurrentModificationError(
            dashboard.id,
            existing.version,
            dashboard.version,
          );
        }

        // Increment version and update timestamp
        const now = new Date();
        const updated: IDashboard = {
          ...dashboard,
          version: existing.version + 1,
          updatedAt: now,
        };

        return updated;
      }),
      switchMap((updated) => {
        // Save updated dashboard and return it
        return this.storage.save(updated).pipe(map(() => updated));
      }),
      catchError((error) => {
        if (error instanceof DashboardServiceError) {
          return throwError(() => error);
        }
        return throwError(
          () =>
            new DashboardServiceError(
              `Failed to update dashboard: ${error instanceof Error ? error.message : String(error)}`,
              'UPDATE_ERROR',
              true,
              dashboard.id,
            ),
        );
      }),
    );
  }

  /**
   * Deletes a dashboard by ID
   * @param id Dashboard ID
   * @returns Observable that emits true if deleted, false if not found
   */
  delete(id: string): Observable<boolean> {
    return this.storage.delete(id).pipe(
      map((deleted) => {
        // Update state if deleted dashboard was active
        const currentState = this.state$.value;
        if (currentState.activeDashboardId === id) {
          this.updateState({
            activeDashboardId: null,
          });
        }
        return deleted;
      }),
      catchError((error) => {
        return throwError(
          () =>
            new DashboardServiceError(
              `Failed to delete dashboard: ${error instanceof Error ? error.message : String(error)}`,
              'DELETE_ERROR',
              true,
              id,
            ),
        );
      }),
    );
  }

  /**
   * Validates a widget configuration
   * @param widget Widget to validate
   * @returns Validation result
   */
  validateWidget(widget: ID3Widget): IValidationResult {
    return validateWidget(widget);
  }

  /**
   * Adds a widget to a dashboard
   * @param dashboardId Dashboard ID
   * @param widget Widget configuration
   * @returns Observable that emits the updated dashboard
   */
  addWidget(dashboardId: string, widget: ID3Widget): Observable<IDashboard> {
    // Validate widget
    const widgetValidation = validateWidget(widget);
    if (!widgetValidation.valid) {
      return throwError(() => new WidgetValidationError(widgetValidation.errors));
    }

    // Load dashboard
    return this.load(dashboardId).pipe(
      map((dashboard) => {
        // Check for widget ID conflicts
        if (dashboard.widgets.some((w) => w.id === widget.id)) {
          throw new WidgetIdConflictError(widget.id, dashboardId);
        }

        // Immutable update: add widget
        const now = new Date();
        const updated: IDashboard = {
          ...dashboard,
          widgets: [...dashboard.widgets, widget],
          version: dashboard.version + 1,
          updatedAt: now,
        };

        return updated;
      }),
      switchMap((updated) => {
        // Save updated dashboard
        return this.storage.save(updated).pipe(map(() => updated));
      }),
      catchError((error) => {
        if (error instanceof DashboardServiceError) {
          return throwError(() => error);
        }
        return throwError(
          () =>
            new DashboardServiceError(
              `Failed to add widget: ${error instanceof Error ? error.message : String(error)}`,
              'ADD_WIDGET_ERROR',
              true,
              dashboardId,
              widget.id,
            ),
        );
      }),
    );
  }

  /**
   * Updates a widget in a dashboard
   * @param dashboardId Dashboard ID
   * @param widget Widget configuration with updated values
   * @returns Observable that emits the updated dashboard
   */
  updateWidget(dashboardId: string, widget: ID3Widget): Observable<IDashboard> {
    // Validate widget
    const widgetValidation = validateWidget(widget);
    if (!widgetValidation.valid) {
      return throwError(() => new WidgetValidationError(widgetValidation.errors));
    }

    // Load dashboard
    return this.load(dashboardId).pipe(
      map((dashboard) => {
        // Find widget by ID
        const widgetIndex = dashboard.widgets.findIndex((w) => w.id === widget.id);
        if (widgetIndex === -1) {
          throw new WidgetNotFoundError(widget.id, dashboardId);
        }

        // Immutable update: update widget
        const now = new Date();
        const updated: IDashboard = {
          ...dashboard,
          widgets: dashboard.widgets.map((w) => (w.id === widget.id ? widget : w)),
          version: dashboard.version + 1,
          updatedAt: now,
        };

        return updated;
      }),
      switchMap((updated) => {
        // Save updated dashboard
        return this.storage.save(updated).pipe(map(() => updated));
      }),
      catchError((error) => {
        if (error instanceof DashboardServiceError) {
          return throwError(() => error);
        }
        return throwError(
          () =>
            new DashboardServiceError(
              `Failed to update widget: ${error instanceof Error ? error.message : String(error)}`,
              'UPDATE_WIDGET_ERROR',
              true,
              dashboardId,
              widget.id,
            ),
        );
      }),
    );
  }

  /**
   * Removes a widget from a dashboard
   * @param dashboardId Dashboard ID
   * @param widgetId Widget ID
   * @returns Observable that emits the updated dashboard
   */
  removeWidget(dashboardId: string, widgetId: string): Observable<IDashboard> {
    // Load dashboard
    return this.load(dashboardId).pipe(
      map((dashboard) => {
        // Find widget by ID
        const widgetExists = dashboard.widgets.some((w) => w.id === widgetId);
        if (!widgetExists) {
          throw new WidgetNotFoundError(widgetId, dashboardId);
        }

        // Immutable update: remove widget
        const now = new Date();
        const updated: IDashboard = {
          ...dashboard,
          widgets: dashboard.widgets.filter((w) => w.id !== widgetId),
          version: dashboard.version + 1,
          updatedAt: now,
        };

        return updated;
      }),
      switchMap((updated) => {
        // Save updated dashboard
        return this.storage.save(updated).pipe(map(() => updated));
      }),
      catchError((error) => {
        if (error instanceof DashboardServiceError) {
          return throwError(() => error);
        }
        return throwError(
          () =>
            new DashboardServiceError(
              `Failed to remove widget: ${error instanceof Error ? error.message : String(error)}`,
              'REMOVE_WIDGET_ERROR',
              true,
              dashboardId,
              widgetId,
            ),
        );
      }),
    );
  }

  /**
   * Gets the state observable
   * @returns Observable that emits the current dashboard state
   */
  getState(): Observable<IDashboardState> {
    return this.state$.asObservable();
  }

  /**
   * Gets the current state synchronously
   * @returns Current dashboard state
   */
  getCurrentState(): IDashboardState {
    return this.state$.value;
  }

  /**
   * Updates the dashboard state with partial updates
   * @param updates Partial state updates
   */
  updateState(updates: Partial<IDashboardState>): void {
    const currentState = this.state$.value;
    const newState: IDashboardState = {
      ...currentState,
      ...updates,
    };
    this.state$.next(newState);
  }

  /**
   * Resets the dashboard state to initial values
   */
  resetState(): void {
    this.state$.next({
      activeDashboardId: null,
      editMode: false,
      filters: [],
      selectedWidgets: [],
    });
  }
}

