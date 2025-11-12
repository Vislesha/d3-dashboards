# Implementation Tasks: Project Setup and Structure

**Feature Branch**: `000-project-setup`  
**Generated**: 2025-01-27  
**Based On**: [plan.md](./plan.md) and [spec.md](./spec.md)

## Overview

This document provides actionable, dependency-ordered tasks for initializing the Angular workspace with library and application projects, installing dependencies, configuring build tools, and establishing the project structure.

**Total Tasks**: 75  
**User Stories**: 8 (4 P1, 4 P2)  
**Estimated Setup Time**: 5 minutes on standard development machine

## Implementation Strategy

**MVP Scope**: Complete User Stories 1-4 (P1) to establish workspace, projects, and dependencies. This provides a functional foundation for development.

**Incremental Delivery**:
1. **Phase 1-2**: Prerequisites and foundational setup (blocks all stories)
2. **Phase 3-6**: P1 user stories (workspace, library, app, dependencies)
3. **Phase 7-10**: P2 user stories (build tools, folder structure, dev tools, TypeScript)
4. **Phase 11**: Polish and validation

## Dependency Graph

```
Phase 1 (Setup)
  └─> Phase 2 (Foundational)
       └─> Phase 3 (US1: Workspace)
            ├─> Phase 4 (US2: Library)
            └─> Phase 5 (US3: Application)
            └─> Phase 6 (US4: Dependencies)
                 ├─> Phase 7 (US5: Build Tools)
                 ├─> Phase 8 (US6: Folder Structure)
                 ├─> Phase 9 (US7: Dev Tools)
                 └─> Phase 10 (US8: TypeScript)
                      └─> Phase 11 (Polish)
```

## Phase 1: Setup & Prerequisites

**Goal**: Validate prerequisites and prepare environment for workspace creation.

**Independent Test**: Prerequisites validated successfully; environment ready for workspace initialization.

### Tasks

- [X] T001 Validate Node.js version is 20.13.0 or higher in setup script
- [X] T002 Validate npm is available and accessible in setup script
- [X] T003 Check for existing files/directories (angular.json, package.json, projects/, src/) and fail with clear error message if found
- [X] T004 Validate Angular CLI can be installed/accessed for version 20.2.0

## Phase 2: Foundational Configuration

**Goal**: Create base configuration files that are prerequisites for all projects.

**Independent Test**: Base configuration files exist and are valid.

### Tasks

- [X] T005 Create root .gitignore file with Angular workspace patterns
- [X] T006 Create root .editorconfig file for consistent editor settings
- [X] T007 Create root .npmrc file for npm configuration

## Phase 3: User Story 1 - Create Angular Workspace

**Goal**: Create Angular workspace with Angular v20.2.0 as foundation for dashboard library and application.

**Independent Test**: Workspace created successfully; angular.json, package.json, tsconfig.json present; Angular version verified as v20.2.0.

**Acceptance Criteria**:
- Workspace structure established with angular.json configuration
- All required workspace files present (package.json, tsconfig.json, angular.json)
- Workspace uses Angular v20.2.0

### Tasks

- [X] T008 [US1] Initialize Angular workspace with Angular CLI v20.2.0 using `ng new` command
- [X] T009 [US1] Verify angular.json exists and contains valid workspace configuration
- [X] T010 [US1] Verify package.json exists with Angular v20.2.0 dependencies
- [X] T011 [US1] Verify tsconfig.json exists at root level
- [X] T012 [US1] Validate Angular version in package.json matches v20.2.0 exactly

## Phase 4: User Story 2 - Create Library Project

**Goal**: Create library project named `d3-dashboards` in projects/d3-dashboards for reusable dashboard components.

**Independent Test**: Library project created successfully; ng-package.json and tsconfig.lib.json configured correctly; library builds successfully.

**Acceptance Criteria**:
- Library project structure established in projects/d3-dashboards
- ng-package.json and tsconfig.lib.json configured correctly
- Library builds successfully and generates distributable package

