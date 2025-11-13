import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DataService } from './data.service';
import { IDataSource, IDataResponse } from '../entities/data-source.interface';

describe('DataService', () => {
  let service: DataService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DataService]
    });
    service = TestBed.inject(DataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('User Story 4 - Caching Support', () => {
    beforeEach(() => {
      (service as unknown as { clearCache: () => void }).clearCache?.();
    });

    it('should cache API response and return cached data on subsequent request', fakeAsync(() => {
      const mockData = [{ id: 1 }];
      const source: IDataSource = {
        type: 'api',
        endpoint: '/api/cache',
        method: 'GET',
        cache: {
          enabled: true,
          ttl: 1_000
        }
      };

      let firstResponse: IDataResponse<typeof mockData> | undefined;
      service.fetchData<typeof mockData>(source).subscribe((response) => {
        firstResponse = response;
      });

      const req = httpMock.expectOne('/api/cache');
      req.flush(mockData);
      tick();

      expect(firstResponse?.data).toEqual(mockData);
      expect(firstResponse?.fromCache).toBe(false);

      let cachedResponse: IDataResponse<typeof mockData> | undefined;
      service.fetchData<typeof mockData>(source).subscribe((response) => {
        cachedResponse = response;
      });
      tick();

      expect(cachedResponse?.data).toEqual(mockData);
      expect(cachedResponse?.fromCache).toBe(true);
      httpMock.expectNone('/api/cache');
    }));

    it('should generate deterministic cache key for equivalent params objects', fakeAsync(() => {
      const mockData = [{ id: 1 }];
      const sourceA: IDataSource = {
        type: 'api',
        endpoint: '/api/cache-key',
        method: 'GET',
        params: { page: 1, limit: 10 },
        cache: {
          enabled: true,
          ttl: 5_000
        }
      };
      const sourceB: IDataSource = {
        ...sourceA,
        params: { limit: 10, page: 1 }
      };

      let firstResponse: IDataResponse<typeof mockData> | undefined;
      service.fetchData<typeof mockData>(sourceA).subscribe((response) => {
        firstResponse = response;
      });

      const req = httpMock.expectOne('/api/cache-key?limit=10&page=1');
      req.flush(mockData);
      tick();

      expect(firstResponse?.fromCache).toBe(false);

      let cachedResponse: IDataResponse<typeof mockData> | undefined;
      service.fetchData<typeof mockData>(sourceB).subscribe((response) => {
        cachedResponse = response;
      });
      tick();

      expect(cachedResponse?.fromCache).toBe(true);
      httpMock.expectNone('/api/cache-key?limit=10&page=1');
    }));

    it('should respect cache expiration and fetch fresh data after TTL', fakeAsync(() => {
      const mockData1 = [{ id: 1, version: 1 }];
      const mockData2 = [{ id: 1, version: 2 }];
      const source: IDataSource = {
        type: 'api',
        endpoint: '/api/expiring',
        method: 'GET',
        cache: {
          enabled: true,
          ttl: 500
        }
      };

      let firstResponse: IDataResponse<typeof mockData1> | undefined;
      service.fetchData<typeof mockData1>(source).subscribe((response) => {
        firstResponse = response;
      });

      const firstReq = httpMock.expectOne('/api/expiring');
      firstReq.flush(mockData1);
      tick(100);

      expect(firstResponse?.data).toEqual(mockData1);
      expect(firstResponse?.fromCache).toBe(false);

      tick(600); // expire cache

      let secondResponse: IDataResponse<typeof mockData2> | undefined;
      service.fetchData<typeof mockData2>(source).subscribe((response) => {
        secondResponse = response;
      });

      const secondReq = httpMock.expectOne('/api/expiring');
      secondReq.flush(mockData2);
      tick();

      expect(secondResponse?.data).toEqual(mockData2);
      expect(secondResponse?.fromCache).toBe(false);
    }));

    it('should honor custom cache key when provided', fakeAsync(() => {
      const mockData = [{ id: 1 }];
      const source: IDataSource = {
        type: 'api',
        endpoint: '/api/custom-key',
        method: 'GET',
        cache: {
          enabled: true,
          ttl: 5_000,
          key: 'custom-key'
        }
      };

      service.fetchData<typeof mockData>(source).subscribe();
      const req = httpMock.expectOne('/api/custom-key');
      req.flush(mockData);
      tick();

      let cachedResponse: IDataResponse<typeof mockData> | undefined;
      service.fetchData<typeof mockData>({
        ...source,
        endpoint: '/api/custom-key-ignored'
      }).subscribe((response) => {
        cachedResponse = response;
      });
      tick();

      expect(cachedResponse?.data).toEqual(mockData);
      expect(cachedResponse?.fromCache).toBe(true);
      httpMock.expectNone('/api/custom-key-ignored');
    }));

    it('should clear entire cache when clearCache is called without key', fakeAsync(() => {
      const mockData = [{ id: 1 }];
      const source: IDataSource = {
        type: 'api',
        endpoint: '/api/clear-all',
        method: 'GET',
        cache: {
          enabled: true,
          ttl: 5_000
        }
      };

      service.fetchData<typeof mockData>(source).subscribe();
      const req = httpMock.expectOne('/api/clear-all');
      req.flush(mockData);
      tick();

      const cacheControls = service as unknown as {
        clearCache: (key?: string) => void;
        getCacheSize: () => number;
      };
      expect(cacheControls.getCacheSize()).toBe(1);

      cacheControls.clearCache();
      expect(cacheControls.getCacheSize()).toBe(0);

      service.fetchData<typeof mockData>(source).subscribe();
      const secondReq = httpMock.expectOne('/api/clear-all');
      secondReq.flush(mockData);
    }));

    it('should clear specific cache entry when key provided', fakeAsync(() => {
      const mockData = [{ id: 1 }];
      const sourceA: IDataSource = {
        type: 'api',
        endpoint: '/api/a',
        method: 'GET',
        cache: {
          enabled: true,
          ttl: 5_000,
          key: 'A'
        }
      };
      const sourceB: IDataSource = {
        type: 'api',
        endpoint: '/api/b',
        method: 'GET',
        cache: {
          enabled: true,
          ttl: 5_000,
          key: 'B'
        }
      };

      service.fetchData<typeof mockData>(sourceA).subscribe();
      httpMock.expectOne('/api/a').flush(mockData);
      service.fetchData<typeof mockData>(sourceB).subscribe();
      httpMock.expectOne('/api/b').flush(mockData);
      tick();

      const cacheControls = service as unknown as {
        clearCache: (key?: string) => void;
        getCacheSize: () => number;
      };
      expect(cacheControls.getCacheSize()).toBe(2);

      cacheControls.clearCache('A');
      expect(cacheControls.getCacheSize()).toBe(1);

      // A should miss cache
      service.fetchData<typeof mockData>(sourceA).subscribe();
      httpMock.expectOne('/api/a').flush(mockData);
      tick();

      // B should still be cached
      let cachedResponse: IDataResponse<typeof mockData> | undefined;
      service.fetchData<typeof mockData>(sourceB).subscribe((response) => {
        cachedResponse = response;
      });
      tick();
      expect(cachedResponse?.fromCache).toBe(true);
      httpMock.expectNone('/api/b');
    }));
  });

  describe('Loading State Tracking', () => {
    it('should emit loading state transitions for API requests', fakeAsync(() => {
      const source: IDataSource = {
        type: 'api',
        endpoint: '/api/loading',
        method: 'GET'
      };

      const states: boolean[] = [];
      const subscription = service.getLoadingState().subscribe((state) => states.push(state));

      service.fetchData(source).subscribe();
      const req = httpMock.expectOne('/api/loading');

      expect(states[states.length - 1]).toBe(true);

      req.flush([{ id: 1 }]);
      tick();

      expect(states[states.length - 1]).toBe(false);
      subscription.unsubscribe();
    }));
  });

  describe('Validation Rules', () => {
    it('should validate required fields for API sources', () => {
      const invalidSource = {
        type: 'api'
      } as unknown as IDataSource;

      const result = service.validateDataSource(invalidSource);
      expect(result.valid).toBe(false);
      expect(result.errors.some((message) => message.includes('Endpoint is required'))).toBe(true);
    });

    it('should validate static data source requires data array', () => {
      const source = {
        type: 'static'
      } as unknown as IDataSource;

      const result = service.validateDataSource(source);
      expect(result.valid).toBe(false);
      expect(result.errors.some((message) => message.includes('Data array is required'))).toBe(true);
    });

    it('should validate computed data source requires transform function', () => {
      const source = {
        type: 'computed'
      } as unknown as IDataSource;

      const result = service.validateDataSource(source);
      expect(result.valid).toBe(false);
      expect(result.errors.some((message) => message.includes('Transform function is required'))).toBe(true);
    });

    it('should validate retry configuration when enabled', () => {
      const source: IDataSource = {
        type: 'api',
        endpoint: '/api/retry',
        retry: {
          enabled: true,
          maxAttempts: 0
        }
      };

      const result = service.validateDataSource(source);
      expect(result.valid).toBe(false);
      expect(result.errors.some((message) => message.includes('Retry maxAttempts must be a positive number'))).toBe(true);
    });

    it('should validate cache configuration when enabled', () => {
      const source: IDataSource = {
        type: 'api',
        endpoint: '/api/cache-validation',
        cache: {
          enabled: true,
          ttl: 0
        }
      };

      const result = service.validateDataSource(source);
      expect(result.valid).toBe(false);
      expect(result.errors.some((message) => message.includes('Cache TTL must be a positive number'))).toBe(true);
    });

    it('should return valid result when all configurations are correct', () => {
      const source: IDataSource = {
        type: 'api',
        endpoint: '/api/valid',
        method: 'GET',
        params: { page: 1 },
        cache: {
          enabled: true,
          ttl: 1_000
        },
        retry: {
          enabled: true,
          maxAttempts: 3,
          initialDelay: 100,
          backoffMultiplier: 2
        }
      };

      const result = service.validateDataSource(source);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });

  describe('Phase 7 - Error Handling & Retry Logic', () => {
    it('should retry failed requests according to retry config with exponential backoff', fakeAsync(() => {
      const successfulPayload = { ok: true };
      const source: IDataSource = {
        type: 'api',
        endpoint: '/api/retry',
        method: 'GET',
        retry: {
          enabled: true,
          maxAttempts: 3,
          initialDelay: 100,
          backoffMultiplier: 1
        }
      };

      let finalResponse: IDataResponse<typeof successfulPayload> | undefined;
      service.fetchData<typeof successfulPayload>(source).subscribe((response) => {
        finalResponse = response;
      });

      const firstReq = httpMock.expectOne('/api/retry');
      firstReq.flush({ message: 'fail' }, { status: 500, statusText: 'Server Error' });
      tick(100);

      const secondReq = httpMock.expectOne('/api/retry');
      secondReq.flush({ message: 'fail again' }, { status: 500, statusText: 'Server Error' });
      tick(100);

      const thirdReq = httpMock.expectOne('/api/retry');
      thirdReq.flush(successfulPayload);
      tick();

      expect(finalResponse?.data).toEqual(successfulPayload);
      expect(finalResponse?.error).toBeNull();
    }));

    it('should not retry non-retryable errors even when retry enabled', fakeAsync(() => {
      const source: IDataSource = {
        type: 'api',
        endpoint: '/api/no-retry',
        method: 'GET',
        retry: {
          enabled: true,
          maxAttempts: 3,
          initialDelay: 50,
          backoffMultiplier: 1
        }
      };

      let response: IDataResponse<any> | undefined;
      service.fetchData(source).subscribe((res) => (response = res));

      const req = httpMock.expectOne('/api/no-retry');
      req.flush({ error: 'Bad Request' }, { status: 400, statusText: 'Bad Request' });
      tick(200);

      expect(response?.error?.retryable).toBe(false);
      httpMock.expectNone('/api/no-retry');
    }));

    it('should deduplicate concurrent requests for the same data source', fakeAsync(() => {
      const source: IDataSource = {
        type: 'api',
        endpoint: '/api/dedup',
        method: 'GET'
      };

      const responses: IDataResponse<any>[] = [];
      service.fetchData(source).subscribe((res) => responses.push(res));
      service.fetchData(source).subscribe((res) => responses.push(res));

      const req = httpMock.expectOne('/api/dedup');
      req.flush([{ id: 1 }]);
      tick();

      expect(responses).toHaveLength(2);
      expect(responses.every((res) => res.data?.length === 1)).toBe(true);
      httpMock.expectNone('/api/dedup');
    }));

    it('should reuse in-flight request when same fetchData is called again before completion', fakeAsync(() => {
      const source: IDataSource = {
        type: 'api',
        endpoint: '/api/inflight',
        method: 'GET'
      };

      const responseA: IDataResponse<any>[] = [];
      const responseB: IDataResponse<any>[] = [];

      const observable = service.fetchData(source);
      observable.subscribe((res) => responseA.push(res));

      tick(50); // simulate a small delay before second call while request is still in-flight

      service.fetchData(source).subscribe((res) => responseB.push(res));

      const req = httpMock.expectOne('/api/inflight');
      req.flush([{ id: 1 }]);
      tick();

      expect(responseA).toHaveLength(1);
      expect(responseB).toHaveLength(1);
      expect(responseA[0].data).toEqual(responseB[0].data);
      httpMock.expectNone('/api/inflight');
    }));

    it('should treat network timeouts as retryable errors with timeout code', fakeAsync(() => {
      const source: IDataSource = {
        type: 'api',
        endpoint: '/api/timeout',
        method: 'GET',
        timeout: 50,
        retry: {
          enabled: false
        }
      };

      let response: IDataResponse<any> | undefined;

      service.fetchData(source).subscribe((res) => {
        response = res;
      });

      const req = httpMock.expectOne('/api/timeout');
      tick(60); // exceed timeout
      expect(req.cancelled).toBe(true);
      tick();

      expect(response?.error).not.toBeNull();
      expect(response?.error?.code).toBe('TIMEOUT');
      expect(response?.error?.retryable).toBe(true);
    }));
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('User Story 1 - Fetch Data from API', () => {
    describe('fetchData with GET request', () => {
      it('should fetch data from API endpoint using GET method', (done) => {
        const mockData = [{ id: 1, name: 'Test' }];
        const source: IDataSource = {
          type: 'api',
          endpoint: '/api/test',
          method: 'GET'
        };

        service.fetchData<typeof mockData>(source).subscribe({
          next: (response: IDataResponse<typeof mockData>) => {
            expect(response.data).toEqual(mockData);
            expect(response.loading).toBe(false);
            expect(response.error).toBeNull();
            expect(response.fromCache).toBe(false);
            done();
          }
        });

        const req = httpMock.expectOne('/api/test');
        expect(req.request.method).toBe('GET');
        req.flush(mockData);
      });

      it('should handle GET request with query parameters', (done) => {
        const mockData = [{ id: 1 }];
        const source: IDataSource = {
          type: 'api',
          endpoint: '/api/test',
          method: 'GET',
          params: { page: 1, limit: 10 }
        };

        service.fetchData<typeof mockData>(source).subscribe({
          next: (response) => {
            expect(response.data).toEqual(mockData);
            done();
          }
        });

        const req = httpMock.expectOne('/api/test?limit=10&page=1');
        expect(req.request.method).toBe('GET');
        req.flush(mockData);
      });
    });

    describe('fetchData with POST request', () => {
      it('should fetch data from API endpoint using POST method with body', (done) => {
        const mockData = { success: true };
        const requestBody = { query: 'test' };
        const source: IDataSource = {
          type: 'api',
          endpoint: '/api/search',
          method: 'POST',
          body: requestBody
        };

        service.fetchData<typeof mockData>(source).subscribe({
          next: (response: IDataResponse<typeof mockData>) => {
            expect(response.data).toEqual(mockData);
            expect(response.loading).toBe(false);
            expect(response.error).toBeNull();
            done();
          }
        });

        const req = httpMock.expectOne('/api/search');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(requestBody);
        req.flush(mockData);
      });
    });

    describe('fetchData error handling', () => {
      it('should emit error in DataResponse.error instead of Observable error', (done) => {
        const source: IDataSource = {
          type: 'api',
          endpoint: '/api/error',
          method: 'GET'
        };

        service.fetchData<any>(source).subscribe({
          next: (response: IDataResponse<any>) => {
            expect(response.data).toBeNull();
            expect(response.loading).toBe(false);
            expect(response.error).not.toBeNull();
            expect(response.error?.message).toBeTruthy();
            expect(response.error?.retryable).toBeDefined();
            done();
          }
        });

        const req = httpMock.expectOne('/api/error');
        req.error(new ProgressEvent('Network error'), { status: 500 });
      });

      it('should handle 404 errors as non-retryable', (done) => {
        const source: IDataSource = {
          type: 'api',
          endpoint: '/api/notfound',
          method: 'GET'
        };

        service.fetchData<any>(source).subscribe({
          next: (response: IDataResponse<any>) => {
            expect(response.error).not.toBeNull();
            expect(response.error?.code).toBe('404');
            expect(response.error?.retryable).toBe(false);
            done();
          }
        });

        const req = httpMock.expectOne('/api/notfound');
        req.flush({ error: 'Not Found' }, { status: 404, statusText: 'Not Found' });
      });
    });
  });

  describe('User Story 2 - Support Multiple Data Source Types', () => {
    it('should return static data immediately without HTTP request', (done) => {
      const staticData = [
        { id: 1, label: 'One' },
        { id: 2, label: 'Two' }
      ];
      const source: IDataSource = {
        type: 'static',
        data: staticData
      };

      service.fetchData<typeof staticData>(source).subscribe({
        next: (response) => {
          expect(response.data).toEqual(staticData);
          expect(response.loading).toBe(false);
          expect(response.error).toBeNull();
          expect(response.fromCache).toBe(false);
          done();
        }
      });
    });

    it('should execute computed data source transform and return computed data', (done) => {
      const computedResult = Array.from({ length: 3 }, (_, index) => ({
        id: index + 1,
        value: index * 10
      }));
      const source: IDataSource = {
        type: 'computed',
        transform: () => computedResult
      };

      service.fetchData<typeof computedResult>(source).subscribe({
        next: (response) => {
          expect(response.data).toEqual(computedResult);
          expect(response.loading).toBe(false);
          expect(response.error).toBeNull();
          expect(response.fromCache).toBe(false);
          done();
        }
      });
    });
  });

  describe('User Story 3 - Data Transformation', () => {
    it('should apply transform function to API data before returning response', (done) => {
      const apiData = [
        { id: 1, name: 'Alice', age: 30 },
        { id: 2, name: 'Bob', age: 28 }
      ];
      const source: IDataSource = {
        type: 'api',
        endpoint: '/api/users',
        method: 'GET',
        transform: (data: typeof apiData) =>
          data.map((item) => ({
            label: item.name,
            value: item.age
          }))
      };

      service.fetchData<Array<{ label: string; value: number }>>(source).subscribe({
        next: (response) => {
          expect(response.data).toEqual([
            { label: 'Alice', value: 30 },
            { label: 'Bob', value: 28 }
          ]);
          expect(response.error).toBeNull();
          done();
        }
      });

      const req = httpMock.expectOne('/api/users');
      req.flush(apiData);
    });

    it('should surface transform errors in DataResponse.error without throwing', (done) => {
      const apiData = [{ id: 1, value: 10 }];
      const source: IDataSource = {
        type: 'api',
        endpoint: '/api/transform-error',
        method: 'GET',
        transform: () => {
          throw new Error('Transform failed');
        }
      };

      service.fetchData(source).subscribe({
        next: (response) => {
          expect(response.data).toBeNull();
          expect(response.error).not.toBeNull();
          expect(response.error?.message).toContain('Transform failed');
          done();
        }
      });

      const req = httpMock.expectOne('/api/transform-error');
      req.flush(apiData);
    });

    it('should return validation error when transform is not a function', (done) => {
      const source: IDataSource = {
        type: 'api',
        endpoint: '/api/invalid-transform',
        method: 'GET',
        // @ts-expect-error intentional invalid transform for test validation
        transform: 'not-a-function'
      };

      service.fetchData(source).subscribe({
        next: (response) => {
          expect(response.data).toBeNull();
          expect(response.error).not.toBeNull();
          expect(response.error?.message).toContain('Transform must be a callable function');
          done();
        }
      });
    });
  });
});

