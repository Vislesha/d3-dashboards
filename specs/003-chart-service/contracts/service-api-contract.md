# Chart Service API Contract

**Feature**: 003-chart-service  
**Date**: 2025-01-27  
**Type**: TypeScript Service Interface

## Service: ChartService

### Class Definition

```typescript
@Injectable({ providedIn: 'root' })
export class ChartService {
  // Public methods defined below
}
```

### Methods

#### 1. createChart(config: IChartConfig): IChartInstance

**Description**: Creates a chart instance using factory methods based on chart type and configuration.

**Parameters**:
- `config: IChartConfig` (required)
  - Chart configuration object with type, data, and options
  - Must pass validation (see validateChartConfig)

**Returns**: `IChartInstance`
- Chart instance with render, update, destroy, and getConfig methods
- Instance is ready to be rendered to DOM

**Behavior**:
- Validates chart configuration before creation
- Creates appropriate chart instance based on type
- Returns chart instance with lifecycle methods
- Throws error if chart type is invalid or configuration is invalid

**Error Handling**:
- Throws `InvalidChartTypeError` if chart type is invalid
- Throws `InvalidChartConfigError` if configuration is invalid

**Performance**:
- Chart factory methods complete within 100ms (SC-001)
- 100% of valid chart configurations create chart instances successfully (SC-005)

**Example**:
```typescript
const config: IChartConfig = {
  type: 'line',
  data: [{ x: 1, y: 10 }, { x: 2, y: 20 }],
  options: {
    width: 800,
    height: 400,
    margin: { top: 20, right: 20, bottom: 40, left: 40 }
  }
};

const chart = this.chartService.createChart(config);
chart.render(document.getElementById('chart-container')!);
```

---

#### 2. createScale(config: IScaleConfig): ScaleLinear<number, number> | ScaleTime<Date, number> | ScaleOrdinal<string, number> | ScaleBand<string>

**Description**: Creates a D3 scale based on configuration (type, domain, range).

**Parameters**:
- `config: IScaleConfig` (required)
  - Scale configuration with type, domain, range, and optional settings
  - Must pass validation (see validateScaleConfig)

**Returns**: D3 Scale object
- Type depends on scale type: ScaleLinear, ScaleTime, ScaleOrdinal, or ScaleBand
- Scale is configured and ready to use

**Behavior**:
- Validates scale configuration before creation
- Creates appropriate D3 scale based on type
- Applies domain and range
- Applies optional settings (nice, padding, etc.)
- Returns configured scale

**Error Handling**:
- Throws `InvalidScaleConfigError` if configuration is invalid

**Performance**:
- Scale creation completes within 50ms (SC-002)
- Scale and axis helpers work correctly for all supported scale types (SC-008)

**Example**:
```typescript
const scaleConfig: IScaleConfig = {
  type: 'linear',
  domain: [0, 100],
  range: [0, 800],
  nice: true
};

const scale = this.chartService.createScale(scaleConfig);
const value = scale(50); // Returns 400
```

---

#### 3. createAxis(config: IAxisConfig): Axis<AxisScale<any>>

**Description**: Creates a D3 axis based on scale and orientation configuration.

**Parameters**:
- `config: IAxisConfig` (required)
  - Axis configuration with scale, orientation, and optional tick settings
  - Must pass validation (see validateAxisConfig)

**Returns**: `Axis<AxisScale<any>>`
- D3 Axis object configured with scale and orientation
- Axis is ready to be rendered to SVG

**Behavior**:
- Validates axis configuration before creation
- Creates appropriate D3 axis based on orientation
- Applies scale to axis
- Applies optional tick settings (ticks, tickFormat, tickSize, etc.)
- Returns configured axis

**Error Handling**:
- Throws `InvalidAxisConfigError` if configuration is invalid

**Performance**:
- Axis creation completes within 50ms (SC-003)
- Scale and axis helpers work correctly for all supported scale types (SC-008)