### Tasks

- [X] T013 [US2] Generate library project using `ng generate library d3-dashboards` command
- [X] T014 [US2] Verify library project structure exists in projects/d3-dashboards/
- [X] T015 [US2] Verify ng-package.json exists in projects/d3-dashboards/ with correct configuration
- [X] T016 [US2] Verify tsconfig.lib.json exists in projects/d3-dashboards/ with library-specific TypeScript settings
- [X] T017 [US2] Verify projects/d3-dashboards/src/lib/ directory structure exists
- [X] T018 [US2] Verify library entry point test.ts exists in projects/d3-dashboards/src/

## Phase 5: User Story 3 - Create Application Project

**Goal**: Create application project in src/ at root level for testing and demonstrating dashboard library.

**Independent Test**: Application project created successfully; proper src structure with app, assets, main.ts; application runs successfully and displays in browser.

**Acceptance Criteria**:
- Application project structure established in src/ (root level)
- Application has proper src structure with app, assets, and main.ts
- Application starts successfully and displays in browser

### Tasks

- [X] T019 [US3] Verify application project structure exists in src/ at root level
- [X] T020 [US3] Verify src/app/ directory exists with app.component files
- [X] T021 [US3] Verify src/assets/ directory exists
- [X] T022 [US3] Verify src/main.ts exists as application entry point
- [X] T023 [US3] Verify src/index.html exists
- [X] T024 [US3] Verify src/styles.scss exists
- [X] T025 [US3] Verify app.config.ts exists in src/app/

## Phase 6: User Story 4 - Install Dependencies

**Goal**: Install all required dependencies using npm matching constitution versions for Angular, D3.js, PrimeNG, and other libraries.

**Independent Test**: All dependencies installed successfully using npm; production and development dependencies available; versions match constitution requirements.

**Acceptance Criteria**:
- All production dependencies installed (Angular, D3.js, PrimeNG, etc.)
- All development dependencies installed (Jest, ng-packagr, etc.)
- All dependencies match required versions from constitution

### Tasks

- [X] T026 [US4] Install production dependencies using npm: @angular/core@20.2.0, @angular/common@20.2.0, @angular/platform-browser@20.2.0, @angular/platform-browser-dynamic@20.2.0, @angular/router@20.2.0, @angular/forms@20.2.0, @angular/animations@20.2.0, @angular/compiler@20.2.0
- [X] T027 [US4] Install production dependencies using npm: d3@^7.8.5, rxjs@~7.8.0, zone.js@~0.15.1, tslib@^2.0.0
- [X] T028 [US4] Install production dependencies using npm: primeng@20.0.0, @primeng/themes@20.0.0, primeflex@^4.0.0, primeicons@^7.0.0
- [X] T029 [US4] Install production dependencies using npm: angular-gridster2@^20.0.0, lodash-es@^4.17.21, uuid@^9.0.0
- [X] T030 [US4] Install development dependencies using npm: @angular/cli@20.2.0, @angular-devkit/build-angular@20.2.0, ng-packagr@20.2.0
- [X] T031 [US4] Install development dependencies using npm: jest@^29.7.0, jest-preset-angular@^14.6.1, @types/jest@^29.5.0, @types/node@^20.0.0
- [X] T032 [US4] Install development dependencies using npm: typescript@~5.8.0, @types/d3@^7.4.0, @types/lodash-es@^4.17.12, @types/uuid@^9.0.0
- [X] T033 [US4] Install development dependencies using npm: eslint@^8.57.0, @typescript-eslint/parser@^7.0.0, @typescript-eslint/eslint-plugin@^7.0.0, prettier@^3.0.0
- [X] T034 [US4] Verify all installed dependency versions match constitution requirements in package.json
- [X] T035 [US4] Run npm install to ensure all dependencies are properly resolved

## Phase 7: User Story 5 - Configure Build Tools

