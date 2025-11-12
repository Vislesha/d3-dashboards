<!--
Sync Impact Report:
Version: 1.0.0 (initial creation from root constitution.md)
Modified Principles: N/A (initial creation)
Added Sections: All sections from root constitution mapped to template format
Removed Sections: N/A
Templates Requiring Updates:
  ✅ plan-template.md - Constitution Check section references constitution file
  ✅ spec-template.md - No direct constitution references
  ✅ tasks-template.md - No direct constitution references
Follow-up TODOs:
  - TODO(RATIFICATION_DATE): Original adoption date unknown - needs to be set
  - TODO(REVIEW_DATE): Quarterly review date needs to be established
-->

# D3 Dashboards Application Constitution

## Core Principles

### I. Type Safety First (NON-NEGOTIABLE)
All code MUST be written in TypeScript with strict mode enabled. All public APIs MUST have complete type definitions. Interfaces and types MUST be exported through `public-api.ts`. Use of `any` type is PROHIBITED without explicit justification and documentation. Type assertions without runtime validation are PROHIBITED.

**Rationale**: Type safety prevents runtime errors, improves developer experience, enables better tooling support, and ensures API contracts are maintained.

### II. Component Architecture (NON-NEGOTIABLE)
All components MUST be standalone (Angular standalone architecture). Components MUST use OnPush change detection strategy by default. Components MUST implement proper lifecycle hooks (OnInit, OnDestroy, etc.). All inputs and outputs MUST be properly typed and documented. NgModules for component organization are PROHIBITED (standalone components only).

**Rationale**: Standalone components reduce boilerplate, improve tree-shaking, and align with Angular's modern architecture. OnPush strategy optimizes performance by reducing unnecessary change detection cycles.

### III. D3.js Exclusivity (NON-NEGOTIABLE)
All chart visualizations MUST be implemented using D3.js v7.8.5. Use of ECharts, Chart.js, or any other charting library for visualizations is PROHIBITED. D3 logic MUST be framework-agnostic where possible. D3 imports MUST be tree-shakeable (import specific modules, not entire library).

**Rationale**: D3.js provides maximum flexibility and control over visualizations. Framework-agnostic D3 logic enables reuse and testing. Tree-shakeable imports minimize bundle size.

### IV. Reactive Programming (NON-NEGOTIABLE)
Use RxJS Observables for all asynchronous operations. Use Angular Signals for reactive state management where appropriate. All subscriptions MUST be properly unsubscribed (use takeUntil pattern or async pipe). Direct subscription without cleanup in components is PROHIBITED.

**Rationale**: Reactive programming provides predictable data flow, better error handling, and composable async operations. Proper cleanup prevents memory leaks.

### V. Performance Optimization (NON-NEGOTIABLE)
Implement lazy loading for chart components. Use virtual scrolling for large datasets. Debounce filter updates and user interactions. Memoize expensive calculations. Optimize bundle size through code splitting and tree shaking.

**Rationale**: Performance is critical for dashboard applications handling large datasets. Lazy loading and code splitting improve initial load times. Virtual scrolling enables handling of large datasets without UI degradation.

### VI. Testing Requirements (NON-NEGOTIABLE)
All components MUST have unit tests. All services MUST have unit tests. All utility functions MUST have unit tests. Minimum 80% code coverage required for all library code. Tests MUST use Jest and jest-preset-angular. Tests MUST be isolated and independent. Tests MUST use mocks for dependencies. Tests MUST cover happy paths and error cases.

**Rationale**: Comprehensive testing ensures code quality, prevents regressions, and enables confident refactoring. High coverage requirements ensure critical paths are tested.

### VII. Code Quality Standards
TypeScript strict mode MUST be enabled. ESLint MUST be configured and enforced. Prettier MUST be configured for code formatting. All code MUST comply with Angular Style Guide. No unused imports, variables, or code. All public APIs MUST have JSDoc comments. All interfaces MUST have property descriptions. Complex logic MUST have inline comments.

**Rationale**: Consistent code quality improves maintainability, readability, and reduces bugs. Documentation enables better developer experience and API understanding.

## Technology Standards

### Core Framework Versions (IMMUTABLE)
The following versions are IMMUTABLE and cannot be changed without constitutional amendment:
- **Angular**: v20.2.0 (latest stable)
- **TypeScript**: ~5.8.0
- **RxJS**: ~7.8.0
- **Zone.js**: ~0.15.1
- **D3.js**: ^7.8.5

### UI Library Standards
- **PrimeNG**: v20.0.0 (latest) - For UI components and form controls
- **PrimeFlex**: ^4.0.0 - For utility classes
- **PrimeIcons**: ^7.0.0 - For iconography
- **angular-gridster2**: ^20.0.0 - For drag-and-drop grid layout

### Testing Framework
- **Jest**: ^29.7.0 - Primary testing framework
- **jest-preset-angular**: ^14.6.1 - Angular testing utilities
- **Minimum Coverage**: 80% code coverage required for all library code

### Build Tools
- **ng-packagr**: ^20.2.0 - For library packaging
- **@angular/cli**: ^20.2.0 - For application builds
- **TypeScript Compiler**: Must support strict mode and tree shaking

