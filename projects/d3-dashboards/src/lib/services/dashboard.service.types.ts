/**
 * Type definitions and error classes for Dashboard Service
 */

import { Observable } from 'rxjs';
import { IDashboard, IDashboardStorageEntry } from '../entities/dashboard.interface';

/**
 * Base error class for Dashboard Service errors
 */
export class DashboardServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public retryable: boolean = false,
    public dashboardId?: string,
    public widgetId?: string,
  ) {
    super(message);
    this.name = 'DashboardServiceError';
    Object.setPrototypeOf(this, DashboardServiceError.prototype);
  }
}

/**
 * Error thrown when a dashboard is not found
 */
export class DashboardNotFoundError extends DashboardServiceError {
  constructor(dashboardId: string) {
    super(`Dashboard ${dashboardId} not found`, 'DASHBOARD_NOT_FOUND', false, dashboardId);
    this.name = 'DashboardNotFoundError';
    Object.setPrototypeOf(this, DashboardNotFoundError.prototype);
  }
}

/**
 * Error thrown when dashboard validation fails
 */
export class DashboardValidationError extends DashboardServiceError {
  constructor(public errors: string[]) {
    super(`Dashboard validation failed: ${errors.join(', ')}`, 'DASHBOARD_VALIDATION_ERROR', false);
    this.name = 'DashboardValidationError';
    Object.setPrototypeOf(this, DashboardValidationError.prototype);
  }
}

/**
 * Error thrown when widget validation fails
 */
export class WidgetValidationError extends DashboardServiceError {
  constructor(public errors: string[]) {
    super(`Widget validation failed: ${errors.join(', ')}`, 'WIDGET_VALIDATION_ERROR', false);
    this.name = 'WidgetValidationError';
    Object.setPrototypeOf(this, WidgetValidationError.prototype);
  }
}

/**
 * Error thrown when widget ID conflicts (duplicate ID)
 */
export class WidgetIdConflictError extends DashboardServiceError {
  constructor(widgetId: string, dashboardId: string) {
    super(
      `Widget ${widgetId} already exists in dashboard ${dashboardId}`,
      'WIDGET_ID_CONFLICT',
      false,
      dashboardId,
      widgetId,
    );
    this.name = 'WidgetIdConflictError';
    Object.setPrototypeOf(this, WidgetIdConflictError.prototype);
  }
}

/**
 * Error thrown when widget is not found
 */
export class WidgetNotFoundError extends DashboardServiceError {
  constructor(widgetId: string, dashboardId: string) {
    super(
      `Widget ${widgetId} not found in dashboard ${dashboardId}`,
      'WIDGET_NOT_FOUND',
      false,
      dashboardId,
      widgetId,
    );
    this.name = 'WidgetNotFoundError';
    Object.setPrototypeOf(this, WidgetNotFoundError.prototype);
  }
}

/**
 * Error thrown when concurrent modification is detected (optimistic locking)
 */
export class ConcurrentModificationError extends DashboardServiceError {
  constructor(dashboardId: string, currentVersion: number, attemptedVersion: number) {
    super(
      `Dashboard ${dashboardId} has been modified. Current version: ${currentVersion}, your version: ${attemptedVersion}`,
      'CONCURRENT_MODIFICATION',
      false,
      dashboardId,
    );
    this.name = 'ConcurrentModificationError';
    Object.setPrototypeOf(this, ConcurrentModificationError.prototype);
  }
}

/**
 * Storage interface for dashboard persistence
 */
export interface IDashboardStorage {
  /**
   * Saves a dashboard to storage
   * @param dashboard Dashboard to save
   * @returns Observable that emits the dashboard ID when saved
   */
  save(dashboard: IDashboard): Observable<string>;

  /**
   * Loads a dashboard by ID
   * @param id Dashboard ID
   * @returns Observable that emits the dashboard or null if not found
   */
  load(id: string): Observable<IDashboard | null>;

  /**
   * Lists all dashboards
   * @returns Observable that emits array of all dashboards
   */
  list(): Observable<IDashboard[]>;

