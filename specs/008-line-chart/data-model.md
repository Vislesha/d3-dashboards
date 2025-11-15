# Data Model: Line Chart Component

**Feature**: 008-line-chart  
**Date**: 2025-01-27  
**Status**: Complete

## Overview

This document defines the data models, interfaces, and type definitions for the Line Chart Component.

---

## Core Entities

### 1. LineChartDataPoint

Represents a single data point in a line chart series.

```typescript
interface ILineChartDataPoint {
  /** X-axis value (number for numeric, Date for time-series, string for categorical) */
  x: number | Date | string;
  /** Y-axis value (number) */
  y: number | null;
  /** Optional metadata for tooltip display */
  metadata?: Record<string, any>;
}
```

**Validation Rules**:
- `x` must be a valid number, Date, or string
- `y` must be a number or null (null indicates missing data)
- `metadata` is optional and can contain any additional information

**State Transitions**: N/A (immutable data structure)

---

### 2. LineChartSeries

Represents a collection of data points that form a single line on the chart.

```typescript
interface ILineChartSeries {
  /** Unique identifier for the series */
  id: string;
  /** Human-readable name for the series (displayed in legend and tooltips) */
  name: string;
  /** Array of data points */
  data: ILineChartDataPoint[];
  /** Optional color for the line (defaults to color palette) */
  color?: string;
  /** Optional visibility flag (defaults to true) */
  visible?: boolean;
  /** Optional line style configuration */
  style?: ILineStyle;
}
```

**Validation Rules**:
- `id` must be unique across all series
- `name` must be a non-empty string
- `data` must be a non-empty array
- `color` must be a valid CSS color value if provided
- `visible` defaults to `true` if not provided

**State Transitions**: 
- Series can be shown/hidden via `visible` property
- Data can be updated, triggering chart re-render

---

### 3. LineChartData

Main data structure passed to the line chart component.

```typescript
interface ILineChartData {
  /** Array of data series (multiple series create multiple lines) */
  series: ILineChartSeries[];
  /** Optional metadata about the dataset */
  metadata?: {
    /** Dataset title */
    title?: string;
    /** Dataset description */
    description?: string;
    /** Data source information */
    source?: string;
  };
}
```

**Validation Rules**:
- `series` must be a non-empty array
- Each series must have a unique `id`
- All series must have compatible x-axis value types (all numeric, all Date, or all string)

**State Transitions**:
- Data can be updated via `@Input()` property
- Updates trigger chart re-render using enter/update/exit pattern

---

### 4. LineChartConfiguration

Configuration options for the line chart component.

```typescript
interface ILineChartConfiguration extends IChartOptions {
  /** Chart dimensions */
  width?: number;
  height?: number;
  margins?: IMargins;
  
  /** Data series configuration */
  series?: {
    /** Default colors for series (if not specified per-series) */
    colors?: string[];
    /** Curve type for lines */
    curveType?: 'linear' | 'monotone' | 'basis' | 'cardinal';
    /** Line stroke width */
    strokeWidth?: number;
  };
  
  /** X-axis configuration */
  xAxis?: {
    /** Axis label */
    label?: string;
    /** Scale type */
    scaleType?: 'linear' | 'time' | 'ordinal';
    /** Tick format function */
    tickFormat?: (d: any) => string;
    /** Number of ticks */
    ticks?: number;
    /** Whether axis is visible */
    visible?: boolean;
  };
  
  /** Y-axis configuration */
  yAxis?: {
    /** Axis label */
    label?: string;
    /** Scale type */
    scaleType?: 'linear' | 'log';
    /** Tick format function */
    tickFormat?: (d: any) => string;
    /** Number of ticks */
    ticks?: number;
    /** Whether axis is visible */
    visible?: boolean;
    /** Domain padding (extends domain by percentage) */
    domainPadding?: number;
  };
  
  /** Tooltip configuration */
  tooltip?: {
    /** Whether tooltip is enabled */
    enabled?: boolean;
    /** Custom formatter function */
    formatter?: (point: ILineChartDataPoint, series: ILineChartSeries) => string;
    /** Tooltip position ('mouse' | 'point') */
    position?: 'mouse' | 'point';
  };
  
  /** Zoom and pan configuration */
  zoom?: {
    /** Whether zoom is enabled */
    enabled?: boolean;
    /** Minimum zoom level */
    minZoom?: number;
    /** Maximum zoom level */
    maxZoom?: number;
    /** Whether pan is enabled */
    panEnabled?: boolean;
    /** Whether mouse wheel zoom is enabled */
    wheelZoomEnabled?: boolean;
    /** Whether brush selection zoom is enabled */
    brushZoomEnabled?: boolean;
  };
  
  /** Animation configuration */
  animation?: {
    /** Whether animation is enabled */
    enabled?: boolean;
    /** Animation duration in milliseconds */
    duration?: number;
    /** Animation easing function */
    easing?: string;
  };
  
  /** Empty state configuration */
  emptyState?: {
    /** Message to display when no data */
    message?: string;
    /** Icon to display */
    icon?: string;
  };
}
```

