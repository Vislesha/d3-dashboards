# Tasks: Dashboard Service

**Input**: Design documents from `/specs/004-dashboard-service/`
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

- [X] T001 Create directory structure for dashboard service in projects/d3-dashboards/src/lib/services/
- [X] T002 Create directory structure for dashboard utilities in projects/d3-dashboards/src/lib/utils/
- [X] T003 [P] Verify TypeScript ~5.8.0 strict mode is enabled in tsconfig.json
- [X] T004 [P] Verify RxJS ~7.8.0 is installed in package.json
- [X] T005 [P] Verify Jest ^29.7.0 and jest-preset-angular ^14.6.1 are configured
- [X] T006 [P] Verify Angular v20.2.0 is installed in package.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T007 Create base error classes in projects/d3-dashboards/src/lib/services/dashboard.service.types.ts
- [X] T008 [P] Create IDashboard interface in projects/d3-dashboards/src/lib/entities/dashboard.interface.ts
- [X] T009 [P] Create IDashboardConfig interface in projects/d3-dashboards/src/lib/entities/dashboard.interface.ts
- [X] T010 [P] Create IDashboardState interface in projects/d3-dashboards/src/lib/entities/dashboard.interface.ts
- [X] T011 [P] Create IDashboardStorageEntry interface in projects/d3-dashboards/src/lib/entities/dashboard.interface.ts
- [X] T012 [P] Create IValidationResult interface in projects/d3-dashboards/src/lib/entities/dashboard.interface.ts
- [X] T013 [P] Create IDashboardServiceError interface in projects/d3-dashboards/src/lib/entities/dashboard.interface.ts
- [X] T014 Create DashboardService class skeleton with @Injectable decorator in projects/d3-dashboards/src/lib/services/dashboard.service.ts
- [X] T015 [P] Create IDashboardStorage interface for storage abstraction in projects/d3-dashboards/src/lib/services/dashboard.service.types.ts
- [X] T016 [P] Create InMemoryDashboardStorage implementation in projects/d3-dashboards/src/lib/services/dashboard.service.types.ts
- [X] T017 [P] Create LocalStorageDashboardStorage implementation in projects/d3-dashboards/src/lib/services/dashboard.service.types.ts
- [X] T018 Export all interfaces from projects/d3-dashboards/src/lib/public-api.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Create and Save Dashboards (Priority: P1) 🎯 MVP

**Goal**: Enable dashboard creation and persistence so that dashboard configurations can be saved

**Independent Test**: Call create() with a dashboard configuration and verify a dashboard is created with a valid UUID, saved to storage, and the dashboard ID is returned. Test with valid and invalid configurations.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T019 [P] [US1] Create unit test for create with valid dashboard config in projects/d3-dashboards/src/lib/services/dashboard.service.spec.ts
- [X] T020 [P] [US1] Create unit test for create with invalid dashboard config in projects/d3-dashboards/src/lib/services/dashboard.service.spec.ts
- [X] T021 [P] [US1] Create unit test for create with missing title in projects/d3-dashboards/src/lib/services/dashboard.service.spec.ts
- [X] T022 [P] [US1] Create unit test for create with widgets in projects/d3-dashboards/src/lib/services/dashboard.service.spec.ts
- [X] T023 [P] [US1] Create unit test for create save failure handling in projects/d3-dashboards/src/lib/services/dashboard.service.spec.ts
- [X] T024 [P] [US1] Create unit test for validateDashboard with valid config in projects/d3-dashboards/src/lib/services/dashboard.service.spec.ts
- [X] T025 [P] [US1] Create unit test for validateDashboard with invalid config in projects/d3-dashboards/src/lib/services/dashboard.service.spec.ts

### Implementation for User Story 1

- [X] T026 [US1] Implement UUID generation utility function in projects/d3-dashboards/src/lib/utils/dashboard-validator.util.ts
- [X] T027 [US1] Implement validateDashboard method in projects/d3-dashboards/src/lib/utils/dashboard-validator.util.ts
- [X] T028 [US1] Implement DashboardValidationError class in projects/d3-dashboards/src/lib/services/dashboard.service.types.ts
- [X] T029 [US1] Implement create method in projects/d3-dashboards/src/lib/services/dashboard.service.ts
- [X] T030 [US1] Add storage initialization in DashboardService constructor in projects/d3-dashboards/src/lib/services/dashboard.service.ts
- [X] T031 [US1] Implement storage.save method in InMemoryDashboardStorage in projects/d3-dashboards/src/lib/services/dashboard.service.types.ts
- [X] T032 [US1] Implement storage.save method in LocalStorageDashboardStorage in projects/d3-dashboards/src/lib/services/dashboard.service.types.ts
- [X] T033 [US1] Add error handling for validation errors in create method in projects/d3-dashboards/src/lib/services/dashboard.service.ts
- [X] T034 [US1] Add error handling for save failures in create method in projects/d3-dashboards/src/lib/services/dashboard.service.ts
- [X] T035 [US1] Export DashboardService from projects/d3-dashboards/src/lib/public-api.ts

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Dashboards can be created and saved.

