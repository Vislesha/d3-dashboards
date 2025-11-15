# Line Chart Component

A D3.js-based Angular standalone component for displaying interactive line charts with multiple series support, tooltips, zoom/pan capabilities, and extensive customization options.

## Features

- **Multiple Series Support**: Display multiple data series on a single chart
- **Time-Series Support**: Automatic detection and formatting of time-series data
- **Interactive Tooltips**: Hover to see detailed point information
- **Zoom & Pan**: Mouse wheel, pinch, brush selection, and keyboard navigation
- **Customizable Axes**: Configure labels, scales, ticks, and formatting
- **Performance Optimized**: Handles large datasets (10,000+ points) with automatic sampling
- **Responsive**: Automatically resizes with container using ResizeObserver
- **Accessible**: ARIA labels and keyboard navigation support

## Installation

The component is part of the `d3-dashboards` library. Import it from the public API:

```typescript
import { LineChartComponent } from 'd3-dashboards';
```

## Basic Usage

### Standalone Usage

```typescript
import { Component } from '@angular/core';
import { LineChartComponent } from 'd3-dashboards';
import { ILineChartData } from 'd3-dashboards';

@Component({
  selector: 'app-my-chart',
  standalone: true,
  imports: [LineChartComponent],
  template: `
    <d3-line-chart
      [data]="chartData"
      [config]="chartConfig"
      (pointHover)="onPointHover($event)"
      (zoomChange)="onZoomChange($event)">
    </d3-line-chart>
  `,
})
export class MyChartComponent {
  chartData: ILineChartData = {
    series: [
      {
        id: 'series1',
        name: 'Sales',
        data: [
          { x: 1, y: 100 },
          { x: 2, y: 150 },
          { x: 3, y: 200 },
        ],
      },
    ],
  };

  chartConfig = {
    width: 800,
    height: 400,
  };

  onPointHover(event: any) {
    console.log('Hovered point:', event);
  }

  onZoomChange(event: any) {
    console.log('Zoom changed:', event);
  }
}
```

### Widget Integration

The component is automatically registered for use in dashboard widgets:

```typescript
const widget: ID3Widget = {
  id: 'line-chart-1',
  type: 'line',
  title: 'Sales Trend',
  dataSource: {
    type: 'api',
    endpoint: '/api/sales',
  },
  config: {
    chartOptions: {
      xAxis: {
        label: 'Date',
        scaleType: 'time',
      },
      yAxis: {
        label: 'Sales ($)',
      },
    },
  },
};
```

## Data Format

### Direct Data Input

```typescript
const chartData: ILineChartData = {
  series: [
    {
      id: 'series1',
      name: 'Series 1',
      data: [
        { x: 1, y: 10 },
        { x: 2, y: 20 },
        { x: 3, y: 30 },
      ],
      color: '#1f77b4', // Optional
      visible: true, // Optional
    },
  ],
  metadata: {
    title: 'My Chart',
    description: 'Chart description',
  },
};
```

### Time-Series Data

```typescript
const timeSeriesData: ILineChartData = {
  series: [
    {
      id: 'series1',
      name: 'Temperature',
      data: [
        { x: new Date('2024-01-01'), y: 20 },
        { x: new Date('2024-01-02'), y: 22 },
        { x: new Date('2024-01-03'), y: 25 },
      ],
    },
  ],
};
```

### Data Source Input

```typescript
const dataSource: IDataSource = {
  type: 'api',
  endpoint: '/api/data',
  method: 'GET',
  params: { startDate: '2024-01-01' },
};
```

## Configuration Options

### Basic Configuration

```typescript
const config: ILineChartConfiguration = {
  width: 800,
  height: 400,
  margins: {
    top: 20,
    right: 20,
    bottom: 40,
    left: 60,
  },
};
```

### Axis Configuration

```typescript
const config: ILineChartConfiguration = {
  xAxis: {
    label: 'Date',
    scaleType: 'time', // 'linear' | 'time' | 'ordinal'
    ticks: 10,
    visible: true,
    tickFormat: (d) => d.toLocaleDateString(), // Custom formatter
  },
  yAxis: {
    label: 'Value',
    scaleType: 'linear', // 'linear' | 'log'
    ticks: 5,
    visible: true,
    domainPadding: 0.1, // Extend domain by 10%
  },
};
```

### Series Configuration

