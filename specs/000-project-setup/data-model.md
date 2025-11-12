# Data Model: Project Setup and Structure

**Feature**: 000-project-setup  
**Date**: 2025-01-27  
**Status**: Complete

## Overview

This document defines the configuration entities and structural models for the Angular workspace setup. Unlike typical features, this setup phase primarily involves configuration files and project structure rather than runtime data models.

## Configuration Entities

### Angular Workspace Configuration

**Entity**: `AngularWorkspace`

**Description**: Root workspace configuration managed by Angular CLI.

**Properties**:
- `version`: string - Angular CLI version (^20.2.0)
- `projects`: Record<string, ProjectConfiguration> - Project configurations
- `defaultProject`: string - Default project name
- `schematics`: object - Custom schematics configuration
- `cli`: object - CLI configuration options

**File Location**: `angular.json`

**Validation Rules**:
- Must contain `d3-dashboards` library project
- Must contain application project in `src/` (root level)
- Must have valid project configurations

### Library Project Configuration

**Entity**: `LibraryProject`

**Description**: Configuration for the reusable dashboard library project.

**Properties**:
- `projectType`: "library" - Fixed value
- `root`: string - Project root path ("projects/d3-dashboards")
- `sourceRoot`: string - Source root path ("projects/d3-dashboards/src")
- `prefix`: string - Component selector prefix ("lib")
- `architect`: object - Build and test configurations
  - `build`: ng-packagr configuration
  - `test`: Jest configuration
  - `lint`: ESLint configuration

**File Location**: `angular.json` (under projects.d3-dashboards)

**Validation Rules**:
- Must have ng-packagr build configuration
- Must have Jest test configuration
- Must reference `ng-package.json`

### Application Project Configuration

**Entity**: `ApplicationProject`

**Description**: Configuration for the test/demonstration application project.

**Properties**:
- `projectType`: "application" - Fixed value
- `root`: string - Project root path (root level, no subdirectory)
- `sourceRoot`: string - Source root path ("src")
- `prefix`: string - Component selector prefix ("app")
- `architect`: object - Build, serve, and test configurations
  - `build`: Angular CLI build configuration
  - `serve`: Development server configuration
  - `test`: Jest configuration
  - `lint`: ESLint configuration

**File Location**: `angular.json` (under projects, or as default project at root)

**Validation Rules**:
- Must have build configuration with optimization
- Must have serve configuration for development
- Must reference library project for imports

### TypeScript Configuration

**Entity**: `TypeScriptConfig`

**Description**: TypeScript compiler configuration.

**Properties**:
- `compilerOptions`: object - Compiler options
  - `strict`: true - Mandatory (constitution requirement)
  - `target`: string - Target ES version
  - `module`: string - Module system
  - `lib`: string[] - Library files to include
  - `declaration`: boolean - Generate declaration files
  - `declarationMap`: boolean - Generate declaration maps
  - `sourceMap`: boolean - Generate source maps
  - `outDir`: string - Output directory
  - `rootDir`: string - Root directory
  - `baseUrl`: string - Base URL for module resolution
  - `paths`: object - Path mappings
- `include`: string[] - Files to include
- `exclude`: string[] - Files to exclude
- `extends`: string - Base configuration to extend

**File Locations**:
- `tsconfig.json` - Root configuration
- `tsconfig.base.json` - Base configuration
- `projects/d3-dashboards/tsconfig.lib.json` - Library configuration
- `tsconfig.app.json` (root level) - Application configuration

**Validation Rules**:
- `strict` must be `true` in all configurations
- Path mappings must be configured for library imports
- Declaration files must be generated for library

### Package Configuration

**Entity**: `PackageConfig`

**Description**: npm package configuration with dependencies.

**Properties**:
- `name`: string - Package name
- `version`: string - Package version
- `description`: string - Package description
- `dependencies`: object - Production dependencies
  - `@angular/*`: "^20.2.0" - Angular packages
  - `d3`: "^7.8.5" - D3.js
  - `primeng`: "^20.0.0" - PrimeNG
  - `rxjs`: "~7.8.0" - RxJS
  - `zone.js`: "~0.15.1" - Zone.js
  - Additional dependencies per constitution
