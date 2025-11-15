# Implementation Tasks: Widget Component

**Feature Branch**: `006-widget-component`  
**Date**: 2025-01-27  
**Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

## Summary

This document provides an actionable, dependency-ordered task breakdown for implementing the Widget Component feature. Tasks are organized by user story priority to enable independent implementation and testing.

**Total Tasks**: 68  
**User Stories**: 4 (2 P1, 2 P2)  
**MVP Scope**: User Story 1 (Render Widget Based on Type) - 18 tasks

## Dependencies

### Story Completion Order

1. **User Story 1** (P1) - Render Widget Based on Type → **MUST complete first** (core functionality)
2. **User Story 2** (P1) - Display Widget Header → Can start after US1 foundational tasks
3. **User Story 3** (P2) - Handle Loading and Error States → Depends on US1 (needs component loading)
4. **User Story 4** (P2) - Widget Configuration Panel → Depends on US1 and US2 (needs widget rendering and header actions)

### External Dependencies

- `ID3Widget` interface (existing) from `projects/d3-dashboards/src/lib/entities/widget.interface.ts`
- `DataService` (existing) from `projects/d3-dashboards/src/lib/services/data.service.ts`
- `DashboardContainerComponent` (existing) from `projects/d3-dashboards/src/lib/components/dashboard-container/`

## Implementation Strategy

**MVP First**: Implement User Story 1 to deliver core widget rendering functionality. This enables basic widget display and can be tested independently.

**Incremental Delivery**: 
- Phase 1-2: Setup and foundational infrastructure
- Phase 3: Core widget rendering (MVP)
- Phase 4: Widget header and actions
- Phase 5: Loading and error states
- Phase 6: Configuration panel
- Phase 7: Polish and optimization

## Phase 1: Setup

**Goal**: Initialize project structure and verify dependencies

### Setup Tasks

- [X] T001 Create component directory structure at `projects/d3-dashboards/src/lib/components/widget/`
- [X] T002 Verify Angular 20.2.0 and TypeScript 5.8.0 are installed and configured
- [X] T003 Verify PrimeNG v20.0.0 is installed and available for dialog components
- [X] T004 Verify RxJS ~7.8.0 is installed and available for reactive state management
- [X] T005 Verify existing `ID3Widget` interface is accessible from `projects/d3-dashboards/src/lib/entities/widget.interface.ts`
- [X] T006 Verify existing `DataService` is accessible from `projects/d3-dashboards/src/lib/services/data.service.ts`

## Phase 2: Foundational

**Goal**: Create shared utilities and interfaces needed by all user stories

### Foundational Tasks

- [X] T007 Create `WidgetState` interface in `projects/d3-dashboards/src/lib/entities/widget-state.interface.ts` with fields: loading, error, data, componentLoaded, lastUpdated
- [X] T008 Create `WidgetActionEvent` interface in `projects/d3-dashboards/src/lib/entities/widget-action-event.interface.ts` with fields: action, widgetId, payload
- [X] T009 Create `WidgetConfigurationChangeEvent` interface in `projects/d3-dashboards/src/lib/entities/widget-config-change-event.interface.ts` with fields: widgetId, config, changedFields
- [X] T010 Create widget loader utility directory at `projects/d3-dashboards/src/lib/utils/`
- [X] T011 Create `widget-loader.util.ts` skeleton in `projects/d3-dashboards/src/lib/utils/widget-loader.util.ts` with export function `loadWidgetComponent(type: string): Promise<Type<any>>`

## Phase 3: User Story 1 - Render Widget Based on Type (P1)

**Goal**: Dynamically load and render appropriate component based on widget type

**Independent Test**: Provide widgets of different types and verify correct component is loaded and rendered

**Acceptance Criteria**:
- Widget with type 'line' loads line chart component
- Widget with type 'table' loads table widget component
- Widget with type 'tile' loads tile widget component
- Widget with invalid type displays error state

### Component Structure Tasks

