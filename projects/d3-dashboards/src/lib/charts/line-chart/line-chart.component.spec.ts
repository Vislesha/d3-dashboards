import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef } from '@angular/core';
import { of, throwError } from 'rxjs';
import { LineChartComponent } from './line-chart.component';
import {
  ILineChartData,
  ILineChartConfiguration,
  ILineChartSeries,
  ILineChartDataPoint,
} from '../../entities/line-chart.interface';
import { IDataSource } from '../../entities/data-source.interface';
import { DataService } from '../../services/data.service';

// Mock DataService
class MockDataService {
  fetchData = jest.fn();
}

describe('LineChartComponent', () => {
  let component: LineChartComponent;
  let fixture: ComponentFixture<LineChartComponent>;
  let mockDataService: MockDataService;
  let mockChangeDetectorRef: Partial<ChangeDetectorRef>;

  const mockChartData: ILineChartData = {
    series: [
      {
        id: 'series1',
        name: 'Series 1',
        data: [
          { x: 1, y: 10 },
          { x: 2, y: 20 },
          { x: 3, y: 30 },
        ],
      },
    ],
  };

  const mockMultiSeriesData: ILineChartData = {
    series: [
      {
        id: 'series1',
        name: 'Series 1',
        data: [
          { x: 1, y: 10 },
          { x: 2, y: 20 },
        ],
      },
      {
        id: 'series2',
        name: 'Series 2',
        data: [
          { x: 1, y: 15 },
          { x: 2, y: 25 },
        ],
      },
    ],
  };

  beforeEach(async () => {
    mockDataService = new MockDataService();
    mockChangeDetectorRef = {
      markForCheck: jest.fn(),
      detectChanges: jest.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [LineChartComponent],
      providers: [
        { provide: DataService, useValue: mockDataService },
        { provide: ChangeDetectorRef, useValue: mockChangeDetectorRef },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LineChartComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with empty state when no data provided', () => {
      component.ngOnInit();
      fixture.detectChanges();
      expect(component.isEmpty).toBe(true);
    });

    it('should initialize chart when data is provided', () => {
      component.data = mockChartData;
      component.ngOnInit();
      fixture.detectChanges();
      expect(component.chartData).toBeTruthy();
    });
  });

  describe('Data Handling', () => {
    it('should handle direct ILineChartData input', () => {
      component.data = mockChartData;
      component.ngOnInit();
      fixture.detectChanges();
      expect(component.chartData).toEqual(mockChartData);
      expect(component.isEmpty).toBe(false);
    });

    it('should handle IDataSource input and fetch data', () => {
      const dataSource: IDataSource = {
        type: 'static',
        data: mockChartData,
      };
      mockDataService.fetchData.mockReturnValue(
        of({
          data: mockChartData,
          loading: false,
          error: null,
          timestamp: Date.now(),
          fromCache: false,
        })
      );

      component.data = dataSource;
      component.ngOnInit();
      fixture.detectChanges();

      expect(mockDataService.fetchData).toHaveBeenCalled();
      expect(component.chartData).toEqual(mockChartData);
    });

    it('should handle data source errors', () => {
      const dataSource: IDataSource = {
        type: 'api',
        endpoint: '/api/data',
      };
      mockDataService.fetchData.mockReturnValue(
        of({
          data: null,
          loading: false,
          error: { message: 'Failed to fetch', retryable: false },
          timestamp: Date.now(),
          fromCache: false,
        })
      );

      component.data = dataSource;
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.hasError).toBe(true);
    });

    it('should handle empty data gracefully', () => {
      const emptyData: ILineChartData = {
        series: [],
      };
      component.data = emptyData;
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.isEmpty).toBe(true);
      expect(component.chartData).toBeNull();
    });

    it('should validate data structure', () => {
      const invalidData = {
        series: [
          {
            id: '',
            name: '',
            data: [],
          },
        ],
      } as any;

      component.data = invalidData;
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.hasError).toBe(true);
    });

    it('should sort data points by x-value', () => {
      const unsortedData: ILineChartData = {
        series: [
          {
            id: 'series1',
            name: 'Series 1',
            data: [
              { x: 3, y: 30 },
              { x: 1, y: 10 },
              { x: 2, y: 20 },
            ],
          },
        ],
      };

      component.data = unsortedData;
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.chartData?.series[0].data[0].x).toBe(1);
      expect(component.chartData?.series[0].data[1].x).toBe(2);
      expect(component.chartData?.series[0].data[2].x).toBe(3);
    });
  });

  describe('Rendering', () => {
    it('should render single series', () => {
      component.data = mockChartData;
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.chartData?.series.length).toBe(1);
      expect(component.isEmpty).toBe(false);
    });

    it('should render multiple series', () => {
      component.data = mockMultiSeriesData;
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.chartData?.series.length).toBe(2);
    });

    it('should handle time-series data', () => {
      const timeSeriesData: ILineChartData = {
        series: [
          {
            id: 'series1',
            name: 'Time Series',
            data: [
              { x: new Date('2024-01-01'), y: 10 },
              { x: new Date('2024-01-02'), y: 20 },
              { x: new Date('2024-01-03'), y: 30 },
            ],
          },
        ],
      };

      component.data = timeSeriesData;
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.chartData).toBeTruthy();
    });

    it('should handle missing/null y values', () => {
      const dataWithNulls: ILineChartData = {
        series: [
          {
            id: 'series1',
            name: 'Series 1',
            data: [
              { x: 1, y: 10 },
              { x: 2, y: null },
              { x: 3, y: 30 },
            ],
          },
        ],
      };

      component.data = dataWithNulls;
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.chartData).toBeTruthy();
    });
  });

  describe('Tooltips', () => {
    it('should setup tooltips when enabled', () => {
      const config: ILineChartConfiguration = {
        tooltip: {
          enabled: true,
        },
      };

      component.data = mockChartData;
      component.config = config;
      component.ngOnInit();
      fixture.detectChanges();

      // Tooltip setup is tested through integration
      expect(component.chartData).toBeTruthy();
    });

    it('should support custom tooltip formatter', () => {
      const config: ILineChartConfiguration = {
        tooltip: {
          enabled: true,
          formatter: (point, series) => `Custom: ${series.name} - ${point.y}`,
        },
      };

      component.data = mockChartData;
      component.config = config;
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.chartData).toBeTruthy();
    });
  });

  describe('Zoom and Pan', () => {
    it('should setup zoom when enabled', () => {
      const config: ILineChartConfiguration = {
        zoom: {
          enabled: true,
        },
      };

      component.data = mockChartData;
      component.config = config;
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.chartData).toBeTruthy();
    });

    it('should reset zoom when data updates', () => {
      component.data = mockChartData;
      component.ngOnInit();
      fixture.detectChanges();

      // Simulate zoom
      component['isZoomed'] = true;

      // Update data
      const newData: ILineChartData = {
        series: [
          {
            id: 'series1',
            name: 'Series 1',
            data: [
              { x: 4, y: 40 },
              { x: 5, y: 50 },
            ],
          },
        ],
      };

      component.data = newData;
      component.ngOnChanges({ data: { currentValue: newData, previousValue: mockChartData, firstChange: false, isFirstChange: () => false } });
      fixture.detectChanges();

      // Zoom should be reset
      expect(component['isZoomed']).toBe(false);
    });

    it('should provide resetZoom public method', () => {
      component.data = mockChartData;
      component.ngOnInit();
      fixture.detectChanges();

      expect(() => component.resetZoom()).not.toThrow();
    });
  });

  describe('Customization', () => {
    it('should support axis label customization', () => {
      const config: ILineChartConfiguration = {
        xAxis: {
          label: 'X Axis Label',
          visible: true,
        },
        yAxis: {
          label: 'Y Axis Label',
          visible: true,
        },
      };

      component.data = mockChartData;
      component.config = config;
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.chartData).toBeTruthy();
    });

    it('should support scale type customization', () => {
      const config: ILineChartConfiguration = {
        xAxis: {
          scaleType: 'time',
        },
        yAxis: {
          scaleType: 'log',
        },
      };

      component.data = mockChartData;
      component.config = config;
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.chartData).toBeTruthy();
    });

    it('should support curve type customization', () => {
      const config: ILineChartConfiguration = {
        series: {
          curveType: 'basis',
        },
      };

      component.data = mockChartData;
      component.config = config;
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.chartData).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should handle large datasets with sampling', () => {
      const largeDataset: ILineChartData = {
        series: [
          {
            id: 'series1',
            name: 'Large Series',
            data: Array.from({ length: 2000 }, (_, i) => ({ x: i, y: i * 10 })),
          },
        ],
      };

      component.data = largeDataset;
      component.ngOnInit();
      fixture.detectChanges();

      // Data should be sampled
      expect(component.chartData?.series[0].data.length).toBeLessThan(2000);
    });

    it('should handle non-chronological data', () => {
      const nonChronologicalData: ILineChartData = {
        series: [
          {
            id: 'series1',
            name: 'Series 1',
            data: [
              { x: 5, y: 50 },
              { x: 1, y: 10 },
              { x: 3, y: 30 },
            ],
          },
        ],
      };

      component.data = nonChronologicalData;
      component.ngOnInit();
      fixture.detectChanges();

      // Data should be sorted
      expect(component.chartData?.series[0].data[0].x).toBe(1);
    });
  });

  describe('Cleanup', () => {
    it('should clean up on destroy', () => {
      component.data = mockChartData;
      component.ngOnInit();
      fixture.detectChanges();

      expect(() => component.ngOnDestroy()).not.toThrow();
    });
  });

  describe('Event Emissions', () => {
    it('should emit error event on invalid data', () => {
      const invalidData = { series: [] } as any;
      const errorSpy = jest.spyOn(component.error, 'emit');

      component.data = invalidData;
      component.ngOnInit();
      fixture.detectChanges();

      expect(errorSpy).toHaveBeenCalled();
    });
  });
});
