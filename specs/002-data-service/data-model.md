# Data Model: Data Service

**Feature**: 002-data-service  
**Date**: 2025-01-27

## Entities

### 1. DataSource

**Purpose**: Configuration object defining data source type, endpoint, method, parameters, and transformation.

**Interface**: `IDataSource` (extends existing interface in `widget.interface.ts`)

**Fields**:
- `type: 'api' | 'static' | 'computed'` (required)
  - **Description**: Type of data source
  - **Validation**: Must be one of the three allowed values
  - **Default**: None (required field)

- `endpoint?: string` (optional, required for 'api' type)
  - **Description**: API endpoint URL for API data sources
  - **Validation**: Must be valid URL format when type is 'api'
  - **Format**: Full URL or relative path (resolved by HttpClient base URL)

- `method?: 'GET' | 'POST'` (optional, default: 'GET')
  - **Description**: HTTP method for API requests
  - **Validation**: Must be 'GET' or 'POST'
  - **Default**: 'GET'

- `params?: Record<string, any>` (optional)
  - **Description**: Query parameters for GET requests or URL parameters
  - **Validation**: Object with string keys
  - **Format**: Key-value pairs

- `body?: any` (optional, used for POST requests)
  - **Description**: Request body for POST requests
  - **Validation**: Any serializable value
  - **Format**: JSON-serializable object

- `data?: any[]` (optional, required for 'static' type)
  - **Description**: Static data array for static data sources
  - **Validation**: Array when type is 'static'
  - **Format**: Array of any type

- `transform?: (data: any) => any` (optional)
  - **Description**: Transformation function to apply to fetched data
  - **Validation**: Must be a function
  - **Signature**: `(data: any) => any`

- `cache?: CacheConfig` (optional)
  - **Description**: Caching configuration
  - **Validation**: Valid CacheConfig object
  - **Default**: No caching

**Relationships**:
- Used by: Widget components, Dashboard services
- Validated by: DataService.validateDataSource()

**State Transitions**:
- **Initial**: Configuration object created
- **Validated**: Passes DataService validation
- **Active**: Used in data fetching operation
- **Error**: Validation fails or fetch fails

**Validation Rules**:
1. If `type === 'api'`, `endpoint` must be provided and valid URL
2. If `type === 'static'`, `data` must be provided and be an array
3. If `type === 'computed'`, `transform` function must be provided
4. If `method === 'POST'`, `body` should be provided
5. `transform` function must be callable if provided

### 2. CacheConfig

**Purpose**: Configuration for data caching behavior.

**Interface**: `ICacheConfig`

**Fields**:
- `enabled: boolean` (required)
  - **Description**: Whether caching is enabled for this data source
  - **Validation**: Boolean value
  - **Default**: `false`

- `ttl?: number` (optional, required if enabled is true)
  - **Description**: Time-to-live in milliseconds
  - **Validation**: Positive number
  - **Default**: `300000` (5 minutes)
  - **Unit**: Milliseconds

- `key?: string` (optional)
  - **Description**: Custom cache key (auto-generated if not provided)
  - **Validation**: Non-empty string
  - **Format**: String identifier

**Relationships**:
- Used by: DataSource.cache
- Managed by: DataService cache system

**Validation Rules**:
1. If `enabled === true`, `ttl` must be provided and > 0
2. `key` must be non-empty string if provided

### 3. DataResponse

**Purpose**: Result of data fetching operation, containing data, loading state, and error information.

**Interface**: `IDataResponse<T>`

**Fields**:
- `data: T | null` (required)
  - **Description**: Fetched or transformed data
  - **Validation**: Can be null if error occurred
  - **Type**: Generic type T

- `loading: boolean` (required)
  - **Description**: Whether data is currently being fetched
  - **Validation**: Boolean value
  - **Default**: `false`

- `error: DataServiceError | null` (required)
  - **Description**: Error information if fetch failed
  - **Validation**: Null if no error, DataServiceError if error occurred
  - **Default**: `null`

- `timestamp: number` (required)
  - **Description**: Timestamp when data was fetched
  - **Validation**: Positive number (Unix timestamp in milliseconds)
  - **Format**: Unix timestamp (milliseconds)

- `fromCache: boolean` (required)
  - **Description**: Whether data was retrieved from cache
  - **Validation**: Boolean value
  - **Default**: `false`

**Relationships**:
- Returned by: DataService.fetchData()
- Consumed by: Widget components, Dashboard services

**State Transitions**:
- **Initial**: `{ loading: true, data: null, error: null }`
- **Loading**: `{ loading: true, data: null, error: null }`
- **Success**: `{ loading: false, data: T, error: null }`
- **Error**: `{ loading: false, data: null, error: DataServiceError }`
- **Cached**: `{ loading: false, data: T, error: null, fromCache: true }`

**Validation Rules**:
1. If `loading === true`, `data` should be `null` and `error` should be `null`
2. If `error !== null`, `data` should be `null` and `loading` should be `false`
3. If `data !== null`, `error` should be `null` and `loading` should be `false`
4. `timestamp` must be valid Unix timestamp

### 4. DataServiceError

**Purpose**: Standardized error information for data service operations.

**Interface**: `IDataServiceError`

**Fields**:
- `message: string` (required)
  - **Description**: Human-readable error message
  - **Validation**: Non-empty string
  - **Format**: Error description

