# Research: Chart Service Implementation

**Feature**: 003-chart-service  
**Date**: 2025-01-27  
**Purpose**: Resolve technical decisions and document implementation patterns

## Research Areas

### 1. Chart Factory Pattern

**Decision**: Use factory pattern with type-safe chart creation methods

**Rationale**:
- Factory pattern provides centralized chart creation logic
- Type-safe methods ensure compile-time validation
- Enables programmatic chart instantiation as required by FR-001
- Supports all 10 chart types with consistent interface
- Aligns with performance goals (SC-001: < 100ms)

**Implementation Pattern**:
```typescript
type ChartType = 'line' | 'bar' | 'pie' | 'scatter' | 'area' | 'heatmap' | 'treemap' | 'force-graph' | 'geo-map' | 'gauge';

interface ChartConfig {
  type: ChartType;
  data?: any[];
  options?: IChartOptions;
  [key: string]: any;
}

class ChartService {
  createChart(config: ChartConfig): IChartInstance {
    if (!this.isValidChartType(config.type)) {
      throw new Error(`Invalid chart type: ${config.type}`);
    }
    
    // Validate configuration
    this.validateChartConfig(config);
    
    // Create appropriate chart instance based on type
    return this.chartFactories[config.type](config);
  }
  
  private chartFactories: Record<ChartType, (config: ChartConfig) => IChartInstance> = {
    'line': (config) => this.createLineChart(config),
    'bar': (config) => this.createBarChart(config),
    // ... other chart types
  };
}
```

**Alternatives Considered**:
- **Class-based inheritance**: More complex, factory pattern is simpler for this use case
- **Builder pattern**: Overkill for chart creation, factory is sufficient
- **Direct instantiation**: Less flexible, doesn't provide centralized validation

### 2. D3 Scale Creation Pattern

**Decision**: Use D3 scale factories with configuration objects and tree-shakeable imports

**Rationale**:
- D3 provides multiple scale types (linear, time, ordinal, band, etc.)
- Configuration objects enable flexible scale creation
- Tree-shakeable imports minimize bundle size (constitution requirement)
- Supports all scale types as required by SC-008
- Aligns with performance goals (SC-002: < 50ms)

**Implementation Pattern**:
```typescript
import { scaleLinear, scaleTime, scaleOrdinal, scaleBand, ScaleLinear, ScaleTime, ScaleOrdinal, ScaleBand } from 'd3-scale';

type ScaleType = 'linear' | 'time' | 'ordinal' | 'band' | 'log' | 'pow' | 'sqrt';

interface ScaleConfig {
  type: ScaleType;
  domain: [number, number] | string[] | Date[];
  range: [number, number] | string[];
  nice?: boolean;
  padding?: number; // For band scales
  [key: string]: any;
}

function createScale<T extends ScaleType>(
  config: ScaleConfig
): ScaleLinear<number, number> | ScaleTime<Date, number> | ScaleOrdinal<string, number> | ScaleBand<string> {
  switch (config.type) {
    case 'linear':
      return scaleLinear()
        .domain(config.domain as [number, number])
        .range(config.range as [number, number])
        .nice(config.nice ?? false) as ScaleLinear<number, number>;
    
    case 'time':
      return scaleTime()
        .domain(config.domain as Date[])
        .range(config.range as [number, number]) as ScaleTime<Date, number>;
    
    case 'ordinal':
      return scaleOrdinal<string, number>()
        .domain(config.domain as string[])
        .range(config.range as number[]) as ScaleOrdinal<string, number>;
    
    case 'band':
      return scaleBand<string>()
        .domain(config.domain as string[])
        .range(config.range as [number, number])
        .padding(config.padding ?? 0) as ScaleBand<string>;
    
    default:
      throw new Error(`Unsupported scale type: ${config.type}`);
  }
}
```

**Alternatives Considered**:
- **Single scale function**: Less type-safe, harder to maintain
- **Class-based scales**: D3 scales are functional, class wrapper unnecessary
- **Third-party scale libraries**: D3 provides all needed functionality

### 3. D3 Axis Creation Pattern

**Decision**: Use D3 axis generators with scale and orientation configuration

**Rationale**:
- D3 provides axis generators (axisBottom, axisTop, axisLeft, axisRight)
- Orientation determines axis placement
- Scales are passed to axis generators
- Supports all orientations as required by FR-004
- Aligns with performance goals (SC-003: < 50ms)

