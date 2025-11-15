# Dashboard Service API Contract

**Feature**: 004-dashboard-service  
**Date**: 2025-01-27  
**Type**: TypeScript Service Interface

## Service: DashboardService

### Class Definition

```typescript
@Injectable({ providedIn: 'root' })
export class DashboardService {
  // Public methods defined below
}
```

### Methods

#### 1. create(config: IDashboardConfig): Observable<string>

**Description**: Creates a new dashboard with the provided configuration and returns the dashboard ID.

**Parameters**:
- `config: IDashboardConfig` (required)
  - Dashboard configuration object
  - Must have `title` field
  - Optional `description`, `widgets`, `layout`, `filters`, `metadata`

**Returns**: `Observable<string>`
- Observable that emits the created dashboard ID (UUID)
- Emits once when dashboard is created and saved

**Behavior**:
- Generates UUID for dashboard ID
- Sets version to 1
- Sets createdAt and updatedAt to current date/time
- Validates dashboard configuration
- Saves dashboard to storage
- Returns dashboard ID

**Error Handling**:
- Throws `DashboardValidationError` if configuration is invalid
- Throws `DashboardServiceError` if save fails

**Performance**:
- Completes within 500ms (SC-001)

**Example**:
```typescript
const config: IDashboardConfig = {
  title: 'Sales Dashboard',
  description: 'Monthly sales metrics',
  widgets: []
};

this.dashboardService.create(config).subscribe({
  next: (dashboardId) => {
    console.log('Dashboard created:', dashboardId);
  },
  error: (error) => {
    console.error('Failed to create dashboard:', error.message);
  }
});
```

---

#### 2. load(id: string): Observable<IDashboard>

**Description**: Loads a dashboard by ID.

**Parameters**:
- `id: string` (required)
  - Dashboard ID (UUID)
  - Must be a valid UUID format

**Returns**: `Observable<IDashboard>`
- Observable that emits the dashboard configuration
- Emits once when dashboard is loaded

**Behavior**:
- Loads dashboard from storage
- Validates dashboard exists
- Returns dashboard configuration

**Error Handling**:
- Throws `DashboardNotFoundError` if dashboard not found
- Throws `DashboardServiceError` if load fails

**Performance**:
- Completes within 300ms (SC-002)

**Example**:
```typescript
this.dashboardService.load('550e8400-e29b-41d4-a716-446655440000').subscribe({
  next: (dashboard) => {
    console.log('Dashboard loaded:', dashboard.title);
  },
  error: (error) => {
    if (error instanceof DashboardNotFoundError) {
      console.error('Dashboard not found');
    } else {
      console.error('Failed to load dashboard:', error.message);
    }
  }
});
```

---

#### 3. update(dashboard: IDashboard): Observable<IDashboard>

**Description**: Updates an existing dashboard.

**Parameters**:
- `dashboard: IDashboard` (required)
  - Dashboard object with updated configuration
  - Must have valid `id` and `version` fields

**Returns**: `Observable<IDashboard>`
- Observable that emits the updated dashboard
- Emits once when dashboard is updated

**Behavior**:
- Validates dashboard configuration
- Checks for concurrent modifications (version mismatch)
- Increments version number
- Updates updatedAt timestamp
- Saves dashboard to storage
- Returns updated dashboard

**Error Handling**:
- Throws `DashboardNotFoundError` if dashboard not found
- Throws `DashboardValidationError` if configuration is invalid
- Throws `ConcurrentModificationError` if version mismatch
- Throws `DashboardServiceError` if save fails

**Performance**:
- Completes within 500ms (SC-003)

**Example**:
```typescript
this.dashboardService.load(dashboardId).subscribe({
  next: (dashboard) => {
    const updated = { ...dashboard, title: 'Updated Title' };
    this.dashboardService.update(updated).subscribe({
      next: (saved) => {
        console.log('Dashboard updated:', saved.version);
      }
    });
  }
});
```

---

#### 4. delete(id: string): Observable<boolean>

**Description**: Deletes a dashboard by ID.

