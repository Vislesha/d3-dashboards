# Data Model: Chart Service

**Feature**: 003-chart-service  
**Date**: 2025-01-27

## Entities

### 1. ChartConfig

**Purpose**: Configuration object for creating chart instances through factory methods.

**Interface**: `IChartConfig`

**Fields**:
- `type: ChartType` (required)
  - **Description**: Type of chart to create
  - **Validation**: Must be one of: 'line', 'bar', 'pie', 'scatter', 'area', 'heatmap', 'treemap', 'force-graph', 'geo-map', 'gauge'
  - **Default**: None (required field)

- `data?: any[]` (optional)
  - **Description**: Data array for the chart
  - **Validation**: Array when provided
  - **Format**: Array of data points (structure depends on chart type)

- `options?: IChartOptions` (optional)
  - **Description**: Chart-specific options (dimensions, margins, colors, axes, etc.)
  - **Validation**: Valid IChartOptions object
  - **Default**: Default chart options

- `[key: string]: any` (optional)
  - **Description**: Additional chart-specific configuration
  - **Validation**: Any additional properties
  - **Format**: Key-value pairs

**Relationships**:
- Used by: ChartService.createChart()
- Validated by: ChartService.validateChartConfig()
- Creates: IChartInstance

**State Transitions**:
- **Initial**: Configuration object created
- **Validated**: Passes ChartService validation
- **Active**: Used in chart creation
- **Error**: Validation fails or creation fails

**Validation Rules**:
1. `type` must be a valid ChartType
2. If `data` is provided, it must be an array
3. If `options` is provided, it must be a valid IChartOptions object
4. Chart-specific validation rules apply based on `type`

### 2. ChartType

**Purpose**: Type definition for supported chart types.

**Type**: `'line' | 'bar' | 'pie' | 'scatter' | 'area' | 'heatmap' | 'treemap' | 'force-graph' | 'geo-map' | 'gauge'`

**Validation**: Must be one of the 10 supported chart types

**Relationships**:
- Used by: ChartConfig.type
- Validated by: ChartService.isValidChartType()

### 3. IChartInstance

**Purpose**: Interface for chart instances created by factory methods.

**Interface**: `IChartInstance`

**Fields**:
- `type: ChartType` (required)
  - **Description**: Type of chart instance
  - **Validation**: Valid ChartType

- `render: (container: HTMLElement) => void` (required)
  - **Description**: Method to render chart to DOM container
  - **Validation**: Function that accepts HTMLElement

- `update: (data: any[]) => void` (required)
  - **Description**: Method to update chart with new data
  - **Validation**: Function that accepts data array

- `destroy: () => void` (required)
  - **Description**: Method to clean up chart resources
  - **Validation**: Function with no parameters

- `getConfig: () => IChartConfig` (required)
  - **Description**: Method to get current chart configuration
  - **Validation**: Function that returns IChartConfig

**Relationships**:
- Created by: ChartService.createChart()
- Used by: Chart components, Dashboard services

**State Transitions**:
- **Created**: Chart instance created by factory
- **Rendered**: render() called, chart displayed in DOM
- **Updated**: update() called with new data
- **Destroyed**: destroy() called, resources cleaned up

**Validation Rules**:
1. All methods must be callable functions
2. render() must accept HTMLElement parameter
3. update() must accept data array parameter
4. destroy() must clean up all D3 selections and event listeners

### 4. ScaleConfig

**Purpose**: Configuration object for creating D3 scales.

**Interface**: `IScaleConfig`

**Fields**:
- `type: ScaleType` (required)
  - **Description**: Type of D3 scale to create
  - **Validation**: Must be one of: 'linear', 'time', 'ordinal', 'band', 'log', 'pow', 'sqrt'
  - **Default**: None (required field)

- `domain: [number, number] | string[] | Date[]` (required)
  - **Description**: Input domain for the scale
  - **Validation**: Array of 2 numbers for linear/time scales, array of strings for ordinal/band scales
  - **Format**: Depends on scale type

- `range: [number, number] | string[]` (required)
  - **Description**: Output range for the scale
  - **Validation**: Array of 2 numbers for continuous scales, array of values for ordinal/band scales
  - **Format**: Depends on scale type

