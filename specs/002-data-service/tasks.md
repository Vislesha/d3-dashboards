# Tasks: Data Service

**Input**: Design documents from `/specs/002-data-service/`
**Prerequisites**: plan.md ✓, spec.md ✓, data-model.md ✓, contracts/ ✓, research.md ✓

**Tests**: Tests are included as they are required by constitution (minimum 80% coverage).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Angular Library**: `projects/d3-dashboards/src/lib/`
- Service implementation: `projects/d3-dashboards/src/lib/services/`
- Interfaces: `projects/d3-dashboards/src/lib/entities/`
- Tests: Co-located with implementation files (`.spec.ts`)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project structure and service scaffolding

- [X] T001 Create service directory structure in projects/d3-dashboards/src/lib/services/
- [X] T002 [P] Create data.service.ts skeleton in projects/d3-dashboards/src/lib/services/data.service.ts
- [X] T003 [P] Create data.service.types.ts skeleton in projects/d3-dashboards/src/lib/services/data.service.types.ts
- [X] T004 [P] Create data.service.spec.ts test file in projects/d3-dashboards/src/lib/services/data.service.spec.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core interfaces and types that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 [P] Create IDataSource interface in projects/d3-dashboards/src/lib/entities/data-source.interface.ts
- [X] T006 [P] Create ICacheConfig interface in projects/d3-dashboards/src/lib/entities/data-source.interface.ts
- [X] T007 [P] Create IRetryConfig interface in projects/d3-dashboards/src/lib/entities/data-source.interface.ts
- [X] T008 [P] Create IDataResponse interface in projects/d3-dashboards/src/lib/entities/data-source.interface.ts
- [X] T009 [P] Create IDataServiceError interface in projects/d3-dashboards/src/lib/entities/data-source.interface.ts
- [X] T010 [P] Create ICacheEntry interface in projects/d3-dashboards/src/lib/services/data.service.types.ts
- [X] T011 [P] Create IValidationResult interface in projects/d3-dashboards/src/lib/entities/data-source.interface.ts
- [X] T012 Create DataService class skeleton with @Injectable decorator in projects/d3-dashboards/src/lib/services/data.service.ts
- [X] T013 Inject HttpClient in DataService constructor in projects/d3-dashboards/src/lib/services/data.service.ts
- [X] T014 Export all interfaces from projects/d3-dashboards/src/lib/public-api.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Fetch Data from API (Priority: P1) 🎯 MVP

**Goal**: Fetch data from APIs using GET and POST methods so widgets can display dynamic data.

**Independent Test**: Call the service with an API endpoint and verify data is fetched. Can be tested independently with a mock HTTP backend.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T015 [P] [US1] Write test for fetchData with GET request in projects/d3-dashboards/src/lib/services/data.service.spec.ts
- [ ] T016 [P] [US1] Write test for fetchData with POST request in projects/d3-dashboards/src/lib/services/data.service.spec.ts
- [ ] T017 [P] [US1] Write test for fetchData error handling in projects/d3-dashboards/src/lib/services/data.service.spec.ts

### Implementation for User Story 1

- [ ] T018 [US1] Implement validateDataSource method in projects/d3-dashboards/src/lib/services/data.service.ts
- [ ] T019 [US1] Implement fetchData method signature with generic type in projects/d3-dashboards/src/lib/services/data.service.ts
- [ ] T020 [US1] Implement GET request handling in fetchData for API data sources in projects/d3-dashboards/src/lib/services/data.service.ts
- [ ] T021 [US1] Implement POST request handling with body in fetchData for API data sources in projects/d3-dashboards/src/lib/services/data.service.ts
- [ ] T022 [US1] Implement request parameters handling (params for GET) in projects/d3-dashboards/src/lib/services/data.service.ts
- [ ] T023 [US1] Implement DataResponse creation with loading states in projects/d3-dashboards/src/lib/services/data.service.ts
- [ ] T024 [US1] Implement error handling that emits errors in DataResponse.error (not Observable error) in projects/d3-dashboards/src/lib/services/data.service.ts
- [ ] T025 [US1] Implement getLoadingState method returning Observable<boolean> in projects/d3-dashboards/src/lib/services/data.service.ts

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently - can fetch data from APIs with GET/POST

---

## Phase 4: User Story 2 - Support Multiple Data Source Types (Priority: P1)

**Goal**: Support different data source types (API, static, computed) to enable various data scenarios.

**Independent Test**: Use different data source types and verify each works correctly. Can be tested independently.

### Tests for User Story 2

- [ ] T026 [P] [US2] Write test for static data source in projects/d3-dashboards/src/lib/services/data.service.spec.ts
- [ ] T027 [P] [US2] Write test for computed data source in projects/d3-dashboards/src/lib/services/data.service.spec.ts
- [ ] T028 [P] [US2] Write test for API data source (already covered in US1, verify integration) in projects/d3-dashboards/src/lib/services/data.service.spec.ts

### Implementation for User Story 2

