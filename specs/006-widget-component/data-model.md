# Data Model: Widget Component

**Feature**: 006-widget-component  
**Date**: 2025-01-27  
**Status**: Complete

## Overview

The Widget Component manages the lifecycle and rendering of individual widgets within a dashboard. It handles dynamic component loading, state management, configuration, and user interactions. The component works with existing entity interfaces and introduces minimal new data structures.

## Entities

### Widget Component State

**Purpose**: Tracks the internal state of a widget (loading, error, data availability)

**Fields**:
- `loading: boolean` - Indicates if widget is currently loading data or component
- `error: string | null` - Error message if widget failed to load or encountered an error
- `data: any | null` - Widget data (loaded from data source or passed directly)
- `componentLoaded: boolean` - Indicates if the dynamic component has been successfully loaded
- `lastUpdated: Date | null` - Timestamp of last successful data update

**State Transitions**:
1. **Initial**: `loading: true, error: null, data: null, componentLoaded: false`
2. **Component Loading**: `loading: true, error: null, data: null, componentLoaded: false`
3. **Component Loaded**: `loading: true, error: null, data: null, componentLoaded: true`
4. **Data Loading**: `loading: true, error: null, data: null, componentLoaded: true`
5. **Success**: `loading: false, error: null, data: <data>, componentLoaded: true, lastUpdated: <timestamp>`
6. **Error**: `loading: false, error: <message>, data: null, componentLoaded: <true|false>, lastUpdated: null`
7. **Empty**: `loading: false, error: null, data: [], componentLoaded: true, lastUpdated: <timestamp>`

**Validation Rules**:
- `error` must be null when `loading` is true
- `data` can be null only when `loading` is true or `error` is not null
- `lastUpdated` must be null when `error` is not null

---

### Widget Action Event

**Purpose**: Represents user actions triggered from widget header

**Fields**:
- `action: 'edit' | 'delete' | 'refresh' | 'export' | 'configure'` - Type of action
- `widgetId: string` - ID of the widget the action applies to
- `payload?: any` - Optional payload for action-specific data (e.g., export format)

**Validation Rules**:
- `widgetId` must match the widget's ID
- `payload` is required for 'export' action (must specify export format)
- `payload` is optional for other actions

---

### Widget Configuration Change Event

**Purpose**: Represents configuration changes from the configuration panel

**Fields**:
- `widgetId: string` - ID of the widget being updated
- `config: ID3WidgetConfig` - New configuration object
- `changedFields: string[]` - Array of field names that were changed (for optimization)

**Validation Rules**:
- `widgetId` must match the widget's ID
- `config` must be a valid `ID3WidgetConfig` object
- `changedFields` must contain at least one field name if config changed

---

## Existing Entity Usage

### ID3Widget (from `entities/widget.interface.ts`)

**Usage**: Primary input to widget component. Contains all widget metadata and configuration.

**Key Properties Used**:
- `id: string` - Unique identifier for the widget
- `type: WidgetType` - Determines which component to load
- `title: string` - Displayed in widget header
- `config: ID3WidgetConfig` - Type-specific configuration
- `dataSource?: IDataSource` - Optional data source configuration
- `filters?: IFilterValues[]` - Optional widget-specific filters
- `style?: IWidgetStyle` - Optional styling configuration

**Validation**: Widget component validates that required fields are present before rendering.

---

### IDataSource (from `entities/widget.interface.ts`)

**Usage**: Defines how widget data should be loaded.

**Key Properties Used**:
- `type: 'api' | 'static' | 'computed'` - Data source type
- `endpoint?: string` - API endpoint (for 'api' type)
- `method?: 'GET' | 'POST'` - HTTP method (for 'api' type)
- `params?: Record<string, any>` - Request parameters (for 'api' type)
- `data?: any[]` - Static data (for 'static' type)
- `transform?: (data: any) => any` - Data transformation function

**Validation**: 
- `endpoint` required when `type` is 'api'
- `data` required when `type` is 'static'
- `transform` must be a function if provided

---

### ID3WidgetConfig (from `entities/widget.interface.ts`)

**Usage**: Type-specific configuration for widget behavior and appearance.

**Key Properties Used**:
- `chartOptions?: any` - Chart-specific options (for chart widgets)
- `tableOptions?: any` - Table-specific options (for table widget)
- `filterOptions?: any` - Filter-specific options (for filter widget)
- `tileOptions?: any` - Tile-specific options (for tile widget)
- `markdownOptions?: any` - Markdown-specific options (for markdown widget)
- `[key: string]: any` - Additional type-specific options

**Validation**: Configuration is validated based on widget type before rendering.

---

### IFilterValues (from `entities/filter.interface.ts`)

**Usage**: Widget-specific filters that are merged with dashboard filters.

**Key Properties Used**:
- `key: string` - Filter key/field name
- `value: any` - Filter value
- `operator?: 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'between'` - Filter operator

**Validation**: 
- `key` must be a non-empty string
- `value` must be provided
- `operator` must be valid if provided

---

## Component Inputs/Outputs

### WidgetComponent Inputs

- `widget: ID3Widget` (required) - Widget configuration and data
- `isEditMode: boolean` (optional, default: false) - Whether widget is in edit mode
- `filters: IFilterValues[]` (optional, default: []) - Merged filters (dashboard + widget)

### WidgetComponent Outputs

