# Quickstart: Widget Component

**Feature**: 006-widget-component  
**Date**: 2025-01-27

## Overview

The Widget Component is a dynamic component loader that renders appropriate child components based on widget type. This guide provides a quick start for implementing and using the widget component.

## Implementation Checklist

### Phase 1: Core Component Structure

- [ ] Create component directory: `projects/d3-dashboards/src/lib/components/widget/`
- [ ] Create component files:
  - `widget.component.ts`
  - `widget.component.html`
  - `widget.component.scss`
  - `widget.component.spec.ts`
- [ ] Set up component with standalone architecture
- [ ] Configure OnPush change detection strategy
- [ ] Implement basic component structure with inputs/outputs

### Phase 2: Dynamic Component Loading

- [ ] Create utility: `projects/d3-dashboards/src/lib/utils/widget-loader.util.ts`
- [ ] Implement component registry (Map-based)
- [ ] Implement `loadComponent()` method using `ViewContainerRef.createComponent()`
- [ ] Add support for lazy loading optional components
- [ ] Handle component loading errors gracefully

### Phase 3: State Management

- [ ] Create `WidgetState` interface
- [ ] Implement `BehaviorSubject` for state management
- [ ] Implement state transitions (loading → loaded → error)
- [ ] Add state observables for parent components

### Phase 4: Data Loading

- [ ] Integrate with `DataService`
- [ ] Implement `loadData()` method
- [ ] Handle all data source types (api, static, computed)
- [ ] Add data transformation support
- [ ] Implement error handling for data loading

### Phase 5: Widget Header Integration

- [ ] Create placeholder for widget header (feature 007)
- [ ] Pass widget title and actions to header
- [ ] Handle action events from header
- [ ] Implement edit mode visibility logic

### Phase 6: Configuration Panel

- [ ] Create `WidgetConfigPanelComponent` (or use PrimeNG Dialog)
- [ ] Implement configuration form based on widget type
- [ ] Add save/cancel actions
- [ ] Emit `widgetUpdate` event on save
- [ ] Validate configuration before saving

### Phase 7: UI States

- [ ] Implement loading state UI
- [ ] Implement error state UI with retry
- [ ] Implement empty state UI
- [ ] Implement loaded state UI
- [ ] Add proper ARIA labels and accessibility

### Phase 8: Lifecycle and Cleanup

- [ ] Implement `ngOnInit()` with initialization logic
- [ ] Implement `ngOnChanges()` with change handling
- [ ] Implement `ngOnDestroy()` with cleanup
- [ ] Add proper subscription management (takeUntil pattern)
- [ ] Clean up component references

### Phase 9: Validation

- [ ] Implement `validateWidget()` method
- [ ] Add validation for required fields
- [ ] Add type-specific validation
- [ ] Add data source validation
- [ ] Display validation errors appropriately

### Phase 10: Testing

- [ ] Write unit tests for component loading
- [ ] Write unit tests for data loading
- [ ] Write unit tests for state management
- [ ] Write unit tests for error handling
- [ ] Write unit tests for lifecycle hooks
- [ ] Achieve minimum 80% code coverage

### Phase 11: Integration

- [ ] Export component from `public-api.ts`
- [ ] Update `DashboardContainerComponent` to use `WidgetComponent`
- [ ] Test integration with existing dashboard container
- [ ] Verify filter propagation works correctly

## Usage Example

### Basic Usage

```typescript
// In dashboard container component template
<lib-widget
  [widget]="widget"
  [isEditMode]="isEditMode"
  [filters]="getWidgetFilters(widget.id)"
  (widgetUpdate)="onWidgetUpdate($event)"
  (widgetDelete)="onWidgetDelete($event)"
  (widgetAction)="onWidgetAction($event)">
</lib-widget>
```

### Component Implementation

