# Research: Widget Component

**Feature**: 006-widget-component  
**Date**: 2025-01-27  
**Status**: Complete

## Research Questions

### 1. Dynamic Component Loading in Angular 20

**Question**: How to implement dynamic component loading in Angular 20 standalone components?

**Research Findings**:
- Angular 20 uses `ViewContainerRef.createComponent()` for dynamic component loading
- The deprecated `ComponentFactoryResolver` is no longer needed
- For standalone components, we need to import components directly or use dynamic imports
- Components must be available at compile time or loaded via lazy loading

**Decision**: Use `ViewContainerRef.createComponent()` with a component registry pattern. Create a utility service that maps widget types to component classes/types.

**Rationale**: 
- Modern Angular approach (Angular 20 compatible)
- Type-safe component loading
- Supports both eager and lazy loading strategies
- Aligns with standalone component architecture

**Alternatives Considered**:
- ComponentFactoryResolver: Deprecated in Angular 20
- ngComponentOutlet: Less flexible, requires template changes
- Direct template conditionals: Not scalable for 14+ widget types

**Implementation Pattern**:
```typescript
// Component registry pattern
const WIDGET_COMPONENT_REGISTRY = new Map<string, Type<any>>([
  ['line', LineChartComponent],
  ['bar', BarChartComponent],
  // ... etc
]);

// Usage in widget component
const componentType = WIDGET_COMPONENT_REGISTRY.get(widget.type);
if (componentType) {
  const componentRef = this.viewContainerRef.createComponent(componentType);
  // Set inputs, subscribe to outputs
}
```

---

### 2. Lazy Loading Strategy for Chart Components

**Question**: How to implement lazy loading for chart components to optimize bundle size?

**Research Findings**:
- Angular 20 supports dynamic imports with `import()` syntax
- Can use `loadComponent()` helper or manual dynamic imports
- Components must be exported as default or named exports
- Lazy loading requires async handling in component initialization

**Decision**: Implement a lazy loading utility that uses dynamic imports with a fallback to eager loading for critical components (line, bar charts).

**Rationale**:
- Reduces initial bundle size
- Improves initial load performance
- Supports progressive loading of optional chart types
- Maintains type safety through proper typing

**Alternatives Considered**:
- Eager loading all components: Increases bundle size unnecessarily
- Route-based lazy loading: Not applicable for component-level loading
- Module-based lazy loading: Not compatible with standalone components

**Implementation Pattern**:
```typescript
// Lazy component loader
async loadWidgetComponent(type: string): Promise<Type<any>> {
  const componentMap: Record<string, () => Promise<any>> = {
    'line': () => import('../charts/line-chart/line-chart.component').then(m => m.LineChartComponent),
    'bar': () => import('../charts/bar-chart/bar-chart.component').then(m => m.BarChartComponent),
    // ... etc
  };
  
  const loader = componentMap[type];
  if (loader) {
    return await loader();
  }
  throw new Error(`Unknown widget type: ${type}`);
}
```

---

### 3. Widget State Management

**Question**: How to manage widget state (loading, error, data) in a reactive way?

**Research Findings**:
- RxJS BehaviorSubject or Signals can be used for state management
- Angular Signals (v20) provide reactive state with change detection optimization
- Observable patterns work well with async data loading
- State should be encapsulated within the widget component

**Decision**: Use RxJS BehaviorSubject for widget state management, with proper cleanup using takeUntil pattern.

**Rationale**:
- Consistent with existing codebase (dashboard-container uses BehaviorSubject)
- Well-established pattern in Angular applications
- Easy to test and reason about
- Supports async operations naturally

**Alternatives Considered**:
- Angular Signals: Newer API, less familiar, may have migration considerations
- Simple boolean flags: Less flexible, harder to extend
- NgRx: Overkill for component-level state

**Implementation Pattern**:
```typescript
private widgetState$ = new BehaviorSubject<WidgetState>({
  loading: false,
  error: null,
  data: null
});

get state$(): Observable<WidgetState> {
  return this.widgetState$.asObservable();
}
```

---

### 4. Configuration Panel Implementation

**Question**: How to implement a configuration panel that works with different widget types?

**Research Findings**:
- PrimeNG Dialog component can be used for modal panels
- Configuration forms should be type-safe and validated
- Need to support different configuration schemas per widget type
- Should support cancel/save actions