- [X] T012 [US1] Create `widget.component.ts` file in `projects/d3-dashboards/src/lib/components/widget/widget.component.ts` with basic component structure
- [X] T013 [US1] Configure component as standalone with selector `lib-widget` in `projects/d3-dashboards/src/lib/components/widget/widget.component.ts`
- [X] T014 [US1] Set OnPush change detection strategy in `projects/d3-dashboards/src/lib/components/widget/widget.component.ts`
- [X] T015 [US1] Add required inputs: `widget: ID3Widget`, `isEditMode: boolean`, `filters: IFilterValues[]` in `projects/d3-dashboards/src/lib/components/widget/widget.component.ts`
- [X] T016 [US1] Add required outputs: `widgetUpdate`, `widgetDelete`, `widgetAction`, `dataLoad` in `projects/d3-dashboards/src/lib/components/widget/widget.component.ts`
- [X] T017 [US1] Implement `OnInit`, `OnChanges`, `OnDestroy` lifecycle hooks in `projects/d3-dashboards/src/lib/components/widget/widget.component.ts`

### Widget Loader Utility Tasks

- [X] T018 [P] [US1] Implement component registry Map in `projects/d3-dashboards/src/lib/utils/widget-loader.util.ts` for eager-loaded components (line, bar charts - placeholder entries for now)
- [X] T019 [P] [US1] Implement lazy loading map in `projects/d3-dashboards/src/lib/utils/widget-loader.util.ts` for optional components (pie, scatter, etc. - placeholder entries)
- [X] T020 [US1] Implement `loadWidgetComponent()` function with registry lookup and lazy loading fallback in `projects/d3-dashboards/src/lib/utils/widget-loader.util.ts`
- [X] T021 [US1] Add error handling for unknown widget types in `projects/d3-dashboards/src/lib/utils/widget-loader.util.ts`

### Dynamic Component Loading Tasks

- [X] T022 [US1] Inject `ViewContainerRef` in widget component constructor in `projects/d3-dashboards/src/lib/components/widget/widget.component.ts`
- [X] T023 [US1] Implement `loadComponent()` private method using `ViewContainerRef.createComponent()` in `projects/d3-dashboards/src/lib/components/widget/widget.component.ts`
- [X] T024 [US1] Add component reference storage and cleanup in `projects/d3-dashboards/src/lib/components/widget/widget.component.ts`
- [X] T025 [US1] Handle component loading errors with error state in `projects/d3-dashboards/src/lib/components/widget/widget.component.ts` (no retry per clarification)

### Validation Tasks

- [X] T026 [US1] Implement `validateWidget()` private method in `projects/d3-dashboards/src/lib/components/widget/widget.component.ts` checking required fields (id, type, title, config, position)
- [X] T027 [US1] Add widget type validation (must be one of 14 supported types) in `projects/d3-dashboards/src/lib/components/widget/widget.component.ts`
- [X] T028 [US1] Add type-specific configuration validation in `projects/d3-dashboards/src/lib/components/widget/widget.component.ts`
- [X] T029 [US1] Call validation in `ngOnInit()` before component loading in `projects/d3-dashboards/src/lib/components/widget/widget.component.ts`

### Template Tasks

- [X] T030 [US1] Create `widget.component.html` template file in `projects/d3-dashboards/src/lib/components/widget/widget.component.html` with dynamic component container
- [X] T031 [US1] Add `ng-container` with `#widgetContainer` template reference for dynamic component insertion in `projects/d3-dashboards/src/lib/components/widget/widget.component.html`
- [X] T032 [US1] Add error state display for invalid widget types in `projects/d3-dashboards/src/lib/components/widget/widget.component.html`

### Initialization Tasks

- [X] T033 [US1] Implement `ngOnInit()` to call validation, then load component in `projects/d3-dashboards/src/lib/components/widget/widget.component.ts`
- [X] T034 [US1] Implement `ngOnChanges()` to handle widget type changes and reload component if needed in `projects/d3-dashboards/src/lib/components/widget/widget.component.ts`

## Phase 4: User Story 2 - Display Widget Header (P1)

