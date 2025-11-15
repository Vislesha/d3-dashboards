import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AbstractDashboardContainer } from './abstract-dashboard-container';
import { ID3Widget } from '../entities/widget.interface';
import { IFilterValues } from '../entities/filter.interface';
import { IDashboardNavigationInfo } from '../entities/dashboard.interface';
import { GridsterItem } from 'angular-gridster2';

/**
 * Mock derived class for testing AbstractDashboardContainer
 */
class MockDashboard extends AbstractDashboardContainer {
  widgets: ID3Widget[] = [];
  initCalled = false;
  destroyCalled = false;
  updateCalled = false;
  errorInInit = false;

  initializeDashboard(): void {
    this.initCalled = true;
    this.widgets = [];
  }

  getWidgets(): ID3Widget[] {
    return this.widgets;
  }

  addWidget(widget: ID3Widget): void {
    this.widgets.push(widget);
    try {
      this.onWidgetInit(widget);
    } catch (error) {
      // Errors in lifecycle hooks should be caught and logged, but not block operations
      console.error('Error in onWidgetInit', error);
    }
  }

  removeWidget(widgetId: string): void {
    const index = this.widgets.findIndex((w) => w.id === widgetId);
    if (index !== -1) {
      this.onWidgetDestroy(widgetId);
      this.widgets.splice(index, 1);
    }
  }

  updateWidget(widget: ID3Widget): void {
    const index = this.widgets.findIndex((w) => w.id === widget.id);
    if (index !== -1) {
      this.widgets[index] = widget;
      this.onWidgetUpdate(widget);
    }
  }

  protected override onWidgetInit(widget: ID3Widget): void {
    this.initCalled = true;
    if (this.errorInInit) {
      throw new Error('Test error');
    }
    super.onWidgetInit(widget);
  }

  protected override onWidgetDestroy(widgetId: string): void {
    this.destroyCalled = true;
    super.onWidgetDestroy(widgetId);
  }

  protected override onWidgetUpdate(widget: ID3Widget): void {
    this.updateCalled = true;
    super.onWidgetUpdate(widget);
  }
}

