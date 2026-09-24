# Afframe UI: Goals

**Status:** v0.2 · **Date:** 2026-09-24 · **Owner:** Hleb Tkachenko
**Companion:** `research/carbon-reference.md` (what IBM Carbon provides, with sources)

**Markers:** see `README.md`. Every decision and its status lives only in section 6.

---

## 1. Vision

Afframe UI is the single source of truth for how every Afframe product looks, reads and behaves. It is the most complete IBM Carbon setup we can build: Carbon core, the extensions we need, and Afframe's own improvements, shipped as one versioned package that any Afframe repo installs and trusts.

- `[H]` The platform is built across several repos, not one app, so UI must be importable as a package.
- `[H]` afframe/ui is that package.
- `[H]` IBM Carbon Design System is the foundation.
- `[H]` React is the implementation (D1).
- `[H]` The latest Carbon: whichever of v11 latest or v12 preview is most recent and offers the most.
- `[H]` Everything we need from the carbon-design-system org (core, IBM Products, Labs, extensions, patterns, examples) and nothing we don't.
- `[H]` What we keep, we improve: prebuilt pages, sections, blocks and templates on top of Carbon.
- `[H]` 2026-09-24: "Full v12 implementation from day one, except if it breaks some component we need."
  - `[P]` Reading: `enable-v12-release` and every `enable-v12-*` flag on in React and in the Sass build from the first commit; v12 pre-releases (alpha, beta) may be used as soon as they are published (D17: "we can use all carbon we want and how we want"), and IBM Products' own peer cap is overridden when it lags (the override lives in each consumer repo, `consumption.md` section 3); a component stays on v11 behaviour only when v12 demonstrably breaks a component we need, documented case by case. How the components moving from IBM Products into core (17 since 2026-09-24) are used on day one: `scope.md` S15. Verified v12 surface and known breakages: `scope.md` section 1.5.
- `[H]` 2026-09-24: "Labs is mandatory. If they are web-components only, then in our version we need rebuild or adaptation with dependencies." And: "If something overlaps with Labs, and Labs are not React, then we better use what overlaps than rebuild Labs to React for this component."
  - `[P]` Reading: every live Labs package is in, except `@carbon-labs/react-style-picker` (I42), out because it cannot be installed (`[H]` 2026-09-24, "2 - c"; I41 covers theme choice). For a web-components-only Labs package: if an included React component covers it, use that; if it covers it partly, use it and list the gap under Improve; if nothing covers it, wrap or rebuild it in React. Per-package treatment: `scope.md` section 2.6.
- `[H]` Round-3 scope rulings: section 6, S14 to S20.
- `[H]` 2026-09-24: full native v12 look as IBM ships it (rounded corners, full-border fields). Afframe visual changes (for example corner radius) come later, after all components work on native v12. Evidence that the look is adjustable later: `research/sources/round3/S-sass-check.md` (radius tokens set to 0 compile and render square).
- `[H]` Every optional item and every new page, section, block or template is approved by Hleb one by one; building new is the last milestone.
- `[H]` The remote repo is the source of truth: work is saved by pushing a PR. `docs/` holds permanent documents; `docs/plans/` holds temporary files that future agents need to continue, deleted when done.
- `[P]` "Ultimate setup" means: a consumer repo gets a correct, themed, accessible, tested Carbon experience by installing one package and following one short guide.

## 2. Context

- Repos in the afframe org today: `afframe/afframe` (web apps, empty), `afframe/docs` (Mintlify docs site), `afframe/framework`. Which of them will consume afframe/ui is unconfirmed.
- Design sources Hleb already has: the Carbon Figma kit, the IBM Products Figma kit, and a Carbon design-system project in Claude Design.
- Repo `afframe/ui` is public on GitHub, licensed PolyForm Noncommercial 1.0.0: source-available, not open source.

## 3. Goals

### A. Package and consumption