- `nice?: boolean` (optional)
  - **Description**: Whether to extend domain to nice round values (for continuous scales)
  - **Validation**: Boolean value
  - **Default**: `false`

- `padding?: number` (optional, for band scales)
  - **Description**: Padding between bands (0-1)
  - **Validation**: Number between 0 and 1
  - **Default**: `0`

- `[key: string]: any` (optional)
  - **Description**: Additional scale-specific configuration
  - **Validation**: Any additional properties

**Relationships**:
- Used by: ChartService.createScale(), ScaleHelpers.createScale()
- Validated by: ChartService.validateScaleConfig()
- Creates: D3 Scale object

**State Transitions**:
- **Initial**: Configuration object created
- **Validated**: Passes validation
- **Active**: Used in scale creation
- **Error**: Validation fails or creation fails

**Validation Rules**:
1. `type` must be a valid ScaleType
2. `domain` must match scale type requirements
3. `range` must match scale type requirements
4. For band scales, `padding` must be between 0 and 1
5. Domain and range arrays must have appropriate lengths

### 5. ScaleType

**Purpose**: Type definition for supported D3 scale types.

**Type**: `'linear' | 'time' | 'ordinal' | 'band' | 'log' | 'pow' | 'sqrt'`

**Validation**: Must be one of the supported scale types

**Relationships**:
- Used by: ScaleConfig.type
- Validated by: ChartService.isValidScaleType()

### 6. AxisConfig

**Purpose**: Configuration object for creating D3 axes.

**Interface**: `IAxisConfig`

**Fields**:
- `scale: AxisScale<any>` (required)
  - **Description**: D3 scale to use for the axis
  - **Validation**: Valid D3 scale object
  - **Type**: D3 AxisScale

- `orientation: AxisOrientation` (required)
  - **Description**: Orientation of the axis
  - **Validation**: Must be one of: 'bottom', 'top', 'left', 'right'
  - **Default**: None (required field)

- `ticks?: number` (optional)
  - **Description**: Number of ticks to display
  - **Validation**: Positive integer
  - **Default**: Automatic (D3 default)

- `tickFormat?: (d: any) => string` (optional)
  - **Description**: Function to format tick labels
  - **Validation**: Function that accepts value and returns string
  - **Default**: D3 default formatter

- `tickSize?: number` (optional)
  - **Description**: Size of ticks
  - **Validation**: Number
  - **Default**: `6`

- `tickSizeInner?: number` (optional)
  - **Description**: Inner tick size
  - **Validation**: Number
  - **Default**: `6`

- `tickSizeOuter?: number` (optional)
  - **Description**: Outer tick size
  - **Validation**: Number
  - **Default**: `6`

**Relationships**:
- Used by: ChartService.createAxis(), AxisHelpers.createAxis()
- Validated by: ChartService.validateAxisConfig()
- Creates: D3 Axis object

**State Transitions**:
- **Initial**: Configuration object created
- **Validated**: Passes validation
- **Active**: Used in axis creation
- **Error**: Validation fails or creation fails

**Validation Rules**:
1. `scale` must be a valid D3 scale object
2. `orientation` must be a valid AxisOrientation
3. `ticks` must be positive integer if provided
4. `tickFormat` must be a function if provided
5. Scale and orientation must be compatible

### 7. AxisOrientation

**Purpose**: Type definition for axis orientations.

**Type**: `'bottom' | 'top' | 'left' | 'right'`

**Validation**: Must be one of the four orientations

**Relationships**:
- Used by: AxisConfig.orientation
- Validated by: ChartService.isValidAxisOrientation()

### 8. ColorPalette

**Purpose**: Collection of colors used for chart series and categories.

**Interface**: `IColorPalette`

**Fields**:
- `name: string` (required)
  - **Description**: Unique name identifier for the palette
  - **Validation**: Non-empty string, unique within registry
  - **Format**: String identifier

- `colors: string[]` (required)
  - **Description**: Array of color values (hex, rgb, named colors)
  - **Validation**: Array of at least 10 color strings
  - **Format**: Array of valid CSS color strings
  - **Minimum**: 10 colors (SC-007)

- `description?: string` (optional)
  - **Description**: Human-readable description of the palette
  - **Validation**: String
  - **Format**: Text description

