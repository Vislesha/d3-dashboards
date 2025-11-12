# Data Model: Dashboard Container Component

**Feature**: 001-dashboard-container  
**Date**: 2025-01-27  
**Status**: Complete

## Overview

This document defines the data models, interfaces, and entities for the Dashboard Container Component. The component manages widget layout, grid configuration, filter propagation, and dashboard state.

## Core Entities

### Dashboard Container

**Entity**: `DashboardContainerComponent`

**Description**: Main component that manages the grid layout and widget rendering. Contains widgets array, grid configuration, edit mode state, and filter values.

**Type**: Angular Standalone Component

**Properties**:
- `widgets: ID3Widget[]` - Array of dashboard widgets (Input)
- `gridConfig: IGridConfiguration` - Grid layout configuration (Input, optional)
- `isEditMode: boolean` - Edit mode toggle flag (Input)
- `filterValues: IFilterValues[]` - Global filter values for all widgets (Input)
- `widgetChange: EventEmitter<ID3Widget[]>` - Emitted when widgets array changes (Output)
- `widgetSelect: EventEmitter<ID3Widget>` - Emitted when a widget is selected (Output)
- `filterChange: EventEmitter<IFilterValues[]>` - Emitted when filters change (Output)

**State Management**:
- Local copy of widgets array for editing
- Gridster configuration state
- Edit mode state
- Filter debounce state

**Validation Rules**:
- Widgets array must not be null (can be empty)
- Each widget must have unique ID
- Widget positions must not overlap
- Widget positions must be within grid boundaries

### Widget

**Entity**: `ID3Widget`

**Description**: Represents a single dashboard widget with properties including id, type, position (grid coordinates), title, configuration, data source, filters, and styling.

**Interface Definition**:
```typescript
interface ID3Widget {
  id: string;                    // Unique identifier (UUID)
  type: WidgetType;              // Widget type (chart, table, filter, etc.)
  position: IWidgetPosition;      // Grid position and dimensions
  title: string;                 // Widget display title
  config: ID3WidgetConfig;        // Widget-specific configuration
  dataSource?: IDataSource;       // Optional data source
  filters?: IFilterValues[];      // Widget-specific filters
  style?: IWidgetStyle;           // Optional styling
}
```

**Properties**:
- `id: string` - **Required**. Unique identifier using UUID format. Must be unique across all widgets in dashboard.
- `type: WidgetType` - **Required**. Type of widget. See WidgetType enum below.
- `position: IWidgetPosition` - **Required**. Grid position and dimensions. See IWidgetPosition interface.
- `title: string` - **Required**. Display title for the widget.
- `config: ID3WidgetConfig` - **Required**. Widget-specific configuration object. Structure varies by widget type.
- `dataSource?: IDataSource` - **Optional**. Data source for widget data. See IDataSource interface.
- `filters?: IFilterValues[]` - **Optional**. Widget-specific filter values. Merged with dashboard-level filters.
- `style?: IWidgetStyle` - **Optional**. Widget styling configuration. See IWidgetStyle interface.

**WidgetType Enum**:
```typescript
type WidgetType = 
  // Required for v1
  | 'line' 
  | 'bar' 
  // Optional for v1 - Future implementation (will be implemented on a need basis)
  | 'pie' 
  | 'scatter' 
  | 'area' 
  | 'heatmap' 
  | 'treemap' 
  | 'force-graph' 
  | 'geo-map' 
  | 'gauge' 
  // Additional widget types
  | 'table' 
  | 'filter' 
  | 'tile' 
  | 'markdown';
```

**Validation Rules**:
- ID must be valid UUID format
- Type must be one of the defined WidgetType values
- Position must be valid (x >= 0, y >= 0, cols > 0, rows > 0)
- Title must not be empty
- Config must match widget type requirements

**State Transitions**:
- `Created` → Widget created with default position
- `Positioned` → Widget positioned in grid
- `Configured` → Widget configuration set
- `Loaded` → Widget data loaded
- `Rendered` → Widget rendered in dashboard
- `Updated` → Widget configuration or data updated
- `Removed` → Widget removed from dashboard

### Grid Configuration

**Entity**: `IGridConfiguration`

**Description**: Defines the grid layout properties including column count, row height, margins, drag/resize behavior, and responsive breakpoints.

