import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IDataSource, IDataResponse, IValidationResult } from '../entities/data-source.interface';

/**
 * Data Service - Generic data fetching interface for dashboard widgets
 * 
 * Provides support for multiple data source types (API, static, computed),
 * data transformation, caching, error handling, and retry logic.
 */
@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) {}
}

