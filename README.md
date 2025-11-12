# D3 Dashboards Workspace

Monorepo bootstrap for the D3 dashboards initiative. The workspace contains:

- `projects/d3-dashboards` – reusable Angular library for widgets, layouts, and utilities.
- `src/` – demonstration and validation application that consumes the library.

## Requirements

- Node.js **20.13.0** or newer
- npm **11.x**

Validate your environment with:

```bash
node --version
npm --version
```

You can also run `pwsh ./scripts/setup/validate-environment.ps1` for an automated prerequisite check.

## Getting Started

```bash
npm install
npm run build          # builds the application
npm run build:lib      # builds the dashboard library package
```

Launch the dev server:

```bash
npm run serve
# visit http://localhost:4200
```

## Development Toolkit

| Command             | Description                                             |
| ------------------- | ------------------------------------------------------- |
| `npm run lint`      | ESLint with Angular + TypeScript rules                  |
| `npm run format`    | Prettier auto-format for `src/` and `projects/` sources |
| `npm test`          | Jest unit tests via `jest-preset-angular`               |
| `npm run build`     | Production build of the showcase application            |
| `npm run build:lib` | Production build of the dashboard library (ng-packagr)  |
| `npm run serve`     | Angular dev server for the example application          |
| `npm run clean`     | Remove `dist/`, `out-tsc/`, and `coverage/` artifacts   |

Library artifacts are emitted in `dist/d3-dashboards`.

## Documentation

Feature specifications and implementation notes live under `specs/`. Key documents:

- `specs/constitution.md` – architectural and coding standards.
- `specs/000-project-setup/` – detailed plan, research, and implementation tasks.

Refer to these documents before changing tooling or dependency versions.
