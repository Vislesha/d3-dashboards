# Research: Dashboard Service Implementation

**Feature**: 004-dashboard-service  
**Date**: 2025-01-27  
**Purpose**: Resolve technical decisions and document implementation patterns

## Research Areas

### 1. Dashboard Persistence Strategy

**Decision**: Use in-memory storage with optional localStorage persistence for browser-based applications

**Rationale**:
- In-memory storage provides fast access (< 300ms load time - SC-002)
- localStorage provides persistence across browser sessions
- Simple key-value storage is sufficient for dashboard configurations
- No backend dependency required for initial implementation
- Can be extended to backend API for production deployments
- Aligns with performance goals (SC-001: < 500ms create, SC-002: < 300ms load)

**Implementation Pattern**:
```typescript
interface IDashboardStorage {
  save(dashboard: IDashboard): Observable<string>;
  load(id: string): Observable<IDashboard | null>;
  list(): Observable<IDashboard[]>;
  delete(id: string): Observable<boolean>;
}

class InMemoryDashboardStorage implements IDashboardStorage {
  private dashboards = new Map<string, IDashboard>();
  
  save(dashboard: IDashboard): Observable<string> {
    const id = dashboard.id || this.generateId();
    this.dashboards.set(id, { ...dashboard, id });
    return of(id);
  }
  
  load(id: string): Observable<IDashboard | null> {
    const dashboard = this.dashboards.get(id) || null;
    return of(dashboard);
  }
  
  list(): Observable<IDashboard[]> {
    return of(Array.from(this.dashboards.values()));
  }
  
  delete(id: string): Observable<boolean> {
    return of(this.dashboards.delete(id));
  }
}

class LocalStorageDashboardStorage implements IDashboardStorage {
  private readonly STORAGE_KEY = 'd3-dashboards';
  
  save(dashboard: IDashboard): Observable<string> {
    const dashboards = this.loadAll();
    const id = dashboard.id || this.generateId();
    dashboards.set(id, { ...dashboard, id });
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(Array.from(dashboards.entries())));
    return of(id);
  }
  
  load(id: string): Observable<IDashboard | null> {
    const dashboards = this.loadAll();
    return of(dashboards.get(id) || null);
  }
  
  list(): Observable<IDashboard[]> {
    return of(Array.from(this.loadAll().values()));
  }
  
  delete(id: string): Observable<boolean> {
    const dashboards = this.loadAll();
    const deleted = dashboards.delete(id);
    if (deleted) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(Array.from(dashboards.entries())));
    }
    return of(deleted);
  }
  
  private loadAll(): Map<string, IDashboard> {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return new Map();
    const entries = JSON.parse(stored) as [string, IDashboard][];
    return new Map(entries);
  }
}
```

**Alternatives Considered**:
- **IndexedDB**: More complex API, overkill for dashboard configurations
- **Backend API only**: Requires backend infrastructure, adds network latency
- **SessionStorage**: Data lost on tab close, not suitable for persistence
- **File system**: Not available in browser environment

### 2. Dashboard State Management Pattern

**Decision**: Use RxJS BehaviorSubject for reactive state management with observable streams

**Rationale**:
- BehaviorSubject provides current state value and observable stream
- Aligns with Angular reactive programming requirements
- Enables state subscriptions across components
- Supports state reset functionality
- Maintains 100% state consistency (SC-007)
- Observable pattern allows for state composition and transformation

**Implementation Pattern**:
```typescript
interface IDashboardState {
  activeDashboardId: string | null;
  editMode: boolean;
  filters: IFilterValues[];
  selectedWidgets: string[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private state$ = new BehaviorSubject<IDashboardState>({
    activeDashboardId: null,
    editMode: false,
    filters: [],
    selectedWidgets: []
  });
  
  getState(): Observable<IDashboardState> {
    return this.state$.asObservable();
  }
  
  getCurrentState(): IDashboardState {
    return this.state$.value;
  }
  
  updateState(updates: Partial<IDashboardState>): void {
    this.state$.next({ ...this.state$.value, ...updates });
  }
  
  resetState(): void {
    this.state$.next({
      activeDashboardId: null,
      editMode: false,
      filters: [],
      selectedWidgets: []
    });
  }
}
```

**Alternatives Considered**:
- **NgRx**: Overkill for dashboard state, adds complexity
- **Angular Signals**: Newer API, BehaviorSubject is more established
- **Simple object**: No reactivity, doesn't support subscriptions
- **State management library**: Unnecessary dependency, RxJS is sufficient