- [ ] T029 [US2] Implement static data source handling in fetchData (return data immediately) in projects/d3-dashboards/src/lib/services/data.service.ts
- [ ] T030 [US2] Implement computed data source handling in fetchData (call transform function) in projects/d3-dashboards/src/lib/services/data.service.ts
- [ ] T031 [US2] Add type validation for data source type field in validateDataSource in projects/d3-dashboards/src/lib/services/data.service.ts
- [ ] T032 [US2] Add validation for static data source (requires data array) in validateDataSource in projects/d3-dashboards/src/lib/services/data.service.ts
- [ ] T033 [US2] Add validation for computed data source (requires transform function) in validateDataSource in projects/d3-dashboards/src/lib/services/data.service.ts

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - can fetch from API, static, and computed sources

---

## Phase 5: User Story 3 - Data Transformation (Priority: P2)

**Goal**: Transform data before it's used so data can be formatted for specific widget needs.

**Independent Test**: Apply transformations and verify output. Can be tested independently with mock data.

### Tests for User Story 3

- [ ] T034 [P] [US3] Write test for data transformation with valid transform function in projects/d3-dashboards/src/lib/services/data.service.spec.ts
- [ ] T035 [P] [US3] Write test for transformation error handling (function throws) in projects/d3-dashboards/src/lib/services/data.service.spec.ts
- [ ] T036 [P] [US3] Write test for invalid transformation (non-function) validation in projects/d3-dashboards/src/lib/services/data.service.spec.ts

### Implementation for User Story 3

- [ ] T037 [US3] Implement transform function application in fetchData after data fetch in projects/d3-dashboards/src/lib/services/data.service.ts
- [ ] T038 [US3] Implement transform error handling (catch errors, return in DataResponse.error) in projects/d3-dashboards/src/lib/services/data.service.ts
- [ ] T039 [US3] Add transform function validation (must be callable) in validateDataSource in projects/d3-dashboards/src/lib/services/data.service.ts
- [ ] T040 [US3] Ensure transformation completes within 100ms for < 1000 items (performance check) in projects/d3-dashboards/src/lib/services/data.service.ts

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should work independently - can transform data before returning

---

## Phase 6: User Story 4 - Caching Support (Priority: P2)

**Goal**: Cache data so repeated requests don't unnecessarily fetch the same data.

**Independent Test**: Make multiple requests and verify caching works. Can be tested independently.

### Tests for User Story 4

- [ ] T041 [P] [US4] Write test for cache hit (return cached data) in projects/d3-dashboards/src/lib/services/data.service.spec.ts
- [ ] T042 [P] [US4] Write test for cache miss (fetch and cache) in projects/d3-dashboards/src/lib/services/data.service.spec.ts
- [ ] T043 [P] [US4] Write test for cache expiration in projects/d3-dashboards/src/lib/services/data.service.spec.ts
- [ ] T044 [P] [US4] Write test for cache key generation in projects/d3-dashboards/src/lib/services/data.service.spec.ts
- [ ] T045 [P] [US4] Write test for clearCache method in projects/d3-dashboards/src/lib/services/data.service.spec.ts
- [ ] T046 [P] [US4] Write test for getCacheSize method in projects/d3-dashboards/src/lib/services/data.service.spec.ts

### Implementation for User Story 4

- [ ] T047 [US4] Implement cache Map storage in DataService class in projects/d3-dashboards/src/lib/services/data.service.ts
- [ ] T048 [US4] Implement cache key generation from endpoint + method + serialized params/body in projects/d3-dashboards/src/lib/services/data.service.ts
- [ ] T049 [US4] Implement cache lookup before API request in fetchData in projects/d3-dashboards/src/lib/services/data.service.ts
- [ ] T050 [US4] Implement cache entry creation with timestamp and expiration in projects/d3-dashboards/src/lib/services/data.service.ts
- [ ] T051 [US4] Implement cache expiration check (remove expired entries) in projects/d3-dashboards/src/lib/services/data.service.ts
- [ ] T052 [US4] Implement cache storage after successful data fetch in fetchData in projects/d3-dashboards/src/lib/services/data.service.ts
- [ ] T053 [US4] Implement clearCache method (with optional key parameter) in projects/d3-dashboards/src/lib/services/data.service.ts
- [ ] T054 [US4] Implement getCacheSize method returning number of active entries in projects/d3-dashboards/src/lib/services/data.service.ts
- [ ] T055 [US4] Set fromCache flag in DataResponse when data comes from cache in projects/d3-dashboards/src/lib/services/data.service.ts

**Checkpoint**: At this point, all user stories should work independently - caching reduces API calls for repeated requests

---

## Phase 7: Error Handling & Retry Logic (Cross-Cutting)

**Purpose**: Implement error handling, retry logic, concurrent request handling, and validation

### Tests for Error Handling & Retry

