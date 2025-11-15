# Tasks: Chart Service

**Input**: Design documents from `/specs/003-chart-service/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are included as they are standard practice for Angular services and required by the constitution (minimum 80% coverage).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Angular Library**: `projects/d3-dashboards/src/lib/`
- **Services**: `projects/d3-dashboards/src/lib/services/`
- **Utils**: `projects/d3-dashboards/src/lib/utils/`
- **Entities**: `projects/d3-dashboards/src/lib/entities/`
- **Tests**: Co-located with source files (`.spec.ts`)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create directory structure for chart service in projects/d3-dashboards/src/lib/services/
- [X] T002 Create directory structure for chart utilities in projects/d3-dashboards/src/lib/utils/
- [X] T003 [P] Create directory structure for chart entities in projects/d3-dashboards/src/lib/entities/
- [X] T004 [P] Verify D3.js ^7.8.5 is installed in package.json
- [X] T005 [P] Verify TypeScript ~5.8.0 strict mode is enabled in tsconfig.json
- [X] T006 [P] Verify Jest ^29.7.0 and jest-preset-angular ^14.6.1 are configured

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T007 Create base error classes in projects/d3-dashboards/src/lib/services/chart.service.types.ts
- [X] T008 [P] Create IChartConfig interface in projects/d3-dashboards/src/lib/entities/chart.interface.ts
- [X] T009 [P] Create IScaleConfig interface in projects/d3-dashboards/src/lib/entities/chart.interface.ts
- [X] T010 [P] Create IAxisConfig interface in projects/d3-dashboards/src/lib/entities/chart.interface.ts
- [X] T011 [P] Create IColorPalette interface in projects/d3-dashboards/src/lib/entities/chart.interface.ts
- [X] T012 [P] Create IMargins interface in projects/d3-dashboards/src/lib/entities/chart.interface.ts
- [X] T013 [P] Create IValidationResult interface in projects/d3-dashboards/src/lib/entities/chart.interface.ts
- [X] T014 Create ChartService class skeleton with @Injectable decorator in projects/d3-dashboards/src/lib/services/chart.service.ts
- [X] T015 [P] Export all interfaces from projects/d3-dashboards/src/lib/public-api.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create Chart Instances (Priority: P1) 🎯 MVP

**Goal**: Enable programmatic chart creation through factory methods for all chart types

**Independent Test**: Call createChart() with different chart types and verify chart instances are created with render, update, destroy, and getConfig methods. Test with valid and invalid configurations.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T016 [P] [US1] Create unit test for createChart with valid line chart config in projects/d3-dashboards/src/lib/services/chart.service.spec.ts
- [X] T017 [P] [US1] Create unit test for createChart with valid bar chart config in projects/d3-dashboards/src/lib/services/chart.service.spec.ts
- [X] T018 [P] [US1] Create unit test for createChart with invalid chart type in projects/d3-dashboards/src/lib/services/chart.service.spec.ts
- [X] T019 [P] [US1] Create unit test for createChart with invalid chart config in projects/d3-dashboards/src/lib/services/chart.service.spec.ts
- [X] T020 [P] [US1] Create unit test for validateChartConfig with valid config in projects/d3-dashboards/src/lib/services/chart.service.spec.ts
- [X] T021 [P] [US1] Create unit test for validateChartConfig with invalid config in projects/d3-dashboards/src/lib/services/chart.service.spec.ts

### Implementation for User Story 1

- [X] T022 [US1] Create IChartInstance interface in projects/d3-dashboards/src/lib/entities/chart.interface.ts
- [X] T023 [US1] Create ChartType type definition in projects/d3-dashboards/src/lib/entities/chart.interface.ts
- [X] T024 [US1] Implement isValidChartType method in projects/d3-dashboards/src/lib/services/chart.service.ts
- [X] T025 [US1] Implement validateChartConfig method in projects/d3-dashboards/src/lib/services/chart.service.ts
- [X] T026 [US1] Create chart factory registry (Record<ChartType, factory function>) in projects/d3-dashboards/src/lib/services/chart.service.ts
- [X] T027 [US1] Implement createLineChart factory method in projects/d3-dashboards/src/lib/services/chart.service.ts
- [X] T028 [US1] Implement createBarChart factory method in projects/d3-dashboards/src/lib/services/chart.service.ts
- [X] T029 [US1] Implement createPieChart factory method in projects/d3-dashboards/src/lib/services/chart.service.ts
- [X] T030 [US1] Implement createScatterPlot factory method in projects/d3-dashboards/src/lib/services/chart.service.ts
- [X] T031 [US1] Implement createAreaChart factory method in projects/d3-dashboards/src/lib/services/chart.service.ts
- [X] T032 [US1] Implement createHeatmap factory method in projects/d3-dashboards/src/lib/services/chart.service.ts
- [X] T033 [US1] Implement createTreemap factory method in projects/d3-dashboards/src/lib/services/chart.service.ts
- [X] T034 [US1] Implement createForceGraph factory method in projects/d3-dashboards/src/lib/services/chart.service.ts
- [X] T035 [US1] Implement createGeoMap factory method in projects/d3-dashboards/src/lib/services/chart.service.ts
- [X] T036 [US1] Implement createGauge factory method in projects/d3-dashboards/src/lib/services/chart.service.ts
- [X] T037 [US1] Implement createChart method that routes to appropriate factory in projects/d3-dashboards/src/lib/services/chart.service.ts
- [X] T038 [US1] Add error handling for InvalidChartTypeError in projects/d3-dashboards/src/lib/services/chart.service.ts
- [X] T039 [US1] Add error handling for InvalidChartConfigError in projects/d3-dashboards/src/lib/services/chart.service.ts
- [X] T040 [US1] Export ChartService and related types from projects/d3-dashboards/src/lib/public-api.ts

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. All 10 chart types can be created programmatically.

---

## Phase 4: User Story 2 - D3 Utility Functions (Priority: P2)

**Goal**: Provide reusable D3 utility functions to reduce code duplication

**Independent Test**: Call utility functions (calculateMargins, extent, etc.) with various inputs and verify correct outputs. Functions should work independently of chart creation.

### Tests for User Story 2

- [ ] T041 [P] [US2] Create unit test for calculateMargins with default values in projects/d3-dashboards/src/lib/utils/d3-utils.spec.ts
- [ ] T042 [P] [US2] Create unit test for calculateMargins with custom values in projects/d3-dashboards/src/lib/utils/d3-utils.spec.ts
- [ ] T043 [P] [US2] Create unit test for calculateInnerDimensions in projects/d3-dashboards/src/lib/utils/d3-utils.spec.ts
- [ ] T044 [P] [US2] Create unit test for extent utility function in projects/d3-dashboards/src/lib/utils/d3-utils.spec.ts

### Implementation for User Story 2

- [ ] T045 [US2] Create d3-utils.ts file in projects/d3-dashboards/src/lib/utils/
- [ ] T046 [US2] Implement calculateMargins function in projects/d3-dashboards/src/lib/utils/d3-utils.ts
- [ ] T047 [US2] Implement calculateInnerDimensions function in projects/d3-dashboards/src/lib/utils/d3-utils.ts
- [ ] T048 [US2] Implement extent utility function in projects/d3-dashboards/src/lib/utils/d3-utils.ts
- [ ] T049 [US2] Add calculateMargins method to ChartService that delegates to d3-utils in projects/d3-dashboards/src/lib/services/chart.service.ts
- [ ] T050 [US2] Export d3-utils functions from projects/d3-dashboards/src/lib/public-api.ts

**Checkpoint**: At this point, User Story 2 should be fully functional. D3 utility functions are available for reuse across the application.

---

## Phase 5: User Story 3 - Scale and Axis Helpers (Priority: P2)

**Goal**: Provide consistent scale and axis creation helpers for all supported D3 scale types

**Independent Test**: Call createScale and createAxis with different configurations and verify correct D3 scales/axes are created. Test updateScale and updateAxis methods.

### Tests for User Story 3

- [ ] T051 [P] [US3] Create unit test for createScale with linear scale in projects/d3-dashboards/src/lib/utils/scale-helpers.spec.ts
- [ ] T052 [P] [US3] Create unit test for createScale with time scale in projects/d3-dashboards/src/lib/utils/scale-helpers.spec.ts
- [ ] T053 [P] [US3] Create unit test for createScale with ordinal scale in projects/d3-dashboards/src/lib/utils/scale-helpers.spec.ts
- [ ] T054 [P] [US3] Create unit test for createScale with band scale in projects/d3-dashboards/src/lib/utils/scale-helpers.spec.ts
- [ ] T055 [P] [US3] Create unit test for createScale with log scale in projects/d3-dashboards/src/lib/utils/scale-helpers.spec.ts
- [ ] T056 [P] [US3] Create unit test for createScale with pow scale in projects/d3-dashboards/src/lib/utils/scale-helpers.spec.ts
- [ ] T057 [P] [US3] Create unit test for createScale with sqrt scale in projects/d3-dashboards/src/lib/utils/scale-helpers.spec.ts
- [ ] T058 [P] [US3] Create unit test for createScale with invalid config in projects/d3-dashboards/src/lib/utils/scale-helpers.spec.ts
- [ ] T059 [P] [US3] Create unit test for updateScale in projects/d3-dashboards/src/lib/utils/scale-helpers.spec.ts
- [ ] T060 [P] [US3] Create unit test for createAxis with bottom orientation in projects/d3-dashboards/src/lib/utils/axis-helpers.spec.ts
- [ ] T061 [P] [US3] Create unit test for createAxis with top orientation in projects/d3-dashboards/src/lib/utils/axis-helpers.spec.ts
- [ ] T062 [P] [US3] Create unit test for createAxis with left orientation in projects/d3-dashboards/src/lib/utils/axis-helpers.spec.ts
- [ ] T063 [P] [US3] Create unit test for createAxis with right orientation in projects/d3-dashboards/src/lib/utils/axis-helpers.spec.ts
- [ ] T064 [P] [US3] Create unit test for createAxis with tick configuration in projects/d3-dashboards/src/lib/utils/axis-helpers.spec.ts
- [ ] T065 [P] [US3] Create unit test for createAxis with invalid config in projects/d3-dashboards/src/lib/utils/axis-helpers.spec.ts
- [ ] T066 [P] [US3] Create unit test for updateAxis in projects/d3-dashboards/src/lib/utils/axis-helpers.spec.ts
- [ ] T067 [P] [US3] Create unit test for validateScaleConfig in projects/d3-dashboards/src/lib/services/chart.service.spec.ts
- [ ] T068 [P] [US3] Create unit test for validateAxisConfig in projects/d3-dashboards/src/lib/services/chart.service.spec.ts

### Implementation for User Story 3

- [ ] T069 [US3] Create scale-helpers.ts file in projects/d3-dashboards/src/lib/utils/
- [ ] T070 [US3] Import D3 scale modules (scaleLinear, scaleTime, scaleOrdinal, scaleBand, etc.) in projects/d3-dashboards/src/lib/utils/scale-helpers.ts
- [ ] T071 [US3] Create ScaleType type definition in projects/d3-dashboards/src/lib/entities/chart.interface.ts
- [ ] T072 [US3] Implement createScale function for linear scales in projects/d3-dashboards/src/lib/utils/scale-helpers.ts
- [ ] T073 [US3] Implement createScale function for time scales in projects/d3-dashboards/src/lib/utils/scale-helpers.ts
- [ ] T074 [US3] Implement createScale function for ordinal scales in projects/d3-dashboards/src/lib/utils/scale-helpers.ts
- [ ] T075 [US3] Implement createScale function for band scales in projects/d3-dashboards/src/lib/utils/scale-helpers.ts
- [ ] T076 [US3] Implement createScale function for log scales in projects/d3-dashboards/src/lib/utils/scale-helpers.ts
- [ ] T077 [US3] Implement createScale function for pow scales in projects/d3-dashboards/src/lib/utils/scale-helpers.ts
- [ ] T078 [US3] Implement createScale function for sqrt scales in projects/d3-dashboards/src/lib/utils/scale-helpers.ts
- [ ] T079 [US3] Implement updateScale function in projects/d3-dashboards/src/lib/utils/scale-helpers.ts
- [ ] T080 [US3] Implement validateScaleConfig function in projects/d3-dashboards/src/lib/services/chart.service.ts
- [ ] T081 [US3] Create axis-helpers.ts file in projects/d3-dashboards/src/lib/utils/
- [ ] T082 [US3] Import D3 axis modules (axisBottom, axisTop, axisLeft, axisRight) in projects/d3-dashboards/src/lib/utils/axis-helpers.ts
- [ ] T083 [US3] Create AxisOrientation type definition in projects/d3-dashboards/src/lib/entities/chart.interface.ts
- [ ] T084 [US3] Implement createAxis function for bottom orientation in projects/d3-dashboards/src/lib/utils/axis-helpers.ts
- [ ] T085 [US3] Implement createAxis function for top orientation in projects/d3-dashboards/src/lib/utils/axis-helpers.ts
- [ ] T086 [US3] Implement createAxis function for left orientation in projects/d3-dashboards/src/lib/utils/axis-helpers.ts
- [ ] T087 [US3] Implement createAxis function for right orientation in projects/d3-dashboards/src/lib/utils/axis-helpers.ts
- [ ] T088 [US3] Implement tick configuration support in createAxis in projects/d3-dashboards/src/lib/utils/axis-helpers.ts
- [ ] T089 [US3] Implement updateAxis function in projects/d3-dashboards/src/lib/utils/axis-helpers.ts
- [ ] T090 [US3] Implement validateAxisConfig function in projects/d3-dashboards/src/lib/services/chart.service.ts
- [ ] T091 [US3] Add createScale method to ChartService that delegates to scale-helpers in projects/d3-dashboards/src/lib/services/chart.service.ts
- [ ] T092 [US3] Add createAxis method to ChartService that delegates to axis-helpers in projects/d3-dashboards/src/lib/services/chart.service.ts
- [ ] T093 [US3] Add updateScale method to ChartService that delegates to scale-helpers in projects/d3-dashboards/src/lib/services/chart.service.ts
- [ ] T094 [US3] Add updateAxis method to ChartService that delegates to axis-helpers in projects/d3-dashboards/src/lib/services/chart.service.ts
- [ ] T095 [US3] Add error handling for InvalidScaleConfigError in projects/d3-dashboards/src/lib/services/chart.service.ts
- [ ] T096 [US3] Add error handling for InvalidAxisConfigError in projects/d3-dashboards/src/lib/services/chart.service.ts
- [ ] T097 [US3] Export scale-helpers and axis-helpers from projects/d3-dashboards/src/lib/public-api.ts

**Checkpoint**: At this point, User Story 3 should be fully functional. All scale types and axis orientations are supported with consistent helpers.

---

## Phase 6: User Story 4 - Color Palette Management (Priority: P2)

**Goal**: Manage color palettes for visual consistency across charts

**Independent Test**: Call getColorPalette, setColorPalette, setDefaultPalette, and getColors with various inputs. Verify palettes are registered, retrieved, and colors are returned correctly.

### Tests for User Story 4

- [ ] T098 [P] [US4] Create unit test for getColorPalette with existing palette in projects/d3-dashboards/src/lib/utils/color-palette.spec.ts
- [ ] T099 [P] [US4] Create unit test for getColorPalette with non-existent palette in projects/d3-dashboards/src/lib/utils/color-palette.spec.ts
- [ ] T100 [P] [US4] Create unit test for setColorPalette with valid palette in projects/d3-dashboards/src/lib/utils/color-palette.spec.ts
- [ ] T101 [P] [US4] Create unit test for setColorPalette with invalid palette (less than 10 colors) in projects/d3-dashboards/src/lib/utils/color-palette.spec.ts
- [ ] T102 [P] [US4] Create unit test for setDefaultPalette in projects/d3-dashboards/src/lib/utils/color-palette.spec.ts
- [ ] T103 [P] [US4] Create unit test for getColors with default palette in projects/d3-dashboards/src/lib/utils/color-palette.spec.ts
- [ ] T104 [P] [US4] Create unit test for getColors with specific palette in projects/d3-dashboards/src/lib/utils/color-palette.spec.ts
- [ ] T105 [P] [US4] Create unit test for getColors with count greater than palette size (cycling) in projects/d3-dashboards/src/lib/utils/color-palette.spec.ts
- [ ] T106 [P] [US4] Create unit test for default palette registration in projects/d3-dashboards/src/lib/utils/color-palette.spec.ts

### Implementation for User Story 4

- [ ] T107 [US4] Create color-palette.ts file in projects/d3-dashboards/src/lib/utils/
- [ ] T108 [US4] Create ColorPaletteManager class in projects/d3-dashboards/src/lib/utils/color-palette.ts
- [ ] T109 [US4] Implement palette registry (Map<string, ColorPalette>) in projects/d3-dashboards/src/lib/utils/color-palette.ts
- [ ] T110 [US4] Implement defaultPaletteName property in projects/d3-dashboards/src/lib/utils/color-palette.ts
- [ ] T111 [US4] Implement registerDefaultPalettes method with D3 categorical color scheme in projects/d3-dashboards/src/lib/utils/color-palette.ts
- [ ] T112 [US4] Implement getColorPalette method in projects/d3-dashboards/src/lib/utils/color-palette.ts
- [ ] T113 [US4] Implement setColorPalette method with validation (min 10 colors) in projects/d3-dashboards/src/lib/utils/color-palette.ts
- [ ] T114 [US4] Implement setDefaultPalette method in projects/d3-dashboards/src/lib/utils/color-palette.ts
- [ ] T115 [US4] Implement getColors method with color cycling in projects/d3-dashboards/src/lib/utils/color-palette.ts
- [ ] T116 [US4] Add error handling for PaletteNotFoundError in projects/d3-dashboards/src/lib/utils/color-palette.ts
- [ ] T117 [US4] Add error handling for InvalidColorPaletteError in projects/d3-dashboards/src/lib/utils/color-palette.ts
- [ ] T118 [US4] Initialize ColorPaletteManager instance in ChartService constructor in projects/d3-dashboards/src/lib/services/chart.service.ts
- [ ] T119 [US4] Add getColorPalette method to ChartService that delegates to ColorPaletteManager in projects/d3-dashboards/src/lib/services/chart.service.ts
- [ ] T120 [US4] Add setColorPalette method to ChartService that delegates to ColorPaletteManager in projects/d3-dashboards/src/lib/services/chart.service.ts
- [ ] T121 [US4] Add setDefaultPalette method to ChartService that delegates to ColorPaletteManager in projects/d3-dashboards/src/lib/services/chart.service.ts
- [ ] T122 [US4] Add getColors method to ChartService that delegates to ColorPaletteManager in projects/d3-dashboards/src/lib/services/chart.service.ts
- [ ] T123 [US4] Export color-palette utilities from projects/d3-dashboards/src/lib/public-api.ts

**Checkpoint**: At this point, User Story 4 should be fully functional. Color palettes can be managed and retrieved for consistent chart coloring.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T124 [P] Verify all tests achieve minimum 80% code coverage in projects/d3-dashboards/src/lib/services/ and projects/d3-dashboards/src/lib/utils/
- [ ] T125 [P] Add JSDoc comments to all public methods in projects/d3-dashboards/src/lib/services/chart.service.ts
- [ ] T126 [P] Add JSDoc comments to all utility functions in projects/d3-dashboards/src/lib/utils/
- [ ] T127 [P] Add JSDoc comments to all interfaces in projects/d3-dashboards/src/lib/entities/chart.interface.ts
- [ ] T128 Performance testing: Verify chart factory methods complete within 100ms (SC-001)
- [ ] T129 Performance testing: Verify scale creation completes within 50ms (SC-002)
- [ ] T130 Performance testing: Verify axis creation completes within 50ms (SC-003)
- [ ] T131 Performance testing: Verify color palette retrieval completes within 10ms (SC-004)
- [ ] T132 Performance testing: Verify service handles 100 concurrent chart creations (SC-006)
- [ ] T133 Performance testing: Verify error handling provides clear messages within 50ms (SC-009)
- [ ] T134 Memory leak testing: Verify chart cleanup prevents memory leaks (SC-010)
- [ ] T135 [P] Update quickstart.md examples to match actual implementation
- [ ] T136 [P] Run ESLint and fix any violations in projects/d3-dashboards/src/lib/services/ and projects/d3-dashboards/src/lib/utils/
- [ ] T137 [P] Run Prettier formatting on all new files
- [ ] T138 Verify all exports are properly added to projects/d3-dashboards/src/lib/public-api.ts
- [ ] T139 Integration test: Create end-to-end test using quickstart.md examples

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (US1 → US2/US3/US4)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent, no dependencies on other stories
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Independent, no dependencies on other stories
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Independent, no dependencies on other stories

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Interfaces/types before implementations
- Helper functions before service methods
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Different chart factory methods within US1 marked [P] can run in parallel
- Different scale types within US3 marked [P] can run in parallel
- Different axis orientations within US3 marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Create unit test for createChart with valid line chart config"
Task: "Create unit test for createChart with valid bar chart config"
Task: "Create unit test for createChart with invalid chart type"
Task: "Create unit test for createChart with invalid chart config"
Task: "Create unit test for validateChartConfig with valid config"
Task: "Create unit test for validateChartConfig with invalid config"

# Launch all chart factory methods together (after tests pass):
Task: "Implement createLineChart factory method"
Task: "Implement createBarChart factory method"
Task: "Implement createPieChart factory method"
Task: "Implement createScatterPlot factory method"
Task: "Implement createAreaChart factory method"
Task: "Implement createHeatmap factory method"
Task: "Implement createTreemap factory method"
Task: "Implement createForceGraph factory method"
Task: "Implement createGeoMap factory method"
Task: "Implement createGauge factory method"
```

