# Quickstart: Line Chart Component

**Feature**: 008-line-chart  
**Date**: 2025-01-27

## Overview

This guide provides a quick introduction to using the Line Chart Component in your Angular application.

---

## Installation

The Line Chart Component is part of the `@d3-dashboards` library. Ensure you have the library installed:

```bash
npm install @d3-dashboards
```

---

## Basic Usage

### 1. Import the Component

```typescript
import { Component } from '@angular/core';
import { LineChartComponent } from '@d3-dashboards/charts/line-chart';
import { ILineChartData } from '@d3-dashboards/entities';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [LineChartComponent],
  template: `
    <d3-line-chart [data]="chartData"></d3-line-chart>
  `
})
export class ExampleComponent {
  chartData: ILineChartData = {
    series: [
      {
        id: 'series-1',
        name: 'Sales',
        data: [
          { x: 1, y: 100 },
          { x: 2, y: 150 },
          { x: 3, y: 120 },
          { x: 4, y: 180 }
        ]
      }
    ]
  };
}
```

---

## Common Examples

### Single Series Line Chart

```typescript
chartData: ILineChartData = {
  series: [
    {
      id: 'temperature',
      name: 'Temperature (°C)',
      data: [
        { x: new Date('2024-01-01'), y: 20 },
        { x: new Date('2024-01-02'), y: 22 },
        { x: new Date('2024-01-03'), y: 18 },
        { x: new Date('2024-01-04'), y: 25 }
      ]
    }
  ]
};
```

### Multiple Series Line Chart

```typescript
chartData: ILineChartData = {
  series: [
    {
      id: 'sales',
      name: 'Sales',
      data: [
        { x: 1, y: 100 },
        { x: 2, y: 150 },
        { x: 3, y: 120 }
      ],
      color: '#3b82f6'
    },
    {
      id: 'revenue',
      name: 'Revenue',
      data: [
        { x: 1, y: 200 },
        { x: 2, y: 250 },
        { x: 3, y: 220 }
      ],
      color: '#10b981'
    }
  ]
};
```

### Time-Series Chart with Custom Configuration

```typescript
import { ILineChartData, ILineChartConfiguration } from '@d3-dashboards/entities';

chartData: ILineChartData = {
  series: [
    {
      id: 'visitors',
      name: 'Website Visitors',
      data: [
        { x: new Date('2024-01-01'), y: 1000 },
        { x: new Date('2024-01-02'), y: 1200 },
        { x: new Date('2024-01-03'), y: 1100 }
      ]
    }
  ]
};

chartConfig: ILineChartConfiguration = {
  width: 800,
  height: 400,
  xAxis: {
    label: 'Date',
    scaleType: 'time',
    tickFormat: (d: Date) => d.toLocaleDateString()
  },
  yAxis: {
    label: 'Visitors',
    scaleType: 'linear'
  },
  zoom: {
    enabled: true,
    maxZoom: 10,
    panEnabled: true,
    wheelZoomEnabled: true
  },
  tooltip: {
    enabled: true,
    formatter: (point, series) => 
      `${series.name}: ${point.y} on ${point.x.toLocaleDateString()}`
  }
};
```

---

## Configuration Options

### Chart Dimensions

```typescript
chartConfig: ILineChartConfiguration = {
  width: 800,  // Chart width in pixels
  height: 400, // Chart height in pixels
  margins: {
    top: 20,
    right: 20,
    bottom: 40,
    left: 60
  }
};
```

### Series Styling

```typescript
chartConfig: ILineChartConfiguration = {
  series: {
    colors: ['#3b82f6', '#10b981', '#f59e0b'], // Default colors
    curveType: 'monotone', // 'linear' | 'monotone' | 'basis' | 'cardinal'
    strokeWidth: 2
  }
};
```

### Axis Configuration

```typescript
chartConfig: ILineChartConfiguration = {
  xAxis: {
    label: 'X Axis',
    scaleType: 'linear', // 'linear' | 'time' | 'ordinal'
    tickFormat: (d) => d.toString(),
    ticks: 10,
    visible: true
  },
  yAxis: {
    label: 'Y Axis',
    scaleType: 'linear', // 'linear' | 'log'
    tickFormat: (d) => `$${d}`,
    ticks: 5,
    visible: true,
    domainPadding: 0.1 // Extends domain by 10%
  }
};
```

### Zoom and Pan

```typescript
chartConfig: ILineChartConfiguration = {
  zoom: {
    enabled: true,
    minZoom: 1,
    maxZoom: 10,
    panEnabled: true,
    wheelZoomEnabled: true,
    brushZoomEnabled: false
  }
};
```

