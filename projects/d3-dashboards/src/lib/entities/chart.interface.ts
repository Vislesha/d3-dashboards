/**
 * Chart Service interfaces and type definitions
 */

/**
 * Chart type definition - all supported chart types
 */
export type ChartType =
  | 'line'
  | 'bar'
  | 'pie'
  | 'scatter'
  | 'area'
  | 'heatmap'
  | 'treemap'
  | 'force-graph'
  | 'geo-map'
  | 'gauge';

/**
 * Chart configuration interface
 */
export interface IChartConfig {
  /** Type of chart to create */
  type: ChartType;
  /** Data array for the chart (optional) */
  data?: any[];
  /** Chart-specific options (dimensions, margins, colors, axes, etc.) */
  options?: IChartOptions;
  /** Additional chart-specific configuration */
  [key: string]: any;
}

/**
 * Chart options interface
 */
export interface IChartOptions {
  /** Chart width in pixels */
  width?: number;
  /** Chart height in pixels */
  height?: number;
  /** Chart margins */
  margin?: IMargins;
  /** Color array for chart series */
  colors?: string[];
  /** Axis options */
  axes?: IAxisOptions;
  /** Tooltip options */
  tooltip?: ITooltipOptions;
  /** Legend options */
  legend?: ILegendOptions;
  /** Animation options */
  animation?: IAnimationOptions;
  /** Additional chart-specific options */
  [key: string]: any;
}

/**
 * Margins interface
 */
export interface IMargins {
  /** Top margin in pixels */
  top: number;
  /** Right margin in pixels */
  right: number;
  /** Bottom margin in pixels */
  bottom: number;
  /** Left margin in pixels */
  left: number;
}

/**
 * Chart instance interface
 */
export interface IChartInstance {
  /** Type of chart instance */
  type: ChartType;
  /** Method to render chart to DOM container */
  render: (container: HTMLElement) => void;
  /** Method to update chart with new data */
  update: (data: any[]) => void;
  /** Method to clean up chart resources */
  destroy: () => void;
  /** Method to get current chart configuration */
  getConfig: () => IChartConfig;
}

/**
 * Scale type definition - all supported D3 scale types
 */
export type ScaleType =
  | 'linear'
  | 'time'
  | 'ordinal'
  | 'band'
  | 'log'
  | 'pow'
  | 'sqrt';

/**
 * Scale configuration interface
 */
export interface IScaleConfig {
  /** Type of D3 scale to create */
  type: ScaleType;
  /** Input domain for the scale */
  domain: [number, number] | string[] | Date[];
  /** Output range for the scale (tuple for continuous scales, array for ordinal scales) */
  range: [number, number] | number[] | string[];
  /** Whether to extend domain to nice round values (for continuous scales) */
  nice?: boolean;
  /** Padding between bands (0-1, for band scales) */
  padding?: number;
  /** Additional scale-specific configuration */
  [key: string]: any;
}

/**
 * Axis orientation type definition
 */
export type AxisOrientation = 'bottom' | 'top' | 'left' | 'right';

/**
 * Axis configuration interface
 */
export interface IAxisConfig {
  /** D3 scale to use for the axis */
  scale: any; // D3 AxisScale type - using any to avoid D3 type dependency here
  /** Orientation of the axis */
  orientation: AxisOrientation;
  /** Number of ticks to display */
  ticks?: number;
  /** Function to format tick labels */
  tickFormat?: (d: any) => string;
  /** Size of ticks */
  tickSize?: number;
  /** Inner tick size */
  tickSizeInner?: number;
  /** Outer tick size */
  tickSizeOuter?: number;
}

/**
 * Color palette interface
 */
export interface IColorPalette {
  /** Unique name identifier for the palette */
  name: string;
  /** Array of color values (hex, rgb, named colors) - minimum 10 colors */
  colors: string[];
  /** Human-readable description of the palette */
  description?: string;
}

/**
 * Validation result interface
 */
export interface IValidationResult {
  /** Whether the configuration is valid */
  valid: boolean;
  /** Array of validation error messages */
  errors: string[];
}

/**
 * Axis options interface (for chart options)
 */
export interface IAxisOptions {
  /** X-axis configuration */
  x?: IAxisConfig;
  /** Y-axis configuration */
  y?: IAxisConfig;
  /** Additional axis configurations */
  [key: string]: any;
}

/**
 * Tooltip options interface
 */
export interface ITooltipOptions {
  /** Whether tooltip is enabled */
  enabled?: boolean;
  /** Tooltip formatter function */
  formatter?: (d: any) => string;
  /** Additional tooltip options */
  [key: string]: any;
}

/**
 * Legend options interface
 */
export interface ILegendOptions {
  /** Whether legend is enabled */
  enabled?: boolean;
  /** Legend position */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Additional legend options */
  [key: string]: any;
}

/**
 * Animation options interface
 */
export interface IAnimationOptions {
  /** Whether animation is enabled */
  enabled?: boolean;
  /** Animation duration in milliseconds */
  duration?: number;
  /** Animation easing function */
  easing?: string;
  /** Additional animation options */
  [key: string]: any;
}