---

## Phase 4: User Story 2 - Load and Retrieve Dashboards (Priority: P1)

**Goal**: Enable loading and listing saved dashboards so that users can access previously created dashboards

**Independent Test**: Call load() with a saved dashboard ID and verify the dashboard configuration is retrieved. Call list() and verify all dashboards are returned. Test with non-existent dashboard ID and verify appropriate error is returned.

### Tests for User Story 2

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T036 [P] [US2] Create unit test for load with valid dashboard ID in projects/d3-dashboards/src/lib/services/dashboard.service.spec.ts
- [X] T037 [P] [US2] Create unit test for load with non-existent dashboard ID in projects/d3-dashboards/src/lib/services/dashboard.service.spec.ts
- [X] T038 [P] [US2] Create unit test for load with corrupted dashboard data in projects/d3-dashboards/src/lib/services/dashboard.service.spec.ts
- [X] T039 [P] [US2] Create unit test for list with multiple dashboards in projects/d3-dashboards/src/lib/services/dashboard.service.spec.ts
- [X] T040 [P] [US2] Create unit test for list with no dashboards in projects/d3-dashboards/src/lib/services/dashboard.service.spec.ts
- [X] T041 [P] [US2] Create unit test for load validation of corrupted data in projects/d3-dashboards/src/lib/services/dashboard.service.spec.ts

### Implementation for User Story 2

- [X] T042 [US2] Implement DashboardNotFoundError class in projects/d3-dashboards/src/lib/services/dashboard.service.types.ts
- [X] T043 [US2] Implement load method in projects/d3-dashboards/src/lib/services/dashboard.service.ts
- [X] T044 [US2] Implement list method in projects/d3-dashboards/src/lib/services/dashboard.service.ts
- [X] T045 [US2] Implement storage.load method in InMemoryDashboardStorage in projects/d3-dashboards/src/lib/services/dashboard.service.types.ts
- [X] T046 [US2] Implement storage.list method in InMemoryDashboardStorage in projects/d3-dashboards/src/lib/services/dashboard.service.types.ts
- [X] T047 [US2] Implement storage.load method in LocalStorageDashboardStorage in projects/d3-dashboards/src/lib/services/dashboard.service.types.ts
- [X] T048 [US2] Implement storage.list method in LocalStorageDashboardStorage in projects/d3-dashboards/src/lib/services/dashboard.service.types.ts
- [X] T049 [US2] Add validation on load to reject corrupted data in projects/d3-dashboards/src/lib/services/dashboard.service.ts
- [X] T050 [US2] Add error handling for DashboardNotFoundError in load method in projects/d3-dashboards/src/lib/services/dashboard.service.ts
- [X] T051 [US2] Add error handling for load failures in projects/d3-dashboards/src/lib/services/dashboard.service.ts

**Checkpoint**: At this point, User Story 2 should be fully functional and testable independently. Dashboards can be loaded and listed.

---

## Phase 5: User Story 3 - Widget Management (Priority: P2)

**Goal**: Enable widget management (add, update, remove) so that dashboards can be customized with widgets

**Independent Test**: Call addWidget() with a dashboard ID and widget, verify widget is added and dashboard is saved. Call updateWidget() and verify widget is updated. Call removeWidget() and verify widget is removed. Test with duplicate widget IDs and verify error is returned.