```typescript
const config: ILineChartConfiguration = {
  series: {
    colors: ['#1f77b4', '#ff7f0e', '#2ca02c'], // Custom color palette
    curveType: 'monotone', // 'linear' | 'monotone' | 'basis' | 'cardinal'
    strokeWidth: 2,
  },
};
```

### Tooltip Configuration

```typescript
const config: ILineChartConfiguration = {
  tooltip: {
    enabled: true,
    position: 'mouse', // 'mouse' | 'point'
    formatter: (point, series) => {
      return `${series.name}: ${point.y} at ${point.x}`;
    },
  },
};
```

### Zoom Configuration

```typescript
const config: ILineChartConfiguration = {
  zoom: {
    enabled: true,
    minZoom: 1,
    maxZoom: 10,
    panEnabled: true,
    wheelZoomEnabled: true,
    brushZoomEnabled: true, // Enable brush selection zoom
  },
};
```

### Animation Configuration

```typescript
const config: ILineChartConfiguration = {
  animation: {
    enabled: true,
    duration: 750, // milliseconds
    easing: 'ease-in-out',
  },
};
```

## Events

### pointClick

Emitted when a data point is clicked:

```typescript
(pointClick)="onPointClick($event)"

onPointClick(event: { point: ILineChartDataPoint; series: ILineChartSeries }) {
  console.log('Clicked:', event.point, event.series);
}
```

### pointHover

Emitted when hovering over a data point:

```typescript
(pointHover)="onPointHover($event)"

onPointHover(event: { point: ILineChartDataPoint; series: ILineChartSeries }) {
  console.log('Hovered:', event.point, event.series);
}
```

### zoomChange

Emitted when zoom/pan state changes:

```typescript
(zoomChange)="onZoomChange($event)"

onZoomChange(event: IZoomState) {
  console.log('Zoom state:', event.isZoomed, event.visibleDomain);
}
```

### error

Emitted when an error occurs:

```typescript
(error)="onError($event)"

onError(error: Error) {
  console.error('Chart error:', error);
}
```

## Keyboard Navigation

When the chart container has focus, the following keyboard shortcuts are available:

- `+` or `=` - Zoom in
- `-` or `_` - Zoom out
- `R` - Reset zoom
- `Arrow Left` - Pan left
- `Arrow Right` - Pan right
- `Arrow Up` - Pan up
- `Arrow Down` - Pan down

## Methods

### resetZoom()

Programmatically reset zoom to show all data:

```typescript
@ViewChild(LineChartComponent) chart!: LineChartComponent;

resetChartZoom() {
  this.chart.resetZoom();
}
```

## Performance Considerations

- **Large Datasets**: Datasets with more than 1,000 points are automatically sampled to maintain performance
- **Memoization**: Expensive calculations (scales, paths) are memoized
- **Debouncing**: Resize events are debounced to prevent excessive redraws
- **OnPush Change Detection**: Component uses OnPush strategy for optimal performance

## Styling

The component uses CSS classes that can be customized:

```scss
.line-chart-container {
  // Container styles
}

.line-chart-svg {
  // SVG styles
}

.line-chart-empty {
  // Empty state styles
}

.line-chart-error {
  // Error state styles
}
```

## Examples

### Multiple Series

```typescript
const multiSeriesData: ILineChartData = {
  series: [
    {
      id: 'sales',
      name: 'Sales',
      data: [
        { x: 1, y: 100 },
        { x: 2, y: 150 },
        { x: 3, y: 200 },
      ],
    },
    {
      id: 'revenue',
      name: 'Revenue',
      data: [
        { x: 1, y: 200 },
        { x: 2, y: 250 },
        { x: 3, y: 300 },
      ],
    },
  ],
};
```

### Custom Styling per Series

```typescript
const styledData: ILineChartData = {
  series: [
    {
      id: 'series1',
      name: 'Series 1',
      data: [...],
      style: {
        color: '#ff0000',
        strokeWidth: 3,
        strokeDasharray: '5,5',
        opacity: 0.8,
      },
    },
  ],
};
```

### Logarithmic Scale

```typescript
const config: ILineChartConfiguration = {
  yAxis: {
    scaleType: 'log',
    label: 'Log Scale',
  },
};
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Edge (latest)
- Safari (latest)

Requires ResizeObserver API support (available in all modern browsers).

## Dependencies

- Angular 20.2.0+
- D3.js 7.8.5+
- RxJS 7.8.0+

## License

Part of the d3-dashboards library.

