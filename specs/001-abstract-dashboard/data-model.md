# Data Model: Abstract Dashboard Container

**Feature**: 001-abstract-dashboard  
**Date**: 2025-01-27  
**Status**: Complete

## Overview

This document defines the data model for the Abstract Dashboard Container feature. The model includes the abstract class structure, related interfaces, and the relationships between entities.

## Core Entities

### AbstractDashboardContainer

**Type**: Abstract Class  
**Location**: `projects/d3-dashboards/src/lib/abstract/abstract-dashboard-container.ts`  
**Description**: Base class providing common functionality for dashboard implementations.

**Properties**:

#### Protected Properties

- `protected filters$: BehaviorSubject<IFilterValues[]>` - Observable stream of current filter values
- `protected destroy$: Subject<void>` - Subject for managing subscription cleanup (takeUntil pattern)
- `protected router?: Router` - Optional Angular Router instance for navigation helpers

#### Public Properties

- None (abstract class uses methods, not public properties)

**Methods**:

#### Abstract Methods (Must be implemented by derived classes)

- `abstract initializeDashboard(): void | Promise<void>` - Initialize the dashboard
- `abstract getWidgets(): ID3Widget[]` - Get current widgets in the dashboard
- `abstract addWidget(widget: ID3Widget): void` - Add a widget to the dashboard
- `abstract removeWidget(widgetId: string): void` - Remove a widget from the dashboard
- `abstract updateWidget(widget: ID3Widget): void` - Update an existing widget

#### Public Methods (Common functionality)

**Filter Management**:
- `addFilter(filter: IFilterValues): void` - Add a filter to the dashboard
- `removeFilter(filterKey: string): void` - Remove a filter by key
- `updateFilter(filter: IFilterValues): void` - Update an existing filter
- `getFilters(): IFilterValues[]` - Get current filter values
- `getFilters$(): Observable<IFilterValues[]>` - Get observable stream of filters
- `clearFilters(): void` - Clear all filters

**Widget Lifecycle Hooks** (Protected, can be overridden):
- `protected onWidgetInit(widget: ID3Widget): void` - Called when widget is initialized
- `protected onWidgetUpdate(widget: ID3Widget): void` - Called when widget is updated
- `protected onWidgetDestroy(widgetId: string): void` - Called when widget is destroyed

**Navigation Helpers**:
- `navigateToDashboard(dashboardId: string, params?: Record<string, any>): Promise<boolean>` - Navigate to another dashboard
- `getCurrentDashboard(): IDashboardNavigationInfo | null` - Get current dashboard information
- `canNavigate(): boolean` - Check if navigation is available

**Utility Methods**:
- `validateFilter(filter: IFilterValues): boolean` - Validate filter before adding/updating
- `cleanup(): void` - Clean up resources and subscriptions

**Validation Rules**:
- Filter key must be non-empty string
- Filter value must be defined (not undefined)
- Widget ID must be unique
- All abstract methods must be implemented by derived classes

**State Transitions**:
- Dashboard initialization: `uninitialized` → `initializing` → `initialized`
- Widget lifecycle: `notAdded` → `adding` → `added` → `updating` → `removing` → `removed`
- Filter lifecycle: `notAdded` → `adding` → `added` → `updating` → `removing` → `removed`

## Related Interfaces

### IDashboardNavigationInfo

**Type**: Interface  
**Location**: `projects/d3-dashboards/src/lib/entities/dashboard.interface.ts`  
**Description**: Information about current dashboard navigation state.

**Properties**:
- `dashboardId: string` - Current dashboard identifier
- `route: string` - Current route path
- `params: Record<string, any>` - Route parameters
- `queryParams: Record<string, any>` - Query parameters

**Validation Rules**:
- dashboardId must be non-empty string
- route must be valid route path

### IFilterValues (Existing)

**Type**: Interface  
**Location**: `projects/d3-dashboards/src/lib/entities/filter.interface.ts` (to be created or existing)  
**Description**: Filter value definition.