---

## Parallel Example: User Story 3

```bash
# Launch all scale type implementations together:
Task: "Implement createScale function for linear scales"
Task: "Implement createScale function for time scales"
Task: "Implement createScale function for ordinal scales"
Task: "Implement createScale function for band scales"
Task: "Implement createScale function for log scales"
Task: "Implement createScale function for pow scales"
Task: "Implement createScale function for sqrt scales"

# Launch all axis orientation implementations together:
Task: "Implement createAxis function for bottom orientation"
Task: "Implement createAxis function for top orientation"
Task: "Implement createAxis function for left orientation"
Task: "Implement createAxis function for right orientation"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Create Chart Instances)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Chart Factory)
   - Developer B: User Story 2 (D3 Utils)
   - Developer C: User Story 3 (Scale/Axis Helpers)
   - Developer D: User Story 4 (Color Palettes)
3. Stories complete and integrate independently

---

## Task Summary

- **Total Tasks**: 139
- **Phase 1 (Setup)**: 6 tasks
- **Phase 2 (Foundational)**: 9 tasks
- **Phase 3 (US1 - Chart Factory)**: 25 tasks (6 tests + 19 implementation)
- **Phase 4 (US2 - D3 Utils)**: 10 tasks (4 tests + 6 implementation)
- **Phase 5 (US3 - Scale/Axis Helpers)**: 47 tasks (18 tests + 29 implementation)
- **Phase 6 (US4 - Color Palettes)**: 26 tasks (9 tests + 17 implementation)
- **Phase 7 (Polish)**: 16 tasks

### Parallel Opportunities

- **Phase 1**: 4 parallel tasks
- **Phase 2**: 7 parallel tasks
- **Phase 3**: 6 parallel test tasks, 10 parallel factory method tasks
- **Phase 4**: 4 parallel test tasks
- **Phase 5**: 18 parallel test tasks, 7 parallel scale tasks, 4 parallel axis tasks
- **Phase 6**: 9 parallel test tasks
- **Phase 7**: 10 parallel tasks

### Independent Test Criteria

- **US1**: Call createChart() with different chart types, verify instances created with all required methods
- **US2**: Call utility functions with various inputs, verify correct outputs
- **US3**: Call createScale/createAxis with different configs, verify correct D3 objects created
- **US4**: Call palette management methods, verify palettes registered/retrieved correctly

### Suggested MVP Scope

- **MVP**: Phase 1 + Phase 2 + Phase 3 (User Story 1)
- **Rationale**: Chart factory is core functionality. Other stories add value but are not blocking for basic chart creation.

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All D3 imports must be tree-shakeable (import specific modules)
- All code must follow TypeScript strict mode
- Minimum 80% test coverage required by constitution
- All public APIs must have JSDoc comments

