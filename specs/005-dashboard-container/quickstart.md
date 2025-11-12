# Quick Start Guide: Dashboard Container Component

**Feature**: 001-dashboard-container  
**Date**: 2025-01-27

## Overview

This guide provides step-by-step instructions for implementing and using the Dashboard Container Component. The component provides a grid-based layout system with drag-and-drop widget positioning, resizable widgets, responsive design, edit mode, filter propagation, and export/import functionality.

## Prerequisites

Before implementing this component, ensure:

- Angular workspace is set up (see 000-project-setup)
- `angular-gridster2@^20.0.0` is installed
- Required interfaces are defined in `entities/` directory:
  - `ID3Widget`
  - `IGridConfiguration`
  - `IFilterValues`
  - `IWidgetPosition`

## Implementation Steps

### Step 1: Create Component Structure

Generate the component using Angular CLI:

```bash
cd projects/d3-dashboards/src/lib/components
npx ng generate component dashboard-container --standalone --skip-tests=false
```

**Expected Result**: Component directory created with:
- `dashboard-container.component.ts`
- `dashboard-container.component.html`
- `dashboard-container.component.scss`
- `dashboard-container.component.spec.ts`

### Step 2: Install angular-gridster2

Ensure angular-gridster2 is installed:

```bash
npm install angular-gridster2@^20.0.0
```

### Step 3: Define Interfaces

Create interface files in `entities/` directory:

**widget.interface.ts**:
```typescript
export interface ID3Widget {
  id: string;
  type: WidgetType;
  position: IWidgetPosition;
  title: string;
  config: ID3WidgetConfig;
  dataSource?: IDataSource;
  filters?: IFilterValues[];
  style?: IWidgetStyle;
}

export type WidgetType = 
  // Required for v1
  | 'line' | 'bar' 
  // Optional for v1 - Future implementation (will be implemented on a need basis)
  | 'pie' | 'scatter' | 'area' 
  | 'heatmap' | 'treemap' | 'force-graph' | 'geo-map' | 'gauge'
  // Additional widget types
  | 'table' | 'filter' | 'tile' | 'markdown';

export interface IWidgetPosition {
  x: number;
  y: number;
  cols: number;
  rows: number;
}
```

**grid-config.interface.ts**:
```typescript
export interface IGridConfiguration {
  columns: number;
  rowHeight: number;
  margin: number;
  minCols: number;
  maxCols: number;
  minRows: number;
  maxRows?: number;
  draggable: boolean;
  resizable: boolean;
  preventCollision: boolean;
  responsive: boolean;
  breakpoints?: IResponsiveBreakpoints;
}
```

**filter-values.interface.ts**:
```typescript
export interface IFilterValues {
  key: string;
  value: any;
  operator: FilterOperator;
  dataType?: FilterDataType;
}

export type FilterOperator = 
  | 'equals' | 'notEquals' | 'contains' | 'notContains'
  | 'greaterThan' | 'greaterThanOrEqual' | 'lessThan' | 'lessThanOrEqual'
  | 'in' | 'notIn' | 'between' | 'isNull' | 'isNotNull';
```

### Step 4: Implement Component

**dashboard-container.component.ts** (skeleton):