- `[H]` Importable as a package by every Afframe repo.
- `[P]` One install, one documented entry point for styles/theme, typed imports for components.
- `[P]` Semantic versioning, a changelog per release, and a migration guide for every breaking change (changelog after the full build, D16).
- `[P]` Consumers never need to configure Carbon themselves (Sass paths, prefixes, fonts, feature flags): Afframe UI does it once.
- `[P]` A reference consumer app inside the repo that installs the built package the way a real consumer would, used as a CI smoke test.
- `[P]` Works with server-side rendering if the chosen consumer framework uses it.

### B. Carbon foundation, complete

- `[H]` Include everything from original Carbon that our stack needs.
- `[H]` Include extensions: IBM Products, TanStack tables.
- `[P]` Also evaluate: Carbon Charts, Carbon for AI (AI label, `@carbon/ai-chat`), Carbon icons and pictograms, selected Carbon Labs packages.
- `[P]` Build on Carbon, don't fork it: compose and override through tokens and wrappers; fork a component only when unavoidable, and document why.
- `[P]` Stay current: automated update PRs for Carbon's frequent releases, gated by visual and a11y tests.
- `[P]` A written plan for Carbon v12 (in preview upstream) so we don't build on something that's about to move.
- `[P]` Table strategy aligned with upstream: IBM has deprecated the IBM Products Datagrid in favour of TanStack Table + Carbon DataTable styles.

### C. Improved components and patterns

- `[H]` Improved components on top of Carbon.
- `[P]` An Afframe component layer: Carbon components wrapped with Afframe defaults, cleaner APIs, and complete TypeScript types (upstream types are partial).
- `[P]` A first-class data grid: TanStack Table with Carbon styling (sorting, filtering, column pinning and resizing, virtualization, server-side data, row selection, export).
- `[P]` Business-platform components Carbon lacks or only partly covers: amount/currency input and display, locale-aware number and date formatting, date-range presets, KPI/stat tiles (partly covered by IBM Products BigNumber, previewCandidate), status and workflow badges (partly covered by preview IconIndicator/ShapeIndicator), audit trail/timeline, approval flows.
- `[P]` AI and agent UI patterns: AI label on generated content, agent activity and progress, human-in-the-loop review/approve, chat.
- `[P]` Page templates: app shell (UI Shell), list/detail, forms, settings, dashboards, empty/error/loading states.

### D. Tokens, styles and rules

- `[H]` Everything runs on tokens.
- `[H]` Styles and rules are part of the package.
- `[P]` Three token tiers: Carbon base tokens, Afframe semantic tokens, component tokens. No raw colour, size or spacing values in components.
- `[P]` One token source that generates every output we need (for example CSS custom properties, Sass, TypeScript, Figma variables). Upstream Carbon is moving to W3C DTCG + Style Dictionary, so there's room to align.
- `[P]` Themes: light and dark at minimum, runtime switching, theme zones for mixed surfaces, an Afframe brand theme.
- `[P]` Enforced rules, not just documented ones: lint for tokens-only styling, lint for correct Carbon imports, a11y lint.
- `[P]` Written usage rules: layout, spacing, content and voice, do/don't per component.

### E. Quality and testing

- `[H]` Everything must be tested.
- `[P]` Test layers: unit, interaction (per story), automated accessibility (axe and IBM Equal Access), visual regression across every theme, SSR render smoke test, public API/type tests, bundle-size budgets.
- `[P]` An explicit accessibility target (WCAG version and level to be set), checked in CI, not only by hand. Carbon's components follow the IBM Accessibility Checklist ("based on WCAG AA", no version stated); Carbon cites WCAG 2.1 AA only for colour contrast.
- `[P]` A definition of done for every component (section 5).

### F. Storybook and documentation

- `[H]` Storybook.
- `[H]` Documentation.
- `[P]` Storybook is both the workbench and the living reference: every component, variant, state and theme; a11y panel; controls; interaction tests.
- `[P]` Per-component docs in Carbon's shape: usage, style, code, accessibility.
- `[P]` Architecture decision records for every non-obvious choice, plus changelog and migration guides.
- `[P]` Agent-ready docs: `llms.txt`-style index and machine-readable component metadata so coding agents in consumer repos use Afframe UI correctly (Carbon publishes `llms.txt`; its MCP server is a gated public preview).

### G. Design-tool parity

