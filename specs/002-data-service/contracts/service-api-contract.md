# Data Service API Contract

**Feature**: 002-data-service  
**Date**: 2025-01-27  
**Type**: TypeScript Service Interface

## Service: DataService

### Class Definition

```typescript
@Injectable({ providedIn: 'root' })
export class DataService {
  // Public methods defined below
}
```

### Methods

#### 1. fetchData<T>(source: IDataSource): Observable<IDataResponse<T>>

**Description**: Fetches data from the specified data source, applying caching, transformation, and error handling.

**Parameters**:
- `source: IDataSource` (required)
  - Data source configuration object
  - Must pass validation (see validateDataSource)

**Returns**: `Observable<IDataResponse<T>>`
- Observable that emits DataResponse with data, loading state, and error information
- Emits loading state changes: `{ loading: true }` → `{ loading: false, data: T }` or `{ loading: false, error: DataServiceError }`

**Behavior**:
- Validates data source configuration before fetching
- Checks cache if caching is enabled
- Returns cached data if available and not expired
- Makes HTTP request for API data sources
- Applies request/response interceptors
- Applies transformation function if provided
- Updates cache if caching is enabled
- Handles errors with retry logic if configured
- Returns loading state updates

**Error Handling**:
- Throws validation error if data source is invalid
- Returns error in DataResponse if fetch fails
- Applies retry logic for retryable errors

**Performance**:
- Cache hit: < 10ms (SC-002)
- API request: < 2 seconds (SC-001)
- Transformation: < 100ms for < 1000 items (SC-005)

**Example**:
```typescript
const source: IDataSource = {
  type: 'api',
  endpoint: '/api/data',
  method: 'GET',
  cache: { enabled: true, ttl: 300000 },
  transform: (data) => data.map(item => ({ ...item, processed: true }))
};

this.dataService.fetchData<MyDataType>(source).subscribe({
  next: (response) => {
    if (response.error) {
      console.error('Error:', response.error.message);
    } else {
      console.log('Data:', response.data);
    }
  }
});
```

---

#### 2. validateDataSource(source: IDataSource): IValidationResult

**Description**: Validates a data source configuration before use.

**Parameters**:
- `source: IDataSource` (required)
  - Data source configuration to validate

**Returns**: `IValidationResult`
```typescript
interface IValidationResult {
  valid: boolean;
  errors: string[];
}
```

**Behavior**:
- Validates all required fields based on data source type
- Checks URL format for API sources
- Validates transform function is callable
- Validates cache configuration if provided
- Validates retry configuration if provided
- Returns validation result with errors array

**Validation Rules**:
- Type must be 'api', 'static', or 'computed'
- API sources must have valid endpoint URL
- Static sources must have data array
- Computed sources must have transform function
- Transform function must be callable
- Cache config must be valid if provided
- Retry config must be valid if provided

**Performance**:
- Validation completes within 10ms (SC-009: 100% validation before execution)

**Example**:
```typescript
const source: IDataSource = {
  type: 'api',
  endpoint: '/api/data'
};

const result = this.dataService.validateDataSource(source);
if (!result.valid) {
  console.error('Validation errors:', result.errors);
}
```

---

#### 3. clearCache(key?: string): void

**Description**: Clears cache entries. If key is provided, clears only that entry. Otherwise, clears all entries.

**Parameters**:
- `key?: string` (optional)
  - Cache key to clear. If not provided, clears all cache entries.

**Returns**: `void`

**Behavior**:
- If key provided: removes specific cache entry
- If key not provided: clears all cache entries
- Updates cache size tracking

**Example**:
```typescript
// Clear specific cache entry
this.dataService.clearCache('api:/data/users');

// Clear all cache
this.dataService.clearCache();
```

---

#### 4. getCacheSize(): number

**Description**: Returns the current number of cache entries.

**Parameters**: None

**Returns**: `number`
- Number of active cache entries

