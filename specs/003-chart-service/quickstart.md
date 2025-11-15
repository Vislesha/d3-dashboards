# Quickstart: Chart Service

**Feature**: 003-chart-service  
**Date**: 2025-01-27

## Overview

The Chart Service provides chart factory methods, D3 utility functions, scale and axis helpers, and color palette management for creating and managing D3 charts programmatically.

## Installation

The Chart Service is part of the `d3-dashboards` library. Import it in your Angular component or service:

```typescript
import { ChartService } from '@d3-dashboards/chart-service';
import { IChartConfig, IScaleConfig, IAxisConfig, IColorPalette } from '@d3-dashboards/entities';
```

## Basic Usage

### 1. Inject the Service

```typescript
import { Component, inject } from '@angular/core';
import { ChartService } from '@d3-dashboards/chart-service';

@Component({
  selector: 'app-my-component',
  standalone: true,
  template: `<div id="chart-container"></div>`
})
export class MyComponent {
  private chartService = inject(ChartService);
}
```

### 2. Create a Chart

```typescript
// Define chart configuration
const chartConfig: IChartConfig = {
  type: 'line',
  data: [
    { x: 1, y: 10 },
    { x: 2, y: 20 },
    { x: 3, y: 15 }
  ],
  options: {
    width: 800,
    height: 400,
    margin: { top: 20, right: 20, bottom: 40, left: 40 }
  }
};

// Create chart instance
const chart = this.chartService.createChart(chartConfig);

// Render chart to DOM
const container = document.getElementById('chart-container')!;
chart.render(container);
```

### 3. Create a Scale

```typescript
// Create a linear scale
const scaleConfig: IScaleConfig = {
  type: 'linear',
  domain: [0, 100],
  range: [0, 800],
  nice: true
};

const scale = this.chartService.createScale(scaleConfig);

// Use scale to map values
const x1 = scale(0);   // Returns 0
const x2 = scale(50);  // Returns 400
const x3 = scale(100); // Returns 800
```

### 4. Create an Axis

```typescript
// First create a scale
const scale = this.chartService.createScale({
  type: 'linear',
  domain: [0, 100],
  range: [0, 800]
});

// Create axis with scale
const axisConfig: IAxisConfig = {
  scale: scale,
  orientation: 'bottom',
  ticks: 10,
  tickFormat: (d) => `${d}%`
};

const axis = this.chartService.createAxis(axisConfig);

// Use axis in SVG
const svg = d3.select('#chart-container').append('svg');
svg.append('g')
  .attr('class', 'x-axis')
  .call(axis);
```

### 5. Get Colors from Palette

```typescript
// Get 5 colors from default palette
const colors = this.chartService.getColors(5);
// Returns: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd']

// Get colors from specific palette
const colors = this.chartService.getColors(10, 'custom');
```

## Advanced Features

### Chart Factory Methods

Create different chart types:

```typescript
// Line chart
const lineChart = this.chartService.createChart({
  type: 'line',
  data: lineData,
  options: { width: 800, height: 400 }
});

// Bar chart
const barChart = this.chartService.createChart({
  type: 'bar',
  data: barData,
  options: { width: 800, height: 400 }
});

// Pie chart
const pieChart = this.chartService.createChart({
  type: 'pie',
  data: pieData,
  options: { width: 400, height: 400 }
});
```

### Scale Types

Create different scale types:

```typescript
// Linear scale
const linearScale = this.chartService.createScale({
  type: 'linear',
  domain: [0, 100],
  range: [0, 800]
});

// Time scale
const timeScale = this.chartService.createScale({
  type: 'time',
  domain: [new Date(2020, 0, 1), new Date(2020, 11, 31)],
  range: [0, 800]
});

// Ordinal scale
const ordinalScale = this.chartService.createScale({
  type: 'ordinal',
  domain: ['A', 'B', 'C', 'D'],
  range: [0, 100, 200, 300]
});

// Band scale (for bar charts)
const bandScale = this.chartService.createScale({
  type: 'band',
  domain: ['Jan', 'Feb', 'Mar', 'Apr'],
  range: [0, 800],
  padding: 0.1
});
```

