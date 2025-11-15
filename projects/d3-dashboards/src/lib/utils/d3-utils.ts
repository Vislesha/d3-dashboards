import { IMargins } from '../entities/chart.interface';

/**
 * Default margins for charts
 */
const DEFAULT_MARGINS: IMargins = {
  top: 20,
  right: 20,
  bottom: 40,
  left: 40,
};

/**
 * Calculates chart margins with optional custom configuration
 * @param width Chart width in pixels
 * @param height Chart height in pixels
 * @param marginConfig Optional partial margin configuration to override defaults
 * @returns Complete margins object with top, right, bottom, left values
 */
export function calculateMargins(
  width: number,
  height: number,
  marginConfig?: Partial<IMargins>,
): IMargins {
  return {
    ...DEFAULT_MARGINS,
    ...marginConfig,
  };
}

/**
 * Dimensions interface for inner dimension calculation
 */
export interface IDimensions {
  width: number;
  height: number;
  margins: IMargins;
}

/**
 * Calculates inner chart dimensions (excluding margins)
 * @param dimensions Chart dimensions including margins
 * @returns Inner width and height
 */
export function calculateInnerDimensions(dimensions: IDimensions): {
  width: number;
  height: number;
} {
  return {
    width: dimensions.width - dimensions.margins.left - dimensions.margins.right,
    height: dimensions.height - dimensions.margins.top - dimensions.margins.bottom,
  };
}

/**
 * Calculates the extent (min and max) of values in a data array
 * @param data Data array
 * @param accessor Function to access the numeric value from each data point
 * @returns Tuple of [min, max] values
 */
export function extent<T>(data: T[], accessor: (d: T) => number): [number, number] {
  if (data.length === 0) {
    return [0, 0];
  }

  let min = accessor(data[0]);
  let max = accessor(data[0]);

  for (const d of data) {
    const value = accessor(d);
    if (value < min) min = value;
    if (value > max) max = value;
  }

  return [min, max];
}