**Parameters**:
- `id: string` (required)
  - Dashboard ID (UUID)
  - Must be a valid UUID format

**Returns**: `Observable<boolean>`
- Observable that emits `true` if deleted, `false` if not found
- Emits once when deletion completes

**Behavior**:
- Removes dashboard from storage
- Returns true if deleted, false if not found
- Updates state if deleted dashboard was active

**Error Handling**:
- Throws `DashboardServiceError` if delete fails

**Performance**:
- Completes within 200ms

**Example**:
```typescript
this.dashboardService.delete('550e8400-e29b-41d4-a716-446655440000').subscribe({
  next: (deleted) => {
    if (deleted) {
      console.log('Dashboard deleted');
    } else {
      console.log('Dashboard not found');
    }
  }
});
```

---

#### 5. list(): Observable<IDashboard[]>

**Description**: Lists all saved dashboards.

**Parameters**: None

**Returns**: `Observable<IDashboard[]>`
- Observable that emits array of all dashboards
- Emits once when list is loaded

**Behavior**:
- Loads all dashboards from storage
- Returns array of dashboard configurations
- Returns empty array if no dashboards exist

**Error Handling**:
- Throws `DashboardServiceError` if list fails

**Performance**:
- Completes within 300ms for up to 1000 dashboards (SC-006)

**Example**:
```typescript
this.dashboardService.list().subscribe({
  next: (dashboards) => {
    console.log(`Found ${dashboards.length} dashboards`);
    dashboards.forEach(d => console.log(d.title));
  }
});
```

---

#### 6. addWidget(dashboardId: string, widget: ID3Widget): Observable<IDashboard>

**Description**: Adds a widget to a dashboard.

**Parameters**:
- `dashboardId: string` (required)
  - Dashboard ID (UUID)
- `widget: ID3Widget` (required)
  - Widget configuration object
  - Must have valid `id`, `type`, `position`, `title`, `config`

**Returns**: `Observable<IDashboard>`
- Observable that emits the updated dashboard
- Emits once when widget is added and saved

**Behavior**:
- Loads dashboard
- Validates widget configuration
- Checks for widget ID conflicts
- Adds widget to dashboard widgets array (immutable update)
- Increments dashboard version
- Saves dashboard
- Returns updated dashboard

**Error Handling**:
- Throws `DashboardNotFoundError` if dashboard not found
- Throws `WidgetValidationError` if widget is invalid
- Throws `WidgetIdConflictError` if widget ID already exists
- Throws `DashboardServiceError` if save fails

**Performance**:
- Completes within 200ms (SC-004)

**Example**:
```typescript
const widget: ID3Widget = {
  id: 'widget-123',
  type: 'line',
  position: { x: 0, y: 0, cols: 4, rows: 3 },
  title: 'Sales Chart',
  config: { /* chart config */ }
};

this.dashboardService.addWidget('dashboard-123', widget).subscribe({
  next: (dashboard) => {
    console.log('Widget added, dashboard version:', dashboard.version);
  }
});
```

---

#### 7. updateWidget(dashboardId: string, widget: ID3Widget): Observable<IDashboard>

**Description**: Updates a widget in a dashboard.

**Parameters**:
- `dashboardId: string` (required)
  - Dashboard ID (UUID)
- `widget: ID3Widget` (required)
  - Widget configuration object with updated values
  - Must have valid `id` that exists in dashboard

**Returns**: `Observable<IDashboard>`
- Observable that emits the updated dashboard
- Emits once when widget is updated and saved

**Behavior**:
- Loads dashboard
- Validates widget configuration
- Finds widget by ID
- Updates widget in dashboard widgets array (immutable update)
- Increments dashboard version
- Saves dashboard
- Returns updated dashboard

**Error Handling**:
- Throws `DashboardNotFoundError` if dashboard not found
- Throws `WidgetNotFoundError` if widget not found
- Throws `WidgetValidationError` if widget is invalid
- Throws `DashboardServiceError` if save fails

**Performance**:
- Completes within 200ms (SC-004)

