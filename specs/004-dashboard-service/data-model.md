# Data Model: Dashboard Service

**Feature**: 004-dashboard-service  
**Date**: 2025-01-27

## Entities

### 1. Dashboard

**Purpose**: Configuration object containing widgets, layout, filters, and metadata for a dashboard.

**Interface**: `IDashboard` (extends existing interface in `dashboard.interface.ts`)

**Fields**:
- `id: string` (required)
  - **Description**: Unique dashboard identifier (UUID)
  - **Validation**: Must be a valid UUID format
  - **Format**: UUID v4 string
  - **Example**: `"550e8400-e29b-41d4-a716-446655440000"`

- `title: string` (required)
  - **Description**: Dashboard title/name
  - **Validation**: Non-empty string, trimmed length > 0
  - **Format**: String
  - **Max Length**: 255 characters
  - **Example**: `"Sales Dashboard"`

- `description?: string` (optional)
  - **Description**: Dashboard description
  - **Validation**: String or undefined
  - **Format**: String
  - **Max Length**: 1000 characters
  - **Example**: `"Monthly sales performance metrics"`

- `widgets: ID3Widget[]` (required)
  - **Description**: Array of widgets contained in the dashboard
  - **Validation**: Must be an array, each widget must pass widget validation
  - **Format**: Array of ID3Widget objects
  - **Default**: `[]` (empty array)
  - **Max Items**: No hard limit, but performance degrades with > 100 widgets

- `layout?: ILayoutConfig` (optional)
  - **Description**: Dashboard layout configuration
  - **Validation**: Valid layout configuration object
  - **Format**: Layout configuration object
  - **Default**: Default grid layout

- `filters?: IFilterValues[]` (optional)
  - **Description**: Global filters applied to the dashboard
  - **Validation**: Array of valid filter values
  - **Format**: Array of IFilterValues objects
  - **Default**: `[]` (empty array)

- `version: number` (required)
  - **Description**: Version number for optimistic locking
  - **Validation**: Positive integer, incremented on each update
  - **Format**: Integer
  - **Default**: `1` (for new dashboards)
  - **Increment**: Automatically incremented on each save/update

- `createdAt: Date` (required)
  - **Description**: Dashboard creation timestamp
  - **Validation**: Valid Date object
  - **Format**: ISO 8601 date string or Date object
  - **Default**: Current date/time

- `updatedAt: Date` (required)
  - **Description**: Dashboard last update timestamp
  - **Validation**: Valid Date object
  - **Format**: ISO 8601 date string or Date object
  - **Default**: Current date/time (updated on each save)

- `metadata?: Record<string, any>` (optional)
  - **Description**: Additional metadata for the dashboard
  - **Validation**: Object with string keys
  - **Format**: Key-value pairs
  - **Default**: `{}` (empty object)

**Relationships**:
- Contains: Multiple ID3Widget objects (one-to-many)
- Uses: IFilterValues for global filters
- Managed by: DashboardService
- Validated by: DashboardService.validateDashboard()

**State Transitions**:
- **Initial**: Dashboard created with default values
- **Validated**: Passes DashboardService validation
- **Saved**: Persisted to storage
- **Updated**: Modified and version incremented
- **Deleted**: Removed from storage
- **Error**: Validation fails or save fails

**Validation Rules**:
1. `id` must be a valid UUID format
2. `title` must be non-empty after trimming
3. `widgets` must be an array (can be empty)
4. Each widget in `widgets` must pass widget validation
5. `version` must be a positive integer
6. `createdAt` must be a valid Date
7. `updatedAt` must be a valid Date and >= `createdAt`
8. Widget IDs within a dashboard must be unique
9. No duplicate widget IDs allowed

### 2. Widget

**Purpose**: Individual widget configuration within a dashboard.

**Interface**: `ID3Widget` (existing interface in `widget.interface.ts`, may be extended)

**Fields**: (See existing `widget.interface.ts` for complete definition)
- `id: string` - Unique widget identifier (UUID)
- `type: WidgetType` - Widget type (line, bar, pie, etc.)
- `position: GridsterItem` - Widget position in grid
- `title: string` - Widget title
- `config: ID3WidgetConfig` - Widget configuration
- `dataSource?: IDataSource` - Optional data source
- `filters?: IFilterValues[]` - Optional filters
- `style?: IWidgetStyle` - Optional styling

**Relationships**:
- Belongs to: IDashboard (many-to-one)
- Uses: IDataSource for data fetching
- Uses: IFilterValues for filtering
- Validated by: DashboardService.validateWidget()

**State Transitions**:
- **Initial**: Widget created with configuration
- **Validated**: Passes widget validation
- **Added**: Added to dashboard widgets array
- **Updated**: Configuration modified
- **Removed**: Removed from dashboard widgets array
- **Error**: Validation fails

**Validation Rules**:
1. `id` must be a valid UUID format
2. `type` must be a valid widget type
3. `position` must be a valid GridsterItem
4. `title` must be non-empty after trimming
5. `config` must be a valid configuration object
6. If `dataSource` is provided, it must pass data source validation
7. Widget ID must be unique within the dashboard

### 3. DashboardState

**Purpose**: Current state of dashboards including active dashboard, edit mode, and filters.

**Interface**: `IDashboardState`

**Fields**:
- `activeDashboardId: string | null` (required)
  - **Description**: ID of the currently active/selected dashboard
  - **Validation**: Valid UUID string or null
  - **Format**: UUID string or null
  - **Default**: `null`

- `editMode: boolean` (required)
  - **Description**: Whether the dashboard is in edit mode
  - **Validation**: Boolean value
  - **Format**: Boolean
  - **Default**: `false`

