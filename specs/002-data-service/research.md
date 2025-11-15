# Research: Data Service Implementation

**Feature**: 002-data-service  
**Date**: 2025-01-27  
**Purpose**: Resolve technical decisions and document implementation patterns

## Research Areas

### 1. Caching Strategy with Expiration

**Decision**: Use in-memory Map-based cache with timestamp-based expiration

**Rationale**:
- In-memory cache is sufficient for client-side dashboard application
- Map provides O(1) lookup performance
- Timestamp-based expiration is simple and reliable
- No need for persistent storage (data is fetched on demand)
- Aligns with performance goals (SC-003: 50% reduction in API calls)

**Implementation Pattern**:
```typescript
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiration: number; // milliseconds
}

class DataCache {
  private cache = new Map<string, CacheEntry<any>>();
  
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > entry.expiration) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }
  
  set<T>(key: string, data: T, expiration: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      expiration
    });
  }
}
```

**Alternatives Considered**:
- **IndexedDB**: Overkill for in-memory caching, adds complexity
- **LocalStorage**: Synchronous API, size limitations, not suitable for complex objects
- **Service Worker Cache**: Requires service worker setup, more complex

### 2. RxJS Retry Logic Pattern

**Decision**: Use RxJS `retry` operator with exponential backoff and configurable attempts

**Rationale**:
- Native RxJS operators provide clean, composable retry logic
- Exponential backoff prevents overwhelming failing endpoints
- Configurable attempts allow per-request customization
- Aligns with SC-007: 80% success rate for transient failures

**Implementation Pattern**:
```typescript
import { retry, delay, take } from 'rxjs/operators';
import { throwError, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

function retryWithBackoff(maxAttempts: number, initialDelay: number = 1000) {
  return (source: Observable<any>) =>
    source.pipe(
      retry({
        count: maxAttempts,
        delay: (error, retryCount) => {
          const delayMs = initialDelay * Math.pow(2, retryCount - 1);
          return timer(delayMs);
        }
      })
    );
}
```

**Alternatives Considered**:
- **Simple retry()**: No backoff, may overwhelm failing endpoints
- **Custom retry logic**: More complex, RxJS operators are sufficient
- **Third-party libraries**: Unnecessary dependency, RxJS provides needed functionality

### 3. Request/Response Interceptors

**Decision**: Use Angular HttpClient interceptors with functional composition pattern

**Rationale**:
- Angular HttpClient provides built-in interceptor support
- Functional composition allows multiple interceptors
- Interceptors can modify requests/responses before/after HTTP calls
- Aligns with FR-008 and SC-008: < 50ms overhead

**Implementation Pattern**:
```typescript
import { HttpInterceptorFn } from '@angular/common/http';

export const dataServiceInterceptor: HttpInterceptorFn = (req, next) => {
  // Request modification
  const modifiedReq = req.clone({
    setHeaders: { /* custom headers */ }
  });
  
  return next(modifiedReq).pipe(
    // Response transformation
    map(response => {
      // Transform response if needed
      return response;
    })
  );
};
```

**Alternatives Considered**:
- **Manual request wrapping**: More boilerplate, less maintainable
- **Service-level interceptors**: Less flexible than HTTP interceptors
- **Third-party libraries**: Unnecessary, Angular provides native support

### 4. Data Transformation Pattern

**Decision**: Use functional transform functions with error handling

**Rationale**:
- Functional approach is composable and testable
- Transform functions can be passed as configuration
- Error handling ensures graceful degradation
- Aligns with FR-005 and SC-005: < 100ms for < 1000 items

**Implementation Pattern**:
```typescript
type TransformFunction<T, R> = (data: T) => R;

function applyTransform<T, R>(
  data: T,
  transform?: TransformFunction<T, R>
): R {
  if (!transform) {
    return data as unknown as R;
  }
  
  try {
    return transform(data);
  } catch (error) {
    console.error('Transform error:', error);
    throw new Error(`Data transformation failed: ${error.message}`);
  }
}
```

**Alternatives Considered**:
- **Class-based transformers**: More complex, functional is simpler
- **Template-based transforms**: Less flexible, harder to test
- **Third-party transformation libraries**: Unnecessary for simple transforms

### 5. Error Handling with Observables

**Decision**: Use RxJS `catchError` operator with typed error observables

**Rationale**:
- RxJS provides native error handling patterns
- Typed error observables maintain type safety
- `catchError` allows graceful error recovery
- Aligns with FR-007 and SC-004: clear error messages within 500ms

**Implementation Pattern**:
```typescript
import { catchError, Observable, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

interface DataServiceError {
  message: string;
  code?: string;
  originalError?: any;
}

function handleDataError(error: HttpErrorResponse): Observable<never> {
  const serviceError: DataServiceError = {
    message: error.message || 'Unknown error occurred',
    code: error.status?.toString(),
    originalError: error
  };
  
  return throwError(() => serviceError);
}

// Usage
this.http.get(url).pipe(
  catchError(handleDataError)
);
```

**Alternatives Considered**:
- **Try-catch blocks**: Don't work with Observables, only with Promises
- **Error callbacks**: Not reactive, doesn't align with RxJS patterns
- **Global error handler**: Less granular control

### 6. Loading State Management

**Decision**: Use BehaviorSubject for loading state with shareReplay for multicasting

**Rationale**:
- BehaviorSubject provides current state and reactive updates
- shareReplay prevents duplicate HTTP requests
- Multiple subscribers can share the same loading state
- Aligns with FR-010: handle loading states

**Implementation Pattern**:
```typescript
import { BehaviorSubject, Observable } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';

class DataService {
  private loading$ = new BehaviorSubject<boolean>(false);
  
  fetchData<T>(source: IDataSource): Observable<T> {
    this.loading$.next(true);
    
    return this.http.get<T>(source.endpoint).pipe(
      tap(() => this.loading$.next(false)),
      catchError(error => {
        this.loading$.next(false);
        return throwError(() => error);
      }),
      shareReplay(1) // Cache and share the result
    );
  }
  
  getLoadingState(): Observable<boolean> {
    return this.loading$.asObservable();
  }
}
```

**Alternatives Considered**:
- **Simple boolean flags**: Not reactive, harder to compose
- **Promise-based**: Doesn't align with RxJS requirement
- **State management libraries**: Overkill for simple loading state

### 7. Concurrent Request Handling

**Decision**: Use RxJS `shareReplay` and request deduplication

**Rationale**:
- `shareReplay` prevents duplicate requests for the same data
- Request deduplication improves performance
- Aligns with SC-006: handle 100 concurrent requests

**Implementation Pattern**:
```typescript
private requestCache = new Map<string, Observable<any>>();

fetchData<T>(source: IDataSource): Observable<T> {
  const cacheKey = this.generateCacheKey(source);
  
  // Check if request is already in flight
  if (this.requestCache.has(cacheKey)) {
    return this.requestCache.get(cacheKey)!;
  }
  
  const request$ = this.http.get<T>(source.endpoint).pipe(
    shareReplay(1),
    finalize(() => {
      // Remove from cache when complete
      this.requestCache.delete(cacheKey);
    })
  );
  
  this.requestCache.set(cacheKey, request$);
  return request$;
}
```

**Alternatives Considered**:
- **Queue-based approach**: More complex, unnecessary for HTTP requests
- **Worker threads**: Overkill, browser handles HTTP concurrency
- **Request throttling**: May delay legitimate requests

## Summary

All technical decisions have been made based on:
- Angular and RxJS best practices
- Project constitution requirements
- Performance and success criteria from the spec
- Simplicity and maintainability

No areas require further clarification. Implementation can proceed with confidence.

