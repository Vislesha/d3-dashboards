/**
 * Dashboard Service
 *
 * Provides dashboard CRUD operations, widget management, configuration persistence,
 * and state management for the D3 dashboards application.
 */

import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IDashboard, IDashboardConfig, IDashboardState } from '../entities/dashboard.interface';
import { ID3Widget } from '../entities/widget.interface';
import {
  DashboardServiceError,
  DashboardValidationError,
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

  // State management methods will be implemented in Phase 6
  // Load/List methods will be implemented in Phase 4
  // Update/Delete methods will be implemented in Phase 7
  // Widget management methods will be implemented in Phase 5
}

