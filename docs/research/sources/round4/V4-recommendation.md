# V4: verification of lanes C, S, A and recommendation for D4 (build output) and D5 (style delivery)

Verifier: adversarial pass over `BRIEF-R4.md`, `C-carbon-build.md`, `S-solutions.md`, `A-analytics.md`, 2026-09-24.
Primary evidence only: unpacked tarballs in `.context/research/pkg/`, `round3/sass-check/node_modules` (sass 1.105.0, @carbon/react 1.117.0, @carbon/styles 1.116.0, @carbon/ibm-products-styles 2.95.0), `gh api` on carbon-design-system/carbon and ibm-products (main), `npm view`, `npm pack`, the analytics clone `/tmp/analytics` at `a041d9a`, and local reproductions (scratch dirs `/tmp/v4sass`, `/tmp/v4esm`, `/tmp/v4labs`; the inputs and numbers are copied inline below, so they survive when `/tmp` is cleared).
Abbreviations: `R/` = `.context/research/pkg/carbon-react-1.117.0/package/`, `P/` = `.context/research/pkg/carbon-ibm-products-2.99.0/package/`, `SC/` = `.context/research/round3/sass-check/node_modules/`, `carbon:` = github.com/carbon-design-system/carbon at main, `ibmp:` = github.com/carbon-design-system/ibm-products at main.

## 1. Verdict table

