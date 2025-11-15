# Component API Contract: LineChartComponent

**Version**: 1.0.0  
**Date**: 2025-01-27  
**Component Path**: `projects/d3-dashboards/src/lib/charts/line-chart/line-chart.component.ts`

## Overview

The `LineChartComponent` is a standalone Angular component that renders D3.js-based line charts with support for multiple series, interactive tooltips, zoom and pan capabilities, time-series data, and customizable axes.

## Component Declaration

```typescript
@Component({
  selector: 'd3-line-chart',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit, OnChanges, OnDestroy {
  // Implementation
}
```

## Inputs

### `data: ILineChartData` (Required)

Chart data containing one or more series of data points.

**Type**: `ILineChartData`

**Structure**:
```typescript
{
  series: ILineChartSeries[];
  metadata?: {
    title?: string;
    description?: string;
    source?: string;
  };
}
```

**Validation**:
- `series` must be a non-empty array
- Each series must have a unique `id`
- Each series must have at least one data point

**Example**:
```typescript
{
  series: [
    {
      id: 'series-1',
      name: 'Sales',
      data: [
        { x: new Date('2024-01-01'), y: 100 },
        { x: new Date('2024-01-02'), y: 150 },
        { x: new Date('2024-01-03'), y: 120 }
      ]
    }
  ]
}
```

---

### `config: ILineChartConfiguration` (Optional)

Chart configuration options.

**Type**: `ILineChartConfiguration`

**Default**: See data-model.md for default values

**Key Options**:
- `width`, `height`: Chart dimensions
- `margins`: Chart margins
- `series`: Series styling (colors, curve type, stroke width)
- `xAxis`, `yAxis`: Axis configuration (labels, scales, formatting)
- `tooltip`: Tooltip configuration
- `zoom`: Zoom and pan configuration
- `animation`: Animation configuration

---

### `width: number` (Optional)

Chart width in pixels. Overrides `config.width`.

**Type**: `number`

**Validation**: Must be >= 100

---

### `height: number` (Optional)

Chart height in pixels. Overrides `config.height`.

**Type**: `number`

**Validation**: Must be >= 100

---

## Outputs

### `pointClick: EventEmitter<{ point: ILineChartDataPoint; series: ILineChartSeries }>`

Emitted when a data point is clicked.

**Payload**:
```typescript
{
  point: ILineChartDataPoint;
  series: ILineChartSeries;
}
```

---

### `pointHover: EventEmitter<{ point: ILineChartDataPoint; series: ILineChartSeries }>`

Emitted when a data point is hovered (for tooltip display).

**Payload**:
```typescript
{
  point: ILineChartDataPoint;
  series: ILineChartSeries;
}
```

---

### `zoomChange: EventEmitter<IZoomState>`

Emitted when zoom or pan state changes.

**Payload**:
```typescript
{
  transform: d3.ZoomTransform;
  initialTransform: d3.ZoomTransform;
  isZoomed: boolean;
  visibleDomain?: [number, number] | [Date, Date];
}
```

---

### `error: EventEmitter<Error>`

Emitted when an error occurs during chart rendering or interaction.

**Payload**: `Error`

---

## Public Methods

### `resetZoom(): void`

Resets the chart zoom to show all data.

**Returns**: `void`

**Side Effects**: Updates chart zoom state and triggers re-render

---

### `updateData(data: ILineChartData): void`

Updates chart data programmatically.

**Parameters**:
- `data: ILineChartData` - New chart data

**Returns**: `void`

**Side Effects**: Triggers chart re-render with new data

---

### `updateConfig(config: Partial<ILineChartConfiguration>): void`

Updates chart configuration programmatically.

**Parameters**:
- `config: Partial<ILineChartConfiguration>` - Partial configuration to merge with existing config

**Returns**: `void`

**Side Effects**: Triggers chart re-render with new configuration

---

### `exportChart(format?: 'png' | 'svg'): Promise<string>`

Exports chart as image.

**Parameters**:
- `format: 'png' | 'svg'` (optional) - Export format, defaults to `'png'`

**Returns**: `Promise<string>` - Data URL of exported image

---

## Lifecycle Hooks

### `ngOnInit(): void`

Initializes chart, creates D3 scales and axes, sets up event listeners.

---

### `ngOnChanges(changes: SimpleChanges): void`

Handles input changes (`data`, `config`, `width`, `height`), triggers chart updates using enter/update/exit pattern.

---

### `ngOnDestroy(): void`

Cleans up D3 selections, event listeners, and ResizeObserver to prevent memory leaks.

---

## Usage Example

```typescript
import { Component } from '@angular/core';
import { LineChartComponent } from '@d3-dashboards/charts/line-chart';
import { ILineChartData, ILineChartConfiguration } from '@d3-dashboards/entities';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [LineChartComponent],
  template: `
    <d3-line-chart
      [data]="chartData"
      [config]="chartConfig"
      (pointClick)="onPointClick($event)"
      (zoomChange)="onZoomChange($event)"
    ></d3-line-chart>
  `
})
export class DashboardComponent {
  chartData: ILineChartData = {
    series: [
      {
        id: 'sales',
        name: 'Sales',
        data: [
          { x: new Date('2024-01-01'), y: 100 },
          { x: new Date('2024-01-02'), y: 150 }
        ]
      }
    ]
  };

  chartConfig: ILineChartConfiguration = {
    width: 800,
    height: 400,
    zoom: {
      enabled: true,
      maxZoom: 10
    }
  };

  onPointClick(event: { point: ILineChartDataPoint; series: ILineChartSeries }) {
    console.log('Point clicked:', event);
  }

  onZoomChange(state: IZoomState) {
    console.log('Zoom changed:', state);
  }
}
```

---

## Error Handling

The component handles the following error cases:

1. **Empty Data**: Displays empty state message
2. **Invalid Data**: Emits `error` event and displays error message
3. **Invalid Configuration**: Uses default values and emits warning
4. **Rendering Errors**: Catches and emits `error` event

---

## Performance Considerations

- Chart renders within 100ms for datasets < 1000 points
- Tooltips appear within 50ms of mouse hover
- Zoom operations complete within 100ms
- Chart maintains 60fps during zoom/pan interactions
- Handles datasets up to 10,000 points with data sampling

---

## Accessibility

- ARIA labels and descriptions
- Keyboard navigation support
- Screen reader support
- Focus indicators
- Color not the only means of conveying information

