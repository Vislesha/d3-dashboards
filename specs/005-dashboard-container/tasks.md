# Tasks: Dashboard Container Component

**Input**: Design documents from `/specs/005-dashboard-container/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are included as they are standard practice for Angular components and required by the constitution (minimum 80% coverage).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Angular Library**: `projects/d3-dashboards/src/lib/`
- **Components**: `projects/d3-dashboards/src/lib/components/dashboard-container/`
- **Entities**: `projects/d3-dashboards/src/lib/entities/`
- **Utils**: `projects/d3-dashboards/src/lib/utils/`
- **Tests**: Co-located with source files (`.spec.ts`)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create directory structure for dashboard container component in projects/d3-dashboards/src/lib/components/dashboard-container/
- [X] T002 [P] Verify angular-gridster2 ^20.0.0 is installed in package.json
- [X] T003 [P] Verify TypeScript ~5.8.0 strict mode is enabled in tsconfig.json
- [X] T004 [P] Verify RxJS ~7.8.0 is installed in package.json
- [X] T005 [P] Verify Jest ^29.7.0 and jest-preset-angular ^14.6.1 are configured
- [X] T006 [P] Verify Angular v20.2.0 is installed in package.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T007 [P] Create IGridConfiguration interface in projects/d3-dashboards/src/lib/entities/grid-config.interface.ts
- [X] T008 [P] Verify ID3Widget interface exists in projects/d3-dashboards/src/lib/entities/widget.interface.ts
- [X] T009 [P] Verify IFilterValues interface exists in projects/d3-dashboards/src/lib/entities/filter.interface.ts
- [X] T010 Create widget position validation utility function in projects/d3-dashboards/src/lib/utils/widget-position.validator.ts
- [X] T011 Create default grid configuration constant in projects/d3-dashboards/src/lib/utils/grid-config.defaults.ts
- [X] T012 Export all new interfaces from projects/d3-dashboards/src/lib/public-api.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Display Dashboard with Widgets (Priority: P1) 🎯 MVP

**Goal**: Enable viewing a dashboard with multiple widgets arranged in a grid layout so that users can see all their data visualizations and information at once.

**Independent Test**: Provide an array of widgets and verify they render in a grid layout. Test with empty array, different widget types, and invalid widget data.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T013 [P] [US1] Create unit test for component initialization with widgets array in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.spec.ts
- [ ] T014 [P] [US1] Create unit test for rendering widgets in grid layout in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.spec.ts
- [ ] T015 [P] [US1] Create unit test for empty widget array handling in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.spec.ts
- [ ] T016 [P] [US1] Create unit test for invalid widget data handling in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.spec.ts
- [ ] T017 [P] [US1] Create unit test for widget position validation and auto-correction in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.spec.ts
- [ ] T018 [P] [US1] Create unit test for widget component wrapper rendering in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.spec.ts

### Implementation for User Story 1

- [ ] T019 [US1] Create DashboardContainerComponent class skeleton with @Component decorator in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.ts
- [ ] T020 [US1] Add @Input() widgets property with ID3Widget[] type in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.ts
- [ ] T021 [US1] Add @Input() gridConfig property with IGridConfiguration type (optional) in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.ts
- [ ] T022 [US1] Implement default grid configuration (12 columns, 30px row height, 5px margins) in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.ts
- [ ] T023 [US1] Import GridsterModule and configure GridsterConfig in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.ts
- [ ] T024 [US1] Implement widget position validation on input changes in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.ts
- [ ] T025 [US1] Implement auto-correction of invalid widget positions in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.ts
- [ ] T026 [US1] Create component template with gridster container in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.html
- [ ] T027 [US1] Implement widget component wrapper for dynamic widget loading in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.html
- [ ] T028 [US1] Implement empty dashboard message display in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.html
- [ ] T029 [US1] Implement error state display for invalid widgets in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.html
- [ ] T030 [US1] Add component styles in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.scss
- [ ] T031 [US1] Configure OnPush change detection strategy in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.ts
- [ ] T032 [US1] Implement OnInit lifecycle hook in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.ts
- [ ] T033 [US1] Implement OnChanges lifecycle hook for widget input changes in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.ts
- [ ] T034 [US1] Export DashboardContainerComponent from projects/d3-dashboards/src/lib/public-api.ts

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Widgets can be displayed in a grid layout.

---

## Phase 4: User Story 3 - Responsive Grid Layout (Priority: P2)

**Goal**: Enable the dashboard to adapt to different screen sizes so that users can view dashboards on mobile, tablet, and desktop devices.

**Independent Test**: Resize the browser window and verify the grid adapts appropriately. Test on mobile (320px+), tablet (768px+), and desktop (1024px+) viewports.

### Tests for User Story 3

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T035 [P] [US3] Create unit test for responsive grid configuration in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.spec.ts
- [ ] T036 [P] [US3] Create unit test for grid layout adaptation on window resize in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.spec.ts
- [ ] T037 [P] [US3] Create integration test for mobile viewport (320px+) in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.spec.ts
- [ ] T038 [P] [US3] Create integration test for tablet viewport (768px+) in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.spec.ts
- [ ] T039 [P] [US3] Create integration test for desktop viewport (1024px+) in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.spec.ts

### Implementation for User Story 3

- [ ] T040 [US3] Configure angular-gridster2 responsive breakpoints in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.ts
- [ ] T041 [US3] Implement window resize listener for layout adaptation in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.ts
- [ ] T042 [US3] Configure grid column adaptation for different screen sizes in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.ts
- [ ] T043 [US3] Implement widget resize handling on container resize in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.ts
- [ ] T044 [US3] Add responsive styles for mobile, tablet, desktop in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.scss
- [ ] T045 [US3] Implement cleanup for window resize listener in OnDestroy lifecycle hook in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.ts

**Checkpoint**: At this point, User Stories 1 AND 3 should both work independently. Dashboard adapts to different screen sizes.

---

## Phase 5: User Story 4 - Filter Propagation (Priority: P2)

**Goal**: Enable filters applied at the dashboard level to propagate to all widgets so that users can filter data across the entire dashboard consistently.

**Independent Test**: Apply filters at the dashboard level and verify all widgets receive and respond to filter changes. Test filter merging, debouncing, and filter clearing.

### Tests for User Story 4

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T046 [P] [US4] Create unit test for filter input property in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.spec.ts
- [ ] T047 [P] [US4] Create unit test for filter propagation to widgets in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.spec.ts
- [ ] T048 [P] [US4] Create unit test for filter merging (dashboard + widget filters) in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.spec.ts
- [ ] T049 [P] [US4] Create unit test for filter debouncing (300ms) in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.spec.ts
- [ ] T050 [P] [US4] Create unit test for filterChange output event in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.spec.ts
- [ ] T051 [P] [US4] Create unit test for filter clearing in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.spec.ts
- [ ] T052 [P] [US4] Create unit test for invalid filter handling in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.spec.ts

### Implementation for User Story 4

- [ ] T053 [US4] Add @Input() filters property with IFilterValues[] type in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.ts
- [ ] T054 [US4] Add @Output() filterChange EventEmitter<IFilterValues[]> in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.ts
- [ ] T055 [US4] Create BehaviorSubject for filter state management in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.ts
- [ ] T056 [US4] Implement filter debouncing with debounceTime(300) operator in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.ts
- [ ] T057 [US4] Implement filter merging logic (dashboard filters + widget filters) in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.ts
- [ ] T058 [US4] Pass merged filters to each widget component via @Input() in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.html
- [ ] T059 [US4] Emit filterChange output when filters are updated (after debounce) in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.ts
- [ ] T060 [US4] Implement filter subscription cleanup in OnDestroy lifecycle hook in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.ts
- [ ] T061 [US4] Add error handling for invalid filter values in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.ts

**Checkpoint**: At this point, all user stories should be independently functional. Filters propagate to all widgets with debouncing.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T062 [P] Add ARIA labels and accessibility attributes in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.html
- [ ] T063 [P] Add component documentation and JSDoc comments in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.ts
- [ ] T064 [P] Add error logging for widget rendering failures in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.ts
- [ ] T065 [P] Implement performance optimization for large widget arrays (50+ widgets) in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.ts
- [ ] T066 [P] Add loading state handling for widget components in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.html
- [ ] T067 [P] Add error state handling for widget components in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.html
- [ ] T068 Verify all tests pass and coverage meets 80% minimum in projects/d3-dashboards/src/lib/components/dashboard-container/dashboard-container.component.spec.ts
- [ ] T069 Run quickstart.md validation scenarios
- [ ] T070 Code cleanup and refactoring for consistency

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User Story 1 (P1) can start after Foundational
  - User Story 3 (P2) can start after Foundational (can run in parallel with US1 if desired)
  - User Story 4 (P2) can start after Foundational (can run in parallel with US1/US3 if desired)
- **Polish (Phase 6)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Enhances US1 but independently testable
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Enhances US1 but independently testable

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Component skeleton before template
- Template before styling
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- User Stories 3 and 4 can be worked on in parallel after US1 is complete

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Create unit test for component initialization with widgets array"
Task: "Create unit test for rendering widgets in grid layout"
Task: "Create unit test for empty widget array handling"
Task: "Create unit test for invalid widget data handling"
Task: "Create unit test for widget position validation and auto-correction"
Task: "Create unit test for widget component wrapper rendering"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 3 → Test independently → Deploy/Demo
4. Add User Story 4 → Test independently → Deploy/Demo
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (P1)
   - Developer B: User Story 3 (P2) - can start after US1 core is done
   - Developer C: User Story 4 (P2) - can start after US1 core is done
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Widget component wrapper should use Angular's dynamic component loading (ViewContainerRef, ComponentFactoryResolver, or similar)
- Filter debouncing is fixed at 300ms (not configurable)
- Grid defaults: 12 columns, 30px row height, 5px margins
- Use angular-gridster2's built-in responsive configuration

---

## Summary

**Total Task Count**: 70 tasks

**Task Count per User Story**:
- Setup: 6 tasks
- Foundational: 6 tasks
- User Story 1 (P1): 22 tasks (6 tests + 16 implementation)
- User Story 3 (P2): 11 tasks (5 tests + 6 implementation)
- User Story 4 (P2): 13 tasks (7 tests + 6 implementation)
- Polish: 9 tasks

**Parallel Opportunities Identified**:
- Setup phase: 5 parallel tasks
- Foundational phase: 5 parallel tasks
- User Story 1 tests: 6 parallel tasks
- User Story 3 tests: 5 parallel tasks
- User Story 4 tests: 7 parallel tasks
- User Stories 3 and 4 can run in parallel after US1

**Independent Test Criteria**:
- **User Story 1**: Provide widgets array, verify grid rendering, empty state, error handling
- **User Story 3**: Resize browser, verify responsive adaptation on mobile/tablet/desktop
- **User Story 4**: Apply filters, verify propagation, debouncing, and clearing

**Suggested MVP Scope**: User Story 1 only (Display Dashboard with Widgets) - delivers core functionality

**Format Validation**: ✅ All tasks follow checklist format with checkbox, ID, optional [P] marker, optional [Story] label, and file paths