**Behavior**:
- Counts all non-expired cache entries
- Excludes expired entries from count

**Example**:
```typescript
const size = this.dataService.getCacheSize();
console.log(`Cache has ${size} entries`);
```

---

#### 5. getLoadingState(): Observable<boolean>

**Description**: Returns an observable of the current loading state.

**Parameters**: None

**Returns**: `Observable<boolean>`
- Observable that emits `true` when any data fetch is in progress, `false` otherwise

**Behavior**:
- Emits `true` when any fetchData() call is in progress
- Emits `false` when no fetches are in progress
- Uses BehaviorSubject for current state

**Example**:
```typescript
this.dataService.getLoadingState().subscribe(loading => {
  if (loading) {
    this.showLoader();
  } else {
    this.hideLoader();
  }
});
```

---

## Interfaces

### IDataSource

```typescript
interface IDataSource {
  type: 'api' | 'static' | 'computed';
  endpoint?: string;
  method?: 'GET' | 'POST';
  params?: Record<string, any>;
  body?: any;
  data?: any[];
  transform?: (data: any) => any;
  cache?: ICacheConfig;
  retry?: IRetryConfig;
}
```

### ICacheConfig

```typescript
interface ICacheConfig {
  enabled: boolean;
  ttl?: number; // milliseconds
  key?: string;
}
```

### IRetryConfig

```typescript
interface IRetryConfig {
  enabled: boolean;
  maxAttempts?: number;
  initialDelay?: number; // milliseconds
  backoffMultiplier?: number;
}
```

### IDataResponse<T>

```typescript
interface IDataResponse<T> {
  data: T | null;
  loading: boolean;
  error: IDataServiceError | null;
  timestamp: number;
  fromCache: boolean;
}
```

### IDataServiceError

```typescript
interface IDataServiceError {
  message: string;
  code?: string;
  originalError?: any;
  retryable: boolean;
}
```

### IValidationResult

```typescript
interface IValidationResult {
  valid: boolean;
  errors: string[];
}
```

## Functional Requirements Mapping

| FR | Requirement | Implementation |
|----|-------------|----------------|
| FR-001 | Generic data fetching interface | `fetchData<T>()` method |
| FR-002 | Support API data sources (GET, POST) | `IDataSource.method` and `body` support |
| FR-003 | Support static data sources | `IDataSource.type === 'static'` |
| FR-004 | Support computed data sources | `IDataSource.type === 'computed'` |
| FR-005 | Data transformation | `IDataSource.transform` function |
| FR-006 | Caching with expiration | `ICacheConfig` and cache management |
| FR-007 | Error handling | `IDataServiceError` and error observables |
| FR-008 | Request/response interceptors | Angular HttpClient interceptors |
| FR-009 | Retry logic | `IRetryConfig` and retry operators |
| FR-010 | Loading states | `getLoadingState()` and `IDataResponse.loading` |
| FR-011 | Validate configurations | `validateDataSource()` method |
| FR-012 | Request parameters and body | `IDataSource.params` and `body` |

## Success Criteria Mapping

| SC | Criterion | Measurement |
|----|-----------|-------------|
| SC-001 | API fetching < 2 seconds | Measured in `fetchData()` |
| SC-002 | Static data < 10ms | Measured in `fetchData()` for static type |
| SC-003 | 50% cache hit rate | Tracked via `fromCache` flag |
| SC-004 | Error messages < 500ms | Error handling in `fetchData()` |
| SC-005 | Transformation < 100ms | Measured in transform application |
| SC-006 | 100 concurrent requests | Service handles concurrent calls |
| SC-007 | 80% retry success rate | Retry logic in `fetchData()` |
| SC-008 | Interceptor < 50ms overhead | Measured in interceptor execution |
| SC-009 | 100% validation | `validateDataSource()` before fetch |
| SC-010 | Cache expiration accuracy | Cache entry expiration logic |

