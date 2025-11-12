# Quick Start Guide: Project Setup and Structure

**Feature**: 000-project-setup  
**Date**: 2025-01-27

## Overview

This guide provides step-by-step instructions for setting up the Angular workspace with library and application projects. Follow these steps to initialize the project structure, install dependencies, and configure development tools.

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js**: v18.x or higher (LTS recommended)
- **npm**: v9.x or higher (comes with Node.js)
- **Git**: For version control
- **Angular CLI**: Will be installed locally (not required globally)

## Setup Steps

### Step 1: Create Angular Workspace

Create a new Angular workspace without an initial application:

```bash
npx @angular/cli@20.2.0 new d3-dashboards-app --create-application=false --routing=false --style=scss --package-manager=npm
cd d3-dashboards-app
```

**Expected Result**: Workspace structure with `angular.json`, `package.json`, and `tsconfig.json` files.

### Step 2: Generate Library Project

Generate the reusable dashboard library project:

```bash
npx ng generate library d3-dashboards --prefix=lib
```

**Expected Result**: Library project created in `projects/d3-dashboards/` with:
- `src/lib/` directory
- `ng-package.json` configuration
- `tsconfig.lib.json` configuration
- `public-api.ts` file

### Step 3: Generate Application Project

Generate the test/demonstration application project at root level:

```bash
npx ng generate application . --routing=true --style=scss
```

Or create the application structure manually at root `src/`:

**Expected Result**: Application project created in `src/` (root level) with:
- `src/app/` directory
- `src/main.ts` entry point
- `src/index.html` file
- `tsconfig.app.json` configuration

### Step 4: Install Dependencies

Install all production and development dependencies:

```bash
npm install
```

Or install dependencies individually to match constitution requirements:

```bash
# Production dependencies
npm install @angular/animations@^20.2.0 @angular/common@^20.2.0 @angular/compiler@^20.2.0 @angular/core@^20.2.0 @angular/forms@^20.2.0 @angular/platform-browser@^20.2.0 @angular/platform-browser-dynamic@^20.2.0 @angular/router@^20.2.0
npm install angular-gridster2@^20.0.0 d3@^7.8.5 lodash-es@^4.17.21 primeng@^20.0.0 @primeng/themes@^20.0.0 primeflex@^4.0.0 primeicons@^7.0.0
npm install rxjs@~7.8.0 zone.js@~0.15.1 tslib@^2.6.0 uuid@^11.0.0

# Development dependencies
npm install --save-dev @angular-devkit/build-angular@^20.2.0 @angular/cli@^20.2.0 @angular/compiler-cli@^20.2.0
npm install --save-dev @types/d3@^7.4.3 @types/lodash-es@^4.17.12 @types/uuid@^10.0.0
npm install --save-dev jest@^29.7.0 jest-preset-angular@^14.6.1 ng-packagr@^20.2.0 typescript@~5.8.0
```

**Expected Result**: All dependencies installed in `node_modules/` and listed in `package.json`.

### Step 5: Configure TypeScript

Ensure TypeScript strict mode is enabled in all configuration files:

**tsconfig.base.json**:
```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "ES2022",
    "lib": ["ES2022", "DOM"],
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "baseUrl": "./",
    "paths": {
      "d3-dashboards": ["projects/d3-dashboards/src/lib/public-api"]
    }
  }
}
```

**tsconfig.json**:
```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "strict": true
  }
}
```