**Implementation Pattern**:
```typescript
import { axisBottom, axisTop, axisLeft, axisRight, Axis, AxisScale } from 'd3-axis';

type AxisOrientation = 'bottom' | 'top' | 'left' | 'right';

interface AxisConfig {
  scale: AxisScale<any>;
  orientation: AxisOrientation;
  ticks?: number;
  tickFormat?: (d: any) => string;
  tickSize?: number;
  tickSizeInner?: number;
  tickSizeOuter?: number;
}

function createAxis(config: AxisConfig): Axis<AxisScale<any>> {
  let axis: Axis<AxisScale<any>>;
  
  switch (config.orientation) {
    case 'bottom':
      axis = axisBottom(config.scale);
      break;
    case 'top':
      axis = axisTop(config.scale);
      break;
    case 'left':
      axis = axisLeft(config.scale);
      break;
    case 'right':
      axis = axisRight(config.scale);
      break;
    default:
      throw new Error(`Invalid axis orientation: ${config.orientation}`);
  }
  
  // Apply optional configurations
  if (config.ticks !== undefined) {
    axis.ticks(config.ticks);
  }
  if (config.tickFormat) {
    axis.tickFormat(config.tickFormat);
  }
  if (config.tickSize !== undefined) {
    axis.tickSize(config.tickSize);
  }
  if (config.tickSizeInner !== undefined) {
    axis.tickSizeInner(config.tickSizeInner);
  }
  if (config.tickSizeOuter !== undefined) {
    axis.tickSizeOuter(config.tickSizeOuter);
  }
  
  return axis;
}
```

**Alternatives Considered**:
- **Single axis function**: Less flexible, orientation-specific functions are clearer
- **Class-based axes**: D3 axes are functional, class wrapper unnecessary
- **Manual axis creation**: More boilerplate, D3 generators are standard

### 4. Color Palette Management

**Decision**: Use in-memory registry with named palettes and default palette support

**Rationale**:
- In-memory registry is sufficient for client-side application
- Named palettes enable easy switching (FR-006)
- Default palette provides fallback (FR-012)
- Custom palettes supported (FR-011)
- At least 10 distinct colors per palette (SC-007)
- Fast retrieval (SC-004: < 10ms)

**Implementation Pattern**:
```typescript
interface ColorPalette {
  name: string;
  colors: string[];
  description?: string;
}

class ColorPaletteManager {
  private palettes = new Map<string, ColorPalette>();
  private defaultPaletteName = 'default';
  
  constructor() {
    // Register default palettes
    this.registerDefaultPalettes();
  }
  
  getColorPalette(name: string): ColorPalette | null {
    return this.palettes.get(name) ?? null;
  }
  
  setColorPalette(palette: ColorPalette): void {
    if (palette.colors.length < 10) {
      throw new Error('Color palette must have at least 10 colors');
    }
    this.palettes.set(palette.name, palette);
  }
  
  setDefaultPalette(name: string): void {
    if (!this.palettes.has(name)) {
      throw new Error(`Palette not found: ${name}`);
    }
    this.defaultPaletteName = name;
  }
  
  getColors(count: number, paletteName?: string): string[] {
    const palette = paletteName 
      ? this.getColorPalette(paletteName)
      : this.getColorPalette(this.defaultPaletteName);
    
    if (!palette) {
      throw new Error(`Palette not found: ${paletteName ?? this.defaultPaletteName}`);
    }
    
    // Return requested number of colors, cycling if needed
    const colors: string[] = [];
    for (let i = 0; i < count; i++) {
      colors.push(palette.colors[i % palette.colors.length]);
    }
    return colors;
  }
  
  private registerDefaultPalettes(): void {
    // D3 categorical color schemes
    this.setColorPalette({
      name: 'default',
      colors: [
        '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd',
        '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
      ]
    });
    
    // Additional palettes can be registered here
  }
}
```

**Alternatives Considered**:
- **CSS variables**: Less flexible, harder to programmatically access
- **External palette files**: Adds complexity, in-memory is sufficient
- **D3 color schemes only**: Less flexible, custom palettes needed (FR-011)

### 5. D3 Utility Functions Organization

**Decision**: Organize D3 utilities by functionality (margins, dimensions, data processing)

**Rationale**:
- Functional organization improves maintainability
- Reusable utilities reduce code duplication (FR-002)
- Framework-agnostic where possible (constitution requirement)
- Tree-shakeable imports minimize bundle size

**Implementation Pattern**:
```typescript
interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface Dimensions {
  width: number;
  height: number;
  margins: Margins;
}

function calculateMargins(
  width: number,
  height: number,
  marginConfig?: Partial<Margins>
): Margins {
  const defaultMargins: Margins = {
    top: 20,
    right: 20,
    bottom: 40,
    left: 40
  };
  
  return {
    ...defaultMargins,
    ...marginConfig
  };
}

function calculateInnerDimensions(dimensions: Dimensions): { width: number; height: number } {
  return {
    width: dimensions.width - dimensions.margins.left - dimensions.margins.right,
    height: dimensions.height - dimensions.margins.top - dimensions.margins.bottom
  };
}

function extent<T>(data: T[], accessor: (d: T) => number): [number, number] {
  if (data.length === 0) {
    return [0, 0];
  }
  
  let min = accessor(data[0]);
  let max = accessor(data[0]);
  
  for (const d of data) {
    const value = accessor(d);
    if (value < min) min = value;
    if (value > max) max = value;
  }
  
  return [min, max];
}
```