## Architectural Decisions

### Project Structure
The workspace MUST follow this exact structure:
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

### Component Organization
- **Mandatory**: Each component MUST be in its own directory
- **Mandatory**: Component directory MUST contain: `.ts`, `.html`, `.scss`, `.spec.ts`
- **Mandatory**: Components MUST be exported through `public-api.ts` for library
- **Prohibited**: Barrel exports that bypass `public-api.ts`

### Service Architecture
- **Mandatory**: Services MUST be provided at the appropriate level (root, component, etc.)
- **Mandatory**: Services MUST be injectable and follow dependency injection patterns
- **Mandatory**: All service methods MUST return Observables for async operations
- **Mandatory**: Services MUST handle errors gracefully and provide error observables

### Data Flow
- **Mandatory**: Data MUST flow unidirectionally (parent to child via inputs)
- **Mandatory**: Events MUST flow upward (child to parent via outputs)
- **Mandatory**: Global state MUST be managed through services or signals
- **Prohibited**: Direct component-to-component communication without parent mediation

## Chart Component Standards

### Chart Implementation Requirements
- **Mandatory**: Each chart MUST be a standalone Angular component
- **Mandatory**: Charts MUST accept data through `@Input()` properties
- **Mandatory**: Charts MUST emit events through `@Output()` properties
- **Mandatory**: Charts MUST implement `OnInit`, `OnChanges`, and `OnDestroy`
- **Mandatory**: Charts MUST handle empty data gracefully
- **Mandatory**: Charts MUST be responsive and resize with container

### D3 Integration
- **Mandatory**: D3 selections MUST be cleaned up in `ngOnDestroy`
- **Mandatory**: D3 updates MUST use enter/update/exit pattern
- **Mandatory**: D3 transitions MUST be used for animations
- **Mandatory**: D3 scales MUST be recalculated on data changes
- **Prohibited**: Direct DOM manipulation outside of D3

### Required Chart Types
The following chart types MUST be implemented:
1. Line Chart
2. Bar Chart
3. Pie/Donut Chart
4. Scatter Plot
5. Area Chart
6. Heatmap
7. Tree Map
8. Force-Directed Graph
9. Geographic Map
10. Gauge

## Widget System Standards

### Widget Interface
- **Mandatory**: All widgets MUST implement `ID3Widget` interface
- **Mandatory**: Widgets MUST have unique IDs (UUID)
- **Mandatory**: Widgets MUST support drag-and-drop positioning
- **Mandatory**: Widgets MUST support resizing
- **Mandatory**: Widgets MUST support configuration

### Widget Types
The following widget types MUST be supported:
- Chart widgets (all 10 chart types)
- Table widget
- Filter widget
- Tile widget (KPI display)
- Markdown widget

## Data Management Standards

### Data Source Interface
- **Mandatory**: All data sources MUST implement `IDataSource` interface
- **Mandatory**: Data sources MUST support: 'api', 'static', 'computed' types
- **Mandatory**: API data sources MUST use HTTP client service
- **Mandatory**: Data transformation MUST be supported through transform functions

### Data Service Requirements
- **Mandatory**: Data service MUST provide generic data fetching interface
- **Mandatory**: Data service MUST support caching
- **Mandatory**: Data service MUST handle errors and retries
- **Mandatory**: Data service MUST support request/response interceptors

### Filter System
- **Mandatory**: Filters MUST implement `IFilterValues` interface
- **Mandatory**: Filters MUST propagate across dashboard widgets
- **Mandatory**: Filter changes MUST be debounced
- **Mandatory**: Filters MUST support multiple operators (equals, contains, etc.)

## Styling and Theming Standards

### Theme System
- **Mandatory**: MUST use PrimeNG theme system
- **Mandatory**: MUST support light and dark themes
- **Mandatory**: MUST use CSS variables for theming
- **Mandatory**: Color palettes MUST be customizable

### CSS Architecture
- **Mandatory**: Component styles MUST be scoped
- **Mandatory**: Global utilities MUST use PrimeFlex
- **Mandatory**: SCSS preprocessing MUST be used
- **Prohibited**: Global CSS that affects multiple components without purpose
- **Prohibited**: Inline styles (except for dynamic values)

### Responsive Design
- **Mandatory**: MUST be responsive (mobile, tablet, desktop)
- **Mandatory**: Grid system MUST adapt to screen size
- **Mandatory**: Charts MUST resize appropriately
- **Mandatory**: Touch interactions MUST be supported

## Performance Standards

### Rendering Performance
- **Mandatory**: Charts MUST render within 100ms for datasets < 1000 points
- **Mandatory**: Dashboard MUST load within 2 seconds on 3G connection
- **Mandatory**: Virtual scrolling MUST be used for large datasets (> 1000 items)
- **Mandatory**: Change detection MUST be optimized (OnPush strategy)

### Bundle Size
- **Mandatory**: Library bundle MUST be optimized for tree shaking
- **Mandatory**: Code splitting MUST be implemented
- **Mandatory**: Lazy loading MUST be used for chart modules
- **Mandatory**: D3 imports MUST be tree-shakeable