```typescript
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridsterModule, GridsterConfig, GridsterItem } from 'angular-gridster2';
import { BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ID3Widget } from '../../entities/widget.interface';
import { IGridConfiguration } from '../../entities/grid-config.interface';
import { IFilterValues } from '../../entities/filter-values.interface';

@Component({
  selector: 'lib-dashboard-container',
  standalone: true,
  imports: [CommonModule, GridsterModule],
  templateUrl: './dashboard-container.component.html',
  styleUrls: ['./dashboard-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardContainerComponent implements OnInit, OnChanges {
  @Input() widgets: ID3Widget[] = [];
  @Input() gridConfig?: IGridConfiguration;
  @Input() isEditMode: boolean = false;
  @Input() filterValues: IFilterValues[] = [];

  @Output() widgetChange = new EventEmitter<ID3Widget[]>();
  @Output() widgetSelect = new EventEmitter<ID3Widget>();
  @Output() filterChange = new EventEmitter<IFilterValues[]>();

  gridsterOptions: GridsterConfig = {};
  private _widgets: ID3Widget[] = [];
  private filterSubject = new BehaviorSubject<IFilterValues[]>([]);

  ngOnInit(): void {
    // Initialize component
    this.initializeGridster();
    this.setupFilterPropagation();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Handle input changes
    if (changes['widgets']) {
      this._widgets = [...this.widgets];
    }
    if (changes['isEditMode']) {
      this.updateGridsterEditMode();
    }
    if (changes['filterValues']) {
      this.filterSubject.next(this.filterValues);
    }
  }

  private initializeGridster(): void {
    // Initialize gridster configuration
  }

  private setupFilterPropagation(): void {
    // Setup filter debouncing and propagation
    this.filterSubject.pipe(
      debounceTime(300)
    ).subscribe(filters => {
      this.filterChange.emit(filters);
    });
  }

  private updateGridsterEditMode(): void {
    // Update gridster drag/resize based on edit mode
  }

  onItemChange(item: GridsterItem, widget: ID3Widget): void {
    // Handle widget position change
  }

  addWidget(widget: ID3Widget): void {
    // Add widget to dashboard
  }

  removeWidget(widgetId: string): void {
    // Remove widget from dashboard
  }

  exportConfiguration(): IDashboardExport {
    // Export dashboard configuration
  }

  print(): void {
    // Trigger print
  }
}
```

### Step 5: Implement Template

**dashboard-container.component.html**:

```html
<div class="dashboard-container" [class.edit-mode]="isEditMode">
  <div class="dashboard-toolbar" *ngIf="isEditMode">
    <button (click)="toggleEditMode()">Exit Edit Mode</button>
    <button (click)="print()">Print</button>
    <button (click)="exportConfiguration()">Export</button>
  </div>

  <gridster [options]="gridsterOptions" [itemChangeCallback]="onItemChange">
    <gridster-item 
      *ngFor="let widget of _widgets" 
      [item]="widget.position"
      (click)="widgetSelect.emit(widget)">
      <lib-widget 
        [widget]="widget" 
        [isEditMode]="isEditMode"
        [filters]="filterValues">
      </lib-widget>
    </gridster-item>
  </gridster>

  <div class="empty-state" *ngIf="_widgets.length === 0">
    <p>No widgets in dashboard</p>
    <button *ngIf="isEditMode" (click)="addDefaultWidget()">Add Widget</button>
  </div>
</div>
```

### Step 6: Export Component

Add to `public-api.ts`:

```typescript
export * from './components/dashboard-container/dashboard-container.component';
export * from './entities/widget.interface';
export * from './entities/grid-config.interface';
export * from './entities/filter-values.interface';
```

## Usage Examples

### Basic Usage

```typescript
import { Component } from '@angular/core';
import { DashboardContainerComponent } from 'd3-dashboards';
import { ID3Widget } from 'd3-dashboards';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DashboardContainerComponent],
  template: `
    <lib-dashboard-container
      [widgets]="widgets"
      [isEditMode]="editMode"
      (widgetChange)="onWidgetChange($event)"
      (widgetSelect)="onWidgetSelect($event)">
    </lib-dashboard-container>
  `
})
export class DashboardComponent {
  widgets: ID3Widget[] = [
    {
      id: '1',
      type: 'line',
      position: { x: 0, y: 0, cols: 6, rows: 4 },
      title: 'Sales Trend',
      config: {}
    },
    {
      id: '2',
      type: 'bar',
      position: { x: 6, y: 0, cols: 6, rows: 4 },
      title: 'Revenue by Region',
      config: {}
    }
  ];

  editMode = false;

  onWidgetChange(widgets: ID3Widget[]): void {
    this.widgets = widgets;
    // Save to backend or local storage
  }

  onWidgetSelect(widget: ID3Widget): void {
    console.log('Selected widget:', widget);
  }
}
```

### With Custom Grid Configuration