**Goal**: Display widget title and basic action buttons in header

**Independent Test**: Render widget and verify header displays title and action buttons

**Acceptance Criteria**:
- Widget title is displayed in header
- Action buttons (edit, delete, refresh, export) are available in edit mode
- Action buttons are hidden/limited when not in edit mode
- Action clicks emit appropriate events

### Header UI Tasks

- [X] T035 [US2] Add widget header section to `projects/d3-dashboards/src/lib/components/widget/widget.component.html` with title display
- [X] T036 [US2] Add basic action buttons (edit, delete, refresh, export) to header in `projects/d3-dashboards/src/lib/components/widget/widget.component.html`
- [X] T037 [US2] Implement `*ngIf` conditional rendering for action buttons based on `isEditMode` in `projects/d3-dashboards/src/lib/components/widget/widget.component.html`
- [X] T038 [US2] Add click handlers for action buttons in `projects/d3-dashboards/src/lib/components/widget/widget.component.html`

### Action Handling Tasks

- [X] T039 [US2] Implement `onActionClick(action: string)` method in `projects/d3-dashboards/src/lib/components/widget/widget.component.ts`
- [X] T040 [US2] Create `WidgetActionEvent` objects and emit via `widgetAction` output in `projects/d3-dashboards/src/lib/components/widget/widget.component.ts`
- [X] T041 [US2] Implement `onDeleteClick()` method that emits `widgetDelete` with widget ID in `projects/d3-dashboards/src/lib/components/widget/widget.component.ts`
- [X] T042 [US2] Implement `onExportClick()` method with format selection (CSV, JSON, PNG) in `projects/d3-dashboards/src/lib/components/widget/widget.component.ts`

### Styling Tasks

- [X] T043 [P] [US2] Create `widget.component.scss` file in `projects/d3-dashboards/src/lib/components/widget/widget.component.scss`
- [X] T044 [P] [US2] Add header styles with flexbox layout in `projects/d3-dashboards/src/lib/components/widget/widget.component.scss`
- [X] T045 [P] [US2] Add action button styles in `projects/d3-dashboards/src/lib/components/widget/widget.component.scss`
- [X] T046 [P] [US2] Add responsive styles for mobile/tablet in `projects/d3-dashboards/src/lib/components/widget/widget.component.scss`

## Phase 5: User Story 3 - Handle Loading and Error States (P2)

**Goal**: Display loading indicators, error messages, and empty states

**Independent Test**: Simulate loading and error states and verify appropriate UI is displayed

**Acceptance Criteria**:
- Loading indicator appears during data fetch
- Error message displays on data load failure (user-friendly with optional technical details)
- Empty state displays when no data
- Loading indicator removed when data received

### State Management Tasks

- [X] T047 [US3] Create `BehaviorSubject<WidgetState>` for state management in `projects/d3-dashboards/src/lib/components/widget/widget.component.ts`
- [X] T048 [US3] Implement `getState()` public method returning Observable in `projects/d3-dashboards/src/lib/components/widget/widget.component.ts`
- [X] T049 [US3] Implement state transitions (initial → loading → loaded/error/empty) in `projects/d3-dashboards/src/lib/components/widget/widget.component.ts`

### Data Loading Tasks

- [X] T050 [US3] Inject `DataService` in widget component constructor in `projects/d3-dashboards/src/lib/components/widget/widget.component.ts`
- [X] T051 [US3] Implement `loadData()` private method handling all data source types (api, static, computed) in `projects/d3-dashboards/src/lib/components/widget/widget.component.ts`
- [X] T052 [US3] Add data transformation support using `dataSource.transform` function in `projects/d3-dashboards/src/lib/components/widget/widget.component.ts`
- [X] T053 [US3] Update state to loading before data fetch in `projects/d3-dashboards/src/lib/components/widget/widget.component.ts`
- [X] T054 [US3] Update state to loaded/error/empty after data fetch completes in `projects/d3-dashboards/src/lib/components/widget/widget.component.ts`
- [X] T055 [US3] Emit `dataLoad` event when data successfully loads in `projects/d3-dashboards/src/lib/components/widget/widget.component.ts`
- [X] T056 [US3] Call `loadData()` in `ngOnInit()` after component loads in `projects/d3-dashboards/src/lib/components/widget/widget.component.ts`

