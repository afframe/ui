> **Pre-verification draft, kept as evidence.** Claims here were checked afterwards; the verification files (`round1/07a-verify-distribution-legal-security.md`, `round1/07b-verify-carbon.md`) override this file, and the authoritative text is `docs/research/carbon-reference.md` and `docs/research/carbon-catalog.md`.

# 03 · Extensions: IBM Products, Labs, AI, TanStack
Retrieved: 2026-09-23 · Lane: extensions

## Summary (5-10 bullets)

- IBM decided in Nov 2024 to **deprecate Datagrid** (the complex table in `@carbon/ibm-products`) in favor of an example-based integration of **TanStack Table** with core `@carbon/react` `DataTable`. This is documented officially by IBM, not a rumor. Source: `carbon-design-system/tanstack-carbon` README.
- Datagrid's current implementation (`@carbon/ibm-products` v2.99.0) is still built on **`react-table` v7.8.0** (legacy, pre-TanStack), confirmed by `packages/ibm-products/package.json` dependency `"react-table": "^7.8.0"`, plus `react-window` for virtualization — not TanStack Table v8/v9.
- IBM's own guidance: continue using Datagrid short-term (sev1/sev2 bugs only supported, no new features), or adopt the **`tanstack-carbon`** community repo's headless TanStack Table + Carbon `DataTable` styling examples, available for both React and Web Components, including a documented "mix-and-match" path to run Datagrid and TanStack side by side.
- `@carbon/ibm-products` (v2.99.0) uses a **three-tier maturity/export system**: Stable (no prefix), `preview__` (production-ready, minor API changes possible), `previewCandidate__` (feature-complete, undergoing validation); this replaced an older "canary" `pkg.component.*` feature-flag system. Per-component status is not centrally published — it must be inspected via each component's Storybook page / export name.
- **Carbon Labs** (`carbon-design-system/carbon-labs`) is an incubation monorepo of ~28 published `@carbon-labs/*` packages (React, Web Components, and shared utilities), all versioned pre-1.0 (0.x, some `-canary`/`-rc` tags), Apache-2.0 licensed. No documented formal graduation policy from Labs into core Carbon or ibm-products was found (unverified).
- **Carbon for AI** materializes as: the "AI label" design guidance pattern (docs page 404'd at time of retrieval — unverified content), and the separately maintained **`@carbon/ai-chat`** (v1.21.0) + **`@carbon/ai-chat-components`** (v1.11.0) packages from `carbon-design-system/carbon-ai-chat` — an "opinionated but extensible chat application," available as React and Web Components, Apache-2.0, with peer dependency on `@carbon/web-components >=2.54.0 <3.0.0` and React `>=17.0.0 <20.0.0`.
- `carbon-addons-iot-react` (v5.18.2) carries a README warning: "This library no longer has a dedicated development resource maintaining it" and recommends migrating to Carbon v11 — effectively unmaintained despite not being formally `deprecated` on npm.
- `@tanstack/react-table`/`table-core` in the inventory are pinned at **v9.2.4** (MIT) and `@tanstack/react-virtual` at v3.14.13 (MIT); the official `tanstack-carbon` example repo's own `package.json` pins `@tanstack/react-table ^8.20.1` — version skew between the workspace's installed inventory and IBM's reference examples should be checked before use (unverified which major line Afframe should target).

## Packages (from inventory: 00-inventory.json)

| package | version | last publish | license | status | purpose |
|---|---|---|---|---|---|
| @carbon/ibm-products | 2.99.0 | 2026-09-16 | Apache-2.0 | active | React + Web Component library of IBM product patterns (Tearsheet, PageHeader, Datagrid, etc.) on top of @carbon/react |
| @carbon/ibm-products-styles | 2.95.0 | 2026-09-16 | Apache-2.0 | active | Sass/CSS for ibm-products components |
| @carbon/ibm-products-web-components | 0.48.0 | 2026-09-16 | Apache-2.0 | active, pre-1.0 | Web Components variant of ibm-products |
| @carbon/ibm-products-community | 0.13.0 | 2026-08-21 | Apache-2.0 | active, pre-1.0 | Community-contributed ibm-products package |
| @carbon-labs/ai-chat | 0.39.0 | 2026-08-21 | Apache-2.0 | pre-1.0 | Labs AI chat web component (distinct from top-level @carbon/ai-chat) |
| @carbon-labs/ai-extended-button | 0.0.1-rc.0 | 2026-08-21 | Apache-2.0 | pre-1.0 rc | AI-oriented button variant |
| @carbon-labs/ai-feedback | 0.12.0 | 2026-08-21 | Apache-2.0 | pre-1.0 | AI feedback component |
| @carbon-labs/ai-prompt-tuning | 0.1.0 | 2026-08-21 | Apache-2.0 | pre-1.0 | AI prompt-tuning UI |
| @carbon-labs/ai-tag | 0.8.0 | 2026-08-21 | Apache-2.0 | pre-1.0 | AI tag/badge component |
| @carbon-labs/ai-ux-control | 0.0.2-canary.256 | 2026-08-21 | Apache-2.0 | canary | AI UX control primitives |
| @carbon-labs/mdx-components | 0.29.0 | 2026-08-21 | Apache-2.0 | pre-1.0 | MDX doc-site components |
| @carbon-labs/network-graph | 0.9.0 | 2026-08-21 | Apache-2.0 | pre-1.0 | Network graph visualization |
| @carbon-labs/primitives | 0.6.0 | 2026-09-18 | Apache-2.0 | pre-1.0 | Shared design primitives |
| @carbon-labs/react-animated-header | 0.61.0 | 2026-08-25 | Apache-2.0 | pre-1.0 | Animated header |
| @carbon-labs/react-calendar | 0.11.0 | 2026-08-21 | Apache-2.0 | pre-1.0 | Calendar component |
| @carbon-labs/react-date-picker | 0.12.0 | 2026-09-18 | Apache-2.0 | pre-1.0 | Date picker |
| @carbon-labs/react-example-button | 0.18.0 | 2026-08-21 | Apache-2.0 | pre-1.0 scaffold example | Template/example for new Labs components |
| @carbon-labs/react-first-time-orientation | 0.21.0 | 2026-08-21 | Apache-2.0 | pre-1.0 | Onboarding/orientation pattern |
| @carbon-labs/react-plane-stack-3d | 0.10.0 | 2026-09-03 | Apache-2.0 | pre-1.0 | 3D plane-stack visualization |
| @carbon-labs/react-processing | 0.21.0 | 2026-08-21 | Apache-2.0 | pre-1.0 | Processing/loading state UI |
| @carbon-labs/react-registration-flow | 0.2.0 | 2026-08-21 | Apache-2.0 | pre-1.0 | Registration flow pattern |
| @carbon-labs/react-resizer | 0.25.0 | 2026-08-21 | Apache-2.0 | pre-1.0, consumed by @carbon/ibm-products | Resizer primitive (dependency of ibm-products) |
| @carbon-labs/react-split-panel | 0.22.0 | 2026-08-21 | Apache-2.0 | pre-1.0 | Split panel layout |
| @carbon-labs/react-style-picker | 0.27.0 | 2026-09-21 | Apache-2.0 | pre-1.0 | Theming/style picker UI |
| @carbon-labs/react-tag-input | 0.6.0 | 2026-08-21 | Apache-2.0 | pre-1.0 | Tag input control |
| @carbon-labs/react-text-highlighter | 0.23.0 | 2026-08-21 | Apache-2.0 | pre-1.0 | Text highlighting utility |
| @carbon-labs/react-theme-settings | 0.30.0 | 2026-08-21 | Apache-2.0 | pre-1.0 | Theme settings UI |
| @carbon-labs/react-ui-shell | 0.106.0 | 2026-08-21 | Apache-2.0 | pre-1.0 | UI shell (header/nav) components |
| @carbon-labs/react-whats-new | 0.28.0 | 2026-08-21 | Apache-2.0 | pre-1.0 | "What's new" notification pattern |
| @carbon-labs/utilities | 0.28.0 | 2026-08-21 | Apache-2.0 | pre-1.0 | Shared utilities across Labs packages |
| @carbon-labs/vscode-snippets | 0.5.0 | 2026-08-21 | Apache-2.0 | pre-1.0 | VS Code snippets for Labs components |
| @carbon-labs/wc-ai-tag | 0.27.0 | 2026-08-21 | Apache-2.0 | pre-1.0 | Web Component AI tag |
| @carbon-labs/wc-date-picker | 0.16.0 | 2026-09-18 | Apache-2.0 | pre-1.0 | Web Component date picker |
| @carbon-labs/wc-empty-state | 0.22.0 | 2026-08-21 | Apache-2.0 | pre-1.0 | Web Component empty state |
| @carbon-labs/wc-global-header | 0.95.0 | 2026-09-21 | Apache-2.0 | pre-1.0 | Web Component global header |
| @carbon-labs/wc-resizer | 0.5.0 | 2026-08-21 | Apache-2.0 | pre-1.0 | Web Component resizer |
| @carbon-labs/wc-style-picker | 0.36.0 | 2026-08-21 | Apache-2.0 | pre-1.0 | Web Component style picker |
| @carbon-labs/wc-wysiwyg | 0.2.0 | 2026-09-21 | Apache-2.0 | pre-1.0 | Web Component rich text editor |
| @carbon-labs/web-components-example-button | 0.4.1-canary.389 | 2026-08-21 | Apache-2.0 | canary scaffold example | Template/example for new Labs Web Components |
| @carbon/ai-chat | 1.21.0 | 2026-09-21 | Apache-2.0 | active, ≥1.0 | Carbon AI Chat application (React + Web Components) |
| @carbon/ai-chat-components | 1.11.0 | 2026-09-21 | Apache-2.0 | active, ≥1.0 | Individual reusable AI Chat sub-components |
| @carbon/react | 1.117.0 | 2026-09-23 | Apache-2.0 | active | Core Carbon v11 React components incl. DataTable |
| @carbon/styles | 1.116.0 | 2026-09-23 | Apache-2.0 | active | Core Sass foundation |
| @carbon/grid | 11.63.0 | 2026-09-23 | Apache-2.0 | active | Grid system (peer dep of ibm-products) |
| carbon-addons-iot-react | 5.18.2 | 2026-09-01 | Apache-2.0 | **unmaintained** ("no dedicated development resource"), not flagged `deprecated` on npm | Legacy IoT/Maximo component set on Carbon v10-era components |
| @tanstack/react-table | 9.2.4 | 2026-08-28 | MIT | active (installed major differs from IBM's official examples, which pin ^8.20.1) | Headless table logic engine |
| @tanstack/table-core | 9.2.4 | 2026-08-28 | MIT | active | Framework-agnostic core of TanStack Table |
| @tanstack/react-virtual | 3.14.13 | 2026-09-14 | MIT | active | Row/column virtualization for large tables |

## Capabilities

- **IBM Products (`@carbon/ibm-products`) component inventory** (from `packages/ibm-products/src/components/` directory listing on GitHub, main branch): APIKeyModal, AboutModal, ActionBar, ActionSet, AddSelect, BigNumber, BreadcrumbWithOverflow, ButtonMenu, ButtonSetWithOverflow, Card, Carousel, Cascade, Checklist, Coachmark (+ CoachmarkBeacon, CoachmarkButton, CoachmarkFixed, CoachmarkOverlayElement(s), CoachmarkStack), ComboButton, ConditionBuilder, CreateFullPage, CreateInfluencer, CreateModal, CreateSidePanel, CreateTearsheet(+Narrow), DataSpreadsheet, Datagrid, Decorator (+DecoratorBase/DualButton/Link/SingleButton), DelimitedList, DescriptionList, DragAndDrop, EditFullPage, EditInPlace, EditSidePanel, EditTearsheet(+Narrow), EditUpdateCards, EmptyStates, ExportModal, ExpressiveCard, FeatureFlags, FilterPanel, FilterSummary, FullPageError, GetStartedCard, Guidebanner, HTTPErrors, ImportModal, InlineTip, InterstitialScreen, MultiAddSelect, Nav, NonLinearReading, NotificationsPanel, OptionsTile, PageHeader, ProductiveCard, RemoveModal, Saving, ScrollGradient, SearchBar, SidePanel, SimpleHeader, SingleAddSelect, StatusIcon, StatusIndicator, StringFormatter, TagOverflow, TagSet, Tearsheet, Toolbar, TooltipTrigger, TruncatedList, TruncatedText, UserAvatar, UserProfileImage, WebTerminal. (Per-component maturity/prefix not enumerated centrally — verify per component export in the package's `index.ts`/Storybook.) Source: https://github.com/carbon-design-system/ibm-products/tree/main/packages/ibm-products/src/components
- **Maturity/enablement model**: Stable (default export, no prefix, "production-ready, fully reviewed", ≥90% test coverage, breaking changes require a major version), Preview (`preview__` prefix, "production-ready, minor API changes possible", ≥80% coverage), Preview Candidate (`previewCandidate__` prefix, "feature complete, undergoing validation"), and Draft (unexported, in-development). This superseded the older canary `pkg.component.*` feature-flag toggle system; a migration guide exists. Source: https://github.com/carbon-design-system/ibm-products/blob/main/docs/guides/COMPONENT_STATUS_DEFINITIONS.md and CANARY_MIGRATION_GUIDE.md.
- **Peer dependencies of `@carbon/ibm-products` v2.99.0**: `react`/`react-dom` (`^16.8.6 || ^17.0.1 || ^18.2.0 || ^19.0.0`), `react-is`, and `@carbon/grid ^11.61.0`, `@carbon/layout ^11.58.0`, `@carbon/motion ^11.51.0`, `@carbon/react ^1.115.0`, `@carbon/themes ^11.80.0`, `@carbon/type ^11.66.0` — i.e. it requires core Carbon v11 packages directly, not just `@carbon/react`. Source: npm registry metadata / GitHub package.json.
- **Datagrid engine**: `@carbon/ibm-products` v2.99.0's own `dependencies` include `"react-table": "^7.8.0"` and `"react-window": "^1.8.11"` — confirming Datagrid is built on legacy react-table v7 (not TanStack Table v8+) with react-window for virtualization. Source: https://github.com/carbon-design-system/ibm-products/blob/main/packages/ibm-products/package.json
- **Docs / Storybook**: ibm-products Storybook at https://ibm-products.carbondesignsystem.com ; Carbon Labs Storybook at https://labs.carbondesignsystem.com (separate React and Web Components instances); Carbon AI Chat docs at https://chat.carbondesignsystem.com/tag/latest/docs/documents/Overview.html and demo at .../demo/index.html.
- **Official Datagrid → TanStack Table transition plan** (source: https://github.com/carbon-design-system/tanstack-carbon/blob/main/README.md): "Carbon for IBM Products has been investigating TanStack Table... For these reasons, we have decided to transition from building our own custom table component to using an example-based approach with TanStack Table." Timeline: v2.54.0 (Nov 20, 2024) marked Datagrid deprecated in Storybook and published TanStack code examples (React and Web Components); "In v3... reduced to sev 1 only"; "v4 — Datagrid code will be removed entirely" (v3/v4 dates "tbd"). Core `@carbon/react` `DataTable` is explicitly stated to continue being maintained.
- **`tanstack-carbon` repo** (`carbon-design-system/tanstack-carbon`, public, Apache license unclear — check repo) provides ready-made examples for both React and Web Components covering: AI Label, Batch actions, Column resizing, Row actions, Row click, filtering (custom/mixed/no-accordion), localization, virtualization (2,000-row example using `@tanstack/react-virtual`), sticky/pinned columns, editable cells, nested rows/expansion, "mix-and-match" (Datagrid + TanStack side by side). It wraps `@tanstack/react-table` and layers Carbon `DataTable` markup/styles on top — it is explicitly "not a replacement" for `@carbon/react`/`@carbon/web-components` DataTable, since TanStack Table is headless with no UI. Source: repo file listing (README.md, INTEGRATION_GUIDE.md, react/README.md, web-components/README.md).
- **`tanstack-carbon`'s own pinned versions**: `package.json` shows `"@tanstack/react-table": "^8.20.1"` and `"@tanstack/react-virtual": "^3.10.4"` — i.e. IBM's reference examples target TanStack Table v8, while the workspace inventory (00-inventory.json) shows `@tanstack/react-table` resolved at v9.2.4. This is a version mismatch worth resolving before copying IBM's example code verbatim (unverified whether v9 is a compatible drop-in for the v8-authored examples).
- **Carbon Labs** (`carbon-design-system/carbon-labs`): "A community-driven incubation space enabling rapid prototyping, development, and deployment of Carbon-based components." Organized into React packages, Web Components packages, and Shared utilities; individual components are separately versioned/published packages to avoid release bottlenecks. New component contributions are scaffolded via `npx @carbon-labs/create@latest <component-name>`. Source: https://github.com/carbon-design-system/carbon-labs/blob/main/README.md
- **Carbon AI Chat** (`@carbon/ai-chat`, `carbon-design-system/carbon-ai-chat` repo): "an opinionated but extensible chat application that's available as both React and web components." Install via `npm install @carbon/ai-chat`, which bundles both the web component and React versions. `@carbon/ai-chat-components` exposes individual sub-components for building custom Carbon-compliant chat widgets. Peer dependencies: `react`/`react-dom >=17.0.0 <20.0.0`, `@carbon/web-components >=2.54.0 <3.0.0`. Licensed Apache-2.0. Source: https://github.com/carbon-design-system/carbon-ai-chat/blob/main/README.md
- **carbon-addons-iot-react**: npm description carries an explicit warning banner: "This library no longer has a dedicated development resource maintaining it. When you are able to migrate to Carbon v11 we recommend you reference the related component guide." Not marked `deprecated` in npm metadata (deprecated=null), but functionally unmaintained. Repo not archived, last push 2026-09-01. Source: npm registry description field for carbon-addons-iot-react, cross-checked against 00-inventory.json.

## Customization hooks

- IBM Products components accept `className` and standard Carbon prop pass-through patterns consistent with `@carbon/react`; per-component customization is documented per Storybook page (not enumerated here — out of scope to fetch every component's docs in this budget).
- Datagrid is customized via its `useDatagrid()` hook plus a large set of composable extension hooks visible in the repo (`useActionsColumn`, `useColumnOrder`, `useCustomizeColumns`, `useEditableCell`, `useExpandedRow`, `useFiltering`, `useFlexResize`, `useInfiniteScroll`, `useInlineEdit`, `useNestedRows`, `useRowExpander`, `useSelectRows`, `useSortableColumns`, `useStickyColumn`, etc.) — a plugin/hook architecture layered on react-table v7. Source: file listing at https://github.com/carbon-design-system/ibm-products/tree/main/packages/ibm-products/src/components/Datagrid
- TanStack Table integration in `tanstack-carbon` is customized via TanStack's own column-definition API (`accessorKey`/`accessorFn`/`id`, column pinning config, `getFacetedUniqueValues`, custom `filterFn`s) combined with Carbon `DataTable` markup for styling, plus custom hooks in the example lib (`useTableSearch`, `useTableSelection`, `useTableVirtualization`, `useColumnCustomization`, `useRowExpansion`). Source: file contents under `react/community/tanstack-table-carbon/src/lib/` in the tanstack-carbon repo.
- `@carbon-labs/react-resizer` is already a runtime dependency of `@carbon/ibm-products` — Labs packages are not purely experimental sandboxes; at least one has already been pulled into a "stable" downstream package's dependency tree. Source: ibm-products package.json.
- IBM Products ships a `FeatureFlags` component/module and `flags.js` in its published `files` list, suggesting internal feature-flag plumbing beyond the maturity-prefix export system (unverified details of its API within this budget).

## Known gaps, pitfalls, open issues (link issues)

- Datagrid has an actively large open/closed issue backlog (222 issues matched a title search for "Datagrid" in `carbon-design-system/ibm-products` at retrieval time), including unresolved items such as "Datagrid table body goes blank when a global filter is passed to initial state and isFetching state of DataGrid is true" (#5659, open) and "Datagrid: add support for selectable nested rows" (#3887, open). Given the announced deprecation, new feature requests are unlikely to be prioritized. Source: https://github.com/carbon-design-system/ibm-products/issues (search: `Datagrid in:title`).
- No GitHub issue or discussion was found in `carbon-design-system` repos with "tanstack" plus "migration"/"v8" in scope for Datagrid beyond the `tanstack-carbon` README itself — the migration story lives entirely in that one README/repo rather than being cross-linked from issues.
- Version skew: workspace inventory pins `@tanstack/react-table`/`table-core` at v9.2.4 while IBM's own `tanstack-carbon` examples are written against `^8.20.1`. Compatibility of the v9 API surface with IBM's v8-era example code is **unverified**.
- No centrally published table/list of per-component maturity status (stable/preview/previewCandidate) for `@carbon/ibm-products` was found; status must be checked per-component (e.g., via Storybook or the component's export name in `index.ts`). This is a documentation gap, not just a retrieval limitation.
- Carbon Labs has **no documented formal graduation policy** describing criteria/process for moving a Labs package into core Carbon or into `@carbon/ibm-products` — unverified whether one exists informally (e.g., via Slack/office hours) beyond ad hoc adoption (as happened with `@carbon-labs/react-resizer` being consumed by ibm-products).
- The carbondesignsystem.com "AI label" guidance page could not be retrieved (404 at both attempted URLs `/guidelines/ai-label/` and `/guidelines/ai-label/overview/`) — content on AI label purpose/usage is **unverified** from primary source at retrieval time; only secondary evidence (its presence as an example category in `tanstack-carbon`'s README table) was found.
- `carbon-addons-iot-react` risk: actively used but effectively unmaintained per its own README warning; not marked deprecated in npm metadata, so automated deprecation tooling will not flag it.

## Options for Afframe UI (option · consequence, one line each)

- Depend on `@carbon/ibm-products` for ready-made patterns (Tearsheet, PageHeader, SidePanel, etc.) · gains a large pattern library but inherits its maturity-tiered/preview export system and its peer-dependency coupling to specific `@carbon/react`/`@carbon/grid`/`@carbon/themes` version ranges.
- Use Datagrid from `@carbon/ibm-products` for tables · fastest to adopt today, but built on legacy react-table v7 and is officially in deprecation (sev1/sev2-only support, planned removal in a future major version with no committed date).
- Build tables on `@carbon/react` `DataTable` + `@tanstack/react-table` following IBM's `tanstack-carbon` example pattern · aligned with IBM's own stated direction and gets headless flexibility (virtualization via `@tanstack/react-virtual`, resizing, pinning), but requires assembling/maintaining the integration layer in-house (IBM ships it as copy-paste examples, not an installable package) and requires resolving the v8-vs-v9 TanStack version question.
- Adopt select `@carbon-labs/*` packages directly · access to newer/experimental patterns (AI tag, style picker, resizer, date picker, etc.) but all are pre-1.0/canary with no SemVer stability guarantee and no documented graduation timeline into core.
- Depend on `@carbon/ai-chat` for chat UI needs · turnkey, actively maintained (Apache-2.0, React ≥17 and Web Components), but is its own opinionated application shell rather than a set of composable primitives (use `@carbon/ai-chat-components` if only sub-components are wanted).
- Avoid `carbon-addons-iot-react` for new work · its own README states it lacks a dedicated maintainer and points teams to migrate to Carbon v11 equivalents instead.

## Open questions (could not verify)

- Whether `@tanstack/react-table` v9.2.4 (as pinned in the workspace inventory) is compatible with IBM's `tanstack-carbon` example code, which targets `^8.20.1` — not verified in this pass.
- Full content of the carbondesignsystem.com "AI label" guidance page (both attempted URLs returned 404 at retrieval time).
- Whether Carbon Labs has any formal, documented graduation criteria/process for promoting a package to core Carbon or `@carbon/ibm-products` (none found in the Labs README, AGENTS.md, or create-tool README).
- Full per-component maturity/status matrix for `@carbon/ibm-products` v2.99.0 (stable vs. preview vs. previewCandidate vs. draft) — not centrally published; would require checking each component's Storybook/export individually.
- Release cadence for `@carbon/ibm-products` and `carbon-labs` packages — no explicit cadence documented; observed publish timestamps in the inventory suggest frequent (near-weekly) releases but this is inferred, not stated.
- Exact license of the `carbon-design-system/tanstack-carbon` repository (README content retrieved; LICENSE file not checked in this pass).

## Sources (URL · what it supports)

- docs/research/sources/round1/00-inventory.json · ground truth for package versions, licenses, deprecation flags, last-publish dates, peerDependencies, and GitHub repo archived/pushed_at status (queried via jq).
- https://github.com/carbon-design-system/ibm-products/blob/main/packages/ibm-products/package.json · confirms Datagrid's `react-table ^7.8.0` and `react-window ^1.8.11` dependencies, and full peerDependencies list.
- https://github.com/carbon-design-system/ibm-products/blob/main/docs/guides/COMPONENT_STATUS_DEFINITIONS.md · defines Draft/Preview Candidate/Preview/Stable maturity tiers and export prefixes.
- https://github.com/carbon-design-system/ibm-products/blob/main/docs/guides/CANARY_MIGRATION_GUIDE.md · documents migration from legacy canary `pkg.component.*` flags to prefix-based exports.
- https://github.com/carbon-design-system/ibm-products/tree/main/packages/ibm-products/src/components · full list of component folders in the current main branch.
- https://github.com/carbon-design-system/ibm-products/tree/main/packages/ibm-products/src/components/Datagrid · Datagrid's file structure showing its extensive hook-based extension API.
- https://ibm-products.carbondesignsystem.com/ · IBM Products Storybook (docs/discovery site; component-level maturity not extractable via fetch at time of retrieval).
- https://github.com/carbon-design-system/tanstack-carbon/blob/main/README.md · primary source for the official Datagrid-to-TanStack-Table deprecation plan, timeline (v2.54.0/v3/v4), and rationale.
- https://github.com/carbon-design-system/tanstack-carbon (react/README.md, web-components/README.md, package.json, and example source files under react/community/tanstack-table-carbon/) · catalog of TanStack+Carbon example patterns (AI Label, column resizing, virtualization, row actions, filtering, localization, pinning, editable cells) and pinned TanStack versions (`^8.20.1`, `@tanstack/react-virtual ^3.10.4`).
- https://github.com/carbon-design-system/carbon-labs/blob/main/README.md · Carbon Labs purpose statement, package catalog (React/Web Components/Shared), Storybook links, contribution/scaffolding process via `@carbon-labs/create`.
- https://github.com/carbon-design-system/carbon-ai-chat/blob/main/README.md · `@carbon/ai-chat` description, install instructions, docs/demo links, `@carbon/ai-chat-components` relationship, license.
- npm registry description field for `carbon-addons-iot-react` (via 00-inventory.json) · "no longer has a dedicated development resource maintaining it" warning and Carbon v11 migration recommendation.
- GitHub code search (`mcp__github-personal__search_code`, query `org:carbon-design-system tanstack`) · discovered the `tanstack-carbon` repository and its example file structure.
- GitHub issue search (`mcp__github-personal__search_issues`, query `repo:carbon-design-system/ibm-products Datagrid in:title`) · 222 total matches, used to characterize Datagrid's open-issue volume.