```typescript
import { IGridConfiguration } from 'd3-dashboards';

const customGridConfig: IGridConfiguration = {
  columns: 12,
  rowHeight: 100,
  margin: 10,
  minCols: 1,
  maxCols: 12,
  minRows: 1,
  draggable: false,
  resizable: false,
  preventCollision: true,
  responsive: true,
  breakpoints: {
    mobile: 320,
    tablet: 768,
    desktop: 1024,
    mobileCols: 4,
    tabletCols: 8,
    desktopCols: 12
  }
};

// In template:
<lib-dashboard-container
  [widgets]="widgets"
  [gridConfig]="customGridConfig"
  [isEditMode]="editMode">
</lib-dashboard-container>
```

### With Filter Propagation

```typescript
import { IFilterValues } from 'd3-dashboards';

filters: IFilterValues[] = [
  {
    key: 'date',
    value: [new Date('2024-01-01'), new Date('2024-12-31')],
    operator: 'between',
    dataType: 'date'
  },
  {
    key: 'status',
    value: 'active',
    operator: 'equals',
    dataType: 'string'
  }
];

// In template:
<lib-dashboard-container
  [widgets]="widgets"
  [filterValues]="filters"
  (filterChange)="onFilterChange($event)">
</lib-dashboard-container>
```

### Edit Mode Toggle

```typescript
toggleEditMode(): void {
  this.editMode = !this.editMode;
}

// In template:
<button (click)="toggleEditMode()">
  {{ editMode ? 'Exit Edit Mode' : 'Enter Edit Mode' }}
</button>

<lib-dashboard-container
  [widgets]="widgets"
  [isEditMode]="editMode">
</lib-dashboard-container>
```

### Export/Import Configuration

```typescript
exportDashboard(): void {
  const config = this.dashboardContainer.exportConfiguration();
  const json = JSON.stringify(config, null, 2);
  
  // Download as file
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'dashboard-config.json';
  link.click();
}

importDashboard(event: Event): void {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    const config = JSON.parse(e.target?.result as string);
    this.dashboardContainer.importConfiguration(config);
  };
  reader.readAsText(file);
}
```

## Testing

### Unit Test Example

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardContainerComponent } from './dashboard-container.component';
import { ID3Widget } from '../../entities/widget.interface';

describe('DashboardContainerComponent', () => {
  let component: DashboardContainerComponent;
  let fixture: ComponentFixture<DashboardContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardContainerComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardContainerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display widgets', () => {
    const widgets: ID3Widget[] = [
      {
        id: '1',
        type: 'line',
        position: { x: 0, y: 0, cols: 6, rows: 4 },
        title: 'Test Widget',
        config: {}
      }
    ];

    component.widgets = widgets;
    fixture.detectChanges();

    expect(component._widgets.length).toBe(1);
  });

  it('should emit widgetChange on widget update', () => {
    spyOn(component.widgetChange, 'emit');
    
    const widget: ID3Widget = {
      id: '1',
      type: 'line',
      position: { x: 0, y: 0, cols: 6, rows: 4 },
      title: 'Test',
      config: {}
    };

    component.addWidget(widget);
    expect(component.widgetChange.emit).toHaveBeenCalled();
  });
});
```

## Performance Considerations

1. **OnPush Change Detection**: Component uses OnPush strategy for performance
2. **Filter Debouncing**: Filter updates are debounced to 300ms
3. **Widget Rendering**: Consider lazy loading for large widget arrays
4. **Grid Updates**: Batch grid updates to prevent multiple re-renders

## Troubleshooting

### Widgets Not Displaying

- Check that `widgets` array is not empty
- Verify widget positions are within grid boundaries
- Check console for errors

### Drag-and-Drop Not Working

- Ensure `isEditMode` is `true`
- Verify `gridsterOptions.draggable` is `true`
- Check that GridsterModule is imported

### Filters Not Propagating

- Verify `filterValues` input is provided
- Check that filter debouncing is working (300ms delay)
- Ensure widgets are listening to filter inputs

## Next Steps

- Implement widget component (002-widget-component)
- Implement widget header (003-widget-header)
- Implement chart components (004-013)
- Implement widget types (014-017)

## References

- [angular-gridster2 Documentation](https://github.com/tiberiuzuld/angular-gridster2)
- [Angular Component Communication](https://angular.io/guide/component-interaction)
- [RxJS Operators](https://rxjs.dev/guide/operators)

