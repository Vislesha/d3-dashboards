import { Injectable } from '@angular/core';
import {
  IChartConfig,
  IChartInstance,
  ChartType,
  IScaleConfig,
  IAxisConfig,
  IColorPalette,
  IMargins,
  IValidationResult,
  ScaleType,
  AxisOrientation,
} from '../entities/chart.interface';
import {
  ChartServiceError,
  InvalidChartTypeError,
  InvalidChartConfigError,
  InvalidScaleConfigError,
  InvalidAxisConfigError,
  PaletteNotFoundError,
  InvalidColorPaletteError,
} from './chart.service.types';
import { calculateMargins as calculateMarginsUtil } from '../utils/d3-utils';
import {
  createScale as createScaleUtil,
  updateScale as updateScaleUtil,
} from '../utils/scale-helpers';
import { createAxis as createAxisUtil, updateAxis as updateAxisUtil } from '../utils/axis-helpers';
import { ColorPaletteManager } from '../utils/color-palette';

/**
 * Chart Service
 *
 * Provides chart factory methods, D3 utility functions, scale and axis helpers,
 * and color palette management for the D3 dashboards application.
 */
@Injectable({
  providedIn: 'root',
})
export class ChartService {
  /**
   * Chart factory registry - maps chart types to their factory functions
   */
  private readonly chartFactories: Record<ChartType, (config: IChartConfig) => IChartInstance>;

  /**
   * Color palette manager instance
   */
  private readonly colorPaletteManager: ColorPaletteManager;

  /**
   * Creates a new instance of ChartService
   */
  constructor() {
    // Initialize chart factory registry
    this.chartFactories = {
      line: (config) => this.createLineChart(config),
      bar: (config) => this.createBarChart(config),
      pie: (config) => this.createPieChart(config),
      scatter: (config) => this.createScatterPlot(config),
      area: (config) => this.createAreaChart(config),
      heatmap: (config) => this.createHeatmap(config),
      treemap: (config) => this.createTreemap(config),
      'force-graph': (config) => this.createForceGraph(config),
      'geo-map': (config) => this.createGeoMap(config),
      gauge: (config) => this.createGauge(config),
    };

    // Initialize color palette manager
    this.colorPaletteManager = new ColorPaletteManager();
  }

  /**
   * Validates if a chart type is supported
   * @param chartType Chart type to validate
   * @returns True if chart type is valid, false otherwise
   */
  private isValidChartType(chartType: string): chartType is ChartType {
    const validTypes: ChartType[] = [
      'line',
      'bar',
      'pie',
      'scatter',
      'area',
      'heatmap',
      'treemap',
      'force-graph',
      'geo-map',
      'gauge',
    ];
    return validTypes.includes(chartType as ChartType);
  }

