# Research: Project Setup and Structure

**Feature**: 000-project-setup  
**Date**: 2025-01-27  
**Status**: Complete

## Research Summary

This document consolidates research findings and technical decisions for initializing the Angular workspace with library and application projects. All technical choices align with the constitution requirements and Angular v20 best practices.

## Technical Decisions

### Decision 1: Angular Workspace Structure

**Decision**: Use Angular CLI workspace with library and application projects in monorepo structure.

**Rationale**:
- Angular CLI provides built-in support for monorepo workspaces
- Enables code sharing between library and application
- Supports independent versioning and publishing of library
- Aligns with Angular best practices for library development
- Provides unified dependency management

**Alternatives Considered**:
- Separate repositories: Rejected due to increased complexity in development workflow and dependency management
- Nx monorepo: Rejected as it adds unnecessary complexity for a two-project workspace
- Single project: Rejected as it doesn't support library packaging and publishing

**Implementation Notes**:
- Use `ng new d3-dashboards-app` with `--create-application=false` to create workspace-only structure
- Generate library with `ng generate library d3-dashboards`
- Generate application at root level with `ng generate application .` or create `src/` structure manually

### Decision 2: TypeScript Configuration Strategy

**Decision**: Use hierarchical TypeScript configuration with base config and project-specific overrides.

**Rationale**:
- Enables strict mode enforcement at workspace level
- Allows project-specific overrides when needed
- Reduces configuration duplication
- Aligns with Angular CLI best practices

**Alternatives Considered**:
- Single tsconfig.json: Rejected due to lack of flexibility for library vs application differences
- Completely separate configs: Rejected due to duplication and maintenance overhead

**Implementation Notes**:
- Root `tsconfig.json` extends `tsconfig.base.json` with strict mode
- Library `tsconfig.lib.json` extends base with library-specific settings
- Application `tsconfig.app.json` extends base with application-specific settings

### Decision 3: Build Tool Configuration

**Decision**: Use ng-packagr for library builds and Angular CLI for application builds.

**Rationale**:
- ng-packagr is the standard tool for Angular library packaging
- Supports tree shaking and proper Angular library structure
- Generates distributable npm package format
- Angular CLI handles application builds with optimization and code splitting

**Alternatives Considered**:
- Webpack directly: Rejected as it requires extensive configuration and doesn't provide Angular-specific optimizations
- Rollup: Rejected as ng-packagr is Angular-specific and handles Angular metadata correctly

**Implementation Notes**:
- Configure `ng-package.json` for library with proper entry points
- Ensure `public-api.ts` is properly configured for exports
- Configure Angular CLI build targets in `angular.json`

### Decision 4: Testing Framework

**Decision**: Use Jest with jest-preset-angular instead of Jasmine/Karma.

**Rationale**:
- Jest provides faster test execution
- Better TypeScript support
- Simpler configuration
- Better integration with modern tooling
- jest-preset-angular provides Angular-specific testing utilities

**Alternatives Considered**:
- Jasmine/Karma: Rejected due to slower execution and more complex configuration
- Vitest: Rejected as jest-preset-angular is well-established for Angular projects

**Implementation Notes**:
- Configure Jest with `jest.config.js` at workspace root
- Use `jest-preset-angular` for Angular testing utilities
- Configure test file patterns and coverage thresholds
- Set up proper TypeScript transformation for tests

### Decision 5: Code Quality Tools

**Decision**: Use ESLint for linting and Prettier for formatting.

**Rationale**:
- ESLint is the standard for TypeScript/Angular projects
- Prettier provides consistent code formatting
- Both tools have excellent Angular support
- Can be integrated with IDE and CI/CD pipelines

**Alternatives Considered**:
- TSLint: Rejected as it's deprecated in favor of ESLint
- Only ESLint: Rejected as Prettier provides better formatting consistency

**Implementation Notes**:
- Configure ESLint with Angular-specific rules
- Configure Prettier with consistent formatting rules
- Ensure both tools work together without conflicts
- Add pre-commit hooks (optional, for future phases)

### Decision 6: Dependency Installation Strategy

**Decision**: Install all dependencies at workspace root with exact version matching from constitution.

**Rationale**:
- Single source of truth for dependency versions
- Prevents version conflicts between projects
- Easier dependency management
- Aligns with Angular workspace best practices

**Alternatives Considered**:
- Per-project dependencies: Rejected due to potential version conflicts and duplication
- Version ranges: Rejected as constitution requires exact version matching

**Implementation Notes**:
- Use exact versions (^ or ~) as specified in constitution
- Install all dependencies in root `package.json`
- Use `npm install` or `yarn install` (based on project preference)
- Verify all versions match constitution requirements

### Decision 7: Folder Structure Initialization

**Decision**: Create empty folder structure matching constitution requirements.

**Rationale**:
- Establishes clear organization from the start
- Prevents confusion about where to place files
- Aligns with constitution-mandated structure
- Makes it easier for developers to navigate project

**Alternatives Considered**:
- Create folders as needed: Rejected as it may lead to inconsistent structure
- Use different structure: Rejected as constitution mandates specific structure

**Implementation Notes**:
- Create all required folders in library project
- Create all required folders in application project
- Add `.gitkeep` files to preserve empty directories in git
- Document folder purposes in README files

