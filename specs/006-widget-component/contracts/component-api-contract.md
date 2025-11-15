# Component API Contract: WidgetComponent

**Version**: 1.0.0  
**Date**: 2025-01-27  
**Component**: `WidgetComponent`  
**Path**: `projects/d3-dashboards/src/lib/components/widget/widget.component.ts`

## Overview

The `WidgetComponent` is a dynamic component loader that renders appropriate child components based on widget type. It provides a unified interface for displaying widgets with headers, action menus, configuration panels, and proper handling of loading, error, and empty states.

## Component Declaration

```typescript
@Component({
  selector: 'lib-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
  standalone: true,
  imports: [/* dynamic imports */],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetComponent implements OnInit, OnChanges, OnDestroy
```

## Inputs

### `widget: ID3Widget` (required)

Widget configuration and metadata.

**Type**: `ID3Widget`

**Properties**:
- `id: string` - Unique widget identifier (UUID format preferred)
- `type: WidgetType` - Widget type determining which component to load
- `title: string` - Widget title displayed in header
- `config: ID3WidgetConfig` - Type-specific configuration
- `dataSource?: IDataSource` - Optional data source configuration
- `filters?: IFilterValues[]` - Optional widget-specific filters
- `style?: IWidgetStyle` - Optional styling configuration
- `position: GridsterItem` - Widget position in grid

**Validation**: Component validates required fields before rendering (FR-011).

---

### `isEditMode: boolean` (optional, default: `false`)

Whether the widget is in edit mode. Controls visibility of action menu items.

**Type**: `boolean`

**Default**: `false`

**Behavior**: When `true`, action menu items (edit, delete, refresh, export, configure) are visible. When `false`, actions are hidden or limited.

---

### `filters: IFilterValues[]` (optional, default: `[]`)

Merged filters (dashboard + widget filters) to apply to widget data.

**Type**: `IFilterValues[]`

**Default**: `[]`

**Usage**: Filters are passed to the loaded child component and used when fetching data from data sources.

---

## Outputs

### `widgetUpdate: EventEmitter<ID3Widget>`

Emitted when widget configuration is updated.

**Type**: `EventEmitter<ID3Widget>`

**When Emitted**: Configuration panel saves changes (FR-008)

**Payload**: Updated widget object with new configuration

**Usage**:
```typescript
@Output() widgetUpdate = new EventEmitter<ID3Widget>();

// Emit update
this.widgetUpdate.emit({ ...this.widget, config: newConfig });
```

---

### `widgetDelete: EventEmitter<string>`

Emitted when widget delete action is triggered.

**Type**: `EventEmitter<string>`

**When Emitted**: Delete action is clicked in widget header (FR-009)

**Payload**: Widget ID

**Usage**:
```typescript
@Output() widgetDelete = new EventEmitter<string>();

// Emit delete
this.widgetDelete.emit(this.widget.id);
```

---

### `widgetAction: EventEmitter<WidgetActionEvent>`

Emitted when any widget action is triggered.

**Type**: `EventEmitter<WidgetActionEvent>`

**When Emitted**: Any action button is clicked in widget header

**Payload**: Action event object with action type, widget ID, and optional payload

**Usage**:
```typescript
interface WidgetActionEvent {
  action: 'edit' | 'delete' | 'refresh' | 'export' | 'configure';
  widgetId: string;
  payload?: any;
}
```

---

### `dataLoad: EventEmitter<any>`

Emitted when widget data is successfully loaded.

**Type**: `EventEmitter<any>`

**When Emitted**: Data loading completes successfully

**Payload**: Loaded data

**Usage**: For parent components to monitor widget data loading.

---

## Public Methods

### `refresh(): void`

Manually triggers a data refresh for the widget.

**Returns**: `void`

**Description**: Resets loading state and reloads data from dataSource.

**Usage**: Called when refresh action is triggered or programmatically.

**Example**:
```typescript
widgetComponent.refresh();
```

---

### `openConfiguration(): void`

Opens the configuration panel for the widget.

**Returns**: `void`

**Description**: Opens PrimeNG Dialog with configuration form. Only available in edit mode.

**Usage**: Called when configure action is triggered.

**Example**:
```typescript
if (this.isEditMode) {
  this.openConfiguration();
}
```

---

### `getState(): Observable<WidgetState>`

Returns an observable of the widget's current state.