### 3. Widget Management Pattern

**Decision**: Use immutable update pattern with validation and persistence

**Rationale**:
- Immutable updates prevent state corruption
- Validation ensures widget integrity (SC-009: 100% validation)
- Automatic persistence maintains consistency
- Fast operations (< 200ms - SC-004)
- Supports concurrent modifications through optimistic locking

**Implementation Pattern**:
```typescript
addWidget(dashboardId: string, widget: ID3Widget): Observable<IDashboard> {
  return this.load(dashboardId).pipe(
    map(dashboard => {
      if (!dashboard) {
        throw new Error(`Dashboard ${dashboardId} not found`);
      }
      
      // Validate widget
      const validation = this.validateWidget(widget);
      if (!validation.valid) {
        throw new Error(`Widget validation failed: ${validation.errors.join(', ')}`);
      }
      
      // Check for ID conflicts
      if (dashboard.widgets.some(w => w.id === widget.id)) {
        throw new Error(`Widget ${widget.id} already exists`);
      }
      
      // Immutable update
      const updatedDashboard: IDashboard = {
        ...dashboard,
        widgets: [...dashboard.widgets, widget],
        updatedAt: new Date()
      };
      
      return updatedDashboard;
    }),
    switchMap(updated => this.save(updated))
  );
}

updateWidget(dashboardId: string, widget: ID3Widget): Observable<IDashboard> {
  return this.load(dashboardId).pipe(
    map(dashboard => {
      if (!dashboard) {
        throw new Error(`Dashboard ${dashboardId} not found`);
      }
      
      // Validate widget
      const validation = this.validateWidget(widget);
      if (!validation.valid) {
        throw new Error(`Widget validation failed: ${validation.errors.join(', ')}`);
      }
      
      // Immutable update
      const updatedDashboard: IDashboard = {
        ...dashboard,
        widgets: dashboard.widgets.map(w => w.id === widget.id ? widget : w),
        updatedAt: new Date()
      };
      
      return updatedDashboard;
    }),
    switchMap(updated => this.save(updated))
  );
}

removeWidget(dashboardId: string, widgetId: string): Observable<IDashboard> {
  return this.load(dashboardId).pipe(
    map(dashboard => {
      if (!dashboard) {
        throw new Error(`Dashboard ${dashboardId} not found`);
      }
      
      // Immutable update
      const updatedDashboard: IDashboard = {
        ...dashboard,
        widgets: dashboard.widgets.filter(w => w.id !== widgetId),
        updatedAt: new Date()
      };
      
      return updatedDashboard;
    }),
    switchMap(updated => this.save(updated))
  );
}
```

**Alternatives Considered**:
- **Mutable updates**: Risk of state corruption, harder to track changes
- **Separate widget service**: Adds complexity, widgets are part of dashboard
- **Event-driven updates**: More complex, direct updates are sufficient

### 4. Configuration Validation Pattern

**Decision**: Use comprehensive validation with detailed error messages

**Rationale**:
- Prevents 100% of invalid configurations (SC-009)
- Clear error messages aid debugging (< 200ms - SC-008)
- Validates both dashboard and widget configurations
- Type-safe validation with TypeScript
- Reusable validation utilities

**Implementation Pattern**:
```typescript
interface IValidationResult {
  valid: boolean;
  errors: string[];
}

function validateDashboard(dashboard: IDashboard): IValidationResult {
  const errors: string[] = [];
  
  if (!dashboard.id || !isValidUUID(dashboard.id)) {
    errors.push('Dashboard ID is required and must be a valid UUID');
  }
  
  if (!dashboard.title || dashboard.title.trim().length === 0) {
    errors.push('Dashboard title is required');
  }
  
  if (!Array.isArray(dashboard.widgets)) {
    errors.push('Dashboard widgets must be an array');
  } else {
    dashboard.widgets.forEach((widget, index) => {
      const widgetValidation = validateWidget(widget);
      if (!widgetValidation.valid) {
        errors.push(`Widget ${index}: ${widgetValidation.errors.join(', ')}`);
      }
    });
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

function validateWidget(widget: ID3Widget): IValidationResult {
  const errors: string[] = [];
  
  if (!widget.id || !isValidUUID(widget.id)) {
    errors.push('Widget ID is required and must be a valid UUID');
  }
  
  if (!widget.type || !isValidWidgetType(widget.type)) {
    errors.push(`Widget type must be one of: ${VALID_WIDGET_TYPES.join(', ')}`);
  }
  
  if (!widget.position || !isValidGridsterItem(widget.position)) {
    errors.push('Widget position must be a valid GridsterItem');
  }
  
  if (!widget.title || widget.title.trim().length === 0) {
    errors.push('Widget title is required');
  }
  
  if (widget.dataSource) {
    const dataSourceValidation = validateDataSource(widget.dataSource);
    if (!dataSourceValidation.valid) {
      errors.push(`Data source: ${dataSourceValidation.errors.join(', ')}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