**Interface Definition**:
```typescript
interface IGridConfiguration {
  columns: number;                // Number of columns (default: 12)
  rowHeight: number;              // Height of each row in pixels (default: 100)
  margin: number;                // Margin between widgets in pixels (default: 10)
  minCols: number;                // Minimum columns (default: 1)
  maxCols: number;                // Maximum columns (default: 12)
  minRows: number;                // Minimum rows (default: 1)
  maxRows?: number;               // Maximum rows (optional)
  draggable: boolean;             // Enable drag (default: false, controlled by edit mode)
  resizable: boolean;             // Enable resize (default: false, controlled by edit mode)
  preventCollision: boolean;      // Prevent widget overlap (default: true)
  responsive: boolean;           // Enable responsive layout (default: true)
  breakpoints?: IResponsiveBreakpoints; // Responsive breakpoint configuration
}
```

**Properties**:
- `columns: number` - **Required**. Number of columns in grid. Default: 12. Must be between 1 and 24.
- `rowHeight: number` - **Required**. Height of each grid row in pixels. Default: 100. Must be > 0.
- `margin: number` - **Required**. Margin between widgets in pixels. Default: 10. Must be >= 0.
- `minCols: number` - **Required**. Minimum number of columns. Default: 1. Must be > 0.
- `maxCols: number` - **Required**. Maximum number of columns. Default: 12. Must be >= minCols.
- `minRows: number` - **Required**. Minimum number of rows. Default: 1. Must be > 0.
- `maxRows?: number` - **Optional**. Maximum number of rows. If not set, no maximum limit.
- `draggable: boolean` - **Required**. Enable drag functionality. Default: false. Controlled by edit mode.
- `resizable: boolean` - **Required**. Enable resize functionality. Default: false. Controlled by edit mode.
- `preventCollision: boolean` - **Required**. Prevent widget overlap during drag. Default: true.
- `responsive: boolean` - **Required**. Enable responsive layout adaptation. Default: true.
- `breakpoints?: IResponsiveBreakpoints` - **Optional**. Responsive breakpoint configuration. See IResponsiveBreakpoints interface.

**IResponsiveBreakpoints Interface**:
```typescript
interface IResponsiveBreakpoints {
  mobile: number;      // Mobile breakpoint (default: 320)
  tablet: number;     // Tablet breakpoint (default: 768)
  desktop: number;    // Desktop breakpoint (default: 1024)
  mobileCols: number; // Columns for mobile (default: 4)
  tabletCols: number; // Columns for tablet (default: 8)
  desktopCols: number; // Columns for desktop (default: 12)
}
```

**Validation Rules**:
- Columns must be between 1 and 24
- Row height must be > 0
- Margin must be >= 0
- minCols must be > 0 and <= maxCols
- minRows must be > 0
- maxRows (if set) must be >= minRows
- Breakpoints must be in ascending order (mobile < tablet < desktop)

**Default Configuration**:
```typescript
const DEFAULT_GRID_CONFIG: IGridConfiguration = {
  columns: 12,
  rowHeight: 100,
  margin: 10,
  minCols: 1,
  maxCols: 12,
  minRows: 1,
  draggable: false,
  resizable: false,
  preventCollision: true,
  responsive: true,
  breakpoints: {
    mobile: 320,
    tablet: 768,
    desktop: 1024,
    mobileCols: 4,
    tabletCols: 8,
    desktopCols: 12
  }
};
```

### Widget Position

**Entity**: `IWidgetPosition`

**Description**: Grid coordinates (x, y) and dimensions (cols, rows) that determine widget placement in the grid.

**Interface Definition**:
```typescript
interface IWidgetPosition {
  x: number;    // X coordinate (column position, 0-based)
  y: number;    // Y coordinate (row position, 0-based)
  cols: number; // Width in columns
  rows: number; // Height in rows
}
```

**Properties**:
- `x: number` - **Required**. X coordinate (column position). Must be >= 0 and < grid columns.
- `y: number` - **Required**. Y coordinate (row position). Must be >= 0.
- `cols: number` - **Required**. Width in columns. Must be > 0 and <= (grid columns - x).
- `rows: number` - **Required**. Height in rows. Must be > 0.

**Validation Rules**:
- x must be >= 0 and < grid columns
- y must be >= 0
- cols must be > 0 and <= (grid columns - x)
- rows must be > 0
- Position must not overlap with other widgets (when preventCollision is true)
- Position must be within grid boundaries