### UI State Tasks

- [X] T057 [US3] Add loading state UI with spinner in `projects/d3-dashboards/src/lib/components/widget/widget.component.html`
- [X] T058 [US3] Add error state UI with user-friendly message and expandable technical details in `projects/d3-dashboards/src/lib/components/widget/widget.component.html`
- [X] T059 [US3] Add empty state UI with message in `projects/d3-dashboards/src/lib/components/widget/widget.component.html`
- [X] T060 [US3] Add `*ngIf` conditionals for state-based UI rendering in `projects/d3-dashboards/src/lib/components/widget/widget.component.html`
- [X] T061 [P] [US3] Add loading spinner styles in `projects/d3-dashboards/src/lib/components/widget/widget.component.scss`
- [X] T062 [P] [US3] Add error state styles in `projects/d3-dashboards/src/lib/components/widget/widget.component.scss`
- [X] T063 [P] [US3] Add empty state styles in `projects/d3-dashboards/src/lib/components/widget/widget.component.scss`

## Phase 6: User Story 4 - Widget Configuration Panel (P2)

**Goal**: Provide modal dialog for widget configuration

**Independent Test**: Open configuration panel, make changes, verify updates are applied

**Acceptance Criteria**:
- Modal dialog opens on configuration action trigger
- Settings modifications are reflected in widget
- Save emits widget update event and closes dialog
- Cancel closes dialog without applying changes

### Configuration Panel Tasks

- [X] T064 [US4] Inject PrimeNG DialogService in widget component constructor in `projects/d3-dashboards/src/lib/components/widget/widget.component.ts`
- [X] T065 [US4] Implement `openConfiguration()` public method opening PrimeNG Dialog in `projects/d3-dashboards/src/lib/components/widget/widget.component.ts`
- [X] T066 [US4] Create configuration form component or use PrimeNG form components in dialog in `projects/d3-dashboards/src/lib/components/widget/widget.component.ts`
- [X] T067 [US4] Implement save handler that validates and emits `widgetUpdate` event in `projects/d3-dashboards/src/lib/components/widget/widget.component.ts`
- [X] T068 [US4] Implement cancel handler that closes dialog without saving in `projects/d3-dashboards/src/lib/components/widget/widget.component.ts`

## Phase 7: Polish & Cross-Cutting Concerns

**Goal**: Cleanup, optimization, testing, and integration

### Cleanup Tasks

- [X] T069 Implement `ngOnDestroy()` with complete cleanup in `projects/d3-dashboards/src/lib/components/widget/widget.component.ts`
- [X] T070 Unsubscribe from all observables using takeUntil pattern in `projects/d3-dashboards/src/lib/components/widget/widget.component.ts`
- [X] T071 Destroy component reference if exists in `ngOnDestroy()` in `projects/d3-dashboards/src/lib/components/widget/widget.component.ts`
- [X] T072 Clear any timers or intervals in `ngOnDestroy()` in `projects/d3-dashboards/src/lib/components/widget/widget.component.ts`

### Testing Tasks

