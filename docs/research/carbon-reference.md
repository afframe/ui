# IBM Carbon: research reference for Afframe UI

Retrieved 2026-09-23 · Method: ground-truth npm/GitHub inventory (139 npm packages, 121 GitHub repos; publish dates from the `latest_published` field, never `time.modified`), 6 research lanes (core, frameworks, extensions, tokens/theming, tooling, distribution/legal/security), 2 adversarial verification passes (Carbon technical claims; distribution, legal, security).
Tags: **(unverified)** = not confirmed from a primary source; **(corrected on verification)** = a lane claim was corrected or refuted by a verification pass, and the corrected fact is stated.
This document informs; it does not choose. Nothing here is legal advice.

---

## 1. Executive summary

1. Carbon's core team maintains only `@carbon/react` and `@carbon/web-components`; Angular, Vue and Svelte are community-maintained. [README](https://github.com/carbon-design-system/carbon/blob/main/README.md)
2. `@carbon/react` is at 1.117.0 (published 2026-09-23) and is branded "v11". v11 is Active; v12 has been in Preview since 2023-05-25 with Active, Maintenance and EOL all TBD. [release-schedule.md](https://github.com/carbon-design-system/carbon/blob/main/docs/release-schedule.md) GitHub milestones set targets (not commitments): v12-alpha 2026-10-31, v12-rc.0 2026-11-12, v12-beta 2026-12-31, v12-stable 2027-03-31; v12.x undated. npm has no v12 package or tag (`latest` = `next` = 1.117.0). (updated 2026-09-24) [milestones](https://github.com/carbon-design-system/carbon/milestones)
3. `@carbon/react` ships `"use client"` at its entry point (`es/index.js`, `lib/index.js`) since PR #20391 (merged 2025-09-02): every import from the package is a Client Component, still server-side rendered; deep imports do not carry the directive. (corrected on verification) [PR #20391](https://github.com/carbon-design-system/carbon/pull/20391)
4. React peers are `^16.8.6`, `^17.0.1`, `^18.2.0` and `^19.0.0`, plus `sass ^1.33.0`. Types are bundled but incomplete; the README advises `skipLibCheck: true`. [packages/react/README.md](https://github.com/carbon-design-system/carbon/blob/main/packages/react/README.md)
5. 16 IBM Products components (Tearsheet, SidePanel, UserAvatar and others) sit in `@carbon/react`'s GitHub source but are not exported from the published 1.117.0 build, and `enable-v12-release` does not expose them; they arrive with v12. (corrected on verification) The tarball ships no JS or source directories for them, only their Sass partials (compiled into the full `@carbon/styles` bundle) and type-only BigNumber `.d.ts` files. Today 14 of 16 are `@carbon/ibm-products` 2.99.0 root exports (BigNumber and Guidebanner only as `previewCandidate__`, Coachmark and TruncatedText only as `preview__`), Resizer ships as `@carbon-labs/react-resizer`, ActionSet is not publicly exported. (updated 2026-09-24) [V-verify rows 3a to 3d](../research/round2/V-verify.md) [product-migrated-components.mjs](https://github.com/carbon-design-system/carbon/blob/main/packages/react/product-migrated-components.mjs)
6. IBM deprecated the IBM Products Datagrid on 2024-11-20 (v2.54.0) in favour of TanStack Table plus core `DataTable` styling; v4 of IBM Products (date TBD) removes Datagrid. Datagrid still runs on `react-table ^7.8.0`. [tanstack-carbon README](https://github.com/carbon-design-system/tanstack-carbon/blob/main/README.md)
7. IBM's TanStack examples pin `@tanstack/react-table ^8.20.1` per example; npm `latest` is 9.2.4 (v9.0.0 published 2026-08-04), a breaking release (renamed hooks, required `features`, ESM-only, React >=18). (corrected on verification) [TanStack migration guide](https://tanstack.com/table/latest/docs/framework/react/guide/migrating)
8. Tokens: four themes (White, Gray 10, Gray 90, Gray 100), Sass maps plus `--cds-*` CSS custom properties on by default. Carbon is migrating tokens to W3C DTCG plus Style Dictionary; `@carbon/colors` is already DTCG-sourced; Figma-code parity is not automated (#23255). [colors README](https://github.com/carbon-design-system/carbon/blob/main/packages/colors/README.md)
9. Replacing IBM Plex is officially discouraged and possible only as a build-time Sass customization; there is no runtime override for prebuilt/CDN styles. [styles README](https://github.com/carbon-design-system/carbon/blob/main/packages/styles/README.md)
10. Carbon Charts: only `@carbon/charts` and `@carbon/charts-react` have 1.27.20 as `latest`; the Vue, Angular and Svelte wrappers have stale `latest` tags and ship current code under `next`. (corrected on verification) [charts-vue registry](https://registry.npmjs.org/@carbon/charts-vue)
11. Carbon MCP is a public preview, access-gated for non-IBMers (IBMid OAuth); `carbondesignsystem.com/llms.txt` is live. [Carbon MCP overview](https://carbondesignsystem.com/developing/carbon-mcp/overview/)
12. GitHub Packages npm needs a token to install even public packages, but consumer repos granted "Manage Actions access" can install with `GITHUB_TOKEN` (no PAT) in Actions. (corrected on verification) [GitHub Packages access control](https://docs.github.com/en/packages/learn-github-packages/configuring-a-packages-access-control-and-visibility#ensuring-workflow-access-to-your-package)
13. Using `@carbon/*` only as external dependencies avoids Apache-2.0 redistribution conditions; bundling Carbon JS or shipping CSS compiled from `@carbon/styles` redistributes Carbon in Object form and triggers §4. The Carbon repo root and the four checked tarballs ship `LICENSE`, no NOTICE. [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)
14. Accessibility: components follow the IBM Accessibility Checklist ("based on WCAG AA", version unstated); only colour themes cite WCAG 2.1 AA, for contrast. (corrected on verification) [accessibility overview source](https://github.com/carbon-design-system/carbon-website/blob/main/src/pages/guidelines/accessibility/overview.mdx)
15. `@carbon/react` embeds IBM Telemetry by default (opt-out). [packages/react/README.md](https://github.com/carbon-design-system/carbon/blob/main/packages/react/README.md)

## 2. Ecosystem map

### 2.1 Layers

| Layer | Contents | Source |
|---|---|---|
| 0 Elements | colors, grid, icons, pictograms, layout, motion, themes, type | [package-structure.md](https://github.com/carbon-design-system/carbon/blob/main/docs/package-structure.md) |
| 1 Primitives | styles, icons-react, icons-vue, pictograms-react, upgrade, utilities, utilities-react | same |
| 2 Components | `@carbon/react`, `@carbon/web-components` (re-export lower layers) | same |
| Extensions | IBM Products, Charts, AI Chat, Labs, ibm.com, community frameworks | sections 4, 5 |

### 2.2 Packages relevant to Afframe

Version and published date are the npm `latest` dist-tag and its `latest_published` time from the inventory (retrieved 2026-09-23). "Official" = carbon-design-system org, core or extension team; "community" = community-maintained per Carbon's README or npm description.

| Package | Latest | Published | License | Official/community | Status | Purpose |
|---|---|---|---|---|---|---|
| @carbon/react | 1.117.0 | 2026-09-23 | Apache-2.0 | official | active | React components (v11) |
| @carbon/web-components | 2.64.0 | 2026-09-23 | Apache-2.0 | official | active; v3 breaking rework in progress | Lit custom elements |
| @carbon/styles | 1.116.0 | 2026-09-23 | Apache-2.0 | official | active | All Sass/CSS |
| @carbon/themes | 11.82.0 | 2026-09-23 | Apache-2.0 | official | active | Theme tokens (Sass + JS) |
| @carbon/colors | 11.59.0 | 2026-09-23 | Apache-2.0 | official | active, DTCG-sourced | Colour palette |
| @carbon/type | 11.68.0 | 2026-09-23 | Apache-2.0 | official | active | Type scale, type styles, Plex font-face |
| @carbon/layout | 11.60.0 | 2026-09-23 | Apache-2.0 | official | active | Spacing, breakpoints |
| @carbon/grid | 11.63.0 | 2026-09-23 | Apache-2.0 | official | active | 2x Grid |
| @carbon/motion | 11.53.0 | 2026-09-23 | Apache-2.0 | official | active | Easing tokens |
| @carbon/elements | 11.98.0 | 2026-09-23 | Apache-2.0 | official | active | Aggregate of element packages |
| @carbon/icons, @carbon/icons-react | 11.89.0 | 2026-09-23 | Apache-2.0 | official | active | Icons (SVG, React) |
| @carbon/pictograms / -react | 12.85.0 / 11.111.0 | 2026-09-23 | Apache-2.0 | official | active | Pictograms |
| @carbon/utilities / -react | 0.26.0 / 0.29.0 | 2026-09-23 | Apache-2.0 | official | active, pre-1.0 | Helpers |
| @carbon/feature-flags | 1.10.0 | 2026-09-23 | Apache-2.0 | official | active | Flag engine (React, Sass, WC) |
| @carbon/upgrade | 11.46.0 | 2026-09-23 | Apache-2.0 | official | active | Codemods |
| @carbon/cli | 11.51.0 | 2026-09-23 | Apache-2.0 | official | active | Carbon task CLI |
| @carbon/icon-helpers | 10.83.0 | 2026-09-23 | Apache-2.0 | official | active | Icon internals |
| @carbon/import-once | 10.7.0 | 2022-02-25 | Apache-2.0 | official | no release since 2022-02-25 (Sass `@import`-era helper) (corrected on verification) | Legacy Sass helper |
| @carbon/utils-position | 1.3.0 | 2024-05-15 | MIT | official, separate repo | no release since 2024 | Positioning helper |
| @carbon/storybook-addon-theme | 2.27.0 | 2025-10-29 | Apache-2.0 | official | slower cadence | Storybook theme switcher |
| @carbon/ibm-products | 2.99.0 | 2026-09-16 | Apache-2.0 | official | active | Product patterns (React) |
| @carbon/ibm-products-styles | 2.95.0 | 2026-09-16 | Apache-2.0 | official | active | IBM Products Sass/CSS |
| @carbon/ibm-products-web-components | 0.48.0 | 2026-09-16 | Apache-2.0 | official | active, pre-1.0 | IBM Products as WC |
| @carbon/ibm-products-community | 0.13.0 | 2024-10-23 | Apache-2.0 | official org | no release since 2024 | Community patterns |
| @carbon/charts / -react | 1.27.20 | 2026-09-16 | Apache-2.0 | official | active | D3 charts, React wrapper |
| @carbon/charts-vue | 1.11.0 (`next` 1.27.20) | 2023-06-28 | Apache-2.0 | official | stale `latest` (corrected on verification) | Vue wrapper |
| @carbon/charts-angular | 1.8.1 (`next` 1.27.20) | 2023-08-31 | Apache-2.0 | official | stale `latest` (corrected on verification) | Angular wrapper |
| @carbon/charts-svelte | 1.22.18 (`next` 1.27.20) | 2025-02-18 | Apache-2.0 | official | stale `latest` (corrected on verification) | Svelte wrapper |
| @carbon/echarts-theme | 0.7.0 | 2026-09-03 | Apache-2.0 (npm); repo NOASSERTION | official org | pre-1.0 | Apache ECharts theme on Carbon tokens |
| @carbon/echarts-toolbar | 0.4.0 | 2026-09-03 | Apache-2.0 | official org | pre-1.0 | ECharts toolbar (table view, fullscreen, export) |
| @carbon/ai-chat | 1.21.0 | 2026-09-21 | Apache-2.0 | official | active | Chat application (React + WC) |
| @carbon/ai-chat-components | 1.11.0 | 2026-09-21 | Apache-2.0 | official | active | Chat sub-components |
| @carbon/agentic-renderer | 0.1.0 | 2026-09-15 | Apache-2.0 | official org | pre-1.0, new | Renders A2UI/GenUI surfaces with `cds-*` elements |
| @carbon/element-styles | 0.3.13 | 2026-09-17 | Apache-2.0 | official org | "experimental" (npm description) | Attribute-selector styles for native HTML |
| @carbon-labs/* (36 packages) | 0.x, some rc/canary | 2023-11-30 to 2026-09-21 | Apache-2.0 | official org, incubation | pre-1.0 | see 5.4 |
| @carbon/vue | 3.0.32 | 2026-08-25 | Apache-2.0 | community | Vue 3 on Carbon v10 (corrected on verification) | Vue components |
| carbon-components-angular | 5.72.2 | 2026-06-30 | Apache-2.0 | community | active | Angular components |
| carbon-components-svelte | 0.112.0 | 2026-09-11 | Apache-2.0 | community | active | Svelte components |
| carbon-icons-svelte / carbon-pictograms-svelte | 13.15.0 / 13.20.0 | 2026-08-27 / 2026-08-28 | Apache-2.0 | community | active | Svelte icons, pictograms |
| carbon-preprocess-svelte | 0.11.46 | 2026-09-16 | Apache-2.0 | community | active | Svelte build helpers |
| @carbon/ibmdotcom-web-components | 2.60.3 | 2026-09-23 | Apache-2.0 | official (ibm.com) | active | ibm.com WC + React wrappers |
| @carbon/ibmdotcom-styles / -services / -utilities | 2.57.3 | 2026-09-23 | Apache-2.0 | official (ibm.com) | active | ibm.com helpers |
| @carbon/ibmdotcom-react | 1.56.0 | 2024-02-26 | Apache-2.0 | official (ibm.com) | source removed from `main`; not npm-deprecated (corrected on verification) | ibm.com React |
| @carbon/react-native | 9.0.7 | 2025-11-13 | Apache-2.0 | official org | not researched (unverified) | React Native |
| @ibm/plex | 6.4.1 | 2024-05-16 | OFL-1.1 | IBM | active family | All Plex fonts |
| @ibm/plex-sans / -mono / -serif / -sans-condensed | 1.1.0 / 2.5.0 / 2.0.0 / 2.0.0 | 2024-11-11 / 2026-06-11 / 2026-02-02 / 2025-12-04 | OFL-1.1 | IBM | active | Per-family Plex |
| @tanstack/react-table, @tanstack/table-core | 9.2.4 | 2026-08-28 | MIT | third party | active | Headless table |
| @tanstack/react-virtual | 3.14.13 | 2026-09-14 | MIT | third party | active | Virtualization |
| accessibility-checker | 4.0.34 | 2026-09-08 | Apache-2.0 | IBM (Equal Access) | active | a11y engine for CI |
| carbon-addons-iot-react | 5.18.2 | 2026-08-31 | Apache-2.0 | official org | unmaintained per its npm description; not npm-deprecated (corrected on verification) | IoT/Maximo components |
| carbon-components | 10.58.15 | 2024-05-08 | Apache-2.0 | official | npm-deprecated (v10) | Legacy v10 CSS/JS |
| carbon-components-react | 8.67.0 | 2024-09-26 | Apache-2.0 | official | npm-deprecated (v10) | Legacy v10 React |
| carbon-components-vue | 0.0.1 | 2017-12-21 | none in registry | n/a | abandoned name | Superseded by `@carbon/vue` |
| carbon-tailwind-preset | 1.0.10 | last modified 2023-06-01 (not in inventory; publish date not checked) | ISC | community | unmaintained | Tailwind preset |

Legacy or out-of-scope names in the inventory, grouped: `@carbon/cli-plugin-*`, `@carbon/cli-preset-*`, `@carbon/cli-config|runtime|tools`, `@carbon/npm`, `@carbon/server`, `@carbon/toolkit` (all 0.0.x, last published 2018 to 2020); `@carbon/ibm-cloud-cognitive*` and `@carbon/ibm-security` (IBM Products predecessors, last 2021 to 2024); `@carbon/ai` 0.0.1-alpha.0 (2023-10-31) and `@carbon/ai-utilities` 0.0.1-rc.0 (2023-12-04); `@carbon/aem-web-components` and `@carbon/carbon-for-aem` (MIT); `@carbon/telemetry` 0.1.0 (2022-03-11); `@carbon/bundler`, `@carbon/icons-handlebars`, `@carbon/icons-motion`, `@carbon/component-usage-report`, `@carbon/generate-pattern`, `@carbon/triage`, `@carbon/release-test`, `@carbon/addons-website`. Source: inventory `00-inventory.json`.

Note: `@carbon/react` is branded v11 but versioned 1.x on npm; the design-system generation and the npm major are independent. [versioning.md](https://github.com/carbon-design-system/carbon/blob/main/docs/guides/versioning.md)

## 3. Core: @carbon/react and foundation packages

### 3.1 Release model

- v10 reached end-of-life 2024-09-30. v11: initial release 2021-08-06, Active since 2022-03-31, Maintenance TBD. v12: Preview since 2023-05-25; Active, Maintenance and EOL TBD. [release-schedule.md](https://github.com/carbon-design-system/carbon/blob/main/docs/release-schedule.md)
- Active lines ship biweekly minors and are tested with `accessibility-checker` in a real browser. [release-schedule.md](https://github.com/carbon-design-system/carbon/blob/main/docs/release-schedule.md)
- Semver policy for `@carbon/react` (what counts as patch, minor, major; TypeScript types are not bound to semver). [versioning.md](https://github.com/carbon-design-system/carbon/blob/main/docs/guides/versioning.md)

### 3.2 Maturity model

- Preview exports: `@carbon/react` 1.117.0 uses both `preview_` (Layout, Text, Pagination, OverflowMenuV2, PageSelector, FeatureFlags, hooks) and `preview__` (PageHeader, Dialog, Card, DatePicker "next", Fluid*, IconIndicator, ShapeIndicator, AiSkeleton*, ChatButton, Slug) and still exports `unstable_`/`unstable__` aliases alongside them. (corrected on verification) Most prefixed names are aliases of stable exports, including all Fluid* fields; see carbon-catalog.md section 2. (updated 2026-09-24) [es/index.js](https://unpkg.com/@carbon/react@1.117.0/es/index.js), [preview-code.md](https://github.com/carbon-design-system/carbon/blob/main/docs/preview-code.md)
- Promotion from preview to stable follows a checklist: about 3 months of real-world feedback, unit, VRT and AVT coverage, Code Connect, website docs. [preview-code.md](https://github.com/carbon-design-system/carbon/blob/main/docs/preview-code.md)
- Feature flags: `enable-*` (opt-in, may change) and `enable-v12-*` (locked API, default-on in v12). Per surface: React `<FeatureFlags>`, Sass `@use '@carbon/styles/scss/feature-flags' with (...)`, WC attributes. Some flags have codemods via `npx @carbon/upgrade migrate <name> --write`; Sass-only flags have none. [feature-flags.md](https://github.com/carbon-design-system/carbon/blob/main/docs/feature-flags.md)

### 3.3 Component surface

- `packages/react/src/components` holds roughly 120 component directories (Accordion through UserAvatar). Stable vs preview is authoritative only in the export names (3.2) and the Storybook sidebar. [src/components](https://github.com/carbon-design-system/carbon/tree/main/packages/react/src/components)
- 16 IBM-Products-migrated components exist in `src/` but are not exported from the published 1.117.0 entry point: ActionSet, NotificationsPanel, BigNumber, FullPageError, Coachmark, OptionsTile, InterstitialScreen, Guidebanner, Resizer, ScrollGradient, SidePanel, EditInPlace, Tearsheet, TagOverflow, UserAvatar, TruncatedText. (corrected on verification) [product-migrated-components.mjs](https://github.com/carbon-design-system/carbon/blob/main/packages/react/product-migrated-components.mjs)

### 3.4 React, TypeScript, SSR

- Peers: `react`, `react-dom`, `react-is` at `^16.8.6`, `^17.0.1`, `^18.2.0` or `^19.0.0`; `sass ^1.33.0`. Whether the `sass` peer is optional (peerDependenciesMeta) was not checked (unverified). [registry](https://registry.npmjs.org/@carbon/react)
- React 19 bugs [#18574](https://github.com/carbon-design-system/carbon/issues/18574) (Tabs) and [#19350](https://github.com/carbon-design-system/carbon/issues/19350) (`use-resize-observer`) closed 2025-02-14 and 2025-05-20.
- Types: native `.d.ts` (`types: lib/index.d.ts`); "not all components have yet been typed"; `skipLibCheck: true` advised; progress tracked in GitHub Project 53. [README](https://github.com/carbon-design-system/carbon/blob/main/packages/react/README.md)
- `'use client'`: shipped at the top of `es/index.js` and `lib/index.js` by PR #20391 (merged 2025-09-02), which closed RSC request [#14458](https://github.com/carbon-design-system/carbon/issues/14458). Every import from `@carbon/react` is a Client Component and none can be a Server Component, but they are still server-side rendered. `exports` is `null`, so deep imports (`es/components/...`) do not carry the directive. (corrected on verification) [PR #20391](https://github.com/carbon-design-system/carbon/pull/20391)
- No carbondesignsystem.com page stating Next.js App Router or RSC support was found (unverified). The first `@carbon/react` version with the directive was not checked (unverified).
- Module output: `main: lib/index.js` (CJS), `module: es/index.js` (ESM), `sideEffects` allowlist covering entry points, feature-flag files and all `.scss`/`.css`. [package.json](https://github.com/carbon-design-system/carbon/blob/main/packages/react/package.json)
- IBM Telemetry is bundled, opt-out. [README](https://github.com/carbon-design-system/carbon/blob/main/packages/react/README.md)

### 3.5 Sass and CSS pipeline

- Dart Sass with the module system (`@use`, not `@import`). `$prefix` (default `cds`) prefixes classes and custom properties. [sass.md](https://github.com/carbon-design-system/carbon/blob/main/docs/guides/sass.md)
- Config variables: `$css--body`, `$css--font-face`, `$css--reset`, `$css--default-type`, `$font-display`, `$font-path`, `$use-akamai-cdn`, `$use-per-family-plex`, `$use-flexbox-grid`, `$flex-grid-columns` (16), `$css--emit-type-custom-props`. [sass.md](https://github.com/carbon-design-system/carbon/blob/main/docs/guides/sass.md)
- Per-component entry points (`@use '@carbon/styles/scss/components/button'`) reduce compiled CSS; modules configure once per compilation; the bulk `@use '@carbon/styles'` goes last when mixed. [sass.md](https://github.com/carbon-design-system/carbon/blob/main/docs/guides/sass.md)
- Precompiled `@carbon/styles/css/styles.css` exists for consumers without Sass; it cannot change `$prefix` or drop unused component styles at Sass level. [sass.md](https://github.com/carbon-design-system/carbon/blob/main/docs/guides/sass.md)
- Historic compile-time and tree-shaking complaints (see section 11) mostly predate the Sass-module rewrite; current severity on 1.117.0 is (unverified).

### 3.6 v12

- Built inside the v11 codebase behind `enable-v12-release` (default `false`), which turns on all `enable-v12-*` flags; separate v12 Storybooks exist. [working-with-v12.md](https://github.com/carbon-design-system/carbon/blob/main/docs/working-with-v12.md)
- IBM Products components migrating into `@carbon/react` are documented in `docs/feature-flags.md`; enabling `enable-v12-release` does not expose them, and they "will be part of the public `@carbon/react` API when v12 ships". (corrected on verification) [feature-flags.md](https://github.com/carbon-design-system/carbon/blob/main/docs/feature-flags.md)
- No GA date is committed in the release schedule; GitHub milestones set targets: v12-alpha 2026-10-31, v12-rc.0 2026-11-12, v12-beta 2026-12-31, v12-stable 2027-03-31 (updated 2026-09-24). [milestones](https://github.com/carbon-design-system/carbon/milestones) [release-schedule.md](https://github.com/carbon-design-system/carbon/blob/main/docs/release-schedule.md)

## 4. Framework implementations

| Implementation | Package | Maintained by | Built on | Notes | Source |
|---|---|---|---|---|---|
| React | `@carbon/react` | core team | Carbon v11 | deepest coverage | [README](https://github.com/carbon-design-system/carbon/blob/main/README.md) |
| Web Components | `@carbon/web-components` 2.64.0 | core team | Lit, `cds-*` tags | CDN build; Storybook at web-components.carbondesignsystem.com; v3 in progress | [WC README](https://github.com/carbon-design-system/carbon/blob/main/packages/web-components/README.md) |
| Angular | `carbon-components-angular` 5.72.2 | community | native Angular | peers `@carbon/styles ^1.54.0` (unverified) | lane 02 |
| Vue | `@carbon/vue` 3.0.32 | community | Carbon **v10** | no peerDependencies; Vue 3 library (devDependency `vue ^3.5.13`); depends on npm-deprecated `carbon-components ^10.58.5` and `@carbon/icons-vue ^10`; `carbon11` branch unreleased (corrected on verification) | [Vue README](https://github.com/carbon-design-system/carbon-components-vue/blob/main/README.md) |
| Svelte | `carbon-components-svelte` 0.112.0 | community | native Svelte | 2,909 stars; companion icons, pictograms, preprocess packages | inventory |
| Ember | `IBM/carbon-components-ember` | outside the carbon-design-system org | n/a | out of scope | lane 02 |

- README quote: "Community-maintained packages are also available for Angular, Svelte, and Vue." [README](https://github.com/carbon-design-system/carbon/blob/main/README.md)
- Web Components v3 (branch `feat/web-components-v3`): moves from Carbon's `carbonElement` decorator to Lit's `customElement`, drops auto-registration on import (explicit `defineCustomElement`), adds prefixed builds and scoped registries. [WC README](https://github.com/carbon-design-system/carbon/blob/main/packages/web-components/README.md)
- React wrappers for WC (historically `es/components-react` via `@lit/react` `createComponent`) exist; SSR guidance comes from the archived pre-merge repo only, so current SSR behaviour of WC and its React wrappers under Next.js is (unverified). Shadow DOM content is not server-rendered without declarative shadow DOM (unverified for current v2/v3). [legacy doc](https://github.com/carbon-design-system/carbon-web-components/blob/main/docs/welcome-story-react.mdx)
- Parity: React/WC parity is tracked per component (e.g. [#19931](https://github.com/carbon-design-system/carbon/issues/19931) under parent #17326); no current parity matrix was found (unverified).
- Customising WC from outside the shadow root: CSS custom properties and CSS Shadow Parts (documented in the ibm.com WC README). [ibm.com WC README](https://raw.githubusercontent.com/carbon-design-system/carbon-for-ibm-dotcom/main/packages/web-components/README.md)
- Angular, Vue and Svelte each have their own prop API; there is no cross-framework prop contract (lane 02 analysis).
- Carbon for ibm.com: "unique components shared between the IBM.com user journeys". `@carbon/ibmdotcom-react` `latest` is 1.56.0 (2024-02-26); the last publish was 1.66.1 on `v1-latest` (2024-10-24); its source was removed from `main`; peers React 16/17 only; not npm-deprecated. The README names "web components and its React Wrappers" as the React path. (corrected on verification) [ibm.com README](https://github.com/carbon-design-system/carbon-for-ibm-dotcom/blob/main/README.md)
- Whether ibm.com packages are intended for third-party use beyond their Apache-2.0 license is not stated (unverified).

## 5. Extensions

### 5.1 IBM Products (`@carbon/ibm-products` 2.99.0)

- Peers: React 16.8.6 to 19, `react-is`, `@carbon/react ^1.115.0`, `@carbon/grid ^11.61.0`, `@carbon/layout ^11.58.0`, `@carbon/motion ^11.51.0`, `@carbon/themes ^11.80.0`, `@carbon/type ^11.66.0`. [package.json](https://github.com/carbon-design-system/ibm-products/blob/main/packages/ibm-products/package.json)
- Dependencies include `react-table ^7.8.0`, `react-window ^1.8.11` and `@carbon-labs/react-resizer`. [package.json](https://github.com/carbon-design-system/ibm-products/blob/main/packages/ibm-products/package.json)
- About 75 component directories (AboutModal through WebTerminal: Tearsheet, PageHeader, SidePanel, ConditionBuilder, DataSpreadsheet, FilterPanel, EmptyStates, NotificationsPanel, Datagrid and more). [src/components](https://github.com/carbon-design-system/ibm-products/tree/main/packages/ibm-products/src/components)
- Maturity tiers: Draft (not exported); Preview Candidate (`previewCandidate__`, "Partially complete", for non-production or controlled production environments, being validated with real use cases); Preview (`preview__`, production-ready, minor API changes possible, at least 80% coverage); Stable (no prefix, at least 90% coverage, breaking changes need a major). (corrected on verification) [COMPONENT_STATUS_DEFINITIONS.md](https://github.com/carbon-design-system/ibm-products/blob/main/docs/guides/COMPONENT_STATUS_DEFINITIONS.md)
- Per-component status is enumerable from the published entry: 2.99.0 has 26 `previewCandidate__*` exports (e.g. ConditionBuilder, DataSpreadsheet, Toolbar, SearchBar) and 10 `preview__*` exports (e.g. PageHeader, Tearsheet, AddSelect, TruncatedText); unprefixed exports are nominally Stable, but 35 of them are deprecated in source; see carbon-catalog.md section 4. (updated 2026-09-24) [es/index.js](https://unpkg.com/@carbon/ibm-products@2.99.0/es/index.js)
- The prefix system replaced the older canary `pkg.component.*` flags. [CANARY_MIGRATION_GUIDE.md](https://github.com/carbon-design-system/ibm-products/blob/main/docs/guides/CANARY_MIGRATION_GUIDE.md)
- Moving to core: 16 components migrate into `@carbon/react` for v12 (see 3.3 and 3.6).
- Storybook: [ibm-products.carbondesignsystem.com](https://ibm-products.carbondesignsystem.com/). A WC port (`@carbon/ibm-products-web-components` 0.48.0) is pre-1.0.

### 5.2 Datagrid deprecation and TanStack Table

- Timeline: v2.54.0 (2024-11-20) marked Datagrid deprecated and published TanStack examples; v2 gets sev1/sev2 fixes only; v3 (date TBD) sev1 only; v4 (date TBD) "Datagrid code will be removed entirely". Core `DataTable` stays maintained. [tanstack-carbon README](https://github.com/carbon-design-system/tanstack-carbon/blob/main/README.md)
- 2.99.0 still exports `Datagrid` (unprefixed) and `useDatagrid`, with extension hooks such as `useActionsColumn`, `useColumnOrder`, `useEditableCell`, `useNestedRows`, `useSelectRows`, `useStickyColumn`. [Datagrid dir](https://github.com/carbon-design-system/ibm-products/tree/main/packages/ibm-products/src/components/Datagrid)
- `tanstack-carbon` is an examples repo, not an installable package: React and WC examples for AI Label, batch actions, column resizing, row actions, row click, filtering, localization, virtualization (2,000 rows with `@tanstack/react-virtual`), sticky columns, editable cells, nested rows and "mix-and-match" (Datagrid and TanStack side by side). It layers Carbon `DataTable` markup on headless TanStack. [tanstack-carbon](https://github.com/carbon-design-system/tanstack-carbon)
- The GitHub API reports no license for `tanstack-carbon` (inventory, `license: null`); the repo has 10 stars and was pushed 2026-09-07.
- Version pins: each React example's own `package.json` pins `@tanstack/react-table ^8.20.1` (virtual, resizing, sortable, ai-label, mix-and-match, sticky-columns, editableCells, community/tanstack-table-carbon); the root `package.json` has no TanStack dependency. `^8.20.1` cannot resolve to 9.x. (corrected on verification) [mix-and-match/package.json](https://github.com/carbon-design-system/tanstack-carbon/blob/main/react/mix-and-match/package.json)

TanStack v8 vs v9:

| Aspect | v8 (8.21.3) | v9 (9.2.4 `latest`; 9.0.0 published 2026-08-04) |
|---|---|---|
| Hook | `useReactTable` | `useTable` |
| Features | implicit | required `features` option; row models via `tableFeatures()` |
| State | `onStateChange` | removed |
| Sorting APIs | v8 names | renamed |
| Module format | not ESM-only | ESM-only |
| React peer | `>=16.8` | `>=18` |
| Compatibility | IBM examples target it | deprecated `useLegacyTable` shim in `@tanstack/react-table/legacy` |

Source: [TanStack migration guide](https://tanstack.com/table/latest/docs/framework/react/guide/migrating), [migrating.md](https://github.com/TanStack/table/blob/main/docs/framework/react/guide/migrating.md). The inventory's 9.2.4 is the npm `latest` tag, not a workspace install. (corrected on verification)

### 5.3 Carbon Charts

- `@carbon/charts`: D3 + TypeScript; the README advertises 26 charts and wrappers for vanilla JS, React, Angular, Vue and Svelte. The exact current chart count was not re-verified (unverified). [carbon-charts](https://github.com/carbon-design-system/carbon-charts)

| Package | `latest` | `latest` published | `next` | Peers on `next` |
|---|---|---|---|---|
| @carbon/charts | 1.27.20 | 2026-09-16 | n/a | n/a |
| @carbon/charts-react | 1.27.20 | 2026-09-16 | n/a | n/a |
| @carbon/charts-vue | 1.11.0 (peer `vue ^2.7.0`) | 2023-06-28 | 1.27.20 | `vue ^3.5.16` |
| @carbon/charts-angular | 1.8.1 (peer Angular below 16) | 2023-08-31 | 1.27.20 | `@angular/core` 20, 21 or 22 |
| @carbon/charts-svelte | 1.22.18 | 2025-02-18 | 1.27.20 | not recorded |

(corrected on verification) [charts-vue registry](https://registry.npmjs.org/@carbon/charts-vue), [packages/vue/package.json](https://github.com/carbon-design-system/carbon-charts/blob/main/packages/vue/package.json). Whether maintainers plan to promote `next` to `latest` is (unverified).

- Theming follows Carbon themes (White, Gray 10, Gray 90, Gray 100); charts documentation site could not be scraped, so chart-specific theming APIs are (unverified).
- Open a11y issues: [#2072](https://github.com/carbon-design-system/carbon-charts/issues/2072) (MeterChart, WCAG 1.4.1), [#2054](https://github.com/carbon-design-system/carbon-charts/issues/2054) (1.4.1), [#2130](https://github.com/carbon-design-system/carbon-charts/issues/2130) (toolbar, 4.1.2), #2134, #1969, #2086. Old screen-reader issue [#65](https://github.com/carbon-design-system/carbon-charts/issues/65) was closed as completed on 2020-05-06. (corrected on verification)
- Adjacent: `@carbon/echarts-theme` 0.7.0 and `@carbon/echarts-toolbar` 0.4.0 (2026-09-03) theme Apache ECharts with Carbon v11 tokens; not researched beyond npm metadata (unverified).

### 5.4 Carbon Labs

- "A community-driven incubation space enabling rapid prototyping, development, and deployment of Carbon-based components"; separately versioned packages; scaffolded with `npx @carbon-labs/create@latest`. [carbon-labs README](https://github.com/carbon-design-system/carbon-labs/blob/main/README.md)
- 36 `@carbon-labs/*` packages in the inventory (round 2 counted 38 published; updated 2026-09-24), all 0.x, Apache-2.0. Storybook at labs.carbondesignsystem.com.
- No documented graduation policy into core or IBM Products was found (unverified); `@carbon-labs/react-resizer` is already a dependency of IBM Products.

| Group | Packages (latest, published) |
|---|---|
| Active in 2026-08/09 | react-style-picker 0.27.0 (09-21), wc-global-header 0.95.0 (09-21), wc-wysiwyg 0.2.0 (09-21), primitives 0.6.0 (09-18), react-date-picker 0.12.0 (09-18), wc-date-picker 0.16.0 (09-18), react-plane-stack-3d 0.10.0 (09-03), react-animated-header 0.61.0 (08-25), react-ui-shell 0.106.0 (08-20), react-tag-input 0.6.0 (08-12) |
| Published 2026-05 to 2026-07 | ai-chat 0.39.0, react-resizer 0.25.0, react-processing 0.21.0, react-whats-new 0.28.0, wc-ai-tag 0.27.0, react-example-button 0.18.0 (all 06-02); mdx-components 0.29.0, react-registration-flow 0.2.0 (07-29); wc-example-button 0.28.0, wc-style-picker 0.36.0 (07-20); wc-resizer 0.5.0 (07-15); react-calendar 0.11.0 (05-18); react-first-time-orientation 0.21.0, react-split-panel 0.22.0, react-text-highlighter 0.23.0, react-theme-settings 0.30.0, utilities 0.28.0, wc-empty-state 0.22.0 (05-15); vscode-snippets 0.5.0 (05-14) |
| No release since 2025 or earlier | ai-tag 0.8.0 (2025-07-09), web-components-example-button 0.4.1-canary.389 (2025-01-02), ai-feedback 0.12.0, ai-prompt-tuning 0.1.0, ai-ux-control 0.0.2-canary.256, network-graph 0.9.0 (all 2024-06-27), ai-extended-button 0.0.1-rc.0 (2023-11-30) |

Source: inventory `latest_published`. The lane claim that Labs packages were broadly published in Aug to Sep 2026 came from `time.modified`. (corrected on verification)

### 5.5 Carbon for AI

- `@carbon/ai-chat` 1.21.0: "an opinionated but extensible chat application that's available as both React and web components"; `@carbon/ai-chat-components` 1.11.0 exposes sub-components. Peers: React `>=17 <20`, `@carbon/web-components >=2.54.0 <3.0.0`. Docs at chat.carbondesignsystem.com. [carbon-ai-chat README](https://github.com/carbon-design-system/carbon-ai-chat/blob/main/README.md)
- `@carbon-labs/ai-chat` 0.39.0 (2026-06-02) is a separate Labs package.
- AI label: `@carbon/react` exports `AILabel`, `AiSkeleton*`, `ChatButton` and a legacy `Slug` (3.2). The carbondesignsystem.com AI label guideline pages returned 404, so guideline content is (unverified).
- `@carbon/agentic-renderer` 0.1.0 (2026-09-15): "Catalog-driven renderer" for A2UI SurfaceModel and GenUI RendererView using `cds-*` elements (npm description only; unverified beyond that).
- `@carbon/ai` and `@carbon/ai-utilities` are 2023 alpha/rc placeholders (inventory).

### 5.6 Other add-ons

- `carbon-addons-iot-react` 5.18.2: "This library no longer has a dedicated development resource maintaining it"; not npm-deprecated. (corrected on verification) [registry](https://registry.npmjs.org/carbon-addons-iot-react)
- `@carbon/element-styles` 0.3.13: "experimental styling system for native HTML elements" (npm description only; unverified beyond that).
- `@carbon/react-native` 9.0.7 (2025-11-13): exists; not researched (unverified).

## 6. Tokens, theming and customization

- Semantic colour tokens by role: background, layer (01/02/03 with hover/active/selected/accent), field, border (subtle, strong, interactive, disabled, inverse), text, icon, support (error, success, warning, caution), focus, link, plus overlay, shadow, skeleton, toggle-off, highlight. [themes/docs/sass.md](https://github.com/carbon-design-system/carbon/blob/main/packages/themes/docs/sass.md)
- `Layer` component sets the nesting level so descendants pick the right layer, field and border tokens. [Layer](https://github.com/carbon-design-system/carbon/tree/main/packages/react/src/components/Layer)
- Themes: `white`, `g10`, `g90`, `g100` as Sass maps and JS objects; Sass `@use '@carbon/themes' with ($theme: $g100)` or scoped `@include theme.theme(themes.$g90)`; React `Theme` (subtree) and `GlobalTheme` (app). [themes README](https://github.com/carbon-design-system/carbon/blob/main/packages/themes/README.md), [Theme/index.tsx](https://github.com/carbon-design-system/carbon/blob/main/packages/react/src/components/Theme/index.tsx)
- Whether IBM designates any theme as "high contrast" is (unverified).
- Custom themes (documented): full custom map via `@use '@carbon/styles/scss/theme' with ($theme: (...))`; extend a built-in via `$fallback` plus added or overridden tokens; runtime overrides of `--cds-*` custom properties, since `enable-css-custom-properties` defaults to `true`. [styles README](https://github.com/carbon-design-system/carbon/blob/main/packages/styles/README.md), [_feature-flags.scss](https://github.com/carbon-design-system/carbon/blob/main/packages/styles/scss/_feature-flags.scss)
- Exact generated custom-property naming was not checked against built CSS (unverified). Whether a separate component-token layer exists beyond semantic tokens is (unverified).
- Exposure: each token package ships Sass, JS/TS (ESM and CJS) and, via `@carbon/styles`, CSS custom properties; `$prefix` renames both classes and custom properties. [_config.scss](https://github.com/carbon-design-system/carbon/blob/main/packages/styles/scss/_config.scss)
- Type: Plex via Akamai CDN or self-hosted (`$use-akamai-cdn`, `$font-path`, `$use-per-family-plex`); type scale and type styles via `@include type.type-style('name', $fluid)`; productive vs expressive sets. The type-set guideline page could not be rendered (unverified beyond the README). [type README](https://github.com/carbon-design-system/carbon/blob/main/packages/type/README.md)
- Font replacement: "Carbon is designed, tested, and tuned for IBM Plex. We do not recommend replacing the Carbon typeface." Build-time only: `$css--font-face: false`, a full `$font-families` map (not merged with defaults), and your own `@font-face`. "There is no support for runtime typeface overrides on prebuilt/CDN Carbon styles." [styles README](https://github.com/carbon-design-system/carbon/blob/main/packages/styles/README.md)
- Layout and grid: `@carbon/layout` spacing, breakpoints (`sm`, `md`, `lg`, `xlg`, `max`), unit conversion; `@carbon/grid` 2x Grid (`cds--grid/row/col`), CSS Grid by default (`enable-css-grid: true`), flexbox via `$use-flexbox-grid`. [grid README](https://github.com/carbon-design-system/carbon/blob/main/packages/grid/README.md), [layout README](https://github.com/carbon-design-system/carbon/blob/main/packages/layout/README.md)
- Motion: standard, entrance and exit curves in productive and expressive modes, via Sass and JS `motion(curve, mode)`. [motion README](https://github.com/carbon-design-system/carbon/blob/main/packages/motion/README.md)
- DTCG migration: `@carbon/colors` uses `src/dtcg/colors.json` as single source, built with `style-dictionary ^5.5.0`; `@carbon/motion` builds from `src/dtcg/motion.json`; `@carbon/themes` has a `dtcg` source directory. Open trail: [#23088](https://github.com/carbon-design-system/carbon/issues/23088), ADR issue [#23372](https://github.com/carbon-design-system/carbon/issues/23372), ADR PR [#23382](https://github.com/carbon-design-system/carbon/pull/23382) (unmerged), PR [#23384](https://github.com/carbon-design-system/carbon/pull/23384). Whether `@carbon/themes` publishes complete DTCG JSON is (unverified).
- Figma parity: [#23255](https://github.com/carbon-design-system/carbon/issues/23255) (open): "neither side has any automated signal that drift exists. Parity breaks silently." The push-to-figma tool's scope and availability to outside users are (unverified).
- Tailwind: IBM's `tailwind-preset-carbon` is archived (last push 2023-07-07; npm name returns 404); community `carbon-tailwind-preset` 1.0.10 (ISC) last modified 2023-06-01; no other Tailwind repo in the org. [tailwind-preset-carbon](https://api.github.com/repos/carbon-design-system/tailwind-preset-carbon)

## 7. Design and engineering tooling

- **Figma kit**: colour tokens are Figma variables, and the "(v11) Carbon Design System" library holds all four themes. [Figma kits page](https://carbondesignsystem.com/designing/kits/figma/), [Figma Community](https://www.figma.com/community/file/1157761560874207208/v11-carbon-design-system). Use of Figma variable **modes** for theme switching is (unverified): the kits page does not mention modes and the Medium source returned 403. [Medium](https://medium.com/carbondesign/introducing-figma-variables-and-a-consolidated-all-themes-library-d4893d1b8920)
- Other kits: IBM Products kit (Beta), versioned in [carbon-for-products-design-kit](https://github.com/carbon-design-system/carbon-for-products-design-kit) (last push 2025-04-04); Charts/data-viz kit as an Alpha Figma Community file ([Alpha Carbon Charts Library](https://www.figma.com/community/file/1342888187036080999/alpha-carbon-charts-library)); a dedicated charts-kit repo was not found (unverified).
- **Code Connect**: `packages/react/figma.config.json` plus 87 `*.figma.ts(x)` files; also for Web Components (`packages/web-components/figma.config.json`, `language: html`, 70 files). [WC figma.config.json](https://github.com/carbon-design-system/carbon/blob/main/packages/web-components/figma.config.json)
- Code Connect limitation [#17607](https://github.com/carbon-design-system/carbon/issues/17607) (open): "Variable modes aren't currently supported. (we are using them for AI presence)". It concerns AI-presence prop mapping; the issue does not say it affects theme handoff. (corrected on verification)
- **Storybook**: react.carbondesignsystem.com and web-components.carbondesignsystem.com run Storybook (major version unverified); `@carbon/storybook-addon-theme` 2.27.0 is reusable in other Storybooks. Storybook Composition (`refs`) is a generic Storybook feature; Carbon does not document it for consumers (unverified).
- **Docs site**: carbondesignsystem.com on `gatsby-theme-carbon` ([repo](https://github.com/carbon-design-system/gatsby-theme-carbon)); per-component tabs Usage, Style, Code, Accessibility (e.g. [/components/tabs/accessibility/](https://carbondesignsystem.com/components/tabs/accessibility/)). The `carbon-platform` "next website" repo (last push 2025-04-01) has unknown production status (unverified).
- **Accessibility**: "Carbon components follow the IBM Accessibility Checklist which is based on WCAG AA, Section 508, and European standards" (no WCAG version given); "Carbon color themes strive to comply with the WCAG 2.1 AA guidelines for contrast". IBM checklist v7.3 (required at IBM since 2024-10-01) includes WCAG 2.2 A/AA criteria; no Carbon page claims WCAG 2.2 conformance. (corrected on verification) [overview.mdx](https://github.com/carbon-design-system/carbon-website/blob/main/src/pages/guidelines/accessibility/overview.mdx), [IBM requirements](https://www.ibm.com/able/requirements/requirements/)
- **Testing in Carbon CI**: `accessibility-checker` (IBM Equal Access, 4.0.34) with a `Custom_Ruleset` = `IBM_Accessibility` minus a denylist ([toHaveNoACViolations.js](https://github.com/carbon-design-system/carbon/blob/main/config/jest-config-carbon/matchers/toHaveNoACViolations.js)); 92 Playwright `*.avt.e2e.*` files run via `yarn avt`. [release-schedule.md](https://github.com/carbon-design-system/carbon/blob/main/docs/release-schedule.md), [equal-access](https://github.com/IBMa/equal-access). Whether 4.0.34 implements checklist 7.3 rules, the denylist contents, and any visual-regression tool (Percy, Chromatic) are (unverified).
- **llms.txt**: `https://carbondesignsystem.com/llms.txt` returns HTTP 200 (categorised link index); `react.carbondesignsystem.com/llms.txt` returns 404. [llms.txt](https://carbondesignsystem.com/llms.txt)
- **Carbon MCP**: "Carbon MCP is available as a public preview." "IBMers can immediately start using Carbon MCP ... Non-IBMers can request access" (website overview page). Onboarding is IBMid OAuth. The `carbon-mcp` repo is an issue tracker only (no server source, no license). Request [#20855](https://github.com/carbon-design-system/carbon/issues/20855) was closed as completed on 2026-03-04 with a pointer to the preview sign-up. Coverage listed: React, WC, IBM Products, icons, pictograms, AI Chat, Charts, some Labs; "Carbon TanStack" and "Carbon Patterns" marked coming soon. (corrected on verification) [overview](https://carbondesignsystem.com/developing/carbon-mcp/overview/), [onboarding](https://carbondesignsystem.com/developing/carbon-mcp/onboarding-and-setup/), [carbon-mcp](https://github.com/carbon-design-system/carbon-mcp)
- **Claude Design sync**: the `/design-sync` flow pointing Claude Design at Afframe UI previews was named in lane 05 as an option only; no primary source was researched (unverified).

## 8. Distribution, build and release

Distribution options:

| Option | Who can install | Auth to install | CI notes | Source |
|---|---|---|---|---|
| GitHub Packages npm | users with read permission (public package: everyone) | token always, even for public packages | Actions in repos granted "Manage Actions access" use `GITHUB_TOKEN`; dev machines and non-Actions CI need a classic PAT with `read:packages` (fine-grained PATs unsupported) (corrected on verification) | [npm registry docs](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry), [permissions](https://docs.github.com/en/packages/learn-github-packages/about-permissions-for-github-packages) |
| npmjs.com public | anyone | none | publish via token or OIDC trusted publishing | [trusted publishers](https://docs.npmjs.com/trusted-publishers) |
| npmjs.com private scoped | granted accounts | npm token | paid: $7/month user account, $7 per member per month org | [private packages](https://docs.npmjs.com/creating-and-publishing-private-packages), [paid org](https://docs.npmjs.com/upgrading-to-a-paid-organization-plan) |
| Self-hosted registry (e.g. Verdaccio) | whoever the operator allows | configurable | operator runs hosting and auth | lane 06 (tool details unverified) |
| Git URL dependency | anyone with repo read (public repo: anyone) | none | npm installs devDependencies and runs `prepare` (and `prepack`) for git deps, so a `prepare` build yields built output; pnpm/yarn behaviour (unverified) (corrected on verification) | [npm scripts](https://docs.npmjs.com/cli/v11/using-npm/scripts) |
| GitHub Release tarball | anyone for a public repo | none | URL dependency pinned in lockfile | lane 06 |

GitHub Packages details:
- "You need an access token to publish, install, and delete private, internal, and public packages." Only the Container registry allows anonymous pulls. [npm registry docs](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
- The npm registry supports granular permissions; a repo-linked package inherits repo permissions by default. Granting a repo Actions access also lets Dependabot pull the package without a PAT. Caveat: "If you grant a public repository access to private packages, forks of the repository may be able to access the private packages." [access control](https://docs.github.com/en/packages/learn-github-packages/configuring-a-packages-access-control-and-visibility#ensuring-workflow-access-to-your-package)
- A "GitHub App token" alternative is not supported by the pages read. (corrected on verification)
- Open: whether inherited permissions must be removed before adding repos; whether a public package needs an explicit Actions grant; the exact consumer `permissions:` key (unverified).

npm publishing:
- Trusted publishing (OIDC): npm CLI 11.5.1+ and Node 22.14.0+; publishers: GitHub-hosted Actions runners, GitLab.com shared runners, CircleCI cloud; no self-hosted runners. It does not require a public repo. Automatic provenance only when publishing via trusted publishing, from a public repository, of a public package; `--provenance` is added by default. (corrected on verification) [trusted publishers](https://docs.npmjs.com/trusted-publishers)
- Manual provenance: public repo, cloud-hosted runner on GitHub Actions or GitLab CI/CD, npm 9.5.0+; "Provenance generation is not supported for private repositories, even when publishing public packages." (corrected on verification) [provenance](https://docs.npmjs.com/generating-provenance-statements)
- Trusted publishing for restricted/private packages is implied, not stated (unverified). Trusted publishing or npm provenance on GitHub Packages is not documented (unverified).

Build and release options (named by lane 06; versions, licences and capabilities not checked) (unverified):
- Bundlers: tsup, tsdown, Vite library mode, Rollup, Rslib, unbuild, bunchee.
- Workspaces and task runners: pnpm/npm workspaces, Turborepo, Nx.
- Versioning: Changesets (changeset files per PR), semantic-release (commit-message driven), release-please (release PR).
- Output concerns: ESM-only vs dual ESM+CJS; `'use client'` preservation per output chunk varies by bundler (unverified); `sideEffects` must keep CSS imports; `exports` subpaths for per-component imports; `peerDependencies` on Carbon to avoid duplicate copies.
- Carbon's own layout for reference: `main` CJS, `module` ESM, no `exports` map, explicit `sideEffects` list (3.4).

## 9. Legal and licensing

Informational, not legal advice. Statements report what the license texts say.

| Item | License | Key obligations or limits | Source |
|---|---|---|---|
| Carbon code (`@carbon/*`, `@carbon-labs/*`) | Apache-2.0 | §4(a) give recipients a copy of the License; (b) mark modified files; (c) keep copyright, patent, trademark and attribution notices; (d) NOTICE only if the Work ships one | [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0) |
| Carbon NOTICE | none | the Carbon repo root and tarballs of `@carbon/react` 1.117.0, `@carbon/styles` 1.116.0, `@carbon/web-components` 2.64.0, `@carbon-labs/ai-chat` 0.39.0 contain `LICENSE`, no NOTICE; per-file IBM headers (e.g. "Copyright IBM Corp. 2016, 2026") must be kept (corrected on verification) | [Carbon LICENSE](https://github.com/carbon-design-system/carbon/blob/main/LICENSE) |
| Afframe UI | PolyForm Noncommercial 1.0.0 | recipients must get the terms (or URL) and every `Required Notice:` line; repo LICENSE carries "Required Notice: Copyright 2026 Hleb Tkachenko (https://afframe.com)" | [PolyForm NC 1.0.0](https://polyformproject.org/licenses/noncommercial/1.0.0) (no trailing slash; the slash form returns 404) |
| IBM Plex | OFL-1.1, Reserved Font Name "Plex" | subsetting or format conversion creates a Modified Version, which may not use "Plex" as its name without IBM's written permission; font files stay under OFL-1.1 (not PolyForm); each copy carries the notice and OFL; fonts may not be sold alone; the `split/` files in `@ibm/plex` 6.4.1 are Original Version | [Plex LICENSE.txt](https://github.com/IBM/plex/blob/master/LICENSE.txt) |
| TanStack Table, Virtual | MIT | notice retention | inventory |
| `tanstack-carbon` examples | GitHub API reports no license | copying example code has no stated grant (unverified) | inventory |

- Dependency vs redistribution: "Derivative Works shall not include works that remain separable from, or merely link (or bind by name) to the interfaces of, the Work". Keeping `@carbon/*` external does not redistribute Carbon; bundling Carbon JS into `dist` or shipping CSS compiled from `@carbon/styles` distributes Carbon in Object form and triggers §4. [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)
- Combining licences: Apache-2.0 lets you apply your own terms to "Your modifications" or to derivative works "as a whole", provided Carbon's code keeps its Apache conditions. The downstream legal effect of a PolyForm-plus-Apache package is (unverified). [Apache-2.0](https://www.apache.org/licenses/LICENSE-2.0)
- Trademarks: Apache-2.0 §6 grants no trademark rights. IBM fair use is limited to truthful, text-only references and excludes logos; "Do not incorporate any IBM product names into your company's product names." "IBM" is a trademark and trade name; "IBM Plex®" and "Plex®" are listed trademarks. [IBM trademarks](https://www.ibm.com/legal/copyright-trademark)
- "Carbon" is not on IBM's trademark list and no Carbon-specific naming guidance was found; its status is (unverified).
- Whether a CSS `font-family` alias for a self-subset Plex counts as the OFL "primary font name" is (unverified).
- IBM Telemetry in `@carbon/react` is a data-collection consideration for redistribution (3.4).

## 10. Security and information control

GitHub features on a public repo:
- Secret scanning: "Public repositories: Secret scanning runs automatically for free." [secret scanning](https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning)
- Push protection for users: on by default, account-level, covers pushes to public repos. Push protection for repositories: listed free for public repos but disabled by default (enable under Settings > Code security > Secret Protection > Push protection); one page contradicts this ("Requires GitHub Secret Protection"). Custom patterns, AI-detected secrets, delegated bypass, security campaigns and security overview need paid Secret Protection even on public repos. (corrected on verification) [security features](https://docs.github.com/en/code-security/getting-started/github-security-features), [GHAS](https://docs.github.com/en/get-started/learning-about-github/about-github-advanced-security), [push protection](https://docs.github.com/en/code-security/secret-scanning/introduction/about-push-protection)
- Code scanning, CodeQL CLI and Copilot Autofix are available on public repos without Code Security. Dependency review: GitHub pages disagree on public-repo availability (unverified). [GHAS](https://docs.github.com/en/get-started/learning-about-github/about-github-advanced-security)
- Hardening guidance: pin actions to full commit SHA, least-privilege `permissions:`, care with `pull_request_target` on forks. [hardening guide](https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions)
- Other scanners named by lane 06: gitleaks, trufflehog, OpenSSF Scorecard, Renovate, Dependabot; licences and versions not checked (unverified).

`anthropics/claude-code-action` model ([security.md](https://github.com/anthropics/claude-code-action/blob/main/docs/security.md)):
- Triggers only for users with write access on issue, PR, comment and review events; for `workflow_run` both actors are checked; `workflow_dispatch`, `repository_dispatch` and `schedule` are not checked separately.
- Bots blocked by default; `allowed_bots` entries skip the permission check. `allowed_non_write_users` works only with `github_token` (not App auth), scrubs secrets best-effort, and the docs say "Do not use a personal access token" with it.
- Input sanitising strips HTML comments, invisible characters, image alt text, hidden attributes and entities; "new bypass techniques may emerge". `include_comments_by_actor` / `exclude_comments_by_actor` filter comment authors. "Do not check out an untrusted ref into the workspace root before this action." `show_full_output` is off by default; turning it on exposes logs publicly.
- Fork PRs under `pull_request`: no secrets except a read-only `GITHUB_TOKEN`; first-time contributors may need workflow approval. [pull_request event](https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request)

The two existing workflows, as observed in the repo on 2026-09-23:

| Aspect | `.github/workflows/claude.yml` | `.github/workflows/claude-code-review.yml` |
|---|---|---|
| Triggers | `issue_comment`, `pull_request_review_comment`, `pull_request_review`, `issues` (opened, assigned), filtered on `@claude` in body/title | `pull_request` (opened, synchronize, ready_for_review, reopened); author filter commented out |
| Permissions | contents, pull-requests, issues, actions: read; `id-token: write` | contents, pull-requests, issues: read; `id-token: write` |
| Action pins | `actions/checkout@v4`, `anthropics/claude-code-action@v1` (tags, not SHAs) | same tags |
| Secret | `secrets.CLAUDE_CODE_OAUTH_TOKEN` | `secrets.CLAUDE_CODE_OAUTH_TOKEN` |
| Extras | `additional_permissions: actions: read` | plugin marketplace loaded from `https://github.com/anthropics/claude-code.git`, plugin `code-review@claude-code-plugins`, `--allowedTools` limited to inline comments |
| Fork PRs | write-access check applies to comment and review events | token secret absent on fork PRs, so the action cannot authenticate; error vs skip not observed (unverified) |

Information control facts:
- The local research and goals folder `.context/` is excluded via `.git/info/exclude`, which is per-clone and not in a committed `.gitignore` (observed with `git check-ignore -v`).
- Public Storybook or docs deploys expose whatever stories and pages they contain; hosting-side access control options were not researched (unverified).

## 11. Known gaps and pitfalls

Candidates for "improved components" or Afframe-side work. Status as of retrieval.

| Area | Gap | Link |
|---|---|---|
| Types | Incomplete TypeScript coverage; `skipLibCheck` advised | [README](https://github.com/carbon-design-system/carbon/blob/main/packages/react/README.md), Project 53 |
| RSC | Entry-point `'use client'` makes every import a Client Component; deep imports lack it | [PR #20391](https://github.com/carbon-design-system/carbon/pull/20391) |
| v12 | 16 migrated components unavailable until v12; milestone targets only (stable 2027-03-31) | [feature-flags.md](https://github.com/carbon-design-system/carbon/blob/main/docs/feature-flags.md) |
| Tables | Datagrid deprecated, on react-table v7; TanStack integration is copy-paste examples on v8, no package, no stated licence | [tanstack-carbon](https://github.com/carbon-design-system/tanstack-carbon) |
| Tables | Datagrid backlog (222 title matches), e.g. [#5659](https://github.com/carbon-design-system/ibm-products/issues/5659) blank body with global filter, [#3887](https://github.com/carbon-design-system/ibm-products/issues/3887) selectable nested rows | ibm-products issues |
| Sass build | Compile time: [#7294](https://github.com/carbon-design-system/carbon/issues/7294), [#3348](https://github.com/carbon-design-system/carbon/issues/3348), [#6198](https://github.com/carbon-design-system/carbon/issues/6198), [#5059](https://github.com/carbon-design-system/carbon/issues/5059), [discussion #8526](https://github.com/carbon-design-system/carbon/discussions/8526); current severity (unverified) | carbon issues |
| Bundle | Tree-shaking: [#5980](https://github.com/carbon-design-system/carbon/issues/5980), [#4882](https://github.com/carbon-design-system/carbon/issues/4882), [#4881](https://github.com/carbon-design-system/carbon/issues/4881) (CJS era; current severity unverified); icons barrel import is large | carbon issues |
| CSS | `@carbon/styles` `.css` in `sideEffects` [#11599](https://github.com/carbon-design-system/carbon/issues/11599): fixed for `@carbon/react`; `@carbon/styles` own package.json (unverified) | carbon issues |
| a11y core | [#23373](https://github.com/carbon-design-system/carbon/issues/23373) tabs roles, [#21932](https://github.com/carbon-design-system/carbon/issues/21932) Pagination, [#17558](https://github.com/carbon-design-system/carbon/issues/17558) Dropdown `aria-label`, [#17753](https://github.com/carbon-design-system/carbon/issues/17753) RadioButton group name | carbon issues |
| a11y IBM Products | [#6353](https://github.com/carbon-design-system/ibm-products/issues/6353) UserAvatar, [#6669](https://github.com/carbon-design-system/ibm-products/issues/6669) Datagrid, [#9910](https://github.com/carbon-design-system/ibm-products/issues/9910) TagSet overflow count | ibm-products issues |
| a11y Charts | [#2072](https://github.com/carbon-design-system/carbon-charts/issues/2072), [#2054](https://github.com/carbon-design-system/carbon-charts/issues/2054), [#2130](https://github.com/carbon-design-system/carbon-charts/issues/2130), #2134, #1969, #2086 | carbon-charts issues |
| a11y scope | No Carbon WCAG 2.2 claim; CI ruleset excludes a denylist | 7 |
| Charts | Vue, Angular, Svelte wrappers: stale `latest`, current code on `next` | 5.3 |
| Tokens | DTCG migration mid-flight; Figma/code parity not automated [#23255](https://github.com/carbon-design-system/carbon/issues/23255) | 6 |
| Tailwind | No maintained preset | 6 |
| Fonts | No runtime font override; replacement discouraged | 6 |
| Telemetry | IBM Telemetry on by default in `@carbon/react` | 3.4 |
| WC | v3 breaking change (no auto-registration); SSR guidance only from archived repo | 4 |
| Vue | `@carbon/vue` still on Carbon v10 and deprecated `carbon-components` | 4 |
| Figma | Code Connect lacks variable modes (AI presence) [#17607](https://github.com/carbon-design-system/carbon/issues/17607) | 7 |
| Maturity | `preview_`, `preview__`, `unstable_` and `unstable__` names coexist | 3.2 |
| Labs | No graduation policy found (unverified); several Labs packages unpublished since 2023 to 2024 | 5.4 |
| AI tooling | Carbon MCP gated for non-IBMers | 7 |

## 12. Decision map

Options with a one-line consequence each; no pick.

### D1 Framework target: React only, Web Components, or both
**Decided 2026-09-24: React.**
- React only (`@carbon/react`): deepest component coverage and all IBM Products React patterns; every consumer must be React.
- Web Components (`@carbon/web-components`): usable from any framework or plain HTML; SSR under Next.js is unverified and the v3 rework is breaking.
- Both (WC core plus React layer, or React plus WC build): covers mixed consumers; doubles the surface to test and document.
- Facts: only React and WC are core-maintained; `@carbon/vue` is on Carbon v10; `@carbon/ai-chat` peers `@carbon/web-components >=2.54 <3`, so chat pulls in WC even in a React-only setup; Code Connect exists for both React and WC; IBM Products is React-first (WC port pre-1.0).

### D2 Package distribution to consumer repos
- GitHub Packages npm: token for every install; consumer repos can use `GITHUB_TOKEN` in Actions after a "Manage Actions access" grant; developers need a classic PAT.
- npmjs.com public: no auth for anyone; the built package is world-downloadable (the source already is).
- npmjs.com private scoped: access-controlled; $7 per member per month for an org and a token per consumer.
- Git URL dependency: no registry; npm runs `prepare` to build; pnpm/yarn behaviour unverified; versioning by tag.
- Self-hosted registry: full control; hosting and uptime to run.
- Facts: trusted publishing (OIDC) is documented for npmjs.com only; automatic provenance needs a public repo and a public package; forks of a public repo with access to a private package may gain access.

### D3 Repo shape: one package or multi-package workspace
- One package: no workspace tooling; one version for everything (tokens, components, tables).
- Multi-package workspace (e.g. tokens, react, tables, charts): independent versions and lighter installs; needs workspace tooling and a release tool (Changesets or similar).
- Facts: Carbon itself is layered (Elements, Primitives, Components); IBM Products peers six separate `@carbon/*` packages; a reference consumer app inside the repo implies a workspace either way.

### D4 Language, build tool and output format
- ESM-only: simplest matrix; CJS-only consumers cannot import.
- Dual ESM+CJS: matches Carbon's own `main`/`module` layout; two artifact sets and conditional exports.
- Bundle Carbon into `dist`: self-contained output; redistributes Carbon in Object form (Apache §4 applies).
- Keep Carbon as `peerDependencies`: no redistribution and no duplicate copies; consumers install matching versions.
- Facts: TanStack v9 is ESM-only; `@carbon/react` ships entry-point `'use client'`, and bundler handling of the directive per chunk is unverified; Carbon types are incomplete; bundler choices (tsup, tsdown, Vite, Rslib and others) were not verified.

### D5 Style delivery: Sass source, compiled CSS, or both
- Sass source: consumers keep `$prefix`, theme maps and per-component imports; every consumer needs Dart Sass with `@use`.
- Compiled CSS: no Sass in consumers; theme and prefix fixed at build, and shipping CSS compiled from `@carbon/styles` triggers Apache §4.
- Both: most flexible; two paths to keep in sync and a larger package.
- Facts: `@carbon/react` peers `sass ^1.33.0` (optional status unverified); Carbon ships precompiled `styles.css`; `--cds-*` custom properties allow runtime overrides either way; font replacement works only in the Sass path.

### D6 Token source of truth and pipeline
- Carbon Sass/JS tokens as source, Afframe overrides via theme maps: least tooling; tied to Carbon's compile-time model.
- Own DTCG source with Style Dictionary, importing Carbon DTCG where available: one source for CSS, Sass, TS and Figma; upstream DTCG coverage is partial and changing.
- Figma variables as source: matches existing Figma kit; Carbon's own Figma/code parity is not automated (#23255).
- CSS custom properties as the only public contract: stack-neutral; relies on Carbon's `--cds-*` emission staying stable.
- Facts: `@carbon/colors` builds from DTCG with `style-dictionary ^5.5.0`; ADR still unmerged; no maintained Tailwind preset.

### D7 Table engine and TanStack version
- IBM Products Datagrid: fastest start; deprecated, react-table v7, removal in IBM Products v4.
- TanStack v8 + Carbon `DataTable`: IBM's examples apply as written; v8 is the prior major.
- TanStack v9 + Carbon `DataTable`: current major; examples need porting (renamed hook, `features`, ESM-only, React >=18) or the deprecated `useLegacyTable` shim.
- Core `DataTable` only: maintained by Carbon; no virtualization, pinning or resizing engine.
- Facts: example pins are `^8.20.1` per example, not root; `tanstack-carbon` has no licence reported by GitHub; `@tanstack/react-virtual` 3.14.13 is used for virtualization.
- Facts (updated 2026-09-24): only the `Datagrid` component carries `@deprecated` (runtime details point to tanstack-carbon); its 20 exported `use*` hooks carry no marker but serve only Datagrid. Issue #4977 (react-table v8) was closed 2024-11-25 as not_planned; no successor grid ships in ibm-products 2.99.0. tanstack-carbon's `react/` folder holds about 23 patterns (batch actions, filter panel and flyout, nested rows, editable cells, sticky columns, resizing, virtual and more), scaffoldable with the `generate-pattern` CLI. [V-verify row 6b](../research/round2/V-verify.md), [E-templates-patterns](../research/round2/E-templates-patterns.md)

### D8 Carbon v12 timing
- Stay on v11 defaults until v12 GA: no preview risk; one larger migration later, date unknown.
- Adopt selected `enable-v12-*` flags now: staged migration; preview APIs and some flags without codemods.
- Use IBM Products for components migrating to core: available today; they move packages at v12 (16 components).
- Facts: `enable-v12-release` does not expose the migrated components; IBM Products peers `@carbon/react ^1.115.0`; v12 in Preview since 2023-05-25.
- Facts (updated 2026-09-24): milestone targets v12-alpha 2026-10-31, v12-rc.0 2026-11-12, v12-beta 2026-12-31, v12-stable 2027-03-31 (not commitments; release-schedule.md still TBD). Full v12 needs the React `<FeatureFlags enableV12Release>` AND a Sass build with `enable-v12-release: true`; precompiled `styles.min.css` stays v11-styled. The root flag also restyles form fields (rounded, fully bordered text-input and list-box), not documented in `docs/migration/v12.md`. Peer caps: ibm-products `@carbon/react ^1.115.0` excludes 2.x; `@carbon/ai-chat` requires `@carbon/web-components <3.0.0`. Options and mapping: `scope.md` section 1. [V-verify rows 2b, 2c, 4a, 8b, 10h](../research/round2/V-verify.md)

### D9 Brand: typeface and brand colours
- Keep IBM Plex: supported, CDN or self-hosted; Afframe looks typographically like Carbon.
- Replace the typeface via Sass: brand typography; build-time only, full `$font-families` map, font-metric QA across components, discouraged by IBM.
- Brand colours via custom theme maps or `$fallback` extension: supported path; each custom token must be defined for every theme.
- Facts: self-subset Plex is an OFL Modified Version that cannot be called "Plex"; Plex files stay under OFL-1.1; "IBM Plex®" is an IBM trademark; runtime font override is unsupported.

### D10 Storybook and docs hosting and visibility
- Public Storybook: easy for consumer repos and agents; reveals every story, including unreleased work.
- Access-controlled Storybook: hides unreleased work; hosting-side auth to set up (options not researched).
- Storybook Composition with Carbon's public Storybooks: one browse surface; not documented by Carbon.
- Docs in `afframe/docs` (Mintlify) vs in-repo: Mintlify matches the platform docs site; component docs split from stories.
- Facts: Carbon publishes Storybooks per package and `llms.txt`; `@carbon/storybook-addon-theme` is reusable; Carbon MCP is gated for non-IBMers.

### D11 Test stack
- Storybook-based interaction and a11y tests: tests live with stories; axe-based results can differ from Equal Access.
- `accessibility-checker` (Equal Access) in CI: same engine as Carbon's CI; separate setup, and Carbon uses a reduced ruleset.
- Playwright e2e plus a11y (Carbon's `avt` pattern): real-browser coverage; heavier CI.
- Visual regression per theme: catches theme drift; tool not identified in Carbon (unverified).
- Facts: Carbon's a11y claim is checklist-based ("based on WCAG AA") with WCAG 2.1 AA stated for contrast; four themes to cover.

### D12 Where private (non-public) project docs live
- Git-ignored folder in the public repo (current `.context/` via `.git/info/exclude`): local and simple; per-clone only, not backed up, easy to lose or leak with a changed ignore file.
- Private companion repo: versioned and access-controlled; one more repo to keep in sync.
- Private docs space outside Git: no leak path through commits; separate from code history.
- Facts: the repo is public under PolyForm NC; secret scanning covers secrets, not business information; `claude-code-review.yml` loads a plugin marketplace from a public git URL.

## 13. Open questions

Still unverified after both verification passes.
- Official carbondesignsystem.com statement on Next.js App Router or RSC; first `@carbon/react` version with `"use client"`.
- Current SSR guidance for `@carbon/web-components` and its React wrappers; current React/WC parity matrix.
- Whether the v11 Figma library uses variable modes for themes.
- Whether `accessibility-checker` 4.0.34 implements IBM checklist 7.3 / WCAG 2.2 rules; Carbon's CI denylist contents; Carbon's visual-regression tool, if any.
- `@carbon/vue` `carbon11` branch release plan; Charts `next` to `latest` promotion plan for Vue, Angular, Svelte.
- Full re-check of every inventory date against `npm view <pkg> time` (only 8 sampled by verification; this document uses `latest_published` throughout).
- Whether `sass` is an optional peer of `@carbon/react`; `@carbon/styles` `sideEffects` for `.css`.
- Current severity of the historic Sass compile-time and tree-shaking issues on 1.117.0.
- High-contrast theme designation; a separate component-token layer; completeness of `@carbon/themes` DTCG output; push-to-figma scope.
- Carbon Labs graduation policy; AI label guideline content; `@carbon/agentic-renderer`, `@carbon/element-styles`, `@carbon/echarts-*` and `@carbon/react-native` beyond npm metadata.
- `carbon-platform` production status; Storybook versions used by Carbon; whether Carbon endorses Storybook Composition.
- Licence of `tanstack-carbon` example code (none reported by GitHub).
- GitHub Packages: whether inherited permissions must be removed before granting Actions access; whether public packages need an explicit grant; the consumer job `permissions:` key.
- npm trusted publishing for restricted/private packages; manual `--provenance` on a private package; trusted publishing or provenance on GitHub Packages.
- npm pricing from the live pricing page (403; figures come from docs.npmjs.com).
- GitHub docs contradictions: repository push protection pricing; dependency review on public repos.
- Trademark status of "Carbon"; OFL "primary font name" for a CSS alias of self-subset Plex; legal effect of combining Apache-2.0 and PolyForm NC.
- claude-code-action behaviour when `CLAUDE_CODE_OAUTH_TOKEN` is empty on fork PRs.
- pnpm and yarn handling of git dependencies with `prepare`.
- Versions, licences and capabilities of the build, release and scanning tools named in sections 8 and 10.
- Claude Design `/design-sync` mechanics.

## 14. Sources

### Inventory and method
- `docs/research/sources/round1/00-inventory.json` (npm registry via `npm view`, GitHub REST `orgs/carbon-design-system/repos`, 2026-09-23)
- https://registry.npmjs.org/@carbon/react · https://registry.npmjs.org/@carbon/ibm-products · https://registry.npmjs.org/@carbon/vue · https://registry.npmjs.org/@carbon/charts-vue · https://registry.npmjs.org/@carbon/ibmdotcom-react · https://registry.npmjs.org/@carbon/import-once · https://registry.npmjs.org/carbon-components · https://registry.npmjs.org/carbon-addons-iot-react · https://registry.npmjs.org/@tanstack/react-table

### Core (sections 1 to 3)
- https://github.com/carbon-design-system/carbon/blob/main/README.md
- https://github.com/carbon-design-system/carbon/blob/main/docs/package-structure.md
- https://github.com/carbon-design-system/carbon/blob/main/docs/release-schedule.md
- https://github.com/carbon-design-system/carbon/blob/main/docs/guides/versioning.md
- https://github.com/carbon-design-system/carbon/blob/main/docs/feature-flags.md
- https://github.com/carbon-design-system/carbon/blob/main/docs/working-with-v12.md
- https://github.com/carbon-design-system/carbon/blob/main/docs/preview-code.md
- https://github.com/carbon-design-system/carbon/blob/main/docs/guides/sass.md
- https://github.com/carbon-design-system/carbon/blob/main/packages/react/README.md
- https://github.com/carbon-design-system/carbon/blob/main/packages/react/package.json
- https://github.com/carbon-design-system/carbon/blob/main/packages/react/product-migrated-components.mjs
- https://github.com/carbon-design-system/carbon/tree/main/packages/react/src/components
- https://unpkg.com/@carbon/react@1.117.0/es/index.js
- https://github.com/carbon-design-system/carbon/pull/20391 · https://github.com/carbon-design-system/carbon/issues/14458
- https://github.com/carbon-design-system/carbon/issues/18574 · https://github.com/carbon-design-system/carbon/issues/19350

### Frameworks (section 4)
- https://github.com/carbon-design-system/carbon/blob/main/packages/web-components/README.md
- https://github.com/carbon-design-system/carbon-web-components/blob/main/docs/welcome-story-react.mdx (archived repo)
- https://github.com/carbon-design-system/carbon-components-vue/blob/main/README.md
- https://github.com/carbon-design-system/carbon-for-ibm-dotcom/blob/main/README.md
- https://raw.githubusercontent.com/carbon-design-system/carbon-for-ibm-dotcom/main/packages/web-components/README.md
- https://github.com/carbon-design-system/carbon/issues/19931

### Extensions (section 5)
- https://github.com/carbon-design-system/ibm-products/blob/main/packages/ibm-products/package.json
- https://github.com/carbon-design-system/ibm-products/tree/main/packages/ibm-products/src/components
- https://github.com/carbon-design-system/ibm-products/blob/main/docs/guides/COMPONENT_STATUS_DEFINITIONS.md
- https://github.com/carbon-design-system/ibm-products/blob/main/docs/guides/CANARY_MIGRATION_GUIDE.md
- https://unpkg.com/@carbon/ibm-products@2.99.0/es/index.js
- https://ibm-products.carbondesignsystem.com/
- https://github.com/carbon-design-system/tanstack-carbon/blob/main/README.md
- https://github.com/carbon-design-system/tanstack-carbon/blob/main/react/mix-and-match/package.json
- https://tanstack.com/table/latest/docs/framework/react/guide/migrating · https://github.com/TanStack/table/blob/main/docs/framework/react/guide/migrating.md
- https://github.com/carbon-design-system/carbon-charts · https://github.com/carbon-design-system/carbon-charts/blob/main/packages/vue/package.json
- https://github.com/carbon-design-system/carbon-charts/issues/65 · /2054 · /2072 · /2130
- https://github.com/carbon-design-system/carbon-labs/blob/main/README.md
- https://github.com/carbon-design-system/carbon-ai-chat/blob/main/README.md

### Tokens (section 6)
- https://github.com/carbon-design-system/carbon/blob/main/packages/themes/README.md
- https://github.com/carbon-design-system/carbon/blob/main/packages/themes/docs/sass.md
- https://github.com/carbon-design-system/carbon/blob/main/packages/colors/README.md
- https://github.com/carbon-design-system/carbon/blob/main/packages/type/README.md
- https://github.com/carbon-design-system/carbon/blob/main/packages/layout/README.md
- https://github.com/carbon-design-system/carbon/blob/main/packages/grid/README.md
- https://github.com/carbon-design-system/carbon/blob/main/packages/motion/README.md
- https://github.com/carbon-design-system/carbon/blob/main/packages/styles/README.md
- https://github.com/carbon-design-system/carbon/blob/main/packages/styles/scss/_config.scss
- https://github.com/carbon-design-system/carbon/blob/main/packages/styles/scss/_feature-flags.scss
- https://github.com/carbon-design-system/carbon/blob/main/packages/react/src/components/Theme/index.tsx
- https://github.com/carbon-design-system/carbon/tree/main/packages/react/src/components/Layer
- https://github.com/carbon-design-system/carbon/issues/23088 · /23372 · /23255 · https://github.com/carbon-design-system/carbon/pull/23382 · /23384
- https://api.github.com/repos/carbon-design-system/tailwind-preset-carbon · https://www.npmjs.com/package/carbon-tailwind-preset

### Tooling (section 7)
- https://carbondesignsystem.com/designing/kits/figma/
- https://www.figma.com/community/file/1157761560874207208/v11-carbon-design-system
- https://www.figma.com/community/file/1342888187036080999/alpha-carbon-charts-library
- https://medium.com/carbondesign/introducing-figma-variables-and-a-consolidated-all-themes-library-d4893d1b8920 (HTTP 403 on verification)
- https://github.com/carbon-design-system/carbon-for-products-design-kit
- https://github.com/carbon-design-system/carbon/blob/main/packages/web-components/figma.config.json
- https://github.com/carbon-design-system/carbon/issues/17607
- https://github.com/carbon-design-system/gatsby-theme-carbon
- https://carbondesignsystem.com/components/tabs/accessibility/
- https://github.com/carbon-design-system/carbon-website/blob/main/src/pages/guidelines/accessibility/overview.mdx
- https://www.ibm.com/able/requirements/requirements/
- https://github.com/carbon-design-system/carbon/blob/main/config/jest-config-carbon/matchers/toHaveNoACViolations.js
- https://github.com/IBMa/equal-access
- https://carbondesignsystem.com/llms.txt
- https://carbondesignsystem.com/developing/carbon-mcp/overview/ · https://carbondesignsystem.com/developing/carbon-mcp/onboarding-and-setup/ · https://github.com/carbon-design-system/carbon-mcp
- https://github.com/carbon-design-system/carbon/issues/20855
- https://github.com/carbon-design-system/carbon/issues/23373 · /21932 · /17558 · /17753
- https://github.com/carbon-design-system/ibm-products/issues/6353 · /6669 · /9910 · /5659 · /3887

### Distribution (section 8)
- https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry
- https://docs.github.com/en/packages/learn-github-packages/about-permissions-for-github-packages
- https://docs.github.com/en/packages/learn-github-packages/configuring-a-packages-access-control-and-visibility
- https://docs.github.com/en/packages/managing-github-packages-using-github-actions-workflows/publishing-and-installing-a-package-with-github-actions
- https://docs.npmjs.com/trusted-publishers
- https://docs.npmjs.com/generating-provenance-statements
- https://docs.npmjs.com/creating-and-publishing-private-packages
- https://docs.npmjs.com/upgrading-to-a-paid-organization-plan · https://docs.npmjs.com/upgrading-to-a-paid-user-account-plan
- https://docs.npmjs.com/cli/v11/using-npm/scripts

### Legal (section 9)
- https://www.apache.org/licenses/LICENSE-2.0
- https://github.com/carbon-design-system/carbon/blob/main/LICENSE
- https://polyformproject.org/licenses/noncommercial/1.0.0
- https://github.com/IBM/plex/blob/master/LICENSE.txt
- https://www.ibm.com/legal/copyright-trademark

### Security (section 10)
- https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning
- https://docs.github.com/en/code-security/secret-scanning/introduction/about-push-protection
- https://docs.github.com/en/code-security/getting-started/github-security-features
- https://docs.github.com/en/get-started/learning-about-github/about-github-advanced-security
- https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions
- https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#pull_request
- https://docs.github.com/en/actions/reference/workflows-and-actions/workflow-syntax#permissions
- https://github.com/anthropics/claude-code-action/blob/main/docs/security.md
- Repo files: `.github/workflows/claude.yml`, `.github/workflows/claude-code-review.yml`, `LICENSE` (afframe/ui, 2026-09-23)