**Returns**: `Observable<WidgetState>`

**Description**: Provides reactive access to widget state (loading, error, data) for parent components.

**Usage**: For parent components to monitor widget state.

**Example**:
```typescript
this.widgetComponent.getState().subscribe(state => {
  console.log('Widget state:', state);
});
```

---

## Lifecycle Hooks

### `ngOnInit()`

**Purpose**: Validates widget, initializes state, loads component, loads data

**Flow**:
1. Validate widget configuration
2. Initialize widget state (loading: true)
3. Load dynamic component based on widget.type
4. If component loads successfully, load data from dataSource
5. Update state based on results

---

### `ngOnChanges(changes: SimpleChanges)`

**Purpose**: Handles widget input changes, reloads component/data if type changes

**Flow**:
1. Check if widget.type changed → reload component
2. Check if widget.dataSource changed → reload data
3. Check if widget.config changed → update component inputs
4. Check if filters changed → update component inputs

---

### `ngOnDestroy()`

**Purpose**: Cleans up component references, unsubscribes from observables, removes event listeners

**Flow**:
1. Unsubscribe from all observables
2. Destroy loaded component reference
3. Clear timers and intervals
4. Remove event listeners
5. Complete subjects

**Requirement**: Must clean up all resources to prevent memory leaks (FR-013).

---

## Component States

### Loading State

**Condition**: `loading === true`

**UI**: Loading spinner with message

**Description**: Widget is loading component or data.

---

### Error State

**Condition**: `error !== null`

**UI**: Error icon, message, retry button

**Description**: Widget encountered an error during component loading or data loading.

**Actions**: Retry button allows user to retry the failed operation.

---

### Empty State

**Condition**: `data === null || data === []`

**UI**: Empty state icon and message

**Description**: Widget has no data to display.

---

### Loaded State

**Condition**: `loading === false && error === null && data !== null`

**UI**: Widget header + dynamic component content

**Description**: Widget is successfully loaded and displaying content.

---

## Dependencies

### Services

- **DataService**: Loads widget data from dataSource
  - Path: `projects/d3-dashboards/src/lib/services/data.service.ts`
  - Usage: Called when widget has a dataSource configured

### Utilities

- **WidgetLoaderUtil**: Provides component registry and dynamic loading functionality
  - Path: `projects/d3-dashboards/src/lib/utils/widget-loader.util.ts`
  - Usage: Maps widget types to component classes and handles dynamic loading

### Entities

- **ID3Widget**: Widget interface
- **IDataSource**: Data source interface
- **ID3WidgetConfig**: Widget configuration interface
- **IFilterValues**: Filter values interface

---

## Performance Targets

- Component load: 200ms (SC-001)
- Loading indicator: 100ms (SC-003)
- Error display: 500ms (SC-004)
- Config panel open: 150ms (SC-005)
- Update event emit: 100ms (SC-006)

## Error Handling

### Component Load Failure

**Scenario**: Widget type component fails to load or doesn't exist

**Handling**:
- Set error state: `error: "Widget type '${type}' is not supported"`
- Display error UI with retry option
- Log error to console with context

---

### Data Load Failure

**Scenario**: Data source fails to load data

**Handling**:
- Set error state: `error: "Failed to load data: ${errorMessage}"`
- Display error UI with retry option
- Keep component loaded (don't unload component)

---

### Invalid Configuration

**Scenario**: Widget configuration is invalid or missing required fields

**Handling**:
- Prevent component rendering
- Set error state: `error: "Invalid widget configuration"`
- Display error UI
- Log validation errors to console

---

## Testing Requirements

- Minimum 80% code coverage
- Framework: Jest ^29.7.0, jest-preset-angular ^14.6.1

**Test Cases**:
1. Component loads correct child component based on widget type
2. Component handles invalid widget types gracefully
3. Component displays loading state during data fetch
4. Component displays error state on data load failure
5. Component displays empty state when no data
6. Component emits widgetUpdate event on configuration save
7. Component emits widgetDelete event on delete action
8. Component cleans up resources on destroy
9. Component validates widget configuration before rendering
10. Component handles rapid type changes correctly

---

## Accessibility

- All interactive elements have ARIA labels
- Configuration panel is keyboard accessible
- Loading and error states are announced to screen readers
- Proper focus management when opening/closing configuration panel