### Tests for User Story 3

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T052 [P] [US3] Create unit test for addWidget with valid widget in projects/d3-dashboards/src/lib/services/dashboard.service.spec.ts
- [X] T053 [P] [US3] Create unit test for addWidget with duplicate widget ID in projects/d3-dashboards/src/lib/services/dashboard.service.spec.ts
- [X] T054 [P] [US3] Create unit test for addWidget with invalid widget config in projects/d3-dashboards/src/lib/services/dashboard.service.spec.ts
- [X] T055 [P] [US3] Create unit test for updateWidget with valid widget in projects/d3-dashboards/src/lib/services/dashboard.service.spec.ts
- [X] T056 [P] [US3] Create unit test for updateWidget with non-existent widget ID in projects/d3-dashboards/src/lib/services/dashboard.service.spec.ts
- [X] T057 [P] [US3] Create unit test for removeWidget with valid widget ID in projects/d3-dashboards/src/lib/services/dashboard.service.spec.ts
- [X] T058 [P] [US3] Create unit test for removeWidget with non-existent widget ID in projects/d3-dashboards/src/lib/services/dashboard.service.spec.ts
- [X] T059 [P] [US3] Create unit test for validateWidget with valid widget in projects/d3-dashboards/src/lib/services/dashboard.service.spec.ts
- [X] T060 [P] [US3] Create unit test for validateWidget with invalid widget in projects/d3-dashboards/src/lib/services/dashboard.service.spec.ts

### Implementation for User Story 3

- [X] T061 [US3] Implement validateWidget method in projects/d3-dashboards/src/lib/utils/dashboard-validator.util.ts
- [X] T062 [US3] Implement WidgetValidationError class in projects/d3-dashboards/src/lib/services/dashboard.service.types.ts
- [X] T063 [US3] Implement WidgetIdConflictError class in projects/d3-dashboards/src/lib/services/dashboard.service.types.ts
- [X] T064 [US3] Implement WidgetNotFoundError class in projects/d3-dashboards/src/lib/services/dashboard.service.types.ts
- [X] T065 [US3] Implement addWidget method in projects/d3-dashboards/src/lib/services/dashboard.service.ts
- [X] T066 [US3] Implement updateWidget method in projects/d3-dashboards/src/lib/services/dashboard.service.ts
- [X] T067 [US3] Implement removeWidget method in projects/d3-dashboards/src/lib/services/dashboard.service.ts
- [X] T068 [US3] Add widget ID uniqueness validation in addWidget method in projects/d3-dashboards/src/lib/services/dashboard.service.ts
- [X] T069 [US3] Add immutable update pattern for widgets in addWidget method in projects/d3-dashboards/src/lib/services/dashboard.service.ts
- [X] T070 [US3] Add immutable update pattern for widgets in updateWidget method in projects/d3-dashboards/src/lib/services/dashboard.service.ts
- [X] T071 [US3] Add immutable update pattern for widgets in removeWidget method in projects/d3-dashboards/src/lib/services/dashboard.service.ts
- [X] T072 [US3] Add error handling for WidgetIdConflictError in addWidget method in projects/d3-dashboards/src/lib/services/dashboard.service.ts
- [X] T073 [US3] Add error handling for WidgetNotFoundError in updateWidget and removeWidget methods in projects/d3-dashboards/src/lib/services/dashboard.service.ts

**Checkpoint**: At this point, User Story 3 should be fully functional and testable independently. Widgets can be added, updated, and removed from dashboards.

---

## Phase 6: User Story 4 - State Management (Priority: P2)

**Goal**: Enable dashboard state management so that state is consistent across the application

**Independent Test**: Call updateState() with state updates and verify state changes are observable. Call getCurrentState() and verify current state is returned. Call resetState() and verify state returns to initial state.

### Tests for User Story 4

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T074 [P] [US4] Create unit test for getState observable in projects/d3-dashboards/src/lib/services/dashboard.service.spec.ts
- [X] T075 [P] [US4] Create unit test for getCurrentState synchronous access in projects/d3-dashboards/src/lib/services/dashboard.service.spec.ts
- [X] T076 [P] [US4] Create unit test for updateState with partial updates in projects/d3-dashboards/src/lib/services/dashboard.service.spec.ts
- [X] T077 [P] [US4] Create unit test for resetState to initial values in projects/d3-dashboards/src/lib/services/dashboard.service.spec.ts
- [X] T078 [P] [US4] Create unit test for state observable emissions in projects/d3-dashboards/src/lib/services/dashboard.service.spec.ts

### Implementation for User Story 4