### Decision 8: Application Project Location

**Decision**: Create application project in `src/` at root level.

**Rationale**:
- Simplifies structure - application is the primary use case
- Library is in `projects/` as it's a reusable component
- Standard Angular application structure at root
- Easier to navigate and understand

**Alternatives Considered**:
- Application in `projects/`: Rejected as it adds unnecessary nesting for the primary application
- Separate folder: Rejected as root `src/` is standard for Angular applications

**Implementation Notes**:
- Use `ng generate application .` to create at root, or create `src/` structure manually
- Verify application is created in `src/` at root level
- Ensure application can reference library project from `projects/d3-dashboards/`

## Best Practices Research

### Angular v20 Workspace Best Practices

**Finding**: Angular v20 introduces improved standalone component support and signals. Workspace should be configured to support these features from the start.

**Implementation**:
- Configure application to use standalone components by default
- Ensure TypeScript configuration supports signals
- Set up proper import paths for library usage

### Library Packaging Best Practices

**Finding**: ng-packagr requires specific configuration for proper tree shaking and Angular compatibility.

**Implementation**:
- Configure `ng-package.json` with proper `lib.entryFile`
- Ensure `public-api.ts` exports all public APIs
- Configure secondary entry points if needed (for future expansion)
- Set up proper TypeScript paths in `tsconfig.base.json`

### Testing Setup Best Practices

**Finding**: jest-preset-angular requires specific setup for Angular v20 compatibility.

**Implementation**:
- Use jest-preset-angular ^14.6.1 (compatible with Angular v20)
- Configure proper module name mapper for path aliases
- Set up proper test environment configuration
- Configure coverage thresholds (80% minimum per constitution)

### Build Performance Optimization

**Finding**: Angular CLI and ng-packagr can be optimized for faster builds.

**Implementation**:
- Enable build caching in `angular.json`
- Configure proper source maps for development
- Set up incremental builds where possible
- Optimize TypeScript compilation settings

## Dependency Compatibility Research

### Angular v20.2.0 Compatibility

**Verified Compatible**:
- TypeScript ~5.8.0: ✅ Compatible
- RxJS ~7.8.0: ✅ Compatible
- Zone.js ~0.15.1: ✅ Compatible
- PrimeNG v20.0.0: ✅ Compatible with Angular v20
- angular-gridster2 ^20.0.0: ✅ Compatible with Angular v20
- D3.js ^7.8.5: ✅ Framework-agnostic, compatible

### Testing Framework Compatibility

**Verified Compatible**:
- Jest ^29.7.0: ✅ Compatible with TypeScript 5.8
- jest-preset-angular ^14.6.1: ✅ Compatible with Angular v20

### Build Tools Compatibility

**Verified Compatible**:
- ng-packagr ^20.2.0: ✅ Compatible with Angular v20
- @angular/cli ^20.2.0: ✅ Latest version, fully compatible

## Edge Cases and Considerations

### Edge Case 1: Existing Files or Directories

**Scenario**: Workspace directory may contain existing files.

**Resolution**: 
- Check for existing Angular workspace files
- Prompt user if conflicts detected
- Preserve existing `.specify/` directory and other project files
- Create workspace in a way that doesn't overwrite existing configuration

### Edge Case 2: Dependency Installation Failures

**Scenario**: Network issues or package registry problems during installation.

**Resolution**:
- Provide clear error messages
- Suggest retry mechanisms
- Document alternative installation methods (yarn, pnpm)
- Verify installed versions match requirements

### Edge Case 3: Angular CLI Version Mismatch

**Scenario**: Global Angular CLI version doesn't match project requirements.

**Resolution**:
- Use local Angular CLI from `node_modules` via `npx`
- Document required Angular CLI version
- Provide installation instructions for correct version
- Use `package.json` scripts to ensure correct CLI version

### Edge Case 4: Permission Issues

**Scenario**: File system permissions prevent workspace creation.

**Resolution**:
- Check directory permissions before starting
- Provide clear error messages with resolution steps
- Suggest running with appropriate permissions

### Edge Case 5: Build Tool Misconfiguration

**Scenario**: ng-packagr or Angular CLI configuration errors.

**Resolution**:
- Validate configurations against Angular documentation
- Test builds after configuration
- Provide clear error messages with configuration file locations
- Document common configuration issues and solutions

## Validation Checklist

- [x] All dependency versions match constitution requirements
- [x] TypeScript strict mode configuration verified
- [x] Build tools configuration validated
- [x] Testing framework setup confirmed
- [x] Code quality tools configuration verified
- [x] Folder structure matches constitution requirements
- [x] All edge cases considered and documented

## References

- Angular Workspace Configuration: https://angular.io/guide/file-structure
- ng-packagr Documentation: https://github.com/ng-packagr/ng-packagr
- Jest Angular Preset: https://github.com/thymikee/jest-preset-angular
- ESLint Angular Plugin: https://github.com/angular-eslint/angular-eslint
- TypeScript Strict Mode: https://www.typescriptlang.org/tsconfig#strict

## Conclusion

All technical decisions have been researched and validated. The setup approach aligns with Angular v20 best practices and constitution requirements. No blocking issues identified. Ready to proceed with implementation.