**Example**:
```typescript
const scale = this.chartService.createScale({
  type: 'linear',
  domain: [0, 100],
  range: [0, 800]
});

const axisConfig: IAxisConfig = {
  scale: scale,
  orientation: 'bottom',
  ticks: 10,
  tickFormat: (d) => `${d}%`
};

const axis = this.chartService.createAxis(axisConfig);
// Use axis in SVG: axis(svg.select('.x-axis'));
```

---

#### 4. updateScale(existingScale: D3Scale, updates: Partial<IScaleConfig>): D3Scale

**Description**: Updates an existing D3 scale with new configuration by creating a new scale.

**Parameters**:
- `existingScale: D3Scale` (required)
  - Existing D3 scale object to update
- `updates: Partial<IScaleConfig>` (required)
  - Partial scale configuration with properties to update

**Returns**: D3 Scale object
- New scale object with updated configuration
- Original scale is not modified (immutable update)

**Behavior**:
- Creates new scale with updated configuration
- Preserves existing configuration for properties not in updates
- Validates updated configuration
- Returns new scale instance

**Error Handling**:
- Throws `InvalidScaleConfigError` if updated configuration is invalid

**Performance**:
- Scale update completes within 50ms (SC-002)

**Example**:
```typescript
const scale = this.chartService.createScale({
  type: 'linear',
  domain: [0, 100],
  range: [0, 800]
});

const updatedScale = this.chartService.updateScale(scale, {
  domain: [0, 200] // Update domain only
});
```

---

#### 5. updateAxis(existingAxis: Axis<AxisScale<any>>, updates: Partial<IAxisConfig>): Axis<AxisScale<any>>

**Description**: Updates an existing D3 axis with new configuration.

**Parameters**:
- `existingAxis: Axis<AxisScale<any>>` (required)
  - Existing D3 axis object to update
- `updates: Partial<IAxisConfig>` (required)
  - Partial axis configuration with properties to update

**Returns**: `Axis<AxisScale<any>>`
- Updated axis object with new configuration
- Original axis may be modified (D3 axes are mutable)

**Behavior**:
- Updates axis with new configuration
- Preserves existing configuration for properties not in updates
- Validates updated configuration
- Returns updated axis instance

**Error Handling**:
- Throws `InvalidAxisConfigError` if updated configuration is invalid

**Performance**:
- Axis update completes within 50ms (SC-003)

**Example**:
```typescript
const axis = this.chartService.createAxis({
  scale: scale,
  orientation: 'bottom',
  ticks: 10
});

const updatedAxis = this.chartService.updateAxis(axis, {
  ticks: 20 // Update tick count only
});
```

---

#### 6. getColorPalette(name: string): IColorPalette | null

**Description**: Retrieves a color palette by name from the registry.

**Parameters**:
- `name: string` (required)
  - Name of the color palette to retrieve

**Returns**: `IColorPalette | null`
- Color palette object if found, null if not found

**Behavior**:
- Looks up palette in registry by name
- Returns palette if found
- Returns null if palette not found

**Performance**:
- Color palette retrieval completes within 10ms (SC-004)

**Example**:
```typescript
const palette = this.chartService.getColorPalette('default');
if (palette) {
  console.log('Palette colors:', palette.colors);
}
```

---

#### 7. setColorPalette(palette: IColorPalette): void

**Description**: Registers a color palette in the registry. If palette already exists, updates it.

**Parameters**:
- `palette: IColorPalette` (required)
  - Color palette object with name and colors array
  - Must have at least 10 colors (SC-007)

**Returns**: `void`

**Behavior**:
- Validates palette (name, colors array with min 10 colors)
- Registers palette in registry
- Updates existing palette if name already exists
- Throws error if validation fails

**Error Handling**:
- Throws `InvalidColorPaletteError` if palette is invalid
- Throws error if colors array has fewer than 10 colors

