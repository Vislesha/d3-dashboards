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
} from '@angular/core';
import { GridsterModule } from 'angular-gridster2';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { BehaviorSubject, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ID3Widget } from '../../entities/widget.interface';
import { IFilterValues } from '../../entities/filter.interface';
import { IGridConfiguration } from '../../entities/grid-config.interface';
import { DEFAULT_GRID_CONFIG } from '../../utils/grid-config.defaults';
import { validateWidgetPosition } from '../../utils/widget-position.validator';

/**
 * Dashboard Container Component
 *
 * Provides a grid-based layout system using angular-gridster2 for widget positioning,
 * responsive grid system (12-column), and filter propagation to all widgets.
 * This component serves as the core container for displaying dashboard widgets
 * in a read-only view with coordinated filtering capabilities.
 */
@Component({
  selector: 'lib-dashboard-container',
  templateUrl: './dashboard-container.component.html',
  styleUrls: ['./dashboard-container.component.scss'],
  standalone: true,
  imports: [GridsterModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardContainerComponent implements OnInit, OnChanges, OnDestroy {
  /** Array of dashboard widgets to display */
  @Input() widgets: ID3Widget[] = [];

  /** Grid layout configuration (optional, uses defaults if not provided) */
  @Input() gridConfig?: IGridConfiguration;

  /** Global filter values to propagate to all widgets */
  @Input() filters: IFilterValues[] = [];

  /** Emitted when filter values change (debounced) */
  @Output() filterChange = new EventEmitter<IFilterValues[]>();

  /** Gridster configuration for angular-gridster2 */
  gridsterOptions: GridsterConfig = {};

  /** Validated and corrected widgets array */
  private _validatedWidgets: ID3Widget[] = [];

  /** Window resize listener */
  private resizeListener?: () => void;

  /** Filter state management */
  private filterSubject = new BehaviorSubject<IFilterValues[]>([]);
  private destroy$ = new Subject<void>();

  /** Merged filters (dashboard + widget) for each widget */
  mergedFilters: Map<string, IFilterValues[]> = new Map();

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.initializeGridsterConfig();
    this.validateWidgets();
    this.setupWindowResizeListener();
    this.setupFilterPropagation();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['widgets']) {
      this.validateWidgets();
      this.updateMergedFilters();
    }
    if (changes['gridConfig']) {
      this.initializeGridsterConfig();
    }
    if (changes['filters']) {
      this.filterSubject.next(this.filters || []);
    }
  }

  ngOnDestroy(): void {
    this.cleanupWindowResizeListener();
    this.destroy$.next();
    this.destroy$.complete();
    this.filterSubject.complete();
  }

  /**
   * Initialize Gridster configuration from input or defaults
   */
  private initializeGridsterConfig(): void {
    const config = this.gridConfig || DEFAULT_GRID_CONFIG;

    this.gridsterOptions = {
      gridType: 'fixed',
      fixedColWidth: config.rowHeight,
      fixedRowHeight: config.rowHeight,
      minCols: config.minCols,
      maxCols: config.maxCols,
      minRows: config.minRows,
      maxRows: config.maxRows,
      defaultItemCols: 4,
      defaultItemRows: 2,
      maxItemCols: config.maxCols,
      maxItemRows: config.maxRows || 100,
      minItemCols: 1,
      minItemRows: 1,
      margin: config.margin,
      draggable: {
        enabled: config.draggable,
      },
      resizable: {
        enabled: config.resizable,
      },
      swap: false,
      pushItems: config.preventCollision,
      disablePushOnDrag: !config.preventCollision,
      disablePushOnResize: !config.preventCollision,
      pushResizeItems: config.preventCollision,
      displayGrid: 'none',
      itemChangeCallback: () => {
        // Read-only mode, no change callbacks needed
      },
      itemResizeCallback: () => {
        // Read-only mode, no resize callbacks needed
      },
    };

    // Configure responsive breakpoints if enabled
    if (config.responsive && config.breakpoints) {
      this.gridsterOptions['responsiveSizes'] = [
        {
          breakpoint: 'xs',
          cols: config.breakpoints.mobileCols,
        },
        {
          breakpoint: 'sm',
          cols: config.breakpoints.tabletCols,
        },
        {
          breakpoint: 'md',
          cols: config.breakpoints.desktopCols,
        },
      ];
    }
  }

  /**
   * Validate and auto-correct widget positions
   */
  private validateWidgets(): void {
    if (!this.widgets || this.widgets.length === 0) {
      this._validatedWidgets = [];
      this.cdr.markForCheck();
      return;
    }

    const config = this.gridConfig || DEFAULT_GRID_CONFIG;
    this._validatedWidgets = this.widgets.map((widget, index) => {
      const existingPositions = this._validatedWidgets
        .slice(0, index)
        .map((w) => w.position);
      const validatedPosition = validateWidgetPosition(
        widget.position,
        config,
        existingPositions
      );

      return {
        ...widget,
        position: validatedPosition,
      };
    });

    this.cdr.markForCheck();
  }

  /**
   * Get validated widgets array
   */
  get validatedWidgets(): ID3Widget[] {
    return this._validatedWidgets;
  }

  /**
   * Check if dashboard is empty
   */
  get isEmpty(): boolean {
    return !this._validatedWidgets || this._validatedWidgets.length === 0;
  }

  /**
   * Setup window resize listener for layout adaptation
   */
  private setupWindowResizeListener(): void {
    if (typeof window !== 'undefined') {
      this.resizeListener = () => {
        // Trigger change detection to update grid layout
        this.cdr.markForCheck();
      };
      window.addEventListener('resize', this.resizeListener);
    }
  }

  /**
   * Cleanup window resize listener
   */
  private cleanupWindowResizeListener(): void {
    if (this.resizeListener && typeof window !== 'undefined') {
      window.removeEventListener('resize', this.resizeListener);
      this.resizeListener = undefined;
    }
  }

  /**
   * Handle widget resize on container resize
   */
  onWidgetResize(): void {
    // Gridster handles widget resizing internally
    // This method can be extended for custom resize handling
    this.cdr.markForCheck();
  }

  /**
   * Setup filter propagation with debouncing
   */
  private setupFilterPropagation(): void {
    this.filterSubject
      .pipe(debounceTime(300), takeUntil(this.destroy$))
      .subscribe((filters) => {
        this.updateMergedFilters();
        this.filterChange.emit(filters);
        this.cdr.markForCheck();
      });
  }

  /**
   * Update merged filters for all widgets (dashboard filters + widget filters)
   */
  private updateMergedFilters(): void {
    this.mergedFilters.clear();
    const dashboardFilters = this.filters || [];

    this._validatedWidgets.forEach((widget) => {
      const widgetFilters = widget.filters || [];
      // Merge dashboard filters with widget filters (both applied)
      const merged = [...dashboardFilters, ...widgetFilters];
      this.mergedFilters.set(widget.id, merged);
    });
  }

  /**
   * Get merged filters for a specific widget
   */
  getWidgetFilters(widgetId: string): IFilterValues[] {
    return this.mergedFilters.get(widgetId) || [];
  }
}