- [X] T079 [US4] Create BehaviorSubject for state management in projects/d3-dashboards/src/lib/services/dashboard.service.ts
- [X] T080 [US4] Initialize state with default values in DashboardService constructor in projects/d3-dashboards/src/lib/services/dashboard.service.ts
- [X] T081 [US4] Implement getState method returning Observable in projects/d3-dashboards/src/lib/services/dashboard.service.ts
- [X] T082 [US4] Implement getCurrentState method returning current state value in projects/d3-dashboards/src/lib/services/dashboard.service.ts
- [X] T083 [US4] Implement updateState method with partial state updates in projects/d3-dashboards/src/lib/services/dashboard.service.ts
- [X] T084 [US4] Implement resetState method to restore initial state in projects/d3-dashboards/src/lib/services/dashboard.service.ts
- [X] T085 [US4] Add state update when dashboard is deleted in delete method in projects/d3-dashboards/src/lib/services/dashboard.service.ts

**Checkpoint**: At this point, User Story 4 should be fully functional and testable independently. Dashboard state can be managed and observed.

---

## Phase 7: Additional CRUD Operations

**Purpose**: Complete remaining CRUD operations (update, delete) that support all user stories

### Tests for Update and Delete

- [X] T086 [P] Create unit test for update with valid dashboard in projects/d3-dashboards/src/lib/services/dashboard.service.spec.ts
- [X] T087 [P] Create unit test for update with version mismatch (concurrent modification) in projects/d3-dashboards/src/lib/services/dashboard.service.spec.ts
- [X] T088 [P] Create unit test for update with invalid dashboard config in projects/d3-dashboards/src/lib/services/dashboard.service.spec.ts
- [X] T089 [P] Create unit test for delete with valid dashboard ID in projects/d3-dashboards/src/lib/services/dashboard.service.spec.ts
- [X] T090 [P] Create unit test for delete with non-existent dashboard ID in projects/d3-dashboards/src/lib/services/dashboard.service.spec.ts

### Implementation for Update and Delete

- [X] T091 Implement ConcurrentModificationError class in projects/d3-dashboards/src/lib/services/dashboard.service.types.ts
- [X] T092 Implement update method with optimistic locking in projects/d3-dashboards/src/lib/services/dashboard.service.ts
- [X] T093 Add version increment logic in update method in projects/d3-dashboards/src/lib/services/dashboard.service.ts
- [X] T094 Add version mismatch detection in update method in projects/d3-dashboards/src/lib/services/dashboard.service.ts
- [X] T095 Add updatedAt timestamp update in update method in projects/d3-dashboards/src/lib/services/dashboard.service.ts
- [X] T096 Implement delete method in projects/d3-dashboards/src/lib/services/dashboard.service.ts
- [X] T097 Implement storage.delete method in InMemoryDashboardStorage in projects/d3-dashboards/src/lib/services/dashboard.service.types.ts
- [X] T098 Implement storage.delete method in LocalStorageDashboardStorage in projects/d3-dashboards/src/lib/services/dashboard.service.types.ts
- [X] T099 Add error handling for ConcurrentModificationError in update method in projects/d3-dashboards/src/lib/services/dashboard.service.ts

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final polish, error handling improvements, performance optimization, and cleanup

### Error Handling Improvements

- [ ] T100 Add comprehensive error handling for all service methods in projects/d3-dashboards/src/lib/services/dashboard.service.ts
- [ ] T101 Add error message formatting for all error types in projects/d3-dashboards/src/lib/services/dashboard.service.types.ts
- [ ] T102 Add retryable flag to error classes in projects/d3-dashboards/src/lib/services/dashboard.service.types.ts

### Performance Optimization

- [ ] T103 Add performance monitoring for create operations (SC-001: < 500ms) in projects/d3-dashboards/src/lib/services/dashboard.service.ts
- [ ] T104 Add performance monitoring for load operations (SC-002: < 300ms) in projects/d3-dashboards/src/lib/services/dashboard.service.ts
- [ ] T105 Add performance monitoring for update operations (SC-003: < 500ms) in projects/d3-dashboards/src/lib/services/dashboard.service.ts
- [ ] T106 Add performance monitoring for widget operations (SC-004: < 200ms) in projects/d3-dashboards/src/lib/services/dashboard.service.ts
- [ ] T107 Optimize storage operations for 1000+ dashboards (SC-006) in projects/d3-dashboards/src/lib/services/dashboard.service.types.ts

### Memory Leak Prevention

- [ ] T108 Add proper cleanup in DashboardService ngOnDestroy lifecycle in projects/d3-dashboards/src/lib/services/dashboard.service.ts
- [ ] T109 Add subscription cleanup for state observables in projects/d3-dashboards/src/lib/services/dashboard.service.ts
- [ ] T110 Add memory leak tests in projects/d3-dashboards/src/lib/services/dashboard.service.spec.ts

