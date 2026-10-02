> **Pre-verification draft, kept as evidence.** Claims here were checked afterwards; the verification files (`round1/07a-verify-distribution-legal-security.md`, `round1/07b-verify-carbon.md`) override this file, and the authoritative text is `docs/research/carbon-reference.md` and `docs/research/carbon-catalog.md`.

# 04 · Tokens, theming and customization
Retrieved: 2026-09-23 · Lane: tokens-theming

## Summary (5-10 bullets)

- Carbon's color system is token-based, not palette-based: components consume semantic tokens (`$background`, `$layer-01`, `$text-primary`, `$border-subtle-01`, `$focus`, `$support-error`, …) that resolve differently per theme. Source: `@carbon/themes` package (github.com/carbon-design-system/carbon, `packages/themes`).
- Four shipped themes exist: white, g10, g90, g100 (two light, two dark), selected via a Sass `$theme` map or a runtime `Theme`/`GlobalTheme` React component that toggles a CSS class scope; there is no separate "high-contrast" theme beyond g100 (unverified whether IBM documents g100 explicitly as the "high contrast" option — see Open questions).
- Carbon is mid-migration to the W3C Design Tokens Community Group (DTCG) format with Style Dictionary as the build pipeline, package by package. `@carbon/colors` has already moved (`src/dtcg/colors.json` is its single source of truth, generating Sass/JS at build time); `@carbon/motion` likewise builds from `src/dtcg/motion.json`; `@carbon/themes` has a `dtcg` source directory. This is an active, not-yet-complete effort (open ADR/issue trail, see Known gaps).
- Carbon officially supports rebranding through Sass theme maps (`@use '@carbon/styles/scss/theme' with ($theme: (...))`), including full custom token maps and "extend a built-in theme" via `$fallback`, plus a configurable CSS/custom-property `$prefix` (default `cds`). Feature flag `enable-css-custom-properties` is `true` by default, so tokens are also emitted as runtime-overridable CSS custom properties.
- Typeface is IBM Plex (Sans/Serif/Mono/Sans-Condensed + per-family packages), licensed OFL-1.1, self-hostable or CDN-loadable (Akamai). Carbon's own docs state they "do not recommend replacing the Carbon typeface" because type tokens are metrics-tuned to Plex; swapping fonts is supported only as an explicit build-time Sass override (`$css--font-face: false` + custom `$font-families` + your own `@font-face` rules), with no runtime override path for prebuilt/CDN CSS.
- Layout tokens are split across `@carbon/layout` (spacing scale, breakpoints, unit conversion) and `@carbon/grid` (the 2x Grid: `cds--grid`/`cds--row`/`cds--col` classes, 16-column flex grid or CSS Grid). CSS Grid is enabled by default (`enable-css-grid: true`); flexbox grid must be opted into (`$use-flexbox-grid: false` default).
- Motion tokens live in `@carbon/motion`: standard/entrance/exit easing curves in two modes, "productive" and "expressive," exposed as Sass functions/mixins and JS (`easings`, `motion()`).
- There is an active, IBM-run effort to keep Figma and code tokens in sync ("push-to-figma", `figma-exports/` directory, and a proposed CI parity check between `src/dtcg/` and Figma exports) — meaning 1:1 Figma-variable-to-code-token mapping is a stated goal but, per the open GitHub issue, drift between Figma and code can currently happen silently.
- No official Carbon Tailwind preset is currently maintained: the IBM-owned `carbon-design-system/tailwind-preset-carbon` repo is archived (last push 2023-07-07); a community package `carbon-tailwind-preset` on npm was last published 2023-06-01 (v1.0.10, ISC license) and appears unmaintained.
- All Carbon Sass token/utility packages ship both Sass and JS bindings, so a downstream package can consume tokens as Sass variables, CSS custom properties (`--cds-*` by default), or JS/TS objects, depending on the consuming stack.

## Packages (from `00-inventory.json`, retrieved 2026-09-23)

