> **Pre-verification draft, kept as evidence.** Claims here were checked afterwards; the verification file (`round3/V3-verify.md`) overrides this file, and the authoritative text is `docs/scope.md` and `docs/research/carbon-catalog.md`.

# W · v12 from day one
Retrieved: 2026-09-24

## Summary

"Full v12 implementation from day one" has one installable meaning today: `@carbon/react` 1.117.0 with `<FeatureFlags enableV12Release>` plus a Sass build compiled with `$feature-flags: ('enable-v12-release': true)` (option B in V-verify/scope.md section 1). No v12 package exists on npm (no 2.x, no alpha tag; confirmed again 2026-09-24). `docs/migration/v12.md` and `feature-flags.yml` on carbon@main describe exactly the same v12 surface already captured in V-verify: root flag `enable-v12-release` cascades to 7 sub-flags: 6 literally prefixed `enable-v12-*`, plus `enable-focus-wrap-without-sentinels`, which carbon@main `FeatureFlagScope.ts` lists by name as an exception ("Flags that carry v12 behavior without the `enable-v12-` prefix. The prefix is the convention, but some flags were named before it settled.") - plus two independent flags that do NOT cascade (`enable-dialog-element`, `enable-treeview-controllable` - both O2 items already decided) and two O2 non-v12 flags (`enable-enhanced-file-uploader`, `enable-presence`). None of `preview__Dialog`, `preview__Card`, `preview_Layout`, `preview_Text`, `preview__PageHeader`, or `preview_Pagination`/`preview_PageSelector` are switched on, replaced, or even mentioned by `enable-v12-release` or `docs/migration/v12.md` - they are independent PDLC-preview exports, not v12. `preview__DatePicker` is the one exception: it is explicitly named as the v12 date picker in `docs/migration/v12.md:34`, and carbon's own milestone item "Graduate Labs DatePicker to Core" (#22427, open) confirms the plan to make this preview DatePicker's internals the v12 default, with the explicit note "This doesn't actually have a hard dependency on v12" and "There should be full backwards compatibility (sans the flatpickr props/functionality)". `preview_OverflowMenuV2` is a deprecated wrapper, not a v12 replacement (V-verify row 10a); the real v12 path is stable `OverflowMenu` + `enable-v12-overflowmenu`.

One concrete breakage surfaced, confirmed in installed source, not just an issue title. DataTable's own `TableToolbarAction` (installed `@carbon/react` 1.117.0, `es/components/DataTable/TableToolbarAction.js`) is a thin wrapper that renders `OverflowMenuItem` unconditionally, and DataTable's documented pattern is to pass `<TableToolbarAction>` children into `<TableToolbarMenu>`. `TableToolbarMenu.js` (same package) forwards `children` straight into the flag-switching `OverflowMenu` component unchanged, so the break is specifically that `TableToolbarAction`'s hardcoded `OverflowMenuItem` was not updated to the `MenuItem`/`MenuItemDivider` composition v12 requires - a consumer who bypasses the `TableToolbarAction` helper and passes `MenuItem`/`MenuItemDivider` directly into `TableToolbarMenu` should work under v12 today, since `TableToolbarMenu` itself has no hardcoded composition. Carbon's own issue #23260 confirms the consequence for the documented/typical usage: turning on `enable-v12-overflowmenu` "broke the datatable overflow menu instances" (Suggested Severity: High/Sev 2, open). The linked "fix" PR #23259 (75 files) does not actually change `TableToolbarAction`'s composition; it only touches `OverflowMenu.stories.js` and a `data-table-action` Sass radius partial, so as of 2026-09-24 the underlying break in the helper component is not fixed on carbon@main.

A similar `OverflowMenu`/`OverflowMenuItem` v11-composition pattern exists inside the installed `@carbon/ibm-products` 2.99.0 in `ActionBar/ActionBarOverflowItems.js`, `Datagrid/useActionsColumn.js`, and `ComboButton/ComboButton.js`, all of which `import { OverflowMenu, OverflowMenuItem } from "@carbon/react"`. However, none of these three is a component Afframe UI includes: ibm-products' `Datagrid` and `ComboButton` are both explicitly named as deprecated/excluded in `scope.md` (X2: "Deprecated ibm-products ... incl. Datagrid ... ComboButton (ibm-products)"; I7 uses `@tanstack/react-table` instead, I10 uses `@carbon/react`'s own `ComboButton`), and `ActionBar` is tagged "default-off canary ... reference" in `carbon-catalog.md:234`, not a decided include. So this pattern does not currently establish a breakage in a component Afframe UI needs; it is noted only because the same failure mode exists in code Afframe UI would not use.

Second, `carbon-ai-chat` issue #2308 is a real, measured breakage - "every overflow menu in the chat stops opening" was reproduced and the full 609-test suite still passed - but it is not a "day one" breakage under Afframe turning on its own React/Sass v12 flags. The chat's overflow menus are Web Components (`cds-overflow-menu` etc. from `@carbon/web-components`), and Carbon's WC flag propagation is a DOM-attribute/element scope-walk, separate from React's context-based `<FeatureFlags>`. The ai-chat team had to add its own `<feature-flags enable-v12-release>` custom element into the chat's DOM (above its host, spanning both its shadow-DOM and light-DOM trees) purely to reproduce the bug; nothing in Afframe wrapping its own React tree in `<FeatureFlags enableV12Release>` would, by itself, add that element inside `@carbon/ai-chat`'s internal DOM. The issue itself confirms this design: the fix "lands with the alpha, on `integration/v2.0.0`... They don't land behind a flag on `main`: a Carbon major can't ship to 1.x consumers," i.e., the break is scoped to ai-chat's own future 2.0.0/Carbon-3.0.0-alpha upgrade on its own timeline, not something today's 1.x ai-chat package exposes when Afframe enables v12 flags in its own build.

