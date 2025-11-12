# Research: Dashboard Container Component

**Feature**: 001-dashboard-container  
**Date**: 2025-01-27  
**Status**: Complete

## Research Summary

This document consolidates research findings and technical decisions for implementing the Dashboard Container Component using angular-gridster2 for grid layout, responsive design, and filter propagation. All technical choices align with the constitution requirements and Angular v20 best practices. Note: Edit mode, drag-and-drop, resizing, widget management, print, and export functionality are out of scope for this version.

## Technical Decisions

### Decision 1: Grid Layout Library - angular-gridster2

**Decision**: Use angular-gridster2 ^20.0.0 for grid-based layout with static widget positioning and responsive capabilities.

**Rationale**:
- angular-gridster2 is the standard Angular library for grid layouts
- Version ^20.0.0 is compatible with Angular v20.2.0
- Provides built-in support for responsive layouts
- Supports static widget positioning based on configuration
- Well-maintained and widely used in Angular dashboard applications
- Matches constitution requirement for UI library standards
- Provides GridsterConfig interface for type-safe configuration
- Can be configured for read-only mode (no drag-and-drop)

**Alternatives Considered**:
- Custom grid implementation: Rejected due to complexity and maintenance overhead
- CSS Grid: Rejected as angular-gridster2 provides better responsive breakpoint management
- Other grid libraries (ag-grid, ngx-gridster): Rejected as angular-gridster2 is the standard for Angular dashboards

**Implementation Notes**:
- Use `GridsterModule` from 'angular-gridster2'
- Configure `GridsterConfig` with 12-column grid system
- Use `GridsterItem` interface for widget positions
- Set `draggable: false` and `resizable: false` in gridster config (read-only mode)
- Configure responsive breakpoints for mobile, tablet, desktop

### Decision 2: Filter Propagation Pattern

**Decision**: Use RxJS Subject/BehaviorSubject in component for filter propagation to child widgets via inputs.

**Rationale**:
- Filters flow from parent (dashboard container) to children (widgets)
- RxJS provides reactive pattern for filter updates
- Debouncing can be implemented using RxJS operators (debounceTime)
- Aligns with constitution requirement for reactive programming
- Enables efficient propagation to multiple widgets

**Alternatives Considered**:
- Service-based filter management: Could be used for global filters, but component-level is sufficient for dashboard-scoped filters
- Event-based propagation: Rejected as inputs provide better type safety and Angular change detection integration

**Implementation Notes**:
- `filterValues` input accepts `IFilterValues[]`
- Debounce filter updates using `debounceTime(300)` operator
- Pass filtered values to each widget via `@Input() filters`
- Emit `filterChange` output when filters are updated
- If widget cannot apply filter (invalid or incompatible), widget shows unfiltered data and logs warning to console

### Decision 3: Widget Array Management

**Decision**: Manage widget array as component input (read-only), no local editing copy needed.

**Rationale**:
- Widgets array comes from parent component
- No editing capabilities in this version, so no need for local copy
- Follows unidirectional data flow pattern (parent to child)
- Simpler implementation without edit state management

**Alternatives Considered**:
- Local copy for editing: Rejected as edit functionality is out of scope
- Service-based widget management: Rejected as component-level input is sufficient for read-only display

**Implementation Notes**:
- Accept `widgets: ID3Widget[]` as input
- Use input directly (no local copy needed)
- Emit `widgetSelect` output when widget is selected (click event)
- Validate and auto-correct widget positions on input changes

### Decision 4: Invalid Widget Position Handling

**Decision**: Auto-correct invalid widget positions to nearest valid position.

**Rationale**:
- Prevents layout breaking with invalid positions
- Provides graceful degradation
- Ensures all widgets are visible
- Better user experience than skipping widgets

**Alternatives Considered**:
- Skip invalid widgets: Rejected as it hides data from users
- Show error state: Rejected as auto-correction provides better UX
- Render at (0,0): Rejected as it may cause overlap

**Implementation Notes**:
- Validate widget positions on input changes
- Check if position is within grid boundaries
- Auto-correct to nearest valid position if invalid
- Log correction to console for debugging

### Decision 5: Filter Propagation Failure Handling

**Decision**: When widget cannot apply filter, show unfiltered data and log warning.

**Rationale**:
- Keeps dashboard functional even with incompatible filters
- Provides debugging information via console
- Better UX than showing error state
- Allows partial filtering (some widgets filtered, others not)

**Alternatives Considered**:
- Show error state: Rejected as it breaks dashboard functionality
- Ignore silently: Rejected as developers need visibility into failures
- Show loading indefinitely: Rejected as it creates poor UX

**Implementation Notes**:
- Widget components handle filter application
- If filter cannot be applied, widget shows unfiltered data
- Log warning to console with widget ID and filter details
- Continue normal operation without breaking dashboard

### Decision 6: Responsive Grid Configuration

**Decision**: Configure angular-gridster2 with responsive breakpoints for mobile, tablet, desktop.

