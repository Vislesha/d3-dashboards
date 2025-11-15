import { ID3Widget } from './widget.interface';
import { IFilterValues } from './filter.interface';

/**
 * Dashboard navigation information interface
 */
export interface IDashboardNavigationInfo {
  /** Current dashboard identifier */
  dashboardId: string;
  /** Current route path */
  route: string;
  /** Route parameters */
  params: Record<string, any>;
  /** Query parameters */
  queryParams: Record<string, any>;
}

/**
 * Layout configuration interface
 */
export interface ILayoutConfig {
  /** Grid configuration */
  grid?: {
    cols?: number;
    rows?: number;
    [key: string]: any;
  };
  [key: string]: any;
}

/**
 * Dashboard configuration interface (for creating new dashboards)
 */
export interface IDashboardConfig {
  /** Dashboard title/name */
  title: string;
  /** Dashboard description */
  description?: string;
  /** Array of widgets */
  widgets?: ID3Widget[];
  /** Layout configuration */
  layout?: ILayoutConfig;
  /** Global filters */
  filters?: IFilterValues[];
  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Dashboard interface
 */
export interface IDashboard {
  /** Unique dashboard identifier (UUID) */
  id: string;
  /** Dashboard title/name */
  title: string;
  /** Dashboard description */
  description?: string;
  /** Array of widgets contained in the dashboard */
  widgets: ID3Widget[];
  /** Layout configuration */
  layout?: ILayoutConfig;
  /** Global filters applied to the dashboard */
  filters?: IFilterValues[];
  /** Version number for optimistic locking */
  version: number;
  /** Dashboard creation timestamp */
  createdAt: Date;
  /** Dashboard last update timestamp */
  updatedAt: Date;
  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Dashboard state interface
 */
export interface IDashboardState {
  /** ID of the currently active/selected dashboard */
  activeDashboardId: string | null;
  /** Whether the dashboard is in edit mode */
  editMode: boolean;
  /** Active filters applied to the dashboard */
  filters: IFilterValues[];
  /** IDs of currently selected widgets */
  selectedWidgets: string[];
  /** Last error that occurred in the service */
  lastError?: IDashboardServiceError;
}

/**
 * Dashboard storage entry interface (internal storage representation)
 */
export interface IDashboardStorageEntry {
  /** Dashboard ID */
  id: string;
  /** Dashboard data */
  data: IDashboard;
  /** Storage timestamp (for cache expiration if needed) */
  timestamp: number;
}

/**
 * Dashboard Service Error interface
 */
export interface IDashboardServiceError {
  /** Human-readable error message */
  message: string;
  /** Error code for programmatic handling */
  code: string;
  /** Whether the error is retryable */
  retryable: boolean;
  /** Related dashboard ID (if applicable) */
  dashboardId?: string;
  /** Related widget ID (if applicable) */
  widgetId?: string;
}