No open issue carries a `type: bug 🐛` label together with `version: 12` in carbon-design-system/carbon except #23260 itself and #13096 ("Multiselect: The implementation confuses/mislabel the title, label" - a11y-labelled and included-component-relevant since MultiSelect is I11, but not shown to be caused by the v12 flag surface examined here). The 135 `version: 12`-labelled issues are almost entirely design-intent/spec/epic work, not bug reports.

A counter-finding worth noting alongside the DataTable break: several ibm-products 2.99.0 components already self-scope their internal `OverflowMenu` usage in a local `<FeatureFlags enableV12Overflowmenu>` (or `enableV12DynamicFloatingStyles`) wrapper, independent of any app-level flag setting - found in `AddSelect/AddSelectSort.js`, `AddSelect/AddSelectColumn.js`, `Card/Card.js`, `PageHeader/next/PageHeaderBreadcrumbPageActions.js` (i.e. `preview__PageHeader`), and `BreadcrumbWithOverflow/BreadcrumbWithOverflow.js`. This suggests these specific internal `OverflowMenu` call sites are already written against v12 composition and are not expected to break the way `TableToolbarAction` does - though whether their *children* (the menu items each one renders) use the old `OverflowMenuItem` or new `MenuItem` shape was not individually checked this session.

## Day-one v12 surface (table)

| Item | What changes | How enabled | Default in v12? | Source |
|---|---|---|---|---|
| `enable-v12-release` | Root flag; when on, every `enable-v12-*` sub-flag reads as enabled (JS via `FeatureFlagScope.ts`, Sass via `enabled(...)`) | React `<FeatureFlags enableV12Release>` AND Sass `$feature-flags` map (both required; confirmed V row 2c) | n/a (this is the switch) | `feature-flags.yml`; `working-with-v12.md:28-45` |
| `enable-v12-tile-default-icons` / `enable-v12-tile-radio-icons` | ClickableTile trailing icon, RadioTile radio icons | sub-flag (cascades from root) | yes | `docs/migration/v12.md` |
| `enable-v12-overflowmenu` | OverflowMenu becomes Menu-based (`MenuItem`/`MenuItemDivider` instead of `OverflowMenuItem`) | sub-flag | yes | `docs/migration/v12.md` |
| `enable-v12-structured-list-visible-icons` | StructuredList selection icons always visible, `selection` prop | sub-flag | yes | `docs/migration/v12.md` |
| `enable-v12-dynamic-floating-styles` | ComboBox, Dropdown, MultiSelect, MenuButton, ComboButton, OverflowMenu, Popover/Tooltip/Toggletip get fixed-position Floating UI styles even when `autoAlign` is false | sub-flag | yes | `docs/migration/v12.md` |
| `enable-v12-toggle-reduced-label-spacing` | Toggle label-to-control spacing `$spacing-05` -> `$spacing-03` | sub-flag (Sass only, no React API change) | yes | `docs/migration/v12.md` |
| `enable-focus-wrap-without-sentinels` | New focus-wrap behavior that does not use sentinel nodes | cascaded by `enable-v12-release` even though its name does not carry the `enable-v12-` prefix: `packages/feature-flags/src/FeatureFlagScope.ts` (carbon@main, fetched 2026-09-24) defines `isV12Flag` as `name.startsWith('enable-v12-') OR unprefixedV12Flags.has(name)`, and `unprefixedV12Flags = new Set(['enable-focus-wrap-without-sentinels'])`, with the comment "Flags that carry v12 behavior without the `enable-v12-` prefix. The prefix is the convention, but some flags were named before it settled." | yes (cascaded, exception to the naming convention) | `FeatureFlagScope.ts` (carbon@main, fetched 2026-09-24) |
| Root-only Sass changes: Popover/Toggletip/Tooltip radius + no caret, Menu radius, Tag radius (no more pill), ProgressBar radius/animation | Styling only, read directly off `enable-v12-release`, no dedicated sub-flag | root flag only | yes | `docs/migration/v12.md`; V row 2b |
| Root-only JS: label/decorator placement validation | Dev warnings become dev errors when content is interactive inside `label`/`legend`/sortable header | root flag only | yes | `docs/migration/v12.md` |
| Undocumented form-field restyle (text-input, list-box/ComboBox/Dropdown/MultiSelect rounded corners + full border; also select, number-input, search, date-picker, fluid-* gated by grep) | Styling | root flag only, Sass | yes, but absent from `docs/migration/v12.md` | V row 2b (still not corrected in carbon@main as of 2026-09-24: `working-with-v12.md` and `v12-migration.md` fetched today contain none of these fields) |
| `enable-dialog-element` | Modal and ComposedModal switch to native `<dialog>` | independent flag; the `enable-v12-release` cascade only auto-enables flags whose name starts with the literal prefix `enable-v12-` (`working-with-v12.md:33-34`), and `enable-dialog-element` does not match that prefix, so it stays off unless set explicitly | independent - Hleb already included this under O2 | `feature-flags.yml`; `working-with-v12.md:33-34`; V row 5g |
| `enable-treeview-controllable` | TreeView controllable API | independent flag | independent - O7/O2 already decided | `feature-flags.yml` |
| `enable-enhanced-file-uploader`, `enable-presence` | FileUploader callback/event surface; components stay mounted while closed | independent flags, non-v12 | independent - O2 already included | `feature-flags.yml` |
| `unstable_Pagination`/`preview_Pagination`, `unstable_PageSelector`/`preview_PageSelector` removal | These preview exports are deleted in the v12 major; stable `Pagination` gains the built-in page-select control | no flag - a removal that happens at the v12 major, not something `enable-v12-release` does in 1.117.0 | yes (as a removal) | `docs/migration/v12.md` ("React Pagination preview APIs"); matches V fact 8 |
| 16 IBM Products components (Tearsheet, SidePanel, etc.) | Excluded from published JS/`.d.ts` regardless of flags; only ship once "the next major release" happens | none - not flag-gated, glob-excluded at build time | becomes available in v12, not before | `product-migrated-components.mjs:34-62` (fetched 2026-09-24, unchanged from V-verify) |