### Runtime Performance
- **Mandatory**: Expensive calculations MUST be memoized
- **Mandatory**: Filter updates MUST be debounced (300ms default)
- **Mandatory**: Chart animations MUST not block main thread
- **Mandatory**: Memory leaks MUST be prevented (proper cleanup)

## Accessibility Standards

### ARIA Requirements
- **Mandatory**: All interactive elements MUST have ARIA labels
- **Mandatory**: Charts MUST have descriptive titles and descriptions
- **Mandatory**: Color MUST not be the only means of conveying information
- **Mandatory**: Keyboard navigation MUST be supported

### Screen Reader Support
- **Mandatory**: Chart data MUST be accessible to screen readers
- **Mandatory**: Alternative text MUST be provided for visual elements
- **Mandatory**: Focus indicators MUST be visible
- **Recommended**: Provide data tables as alternatives to charts

## Browser Support

### Supported Browsers
The following browsers MUST be supported:
- Chrome (latest)
- Firefox (latest)
- Edge (latest)
- Safari (latest)

### Progressive Enhancement
- **Mandatory**: Application MUST work without JavaScript (basic functionality)
- **Mandatory**: Features MUST degrade gracefully
- **Mandatory**: Polyfills MUST be provided for older browsers if needed

## Security Standards

### Data Security
- **Mandatory**: API endpoints MUST be validated
- **Mandatory**: User input MUST be sanitized
- **Mandatory**: XSS prevention MUST be implemented
- **Mandatory**: CSRF protection MUST be considered

### Dependency Security
- **Mandatory**: Dependencies MUST be regularly updated
- **Mandatory**: Security vulnerabilities MUST be addressed promptly
- **Mandatory**: npm audit MUST be run regularly

## Documentation Standards

### Code Documentation
- **Mandatory**: JSDoc comments for all public APIs
- **Mandatory**: Type definitions for all interfaces
- **Mandatory**: Usage examples in component documentation
- **Mandatory**: API documentation must be kept up-to-date

### Project Documentation
- **Mandatory**: README for library with installation instructions
- **Mandatory**: README for application with setup instructions
- **Mandatory**: CHANGELOG must be maintained
- **Recommended**: Architecture decision records (ADRs)

## Development Workflow

### Git Workflow
- **Mandatory**: Feature branches MUST be used
- **Mandatory**: Commit messages MUST follow conventional commits
- **Mandatory**: Pull requests MUST be reviewed before merging
- **Mandatory**: Main branch MUST always be in deployable state

### Code Review
- **Mandatory**: All code MUST be reviewed by at least one other developer
- **Mandatory**: Reviews MUST check for constitution compliance
- **Mandatory**: Tests MUST pass before merging
- **Mandatory**: Build MUST succeed before merging

## Build and Deployment

### Library Build
- **Mandatory**: Library MUST build using ng-packagr
- **Mandatory**: Library MUST be publishable to npm
- **Mandatory**: TypeScript compilation MUST succeed with strict mode
- **Mandatory**: Tree shaking MUST be supported

### Application Build
- **Mandatory**: Production build MUST be optimized
- **Mandatory**: Code splitting MUST be implemented
- **Mandatory**: Lazy loading MUST be used
- **Mandatory**: Asset optimization MUST be enabled

## Error Handling

- **Mandatory**: All async operations MUST have error handling
- **Mandatory**: User-facing errors MUST be displayed appropriately
- **Mandatory**: Console errors MUST be logged with context
- **Mandatory**: Loading states MUST be shown for async operations
- **Prohibited**: Silent failures or unhandled promise rejections

## Naming Conventions

- **Components**: PascalCase (e.g., `DashboardContainerComponent`)
- **Services**: PascalCase with "Service" suffix (e.g., `DashboardService`)
- **Interfaces**: PascalCase with "I" prefix (e.g., `ID3Widget`)
- **Files**: kebab-case (e.g., `dashboard-container.component.ts`)
- **Constants**: UPPER_SNAKE_CASE
- **Variables/Methods**: camelCase

## Governance

This constitution establishes the foundational principles, architectural decisions, development standards, and governance rules for the Angular v20 D3 Dashboards Application. All development activities, architectural decisions, and code contributions must align with these principles. This document serves as the supreme law of the project and shall guide all technical decisions.

### Amendment Process
This constitution may be amended only through:
1. Proposal of amendment with justification
2. Review by technical lead/architect
3. Team discussion and consensus
4. Update to this document with version increment
5. Communication to all team members

### Temporary Exceptions
Temporary exceptions to this constitution may be granted for:
- Experimental features
- Migration periods
- Critical bug fixes requiring immediate action

All exceptions MUST be documented and have an expiration date.

### Compliance
- All code contributions MUST comply with this constitution
- Code reviews MUST verify constitution compliance
- Automated tools (ESLint, Prettier, tests) MUST enforce standards
- Non-compliance MUST be addressed before code merge

### Violations
Violations of this constitution:
1. MUST be identified during code review
2. MUST be fixed before merge
3. MUST be documented if exception is granted
4. MUST trigger review of process if recurring

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE) | **Last Amended**: 2025-01-27
