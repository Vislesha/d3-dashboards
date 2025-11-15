/**
 * Type definitions and error classes for Chart Service
 */

/**
 * Base error class for Chart Service errors
 */
export class ChartServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'ChartServiceError';
    Object.setPrototypeOf(this, ChartServiceError.prototype);
  }
}

/**
 * Error thrown when an invalid chart type is provided
 */
export class InvalidChartTypeError extends ChartServiceError {
  constructor(chartType: string) {
    super(
      `Invalid chart type: ${chartType}. Supported types: line, bar, pie, scatter, area, heatmap, treemap, force-graph, geo-map, gauge`,
      'INVALID_CHART_TYPE'
    );
    this.name = 'InvalidChartTypeError';
    Object.setPrototypeOf(this, InvalidChartTypeError.prototype);
  }
}

/**
 * Error thrown when chart configuration is invalid
 */
export class InvalidChartConfigError extends ChartServiceError {
  constructor(message: string) {
    super(`Invalid chart configuration: ${message}`, 'INVALID_CHART_CONFIG');
    this.name = 'InvalidChartConfigError';
    Object.setPrototypeOf(this, InvalidChartConfigError.prototype);
  }
}

/**
 * Error thrown when scale configuration is invalid
 */
export class InvalidScaleConfigError extends ChartServiceError {
  constructor(message: string) {
    super(`Invalid scale configuration: ${message}`, 'INVALID_SCALE_CONFIG');
    this.name = 'InvalidScaleConfigError';
    Object.setPrototypeOf(this, InvalidScaleConfigError.prototype);
  }
}

/**
 * Error thrown when axis configuration is invalid
 */
export class InvalidAxisConfigError extends ChartServiceError {
  constructor(message: string) {
    super(`Invalid axis configuration: ${message}`, 'INVALID_AXIS_CONFIG');
    this.name = 'InvalidAxisConfigError';
    Object.setPrototypeOf(this, InvalidAxisConfigError.prototype);
  }
}

/**
 * Error thrown when a color palette is not found
 */
export class PaletteNotFoundError extends ChartServiceError {
  constructor(paletteName: string) {
    super(`Color palette not found: ${paletteName}`, 'PALETTE_NOT_FOUND');
    this.name = 'PaletteNotFoundError';
    Object.setPrototypeOf(this, PaletteNotFoundError.prototype);
  }
}

/**
 * Error thrown when a color palette is invalid
 */
export class InvalidColorPaletteError extends ChartServiceError {
  constructor(message: string) {
    super(`Invalid color palette: ${message}`, 'INVALID_COLOR_PALETTE');
    this.name = 'InvalidColorPaletteError';
    Object.setPrototypeOf(this, InvalidColorPaletteError.prototype);
  }
}

