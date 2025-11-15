/**
 * Type definitions for Data Service
 */

/**
 * Cache entry interface for internal cache storage
 */
export interface ICacheEntry<T> {
  /** Cached data value */
  data: T;
  /** Timestamp when data was cached (Unix timestamp in milliseconds) */
  timestamp: number;
  /** Expiration time in milliseconds from timestamp */
  expiration: number;
  /** Cache key identifier */
  key: string;
}