- `[P]` Figma and code say the same thing: Figma variables mapped to Afframe tokens; Figma Code Connect linking Figma components to Afframe components.
- `[P]` The Claude Design design-system project is synced from this package (Claude Code `/design-sync`), so AI-generated designs use Afframe components, not generic Carbon ones.
- `[P]` Drift detection: a check that flags when Figma, Claude Design and code tokens diverge.

### H. Security, secrets and information control

- `[H]` The repo is public: control secrets, leaks and information.
- `[H]` Not open source: protect the work.
- `[H]` Use GitHub Actions secrets and variables (and environments) for anything sensitive.
- `[P]` Layered secret defence: GitHub secret scanning and push protection, a local pre-commit scanner, and the same scanner in CI.
- `[P]` Supply-chain hygiene: CodeQL, automated dependency updates, actions pinned by SHA, least-privilege workflow permissions, publishing without long-lived tokens (OIDC trusted publishing is documented for npmjs.com only; automatic provenance needs a public repo and a public package).
- IBM Telemetry: D13.
- `[P]` Branch rulesets on `main`: PR required, checks required, no force-push.
- `[P]` Information control beyond secrets: no business plans, client names or internal URLs in code, commits, issues, PRs or public deploys; internal docs live outside the public repo; access-controlled Storybook and docs deploys if they reveal unreleased work.
- `[P]` Review the two existing `claude-code-action` workflows for public-repo safety (who can trigger them, fork PRs).
- `[P]` License compliance: keep Carbon's Apache-2.0 notices, a third-party license inventory, trademark-safe naming (no "IBM"/"Carbon" in our product names unless allowed).

### I. Developer experience

- `[P]` One command to install, one to run Storybook, one to run the full gate.
- `[P]` Tree-shakable output, typed public API, clear deprecation warnings, codemods for breaking changes.
- `[P]` Repo instructions for humans and agents (`CLAUDE.md`, `ARCHITECTURE.md`).

### J. Governance

- `[P]` Versioning, deprecation and release policy written down.
- `[P]` A request path for consumer repos: propose a component, report a gap, get it into the roadmap.
- `[P]` Performance budgets per component and per entry point.
- `[P]` Localization-ready: every string overridable, locale-aware formatting, at least the languages the platform ships in.

## 4. Non-goals `[P]`

- Not a fork of Carbon.
- Not a general-purpose public component library for outside users.
- Not a replacement for product-specific UI inside consumer repos: only shared, reusable UI lives here.

## 5. Definition of done per component `[P]`

1. Built on Carbon (or documented reason not to), tokens only.
2. Typed public API, no `any` in exports.
3. Stories for every variant, state and theme.
4. Unit and interaction tests pass.
5. Automated a11y checks pass; keyboard and screen-reader behaviour documented.
6. Visual baselines in every theme.
7. Docs: usage, style, code, accessibility.
8. Figma link (Code Connect) where a Figma component exists.
9. Changelog entry.

## 6. Decisions

The single register of decisions and their status. Other documents give detail but do not state status. Markers are defined in `README.md`. All rulings are dated 2026-09-24 unless noted. Options and consequences: `research/carbon-reference.md` section 12 and `plans/open-decisions.md`.