**Compatibility with GridsterItem**:
This interface is compatible with `GridsterItem` from angular-gridster2:
```typescript
interface GridsterItem {
  x: number;
  y: number;
  cols: number;
  rows: number;
}
```

### Filter Values

**Entity**: `IFilterValues`

**Description**: Array of filter objects that contain key-value pairs with operators for filtering data across widgets.

**Interface Definition**:
```typescript
interface IFilterValues {
  key: string;                    // Filter key (field name)
  value: any;                     // Filter value
  operator: FilterOperator;       // Filter operator
  dataType?: FilterDataType;      // Optional data type for validation
}
```

**FilterOperator Enum**:
```typescript
type FilterOperator = 
  | 'equals' 
  | 'notEquals' 
  | 'contains' 
  | 'notContains' 
  | 'greaterThan' 
  | 'greaterThanOrEqual' 
  | 'lessThan' 
  | 'lessThanOrEqual' 
  | 'in' 
  | 'notIn' 
  | 'between' 
  | 'isNull' 
  | 'isNotNull';
```

**FilterDataType Enum**:
```typescript
type FilterDataType = 'string' | 'number' | 'date' | 'boolean' | 'array';
```

**Properties**:
- `key: string` - **Required**. Filter key (field name to filter on). Must not be empty.
- `value: any` - **Required**. Filter value. Type depends on operator and dataType.
- `operator: FilterOperator` - **Required**. Filter operator. See FilterOperator enum above.
- `dataType?: FilterDataType` - **Optional**. Data type for validation and formatting. Default inferred from value.

**Validation Rules**:
- Key must not be empty
- Value must match operator requirements (e.g., 'between' requires array of 2 values)
- Operator must be valid FilterOperator value
- DataType (if provided) must match value type

**Examples**:
```typescript
// String filter
{ key: 'name', value: 'John', operator: 'contains', dataType: 'string' }

// Number filter
{ key: 'age', value: 25, operator: 'greaterThan', dataType: 'number' }

// Date range filter
{ key: 'date', value: [new Date('2024-01-01'), new Date('2024-12-31')], operator: 'between', dataType: 'date' }

// Array filter
{ key: 'status', value: ['active', 'pending'], operator: 'in', dataType: 'array' }
```

### Widget Configuration

**Entity**: `ID3WidgetConfig`

**Description**: Widget-specific configuration object. Structure varies by widget type.

**Type**: `Record<string, any>` (base type, specific interfaces per widget type)

**Common Properties** (applies to most widget types):
- `showTitle?: boolean` - Show widget title (default: true)
- `showLegend?: boolean` - Show legend (for charts, default: true)
- `showTooltip?: boolean` - Show tooltips (default: true)
- `colors?: string[]` - Color palette
- `animation?: boolean` - Enable animations (default: true)
- `responsive?: boolean` - Enable responsive behavior (default: true)

**Widget-Specific Configurations**:
- Chart widgets: Chart-specific options (axes, scales, etc.)
- Table widget: Column definitions, pagination, sorting
- Filter widget: Filter field definitions, operators
- Tile widget: KPI display format, value formatting
- Markdown widget: Markdown content, rendering options

### Data Source

**Entity**: `IDataSource`

**Description**: Data source configuration for widget data.

**Interface Definition**:
```typescript
interface IDataSource {
  type: DataSourceType;           // Data source type
  endpoint?: string;               // API endpoint (for 'api' type)
  method?: 'GET' | 'POST';         // HTTP method (for 'api' type)
  params?: Record<string, any>;   // Request parameters
  data?: any[];                    // Static data (for 'static' type)
  transform?: (data: any) => any; // Data transformation function
}
```

**DataSourceType Enum**:
```typescript
type DataSourceType = 'api' | 'static' | 'computed';
```

**Properties**:
- `type: DataSourceType` - **Required**. Data source type.
- `endpoint?: string` - **Optional**. API endpoint URL. Required for 'api' type.
- `method?: 'GET' | 'POST'` - **Optional**. HTTP method. Default: 'GET'. Used for 'api' type.
- `params?: Record<string, any>` - **Optional**. Request parameters. Used for 'api' type.
- `data?: any[]` - **Optional**. Static data array. Required for 'static' type.
- `transform?: (data: any) => any` - **Optional**. Data transformation function. Applied after data fetch.

**Validation Rules**:
- Type must be valid DataSourceType value
- Endpoint required for 'api' type
- Data required for 'static' type
- Transform function must be valid function if provided

