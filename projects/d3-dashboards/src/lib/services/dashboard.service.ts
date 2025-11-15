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
  IDashboardStorage,
  InMemoryDashboardStorage,
  LocalStorageDashboardStorage,
} from './dashboard.service.types';
import { validateDashboard, validateWidget } from '../utils/dashboard-validator.util';

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

  // State management methods will be implemented in Phase 6
  // CRUD methods will be implemented in Phases 3, 4, 7
  // Widget management methods will be implemented in Phase 5
}