- `widgetUpdate: EventEmitter<ID3Widget>` - Emitted when widget configuration is updated
- `widgetDelete: EventEmitter<string>` - Emitted when widget delete action is triggered
- `widgetAction: EventEmitter<WidgetActionEvent>` - Emitted when any widget action is triggered
- `dataLoad: EventEmitter<any>` - Emitted when widget data is successfully loaded

---

## Data Flow

### Widget Initialization Flow

1. Component receives `widget` input
2. Validates widget configuration (FR-011)
3. Sets initial state: `loading: true`
4. Loads dynamic component based on `widget.type` (FR-001)
5. If component load fails → error state (FR-012)
6. If component loads successfully → sets `componentLoaded: true`
7. If `widget.dataSource` exists → loads data via DataService
8. If data load succeeds → sets `loading: false, data: <data>`
9. If data load fails → error state (FR-005)
10. If no data → empty state (FR-006)

### Configuration Update Flow

1. User opens configuration panel (FR-007)
2. User modifies settings
3. User clicks save
4. Component validates new configuration (FR-011)
5. Component updates internal widget state
6. Component emits `widgetUpdate` event with updated widget (FR-008)
7. Parent component receives update and persists changes

### Data Refresh Flow

1. User triggers refresh action
2. Component sets `loading: true`
3. Component reloads data via DataService
4. If successful → updates `data` and `lastUpdated`
5. If failed → error state
6. Component sets `loading: false`

---

## Validation Rules

### Widget Configuration Validation (FR-011)

**Required Fields**:
- `widget.id` must be a non-empty string (UUID format preferred)
- `widget.type` must be a valid widget type (one of 14 supported types)
- `widget.title` must be a non-empty string
- `widget.config` must be an object
- `widget.position` must be a valid GridsterItem

**Type-Specific Validation**:
- Chart widgets: `config.chartOptions` should be present
- Table widget: `config.tableOptions` should be present
- Filter widget: `config.filterOptions` should be present
- Tile widget: `config.tileOptions` should be present
- Markdown widget: `config.markdownOptions` should be present

**Data Source Validation**:
- If `dataSource.type === 'api'`: `dataSource.endpoint` must be present
- If `dataSource.type === 'static'`: `dataSource.data` must be present
- If `dataSource.type === 'computed'`: `dataSource.transform` must be a function

### Component Loading Validation (FR-012)

- Widget type must exist in component registry
- Component class must be loadable (not null/undefined)
- Component must be a valid Angular component (has @Component decorator)

---

## Error Scenarios

### Component Loading Failure

**Scenario**: Widget type component fails to load or doesn't exist

**Handling**:
- Set error state: `error: "Widget type '${type}' is not supported"`
- Display error UI with retry option
- Log error to console with context
- Emit error event to parent (optional)

### Data Loading Failure

**Scenario**: Data source fails to load data

**Handling**:
- Set error state: `error: "Failed to load data: ${errorMessage}"`
- Display error UI with retry option
- Log error to console with context
- Keep component loaded (don't unload component)

### Invalid Configuration

**Scenario**: Widget configuration is invalid or missing required fields

**Handling**:
- Prevent component rendering
- Set error state: `error: "Invalid widget configuration"`
- Display error UI
- Log validation errors to console

### Rapid Type Changes

**Scenario**: Widget type changes rapidly before previous component loads

**Handling**:
- Cancel previous component load if in progress
- Clean up previous component reference
- Load new component type
- Prevent race conditions with loading flags

---

## Performance Considerations

### State Updates

- Use OnPush change detection to minimize checks
- Debounce rapid configuration changes (300ms default)
- Memoize expensive calculations (data transformations)

### Component Loading

- Cache loaded component types to avoid re-loading
- Lazy load non-critical components (optional chart types)
- Preload critical components (line, bar charts) if possible

### Memory Management

- Clean up component references in `ngOnDestroy` (FR-013)
- Unsubscribe from all observables
- Clear timers and intervals
- Remove event listeners

---

## Relationships

```
WidgetComponent
├── Uses: ID3Widget (input)
├── Uses: IDataSource (from widget.dataSource)
├── Uses: ID3WidgetConfig (from widget.config)
├── Uses: IFilterValues[] (input + widget.filters)
├── Emits: WidgetActionEvent (output)
├── Emits: ID3Widget (widgetUpdate output)
├── Loads: Dynamic Component (based on widget.type)
│   ├── LineChartComponent (if type === 'line')
│   ├── BarChartComponent (if type === 'bar')
│   ├── TableWidgetComponent (if type === 'table')
│   └── ... (other widget type components)
└── Integrates: DataService (for data loading)
    └── Uses: IDataSource (to determine loading strategy)
```

---

## Future Extensibility

### New Widget Types

To add a new widget type:
1. Create component in appropriate directory (`charts/` or `components/`)
2. Add entry to component registry
3. Update `ID3Widget.type` union type (if needed)
4. Add type-specific configuration interface (if needed)
5. Update validation rules

### New Configuration Options

To add new configuration options:
1. Extend `ID3WidgetConfig` interface
2. Update configuration panel form schema
3. Update validation rules
4. Update component to handle new options

### New Actions

To add new widget actions:
1. Extend `WidgetActionEvent.action` union type
2. Add action button to widget header
3. Handle action in widget component
4. Emit appropriate event