**Goal**: Configure build tools (ng-packagr for library, Angular CLI for application) to enable building library and application correctly.

**Independent Test**: Build tools configured successfully; library and application build successfully; build configuration supports development and production builds.

**Acceptance Criteria**:
- ng-packagr configured correctly for library packaging
- Application build configuration supports development and production builds
- Both library and application build successfully

### Tasks

- [ ] T036 [US5] Configure ng-packagr in projects/d3-dashboards/ng-package.json with tree shaking and proper entry points
- [ ] T037 [US5] Verify angular.json contains library build configuration for d3-dashboards project
- [ ] T038 [US5] Verify angular.json contains application build configuration with development and production environments
- [ ] T039 [US5] Test library build using `ng build d3-dashboards` command
- [ ] T040 [US5] Test application build using `ng build` command

## Phase 8: User Story 6 - Establish Folder Structure

**Goal**: Establish proper folder structure for components, services, entities, charts, abstract classes, and utilities.

**Independent Test**: All required folder structures created successfully; public-api.ts exists; folder structure matches requirements specification.

**Acceptance Criteria**:
- All required directories exist (components, services, entities, charts, abstract, utils) in library
- public-api.ts exists for library exports
- All required directories exist (components, services, models) in application

### Tasks

- [ ] T041 [US6] Create projects/d3-dashboards/src/lib/components/ directory
- [ ] T042 [US6] Create projects/d3-dashboards/src/lib/services/ directory
- [ ] T043 [US6] Create projects/d3-dashboards/src/lib/entities/ directory
- [ ] T044 [US6] Create projects/d3-dashboards/src/lib/charts/ directory
- [ ] T045 [US6] Create projects/d3-dashboards/src/lib/abstract/ directory
- [ ] T046 [US6] Create projects/d3-dashboards/src/lib/utils/ directory
- [ ] T047 [US6] Create projects/d3-dashboards/src/lib/public-api.ts file with initial exports
- [ ] T048 [US6] Create src/app/components/ directory
- [ ] T049 [US6] Create src/app/services/ directory
- [ ] T050 [US6] Create src/app/models/ directory

## Phase 9: User Story 7 - Configure Development Tools

**Goal**: Configure development tools (ESLint, Prettier, Jest) for linting, formatting, and testing.

**Independent Test**: ESLint, Prettier, and Jest configured successfully; lint, format, and test commands work correctly.

**Acceptance Criteria**:
- ESLint rules set up and linting works
- Prettier formatting set up and formatting works
- Jest testing framework set up and tests can run

### Tasks

- [ ] T051 [US7] Create .eslintrc.json file with TypeScript and Angular-specific rules
- [ ] T052 [US7] Configure ESLint to extend @typescript-eslint/recommended and Angular recommended rules
- [ ] T053 [US7] Create .prettierrc file with code formatting rules
- [ ] T054 [US7] Create .prettierignore file to exclude build artifacts and dependencies
- [ ] T055 [US7] Create jest.config.js file with jest-preset-angular configuration
- [ ] T056 [US7] Configure Jest to use jest-preset-angular preset and proper test file patterns
- [ ] T057 [US7] Test ESLint by running `npm run lint` command
- [ ] T058 [US7] Test Prettier by running `npm run format` command
- [ ] T059 [US7] Test Jest by running `npm test` command

## Phase 10: User Story 8 - Configure TypeScript

**Goal**: Configure TypeScript with strict mode enabled for type safety from the start.

**Independent Test**: TypeScript strict mode enabled successfully; TypeScript compilation succeeds with no errors; strict mode errors are caught correctly.

**Acceptance Criteria**:
- Strict mode enabled in tsconfig.json
- TypeScript strict mode errors are caught
- Both library and app configs have appropriate TypeScript settings

### Tasks

