/**
 * Type definitions for Data Service
 */

/**
 * Cache entry interface for internal cache storage
 */
export interface ICacheEntry<T> {
  data: T;
  timestamp: number;
  expiration: number;
  key: string;
}

