# Angular v20 D3 Dashboards Application - Requirements Specification

## Project Overview

Create a new Angular v20 workspace application for building D3.js-based dashboards. The project should consist of:
1. A library project named `d3-dashboards` containing reusable dashboard components and chart implementations
2. A test application project for demonstrating and testing multiple dashboards with various D3 chart types
3. Services for data fetching from APIs that can be bound to dashboards

## Technology Stack

### Core Framework
- **Angular**: v20.2.0 (latest stable)
- **TypeScript**: ~5.8.0
- **RxJS**: ~7.8.0
- **Zone.js**: ~0.15.1

### UI Libraries
- **PrimeNG**: v20.0.0 (latest)
- **PrimeFlex**: ^4.0.0
- **PrimeIcons**: ^7.0.0
- **@primeng/themes**: ^20.0.0
- **@primeuix/themes**: ^1.2.3

### Dashboard & Layout
- **angular-gridster2**: ^20.0.0 (for drag-and-drop grid layout)
- **D3.js**: ^7.8.5 (for all chart visualizations)

### Utilities
- **lodash-es**: ^4.17.21
- **uuid**: ^11.0.0
- **tslib**: ^2.6.0

### Development Dependencies
- **@angular/cli**: ^20.2.0
- **@angular-devkit/build-angular**: ^20.2.0
- **ng-packagr**: ^20.2.0
- **jest**: ^29.7.0 (for testing)
- **jest-preset-angular**: ^14.6.1
- **@types/d3**: ^7.4.3
- **@types/lodash-es**: ^4.17.12
- **@types/uuid**: ^10.0.0

## Project Structure