| # | Decision | Status and outcome | Fact that matters most |
|---|---|---|---|
| D1 | Framework target: React only, Web Components, or both | `[H]` React only | Only React and Web Components are core-maintained; `@carbon/ai-chat` peers `@carbon/web-components` even in React apps |
| D2 | Package distribution to consumer repos | `[A]` GitHub Packages (npm registry) ("d2 is ok") | Install needs a token: consumer repos use `GITHUB_TOKEN` in Actions after a per-repo "Manage Actions access" grant; developers need a classic PAT with `read:packages`. A new package is private by default and does not inherit the repo's visibility (GitHub docs). To confirm at setup: the exact grant steps and what inherited read access means for a public repo |
| D3 | Repo shape: one package or a multi-package workspace | `[H]` one package, not a monorepo ("what is the easyest to maintain, i think a"; "we are not doing monorepo"). Open: repo structure and import paths, researched in round 6 ("I need to reseach how to strucutre repo for design system so it is working, can pull udates from carbon and be used in our way") | The repo still holds Storybook and a reference consumer app. Fact: a monorepo can also publish installable packages (Carbon is a monorepo that publishes `@carbon/react`) |
| D4 | Language, build tool and output format | `[A]` ("Accept.") TypeScript (copied Carbon JS via `allowJs`); ESM only; Carbon never bundled (`react`, `@carbon/react` 1.117.0, `@carbon/ibm-products` 2.99.0 exact peers; Labs, TanStack, charts, ai-chat exact dependencies); tsdown like Carbon's build; `'use client'` client entries plus `./server` | `research/sources/round4/V4-recommendation.md` section 3; consumer setup in `consumption.md` |
| D5 | Style delivery: Sass source, compiled CSS, or both | `[A]` ("Accept.") compiled native v12 CSS only (`@afframe/ui/styles.css`), IBM Plex fonts inside the package, prefixes `cds`/`c4p`; the native look itself is `[H]`. Themes: `[H]` 2026-09-24 only `light` and `dark` from day one, because v12 ships only those two ("3 - b"); `[P]` built from today's `g10` (light) and `g100` (dark), the pair Carbon's own light-dark example uses | `V4-recommendation.md` section 4; v12 themes: `scope.md` section 1.6 |
| D6 | Token source of truth and pipeline | `[H]` ("4 - a") Carbon's tokens as they are, Afframe overrides in the Sass theme | Figma kept in sync by hand |
| D7 | Table engine and TanStack version | `[P]` TanStack Table v9 with Carbon DataTable styling. Hleb set the test ("what is more powerfull and fits"); Claude picked v9 against it, and Hleb has not ruled on the pick | v9: faster row models, lower memory, cell selection and spanning, richer pinning/resizing/selection, React Compiler support; ESM only, React 18+; IBM's v8 examples need porting (markup unchanged; `useLegacyTable` shim exists). Source: TanStack/table docs/framework/react/guide/migrating.md |
| D8 | Carbon v12 timing | `[H]` "Full v12 implementation from day one, except if it breaks some component we need." `[P]` the reading in section 1 | v12-alpha target 2026-10-31, stable 2027-03-31; the 17 migrated components are not in published `@carbon/react` yet; upstream changes to watch: `scope.md` section 1.6 |
| D9 | Brand: typeface and brand colours | Deferred `[H]`: native v12 look (IBM Plex, Carbon colours) until all components work; brand changes come after that | Radius-to-0 proof on record in `research/sources/round3/S-sass-check.md` |
| D10 | Storybook and docs hosting and visibility | `[H]` Storybook is deployed only on the Afframe dev server, not public, so Hleb and the team can see it; consumer repos do not need it (review ruling F10). Storybook carries the component docs inside it, the docs page first for each component, as Carbon's Storybook does ("7 - c for Storybook and b for Docs"; "storybook must carry docs inside it like carbon design storybook does"). The package also carries its docs ("1 - both", 2026-09-24). `docs/` in afframe/ui holds extra clarifications, ADRs, patterns and similar ("we can have docs/ in afframe/ui with extra clarifications, adrs, patterns and so on") `[H]` 2026-09-24: full coverage: docs, understanding, agent docs, examples, patterns and use cases; Storybook covers every variation; everything Carbon has, nothing lost, plus Afframe's extras ("we need full carbon shit, no lost and extra above") | The earlier answer "c" was no hosting; F10 replaced it with the dev-server deploy |
| D11 | Test stack | `[H]` Carbon's native stack, run on PRs only for the parts that changed ("what is nativ shiped, lets do this"); visual tests are our own screenshots with Playwright in CI, baselines committed, not Chromatic ("playwright?", then "all other ok"). `[P]` the tool list: Prettier format check, ESLint + Stylelint, Jest + Testing Library unit tests, Playwright accessibility tests with IBM `accessibility-checker` against the built Storybook. `[H]` 2026-09-24: full test coverage inside this repo, and nothing test-related ships to consumer repos ("we must ensure that we are not overflowing repos who is importing our design system with undesessary tests and data. but here we must be fully done") | Source: carbon `package.json` scripts and `.github/workflows/ci.yml` |
| D12 | Where project docs live | `[H]` in this repo: `docs/` permanent (including clarifications, ADRs and patterns, D10), `docs/plans/` temporary (deleted when done), saved through PRs | The repo is public, so everything in `docs/` is publicly readable |
| D13 | IBM Telemetry | `[H]` off, in afframe/ui and in every consumer repo ("switch off. dont want to share data with them"). `[P]` mechanism: `IBM_TELEMETRY_DISABLED=true` in every CI job and container build, plus `allowBuilds` set to `false` for each instrumented package under pnpm (`consumption.md` sections 2 and 3) | Almost every Carbon package in the plan (every `@carbon/*` package, `@ibm/plex`, `stylelint-plugin-carbon-tokens`, most Labs packages) runs `ibmtelemetry` as a `postinstall` script. It reports repo, dependency, JSX and JS usage data to IBM when the install runs in CI or inside a container. Nothing ships in the runtime bundle. Evidence: `research/sources/round5/U-upstream-sweep.md` section 4 |
| D14 | Carbon upgrades in afframe/ui | `[H]` after v1.0.0 (D16): on a regular schedule plus on demand; every release approved by Hleb, never automatic ("b and c combined ... manualy approve release, not auto"). `[P]` Dependabot opens the update PRs | `consumption.md` section 4 |
| D15 | Updating consumer repos | `[H]` Dependabot in each consumer monorepo ("4 - a"), grouping `@afframe/ui` with its Carbon peers | `consumption.md` section 4 |
| D16 | Versioning and changelog tool | `[H]` 2026-09-24: the first release is v1.0.0, when the build is finished; the release process and changelog are created after that, and every later update raises the version ("Releases and Changelog will be created after we finish with this. we are building now v1.0.0 of the @afframe/ui . then each update will bring us up."). Commit history until then | Semantic versions from v1.0.0 |
| D17 | Pre-releases | `[H]` `@afframe/ui` ships only normal latest versions, no preview or release-candidate versions ("only latest always"); inside, any Carbon version may be used, including v12 pre-releases ("we can use all carbon we want and how we want") | `consumption.md` section 4 |
| D18 | Licence | `[H]` PolyForm Noncommercial governs ("resolved in readme"; "we still guided by our licence"); Carbon's Apache-2.0 licence is kept in `third-party/carbon/LICENSE` for the Carbon-derived parts | Outside PRs: Hleb closes them ("this is not your concern, i will just close PR from outside peoples") |
| D19 | Versions | `[H]` 2026-09-24: the latest of everything ("I want all altest, latest react and etc. make sure"); version table in `consumption.md` section 2 | React 19.3.0 is latest; every planned Carbon, Labs, TanStack and Storybook package accepts React 19 (npm peers, checked 2026-09-24) |

