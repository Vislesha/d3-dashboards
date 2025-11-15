import { Optional, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ID3Widget } from '../entities/widget.interface';
import { IFilterValues } from '../entities/filter.interface';
import { IDashboardNavigationInfo } from '../entities/dashboard.interface';

/**
 * Abstract base class providing common functionality for dashboard implementations.
 *
 * This class provides:
 * - Filter management with reactive state
 * - Widget lifecycle hooks
 * - Navigation helpers (optional Router dependency)
 * - Error handling with graceful degradation
 *
 * Derived classes must implement abstract methods for widget management.
 *
 * @example
 * ```typescript
 * class MyDashboard extends AbstractDashboardContainer {
 *   private widgets: ID3Widget[] = [];
 *
 *   constructor(@Optional() router?: Router) {
 *     super(router);
 *   }
 *
 *   initializeDashboard(): void {
 *     this.widgets = [];
 *   }
 *
 *   getWidgets(): ID3Widget[] {
 *     return this.widgets;
 *   }
 *
 *   addWidget(widget: ID3Widget): void {
 *     this.widgets.push(widget);
 *     this.onWidgetInit(widget);
 *   }
 *
 *   removeWidget(widgetId: string): void {
 *     const index = this.widgets.findIndex(w => w.id === widgetId);
 *     if (index !== -1) {
 *       this.onWidgetDestroy(widgetId);
 *       this.widgets.splice(index, 1);
 *     }
 *   }
 *
 *   updateWidget(widget: ID3Widget): void {
 *     const index = this.widgets.findIndex(w => w.id === widget.id);
 *     if (index !== -1) {
 *       this.widgets[index] = widget;
 *       this.onWidgetUpdate(widget);
 *     }
 *   }
 * }
 * ```
 */
export abstract class AbstractDashboardContainer {
  /**
   * Observable stream of current filter values.
   * Subscribers receive updates after debouncing (300ms).
   */
  protected readonly filters$: BehaviorSubject<IFilterValues[]>;

  /**
   * Subject for managing subscription cleanup using takeUntil pattern.
   * Emits when cleanup() is called.
   */
  protected readonly destroy$: Subject<void>;

  /**
   * Optional Angular Router instance for navigation helpers.
   * If not provided, navigation methods return false/null and log warnings.
   */
  protected readonly router?: Router;

  /**
   * Creates an instance of AbstractDashboardContainer.
   *
   * @param router - Optional Angular Router instance for navigation helpers
   */
  constructor(@Optional() router?: Router) {
    this.router = router;
    this.filters$ = new BehaviorSubject<IFilterValues[]>([]);
    this.destroy$ = new Subject<void>();
  }

  // ============================================================================
  // Abstract Methods (Must be implemented by derived classes)
  // ============================================================================

  /**
   * Initialize the dashboard.
   * Must be implemented by derived classes.
   *
   * @returns void or Promise<void> for async initialization
   */
  abstract initializeDashboard(): void | Promise<void>;

  /**
   * Get current widgets in the dashboard.
   * Must be implemented by derived classes.
   *
   * @returns Array of current widgets
   */
  abstract getWidgets(): ID3Widget[];

  /**
   * Add a widget to the dashboard.
   * Must be implemented by derived classes.
   *
   * Derived classes should call `this.onWidgetInit(widget)` after adding.
   *
   * @param widget - Widget to add to the dashboard
   */
  abstract addWidget(widget: ID3Widget): void;

  /**
   * Remove a widget from the dashboard.
   * Must be implemented by derived classes.
   *
   * Derived classes should call `this.onWidgetDestroy(widgetId)` before removing.
   *
   * @param widgetId - Unique identifier of widget to remove
   */
  abstract removeWidget(widgetId: string): void;

  /**
   * Update an existing widget in the dashboard.
   * Must be implemented by derived classes.
   *
   * Derived classes should call `this.onWidgetUpdate(widget)` after updating.
   *
   * @param widget - Updated widget configuration
   */
  abstract updateWidget(widget: ID3Widget): void;

  // ============================================================================
  // Filter Management
  // ============================================================================