**Validation Rules**:
- `width` and `height` must be positive numbers if provided
- `margins` must have all properties (top, right, bottom, left) as non-negative numbers
- `series.curveType` must be one of the supported curve types
- `xAxis.scaleType` and `yAxis.scaleType` must be compatible with data types
- `zoom.minZoom` must be >= 1
- `zoom.maxZoom` must be > `zoom.minZoom`

**Default Values**:
- `width`: 800
- `height`: 400
- `margins`: `{ top: 20, right: 20, bottom: 40, left: 60 }`
- `series.curveType`: `'monotone'`
- `series.strokeWidth`: 2
- `xAxis.visible`: `true`
- `yAxis.visible`: `true`
- `tooltip.enabled`: `true`
- `tooltip.position`: `'mouse'`
- `zoom.enabled`: `true`
- `zoom.minZoom`: 1
- `zoom.maxZoom`: 10
- `zoom.panEnabled`: `true`
- `zoom.wheelZoomEnabled`: `true`
- `zoom.brushZoomEnabled`: `false`
- `animation.enabled`: `true`
- `animation.duration`: 750
- `animation.easing`: `'ease-in-out'`

---

### 5. LineStyle

Configuration for line visual styling.

```typescript
interface ILineStyle {
  /** Line stroke color */
  color?: string;
  /** Line stroke width */
  strokeWidth?: number;
  /** Line stroke dash array (for dashed lines) */
  strokeDasharray?: string;
  /** Line opacity (0-1) */
  opacity?: number;
}
```

**Validation Rules**:
- `color` must be a valid CSS color value
- `strokeWidth` must be a positive number
- `opacity` must be between 0 and 1

---

### 6. ZoomState

Tracks the current zoom and pan state of the chart.

```typescript
interface IZoomState {
  /** Current zoom transform */
  transform: d3.ZoomTransform;
  /** Initial transform (for reset) */
  initialTransform: d3.ZoomTransform;
  /** Whether chart is currently zoomed */
  isZoomed: boolean;
  /** Visible domain (x-axis range) */
  visibleDomain?: [number, number] | [Date, Date];
}
```

**State Transitions**:
- Initial state: `transform = d3.zoomIdentity`, `isZoomed = false`
- On zoom: `transform` updated, `isZoomed = true`, `visibleDomain` calculated
- On reset: `transform = initialTransform`, `isZoomed = false`, `visibleDomain = undefined`

---

## Component Inputs/Outputs

### Component Inputs

```typescript
@Input() data: ILineChartData;
@Input() config: ILineChartConfiguration;
@Input() width?: number;  // Overrides config.width
@Input() height?: number; // Overrides config.height
```

### Component Outputs

```typescript
@Output() pointClick: EventEmitter<{ point: ILineChartDataPoint; series: ILineChartSeries }>;
@Output() pointHover: EventEmitter<{ point: ILineChartDataPoint; series: ILineChartSeries }>;
@Output() zoomChange: EventEmitter<IZoomState>;
@Output() error: EventEmitter<Error>;
```

---

## Data Flow

1. **Initialization**: Component receives `data` and `config` via `@Input()`
2. **Validation**: Component validates data and configuration
3. **Rendering**: Component creates D3 scales, axes, and line generators
4. **Data Binding**: Component binds data to SVG elements using enter/update/exit pattern
5. **Interaction**: User interactions (hover, zoom, pan) trigger output events
6. **Updates**: When `data` or `config` changes, component re-renders using update pattern
7. **Cleanup**: On component destruction, D3 selections are cleaned up

---

## Edge Cases

### Missing/Null Values
- Null `y` values are handled using `d3.line().defined()`
- Lines are broken at null values (gaps in the line)
- Tooltips show "No data" for null points

### Empty Data
- Empty `series` array displays empty state message
- Empty `data` array within a series hides that series line
- All series empty displays empty state

### Large Datasets
- Datasets > 1000 points trigger data sampling
- Sampling maintains min/max values for visual accuracy
- Path simplification reduces rendering complexity

### Non-Chronological X-Values
- Data is sorted by x-value before rendering
- Time-series data is sorted chronologically
- Categorical data maintains original order

### Overlapping Data Points
- Tooltips show all series values at the same x-coordinate
- Multiple points at same location are all accessible via hover

### Zoom Bounds
- Zoom is constrained to data domain bounds
- Pan is constrained to prevent panning beyond data
- Reset zoom restores full data view

---

## Relationships

```
ILineChartData
  └── ILineChartSeries[] (1..*)
      └── ILineChartDataPoint[] (1..*)

ILineChartConfiguration
  ├── IChartOptions (extends)
  ├── SeriesConfig
  ├── AxisConfig (x, y)
  ├── TooltipConfig
  ├── ZoomConfig
  └── AnimationConfig

ILineChartComponent
  ├── Input: ILineChartData
  ├── Input: ILineChartConfiguration
  └── Output: Events (pointClick, pointHover, zoomChange, error)
```

---

## Type Definitions Summary

- `ILineChartDataPoint`: Single data point
- `ILineChartSeries`: Collection of data points forming a line
- `ILineChartData`: Complete dataset with multiple series
- `ILineChartConfiguration`: Chart configuration options
- `ILineStyle`: Line visual styling
- `IZoomState`: Zoom and pan state tracking

All types will be exported through `projects/d3-dashboards/src/lib/entities/line-chart.interface.ts` and made available via `public-api.ts`.