**Relationships**:
- Stored in: ColorPaletteManager registry (Map)
- Used by: ChartService.getColors(), ChartService.setColorPalette()
- Managed by: ColorPaletteManager

**State Transitions**:
- **Registered**: Added to palette registry
- **Active**: Set as default palette
- **Retrieved**: Retrieved by name
- **Removed**: Removed from registry (if supported)

**Validation Rules**:
1. `name` must be non-empty and unique
2. `colors` array must have at least 10 elements
3. All color strings must be valid CSS colors
4. Palette name cannot be changed after registration

### 9. Margins

**Purpose**: Margin configuration for chart dimensions.

**Interface**: `IMargins`

**Fields**:
- `top: number` (required)
  - **Description**: Top margin in pixels
  - **Validation**: Non-negative number
  - **Default**: `20`

- `right: number` (required)
  - **Description**: Right margin in pixels
  - **Validation**: Non-negative number
  - **Default**: `20`

- `bottom: number` (required)
  - **Description**: Bottom margin in pixels
  - **Validation**: Non-negative number
  - **Default**: `40`

- `left: number` (required)
  - **Description**: Left margin in pixels
  - **Validation**: Non-negative number
  - **Default**: `40`

**Relationships**:
- Used by: IChartOptions.margin
- Calculated by: D3Utils.calculateMargins()
- Used in: Chart dimension calculations

**Validation Rules**:
1. All margin values must be non-negative numbers
2. Margins are typically in pixels

### 10. Dimensions

**Purpose**: Chart dimensions including width, height, and margins.

**Interface**: `IDimensions`

**Fields**:
- `width: number` (required)
  - **Description**: Total chart width in pixels
  - **Validation**: Positive number
  - **Default**: None (required field)

- `height: number` (required)
  - **Description**: Total chart height in pixels
  - **Validation**: Positive number
  - **Default**: None (required field)

- `margins: IMargins` (required)
  - **Description**: Chart margins
  - **Validation**: Valid IMargins object
  - **Default**: Default margins

**Relationships**:
- Used by: IChartOptions
- Calculated by: D3Utils.calculateInnerDimensions()
- Used in: Chart rendering

**Validation Rules**:
1. `width` must be positive number
2. `height` must be positive number
3. `margins` must be valid IMargins object
4. Inner dimensions (width/height - margins) must be positive

### 11. ChartServiceError

**Purpose**: Standardized error information for chart service operations.

**Interface**: `IChartServiceError`

**Fields**:
- `message: string` (required)
  - **Description**: Human-readable error message
  - **Validation**: Non-empty string
  - **Format**: Error description

- `code: string` (required)
  - **Description**: Error code identifier
  - **Validation**: Non-empty string
  - **Format**: Error code (e.g., "INVALID_CHART_TYPE", "INVALID_SCALE_CONFIG")

- `originalError?: Error` (optional)
  - **Description**: Original error object for debugging
  - **Validation**: Error object
  - **Format**: Original Error instance

**Relationships**:
- Thrown by: ChartService methods
- Caught by: Error handlers
- Used in: Error responses

**Validation Rules**:
1. `message` must be non-empty
2. `code` must be non-empty
3. Error messages must be clear and actionable (SC-009)

## Entity Relationships

```
ChartService
  ├── createChart(config: ChartConfig): IChartInstance
  ├── createScale(config: ScaleConfig): D3Scale
  ├── createAxis(config: AxisConfig): D3Axis
  ├── getColorPalette(name: string): ColorPalette | null
  ├── setColorPalette(palette: ColorPalette): void
  ├── getColors(count: number, paletteName?: string): string[]
  └── paletteManager: ColorPaletteManager

ChartConfig
  ├── type: ChartType
  ├── data?: any[]
  └── options?: IChartOptions

IChartInstance
  ├── type: ChartType
  ├── render(container: HTMLElement): void
  ├── update(data: any[]): void
  ├── destroy(): void
  └── getConfig(): IChartConfig

ScaleConfig
  ├── type: ScaleType
  ├── domain: number[] | string[] | Date[]
  └── range: number[] | string[]

AxisConfig
  ├── scale: AxisScale<any>
  ├── orientation: AxisOrientation
  └── ticks?: number

ColorPalette
  ├── name: string
  └── colors: string[] (min 10)

ColorPaletteManager
  ├── palettes: Map<string, ColorPalette>
  ├── defaultPaletteName: string
  ├── getColorPalette(name: string): ColorPalette | null
  ├── setColorPalette(palette: ColorPalette): void
  └── getColors(count: number, paletteName?: string): string[]
```

