# Quickstart: Data Service

**Feature**: 002-data-service  
**Date**: 2025-01-27

## Overview

The Data Service provides a generic, type-safe interface for fetching data from multiple sources (API, static, computed) with built-in caching, transformation, error handling, and retry logic.

## Installation

The Data Service is part of the `d3-dashboards` library. Import it in your Angular component or service:

```typescript
import { DataService } from '@d3-dashboards/data-service';
import { IDataSource, IDataResponse } from '@d3-dashboards/entities';
```

## Basic Usage

### 1. Inject the Service

```typescript
import { Component, inject } from '@angular/core';
import { DataService } from '@d3-dashboards/data-service';

@Component({
  selector: 'app-my-component',
  standalone: true,
  template: `<!-- your template -->`
})
export class MyComponent {
  private dataService = inject(DataService);
}
```

### 2. Fetch Data from API

```typescript
// Define data source
const apiSource: IDataSource = {
  type: 'api',
  endpoint: '/api/users',
  method: 'GET'
};

// Fetch data
this.dataService.fetchData<User[]>(apiSource).subscribe({
  next: (response: IDataResponse<User[]>) => {
    if (response.error) {
      console.error('Error:', response.error.message);
    } else {
      console.log('Users:', response.data);
      // Use response.data in your component
    }
  }
});
```

### 3. Use Static Data

```typescript
const staticSource: IDataSource = {
  type: 'static',
  data: [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' }
  ]
};

this.dataService.fetchData<Item[]>(staticSource).subscribe({
  next: (response) => {
    if (response.data) {
      console.log('Static data:', response.data);
    }
  }
});
```

### 4. Use Computed Data

```typescript
const computedSource: IDataSource = {
  type: 'computed',
  transform: () => {
    // Generate or compute data
    return Array.from({ length: 10 }, (_, i) => ({
      id: i,
      value: Math.random() * 100
    }));
  }
};

this.dataService.fetchData<ComputedItem[]>(computedSource).subscribe({
  next: (response) => {
    if (response.data) {
      console.log('Computed data:', response.data);
    }
  }
});
```

## Advanced Features

### Caching

Enable caching to reduce API calls:

```typescript
const cachedSource: IDataSource = {
  type: 'api',
  endpoint: '/api/products',
  method: 'GET',
  cache: {
    enabled: true,
    ttl: 300000, // 5 minutes in milliseconds
    key: 'products-list' // Optional custom key
  }
};

this.dataService.fetchData<Product[]>(cachedSource).subscribe({
  next: (response) => {
    if (response.fromCache) {
      console.log('Data from cache');
    }
    console.log('Products:', response.data);
  }
});
```

### Data Transformation

Transform data before use:

```typescript
const transformedSource: IDataSource = {
  type: 'api',
  endpoint: '/api/raw-data',
  method: 'GET',
  transform: (data: any[]) => {
    // Transform raw API data to widget format
    return data.map(item => ({
      label: item.name,
      value: item.count,
      category: item.type
    }));
  }
};

this.dataService.fetchData<TransformedItem[]>(transformedSource).subscribe({
  next: (response) => {
    if (response.data) {
      // Data is already transformed
      this.chartData = response.data;
    }
  }
});
```

### Retry Logic

Enable retry for transient failures:

```typescript
const retrySource: IDataSource = {
  type: 'api',
  endpoint: '/api/unstable-endpoint',
  method: 'GET',
  retry: {
    enabled: true,
    maxAttempts: 3,
    initialDelay: 1000, // 1 second
    backoffMultiplier: 2 // Exponential backoff
  }
};

this.dataService.fetchData<Data[]>(retrySource).subscribe({
  next: (response) => {
    if (response.data) {
      console.log('Data after retries:', response.data);
    }
  }
});
```

### POST Requests

Send POST requests with body:

```typescript
const postSource: IDataSource = {
  type: 'api',
  endpoint: '/api/search',
  method: 'POST',
  body: {
    query: 'search term',
    filters: { category: 'electronics' }
  }
};

this.dataService.fetchData<SearchResult[]>(postSource).subscribe({
  next: (response) => {
    if (response.data) {
      console.log('Search results:', response.data);
    }
  }
});
```

### Query Parameters

Add query parameters to GET requests:

```typescript
const querySource: IDataSource = {
  type: 'api',
  endpoint: '/api/data',
  method: 'GET',
  params: {
    page: 1,
    limit: 10,
    sort: 'name'
  }
};

this.dataService.fetchData<PaginatedData>(querySource).subscribe({
  next: (response) => {
    if (response.data) {
      console.log('Paginated data:', response.data);
    }
  }
});
```

### Concurrent Requests & Deduplication

Requests for the same data source are deduplicated so all subscribers share a single HTTP call:

```typescript
const sharedSource: IDataSource = {
  type: 'api',
  endpoint: '/api/heavy',
  method: 'GET',
  cache: { enabled: false }
};

const stream$ = this.dataService.fetchData(sharedSource);

stream$.subscribe((response) => console.log('Subscriber A', response.data));
stream$.subscribe((response) => console.log('Subscriber B', response.data));
```

### Timeout Support

Provide a per-request timeout (in milliseconds). If a timeout occurs the error is reported in `response.error` with code `TIMEOUT` and marked retryable.

```typescript
const timeoutSource: IDataSource = {
  type: 'api',
  endpoint: '/api/slow',
  timeout: 2000, // 2 seconds
  retry: {
    enabled: true,
    maxAttempts: 2,
    initialDelay: 500
  }
};

this.dataService.fetchData(timeoutSource).subscribe((response) => {
  if (response.error?.code === 'TIMEOUT') {
    console.warn('Request timed out, showing fallback UI');
  }
});
```

## Loading States

Track loading state:

```typescript
// Method 1: From response
this.dataService.fetchData<Data[]>(source).subscribe({
  next: (response) => {
    if (response.loading) {
      this.showLoader();
    } else {
      this.hideLoader();
    }
  }
});

// Method 2: Global loading state
this.dataService.getLoadingState().subscribe(loading => {
  this.isLoading = loading;
});
```

## Error Handling

Handle errors gracefully:

```typescript
this.dataService.fetchData<Data[]>(source).subscribe({
  next: (response) => {
    if (response.error) {
      // Handle error
      if (response.error.retryable) {
        console.warn('Retryable error:', response.error.message);
        // Service will automatically retry if configured
      } else {
        console.error('Non-retryable error:', response.error.message);
        this.showError(response.error.message);
      }
    } else {
      // Handle success
      this.data = response.data;
    }
  }
});
```

## Cache Management

Inspect and clear cached entries when required (useful for manual refresh):

```typescript
// Inspect cache size
console.log('Cache entries:', this.dataService.getCacheSize());

// Clear a single entry (using custom cache key) or pass no key to flush everything
this.dataService.clearCache('products-list');
```

## Validation

Validate data source before use:

```typescript
const source: IDataSource = {
  type: 'api',
  endpoint: '/api/data'
};

const validation = this.dataService.validateDataSource(source);
if (!validation.valid) {
  console.error('Validation errors:', validation.errors);
  // Fix errors before using source
} else {
  // Source is valid, proceed with fetch
  this.dataService.fetchData<Data[]>(source).subscribe(/* ... */);
}
```

## Cache Management

Manage cache manually:

```typescript
// Clear specific cache entry
this.dataService.clearCache('api:/data/users');

// Clear all cache
this.dataService.clearCache();

// Get cache size
const size = this.dataService.getCacheSize();
console.log(`Cache has ${size} entries`);
```

## Complete Example

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { DataService } from '@d3-dashboards/data-service';
import { IDataSource, IDataResponse } from '@d3-dashboards/entities';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

interface ChartData {
  label: string;
  value: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `
    <div *ngIf="loading">Loading...</div>
    <div *ngIf="error">{{ error }}</div>
    <div *ngIf="data">
      <!-- Render your chart with data -->
    </div>
  `
})
export class DashboardComponent implements OnInit, OnDestroy {
  private dataService = inject(DataService);
  private destroy$ = new Subject<void>();
  
  data: ChartData[] | null = null;
  loading = false;
  error: string | null = null;

  ngOnInit() {
    const source: IDataSource = {
      type: 'api',
      endpoint: '/api/chart-data',
      method: 'GET',
      cache: {
        enabled: true,
        ttl: 300000 // 5 minutes
      },
      transform: (rawData: any[]) => {
        return rawData.map(item => ({
          label: item.name,
          value: item.count
        }));
      },
      retry: {
        enabled: true,
        maxAttempts: 3
      }
    };

    // Track loading state
    this.dataService.getLoadingState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.loading = loading;
      });

    // Fetch data
    this.dataService.fetchData<ChartData[]>(source)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: IDataResponse<ChartData[]>) => {
          if (response.error) {
            this.error = response.error.message;
            this.data = null;
          } else {
            this.data = response.data;
            this.error = null;
            if (response.fromCache) {
              console.log('Data loaded from cache');
            }
          }
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

## Best Practices

1. **Always validate data sources** before use in production
2. **Use caching** for data that doesn't change frequently
3. **Handle errors** gracefully with user-friendly messages
4. **Use loading states** to provide user feedback
5. **Clean up subscriptions** using `takeUntil` pattern
6. **Type your data** using TypeScript generics for type safety
7. **Use transform functions** to format data for specific widget needs
8. **Enable retry** for network requests that may fail transiently

## Next Steps

- See [data-model.md](./data-model.md) for detailed entity definitions
- See [contracts/service-api-contract.md](./contracts/service-api-contract.md) for complete API reference
- See [spec.md](./spec.md) for full feature specification