  /**
   * Add a filter to the dashboard.
   * Filter is validated before adding. Invalid filters are rejected with a warning.
   *
   * @param filter - Filter to add. Must have valid key and value.
   */
  addFilter(filter: IFilterValues): void {
    try {
      if (!this.validateFilter(filter)) {
        console.warn('AbstractDashboardContainer: Invalid filter rejected', filter);
        return;
      }

      const currentFilters = this.filters$.value;
      const existingIndex = currentFilters.findIndex((f) => f.key === filter.key);

      if (existingIndex >= 0) {
        // Update existing filter
        const updatedFilters = [...currentFilters];
        updatedFilters[existingIndex] = filter;
        this.filters$.next(updatedFilters);
      } else {
        // Add new filter
        this.filters$.next([...currentFilters, filter]);
      }
    } catch (error) {
      console.error('AbstractDashboardContainer: Error adding filter', error, filter);
    }
  }

  /**
   * Remove a filter by key.
   *
   * @param filterKey - Key of filter to remove
   */
  removeFilter(filterKey: string): void {
    try {
      const currentFilters = this.filters$.value;
      const filtered = currentFilters.filter((f) => f.key !== filterKey);

      if (filtered.length !== currentFilters.length) {
        this.filters$.next(filtered);
      }
    } catch (error) {
      console.error('AbstractDashboardContainer: Error removing filter', error, filterKey);
    }
  }

  /**
   * Update an existing filter.
   * If filter with same key exists, it is updated. Otherwise, filter is added.
   *
   * @param filter - Updated filter configuration
   */
  updateFilter(filter: IFilterValues): void {
    try {
      if (!this.validateFilter(filter)) {
        console.warn('AbstractDashboardContainer: Invalid filter rejected', filter);
        return;
      }

      const currentFilters = this.filters$.value;
      const existingIndex = currentFilters.findIndex((f) => f.key === filter.key);

      if (existingIndex >= 0) {
        // Update existing filter
        const updatedFilters = [...currentFilters];
        updatedFilters[existingIndex] = filter;
        this.filters$.next(updatedFilters);
      } else {
        // Add new filter
        this.addFilter(filter);
      }
    } catch (error) {
      console.error('AbstractDashboardContainer: Error updating filter', error, filter);
    }
  }

  /**
   * Get current filter values synchronously.
   *
   * @returns Current array of filter values
   */
  getFilters(): IFilterValues[] {
    return this.filters$.value;
  }

  /**
   * Get observable stream of filter values.
   * Subscribers are notified when filters change (after debouncing).
   *
   * Remember to unsubscribe to prevent memory leaks (use takeUntil pattern).
   *
   * @returns Observable stream of filter values
   */
  getFilters$(): Observable<IFilterValues[]> {
    return this.filters$.pipe(debounceTime(300), takeUntil(this.destroy$));
  }

  /**
   * Clear all filters from the dashboard.
   */
  clearFilters(): void {
    try {
      this.filters$.next([]);
    } catch (error) {
      console.error('AbstractDashboardContainer: Error clearing filters', error);
    }
  }

  // ============================================================================
  // Widget Lifecycle Hooks (Protected, can be overridden)
  // ============================================================================

  /**
   * Lifecycle hook called when widget is initialized.
   * Can be overridden by derived classes for custom widget initialization logic.
   *
   * Errors in this hook are caught and logged, but do not block widget operations.
   *
   * @param widget - Widget that was initialized
   */
  protected onWidgetInit(widget: ID3Widget): void {
    try {
      // Default implementation: no-op
      // Derived classes can override for custom logic
    } catch (error) {
      console.error('AbstractDashboardContainer: Error in onWidgetInit hook', error, widget);
    }
  }

  /**
   * Lifecycle hook called when widget is updated.
   * Can be overridden by derived classes for custom widget update logic.
   *
   * Errors in this hook are caught and logged, but do not block widget operations.
   *
   * @param widget - Widget that was updated
   */
  protected onWidgetUpdate(widget: ID3Widget): void {
    try {
      // Default implementation: no-op
      // Derived classes can override for custom logic
    } catch (error) {
      console.error('AbstractDashboardContainer: Error in onWidgetUpdate hook', error, widget);
    }
  }

