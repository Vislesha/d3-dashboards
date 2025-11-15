/**
 * Line Chart Component
 *
 * D3.js-based line chart component with multiple series support, interactive tooltips,
 * zoom and pan capabilities, time-series support, and customizable axes and scales.
 */

import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  SimpleChanges,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, Observable, fromEvent } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';
import * as d3 from 'd3';
import {
  ILineChartData,
  ILineChartConfiguration,
  ILineChartSeries,
  ILineChartDataPoint,
  IZoomState,
} from '../../entities/line-chart.interface';
import { IDataSource } from '../../entities/data-source.interface';
import { IFilterValues } from '../../entities/filter.interface';
import { DataService } from '../../services/data.service';
import { ColorPaletteManager } from '../../utils/color-palette';
import {
  createZoomBehavior,
  resetZoomTransform,
  constrainZoomBounds,
} from '../../utils/zoom-helpers';

/**
 * Default configuration values
 */
const DEFAULT_CONFIG: Required<Pick<ILineChartConfiguration, 'width' | 'height' | 'margins'>> = {
  width: 800,
  height: 400,
  margins: {
    top: 20,
    right: 20,
    bottom: 40,
    left: 60,
  },
};

@Component({
  selector: 'd3-line-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineChartComponent implements OnInit, OnChanges, OnDestroy {
  /** Chart data - can be ILineChartData or IDataSource */
  @Input() data!: ILineChartData | IDataSource;

  /** Chart configuration */
  @Input() config?: ILineChartConfiguration;

  /** Chart width (overrides config.width) */
  @Input() width?: number;

  /** Chart height (overrides config.height) */
  @Input() height?: number;

  /** Filter values for data filtering */
  @Input() filters?: IFilterValues[];

  /** Emitted when a data point is clicked */
  @Output() pointClick = new EventEmitter<{ point: ILineChartDataPoint; series: ILineChartSeries }>();

  /** Emitted when a data point is hovered */
  @Output() pointHover = new EventEmitter<{ point: ILineChartDataPoint; series: ILineChartSeries }>();

  /** Emitted when zoom/pan state changes */
  @Output() zoomChange = new EventEmitter<IZoomState>();

  /** Emitted when an error occurs */
  @Output() error = new EventEmitter<Error>();

  /** Template references */
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('svgContainer', { static: true }) svgContainer!: ElementRef<SVGSVGElement>;

  /** Internal chart data */
  chartData: ILineChartData | null = null;

  /** Empty state flag */
  isEmpty = false;

  /** Error state flag */
  hasError = false;

  /** Error message */
  errorMessage = '';

  /** D3 selections */
  private svg: d3.Selection<SVGSVGElement, unknown, null, undefined> | null = null;
  private g: d3.Selection<SVGGElement, unknown, null, undefined> | null = null;
  private xScale: d3.ScaleTime<number, number> | d3.ScaleLinear<number, number> | null = null;
  private yScale: d3.ScaleLinear<number, number> | d3.ScaleLogarithmic<number, number> | null = null;
  private xAxis: d3.Axis<d3.AxisDomain> | null = null;
  private yAxis: d3.Axis<d3.AxisDomain> | null = null;

  /** ResizeObserver for container resizing */
  private resizeObserver: ResizeObserver | null = null;

  /** Destroy subject for cleanup */
  private destroy$ = new Subject<void>();

  /** Color palette manager */
  private colorPaletteManager = new ColorPaletteManager();

  /** Memoized calculations */
  private memoizedScales: {
    xDomain: [number, number] | [Date, Date] | null;
    yDomain: [number, number] | null;
    width: number;
    height: number;
  } | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.initializeChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['config'] || changes['width'] || changes['height'] || changes['filters']) {
      this.handleDataUpdate();
    }
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  /**
   * Initializes the chart SVG container and sets up ResizeObserver
   */
  private initializeChart(): void {
    if (!this.svgContainer?.nativeElement || !this.chartContainer?.nativeElement) {
      return;
    }

    // Create SVG and main group
    this.svg = d3.select(this.svgContainer.nativeElement);
    this.g = this.svg.append('g').attr('class', 'chart-content');

    // Set up ResizeObserver on widget container
    this.setupResizeObserver();

    // Load and render initial data
    this.handleDataUpdate();
  }

  /**
   * Sets up ResizeObserver to detect container size changes
   */
  private setupResizeObserver(): void {
    if (!this.chartContainer?.nativeElement) {
      return;
    }

    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) {
          // Debounce resize events
          fromEvent(window, 'resize')
            .pipe(debounceTime(300), takeUntil(this.destroy$))
            .subscribe(() => {
              this.updateChartDimensions();
            });
          this.updateChartDimensions();
        }
      }
    });

    this.resizeObserver.observe(this.chartContainer.nativeElement);
  }

  /**
   * Handles data updates (from IDataSource or direct ILineChartData)
   */
  private handleDataUpdate(): void {
    if (!this.data) {
      this.isEmpty = true;
      this.hasError = false;
      this.cdr.markForCheck();
      return;
    }

    // Check if data is IDataSource
    if (this.isDataSource(this.data)) {
      this.loadDataFromSource(this.data);
    } else {
      // Direct ILineChartData
      this.processChartData(this.data);
    }
  }

  /**
   * Checks if input is IDataSource
   */
  private isDataSource(data: ILineChartData | IDataSource): data is IDataSource {
    return 'type' in data && (data.type === 'api' || data.type === 'static' || data.type === 'computed');
  }

  /**
   * Loads data from IDataSource
   */
  private loadDataFromSource(source: IDataSource): void {
    this.dataService.fetchData<ILineChartData>(source).subscribe({
      next: (response) => {
        if (response.error) {
          this.handleError(new Error(response.error.message));
          return;
        }
        if (response.data) {
          this.processChartData(response.data);
        } else {
          this.isEmpty = true;
          this.hasError = false;
          this.cdr.markForCheck();
        }
      },
      error: (err) => {
        this.handleError(err instanceof Error ? err : new Error('Failed to fetch data'));
      },
    });
  }

  /**
   * Processes chart data: validates, applies filters, and renders
   */
  private processChartData(data: ILineChartData): void {
    try {
      // Validate data
      const validation = this.validateData(data);
      if (!validation.valid) {
        this.handleError(new Error(`Invalid data: ${validation.errors.join(', ')}`));
        return;
      }

      // Apply filters if provided
      let processedData = data;
      if (this.filters && this.filters.length > 0) {
        processedData = this.applyFilters(data, this.filters);
      }

      // Check if empty
      if (!processedData.series || processedData.series.length === 0) {
        this.isEmpty = true;
        this.hasError = false;
        this.chartData = null;
        this.cdr.markForCheck();
        return;
      }

      // Sort data points by x-value
      processedData = this.sortDataPoints(processedData);

      // Sample data if too large
      processedData = this.sampleLargeDataset(processedData);

      this.chartData = processedData;
      this.isEmpty = false;
      this.hasError = false;
      this.renderChart();
      this.cdr.markForCheck();
    } catch (error) {
      this.handleError(error instanceof Error ? error : new Error('Failed to process data'));
    }
  }

  /**
   * Validates chart data structure
   */
  private validateData(data: ILineChartData): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.series || !Array.isArray(data.series) || data.series.length === 0) {
      errors.push('Series array must be non-empty');
      return { valid: false, errors };
    }

    const seriesIds = new Set<string>();
    for (const series of data.series) {
      if (!series.id) {
        errors.push('Series must have an id');
      } else if (seriesIds.has(series.id)) {
        errors.push(`Duplicate series id: ${series.id}`);
      } else {
        seriesIds.add(series.id);
      }

      if (!series.name || series.name.trim() === '') {
        errors.push(`Series ${series.id} must have a non-empty name`);
      }

      if (!series.data || !Array.isArray(series.data) || series.data.length === 0) {
        errors.push(`Series ${series.id} must have non-empty data array`);
      }

      // Validate data points
      for (const point of series.data) {
        if (point.x === undefined || point.x === null) {
          errors.push(`Series ${series.id} has invalid x value`);
        }
        if (point.y !== null && (typeof point.y !== 'number' || isNaN(point.y))) {
          errors.push(`Series ${series.id} has invalid y value`);
        }
      }
    }

    // Check x-axis type compatibility
    if (data.series.length > 1) {
      const firstType = typeof data.series[0].data[0]?.x;
      for (let i = 1; i < data.series.length; i++) {
        const currentType = typeof data.series[i].data[0]?.x;
        if (currentType !== firstType) {
          errors.push('All series must have compatible x-axis value types');
          break;
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Applies filters to chart data
   */
  private applyFilters(data: ILineChartData, filters: IFilterValues[]): ILineChartData {
    // For now, return data as-is (filtering logic can be enhanced)
    // This supports the pattern where widget component applies filters before passing data
    return data;
  }

  /**
   * Sorts data points by x-value
   */
  private sortDataPoints(data: ILineChartData): ILineChartData {
    const sortedData: ILineChartData = {
      ...data,
      series: data.series.map((series) => ({
        ...series,
        data: [...series.data].sort((a, b) => {
          if (a.x instanceof Date && b.x instanceof Date) {
            return a.x.getTime() - b.x.getTime();
          }
          if (typeof a.x === 'number' && typeof b.x === 'number') {
            return a.x - b.x;
          }
          return String(a.x).localeCompare(String(b.x));
        }),
      })),
    };
    return sortedData;
  }

  /**
   * Samples large datasets for performance
   */
  private sampleLargeDataset(data: ILineChartData): ILineChartData {
    const SAMPLE_THRESHOLD = 1000;
    const sampledData: ILineChartData = {
      ...data,
      series: data.series.map((series) => {
        if (series.data.length <= SAMPLE_THRESHOLD) {
          return series;
        }

        // Sample data maintaining min/max values
        const sampleSize = Math.ceil(series.data.length / (series.data.length / SAMPLE_THRESHOLD));
        const sampled: ILineChartDataPoint[] = [];
        const step = Math.floor(series.data.length / sampleSize);

        for (let i = 0; i < series.data.length; i += step) {
          const chunk = series.data.slice(i, i + step);
          if (chunk.length > 0) {
            // Include first point, min, max, and last point of chunk
            sampled.push(chunk[0]);
            const validPoints = chunk.filter((p) => p.y !== null && p.y !== undefined);
            if (validPoints.length > 0) {
              const minPoint = validPoints.reduce((min, p) => (p.y! < min.y! ? p : min));
              const maxPoint = validPoints.reduce((max, p) => (p.y! > max.y! ? p : max));
              if (minPoint !== chunk[0]) sampled.push(minPoint);
              if (maxPoint !== chunk[0] && maxPoint !== minPoint) sampled.push(maxPoint);
            }
            if (chunk.length > 1 && chunk[chunk.length - 1] !== chunk[0]) {
              sampled.push(chunk[chunk.length - 1]);
            }
          }
        }

        return {
          ...series,
          data: sampled,
        };
      }),
    };
    return sampledData;
  }

  /**
   * Renders the chart using D3
   */
  private renderChart(): void {
    if (!this.chartData || !this.svg || !this.g) {
      return;
    }

    // Clear previous render
    this.g.selectAll('*').remove();

    // Update dimensions
    this.updateChartDimensions();

    // Create scales
    this.createScales();

    // Create axes
    this.createAxes();

    // Render axes
    this.renderAxes();

    // Render lines
    this.renderLines();

    // Update memoized calculations
    this.updateMemoizedScales();
  }

  /**
   * Updates chart dimensions based on config or container size
   */
  private updateChartDimensions(): void {
    if (!this.svg || !this.chartContainer?.nativeElement) {
      return;
    }

    const containerRect = this.chartContainer.nativeElement.getBoundingClientRect();
    const config = this.getEffectiveConfig();
    const width = this.width || config.width || containerRect.width || DEFAULT_CONFIG.width;
    const height = this.height || config.height || containerRect.height || DEFAULT_CONFIG.height;
    const margins = config.margins || DEFAULT_CONFIG.margins;

    this.svg.attr('width', width).attr('height', height);

    if (this.g) {
      this.g.attr('transform', `translate(${margins.left},${margins.top})`);
    }

    // Invalidate memoized scales to force recalculation
    this.memoizedScales = null;
  }

  /**
   * Gets effective configuration with defaults
   */
  private getEffectiveConfig(): ILineChartConfiguration {
    return {
      width: DEFAULT_CONFIG.width,
      height: DEFAULT_CONFIG.height,
      margins: DEFAULT_CONFIG.margins,
      ...this.config,
    };
  }

  /**
   * Creates D3 scales based on data domain
   */
  private createScales(): void {
    if (!this.chartData || !this.svg || !this.g) {
      return;
    }

    const config = this.getEffectiveConfig();
    const width = this.width || config.width || DEFAULT_CONFIG.width;
    const height = this.height || config.height || DEFAULT_CONFIG.height;
    const margins = config.margins || DEFAULT_CONFIG.margins;

    const chartWidth = width - margins.left - margins.right;
    const chartHeight = height - margins.top - margins.bottom;

    // Calculate data domains
    const { xDomain, yDomain } = this.calculateDomains();

    // Check if memoization is valid
    if (
      this.memoizedScales &&
      this.memoizedScales.xDomain?.[0] === xDomain[0] &&
      this.memoizedScales.xDomain?.[1] === xDomain[1] &&
      this.memoizedScales.yDomain?.[0] === yDomain[0] &&
      this.memoizedScales.yDomain?.[1] === yDomain[1] &&
      this.memoizedScales.width === chartWidth &&
      this.memoizedScales.height === chartHeight
    ) {
      // Use existing scales
      return;
    }

    // Create x scale
    const xScaleType = config.xAxis?.scaleType || this.detectXScaleType();
    if (xScaleType === 'time') {
      this.xScale = d3
        .scaleTime()
        .domain(xDomain as [Date, Date])
        .range([0, chartWidth])
        .nice();
    } else {
      this.xScale = d3
        .scaleLinear()
        .domain(xDomain as [number, number])
        .range([0, chartWidth])
        .nice();
    }

    // Create y scale
    const yScaleType = config.yAxis?.scaleType || 'linear';
    if (yScaleType === 'log') {
      this.yScale = d3
        .scaleLog()
        .domain(yDomain)
        .range([chartHeight, 0])
        .nice();
    } else {
      const domainPadding = config.yAxis?.domainPadding || 0;
      const paddedDomain: [number, number] = [
        yDomain[0] - (yDomain[1] - yDomain[0]) * domainPadding,
        yDomain[1] + (yDomain[1] - yDomain[0]) * domainPadding,
      ];
      this.yScale = d3
        .scaleLinear()
        .domain(paddedDomain)
        .range([chartHeight, 0])
        .nice();
    }
  }

  /**
   * Detects x-axis scale type from data
   */
  private detectXScaleType(): 'linear' | 'time' | 'ordinal' {
    if (!this.chartData || this.chartData.series.length === 0) {
      return 'linear';
    }

    const firstPoint = this.chartData.series[0].data[0];
    if (firstPoint?.x instanceof Date) {
      return 'time';
    }
    if (typeof firstPoint?.x === 'string') {
      return 'ordinal';
    }
    return 'linear';
  }

  /**
   * Calculates data domains for x and y axes
   */
  private calculateDomains(): {
    xDomain: [number, number] | [Date, Date];
    yDomain: [number, number];
  } {
    if (!this.chartData || this.chartData.series.length === 0) {
      return {
        xDomain: [0, 1],
        yDomain: [0, 1],
      };
    }

    let minX: number | Date | null = null;
    let maxX: number | Date | null = null;
    let minY = Infinity;
    let maxY = -Infinity;
    let isDateType = false;

    for (const series of this.chartData.series) {
      if (!series.visible !== false) {
        for (const point of series.data) {
          if (point.x !== null && point.x !== undefined) {
            if (point.x instanceof Date) {
              isDateType = true;
              if (minX === null || point.x < (minX as Date)) {
                minX = point.x;
              }
              if (maxX === null || point.x > (maxX as Date)) {
                maxX = point.x;
              }
            } else if (typeof point.x === 'number') {
              if (minX === null || point.x < (minX as number)) {
                minX = point.x;
              }
              if (maxX === null || point.x > (maxX as number)) {
                maxX = point.x;
              }
            }
          }
          if (point.y !== null && point.y !== undefined && typeof point.y === 'number') {
            minY = Math.min(minY, point.y);
            maxY = Math.max(maxY, point.y);
          }
        }
      }
    }

    // Handle edge cases
    if (minX === null || maxX === null) {
      if (isDateType) {
        const now = new Date();
        minX = now;
        maxX = new Date(now.getTime() + 86400000); // +1 day
      } else {
        minX = 0;
        maxX = 1;
      }
    }
    if (minY === Infinity || maxY === -Infinity) {
      minY = 0;
      maxY = 1;
    }

    return {
      xDomain: [minX, maxX] as [number, number] | [Date, Date],
      yDomain: [minY, maxY],
    };
  }

  /**
   * Creates D3 axes
   */
  private createAxes(): void {
    if (!this.xScale || !this.yScale) {
      return;
    }

    const config = this.getEffectiveConfig();

    // Create x axis
    this.xAxis = d3.axisBottom(this.xScale as d3.AxisScale<d3.AxisDomain>) as d3.Axis<d3.AxisDomain>;
    if (config.xAxis?.ticks) {
      this.xAxis.ticks(config.xAxis.ticks);
    }
    if (config.xAxis?.tickFormat) {
      this.xAxis.tickFormat(config.xAxis.tickFormat as (domainValue: d3.AxisDomain, index: number) => string);
    } else if (this.detectXScaleType() === 'time') {
      // Auto-format time axis
      this.xAxis.tickFormat(this.getTimeFormatter() as (domainValue: d3.AxisDomain, index: number) => string);
    }

    // Create y axis
    this.yAxis = d3.axisLeft(this.yScale as d3.AxisScale<d3.AxisDomain>);
    if (config.yAxis?.ticks) {
      this.yAxis.ticks(config.yAxis.ticks);
    }
    if (config.yAxis?.tickFormat) {
      this.yAxis.tickFormat(config.yAxis.tickFormat as (domainValue: d3.AxisDomain, index: number) => string);
    }
  }

  /**
   * Gets time formatter based on time range
   */
  private getTimeFormatter(): (d: Date) => string {
    if (!this.chartData || this.chartData.series.length === 0) {
      return d3.timeFormat('%Y-%m-%d');
    }

    const firstPoint = this.chartData.series[0].data[0];
    const lastPoint = this.chartData.series[0].data[this.chartData.series[0].data.length - 1];

    if (firstPoint?.x instanceof Date && lastPoint?.x instanceof Date) {
      const timeRange = lastPoint.x.getTime() - firstPoint.x.getTime();
      const oneDay = 24 * 60 * 60 * 1000;
      const oneMonth = 30 * oneDay;

      if (timeRange < oneDay) {
        return d3.timeFormat('%H:%M');
      } else if (timeRange < oneMonth) {
        return d3.timeFormat('%m/%d');
      } else {
        return d3.timeFormat('%Y-%m');
      }
    }

    return d3.timeFormat('%Y-%m-%d');
  }

  /**
   * Renders axes
   */
  private renderAxes(): void {
    if (!this.g || !this.xAxis || !this.yAxis) {
      return;
    }

    const config = this.getEffectiveConfig();
    const height = this.height || config.height || DEFAULT_CONFIG.height;
    const margins = config.margins || DEFAULT_CONFIG.margins;
    const chartHeight = height - margins.top - margins.bottom;

    // Render x axis
    if (config.xAxis?.visible !== false) {
      const xAxisGroup = this.g.append('g').attr('class', 'x-axis').attr('transform', `translate(0,${chartHeight})`);
      xAxisGroup.call(this.xAxis);

      // Add axis label if provided
      if (config.xAxis?.label) {
        xAxisGroup
          .append('text')
          .attr('class', 'axis-label')
          .attr('x', (this.width || config.width || DEFAULT_CONFIG.width - margins.left - margins.right) / 2)
          .attr('y', margins.bottom - 10)
          .attr('text-anchor', 'middle')
          .text(config.xAxis.label);
      }
    }

    // Render y axis
    if (config.yAxis?.visible !== false) {
      const yAxisGroup = this.g.append('g').attr('class', 'y-axis');
      yAxisGroup.call(this.yAxis);

      // Add axis label if provided
      if (config.yAxis?.label) {
        yAxisGroup
          .append('text')
          .attr('class', 'axis-label')
          .attr('transform', 'rotate(-90)')
          .attr('x', -(chartHeight / 2))
          .attr('y', -margins.left + 15)
          .attr('text-anchor', 'middle')
          .text(config.yAxis.label);
      }
    }
  }

  /**
   * Renders line paths for all series
   */
  private renderLines(): void {
    if (!this.g || !this.xScale || !this.yScale || !this.chartData) {
      return;
    }

    const config = this.getEffectiveConfig();
    const curveType = config.series?.curveType || 'monotone';
    const strokeWidth = config.series?.strokeWidth || 2;

    // Get color palette
    const defaultPalette = this.colorPaletteManager.getColorPalette('default');
    const defaultColors = config.series?.colors || config.colors || (defaultPalette ? defaultPalette.colors : ['#1f77b4']);

    // Create line generator
    const line = d3
      .line<ILineChartDataPoint>()
      .x((d) => {
        if (d.x instanceof Date) {
          return (this.xScale as d3.ScaleTime<number, number>)(d.x);
        }
        return (this.xScale as d3.ScaleLinear<number, number>)(d.x as number);
      })
      .y((d) => {
        if (d.y === null || d.y === undefined) {
          return NaN;
        }
        return (this.yScale as d3.ScaleLinear<number, number>)(d.y);
      })
      .defined((d) => d.y !== null && d.y !== undefined && !isNaN(d.y as number))
      .curve(this.getCurveFunction(curveType));

    // Create lines group
    const linesGroup = this.g.append('g').attr('class', 'lines');

    // Render each series
    this.chartData.series.forEach((series, index) => {
      if (series.visible === false) {
        return;
      }

      const color = series.color || defaultColors[index % defaultColors.length];
      const seriesStyle = series.style || {};

      const path = linesGroup
        .append('path')
        .datum(series.data)
        .attr('class', `line-series line-series-${series.id}`)
        .attr('d', line)
        .attr('fill', 'none')
        .attr('stroke', color)
        .attr('stroke-width', seriesStyle.strokeWidth || strokeWidth)
        .attr('stroke-dasharray', seriesStyle.strokeDasharray || null)
        .attr('opacity', seriesStyle.opacity !== undefined ? seriesStyle.opacity : 1);

      // Add animation if enabled
      if (config.animation?.enabled !== false) {
        const duration = config.animation?.duration || 750;
        path.attr('stroke-dasharray', function () {
          const length = this.getTotalLength();
          return `${length} ${length}`;
        })
          .attr('stroke-dashoffset', function () {
            return this.getTotalLength();
          })
          .transition()
          .duration(duration)
          .ease(d3.easeCubicInOut)
          .attr('stroke-dashoffset', 0)
          .on('end', function () {
            d3.select(this).attr('stroke-dasharray', null);
          });
      }
    });
  }

  /**
   * Gets D3 curve function based on curve type
   */
  private getCurveFunction(
    curveType: 'linear' | 'monotone' | 'basis' | 'cardinal'
  ): d3.CurveFactory | d3.CurveFactoryLineOnly {
    switch (curveType) {
      case 'linear':
        return d3.curveLinear;
      case 'monotone':
        return d3.curveMonotoneX;
      case 'basis':
        return d3.curveBasis;
      case 'cardinal':
        return d3.curveCardinal;
      default:
        return d3.curveMonotoneX;
    }
  }

  /**
   * Updates memoized scale calculations
   */
  private updateMemoizedScales(): void {
    if (!this.chartData) {
      return;
    }

    const { xDomain, yDomain } = this.calculateDomains();
    const config = this.getEffectiveConfig();
    const width = this.width || config.width || DEFAULT_CONFIG.width;
    const height = this.height || config.height || DEFAULT_CONFIG.height;
    const margins = config.margins || DEFAULT_CONFIG.margins;

    this.memoizedScales = {
      xDomain,
      yDomain,
      width: width - margins.left - margins.right,
      height: height - margins.top - margins.bottom,
    };
  }

  /**
   * Handles errors
   */
  private handleError(error: Error): void {
    this.hasError = true;
    this.errorMessage = error.message;
    this.isEmpty = false;
    this.chartData = null;
    this.error.emit(error);
    this.cdr.markForCheck();
  }

  /**
   * Cleans up D3 selections and observers
   */
  private cleanup(): void {
    // Clean up ResizeObserver
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }

    // Clean up D3 selections
    if (this.g) {
      this.g.selectAll('*').remove();
      this.g = null;
    }
    if (this.svg) {
      this.svg.selectAll('*').remove();
      this.svg = null;
    }

    // Clean up subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }
}

