# Research: Line Chart Component

**Feature**: 008-line-chart  
**Date**: 2025-01-27  
**Status**: Complete

## Overview

This document consolidates research findings for implementing the Line Chart Component with D3.js v7.8.5, addressing all technical concerns identified in the implementation plan.

---

## Research Topic 1: D3 Zoom Behavior API

**Decision**: Use `d3.zoom()` behavior with `d3.zoomIdentity` for initial state and `zoom.transform()` for programmatic control.

**Rationale**: 
- D3's zoom behavior (`d3.zoom`) is the standard approach for implementing zoom and pan in D3 charts
- It provides built-in support for mouse wheel, drag, and touch gestures
- The zoom transform can be stored and restored for reset functionality
- It integrates well with D3 scales through `zoom.scaleExtent()` and `zoom.translateExtent()`

**Implementation Approach**:
1. Create zoom behavior: `const zoom = d3.zoom().scaleExtent([1, 10]).on('zoom', handleZoom)`
2. Apply to chart container: `selection.call(zoom)`
3. Store initial transform: `const initialTransform = d3.zoomIdentity`
4. Reset zoom: `selection.call(zoom.transform, initialTransform)`
5. Use `d3.event.transform` in zoom handler to update scales and redraw chart

**Alternatives Considered**:
- Custom zoom implementation: Rejected - too complex and error-prone
- Third-party zoom libraries: Rejected - violates D3.js exclusivity requirement
- Angular CDK Zoom: Rejected - not designed for D3 charts, would require custom integration

**References**:
- D3 Zoom Documentation: https://github.com/d3/d3-zoom
- D3 Zoom Examples: https://observablehq.com/@d3/zoomable-scatterplot

---

## Research Topic 2: Performance with Large Datasets (10,000+ points)

**Decision**: Implement data sampling and path simplification for large datasets, with optional canvas rendering for extreme cases.

**Rationale**:
- SVG rendering can become slow with 10,000+ points
- Data sampling reduces the number of points rendered while maintaining visual fidelity
- Path simplification (using Douglas-Peucker algorithm) reduces path complexity
- Canvas rendering provides better performance but loses some interactivity

**Implementation Approach**:
1. **Data Sampling**: For datasets > 1000 points, sample data based on visible range
   - Use `d3.bisector` to find visible data range
   - Sample every Nth point based on zoom level and screen width
   - Maintain min/max values for each sample range
2. **Path Simplification**: Use `d3.line().curve()` with appropriate curve type
   - For large datasets, use `d3.curveLinear` (straight lines) instead of `d3.curveMonotoneX`
   - Consider using `d3.line().defined()` to skip null values efficiently
3. **Canvas Rendering** (optional): For datasets > 10,000 points
   - Use HTML5 Canvas for rendering lines
   - Overlay SVG for interactive elements (tooltips, axes)
   - Switch to canvas when performance degrades

**Alternatives Considered**:
- Virtual scrolling: Rejected - not applicable to line charts (all data must be visible)
- Web Workers: Rejected - overhead of data transfer outweighs benefits for rendering
- Server-side rendering: Rejected - violates client-side rendering requirement

**References**:
- D3 Performance Tips: https://github.com/d3/d3-selection#performance
- Canvas vs SVG Performance: https://www.html5rocks.com/en/tutorials/canvas/hidpi/

---

## Research Topic 3: Time-Series Axis Formatting

**Decision**: Use `d3.scaleTime()` with `d3.axisBottom()` and `d3.timeFormat()` for time-series axes.

**Rationale**:
- `d3.scaleTime()` is specifically designed for time-series data
- `d3.timeFormat()` provides flexible date/time formatting
- `d3.axisBottom().tickFormat()` allows custom tick formatting
- D3 automatically chooses appropriate tick intervals based on scale domain