**Example**:
```typescript
const customPalette: IColorPalette = {
  name: 'custom',
  colors: [
    '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff',
    '#00ffff', '#ff8800', '#88ff00', '#0088ff', '#ff0088'
  ]
};

this.chartService.setColorPalette(customPalette);
```

---

#### 8. setDefaultPalette(name: string): void

**Description**: Sets the default color palette by name.

**Parameters**:
- `name: string` (required)
  - Name of the palette to set as default
  - Palette must exist in registry

**Returns**: `void`

**Behavior**:
- Validates palette exists in registry
- Sets palette as default
- Throws error if palette not found

**Error Handling**:
- Throws `PaletteNotFoundError` if palette not found

**Example**:
```typescript
this.chartService.setDefaultPalette('custom');
```

---

#### 9. getColors(count: number, paletteName?: string): string[]

**Description**: Retrieves the requested number of colors from a palette, cycling if needed.

**Parameters**:
- `count: number` (required)
  - Number of colors to retrieve
  - Must be positive integer
- `paletteName?: string` (optional)
  - Name of palette to use. If not provided, uses default palette.

**Returns**: `string[]`
- Array of color strings (length = count)
- Colors are cycled if count exceeds palette size

**Behavior**:
- Retrieves palette (default if name not provided)
- Returns requested number of colors
- Cycles through palette if count > palette.length
- Throws error if palette not found

**Error Handling**:
- Throws `PaletteNotFoundError` if palette not found

**Performance**:
- Color palette retrieval completes within 10ms (SC-004)

**Example**:
```typescript
// Get 5 colors from default palette
const colors = this.chartService.getColors(5);

// Get 15 colors from specific palette (will cycle)
const colors = this.chartService.getColors(15, 'custom');
```

---

#### 10. calculateMargins(width: number, height: number, marginConfig?: Partial<IMargins>): IMargins

**Description**: Calculates chart margins with optional custom configuration.

**Parameters**:
- `width: number` (required)
  - Chart width in pixels
- `height: number` (required)
  - Chart height in pixels
- `marginConfig?: Partial<IMargins>` (optional)
  - Partial margin configuration to override defaults

**Returns**: `IMargins`
- Complete margins object with top, right, bottom, left values

**Behavior**:
- Uses default margins if marginConfig not provided
- Merges custom margins with defaults
- Returns complete margins object

**Example**:
```typescript
const margins = this.chartService.calculateMargins(800, 400, {
  top: 30,
  left: 50
});
// Returns: { top: 30, right: 20, bottom: 40, left: 50 }
```

---

#### 11. validateChartConfig(config: IChartConfig): IValidationResult

**Description**: Validates a chart configuration before creation.

**Parameters**:
- `config: IChartConfig` (required)
  - Chart configuration to validate

**Returns**: `IValidationResult`
```typescript
interface IValidationResult {
  valid: boolean;
  errors: string[];
}
```

**Behavior**:
- Validates chart type is supported
- Validates data is array if provided
- Validates options object if provided
- Returns validation result with errors array

**Performance**:
- Validation completes within 10ms

**Example**:
```typescript
const result = this.chartService.validateChartConfig(config);
if (!result.valid) {
  console.error('Validation errors:', result.errors);
}
```

---

#### 12. validateScaleConfig(config: IScaleConfig): IValidationResult

**Description**: Validates a scale configuration before creation.

**Parameters**:
- `config: IScaleConfig` (required)
  - Scale configuration to validate

**Returns**: `IValidationResult`
- Validation result with errors array

**Behavior**:
- Validates scale type is supported
- Validates domain matches scale type
- Validates range matches scale type
- Validates padding for band scales (0-1)
- Returns validation result

**Example**:
```typescript
const result = this.chartService.validateScaleConfig(scaleConfig);
if (!result.valid) {
  console.error('Validation errors:', result.errors);
}
```

---

#### 13. validateAxisConfig(config: IAxisConfig): IValidationResult

**Description**: Validates an axis configuration before creation.

**Parameters**:
- `config: IAxisConfig` (required)
  - Axis configuration to validate