## Preview exports vs v12 (table) and the O3-O6 verdicts

| Export | v12 default / replaces / independent | Evidence |
|---|---|---|
| `preview__DatePicker` | v12 default, but not switched on by `enable-v12-release` in 1.117.0 - it is a separately-named export, not a behavior gated by the flag, so "v12 DatePicker on day one" means explicitly importing `preview__DatePicker` rather than the stable `DatePicker`. It is the v12 date picker referenced by name in `docs/migration/v12.md:34` ("This reaches consumers through the preview v12 date picker"), built on `@carbon/utilities/date-picker` (Temporal API, V row 5f). Milestone issue #22427 "Graduate Labs DatePicker to Core" (open, in v12-stable #104) states the plan to graduate "the DatePicker refactor that we have in labs" to core, with full backward compatibility, adding "This doesn't actually have a hard dependency on `v12`". Whether `preview__DatePicker` is literally that Labs refactor's code, or a separate implementation with the same design intent, is unverified: the published `@carbon-labs/react-date-picker` (I38) package's dependencies (`classnames`, `@ibm/telemetry-js`, `@carbon-labs/primitives` - checked via `npm view`) do not include `@carbon/utilities`, so its current published form does not obviously match `preview__DatePicker`'s architecture. | `v12-migration.md:34`; `gh api repos/carbon-design-system/carbon/issues/22427`; `npm view @carbon-labs/react-date-picker dependencies` |
| `preview__Dialog` | Independent preview, not v12. Renders a native `<dialog>` unconditionally; never reads any flag (V row 5g, re-confirmed: no mention in `v12-migration.md` or `working-with-v12.md` fetched 2026-09-24). The v12-relevant native-dialog behavior is `enable-dialog-element`, read by Modal/ComposedModal, not by `preview__Dialog`. | `v12-migration.md` (no "Dialog" section); V row 5g |
| `preview__Card` | Independent preview, not v12. No mention anywhere in `docs/migration/v12.md`; a separate v12 milestone item exists for a web-components Card (`cds-card`, #22996 "implement Card web component", #23180, #23143) and a React "[Card] v12 design intent 1.0 - Code (react)" (#23269, open, in v12-beta), meaning a React Card *is* on the v12 roadmap but is not the same object as the currently-published `preview__Card` (built pre-v12 with no evidence it is what ships). | `v12-migration.md`; milestone_102.txt |
| `preview_Layout` / `preview_Text` | Independent preview, not v12. No occurrence in `v12-migration.md` or `working-with-v12.md`. | grep of both files fetched 2026-09-24: zero matches |
| `preview__PageHeader` | Independent preview, not v12, but on the v12 roadmap as design work: "[Page header] v12 design intent 1.0" (#23438) and "Page Header (Products)" (#23437), both open, in v12-alpha. No confirmation the shipped v12 PageHeader will be the same API as today's `preview__PageHeader`. | `v12-migration.md` (no mention); milestone_101.txt |
| `preview_Pagination`/`preview_PageSelector` | Removed at the v12 major (see table above); not "default", they cease to exist. Stable `Pagination` becomes the v12 way. | `v12-migration.md` "React Pagination preview APIs" |
| OverflowMenu / Menu | v12 default via `enable-v12-overflowmenu`; stable `OverflowMenu` component switches implementation, not a separate preview export. `preview_OverflowMenuV2` is a deprecated wrapper around the same thing, not an independent v12 path. | `v12-migration.md`; V row 10a |

O3-O6 verdicts. O3 is not in BRIEF-R3's "declined" list (that list runs O4/O5/O6) but it is a real scope.md item, and it is exactly the v12/DatePicker question: `docs/scope.md:137` defines **O3 = `preview__DatePicker` (v12 Temporal-based rewrite)**, proposed as "second date picker next to the Labs one (I38)", flagged "under recheck (v12 rule)" with the cost "Temporal polyfill cost; v12-stable graduates the Labs DatePicker". This recheck is now settled by the evidence above: `preview__DatePicker` is confirmed as the v12 default (named in `docs/migration/v12.md:34`, tracked to graduate via #22427 in the v12-stable milestone). So O3 is not an "optional, independently decided" item under a "full v12 from day one" reading - it is the v12 DatePicker itself, and Hleb's v12 rule already resolves it as in-scope (subject only to the same day-one v12 exceptions as everything else, e.g. if it breaks a needed component). scope.md's "second date picker next to the Labs one" framing (O3 as an addition alongside `@carbon-labs/react-date-picker`, I38) is the pre-verification framing; post-verification, O3 is not a separate opt-in choice but a consequence of the v12 decision.

- **O4 (`preview__Dialog`)**: independent preview, not a v12 default. Declining it does not conflict with "full v12 from day one" - v12 does not include or require `preview__Dialog`; the v12-relevant native-dialog behavior lives in `enable-dialog-element` on Modal/ComposedModal, which Hleb already included via O2.
- **O5 (`preview__Card`)**: independent preview, not a v12 default today. A v12-roadmap React Card exists as open design/dev work (#23269) but is not confirmed to be `preview__Card`'s successor or the same component; declining today's `preview__Card` does not decline a v12 default.
- **O6 (`preview_Layout`/`preview_Text`)**: independent previews, no v12 mention at all in either migration doc. Declining them has no interaction with the v12 decision.

## Milestone contents (grouped)

Source: `gh api repos/carbon-design-system/carbon/issues?milestone=<N>&state=all` for 101 (v12-alpha, due 2026-10-31, 49 issues fetched), 102 (v12-beta, due 2026-12-31, 18 issues), 103 (v12-rc.0, due 2026-11-12, 10 issues), 104 (v12-stable, due 2027-03-31, 6 issues), fetched 2026-09-24.

All titles and states below are the complete `gh api repos/carbon-design-system/carbon/issues?milestone=<N>&state=all` output fetched 2026-09-24 (counts match V-verify fact 9 exactly: alpha 28 open/21 closed, beta 13 open/5 closed, rc.0 10 open/0 closed, stable 5 open/1 closed).

**v12-alpha (#101, due 2026-10-31, 49 issues: 28 open, 21 closed):**

New/visual-design work per component (design-intent, mostly closed):
| # | State | Title |
|---|---|---|
| 22911 | closed | [Tooltip] v12 design intent 1.0 (rounded corners, sans caret) - Code |
| 22910 | closed | [Toggletip] v12 design intent 1.0 (rounded corners, sans caret) - Code |
| 22909 | closed | [Popoever] v12 design intent 1.0 (rounded corners, sans caret) - Code |
| 22908 | open | [Modal] v12 design intent 1.0 - Code |
| 22907 | closed | [Progress bar] v12 design intent 1.0 - Code |
| 22906 | open | [v12 alpha] UI Shell: Design only, reference directions |
| 22905 | open | [v12 alpha] Tag Set: Rounding corners |
| 22904 | closed | [Tag] v12 design intent 1.0 - Code |
| 22903 | closed | [v12 alpha] Slider: Rounding corners, input styling |
| 22902 | closed | [v12 alpha] Select: Rounding corner, input styling |
| 22901 | closed | [v12 alpha] Search: Rounding corners, input styling |
| 22900 | closed | [v12 alpha] Number Input: Rounding corners, background, styling |
| 22899 | closed | [v12 alpha] Dropdown: Round corners, background, styling, menu |
| 22898 | closed | [v12 alpha] Date Picker / Time Picker: Rounding corners |
| 22897 | closed | [v12 alpha] Text Input: Round corners, bg, styling |
| 22896 | closed | [Menu] v12 Design intent 1.0 - Code |
| 22895 | open | [Button] v12 design intent 1.0 (corner radius) - Code |
| 22894 | open | [v12 alpha] Theming: Light/Dark - Two Themes |
| 22812 | closed | v12 Forms & Inputs style update |
| 23316 | open | [Number input] v12 design intent 2.0 - Code |

Theming/breaking-behavior (token architecture, mostly open):
| # | State | Title |
|---|---|---|
| 23485 | open | [v12] Theming : research on consolidate redundant -01/-02/-03 token variants into single derived rules |
| 23484 | open | [v12] Theming : Add interactive states rules to OKLCH pipeline |
| 23448 | closed | [RFC]: V12 Theme strategy proposal to use runtime aliasing for v11 themes |
| 23429 | open | [dev] build initial V12 OKLCH token generation pipeline (POC) |
| 23334 | open | [Epic]: V12 Contextual Theming with OKLCH |
| 23228 | open | Motion with purpose |
| 22660 | closed | Modernize color systems with OKLCH |

New components (Card web component, AddSelect):
| # | State | Title |
|---|---|---|
| 23180 | open | [`cds-card`]: implement `AILabel` and visual parity follow-up |
| 23170 | open | Migrate AddSelect web component to @carbon/web-components (relevant to O14 AddSelect) |
| 23143 | open | [`cds-card`]: horizontal layout and visual parity follow-up |
| 22996 | open | implement Card web component (`cds-card`) |
| 22912 | open | MVP Components for Private Preview |

Migrations from IBM Products:
| # | State | Title |
|---|---|---|
| 22881 | closed | Migration: Composability audit on components to be migrated |
| 22866 | open | docs(adr): ADR 0007 - Migrate components from carbon-for-ibm-products to Carbon core |
| 22794 | open | Migrate web-components from @carbon/ibm-products-webcomponents to @carbon/web-components |
| 22655 | open | Migrate React components to @carbon/react |
| 22572 | open | Migrate ibm-products components to core |

Removals/docs/tooling/process:
| # | State | Title |
|---|---|---|
| 23338 | closed | [v12 Awareness survey] Announcement |
| 23255 | open | CI check - token parity between src/dtcg/ and figma-exports |
| 23254 | open | GitHub Actions workflow - manual code to Figma token push |
| 23253 | open | Create a script to push to figma variables |
| 23252 | open | Fix token parity |
| 23251 | closed | Fix DTCG schema naming inconsistency - white.json vs g10/g90/g100 |
| 23250 | closed | Investigate sync direction: Figma to Code or Code to Figma |
| 23000 | open | [Epic]: Figma to Code token sync and parity - @carbon/themes |
| 22473 | open | Replace deprecated Empty States pattern with coded examples in Core and Charts |
| 22422 | closed | Remove `es-custom` from `@carbon/web-components` (removal) |
| 22421 | open | Refactor Web Component Package Structure |
| 22382 | open | Release and publish a v12.0.0-rc.0 release candidate |

**v12-beta (#102, due 2026-12-31, 18 issues: 13 open, 5 closed):**
| # | State | Title | Group |
|---|---|---|---|
| 23269 | open | [Card] v12 design intent 1.0 - Code (react) | New component |
| 23260 | open | [Bug]: data table update overflowmenu usage to v12 | Breaking/bug - see Breakages table |
| 23193 | open | Notification | New/design |
| 23190 | closed | Card | New component |
| 23132 | open | Inset/Flush button decision for system wide components | New/design |
| 22990 | open | Motion: Apply motion to primitive components | Breaking/behavior |
| 23131 | open | Inset/Flush button decision for field inputs | New/design |
| 23134 | open | Button variants | New/design |
| 23130 | open | [Options tile and accordion] v12 design exploration | New/design |
| 23135 | open | Shadows (Tribe) | New/design |
| 23133 | closed | [Header actions for Side panel, Modal, Tearsheet] v12 design exploration | New/design |
| 23129 | closed | [Notification] v12 design intent 1.0 & Specs | New/design |
| 23046 | open | v12 Design intent | New/design |
| 22740 | closed | Motion: make new surface tokens DTCG compatible | Breaking/behavior |
| 22461 | open | Deliver v12 Migration Guide | Docs |
| 22415 | closed | Visual Expression: Define token taxonomy and architecture for v12 | Breaking/behavior |
| 22411 | open | Implement Motion Standards | Breaking/behavior |
| 16711 | open | Improve changelogs consumability | Docs/tooling |

**v12-rc.0 (#103, due 2026-11-12, 10 issues, all open):**
| # | State | Title | Group |
|---|---|---|---|
| 23471 | open | [v12]: Align dynamic floating styles / `autoalign` strategy in `@carbon/web-components` and `@carbon/react` | Breaking/infra |
| 23455 | open | Set publish workflow for `next` release branch | Docs/tooling |
| 23451 | open | Expose IBM Products components (`status: blocked`; body: "The migrated components from IBM Products are currently not exported, they are meant to be only exposed in the major release") | Migration, blocked |
| 23053 | open | [Empty States] Dev implementation Core library in WC | New/migration |
| 22783 | open | [Motion]: Setup controller for Web Components | Breaking/behavior |
| 22512 | open | Removal of canary mechanism spike | Removal |
| 20670 | open | [Feature Request]: Custom Element Manifest Generation | Docs/tooling |
| 20479 | open | Use PDLC `preview` status label instead of `experimental`/`unstable` across Storybook docs | Docs/tooling |
| 17765 | open | Move `autoAlign` to stable | Breaking/behavior |
| 15498 | open | Remove function export wrappers | Removal |

**v12-stable (#104, due 2027-03-31, 6 issues: 5 open, 1 closed):**
| # | State | Title | Group |
|---|---|---|---|
| 22820 | open | [custom elements manifest]: replace WCA `custom-elements.json` with Custom Elements Manifest (CEM) | Removal/tooling |
| 22819 | open | [es-custom]: remove `es-custom` build and artifacts | Removal |
| 22818 | open | [registration shims]: remove web components registration shims | Removal |
| 22817 | open | [Web components]: v3 release checklist | Removal/release |
| 22427 | open | Graduate Labs DatePicker to Core | Migration - see DatePicker verdict above (O3) |
| 22398 | closed | Move `ibm-products` code to live within `carbon` monorepo | Migration (done) |

## Breakages affecting included components (table)

| Issue / finding | Component | Breaks a needed component? | Status | Link |
|---|---|---|---|---|
| DataTable's `TableToolbarAction.js` (installed `@carbon/react` 1.117.0) renders `OverflowMenuItem` unconditionally, never updated to `MenuItem`/`MenuItemDivider`; `TableToolbarMenu.js` forwards `children` unchanged into `OverflowMenu` | DataTable's overflow-menu column action pattern, `TableToolbarAction` + `TableToolbarMenu` (I12, included) | Yes for the documented/typical usage (`<TableToolbarMenu><TableToolbarAction/></TableToolbarMenu>`), confirmed in installed source: `TableToolbarAction` ships today hardcoded to `OverflowMenuItem`. Carbon issue #23260 confirms the runtime consequence: "This broke the datatable overflow menu instances. in v12. this needs to be fixed when we release v12." Suggested severity High (Sev 2). A workaround exists for consumers willing to bypass the helper: `TableToolbarMenu` itself has no hardcoded composition, so passing `MenuItem`/`MenuItemDivider` children directly into it should work under v12 without waiting for a fix. The linked PR #23259 (75 files) does **not** fix `TableToolbarAction.js` - it only touches `OverflowMenu.stories.js` and `packages/styles/scss/components/data-table/action/_data-table-action.scss` (a border-radius mixin), so the helper's break is unresolved on carbon@main as of 2026-09-24. | Open (#23260), package `@carbon/react`+`@carbon/web-components` | `gh api repos/carbon-design-system/carbon/issues/23260`; `es/components/DataTable/TableToolbarAction.js` and `TableToolbarMenu.js` in installed pkg |
| Same `OverflowMenu`/`OverflowMenuItem` v11-composition pattern also exists in installed `@carbon/ibm-products` 2.99.0: `ActionBar/ActionBarOverflowItems.js`, `Datagrid/useActionsColumn.js`, `ComboButton/ComboButton.js` (all `import { OverflowMenu, OverflowMenuItem } from "@carbon/react"`) | None of these three is a component Afframe UI includes: `Datagrid` and ibm-products' `ComboButton` are explicitly named deprecated/excluded in `scope.md` X2 (I7 uses `@tanstack/react-table` instead; I10 uses `@carbon/react`'s own `ComboButton`); `ActionBar` is tagged "default-off canary ... reference" in `carbon-catalog.md:234`, not a decided include | No - not a breakage in a needed component, since none of the three affected modules is included. Noted only because the same failure mode as the DataTable case is present in code Afframe UI would not use. | Not filed as an issue in ibm-products; inferred from source | `es/components/ActionBar/ActionBarOverflowItems.js:14,30`; `es/components/Datagrid/useActionsColumn.js:13,72`; `es/components/ComboButton/ComboButton.js:14,64` in installed pkg; `scope.md` X2; `carbon-catalog.md:234` |
| carbon-ai-chat #2308 "Move the chat's overflow menus to Carbon 12 with the 3.0.0 alpha" | Every "more actions" menu in the chat header, toolbar, and history panel (O9 `@carbon/ai-chat`) | Confirmed and measured ("every overflow menu in the chat stops opening", 609/609 tests still pass), but **not a day-one break from Afframe turning on its own v12 flags**: the chat is Web-Components-based and needed its own manually-added `<feature-flags>` custom element to reproduce the bug; nothing in Afframe's React `<FeatureFlags>` wrapper reaches that internal WC tree automatically. Per the issue itself, the fix "lands with the alpha, on `integration/v2.0.0`... a Carbon major can't ship to 1.x consumers" - the break is tied to ai-chat's own future 2.0.0/Carbon-3.0.0-alpha upgrade, on ai-chat's own schedule, not to Afframe's day-one v12 flag decision. | Open, held pending Carbon 3.0.0 alpha, scoped to ai-chat's 2.0.0 line | `gh api repos/carbon-design-system/carbon-ai-chat/issues/2308` (full body read) |
| carbon-ai-chat #1543 "[Epic]: 2.0.0 - Carbon 12" | Whole ai-chat package's Carbon-12 readiness plan (O9) | Context, not itself a breakage: sets carbon-ai-chat's own timeline (Alpha access days of 2026-09-22, "our real gate" Beta Nov 5 2026, GA Mar 2027 tied to `@carbon/web-components@3.0.0`) and confirms the chat's v12/2.0.0 work stays on a separate branch/major, not the 1.x line Afframe UI would install today. | Open | `gh api repos/carbon-design-system/carbon-ai-chat/issues/1543` |
| carbon #23451 "Expose IBM Products components" | All 16 migrated components (I6/scope) | Install friction / scoping, not a functional breakage: confirms the 16 stay unexported "until the next major release", blocked status. | Open, `status: blocked` | `gh api repos/carbon-design-system/carbon/issues/23451` |
| carbon-labs/react-resizer #1312 "Graduate/Migrate Resizer (React + Web Component) to Carbon core in v12" | Resizer (I9, also one of the 16 migrated) | Not a breakage; a migration-tracking issue, open. | Open | `gh api search/issues?q=repo:carbon-labs+v12` |
| Label search: `version: 12` + `type: bug 🐛` (corrected query, matching the exact label text with emoji) | - | 2 results in `carbon-design-system/carbon`, both open: #23260 (above) and **#13096** "Multiselect: The implementation confuses/mislabel the title, label" (labels include `type: bug`, `type: a11y`, `component: multiselect`, `version: 12`) - an accessibility labelling issue, not tied to the v12 flag surface examined here, not re-verified for severity to an included component this session. No other open issue in carbon-design-system/carbon carries both labels. | #23260 open, #13096 open | `gh api --paginate "repos/carbon-design-system/carbon/issues?labels=version:%2012&state=open&per_page=100"` piped through `grep -i "type: bug"` (135 total `version: 12` issues checked) |
| ibm-products peer cap `@carbon/react ^1.115.0`; ai-chat peer cap `@carbon/web-components >=2.54.0 <3.0.0` | Both (I6, O9) | Install friction, not breakage, per Hleb's rule (peer-range caps explicitly carved out in scope.md 1.3/1.2 fact 10). Both repos plan to widen at their own v12/3.0.0 releases (ai-chat #1543 timeline above). | Open (peer ranges as published 2026-09-24) | `V row 10h`; `registry.npmjs.org/@carbon%2fai-chat/latest` |
| Labs I37-I50 packages | Not checked individually for v12 issues (search on `carbon-labs` repo for "v12" returned only #1312 Resizer, #4 Dependency Dashboard, #1120 closed DSAG-format issue) | No evidence found of v12-breaking issues in the other 35 labs packages | n/a | `gh api search/issues?q=repo:carbon-design-system/carbon-labs+is:issue+v12` |

## The 16 migrated components on day one (table per component)

All 16 (glob-confirmed 2026-09-24 from `packages/react/product-migrated-components.mjs` on carbon@main, unchanged from V-verify): ActionSet, NotificationsPanel, BigNumber, FullPageError, Coachmark, OptionsTile, InterstitialScreen, Guidebanner, Resizer, ScrollGradient, SidePanel, EditInPlace, Tearsheet, TagOverflow, UserAvatar, TruncatedText.

All 16 source directories are confirmed present on carbon@main today (`gh api repos/carbon-design-system/carbon/contents/packages/react/src/components/<Name>?ref=main`, checked for all 16, 2026-09-24) - option (b) has real source to vendor, contrary to a first-pass assumption that nothing ships anywhere yet.

| Component | (a) IBM Products export today (`P/es/index.js`, checked directly) | (b) Vendor v12 source (carbon@main `packages/react/src/components/<Name>`) |
|---|---|---|
| ActionSet | Not a root export of `@carbon/ibm-products` 2.99.0 - internal module only (V row 3d). No usable public API today. | Source exists on carbon@main. `SidePanel.tsx` on carbon@main imports `{ ActionSet } from '../ActionSet'`, so vendoring SidePanel requires also vendoring ActionSet. |
| NotificationsPanel | Root export `NotificationsPanel`, no deprecation marker found (`grep -l "This component is deprecated"` on its module: no match). | Source exists. |
| BigNumber | Only `previewCandidate__BigNumber` (V row 3d). `.d.ts` leaks into published `@carbon/react` 1.117.0 despite JS exclusion (V row 3a note). | Source exists. |
| FullPageError | Root export `FullPageError`; replacement target for deprecated HTTPError403/404/Other (`npx @carbon/upgrade migrate ibm-products-update-http-errors --write`). | Source exists. |
| Coachmark | Two generations in ibm-products: legacy `previewCandidate__Coachmark*` (7 exports, incl. `CoachmarkFixed`, `CoachmarkStack`, `CoachmarkButton`, `CoachmarkOverlayElement(s)` - the deprecated objects themselves) and current `preview__Coachmark`/`preview__CoachmarkBeacon`/`preview__CoachmarkTagline` (from `components/Coachmark/next`) - O10 already picked the `preview__` family. carbon@main's `packages/react/src/components/Coachmark` directory listing contains `Coachmark.tsx`, `CoachmarkBeacon/`, `CoachmarkTagline/`, `CoachmarkContent*.tsx` - the same names as the ibm-products `preview__` ("next") generation - and does **not** contain `CoachmarkFixed`, `CoachmarkStack`, `CoachmarkButton`, or `CoachmarkOverlayElement(s)`, which are legacy-only names. This is evidence (directory listing only, file contents not read) that carbon's core migration is based on the `preview__`/"next" generation, consistent with what O10 already selects. | Source exists at `packages/react/src/components/Coachmark`; contents match the "next" generation by name. |
| OptionsTile | Root export `OptionsTile` (O12 declined by Hleb; kept here only for v12-migration bookkeeping). | Source exists. |
| InterstitialScreen | Root export `InterstitialScreen` (O11 onboarding set, included). | Source exists. |
| Guidebanner | Only `previewCandidate__Guidebanner`/`previewCandidate__GuidebannerElement*` (V row 3d) (O11 onboarding set, included). | Source exists. |
| Resizer | Not in ibm-products at all; ships as `@carbon-labs/react-resizer` 0.25.0 (I9), which ibm-products depends on. Also tracked in carbon-labs #1312 "Graduate/Migrate Resizer ... to Carbon core in v12". SidePanel's carbon@main source also imports `{ Resizer } from '../Resizer/Resizer'`. | Source exists at `packages/react/src/components/Resizer` (separate from the Labs package). |
| ScrollGradient | Root export `ScrollGradient` but default-off canary: renders a `Canary` placeholder unless `pkg.component.ScrollGradient = true` is set (O13, included - needs the settings flag turned on). | Source exists. |
| SidePanel | Root export `SidePanel`, no deprecation marker found. carbon@main source imports core stable `@carbon/react` components (`Button`, `Heading`/`Section`, `IconButton`, `Layer`, `Popover` types) plus internal hooks (`../../internal/useFocus`, `usePreviousValue`, `useSidePanelPresence`, `usePrefersReducedMotion`, `usePrefix`, `warning`, `environment`) plus, critically, `{ ActionSet } from '../ActionSet'` and `{ Resizer } from '../Resizer/Resizer'` - two of the other 16 migrated components. Not self-contained: vendoring SidePanel alone is not possible without also vendoring ActionSet and Resizer. | Source exists; see cross-dependency note. |
| EditInPlace | Root export `EditInPlace`, no deprecation marker found. | Source exists. |
| Tearsheet | Root export `Tearsheet` (legacy/plain) **and** `preview__Tearsheet` (`Tearsheet$1` in the export map) - two distinct exports, not previously distinguished in V-verify's read tables. carbon@main core `Tearsheet.tsx` imports only stable `@carbon/react` primitives (`ComposedModal`, `FeatureFlags`, `@carbon/layout`) and internal hooks (`useIsomorphicEffect`, `usePrefix`, `useMatchMedia`, `useId`, `usePresence`, `useMergedRefs`) - no dependency on other migrated-list components found in this file. | Source exists; appears self-contained among the 16 (only depends on stable core + internal utils). |
| TagOverflow | Root export `TagOverflow`; `false` in component defaults (canary-style), but no `checkComponentEnabled` wrapper found in its module - gating at render time is unverified (V "Still open"). | Source exists. |
| UserAvatar | Root export `UserAvatar`; named replacement for deprecated `UserProfileImage`. | Source exists. |
| TruncatedText | Only `preview__TruncatedText`; named replacement for deprecated `StringFormatter`. | Source exists. |

General notes on (b) and (c), applying to all 16:

- **(b) Vendor v12 source from carbon main**: no component source directories ship in the *published npm tarball* of `@carbon/react` 1.117.0 (V row 10c), but all 16 exist today in the carbon-design-system/carbon GitHub repository at `packages/react/src/components/<Name>` on the `main` branch (confirmed above), so vendoring means pulling from that repo, not from any npm package. Self-containedness varies: Tearsheet imports only stable core `@carbon/react` exports plus internal utility hooks; SidePanel imports two other list members (ActionSet, Resizer) directly, so those three cannot be vendored independently of each other. A full per-component import audit of the remaining 13 was not completed this session (budget); assume similar cross-dependencies are possible until checked. Apache-2.0 section 4 (redistribution) requires: giving recipients a copy of the license, stating any files that were modified with a prominent notice, retaining all copyright/patent/trademark/attribution notices from the Source form (e.g. in a NOTICE file), and not using carbon-design-system/IBM trademarks to imply endorsement. Vendoring unreleased main-branch source is not restricted by Apache-2.0 itself, but ties Afframe UI to manually tracking and re-syncing upstream changes with no version pin, and carries the risk the API changes before the real release: v12-alpha and v12-beta both still show open, unmerged design/dev issues against several of these exact components (Card #23269, Notification #23193, Options tile #23130, per the milestone tables above).
- **(c) Wait for v12-alpha**: target 2026-10-31 (milestone #101 due date, GitHub target not a commitment - `docs/release-schedule.md` still lists v12 Active as TBD). #23451 "Expose IBM Products components" is explicitly blocked and unresolved as of 2026-09-24, so even if v12-alpha publishes on schedule there is no confirmation the 16 components will be exported in that first pre-release; #23451's own body states they are "meant to be only exposed in the major release" (ambiguous whether alpha counts).

## Mapping Hleb's rule

Hleb's rule for v12 ("Full v12 implementation from day one, except if it breaks some component we need") does not by itself resolve which of the three options for the 16 migrated components to take on day one: none of the three is switched by "v12 flags on", since the 16 are glob-excluded from `@carbon/react` regardless of any flag (still blocked per open issue #23451). `scope.md` itself leaves the v12 form of the 16 explicitly "under recheck".

Of the 16, today's ibm-products 2.99.0 exports break down as: 14 present in `P/es/index.js` in some form, of which 10 are plain/unprefixed root exports (NotificationsPanel, FullPageError, OptionsTile, InterstitialScreen, ScrollGradient, SidePanel, EditInPlace, Tearsheet, TagOverflow, UserAvatar); BigNumber and Guidebanner exist only as `previewCandidate__`; TruncatedText exists only as `preview__`; Coachmark exists as both `previewCandidate__` (legacy) and `preview__` (next generation); Tearsheet additionally has a second, `preview__Tearsheet` export; ActionSet is not exported at all (internal module only); Resizer is not in ibm-products at all (ships via `@carbon-labs/react-resizer`, I9).

- **Option (a), use today's IBM Products versions**: keeps whichever of the above each of the 16 already has. Consequence under the rule: this is v11-era ibm-products code, not v12, so it satisfies "from day one" only in the sense of being installable today.
- **Option (b), vendor the v12 source from carbon main**: pulls the same 16 component directories that exist today on carbon@main's `main` branch (confirmed present for all 16) ahead of any official v12 release. Consequence: gets the v12-shaped component (subject to Apache-2.0 section 4 notice/attribution obligations, and to re-syncing manually since there is no version pin), but with components still in flux - several have open, unmerged design/dev issues in the v12-alpha and v12-beta milestones (Card #23269, Notification #23193, Options tile #23130) - and with at least one confirmed cross-dependency inside the set (SidePanel imports ActionSet and Resizer directly, so those three would have to be vendored together, not independently).
- **Option (c), wait for v12-alpha**: consequence is that "day one" shifts to whenever v12-alpha (target 2026-10-31, not a committed date) is published and, separately, whenever #23451 "Expose IBM Products components" is resolved - which is not guaranteed to happen in the alpha itself, per that issue's own wording ("meant to be only exposed in the major release").

## Open questions

- Which ibm-products Coachmark generation the @carbon/react core migration copies: resolved by directory-name evidence to the `preview__`/"next" generation (see the 16-component table), but file contents were not read to fully confirm - closes most of V-verify's "Still open" item but a full content diff would be more certain.
- Whether TagOverflow's `false` default is actually enforced by a canary wrapper at render time (carried over "Still open" from V-verify).
- Whether v12-alpha, when/if published 2026-10-31, will include the 16 migrated components or only the flagged-component-behavior changes; #23451 ("Expose IBM Products components") is open and blocked as of 2026-09-24 with no target milestone content resolving it.
- Whether `@carbon-labs/react-date-picker` (I38, the Labs date picker) and `preview__DatePicker` in `@carbon/react` (O3) are actually the same code graduating, or two separate implementations that happen to share design intent: `npm view @carbon-labs/react-date-picker dependencies` shows no `@carbon/utilities` dependency (only `classnames`, `@ibm/telemetry-js`, `@carbon-labs/primitives`), while V-verify row 5f confirms `preview__DatePicker` is built on `@carbon/utilities/date-picker` (Temporal API). Issue #22427's own text ("graduate the DatePicker refactor that we have in labs to core... We'll first deliver the preview in v11") suggests intended convergence, but the published Labs package's dependency graph does not yet match. Not resolved this session.
- Full per-component import audit for the 13 of 16 migrated components not individually traced this session (only Tearsheet and SidePanel had their carbon@main imports read in full), to find any further cross-dependencies among the 16 like the SidePanel-to-ActionSet/Resizer one found.
- Whether carbon's PR #23259 or any other open PR fixes `TableToolbarAction.js`'s composition before v12 ships; not found in the 75-file diff checked this session.
- Whether carbon's fix for #23260 (linked PR #23259) has landed on carbon@main as of today - not checked (would require reading PR #23259's merge state).
- Internal dependency graph and self-containedness of each of the 16 components' carbon@main source, needed to size a vendoring effort under option (b) - not assessed this session; would require per-component review of `packages/react/src/components/<Name>` imports.
- Whether `@carbon/upgrade` 11.46.0 (published) already contains the `enable-v12-release` codemod (carried over "Still open" from V-verify).

## Sources

- carbon@main `docs/migration/v12.md` (fetched via `gh api repos/carbon-design-system/carbon/contents/docs/migration/v12.md?ref=main`, 2026-09-24)
- carbon@main `docs/working-with-v12.md` (same method, 2026-09-24)
- carbon@main `packages/feature-flags/feature-flags.yml` (same method, 2026-09-24)
- carbon@main `packages/react/product-migrated-components.mjs` (same method, 2026-09-24)
- `gh api "repos/carbon-design-system/carbon/issues?milestone=101&state=all"` / `102` / `103` / `104` (2026-09-24)
- `gh api "search/issues?q=repo:carbon-design-system/carbon+is:open+is:issue+label:%22version:+12%22"` (135 total) and with `label:%22type:+bug%22` added (0 total) (2026-09-24)
- `gh api repos/carbon-design-system/carbon/issues/23260`, `/23451`, `/22427` (2026-09-24)
- `gh api "search/issues?q=repo:carbon-design-system/ibm-products+is:issue+v12"` and `is:pr+v12` (2026-09-24)
- `gh api repos/carbon-design-system/carbon-ai-chat/issues/2308`, `/1543` (2026-09-24)
- `gh api "search/issues?q=repo:carbon-design-system/carbon-ai-chat+is:issue+%22web-components%22"` (2026-09-24)
- `gh api "search/issues?q=repo:carbon-design-system/carbon-labs+is:issue+v12"` (2026-09-24)
- `docs/research/sources/round3/labs-tech.json` (ground truth, provided)
- `docs/research/sources/round2/V-verify.md` (ground truth, provided; rows 1-12, 2a-2c, 3a, 3d, 4a, 5b, 5d, 5f, 5g, 6a, 10a, 10c, 10d, 10g, plus the deprecated/prefixed export tables and "Still open" list)
- `docs/scope.md` section 1 (provided)
- `docs/research/sources/round3/BRIEF-R3.md` (provided)