| # | Claim (source) | Verdict | Evidence |
|---|---|---|---|
| 1 | C: `@carbon/react` and `@carbon/ibm-products` build JS with tsdown via `tasks/build.js` (C:39-70) | **Confirmed** | `carbon:packages/react/tasks/build.js:24` `const { build: tsdown } = await import('tsdown')`, `:70-78` formats esm->`es`, cjs->`lib`, `:92` `dts: false`, `:108` `unbundle: true`, `:123` `target: 'es2020'`. `ibmp:packages/ibm-products/tasks/build.js:24,37,41,48,51,61,70`. Migration commits: carbon `9085ef778` 2026-03-17 "deps(tsdown): migrate monorepo build/bundling to `tsdown` (#21659)"; ibm-products `a82e1e0fa` 2026-03-20 "chore: migrate to tsdown for react and wc (#9123)". Published output carries rolldown fingerprints: `R/es/_virtual/_rolldown`, `//#region src/components/Button/Button.tsx` in `R/es/components/Button/Button.js:13`; `P/es/_virtual/_rolldown`, 419 files in `P/es` with `//#region` |
| 2 | S: tsdown is only a devDependency and `scripts.build` uses Babel/tsc (S:11 tsdown row, S:16 "Babel + tsc (Carbon's actual pattern)", S:90) | **Refuted** | Same evidence as row 1. `scripts.build` (`R/package.json:40`) calls `node tasks/build.js`, and that script calls tsdown. Babel stays in devDependencies (`R/package.json:78`) for Jest: `carbon:packages/react/tasks/build.js:121-122` "Keep ES2020 for Jest/SSR compatibility; ES2022 can emit static class block syntax that our current Babel/Jest path does not transform". `.d.ts` comes from a separate TypeScript compiler API pass (`build.js:66` `tsconfig.declarations.json`, `:259` `emitDeclarationOnly: true`, copied es->lib by `copyDeclarations` `:137,206`), not from Babel |
| 3 | Brief 1a: IBM Products ships TypeScript types | **Confirmed** | `P/package.json:8` `"types": "lib/index.d.ts"`; 621 `.d.ts` files in `P/es` and 621 in `P/lib` (find count). Note: ibm-products source is still ~56% JS/JSX (C:15-18, not re-counted), so many of those declarations are generated from JS |
| 4 | Brief 1b: IBM Products ships ESM `es/` and CJS `lib/` | **Confirmed** | `P/package.json:6-7` `main: lib/index.js`, `module: es/index.js`; 420 `.js` in `P/es`, 443 in `P/lib`; `P/lib/index.js:10` uses `require(...)`. No `exports` map, no `type` field |
| 5 | Brief 1c: IBM Products does not bundle Carbon; Carbon packages are peer dependencies | **Confirmed with correction** | Peers (`P/package.json:124-128`): `@carbon/react ^1.115.0`, grid, layout, motion, themes, type, react, react-dom, react-is. But regular `dependencies` (`P/package.json:107-111`) include `@carbon/ibm-products-styles ^2.95.0`, `@carbon/feature-flags`, `@carbon/utilities`, `@carbon/utilities-react`, `@carbon/telemetry`, `@carbon-labs/react-resizer ^0.25.0`. One Carbon package IS bundled: `ibmp:.../tasks/build.js:207-209` "Filter out @carbon/ibm-products-utilities to embed it at build time". `@carbon/react` likewise inlines `es-toolkit` (`carbon:.../build.js:340` `const internals = ['es-toolkit']`) and has `@carbon/styles` as a regular dependency (`R/package.json:62`) |
| 6 | Brief 2: Carbon and IBM Products ship styles both as Sass source and precompiled CSS | **Confirmed with correction** | `@carbon/react` itself ships **no CSS file** (0 `.css` files under `R/`; `files` has `scss`, `index.scss`, no `css`); its Sass is a thin forward (`R/index.scss` = `@forward '@carbon/styles'`). The prebuilt Carbon CSS lives in `@carbon/styles`: `css/styles.css`, `css/styles.min.css` only (tarball listing). IBM Products: `P/css/` has 22 files (`index`, `index-full-carbon`, `index-without-carbon`, `index-without-carbon-released-only`, each `.css`/`.min.css` + maps, plus `carbon.css`, `config*.css`) and `P/scss/`. So the precise statement is: `@carbon/styles` and `@carbon/ibm-products(-styles)` ship both; `@carbon/react` ships Sass only |
| 7 | Brief 3: IBM's precompiled CSS is v11-styled; full v12 needs a Sass compile with the flag | **Confirmed (re-derived here, not only cited)** | Default is off: `SC/@carbon/styles/scss/_feature-flags.scss` `'enable-v12-release': false`. `carbon:packages/styles/tasks/build-css.js` compiles `@use '../index.scss' with ($use-akamai-cdn: true, $fonts: ...)` with no flag (C:204-216). Local diff: compiled `@use '@carbon/react/scss/config' with ($css--font-face: false); @use '@carbon/react';` with and without `@use '@carbon/styles/scss/feature-flags' with ($feature-flags: ('enable-v12-release': true));` first, normalised to rule sets: 164 v12-only rules, 142 v11-only rules. Against IBM's shipped `carbon-styles-1.116.0/package/css/styles.css`: **0 of 164** v12-only rules present, **138 of 142** v11-only rules present. IBM Products Sass has 0 matches for `v12` (`grep -rn v12 SC/@carbon/ibm-products-styles/scss`), so IBM Products' own rules do not change under the flag (consistent with `docs/scope.md:42`) |
| 8 | Brief 4: TanStack Table v9 is ESM only | **Confirmed** | `npm view @tanstack/react-table`: 9.2.4 (`latest`), `"type": "module"`, `exports` entries are plain paths (`.`, `./legacy`, `./flex-render`, `./static-functions`, `./experimental-worker-plugin`), no `require` condition, no `main`. Same for `@tanstack/table-core` 9.2.4. Also found: **`@carbon/ai-chat` 1.21.0 is ESM only too** (`type: module`, `exports["."]` = `{types, import}` only) |
| 9 | S: a second `@use ... with` on an already-configured Carbon module errors, even with the same value (S:45-58) | **Confirmed and extended** | Reproduced with a simulated library entry `lib/_ui.scss` = `@use '@carbon/styles/scss/feature-flags' with ($feature-flags: ('enable-v12-release': true)); @use '@carbon/react/scss/config' with ($css--font-face: false); @use '@carbon/react';`. c1: `@use 'lib/ui'; @use '@carbon/react/scss/config' with ($prefix: 'x');` exit 65 "This module was already loaded, so it can't be configured using "with"". c2: the same two lines in reverse order also exit 65 (the error then points at the library file). c5: consumer sets the flag itself first, then `@use 'lib/ui'`: exit 65. So a library Sass entry with a closed `with` makes **every** consumer-side configuration of those modules fatal, in either order. Escape hatch that compiles: the library forwards its config with `!default` (`@forward '@carbon/react/scss/config' with ($css--font-face: false !default, $prefix: 'cds' !default);`) and the consumer configures through the library (`@use 'lib/ui-cfg' with ($prefix: 'x');`): c4 exit 0, 343 `.x--btn` rules, v12 rules present |
| 10 | S: a bare `@use` after a configured load inherits the configuration silently (S:57) | **Confirmed** | c3: `@use 'lib/ui'; @use '@carbon/react/scss/theme'; @use '@carbon/ibm-products-styles/scss/index-without-carbon';` exit 0, 1,921,638 bytes. Caveat not in S: each Next.js/Vite `*.module.scss` is its own Sass compilation, so a consumer module that `@use`s Carbon Sass gets Carbon's **default** (v11) flag state, not the library's |
| 11 | A: the v12 flag must go via `@carbon/styles/scss/feature-flags` first, not `@carbon/react/scss/config` (A:68) | **Partly corrected** | Correct that `config` rejects it: t1 `@use '@carbon/react/scss/config' with ($feature-flags: ...)` fails with "This variable was not declared with !default in the @used module". Wrong that it must be the `@carbon/styles` path: `@carbon/react/scss/feature-flags` (`R/scss/_feature-flags.scss` = `@forward '@carbon/styles/scss/feature-flags'`) works, t2 output byte-identical to t3 (1,048,612 bytes). Wrong that it must precede `config`: t4 (config first, flag second, then `@use '@carbon/react'`) is byte-identical to t3. Real rule: the flag `@use ... with` must come before the first load of `@carbon/react`/`@carbon/styles` (t5, flag after `@use '@carbon/react'`: "already loaded" error) |
| 12 | C: `"use client"` in `@carbon/react` only at the entry (C:122-123) | **Confirmed** | Only `R/es/index.js:8` and `R/lib/index.js:8`. Origin: `carbon:packages/react/src/index.ts:8-9` `// prettier-ignore` + `'use client'`, preserved by tsdown `unbundle` |
| 13 | C: `@carbon/ibm-products` has 0 `"use client"` directives (C:124-126) | **Refuted** | `P/es/index.js:8` and `P/lib/index.js:8` both read `"use client";` (grep). Origin: `ibmp:packages/ibm-products/src/index.ts:8-9`. Same pattern as `@carbon/react`: entry file only, no per-component directive |
| 14 | C: `@carbon-labs/react-ui-shell` declares no react or `@carbon/react` peers (C:114-118) | **Confirmed, and worse than stated** | `npm pack` 0.106.0: `dependencies` = `@ibm/telemetry-js` only, no peers; its `es/` imports `react` (48), `@carbon/react` (12), `@carbon/icons-react` (4), `@carbon/ibm-products` (1), all undeclared. `@carbon-labs/react-resizer` 0.25.0 imports `react` (2) undeclared. These resolve only through hoisting (npm flat tree, or pnpm's hidden `node_modules/.pnpm/node_modules`) |
| 15 | C: Carbon's own Next.js example needs no `transpilePackages` (C:279-292) | **Confirmed** | `carbon:examples/nextjs/next.config.js` = `reactStrictMode`, `turbopack.root`, `sassOptions.quietDeps` only; `next ^16.2.11`, `sass ^1.93.2` |
| 16 | S: tsdown directive-loss issues `rolldown/rolldown#7809`, `publira/publira#2834` (S:11) | **Confirmed they exist; overstated as a risk** | Both resolve via `gh api` (#7809 "Directives not being preserved", state closed). Counter-evidence: Carbon's published tsdown output keeps the entry directive (row 12). Risk applies to merged chunks, not to `unbundle` per-file output |
| 17 | S: `require(esm)` works, stable on Node 20.19+/22.12+ (S:20) | **Partly verified** | On Node 24.14.1 locally, `require('@tanstack/react-table')` (9.2.4) loads, 115 exports. The exact LTS version list is from S's blog citation, not re-checked (unverified) |
| 18 | S: Jest handling of ESM-only packages not verified (S:28) | **Now verified** | Jest 30.5.2 + babel-jest, test `import { useTable } from '@tanstack/react-table'`: default config FAILS "Must use import to load ES Module: .../@tanstack/react-table/dist/index.js"; with `--transformIgnorePatterns '/node_modules/(?!@tanstack/)'` 1 test passes. Carbon's own `carbon:jest.config.js:39-40` uses the same allowlist technique (`(?!lodash-es|nanoid|chalk|@babel/|temporal-polyfill|temporal-utils)`) |
| 19 | S: `@carbon/styles` prebuilt CSS is one bundle, no per-component CSS (S:64) | **Confirmed** | `css/` = `styles.css`, `styles.min.css` only. `styles.min.css` 938,627 bytes, 101,952 gzip -9 |
| 20 | A: analytics design system is source-only, consumed via `transpilePackages` | **Confirmed** | `<analytics clone>/packages/design-system/package.json:4` `"private": true`, `:6-29` `exports` point at `./src/*.ts`, `.scss`, `.css`; `apps/web/next.config.ts:15` `transpilePackages: ['@bap/design-system']` |
| 21 | A: Carbon is a regular dependency there | **Confirmed** | `packages/design-system/package.json:42-49` `@carbon/charts-react`, `@carbon/icons-react`, `@carbon/pictograms-react`, `@carbon/react`, `@carbon/styles`, `@ibm/plex-*` in `dependencies` |
| 22 | A: pnpm load-path hack | **Confirmed** | `apps/web/next.config.ts:10-14` `sassOptions.includePaths: [.../node_modules/.pnpm/node_modules]`; `packages/design-system/package.json:32` `--load-path=../../node_modules/.pnpm/node_modules` repeated per entry |
| 23 | A: font URL is monorepo-relative | **Confirmed** | `packages/design-system/src/styles/fonts.scss:24` `url('../../node_modules/#{$package}/fonts/split/woff2/...')` |
| 24 | A: v12 off | **Confirmed** | `docs/design-system/knowledge-base/03-developing.md:127` "The pinned release enables v11 behavior and keeps v12 release behavior off."; `packages/design-system/src/styles/index.scss:1-4` has no `$feature-flags` |
| 25 | A: `'use client'` lives in facade files | **Confirmed** | `packages/design-system/src/react.ts:1-3` `'use client'; export * from '@carbon/react';` |
| 26 | New finding (verifier's own, not a lane claim): does IBM Products hardcode `cds`? | **New finding: no, it uses a separate variable** | Not hardcoded. `SC/@carbon/ibm-products-styles/scss/global/styles/_project-settings.scss:9-10` `$pkg-prefix: 'c4p' !default; $carbon-prefix: 'cds' !default;`, used as `.#{$carbon-prefix}--popover...` (`components/AddSelect/_add-select.scss:250`). It does not follow Carbon's `$prefix`: with only `$prefix: 'x'` set (c6), 84 `.cds--` selectors and 43 `var(--cds-` references remained next to 18,542 `.x--` selectors |

Counts: 25 lane or brief claims plus 1 new finding (row 26). Confirmed 15 (1, 3, 4, 7, 8, 10, 12, 15, 19-25); confirmed with correction 4 (5, 6, 9, 14); partly corrected or partly verified 3 (11, 16, 17); refuted 2 (2, 13); a gap S left open, now verified 1 (18). Still unverified: the Node LTS list for `require(esm)` (row 17), and everything under "Open items" in section 5.

## 2. Contradiction resolution

**C vs S on the build tool: C is right, S is wrong.** tsdown is the production JS build for both `@carbon/react` 1.117.0 and `@carbon/ibm-products` 2.99.0, not an unused devDependency (row 1, row 2). S read the `scripts.build` string (`node tasks/build.js`) and stopped there. That script's first action is to import tsdown. S then inferred a Babel pipeline from the Babel devDependencies, which exist for Jest. The shipped tarballs carry rolldown's own markers (`_virtual/_rolldown`, `//#region`), which Babel output never contains. Consequences for S's text: the "Babel + tsc (Carbon's actual pattern)" row (S:16) and the tsdown risk line "Carbon ... does not yet use it" (S:87, S:90) should be struck. Carbon's real pattern is tsdown (JS, `unbundle`) plus a separate TypeScript-API declaration pass.

**C internal error.** C says IBM Products has no `"use client"`. It does, at the entry (row 13). The corrected shared fact: both Carbon packages put the directive once, in `src/index.ts`, and tsdown keeps it at the top of `es/index.js` and `lib/index.js`.

**A vs S/C on flag placement.** All three agree the flag must be set through the feature-flags module. A is too narrow on the path and the order (row 11). Either `@carbon/styles/scss/feature-flags` or `@carbon/react/scss/feature-flags` works, anywhere before the first `@use '@carbon/react'` or `'@carbon/styles'`.

## 3. D4 recommendation: build output

### 3.1 Language: TypeScript, `allowJs` for the copied Carbon files
- **Why.** `goals.md:43` asks for "typed imports for components". Carbon's own source is 45% JS in `packages/react/src` (C:11-13). The 16 copied v12 components should stay close to upstream so later re-syncs are diffs, not rewrites. So: write Afframe code in strict TypeScript, and compile the copied Carbon files as they are, with `allowJs`.
- **Cost.** Declarations generated from copied JS files are only as good as their JSDoc and propTypes. Some copied components may need hand-written `.d.ts` files.
- **Runner-up.** JS with JSDoc. It would only be better if we stopped copying Carbon source and wrote everything from scratch in JS, which is not the plan.

### 3.2 Module format: ESM only
- **Why.**
  - Two runtime dependencies are already import-only: TanStack v9 (row 8) and `@carbon/ai-chat` (row 8). A CJS build of Afframe would still `require()` them. On Node 20.19+ that works either way through `require(esm)` (row 17). Under Jest's CJS runtime it fails either way unless `transformIgnorePatterns` is set (row 18).
  - So a CJS build does not make tables or chat any more portable, and it adds a second output tree.
  - ESM only also removes the one tsdown bug Carbon had to patch, `patchCjsDefaultInterop` (`carbon:.../build.js:141,292-310`), which is CJS-only.
- **Package shape.**
  - `"type": "module"`.
  - An `exports` map with `types` and `default` conditions per subpath, plus a top-level `types` field for older resolvers.
  - No `require` condition.
  - Subpaths: `.`, `./tables`, `./charts`, `./chat`, `./server` (server-safe, see 3.5), `./styles.css`, `./charts.css`, `./package.json`.
  - `sideEffects`: `["**/*.css", "./dist/index.js"]`, plus any entry that sets IBM Products `pkg` flags (M11, `docs/scope.md:245`).
- **Cost.**
  - Consumers using Jest must allowlist our package and the ESM-only chain: `transformIgnorePatterns: ['/node_modules/(?!(@afframe/ui|@tanstack|@carbon/ai-chat|lit|@lit)/)']`. This is the same technique as `carbon:jest.config.js:39-40`, and our own Jest config (D11, `goals.md:160`) needs it anyway for TanStack v9.
  - The exact list for ai-chat and lit is unverified. Prove it in the reference consumer.
- **Runner-up.** Dual ESM + CJS in Carbon's `es/` + `lib/` shape. It is better only if a consumer runtime cannot load ESM at all (Node older than 20.19 in SSR or scripts, or a Jest setup that cannot be changed) and that consumer never imports tables or chat.

### 3.3 Carbon: never bundled; peer versus regular dependency by rule
Bundling Carbon into our output is rejected on two grounds. It redistributes Carbon code under Apache-2.0 section 4 (`goals.md:153`). It also creates duplicate copies. Carbon itself keeps every dependency external and inlines only tiny internal helpers (rows 1 and 5). The real choice is peer versus regular dependency.

The rule: make a package a **peer** if it holds React context or module-level state that consumer code shares, or if its markup must match the CSS we compile. Make it a **regular dependency** otherwise.

The compiled CSS (D5) makes version matching critical. Our stylesheet is frozen against the exact `@carbon/react` and `@carbon/ibm-products-styles` sources we compiled. A caret range like IBM Products' own `^1.115.0` (`P/package.json:128`) would let a consumer resolve a newer Carbon minor whose markup no longer matches our CSS.

| Package | Recommendation | Reason |
|---|---|---|
| `react`, `react-dom`, `react-is` | peer, `^18.3 \|\| ^19` | Universal pattern (rows 5 and 12). TanStack v9 needs `react >=18` (`npm view`) |
| `@carbon/react` | **peer, exact `1.117.0`** | One copy, so our `<FeatureFlags enableV12Release>` context reaches every Carbon component. Markup must match our compiled CSS. The 16 v12 components are copied from carbon main but run on the 1.117.0 runtime and 1.116.0 styles; the exact pin freezes that tested combination. A consumer that installs another version gets an install-time peer error or warning instead of a silent split. npm 7+ and pnpm auto-install peers, so consumers do not have to list it (`goals.md:43` "one install" holds). Widen to `~1.117.x` only once visual regression proves patch releases safe |
| `@carbon/ibm-products` | **peer, exact `2.99.0`** | Module-level `pkg` settings (M11) and its own flags must be one copy. Its markup must match the `@carbon/ibm-products-styles` 2.95.0 we compile (2.95.0 is `latest` and is what 2.99.0 depends on, `P/package.json:111`) |
| `@carbon/ibm-products-styles`, `@carbon/styles`, `@ibm/plex` | devDependency, exact | Used only at our build time to compile CSS and copy fonts. Consumers never load them |
| `@carbon/icons-react` | dependency, same range as `@carbon/react` (`^11.89.0`) | No context, so duplicates cost only bytes. Declaring it also covers Labs' undeclared import (row 14) |
| `@carbon-labs/*` (e.g. react-ui-shell, react-resizer) | dependency, exact (0.x) | Leaf widgets. Their undeclared imports of `react`, `@carbon/react`, `@carbon/icons-react` and `@carbon/ibm-products` resolve because we declare all four and package managers hoist them. The fallback if the reference consumer shows a resolution failure (for example pnpm with `hoist=false`) is to inline those Labs packages with tsdown `noExternal`, as Carbon does with `es-toolkit` and IBM Products with its utilities (rows 1 and 5). The inlined code's bare imports then become ours, and ours are declared |
| `@tanstack/react-table` | dependency, exact `9.2.4` | No shared context. A consumer's own TanStack copy costs bytes, not correctness |
| `@carbon/charts-react` | dependency, exact | No shared context. Its IBM-built CSS is re-exported (see 4.5) |
| `@carbon/ai-chat` | dependency, exact | ESM only. Its peer `@carbon/web-components >=2.54.0 <3.0.0` (`npm view`) is best satisfied by declaring `@carbon/web-components` as our dependency, so there is a single custom-element registry. Two copies would register the same tag twice (standard Custom Elements behavior, not tested here) |
| `sass` | not ours | `@carbon/react` declares `sass ^1.33.0` as a required peer with no `peerDependenciesMeta` (`R/package.json:50-54`), so consumers get sass pulled in or warned about even though they never compile it. This is a small, unavoidable cost |

- **Cost.** Exact peers make every Carbon bump a coordinated Afframe release followed by a consumer bump. A consumer that pins a different Carbon range for its own reasons hits an npm ERESOLVE error or a pnpm strict-peer failure until the versions align. That is intended (it surfaces the mismatch at install time), but it is friction.
- **Runner-up.** Make `@carbon/react` and `@carbon/ibm-products` regular dependencies, exact-pinned. This is better if no consumer ever installs Carbon itself, which is the analytics facade rule of never importing `@carbon/*` directly, and if peer friction costs more than the risk of a silent duplicate copy. The price is that a consumer that does add Carbon at another version gets two copies. Flags and context then split with no install-time warning.

### 3.4 Build tool: tsdown, configured like Carbon's `tasks/build.js`
- **Why.** It is the tool that builds the exact packages we copy from (row 1). Its config is a public Apache-2.0 reference we can mirror line by line:
  - `unbundle: true` gives per-file output and keeps the entry directive (row 12)
  - `platform: 'browser'`
  - externals from `dependencies` + `peerDependencies`
  - `dts: false`, with a separate `tsc` declaration pass from a `tsconfig.declarations.json`. Carbon explains why at `build.js:86-89`: tsdown's bundled declarations lose per-file `.d.ts`. That matters for mixed JS/TS source like ours.
  - ESM only, so one format pass and no `patchCjsDefaultInterop`
- **Cost.**
  - tsdown is 0.x (0.23.0, published 2026-09-03, maintainers Evan You and sxzz per `npm view`). Minor versions can break things. Pin it exactly and update deliberately.
  - Carbon had to patch interop bugs, although those were CJS-only (`ibmp` commit `9491ea3c5`).
- **Runner-up: plain `tsc` emit, no bundler.** It gives per-file ESM plus `.d.ts` in one tool and keeps directive prologues natively. It is better if tsdown churn costs more than it saves. Its cost is managing `.js` import extensions (or `rewriteRelativeImportExtensions`), and it offers no way to inline a problematic Labs package.
- **Rejected for the package build.**
  - Vite library mode (S:13) concatenates CSS into one file and needs a plugin for `.d.ts`. Keep Vite for Storybook only.
  - tsup is slower-moving and needs a banner hack for the directive (S:12 tsup row, issue `egoist/tsup#835` exists).

### 3.5 "use client" strategy
- **The pattern.**
  - Put `// prettier-ignore` + `'use client'` as the first statement of every client entry source: `src/index.ts`, `src/tables/index.ts`, `src/charts/index.ts`, `src/chat/index.ts`. This copies `carbon:packages/react/src/index.ts:8-9`. tsdown `unbundle` keeps it on the emitted entry file.
  - Add a directive-free `./server` entry for anything a Server Component must call or read: constants, types, a theme-cookie helper, component metadata. This is analytics' "server-safe vs client" split (`/tmp/analytics` `carbon.md:31-44`, A:73).
  - The `exports` map blocks deep imports, so per-component directives are unnecessary.
  - Add a post-build test that asserts each client entry's first statement is `"use client"` and the server entry has none. This guards against a tsdown regression (row 16).
- **The React half of v12.**
  - Export one provider (working name `AfframeProvider`) that renders `<FeatureFlags enableV12Release ...>` with the O2 flags from `docs/scope.md:55` and the theme (`GlobalTheme`).
  - Set IBM Products `pkg` once as a module side effect of the entry (M11).
  - Failure mode: a component rendered outside the provider, or through a second `@carbon/react` copy, runs v11 behavior over v12 CSS. That is the exact mismatch analytics' workbench produces (A:32). The peer rule in 3.3 removes the second-copy case, and the reference consumer should render one component outside the provider as a negative test.
- **Cost.** Every export of a client barrel is a client reference inside React Server Components. Non-component helpers must live in `./server`, and contributors must know which entry a new export belongs to.
- **Runner-up.** Put a `"use client"` directive in every component module, in addition to the entries. This is better if we ever expose deep-import subpaths, or if a future tsdown stops keeping the entry directive. The cost is directive noise in the copied Carbon files and a larger diff against upstream.

## 4. D5 recommendation: style delivery

### 4.1 Artifact: compiled v12 CSS only, as the single supported path
- **What we ship.** `dist/styles.css` (minified, with source map), built in our repo from one Sass entry:
  ```scss
  @use '@carbon/styles/scss/feature-flags' with ($feature-flags: ('enable-v12-release': true /* + O2 flags */));
  @use '@carbon/react/scss/config' with ($font-path: './fonts');
  @use '@carbon/react';
  @use '@carbon/ibm-products-styles/scss/index-without-carbon';
  // then Afframe component styles and the D6(a) theme overrides
  ```
- **Measured locally, first four lines only.**
  - Exit 0.
  - 1,766,203 bytes compressed, 173,001 bytes gzip -9.
  - All four Carbon zone classes are emitted (`.cds--white`, `.cds--g10`, `.cds--g90`, `.cds--g100`, 25 selectors each), so `<Theme>` and `GlobalTheme` switching work from this one file.
  - For comparison, IBM's v11 Carbon-only `styles.min.css` is 938,627 bytes, 101,952 gzip. The difference is mostly IBM Products.
  - Spacing, colour and type tokens are emitted as custom properties (`--cds-spacing-05`, `--cds-layer-01`, `--cds-text-primary`, `--cds-body-01-font-size`, `--cds-heading-03-font-size`, grep of the v12 compile). So consumer CSS can use `var(--cds-*)` without Sass.
- **How consumers import it.** One line, once, at the root: `import '@afframe/ui/styles.css'` in the App Router `app/layout.tsx`, or in `main.tsx` for Vite. Then wrap the app in the provider from 3.5. No Sass, no `sassOptions`, no `transpilePackages` (the JS is compiled; Carbon's own Next example needs none, row 15).
- **Why this beats the alternatives.**
  - It meets `goals.md:43` ("one documented entry point for styles/theme") and `goals.md:45` ("Consumers never need to configure Carbon themselves (Sass paths, prefixes, fonts, feature flags)") literally.
  - It is the only option where the consumer cannot break the v12 state. With a Sass-source path, any consumer `with` on a Carbon module we configured is a hard compile error (row 9: c1, c2 and c5 all exit 65).
  - Also with the Sass path, every consumer `*.module.scss` that touches Carbon Sass compiles with the v11 default flags (row 10).
- **Cost.**
  - Consumers get no compile-time customisation. By design, D6(a) overrides live in our Sass.
  - There is no CSS tree-shaking: about 173 KB gzip is loaded whatever the consumer uses.
  - Consumer Sass cannot use Carbon's breakpoint mixins in media queries, because custom properties do not work there. In analytics that affects 1 web `.scss` file, against 17 using spacing tokens and 5 using type tokens, and those two are available as `var()`.
  - The CSS is a Carbon-derived artifact under Apache-2.0 section 4 (`goals.md:154`). Our NOTICE, which already ships for the copied v12 source, must name it.
- **Runner-up: both (CSS plus a Sass entry).** Better if a consumer repo truly needs compile-time Sass: breakpoint mixins, dropping unused component CSS, or per-consumer theme maps. If we ever add it, it must be the open form that compiled in c4, never a closed `with`:
  - `@forward '@carbon/react/scss/config' with (... !default)`
  - with the flag set inside our entry
  - plus a tokens-only module that emits no CSS

  The cost is Sass in every consumer build (about 3.3 to 4.6 s per full compile: A:65 and S:60), consumer-side resolution of `@carbon/styles` (the pnpm load-path problem again), and a documented rule never to configure Carbon Sass directly. Sass-only (option a) is not recommended at all.

### 4.2 v12 flag
- Set it once, inside our Sass entry, before the first `@use '@carbon/react'` (row 11). `@carbon/styles/scss/feature-flags` and `@carbon/react/scss/feature-flags` give byte-identical output.
- The React half comes from our provider (3.5).
- Consumers never touch either half.

### 4.3 Prefix
- Keep Carbon `cds` and IBM Products `c4p`.
- Custom prefixes are declined (O8, `docs/scope.md:198,228`), and analytics code and agents already use `var(--cds-*)` (A:39, 335 uses).
- A non-default Carbon prefix would have to be set in three places:
  - Carbon `$prefix`
  - IBM Products' separate `$carbon-prefix` (row 26: missing it left 84 `.cds--` selectors behind)
  - the React `ClassPrefix` / `pkg.prefix`

  That is a good reason not to change it.

### 4.4 Fonts
- **The problem with the defaults.** Carbon's default compile emits 90 `@font-face` rules with `url("~@ibm/plex/IBM-Plex-{Sans,Mono,Serif}/fonts/split/woff2/...")` (30 per family, local compile). The `~` is a webpack-only convention. Carbon's own Sass guide says to use `@ibm/plex` for Vite (C:298-300).
- **Recommendation.**
  - Compile with `$font-path: './fonts'`. Verified: this emits `url("./fonts/IBM-Plex-Mono/fonts/split/woff2/...")`, 90 URLs.
  - At build, copy those 90 WOFF2 files from `@ibm/plex` into `dist/fonts/`, keeping the subpath layout: 1,340,876 bytes, license `OFL-1.1` (`SC/@ibm/plex/package.json`). Ship the OFL text next to them.
  - Browsers download only the `unicode-range` subsets they use.
  - Because the URLs are relative to the CSS file inside our package, they work from any install location. That fixes analytics' monorepo-relative URL (row 23).
- **Rejected.**
  - `$use-akamai-cdn: true`, which is what IBM's prebuilt uses (`carbon:packages/styles/tasks/build-css.js`): it makes remote requests at runtime and breaks offline Storybook checks like analytics' `verify-offline.mjs`.
  - `$css--font-face: false` plus consumer-hosted fonts: that is consumer configuration, which `goals.md:45` excludes.
- **Unverified.** That Next.js (Turbopack and webpack) and Vite resolve and emit relative `url()` assets from a CSS file inside `node_modules`. This is standard bundler behavior but was not built here. It is the first thing the reference consumer must prove.

### 4.5 Extras
- Re-export IBM's prebuilt `@carbon/charts-react/styles.css` as `@afframe/ui/charts.css`, imported after `styles.css`. That order follows analytics' rule (A:61).
- Unverified whether charts CSS or `@carbon/ai-chat` CSS respond to v12. Check both in visual regression before claiming a uniform v12 look.

### 4.6 How this removes each analytics pain point
| Analytics pain (A:122-128) | Status under the recommendation |
|---|---|
| Source-only package needs `transpilePackages` and shared tooling | Gone: consumers get compiled ESM + `.d.ts` + CSS |
| pnpm `.pnpm/node_modules` Sass load-path hack in Next and in the check script | Moved inside our repo only. In our build we control the layout: an npm install, pnpm `public-hoist-pattern` for `@carbon/*` and `@ibm/*`, or the Sass `pkg:` importer. Which one works is not yet tested (unverified). Consumers never run Sass |
| Monorepo-relative font URLs | Gone: fonts ship in `dist/fonts/` with relative URLs |
| v12 off / React-only flag toggles over v11 CSS | Gone: the flag is baked into the CSS, and the React flag comes from our provider over a single peer `@carbon/react` |
| `@position-try` parser warnings in Turbopack | Unchanged. They are upstream Carbon CSS and will appear in our compile too (unverified for v12 output) |
| Carbon as a regular dependency, risk of duplicates | Replaced by exact peers for `@carbon/react` and `@carbon/ibm-products` |

## 5. Open items (unverified; each is a reference-consumer CI check, `goals.md:46`)
1. A Next.js 16 App Router app, with both Turbopack and webpack, consuming an ESM-only package from GitHub Packages: the client barrel, the `./server` entry, `styles.css` and relative font URLs. None of this was built here.
2. A Vite and a Vitest consumer doing the same (expected native ESM, not built).
3. The Jest allowlist needed for `@carbon/ai-chat` and its `lit` chain.
4. Which of npm, pnpm `public-hoist-pattern` or the Sass `pkg:` importer gives a clean in-repo Sass compile without the `.pnpm/node_modules` path.
5. Whether package managers satisfy `@carbon/ai-chat`'s `@carbon/web-components` peer from our `dependencies` without a consumer warning.
6. Whether charts and ai-chat CSS reflect v12.
7. Whether the Sass of the 16 v12 components copied from carbon main compiles against `@carbon/styles` 1.116.0 in our entry. The 1,766,203-byte measurement in 4.1 covers only the four Carbon and IBM Products lines, not the copied component Sass.
