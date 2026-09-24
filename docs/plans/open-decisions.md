# Open decisions (temporary)

Explanations and options for every decision still open on 2026-09-24. **Decided the same day:** 1 (one package), 4 (a), 5 (TanStack v9), 6 (reuse IBM's examples), 7 (Storybook not hosted; docs inside Storybook, first page per component), 8 (Carbon's native test stack, path-filtered; Chromatic pending), 9 (a), 11 (b), 12 (a), 13 (b), 14 (a). **Still open:** 2 (build output), 3 (style delivery), 10 (PageHeader, code comparison in progress), Chromatic account for visual tests. Delete this file when all are decided; the outcomes live in `docs/goals.md` and `docs/scope.md`.

Already decided and relevant here: React only; native v12 look for now; GitHub Packages for distribution; Carbon v12 code copied for the 16 migrating components (S15), which means Apache-2.0 notices ship with our package whatever is chosen below.

## 1. Repo shape (D3, S13)
What: does afframe/ui publish one package or several (for example tokens, components, tables, charts, chat)?
- a. One package: consumers install one thing; one version for everything; heavy extras (charts, tables, chat) come along unless marked optional.
- b. One package with separate entry points (`@afframe/ui`, `@afframe/ui/tables`, `@afframe/ui/charts`): one install and one version; extras load only when imported.
- c. Several packages in one repo: independent versions and lighter installs; needs workspace and release tooling, and each package is published separately.
Fact: the repo will hold Storybook and a reference consumer app anyway, so it is a multi-project workspace in every option.

