# Component API Contract: Widget Header Component

**Feature**: 007-widget-header  
**Date**: 2025-01-27  
**Version**: 1.0.0

## Component Overview

**Name**: `WidgetHeaderComponent`  
**Selector**: `lib-widget-header`  
**Path**: `projects/d3-dashboards/src/lib/components/widget-header/widget-header.component.ts`  
**Type**: Angular Standalone Component  
**Change Detection**: OnPush

## Inputs

### `widget` (required)

- **Type**: `ID3Widget`
- **Description**: Widget configuration and metadata
- **Validation**: 
  - Must be non-null
  - `widget.id` must be valid UUID
  - `widget.title` can be empty (shows default "Untitled Widget")
  - `widget.type` must be one of 14 supported widget types

### `isEditMode` (optional)

- **Type**: `boolean`
- **Default**: `false`
- **Description**: Whether the widget is in edit mode (controls action menu visibility)
- **Behavior**: 
  - When `true`: All actions (edit, delete, refresh, export) are visible
  - When `false`: Only refresh and export actions are visible

### `filters` (optional)

- **Type**: `IFilterValues[]`
- **Default**: `[]`
- **Description**: Active filters applied to the widget
- **Constraints**: 
  - Maximum 10 filters supported
  - Maximum 5 filters shown inline (remaining in tooltip)
- **Structure**:
  ```typescript
  interface IFilterValues {
    key: string;
    value: any;
    operator?: 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'between';
  }
  ```

### `loading` (optional)

- **Type**: `boolean`
- **Default**: `false`
- **Description**: Whether the widget is currently loading data
- **Behavior**: 
  - When `true`: Shows loading spinner
  - When `false` and `error === null`: No loading indicator
  - Error takes precedence over loading

### `error` (optional)

- **Type**: `string | null`
- **Default**: `null`
- **Description**: Error message if the widget encountered an error
- **Behavior**: 
  - When non-null: Shows error indicator (takes precedence over loading)
  - When null: No error indicator shown

## Outputs

### `widgetAction`

- **Type**: `EventEmitter<IWidgetActionEvent>`
- **Description**: Emitted when a widget action is triggered
- **Event Structure**:
  ```typescript
  interface IWidgetActionEvent {
    action: 'edit' | 'delete' | 'refresh' | 'export' | 'configure';
    widgetId: string; // UUID matching widget.id
    payload?: any; // Optional action-specific data
  }
  ```
- **Actions**:
  - `edit`: Opens widget configuration panel
  - `delete`: Triggers widget deletion (parent should show confirmation)
  - `refresh`: Reloads widget data
  - `export`: Exports widget data (payload may contain format)
  - `configure`: Opens advanced configuration (if different from edit)

### `filterRemove`

- **Type**: `EventEmitter<string>`
- **Description**: Emitted when a filter indicator is clicked to remove the filter
- **Event Value**: The filter key (string) to remove
- **Behavior**: Parent component should remove the filter from the filters array

## Usage Example

```typescript
import { WidgetHeaderComponent } from '@d3-dashboards/widget-header';
import { ID3Widget } from '@d3-dashboards/entities';
import { IFilterValues } from '@d3-dashboards/entities';

@Component({
  selector: 'app-widget',
  template: `
    <lib-widget-header
      [widget]="widget"
      [isEditMode]="isEditMode"
      [filters]="filters"
      [loading]="loading"
      [error]="error"
      (widgetAction)="onWidgetAction($event)"
      (filterRemove)="onFilterRemove($event)">
    </lib-widget-header>
  `,
  imports: [WidgetHeaderComponent]
})
export class WidgetComponent {
  widget: ID3Widget = { /* ... */ };
  isEditMode = false;
  filters: IFilterValues[] = [];
  loading = false;
  error: string | null = null;

  onWidgetAction(event: IWidgetActionEvent): void {
    switch (event.action) {
      case 'edit':
        this.openConfigPanel();
        break;
      case 'delete':
        this.confirmDelete(event.widgetId);
        break;
      case 'refresh':
        this.refreshData();
        break;
      case 'export':
        this.exportData(event.payload);
        break;
    }
  }

  onFilterRemove(filterKey: string): void {
    this.filters = this.filters.filter(f => f.key !== filterKey);
  }
}
```

## Template Example

```html
<lib-widget-header
  [widget]="widget"
  [isEditMode]="editMode"
  [filters]="activeFilters"
  [loading]="isLoading"
  [error]="errorMessage"
  (widgetAction)="handleAction($event)"
  (filterRemove)="removeFilter($event)">
</lib-widget-header>
```

## Performance Requirements

- **Render Time**: Header must render within 50ms of widget data being available (SC-001)
- **Menu Open Time**: Action menu must open within 100ms of trigger (SC-002)
- **Filter Update Time**: Filter indicators must update within 200ms of filter changes (SC-003)
- **Loading Indicator Time**: Loading indicators must appear within 50ms of loading state initiation (SC-004)
- **Rapid State Changes**: Must maintain performance with 10+ state changes per second (SC-010)

## Accessibility Requirements

- All interactive elements must have ARIA labels (FR-010)
- Action menu must support keyboard navigation
- Filter indicators must be keyboard accessible
- State changes must be announced to screen readers via ARIA live regions
- All touch targets must be minimum 44x44px

## Responsive Behavior

- **Mobile (320px - 767px)**: Full-width menu, scrollable filter indicators, larger touch targets
- **Tablet (768px - 1023px)**: Standard menu, visible filter indicators (max 3)
- **Desktop (1024px+)**: Standard menu, visible filter indicators (max 5)
- **4K (3840px+)**: Standard menu, all filter indicators visible

## Constraints

- **Title Length**: Must handle titles up to 200 characters with truncation (SC-007)
- **Filter Count**: Must display correctly for up to 10 active filters (SC-009)
- **Visible Filters**: Maximum 5 filter indicators shown inline (remaining in tooltip)

## Dependencies

### External
- `@angular/core`: ^20.2.0
- `@angular/common`: ^20.2.0
- `primeng/menu`: ^20.0.0
- `primeng/badge`: ^20.0.0
- `primeng/tooltip`: ^20.0.0
- `primeng/progressspinner`: ^20.0.0
- `primeng/message`: ^20.0.0

### Internal
- `ID3Widget` from `entities/widget.interface.ts`
- `IFilterValues` from `entities/filter.interface.ts`
- `IWidgetActionEvent` from `entities/widget-action-event.interface.ts`

## Error Handling

- If `widget` is null/undefined: Component should not render (parent responsibility)
- If `widget.id` is invalid: Component still renders but may cause issues in parent
- If `filters` contains invalid data: Component filters out invalid entries
- Menu positioning errors: Falls back to default position
- Filter indicator rendering errors: Skips problematic indicators, shows rest

## Testing Requirements

- Unit tests must achieve minimum 80% code coverage
- Tests must cover all input combinations
- Tests must verify all output events are emitted correctly
- Tests must verify accessibility attributes
- Tests must verify responsive behavior
- Tests must verify performance requirements

