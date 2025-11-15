/**
 * Line Chart Component interfaces and type definitions
 */

import { IChartOptions, IMargins } from './chart.interface';
import { IDataSource } from './data-source.interface';
import { IFilterValues } from './filter.interface';
import * as d3 from 'd3';

/**
 * Single data point in a line chart series
 */
export interface ILineChartDataPoint {
  /** X-axis value (number for numeric, Date for time-series, string for categorical) */
  x: number | Date | string;
  /** Y-axis value (number) */
  y: number | null;
  /** Optional metadata for tooltip display */
  metadata?: Record<string, any>;
}

/**
 * Line style configuration
 */
export interface ILineStyle {
  /** Line stroke color */
  color?: string;
  /** Line stroke width */
  strokeWidth?: number;
  /** Line stroke dash array (for dashed lines) */
  strokeDasharray?: string;
  /** Line opacity (0-1) */
  opacity?: number;
}

/**
 * Collection of related data points that form a single line on the chart
 */
export interface ILineChartSeries {
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

/**
 * Main data structure passed to the line chart component
 */
export interface ILineChartData {
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

/**
 * Zoom state tracking interface
 */
export interface IZoomState {
  /** Current zoom transform */
  transform: d3.ZoomTransform;
  /** Initial transform (for reset) */
  initialTransform: d3.ZoomTransform;
  /** Whether chart is currently zoomed */
  isZoomed: boolean;
  /** Visible domain (x-axis range) */
  visibleDomain?: [number, number] | [Date, Date];
}

/**
 * Line chart tooltip configuration (extends base tooltip options)
 */
export interface ILineChartTooltipOptions {
  /** Whether tooltip is enabled */
  enabled?: boolean;
  /** Custom formatter function */
  formatter?: (point: ILineChartDataPoint, series: ILineChartSeries) => string;
  /** Tooltip position ('mouse' | 'point') */
  position?: 'mouse' | 'point';
  /** Additional tooltip options from base interface */
  [key: string]: any;
}

/**
 * Line chart animation configuration (extends base animation options)
 */
export interface ILineChartAnimationOptions {
  /** Whether animation is enabled */
  enabled?: boolean;
  /** Animation duration in milliseconds */
  duration?: number;
  /** Animation easing function */
  easing?: string;
  /** Additional animation options from base interface */
  [key: string]: any;
}

/**
 * Line chart configuration interface
 * Note: Does not extend IChartOptions to avoid type conflicts with tooltip and animation
 */
export interface ILineChartConfiguration {
  /** Chart width in pixels */
  width?: number;
  /** Chart height in pixels */
  height?: number;
  /** Chart margins */
  margins?: IMargins;
  /** Color array for chart series */
  colors?: string[];

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
  tooltip?: ILineChartTooltipOptions;

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
  animation?: ILineChartAnimationOptions;

  /** Empty state configuration */
  emptyState?: {
    /** Message to display when no data */
    message?: string;
    /** Icon to display */
    icon?: string;
  };

  /** Additional chart-specific options */
  [key: string]: any;
}