| package | version | last publish | license | status | purpose |
|---|---|---|---|---|---|
| @carbon/themes | 11.82.0 | 2026-09-23 | Apache-2.0 | active | Color theme token definitions (white/g10/g90/g100), Sass + JS bindings |
| @carbon/colors | 11.59.0 | 2026-09-23 | Apache-2.0 | active | Raw color palette (swatch/grade scale), DTCG-sourced |
| @carbon/type | 11.68.0 | 2026-09-23 | Apache-2.0 | active | Type scale, type styles/tokens, Plex font-face + font-family helpers |
| @carbon/layout | 11.60.0 | 2026-09-23 | Apache-2.0 | active | Spacing scale, breakpoints, unit conversion, key heights |
| @carbon/grid | 11.63.0 | 2026-09-23 | Apache-2.0 | active | 2x Grid implementation (flexbox or CSS Grid), `cds--grid/row/col` |
| @carbon/motion | 11.53.0 | 2026-09-23 | Apache-2.0 | active | Motion/easing tokens, productive vs expressive modes |
| @carbon/elements | 11.98.0 | 2026-09-23 | Apache-2.0 | active | Aggregate re-export of colors/themes/type/layout/motion/grid/icons for JS consumers |
| @carbon/styles | 1.116.0 | 2026-09-23 | Apache-2.0 | active | Full compiled Sass entrypoint (components + tokens + theming + typeface replacement API) |
| @carbon/react | 1.117.0 | 2026-09-23 | Apache-2.0 | active | React components incl. `Theme`/`GlobalTheme`, `Layer` components |
| @carbon/icons | 11.89.0 | 2026-09-23 | Apache-2.0 | active | Icon SVG source set |
| carbon-components | 10.58.15 | 2026-08-21 | Apache-2.0 | **deprecated** ("no longer supported", see carbondesignsystem.com/deprecations/) | legacy v10 Sass/CSS package, superseded by @carbon/styles |
| @ibm/plex | 6.4.1 | 2026-08-21 | OFL-1.1 | active | Full IBM Plex font family bundle |
| @ibm/plex-sans | 1.1.0 | 2026-09-16 | OFL-1.1 | active | Per-family Plex Sans package |
| @ibm/plex-mono | 2.5.0 | 2026-09-16 | OFL-1.1 | active | Per-family Plex Mono package |
| @ibm/plex-sans-condensed | 2.0.0 | 2026-09-16 | OFL-1.1 | active | Per-family Plex Sans Condensed package |
| @ibm/plex-serif | 2.0.0 | 2026-09-16 | OFL-1.1 | active | Per-family Plex Serif package |
| carbon-preprocess-svelte | 0.11.46 | 2026-09-16 | Apache-2.0 | active (community-run, not IBM core) | Svelte preprocessor for Carbon, relevant only if a consumer repo uses Svelte |
| carbon-tailwind-preset (npm, non-Carbon-org) | 1.0.10 | 2023-06-01 | ISC | **unmaintained** (3+ years stale) | Community Tailwind preset mapping some Carbon values into Tailwind config |

Note: `carbon-tailwind-preset` and the archived `carbon-design-system/tailwind-preset-carbon` GitHub repo (archived, last push 2023-07-07) are not in the npm inventory JSON keyed list above by the inventory's own query set; version/date confirmed live against the npm registry and GitHub API on 2026-09-23 (see Sources).

## Capabilities

**Color token architecture.** `@carbon/themes` defines semantic color tokens grouped by role, confirmed from `packages/themes/docs/sass.md` on the `carbon-design-system/carbon` main branch: background tokens (`$background`, `$background-hover`, `$background-active`, `$background-selected`, `$background-brand`, `$background-inverse`…), layer tokens (`$layer-01/02/03` plus hover/active/selected/accent variants per layer), field tokens (`$field-01/02/03` plus hover variants), border tokens (`$border-subtle-00…03`, `$border-strong-01…03`, `$border-interactive`, `$border-disabled`, `$border-inverse`), text tokens (`$text-primary`, `$text-secondary`, `$text-placeholder`, `$text-helper`, `$text-error`, `$text-disabled`, `$text-inverse`, `$text-on-color…`), icon tokens (`$icon-primary`, `$icon-secondary`, `$icon-disabled`, `$icon-inverse`, `$icon-on-color…`), support/status tokens (`$support-error`, `$support-success`, `$support-warning`, `$support-caution-major/minor/undefined`, plus `-inverse` variants), focus tokens (`$focus`, `$focus-inset`, `$focus-inverse`), link tokens (`$link-primary`, `$link-secondary`, `$link-visited`, `$link-inverse`), plus `$overlay`, `$shadow`, `$skeleton-background`, `$skeleton-element`, `$toggle-off`, `$highlight`.