## 2. Build output (D4)
What: the language, the JavaScript format we ship, and whether Carbon is inside our package.
- Language: a. TypeScript (typed API for consumers; Carbon's own types are incomplete) / b. JavaScript with JSDoc types / c. JavaScript without types.
- Format: a. ESM only (modern; TanStack v9 is ESM only; CommonJS-only tools cannot load it) / b. ESM + CommonJS (works everywhere; two builds).
- Carbon: a. peer dependency (consumers install `@carbon/react` and friends next to ours; no duplicate copies) / b. bundled inside ours (one install; risk of two Carbon copies when a consumer also uses Carbon directly).
- Build tool (Vite library mode, tsup/tsdown, Rollup, Rslib): not researched; it changes our build only. a. decide now / b. phase 1 evaluates and proposes.

Deep research (2026-09-24, `docs/research/sources/round4/V4-recommendation.md` section 3), recommendation: TypeScript (copied Carbon JS compiled as is with `allowJs`); ESM only (TanStack v9 and ai-chat are already ESM only; consumers on Jest add a `transformIgnorePatterns` allowlist); Carbon never bundled: `react`, `@carbon/react` 1.117.0 and `@carbon/ibm-products` 2.99.0 as exact peers, Labs, TanStack, charts and ai-chat as exact dependencies; tsdown configured like Carbon's own build (Carbon and IBM Products build with tsdown); `'use client'` on client entries plus a server-safe `./server` entry; one `AfframeProvider` that turns on the React v12 flags. Runner-up: dual ESM + CommonJS like Carbon, only if a consumer cannot load ESM.

## 3. Style delivery (D5)
What: how consumers get the CSS. Native v12 needs Carbon's Sass compiled with the v12 flag; IBM's prebuilt CSS is v11.
- a. Sass source: each consumer compiles our Sass (needs Sass in every consumer build); consumers can adjust values at compile time.
- b. Compiled CSS: we compile once with v12 on; consumers import one CSS file; runtime changes only through CSS variables.
- c. Both: most flexible; two paths to keep in sync.

Deep research (2026-09-24, `V4-recommendation.md` section 4), recommendation: ship compiled v12 CSS only (`@afframe/ui/styles.css`, one import at the app root; 1.77 MB, 173 KB gzipped, all four themes); v12 flag baked in by our Sass build; prefixes stay `cds` and `c4p`; IBM Plex fonts shipped inside the package with relative URLs; consumers need no Sass, no `transpilePackages`, no load-path workaround. Runner-up: add an open Sass entry later if a consumer needs compile-time Sass. Shipping Sass alone is not recommended: a consumer configuring Carbon Sass a second time is a hard compile error.

## 4. Token source (D6)
What: where Afframe's design values (colours, spacing, type, radius) are defined, and how code and Figma get them. With the native v12 look, this matters mostly when Afframe visual changes start.
- a. Carbon's tokens as they are, Afframe overrides in the Sass theme: least work; Figma kept in sync by hand.
- b. Own token files (W3C DTCG format) generating CSS, Sass, TypeScript and Figma variables: one source for code and Figma; more tooling; Carbon itself is moving there, partly done.
- c. Figma variables as the source, exported to code: design owns the values; export tooling needed; Carbon's own Figma/code sync is not automated.
- d. CSS variables only: simplest contract for consumers; no Sass-level or Figma sync.

## 5. Table engine (D7, S3)
What: the engine behind Afframe data tables (sorting, filtering, pinning, resizing, virtual scrolling). IBM's Datagrid is deprecated and excluded.
- a. TanStack Table v8 with Carbon DataTable styling: IBM's ~23 example patterns fit as written; v9 upgrade later.
- b. TanStack Table v9 with Carbon DataTable styling: current version; IBM's examples must be ported (renamed hooks, new setup, React 18+).
- c. Carbon DataTable only: maintained by Carbon; no engine for virtual scrolling, pinning or column resizing.

## 6. IBM's TanStack examples licence (S4)
What: the repo `tanstack-carbon` has no licence, which legally means no permission to copy its code.
- a. Ask IBM to add a licence, then reuse the code: fastest if they answer; timing unknown.
- b. Write our own tables from TanStack and Carbon docs, using IBM's examples only to see behaviour and look: more work; clean ownership.

## 7. Storybook and docs (D10)
What: where the component browser (Storybook) and component docs live, and who can see them. The repo is public, so code and stories are readable anyway.
- Storybook: a. public site (anyone, including AI agents in other repos) / b. behind a login (hides unreleased work; hosting and auth to set up) / c. no hosting (run locally and in CI only).
- Docs: a. in `afframe/docs` (Mintlify, one site for the platform) / b. inside Storybook (docs next to live examples) / c. both (Storybook for components, Mintlify for guides).

## 8. Test stack (D11), pick any combination
What: which kinds of tests run on every PR. Goal `[H]`: everything tested.
- a. Interaction tests in Storybook: every story doubles as a test.
- b. Accessibility checks: axe (Storybook addon) and/or IBM Equal Access (the checker Carbon uses) in CI.
- c. Visual tests: screenshots of every story in every theme compared on each PR; this is also the v12 breakage gate.
- d. End-to-end tests in real browsers (Playwright) on the reference consumer app.
Each layer adds CI time.

## 9. Preview components (S5)
What: Carbon marks new components `preview__` (close to stable) or `previewCandidate__` (earlier); their APIs can change in minor releases. Your picks O11, O14, O15, O16 already use both levels.
- a. Allow both levels: keeps your picks.
- b. `preview__` only: drops the previewCandidate picks (ConditionBuilder, Toolbar, SearchBar, Guidebanner and others).
- c. Stable only: also drops PageHeader, IconIndicator, BigNumber, TruncatedText.

## 10. PageHeader (S6)
What: two different page headers exist. Carbon core's `preview__PageHeader` has 14 parts; IBM Products' `preview__PageHeader` has 24 (adds breadcrumb overflow, breadcrumb page actions, scroll button, tag overflow, title breadcrumb). Different code.
- a. Core's: part of Carbon core; fewer features.
- b. IBM Products': more features; lives in IBM Products.
- c. Core's, plus the missing parts built by Afframe.
Code comparison (2026-09-24, `docs/research/sources/round3/P-pageheader.md`):
- Core's `preview__PageHeader` is marked deprecated in its own source (carbon #21926): development warnings, no removal date; last changed 2026-05-12.
- Carbon is moving the IBM Products PageHeader into core for v12 (#22929, PR #23209, approved, not merged). Core's current name will keep pointing at the old deprecated code.
- IBM Products': 24 exports vs 14, collapse on scroll, sticky tab bar, breadcrumb and tag overflow; 91 tests vs 46; last changed 2026-09-02; already uses the v12 overflow menu.
- Neither is touched by a v12 flag. At v12, the IBM Products one moves to core: new import names and `c4p` to `cds` CSS classes, handled inside Afframe's wrapper.
- Option c means about 1,000 to 1,200 lines of TypeScript, 350 lines of styles and tests, drifting from what Carbon ships.

## 11. App shell (S9)
What: Carbon core UI Shell (header, side nav, panels, switcher) is the base. Labs `react-ui-shell` extends it (enhanced side nav with flyout menus, profile, trial countdown, header popover); both are included. Which one Afframe's app-shell template uses:
- a. Core only: stable; fewer features.
- b. Core plus Labs extensions: richer; Labs is 0.x, so its API can change.

## 12. Onboarding (S10)
What: Coachmark shows contextual tips attached to specific UI elements; Labs first-time orientation is an introduction for first-time users. Both are included; which ones Afframe's onboarding templates use:
- a. Both: Coachmark for contextual tips, orientation for first run.
- b. Coachmark only.
- c. First-time orientation only.

## 13. Marketing sections (S11)
What: ibm.com-style page blocks for public websites (hero, call-to-action, card and feature sections, pricing tables, footers). They exist only as web components, so they would be built new in React (last milestone, each approved).
- a. In scope, for the platform's public websites.
- b. Out: Afframe UI covers the application only.

## 14. Token lint plugin (S12)
What: `stylelint-plugin-carbon-tokens` flags raw colours and spacing in our styles and auto-fixes them to tokens. Its licence note is inconsistent (MIT in the package, Apache-2.0 in the file; both permissive). It is a development tool and does not ship to consumers.
- a. Use it now.
- b. Use it after the maintainers fix the licence note.
- c. Write our own lint rules.