**Alternatives Considered**:
- **Single utility file**: Too large, harder to maintain
- **Class-based utilities**: Functional approach is simpler and more composable
- **D3-only utilities**: Some utilities (like margin calculation) are chart-specific

### 6. Scale Update Pattern

**Decision**: Use immutable scale updates by creating new scales with updated configuration

**Rationale**:
- D3 scales are mutable but immutable updates are safer
- Prevents side effects from scale modifications
- Aligns with functional programming principles
- Supports FR-007: scale update helpers

**Implementation Pattern**:
```typescript
function updateScale<T extends ScaleType>(
  existingScale: ScaleLinear<number, number> | ScaleTime<Date, number> | ScaleOrdinal<string, number> | ScaleBand<string>,
  updates: Partial<ScaleConfig>
): ScaleLinear<number, number> | ScaleTime<Date, number> | ScaleOrdinal<string, number> | ScaleBand<string> {
  // Create new scale with updated configuration
  const config: ScaleConfig = {
    type: updates.type ?? (existingScale as any).type,
    domain: updates.domain ?? existingScale.domain(),
    range: updates.range ?? existingScale.range(),
    ...updates
  };
  
  return createScale(config);
}
```

**Alternatives Considered**:
- **Mutating existing scales**: Can cause side effects, less safe
- **Scale cloning**: More complex, creating new scale is simpler
- **Update methods on scales**: D3 scales don't have built-in update methods

### 7. Error Handling Pattern

**Decision**: Use typed error classes with clear error messages

**Rationale**:
- Typed errors improve error handling
- Clear error messages improve developer experience
- Aligns with FR-010: graceful error handling
- Meets SC-009: clear error messages within 50ms

**Implementation Pattern**:
```typescript
class ChartServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'ChartServiceError';
  }
}

class InvalidChartTypeError extends ChartServiceError {
  constructor(chartType: string) {
    super(
      `Invalid chart type: ${chartType}. Supported types: line, bar, pie, scatter, area, heatmap, treemap, force-graph, geo-map, gauge`,
      'INVALID_CHART_TYPE'
    );
  }
}

class InvalidScaleConfigError extends ChartServiceError {
  constructor(message: string) {
    super(`Invalid scale configuration: ${message}`, 'INVALID_SCALE_CONFIG');
  }
}

class PaletteNotFoundError extends ChartServiceError {
  constructor(paletteName: string) {
    super(`Color palette not found: ${paletteName}`, 'PALETTE_NOT_FOUND');
  }
}
```

**Alternatives Considered**:
- **Generic Error class**: Less type-safe, harder to handle specific errors
- **Error codes only**: Less descriptive, messages improve DX
- **Third-party error libraries**: Unnecessary, custom errors are sufficient

### 8. Concurrent Chart Creation Handling

**Decision**: Use synchronous factory methods with validation caching

**Rationale**:
- Chart creation is synchronous (no async operations)
- Validation can be cached to improve performance
- Meets SC-006: handle 100 concurrent creations without degradation
- Factory methods are fast enough (< 100ms) to be synchronous

**Implementation Pattern**:
```typescript
class ChartService {
  private validationCache = new Map<string, boolean>();
  
  createChart(config: ChartConfig): IChartInstance {
    // Fast validation with caching
    const cacheKey = JSON.stringify(config);
    if (!this.validationCache.has(cacheKey)) {
      this.validateChartConfig(config);
      this.validationCache.set(cacheKey, true);
    }
    
    // Create chart instance
    return this.chartFactories[config.type](config);
  }
  
  private validateChartConfig(config: ChartConfig): void {
    if (!config.type) {
      throw new InvalidChartTypeError('');
    }
    // Additional validation...
  }
}
```

**Alternatives Considered**:
- **Async factory methods**: Unnecessary, chart creation is synchronous
- **Queue-based creation**: Overkill, synchronous is fast enough
- **Worker threads**: Overkill for chart creation, browser handles it fine

## Summary

All technical decisions have been made based on:
- D3.js v7.8.5 best practices and patterns
- Project constitution requirements (D3 exclusivity, type safety, performance)
- Performance and success criteria from the spec
- Simplicity and maintainability
- Framework-agnostic approach where possible

No areas require further clarification. Implementation can proceed with confidence.