**Layering model.** The layer tokens (`layer-01/02/03`) express nested-surface depth (e.g., page background → card → nested card); Carbon ships a `Layer` React component (`packages/react/src/components/Layer`) that lets a subtree declare which layer level it's on so descendant components automatically pick the correct layer/field/border tokens, rather than the developer hardcoding a specific numbered token. Source: github.com/carbon-design-system/carbon `packages/react/src/components/Layer/`.

**Token exposure.** Every core token/utility package (`@carbon/themes`, `@carbon/colors`, `@carbon/type`, `@carbon/layout`, `@carbon/grid`, `@carbon/motion`) exposes the same values through: (a) Sass variables/maps/functions, (b) JS/TS exports (ESM and CommonJS), and (c) — for anything included by `@carbon/styles` with the default feature flags — CSS custom properties, because `enable-css-custom-properties` defaults to `true` in `packages/styles/scss/_feature-flags.scss`. Prefix for both CSS classes and custom properties is configurable via the Sass `$prefix` variable (default `'cds'`), forwarded from `@carbon/grid/scss/config`.

**Themes and switching.** `@carbon/themes` ships `white`, `g10`, `g90`, `g100` as both Sass maps and JS objects. Sass: set the whole-app theme via `@use '@carbon/themes' with ($theme: $g100)`, or scope a theme to a subtree with the `theme.theme()` mixin (e.g., `.my-dark-theme { @include theme.theme(themes.$g90); }`). React: `@carbon/react` ships `Theme` (scoped, e.g. wraps a section) and `GlobalTheme` (app-wide, uses React context) components accepting `theme: 'white' | 'g10' | 'g90' | 'g100'`; switching at runtime is supported by re-rendering with a different `theme` prop, which (per the component's contract) applies the corresponding CSS class scope. Source: `packages/react/src/components/Theme/index.tsx`, `packages/styles/README.md`.

**Custom themes.** Documented, supported paths in `@carbon/styles/README.md`: (1) fully custom theme map — `@use '@carbon/styles/scss/theme' with ($theme: (background: #e2e2e2, text-primary: #ffffff))`; (2) extend a built-in theme and add/override specific tokens while inheriting the rest — `@use '@carbon/styles/scss/theme' with ($fallback: themes.$g100, $theme: (custom-token-01: #000000))`; (3) CSS-custom-property overrides at runtime wherever `enable-css-custom-properties` is on, since tokens resolve to `--cds-<token>` custom properties that can be reassigned per DOM subtree without recompiling Sass.

**Type tokens.** `@carbon/type` provides: font-face inclusion for Plex (via Akamai CDN or self-hosted, controlled by `$use-akamai-cdn` and `$font-path`/`$use-per-family-plex`), a type scale (`type-scale($step)`), and named "type style" tokens (e.g., `productive-heading-01`, `body-long-01`) applied via `@include type.type-style('token-name')`, with an optional second boolean argument to enable a **fluid** variant of that style. Productive vs. expressive is the documented split for type sets per Carbon's typography guidelines (full type-set reference is on carbondesignsystem.com/guidelines/typography/type-sets — page content could not be directly retrieved in this session, see Open questions).

**Layout.** `@carbon/layout` supplies the spacing scale, breakpoint variables (`sm`, `md`, `lg`, `xlg`, `max`), unit conversion (`px`→`rem`/`em`), key heights, and mini-unit helpers, but does not itself implement the grid. `@carbon/grid` implements the 2x Grid with `cds--grid`/`cds--row`/`cds--col[-bp-span]` classes; it can emit either CSS Grid (default, `enable-css-grid: true`) or a flexbox grid (`$use-flexbox-grid: true`), consuming the breakpoints from `@carbon/layout`.

**Motion.** `@carbon/motion` exposes named easing curves (standard/entrance/exit) in two modes — productive and expressive — via a Sass function/mixin (`carbon--motion(curve, mode)`) and JS (`motion(curve, mode)` returning a `cubic-bezier()` string).

**Font replacement mechanics and limits.** `@carbon/styles/README.md` states explicitly: *"Carbon is designed, tested, and tuned for IBM Plex. We do not recommend replacing the Carbon typeface... There is no support for runtime typeface overrides on prebuilt/CDN Carbon styles."* Supported replacement requires three build-time Sass steps: disable Plex `@font-face` generation (`$css--font-face: false`), redefine the `$font-families` map (which is **not merged** with Carbon's defaults — every family key your compiled styles reference, e.g. `sans`, `mono`, `serif`, plus any language-specific stacks, must be supplied), and supply your own `@font-face` rules for the replacement assets.

## Customization hooks

- Sass `$prefix` (default `cds`) — renames both CSS class prefix and CSS custom property prefix project-wide; set once, before other `@use` statements, in the compiling entrypoint. Source: `packages/styles/scss/_config.scss`.
- Sass `$theme`/`$fallback` maps on `@carbon/styles/scss/theme` — full or partial token overrides, or brand-new custom token keys, resolved at Sass compile time.
- CSS custom properties (`--cds-*` by default) — because `enable-css-custom-properties: true` is on by default, consumers can override individual tokens at runtime per DOM scope without a Sass recompile (mechanism confirmed by the feature flag; exact custom-property naming pattern not independently re-verified against generated CSS output in this session — flag as low-confidence detail).
- `@carbon/react` `Theme`/`GlobalTheme` components — runtime theme selection scoped to a subtree or the whole app, no Sass recompile needed as long as all four shipped themes are already compiled into the CSS bundle.
- `$css--font-face`, `$font-families`, `$font-path`, `$use-akamai-cdn`, `$use-per-family-plex` — typeface source/replacement controls, all Sass compile-time.
- `$use-flexbox-grid` / `enable-css-grid` feature flag — switch grid engine.
- Feature flags in general (`packages/styles/scss/_feature-flags.scss`, forwarded from `@carbon/feature-flags`) — a documented, versioned on/off switch mechanism IBM uses to stage breaking or experimental behavior (e.g., `enable-v12-release`, `enable-dialog-element` currently false, meaning v12 and some newer behaviors are opt-in/not yet default as of the packages inventoried on 2026-09-23).
- Component-level token overrides: Carbon's theme maps include component-adjacent tokens (e.g., button, notification, tag colors are derived from the same semantic token set rather than having fully separate component-token files per the READMEs reviewed); no separate "component tokens" package distinct from `@carbon/themes` was found in this session — flag as unverified whether IBM maintains an explicit separate component-token layer beyond the semantic tokens themselves (see Open questions).

## Known gaps, pitfalls, open issues (link issues)

- DTCG migration is in progress, not complete, across packages: open ADR/tracking issues include "DTCG: Token migration" (github.com/carbon-design-system/carbon/issues/23088), "docs: add ADR for adopting DTCG token format" (issues/23372), "docs(ADR): DTCG token migration for packages" (PR #23382), and "feat(dtcg): update READMEs, add layout-explorer, fix CVEs in examples" (PR #23384). A team depending on stable machine-readable DTCG token files for build tooling should expect the token source layout to keep changing package by package.
- Figma/code token parity is not yet automated: open issue "CI check — token parity between src/dtcg/ and figma-exports" (github.com/carbon-design-system/carbon/issues/23255) states plainly: *"When a token is added to src/dtcg/ but push-to-figma hasn't run, or when Figma→Code sync brings in a new Figma token, neither side has any automated signal that drift exists. Parity breaks silently."* This means the Carbon Figma kit's variables are not guaranteed to be 1:1 with the current code tokens at any given moment.
- `carbon-components` (legacy v10) is formally deprecated per npm metadata ("This package is no longer supported. More info at https://carbondesignsystem.com/deprecations/") — any inherited code or examples referencing it should be treated as unsupported.
- No actively maintained Tailwind preset for Carbon exists: IBM's own `carbon-design-system/tailwind-preset-carbon` is archived (GitHub API: `archived: true`, `pushed_at: 2023-07-07T23:38:46Z`); the community `carbon-tailwind-preset` npm package has not published since 2023-06-01. A team wanting Tailwind + Carbon tokens together would need to hand-map tokens into a Tailwind config/theme rather than rely on a maintained bridge package.
- Font-replacement is explicitly discouraged by IBM's own docs and has "no support for runtime typeface overrides on prebuilt/CDN Carbon styles" — any brand-font requirement forces a self-built Sass pipeline rather than consuming prebuilt Carbon CSS/CDN assets as-is.
- Carbon's official typography type-set reference page (carbondesignsystem.com/guidelines/typography/type-sets) and the color-tokens overview page (carbondesignsystem.com/elements/color/overview/) could not be rendered as plain content in this session (client-rendered app shell); claims about the productive/expressive type-set catalog beyond what `@carbon/type`'s README states are therefore sourced only from the package README, not the guideline page itself.

## Options for Afframe UI (option · consequence, one line each)

- Consume Carbon tokens as Sass variables only (via `@carbon/styles`/`@carbon/themes`) · requires a Sass build step in every consumer repo; tightest coupling to Carbon's own compile-time theming mechanism.
- Consume Carbon tokens as CSS custom properties (`--cds-*`, on by default via `enable-css-custom-properties`) · works with any consumer stack (Tailwind, CSS Modules, CSS-in-JS) without a Sass toolchain, but relies on Carbon's default custom-property emission staying stable across versions.
- Consume Carbon tokens as JS/TS objects (`@carbon/themes`, `@carbon/elements`) · useful for CSS-in-JS or programmatic token pipelines (e.g., feeding a Style Dictionary/Tokens Studio build), but is a separate export surface from the Sass/CSS one and needs its own sync discipline.
- Re-export Carbon's DTCG source files (where they exist, e.g. `@carbon/colors`, `@carbon/motion`, parts of `@carbon/themes`) through your own Style Dictionary pipeline · gives Afframe UI a single machine-readable token source usable for Figma round-tripping, code generation, and multi-stack output, but inherits the fact that DTCG coverage is partial and still changing upstream as of 2026-09-23.
- Rely on Carbon's own Figma kit variables as ground truth and treat code as the build target · matches "Carbon imported into Figma" already in place, but per the open parity-CI issue, Figma and code can silently drift, so this needs an explicit sync/audit step rather than an assumed 1:1 mapping.
- Namespace/override the `$prefix` (default `cds`) to an Afframe-specific prefix at Sass compile time · avoids CSS class/custom-property collisions if multiple Carbon-based bundles (e.g. from different consumer repos) ever load on the same page; adds a rebuild step whenever upstream Carbon changes its own default prefix usage internally.
- Bridge Carbon tokens into a Tailwind config by hand (no maintained preset exists) · full control over the mapping and update cadence, but ongoing maintenance burden falls entirely on Afframe UI since both known Tailwind presets for Carbon are stale/archived.
- Keep the compiled Carbon typeface (IBM Plex) rather than substituting a brand font · avoids the "no runtime override, build-time only, use at your own risk" replacement path and its documented layout/accessibility risk; forgoes brand-specific typography.
- Substitute a brand font via the documented build-time Sass hooks (`$css--font-face: false`, custom `$font-families`, own `@font-face`) · enables brand typography but requires owning font-metric QA across every Carbon component and forfeits the CDN-hosted Plex path entirely.

## Open questions (could not verify)

- Whether IBM's own guidance formally designates g100 (or any theme) as the "high-contrast" theme, or whether high-contrast is a distinct, separately documented mode — the theme overview page (carbondesignsystem.com/guidelines/themes/overview/ and /elements/theme/overview/) returned 404/could not be parsed as plain text in this session.
- The full productive-vs-expressive type-set catalog and exact fluid-type token names/breakpoints — carbondesignsystem.com/guidelines/typography/type-sets could not be rendered in this session; only the `@carbon/type` README's mechanism description (`type-style(name, fluid?)`) was confirmed.
- Whether Carbon maintains a distinct "component token" layer (e.g., button-specific or notification-specific token files) separate from the semantic theme tokens, or whether components simply consume the semantic tokens directly — not confirmed from the READMEs reviewed; would need `packages/styles/scss/components/*` token usage inspected directly.
- Exact current state/scope of the "push-to-figma" tooling referenced in issue #23255 (what triggers it, how often it runs, whether it's public/usable by external consumers of the Carbon Figma kit) — only the issue's problem description was retrieved, not the tool's own docs.
- Whether `@carbon/themes` publishes a complete DTCG JSON file today or only a partial `dtcg/` source tree feeding Style Dictionary internally — the directory listing showed a `dtcg` folder under `packages/themes/src`, but its completeness/publication as a standalone artifact was not verified.

## Sources (URL · what it supports)

- https://github.com/carbon-design-system/carbon/blob/main/packages/themes/README.md · themes package usage (Sass/JS), theme list (white/g10/g90/g100), scoped theming mixin
- https://github.com/carbon-design-system/carbon/blob/main/packages/themes/docs/sass.md · full list of semantic color token names (background/layer/field/border/text/icon/support/focus/link/…)
- https://github.com/carbon-design-system/carbon/blob/main/packages/colors/README.md · color palette package, DTCG source-of-truth statement, Style Dictionary build note
- https://github.com/carbon-design-system/carbon/blob/main/packages/grid/README.md · 2x Grid classes, breakpoints usage
- https://github.com/carbon-design-system/carbon/blob/main/packages/motion/README.md · motion tokens, productive/expressive modes, DTCG source note
- https://github.com/carbon-design-system/carbon/blob/main/packages/type/README.md · type styles, type scale, font-family replacement pointer, fluid type mechanism
- https://github.com/carbon-design-system/carbon/blob/main/packages/layout/README.md · spacing scale, breakpoints, unit conversion package scope
- https://github.com/carbon-design-system/carbon/blob/main/packages/styles/README.md · custom theme maps, typeface replacement mechanism and warning, design-token Sass entrypoint
- https://github.com/carbon-design-system/carbon/blob/main/packages/styles/scss/_config.scss · `$prefix`, `$use-flexbox-grid`, `$use-akamai-cdn`, `$use-per-family-plex`, `$font-path` config defaults
- https://github.com/carbon-design-system/carbon/blob/main/packages/styles/scss/_feature-flags.scss · default feature flags incl. `enable-css-custom-properties: true`, `enable-css-grid: true`, `enable-v11-release: true`, `enable-v12-release: false`
- https://github.com/carbon-design-system/carbon/blob/main/packages/react/src/components/Theme/index.tsx · `Theme`/`GlobalTheme` React component API (`theme` prop, context)
- https://github.com/carbon-design-system/carbon/tree/main/packages/react/src/components/Layer · confirms existence of a dedicated `Layer` component
- https://github.com/carbon-design-system/carbon/issues/23088 · DTCG token migration tracking issue, Style Dictionary build pipeline description
- https://github.com/carbon-design-system/carbon/issues/23372 · ADR proposal for adopting DTCG token format (open)
- https://github.com/carbon-design-system/carbon/pull/23382 · ADR docs PR for DTCG token migration
- https://github.com/carbon-design-system/carbon/pull/23384 · DTCG-related README/tooling updates PR
- https://github.com/carbon-design-system/carbon/issues/23255 · open issue on missing CI parity check between `src/dtcg/` tokens and Figma exports; direct quote on silent drift risk
- https://github.com/carbon-design-system/tailwind-preset-carbon · official Tailwind preset repo, confirmed archived (GitHub API `archived: true`, `pushed_at: 2023-07-07T23:38:46Z`)
- https://www.npmjs.com/package/carbon-tailwind-preset · community Tailwind preset, npm registry confirms last publish 2023-06-01, version 1.0.10, ISC license
- docs/research/sources/round1/00-inventory.json · package versions, license, deprecation status, last-publish dates for all `@carbon/*`, `@ibm/plex*`, `carbon-components`, `carbon-preprocess-svelte` entries cited in the Packages table
- https://registry.npmjs.org (live query, 2026-09-23) · confirmed `carbon-tailwind-preset` registry metadata not present in the local inventory file
- https://api.github.com/repos/carbon-design-system/carbon (contents API, live query, 2026-09-23) · directory listings used to confirm `Theme`/`Layer` component existence and `dtcg` source directories under `packages/themes/src` and `packages/styles/scss`