### Axis Orientations

Create axes with different orientations:

```typescript
const scale = this.chartService.createScale({
  type: 'linear',
  domain: [0, 100],
  range: [0, 800]
});

// Bottom axis
const bottomAxis = this.chartService.createAxis({
  scale: scale,
  orientation: 'bottom'
});

// Top axis
const topAxis = this.chartService.createAxis({
  scale: scale,
  orientation: 'top'
});

// Left axis
const leftAxis = this.chartService.createAxis({
  scale: scale,
  orientation: 'left'
});

// Right axis
const rightAxis = this.chartService.createAxis({
  scale: scale,
  orientation: 'right'
});
```

### Color Palette Management

Register and use custom color palettes:

```typescript
// Register a custom palette
const customPalette: IColorPalette = {
  name: 'custom',
  colors: [
    '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff',
    '#00ffff', '#ff8800', '#88ff00', '#0088ff', '#ff0088'
  ],
  description: 'Custom color palette'
};

this.chartService.setColorPalette(customPalette);

// Set as default
this.chartService.setDefaultPalette('custom');

// Get colors from custom palette
const colors = this.chartService.getColors(15, 'custom');
// Colors will cycle if count > palette.length
```

### Update Scales and Axes

Update existing scales and axes:

```typescript
// Create initial scale
const scale = this.chartService.createScale({
  type: 'linear',
  domain: [0, 100],
  range: [0, 800]
});

// Update scale with new domain
const updatedScale = this.chartService.updateScale(scale, {
  domain: [0, 200] // New domain
});

// Create axis
const axis = this.chartService.createAxis({
  scale: scale,
  orientation: 'bottom',
  ticks: 10
});

// Update axis with new tick count
const updatedAxis = this.chartService.updateAxis(axis, {
  ticks: 20 // New tick count
});
```

### Calculate Margins

Calculate chart margins:

```typescript
// Calculate margins with defaults
const margins = this.chartService.calculateMargins(800, 400);
// Returns: { top: 20, right: 20, bottom: 40, left: 40 }

// Calculate margins with custom values
const margins = this.chartService.calculateMargins(800, 400, {
  top: 30,
  left: 50
});
// Returns: { top: 30, right: 20, bottom: 40, left: 50 }
```

## Validation

Validate configurations before use:

```typescript
// Validate chart configuration
const chartConfig: IChartConfig = {
  type: 'line',
  data: chartData,
  options: chartOptions
};

const validation = this.chartService.validateChartConfig(chartConfig);
if (!validation.valid) {
  console.error('Validation errors:', validation.errors);
  // Fix errors before creating chart
} else {
  const chart = this.chartService.createChart(chartConfig);
}

// Validate scale configuration
const scaleConfig: IScaleConfig = {
  type: 'linear',
  domain: [0, 100],
  range: [0, 800]
};

const scaleValidation = this.chartService.validateScaleConfig(scaleConfig);
if (!scaleValidation.valid) {
  console.error('Scale validation errors:', scaleValidation.errors);
}

// Validate axis configuration
const axisConfig: IAxisConfig = {
  scale: scale,
  orientation: 'bottom'
};

const axisValidation = this.chartService.validateAxisConfig(axisConfig);
if (!axisValidation.valid) {
  console.error('Axis validation errors:', axisValidation.errors);
}
```

## Error Handling

Handle errors gracefully:

```typescript
try {
  const chart = this.chartService.createChart({
    type: 'invalid-type', // Invalid chart type
    data: []
  });
} catch (error) {
  if (error instanceof InvalidChartTypeError) {
    console.error('Invalid chart type:', error.message);
    // Handle invalid chart type
  } else if (error instanceof InvalidChartConfigError) {
    console.error('Invalid chart config:', error.message);
    // Handle invalid configuration
  }
}

try {
  const palette = this.chartService.getColorPalette('nonexistent');
  if (!palette) {
    console.warn('Palette not found');
  }
} catch (error) {
  if (error instanceof PaletteNotFoundError) {
    console.error('Palette error:', error.message);
  }
}
```

## Complete Example

```typescript
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { ChartService } from '@d3-dashboards/chart-service';
import { IChartConfig, IScaleConfig, IAxisConfig } from '@d3-dashboards/entities';
import * as d3 from 'd3';

interface DataPoint {
  x: number;
  y: number;
}

@Component({
  selector: 'app-chart-demo',
  standalone: true,
  template: `
    <div id="chart-container"></div>
    <button (click)="updateChart()">Update Chart</button>
  `
})
export class ChartDemoComponent implements OnInit, OnDestroy {
  private chartService = inject(ChartService);
  private chart: IChartInstance | null = null;
  
  data: DataPoint[] = [
    { x: 1, y: 10 },
    { x: 2, y: 20 },
    { x: 3, y: 15 },
    { x: 4, y: 25 },
    { x: 5, y: 18 }
  ];

  ngOnInit() {
    // Create scale
    const scaleConfig: IScaleConfig = {
      type: 'linear',
      domain: [0, 30],
      range: [0, 800]
    };
    const xScale = this.chartService.createScale(scaleConfig);
    
    const yScaleConfig: IScaleConfig = {
      type: 'linear',
      domain: [0, 30],
      range: [400, 0]
    };
    const yScale = this.chartService.createScale(yScaleConfig);

    // Create axes
    const xAxis = this.chartService.createAxis({
      scale: xScale,
      orientation: 'bottom',
      ticks: 5
    });

    const yAxis = this.chartService.createAxis({
      scale: yScale,
      orientation: 'left',
      ticks: 5
    });

    // Get colors
    const colors = this.chartService.getColors(1);

    // Create chart
    const chartConfig: IChartConfig = {
      type: 'line',
      data: this.data,
      options: {
        width: 800,
        height: 400,
        margin: this.chartService.calculateMargins(800, 400),
        colors: colors
      }
    };

    // Validate before creating
    const validation = this.chartService.validateChartConfig(chartConfig);
    if (validation.valid) {
      this.chart = this.chartService.createChart(chartConfig);
      
      // Render chart
      const container = document.getElementById('chart-container')!;
      this.chart.render(container);
    } else {
      console.error('Chart validation failed:', validation.errors);
    }
  }

  updateChart() {
    if (this.chart) {
      // Update with new data
      const newData: DataPoint[] = [
        { x: 1, y: 15 },
        { x: 2, y: 25 },
        { x: 3, y: 20 },
        { x: 4, y: 30 },
        { x: 5, y: 22 }
      ];
      this.chart.update(newData);
    }
  }

  ngOnDestroy() {
    // Clean up chart resources
    if (this.chart) {
      this.chart.destroy();
    }
  }
}
```

## Best Practices

1. **Always validate configurations** before creating charts, scales, or axes
2. **Use appropriate scale types** for your data (linear for numbers, time for dates, ordinal for categories)
3. **Manage color palettes** centrally for visual consistency across charts
4. **Clean up chart resources** by calling `destroy()` in `ngOnDestroy`
5. **Update charts** using the `update()` method instead of recreating
6. **Calculate margins** using the helper function for consistent spacing
7. **Handle errors** gracefully with try-catch blocks
8. **Use type-safe configurations** with TypeScript interfaces

## Next Steps

- See [data-model.md](./data-model.md) for detailed entity definitions
- See [contracts/service-api-contract.md](./contracts/service-api-contract.md) for complete API reference
- See [spec.md](./spec.md) for full feature specification
- See [research.md](./research.md) for implementation patterns and decisions