- `filters: IFilterValues[]` (required)
  - **Description**: Active filters applied to the dashboard
  - **Validation**: Array of valid filter values
  - **Format**: Array of IFilterValues objects
  - **Default**: `[]` (empty array)

- `selectedWidgets: string[]` (required)
  - **Description**: IDs of currently selected widgets
  - **Validation**: Array of UUID strings
  - **Format**: Array of UUID strings
  - **Default**: `[]` (empty array)

- `lastError?: IDashboardServiceError` (optional)
  - **Description**: Last error that occurred in the service
  - **Validation**: Valid error object or undefined
  - **Format**: Error object
  - **Default**: `undefined`

**Relationships**:
- Managed by: DashboardService
- Observable: Exposed through DashboardService.getState()
- Updated by: DashboardService state management methods

**State Transitions**:
- **Initial**: Default state (no active dashboard, edit mode off)
- **Dashboard Selected**: `activeDashboardId` set to dashboard ID
- **Edit Mode Toggled**: `editMode` toggled
- **Filters Updated**: `filters` array updated
- **Widgets Selected**: `selectedWidgets` array updated
- **Error Occurred**: `lastError` set to error object
- **Reset**: All fields reset to initial state

**Validation Rules**:
1. `activeDashboardId` must be null or a valid UUID
2. `editMode` must be a boolean
3. `filters` must be an array
4. `selectedWidgets` must be an array of UUID strings
5. All widget IDs in `selectedWidgets` must exist in the active dashboard

### 4. DashboardStorageEntry

**Purpose**: Internal storage representation of a dashboard (used for persistence).

**Interface**: `IDashboardStorageEntry`

**Fields**:
- `id: string` - Dashboard ID (UUID)
- `data: IDashboard` - Dashboard data
- `timestamp: number` - Storage timestamp (for cache expiration if needed)

**Relationships**:
- Used by: Dashboard storage implementations
- Persisted by: Storage layer (localStorage, IndexedDB, or backend)

**State Transitions**:
- **Created**: When dashboard is saved
- **Updated**: When dashboard is updated
- **Deleted**: When dashboard is removed

### 5. ValidationResult

**Purpose**: Result of dashboard or widget validation.

**Interface**: `IValidationResult` (may reuse from data service)

**Fields**:
- `valid: boolean` (required)
  - **Description**: Whether validation passed
  - **Validation**: Boolean value
  - **Format**: Boolean

- `errors: string[]` (required)
  - **Description**: Array of validation error messages
  - **Validation**: Array of strings
  - **Format**: Array of strings
  - **Default**: `[]` (empty array if valid)

**Relationships**:
- Returned by: DashboardService validation methods
- Used by: Service methods to check validity before operations

### 6. DashboardServiceError

**Purpose**: Typed error for dashboard service operations.

**Interface**: `IDashboardServiceError` (extends Error)

**Fields**:
- `message: string` - Error message
- `code: string` - Error code for programmatic handling
- `retryable: boolean` - Whether the error is retryable
- `dashboardId?: string` - Related dashboard ID (if applicable)
- `widgetId?: string` - Related widget ID (if applicable)

**Error Codes**:
- `DASHBOARD_NOT_FOUND` - Dashboard with given ID not found
- `DASHBOARD_VALIDATION_ERROR` - Dashboard validation failed
- `WIDGET_VALIDATION_ERROR` - Widget validation failed
- `WIDGET_NOT_FOUND` - Widget with given ID not found
- `WIDGET_ID_CONFLICT` - Widget ID already exists
- `CONCURRENT_MODIFICATION` - Dashboard was modified concurrently
- `SAVE_ERROR` - Failed to save dashboard
- `LOAD_ERROR` - Failed to load dashboard
- `DELETE_ERROR` - Failed to delete dashboard

## Entity Relationships Diagram

```
IDashboard
  ├── contains: ID3Widget[] (one-to-many)
  ├── uses: IFilterValues[] (many-to-many)
  └── has: ILayoutConfig (one-to-one)

ID3Widget
  ├── belongs to: IDashboard (many-to-one)
  ├── uses: IDataSource (one-to-one, optional)
  └── uses: IFilterValues[] (many-to-many, optional)

IDashboardState
  ├── references: IDashboard (one-to-one, via activeDashboardId)
  └── references: ID3Widget[] (many-to-many, via selectedWidgets)

IDashboardStorageEntry
  └── contains: IDashboard (one-to-one)
```

## Data Flow

1. **Dashboard Creation**:
   - User provides dashboard configuration
   - DashboardService validates configuration
   - Dashboard is created with generated ID and version 1
   - Dashboard is saved to storage
   - Dashboard ID is returned

2. **Dashboard Loading**:
   - User provides dashboard ID
   - DashboardService loads dashboard from storage
   - Dashboard is validated
   - Dashboard is returned

3. **Widget Management**:
   - User provides dashboard ID and widget configuration
   - DashboardService loads dashboard
   - Widget is validated
   - Dashboard is updated with new widget (immutable update)
   - Dashboard version is incremented
   - Dashboard is saved to storage
   - Updated dashboard is returned

4. **State Management**:
   - User or component updates state
   - DashboardService updates BehaviorSubject
   - State changes are emitted to subscribers
   - State is maintained in memory (not persisted)

## Validation Summary

**Dashboard Validation**:
- ID must be valid UUID
- Title must be non-empty
- Widgets array must be valid
- All widgets must pass validation
- Widget IDs must be unique
- Version must be positive integer
- Dates must be valid

**Widget Validation**:
- ID must be valid UUID
- Type must be valid widget type
- Position must be valid GridsterItem
- Title must be non-empty
- Config must be valid
- Data source must be valid (if provided)

**State Validation**:
- Active dashboard ID must be valid UUID or null
- Edit mode must be boolean
- Filters must be valid array
- Selected widgets must be valid UUID array