### Scope decisions (S)

Detail in `scope.md`.

| # | Decision | Status and outcome | Related |
|---|---|---|---|
| S1 | v11 vs v12 preview | Same as D8. | D8 |
| S2 | Style delivery given v12 | Same as D5. | D5 |
| S3 | Table engine | Same as D7. | D7 |
| S4 | tanstack-carbon license | `[H]` reuse IBM's tanstack-carbon examples. Hleb: "tanstack oficial repos is licenced, same as IBM and this connector described as part of their research under Apache 2 licenced Carbon Design system = its open for us." Attribution goes with Carbon's Apache-2.0 licence (`third-party/carbon/LICENSE`). Fact on record: the tanstack-carbon repo has no LICENSE file of its own; one of its 40 package.json files declares MIT | D7 |
| S5 | Preview policy | `[H]` ("9 - a") allow `preview__` and `previewCandidate__` |  |
| S6 | Which `preview__PageHeader` | `[H]` IBM Products' `preview__PageHeader` (option b), confirmed after the Storybook review; at v12 it moves into core and Afframe's wrapper switches the imports (`docs/research/sources/round3/P-pageheader.md`) |  |
| S7 | Chat | `[H]` include `@carbon/ai-chat` (O9). `[P]` rule: never render a `<feature-flags>` element above it (`scope.md` section 1.5) | D1 |
| S8 | Labs adoption policy | `[H]` Labs is mandatory; WC-only Labs use an overlapping React component where one exists, otherwise wrap or rebuild. `[P]` the per-package reading (section 1; `scope.md` sections 2.5, 2.6) |  |
| S9 | App shell | `[H]` ("11 - b") core UI Shell plus the Labs `react-ui-shell` extensions |  |
| S10 | Onboarding generation | `[H]` ("12 - a") both: Coachmark for contextual tips, Labs first-time orientation for first run |  |
| S11 | Marketing sections | `[H]` ("13 - b") out (`scope.md` section 6.4 is out of scope) |  |
| S12 | stylelint plugin license | `[H]` ("14 - a") use `stylelint-plugin-carbon-tokens` now |  |
| S13 | Package shape for extras (charts, tables, chat) | Same as D3. | D3 |
| S14 | Rich-text editor (`wc-wysiwyg`) | `[H]` not needed. `wc-wysiwyg` is out (X12). |  |
| S15 | The components moving from IBM Products into core, on day one (16 when Hleb ruled; 17 since PageHeader joined on 2026-09-24, see S6) | `[H]` copy Carbon's v12 source of these components from carbon `main` into Afframe UI (option b). Consequences: v12 versions from day one; Afframe maintains and re-syncs the copy until v12 ships, then switches to core imports; Apache-2.0 section 4 applies (keep LICENSE and notices, mark modified files); Tearsheet pulls 5 of them (Tearsheet, SidePanel, ActionSet, Resizer, TruncatedText; counted before PageHeader joined). Review 2026-09-24: the copies also import Carbon internals (for example `usePrefix`, `usePresence`, `useCollapsible`, `FeatureFlags`) that `@carbon/react` 1.117.0 does not export publicly; copying those can create a second React context, and then a copied component silently misses `AfframeProvider`'s v12 flags. Hleb accepted the extra cost: "this is ok, if it is working at the end." Acceptance check: each copied component imports Carbon internals only through public `@carbon/react` exports or copies that share Carbon's context, and a test proves it sees the provider's v12 flags. Work item M19. | D8 |
| S16 | Resizer beyond a single handle (`wc-resizer` partial) | `[H]` 2026-09-24 ("5 - b", replacing the earlier pick to wrap `wc-resizer`): use only `@carbon-labs/react-resizer` (I9), a single resize handle, until Labs updates `wc-resizer`. Reason: `wc-resizer` 0.5.0 pulls `@carbon-labs/utilities` 0.21.0, which peers React 18 at most, so npm installs a second React 18 copy under it and pnpm with strict peers fails. Grid, panels and the 2D corner handle wait for that update. |  |
| S17 | Empty states under v12 (IBM Products EmptyState family removed at v12, #22473) | `[H]` keep IBM Products EmptyState (I23) until the v12 major, then migrate (option a). | D8 |
| S18 | DataTable toolbar menu under v12 (#23260) | `[H]` keep v12 (option a): use the workaround (`MenuItem` children in `TableToolbarMenu`, or `OverflowMenu`/`MenuButton` in `TableToolbarContent`); verify it in the phase-1 visual gate. |  |
| S19 | Two copies of one date picker (O3 core copy and I38 Labs copy, same code) | `[H]` Afframe components use the Labs copy, `@carbon-labs/react-date-picker` (I38) (option b); Afframe supplies the `Temporal` polyfill (M20). `preview__DatePicker` stays available in `@carbon/react` but Afframe components do not use it. |  |
| S20 | `@carbon-labs/react-plane-stack-3d` (React 18 peer only) | `[H]` out (X12). |  |

## 7. Phases `[P]`

| Phase | Outcome |
|---|---|
| 0 | Research, goals, open decisions settled |
| 1 | Foundation: repo tooling, security baseline, token pipeline, build and publish, Storybook, CI gate, reference consumer |
| 2 | Core: Carbon components wrapped and themed, first docs |
| 3 | Extensions: data grid, IBM Products patterns, charts, AI |
| 4 | Design-tool parity: Figma, Code Connect, Claude Design sync |
| 5 | Build new (last milestone `[H]`): pages, sections, blocks and templates, each approved by Hleb before it is built |
