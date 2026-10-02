> **Pre-verification draft, kept as evidence.** `round4/V4-recommendation.md` verifies it and overrides it where they differ.

# A: hlebtkachenko/analytics, Carbon usage, build output and style delivery

Source: `git clone --depth 200` of github.com/hlebtkachenko/analytics at HEAD `a041d9a` (2026-09-23, merge of PR #88) into a scratch folder. All paths are repo-relative. Read-only; nothing pushed.

## TL;DR for D4 / D5

- **No build artifact for the design system.** `@bap/design-system` is private and its `exports` point straight at `.ts`, `.tsx`, `.scss` and `.css` source (`packages/design-system/package.json:4-30`). Its `build` script only compiles each Sass entry to `/dev/null` as a check (`package.json:32`), and Turbo declares no outputs for it (`turbo.json:10-11`). Consumers transpile it: Next through `transpilePackages: ['@bap/design-system']` (`apps/web/next.config.ts:15`), the workbench through Vite. The spec says so directly: "The package ships source, like every other entrypoint" (`.ai/specs/2026-09-15-table-component-blocks.md:48`). This gives almost no evidence for D4 (published format). By contrast, the non-UI packages do build to `dist/` with `tsc` (`packages/ai/package.json:16`, `packages/db/package.json:33`, `packages/security/package.json:16`).
- **Carbon is a regular dependency, not a peer.** `@carbon/react`, `@carbon/styles`, charts, icons, pictograms and Plex are `dependencies` (`packages/design-system/package.json:41-50`). Only `react`, `react-dom` and `react-is` are peers (`:76-80`).
- **Carbon styles are delivered as Sass source, compiled by each app.** The app imports `@bap/design-system/styles.scss` (`apps/web/src/app/layout.tsx:1`). Carbon Charts, by contrast, comes in as IBM's precompiled CSS (`packages/design-system/src/styles/charts.css:1`: `@import '@carbon/charts-react/styles.css';`). So the repo uses both delivery modes.
- **v12 is off.** "The pinned release enables v11 behavior and keeps v12 release behavior off." (`docs/design-system/knowledge-base/03-developing.md:127`). No Sass `$feature-flags` is configured anywhere (`packages/design-system/src/styles/index.scss:1-4`), and the web app renders no `<FeatureFlags>` (targeted grep of `apps/web/src` and `packages/design-system/src`: only flag metadata exports and inventory tests, e.g. `packages/design-system/src/tokens.test.ts:594-600`).
- **Not used:** IBM Products, Carbon Labs, `@carbon/ai-chat` and TanStack Table. All four have 0 hits in `pnpm-lock.yaml`, so this repo gives no evidence for R4 claims 1 and 4.

## 1. Workspace layout and tooling

| Item | Evidence |
| --- | --- |
| Package manager | pnpm 11.24.0 (`package.json:51`), Node `>=24.21.0 <25` (`package.json:48`) |
| Workspaces | `apps/*`, `packages/*` (`pnpm-workspace.yaml:1-3`) |
| Version pinning | pnpm `catalog:` with `catalogMode: strict`, `saveExact`, `strictPeerDependencies`, `minimumReleaseAge: 1440`, with Carbon versions exempted from the release-age delay (`pnpm-workspace.yaml:137-145`) |
| Orchestrator | Turbo 2.10.12; `build` depends on `^build` (`turbo.json:5-8`) |
| TypeScript | 6.0.3 (`pnpm-workspace.yaml:95`). Shared `@bap/typescript-config/base.json` is strict, with `exactOptionalPropertyTypes`, `noUncheckedIndexedAccess` and `noUncheckedSideEffectImports`. The design-system tsconfig has `moduleResolution: bundler`, `noEmit: true`, `target: es2023` (`packages/design-system/tsconfig.json:4-9`). The Next preset adds `verbatimModuleSyntax` and `isolatedModules` (`packages/typescript-config/nextjs.json`) |
| Shared UI package | `packages/design-system` (`@bap/design-system`). Consumers import it through package `exports` subpaths, not TS path aliases (`package.json:6-30`); the workspace symlink resolves it |
| Build tools per app | web: Next 16.3.4, `next build`, dev with `--turbopack` (`apps/web/package.json:7-8`). workbench: Storybook 10.6.0 `@storybook/react-vite` on Vite 8.3.0 (`apps/design-system-workbench/package.json:7`, `.storybook/main.ts:12`). api and reporting-api: `nest build` (`apps/api/package.json:11`, `apps/reporting-api/package.json:11`). ai, db and security: `tsc -p tsconfig.build.json` to `dist/` |

## 2. Carbon usage

- **Versions** (`pnpm-workspace.yaml:32-45`): `@carbon/react` 1.115.0, `@carbon/styles` 1.114.0, `@carbon/charts-react` 1.27.18, `@carbon/icons-react` 11.87.0, `@carbon/pictograms-react` 11.109.0, `@carbon/themes` 11.80.0, `@carbon/type` 11.66.0, colors/grid/layout/motion; Plex Sans 1.1.0, Mono 2.5.0, Serif 2.0.0. Sass is 1.104.0 (`:90`).
- **Facade pattern.** `react.ts:1-3` is `'use client'; export * from '@carbon/react';`. `charts.ts` works the same way and adds `ChartFrame`. `icons.ts` is a curated named list. The rule is that apps never import `@carbon/*` directly (`docs/design-system/carbon.md:148`, `knowledge-base/03-developing.md:9-24`).
- **Feature flags.**
  - React: flags exist only in the workbench. It resolves every installed flag from a generated catalog, exposes each as a toolbar toggle ("Release default / Enabled / Disabled"), and wraps stories in `<FeatureFlags {...providerFlags} flags={flags}>` (`.storybook/preview.tsx:31-41, 82-93, 130-147`).
  - Sass: none.
  - Inference from the code: turning on `enableV12Release` in the workbench gives v12 React behavior over v11-compiled Carbon CSS. That is the React/Sass mismatch Afframe's force-v12 rule is meant to avoid.
  - Policy: "Feature-flag stories are behavior evidence, not permission to turn on an experimental flag globally." (`03-developing.md:128-129`).
- **Themes.** All four themes are emitted as CSS custom properties under `:root[data-carbon-theme=...]` selectors (`styles/index.scss:8-23`).
  - When no attribute is set, a `prefers-color-scheme: dark` rule applies g100 on first paint (`:25-33`).
  - Dark themes also set `color-scheme: dark` (`:35-38`).
  - Runtime: `DesignSystemProvider` sets `document.documentElement.dataset.carbonTheme` and wraps children in `GlobalTheme` (`theme-provider.tsx:61-63, 72`).
  - The server layout reads a cookie and renders `data-carbon-theme` on `<html>` (`apps/web/src/app/layout.tsx:29-35`).
- **Prefix.** The default `cds` is kept. No `$prefix` is configured (`index.scss:1-3`). 335 `var(--cds-*)` occurrences across `apps/web/src` and `packages/design-system/src`, all file types (grep count).

## 3. Styles

- **Global entry** (`packages/design-system/src/styles/index.scss:1-4`):
  ```scss
  @use '@carbon/react/scss/config' with (
    $css--font-face: false
  );
  @use '@carbon/react';
  ```
  Fonts are turned off in Carbon and self-hosted through `fonts.scss`. That file loops over Carbon's per-family unicode maps (`fonts.scss:2-4, 16-30`) and emits 90 WOFF2 faces (`carbon.md:117-118`).
- **Token Sass API.**
  - Each `tokens/*.scss` file is a one-line `@forward '@carbon/react/scss/<category>'`, for example `tokens/spacing.scss`.
  - `tokens.scss` re-forwards them with prefixes (`@forward 'tokens/colors' as color-*;`, `tokens.scss:1-8`).
  - Apps `@use '@bap/design-system/tokens/spacing.scss' as spacing;` (17 web modules) and `tokens/type.scss` (5).
- **SCSS modules.** 33 `*.module.scss` files in `apps/web/src`, plus 3 in the design-system blocks. The package declares an ambient `*.module.scss` type (`blocks/css-modules.d.ts:2-5`).
- **Next Sass config.**
  - `sassOptions.includePaths: [path.resolve(configDirectory, '../../node_modules/.pnpm/node_modules')]` (`apps/web/next.config.ts:10-14`).
  - The package build check passes the same path as `--load-path` (`package.json:32`).
  - Reason recorded: "The Sass check supplies pnpm's virtual-hoisted module path because Carbon's Sass imports span its published package graph." (`carbon.md:105-106`).
- **Workbench.** `vite.config.ts` is just `plugins: [react()]`, with no Sass options. Vite's own resolver handles `@carbon/react` Sass (inferred, not built locally).
- **Compiled CSS vs Sass.** Carbon comes in as Sass. Charts comes in as precompiled CSS (`charts.css:1`). Order is fixed: "styles.scss, fonts.scss, charts.css ... The base stylesheet must precede charts. Do not import these global styles from leaf components." (`carbon.md:178-185`).
- **Known warning.** "The current Next/Turbopack build preserves Carbon's valid `@position-try` rules but emits four parser warnings. Do not strip upstream CSS; reassess the warnings when upgrading Next or Carbon." (`carbon.md:200-202`, present since the first Carbon commit `0e835fe`).
- **Compile perf.** This is a local reproduction, not a measurement from the repo. I compiled their exact `index.scss` with Afframe's pinned `@carbon/react` 1.117.0 and dart-sass 1.105.0 from `round3/sass-check/node_modules` (`--no-source-map`, uncompressed, all four themes):
  - about 3.2-3.4 s, 1,190,653 bytes;
  - with `@use '@carbon/styles/scss/feature-flags' with ($feature-flags: ('enable-v12-release': true))` added first: about 3.3 s, 1,197,854 bytes (+7 KB).

  The repo records no perf notes of its own.
- **Where the v12 flag must go (local reproduction).** Adding `$feature-flags: (...)` to `@use '@carbon/react/scss/config' with (...)` fails to compile: sass rejects the `$feature-flags` argument there. The form that compiles is a separate `@use '@carbon/styles/scss/feature-flags' with ($feature-flags: ('enable-v12-release': true));` placed before the config `@use`.

## 4. Next.js specifics

- App Router (`apps/web/src/app/layout.tsx`), `export const dynamic = 'force-dynamic'` (`:22`), `output: 'standalone'` (`next.config.ts:8`), `typedRoutes: true`.
- **'use client' boundary sits in the facade.** `react.ts`, `charts.ts`, `icons.ts` and `theme-provider.tsx` all begin with `'use client'`. Because of that, Server Components can import `Grid`, `Column` and `Stack` without a directive of their own. Five such files exist, for example `apps/web/src/components/page-container.tsx:1` imports from `@bap/design-system/react` and has no directive. The docs split entrypoints into "Server-safe" and "Client" (`carbon.md:31-44`) and state "Carbon React components use browser behavior and belong in Client Components" (`03-developing.md:33`). 59 files in `apps/web/src` carry `'use client'`.
- `transpilePackages: ['@bap/design-system']` is required because the package is TS source (`next.config.ts:15`).
- `experimental.optimizePackageImports` is absent from `next.config.ts`. Whether Next's built-in default list covers `@carbon/*` was not checked (unverified).
- No `next/dynamic` with `ssr: false` in web source (grep). SSR theme flash is handled by the cookie plus the `prefers-color-scheme` rule.

## 5. Design-system workbench

- **What it is.** A Storybook 10.6 app (`@storybook/react-vite`) with a11y, docs, links, themes and vitest addons (`.storybook/main.ts:4-10`).
  - Stories are generated from Carbon's own story sources and a generated manifest (`scripts/generate-component-stories.mjs`, `src/components/generated/`).
  - It also includes an offline Carbon handbook as MDX (`src/knowledge/`).
  - Toolbars cover theme, direction (RTL), motion and every feature flag (`preview.tsx:98-147`), plus Carbon breakpoint viewports (`:166-193`).
- **Tests.**
  - jsdom unit tests (`vitest.config.ts`).
  - `test:browser` runs Vitest browser mode with Playwright Chromium in two projects (`vitest.browser.config.ts:59-100`): `storybook` executes every story through `storybookTest`, and `browser-contracts` runs `*.browser.test.tsx`.
  - a11y is enforced: `a11y: { test: 'error' }` (`preview.tsx:150`), and the setup file throws if that setting is ever weakened (`.storybook/vitest.setup.ts`).
  - React is deduped (`vitest.browser.config.ts:56`) after `@storybook/addon-docs` pulled a second React copy (commit `18a5c75`: "Cannot read properties of null (reading useContext)").
- **Visual regression.**
  - Seven `toMatchScreenshot` contracts, using pixelmatch with `allowedMismatchedPixelRatio: 0.005, threshold: 0.2` (`src/visual-regression.browser.test.tsx:23-30`).
  - Baselines are committed next to the test in `src/__screenshots__/visual-regression.browser.test.tsx/`: 14 PNGs, one `-chromium-darwin` and one `-chromium-linux` per contract (`docs/testing.md:54-57`).
  - Fonts are awaited (`document.fonts.ready`) and motion is set to reduced before capture.
- **Offline check.** `verify-offline.mjs` serves `storybook-static`, rejects remote requests and checks the surfaces (`docs/testing.md:49-52`).
- **CI** (`.github/workflows/ci.yml`):
  - `design-system-contract` runs catalog check, Storybook build and a built-catalog check (`:75-102`).
  - `design-system-browser` is a matrix: offline-static plus 4 story shards (`:106-161`). It installs Chromium via `playwright install --with-deps chromium` (`:148-149`).
  - Every job has `timeout-minutes: 4`. `IBM_TELEMETRY_DISABLED: 'true'` is set globally (`:20`).

## 6. Recorded decisions and lessons (quotes)

- Scope: "`@bap/design-system` is the only BAP design-system package. It adapts the official Carbon packages rather than copying their source or creating product components." (`carbon.md:10-12`)
- Peers: "The package declares React, React DOM, and React-is as peers so an application provides one compatible React runtime." (`carbon.md:26-27`)
- Server/client split: "Use the client facades from a Client Component. Server Components may import metadata from the root, `tokens`, or `component-catalog` entrypoints" (`carbon.md:65-67`)
- Font control: "configures Carbon's own `$css--font-face` flag to `false` before importing Carbon, preventing the aggregate Plex package from emitting unselected fonts. It then emits CSS custom properties for all four themes." (`carbon.md:108-110`)
- Telemetry: "The pnpm `allowBuilds` policy blocks those lifecycle scripts for every installation." (`carbon.md:189-190`). The implementation is `allowBuilds: '@carbon/*': false` (`pnpm-workspace.yaml:101-126`) plus `IBM_TELEMETRY_DISABLED` in root scripts (`package.json:7,19`) and the Dockerfile (`docker/web.Dockerfile:5,28`).
- Styling rule: "Do not reach into Carbon's private class structure. A local selector may arrange components, but it must not recreate their internal states." (`03-developing.md:106-108`)
- Upgrade procedure: "update the exact catalog versions and lockfile together, run the complete gate, review Carbon release notes, verify facade inventory tests, Sass compilation, and the emitted WOFF2 count." (`carbon.md:197-200`)
- Wrappers: "A wrapper is justified only when at least two consumers require the same non-product-specific behavior." (`03-developing.md:100-101`)
- `.ai/specs`: no spec is about Carbon build or style setup. `2026-09-15-table-component-blocks.md:44-49` records that blocks use `var(--cds-*)` tokens only, ship as source, and needed an ambient `*.module.scss` type.

## 7. What worked, what was painful

**Worked**
- The source-only workspace package plus `transpilePackages`: no build step and instant HMR across packages.
- Placing `'use client'` in facade files, so Server Components compose Carbon layout primitives freely.
- Forwarding tokens with `@forward` instead of copying values.
- Four themes as CSS variables, with a first-paint theme from the cookie.
- `$css--font-face: false` plus self-hosted Plex.
- Blocking IBM telemetry.
- Committed per-platform screenshot baselines and a sharded browser CI.

**Painful (evidence)**
- pnpm plus Carbon Sass resolution needs the `node_modules/.pnpm/node_modules` load-path hack, both in Next (`next.config.ts:10-14`) and in the check script (`package.json:32`).
- Font URLs are hardcoded relative to the monorepo layout: `url('../../node_modules/#{$package}/fonts/...')` (`fonts.scss:24`). This only resolves from that position in the workspace and would break in a published package.
- Next/Turbopack emits four `@position-try` parser warnings on Carbon CSS (`carbon.md:200-202`).
- App code overrides Carbon internals despite the rule at `03-developing.md:106-108`. For example, `.tableContainer :global(.cds--data-table)` (`apps/web/src/app/(product)/documents/new/page.module.scss:9, 22-24`) and `:global(.cds--tab-content)` (`inbox/[itemId]/page.module.scss:41`).
- Duplicate React from Storybook addon-docs (commit `18a5c75`).
- Carbon was held back from a Dependabot bump, per commit `a7ce422` "bump the production-dependencies group without Carbon". Only the commit message shows this; it was not found as a config rule.
- The docs have drifted from the catalog:
  - `carbon.md:22,24` lists plex-mono 1.1.0 and sass 1.103.1, but the catalog pins 2.5.0 and 1.104.0.
  - The icon facade is described as 27 (`carbon.md:37`), 51 (`03-developing.md:24`) and 33 (commit `5b5134c`).
  - `testing.md:57` names Playwright 1.62.1 Noble, but the catalog has 1.63.0 and CI uses `ubuntu-latest`.

## 8. What transfers to Afframe UI and what does not

**Transfers**
- **Facade entrypoints split by server/client boundary**, with `'use client'` at the top of client entry files. For a built package, the bundler must preserve the directive per output file (unverified per tool).
- **Tokens as forwarded Sass modules**, prefixed via `@forward ... as color-*`. This is a Sass-source API that consumers can `@use`.
- **One global stylesheet entry** that owns the `@use ... with (...)` config, then emits all themes as `[data-carbon-theme]` selectors plus a `prefers-color-scheme` fallback. For Afframe, the `with` block would also set `$feature-flags: ('enable-v12-release': true)` through `@carbon/styles/scss/feature-flags`. That compiles cleanly in the local reproduction above.
- **`$css--font-face: false` plus self-hosted Plex.**
- **The provider pattern** (`GlobalTheme` plus a `dataset` sync plus a server-rendered attribute).
- **Blocking IBM telemetry** via `allowBuilds` and `IBM_TELEMETRY_DISABLED`.
- **Carbon's native test stack as used here**: Vitest browser mode, `toMatchScreenshot` with per-platform baselines, stories run as tests with a11y set to `error`, and `resolve.dedupe` for React.
- **Fixed global CSS import order**, with Carbon before chart CSS.

**Does not transfer**
- **Shipping raw TS and SCSS source through workspace `exports`.** This relies on `transpilePackages` and a shared lockfile. A GitHub Packages consumer in another repo would need `transpilePackages: ['@afframe/ui']` plus Sass tooling. It would also inherit the pnpm `.pnpm/node_modules` load-path hack.
- **Monorepo-relative font URLs** (`../../node_modules/...`). A published package must ship the fonts itself or use package-resolvable URLs.
- **Carbon as a regular dependency.** That is harmless inside one lockfile. In a shared package it risks duplicate `@carbon/react` copies and a mismatched Sass/React v12 flag state across consumers. Treat this as a D4 input, not a recommendation.
- **The v11 default and the React-only flag toggles.** They contradict Afframe's force-v12 decision.
- **Everything about IBM Products, Labs, ai-chat and TanStack v9.** The repo has no evidence for any of them.