**Implementation Approach**:
1. Create time scale: `const xScale = d3.scaleTime().domain([minDate, maxDate]).range([0, width])`
2. Format ticks based on time range:
   - Short range (< 1 day): `d3.timeFormat('%H:%M')`
   - Medium range (1 day - 1 month): `d3.timeFormat('%m/%d')`
   - Long range (> 1 month): `d3.timeFormat('%Y-%m')`
3. Use `d3.axisBottom(xScale).tickFormat(formatFunction)`
4. Allow custom format via configuration: `axisOptions.x.tickFormat`

**Alternatives Considered**:
- Moment.js/date-fns: Rejected - adds unnecessary dependency, D3 time formatting is sufficient
- Custom date formatting: Rejected - D3's time formatting is well-tested and flexible
- Fixed format: Rejected - doesn't adapt to different time ranges

**References**:
- D3 Time Format: https://github.com/d3/d3-time-format
- D3 Time Scale: https://github.com/d3/d3-scale#time-scales

---

## Research Topic 4: Tooltip Positioning

**Decision**: Use `d3.pointer()` (D3 v7) or `d3.mouse()` (D3 v6) with boundary checking to position tooltips.

**Rationale**:
- `d3.pointer()` provides accurate mouse position relative to container
- Boundary checking prevents tooltip overflow
- Position tooltip relative to mouse cursor for better UX
- Handle zoom transform when calculating position

**Implementation Approach**:
1. Get mouse position: `const [x, y] = d3.pointer(event, container)`
2. Find nearest data point using `d3.bisector`
3. Calculate tooltip position:
   - Default: top-right of cursor
   - Adjust if near right edge: position left of cursor
   - Adjust if near top edge: position below cursor
4. Apply zoom transform offset if chart is zoomed
5. Use CSS positioning (absolute) for tooltip element

**Alternatives Considered**:
- Fixed tooltip position: Rejected - poor UX, doesn't follow cursor
- D3 tip library: Rejected - adds dependency, can implement custom solution
- Angular CDK Overlay: Rejected - overkill for simple tooltip, adds complexity

**References**:
- D3 Pointer: https://github.com/d3/d3-selection#pointer
- Tooltip Best Practices: https://www.nngroup.com/articles/tooltip-guidelines/

---

## Research Topic 5: ResizeObserver Integration

**Decision**: Use ResizeObserver API with RxJS Observable wrapper and proper cleanup.

**Rationale**:
- ResizeObserver is the modern standard for detecting element size changes
- More efficient than window resize listeners
- Works with container resizing, not just window resizing
- RxJS Observable wrapper provides reactive integration with Angular

**Implementation Approach**:
1. Create ResizeObserver in `ngOnInit`:
   ```typescript
   const resizeObserver = new ResizeObserver(entries => {
     for (const entry of entries) {
       const { width, height } = entry.contentRect;
       // Update chart dimensions
     }
   });
   resizeObserver.observe(this.chartContainer.nativeElement);
   ```
2. Store observer reference for cleanup
3. Disconnect in `ngOnDestroy`: `resizeObserver.disconnect()`
4. Debounce resize events (300ms) to prevent excessive redraws
5. Use RxJS `fromEvent` pattern if needed for reactive integration

**Alternatives Considered**:
- Window resize listener: Rejected - doesn't detect container-only resizing
- Angular CDK Layout: Rejected - adds dependency, ResizeObserver is sufficient
- Polling: Rejected - inefficient and resource-intensive

**References**:
- ResizeObserver API: https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver
- Angular ResizeObserver Pattern: https://angular.io/guide/observables

---

## Research Topic 6: Missing/Null Data Handling

**Decision**: Use `d3.line().defined()` to skip null/missing values, with visual indication of gaps.

**Rationale**:
- `d3.line().defined()` is the standard D3 approach for handling missing data
- Prevents drawing lines through missing data points
- Maintains data integrity while allowing visualization
- Can add visual indicators (dashed lines, gaps) for missing data

