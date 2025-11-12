# D3 Dashboards Application Constitution

**Version:** 1.0.0  
**Date:** 2024  
**Status:** Active

---

## Preamble

This constitution establishes the foundational principles, architectural decisions, development standards, and governance rules for the Angular v20 D3 Dashboards Application. All development activities, architectural decisions, and code contributions must align with these principles. This document serves as the supreme law of the project and shall guide all technical decisions.

---

## Article I: Vision and Mission

### Section 1.1: Vision Statement
To create a powerful, flexible, and reusable dashboard library that empowers developers to build sophisticated data visualization applications using Angular and D3.js, while maintaining exceptional performance, accessibility, and developer experience.

### Section 1.2: Mission Statement
- Provide a comprehensive library of D3.js-based chart components that are production-ready
- Enable rapid dashboard development through reusable, configurable widgets
- Maintain strict adherence to Angular best practices and modern web standards
- Ensure the library is framework-agnostic where possible, with pure D3 logic
- Deliver exceptional performance through optimized rendering and change detection strategies

---

## Article II: Core Principles

### Section 2.1: Type Safety First
- **Mandatory**: All code MUST be written in TypeScript with strict mode enabled
- **Mandatory**: All public APIs MUST have complete type definitions
- **Mandatory**: Interfaces and types MUST be exported through `public-api.ts`
- **Prohibited**: Use of `any` type without explicit justification and documentation
- **Prohibited**: Type assertions without runtime validation

### Section 2.2: Component Architecture
- **Mandatory**: All components MUST be standalone (Angular standalone architecture)
- **Mandatory**: Components MUST use OnPush change detection strategy by default
- **Mandatory**: Components MUST implement proper lifecycle hooks (OnInit, OnDestroy, etc.)
- **Mandatory**: All inputs and outputs MUST be properly typed and documented
- **Prohibited**: NgModules for component organization (standalone components only)

### Section 2.3: D3.js Exclusivity
- **Mandatory**: All chart visualizations MUST be implemented using D3.js v7.8.5
- **Prohibited**: Use of ECharts, Chart.js, or any other charting library for visualizations
- **Mandatory**: D3 logic MUST be framework-agnostic where possible
- **Mandatory**: D3 imports MUST be tree-shakeable (import specific modules, not entire library)

### Section 2.4: Reactive Programming
- **Mandatory**: Use RxJS Observables for all asynchronous operations
- **Mandatory**: Use Angular Signals for reactive state management where appropriate
- **Mandatory**: All subscriptions MUST be properly unsubscribed (use takeUntil pattern or async pipe)
- **Prohibited**: Direct subscription without cleanup in components

### Section 2.5: Performance Optimization
- **Mandatory**: Implement lazy loading for chart components
- **Mandatory**: Use virtual scrolling for large datasets
- **Mandatory**: Debounce filter updates and user interactions
- **Mandatory**: Memoize expensive calculations
- **Mandatory**: Optimize bundle size through code splitting and tree shaking

---

## Article III: Technology Standards

### Section 3.1: Core Framework Versions
The following versions are **IMMUTABLE** and cannot be changed without constitutional amendment:

- **Angular**: v20.2.0 (latest stable)
- **TypeScript**: ~5.8.0
- **RxJS**: ~7.8.0
- **Zone.js**: ~0.15.1
- **D3.js**: ^7.8.5

### Section 3.2: UI Library Standards
- **PrimeNG**: v20.0.0 (latest) - For UI components and form controls
- **PrimeFlex**: ^4.0.0 - For utility classes
- **PrimeIcons**: ^7.0.0 - For iconography
- **angular-gridster2**: ^20.0.0 - For drag-and-drop grid layout

### Section 3.3: Testing Framework
- **Jest**: ^29.7.0 - Primary testing framework
- **jest-preset-angular**: ^14.6.1 - Angular testing utilities
- **Minimum Coverage**: 80% code coverage required for all library code