**projects/d3-dashboards/tsconfig.lib.json**:
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "strict": true,
    "outDir": "../../out-tsc/lib",
    "declaration": true,
    "declarationMap": true
  },
  "include": ["src/**/*.ts"]
}
```

**tsconfig.app.json** (root level):
```json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "strict": true,
    "outDir": "./out-tsc/app"
  },
  "files": ["src/main.ts"],
  "include": ["src/**/*.ts"]
}
```

### Step 6: Configure Jest

Create `jest.config.js` in the workspace root:

```javascript
module.exports = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testMatch: ['**/+(*.)+(spec).+(ts)'],
  collectCoverageFrom: [
    'projects/d3-dashboards/src/**/*.ts',
    '!projects/d3-dashboards/src/**/*.spec.ts',
    '!projects/d3-dashboards/src/**/public-api.ts'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  moduleNameMapper: {
    '^d3-dashboards$': '<rootDir>/projects/d3-dashboards/src/lib/public-api.ts'
  },
  testEnvironment: 'jsdom'
};
```

Create `setup-jest.ts` in the workspace root:

```typescript
import 'jest-preset-angular/setup-jest';
```

### Step 7: Configure ESLint

Create `.eslintrc.json` in the workspace root:

```json
{
  "root": true,
  "ignorePatterns": ["projects/**/*"],
  "overrides": [
    {
      "files": ["*.ts"],
      "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@angular-eslint/recommended",
        "plugin:@angular-eslint/template/process-inline-templates"
      ],
      "rules": {
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/explicit-function-return-type": "warn"
      }
    }
  ]
}
```

Install ESLint dependencies:

```bash
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin @angular-eslint/eslint-plugin @angular-eslint/template-parser
```

### Step 8: Configure Prettier

Create `.prettierrc` in the workspace root:

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

Create `.prettierignore`:

```
node_modules
dist
.angular
coverage
```

### Step 9: Create Folder Structure

Create required folders in the library project:

```bash
mkdir -p projects/d3-dashboards/src/lib/components
mkdir -p projects/d3-dashboards/src/lib/services
mkdir -p projects/d3-dashboards/src/lib/entities
mkdir -p projects/d3-dashboards/src/lib/charts
mkdir -p projects/d3-dashboards/src/lib/abstract
mkdir -p projects/d3-dashboards/src/lib/utils
```

Create required folders in the application project:

```bash
mkdir -p src/app/components
mkdir -p src/app/services
mkdir -p src/app/models
```

Add `.gitkeep` files to preserve empty directories:

```bash
touch projects/d3-dashboards/src/lib/components/.gitkeep
touch projects/d3-dashboards/src/lib/services/.gitkeep
touch projects/d3-dashboards/src/lib/entities/.gitkeep
touch projects/d3-dashboards/src/lib/charts/.gitkeep
touch projects/d3-dashboards/src/lib/abstract/.gitkeep
touch projects/d3-dashboards/src/lib/utils/.gitkeep
touch src/app/components/.gitkeep
touch src/app/services/.gitkeep
touch src/app/models/.gitkeep
```

### Step 10: Configure public-api.ts

Update `projects/d3-dashboards/src/lib/public-api.ts`:

```typescript
/*
 * Public API Surface of d3-dashboards
 */

// Components will be exported here in future features
// Services will be exported here in future features
// Entities will be exported here in future features
// Charts will be exported here in future features
// Abstract classes will be exported here in future features
// Utils will be exported here in future features
```

### Step 11: Configure package.json Scripts

Add scripts to `package.json`:

```json
{
  "scripts": {
    "build": "ng build d3-dashboards",
    "build:app": "ng build",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write \"**/*.{ts,html,scss,json}\"",
    "format:check": "prettier --check \"**/*.{ts,html,scss,json}\"",
    "serve": "ng serve",
    "serve:prod": "ng serve --configuration production"
  }
}
```

### Step 12: Create README Files

Create `README.md` in the workspace root:

```markdown
# D3 Dashboards App

Angular v20 workspace for building D3.js-based dashboard components.

## Projects

- **d3-dashboards**: Reusable dashboard library (in `projects/d3-dashboards/`)
- **Application**: Test/demonstration application (in `src/` at root level)

## Setup

1. Install dependencies: `npm install`
2. Build library: `npm run build`
3. Run application: `npm run serve`

## Development

- Run tests: `npm test`
- Lint code: `npm run lint`
- Format code: `npm run format`
```

## Verification

After completing all steps, verify the setup:

### 1. Verify Workspace Structure

```bash
# Check workspace files exist
ls angular.json package.json tsconfig.json

# Check library project exists
ls projects/d3-dashboards/

# Check application project exists
ls src/
```

### 2. Verify Dependencies

```bash
# Check installed versions match constitution
npm list @angular/core d3 primeng jest
```

### 3. Verify TypeScript Configuration

```bash
# Compile TypeScript (should succeed with no errors)
npx tsc --noEmit
```

### 4. Verify Build

```bash
# Build library (should succeed)
npm run build

# Build application (should succeed)
npm run build:app
```

### 5. Verify Tests

```bash
# Run tests (should pass with no tests initially)
npm test
```

### 6. Verify Application Runs

```bash
# Start development server
npm run serve

# Open http://localhost:4200 in browser
# Should see Angular application
```

## Troubleshooting

### Issue: Angular CLI version mismatch

**Solution**: Use `npx` to ensure correct version:
```bash
npx @angular/cli@20.2.0 <command>
```

### Issue: Dependency installation fails

**Solution**: 
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`
- Reinstall: `npm install`

### Issue: TypeScript strict mode errors

**Solution**: Ensure `strict: true` is set in all `tsconfig.*.json` files.

### Issue: Build fails

**Solution**: 
- Verify all dependencies are installed
- Check `angular.json` configuration
- Verify `ng-package.json` for library project

### Issue: Tests don't run

**Solution**:
- Verify `jest.config.js` exists
- Check `setup-jest.ts` exists
- Verify `jest-preset-angular` is installed

## Next Steps

After successful setup:

1. ✅ Workspace is ready for feature development
2. ✅ All prerequisites are met
3. ✅ Development can proceed with next feature (001-dashboard-container)

## Additional Resources

- [Angular Documentation](https://angular.io/docs)
- [D3.js Documentation](https://d3js.org/)
- [PrimeNG Documentation](https://primeng.org/)
- [Jest Documentation](https://jestjs.io/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

