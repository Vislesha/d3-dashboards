# Implementation Plan: Widget Component

**Branch**: `006-widget-component` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-widget-component/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

The Widget Component is a dynamic component loader that renders appropriate child components based on widget type. It provides a unified interface for displaying widgets with headers, action menus, configuration panels, and proper handling of loading, error, and empty states. The component serves as the bridge between the dashboard container and individual widget implementations (charts, tables, tiles, etc.), enabling a flexible and extensible widget system.

## Technical Context

**Language/Version**: TypeScript ~5.8.0, Angular v20.2.0  
**Primary Dependencies**: Angular Core, Angular CDK, PrimeNG v20.0.0, RxJS ~7.8.0, D3.js ^7.8.5  
**Storage**: N/A (component-only, no persistence)  
**Testing**: Jest ^29.7.0, jest-preset-angular ^14.6.1  
**Target Platform**: Modern browsers (Chrome, Firefox, Edge, Safari - latest versions)  
**Project Type**: Web (Angular library component)  
**Performance Goals**: Widget components load and render within 200ms of widget data being available (SC-001), loading indicators appear within 100ms (SC-003), configuration panel opens within 150ms (SC-005)  
**Constraints**: Must handle up to 50 widgets rendering simultaneously without performance degradation (SC-008), must use OnPush change detection strategy, must support lazy loading for chart components  
**Scale/Scope**: Supports 14 widget types (line, bar, pie, scatter, area, heatmap, treemap, force-graph, geo-map, gauge, table, filter, tile, markdown), must validate 100% of widget configurations before rendering (SC-009)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Compliance Verification

✅ **Type Safety First (Article II, Section 2.1)**
- All code will be written in TypeScript with strict mode enabled
- All public APIs will have complete type definitions
- Interfaces and types will be exported through `public-api.ts`
- No use of `any` type without explicit justification

✅ **Component Architecture (Article II, Section 2.2)**
- Component will be standalone (Angular standalone architecture)
- Component will use OnPush change detection strategy
- Component will implement proper lifecycle hooks (OnInit, OnChanges, OnDestroy)
- All inputs and outputs will be properly typed and documented

✅ **Reactive Programming (Article II, Section 2.4)**
- Will use RxJS Observables for all asynchronous operations
- All subscriptions will be properly unsubscribed (use takeUntil pattern)
- No direct subscription without cleanup

✅ **Performance Optimization (Article II, Section 2.5)**
- Will implement lazy loading for chart components
- Will debounce filter updates and user interactions
- Will optimize bundle size through code splitting and tree shaking

✅ **Widget System Standards (Article VII)**
- Component will work with `ID3Widget` interface
- Will support all widget types defined in ID3Widget interface
- Will handle widget configuration properly
- Will support widget lifecycle (load, update, destroy)

✅ **Error Handling (Article V, Section 5.4)**
- All async operations will have error handling
- User-facing errors will be displayed appropriately
- Loading states will be shown for async operations
- No silent failures or unhandled promise rejections

✅ **Testing Requirements (Article X)**
- Component will have unit tests
- Minimum 80% code coverage for library code
- Tests will use Jest and jest-preset-angular

### Potential Concerns

⚠️ **Dynamic Component Loading**: Angular 20 uses `ViewContainerRef.createComponent()` for dynamic component loading (replacing deprecated ComponentFactoryResolver). This is the modern approach and complies with Angular best practices.

⚠️ **Lazy Loading Strategy**: Need to research best practices for lazy loading chart components in Angular 20 standalone components. May require dynamic imports or a component registry pattern.

## Project Structure

### Documentation (this feature)

```text
specs/006-widget-component/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
projects/d3-dashboards/src/lib/
├── components/
│   ├── dashboard-container/     # Existing component
│   └── widget/                  # NEW: Widget component
│       ├── widget.component.ts
│       ├── widget.component.html
│       ├── widget.component.scss
│       └── widget.component.spec.ts
│   └── widget-header/           # NEW: Widget header component (separate feature 007)
│       ├── widget-header.component.ts
│       ├── widget-header.component.html
│       ├── widget-header.component.scss
│       └── widget-header.component.spec.ts
├── charts/                      # Chart components (to be implemented in future features)
│   ├── line-chart/
│   ├── bar-chart/
│   └── ...
├── entities/
│   ├── widget.interface.ts      # Existing ID3Widget interface
│   └── ...
├── services/
│   ├── data.service.ts          # Existing data service
│   └── ...
└── utils/
    ├── widget-loader.util.ts    # NEW: Utility for dynamic component loading
    └── ...
```

**Structure Decision**: The widget component will be placed in `projects/d3-dashboards/src/lib/components/widget/` following the existing component structure pattern. The widget header will be a separate component (feature 007) but may be referenced in this plan for integration purposes. A utility module for dynamic component loading will be created to support the widget component's dynamic loading functionality.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations identified. All implementation decisions align with the constitution.