```

**Alternatives Considered**:
- **Runtime validation only**: TypeScript provides compile-time safety, but runtime validation catches configuration errors
- **Third-party validation library**: Adds dependency, custom validation is sufficient
- **Schema validation (JSON Schema)**: More complex, TypeScript interfaces are sufficient

### 5. Concurrent Modification Handling

**Decision**: Use optimistic locking with version numbers

**Rationale**:
- Prevents lost updates in concurrent scenarios
- Simple version-based conflict detection
- Clear error messages for conflicts
- Handles edge case from spec requirements

**Implementation Pattern**:
```typescript
interface IDashboard {
  id: string;
  title: string;
  widgets: ID3Widget[];
  version: number; // Incremented on each update
  createdAt: Date;
  updatedAt: Date;
}

update(dashboard: IDashboard): Observable<IDashboard> {
  return this.load(dashboard.id).pipe(
    switchMap(existing => {
      if (!existing) {
        return throwError(() => new Error(`Dashboard ${dashboard.id} not found`));
      }
      
      // Check for concurrent modification
      if (existing.version !== dashboard.version) {
        return throwError(() => new Error(
          `Dashboard ${dashboard.id} has been modified. Current version: ${existing.version}, your version: ${dashboard.version}`
        ));
      }
      
      // Increment version and update
      const updated: IDashboard = {
        ...dashboard,
        version: existing.version + 1,
        updatedAt: new Date()
      };
      
      return this.save(updated);
    })
  );
}
```

**Alternatives Considered**:
- **Pessimistic locking**: Requires backend, adds complexity
- **Last-write-wins**: Risk of lost updates
- **Merge strategies**: Complex, optimistic locking is sufficient

### 6. Error Handling Pattern

**Decision**: Use typed error classes with clear messages and Observable error streams

**Rationale**:
- Typed errors enable error handling in consumers
- Clear messages aid debugging (< 200ms - SC-008)
- Observable error streams align with RxJS patterns
- Graceful error handling prevents application crashes

**Implementation Pattern**:
```typescript
class DashboardServiceError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly retryable: boolean = false
  ) {
    super(message);
    this.name = 'DashboardServiceError';
  }
}

class DashboardNotFoundError extends DashboardServiceError {
  constructor(dashboardId: string) {
    super(
      `Dashboard ${dashboardId} not found`,
      'DASHBOARD_NOT_FOUND',
      false
    );
    this.name = 'DashboardNotFoundError';
  }
}

class WidgetValidationError extends DashboardServiceError {
  constructor(public readonly errors: string[]) {
    super(
      `Widget validation failed: ${errors.join(', ')}`,
      'WIDGET_VALIDATION_ERROR',
      false
    );
    this.name = 'WidgetValidationError';
  }
}

// Usage in service methods
load(id: string): Observable<IDashboard> {
  return this.storage.load(id).pipe(
    map(dashboard => {
      if (!dashboard) {
        throw new DashboardNotFoundError(id);
      }
      return dashboard;
    }),
    catchError(error => {
      if (error instanceof DashboardServiceError) {
        return throwError(() => error);
      }
      return throwError(() => new DashboardServiceError(
        `Failed to load dashboard: ${error.message}`,
        'LOAD_ERROR',
        true
      ));
    })
  );
}
```

**Alternatives Considered**:
- **Simple Error class**: Less type safety, harder to handle specific errors
- **Error codes only**: Less descriptive, messages aid debugging
- **Third-party error library**: Unnecessary dependency

## Summary

All technical decisions have been made with the following principles:
1. **Performance**: All decisions align with success criteria performance goals
2. **Simplicity**: Chosen solutions are the simplest that meet requirements
3. **Type Safety**: All patterns use TypeScript strict typing
4. **Reactive**: All async operations use RxJS Observables
5. **Constitution Compliance**: All decisions comply with project constitution

No further research is required. Implementation can proceed to Phase 1 design.

