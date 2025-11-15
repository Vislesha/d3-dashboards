/**
 * Responsive breakpoint configuration
 */
export interface IResponsiveBreakpoints {
  /** Mobile breakpoint in pixels (default: 320) */
  mobile: number;
  /** Tablet breakpoint in pixels (default: 768) */
  tablet: number;
  /** Desktop breakpoint in pixels (default: 1024) */
  desktop: number;
  /** Number of columns for mobile viewport (default: 4) */
  mobileCols: number;
  /** Number of columns for tablet viewport (default: 8) */
  tabletCols: number;
  /** Number of columns for desktop viewport (default: 12) */
  desktopCols: number;
}

/**
 * Grid configuration interface for dashboard container
 */
export interface IGridConfiguration {
  /** Number of columns in grid (default: 12) */
  columns: number;
  /** Height of each row in pixels (default: 30) */
  rowHeight: number;
  /** Margin between widgets in pixels (default: 5) */
  margin: number;
  /** Minimum number of columns (default: 1) */
  minCols: number;
  /** Maximum number of columns (default: 12) */
  maxCols: number;
  /** Minimum number of rows (default: 1) */
  minRows: number;
  /** Maximum number of rows (optional) */
  maxRows?: number;
  /** Enable drag functionality (default: false, read-only mode) */
  draggable: boolean;
  /** Enable resize functionality (default: false, read-only mode) */
  resizable: boolean;
  /** Prevent widget overlap during drag (default: true) */
  preventCollision: boolean;
  /** Enable responsive layout adaptation (default: true) */
  responsive: boolean;
  /** Responsive breakpoint configuration (optional) */
  breakpoints?: IResponsiveBreakpoints;
}