  /**
   * Deletes a dashboard by ID
   * @param id Dashboard ID
   * @returns Observable that emits true if deleted, false if not found
   */
  delete(id: string): Observable<boolean>;
}

/**
 * In-memory dashboard storage implementation
 */
export class InMemoryDashboardStorage implements IDashboardStorage {
  private dashboards = new Map<string, IDashboard>();

  save(dashboard: IDashboard): Observable<string> {
    this.dashboards.set(dashboard.id, { ...dashboard });
    return new Observable((observer) => {
      observer.next(dashboard.id);
      observer.complete();
    });
  }

  load(id: string): Observable<IDashboard | null> {
    return new Observable((observer) => {
      const dashboard = this.dashboards.get(id) || null;
      observer.next(dashboard);
      observer.complete();
    });
  }

  list(): Observable<IDashboard[]> {
    return new Observable((observer) => {
      observer.next(Array.from(this.dashboards.values()));
      observer.complete();
    });
  }

  delete(id: string): Observable<boolean> {
    return new Observable((observer) => {
      const deleted = this.dashboards.delete(id);
      observer.next(deleted);
      observer.complete();
    });
  }
}

/**
 * LocalStorage dashboard storage implementation
 */
export class LocalStorageDashboardStorage implements IDashboardStorage {
  private readonly STORAGE_KEY = 'd3-dashboards';

  save(dashboard: IDashboard): Observable<string> {
    return new Observable((observer) => {
      try {
        const dashboards = this.loadAll();
        dashboards.set(dashboard.id, { ...dashboard });
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(Array.from(dashboards.entries())));
        observer.next(dashboard.id);
        observer.complete();
      } catch (error) {
        observer.error(
          new DashboardServiceError(
            `Failed to save dashboard: ${error instanceof Error ? error.message : String(error)}`,
            'SAVE_ERROR',
            true,
            dashboard.id,
          ),
        );
      }
    });
  }

  load(id: string): Observable<IDashboard | null> {
    return new Observable((observer) => {
      try {
        const dashboards = this.loadAll();
        const dashboard = dashboards.get(id) || null;
        observer.next(dashboard);
        observer.complete();
      } catch (error) {
        observer.error(
          new DashboardServiceError(
            `Failed to load dashboard: ${error instanceof Error ? error.message : String(error)}`,
            'LOAD_ERROR',
            true,
            id,
          ),
        );
      }
    });
  }

  list(): Observable<IDashboard[]> {
    return new Observable((observer) => {
      try {
        const dashboards = this.loadAll();
        observer.next(Array.from(dashboards.values()));
        observer.complete();
      } catch (error) {
        observer.error(
          new DashboardServiceError(
            `Failed to list dashboards: ${error instanceof Error ? error.message : String(error)}`,
            'LIST_ERROR',
            true,
          ),
        );
      }
    });
  }

  delete(id: string): Observable<boolean> {
    return new Observable((observer) => {
      try {
        const dashboards = this.loadAll();
        const deleted = dashboards.delete(id);
        if (deleted) {
          localStorage.setItem(this.STORAGE_KEY, JSON.stringify(Array.from(dashboards.entries())));
        }
        observer.next(deleted);
        observer.complete();
      } catch (error) {
        observer.error(
          new DashboardServiceError(
            `Failed to delete dashboard: ${error instanceof Error ? error.message : String(error)}`,
            'DELETE_ERROR',
            true,
            id,
          ),
        );
      }
    });
  }

  /**
   * Loads all dashboards from localStorage
   * @private
   */
  private loadAll(): Map<string, IDashboard> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) {
        return new Map();
      }
      const entries = JSON.parse(stored) as [string, IDashboard][];
      // Convert date strings back to Date objects
      return new Map(
        entries.map(([id, dashboard]) => [
          id,
          {
            ...dashboard,
            createdAt: new Date(dashboard.createdAt),
            updatedAt: new Date(dashboard.updatedAt),
          },
        ]),
      );
    } catch (error) {
      return new Map();
    }
  }
}