**Implementation Approach**:
1. Define accessor function:
   ```typescript
   const line = d3.line()
     .x(d => xScale(d.x))
     .y(d => yScale(d.y))
     .defined(d => d.y !== null && d.y !== undefined && !isNaN(d.y));
   ```
2. Filter data before rendering to remove invalid points
3. Optionally add visual gap indicators (dashed lines, markers) between valid segments
4. Handle edge cases: all null values, null at start/end, consecutive nulls

**Alternatives Considered**:
- Interpolation: Rejected - can mislead users about actual data values
- Zero values: Rejected - null is different from zero, should be preserved
- Skip entire series: Rejected - too aggressive, loses valid data

**References**:
- D3 Line Defined: https://github.com/d3/d3-shape#line_defined
- Missing Data Patterns: https://observablehq.com/@d3/line-chart-with-missing-data

---

## Research Topic 7: Zoom Reset State Management

**Decision**: Store initial zoom transform and chart dimensions, restore on reset.

**Rationale**:
- Simple and reliable approach
- Maintains original chart state
- Works with D3 zoom behavior's `transform` method
- No complex state tracking needed

**Implementation Approach**:
1. Store initial state in component:
   ```typescript
   private initialTransform = d3.zoomIdentity;
   private initialDimensions = { width: 0, height: 0 };
   ```
2. Initialize on first render: `this.initialTransform = d3.zoomIdentity`
3. Reset method:
   ```typescript
   resetZoom(): void {
     this.chartContainer.nativeElement
       .call(this.zoomBehavior.transform, this.initialTransform);
   }
   ```
4. Expose reset via `@Output()` event or public method
5. Optionally add reset button in chart UI

**Alternatives Considered**:
- State machine: Rejected - overkill for simple reset functionality
- History stack: Rejected - not required by spec, adds complexity
- Redraw from scratch: Rejected - less efficient, loses smooth transitions

**References**:
- D3 Zoom Transform: https://github.com/d3/d3-zoom#zoom-transforms
- D3 Zoom Identity: https://github.com/d3/d3-zoom#zoomIdentity

---

## Research Topic 8: Smooth Curves vs Straight Lines

**Decision**: Support both `d3.curveLinear` (straight) and `d3.curveMonotoneX` (smooth) via configuration.

**Rationale**:
- Different use cases require different curve types
- Smooth curves (`d3.curveMonotoneX`) provide better visual appeal for trends
- Straight lines (`d3.curveLinear`) are more accurate for discrete data
- D3 provides multiple curve types that can be configured

**Implementation Approach**:
1. Add `curveType` option to chart configuration: `'linear' | 'monotone' | 'basis' | 'cardinal'`
2. Map to D3 curve functions:
   ```typescript
   const curveMap = {
     linear: d3.curveLinear,
     monotone: d3.curveMonotoneX,
     basis: d3.curveBasis,
     cardinal: d3.curveCardinal
   };
   ```
3. Apply to line generator: `d3.line().curve(curveMap[config.curveType])`
4. Default to `'monotone'` for smooth appearance

**Alternatives Considered**:
- Only smooth curves: Rejected - doesn't meet FR-013 requirement
- Only straight lines: Rejected - poor UX for trend visualization
- Custom curve functions: Rejected - D3 curves are sufficient

**References**:
- D3 Curve Types: https://github.com/d3/d3-shape#curves
- Curve Comparison: https://observablehq.com/@d3/curve-explorer

---

## Summary

All research topics have been addressed with concrete implementation decisions. The chosen approaches align with D3.js best practices, Angular patterns, and the project constitution. No blocking issues were identified, and all alternatives were evaluated against project requirements.

**Key Technologies Confirmed**:
- D3.js v7.8.5: `d3.zoom`, `d3.scaleTime`, `d3.line`, `d3.axis`, `d3.pointer`
- ResizeObserver API: For responsive chart resizing
- RxJS: For reactive resize event handling
- TypeScript: For type-safe D3 integration

**Next Steps**: Proceed to Phase 1 (Design & Contracts) with confidence that all technical concerns have been resolved.