- `code?: string` (optional)
  - **Description**: Error code (e.g., HTTP status code)
  - **Validation**: String identifier
  - **Format**: Error code (e.g., "404", "NETWORK_ERROR")

- `originalError?: any` (optional)
  - **Description**: Original error object for debugging
  - **Validation**: Any value
  - **Format**: Original error (HttpErrorResponse, Error, etc.)

- `retryable: boolean` (required)
  - **Description**: Whether the error is retryable
  - **Validation**: Boolean value
  - **Default**: `false`

**Relationships**:
- Used by: DataResponse.error
- Created by: DataService error handlers

**Validation Rules**:
1. `message` must be non-empty
2. `code` should be provided for API errors
3. `retryable` should be `true` for network errors, `false` for validation errors

### 5. CacheEntry

**Purpose**: Cached data with timestamp and expiration information.

**Interface**: `ICacheEntry<T>`

**Fields**:
- `data: T` (required)
  - **Description**: Cached data value
  - **Validation**: Any value
  - **Type**: Generic type T

- `timestamp: number` (required)
  - **Description**: Timestamp when data was cached
  - **Validation**: Positive number (Unix timestamp in milliseconds)
  - **Format**: Unix timestamp (milliseconds)

- `expiration: number` (required)
  - **Description**: Expiration time in milliseconds from timestamp
  - **Validation**: Positive number
  - **Format**: Milliseconds

- `key: string` (required)
  - **Description**: Cache key identifier
  - **Validation**: Non-empty string
  - **Format**: String identifier

**Relationships**:
- Stored in: DataService internal cache Map
- Managed by: DataService cache system

**State Transitions**:
- **Created**: Entry added to cache with timestamp
- **Valid**: Current time < timestamp + expiration
- **Expired**: Current time >= timestamp + expiration (removed from cache)

**Validation Rules**:
1. `timestamp` must be valid Unix timestamp
2. `expiration` must be > 0
3. `key` must be non-empty string
4. Entry is considered expired if `Date.now() - timestamp > expiration`

### 6. RetryConfig

**Purpose**: Configuration for retry logic.

**Interface**: `IRetryConfig`

**Fields**:
- `enabled: boolean` (required)
  - **Description**: Whether retry logic is enabled
  - **Validation**: Boolean value
  - **Default**: `false`

- `maxAttempts: number` (optional, required if enabled is true)
  - **Description**: Maximum number of retry attempts
  - **Validation**: Positive integer, typically 1-5
  - **Default**: `3`

- `initialDelay: number` (optional)
  - **Description**: Initial delay before first retry in milliseconds
  - **Validation**: Non-negative number
  - **Default**: `1000` (1 second)

- `backoffMultiplier: number` (optional)
  - **Description**: Multiplier for exponential backoff
  - **Validation**: Number >= 1
  - **Default**: `2`

**Relationships**:
- Used by: DataSource (optional retry configuration)
- Applied by: DataService retry logic

**Validation Rules**:
1. If `enabled === true`, `maxAttempts` must be provided and > 0
2. `initialDelay` must be >= 0
3. `backoffMultiplier` must be >= 1

## Entity Relationships

```
DataSource
  ├── cache: CacheConfig (optional)
  ├── retry: RetryConfig (optional)
  └── transform: Function (optional)

DataService
  ├── fetchData(source: DataSource): Observable<DataResponse<T>>
  ├── cache: Map<string, CacheEntry<T>>
  └── validateDataSource(source: DataSource): ValidationResult

DataResponse<T>
  ├── data: T | null
  ├── error: DataServiceError | null
  └── fromCache: boolean

CacheEntry<T>
  ├── data: T
  ├── timestamp: number
  └── expiration: number
```

## Validation Summary

### DataSource Validation
- **FR-011**: System MUST validate data source configuration
- **SC-009**: Service validates 100% of data source configurations before execution

**Validation Checks**:
1. Type is one of: 'api', 'static', 'computed'
2. If type is 'api': endpoint is provided and valid URL
3. If type is 'static': data is provided and is array
4. If type is 'computed': transform function is provided
5. Method is 'GET' or 'POST' if provided
6. Transform function is callable if provided
7. Cache config is valid if provided
8. Retry config is valid if provided

### Cache Validation
- **SC-010**: Cache expiration works correctly (100% accuracy)

**Validation Checks**:
1. Cache entry expiration is calculated correctly
2. Expired entries are removed from cache
3. Cache key generation is deterministic
4. Cache TTL is respected

## State Machine

### Data Fetching Flow

```
[Initial] 
  → validateDataSource()
  → [Valid] → checkCache()
  → [Cache Hit] → return cached data
  → [Cache Miss] → fetchData()
  → [Loading] → applyInterceptors()
  → [HTTP Request] → handleResponse()
  → [Success] → applyTransform()
  → [Transformed] → updateCache()
  → [Complete] → return DataResponse
  → [Error] → handleError()
  → [Retryable] → retryWithBackoff()
  → [Non-Retryable] → return error
```

## Data Flow

1. **Widget requests data** → DataService.fetchData(dataSource)
2. **Service validates** → DataService.validateDataSource(dataSource)
3. **Check cache** → Cache lookup by key
4. **If cache hit** → Return cached data immediately
5. **If cache miss** → Make HTTP request (for API type)
6. **Apply interceptors** → Request/response transformation
7. **Handle response** → Success or error
8. **Apply transform** → Data transformation function
9. **Update cache** → Store in cache if enabled
10. **Return response** → DataResponse with data/error