- [ ] T056 [P] Write test for retry logic with exponential backoff in projects/d3-dashboards/src/lib/services/data.service.spec.ts
- [ ] T057 [P] Write test for retryable vs non-retryable error classification in projects/d3-dashboards/src/lib/services/data.service.spec.ts
- [ ] T058 [P] Write test for concurrent request deduplication in projects/d3-dashboards/src/lib/services/data.service.spec.ts
- [ ] T059 [P] Write test for in-flight request reuse in projects/d3-dashboards/src/lib/services/data.service.spec.ts
- [ ] T060 [P] Write test for network timeout handling in projects/d3-dashboards/src/lib/services/data.service.spec.ts

### Implementation for Error Handling & Retry

- [ ] T061 Implement retry logic with exponential backoff using RxJS retry operator in projects/d3-dashboards/src/lib/services/data.service.ts
- [ ] T062 Implement retryable error classification (network errors, 5xx, timeouts) in projects/d3-dashboards/src/lib/services/data.service.ts
- [ ] T063 Implement non-retryable error handling (4xx client errors, validation errors) in projects/d3-dashboards/src/lib/services/data.service.ts
- [ ] T064 Implement concurrent request deduplication (share Observable for same request) in projects/d3-dashboards/src/lib/services/data.service.ts
- [ ] T065 Implement in-flight request tracking and reuse in projects/d3-dashboards/src/lib/services/data.service.ts
- [ ] T066 Implement network timeout handling (per-request timeout support) in projects/d3-dashboards/src/lib/services/data.service.ts
- [ ] T067 Implement comprehensive validation in validateDataSource (all rules from FR-011) in projects/d3-dashboards/src/lib/services/data.service.ts
- [ ] T068 Implement validation error messages array in IValidationResult in projects/d3-dashboards/src/lib/services/data.service.ts

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements, documentation, and quality assurance

- [ ] T069 [P] Add JSDoc comments to all public methods in projects/d3-dashboards/src/lib/services/data.service.ts
- [ ] T070 [P] Add JSDoc comments to all interfaces in projects/d3-dashboards/src/lib/entities/data-source.interface.ts
- [ ] T071 [P] Ensure all code follows TypeScript strict mode in projects/d3-dashboards/src/lib/services/data.service.ts
- [ ] T072 [P] Verify tree-shakeable imports (no barrel imports) in projects/d3-dashboards/src/lib/services/data.service.ts
- [ ] T073 Run Jest tests and verify 80%+ code coverage in projects/d3-dashboards/src/lib/services/data.service.spec.ts
- [ ] T074 [P] Update quickstart.md with any implementation notes if needed in specs/002-data-service/quickstart.md
- [ ] T075 Verify all exports in public-api.ts are correct in projects/d3-dashboards/src/lib/public-api.ts
- [ ] T076 Performance testing: Verify SC-001 through SC-010 success criteria are met
- [ ] T077 [P] Code review: Verify constitution compliance (type safety, reactive programming, testing)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (US1 → US2 → US3 → US4)
- **Error Handling & Retry (Phase 7)**: Can start after US1 (needs basic fetchData), but best after all stories
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Uses same fetchData method, independently testable
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Extends fetchData with transformation, independently testable
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Extends fetchData with caching, independently testable

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Core interfaces before service implementation
- Service methods before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T002, T003, T004)
- All Foundational interface tasks marked [P] can run in parallel (T005-T011)
- Once Foundational phase completes, user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members
- Polish tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: "Write test for fetchData with GET request"
Task: "Write test for fetchData with POST request"
Task: "Write test for fetchData error handling"
```

---

## Parallel Example: Foundational Phase

```bash
# Launch all interface creation tasks together:
Task: "Create IDataSource interface"
Task: "Create ICacheConfig interface"
Task: "Create IRetryConfig interface"
Task: "Create IDataResponse interface"
Task: "Create IDataServiceError interface"
Task: "Create ICacheEntry interface"
Task: "Create IValidationResult interface"
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
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add Error Handling & Retry → Test → Deploy/Demo
7. Polish → Final release
8. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (MVP)
   - Developer B: User Story 2 (in parallel with A)
   - Developer C: User Story 3 (after A/B complete or in parallel)
   - Developer D: User Story 4 (after A/B complete or in parallel)
3. Stories complete and integrate independently
4. Team works together on Error Handling & Retry (Phase 7)
5. Team works together on Polish (Phase 8)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- All tasks include exact file paths for clarity
- Tests are required (constitution mandates 80% coverage)
- Service must be injectable and provided at root level
- All methods must return Observables (reactive programming requirement)
- Errors must be emitted as values in DataResponse.error (never throwError)

---

## Task Summary

- **Total Tasks**: 77
- **Setup Tasks**: 4
- **Foundational Tasks**: 10
- **User Story 1 Tasks**: 11 (3 tests + 8 implementation)
- **User Story 2 Tasks**: 8 (3 tests + 5 implementation)
- **User Story 3 Tasks**: 7 (3 tests + 4 implementation)
- **User Story 4 Tasks**: 15 (6 tests + 9 implementation)
- **Error Handling & Retry Tasks**: 13 (5 tests + 8 implementation)
- **Polish Tasks**: 9
- **Parallel Opportunities**: 25+ tasks can run in parallel
- **MVP Scope**: Phases 1-3 (Setup + Foundational + User Story 1)

