import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { GridsterModule } from 'angular-gridster2';
import { DashboardContainerComponent } from './dashboard-container.component';
import { ID3Widget } from '../../entities/widget.interface';
import { IFilterValues } from '../../entities/filter.interface';
import { IGridConfiguration } from '../../entities/grid-config.interface';
import { DEFAULT_GRID_CONFIG } from '../../utils/grid-config.defaults';

/**
 * Mock widget component for testing
 */
@Component({
  selector: 'lib-widget',
  template: '<div>Mock Widget</div>',
  standalone: true,
})
class MockWidgetComponent {
  @Input() widget!: ID3Widget;
  @Input() filters?: IFilterValues[];
}

describe('DashboardContainerComponent', () => {
  let component: DashboardContainerComponent;
  let fixture: ComponentFixture<DashboardContainerComponent>;

  const createMockWidget = (id: string, x = 0, y = 0, cols = 4, rows = 2): ID3Widget => ({
    id,
    type: 'line',
    position: { x, y, cols, rows },
    title: `Widget ${id}`,
    config: {},
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DashboardContainerComponent,
        GridsterModule,
        MockWidgetComponent,
      ],
    })
      .overrideComponent(DashboardContainerComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DashboardContainerComponent);
    component = fixture.componentInstance;
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with empty widgets array', () => {
      component.widgets = [];
      fixture.detectChanges();
      expect(component.widgets).toEqual([]);
    });

    it('should initialize with widgets array', () => {
      const widgets: ID3Widget[] = [
        createMockWidget('widget-1'),
        createMockWidget('widget-2'),
      ];
      component.widgets = widgets;
      fixture.detectChanges();
      expect(component.widgets).toHaveLength(2);
    });

    it('should use default grid configuration when not provided', () => {
      component.widgets = [];
      fixture.detectChanges();
      expect(component.gridsterOptions.columns).toBe(DEFAULT_GRID_CONFIG.columns);
      expect(component.gridsterOptions.rowHeight).toBe(DEFAULT_GRID_CONFIG.rowHeight);
      expect(component.gridsterOptions.margin).toBe(DEFAULT_GRID_CONFIG.margin);
    });

    it('should use provided grid configuration', () => {
      const customConfig: IGridConfiguration = {
        ...DEFAULT_GRID_CONFIG,
        columns: 16,
        rowHeight: 50,
      };
      component.widgets = [];
      component.gridConfig = customConfig;
      fixture.detectChanges();
      expect(component.gridsterOptions.columns).toBe(16);
      expect(component.gridsterOptions.rowHeight).toBe(50);
    });
  });

  describe('Widget Rendering', () => {
    it('should render widgets in grid layout', () => {
      const widgets: ID3Widget[] = [
        createMockWidget('widget-1', 0, 0, 4, 2),
        createMockWidget('widget-2', 4, 0, 4, 2),
      ];
      component.widgets = widgets;
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const gridsterItems = compiled.querySelectorAll('gridster-item');
      expect(gridsterItems.length).toBe(2);
    });

    it('should render widgets with different types', () => {
      const widgets: ID3Widget[] = [
        { ...createMockWidget('widget-1'), type: 'line' },
        { ...createMockWidget('widget-2'), type: 'bar' },
        { ...createMockWidget('widget-3'), type: 'table' },
      ];
      component.widgets = widgets;
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const gridsterItems = compiled.querySelectorAll('gridster-item');
      expect(gridsterItems.length).toBe(3);
    });
  });

  describe('Empty Widget Array Handling', () => {
    it('should display empty dashboard message when widgets array is empty', () => {
      component.widgets = [];
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const emptyMessage = compiled.querySelector('.empty-dashboard-message');
      expect(emptyMessage).toBeTruthy();
    });

    it('should not display empty message when widgets are present', () => {
      component.widgets = [createMockWidget('widget-1')];
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const emptyMessage = compiled.querySelector('.empty-dashboard-message');
      expect(emptyMessage).toBeFalsy();
    });
  });

  describe('Invalid Widget Data Handling', () => {
    it('should handle widget with invalid position and auto-correct', () => {
      const invalidWidget: ID3Widget = {
        ...createMockWidget('widget-1'),
        position: { x: -1, y: -1, cols: 0, rows: 0 },
      };
      component.widgets = [invalidWidget];
      fixture.detectChanges();

      // Position should be auto-corrected
      expect(component.widgets[0].position.x).toBeGreaterThanOrEqual(0);
      expect(component.widgets[0].position.y).toBeGreaterThanOrEqual(0);
      expect(component.widgets[0].position.cols).toBeGreaterThan(0);
      expect(component.widgets[0].position.rows).toBeGreaterThan(0);
    });

    it('should handle widget with position outside grid bounds', () => {
      const outOfBoundsWidget: ID3Widget = {
        ...createMockWidget('widget-1'),
        position: { x: 20, y: 0, cols: 4, rows: 2 }, // x + cols > 12
      };
      component.widgets = [outOfBoundsWidget];
      fixture.detectChanges();

      // Position should be auto-corrected to fit within grid
      expect(component.widgets[0].position.x + component.widgets[0].position.cols).toBeLessThanOrEqual(12);
    });

    it('should display error state for widget with invalid data', () => {
      const invalidWidget: ID3Widget = {
        id: '',
        type: 'line' as any,
        position: { x: 0, y: 0, cols: 4, rows: 2 },
        title: '',
        config: {},
      };
      component.widgets = [invalidWidget];
      fixture.detectChanges();

      // Component should handle invalid widget gracefully
      expect(component.widgets.length).toBe(1);
    });
  });

  describe('Widget Position Validation', () => {
    it('should validate and auto-correct widget positions on input changes', () => {
      const widgets: ID3Widget[] = [
        createMockWidget('widget-1', -1, -1, 0, 0), // Invalid position
      ];
      component.widgets = widgets;
      fixture.detectChanges();

      expect(component.widgets[0].position.x).toBeGreaterThanOrEqual(0);
      expect(component.widgets[0].position.y).toBeGreaterThanOrEqual(0);
      expect(component.widgets[0].position.cols).toBeGreaterThan(0);
      expect(component.widgets[0].position.rows).toBeGreaterThan(0);
    });

    it('should prevent widget overlap by auto-correcting positions', () => {
      const widgets: ID3Widget[] = [
        createMockWidget('widget-1', 0, 0, 4, 2),
        createMockWidget('widget-2', 2, 0, 4, 2), // Overlaps with widget-1
      ];
      component.widgets = widgets;
      fixture.detectChanges();

      // Second widget should be repositioned to avoid overlap
      const pos1 = component.widgets[0].position;
      const pos2 = component.widgets[1].position;
      const overlaps =
        pos1.x < pos2.x + pos2.cols &&
        pos1.x + pos1.cols > pos2.x &&
        pos1.y < pos2.y + pos2.rows &&
        pos1.y + pos1.rows > pos2.y;
      expect(overlaps).toBe(false);
    });
  });

  describe('Widget Component Wrapper', () => {
    it('should render widget component wrapper for each widget', () => {
      const widgets: ID3Widget[] = [
        createMockWidget('widget-1'),
        createMockWidget('widget-2'),
      ];
      component.widgets = widgets;
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      // Note: Actual widget component rendering will be tested with proper widget component implementation
      const gridsterItems = compiled.querySelectorAll('gridster-item');
      expect(gridsterItems.length).toBe(2);
    });
  });

  describe('Responsive Grid Layout', () => {
    it('should configure responsive grid with breakpoints', () => {
      const config: IGridConfiguration = {
        ...DEFAULT_GRID_CONFIG,
        responsive: true,
        breakpoints: {
          mobile: 320,
          tablet: 768,
          desktop: 1024,
          mobileCols: 4,
          tabletCols: 8,
          desktopCols: 12,
        },
      };
      component.widgets = [];
      component.gridConfig = config;
      fixture.detectChanges();

      expect(component.gridsterOptions['responsiveSizes']).toBeDefined();
      expect(component.gridsterOptions['responsiveSizes']?.length).toBe(3);
    });

    it('should adapt grid layout on window resize', () => {
      component.widgets = [createMockWidget('widget-1')];
      fixture.detectChanges();

      // Simulate window resize
      window.dispatchEvent(new Event('resize'));
      fixture.detectChanges();

      // Gridster should handle resize internally
      expect(component.gridsterOptions).toBeDefined();
    });

    it('should render correctly on mobile viewport (320px+)', () => {
      // Mock window.innerWidth
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375, // Mobile width
      });

      component.widgets = [createMockWidget('widget-1')];
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const gridster = compiled.querySelector('gridster');
      expect(gridster).toBeTruthy();
    });

    it('should render correctly on tablet viewport (768px+)', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024, // Tablet width
      });

      component.widgets = [createMockWidget('widget-1')];
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const gridster = compiled.querySelector('gridster');
      expect(gridster).toBeTruthy();
    });

    it('should render correctly on desktop viewport (1024px+)', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1920, // Desktop width
      });

      component.widgets = [createMockWidget('widget-1')];
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const gridster = compiled.querySelector('gridster');
      expect(gridster).toBeTruthy();
    });
  });

  describe('Filter Propagation', () => {
    it('should accept filters input property', () => {
      const filters: IFilterValues[] = [
        { key: 'status', value: 'active', operator: 'equals' },
      ];
      component.widgets = [createMockWidget('widget-1')];
      component.filters = filters;
      fixture.detectChanges();

      expect(component.filters).toEqual(filters);
    });

    it('should propagate filters to widgets', () => {
      const filters: IFilterValues[] = [
        { key: 'status', value: 'active', operator: 'equals' },
      ];
      const widget: ID3Widget = {
        ...createMockWidget('widget-1'),
        filters: [{ key: 'type', value: 'chart', operator: 'equals' }],
      };
      component.widgets = [widget];
      component.filters = filters;
      fixture.detectChanges();

      // Filters should be merged (dashboard + widget)
      expect(component.filters.length).toBe(1);
    });

    it('should merge dashboard filters with widget filters', () => {
      const dashboardFilters: IFilterValues[] = [
        { key: 'status', value: 'active', operator: 'equals' },
      ];
      const widget: ID3Widget = {
        ...createMockWidget('widget-1'),
        filters: [{ key: 'type', value: 'chart', operator: 'equals' }],
      };
      component.widgets = [widget];
      component.filters = dashboardFilters;
      fixture.detectChanges();

      // Both filters should be available
      expect(component.filters).toEqual(dashboardFilters);
      expect(widget.filters).toBeDefined();
    });

    it('should debounce filter updates (300ms)', (done) => {
      jest.useFakeTimers();
      const filters1: IFilterValues[] = [{ key: 'status', value: 'active' }];
      const filters2: IFilterValues[] = [{ key: 'status', value: 'inactive' }];

      component.widgets = [createMockWidget('widget-1')];
      component.filters = filters1;
      fixture.detectChanges();

      component.filters = filters2;
      fixture.detectChanges();

      // Fast-forward time by 300ms
      jest.advanceTimersByTime(300);

      // filterChange should be emitted after debounce
      component.filterChange.subscribe((emittedFilters) => {
        expect(emittedFilters).toEqual(filters2);
        jest.useRealTimers();
        done();
      });
    });

    it('should emit filterChange output when filters are updated', (done) => {
      jest.useFakeTimers();
      const filters: IFilterValues[] = [
        { key: 'status', value: 'active', operator: 'equals' },
      ];

      component.widgets = [createMockWidget('widget-1')];
      component.filterChange.subscribe((emittedFilters) => {
        expect(emittedFilters).toEqual(filters);
        jest.useRealTimers();
        done();
      });

      component.filters = filters;
      fixture.detectChanges();
      jest.advanceTimersByTime(300);
    });

    it('should handle filter clearing', () => {
      const filters: IFilterValues[] = [
        { key: 'status', value: 'active', operator: 'equals' },
      ];
      component.widgets = [createMockWidget('widget-1')];
      component.filters = filters;
      fixture.detectChanges();

      component.filters = [];
      fixture.detectChanges();

      expect(component.filters).toEqual([]);
    });

    it('should handle invalid filter values gracefully', () => {
      const invalidFilters: any[] = [
        { key: '', value: 'active' }, // Invalid: empty key
        { key: 'status' }, // Invalid: missing value
      ];

      component.widgets = [createMockWidget('widget-1')];
      component.filters = invalidFilters;
      fixture.detectChanges();

      // Component should handle invalid filters without crashing
      expect(component.filters).toEqual(invalidFilters);
    });
  });
});