- [X] T073 Create `widget.component.spec.ts` test file in `projects/d3-dashboards/src/lib/components/widget/widget.component.spec.ts`
- [X] T074 Write unit tests for component loading based on widget type in `projects/d3-dashboards/src/lib/components/widget/widget.component.spec.ts`
- [X] T075 Write unit tests for invalid widget type handling in `projects/d3-dashboards/src/lib/components/widget/widget.component.spec.ts`
- [X] T076 Write unit tests for data loading (all source types) in `projects/d3-dashboards/src/lib/components/widget/widget.component.spec.ts`
- [X] T077 Write unit tests for state management and transitions in `projects/d3-dashboards/src/lib/components/widget/widget.component.spec.ts`
- [X] T078 Write unit tests for error handling in `projects/d3-dashboards/src/lib/components/widget/widget.component.spec.ts`
- [X] T079 Write unit tests for lifecycle hooks (OnInit, OnChanges, OnDestroy) in `projects/d3-dashboards/src/lib/components/widget/widget.component.spec.ts`
- [X] T080 Write unit tests for widget validation in `projects/d3-dashboards/src/lib/components/widget/widget.component.spec.ts`
- [X] T081 Write unit tests for action event emissions in `projects/d3-dashboards/src/lib/components/widget/widget.component.spec.ts`
- [X] T082 Write unit tests for configuration panel in `projects/d3-dashboards/src/lib/components/widget/widget.component.spec.ts`
- [ ] T083 Verify minimum 80% code coverage for widget component (requires running test suite)

### Integration Tasks

- [X] T084 Export `WidgetComponent` from `projects/d3-dashboards/src/lib/public-api.ts`
- [X] T085 Export widget-related interfaces from `projects/d3-dashboards/src/lib/public-api.ts`
- [X] T086 Export `loadWidgetComponent` utility from `projects/d3-dashboards/src/lib/public-api.ts`
- [X] T087 Update `DashboardContainerComponent` to use `WidgetComponent` in `projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.html`
- [ ] T088 Test integration with existing dashboard container (requires manual testing)
- [ ] T089 Verify filter propagation works correctly from dashboard to widgets (requires manual testing)

### Accessibility Tasks

- [X] T090 Add ARIA labels to all interactive elements in `projects/d3-dashboards/src/lib/components/widget/widget.component.html`
- [X] T091 Add ARIA live regions for loading and error states in `projects/d3-dashboards/src/lib/components/widget/widget.component.html`
- [X] T092 Ensure keyboard navigation works for action buttons in `projects/d3-dashboards/src/lib/components/widget/widget.component.html` (tabindex added)
- [X] T093 Ensure configuration dialog is keyboard accessible (PrimeNG Dialog handles this)

### Performance Optimization Tasks

- [X] T094 Verify OnPush change detection is working correctly (configured in component decorator)
- [X] T095 Add debouncing for rapid configuration changes (300ms default) in `projects/d3-dashboards/src/lib/components/widget/widget.component.ts`
- [X] T096 Verify lazy loading reduces bundle size for optional components (lazy loading map implemented)
- [ ] T097 Test performance with 50 widgets rendering simultaneously (requires performance testing)

## Parallel Execution Examples

### User Story 1 Parallel Opportunities

Tasks T018-T019 (component registry and lazy loading map) can be implemented in parallel as they modify different parts of the same file but don't depend on each other.

Tasks T043-T046 (styling tasks) can be implemented in parallel with other US2 tasks as they only affect CSS.

### User Story 2 Parallel Opportunities

Tasks T043-T046 (styling) can be done in parallel with T035-T042 (header UI and action handling).

### User Story 3 Parallel Opportunities

Tasks T061-T063 (error/loading/empty state styles) can be implemented in parallel with T057-T060 (UI state templates).

## Validation Checklist

- [x] All tasks follow format: `- [ ] T### [P?] [US?] Description with file path`
- [x] Tasks organized by user story priority
- [x] Each user story has independent test criteria
- [x] Dependencies clearly identified
- [x] File paths specified for all tasks
- [x] MVP scope identified (User Story 1)
- [x] Parallel execution opportunities marked
- [x] Testing tasks included
- [x] Integration tasks included
- [x] Accessibility tasks included
- [x] Performance optimization tasks included

## Notes

- Widget header advanced features (filter indicators, advanced styling, animations) are deferred to feature 007
- Chart components (line, bar, etc.) are placeholders until implemented in future features
- Configuration panel uses PrimeNG Dialog (modal overlay pattern)
- Export supports multiple formats (CSV, JSON, PNG) with user selection
- Error messages show user-friendly primary message with optional technical details
- Component loading failures show error state with no retry option (user must refresh or reconfigure)

