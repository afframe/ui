# 1. One package built on Carbon React, one import path

Date: 2026-10-05

## Status

Accepted

## Context

Afframe products live in several repos, so the UI has to be an installable package. IBM's Carbon Design System is the foundation and React is the implementation. A multi-package workspace would need separate versions and release tooling for each package. The UI serves every future Afframe use, not one app.

## Decision

Afframe UI is one npm package, `@afframe/ui`, in one repo that is not a monorepo. It has one import path for components, like `@carbon/react`; the extras, including ECharts, come through the same path. The stylesheet is a separate file, `@afframe/ui/styles.css`.

Carbon components are re-exported as they are. Only components Afframe changes get an Afframe wrapper. Afframe-owned components live in co-located folders (code, stories, docs and tests together), as in Carbon; the build strips stories and tests.

The package is distributed through GitHub Packages under the `@afframe` scope. It is not bound to any one consumer app.

## Consequences

Consumers install and import one thing. Tree-shaking must keep heavy extras (ECharts, charts, chat) out of apps that do not import them, so the build must emit tree-shakable per-file ESM. Re-exporting Carbon as is keeps Carbon's own docs and APIs valid and keeps updates cheap. The repo still holds Storybook and one example app (`examples/nextjs`) next to the package.
