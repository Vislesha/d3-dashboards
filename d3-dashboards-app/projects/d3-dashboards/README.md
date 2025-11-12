# D3 Dashboards Library

Angular library providing shared dashboard components, layouts, and utilities. The library is packaged with ng-packagr and consumed by the demo app in `src/`.

## Build

```bash
npm run build:lib
```

Compiled artifacts land in `dist/d3-dashboards`. The package.json generated there is ready for `npm publish` or local linking.

## Local Linking

```bash
npm run build:lib
cd dist/d3-dashboards
npm link
# In a consuming application
npm link d3-dashboards
```

The path mapping `d3-dashboards` → `projects/d3-dashboards/src/public-api` also enables local development without publishing.

## Testing

Library unit tests run through Jest together with the rest of the workspace:

```bash
npm test
```

## File Structure

```
projects/d3-dashboards/
├── src/lib/
│   ├── components/    # reusable widget components
│   ├── services/      # data orchestration and facades
│   ├── entities/      # shared interfaces and models
│   ├── charts/        # D3 chart implementations
│   ├── abstract/      # base classes and mixins
│   └── utils/         # helper functions
├── src/public-api.ts  # central export barrel
└── tsconfig.*.json    # library-specific TypeScript configs
```

Follow the structure above when adding new features so downstream consumers can rely on consistent entry points.