## Validation Summary

### ChartConfig Validation
- **FR-009**: System MUST validate chart configurations
- **SC-005**: 100% of valid chart configurations create chart instances successfully

**Validation Checks**:
1. `type` is one of the 10 supported chart types
2. If `data` is provided, it is an array
3. If `options` is provided, it is a valid IChartOptions object
4. Chart-specific validation based on `type`

### ScaleConfig Validation
- **SC-008**: Scale and axis helpers work correctly for all supported scale types

**Validation Checks**:
1. `type` is a valid ScaleType
2. `domain` matches scale type requirements
3. `range` matches scale type requirements
4. For band scales, `padding` is between 0 and 1
5. Domain and range arrays have appropriate lengths

### AxisConfig Validation
- **SC-008**: Scale and axis helpers work correctly for all supported scale types

**Validation Checks**:
1. `scale` is a valid D3 scale object
2. `orientation` is a valid AxisOrientation
3. `ticks` is positive integer if provided
4. `tickFormat` is a function if provided
5. Scale and orientation are compatible

### ColorPalette Validation
- **FR-011**: System MUST support custom color palettes
- **SC-007**: Color palettes provide at least 10 distinct colors

**Validation Checks**:
1. `name` is non-empty and unique
2. `colors` array has at least 10 elements
3. All color strings are valid CSS colors

## State Machine

### Chart Creation Flow

```
[Initial] 
  → createChart(config: ChartConfig)
  → validateChartConfig(config)
  → [Valid] → createChartInstance(config)
  → [Created] → return IChartInstance
  → [Invalid] → throw ChartServiceError
```

### Scale Creation Flow

```
[Initial]
  → createScale(config: ScaleConfig)
  → validateScaleConfig(config)
  → [Valid] → createD3Scale(config)
  → [Created] → return D3Scale
  → [Invalid] → throw ChartServiceError
```

### Axis Creation Flow

```
[Initial]
  → createAxis(config: AxisConfig)
  → validateAxisConfig(config)
  → [Valid] → createD3Axis(config)
  → [Created] → return D3Axis
  → [Invalid] → throw ChartServiceError
```

### Color Palette Flow

```
[Initial]
  → getColorPalette(name: string)
  → [Found] → return ColorPalette
  → [NotFound] → return null
  
[Initial]
  → setColorPalette(palette: ColorPalette)
  → validateColorPalette(palette)
  → [Valid] → registerPalette(palette)
  → [Invalid] → throw ChartServiceError
  
[Initial]
  → getColors(count: number, paletteName?: string)
  → getPalette(paletteName ?? defaultPaletteName)
  → [Found] → return colors.slice(0, count) (cycling if needed)
  → [NotFound] → throw ChartServiceError
```

## Data Flow

1. **Developer calls createChart()** → ChartService.createChart(config)
2. **Service validates** → ChartService.validateChartConfig(config)
3. **If valid** → Create chart instance using factory method
4. **Return instance** → IChartInstance with render/update/destroy methods
5. **If invalid** → Throw ChartServiceError with clear message

1. **Developer calls createScale()** → ChartService.createScale(config)
2. **Service validates** → ChartService.validateScaleConfig(config)
3. **If valid** → Create D3 scale using appropriate scale factory
4. **Return scale** → D3 Scale object
5. **If invalid** → Throw ChartServiceError with clear message

1. **Developer calls createAxis()** → ChartService.createAxis(config)
2. **Service validates** → ChartService.validateAxisConfig(config)
3. **If valid** → Create D3 axis using scale and orientation
4. **Return axis** → D3 Axis object
5. **If invalid** → Throw ChartServiceError with clear message

1. **Developer calls getColors()** → ChartService.getColors(count, paletteName)
2. **Service retrieves palette** → ColorPaletteManager.getColorPalette(name)
3. **If found** → Return requested number of colors (cycling if needed)
4. **If not found** → Throw ChartServiceError