- [ ] T060 [US8] Configure tsconfig.json with strict mode enabled (strict: true, noImplicitAny: true, strictNullChecks: true, etc.)
- [ ] T061 [US8] Create tsconfig.base.json with shared TypeScript configuration
- [ ] T062 [US8] Configure projects/d3-dashboards/tsconfig.lib.json to extend base config with library-specific settings
- [ ] T063 [US8] Verify src/tsconfig.app.json extends base config with application-specific settings
- [ ] T064 [US8] Test TypeScript compilation by running `npx tsc --noEmit` command
- [ ] T065 [US8] Verify strict mode catches type errors by attempting to compile code with type issues

## Phase 11: Polish & Cross-Cutting Concerns

**Goal**: Finalize setup with package.json scripts, README files, and validation of all configurations.

**Independent Test**: All package.json scripts execute successfully; README files created with essential setup instructions; workspace builds and runs successfully; all configurations validated.

**Acceptance Criteria**:
- Package.json scripts configured (build, test, lint, format, serve, clean)
- README files created with essential setup instructions
- Workspace builds successfully
- Application runs successfully
- All configurations match constitution requirements

### Tasks

- [ ] T066 Configure package.json scripts: build (library and app), test (Jest), lint (ESLint), format (Prettier), serve (dev server), clean (remove dist and build artifacts)
- [ ] T067 Create README.md at root with essential setup instructions: Node.js version requirement, installation steps, basic usage, links to detailed docs
- [ ] T068 Create projects/d3-dashboards/README.md with library-specific setup instructions
- [ ] T069 Validate all dependency versions in package.json match constitution requirements
- [ ] T070 Validate TypeScript strict mode is enabled in all tsconfig files
- [ ] T071 Validate ESLint configuration matches code quality standards
- [ ] T072 Validate Jest configuration with jest-preset-angular is correct
- [ ] T073 Run final workspace build test: `npm run build`
- [ ] T074 Run final application serve test: `npm run serve` and verify it displays in browser
- [ ] T075 Verify all folder structures match requirements specification exactly

## Parallel Execution Opportunities

### Phase 3 (US1: Workspace)
- T009, T010, T011 can run in parallel (all verification tasks)

### Phase 4 (US2: Library)
- T014, T015, T016, T017, T018 can run in parallel (all verification tasks)

### Phase 5 (US3: Application)
- T020, T021, T022, T023, T024, T025 can run in parallel (all verification tasks)

### Phase 6 (US4: Dependencies)
- T026, T027, T028, T029 can run in parallel (different dependency groups)
- T030, T031, T032, T033 can run in parallel (different dev dependency groups)

### Phase 8 (US6: Folder Structure)
- T041, T042, T043, T044, T045, T046 can run in parallel (all directory creation)
- T048, T049, T050 can run in parallel (all application directory creation)

### Phase 9 (US7: Dev Tools)
- T051, T053, T055 can run in parallel (all config file creation)
- T057, T058, T059 can run in parallel (all testing tasks)

### Phase 10 (US8: TypeScript)
- T060, T061 can run in parallel (base configs)
- T062, T063 can run in parallel (project-specific configs)

### Phase 11 (Polish)
- T066, T067, T068 can run in parallel (scripts and READMEs)
- T069, T070, T071, T072 can run in parallel (all validation tasks)

## Task Summary

**Total Tasks**: 75  
**Tasks by User Story**:
- Phase 1 (Setup): 4 tasks
- Phase 2 (Foundational): 3 tasks
- US1 (Workspace): 5 tasks
- US2 (Library): 6 tasks
- US3 (Application): 7 tasks
- US4 (Dependencies): 10 tasks
- US5 (Build Tools): 5 tasks
- US6 (Folder Structure): 10 tasks
- US7 (Dev Tools): 9 tasks
- US8 (TypeScript): 6 tasks
- Phase 11 (Polish): 10 tasks

**Parallel Opportunities**: 8 phases with parallelizable tasks identified

**Suggested MVP Scope**: Complete Phases 1-6 (Setup through Dependencies) to establish functional workspace foundation.

