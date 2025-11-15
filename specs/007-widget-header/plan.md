# Implementation Plan: Widget Header Component

**Branch**: `007-widget-header` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/007-widget-header/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

The Widget Header Component is a reusable Angular component that displays widget metadata and provides action access. It displays the widget title prominently, provides an action menu with edit, delete, refresh, and export options, shows filter indicators when filters are active, and displays loading/error indicators based on widget state. The component will be extracted from the current inline header implementation in the widget component and made into a standalone, reusable component that can be used across the dashboard system.

## Technical Context

**Language/Version**: TypeScript ~5.8.0, Angular v20.2.0  
**Primary Dependencies**: Angular Core, Angular CDK, PrimeNG v20.0.0 (Menu, Button, Badge components), PrimeIcons ^7.0.0, RxJS ~7.8.0  
**Storage**: N/A (presentation component, no persistence)  
**Testing**: Jest ^29.7.0, jest-preset-angular ^14.6.1  
**Target Platform**: Modern browsers (Chrome, Firefox, Edge, Safari - latest versions)  
**Project Type**: Web (Angular library component)  
**Performance Goals**: Widget header renders within 50ms of widget data being available (SC-001), action menu opens within 100ms (SC-002), filter indicators update within 200ms of filter changes (SC-003), loading indicators appear within 50ms of loading state initiation (SC-004)  
**Constraints**: Must handle titles up to 200 characters gracefully (SC-007), must support responsive design from 320px to 4K displays (SC-006), must maintain performance with rapid state changes (10+ changes per second) (SC-010), must support touch device interactions (SC-008)  
**Scale/Scope**: Must display up to 10 active filter indicators (SC-009), must handle action menu positioning to prevent overflow, must support all widget types (14 types)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Compliance Verification

✅ **Type Safety First (Article I)**
- All code will be written in TypeScript with strict mode enabled
- All public APIs will have complete type definitions
- Interfaces and types will be exported through `public-api.ts`
- No use of `any` type without explicit justification
- All inputs and outputs will be properly typed

✅ **Component Architecture (Article II)**
- Component will be standalone (Angular standalone architecture)
- Component will use OnPush change detection strategy
- Component will implement proper lifecycle hooks (OnInit, OnChanges, OnDestroy)
- All inputs and outputs will be properly typed and documented
- No NgModules will be used

✅ **Reactive Programming (Article IV)**
- Will use RxJS Observables for state changes if needed
- Will use Angular Signals for reactive state management where appropriate
- All subscriptions will be properly unsubscribed (use takeUntil pattern or async pipe)
- No direct subscription without cleanup

✅ **Performance Optimization (Article V)**
- Will debounce rapid state changes to prevent excessive re-renders
- Will use OnPush change detection strategy for optimal performance
- Will memoize expensive calculations (title truncation, filter indicator rendering)
- Will optimize rendering for rapid state changes (10+ changes per second)

✅ **Accessibility Standards (Article VIII)**
- All interactive elements will have ARIA labels (FR-010)
- Action menu will support keyboard navigation
- Focus indicators will be visible
- Screen reader support will be provided for all actions

✅ **Styling and Theming Standards (Article VII)**
- Component styles will be scoped
- Will use PrimeNG theme system
- Will support responsive design (mobile, tablet, desktop) (FR-009)
- Will use CSS variables for theming
- No inline styles (except for dynamic values)

✅ **Testing Requirements (Article VI)**
- Component will have unit tests
- Minimum 80% code coverage for library code
- Tests will use Jest and jest-preset-angular
- Tests will cover happy paths and error cases
- Tests will be isolated and independent

✅ **Error Handling (Article V, Section 5.4)**
- All async operations will have error handling
- Error indicators will be displayed appropriately (FR-007)
- Loading states will be shown for async operations
- No silent failures

### Potential Concerns

⚠️ **Action Menu Positioning**: Need to research best practices for PrimeNG Menu component positioning to prevent overflow on small screens. May need custom positioning logic or use Angular CDK Overlay for better control.

⚠️ **Filter Indicator Overflow**: Need to research best practices for displaying multiple filter indicators (up to 10) in a limited header space. May need a "more filters" indicator or scrollable container.

⚠️ **Rapid State Changes**: Need to research debouncing/throttling strategies for handling rapid state changes (10+ per second) without performance degradation. May need to use RxJS operators or Angular Signals.

⚠️ **Touch Device Interactions**: Need to research touch-friendly action menu interactions. PrimeNG Menu should handle this, but may need custom touch event handling.

## Project Structure

### Documentation (this feature)

```text
specs/007-widget-header/
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
│   ├── widget-header/           # NEW: Widget header component
│   │   ├── widget-header.component.ts
│   │   ├── widget-header.component.html
│   │   ├── widget-header.component.scss
│   │   └── widget-header.component.spec.ts
│   ├── widget/                  # Existing component (will be updated to use widget-header)
│   │   ├── widget.component.ts
│   │   ├── widget.component.html
│   │   ├── widget.component.scss
│   │   └── widget.component.spec.ts
│   └── dashboard-container/     # Existing component
├── entities/
│   ├── widget.interface.ts      # Existing ID3Widget interface
│   ├── widget-state.interface.ts # Existing IWidgetState interface
│   ├── widget-action-event.interface.ts # Existing IWidgetActionEvent interface
│   └── filter.interface.ts      # Existing IFilterValues interface
└── public-api.ts                 # Will export widget-header component
```

**Structure Decision**: The widget header component will be placed in `projects/d3-dashboards/src/lib/components/widget-header/` following the existing component structure pattern. The component will be a standalone Angular component that can be used by the widget component and potentially other components. The existing inline header implementation in the widget component will be replaced with this new component.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations identified. All implementation decisions align with the constitution.