### Section 3.4: Build Tools
- **ng-packagr**: ^20.2.0 - For library packaging
- **@angular/cli**: ^20.2.0 - For application builds
- **TypeScript Compiler**: Must support strict mode and tree shaking

---

## Article IV: Architectural Decisions

### Section 4.1: Project Structure
The workspace MUST follow this exact structure:

```markdown:constitution.md
<code_block_to_apply_changes_from>
```
d3-dashboards-app/
├── projects/
│   └── d3-dashboards/          # Library project
│       ├── src/lib/
│       │   ├── components/     # Core components
│       │   ├── services/       # Business logic services
│       │   ├── entities/       # Interfaces and types
│       │   ├── charts/         # D3 chart components
│       │   ├── abstract/       # Base classes
│       │   ├── utils/          # Utility functions
│       │   └── public-api.ts   # Public API exports
│
├── src/                        # Application (root level)
│   ├── app/
│   │   ├── components/     # Application components
│   │   ├── services/       # Application services
│   │   ├── models/         # Application models
│   │   └── ...
```

### Section 4.2: Component Organization
- **Mandatory**: Each component MUST be in its own directory
- **Mandatory**: Component directory MUST contain: `.ts`, `.html`, `.scss`, `.spec.ts`
- **Mandatory**: Components MUST be exported through `public-api.ts` for library
- **Prohibited**: Barrel exports that bypass `public-api.ts`

### Section 4.3: Service Architecture
- **Mandatory**: Services MUST be provided at the appropriate level (root, component, etc.)
- **Mandatory**: Services MUST be injectable and follow dependency injection patterns
- **Mandatory**: All service methods MUST return Observables for async operations
- **Mandatory**: Services MUST handle errors gracefully and provide error observables

### Section 4.4: Data Flow
- **Mandatory**: Data MUST flow unidirectionally (parent to child via inputs)
- **Mandatory**: Events MUST flow upward (child to parent via outputs)
- **Mandatory**: Global state MUST be managed through services or signals
- **Prohibited**: Direct component-to-component communication without parent mediation

---

## Article V: Code Quality Standards

### Section 5.1: TypeScript Standards
- **Mandatory**: TypeScript strict mode MUST be enabled
- **Mandatory**: ESLint MUST be configured and enforced
- **Mandatory**: Prettier MUST be configured for code formatting
- **Mandatory**: All code MUST comply with Angular Style Guide
- **Mandatory**: No unused imports, variables, or code

### Section 5.2: Naming Conventions
- **Components**: PascalCase (e.g., `DashboardContainerComponent`)
- **Services**: PascalCase with "Service" suffix (e.g., `DashboardService`)
- **Interfaces**: PascalCase with "I" prefix (e.g., `ID3Widget`)
- **Files**: kebab-case (e.g., `dashboard-container.component.ts`)
- **Constants**: UPPER_SNAKE_CASE
- **Variables/Methods**: camelCase

### Section 5.3: Documentation Requirements
- **Mandatory**: All public APIs MUST have JSDoc comments
- **Mandatory**: All interfaces MUST have property descriptions
- **Mandatory**: Complex logic MUST have inline comments
- **Mandatory**: README files MUST be maintained for library and application
- **Mandatory**: Usage examples MUST be provided for all chart components

### Section 5.4: Error Handling
- **Mandatory**: All async operations MUST have error handling
- **Mandatory**: User-facing errors MUST be displayed appropriately
- **Mandatory**: Console errors MUST be logged with context
- **Mandatory**: Loading states MUST be shown for async operations
- **Prohibited**: Silent failures or unhandled promise rejections

---

## Article VI: Chart Component Standards

### Section 6.1: Chart Implementation Requirements
- **Mandatory**: Each chart MUST be a standalone Angular component
- **Mandatory**: Charts MUST accept data through `@Input()` properties
- **Mandatory**: Charts MUST emit events through `@Output()` properties
- **Mandatory**: Charts MUST implement `OnInit`, `OnChanges`, and `OnDestroy`
- **Mandatory**: Charts MUST handle empty data gracefully
- **Mandatory**: Charts MUST be responsive and resize with container

### Section 6.2: D3 Integration
- **Mandatory**: D3 selections MUST be cleaned up in `ngOnDestroy`
- **Mandatory**: D3 updates MUST use enter/update/exit pattern
- **Mandatory**: D3 transitions MUST be used for animations
- **Mandatory**: D3 scales MUST be recalculated on data changes
- **Prohibited**: Direct DOM manipulation outside of D3

### Section 6.3: Chart Configuration
- **Mandatory**: Charts MUST support configuration through `IChartOptions` interface
- **Mandatory**: Default values MUST be provided for all optional configurations
- **Mandatory**: Configuration changes MUST trigger chart re-rendering
- **Mandatory**: Charts MUST validate configuration and provide sensible defaults

### Section 6.4: Required Chart Types
The following chart types MUST be implemented for v1:
1. Line Chart *(Required for v1)*
2. Bar Chart *(Required for v1)*

The following chart types are OPTIONAL for v1 and will be implemented on a need basis:
3. Pie/Donut Chart *(Optional for v1 - Future Implementation)*
4. Scatter Plot *(Optional for v1 - Future Implementation)*
5. Area Chart *(Optional for v1 - Future Implementation)*
6. Heatmap *(Optional for v1 - Future Implementation)*
7. Tree Map *(Optional for v1 - Future Implementation)*
8. Force-Directed Graph *(Optional for v1 - Future Implementation)*
9. Geographic Map *(Optional for v1 - Future Implementation)*
10. Gauge *(Optional for v1 - Future Implementation)*

---

## Article VII: Widget System Standards

### Section 7.1: Widget Interface
- **Mandatory**: All widgets MUST implement `ID3Widget` interface
- **Mandatory**: Widgets MUST have unique IDs (UUID)
- **Mandatory**: Widgets MUST support drag-and-drop positioning
- **Mandatory**: Widgets MUST support resizing
- **Mandatory**: Widgets MUST support configuration

### Section 7.2: Widget Types
The following widget types MUST be supported:
- Chart widgets:
  - Required for v1: Line chart, Bar chart
  - Optional for v1 (future implementation): Pie/Donut, Scatter Plot, Area Chart, Heatmap, Tree Map, Force-Directed Graph, Geographic Map, Gauge
- Table widget
- Filter widget
- Tile widget (KPI display)
- Markdown widget

### Section 7.3: Widget Lifecycle
- **Mandatory**: Widgets MUST load data on initialization
- **Mandatory**: Widgets MUST update when filters change
- **Mandatory**: Widgets MUST handle loading and error states
- **Mandatory**: Widgets MUST clean up resources on destruction

---

## Article VIII: Data Management Standards

### Section 8.1: Data Source Interface
- **Mandatory**: All data sources MUST implement `IDataSource` interface
- **Mandatory**: Data sources MUST support: 'api', 'static', 'computed' types
- **Mandatory**: API data sources MUST use HTTP client service
- **Mandatory**: Data transformation MUST be supported through transform functions

### Section 8.2: Data Service Requirements
- **Mandatory**: Data service MUST provide generic data fetching interface
- **Mandatory**: Data service MUST support caching
- **Mandatory**: Data service MUST handle errors and retries
- **Mandatory**: Data service MUST support request/response interceptors

### Section 8.3: Filter System
- **Mandatory**: Filters MUST implement `IFilterValues` interface
- **Mandatory**: Filters MUST propagate across dashboard widgets
- **Mandatory**: Filter changes MUST be debounced
- **Mandatory**: Filters MUST support multiple operators (equals, contains, etc.)

---

## Article IX: Styling and Theming Standards

### Section 9.1: Theme System
- **Mandatory**: MUST use PrimeNG theme system
- **Mandatory**: MUST support light and dark themes
- **Mandatory**: MUST use CSS variables for theming
- **Mandatory**: Color palettes MUST be customizable

### Section 9.2: CSS Architecture
- **Mandatory**: Component styles MUST be scoped
- **Mandatory**: Global utilities MUST use PrimeFlex
- **Mandatory**: SCSS preprocessing MUST be used
- **Prohibited**: Global CSS that affects multiple components without purpose
- **Prohibited**: Inline styles (except for dynamic values)

### Section 9.3: Responsive Design
- **Mandatory**: MUST be responsive (mobile, tablet, desktop)
- **Mandatory**: Grid system MUST adapt to screen size
- **Mandatory**: Charts MUST resize appropriately
- **Mandatory**: Touch interactions MUST be supported

---

## Article X: Testing Requirements

### Section 10.1: Unit Testing
- **Mandatory**: All components MUST have unit tests
- **Mandatory**: All services MUST have unit tests
- **Mandatory**: All utility functions MUST have unit tests
- **Mandatory**: Minimum 80% code coverage for library code
- **Mandatory**: Tests MUST use Jest and jest-preset-angular

### Section 10.2: Test Quality
- **Mandatory**: Tests MUST be isolated and independent
- **Mandatory**: Tests MUST use mocks for dependencies
- **Mandatory**: Tests MUST cover happy paths and error cases
- **Mandatory**: Tests MUST be maintainable and readable

### Section 10.3: E2E Testing (Optional)
- **Recommended**: E2E tests for critical user flows
- **Recommended**: Use Cypress or Playwright
- **Recommended**: Test dashboard interactions and chart rendering

---

## Article XI: Performance Standards

### Section 11.1: Rendering Performance
- **Mandatory**: Charts MUST render within 100ms for datasets < 1000 points
- **Mandatory**: Dashboard MUST load within 2 seconds on 3G connection
- **Mandatory**: Virtual scrolling MUST be used for large datasets (> 1000 items)
- **Mandatory**: Change detection MUST be optimized (OnPush strategy)

### Section 11.2: Bundle Size
- **Mandatory**: Library bundle MUST be optimized for tree shaking
- **Mandatory**: Code splitting MUST be implemented
- **Mandatory**: Lazy loading MUST be used for chart modules
- **Mandatory**: D3 imports MUST be tree-shakeable

### Section 11.3: Runtime Performance
- **Mandatory**: Expensive calculations MUST be memoized
- **Mandatory**: Filter updates MUST be debounced (300ms default)
- **Mandatory**: Chart animations MUST not block main thread
- **Mandatory**: Memory leaks MUST be prevented (proper cleanup)

---

## Article XII: Accessibility Standards

### Section 12.1: ARIA Requirements
- **Mandatory**: All interactive elements MUST have ARIA labels
- **Mandatory**: Charts MUST have descriptive titles and descriptions
- **Mandatory**: Color MUST not be the only means of conveying information
- **Mandatory**: Keyboard navigation MUST be supported

### Section 12.2: Screen Reader Support
- **Mandatory**: Chart data MUST be accessible to screen readers
- **Mandatory**: Alternative text MUST be provided for visual elements
- **Mandatory**: Focus indicators MUST be visible
- **Recommended**: Provide data tables as alternatives to charts

---

## Article XIII: Browser Support

### Section 13.1: Supported Browsers
The following browsers MUST be supported:
- Chrome (latest)
- Firefox (latest)
- Edge (latest)
- Safari (latest)

### Section 13.2: Progressive Enhancement
- **Mandatory**: Application MUST work without JavaScript (basic functionality)
- **Mandatory**: Features MUST degrade gracefully
- **Mandatory**: Polyfills MUST be provided for older browsers if needed

---

## Article XIV: Security Standards

### Section 14.1: Data Security
- **Mandatory**: API endpoints MUST be validated
- **Mandatory**: User input MUST be sanitized
- **Mandatory**: XSS prevention MUST be implemented
- **Mandatory**: CSRF protection MUST be considered

### Section 14.2: Dependency Security
- **Mandatory**: Dependencies MUST be regularly updated
- **Mandatory**: Security vulnerabilities MUST be addressed promptly
- **Mandatory**: npm audit MUST be run regularly

---

## Article XV: Documentation Standards

### Section 15.1: Code Documentation
- **Mandatory**: JSDoc comments for all public APIs
- **Mandatory**: Type definitions for all interfaces
- **Mandatory**: Usage examples in component documentation
- **Mandatory**: API documentation must be kept up-to-date

### Section 15.2: Project Documentation
- **Mandatory**: README for library with installation instructions
- **Mandatory**: README for application with setup instructions
- **Mandatory**: CHANGELOG must be maintained
- **Recommended**: Architecture decision records (ADRs)

---

## Article XVI: Development Workflow

### Section 16.1: Git Workflow
- **Mandatory**: Feature branches MUST be used
- **Mandatory**: Commit messages MUST follow conventional commits
- **Mandatory**: Pull requests MUST be reviewed before merging
- **Mandatory**: Main branch MUST always be in deployable state

### Section 16.2: Code Review
- **Mandatory**: All code MUST be reviewed by at least one other developer
- **Mandatory**: Reviews MUST check for constitution compliance
- **Mandatory**: Tests MUST pass before merging
- **Mandatory**: Build MUST succeed before merging

---

## Article XVII: Build and Deployment

### Section 17.1: Library Build
- **Mandatory**: Library MUST build using ng-packagr
- **Mandatory**: Library MUST be publishable to npm
- **Mandatory**: TypeScript compilation MUST succeed with strict mode
- **Mandatory**: Tree shaking MUST be supported

### Section 17.2: Application Build
- **Mandatory**: Production build MUST be optimized
- **Mandatory**: Code splitting MUST be implemented
- **Mandatory**: Lazy loading MUST be used
- **Mandatory**: Asset optimization MUST be enabled

---

## Article XVIII: Amendment Process

### Section 18.1: Constitutional Amendments
This constitution may be amended only through:
1. Proposal of amendment with justification
2. Review by technical lead/architect
3. Team discussion and consensus
4. Update to this document with version increment
5. Communication to all team members

### Section 18.2: Temporary Exceptions
Temporary exceptions to this constitution may be granted for:
- Experimental features
- Migration periods
- Critical bug fixes requiring immediate action

All exceptions MUST be documented and have an expiration date.

---

## Article XIX: Enforcement

### Section 19.1: Compliance
- All code contributions MUST comply with this constitution
- Code reviews MUST verify constitution compliance
- Automated tools (ESLint, Prettier, tests) MUST enforce standards
- Non-compliance MUST be addressed before code merge

### Section 19.2: Violations
Violations of this constitution:
1. MUST be identified during code review
2. MUST be fixed before merge
3. MUST be documented if exception is granted
4. MUST trigger review of process if recurring

---

## Article XX: Implementation Phases

This constitution recognizes the following implementation phases (as per requirements):

1. **Phase 1**: Project Setup
2. **Phase 2**: Core Infrastructure
3. **Phase 3**: Chart Components
4. **Phase 4**: Services & Utilities
5. **Phase 5**: Application Features
6. **Phase 6**: Testing & Documentation

All phases MUST comply with this constitution.

---

## Signatories and Adoption

This constitution is adopted by the development team and shall govern all aspects of the D3 Dashboards Application development.

**Effective Date**: [Date of Adoption]  
**Review Date**: [Quarterly Review Date]

---

## Appendix A: Key Interfaces Reference

### ID3Widget
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

### IDataSource
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

---

**End of Constitution**
```