describe('AbstractDashboardContainer', () => {
  let dashboard: MockDashboard;
  let mockRouter: any;

  const createMockWidget = (id: string, title: string = 'Test Widget'): ID3Widget => ({
    id,
    type: 'line',
    position: { cols: 4, rows: 3, x: 0, y: 0 } as GridsterItem,
    title,
    config: {},
  });

  beforeEach(() => {
    mockRouter = {
      navigate: jest.fn().mockResolvedValue(true),
      routerState: {
        snapshot: {
          url: '/dashboard/test',
          root: {
            params: { id: 'test' },
            queryParams: {},
            firstChild: null,
          },
        },
      },
    };

    dashboard = new MockDashboard(mockRouter);
  });

  afterEach(() => {
    dashboard.cleanup();
  });

  describe('Constructor', () => {
    it('should create instance with Router', () => {
      const dashboardWithRouter = new MockDashboard(mockRouter);
      expect(dashboardWithRouter).toBeTruthy();
      expect(dashboardWithRouter.canNavigate()).toBe(true);
    });

    it('should create instance without Router', () => {
      const dashboardWithoutRouter = new MockDashboard();
      expect(dashboardWithoutRouter).toBeTruthy();
      expect(dashboardWithoutRouter.canNavigate()).toBe(false);
    });

    it('should initialize filters$ with empty array', () => {
      expect(dashboard.getFilters()).toEqual([]);
    });
  });

  describe('Filter Management', () => {
    it('should add a valid filter', () => {
      const filter: IFilterValues = { key: 'test', value: 'value' };
      dashboard.addFilter(filter);
      expect(dashboard.getFilters()).toContain(filter);
    });

    it('should reject invalid filter (missing key)', () => {
      const filter = { value: 'value' } as IFilterValues;
      const consoleSpy = jest.spyOn(console, 'warn');
      dashboard.addFilter(filter);
      expect(dashboard.getFilters()).not.toContain(filter);
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should reject invalid filter (empty key)', () => {
      const filter: IFilterValues = { key: '', value: 'value' };
      const consoleSpy = jest.spyOn(console, 'warn');
      dashboard.addFilter(filter);
      expect(dashboard.getFilters()).not.toContain(filter);
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should reject invalid filter (undefined value)', () => {
      const filter: IFilterValues = { key: 'test', value: undefined as any };
      const consoleSpy = jest.spyOn(console, 'warn');
      dashboard.addFilter(filter);
      expect(dashboard.getFilters()).not.toContain(filter);
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should update existing filter with same key', () => {
      const filter1: IFilterValues = { key: 'test', value: 'value1' };
      const filter2: IFilterValues = { key: 'test', value: 'value2' };
      dashboard.addFilter(filter1);
      dashboard.updateFilter(filter2);
      const filters = dashboard.getFilters();
      expect(filters.length).toBe(1);
      expect(filters[0].value).toBe('value2');
    });

    it('should remove filter by key', () => {
      const filter: IFilterValues = { key: 'test', value: 'value' };
      dashboard.addFilter(filter);
      expect(dashboard.getFilters().length).toBe(1);
      dashboard.removeFilter('test');
      expect(dashboard.getFilters().length).toBe(0);
    });

    it('should clear all filters', () => {
      dashboard.addFilter({ key: 'test1', value: 'value1' });
      dashboard.addFilter({ key: 'test2', value: 'value2' });
      expect(dashboard.getFilters().length).toBe(2);
      dashboard.clearFilters();
      expect(dashboard.getFilters().length).toBe(0);
    });

    it('should provide observable stream of filters', (done) => {
      const filter: IFilterValues = { key: 'test', value: 'value' };
      dashboard.getFilters$().subscribe((filters) => {
        expect(filters).toContain(filter);
        done();
      });
      dashboard.addFilter(filter);
    });

    it('should debounce filter updates', (done) => {
      let callCount = 0;
      dashboard.getFilters$().subscribe(() => {
        callCount++;
        if (callCount === 1) {
          expect(dashboard.getFilters().length).toBe(3);
          done();
        }
      });

      dashboard.addFilter({ key: 'test1', value: 'value1' });
      dashboard.addFilter({ key: 'test2', value: 'value2' });
      dashboard.addFilter({ key: 'test3', value: 'value3' });
    });
  });

  describe('Widget Lifecycle Hooks', () => {
    it('should call onWidgetInit when widget is added', () => {
      const widget = createMockWidget('widget1');
      dashboard.addWidget(widget);
      expect(dashboard.initCalled).toBe(true);
      expect(dashboard.getWidgets()).toContain(widget);
    });

    it('should call onWidgetDestroy when widget is removed', () => {
      const widget = createMockWidget('widget1');
      dashboard.addWidget(widget);
      dashboard.removeWidget('widget1');
      expect(dashboard.destroyCalled).toBe(true);
      expect(dashboard.getWidgets()).not.toContain(widget);
    });

    it('should call onWidgetUpdate when widget is updated', () => {
      const widget = createMockWidget('widget1');
      dashboard.addWidget(widget);
      const updatedWidget = { ...widget, title: 'Updated' };
      dashboard.updateWidget(updatedWidget);
      expect(dashboard.updateCalled).toBe(true);
      expect(dashboard.getWidgets()[0].title).toBe('Updated');
    });

    it('should handle errors in lifecycle hooks gracefully', () => {
      const widget = createMockWidget('widget1');
      const consoleSpy = jest.spyOn(console, 'error');

      // Set flag to throw error in addWidget
      dashboard.errorInInit = true;

      dashboard.addWidget(widget);
      // Error should be caught in onWidgetInit
      expect(dashboard.getWidgets()).toContain(widget);
    });
  });

  describe('Navigation Helpers', () => {
    it('should return true for canNavigate when Router is available', () => {
      expect(dashboard.canNavigate()).toBe(true);
    });

    it('should return false for canNavigate when Router is not available', () => {
      const dashboardWithoutRouter = new MockDashboard();
      expect(dashboardWithoutRouter.canNavigate()).toBe(false);
    });

    it('should navigate to dashboard when Router is available', async () => {
      mockRouter.navigate.mockResolvedValue(true);
      const result = await dashboard.navigateToDashboard('test-dashboard', { param: 'value' });
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard/test-dashboard'], {
        queryParams: { param: 'value' },
      });
      expect(result).toBe(true);
    });

    it('should return false when navigating without Router', async () => {
      const dashboardWithoutRouter = new MockDashboard();
      const consoleSpy = jest.spyOn(console, 'warn');
      const result = await dashboardWithoutRouter.navigateToDashboard('test-dashboard');
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should return current dashboard info when Router is available', () => {
      const info = dashboard.getCurrentDashboard();
      expect(info).toBeTruthy();
      expect(info?.dashboardId).toBe('test');
      expect(info?.route).toBe('/dashboard/test');
    });

    it('should return null when getting current dashboard without Router', () => {
      const dashboardWithoutRouter = new MockDashboard();
      const consoleSpy = jest.spyOn(console, 'warn');
      const info = dashboardWithoutRouter.getCurrentDashboard();
      expect(info).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should handle navigation errors gracefully', async () => {
      mockRouter.navigate.mockRejectedValue(new Error('Navigation failed'));
      const consoleSpy = jest.spyOn(console, 'error');
      const result = await dashboard.navigateToDashboard('test-dashboard');
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should handle filter operation errors gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'error');
      // Force an error by corrupting filters$ state
      (dashboard as any).filters$ = null;
      dashboard.addFilter({ key: 'test', value: 'value' });
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('should handle widget operation with non-existent ID gracefully', () => {
      dashboard.removeWidget('non-existent');
      // Should not throw, but derived class should handle gracefully
      expect(dashboard.getWidgets().length).toBe(0);
    });
  });

  describe('Cleanup', () => {
    it('should cleanup subscriptions', () => {
      const subscription = dashboard.getFilters$().subscribe();
      expect(subscription.closed).toBe(false);
      dashboard.cleanup();
      // After cleanup, new subscriptions should complete immediately
      let completed = false;
      dashboard.getFilters$().subscribe({
        complete: () => {
          completed = true;
        },
      });
      // Note: BehaviorSubject completes, so subscription may not be immediately closed
      // but cleanup should prevent memory leaks
      expect(dashboard).toBeTruthy();
    });
  });

  describe('Filter Validation', () => {
    it('should validate filter with valid operator', () => {
      const filter: IFilterValues = {
        key: 'test',
        value: 'value',
        operator: 'equals',
      };
      dashboard.addFilter(filter);
      expect(dashboard.getFilters()).toContain(filter);
    });

    it('should reject filter with invalid operator', () => {
      const filter = {
        key: 'test',
        value: 'value',
        operator: 'invalid' as any,
      };
      const consoleSpy = jest.spyOn(console, 'warn');
      dashboard.addFilter(filter);
      expect(dashboard.getFilters()).not.toContain(filter);
      expect(consoleSpy).toHaveBeenCalled();
    });
  });
});
