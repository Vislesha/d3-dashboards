# Tasks: Test Application

**Input**: Design documents from `/specs/026-test-application/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are included as they are standard practice for Angular components and required by the constitution (minimum 80% coverage).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4, US5, US6)
- Include exact file paths in descriptions

## Path Conventions

- **Angular Application**: `src/app/`
- **Components**: `src/app/components/`
- **Services**: `src/app/services/`
- **Models**: `src/app/models/`
- **Assets**: `src/assets/`
- **Tests**: Co-located with source files (`.spec.ts`)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create directory structure for test dashboard component in src/app/components/test-dashboard/
- [ ] T002 Create directory structure for test chart widget component in src/app/components/test-chart-widget/
- [ ] T003 [P] Create directory structure for test services in src/app/services/
- [ ] T004 [P] Create directory structure for test models in src/app/models/
- [ ] T005 [P] Create directory structure for mock data in src/assets/data/
- [ ] T006 [P] Verify TypeScript ~5.8.0 strict mode is enabled in tsconfig.json
- [ ] T007 [P] Verify RxJS ~7.8.0 is installed in package.json
- [ ] T008 [P] Verify Jest ^29.7.0 and jest-preset-angular ^14.6.1 are configured
- [ ] T009 [P] Verify Angular v20.2.0 is installed in package.json
- [ ] T010 [P] Verify d3-dashboards library is properly linked/imported

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T011 Create ITestDashboardConfig interface in src/app/models/test-dashboard.model.ts
- [ ] T012 [P] Create ITestChartData interface in src/app/models/test-data.model.ts
- [ ] T013 [P] Create mock line chart data in src/assets/data/mock-chart-data.json
- [ ] T014 Create TestDataService class skeleton with @Injectable decorator in src/app/services/test-data.service.ts
- [ ] T015 [P] Create getMockLineChartData method in TestDataService in src/app/services/test-data.service.ts
- [ ] T016 [P] Export all models from appropriate barrel files (if using barrel exports)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Display Dashboard with Single Chart (Priority: P1) 🎯 MVP

**Goal**: Enable dashboard display with a single line chart widget so that the complete library functionality can be visually verified

**Independent Test**: Load the application and verify a dashboard with a line chart is displayed. Test with valid and invalid configurations.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T017 [P] [US1] Create unit test for test-dashboard component rendering in src/app/components/test-dashboard/test-dashboard.component.spec.ts
- [ ] T018 [P] [US1] Create unit test for test-dashboard with valid widget configuration in src/app/components/test-dashboard/test-dashboard.component.spec.ts
- [ ] T019 [P] [US1] Create unit test for test-dashboard with invalid widget configuration in src/app/components/test-dashboard/test-dashboard.component.spec.ts
- [ ] T020 [P] [US1] Create unit test for test-chart-widget component rendering in src/app/components/test-chart-widget/test-chart-widget.component.spec.ts
- [ ] T021 [P] [US1] Create unit test for test-chart-widget with data in src/app/components/test-chart-widget/test-chart-widget.component.spec.ts
- [ ] T022 [P] [US1] Create unit test for test-chart-widget loading state in src/app/components/test-chart-widget/test-chart-widget.component.spec.ts
- [ ] T023 [P] [US1] Create unit test for test-chart-widget error state in src/app/components/test-chart-widget/test-chart-widget.component.spec.ts

### Implementation for User Story 1

- [ ] T024 [US1] Create TestDashboardComponent class skeleton with @Component decorator in src/app/components/test-dashboard/test-dashboard.component.ts
- [ ] T025 [US1] Implement TestDashboardComponent template in src/app/components/test-dashboard/test-dashboard.component.html
- [ ] T026 [US1] Implement TestDashboardComponent styles in src/app/components/test-dashboard/test-dashboard.component.scss
- [ ] T027 [US1] Add OnPush change detection strategy to TestDashboardComponent in src/app/components/test-dashboard/test-dashboard.component.ts
- [ ] T028 [US1] Create TestChartWidgetComponent class skeleton with @Component decorator in src/app/components/test-chart-widget/test-chart-widget.component.ts
- [ ] T029 [US1] Implement TestChartWidgetComponent template in src/app/components/test-chart-widget/test-chart-widget.component.html
- [ ] T030 [US1] Implement TestChartWidgetComponent styles in src/app/components/test-chart-widget/test-chart-widget.component.scss
- [ ] T031 [US1] Add OnPush change detection strategy to TestChartWidgetComponent in src/app/components/test-chart-widget/test-chart-widget.component.ts
- [ ] T032 [US1] Integrate line chart widget rendering in TestChartWidgetComponent in src/app/components/test-chart-widget/test-chart-widget.component.ts
- [ ] T033 [US1] Add loading state handling in TestChartWidgetComponent in src/app/components/test-chart-widget/test-chart-widget.component.ts
- [ ] T034 [US1] Add error state handling in TestChartWidgetComponent in src/app/components/test-chart-widget/test-chart-widget.component.ts
- [ ] T035 [US1] Update app.routes.ts to route to TestDashboardComponent on home route in src/app/app.routes.ts
- [ ] T036 [US1] Update app.component.html to use router-outlet in src/app/app.component.html
- [ ] T037 [US1] Add proper cleanup (OnDestroy) in TestDashboardComponent in src/app/components/test-dashboard/test-dashboard.component.ts
- [ ] T038 [US1] Add proper cleanup (OnDestroy) in TestChartWidgetComponent in src/app/components/test-chart-widget/test-chart-widget.component.ts

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Dashboard with single chart can be displayed.

---

## Phase 4: User Story 2 - Dashboard Service Integration (Priority: P1)

**Goal**: Enable dashboard service integration so that dashboard CRUD operations can be tested

**Independent Test**: Create a dashboard using DashboardService, load it, and verify it displays correctly. Test error handling.

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T039 [P] [US2] Create unit test for dashboard creation using DashboardService in src/app/components/test-dashboard/test-dashboard.component.spec.ts
- [ ] T040 [P] [US2] Create unit test for dashboard loading using DashboardService in src/app/components/test-dashboard/test-dashboard.component.spec.ts
- [ ] T041 [P] [US2] Create unit test for dashboard update using DashboardService in src/app/components/test-dashboard/test-dashboard.component.spec.ts
- [ ] T042 [P] [US2] Create unit test for dashboard service error handling in src/app/components/test-dashboard/test-dashboard.component.spec.ts

### Implementation for User Story 2

- [ ] T043 [US2] Inject DashboardService in TestDashboardComponent in src/app/components/test-dashboard/test-dashboard.component.ts
- [ ] T044 [US2] Implement dashboard creation on component init in TestDashboardComponent in src/app/components/test-dashboard/test-dashboard.component.ts
- [ ] T045 [US2] Implement dashboard loading logic in TestDashboardComponent in src/app/components/test-dashboard/test-dashboard.component.ts
- [ ] T046 [US2] Implement dashboard update logic in TestDashboardComponent in src/app/components/test-dashboard/test-dashboard.component.ts
- [ ] T047 [US2] Add error handling for dashboard service operations in TestDashboardComponent in src/app/components/test-dashboard/test-dashboard.component.ts
- [ ] T048 [US2] Display error messages for dashboard service failures in TestDashboardComponent template in src/app/components/test-dashboard/test-dashboard.component.html

**Checkpoint**: At this point, User Story 2 should be fully functional and testable independently. Dashboard service integration works correctly.

---

## Phase 5: User Story 3 - Data Service Integration (Priority: P1)

**Goal**: Enable data service integration so that data loading, caching, and transformation can be tested

**Independent Test**: Load data through DataService and verify it is displayed in the chart. Test with static and API data sources. Test error handling.

### Tests for User Story 3

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T049 [P] [US3] Create unit test for data loading through DataService in src/app/components/test-chart-widget/test-chart-widget.component.spec.ts
- [ ] T050 [P] [US3] Create unit test for static data source in src/app/components/test-chart-widget/test-chart-widget.component.spec.ts
- [ ] T051 [P] [US3] Create unit test for API data source in src/app/components/test-chart-widget/test-chart-widget.component.spec.ts
- [ ] T052 [P] [US3] Create unit test for data service error handling in src/app/components/test-chart-widget/test-chart-widget.component.spec.ts

### Implementation for User Story 3

- [ ] T053 [US3] Inject DataService in TestChartWidgetComponent in src/app/components/test-chart-widget/test-chart-widget.component.ts
- [ ] T054 [US3] Implement data loading logic using DataService in TestChartWidgetComponent in src/app/components/test-chart-widget/test-chart-widget.component.ts
- [ ] T055 [US3] Configure widget with static data source in TestDashboardComponent in src/app/components/test-dashboard/test-dashboard.component.ts
- [ ] T056 [US3] Add data transformation handling in TestChartWidgetComponent in src/app/components/test-chart-widget/test-chart-widget.component.ts
- [ ] T057 [US3] Add error handling for data service operations in TestChartWidgetComponent in src/app/components/test-chart-widget/test-chart-widget.component.ts
- [ ] T058 [US3] Display error states for data service failures in TestChartWidgetComponent template in src/app/components/test-chart-widget/test-chart-widget.component.html

**Checkpoint**: At this point, User Story 3 should be fully functional and testable independently. Data service integration works correctly.

---

## Phase 6: User Story 4 - Chart Service Integration (Priority: P1)

**Goal**: Enable chart service integration so that chart creation, configuration, and rendering can be tested

**Independent Test**: Create a chart through ChartService and verify it renders correctly. Test configuration updates. Test error handling.

### Tests for User Story 4

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T059 [P] [US4] Create unit test for chart creation using ChartService in src/app/components/test-chart-widget/test-chart-widget.component.spec.ts
- [ ] T060 [P] [US4] Create unit test for chart configuration updates in src/app/components/test-chart-widget/test-chart-widget.component.spec.ts
- [ ] T061 [P] [US4] Create unit test for chart service error handling in src/app/components/test-chart-widget/test-chart-widget.component.spec.ts

### Implementation for User Story 4

- [ ] T062 [US4] Inject ChartService in TestChartWidgetComponent in src/app/components/test-chart-widget/test-chart-widget.component.ts
- [ ] T063 [US4] Implement chart creation logic using ChartService in TestChartWidgetComponent in src/app/components/test-chart-widget/test-chart-widget.component.ts
- [ ] T064 [US4] Implement chart configuration in TestChartWidgetComponent in src/app/components/test-chart-widget/test-chart-widget.component.ts
- [ ] T065 [US4] Add chart configuration update handling in TestChartWidgetComponent in src/app/components/test-chart-widget/test-chart-widget.component.ts
- [ ] T066 [US4] Add error handling for chart service operations in TestChartWidgetComponent in src/app/components/test-chart-widget/test-chart-widget.component.ts
- [ ] T067 [US4] Display error states for chart service failures in TestChartWidgetComponent template in src/app/components/test-chart-widget/test-chart-widget.component.html

**Checkpoint**: At this point, User Story 4 should be fully functional and testable independently. Chart service integration works correctly.

---

## Phase 7: User Story 5 - Filter Functionality (Priority: P2)

**Goal**: Enable filter functionality so that filter propagation and data filtering can be tested

**Independent Test**: Apply filters and verify the chart data updates. Test filter clearing. Test invalid filter values.

### Tests for User Story 5

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T068 [P] [US5] Create unit test for filter application in src/app/components/test-dashboard/test-dashboard.component.spec.ts
- [ ] T069 [P] [US5] Create unit test for filter propagation to widget in src/app/components/test-dashboard/test-dashboard.component.spec.ts
- [ ] T070 [P] [US5] Create unit test for filter clearing in src/app/components/test-dashboard/test-dashboard.component.spec.ts
- [ ] T071 [P] [US5] Create unit test for invalid filter values in src/app/components/test-dashboard/test-dashboard.component.spec.ts

### Implementation for User Story 5

- [ ] T072 [US5] Add filter input property to TestDashboardComponent in src/app/components/test-dashboard/test-dashboard.component.ts
- [ ] T073 [US5] Implement filter application logic in TestDashboardComponent in src/app/components/test-dashboard/test-dashboard.component.ts
- [ ] T074 [US5] Add filter propagation to widget in TestDashboardComponent in src/app/components/test-dashboard/test-dashboard.component.ts
- [ ] T075 [US5] Add filter input property to TestChartWidgetComponent in src/app/components/test-chart-widget/test-chart-widget.component.ts
- [ ] T076 [US5] Implement filter handling in TestChartWidgetComponent in src/app/components/test-chart-widget/test-chart-widget.component.ts
- [ ] T077 [US5] Add debouncing for filter updates in TestDashboardComponent in src/app/components/test-dashboard/test-dashboard.component.ts
- [ ] T078 [US5] Add filter UI controls in TestDashboardComponent template in src/app/components/test-dashboard/test-dashboard.component.html
- [ ] T079 [US5] Add error handling for invalid filter values in TestChartWidgetComponent in src/app/components/test-chart-widget/test-chart-widget.component.ts

**Checkpoint**: At this point, User Story 5 should be fully functional and testable independently. Filter functionality works correctly.

---

## Phase 8: User Story 6 - Responsive Layout (Priority: P2)

**Goal**: Enable responsive layout so that dashboard adaptation to different screen sizes can be tested

**Independent Test**: Resize browser window and verify dashboard layout adapts. Test on mobile, tablet, and desktop viewports.

### Tests for User Story 6

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T080 [P] [US6] Create unit test for responsive layout adaptation in src/app/components/test-dashboard/test-dashboard.component.spec.ts
- [ ] T081 [P] [US6] Create unit test for chart resizing in src/app/components/test-chart-widget/test-chart-widget.component.spec.ts

### Implementation for User Story 6

- [ ] T082 [US6] Add responsive CSS styles to TestDashboardComponent in src/app/components/test-dashboard/test-dashboard.component.scss
- [ ] T083 [US6] Add responsive CSS styles to TestChartWidgetComponent in src/app/components/test-chart-widget/test-chart-widget.component.scss
- [ ] T084 [US6] Implement window resize handling in TestDashboardComponent in src/app/components/test-dashboard/test-dashboard.component.ts
- [ ] T085 [US6] Implement chart resize handling in TestChartWidgetComponent in src/app/components/test-chart-widget/test-chart-widget.component.ts
- [ ] T086 [US6] Add responsive breakpoints for mobile, tablet, and desktop in TestDashboardComponent styles in src/app/components/test-dashboard/test-dashboard.component.scss

**Checkpoint**: At this point, User Story 6 should be fully functional and testable independently. Responsive layout works correctly.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final polish, error handling improvements, performance optimization, and cleanup

### Error Handling Improvements

- [ ] T087 Add comprehensive error handling for all component methods in src/app/components/test-dashboard/test-dashboard.component.ts
- [ ] T088 Add comprehensive error handling for all component methods in src/app/components/test-chart-widget/test-chart-widget.component.ts
- [ ] T089 Add user-friendly error messages for all error scenarios
- [ ] T090 Add retry mechanisms for failed operations

### Performance Optimization

- [ ] T091 Verify OnPush change detection is used in all components
- [ ] T092 Add performance monitoring for dashboard rendering (SC-001: < 2 seconds)
- [ ] T093 Add performance monitoring for filter propagation (SC-003: < 500ms)
- [ ] T094 Add performance monitoring for layout adaptation (SC-004: < 300ms)
- [ ] T095 Optimize subscription cleanup to prevent memory leaks

### Memory Leak Prevention

- [ ] T096 Verify proper cleanup in all component ngOnDestroy lifecycle hooks
- [ ] T097 Verify all subscriptions are properly unsubscribed
- [ ] T098 Add memory leak tests in component spec files
- [ ] T099 Verify no memory leaks through testing (SC-007)

### Documentation

- [ ] T100 Add JSDoc comments to all public methods in test components
- [ ] T101 Add JSDoc comments to all interfaces in test models
- [ ] T102 Add usage examples in component JSDoc comments
- [ ] T103 Add README for test application usage

### Final Validation

- [ ] T104 Run full test suite and verify 80%+ coverage
- [ ] T105 Run linter and fix all issues
- [ ] T106 Verify TypeScript strict mode compliance
- [ ] T107 Verify all success criteria are met (SC-001 through SC-008)
- [ ] T108 Verify all constitution requirements are met (SC-006)
- [ ] T109 Test application in browser and verify all functionality works

---

## Dependencies & Story Completion Order

### Story Dependencies

- **User Story 1 (Display Dashboard)** → No dependencies (can start after Phase 2)
- **User Story 2 (Dashboard Service)** → Depends on User Story 1 (needs dashboard component)
- **User Story 3 (Data Service)** → Depends on User Story 1 (needs chart widget component)
- **User Story 4 (Chart Service)** → Depends on User Story 1 and 3 (needs chart widget and data)
- **User Story 5 (Filters)** → Depends on User Story 1, 2, 3, 4 (needs complete dashboard with services)
- **User Story 6 (Responsive Layout)** → Depends on User Story 1 (needs dashboard component)

### Recommended Implementation Order

1. **Phase 1-2**: Setup and Foundation (MUST complete first)
2. **Phase 3**: User Story 1 - Display Dashboard (MVP, enables all other stories)
3. **Phase 4**: User Story 2 - Dashboard Service (can be done in parallel with US3)
4. **Phase 5**: User Story 3 - Data Service (can be done in parallel with US2)
5. **Phase 6**: User Story 4 - Chart Service (depends on US3)
6. **Phase 7**: User Story 5 - Filters (depends on US1-4)
7. **Phase 8**: User Story 6 - Responsive Layout (can be done in parallel with US5)
8. **Phase 9**: Polish & Cross-Cutting (final phase)

---

## Parallel Execution Opportunities

### Within User Story 1
- Tests T017-T023 can run in parallel (different test cases)
- Component creation T024-T031 can run in parallel with route updates T035-T036

### Within User Story 2
- Tests T039-T042 can run in parallel
- Implementation tasks T043-T048 can be done sequentially

### Within User Story 3
- Tests T049-T052 can run in parallel
- Implementation tasks T053-T058 can be done sequentially

### Within User Story 4
- Tests T059-T061 can run in parallel
- Implementation tasks T062-T067 can be done sequentially

### Within User Story 5
- Tests T068-T071 can run in parallel
- Implementation tasks T072-T079 can be done sequentially

### Within User Story 6
- Tests T080-T081 can run in parallel
- Implementation tasks T082-T086 can be done sequentially

### Cross-Story Parallelization
- User Story 2 and User Story 3 can be implemented in parallel (different services)
- User Story 6 can be implemented in parallel with User Story 5 (independent functionality)
- Phase 9 polish tasks can be done incrementally as stories complete

---

## Implementation Strategy

### MVP Scope (Minimum Viable Product)

**MVP includes**: Phase 1, Phase 2, Phase 3 (User Story 1), Phase 4 (User Story 2), Phase 5 (User Story 3), Phase 6 (User Story 4)

This delivers:
- ✅ Dashboard with single chart display
- ✅ Dashboard service integration
- ✅ Data service integration
- ✅ Chart service integration
- ✅ Basic error handling

**MVP excludes**:
- Filter functionality (User Story 5)
- Responsive layout (User Story 6)
- Advanced polish features

### Incremental Delivery

1. **Sprint 1**: MVP (Phases 1-6)
2. **Sprint 2**: Filters and Responsive (Phases 7-8)
3. **Sprint 3**: Polish & Optimization (Phase 9)

### Testing Strategy

- Write tests FIRST (TDD approach)
- Each user story has independent test suite
- Aim for 80%+ coverage per constitution requirement
- Test happy paths, error cases, and edge cases
- Performance tests for success criteria validation
- Manual testing in browser for visual verification

---

## Task Summary

- **Total Tasks**: 109
- **Setup Tasks**: 10 (Phase 1)
- **Foundation Tasks**: 6 (Phase 2)
- **User Story 1 Tasks**: 22 (7 tests + 15 implementation)
- **User Story 2 Tasks**: 10 (4 tests + 6 implementation)
- **User Story 3 Tasks**: 10 (4 tests + 6 implementation)
- **User Story 4 Tasks**: 9 (3 tests + 6 implementation)
- **User Story 5 Tasks**: 12 (4 tests + 8 implementation)
- **User Story 6 Tasks**: 7 (2 tests + 5 implementation)
- **Polish Tasks**: 23 (Phase 9)

**Estimated Parallel Opportunities**: ~35% of tasks can run in parallel (marked with [P])