- `devDependencies`: object - Development dependencies
  - `@angular/cli`: "^20.2.0" - Angular CLI
  - `ng-packagr`: "^20.2.0" - Library packaging
  - `jest`: "^29.7.0" - Testing framework
  - `jest-preset-angular`: "^14.6.1" - Angular testing utilities
  - `typescript`: "~5.8.0" - TypeScript
  - Additional dev dependencies per constitution
- `scripts`: object - npm scripts
  - `build`: string - Build command
  - `test`: string - Test command
  - `lint`: string - Lint command
  - `format`: string - Format command

**File Location**: `package.json`

**Validation Rules**:
- All dependency versions must match constitution exactly
- All required dependencies must be present
- Scripts must be configured for common tasks

### ng-packagr Configuration

**Entity**: `NgPackagrConfig`

**Description**: Configuration for library packaging with ng-packagr.

**Properties**:
- `$schema`: string - JSON schema reference
- `dest`: string - Output directory ("../../dist/d3-dashboards")
- `lib`: object - Library configuration
  - `entryFile`: string - Entry file ("public-api.ts")
  - `umdModuleIds`: object - UMD module IDs
  - `cssUrl`: string - CSS URL handling
  - `styleIncludePaths`: string[] - Style include paths

**File Location**: `projects/d3-dashboards/ng-package.json`

**Validation Rules**:
- Must reference `public-api.ts` as entry file
- Must configure proper output directory
- Must support tree shaking

### Jest Configuration

**Entity**: `JestConfig`

**Description**: Jest testing framework configuration.

**Properties**:
- `preset`: string - Preset ("jest-preset-angular")
- `setupFilesAfterEnv`: string[] - Setup files
- `testMatch`: string[] - Test file patterns
- `collectCoverageFrom`: string[] - Coverage collection patterns
- `coverageThreshold`: object - Coverage thresholds
  - `global`: object
    - `branches`: number - Branch coverage (80)
    - `functions`: number - Function coverage (80)
    - `lines`: number - Line coverage (80)
    - `statements`: number - Statement coverage (80)
- `moduleNameMapper`: object - Module name mappings
- `transform`: object - Transform configurations
- `testEnvironment`: string - Test environment ("jsdom")

**File Location**: `jest.config.js`

**Validation Rules**:
- Must use jest-preset-angular preset
- Must configure 80% minimum coverage (constitution requirement)
- Must map TypeScript paths correctly

### ESLint Configuration

**Entity**: `ESLintConfig`

**Description**: ESLint linting configuration.

**Properties**:
- `root`: boolean - Root configuration flag
- `ignorePatterns`: string[] - Patterns to ignore
- `overrides`: object[] - Rule overrides
  - `files`: string[] - File patterns
  - `extends`: string[] - Extended configurations
  - `rules`: object - Rule configurations

**File Location**: `.eslintrc.json`

**Validation Rules**:
- Must include Angular-specific rules
- Must enforce TypeScript best practices
- Must be compatible with Prettier

### Prettier Configuration

**Entity**: `PrettierConfig`

**Description**: Prettier code formatting configuration.

**Properties**:
- `semi`: boolean - Semicolon usage
- `trailingComma`: string - Trailing comma style
- `singleQuote`: boolean - Single quote preference
- `printWidth`: number - Line width
- `tabWidth`: number - Tab width
- `useTabs`: boolean - Use tabs flag

**File Location**: `.prettierrc`

**Validation Rules**:
- Must be compatible with ESLint
- Must follow Angular style guide preferences

## Project Structure Model

### Folder Structure Entity

**Entity**: `ProjectStructure`

**Description**: Hierarchical folder structure for the workspace.

**Properties**:
- `workspaceRoot`: string - Root directory
- `libraryProject`: LibraryStructure - Library project structure
- `applicationProject`: ApplicationStructure - Application project structure
- `configFiles`: ConfigFile[] - Configuration files

**Validation Rules**:
- All required folders must exist
- Folder structure must match constitution requirements
- All configuration files must be present

