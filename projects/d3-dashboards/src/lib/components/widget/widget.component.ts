import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  OnDestroy,
  ViewContainerRef,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  SimpleChanges,
  ComponentRef,
  Type,
  ElementRef,
} from '@angular/core';
import { BehaviorSubject, Subject, Observable, firstValueFrom } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ID3Widget } from '../../entities/widget.interface';
import { IFilterValues } from '../../entities/filter.interface';
import { IWidgetState } from '../../entities/widget-state.interface';
import { IWidgetActionEvent } from '../../entities/widget-action-event.interface';
import { DataService } from '../../services/data.service';
import { loadWidgetComponent } from '../../utils/widget-loader.util';

/**
 * Widget Component
 *
 * Dynamic component loader that renders appropriate child components based on widget type.
 * Provides a unified interface for displaying widgets with headers, action menus,
 * configuration panels, and proper handling of loading, error, and empty states.
 *
 * @public
 */
@Component({
  selector: 'lib-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetComponent implements OnInit, OnChanges, OnDestroy {
  /** Widget configuration and metadata */
  @Input() widget!: ID3Widget;

  /** Whether the widget is in edit mode */
  @Input() isEditMode: boolean = false;

  /** Merged filters (dashboard + widget filters) */
  @Input() filters: IFilterValues[] = [];

  /** Emitted when widget configuration is updated */
  @Output() widgetUpdate = new EventEmitter<ID3Widget>();

  /** Emitted when widget delete action is triggered */
  @Output() widgetDelete = new EventEmitter<string>();

  /** Emitted when any widget action is triggered */
  @Output() widgetAction = new EventEmitter<IWidgetActionEvent>();

  /** Emitted when widget data is successfully loaded */
  @Output() dataLoad = new EventEmitter<any>();

  /** Widget state management */
  private widgetState$ = new BehaviorSubject<IWidgetState>({
    loading: true,
    error: null,
    data: null,
    componentLoaded: false,
    lastUpdated: null,
  });

  /** Component reference for dynamically loaded component */
  private componentRef: ComponentRef<any> | null = null;

  /** Template reference for widget container */
  @ViewChild('widgetContainer', { read: ViewContainerRef }) widgetContainer!: ViewContainerRef;

  /** Destroy subject for cleanup */
  private destroy$ = new Subject<void>();

  /** Current widget state */
  get state$(): Observable<IWidgetState> {
    return this.widgetState$.asObservable();
  }

  /** Current widget state (synchronous access) */
  get currentState(): IWidgetState {
    return this.widgetState$.value;
  }

  constructor(
    private viewContainerRef: ViewContainerRef,
    private dataService: DataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!this.validateWidget()) {
      return;
    }
    this.loadComponent();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['widget'] && !changes['widget'].firstChange) {
      const previousType = changes['widget'].previousValue?.type;
      const currentType = changes['widget'].currentValue?.type;

      // If widget type changed, reload component
      if (previousType !== currentType) {
        this.cleanupComponent();
        this.loadComponent();
      } else if (changes['widget']) {
        // Update component inputs if component is already loaded
        this.updateComponentInputs();
      }
    }

    if (changes['filters']) {
      this.updateComponentInputs();
    }
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  /**
   * Manually triggers a data refresh for the widget
   */
  refresh(): void {
    this.loadData();
  }

  /**
   * Opens the configuration panel for the widget
   */
  openConfiguration(): void {
    // Implementation will be added in Phase 6 (User Story 4)
  }

  /**
   * Returns an observable of the widget's current state
   */
  getState(): Observable<IWidgetState> {
    return this.widgetState$.asObservable();
  }

  /**
   * Validates widget configuration before rendering
   */
  private validateWidget(): boolean {
    if (!this.widget) {
      this.setErrorState('Widget configuration is required');
      return false;
    }

    // Validate required fields
    if (!this.widget.id || typeof this.widget.id !== 'string') {
      this.setErrorState('Widget ID is required and must be a string');
      return false;
    }

    if (!this.widget.type || typeof this.widget.type !== 'string') {
      this.setErrorState('Widget type is required and must be a string');
      return false;
    }

    // Validate widget type is one of 14 supported types
    const validTypes = [
      'line',
      'bar',
      'pie',
      'scatter',
      'area',
      'heatmap',
      'treemap',
      'force-graph',
      'geo-map',
      'gauge',
      'table',
      'filter',
      'tile',
      'markdown',
    ];
    if (!validTypes.includes(this.widget.type)) {
      this.setErrorState(`Invalid widget type: ${this.widget.type}. Must be one of: ${validTypes.join(', ')}`);
      return false;
    }

    if (!this.widget.title || typeof this.widget.title !== 'string') {
      this.setErrorState('Widget title is required and must be a string');
      return false;
    }

    if (!this.widget.config || typeof this.widget.config !== 'object') {
      this.setErrorState('Widget config is required and must be an object');
      return false;
    }

    if (!this.widget.position || typeof this.widget.position !== 'object') {
      this.setErrorState('Widget position is required and must be a GridsterItem object');
      return false;
    }

    // Type-specific configuration validation
    this.validateTypeSpecificConfig();

    // Data source validation
    if (this.widget.dataSource) {
      if (this.widget.dataSource.type === 'api' && !this.widget.dataSource.endpoint) {
        this.setErrorState('API data source requires an endpoint');
        return false;
      }
      if (this.widget.dataSource.type === 'static' && !this.widget.dataSource.data) {
        this.setErrorState('Static data source requires data');
        return false;
      }
      if (this.widget.dataSource.type === 'computed' && typeof this.widget.dataSource.transform !== 'function') {
        this.setErrorState('Computed data source requires a transform function');
        return false;
      }
    }

    return true;
  }

  /**
   * Validates type-specific configuration
   */
  private validateTypeSpecificConfig(): void {
    const type = this.widget.type;
    const config = this.widget.config;

    // Chart widgets should have chartOptions
    const chartTypes = ['line', 'bar', 'pie', 'scatter', 'area', 'heatmap', 'treemap', 'force-graph', 'geo-map', 'gauge'];
    if (chartTypes.includes(type) && !config.chartOptions) {
      console.warn(`Widget type '${type}' should have chartOptions in config`);
    }

    // Table widget should have tableOptions
    if (type === 'table' && !config.tableOptions) {
      console.warn("Widget type 'table' should have tableOptions in config");
    }

    // Filter widget should have filterOptions
    if (type === 'filter' && !config.filterOptions) {
      console.warn("Widget type 'filter' should have filterOptions in config");
    }

    // Tile widget should have tileOptions
    if (type === 'tile' && !config.tileOptions) {
      console.warn("Widget type 'tile' should have tileOptions in config");
    }

    // Markdown widget should have markdownOptions
    if (type === 'markdown' && !config.markdownOptions) {
      console.warn("Widget type 'markdown' should have markdownOptions in config");
    }
  }

  /**
   * Loads the dynamic component based on widget type
   */
  private async loadComponent(): Promise<void> {
    try {
      this.updateState({ loading: true, componentLoaded: false });

      const componentType: Type<any> = await loadWidgetComponent(this.widget.type);

      // Clean up previous component if exists
      this.cleanupComponent();

      // Wait for view to initialize if needed
      if (!this.widgetContainer) {
        this.cdr.detectChanges();
      }

      // Use widgetContainer if available, otherwise fall back to viewContainerRef
      const container = this.widgetContainer || this.viewContainerRef;

      // Create component instance
      this.componentRef = container.createComponent(componentType);

      // Set component inputs
      this.updateComponentInputs();

      // Update state
      this.updateState({ componentLoaded: true });

      // Load data if dataSource exists
      if (this.widget.dataSource) {
        await this.loadData();
      } else {
        this.updateState({ loading: false });
      }

      this.cdr.markForCheck();
    } catch (error) {
      console.error(`Failed to load widget component: ${this.widget.type}`, error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.setErrorState(`Failed to load ${this.widget.type} widget: ${errorMessage}`);
      this.cdr.markForCheck();
    }
  }

  /**
   * Updates component inputs with current widget data
   */
  private updateComponentInputs(): void {
    if (!this.componentRef) {
      return;
    }

    const instance = this.componentRef.instance;

    // Set common inputs if component has them
    if ('data' in instance) {
      instance.data = this.currentState.data;
    }
    if ('config' in instance) {
      instance.config = this.widget.config;
    }
    if ('filters' in instance) {
      instance.filters = this.filters;
    }

    this.cdr.markForCheck();
  }

  /**
   * Loads widget data from data source
   */
  private async loadData(): Promise<void> {
    if (!this.widget.dataSource) {
      this.updateState({ loading: false });
      return;
    }

    try {
      this.updateState({ loading: true, error: null });

      const dataSource = this.widget.dataSource;
      let data: any;

      switch (dataSource.type) {
        case 'api':
          if (!dataSource.endpoint) {
            throw new Error('API data source requires an endpoint');
          }
          // Use DataService to fetch data
          const response = await firstValueFrom(this.dataService.fetchData(dataSource));
          data = response?.data || null;
          break;

        case 'static':
          if (!dataSource.data) {
            throw new Error('Static data source requires data');
          }
          data = dataSource.data;
          break;

        case 'computed':
          if (typeof dataSource.transform !== 'function') {
            throw new Error('Computed data source requires a transform function');
          }
          // For computed, we'd need input data - this is a placeholder
          data = dataSource.transform([]);
          break;

        default:
          throw new Error(`Unknown data source type: ${dataSource.type}`);
      }

      // Apply transformation if provided
      if (dataSource.transform && dataSource.type !== 'computed') {
        data = dataSource.transform(data);
      }

      // Check for empty data
      if (!data || (Array.isArray(data) && data.length === 0)) {
        this.updateState({
          loading: false,
          data: null,
          error: null,
          lastUpdated: null,
        });
      } else {
        this.updateState({
          loading: false,
          data,
          error: null,
          lastUpdated: new Date(),
        });
        this.dataLoad.emit(data);
      }

      // Update component with new data
      this.updateComponentInputs();
      this.cdr.markForCheck();
    } catch (error) {
      console.error('Failed to load widget data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.setErrorState(`Failed to load data: ${errorMessage}`);
      this.cdr.markForCheck();
    }
  }

  /**
   * Updates widget state
   */
  private updateState(partial: Partial<IWidgetState>): void {
    this.widgetState$.next({
      ...this.currentState,
      ...partial,
    });
  }

  /**
   * Sets error state
   */
  private setErrorState(errorMessage: string): void {
    this.updateState({
      loading: false,
      error: errorMessage,
      data: null,
      lastUpdated: null,
    });
  }

  /**
   * Handles action clicks from widget header
   */
  onActionClick(action: 'edit' | 'delete' | 'refresh' | 'export' | 'configure'): void {
    const event: IWidgetActionEvent = {
      action,
      widgetId: this.widget.id,
    };

    switch (action) {
      case 'delete':
        this.onDeleteClick();
        break;
      case 'refresh':
        this.refresh();
        break;
      case 'export':
        this.onExportClick();
        break;
      case 'configure':
        this.openConfiguration();
        break;
    }

    this.widgetAction.emit(event);
  }

  /**
   * Handles delete action
   */
  onDeleteClick(): void {
    this.widgetDelete.emit(this.widget.id);
  }

  /**
   * Handles export action with format selection
   */
  onExportClick(): void {
    // Export functionality will be implemented later
    // For now, emit action event with export payload
    this.widgetAction.emit({
      action: 'export',
      widgetId: this.widget.id,
      payload: { format: 'csv' }, // Default format
    });
  }

  /**
   * Cleans up component reference
   */
  private cleanupComponent(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }

  /**
   * Cleans up all resources
   */
  private cleanup(): void {
    this.cleanupComponent();
    this.destroy$.next();
    this.destroy$.complete();
    this.widgetState$.complete();
  }
}