**Rationale**:
- angular-gridster2 supports responsive configurations
- Matches success criteria requirement for mobile (320px+), tablet (768px+), desktop (1024px+)
- Provides automatic layout adaptation
- Maintains widget proportions where possible

**Alternatives Considered**:
- Single fixed grid: Rejected as it doesn't meet responsive requirements
- Custom responsive logic: Rejected as angular-gridster2 provides built-in support

**Implementation Notes**:
- Configure `GridsterConfig` with responsive breakpoints
- Adjust column count based on screen size (12 columns desktop, 8 tablet, 4 mobile)
- Maintain widget aspect ratios where possible
- Test on multiple viewport sizes

### Decision 7: Widget Loading and Error States

**Decision**: Handle widget loading and error states at widget component level, container provides error boundaries.

**Rationale**:
- Widget components are responsible for their own data loading
- Container component provides error boundaries for graceful degradation
- Aligns with component responsibility separation
- Enables individual widget error handling without affecting entire dashboard

**Alternatives Considered**:
- Container-level data loading: Rejected as it couples container to widget data sources
- Global error handler: Could be used for critical errors, but component-level is sufficient

**Implementation Notes**:
- Widget components handle their own loading states
- Container component catches errors and displays error state for invalid widgets
- Skip rendering invalid widgets or show error placeholder
- Log errors for debugging

### Decision 8: Change Detection Strategy

**Decision**: Use OnPush change detection strategy for performance optimization.

**Rationale**:
- Matches constitution requirement for OnPush strategy
- Improves performance with many widgets
- Reduces unnecessary change detection cycles
- Aligns with Angular best practices for dashboard components

**Alternatives Considered**:
- Default change detection: Rejected as it doesn't meet performance requirements
- Manual change detection: Rejected as OnPush provides better balance of performance and simplicity

**Implementation Notes**:
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in component decorator
- Ensure all inputs are immutable or use proper change detection triggers
- Use `ChangeDetectorRef.markForCheck()` when needed for programmatic updates

## Integration Patterns

### angular-gridster2 Integration

```typescript
// Component imports
import { GridsterModule } from 'angular-gridster2';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';

// Template usage
<gridster [options]="gridsterOptions" [itemChangeCallback]="onItemChange">
  <gridster-item *ngFor="let widget of widgets" [item]="widget.position">
    <lib-widget [widget]="widget" [isEditMode]="isEditMode" [filters]="filterValues">
    </lib-widget>
  </gridster-item>
</gridster>
```

### Filter Propagation Pattern

```typescript
// Component implementation
private filterSubject = new BehaviorSubject<IFilterValues[]>([]);
public filterValues$ = this.filterSubject.asObservable().pipe(
  debounceTime(300)
);

@Input() set filterValues(values: IFilterValues[]) {
  this.filterSubject.next(values);
}
```

### Widget Position Validation Pattern

```typescript
// Component implementation
@Input() set widgets(value: ID3Widget[]) {
  // Validate and auto-correct positions
  this._widgets = value.map(widget => ({
    ...widget,
    position: this.validatePosition(widget.position)
  }));
}

private validatePosition(position: IWidgetPosition): IWidgetPosition {
  // Auto-correct to nearest valid position if invalid
  const corrected = { ...position };
  if (corrected.x < 0) corrected.x = 0;
  if (corrected.y < 0) corrected.y = 0;
  if (corrected.cols < 1) corrected.cols = 1;
  if (corrected.rows < 1) corrected.rows = 1;
  if (corrected.x + corrected.cols > this.gridConfig.columns) {
    corrected.x = Math.max(0, this.gridConfig.columns - corrected.cols);
  }
  return corrected;
}
```

## Performance Considerations

1. **Debouncing**: Filter updates debounced to 300ms to prevent excessive data fetching
2. **Change Detection**: OnPush strategy reduces change detection cycles
3. **Widget Rendering**: Lazy loading of widget components if needed
4. **Grid Updates**: Batch grid updates to prevent multiple re-renders
5. **Memory Management**: Proper cleanup of subscriptions and event listeners

## Testing Strategy

1. **Unit Tests**: Test component logic, filter propagation, position validation
2. **Integration Tests**: Test gridster integration, responsive layout
3. **Performance Tests**: Verify performance goals (render time, filter propagation, layout adaptation)
4. **Responsive Tests**: Test layout adaptation on different screen sizes
5. **Edge Case Tests**: Test empty widgets, invalid data, invalid positions, filter failures

## Dependencies

- **angular-gridster2**: ^20.0.0 (grid layout, responsive breakpoints)
- **RxJS**: ~7.8.0 (reactive programming, debouncing)
- **TypeScript**: ~5.8.0 (type safety)
- **Angular Core**: v20.2.0 (component framework)

## References

- [angular-gridster2 Documentation](https://github.com/tiberiuzuld/angular-gridster2)
- [Angular v20 Standalone Components](https://angular.io/guide/standalone-components)
- [RxJS Operators](https://rxjs.dev/guide/operators)
- [Angular Change Detection](https://angular.io/guide/change-detection)

