import { IGridConfiguration, IResponsiveBreakpoints } from '../entities/grid-config.interface';

/**
 * Default responsive breakpoints configuration
 */
export const DEFAULT_RESPONSIVE_BREAKPOINTS: IResponsiveBreakpoints = {
  mobile: 320,
  tablet: 768,
  desktop: 1024,
  mobileCols: 4,
  tabletCols: 8,
  desktopCols: 12,
};

/**
 * Default grid configuration
 * - 12 columns
 * - 30px row height
 * - 5px margins
 * - Read-only mode (no drag/resize)
 */
export const DEFAULT_GRID_CONFIG: IGridConfiguration = {
  columns: 12,
  rowHeight: 30,
  margin: 5,
  minCols: 1,
  maxCols: 12,
  minRows: 1,
  draggable: false,
  resizable: false,
  preventCollision: true,
  responsive: true,
  breakpoints: DEFAULT_RESPONSIVE_BREAKPOINTS,
};

