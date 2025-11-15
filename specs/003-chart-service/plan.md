# Implementation Plan: Chart Service

**Branch**: `003-chart-service` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-chart-service/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

The Chart Service provides chart factory methods, D3 utility functions, scale and axis helpers, and color palette management for the D3 dashboards application. This service will be implemented as an Angular injectable service that enables programmatic chart creation, provides reusable D3 operations, ensures consistent scale and axis creation, and manages color palettes for visual consistency. The service will follow the project's constitution requirements for type safety, D3.js exclusivity, and performance optimization.

## Technical Context

**Language/Version**: TypeScript ~5.8.0 (strict mode enabled)  
**Primary Dependencies**: Angular v20.2.0, D3.js ^7.8.5, RxJS ~7.8.0  
**Storage**: In-memory color palette registry (Map-based), no persistent storage  
**Testing**: Jest ^29.7.0, jest-preset-angular ^14.6.1 (minimum 80% coverage)  
**Target Platform**: Web browsers (Chrome, Firefox, Edge, Safari - latest versions)  
**Project Type**: Angular library (standalone services)  
**Performance Goals**: 
- Chart factory methods complete within 100ms (SC-001)
- Scale creation completes within 50ms (SC-002)
- Axis creation completes within 50ms (SC-003)
- Color palette retrieval completes within 10ms (SC-004)
- Handle up to 100 concurrent chart creations without performance degradation (SC-006)
- Error handling provides clear error messages within 50ms of failure (SC-009)  
**Constraints**: 
- Must use D3.js v7.8.5 exclusively for chart operations
- Must use TypeScript strict mode with complete type definitions
- Must be tree-shakeable (import specific D3 modules, not entire library)
- Must support all chart types: line, bar, pie, scatter, area, heatmap, treemap, force-graph, geo-map, gauge
- Must validate 100% of chart configurations before creation (SC-005)
- Must prevent memory leaks through proper cleanup (SC-010)  
**Scale/Scope**: 
- Support factory methods for all 10 chart types
- Provide D3 utility functions for common operations
- Manage multiple color palettes with at least 10 distinct colors per palette (SC-007)
- Support scale and axis helpers for all supported scale types (SC-008)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Type Safety First (NON-NEGOTIABLE) ✓
- **Status**: COMPLIANT
- **Details**: All service methods will have complete type definitions. Interfaces for ChartFactory, ScaleConfig, AxisConfig, and ColorPalette will be fully typed. No `any` types without justification. All D3 scale and axis types will be properly typed.

### D3.js Exclusivity (NON-NEGOTIABLE) ✓
- **Status**: COMPLIANT
- **Details**: Service will use D3.js v7.8.5 exclusively for all chart operations, scale creation, and axis creation. D3 imports will be tree-shakeable (import specific modules). D3 logic will be framework-agnostic where possible.

### Service Architecture (NON-NEGOTIABLE) ✓
- **Status**: COMPLIANT
- **Details**: Service will be injectable, provided at root level. All methods will return typed values (not Observables for synchronous operations like scale/axis creation, but factory methods may return Observables if needed). Error handling will be graceful with clear error messages.

### Chart Component Standards (NON-NEGOTIABLE) ✓
- **Status**: COMPLIANT
- **Details**: Chart factory methods will create chart instances that comply with chart component standards. D3 scales will be recalculated on data changes. D3 selections will be properly managed. Service will support all required chart types.

### Testing Requirements (NON-NEGOTIABLE) ✓
- **Status**: COMPLIANT
- **Details**: Service will have comprehensive unit tests using Jest. Minimum 80% coverage required. Tests will cover happy paths and error cases for all factory methods, utility functions, scale/axis helpers, and color palette management.

### Performance Optimization (NON-NEGOTIABLE) ✓
- **Status**: COMPLIANT
- **Details**: Service will meet all performance goals (SC-001 through SC-010). Chart factory methods < 100ms, scale/axis creation < 50ms, color palette retrieval < 10ms. Service will handle 100 concurrent chart creations without degradation.

**Gate Status**: ✅ PASS - All constitution requirements met

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
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
├── services/
│   ├── chart.service.ts              # Main chart service implementation
│   ├── chart.service.spec.ts         # Unit tests
│   └── chart.service.types.ts        # Type definitions and interfaces
├── utils/
│   ├── d3-utils.ts                   # D3 utility functions
│   ├── d3-utils.spec.ts              # Unit tests for D3 utils
│   ├── scale-helpers.ts              # Scale creation and update helpers
│   ├── scale-helpers.spec.ts         # Unit tests for scale helpers
│   ├── axis-helpers.ts               # Axis creation and update helpers
│   ├── axis-helpers.spec.ts          # Unit tests for axis helpers
│   ├── color-palette.ts              # Color palette management
│   └── color-palette.spec.ts         # Unit tests for color palette
└── entities/
    └── chart.interface.ts             # Chart-related interfaces (may extend existing)

projects/d3-dashboards/src/lib/public-api.ts
└── [Export ChartService and related types/utilities]
```

**Structure Decision**: Using the existing Angular library structure in `projects/d3-dashboards/src/lib/`. The service will be placed in the `services/` directory following the project's established patterns. D3 utility functions, scale helpers, axis helpers, and color palette management will be in the `utils/` directory. Type definitions will be in `entities/` directory. All exports will go through `public-api.ts` as required by the constitution.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