### Library Structure

**Entity**: `LibraryStructure`

**Description**: Folder structure for library project.

**Properties**:
- `root`: string - "projects/d3-dashboards"
- `src`: string - "projects/d3-dashboards/src"
- `lib`: string - "projects/d3-dashboards/src/lib"
- `components`: string - "projects/d3-dashboards/src/lib/components"
- `services`: string - "projects/d3-dashboards/src/lib/services"
- `entities`: string - "projects/d3-dashboards/src/lib/entities"
- `charts`: string - "projects/d3-dashboards/src/lib/charts"
- `abstract`: string - "projects/d3-dashboards/src/lib/abstract"
- `utils`: string - "projects/d3-dashboards/src/lib/utils"
- `publicApi`: string - "projects/d3-dashboards/src/lib/public-api.ts"

**Validation Rules**:
- All folders must exist (can be empty)
- `public-api.ts` must exist and export public APIs

### Application Structure

**Entity**: `ApplicationStructure`

**Description**: Folder structure for application project.

**Properties**:
- `root`: string - Root level (no subdirectory)
- `src`: string - "src"
- `app`: string - "src/app"
- `components`: string - "src/app/components"
- `services`: string - "src/app/services"
- `models`: string - "src/app/models"
- `assets`: string - "src/assets"
- `main`: string - "src/main.ts"
- `index`: string - "src/index.html"

**Validation Rules**:
- All folders must exist (can be empty)
- `main.ts` must exist and bootstrap application
- `index.html` must exist

## State Transitions

### Setup Process States

**Initial State**: `NotInitialized`
- No workspace exists
- No configuration files present

**Transition 1**: `WorkspaceCreated`
- Angular workspace initialized
- `angular.json` exists
- `package.json` exists

**Transition 2**: `ProjectsCreated`
- Library project created
- Application project created
- Project folders exist

**Transition 3**: `DependenciesInstalled`
- All dependencies installed
- `node_modules` populated
- Versions verified

**Transition 4**: `ToolsConfigured`
- TypeScript configured
- ESLint configured
- Prettier configured
- Jest configured

**Transition 5**: `StructureEstablished`
- All folders created
- Configuration files in place
- `public-api.ts` created

**Final State**: `ReadyForDevelopment`
- All setup complete
- Build succeeds
- Application runs
- Tests can execute

## Validation Rules Summary

### Mandatory Validations

1. **Dependency Versions**: All versions must match constitution exactly
2. **TypeScript Strict Mode**: Must be enabled in all configurations
3. **Folder Structure**: Must match constitution requirements exactly
4. **Build Success**: Library and application must build successfully
5. **Test Execution**: Jest must run successfully
6. **Linting**: ESLint must execute without errors
7. **Formatting**: Prettier must format code correctly

### Optional Validations

1. **Coverage Thresholds**: Can be verified after tests are written
2. **Performance Metrics**: Can be measured after application runs
3. **Browser Compatibility**: Can be tested after application is functional

## Relationships

### Configuration Dependencies

```
AngularWorkspace
  ├── LibraryProject (references ng-package.json)
  └── ApplicationProject (references library project)

PackageConfig
  ├── Dependencies (used by both projects)
  └── DevDependencies (used by build/test tools)

TypeScriptConfig
  ├── RootConfig (base for all)
  ├── LibraryConfig (extends root)
  └── ApplicationConfig (extends root)

JestConfig (uses jest-preset-angular)
ESLintConfig (uses Angular ESLint rules)
PrettierConfig (complements ESLint)
```

### File Dependencies

```
angular.json
  ├── references projects/d3-dashboards/ng-package.json
  └── references tsconfig files

tsconfig.json
  └── extends tsconfig.base.json

projects/d3-dashboards/tsconfig.lib.json
  └── extends tsconfig.base.json

tsconfig.app.json (root level)
  └── extends tsconfig.base.json

package.json
  └── dependencies used by angular.json build configs
```

## Conclusion

This data model defines all configuration entities and structural models required for the Angular workspace setup. All entities must be validated to ensure compliance with constitution requirements and successful project initialization.

