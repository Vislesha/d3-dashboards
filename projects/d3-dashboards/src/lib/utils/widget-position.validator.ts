import { GridsterItem } from 'angular-gridster2';
import { IGridConfiguration } from '../entities/grid-config.interface';

/**
 * Validates and auto-corrects widget position to ensure it's within grid bounds
 * and doesn't overlap with other widgets.
 *
 * @param position - Widget position to validate
 * @param gridConfig - Grid configuration with column constraints
 * @param existingWidgets - Array of existing widget positions to check for overlaps
 * @returns Corrected position that is valid within the grid
 */
export function validateWidgetPosition(
  position: GridsterItem,
  gridConfig: IGridConfiguration,
  existingWidgets: GridsterItem[] = []
): GridsterItem {
  const corrected: GridsterItem = { ...position };

  // Validate and correct x coordinate
  if (corrected.x < 0) {
    corrected.x = 0;
  }
  if (corrected.x >= gridConfig.columns) {
    corrected.x = Math.max(0, gridConfig.columns - 1);
  }

  // Validate and correct y coordinate
  if (corrected.y < 0) {
    corrected.y = 0;
  }

  // Validate and correct cols (width)
  if (corrected.cols < 1) {
    corrected.cols = 1;
  }
  if (corrected.cols > gridConfig.columns) {
    corrected.cols = gridConfig.columns;
  }
  if (corrected.x + corrected.cols > gridConfig.columns) {
    corrected.x = Math.max(0, gridConfig.columns - corrected.cols);
  }

  // Validate and correct rows (height)
  if (corrected.rows < 1) {
    corrected.rows = 1;
  }
  if (gridConfig.maxRows && corrected.rows > gridConfig.maxRows) {
    corrected.rows = gridConfig.maxRows;
  }

  // Check for overlaps with existing widgets
  const hasOverlap = existingWidgets.some((widget) => {
    if (widget === position) {
      return false; // Skip self
    }
    return (
      corrected.x < widget.x + widget.cols &&
      corrected.x + corrected.cols > widget.x &&
      corrected.y < widget.y + widget.rows &&
      corrected.y + corrected.rows > widget.y
    );
  });

  // If overlap detected, move to nearest valid position
  if (hasOverlap) {
    // Try moving right first
    let newX = corrected.x + corrected.cols;
    if (newX + corrected.cols <= gridConfig.columns) {
      corrected.x = newX;
    } else {
      // Move to next row
      const maxY = Math.max(...existingWidgets.map((w) => w.y + w.rows), 0);
      corrected.y = maxY;
      corrected.x = 0;
    }
  }

  return corrected;
}

/**
 * Validates if a widget position is within grid bounds
 *
 * @param position - Widget position to validate
 * @param gridConfig - Grid configuration with column constraints
 * @returns true if position is valid, false otherwise
 */
export function isPositionValid(
  position: GridsterItem,
  gridConfig: IGridConfiguration
): boolean {
  return (
    position.x >= 0 &&
    position.y >= 0 &&
    position.cols > 0 &&
    position.rows > 0 &&
    position.x + position.cols <= gridConfig.columns &&
    (!gridConfig.maxRows || position.rows <= gridConfig.maxRows)
  );
}

/**
 * Checks if two widget positions overlap
 *
 * @param pos1 - First widget position
 * @param pos2 - Second widget position
 * @returns true if positions overlap, false otherwise
 */
export function positionsOverlap(
  pos1: GridsterItem,
  pos2: GridsterItem
): boolean {
  return (
    pos1.x < pos2.x + pos2.cols &&
    pos1.x + pos1.cols > pos2.x &&
    pos1.y < pos2.y + pos2.rows &&
    pos1.y + pos1.rows > pos2.y
  );
}