### Widget Style

**Entity**: `IWidgetStyle`

**Description**: Widget styling configuration.

**Interface Definition**:
```typescript
interface IWidgetStyle {
  backgroundColor?: string;    // Background color
  borderColor?: string;         // Border color
  borderWidth?: number;         // Border width in pixels
  borderRadius?: number;        // Border radius in pixels
  padding?: number;             // Padding in pixels
  customCss?: string;          // Custom CSS classes
}
```

**Properties**:
- All properties are optional
- Colors can be hex, rgb, or named colors
- Dimensions in pixels (numbers)
- CustomCss can contain multiple CSS class names

## Relationships

### Entity Relationships

```
DashboardContainerComponent
  ├── has many ID3Widget (1:N)
  ├── has one IGridConfiguration (1:1)
  ├── has many IFilterValues (1:N)
  └── manages IWidgetPosition (via ID3Widget)

ID3Widget
  ├── has one IWidgetPosition (1:1)
  ├── has one ID3WidgetConfig (1:1)
  ├── has one IDataSource (0:1, optional)
  ├── has many IFilterValues (0:N, optional)
  └── has one IWidgetStyle (0:1, optional)

IGridConfiguration
  └── defines constraints for IWidgetPosition

IFilterValues
  └── applied to ID3Widget data via IDataSource
```

### Data Flow

```
Parent Component
  └── provides widgets: ID3Widget[]
      └── DashboardContainerComponent
          ├── manages local copy of widgets
          ├── applies IGridConfiguration
          ├── propagates IFilterValues to widgets
          └── emits widgetChange, widgetSelect, filterChange events
              └── Parent Component updates state
```

## State Management

### Component State

**Local State**:
- `_widgets: ID3Widget[]` - Local copy of widgets array
- `gridsterOptions: GridsterConfig` - Gridster configuration (derived from IGridConfiguration)
- `filterSubject: BehaviorSubject<IFilterValues[]>` - Filter state for reactive propagation

**Derived State**:
- Edit mode controls drag/resize via gridsterOptions
- Widget positions validated against grid boundaries
- Filter values debounced before propagation

### State Transitions

**Widget Lifecycle**:
1. `Created` - Widget added to array
2. `Positioned` - Widget positioned in grid
3. `Rendered` - Widget rendered in dashboard
4. `Updated` - Widget configuration or position updated
5. `Removed` - Widget removed from array

**Edit Mode Lifecycle**:
1. `View Mode` - Default state, drag/resize disabled
2. `Edit Mode` - Drag/resize enabled, edit controls visible
3. `Saving` - Changes being saved (optional intermediate state)

**Filter Lifecycle**:
1. `No Filters` - No filters applied
2. `Filters Applied` - Filters active, widgets updating
3. `Filters Cleared` - Filters removed, widgets showing unfiltered data

## Validation Rules Summary

### Mandatory Validations

1. **Widget ID Uniqueness**: All widget IDs must be unique within dashboard
2. **Widget Position Validity**: Positions must be within grid boundaries
3. **Widget Non-Overlap**: Widgets must not overlap (when preventCollision is true)
4. **Filter Key Validity**: Filter keys must not be empty
5. **Grid Configuration**: Grid config must have valid column/row constraints
6. **Data Source Validity**: Data sources must have required properties for their type

### Optional Validations

1. **Widget Type Compatibility**: Widget config must match widget type
2. **Filter Value Type**: Filter values should match declared dataType
3. **Data Source Endpoint**: API endpoints should be valid URLs
4. **Style Values**: Style values should be valid CSS values

## Data Persistence

### Export Format

Dashboard configuration exported as JSON:
```typescript
interface IDashboardExport {
  version: string;              // Export format version
  widgets: ID3Widget[];         // Widgets array
  gridConfig: IGridConfiguration; // Grid configuration
  filters: IFilterValues[];     // Filter values
  metadata: {
    exportedAt: string;          // ISO timestamp
    exportedBy?: string;          // User identifier (optional)
  };
}
```

### Import Validation

- Validate JSON structure
- Validate widget IDs are unique
- Validate widget positions
- Validate grid configuration
- Validate filter values
- Handle version compatibility

## Conclusion

This data model defines all entities, interfaces, and relationships for the Dashboard Container Component. All entities must be properly typed and validated to ensure type safety and data integrity throughout the component lifecycle.