**Decision**: Use PrimeNG Dialog with dynamic form generation based on widget type configuration schema. Create a configuration service that provides type-specific form configurations.

**Rationale**:
- PrimeNG is already a project dependency
- Dialog component provides good UX for configuration
- Dynamic forms allow extensibility for new widget types
- Type-safe configuration through interfaces

**Alternatives Considered**:
- Inline configuration: Clutters widget UI
- Side panel: May conflict with dashboard layout
- Separate route: Breaks widget context

**Implementation Pattern**:
```typescript
// Configuration panel component
openConfigurationPanel(): void {
  const ref = this.dialogService.open(WidgetConfigPanelComponent, {
    data: { widget: this.widget, configSchema: this.getConfigSchema() }
  });
  
  ref.onClose.subscribe((result) => {
    if (result) {
      this.widgetUpdate.emit({ ...this.widget, config: result });
    }
  });
}
```

---

### 5. Error Handling and Recovery

**Question**: How to handle component loading failures and data loading errors gracefully?

**Research Findings**:
- Component loading can fail if component is not found or fails to instantiate
- Data loading errors should be caught and displayed to user
- Retry mechanisms can improve user experience
- Error boundaries are not available in Angular (unlike React)

**Decision**: Implement comprehensive error handling with:
- Try-catch blocks around component loading
- Error state display with retry functionality
- Fallback error component for failed loads
- Proper error logging for debugging

**Rationale**:
- Provides good user experience even when errors occur
- Helps with debugging through proper logging
- Retry functionality gives users control
- Aligns with constitution requirements for error handling

**Alternatives Considered**:
- Silent failures: Violates constitution, poor UX
- Throwing errors: Breaks application flow
- Global error handler only: Doesn't provide widget-specific context

**Implementation Pattern**:
```typescript
try {
  const componentType = await this.loadWidgetComponent(widget.type);
  const componentRef = this.viewContainerRef.createComponent(componentType);
  // ... setup component
} catch (error) {
  console.error(`Failed to load widget component: ${widget.type}`, error);
  this.widgetState$.next({
    loading: false,
    error: `Failed to load ${widget.type} widget`,
    data: null
  });
  // Display error component
}
```

---

## Technology Decisions Summary

| Decision | Technology/Pattern | Rationale |
|----------|-------------------|-----------|
| Dynamic Component Loading | `ViewContainerRef.createComponent()` | Modern Angular 20 approach, type-safe |
| Component Registry | Map-based registry | Scalable, type-safe, easy to extend |
| Lazy Loading | Dynamic imports with `import()` | Reduces bundle size, supports async loading |
| State Management | RxJS BehaviorSubject | Consistent with codebase, reactive |
| Configuration Panel | PrimeNG Dialog | Already a dependency, good UX |
| Error Handling | Try-catch with error state | Comprehensive, user-friendly |

## Dependencies and Integration Points

### Existing Dependencies
- `ID3Widget` interface from `entities/widget.interface.ts`
- `IDataSource` interface from `entities/widget.interface.ts`
- `DataService` from `services/data.service.ts` (for data loading)
- `DashboardContainerComponent` (parent component)

### New Dependencies Required
- None (all required dependencies are already in the project)

### Integration Points
- Widget component will be used by `DashboardContainerComponent`
- Will consume data from `DataService` based on widget's `dataSource`
- Will emit events to parent for widget updates and deletions
- Will integrate with widget header component (feature 007) when available

## Performance Considerations

1. **Component Loading**: Lazy loading reduces initial bundle size but adds async complexity
2. **Change Detection**: OnPush strategy minimizes unnecessary checks
3. **Memory Management**: Proper cleanup in ngOnDestroy prevents memory leaks
4. **Rendering**: Virtual scrolling not needed (handled by dashboard container)
5. **State Updates**: Debouncing may be needed for rapid configuration changes

## Security Considerations

1. **Component Loading**: Validate widget types before loading to prevent code injection
2. **Configuration**: Sanitize user input in configuration forms
3. **Data Sources**: Validate data source endpoints and parameters
4. **Error Messages**: Don't expose sensitive information in error messages

## Accessibility Considerations

1. **ARIA Labels**: All interactive elements must have proper ARIA labels
2. **Keyboard Navigation**: Configuration panel must be keyboard accessible
3. **Screen Readers**: Loading and error states must be announced
4. **Focus Management**: Proper focus handling when opening/closing configuration panel

