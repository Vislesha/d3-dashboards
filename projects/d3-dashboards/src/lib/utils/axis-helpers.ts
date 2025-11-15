import { axisBottom, axisTop, axisLeft, axisRight, Axis } from 'd3-axis';
import { IAxisConfig, AxisOrientation } from '../entities/chart.interface';
import { InvalidAxisConfigError } from '../services/chart.service.types';

/**
 * Creates a D3 axis based on scale and orientation configuration
 * @param config Axis configuration with scale, orientation, and optional tick settings
 * @returns D3 Axis object
 * @throws InvalidAxisConfigError if configuration is invalid
 */
export function createAxis(config: IAxisConfig): Axis<any> {
  // Validate scale
  if (!config.scale) {
    throw new InvalidAxisConfigError('Scale is required');
  }

  // Validate orientation
  const validOrientations: AxisOrientation[] = ['bottom', 'top', 'left', 'right'];
  if (!validOrientations.includes(config.orientation)) {
    throw new InvalidAxisConfigError(`Invalid orientation: ${config.orientation}`);
  }

  // Create axis based on orientation
  let axis: Axis<any>;

  switch (config.orientation) {
    case 'bottom':
      axis = axisBottom(config.scale);
      break;
    case 'top':
      axis = axisTop(config.scale);
      break;
    case 'left':
      axis = axisLeft(config.scale);
      break;
    case 'right':
      axis = axisRight(config.scale);
      break;
    default:
      throw new InvalidAxisConfigError(`Unsupported orientation: ${config.orientation}`);
  }

  // Apply tick configuration if provided
  if (config.ticks !== undefined) {
    axis.ticks(config.ticks);
  }

  if (config.tickFormat) {
    axis.tickFormat(config.tickFormat);
  }

  if (config.tickSize !== undefined) {
    axis.tickSize(config.tickSize);
  }

  if (config.tickSizeInner !== undefined) {
    axis.tickSizeInner(config.tickSizeInner);
  }

  if (config.tickSizeOuter !== undefined) {
    axis.tickSizeOuter(config.tickSizeOuter);
  }

  return axis;
}

/**
 * Updates an existing D3 axis with new configuration
 * @param existingAxis Existing D3 axis object to update
 * @param updates Partial axis configuration with properties to update
 * @returns Updated axis object with new configuration
 * @throws InvalidAxisConfigError if updated configuration is invalid
 */
export function updateAxis(
  existingAxis: Axis<any>,
  updates: Partial<IAxisConfig>
): Axis<any> {
  // D3 axes are mutable, but we need the original scale and orientation
  // Since we can't extract these from an existing axis, we require them in updates
  if (!updates.scale) {
    throw new InvalidAxisConfigError('Scale must be provided for axis update');
  }
  if (!updates.orientation) {
    throw new InvalidAxisConfigError('Orientation must be provided for axis update');
  }

  // Create a new axis with updated configuration
  const newConfig: IAxisConfig = {
    scale: updates.scale,
    orientation: updates.orientation,
    ticks: updates.ticks,
    tickFormat: updates.tickFormat,
    tickSize: updates.tickSize,
    tickSizeInner: updates.tickSizeInner,
    tickSizeOuter: updates.tickSizeOuter
  };

  return createAxis(newConfig);
}