  /**
   * Lifecycle hook called when widget is destroyed.
   * Can be overridden by derived classes for custom widget cleanup logic.
   *
   * Errors in this hook are caught and logged, but do not block widget operations.
   *
   * @param widgetId - Unique identifier of widget being destroyed
   */
  protected onWidgetDestroy(widgetId: string): void {
    try {
      // Default implementation: no-op
      // Derived classes can override for custom logic
    } catch (error) {
      console.error('AbstractDashboardContainer: Error in onWidgetDestroy hook', error, widgetId);
    }
  }

  // ============================================================================
  // Navigation Helpers
  // ============================================================================

  /**
   * Navigate to another dashboard.
   * Returns false if Router is not available or navigation fails.
   *
   * @param dashboardId - Identifier of dashboard to navigate to
   * @param params - Optional route parameters
   * @returns Promise that resolves to true if navigation succeeded, false otherwise
   */
  async navigateToDashboard(dashboardId: string, params?: Record<string, any>): Promise<boolean> {
    try {
      if (!this.canNavigate()) {
        console.warn(
          'AbstractDashboardContainer: Router not available for navigation',
          dashboardId,
        );
        return false;
      }

      if (!this.router) {
        return false;
      }

      const route = `/dashboard/${dashboardId}`;
      const navigationResult = await this.router.navigate([route], {
        queryParams: params,
      });

      return navigationResult;
    } catch (error) {
      console.error('AbstractDashboardContainer: Navigation error', error, dashboardId, params);
      return false;
    }
  }

  /**
   * Get current dashboard navigation information.
   * Returns null if Router is not available.
   *
   * @returns Dashboard navigation info or null if Router unavailable
   */
  getCurrentDashboard(): IDashboardNavigationInfo | null {
    try {
      if (!this.canNavigate() || !this.router) {
        console.warn('AbstractDashboardContainer: Router not available for getCurrentDashboard');
        return null;
      }

      const state = this.router.routerState.snapshot;
      const route = state.root;

      // Extract route information
      let dashboardId = '';
      let routePath = state.url;
      const params: Record<string, any> = {};
      const queryParams: Record<string, any> = {};

      // Extract route params
      let currentRoute = route;
      while (currentRoute) {
        if (currentRoute.params) {
          Object.assign(params, currentRoute.params);
        }
        if (currentRoute.firstChild) {
          currentRoute = currentRoute.firstChild;
        } else {
          break;
        }
      }

      // Extract query params
      if (state.root.queryParams) {
        Object.assign(queryParams, state.root.queryParams);
      }

      // Try to extract dashboard ID from route params or URL
      dashboardId = params['id'] || params['dashboardId'] || routePath.split('/').pop() || '';

      return {
        dashboardId,
        route: routePath,
        params,
        queryParams,
      };
    } catch (error) {
      console.error('AbstractDashboardContainer: Error getting current dashboard', error);
      return null;
    }
  }

  /**
   * Check if navigation is available (Router is injected).
   *
   * @returns true if Router is available, false otherwise
   */
  canNavigate(): boolean {
    return this.router !== undefined && this.router !== null;
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  /**
   * Validate filter before adding or updating.
   * Returns true if valid, false otherwise.
   *
   * Can be overridden for custom validation logic.
   *
   * @param filter - Filter to validate
   * @returns true if filter is valid, false otherwise
   */
  protected validateFilter(filter: IFilterValues): boolean {
    if (!filter || typeof filter !== 'object') {
      return false;
    }

    if (!filter.key || typeof filter.key !== 'string' || filter.key.trim().length === 0) {
      return false;
    }

    if (filter.value === undefined) {
      return false;
    }

    // Validate operator if provided
    if (filter.operator !== undefined) {
      const validOperators = ['equals', 'contains', 'greaterThan', 'lessThan', 'between'];
      if (!validOperators.includes(filter.operator)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Clean up resources and subscriptions.
   * Should be called in derived class destroy lifecycle (e.g., ngOnDestroy).
   *
   * This method:
   * - Completes the destroy$ subject to trigger takeUntil cleanup
   * - Completes the filters$ BehaviorSubject
   */
  cleanup(): void {
    try {
      this.destroy$.next();
      this.destroy$.complete();
      this.filters$.complete();
    } catch (error) {
      console.error('AbstractDashboardContainer: Error during cleanup', error);
    }
  }
}
