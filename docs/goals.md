# Afframe UI: Goals

**Status:** v0.2 · **Date:** 2026-09-24 · **Owner:** Hleb Tkachenko
**Companion:** `carbon-reference.md` (what IBM Carbon provides, with sources)

**Legend:** `[H]` stated by Hleb · `[P]` proposed by Claude, for Hleb to accept or reject item by item.
Stack choices live under "Open decisions", not in the goals; decided ones are marked with their date.

---

## 1. Vision

Afframe UI is the single source of truth for how every Afframe product looks, reads and behaves. It is the most complete IBM Carbon setup we can build: Carbon core, the extensions we need, and Afframe's own improvements, shipped as one versioned package that any Afframe repo installs and trusts.

- `[H]` The platform is built across several repos, not one app, so UI must be importable as a package.
- `[H]` afframe/ui is that package.
- `[H]` IBM Carbon Design System is the foundation.
- `[H]` React is the implementation (D1 decided 2026-09-24).
- `[H]` The latest Carbon: whichever of v11 latest or v12 preview is most recent and offers the most.
- `[H]` Everything we need from the carbon-design-system org (core, IBM Products, Labs, extensions, patterns, examples) and nothing we don't.
- `[H]` What we keep, we improve: prebuilt pages, sections, blocks and templates on top of Carbon.
- `[H]` 2026-09-24: "Full v12 implementation from day one, except if it breaks some component we need."
  - `[P]` Reading: `enable-v12-release` and every `enable-v12-*` flag on in React and in the Sass build from the first commit; v12 pre-releases (alpha, beta) adopted as soon as they are published; peer-range caps are install friction, not breakage; a component stays on v11 behaviour only when v12 demonstrably breaks a component we need, documented case by case. How the 16 components moving from IBM Products into core are used on day one: `scope.md` S15 (pending). Verified v12 surface and known breakages: `scope.md` section 1.5.
- `[H]` 2026-09-24: "Labs is mandatory. If they are web-components only, then in our version we need rebuild or adaptation with dependencies." And: "If something overlaps with Labs, and Labs are not React, then we better use what overlaps than rebuild Labs to React for this component."
  - `[P]` Reading: every live Labs package is in. For a web-components-only Labs package: if an included React component covers it, use that; if it covers it partly, use it and list the gap under Improve; if nothing covers it, wrap or rebuild it in React. Per-package treatment: `scope.md` section 2.6.
- `[H]` 2026-09-24 round-3 decisions (`scope.md` section 7): S14 no rich-text editor; S15 copy Carbon's v12 code for the 16 components moving into core; S16 wrap the Labs resizer web component; S17 keep IBM Products EmptyState until v12, then migrate; S18 keep v12 in the DataTable toolbar (workaround); S19 Afframe components use the Labs date picker; S20 plane-stack-3d out; where a component keeps the v11 look, force v12 where possible (`scope.md` 1.5).
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
- `[P]` Semantic versioning, a changelog per release, and a migration guide for every breaking change.
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
- `[P]` A decision on IBM Telemetry, which `@carbon/react` embeds and enables by default (opt-out), for Afframe UI and its consumers.
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

## 6. Open decisions (options, no pick yet)

Options and consequences in carbon-reference.md section 12. Rows marked Decided are settled; the rest are open.

| # | Decision | Options | Fact that matters most |
|---|---|---|---|
| D1 | Framework target: React only, Web Components, or both | **Decided 2026-09-24: React** | Only React and Web Components are core-maintained; `@carbon/ai-chat` peers `@carbon/web-components` even in React apps |
| D2 | Package distribution to consumer repos | **Decided 2026-09-24:** GitHub Packages (npm registry) | Install needs a token: consumer repos use `GITHUB_TOKEN` in Actions after a per-repo "Manage Actions access" grant; developers need a classic PAT with `read:packages`. To confirm at setup: whether a package from a public repo can stay private, and the exact grant steps |
| D3 | Repo shape: one package or a multi-package workspace | **Decided 2026-09-24:** one package (easiest to maintain); separate import paths inside it for heavy extras are an implementation detail | The repo still holds Storybook and a reference consumer app |
| D4 | Language, build tool and output format | ESM-only / dual ESM+CJS / Carbon as peer / Carbon bundled | Bundling Carbon into `dist` redistributes it and triggers Apache-2.0 §4; TanStack v9 is ESM-only |
| D5 | Style delivery: Sass source, compiled CSS, or both | Sass source / compiled CSS / both | The v12 decision (D8) requires a Sass build: precompiled Carbon CSS is v11-styled. Font replacement and `$prefix` also work only in the Sass path; compiled Carbon CSS triggers Apache-2.0 §4 |
| D6 | Token source of truth and pipeline | **Decided 2026-09-24:** Carbon's tokens as they are, Afframe overrides in the Sass theme | Figma kept in sync by hand |
| D7 | Table engine and TanStack version | **Decided 2026-09-24:** TanStack Table v9 with Carbon DataTable styling (Hleb asked for the more powerful option that fits) | v9: faster row models, lower memory, cell selection and spanning, richer pinning/resizing/selection, React Compiler support; ESM only, React 18+; IBM's v8 examples need porting (markup unchanged; `useLegacyTable` shim exists). Source: TanStack/table docs/framework/react/guide/migrating.md |
| D8 | Carbon v12 timing | **Decided 2026-09-24:** full v12 implementation from day one, except where it breaks a component we need (section 1) | v12-alpha target 2026-10-31, stable 2027-03-31; the 16 migrated components are not in published `@carbon/react` yet |
| D9 | Brand: typeface and brand colours | keep IBM Plex / replace via Sass / custom theme maps | Font swap is build-time only and discouraged; a self-subset Plex cannot be named "Plex" · Note 2026-09-24: native v12 look for now; brand changes come after all components work |
| D10 | Storybook and docs hosting and visibility | **Decided 2026-09-24:** Storybook not hosted (local and CI only); component docs inside Storybook, the docs page first for each component, as Carbon does | |
| D11 | Test stack | **Decided 2026-09-24:** Carbon's native stack, run on PRs only for the parts that changed (path filters, as Carbon's CI does): Prettier format check, ESLint + Stylelint, Jest + Testing Library unit tests, Playwright accessibility tests with IBM `accessibility-checker` against the built Storybook, visual regression. Carbon uses Chromatic (a hosted service) for visual tests: account and cost need Hleb's go | Source: carbon `package.json` scripts and `.github/workflows/ci.yml` |
| D12 | Where project docs live | **Decided 2026-09-24:** in this repo: `docs/` permanent, `docs/plans/` temporary (deleted when done), saved through PRs | The repo is public, so everything in `docs/` is publicly readable |

## 7. Phases `[P]`

| Phase | Outcome |
|---|---|
| 0 | Research, goals, open decisions settled |
| 1 | Foundation: repo tooling, security baseline, token pipeline, build and publish, Storybook, CI gate, reference consumer |
| 2 | Core: Carbon components wrapped and themed, first docs |
| 3 | Extensions: data grid, IBM Products patterns, charts, AI |
| 4 | Design-tool parity: Figma, Code Connect, Claude Design sync |
| 5 | Build new (last milestone `[H]`): pages, sections, blocks and templates, each approved by Hleb before it is built |
