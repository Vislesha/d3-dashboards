/**
 * Data Source interface for Data Service
 *
 * This is a new interface separate from the existing IDataSource in widget.interface.ts
 * to provide enhanced functionality for the data service.
 */

/**
 * Cache configuration interface
 */
export interface ICacheConfig {
  /** Whether caching is enabled for this data source */
  enabled: boolean;
  /** Time-to-live in milliseconds (required if enabled is true, default: 300000) */
  ttl?: number;
  /** Custom cache key (auto-generated from endpoint + method + serialized params/body if not provided) */
  key?: string;
}

/**
 * Retry logic configuration interface
 */
export interface IRetryConfig {
  /** Whether retry is enabled */
  enabled: boolean;
  /** Maximum retry attempts (required if enabled, default: 3) */
  maxAttempts?: number;
  /** Initial delay before first retry in milliseconds (default: 1000) */
  initialDelay?: number;
  /** Exponential backoff multiplier (default: 2) */
  backoffMultiplier?: number;
}

/**
 * Data Source configuration interface
 */
export interface IDataSource {
  /** Type of data source */
  type: 'api' | 'static' | 'computed';
  /** API endpoint URL (required for 'api' type) */
  endpoint?: string;
  /** HTTP method for API requests (default: 'GET') */
  method?: 'GET' | 'POST';
  /** Query parameters for GET requests */
  params?: Record<string, any>;
  /** Request body for POST requests */
  body?: any;
  /** Static data array (required for 'static' type) */
  data?: any[];
  /** Transformation function to apply to fetched data */
  transform?: (data: any) => any;
  /** Caching configuration */
  cache?: ICacheConfig;
  /** Retry logic configuration */
  retry?: IRetryConfig;
  /** Request timeout in milliseconds (uses Angular HttpClient default if not provided) */
  timeout?: number;
}

/**
 * Data Response interface
 */
export interface IDataResponse<T> {
  /** Fetched or transformed data */
  data: T | null;
  /** Whether data is currently being fetched */
  loading: boolean;
  /** Error information if fetch failed */
  error: IDataServiceError | null;
  /** Timestamp when data was fetched (Unix timestamp in milliseconds) */
  timestamp: number;
  /** Whether data was retrieved from cache */
  fromCache: boolean;
}

/**
 * Data Service Error interface
 */
export interface IDataServiceError {
  /** Human-readable error message */
  message: string;
  /** Error code (e.g., HTTP status code) */
  code?: string;
  /** Original error object for debugging */
  originalError?: any;
  /** Whether the error is retryable */
  retryable: boolean;
}

/**
 * Validation Result interface
 */
export interface IValidationResult {
  /** Whether the data source configuration is valid */
  valid: boolean;
  /** Array of validation error messages */
  errors: string[];
}