**Returns**: `IValidationResult`
- Validation result with errors array

**Behavior**:
- Validates scale is a valid D3 scale object
- Validates orientation is supported
- Validates ticks is positive integer if provided
- Validates tickFormat is function if provided
- Returns validation result

**Example**:
```typescript
const result = this.chartService.validateAxisConfig(axisConfig);
if (!result.valid) {
  console.error('Validation errors:', result.errors);
}
```

---

## Interfaces

### IChartConfig

```typescript
interface IChartConfig {
  type: ChartType;
  data?: any[];
  options?: IChartOptions;
  [key: string]: any;
}

type ChartType = 'line' | 'bar' | 'pie' | 'scatter' | 'area' | 'heatmap' | 'treemap' | 'force-graph' | 'geo-map' | 'gauge';
```

### IScaleConfig

```typescript
interface IScaleConfig {
  type: ScaleType;
  domain: [number, number] | string[] | Date[];
  range: [number, number] | string[];
  nice?: boolean;
  padding?: number; // For band scales
  [key: string]: any;
}

type ScaleType = 'linear' | 'time' | 'ordinal' | 'band' | 'log' | 'pow' | 'sqrt';
```

### IAxisConfig

```typescript
interface IAxisConfig {
  scale: AxisScale<any>;
  orientation: AxisOrientation;
  ticks?: number;
  tickFormat?: (d: any) => string;
  tickSize?: number;
  tickSizeInner?: number;
  tickSizeOuter?: number;
}

type AxisOrientation = 'bottom' | 'top' | 'left' | 'right';
```

### IColorPalette

```typescript
interface IColorPalette {
  name: string;
  colors: string[]; // Minimum 10 colors
  description?: string;
}
```

### IMargins

```typescript
interface IMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}
```

### IChartInstance

```typescript
interface IChartInstance {
  type: ChartType;
  render: (container: HTMLElement) => void;
  update: (data: any[]) => void;
  destroy: () => void;
  getConfig: () => IChartConfig;
}
```

### IValidationResult

```typescript
interface IValidationResult {
  valid: boolean;
  errors: string[];
}
```

## Functional Requirements Mapping

| FR | Requirement | Implementation |
|----|-------------|----------------|
| FR-001 | Chart factory methods for all chart types | `createChart()` method |
| FR-002 | D3 utility functions | `calculateMargins()` and utility functions |
| FR-003 | Scale creation helpers | `createScale()` method |
| FR-004 | Axis creation helpers | `createAxis()` method |
| FR-005 | Color palette management | `getColorPalette()`, `setColorPalette()`, `getColors()` |
| FR-006 | Support multiple color palettes | Color palette registry |
| FR-007 | Scale update helpers | `updateScale()` method |
| FR-008 | Axis update helpers | `updateAxis()` method |
| FR-009 | Validate chart configurations | `validateChartConfig()` method |
| FR-010 | Handle errors gracefully | Error classes and error handling |
| FR-011 | Support custom color palettes | `setColorPalette()` method |
| FR-012 | Provide default color palettes | Default palette registration |

## Success Criteria Mapping

| SC | Criterion | Measurement |
|----|-----------|-------------|
| SC-001 | Chart factory methods < 100ms | Measured in `createChart()` |
| SC-002 | Scale creation < 50ms | Measured in `createScale()` |
| SC-003 | Axis creation < 50ms | Measured in `createAxis()` |
| SC-004 | Color palette retrieval < 10ms | Measured in `getColorPalette()` and `getColors()` |
| SC-005 | 100% valid configs create charts | Validation in `createChart()` |
| SC-006 | Handle 100 concurrent creations | Service handles concurrent calls |
| SC-007 | Palettes have 10+ colors | Validation in `setColorPalette()` |
| SC-008 | Scale/axis helpers for all types | Support for all scale types |
| SC-009 | Error messages < 50ms | Error handling in all methods |
| SC-010 | Prevent memory leaks | Proper cleanup in `destroy()` methods |