### Workspace Configuration
```
d3-dashboards-workspace/
├── projects/
│   ├── d3-dashboards/          # Library project
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── components/
│   │   │   │   ├── services/
│   │   │   │   ├── entities/
│   │   │   │   ├── charts/
│   │   │   │   └── public-api.ts
│   │   │   └── ...
│   │   ├── ng-package.json
│   │   ├── package.json
│   │   └── tsconfig.lib.json
│   │
│   └── d3-dashboards-app/      # Test application
│       ├── src/
│       │   ├── app/
│       │   │   ├── components/
│       │   │   ├── services/
│       │   │   ├── models/
│       │   │   └── ...
│       │   ├── assets/
│       │   ├── index.html
│       │   └── main.ts
│       └── ...
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

## Library Project: `d3-dashboards`

### Core Components

#### 1. Dashboard Container Component
**Path**: `projects/d3-dashboards/src/lib/components/dashboard-container/`

**Features**:
- Grid-based layout using angular-gridster2
- Drag-and-drop widget positioning
- Resizable widgets
- Responsive grid system (12-column layout)
- Edit mode toggle
- Widget management (add, remove, update)
- Print functionality
- Export dashboard configuration

**Component**: `DashboardContainerComponent`
- **Inputs**:
  - `widgets: ID3Widget[]` - Array of dashboard widgets
  - `gridConfig: GridsterConfig` - Gridster configuration
  - `isEditMode: boolean` - Edit mode flag
  - `filterValues: IFilterValues[]` - Global filter values
- **Outputs**:
  - `widgetChange: EventEmitter<ID3Widget[]>` - Emitted when widgets change
  - `widgetSelect: EventEmitter<ID3Widget>` - Emitted when widget is selected
  - `filterChange: EventEmitter<IFilterValues[]>` - Emitted when filters change

#### 2. Widget Component
**Path**: `projects/d3-dashboards/src/lib/components/widget/`

**Features**:
- Dynamic component loading based on widget type
- Widget header with title and actions
- Widget configuration panel
- Loading states
- Error handling

**Component**: `WidgetComponent`
- **Inputs**:
  - `widget: ID3Widget` - Widget configuration
  - `isEditMode: boolean` - Edit mode flag
- **Outputs**:
  - `widgetUpdate: EventEmitter<ID3Widget>` - Emitted when widget is updated
  - `widgetDelete: EventEmitter<string>` - Emitted when widget is deleted

#### 3. Widget Header Component
**Path**: `projects/d3-dashboards/src/lib/components/widget-header/`

**Features**:
- Widget title display
- Action menu (edit, delete, refresh, export)
- Filter indicators
- Loading indicators

### Chart Components (D3-based)

All charts should be implemented using D3.js v7. Each chart should be a standalone Angular component.

#### 1. Line Chart Component
**Path**: `projects/d3-dashboards/src/lib/charts/line-chart/`
- Support for multiple series
- Interactive tooltips
- Zoom and pan capabilities
- Time-series support
- Customizable axes and scales

#### 2. Bar Chart Component
**Path**: `projects/d3-dashboards/src/lib/charts/bar-chart/`
- Vertical and horizontal orientations
- Stacked and grouped variants
- Category and value axes
- Interactive tooltips

#### 3. Pie/Donut Chart Component *(Optional for v1 - Future Implementation)*
**Path**: `projects/d3-dashboards/src/lib/charts/pie-chart/`
- Pie and donut variants
- Interactive segments
- Legend support
- Percentage labels
- **Status**: Will be implemented on a need basis

#### 4. Scatter Plot Component *(Optional for v1 - Future Implementation)*
**Path**: `projects/d3-dashboards/src/lib/charts/scatter-plot/`
- Multiple data series
- Color coding
- Size scaling
- Interactive brushing
- **Status**: Will be implemented on a need basis

#### 5. Area Chart Component *(Optional for v1 - Future Implementation)*
**Path**: `projects/d3-dashboards/src/lib/charts/area-chart/`
- Stacked area support
- Smooth curves
- Time-series support
- **Status**: Will be implemented on a need basis

#### 6. Heatmap Component *(Optional for v1 - Future Implementation)*
**Path**: `projects/d3-dashboards/src/lib/charts/heatmap/`
- Color scale mapping
- Row and column labels
- Interactive cells
- **Status**: Will be implemented on a need basis

#### 7. Tree Map Component *(Optional for v1 - Future Implementation)*
**Path**: `projects/d3-dashboards/src/lib/charts/treemap/`
- Hierarchical data visualization
- Nested rectangles
- Interactive zoom
- **Status**: Will be implemented on a need basis

#### 8. Force-Directed Graph Component *(Optional for v1 - Future Implementation)*
**Path**: `projects/d3-dashboards/src/lib/charts/force-graph/`
- Node-link diagrams
- Interactive dragging
- Collapsible nodes
- **Status**: Will be implemented on a need basis

#### 9. Geographic Map Component *(Optional for v1 - Future Implementation)*
**Path**: `projects/d3-dashboards/src/lib/charts/geo-map/`
- GeoJSON support
- Choropleth mapping
- Interactive regions
- Projection support (Mercator, Albers, etc.)
- **Status**: Will be implemented on a need basis

#### 10. Gauge Component *(Optional for v1 - Future Implementation)*
**Path**: `projects/d3-dashboards/src/lib/charts/gauge/`
- Circular gauge
- Value indicators
- Color zones
- **Status**: Will be implemented on a need basis

### Additional Widget Types

#### 1. Table Widget
**Path**: `projects/d3-dashboards/src/lib/components/widgets/table-widget/`
- Sortable columns
- Pagination
- Filtering
- Export functionality

#### 2. Filter Widget
**Path**: `projects/d3-dashboards/src/lib/components/widgets/filter-widget/`
- Multiple filter types (dropdown, multi-select, date range, etc.)
- PrimeNG form controls integration
- Filter value propagation

#### 3. Tile Widget
**Path**: `projects/d3-dashboards/src/lib/components/widgets/tile-widget/`
- KPI display
- Icon support
- Trend indicators
- Color coding

#### 4. Markdown Widget
**Path**: `projects/d3-dashboards/src/lib/components/widgets/markdown-widget/`
- Rich text display
- Markdown rendering

### Services

#### 1. Dashboard Service
**Path**: `projects/d3-dashboards/src/lib/services/dashboard.service.ts`
- Dashboard CRUD operations
- Widget management
- Configuration persistence
- State management

#### 2. Data Service
**Path**: `projects/d3-dashboards/src/lib/services/data.service.ts`
- Generic data fetching interface
- API integration
- Data transformation utilities
- Caching support

#### 3. Chart Service
**Path**: `projects/d3-dashboards/src/lib/services/chart.service.ts`
- Chart factory methods
- D3 utility functions
- Scale and axis helpers
- Color palette management

### Entities/Interfaces

#### ID3Widget
```typescript
interface ID3Widget {
  id: string;
  // Required for v1: 'line' | 'bar'
  // Optional for v1 (future implementation): 'pie' | 'scatter' | 'area' | 'heatmap' | 'treemap' | 'force-graph' | 'geo-map' | 'gauge'
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'area' | 'heatmap' | 'treemap' | 'force-graph' | 'geo-map' | 'gauge' | 'table' | 'filter' | 'tile' | 'markdown';
  position: GridsterItem;
  title: string;
  config: ID3WidgetConfig;
  dataSource?: IDataSource;
  filters?: IFilterValues[];
  style?: IWidgetStyle;
}
```

#### ID3WidgetConfig
```typescript
interface ID3WidgetConfig {
  chartOptions?: IChartOptions;
  tableOptions?: ITableOptions;
  filterOptions?: IFilterOptions;
  tileOptions?: ITileOptions;
  markdownOptions?: IMarkdownOptions;
  [key: string]: any;
}
```

#### IChartOptions
```typescript
interface IChartOptions {
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  colors?: string[];
  axes?: IAxisOptions;
  tooltip?: ITooltipOptions;
  legend?: ILegendOptions;
  animation?: IAnimationOptions;
  [key: string]: any;
}
```

#### IDataSource
```typescript
interface IDataSource {
  type: 'api' | 'static' | 'computed';
  endpoint?: string;
  method?: 'GET' | 'POST';
  params?: Record<string, any>;
  data?: any[];
  transform?: (data: any) => any;
}
```

#### IFilterValues
```typescript
interface IFilterValues {
  key: string;
  value: any;
  operator?: 'equals' | 'contains' | 'greaterThan' | 'lessThan' | 'between';
}
```

#### IWidgetStyle
```typescript
interface IWidgetStyle {
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  padding?: number;
}
```

### Abstract Base Classes

#### AbstractDashboardContainer
**Path**: `projects/d3-dashboards/src/lib/abstract/abstract-dashboard-container.ts`
- Base class for dashboard implementations
- Common dashboard methods
- Filter management
- Widget lifecycle hooks
- Navigation helpers

### Utilities

#### Chart Utilities
**Path**: `projects/d3-dashboards/src/lib/utils/chart.utils.ts`
- D3 scale helpers
- Color palette generators
- Data transformation functions
- Formatting utilities

#### Layout Utilities
**Path**: `projects/d3-dashboards/src/lib/utils/layout.utils.ts`
- Grid calculations
- Responsive breakpoints
- Size calculations

## Application Project: `d3-dashboards-app`

### Application Structure

#### 1. Dashboard Pages
- **Home Dashboard**: Overview with multiple chart types
- **Analytics Dashboard**: Data analytics focused
- **Custom Dashboard**: User-configurable dashboard

#### 2. Services

##### Data API Service
**Path**: `projects/d3-dashboards-app/src/app/services/data-api.service.ts`
- REST API integration
- HTTP client wrapper
- Error handling
- Request/response interceptors
- Mock data support for development

**Methods**:
- `getData(endpoint: string, params?: any): Observable<any>`
- `postData(endpoint: string, body: any): Observable<any>`
- `getDashboardData(dashboardId: string): Observable<any>`
- `getChartData(chartId: string, filters?: IFilterValues[]): Observable<any>`

##### Dashboard Management Service
**Path**: `projects/d3-dashboards-app/src/app/services/dashboard-management.service.ts`
- Dashboard CRUD operations
- Dashboard templates
- User preferences

#### 3. Models
**Path**: `projects/d3-dashboards-app/src/app/models/`
- Dashboard model
- Chart data models
- API response models

#### 4. Components

##### Dashboard List Component
- Display available dashboards
- Create new dashboard
- Edit/Delete dashboards

##### Dashboard View Component
- Render dashboard using DashboardContainerComponent
- Handle dashboard-level filters
- Manage dashboard state

##### Chart Configuration Component
- Configure chart options
- Data source configuration
- Style customization

#### 5. Routing
```typescript
const routes: Routes = [
  { path: '', redirectTo: '/dashboards', pathMatch: 'full' },
  { path: 'dashboards', component: DashboardListComponent },
  { path: 'dashboards/:id', component: DashboardViewComponent },
  { path: 'dashboards/:id/edit', component: DashboardEditComponent },
  { path: 'examples', component: ExamplesComponent }
];
```

### Example Dashboards

#### 1. Sales Dashboard
- Revenue line chart
- Product category bar chart
- Sales table
- KPI tiles
- *(Note: Pie chart and other optional charts will be added as needed)*

#### 2. Analytics Dashboard
- Time-series line chart
- Bar chart for comparisons
- *(Note: Area chart, scatter plot, heatmap, and geo-map are optional for v1 and will be added as needed)*

#### 3. Custom Dashboard
- User-configurable widgets
- Drag-and-drop layout
- Save/load configurations

## Styling Requirements

### Theme Configuration
- Use PrimeNG theme system
- Support for light/dark themes
- Customizable color palettes
- Responsive design (mobile, tablet, desktop)

### CSS Architecture
- Component-scoped styles
- Global utility classes (PrimeFlex)
- CSS variables for theming
- SCSS preprocessing

## Testing Requirements

### Unit Tests
- Jest configuration for library and application
- Component tests
- Service tests
- Utility function tests
- Minimum 80% code coverage

### E2E Tests (Optional)
- Cypress or Playwright setup
- Dashboard interaction tests
- Chart rendering tests

## Build Configuration

### Library Build
- ng-packagr configuration
- TypeScript compilation
- Package generation
- Tree-shaking support

### Application Build
- Production and development configurations
- Code splitting
- Lazy loading
- Asset optimization

## Documentation Requirements

### Code Documentation
- JSDoc comments for all public APIs
- Type definitions
- Interface documentation
- Usage examples

### README Files
- Library README with installation and usage
- Application README with setup instructions
- API documentation
- Example code snippets

## Performance Requirements

### Optimization
- OnPush change detection strategy
- Lazy loading for charts
- Virtual scrolling for large datasets
- Debounced filter updates
- Memoization for expensive calculations

### Bundle Size
- Code splitting
- Tree shaking
- Lazy loading modules
- Optimized D3 imports (tree-shakeable)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Edge (latest)
- Safari (latest)

## Development Guidelines

### Code Style
- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Angular style guide compliance

### Git Workflow
- Feature branches
- Commit message conventions
- Pull request reviews

## Dependencies Summary

### Production Dependencies
```json
{
  "@angular/animations": "^20.2.0",
  "@angular/common": "^20.2.0",
  "@angular/compiler": "^20.2.0",
  "@angular/core": "^20.2.0",
  "@angular/forms": "^20.2.0",
  "@angular/platform-browser": "^20.2.0",
  "@angular/platform-browser-dynamic": "^20.2.0",
  "@angular/router": "^20.2.0",
  "angular-gridster2": "^20.0.0",
  "d3": "^7.8.5",
  "lodash-es": "^4.17.21",
  "primeng": "^20.0.0",
  "@primeng/themes": "^20.0.0",
  "primeflex": "^4.0.0",
  "primeicons": "^7.0.0",
  "rxjs": "~7.8.0",
  "tslib": "^2.6.0",
  "uuid": "^11.0.0",
  "zone.js": "~0.15.1"
}
```

### Development Dependencies
```json
{
  "@angular-devkit/build-angular": "^20.2.0",
  "@angular/cli": "^20.2.0",
  "@angular/compiler-cli": "^20.2.0",
  "@types/d3": "^7.4.3",
  "@types/lodash-es": "^4.17.12",
  "@types/uuid": "^10.0.0",
  "jest": "^29.7.0",
  "jest-preset-angular": "^14.6.1",
  "ng-packagr": "^20.2.0",
  "typescript": "~5.8.0"
}
```

## Implementation Phases

### Phase 1: Project Setup
1. Create Angular workspace
2. Generate library project (`d3-dashboards`)
3. Generate application project (`d3-dashboards-app`)
4. Install dependencies
5. Configure build tools

### Phase 2: Core Infrastructure
1. Create base interfaces and entities
2. Implement abstract dashboard container
3. Create dashboard container component
4. Implement widget component
5. Set up gridster configuration

### Phase 3: Chart Components
1. Implement base chart component
2. Create line chart *(Required for v1)*
3. Create bar chart *(Required for v1)*
4. *(Optional for v1 - Future)*: Create pie/donut chart
5. *(Optional for v1 - Future)*: Create scatter plot
6. *(Optional for v1 - Future)*: Create remaining chart types (area, heatmap, treemap, force-graph, geo-map, gauge) on a need basis

### Phase 4: Services & Utilities
1. Implement data service
2. Implement dashboard service
3. Implement chart service
4. Create utility functions

### Phase 5: Application Features
1. Create dashboard management service
2. Implement API data service
3. Create dashboard pages
4. Implement routing
5. Create example dashboards

### Phase 6: Testing & Documentation
1. Write unit tests
2. Create documentation
3. Add usage examples
4. Performance optimization

## Acceptance Criteria

1. ✅ Library can be built and published as npm package
2. ✅ Application can run and display dashboards
3. ✅ Required chart types (line and bar) render correctly with D3.js
4. ✅ Widgets can be dragged, resized, and configured
5. ✅ Data can be fetched from APIs and bound to charts
6. ✅ Filters work across dashboard widgets
7. ✅ Dashboard configurations can be saved and loaded
8. ✅ Code is well-documented and tested
9. ✅ Application is responsive and performant
10. ✅ All dependencies are compatible with Angular v20
11. *(Future)*: Optional chart types (pie, scatter, area, heatmap, treemap, force-graph, geo-map, gauge) will be implemented on a need basis

## Notes

- All chart implementations must use D3.js (not ECharts or other charting libraries)
- The library should be framework-agnostic where possible (pure D3 logic)
- Follow Angular standalone component architecture
- Use signals for reactive state management where appropriate
- Ensure TypeScript strict mode compliance
- Implement proper error handling and loading states
- Support accessibility features (ARIA labels, keyboard navigation)
```

This requirements document covers:

1. **Project structure**: Library and application projects
2. **Technology stack**: Angular v20, D3.js, angular-gridster2, PrimeNG v20
3. **Components**: Dashboard container, widgets, and 10+ D3 chart types
4. **Services**: Data fetching, dashboard management, chart utilities
5. **Interfaces**: Type definitions for widgets, charts, and data sources
6. **Application features**: Multiple dashboard examples with API integration
7. **Testing and documentation**: Requirements and guidelines
8. **Implementation phases**: Step-by-step development plan

Use this with Speckit to generate the Angular v20 D3 dashboards application.
