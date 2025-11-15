import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, defer, of, throwError, timer } from 'rxjs';
import {
  catchError,
  finalize,
  map,
  mergeMap,
  retryWhen,
  shareReplay,
  tap,
  timeout as rxTimeout,
} from 'rxjs/operators';
import { TimeoutError } from 'rxjs';
import {
  IDataSource,
  IDataResponse,
  IValidationResult,
  IDataServiceError,
} from '../entities/data-source.interface';
import { ICacheEntry } from './data.service.types';

/**
 * Data Service - Generic data fetching interface for dashboard widgets
 *
 * Provides support for multiple data source types (API, static, computed),
 * data transformation, caching, error handling, and retry logic.
 */
@Injectable({
  providedIn: 'root',
})
export class DataService {
  private static readonly DEFAULT_CACHE_TTL = 300_000;

  private loadingState$ = new BehaviorSubject<boolean>(false);
  private activeRequests = 0;
  private cache = new Map<string, ICacheEntry<any>>();
  private inFlightRequests = new Map<string, Observable<IDataResponse<any>>>();

  constructor(private http: HttpClient) {}

  /**
   * Validates a data source configuration before use.
   */
  validateDataSource(source: IDataSource): IValidationResult {
    const errors: string[] = [];

    if (!source.type || !['api', 'static', 'computed'].includes(source.type)) {
      errors.push('Type must be one of: api, static, computed');
    }

    if (source.type === 'api') {
      if (!source.endpoint) {
        errors.push('Endpoint is required for API data sources');
      } else {
        try {
          new URL(source.endpoint);
        } catch {
          if (!source.endpoint.startsWith('/') && !source.endpoint.startsWith('./')) {
            errors.push('Endpoint must be a valid URL or relative path');
          }
        }
      }
    } else if (source.type === 'static') {
      if (!source.data || !Array.isArray(source.data)) {
        errors.push('Data array is required for static data sources');
      }
    } else if (source.type === 'computed') {
      if (!source.transform || typeof source.transform !== 'function') {
        errors.push('Transform function is required for computed data sources');
      }
    }

    if (source.method && !['GET', 'POST'].includes(source.method)) {
      errors.push('Method must be GET or POST');
    }
    if (source.method === 'POST' && source.body === undefined) {
      errors.push('Body is required for POST requests');
    }

    if (source.transform && typeof source.transform !== 'function') {
      errors.push('Transform must be a callable function');
    }

    if (source.cache) {
      if (source.cache.enabled && (!source.cache.ttl || source.cache.ttl <= 0)) {
        errors.push('Cache TTL must be a positive number when caching is enabled');
      }
      if (source.cache.key && typeof source.cache.key !== 'string') {
        errors.push('Cache key must be a non-empty string');
      }
      if (typeof source.cache.key === 'string' && source.cache.key.trim().length === 0) {
        errors.push('Cache key must be a non-empty string');
      }
    }

    if (source.retry) {
      if (source.retry.enabled && (!source.retry.maxAttempts || source.retry.maxAttempts <= 0)) {
        errors.push('Retry maxAttempts must be a positive number when retry is enabled');
      }
      if (source.retry.initialDelay !== undefined && source.retry.initialDelay < 0) {
        errors.push('Retry initialDelay must be non-negative');
      }
      if (source.retry.backoffMultiplier !== undefined && source.retry.backoffMultiplier < 1) {
        errors.push('Retry backoffMultiplier must be >= 1');
      }
    }

    if (source.timeout !== undefined && source.timeout <= 0) {
      errors.push('Timeout must be a positive number if provided');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Fetches data from the specified data source.
   */
  fetchData<T>(source: IDataSource): Observable<IDataResponse<T>> {
    const validation = this.validateDataSource(source);
    if (!validation.valid) {
      return of(
        this.createErrorResponse<T>({
          message: `Validation failed: ${validation.errors.join(', ')}`,
          retryable: false,
        }),
      );
    }

    if (source.type === 'static') {
      return this.handleStaticSource<T>(source);
    }

    if (source.type === 'computed') {
      return this.handleComputedSource<T>(source);
    }

    return this.handleApiSource<T>(source);
  }

  /**
   * Emits the current loading state of the service.
   */
  getLoadingState(): Observable<boolean> {
    return this.loadingState$.asObservable();
  }

  /**
   * Clears cached entries. When a key is provided only that entry is removed.
   */
  clearCache(key?: string): void {
    if (!key) {
      this.cache.clear();
      return;
    }
    this.cache.delete(key);
  }

  /**
   * Returns the number of active cache entries.
   */
  getCacheSize(): number {
    return this.cache.size;
  }

  private handleStaticSource<T>(source: IDataSource): Observable<IDataResponse<T>> {
    try {
      const rawData = (source.data ?? []) as T;
      const transformed = this.executeTransform<T>(
        rawData,
        source.transform as ((payload: T) => T) | undefined,
      );
      return of(this.createSuccessResponse<T>(transformed, false));
    } catch (error) {
      return of(this.createErrorResponse<T>(this.createServiceError(error)));
    }
  }

  private handleComputedSource<T>(source: IDataSource): Observable<IDataResponse<T>> {
    try {
      const computeFn = source.transform as (data: unknown) => T;
      const computed = computeFn(source.data);
      return of(this.createSuccessResponse<T>(computed, false));
    } catch (error) {
      return of(
        this.createErrorResponse<T>(this.createServiceError(new TransformExecutionError(error))),
      );
    }
  }

  private handleApiSource<T>(source: IDataSource): Observable<IDataResponse<T>> {
    const requestKey = this.createRequestKey(source);
    const cacheConfig = this.getCacheConfig(source);

    if (cacheConfig.enabled) {
      const cached = this.getCacheEntry<T>(cacheConfig.key);
      if (cached) {
        return of(this.createSuccessResponse<T>(cached.data, true, cached.timestamp));
      }
    }

    const existing = this.inFlightRequests.get(requestKey) as
      | Observable<IDataResponse<T>>
      | undefined;
    if (existing) {
      return existing;
    }

    this.incrementLoading();

    const response$ = defer(() => this.buildHttpObservable<T>(source)).pipe(
      map((data) =>
        this.executeTransform<T>(data, source.transform as ((payload: T) => T) | undefined),
      ),
      tap((transformed) => {
        if (cacheConfig.enabled) {
          this.setCacheEntry(cacheConfig.key, transformed, cacheConfig.ttl);
        }
      }),
      map((transformed) => this.createSuccessResponse<T>(transformed, false)),
      catchError((error) => of(this.createErrorResponse<T>(this.createServiceError(error)))),
      finalize(() => {
        this.inFlightRequests.delete(requestKey);
        this.decrementLoading();
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    this.inFlightRequests.set(requestKey, response$);
    return response$;
  }

  private buildHttpObservable<T>(source: IDataSource): Observable<T> {
    const method = source.method ?? 'GET';
    let request$: Observable<T>;

    if (method === 'GET') {
      let params = new HttpParams();
      if (source.params) {
        Object.entries(source.params)
          .sort(([a], [b]) => a.localeCompare(b))
          .forEach(([key, value]) => {
            params = params.append(key, String(value));
          });
      }
      request$ = this.http.get<T>(source.endpoint!, { params });
    } else {
      request$ = this.http.post<T>(source.endpoint!, source.body);
    }

    if (source.timeout !== undefined) {
      request$ = request$.pipe(rxTimeout(source.timeout));
    }

    return this.applyRetry(request$, source);
  }

  private applyRetry<T>(request$: Observable<T>, source: IDataSource): Observable<T> {
    const retryConfig = source.retry;
    if (!retryConfig?.enabled) {
      return request$;
    }

    const maxAttempts = retryConfig.maxAttempts ?? 3;
    const initialDelay = retryConfig.initialDelay ?? 1_000;
    const backoffMultiplier = retryConfig.backoffMultiplier ?? 2;

    return request$.pipe(
      retryWhen((errors) => {
        let attempt = 0;
        return errors.pipe(
          mergeMap((error) => {
            if (!this.isRetryableError(error) || attempt >= maxAttempts) {
              return throwError(() => error);
            }
            const delayMs = initialDelay * Math.pow(backoffMultiplier, attempt);
            attempt += 1;
            return timer(delayMs);
          }),
        );
      }),
    );
  }

  private isRetryableError(error: unknown): boolean {
    if (error instanceof TimeoutError) {
      return true;
    }

    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        return true;
      }
      return error.status >= 500;
    }

    return false;
  }

  private getCacheConfig(source: IDataSource): { enabled: boolean; ttl: number; key: string } {
    const requestKey = this.createRequestKey(source);
    if (!source.cache?.enabled) {
      return {
        enabled: false,
        ttl: 0,
        key: requestKey,
      };
    }

    const ttl = source.cache.ttl ?? DataService.DEFAULT_CACHE_TTL;
    const key = source.cache.key?.trim() ? source.cache.key.trim() : requestKey;

    return {
      enabled: true,
      ttl,
      key,
    };
  }

  private createRequestKey(source: IDataSource): string {
    const method = source.method ?? 'GET';
    const endpoint = source.endpoint ?? 'static';
    const params = source.params ? this.stableSerialize(source.params) : '';
    const body =
      method === 'POST' && source.body !== undefined ? this.stableSerialize(source.body) : '';
    return `${source.type}:${method}:${endpoint}?${params}|${body}`;
  }

  private stableSerialize(value: unknown): string {
    if (value === null || value === undefined) {
      return '';
    }

    if (typeof value !== 'object') {
      return String(value);
    }

    if (Array.isArray(value)) {
      return `[${value.map((item) => this.stableSerialize(item)).join(',')}]`;
    }

    const entries = Object.entries(value as Record<string, unknown>).sort(([a], [b]) =>
      a.localeCompare(b),
    );
    return `{${entries.map(([key, val]) => `${key}:${this.stableSerialize(val)}`).join(',')}}`;
  }

  private getCacheEntry<T>(key: string): ICacheEntry<T> | null {
    const entry = this.cache.get(key) as ICacheEntry<T> | undefined;
    if (!entry) {
      return null;
    }

    const age = Date.now() - entry.timestamp;
    if (age > entry.expiration) {
      this.cache.delete(key);
      return null;
    }

    return entry;
  }

  private setCacheEntry<T>(key: string, data: T, ttl: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiration: ttl,
      key,
    });
  }

  private executeTransform<T>(data: T, transform?: (payload: T) => T): T {
    if (!transform) {
      return data;
    }

    try {
      return transform(data);
    } catch (error) {
      throw new TransformExecutionError(error);
    }
  }

  private createSuccessResponse<T>(
    data: T,
    fromCache: boolean,
    timestamp: number = Date.now(),
  ): IDataResponse<T> {
    return {
      data,
      loading: false,
      error: null,
      timestamp,
      fromCache,
    };
  }

  private createErrorResponse<T>(error: IDataServiceError): IDataResponse<T> {
    return {
      data: null,
      loading: false,
      error,
      timestamp: Date.now(),
      fromCache: false,
    };
  }

  private incrementLoading(): void {
    this.activeRequests += 1;
    if (this.activeRequests === 1) {
      this.loadingState$.next(true);
    }
  }

  private decrementLoading(): void {
    if (this.activeRequests > 0) {
      this.activeRequests -= 1;
    }
    if (this.activeRequests === 0) {
      this.loadingState$.next(false);
    }
  }

  private createServiceError(error: unknown): IDataServiceError {
    if (error instanceof TransformExecutionError) {
      return {
        message: `Transform failed: ${error.message}`,
        originalError: error.originalError ?? error,
        retryable: false,
      };
    }

    if (error instanceof TimeoutError) {
      return {
        message: 'Request timed out',
        code: 'TIMEOUT',
        originalError: error,
        retryable: true,
      };
    }

    if (error instanceof HttpErrorResponse) {
      const isRetryable = error.status >= 500 || error.status === 0 || !error.status;
      return {
        message: error.message || `HTTP ${error.status}: ${error.statusText}`,
        code: error.status ? error.status.toString() : undefined,
        originalError: error,
        retryable: isRetryable,
      };
    }

    if (error instanceof Error) {
      return {
        message: error.message || 'Unknown error occurred',
        originalError: error,
        retryable: true,
      };
    }

    return {
      message: 'Unknown error occurred',
      originalError: error,
      retryable: true,
    };
  }
}

class TransformExecutionError extends Error {
  constructor(public originalError: unknown) {
    super(
      originalError instanceof Error
        ? originalError.message
        : typeof originalError === 'string'
          ? originalError
          : 'Data transformation error',
    );
    this.name = 'TransformExecutionError';
  }
}
