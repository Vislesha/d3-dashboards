# Quickstart: Abstract Dashboard Container

**Feature**: 001-abstract-dashboard  
**Date**: 2025-01-27  
**Status**: Complete

## Overview

This quickstart guide demonstrates how to extend and use the `AbstractDashboardContainer` class to create custom dashboard implementations.

## Basic Usage

### Step 1: Extend the Abstract Class

Create a custom dashboard class that extends `AbstractDashboardContainer`:

```typescript
import { Component, OnInit, OnDestroy, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractDashboardContainer } from 'd3-dashboards';
import { ID3Widget, IFilterValues } from 'd3-dashboards';

@Component({
  selector: 'app-custom-dashboard',
  standalone: true,
  template: `
    <div class="dashboard">
      <!-- Your dashboard template -->
    </div>
  `
})
export class CustomDashboardComponent 
  extends AbstractDashboardContainer 
  implements OnInit, OnDestroy {
  
  private widgets: ID3Widget[] = [];

  constructor(@Optional() router?: Router) {
    super(router);
  }

  ngOnInit(): void {
    this.initializeDashboard();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  // Implement abstract methods
  initializeDashboard(): void {
    // Initialize your dashboard
    this.widgets = [];
  }

  getWidgets(): ID3Widget[] {
    return this.widgets;
  }

  addWidget(widget: ID3Widget): void {
    this.widgets.push(widget);
    // Call parent hook
    this.onWidgetInit(widget);
  }

  removeWidget(widgetId: string): void {
    const index = this.widgets.findIndex(w => w.id === widgetId);
    if (index !== -1) {
      // Call parent hook before removing
      this.onWidgetDestroy(widgetId);
      this.widgets.splice(index, 1);
    }
  }

  updateWidget(widget: ID3Widget): void {
    const index = this.widgets.findIndex(w => w.id === widget.id);
    if (index !== -1) {
      this.widgets[index] = widget;
      // Call parent hook
      this.onWidgetUpdate(widget);
    }
  }
}
```

### Step 2: Use Filter Management

The abstract class provides filter management methods:

```typescript
export class CustomDashboardComponent extends AbstractDashboardContainer {
  
  // Add a filter
  applyDateFilter(startDate: Date, endDate: Date): void {
    this.addFilter({
      key: 'dateRange',
      value: { start: startDate, end: endDate },
      operator: 'between'
    });
  }

  // Remove a filter
  clearDateFilter(): void {
    this.removeFilter('dateRange');
  }

  // Update a filter
  updateDateFilter(startDate: Date, endDate: Date): void {
    this.updateFilter({
      key: 'dateRange',
      value: { start: startDate, end: endDate },
      operator: 'between'
    });
  }

  // Get current filters
  getCurrentFilters(): IFilterValues[] {
    return this.getFilters();
  }

  // Subscribe to filter changes
  subscribeToFilters(): void {
    this.getFilters$().subscribe(filters => {
      console.log('Filters changed:', filters);
      // Update widgets based on new filters
      this.updateWidgetsWithFilters(filters);
    });
  }
}
```

### Step 3: Override Lifecycle Hooks

Override protected lifecycle hooks for custom widget management:

```typescript
export class CustomDashboardComponent extends AbstractDashboardContainer {
  
  protected override onWidgetInit(widget: ID3Widget): void {
    console.log('Widget initialized:', widget.id);
    // Custom initialization logic
    // e.g., load widget data, set up event listeners
  }

  protected override onWidgetUpdate(widget: ID3Widget): void {
    console.log('Widget updated:', widget.id);
    // Custom update logic
    // e.g., refresh widget data, update display
  }

  protected override onWidgetDestroy(widgetId: string): void {
    console.log('Widget destroyed:', widgetId);
    // Custom cleanup logic
    // e.g., unsubscribe from data streams, remove event listeners
  }
}
```

### Step 4: Use Navigation Helpers

If Router is injected, use navigation helpers:

```typescript
export class CustomDashboardComponent extends AbstractDashboardContainer {
  
  async navigateToSalesDashboard(): Promise<void> {
    if (this.canNavigate()) {
      const success = await this.navigateToDashboard('sales', {
        period: 'monthly'
      });
      if (!success) {
        console.error('Navigation failed');
      }
    }
  }

  getCurrentDashboardInfo(): void {
    const info = this.getCurrentDashboard();
    if (info) {
      console.log('Current dashboard:', info.dashboardId);
      console.log('Route:', info.route);
      console.log('Params:', info.params);
    }
  }
}
```

## Advanced Usage

### Custom Filter Validation

Override the `validateFilter` method for custom validation:

```typescript
export class CustomDashboardComponent extends AbstractDashboardContainer {
  
  protected override validateFilter(filter: IFilterValues): boolean {
    // Call parent validation
    if (!super.validateFilter(filter)) {
      return false;
    }

    // Custom validation
    if (filter.key === 'dateRange' && filter.operator === 'between') {
      const value = filter.value as { start: Date; end: Date };
      if (value.start > value.end) {
        console.error('Start date must be before end date');
        return false;
      }
    }

    return true;
  }
}
```

### Reactive Filter Management

Use RxJS operators for advanced filter handling:

```typescript
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

export class CustomDashboardComponent extends AbstractDashboardContainer {
  
  ngOnInit(): void {
    super.ngOnInit();
    
    // Subscribe to filters with custom operators
    this.getFilters$()
      .pipe(
        debounceTime(500), // Custom debounce
        distinctUntilChanged((prev, curr) => 
          JSON.stringify(prev) === JSON.stringify(curr)
        )
      )
      .subscribe(filters => {
        this.handleFilterChange(filters);
      });
  }

  private handleFilterChange(filters: IFilterValues[]): void {
    // Update all widgets with new filters
    this.getWidgets().forEach(widget => {
      this.updateWidget({
        ...widget,
        filters: filters
      });
    });
  }
}
```

### Error Handling

Handle errors gracefully in your implementation:

```typescript
export class CustomDashboardComponent extends AbstractDashboardContainer {
  
  addWidget(widget: ID3Widget): void {
    try {
      // Validate widget
      if (!this.isValidWidget(widget)) {
        throw new Error('Invalid widget configuration');
      }

      this.widgets.push(widget);
      this.onWidgetInit(widget);
    } catch (error) {
      console.error('Failed to add widget:', error);
      // Handle error (e.g., show user notification)
    }
  }

  private isValidWidget(widget: ID3Widget): boolean {
    return widget.id && widget.type && widget.title;
  }
}
```

## Complete Example

Here's a complete example of a custom dashboard:

```typescript
import { Component, OnInit, OnDestroy, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractDashboardContainer } from 'd3-dashboards';
import { ID3Widget, IFilterValues } from 'd3-dashboards';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-sales-dashboard',
  standalone: true,
  template: `
    <div class="sales-dashboard">
      <div class="filters">
        <button (click)="applyMonthlyFilter()">Monthly</button>
        <button (click)="applyQuarterlyFilter()">Quarterly</button>
        <button (click)="clearFilters()">Clear</button>
      </div>
      <div class="widgets">
        <!-- Widget components -->
      </div>
    </div>
  `
})
export class SalesDashboardComponent 
  extends AbstractDashboardContainer 
  implements OnInit, OnDestroy {
  
  private widgets: ID3Widget[] = [];

  constructor(@Optional() router?: Router) {
    super(router);
  }

  ngOnInit(): void {
    this.initializeDashboard();
    this.subscribeToFilters();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  initializeDashboard(): void {
    this.widgets = [
      // Initialize with default widgets
    ];
  }

  getWidgets(): ID3Widget[] {
    return this.widgets;
  }

  addWidget(widget: ID3Widget): void {
    this.widgets.push(widget);
    this.onWidgetInit(widget);
  }

  removeWidget(widgetId: string): void {
    const index = this.widgets.findIndex(w => w.id === widgetId);
    if (index !== -1) {
      this.onWidgetDestroy(widgetId);
      this.widgets.splice(index, 1);
    }
  }

  updateWidget(widget: ID3Widget): void {
    const index = this.widgets.findIndex(w => w.id === widget.id);
    if (index !== -1) {
      this.widgets[index] = widget;
      this.onWidgetUpdate(widget);
    }
  }

  protected override onWidgetInit(widget: ID3Widget): void {
    console.log('Sales widget initialized:', widget.id);
    // Load widget data, etc.
  }

  protected override onWidgetUpdate(widget: ID3Widget): void {
    console.log('Sales widget updated:', widget.id);
    // Refresh widget data
  }

  protected override onWidgetDestroy(widgetId: string): void {
    console.log('Sales widget destroyed:', widgetId);
    // Cleanup
  }

  applyMonthlyFilter(): void {
    this.addFilter({
      key: 'period',
      value: 'monthly',
      operator: 'equals'
    });
  }

  applyQuarterlyFilter(): void {
    this.addFilter({
      key: 'period',
      value: 'quarterly',
      operator: 'equals'
    });
  }

  private subscribeToFilters(): void {
    this.getFilters$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(filters => {
        this.updateWidgetsWithFilters(filters);
      });
  }

  private updateWidgetsWithFilters(filters: IFilterValues[]): void {
    this.widgets.forEach(widget => {
      this.updateWidget({
        ...widget,
        filters: filters
      });
    });
  }
}
```

## Best Practices

1. **Always call `cleanup()`**: Call `cleanup()` in your `ngOnDestroy` to prevent memory leaks
2. **Implement all abstract methods**: All abstract methods must be implemented
3. **Use lifecycle hooks**: Override lifecycle hooks for custom widget management
4. **Handle errors**: Wrap operations in try-catch blocks
5. **Unsubscribe properly**: Use `takeUntil` pattern for subscriptions
6. **Validate inputs**: Validate widget and filter inputs before operations
7. **Document custom methods**: Add JSDoc comments to your custom methods

## Common Pitfalls

1. **Forgetting to call cleanup()**: This causes memory leaks
2. **Not implementing abstract methods**: TypeScript will error, but be thorough
3. **Not handling Router injection**: Use `@Optional()` decorator
4. **Not unsubscribing from filters$**: Use `takeUntil` pattern
5. **Modifying filter array directly**: Always use provided methods (addFilter, removeFilter, etc.)

## Next Steps

- Review the [data-model.md](./data-model.md) for entity definitions
- Check the [API contract](./contracts/class-api-contract.json) for method signatures
- See the [spec.md](./spec.md) for detailed requirements