**Example**:
```typescript
this.dashboardService.load('dashboard-123').subscribe({
  next: (dashboard) => {
    const widget = dashboard.widgets.find(w => w.id === 'widget-123');
    if (widget) {
      const updated = { ...widget, title: 'Updated Title' };
      this.dashboardService.updateWidget('dashboard-123', updated).subscribe({
        next: (saved) => {
          console.log('Widget updated');
        }
      });
    }
  }
});
```

---

#### 8. removeWidget(dashboardId: string, widgetId: string): Observable<IDashboard>

**Description**: Removes a widget from a dashboard.

**Parameters**:
- `dashboardId: string` (required)
  - Dashboard ID (UUID)
- `widgetId: string` (required)
  - Widget ID (UUID)
  - Must exist in dashboard

**Returns**: `Observable<IDashboard>`
- Observable that emits the updated dashboard
- Emits once when widget is removed and saved

**Behavior**:
- Loads dashboard
- Finds widget by ID
- Removes widget from dashboard widgets array (immutable update)
- Increments dashboard version
- Saves dashboard
- Returns updated dashboard

**Error Handling**:
- Throws `DashboardNotFoundError` if dashboard not found
- Throws `WidgetNotFoundError` if widget not found
- Throws `DashboardServiceError` if save fails

**Performance**:
- Completes within 200ms (SC-004)

**Example**:
```typescript
this.dashboardService.removeWidget('dashboard-123', 'widget-123').subscribe({
  next: (dashboard) => {
    console.log('Widget removed, remaining widgets:', dashboard.widgets.length);
  }
});
```

---

#### 9. validateDashboard(dashboard: IDashboard): IValidationResult

**Description**: Validates a dashboard configuration.

**Parameters**:
- `dashboard: IDashboard` (required)
  - Dashboard configuration to validate

**Returns**: `IValidationResult`
```typescript
interface IValidationResult {
  valid: boolean;
  errors: string[];
}
```

**Behavior**:
- Validates dashboard ID format (UUID)
- Validates title is non-empty
- Validates widgets array
- Validates each widget
- Validates version is positive integer
- Validates dates are valid
- Returns validation result with errors array

**Error Handling**:
- No errors thrown, returns validation result

**Performance**:
- Completes within 50ms

**Example**:
```typescript
const validation = this.dashboardService.validateDashboard(dashboard);
if (!validation.valid) {
  console.error('Validation errors:', validation.errors);
}
```

---

#### 10. validateWidget(widget: ID3Widget): IValidationResult

**Description**: Validates a widget configuration.

**Parameters**:
- `widget: ID3Widget` (required)
  - Widget configuration to validate

**Returns**: `IValidationResult`
- Validation result with errors array

**Behavior**:
- Validates widget ID format (UUID)
- Validates widget type is valid
- Validates position is valid GridsterItem
- Validates title is non-empty
- Validates config is valid object
- Validates data source if provided
- Returns validation result with errors array

**Error Handling**:
- No errors thrown, returns validation result

**Performance**:
- Completes within 50ms

**Example**:
```typescript
const validation = this.dashboardService.validateWidget(widget);
if (!validation.valid) {
  console.error('Widget validation errors:', validation.errors);
}
```

---

#### 11. getState(): Observable<IDashboardState>

**Description**: Returns an observable of the current dashboard state.

**Parameters**: None

**Returns**: `Observable<IDashboardState>`
- Observable that emits current state and updates on state changes
- Uses BehaviorSubject for current state value

**Behavior**:
- Emits current state immediately on subscription
- Emits updates when state changes
- State includes: activeDashboardId, editMode, filters, selectedWidgets

**Example**:
```typescript
this.dashboardService.getState().subscribe({
  next: (state) => {
    console.log('Active dashboard:', state.activeDashboardId);
    console.log('Edit mode:', state.editMode);
  }
});
```

---

#### 12. getCurrentState(): IDashboardState

**Description**: Returns the current dashboard state synchronously.

**Parameters**: None

**Returns**: `IDashboardState`
- Current state object

**Behavior**:
- Returns current state value immediately
- No subscription required