### Tooltip Configuration

```typescript
chartConfig: ILineChartConfiguration = {
  tooltip: {
    enabled: true,
    position: 'mouse', // 'mouse' | 'point'
    formatter: (point, series) => 
      `${series.name}: ${point.y}`
  }
};
```

### Animation

```typescript
chartConfig: ILineChartConfiguration = {
  animation: {
    enabled: true,
    duration: 750, // milliseconds
    easing: 'ease-in-out'
  }
};
```

---

## Event Handling

### Point Click

```typescript
<d3-line-chart
  [data]="chartData"
  (pointClick)="onPointClick($event)"
></d3-line-chart>

onPointClick(event: { point: ILineChartDataPoint; series: ILineChartSeries }) {
  console.log('Clicked point:', event.point);
  console.log('Series:', event.series);
}
```

### Point Hover

```typescript
<d3-line-chart
  [data]="chartData"
  (pointHover)="onPointHover($event)"
></d3-line-chart>

onPointHover(event: { point: ILineChartDataPoint; series: ILineChartSeries }) {
  // Tooltip is automatically displayed, but you can handle the event
  console.log('Hovered point:', event.point);
}
```

### Zoom Change

```typescript
<d3-line-chart
  [data]="chartData"
  (zoomChange)="onZoomChange($event)"
></d3-line-chart>

onZoomChange(state: IZoomState) {
  console.log('Zoom level:', state.transform.k);
  console.log('Is zoomed:', state.isZoomed);
  console.log('Visible domain:', state.visibleDomain);
}
```

### Error Handling

```typescript
<d3-line-chart
  [data]="chartData"
  (error)="onError($event)"
></d3-line-chart>

onError(error: Error) {
  console.error('Chart error:', error);
  // Display error message to user
}
```

---

## Programmatic Control

### Reset Zoom

```typescript
@ViewChild(LineChartComponent) chart!: LineChartComponent;

resetChart() {
  this.chart.resetZoom();
}
```

### Update Data

```typescript
@ViewChild(LineChartComponent) chart!: LineChartComponent;

updateChartData() {
  this.chart.updateData(newData);
}
```

### Update Configuration

```typescript
@ViewChild(LineChartComponent) chart!: LineChartComponent;

updateChartConfig() {
  this.chart.updateConfig({
    zoom: { maxZoom: 20 }
  });
}
```

### Export Chart

```typescript
@ViewChild(LineChartComponent) chart!: LineChartComponent;

async exportChart() {
  const dataUrl = await this.chart.exportChart('png');
  // Use dataUrl to download or display image
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = 'chart.png';
  link.click();
}
```

---

## Handling Edge Cases

### Empty Data

The component automatically displays an empty state message when no data is provided:

```typescript
chartData: ILineChartData = {
  series: [] // Empty series array
};
```

### Missing/Null Values

Null values in data points are handled automatically (lines break at null values):

```typescript
chartData: ILineChartData = {
  series: [
    {
      id: 'series-1',
      name: 'Data',
      data: [
        { x: 1, y: 100 },
        { x: 2, y: null }, // Missing value - line breaks here
        { x: 3, y: 150 }
      ]
    }
  ]
};
```

### Large Datasets

The component automatically samples data for datasets > 1000 points to maintain performance:

```typescript
// Component handles large datasets automatically
const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
  x: i,
  y: Math.random() * 100
}));
```

---

## Responsive Design

The component automatically resizes with its container using ResizeObserver:

```typescript
<div style="width: 100%; height: 400px;">
  <d3-line-chart [data]="chartData"></d3-line-chart>
</div>
```

---

## Best Practices

1. **Use appropriate scale types**: Use `'time'` for dates, `'linear'` for numbers, `'ordinal'` for categories
2. **Provide meaningful labels**: Always set axis labels for better UX
3. **Handle errors**: Always implement error handlers
4. **Optimize for large datasets**: Consider data sampling for datasets > 10,000 points
5. **Use consistent colors**: Use the color palette consistently across charts
6. **Provide tooltips**: Enable tooltips for better data exploration
7. **Test zoom/pan**: Ensure zoom and pan work correctly with your data

---

## Next Steps

- See [data-model.md](./data-model.md) for detailed data structure documentation
- See [contracts/component-api-contract.md](./contracts/component-api-contract.md) for complete API reference
- See [spec.md](./spec.md) for feature requirements and success criteria