**Properties**:
- `key: string` - Filter key/field name
- `value: any` - Filter value
- `operator?: 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'between'` - Optional operator

**Validation Rules**:
- key must be non-empty string
- value must be defined
- operator must be one of the allowed values if provided

### ID3Widget (Existing)

**Type**: Interface  
**Location**: `projects/d3-dashboards/src/lib/entities/widget.interface.ts` (to be created or existing)  
**Description**: Widget definition.

**Properties**:
- `id: string` - Unique widget identifier
- `type: string` - Widget type
- `position: GridsterItem` - Widget position in grid
- `title: string` - Widget title
- `config: ID3WidgetConfig` - Widget configuration
- `dataSource?: IDataSource` - Optional data source
- `filters?: IFilterValues[]` - Optional filters
- `style?: IWidgetStyle` - Optional styling

**Validation Rules**:
- id must be unique UUID
- type must be valid widget type
- title must be non-empty string

## Relationships

### AbstractDashboardContainer → ID3Widget
- **Type**: One-to-Many
- **Description**: A dashboard container manages multiple widgets
- **Cardinality**: 1 dashboard : N widgets (0 to 50 widgets)

### AbstractDashboardContainer → IFilterValues
- **Type**: One-to-Many
- **Description**: A dashboard container manages multiple filters
- **Cardinality**: 1 dashboard : N filters (0 to unlimited filters)

### AbstractDashboardContainer → Router (Optional)
- **Type**: Dependency (Optional)
- **Description**: Dashboard may use Angular Router for navigation
- **Cardinality**: 0..1 router per dashboard

## Data Flow

### Filter Management Flow

```
User Action → addFilter/updateFilter/removeFilter
  → Validate Filter
  → Update BehaviorSubject
  → Debounce (300ms)
  → Emit to subscribers
  → Widgets receive filter updates
  → Widgets update their data/display
```

### Widget Lifecycle Flow

```
addWidget(widget)
  → Validate Widget
  → Call onWidgetInit(widget)
  → Add to dashboard
  → Emit widget change event

updateWidget(widget)
  → Validate Widget
  → Call onWidgetUpdate(widget)
  → Update in dashboard
  → Emit widget change event

removeWidget(widgetId)
  → Call onWidgetDestroy(widgetId)
  → Remove from dashboard
  → Clean up resources
  → Emit widget change event
```

### Navigation Flow

```
navigateToDashboard(dashboardId, params)
  → Check canNavigate()
  → If Router available: router.navigate([route], { queryParams })
  → If Router not available: return false
  → Handle navigation errors
```

## State Management

### Filter State
- **Storage**: BehaviorSubject<IFilterValues[]>
- **Initial State**: Empty array []
- **Updates**: Immutable updates (create new array)
- **Persistence**: In-memory only (no persistence in this feature)

### Widget State
- **Storage**: Managed by derived class (abstract method)
- **Initial State**: Empty array []
- **Updates**: Managed by derived class
- **Persistence**: Managed by derived class

## Error Handling

### Filter Errors
- Invalid filter key: Log error, return false, don't add filter
- Invalid filter value: Log error, return false, don't add filter
- Duplicate filter key: Update existing filter instead of adding duplicate

### Widget Errors
- Invalid widget: Log error, don't add/update widget
- Widget not found (for update/remove): Log error, return false
- Lifecycle hook errors: Log error, continue execution (don't block operation)

### Navigation Errors
- Router not available: Return false, log warning
- Navigation failure: Catch error, log error, return false
- Invalid route: Validate before navigation, return false if invalid

## Performance Considerations

- Filter updates debounced to 300ms to prevent excessive widget updates
- Observable subscriptions use takeUntil pattern for automatic cleanup
- Widget operations should complete within 100ms (common methods)
- Filter operations should complete within 200ms
- Support up to 50 widgets without performance degradation

## Memory Management

- All subscriptions cleaned up in `cleanup()` method
- Use `destroy$` Subject with `takeUntil` pattern
- Lifecycle hooks should not create subscriptions without cleanup
- Derived classes must call `cleanup()` in their destroy lifecycle

