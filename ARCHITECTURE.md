# Architecture Overview

How `@afframe/ui` is put together. Decisions behind it: [docs/decisions/](docs/decisions/README.md).

## 1. Project Structure

Layout: [docs/package-structure.md](docs/package-structure.md).

## 2. High-Level System Diagram

```
@carbon/react, @carbon/ibm-products, @carbon-labs/*, extras (exact dependencies)
                 |
                 v
          afframe/ui (this repo)
  re-export as is | Afframe wrappers | Afframe components | Sass build
                 |
                 v
   dist/: ESM JS + types, styles.css, charts.css, fonts
                 |
                 v  GitHub Packages
   consumer app: import '@afframe/ui/styles.css'; <AfframeProvider>; components from '@afframe/ui'
```

## 3. Core Components

### 3.1. The package

Name: `@afframe/ui`.

Description: one import path, `@afframe/ui`, for every component. Icons, pictograms and JavaScript token values follow Carbon's own pattern (`@carbon/react/icons`): subpaths `@afframe/ui/icons`, `@afframe/ui/pictograms` and `@afframe/ui/tokens`, with Carbon's names. Carbon components are re-exported by name as they are; only components Afframe changes get an Afframe wrapper. The components IBM is moving from IBM Products into Carbon core are exported under Afframe names, backed by IBM Products until Carbon v12 is stable. Extras (Carbon Charts, ECharts with the Carbon theme, `@carbon/ai-chat`, TanStack data grid, onboarding, Labs) come through the same path and must tree-shake out of apps that do not use them: each extra family is its own `'use client'` module, and the AI chat loads lazily ([docs/package-structure.md](docs/package-structure.md)).

Technologies: React, TypeScript, Carbon `@carbon/react` on the stable line with the v12 feature flags on (ADR 0002), Sass. Versions: `package.json`.

Deployment: GitHub Packages (npm registry, `@afframe` scope), published from `v*` tags by `.github/workflows/release.yml` (ADR 0016).

### 3.2. AfframeProvider

Wraps the consumer app once. Turns on the React side of the v12 flags (`<FeatureFlags enableV12Release>` plus the other enabled flags) and applies IBM Products package settings. UI strings are overridden per component through a `messages` prop (ADR 0014); amounts and dates come from the server-safe formatters in `src/format` (cs-CZ, Europe/Prague, CZK by default). Its module enables IBM Products' canary components (listed in [docs/feature-flags.md](docs/feature-flags.md)) at load, before the first render. It does not set the theme (see 3.3). It is a client component. Flags: [docs/feature-flags.md](docs/feature-flags.md).

### 3.3. Styles

One Sass build compiles Carbon, IBM Products and Afframe styles with `$feature-flags: ('enable-v12-release': true)` into `dist/styles.css`. Consumers never touch Sass. Prefixes stay `cds` (Carbon) and `c4p` (IBM Products). Themes `light`, `dark` and `system` (follows the OS), chosen by `data-afframe-theme` on `<html>`. The app renders that attribute on the server and the CSS does the rest, so the theme does not flash. Carbon Charts CSS is compiled separately into `dist/charts.css`, which an app that renders charts imports as well. IBM Plex fonts ship in `dist/fonts/`, referenced by relative URLs.

### 3.4. Storybook

Workbench and component docs. Each component has a docs page first, copied from Carbon or IBM Products and extended with Afframe content; Afframe's own components follow the same structure.

## 4. Data Stores

None. This is a UI library.

## 5. External Integrations / APIs

Upstream packages from npm (Carbon, IBM Products, Carbon Labs, Carbon Charts, ECharts, `@carbon/ai-chat`, TanStack Table). They are exact regular dependencies, kept current by Dependabot: [docs/guides/updating-carbon.md](docs/guides/updating-carbon.md).

## 6. Deployment & Infrastructure

CI/CD Pipeline: GitHub Actions (`.github/workflows/`): fast checks in `ci.yml` on every PR, with `ci` as the required check (`.github/rulesets/main.json`), heavy checks in `release-checks.yml` before a release, and publishing in `release.yml`; rulesets as code in `.github/rulesets/`; jobs and how to run them: [docs/developer-handbook.md](docs/developer-handbook.md). Dependabot (`.github/dependabot.yml`) keeps dependency and action pins current.

## 7. Security Considerations

- Public repo: no secrets or confidential information in code, docs, commits or PRs; the `secrets` CI job scans the full git history with gitleaks (`.gitleaks.toml`); secrets only in GitHub Actions secrets.
- IBM Telemetry off: ADR 0007.
- Dependencies pinned to exact versions; updates arrive as reviewed Dependabot PRs.
- Vulnerability reports: `SECURITY.md`.

## 8. Development & Testing Environment

Local setup: [docs/developer-handbook.md](docs/developer-handbook.md).

Build: tsdown for JavaScript (per-file ESM, `'use client'` kept), `tsc` for type declarations, Sass for `styles.css`.

Testing Frameworks: Vitest browser mode (Playwright, Chromium) with Testing Library; every story runs as a test with the Storybook a11y addon, violations fail; screenshot tests for Afframe-owned components against committed Linux baselines. `pnpm test` runs them; detail: [docs/testing.md](docs/testing.md).

Code Quality Tools: ESLint, Stylelint with `stylelint-plugin-carbon-tokens`, Prettier.

## 9. Known limits

- Carbon v11 with the v12 flags until v12 ships as stable: issue #2.
- Workarounds waiting for upstream fixes: issue #4.
- Component limits: issue #9; client bundle size of the Carbon barrel: issue #8.
- Open work: [GitHub issues](https://github.com/afframe/ui/issues).

## 10. Project Identification

Project Name: Afframe UI (`@afframe/ui`).

Repository URL: https://github.com/afframe/ui

## 11. Glossary / Acronyms

Carbon: IBM's Carbon Design System (`@carbon/react`, `@carbon/styles`).

IBM Products: `@carbon/ibm-products`, Carbon's product-pattern library (prefix `c4p`).

Carbon Labs: `@carbon-labs/*`, Carbon's experimental packages.

v12 flags: Carbon feature flags (`enable-v12-release` and `enable-v12-*`) that turn on v12 behaviour inside v11.

Migrated components: the components IBM is moving from IBM Products into Carbon core for v12.

Afframe-owned component: a component Afframe wraps, changes or builds; as opposed to a Carbon component re-exported as is.
