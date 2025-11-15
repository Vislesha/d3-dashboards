/**
 * Dashboard validation utilities
 */

import { IDashboard, IDashboardConfig } from '../entities/dashboard.interface';
import { ID3Widget } from '../entities/widget.interface';
import { IValidationResult } from '../entities/data-source.interface';

/**
 * UUID v4 validation regex
 */
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Validates if a string is a valid UUID
 */
export function isValidUUID(id: string): boolean {
  return UUID_REGEX.test(id);
}

/**
 * Generates a UUID v4
 */
export function generateUUID(): string {
  // Simple UUID v4 generator (for browser compatibility)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Validates a dashboard configuration
 */
export function validateDashboard(dashboard: IDashboard | IDashboardConfig): IValidationResult {
  const errors: string[] = [];

  // Validate ID (if present, must be valid UUID)
  if ('id' in dashboard && dashboard.id) {
    if (!isValidUUID(dashboard.id)) {
      errors.push('Dashboard ID must be a valid UUID format');
    }
  }

  // Validate title
  if (!dashboard.title || typeof dashboard.title !== 'string' || dashboard.title.trim().length === 0) {
    errors.push('Dashboard title is required and must be a non-empty string');
  } else if (dashboard.title.length > 255) {
    errors.push('Dashboard title must be 255 characters or less');
  }

  // Validate description (if provided)
  if (dashboard.description !== undefined) {
    if (typeof dashboard.description !== 'string') {
      errors.push('Dashboard description must be a string');
    } else if (dashboard.description.length > 1000) {
      errors.push('Dashboard description must be 1000 characters or less');
    }
  }

  // Validate widgets (if present)
  if ('widgets' in dashboard) {
    if (!Array.isArray(dashboard.widgets)) {
      errors.push('Dashboard widgets must be an array');
    } else {
      // Check for duplicate widget IDs
      const widgetIds = new Set<string>();
      dashboard.widgets.forEach((widget, index) => {
        if (widgetIds.has(widget.id)) {
          errors.push(`Widget at index ${index} has duplicate ID: ${widget.id}`);
        } else {
          widgetIds.add(widget.id);
        }

        // Validate each widget
        const widgetValidation = validateWidget(widget);
        if (!widgetValidation.valid) {
          errors.push(`Widget ${index}: ${widgetValidation.errors.join(', ')}`);
        }
      });
    }
  }

  // Validate version (if present)
  if ('version' in dashboard && dashboard.version !== undefined) {
    if (typeof dashboard.version !== 'number' || dashboard.version < 1 || !Number.isInteger(dashboard.version)) {
      errors.push('Dashboard version must be a positive integer');
    }
  }

  // Validate dates (if present)
  if ('createdAt' in dashboard && dashboard.createdAt) {
    if (!(dashboard.createdAt instanceof Date) || isNaN(dashboard.createdAt.getTime())) {
      errors.push('Dashboard createdAt must be a valid Date');
    }
  }

  if ('updatedAt' in dashboard && dashboard.updatedAt) {
    if (!(dashboard.updatedAt instanceof Date) || isNaN(dashboard.updatedAt.getTime())) {
      errors.push('Dashboard updatedAt must be a valid Date');
    } else if (
      'createdAt' in dashboard &&
      dashboard.createdAt &&
      dashboard.updatedAt < dashboard.createdAt
    ) {
      errors.push('Dashboard updatedAt must be greater than or equal to createdAt');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates a widget configuration
 */
export function validateWidget(widget: ID3Widget): IValidationResult {
  const errors: string[] = [];

  // Validate ID
  if (!widget.id || !isValidUUID(widget.id)) {
    errors.push('Widget ID is required and must be a valid UUID format');
  }

  // Validate type
  const validWidgetTypes = [
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
    'table',
    'filter',
    'tile',
    'markdown',
  ];
  if (!widget.type || !validWidgetTypes.includes(widget.type)) {
    errors.push(`Widget type must be one of: ${validWidgetTypes.join(', ')}`);
  }

  // Validate position
  if (!widget.position) {
    errors.push('Widget position is required');
  } else {
    if (typeof widget.position.x !== 'number' || typeof widget.position.y !== 'number') {
      errors.push('Widget position must have valid x and y coordinates');
    }
    if (typeof widget.position.cols !== 'number' || typeof widget.position.rows !== 'number') {
      errors.push('Widget position must have valid cols and rows');
    }
  }

  // Validate title
  if (!widget.title || typeof widget.title !== 'string' || widget.title.trim().length === 0) {
    errors.push('Widget title is required and must be a non-empty string');
  }

  // Validate config
  if (!widget.config || typeof widget.config !== 'object') {
    errors.push('Widget config is required and must be an object');
  }

  // Validate dataSource (if provided)
  if (widget.dataSource) {
    if (!widget.dataSource.type || !['api', 'static', 'computed'].includes(widget.dataSource.type)) {
      errors.push('Widget dataSource type must be one of: api, static, computed');
    }
    if (widget.dataSource.type === 'api' && !widget.dataSource.endpoint) {
      errors.push('Widget dataSource endpoint is required for api type');
    }
    if (widget.dataSource.type === 'static' && !Array.isArray(widget.dataSource.data)) {
      errors.push('Widget dataSource data is required and must be an array for static type');
    }
    if (widget.dataSource.type === 'computed' && typeof widget.dataSource.transform !== 'function') {
      errors.push('Widget dataSource transform function is required for computed type');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