  /**
   * Validates a chart configuration before creation
   * @param config Chart configuration to validate
   * @returns Validation result with errors array
   */
  validateChartConfig(config: IChartConfig): IValidationResult {
    const errors: string[] = [];

    // Validate chart type
    if (!config.type) {
      errors.push('Chart type is required');
    } else if (!this.isValidChartType(config.type)) {
      errors.push(`Invalid chart type: ${config.type}`);
    }

    // Validate data if provided
    if (config.data !== undefined && !Array.isArray(config.data)) {
      errors.push('Data must be an array if provided');
    }

    // Validate options if provided
    if (config.options) {
      if (config.options.width !== undefined && config.options.width <= 0) {
        errors.push('Width must be a positive number');
      }
      if (config.options.height !== undefined && config.options.height <= 0) {
        errors.push('Height must be a positive number');
      }
      if (config.options.margin) {
        const margin = config.options.margin;
        if (margin.top < 0 || margin.right < 0 || margin.bottom < 0 || margin.left < 0) {
          errors.push('All margin values must be non-negative');
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Creates a chart instance using factory methods based on chart type and configuration
   * @param config Chart configuration object
   * @returns Chart instance with render, update, destroy, and getConfig methods
   * @throws InvalidChartTypeError if chart type is invalid
   * @throws InvalidChartConfigError if configuration is invalid
   */
  createChart(config: IChartConfig): IChartInstance {
    // Validate chart type first (before other validation)
    if (!config.type || !this.isValidChartType(config.type)) {
      throw new InvalidChartTypeError(config.type || 'undefined');
    }

    // Validate rest of configuration
    const validation = this.validateChartConfig(config);
    if (!validation.valid) {
      throw new InvalidChartConfigError(validation.errors.join('; '));
    }

    // Route to appropriate factory
    const factory = this.chartFactories[config.type];
    if (!factory) {
      throw new InvalidChartTypeError(config.type);
    }

    return factory(config);
  }

  /**
   * Creates a helper function to create chart instances with common interface
   * @param config Chart configuration
   * @param type Chart type
   * @returns Chart instance
   */
  private createChartInstance(config: IChartConfig, type: ChartType): IChartInstance {
    let container: HTMLElement | null = null;
    let currentData: any[] = config.data || [];

    return {
      type,
      render: (renderContainer: HTMLElement) => {
        container = renderContainer;
        // Actual D3 rendering will be implemented in chart components
        // This is a placeholder that stores the container reference
      },
      update: (data: any[]) => {
        currentData = data;
        // Actual D3 update will be implemented in chart components
        // This is a placeholder that stores the updated data
      },
      destroy: () => {
        if (container) {
          // Clean up D3 selections and event listeners
          // Actual cleanup will be implemented in chart components
          container = null;
        }
      },
      getConfig: () => ({
        ...config,
        data: currentData,
      }),
    };
  }

  /**
   * Creates a line chart instance
   * @param config Chart configuration
   * @returns Line chart instance
   */
  private createLineChart(config: IChartConfig): IChartInstance {
    return this.createChartInstance(config, 'line');
  }

  /**
   * Creates a bar chart instance
   * @param config Chart configuration
   * @returns Bar chart instance
   */
  private createBarChart(config: IChartConfig): IChartInstance {
    return this.createChartInstance(config, 'bar');
  }

  /**
   * Creates a pie chart instance
   * @param config Chart configuration
   * @returns Pie chart instance
   */
  private createPieChart(config: IChartConfig): IChartInstance {
    return this.createChartInstance(config, 'pie');
  }

  /**
   * Creates a scatter plot instance
   * @param config Chart configuration
   * @returns Scatter plot instance
   */
  private createScatterPlot(config: IChartConfig): IChartInstance {
    return this.createChartInstance(config, 'scatter');
  }

  /**
   * Creates an area chart instance
   * @param config Chart configuration
   * @returns Area chart instance
   */
  private createAreaChart(config: IChartConfig): IChartInstance {
    return this.createChartInstance(config, 'area');
  }

  /**
   * Creates a heatmap instance
   * @param config Chart configuration
   * @returns Heatmap instance
   */
  private createHeatmap(config: IChartConfig): IChartInstance {
    return this.createChartInstance(config, 'heatmap');
  }

  /**
   * Creates a treemap instance
   * @param config Chart configuration
   * @returns Treemap instance
   */
  private createTreemap(config: IChartConfig): IChartInstance {
    return this.createChartInstance(config, 'treemap');
  }

  /**
   * Creates a force-directed graph instance
   * @param config Chart configuration
   * @returns Force-directed graph instance
   */
  private createForceGraph(config: IChartConfig): IChartInstance {
    return this.createChartInstance(config, 'force-graph');
  }

  /**
   * Creates a geographic map instance
   * @param config Chart configuration
   * @returns Geographic map instance
   */
  private createGeoMap(config: IChartConfig): IChartInstance {
    return this.createChartInstance(config, 'geo-map');
  }

  /**
   * Creates a gauge instance
   * @param config Chart configuration
   * @returns Gauge instance
   */
  private createGauge(config: IChartConfig): IChartInstance {
    return this.createChartInstance(config, 'gauge');
  }

  /**
   * Creates a D3 scale based on configuration
   * @param config Scale configuration with type, domain, range, and optional settings
   * @returns D3 Scale object
   * @throws InvalidScaleConfigError if configuration is invalid
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createScale(config: IScaleConfig): any {
    // Validate configuration first
    const validation = this.validateScaleConfig(config);
    if (!validation.valid) {
      throw new InvalidScaleConfigError(validation.errors.join('; '));
    }

    return createScaleUtil(config);
  }

  /**
   * Creates a D3 axis based on scale and orientation configuration
   * @param config Axis configuration with scale, orientation, and optional tick settings
   * @returns D3 Axis object
   * @throws InvalidAxisConfigError if configuration is invalid
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createAxis(config: IAxisConfig): any {
    // Validate configuration first
    const validation = this.validateAxisConfig(config);
    if (!validation.valid) {
      throw new InvalidAxisConfigError(validation.errors.join('; '));
    }

    return createAxisUtil(config);
  }

  /**
   * Updates an existing D3 scale with new configuration by creating a new scale
   * @param existingScale Existing D3 scale object to update
   * @param updates Partial scale configuration with properties to update
   * @returns New scale object with updated configuration (immutable update)
   * @throws InvalidScaleConfigError if updated configuration is invalid
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateScale(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    existingScale: any,
    updates: Partial<IScaleConfig>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any {
    return updateScaleUtil(existingScale, updates);
  }

  /**
   * Updates an existing D3 axis with new configuration
   * @param existingAxis Existing D3 axis object to update
   * @param updates Partial axis configuration with properties to update
   * @returns Updated axis object with new configuration
   * @throws InvalidAxisConfigError if updated configuration is invalid
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateAxis(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    existingAxis: any,
    updates: Partial<IAxisConfig>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any {
    return updateAxisUtil(existingAxis, updates);
  }

  /**
   * Retrieves a color palette by name from the registry
   * @param name Name of the color palette to retrieve
   * @returns Color palette object if found, null if not found
   */
  getColorPalette(name: string): IColorPalette | null {
    return this.colorPaletteManager.getColorPalette(name);
  }

  /**
   * Registers a color palette in the registry. If palette already exists, overwrites it silently.
   * @param palette Color palette object with name and colors array
   * @throws InvalidColorPaletteError if palette is invalid (e.g., less than 10 colors)
   */
  setColorPalette(palette: IColorPalette): void {
    this.colorPaletteManager.setColorPalette(palette);
  }

  /**
   * Sets the default color palette by name
   * @param name Name of the palette to set as default
   * @throws PaletteNotFoundError if palette not found
   */
  setDefaultPalette(name: string): void {
    this.colorPaletteManager.setDefaultPalette(name);
  }

  /**
   * Retrieves the requested number of colors from a palette, cycling if needed
   * @param count Number of colors to retrieve
   * @param paletteName Optional name of palette to use. If not provided, uses default palette.
   * @returns Array of color strings (length = count)
   * @throws PaletteNotFoundError if palette not found
   */
  getColors(count: number, paletteName?: string): string[] {
    return this.colorPaletteManager.getColors(count, paletteName);
  }

  /**
   * Calculates chart margins with optional custom configuration
   * @param width Chart width in pixels
   * @param height Chart height in pixels
   * @param marginConfig Optional partial margin configuration to override defaults
   * @returns Complete margins object with top, right, bottom, left values
   */
  calculateMargins(width: number, height: number, marginConfig?: Partial<IMargins>): IMargins {
    return calculateMarginsUtil(width, height, marginConfig);
  }

  /**
   * Validates a scale configuration before creation
   * @param config Scale configuration to validate
   * @returns Validation result with errors array
   */
  validateScaleConfig(config: IScaleConfig): IValidationResult {
    const errors: string[] = [];

    // Validate scale type
    const validTypes: ScaleType[] = ['linear', 'time', 'ordinal', 'band', 'log', 'pow', 'sqrt'];
    if (!config.type || !validTypes.includes(config.type)) {
      errors.push(`Invalid scale type: ${config.type || 'undefined'}`);
    }

    // Validate domain
    if (!config.domain || !Array.isArray(config.domain) || config.domain.length === 0) {
      errors.push('Domain must be a non-empty array');
    }

    // Validate range
    if (!config.range || !Array.isArray(config.range) || config.range.length === 0) {
      errors.push('Range must be a non-empty array');
    }

    // Validate domain/range compatibility for continuous scales
    if (config.type && ['linear', 'time', 'log', 'pow', 'sqrt'].includes(config.type)) {
      if (config.domain && Array.isArray(config.domain) && config.domain.length !== 2) {
        errors.push(`${config.type} scale requires domain to be a tuple of 2 values`);
      }
      if (config.range && Array.isArray(config.range) && config.range.length !== 2) {
        errors.push(`${config.type} scale requires range to be a tuple of 2 values`);
      }
    }

    // Validate padding for band scales
    if (config.type === 'band' && config.padding !== undefined) {
      if (config.padding < 0 || config.padding > 1) {
        errors.push('Band scale padding must be between 0 and 1');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validates an axis configuration before creation
   * @param config Axis configuration to validate
   * @returns Validation result with errors array
   */
  validateAxisConfig(config: IAxisConfig): IValidationResult {
    const errors: string[] = [];

    // Validate scale
    if (!config.scale) {
      errors.push('Scale is required');
    }

    // Validate orientation
    const validOrientations: AxisOrientation[] = ['bottom', 'top', 'left', 'right'];
    if (!config.orientation || !validOrientations.includes(config.orientation)) {
      errors.push(`Invalid orientation: ${config.orientation || 'undefined'}`);
    }

    // Validate ticks if provided
    if (config.ticks !== undefined && config.ticks < 0) {
      errors.push('Ticks must be a non-negative number');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