```typescript
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, OnDestroy, ViewContainerRef, ChangeDetectionStrategy } from '@angular/core';
import { ID3Widget } from '../../entities/widget.interface';
import { IFilterValues } from '../../entities/filter.interface';
import { DataService } from '../../services/data.service';
import { loadWidgetComponent } from '../../utils/widget-loader.util';

@Component({
  selector: 'lib-widget',
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetComponent implements OnInit, OnChanges, OnDestroy {
  @Input() widget!: ID3Widget;
  @Input() isEditMode: boolean = false;
  @Input() filters: IFilterValues[] = [];

  @Output() widgetUpdate = new EventEmitter<ID3Widget>();
  @Output() widgetDelete = new EventEmitter<string>();
  @Output() widgetAction = new EventEmitter<WidgetActionEvent>();
  @Output() dataLoad = new EventEmitter<any>();

  private componentRef: any;
  private destroy$ = new Subject<void>();

  constructor(
    private viewContainerRef: ViewContainerRef,
    private dataService: DataService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    if (!this.validateWidget()) {
      return;
    }
    await this.loadComponent();
    await this.loadData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['widget'] && !changes['widget'].firstChange) {
      // Handle widget changes
    }
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private async loadComponent(): Promise<void> {
    try {
      const componentType = await loadWidgetComponent(this.widget.type);
      this.componentRef = this.viewContainerRef.createComponent(componentType);
      // Set inputs, subscribe to outputs
    } catch (error) {
      // Handle error
    }
  }

  private async loadData(): Promise<void> {
    if (!this.widget.dataSource) {
      return;
    }
    // Load data using DataService
  }

  private cleanup(): void {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

## Component Registry Setup

```typescript
// widget-loader.util.ts
import { Type } from '@angular/core';

// Eager loaded components (required for v1)
import { LineChartComponent } from '../charts/line-chart/line-chart.component';
import { BarChartComponent } from '../charts/bar-chart/bar-chart.component';

// Component registry
const COMPONENT_REGISTRY = new Map<string, Type<any>>([
  ['line', LineChartComponent],
  ['bar', BarChartComponent],
  // Add more as they're implemented
]);

// Lazy loading map for optional components
const LAZY_COMPONENT_MAP: Record<string, () => Promise<any>> = {
  'pie': () => import('../charts/pie-chart/pie-chart.component').then(m => m.PieChartComponent),
  'scatter': () => import('../charts/scatter-plot/scatter-plot.component').then(m => m.ScatterPlotComponent),
  // Add more as needed
};

export async function loadWidgetComponent(type: string): Promise<Type<any>> {
  // Check registry first
  const component = COMPONENT_REGISTRY.get(type);
  if (component) {
    return component;
  }

  // Check lazy loading map
  const loader = LAZY_COMPONENT_MAP[type];
  if (loader) {
    return await loader();
  }

  throw new Error(`Unknown widget type: ${type}`);
}
```

## Testing Example

```typescript
describe('WidgetComponent', () => {
  let component: WidgetComponent;
  let fixture: ComponentFixture<WidgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WidgetComponent],
      providers: [
        { provide: DataService, useValue: mockDataService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetComponent);
    component = fixture.componentInstance;
    component.widget = mockWidget;
    fixture.detectChanges();
  });

  it('should load correct component based on widget type', async () => {
    component.widget = { ...mockWidget, type: 'line' };
    await component.ngOnInit();
    // Assert line chart component is loaded
  });

  it('should handle invalid widget type', async () => {
    component.widget = { ...mockWidget, type: 'invalid' as any };
    await component.ngOnInit();
    // Assert error state is displayed
  });
});
```

## Key Implementation Notes

1. **Dynamic Loading**: Use `ViewContainerRef.createComponent()` for Angular 20 compatibility
2. **State Management**: Use `BehaviorSubject` for reactive state management
3. **Error Handling**: Always handle errors gracefully and display user-friendly messages
4. **Cleanup**: Properly clean up all resources in `ngOnDestroy()` to prevent memory leaks
5. **Validation**: Validate widget configuration before rendering
6. **Performance**: Use OnPush change detection and lazy loading for optimal performance
7. **Accessibility**: Add proper ARIA labels and keyboard navigation support

## Next Steps

1. Implement widget header component (feature 007)
2. Implement chart components (features 008-017)
3. Implement non-chart widgets (features 018-021)
4. Integrate with dashboard container
5. Add end-to-end tests

## References

- [Component API Contract](./contracts/component-api-contract.md)
- [Data Model](./data-model.md)
- [Research Findings](./research.md)
- [Feature Specification](./spec.md)