### Documentation

- [ ] T111 Add JSDoc comments to all public methods in projects/d3-dashboards/src/lib/services/dashboard.service.ts
- [ ] T112 Add JSDoc comments to all interfaces in projects/d3-dashboards/src/lib/entities/dashboard.interface.ts
- [ ] T113 Add usage examples in service JSDoc comments in projects/d3-dashboards/src/lib/services/dashboard.service.ts

### Final Validation

- [ ] T114 Run full test suite and verify 80%+ coverage in projects/d3-dashboards/src/lib/services/dashboard.service.spec.ts
- [ ] T115 Verify all exports in projects/d3-dashboards/src/lib/public-api.ts
- [ ] T116 Run linter and fix all issues
- [ ] T117 Verify TypeScript strict mode compliance
- [ ] T118 Verify all success criteria are met (SC-001 through SC-010)

---

## Dependencies & Story Completion Order

### Story Dependencies

- **User Story 1 (Create/Save)** → No dependencies (can start after Phase 2)
- **User Story 2 (Load/List)** → Depends on User Story 1 (needs dashboards to exist)
- **User Story 3 (Widget Management)** → Depends on User Story 1 and 2 (needs dashboards to exist and be loadable)
- **User Story 4 (State Management)** → Can be implemented in parallel with other stories (independent)

### Recommended Implementation Order

1. **Phase 1-2**: Setup and Foundation (MUST complete first)
2. **Phase 3**: User Story 1 - Create/Save (MVP, enables all other stories)
3. **Phase 4**: User Story 2 - Load/List (enables testing and widget management)
4. **Phase 7**: Update/Delete operations (complete CRUD)
5. **Phase 5**: User Story 3 - Widget Management (can start after US1+US2)
6. **Phase 6**: User Story 4 - State Management (can be done in parallel with US3)
7. **Phase 8**: Polish & Cross-Cutting (final phase)

---

## Parallel Execution Opportunities

### Within User Story 1
- Tests T019-T025 can run in parallel (different test cases)
- T026-T027 (validation utilities) can run in parallel with T028 (error class)

### Within User Story 2
- Tests T036-T041 can run in parallel
- Storage implementations T045-T046 and T047-T048 can run in parallel

### Within User Story 3
- Tests T052-T060 can run in parallel
- Error classes T062-T064 can run in parallel
- Widget methods T065-T067 can be implemented sequentially but tested in parallel

### Within User Story 4
- Tests T074-T078 can run in parallel
- State methods T081-T084 can be implemented sequentially

### Cross-Story Parallelization
- User Story 4 can be implemented in parallel with User Story 3 (independent functionality)
- Phase 8 polish tasks can be done incrementally as stories complete

---

## Implementation Strategy

### MVP Scope (Minimum Viable Product)

**MVP includes**: Phase 1, Phase 2, Phase 3 (User Story 1), Phase 4 (User Story 2), and Phase 7 (Update/Delete)

This delivers:
- ✅ Dashboard creation and saving
- ✅ Dashboard loading and listing
- ✅ Dashboard update and delete
- ✅ Basic error handling
- ✅ Validation

**MVP excludes**:
- Widget management (User Story 3)
- State management (User Story 4)
- Advanced polish features

### Incremental Delivery

1. **Sprint 1**: MVP (Phases 1-2, 3, 4, 7)
2. **Sprint 2**: Widget Management (Phase 5)
3. **Sprint 3**: State Management (Phase 6)
4. **Sprint 4**: Polish & Optimization (Phase 8)

### Testing Strategy

- Write tests FIRST (TDD approach)
- Each user story has independent test suite
- Aim for 80%+ coverage per constitution requirement
- Test happy paths, error cases, and edge cases
- Performance tests for success criteria validation

---

## Task Summary

- **Total Tasks**: 118
- **Setup Tasks**: 6 (Phase 1)
- **Foundation Tasks**: 12 (Phase 2)
- **User Story 1 Tasks**: 17 (7 tests + 10 implementation)
- **User Story 2 Tasks**: 16 (6 tests + 10 implementation)
- **User Story 3 Tasks**: 22 (9 tests + 13 implementation)
- **User Story 4 Tasks**: 12 (5 tests + 7 implementation)
- **Update/Delete Tasks**: 14 (5 tests + 9 implementation)
- **Polish Tasks**: 19 (Phase 8)

**Estimated Parallel Opportunities**: ~40% of tasks can run in parallel (marked with [P])