**Example**:
```typescript
const state = this.dashboardService.getCurrentState();
if (state.activeDashboardId) {
  console.log('Active dashboard:', state.activeDashboardId);
}
```

---

#### 13. updateState(updates: Partial<IDashboardState>): void

**Description**: Updates the dashboard state.

**Parameters**:
- `updates: Partial<IDashboardState>` (required)
  - Partial state object with fields to update

**Returns**: `void`

**Behavior**:
- Merges updates with current state
- Emits updated state to subscribers
- State changes are observable

**Example**:
```typescript
this.dashboardService.updateState({
  activeDashboardId: 'dashboard-123',
  editMode: true
});
```

---

#### 14. resetState(): void

**Description**: Resets the dashboard state to initial values.

**Parameters**: None

**Returns**: `void`

**Behavior**:
- Resets all state fields to initial values
- Emits reset state to subscribers

**Example**:
```typescript
this.dashboardService.resetState();
```

---

## Interfaces

### IDashboard

```typescript
interface IDashboard {
  id: string;
  title: string;
  description?: string;
  widgets: ID3Widget[];
  layout?: ILayoutConfig;
  filters?: IFilterValues[];
  version: number;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}
```

### IDashboardConfig

```typescript
interface IDashboardConfig {
  title: string;
  description?: string;
  widgets?: ID3Widget[];
  layout?: ILayoutConfig;
  filters?: IFilterValues[];
  metadata?: Record<string, any>;
}
```

### IDashboardState

```typescript
interface IDashboardState {
  activeDashboardId: string | null;
  editMode: boolean;
  filters: IFilterValues[];
  selectedWidgets: string[];
  lastError?: IDashboardServiceError;
}
```

### ID3Widget

```typescript
interface ID3Widget {
  id: string;
  type: WidgetType;
  position: GridsterItem;
  title: string;
  config: ID3WidgetConfig;
  dataSource?: IDataSource;
  filters?: IFilterValues[];
  style?: IWidgetStyle;
}
```

### IValidationResult

```typescript
interface IValidationResult {
  valid: boolean;
  errors: string[];
}
```

### IDashboardServiceError

```typescript
interface IDashboardServiceError {
  message: string;
  code: string;
  retryable: boolean;
  dashboardId?: string;
  widgetId?: string;
}
```

## Functional Requirements Mapping

| FR | Requirement | Implementation |
|----|-------------|---------------|
| FR-001 | Dashboard create operation | `create()` method |
| FR-002 | Dashboard read/load operation | `load()` method |
| FR-003 | Dashboard update operation | `update()` method |
| FR-004 | Dashboard delete operation | `delete()` method |
| FR-005 | Dashboard list operation | `list()` method |
| FR-006 | Widget add operation | `addWidget()` method |
| FR-007 | Widget update operation | `updateWidget()` method |
| FR-008 | Widget remove operation | `removeWidget()` method |
| FR-009 | Persist dashboard configurations | Storage layer in all CRUD operations |
| FR-010 | Manage dashboard state | `getState()`, `updateState()`, `resetState()` methods |
| FR-011 | Handle errors gracefully | Typed error classes and error observables |
| FR-012 | Validate dashboard and widget configurations | `validateDashboard()`, `validateWidget()` methods |

## Success Criteria Mapping

| SC | Criterion | Measurement |
|----|-----------|-------------|
| SC-001 | Dashboard create < 500ms | Measured in `create()` method |
| SC-002 | Dashboard load < 300ms | Measured in `load()` method |
| SC-003 | Dashboard update < 500ms | Measured in `update()` method |
| SC-004 | Widget management < 200ms | Measured in `addWidget()`, `updateWidget()`, `removeWidget()` |
| SC-005 | 100% valid configs saved | Validation before save in all operations |
| SC-006 | Handle 1000 dashboards | Performance tested in `list()` method |
| SC-007 | State consistency 100% | State management through BehaviorSubject |
| SC-008 | Error messages < 200ms | Error handling in all methods |
| SC-009 | 100% validation prevention | Validation methods prevent invalid configs |
| SC-010 | No memory leaks | Proper cleanup in service lifecycle |

