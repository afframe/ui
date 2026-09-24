# Afframe UI: proposed scope

Date 2026-09-24 · Companion to `research/carbon-catalog.md` (what exists, with tags and sources) and `goals.md` (goals and the decision register).
Markers: see `README.md`. Everything below that is not marked `[H]` or `[A]` is `[P]`. (unverified) = not confirmed from a primary source. Decision status: `goals.md` section 6.

Hleb's stated frame `[H]`: React only (D1); the latest Carbon, "whichever of v11 latest or v12 preview is most recent and offers the most"; everything useful from the carbon-design-system org and nothing that isn't; what is kept gets improved with prebuilt pages, sections, blocks and templates. (`goals.md` section 1; `sources/round2/BRIEF-COMMON.md`)

**Hleb's rules for this scope `[H]`** (status: `goals.md` section 6):
- **v12:** `[H]` 2026-09-24: "Full v12 implementation from day one, except if it breaks some component we need."
  - **Look:** `[H]` 2026-09-24: full native v12 look as IBM ships it (rounded corners, full-border fields). Afframe visual changes (for example corner radius) come later, after all components work on native v12. Evidence that the look is adjustable later: `docs/research/sources/round3/S-sass-check.md` (radius tokens set to 0 compile and render square).
  - `[P]` Reading: `enable-v12-release` and every `enable-v12-*` flag on in React and in the Sass build from the first commit; v12 pre-releases (alpha, beta) may be used as soon as they are published (D17), and IBM Products' own peer cap is overridden when it lags (the override lives in each consumer repo, `consumption.md` section 3); a component stays on v11 behaviour only when v12 demonstrably breaks a component we need, documented case by case. Verified day-one surface and breakages: section 1.5 (round 3). How the components moving from IBM Products into core are used on day one: decision S15. Upstream changes to watch: section 1.6.
- **Scope:** `[H]` agreed with conditions ("I agree with Proposed scope, but:"): Carbon Labs is mandatory (section 2.5): `[H]` 2026-09-24: "Labs is mandatory. If they are web-components only, then in our version we need rebuild or adaptation with dependencies." And: "If something overlaps with Labs, and Labs are not React, then we better use what overlaps than rebuild Labs to React for this component."
  - `[P]` Reading: every live Labs package is in, except `@carbon-labs/react-style-picker` (I42), out because it cannot be installed (`[H]` 2026-09-24, "2 - c"; I41 covers theme choice). For a web-components-only Labs package: if an included React component covers it, use that; if it covers it partly, use it and list the gap under Improve; if nothing covers it, wrap or rebuild it in React. Round 3 treatment: section 2.6.
- **Also:** every Optional item (section 3) is decided by Hleb one by one; every Build-new item (section 6) is approved by Hleb one by one before it is built, and building new is the last milestone.

---

## 1. v11 latest vs v12 preview: the answer

### 1.1 Facts

| # | Fact | Source |
|---|---|---|
| 1 | Newest published Carbon for React: `@carbon/react` 1.117.0 (2026-09-23). npm `latest` = `next` = 1.117.0; no 2.x, alpha or v12 tag exists (a legacy `beta` tag points to 0.1.0 from 2021). | https://registry.npmjs.org/@carbon%2freact; V row 1 |
| 2 | "v12 preview" is not a separate package: it is `enable-v12-release` (plus six `enable-v12-*` sub-flags) inside 1.117.0, and a v12 Storybook that brands itself "@carbon/react v2.x". | `docs/working-with-v12.md`; carbon@main `packages/react/.storybook-v12/theme.js:14`; V row 1 |
| 3 | So "v11 latest" and "v12 preview" are the same 1.117.0 install with the same 365 exports. The flag does not add components; it replaces v11 behaviour and styling on flagged components (OverflowMenu children, carets, Tag shape, form-field borders, and others below). | `react-exports.json`; V rows 1, 2a, 2b, 10a |
| 4 | v12 preview gives: Menu-based OverflowMenu, tile default and radio icons, StructuredList visible icons, fixed-position floating styles, reduced Toggle label spacing, focus wrap without sentinels; plus root-flag-only changes: no Popover/Tooltip/Toggletip caret and new radius, rounded Menu, non-pill Tag, ProgressBar radius and animation, label/decorator placement as dev errors. | A flags table; `docs/migration/v12.md`; V rows 2a, 2b |
| 5 | v12 preview also restyles form fields: text-input and list-box (ComboBox, Dropdown, MultiSelect) get rounded corners and a full 1px border instead of the v11 bottom border; select, number-input, search, date-picker and fluid-* are also gated (grep only). This is not in `docs/migration/v12.md`. | `S/scss/components/text-input/_text-input.scss:54-56`; `S/scss/components/list-box/_list-box.scss:105-107`; V row 2b |
| 6 | Sass flag requirement: the React prop only switches JS behaviour. Styling changes compile from Sass, so full v12 needs `<FeatureFlags enableV12Release>` AND a Sass build with `$feature-flags: ('enable-v12-release': true)`. The precompiled `@carbon/styles/css/styles.min.css` is v11-styled (pill Tags). | V row 2c; `S/css/styles.min.css` |
| 7 | v12 preview does not give the 17 components moving from IBM Products (Tearsheet, SidePanel, NotificationsPanel, PageHeader, etc.; PageHeader added 2026-09-24 by #23209): they are excluded from the published JS, flag on or off. Today 15 come from `@carbon/ibm-products` 2.99.0 (PageHeader as `preview__PageHeader`), Resizer from `@carbon-labs/react-resizer`, ActionSet is not public. | `packages/react/product-migrated-components.mjs:45-64` on main; V rows 3a, 3d |
| 8 | `preview_Pagination`/`preview_PageSelector` are removed in the v12 major, but 1.117.0 exports them flag on or off. | V row 2b |
| 9 | Dates (GitHub milestone targets, not commitments; rc.0 before beta as published): v12-alpha 2026-10-31 (28 open / 21 closed), v12-rc.0 2026-11-12 (10 open), v12-beta 2026-12-31 (13 open / 5 closed), v12-stable 2027-03-31 (5 open / 1 closed), v12.x undated. `docs/release-schedule.md` still lists v12 Active as TBD. Whether v12-alpha is published to npm is unknown. | https://github.com/carbon-design-system/carbon/milestones (orchestrator check 2026-09-24); V row 4a |
| 10 | Peer caps: `@carbon/ibm-products` 2.99.0 peers `@carbon/react ^1.115.0` (excludes 2.x). `@carbon/ai-chat` 1.21.0 requires `@carbon/web-components >=2.54.0 <3.0.0`; WC v3 sits in the v12-stable milestone (#22817). Inference: both pin an app to the v11 majors until they widen. | `P/package.json:128`; https://registry.npmjs.org/@carbon%2fai-chat/latest; V rows 8b, 10h |
| 11 | Codemods: `npx @carbon/upgrade migrate <flag> --write` exists for `enable-v12-release`, overflowmenu, tile-default-icons, tile-radio-icons, structured-list-visible-icons; none for dynamic-floating-styles or toggle spacing. Published 11.46.0 contains the `enable-v12-release` codemod (checked 2026-09-24). | `docs/feature-flags.md`; carbon@main `packages/upgrade/README.md:84-121`; V still-open |
| 12 | Label `version: 12` tags 166 issues (135 open). | V row 4b |

### 1.2 Options

| Option | What you get | Stability | Risk | Upgrade path |
|---|---|---|---|---|
| A. v11 latest, flags off | `@carbon/react` 1.117.0 as published; precompiled CSS usable; ibm-products 2.99.0 and ai-chat compatible | Stable, Active line, biweekly minors | Lowest now; one larger migration at v12 | Turn on flags later, then move to 2.x |
| B. v11 latest + `enable-v12-release` ("v12 preview") | Same install and exports as A; v12-committed behaviour replaces v11 behaviour on flagged components (facts 4, 5) | v12 flags are locked APIs; preview surface, v12 Storybook not yet covered by VRT (A) | Needs a Sass build (fact 6, ties to D5); undocumented form restyle (fact 5); label placement throws dev errors; ibm-products CSS is compiled with the flag off, so IBM Products' own rules do not change under v12 while the Carbon elements inside them get v12 styling (Sass compile check, round 3, section 1.5); a rendered visual check is still open | Carbon's stated intent: with all `enable-v12-*` flags on before v12, no changes needed at v12 (A); 16 migrated components still move from ibm-products to core |
| C. v11 latest + selected `enable-v12-*` sub-flags | A plus chosen behaviours only; root-only changes (radius, carets, form fields, Tag shape) absent | as B, smaller surface | Smaller, staged; two Sass-only flags need Sass build | Flip remaining flags later |
| D. v12 alpha when published | Per plan: migrated components as core exports, v12 defaults on (unverified until published) | Alpha | Not installable today; target 2026-10-31, publication unknown; ibm-products and ai-chat peers exclude 2.x / WC v3 until widened (fact 10) | Codemods; ibm-products imports move to core |
| E. Wait for v12 stable | Same as D, stable | Stable when shipped | Target 2027-03-31, not committed | One migration at GA |

### 1.3 Mapping to Hleb's criterion

`[H]` "the latest, and the one that has more": options A, B and C are the same newest install (1.117.0), so they tie on "latest"; on "has more", B carries the most v12-committed behaviour, but no installable option has more components, because the migrated components (16 at the time, 17 since 2026-09-24) come from `@carbon/ibm-products` in A, B and C alike. B's cost: a mandatory Sass build (no precompiled CSS), an undocumented form-field restyle, and dev errors on label placement. Only D adds components to core; it does not exist on npm yet (alpha target 2026-10-31), and ibm-products and ai-chat peer caps block a combined install until they widen.

### 1.5 v12 on day one: verified surface and breakages (2026-09-24, round 3)

Sources: `sources/round3/V3-verify.md` (V3, authoritative), `sources/round3/W-v12-day-one.md` (W), `sources/round3/S-sass-check.md` (Sass check).

**What day-one v12 is.** `@carbon/react` 1.117.0 with `<FeatureFlags enableV12Release>` plus a Sass build with `$feature-flags: ('enable-v12-release': true)` (option B). The root flag turns on `enable-v12-tile-default-icons`, `enable-v12-tile-radio-icons`, `enable-v12-overflowmenu`, `enable-v12-structured-list-visible-icons`, `enable-v12-dynamic-floating-styles`, `enable-v12-toggle-reduced-label-spacing`, and the unprefixed `enable-focus-wrap-without-sentinels`. It does not turn on `enable-dialog-element`, `enable-treeview-controllable`, `enable-tile-contrast`, `enable-enhanced-file-uploader` or `enable-presence` (those are O2, set explicitly). React `<FeatureFlags>` has no dedicated prop for the structured-list or toggle-spacing flags; they come through the root flag or the `flags` prop. carbon@main `docs/working-with-v12.md` still describes a prefix-only cascade and is stale against the code. (V3 rows 6, 6b; `FeatureFlagScope.ts:22,28-30`)

**Preview exports.**
- O3 `preview__DatePicker` is v12's default DatePicker and the same code as `@carbon-labs/react-date-picker` (I38): Carbon PR https://github.com/carbon-design-system/carbon/pull/22728 (merged 2026-08-05) copied the Labs v12 DatePicker into core as preview. Public APIs match; the copies now evolve separately (Labs 0.12.0, 2026-09-18). No flag switches the stable `DatePicker`; it is reached only by importing `preview__DatePicker` until https://github.com/carbon-design-system/carbon/issues/22427 (v12-stable, open) replaces the stable internals. Temporal difference: core's `@carbon/utilities/date-picker` installs `temporal-polyfill` on `globalThis`; Labs `@carbon-labs/primitives` 0.6.0 calls a global `Temporal` with no polyfill dependency. Whether I38 works without an app-supplied polyfill in browsers lacking `Temporal`, and how the two interact when both load, is (unverified). (V3 rows 7, 12h; V3 still-open)
- O4 `preview__Dialog`, O5 `preview__Card`, O6 `preview_Layout`/`preview_Text` read no feature flag and are not in `docs/migration/v12.md`: they are not v12 defaults, so Hleb's declines stand. `preview__PageHeader` (I18, I30) is not a v12 default either and stays included. (V3 row 8)

**Sass compile.** Carbon `@carbon/styles` 1.116.0 + `@carbon/ibm-products-styles` 2.95.0 (which needs `@carbon-labs/react-resizer` 0.25.0 for its Sass) compile with v12 on and off, exit 0. 199 CSS rules differ, all core Carbon classes; no `.c4p--*` rule changes, while Carbon elements inside IBM Products components get v12 styling from the same build. A rendered visual check is still open. (`sources/round3/S-sass-check.md`)

**v12 breakages affecting included components** (V3 "v12 breakages" table):

| Component | Breaks? | Handling |
|---|---|---|
| DataTable `TableToolbarMenu` + `TableToolbarAction` (I12) | Yes, under `enable-v12-overflowmenu` (via the root flag); https://github.com/carbon-design-system/carbon/issues/23260 open, v12-beta, unfixed on main; PR #23259 does not fix it | Pass `MenuItem`/`MenuItemDivider` children plus `label` to `TableToolbarMenu` (expect unknown-prop warnings for `iconDescription`/`menuOptionsClass`/`flipped`), or use `OverflowMenu`/`MenuButton` directly in `TableToolbarContent`. Source-read only, not runtime-tested. Decision S18; gap M17. (V3 rows 9a to 9c) |
| `@carbon/ai-chat` 1.21.0 (O9) | No, while Afframe uses only React `<FeatureFlags>` and the Sass flag. Yes if a `<feature-flags enable-v12-release>` DOM element sits above the chat: every chat overflow menu stops opening (https://github.com/carbon-design-system/carbon-ai-chat/issues/2308) | Rule below. CSS isolation under a v12-compiled host stylesheet not rendered (unverified). (V3 row 10) |
| IBM Products EmptyState family (I23) | Not on day one. Removed at the v12 major per https://github.com/carbon-design-system/carbon/issues/22473, no Core component replacement | Decision S17. (V3 row 2a) |
| Web-component-backed Labs items: none included since 2026-09-24 (I42 out; `wc-resizer` not wrapped, S16); any `wc-*` wrapped later | Do not break, but stay on v11 behaviour: React `<FeatureFlags>` cannot reach them, and they are capped at `@carbon/web-components` <3 | Scoped `<feature-flags enable-v12-release>` element around them only, or accept v11 behaviour until WC 3.x. (V3 rows 2d, 10) |
| IBM Products components with internal v12 menus: AddSelect (O14), Card, `preview__PageHeader` (I30), BreadcrumbWithOverflow | No; they self-scope `enableV12Overflowmenu` and use `MenuItem` | none needed. (V3 row 12d) |
| IBM Products components with hardcoded `OverflowMenuItem`: ActionBar, Datagrid, DatagridSelectAllWithToggle, ComboButton (ibm-products), FilterPanelCheckboxWithOverflow, WebTerminal | Would break, but none is included (X2 or not in scope) | n/a. (V3 row 12c) |
| `preview_Pagination` / `preview_PageSelector` | Removed at the v12 major | I13 already uses stable `Pagination` |
| The 17 migrated components (Tearsheet, SidePanel, PageHeader, etc.) | Not a break: unavailable, excluded from the published build until the major (#23451 blocked, milestone v12-rc.0, due 2026-11-12) | Decision S15. (V3 rows 11a to 11c) |
| Combined Sass build (Carbon + IBM Products) | No (199 core-only rule changes) | Rendered visual check still open |

**Implementation rules that follow** (V3 row 10, correction 14; rule 3 is `[H]` 2026-09-24):
- Never render a `<feature-flags>` DOM element as an ancestor of `@carbon/ai-chat` (#2308).
- Web-component-backed Labs items stay on v11 behaviour under React `<FeatureFlags>` unless given their own scoped `<feature-flags>` element.
- `[H]` Force v12 where possible. `[P]` Mechanism: put a scoped `<feature-flags enable-v12-release>` element around each web-component-backed Labs item (none included since 2026-09-24). `[P]` `@carbon/ai-chat` keeps the v11 look, because a v12 flag element above it breaks its menus.

### 1.6 Upstream changes to watch (checked 2026-09-24)

Merged or planned upstream work that changes items in this scope. Evidence: `sources/round5/U-upstream-sweep.md` section 3.

| Change | State on 2026-09-24 | Affects |
|---|---|---|
| PageHeader moved into core source for v12 (#23209); the migration list is now 17 | merged 2026-09-24; unpublished until v12 | S6, S15, M8, M19 |
| ConditionBuilder (#23219) and AddSelect (#23181) migrate into core | open PRs, approved but blocked; the list would reach 19 | O14, O15, S15, M19 |
| v12 releases: a `next` branch with `enable-v12-release` on by default (#22382, PR #23394); alphas published under an npm `v12-alpha` dist-tag (#23455) | open; #23455 in milestone v12-rc.0 | D8, D17, I36 |
| v12 ships only two themes, `light` and `dark`; `white` and `g10` alias to light, `g90` and `g100` to dark (RFC #23448, epic #22894) | RFC closed as completed 2026-09-23 | D5 and D11 ("all four themes", "every theme") |
| OKLCH token pipeline (#23334, #23429) and consolidation of the `-01/-02/-03` token variants (#23485) | open, v12-alpha | D6, D9, M13 |
| DataTable toolbar menu fixed under `enable-v12-overflowmenu` (PR #23375, closes #23260) | open, one approval | S18, M17: the workaround may no longer be needed |
| IBM Products deprecations on main, unpublished: Create flows (#9900), Saving (#9888), WebTerminal (#9890); stable Tearsheet in favour of `preview__Tearsheet` proposed (#9874) | #9900, #9888, #9890 merged 2026-09-23; #9874 open | I19, I21, I28, B5, B6, B7 |
| ADR 0007 (proposed, not decided): deprecate TagSet, ProductiveCard, ExpressiveCard, GetStartedCard, Toolbar and SearchBar; move Cascade, Checklist, InlineTip, TruncatedList and NonLinearReading to Labs | proposed; PR #22880 open | I27, I29, O5, O11, O16, B24, B26 |
| `preview__PageHeader` lacks a title skeleton and an inline-editable title (ibm-products #9804, #9805) | open | S6, I30, B16 |
| `@carbon/ai-chat` moves to Carbon 12 only in 2.0.0, with `@carbon/web-components` 3.0.0; 1.x stays on Carbon 11 (carbon-ai-chat #2308) | open, on hold for the WC 3.0.0 alpha | S7, O9 |
| Carbon Charts v12 support with no API changes (carbon-charts #2098); "eCharts is the future", with a Charts deprecation plan after v12 | open | I8, O22, B27, B28 |
| The Labs DatePicker graduates to core (#22427) | open, v12-stable | I38, S19 |

## 2. Include [P]

### 2.1 Packages

| # | Item | Reason | Source |
|---|---|---|---|
| I1 | `@carbon/react` 1.117.0 | the Carbon React implementation; `[H]` React, Carbon foundation | catalog 2 |
| I2 | `@carbon/styles` 1.116.0 (Sass source) | component styles; Sass is required for option B and for `$prefix`/fonts | catalog 3; V row 2c |
| I3 | `@carbon/feature-flags` 1.10.0 | v12 and opt-in flags | catalog 2.10 |
| I4 | Token packages: `@carbon/themes`, `colors`, `layout`, `grid`, `type`, `motion` | `[H]` everything runs on tokens | catalog 3 |
| I5 | `@carbon/icons-react` 11.89.0, `@carbon/pictograms-react` 11.111.0 | icons and pictograms | catalog 3 |
| I6 | `@carbon/ibm-products` 2.99.0 + `@carbon/ibm-products-styles` | `[H]` IBM Products; only source of Tearsheet, SidePanel, NotificationsPanel, EmptyState, FullPageError, UserAvatar today | catalog 4 |
| I7 | `@tanstack/react-table` (+ `@tanstack/react-virtual`) | `[H]` TanStack tables; upstream Datagrid direction; version is D7 | catalog 6 |
| I8 | `@carbon/charts-react` + `@carbon/charts` 1.27.20 | dashboards and KPI charts; the only maintained Carbon charting | catalog 6 |
| I9 | `@carbon-labs/react-resizer` 0.25.0 | already an ibm-products dependency; Resizer is on the v12 migration list | catalog 5 |

### 2.2 @carbon/react groups (all stable unless noted)

| # | Category | Groups | Reason |
|---|---|---|---|
| I10 | Actions | Button (+ButtonSet), IconButton, ComboButton, Copy | every toolbar and form |
| I11 | Forms | Form, TextInput, PasswordInput, TextArea, NumberInput, Select, ComboBox, Dropdown, MultiSelect, FilterableMultiSelect, Checkbox, RadioButton, Toggle, Switch, Search, DatePicker, TimePicker, FileUploader, Slider, all Fluid* fields (stable base names) | full form surface; Fluid for dense modals and tearsheets |
| I12 | Data display | DataTable family, StructuredList, Tag family, Tile family, Accordion, CodeSnippet, lists, ContainedList, AspectRatio | records, status, dashboards |
| I13 | Navigation and shell | UI Shell header, SideNav, Switcher, Breadcrumb, Tabs, ContentSwitcher, Pagination (stable), Menu, OverflowMenu, Link | app shell and in-page navigation |
| I14 | Overlays | Modal, ComposedModal, Popover, Tooltip, Toggletip | dialogs and help |
| I15 | Feedback | Notification family (incl. Callout, StaticNotification), Loading, ProgressBar, ProgressIndicator, skeletons, ErrorBoundary | state and errors |
| I16 | AI | AILabel, AISkeleton | `[P]` AI patterns (GOALS C) |
| I17 | Layout and theme | Grid, Layer, Stack, Section/Heading, Theme/GlobalTheme, FeatureFlags | layout, theme zones, flags |
| I18 | Preview, no stable twin | `preview__PageHeader`, `preview__IconIndicator`, `preview__ShapeIndicator` | page header and status indicators have no stable alternative; IconIndicator is the named replacement for deprecated StatusIcon |

### 2.3 IBM Products components (non-deprecated or named replacements)

| # | Items | Maturity | Reason |
|---|---|---|---|
| I19 | Tearsheet, TearsheetNarrow, TearsheetPresence, `preview__Tearsheet` | stable / preview | large task panels; moving to core |
| I20 | SidePanel | stable | detail and edit panels; moving to core |
| I21 | CreateFullPage(+Step), CreateTearsheet(+Step, Divider, Narrow) | stable in 2.99.0; deprecated on ibm-products main 2026-09-23 (#9900), replacement is example code under `examples/carbon-for-ibm-products/Create*` | create flows |
| I22 | EditInPlace | stable | inline edit; moving to core |
| I23 | EmptyState + ErrorEmptyState, NoDataEmptyState, NoTagsEmptyState, NotFoundEmptyState, NotificationsEmptyState, UnauthorizedEmptyState | stable | empty states |
| I24 | FullPageError | stable | replaces deprecated HTTPError403/404/Other |
| I25 | NotificationsPanel | stable | notification center |
| I26 | UserAvatar | stable | replaces deprecated UserProfileImage |
| I27 | TagSet, TagOverflow | TagSet stable; TagOverflow default-off canary (render gating unverified) | tag lists |
| I28 | Saving | stable in 2.99.0; deprecated on ibm-products main 2026-09-23 (#9888), replaced by a pattern | save-state indicator |
| I29 | ProductiveCard, ExpressiveCard | stable | cards |
| I30 | `preview__PageHeader` (ibm-products) | preview | replaces deprecated PageHeader; pick one of the two `preview__PageHeader` implementations (S6, `goals.md` section 6) |
| I31 | `preview__TruncatedText` | preview | replaces deprecated StringFormatter |
| I32 | `previewCandidate__BigNumber` | previewCandidate | only KPI-number component in the org; moving to core |
| I33 | `pkg`, `usePrefix`, StackProvider | stable | configuration of ibm-products |

### 2.4 Tooling

| # | Item | Reason |
|---|---|---|
| I34 | `@carbon/upgrade` 11.46.0 | v12 codemods, HTTPError -> FullPageError codemod |
| I35 | `stylelint-plugin-carbon-tokens` 5.0.6 | `[P]` enforced tokens-only styling (GOALS D); license note MIT vs Apache-2.0 (both permissive); S12: use it now |
| I36 | `enable-v12-release` and all `enable-v12-*` flags in React and Sass | `[H]` full v12 implementation from day one (section 1 decision) |

### 2.5 Carbon Labs `[H]` (mandatory)

Live React packages from https://github.com/carbon-design-system/carbon-labs, all 0.x (catalog 5). `@carbon-labs/react-resizer` is I9. The React packages from O26 are I51 and I52 (round 3); WC-only Labs packages (O21) are treated in section 2.6; deprecated, superseded, scaffold and dead packages stay excluded (section 4). Package count: 36 published, 18 React / 16 web components / 2 other (V3 row 1a).

| # | Package | What |
|---|---|---|
| I37 | `@carbon-labs/react-ui-shell` | alternative UI shell (which shell is the default: S9) |
| I38 | `@carbon-labs/react-date-picker` | date picker; v12-stable milestone graduates it to core |
| I39 | `@carbon-labs/react-calendar` | calendar |
| I40 | `@carbon-labs/react-tag-input` | tag input field |
| I41 | `@carbon-labs/react-theme-settings` | theme settings panel |
| I42 | ~~`@carbon-labs/react-style-picker`~~ | **out, `[H]` 2026-09-24 ("2 - c"):** it cannot be installed (every published version requires `@carbon-labs/wc-empty-state@^0.23.0`, which does not exist); `@carbon-labs/react-theme-settings` (I41) covers theme choice (X13) |
| I43 | `@carbon-labs/react-whats-new` | "what's new" panel |
| I44 | `@carbon-labs/react-first-time-orientation` | onboarding overlay (which generation is the default: S10) |
| I45 | `@carbon-labs/react-registration-flow` | multi-step registration |
| I46 | `@carbon-labs/react-processing` | processing state |
| I47 | `@carbon-labs/react-text-highlighter` | search-match highlight |
| I48 | `@carbon-labs/react-animated-header` | animated header |
| I49 | `@carbon-labs/utilities` | shared Labs helpers |
| I50 | `@carbon-labs/vscode-snippets` | SCSS editor snippets |
| I51 | ~~`@carbon-labs/react-plane-stack-3d`~~ | **out, `[H]` S20 2026-09-24** (React 18 peer only) |
| I52 | `@carbon-labs/mdx-components` 0.29.0 | MDX components for docs authoring; React, live (2026-07-29) (`sources/round3/labs-tech.json`; L row; V3 row 1a) |

Not I-rows: `@carbon-labs/primitives` 0.6.0 is a transitive dependency of I38, not consumed directly; it calls a global `Temporal` with no polyfill dependency (V3 row 7, treatment table). `@carbon-labs/network-graph` is dead (last published 2024-06-27) and stays out (X9; V3 row 1b).

### 2.6 Web-components-only Labs: treatment under Hleb's overlap rule

`[H]` 2026-09-24: "If something overlaps with Labs, and Labs are not React, then we better use what overlaps than rebuild Labs to React for this component."

Final treatment table from V3 ("Final treatment table"; rows 1b to 5b). "Use instead" is what the overlap rule produces; where its premise fails, options are listed without a pick and carried to section 7. A partial overlap means the included React component is used and the gap is listed under Improve (section 5) or as a decision.

| Package | Overlap | Use instead | Gaps |
|---|---|---|---|
| `@carbon-labs/wc-empty-state` 0.22.0 | partial (multi-action slot gap) | IBM Products `EmptyState` + 6 kind variants (I23). Conflict: Carbon #22473 removes this family in v12 with no Core component; options in S17 | Multiple or free-form actions (WC `action`/`link` slots vs IBM's single `action`/`link` object). IBM adds headingAs, illustrationPosition and alt text that the WC lacks. (V3 row 2a) |
| `@carbon-labs/wc-date-picker` 0.16.0 | partial (controllable `open` only) | `@carbon-labs/react-date-picker` (I38), **the copy Afframe components use (`[H]` S19)**; `preview__DatePicker` (O3) is the same code migrated into core | Controllable `open` property (M16); `enabled-range` declared, no implementation found. (V3 row 2b) |
| `@carbon-labs/wc-resizer` 0.5.0 | partial | `@carbon-labs/react-resizer` (I9) covers the single drag handle; **grid, panels and 2D handle wait until Labs updates `wc-resizer` (`[H]` S16, 2026-09-24)** | Grid container, panel element, pivot corner (2D) handle, CSS-variable panel sizing, `resize-start` event. (V3 row 2c) |
| `@carbon-labs/wc-style-picker` 0.36.0 | full (same code) | **out with I42 (`[H]` 2026-09-24): cannot be installed; `@carbon-labs/react-theme-settings` (I41) covers theme choice** | No functional gap. Packaging: close event not mapped to a prop; `@lit/react` added by the consumer; `@carbon/web-components` <3 cap; no React `<FeatureFlags>` reach. (V3 row 2d) |
| `@carbon-labs/wc-ai-tag` 0.27.0 (draft) | partial | `@carbon/react` `OperationalTag` (or `Tag`) inside `Tooltip`, with AILabel where an AI marker is needed | 4px colored start-edge accent (`color`; M15); `tag-click` maps to `onClick`. No runtime React wrapper is published (types only); bare import broken. (V3 rows 3a, 5a) |
| `@carbon-labs/wc-global-header` 0.95.0 | partial | `@carbon/react` UI Shell (I13) + `@carbon-labs/react-ui-shell` (I37: Profile, TrialCountdown, HeaderPopover, SideNavFlyoutMenu) | IBM Hybrid iPaaS / Solis backend integration: not reusable. Environment switcher, logout banner/tile and help menu composed from HeaderGlobalAction/HeaderPanel (M14). Generic `CommonHeader` config schema only partly read (unverified). (V3 rows 3b, 5b) |
| `@carbon-labs/wc-wysiwyg` 0.3.0 | none | **out: not needed (`[H]` S14)** | Full editor surface (formatting, headings, lists, tables, color, search, code, links, images, source toggle, history). (V3 rows 4, 5a) |
| `@carbon-labs/ai-chat` 0.39.0 (preview) | partial (unverified) | `@carbon/ai-chat` 1.21.0 (O9), as the result of the overlap rule; Labs ai-chat is not superseded (Labs preview candidate, https://github.com/carbon-design-system/carbon-labs/pull/1228) | Labs-only element types not compared: chart, diagram, molecular, formula, carousel and others (24 element folders) (M18). (V3 row 2e) |
| `@carbon-labs/primitives` 0.6.0 (other) | n/a (headless) | not consumed directly; transitive dependency of I38 | Needs a global `Temporal`. Core's copy lives in `@carbon/utilities/date-picker`. (V3 row 7) |
| `@carbon-labs/vscode-snippets` 0.5.0 (other) | n/a (tooling) | I50 as tooling | none |
| `@carbon-labs/wc-example-button` 0.28.0 (draft scaffold) | n/a | out (scaffold) | none |

## 3. Optional: Hleb decides each item

**Hleb's decisions 2026-09-24:** include O2, O7, O9, O10, O11, O13, O14, O15, O16, O22, O24, O25; decline O4, O5, O6, O8, O12, O17, O23. O3, O21 and O26 are resolved in round 3 by his v12 and Labs rules (sections 1.5, 2.5, 2.6); O4, O5 and O6 are not v12 defaults, so the declines stand (1.5; V3 row 8). Removed from this list by the 2026-09-24 decisions: O1 (v12 flags, now I36), O18, O19, O20 (Labs, now I37 to I50).

| # | Item | What it adds | Depends on / note |
|---|---|---|---|
| O2 | Non-v12 flags: `enable-dialog-element`, `enable-presence`, `enable-enhanced-file-uploader`, `enable-treeview-controllable`, `enable-tile-contrast` | opt-in behaviour changes outside v12 | per-flag review; `enable-focus-wrap-without-sentinels` is already turned on by `enable-v12-release` · **included** |
| O3 | `preview__DatePicker` (v12 Temporal-based rewrite) | core preview copy of the I38 date picker; v12's DatePicker, reached by explicit import (V3 row 7) | same code as I38, migrated into core by PR #22728; core installs `temporal-polyfill`, Labs relies on a global `Temporal`; v12-stable graduates this lineage (1.5; V3 row 7) · **included (v12 default, round 3)** · Afframe components use the Labs copy (S19) |
| O4 | `preview__Dialog` | native `<dialog>` primitive | vs Modal + `enable-dialog-element` · **declined** |
| O5 | `preview__Card` | new core Card: IBM Products' composable Card, moved into core (#22867, 2026-08-12); upstream plans it as the successor of ProductiveCard/ExpressiveCard (ibm-products #9308, ADR 0007 proposed) | vs IBM Products ProductiveCard/ExpressiveCard (I-list) · **declined** |
| O6 | `preview_Layout`, `preview_Text` (+ direction) | layout density and text direction primitives | RTL or density needs · **declined** |
| O7 | TreeView | hierarchical data | platform has tree data · **included** |
| O8 | ClassPrefix / IdPrefix | custom CSS/id prefix, multiple Carbon instances | D5 · **declined** |
| O9 | `@carbon/ai-chat` (+ components) and `preview__ChatButton` | full AI chat surface | caps `@carbon/web-components <3.0.0`, which conflicts with the v12 rule until upstream widens it · **included** |
| O10 | `preview__Coachmark` family | guided tours, next-generation Coachmark | in addition to Labs first-time-orientation (I44) · **included** |
| O11 | InterstitialScreen, `previewCandidate__Guidebanner`, `previewCandidate__GetStartedCard`, Checklist, Cascade, `previewCandidate__InlineTip` | onboarding set | onboarding scope · **included** |
| O12 | OptionsTile | expandable settings tiles | settings UX · **declined** |
| O13 | ScrollGradient | scroll-edge gradient | needs canary opt-in `pkg.component.ScrollGradient = true` · **included** |
| O14 | `preview__AddSelect` (+ Single/MultiAddSelect) | entity picker | entity-picker UX · **included** |
| O15 | `previewCandidate__ConditionBuilder` | rule and filter builder | advanced filtering needs · **included** |
| O16 | `previewCandidate__Toolbar`, `SearchBar`, `Decorator`, `TruncatedList`, `NonLinearReading` | assorted previewCandidate components | preview policy (S5) · **included** |
| O17 | AboutModal | product "about" dialog | · **declined** |
| O21 | WC-only Labs: `@carbon-labs/wc-wysiwyg`, `wc-empty-state`, `wc-ai-tag`, `wc-global-header` | rich-text editor and others | treatment per package in 2.6 (V3 treatment table) · **resolved by the Labs rule, see 2.6** |
| O22 | `@carbon/echarts-theme` | Carbon theme for Apache ECharts | chart types Carbon Charts lacks · **included**, shipped as the `@afframe/ui/echarts` import path with Apache ECharts (`[H]` 2026-09-24, "6 - a"; `consumption.md` section 1) |
| O23 | carbon-mcp | Carbon MCP server for AI-assisted development | IBMid-gated access · **declined** |
| O24 | devtools browser extension, `@carbon/icons-motion` | developer inspection, animated icons | polish · devtools **included**; `@carbon/icons-motion` **out** (`[H]` 2026-09-24, "4 - a": 2.3.0, last published 2024-04-03, peers React 16 or 17 only) |
| O25 | carbon-for-products-design-kit | IBM Products components in Figma | GOALS G · **included** |
| O26 | Labs reference packages: `@carbon-labs/react-plane-stack-3d`, `primitives`, `mdx-components`, `network-graph` | 3D stack, headless primitives, docs MDX, graph viz | React packages fall under the Labs rule (V3 row 1a; `sources/round3/labs-tech.json`) · **resolved: mdx-components included (2.5), plane-stack-3d out (S20), primitives transitive, network-graph out (dead)** |
## 4. Exclude [P]

| # | Group | Items | Reason |
|---|---|---|---|
| X1 | Other frameworks | `@carbon/web-components` (except as ai-chat peer, and for any WC-only Labs item wrapped per 2.6), carbon-components-angular/vue/svelte, icons/pictograms for Svelte/Angular, `@carbon/charts-angular/vue/svelte`, `@carbon/ibm-products-web-components`, carbon-react-native, Labs `wc-*` twins of React packages, Gatsby theme/starter | `[H]` React only |
| X2 | Deprecated ibm-products | all 35 unprefixed + 9 prefixed deprecated exports (catalog 4.2), incl. Datagrid, PageHeader (legacy), Edit* except EditInPlace, CreateModal, CreateSidePanel, FilterPanel family, Nav, StatusIcon, StatusIndicator, HTTPError*, DescriptionList, Decorator* (legacy), ImportModal, ExportModal, RemoveModal, APIKeyModal, StringFormatter, UserProfileImage, EmptyStateV2, ComboButton (ibm-products), `previewCandidate__Coachmark*`, `previewCandidate__DataSpreadsheet`, `previewCandidate__DelimitedList`; Datagrid hooks and children of deprecated parents | deprecated in source (V table) |
| X3 | Deprecated or alias @carbon/react names | `preview_OverflowMenuV2`, `preview_Pagination`/`PageSelector`, `preview__Slug*`, `preview__AiSkeleton*`, `preview__Fluid*`, `preview_FeatureFlags`, all `unstable_*` names, `TableSlugRow` | deprecated, removed in v12, or aliases of stable names |
| X4 | Deprecated flags | `enable-experimental-*`, `enable-css-custom-properties`, `enable-v11-release` | superseded or bookkeeping |
| X5 | Archived and legacy repos | carbon-components-react, carbon-addons-* (cloud, beta, catalog, boilerplate), carbon-web-components, incubator, toolkit, carbon-themes, carbon-elements, carbon-upgrade, tailwind-preset-carbon, carbon-v11, and the other archived repos (35 in `org-repos.json`) | archived |
| X6 | Superseded extensions | carbon-addons-iot-react, ibm-security, carbon-addons-data-viz-react, carbon-utils-position, `@carbon/cli-plugin-stylelint`, carbon-vega-theme, carbon-nextjs-template | no maintainer, superseded, stale |
| X7 | Marketing-only | carbon-for-ibm-dotcom code and design kit, design-language-website, carbon-day-microsite | marketing; ideas reused as concept only (6.4) |
| X8 | IBM-internal and org admin | insights, platform, sync, uptime, .bob, .github, action-ibmcloud-cf, carbon-dco, ibm-cdai, team-assets, okrs, carbonated | internal |
| X9 | Dead Labs experiments | ai-extended-button, ai-feedback, ai-prompt-tuning, ai-ux-control, `network-graph` (last published 2024-06-27), react-split-panel (deprecated), example-button scaffolds; `@carbon-labs/ai-chat` is out through the overlap rule, not as superseded (2.6; V3 row 2e) | abandoned, deprecated or scaffold (V3 row 1b) |
| X10 | Design tools not in use | carbon-sketch-assistant, framerfx kit | `[H]` Figma kit in use (GOALS 2) |
| X11 | Declined optional items | O4 `preview__Dialog`, O5 `preview__Card`, O6 `preview_Layout`/`preview_Text`, O8 ClassPrefix/IdPrefix, O12 OptionsTile, O17 AboutModal, O23 carbon-mcp | `[H]` declined 2026-09-24 (O4 to O6 are not v12 defaults: 1.5; V3 row 8) |
| X12 | Declined in round 3 | `@carbon-labs/wc-wysiwyg` (S14), `@carbon-labs/react-plane-stack-3d` (S20) | `[H]` 2026-09-24 |
| X13 | Declined after the review | `@carbon-labs/react-style-picker` (I42, cannot be installed), `@carbon/icons-motion` (O24, React 16/17 only), wrapping `@carbon-labs/wc-resizer` (S16, second React copy) | `[H]` 2026-09-24 |

## 5. Improve [P]

| # | Item | What Afframe UI would do | Why | Carbon source |
|---|---|---|---|---|
| M1 | Data grid | Afframe table on TanStack Table + core DataTable markup: sorting, filtering, pagination, selection, batch actions, row actions, expansion, nested rows, sticky columns, resizing, column customization, inline edit, virtualization | Datagrid is deprecated and removed in ibm-products v4; no successor ships (V row 6b; carbon-reference.md 5.2) | tanstack-carbon `react/*` (reused, S4), DataTable |
| M2 | Filter panel | Afframe filter panel and flyout on core Accordion, Checkbox, Search, Tag | ibm-products FilterPanel is deprecated with no replacement | tanstack-carbon filterPanel/filterFlyout; https://carbondesignsystem.com/patterns/filtering/ |
| M3 | Create and edit flows in modal and side panel | Afframe CreateModal, CreateSidePanel, EditSidePanel, EditTearsheet, EditFullPage built on Modal, SidePanel, Tearsheet | deprecated in ibm-products; source names patterns or nothing | community create-flows and edit patterns |
| M4 | Delete, import, export, API key dialogs | Afframe RemoveDialog, ImportDialog, ExportDialog, ApiKeyDialog on Modal + FileUploader | deprecated components; replacements are patterns only | `src/patterns/DeleteAndRemove`, `ImportAndUpload`, `ExportModal`, `GenerateAnAPIKey` |
| M5 | Status | one Afframe status indicator on `preview__IconIndicator`/`ShapeIndicator` + Tag | StatusIcon/StatusIndicator deprecated; replacement is preview | https://carbondesignsystem.com/patterns/status-indicator-pattern/ |
| M6 | Description list | Afframe key/value list on StructuredList or ContainedList | DescriptionList deprecated, no replacement | catalog 4.2 |
| M7 | Alias cleanup | Afframe exports only stable names (`Fluid*`, `AILabel`, `AISkeleton*`, `FeatureFlags`) and wraps the genuinely preview components behind Afframe names so a later rename stays internal | 31 of 47 prefixed suffixes are aliases; prefixes change on promotion (V row 5d) | `R/es/index.js:255` |
| M8 | Migrated components | one Afframe import path for Tearsheet, SidePanel, NotificationsPanel, FullPageError, UserAvatar, TagOverflow, EditInPlace, BigNumber, TruncatedText, Coachmark, Resizer, PageHeader, so the ibm-products -> @carbon/react move at v12 is internal | 17 components change package at v12 (fact 7) | product-migrated-components.mjs |
| M9 | TypeScript gaps | complete, exported prop types for every Afframe component; no `any` in exports | Carbon types are incomplete, README advises `skipLibCheck` (carbon-reference.md 3.4) | GOALS C, section 5 |
| M10 | Prefix and style alignment | one Sass build that sets `enable-v12-release` (if option B) for both `@carbon/styles` and ibm-products Sass, and one prefix policy for `cds` and `c4p` | precompiled CSS is v11-styled; ibm-products uses its own `c4p` prefix (C Setup; V row 2c) | ibm-products `scss` entry points |
| M11 | Canary handling | Afframe sets `pkg` once (enable components it ships, e.g. ScrollGradient, TagOverflow) so consumers never touch it | canary mechanism is deprecated but still gates some exports | `P/lib/global/js/package-settings.js` |
| M12 | Business formatting | currency and amount input/display, locale-aware number and date formatting, date-range presets | not in Carbon; StringFormatter deprecated | GOALS C `[P]` |
| M13 | Charts theming | Afframe chart wrappers bound to Afframe tokens and theme zones | charts follow Carbon themes; Afframe brand theme (D9) | `@carbon/charts-react` |
| M14 | Global header gaps | environment switcher, logout banner/tile and help menu composed on UI Shell (`HeaderGlobalAction`, `HeaderPanel`) + `@carbon-labs/react-ui-shell` | `wc-global-header` overlaps only partly; its React wrapper is bound to IBM backend endpoints (2.6; V3 row 3b) | UI Shell (I13), `react-ui-shell` (I37) |
| M15 | Tag with colored start-edge accent | clickable tag with tooltip and a colored start-edge accent on `OperationalTag` + `Tooltip` | `wc-ai-tag` gap; no runtime React wrapper ships (2.6; V3 rows 3a, 5a) | `OperationalTag`, `Tooltip` |
| M16 | Controllable open for the date picker | a controlled `open` prop (programmatic open/close) on the date picker | only `wc-date-picker` has it; React `DatePickerProps` has no `open` (2.6; V3 row 2b) | I38 / `preview__DatePicker` (O3) |
| M17 | DataTable toolbar menu under v12 | toolbar menu built with `MenuItem`/`MenuItemDivider` children and `label` instead of `TableToolbarAction` (workaround for #23260; not runtime-tested) | `TableToolbarAction` breaks under `enable-v12-overflowmenu` (1.5; V3 rows 9a to 9c); decision S18 | DataTable `TableToolbarMenu`, `Menu` |
| M18 | AI chat element types | Afframe renderers for Labs ai-chat element types missing from `@carbon/ai-chat` (chart, diagram, formula, carousel and others) | Labs ai-chat overlaps `@carbon/ai-chat` only partly; the element-by-element comparison was not done (unverified) (2.6; V3 row 2e) | `@carbon-labs/ai-chat` element folders, `@carbon/ai-chat` (O9) |
| M19 | Vendored v12 components | Copy the v12 source of the components moving into core (17 since 2026-09-24: Tearsheet, SidePanel, NotificationsPanel and the rest) from carbon `main`; re-sync until v12 ships; then replace with `@carbon/react` imports | `[H]` S15: v12 versions from day one; done when the S15 acceptance check passes | https://github.com/carbon-design-system/carbon/blob/main/packages/react/product-migrated-components.mjs; Apache-2.0 section 4 applies |
| M20 | Temporal polyfill for the date picker | Ship or require a `Temporal` polyfill so `@carbon-labs/react-date-picker` works in browsers without native `Temporal` | `[H]` S19 (V3 row 7) | `@carbon-labs/primitives` needs a global `Temporal` |
| M21 | Wrapped Labs web components | React wrappers for any Labs web component wrapped later (none today: `wc-resizer` waits for a Labs update, S16), with typed props and events, plus the scoped v12 flag element | The force-v12 rule (1.5) | `@lit/react` createComponent |

## 6. Build new [P]

**`[H]` 2026-09-24:** each item below is approved by Hleb one by one before it is built, and building new is the last milestone. Status of every row: awaiting approval.

Legend for the last column: ready-made = a non-deprecated Carbon component does it; adapt = working Carbon or starter code to adapt (license permitting); build = only guidance exists.

### 6.1 Templates (pages)

| # | Item | Purpose | Built from (Carbon sources) | Ready-made / adapt / build |
|---|---|---|---|---|
| B1 | App shell | header, side nav, switcher, profile panel, footer, theme zone, skip link | UI Shell, SideNav, Switcher, HeaderPanel; carbon-react-router-starter CommonHeader/Nav/ProfilePanel (Apache-2.0); /patterns/global-header/ | adapt |
| B2 | Dashboard | KPI row, charts, filters via URL params | carbon-react-router-starter `pages/dashboard`; `@carbon/charts-react`; BigNumber; /data-visualization/dashboards/ | adapt |
| B3 | List / detail | table page with detail in side panel or full page | M1 table, SidePanel, `preview__PageHeader`, Tabs | build |
| B4 | Table page | page header + filter bar + table section + pagination | M1, M2, Pagination | build (from tanstack-carbon patterns) |
| B5 | Settings | grouped settings with tabs or side nav, save state | Tabs/TabsVertical, Form, Toggle, Accordion, Saving (deprecated on ibm-products main, #9888), OptionsTile (optional) | build |
| B6 | Create flow, full page | multi-step create | CreateFullPage(+Step) | ready-made in 2.99.0; deprecated on ibm-products main (#9900), IBM's replacement is example code |
| B7 | Create flow, tearsheet | multi-step create in tearsheet | CreateTearsheet(+Step) | ready-made in 2.99.0; deprecated on ibm-products main (#9900), IBM's replacement is example code |
| B8 | Create / edit, side panel | short create and edit | SidePanel + Form (M3) | build |
| B9 | Create / edit, modal | minimal create, confirm | Modal/ComposedModal + Form (M3) | build |
| B10 | Edit flow, full page and tearsheet | edit with consequences messaging | Tearsheet, Form, EditInPlace (M3); edit pattern | build |
| B11 | Wizard | generic stepper page | ProgressIndicator, CreateFullPage steps | adapt |
| B12 | Login / auth | sign-in, password reset, MFA step | TextInput, PasswordInput, Button, Link; /patterns/login-pattern/; `@carbon-labs/react-registration-flow` (optional) | build |
| B13 | Error pages 403 / 404 / 500 | full-page errors | FullPageError (codemod path from HTTPError*); starter NotFound | ready-made |
| B14 | Empty states | first use, no data, not found, unauthorized, error | EmptyState family; /patterns/empty-states-pattern/ | ready-made |
| B15 | Onboarding | first-run and guided tour | InterstitialScreen, `preview__Coachmark`, Guidebanner (O10, O11) | adapt |

### 6.2 Sections

| # | Item | Purpose | Built from | Ready-made / adapt / build |
|---|---|---|---|---|
| B16 | Page header | title, breadcrumb, actions, tabs | `preview__PageHeader` (@carbon/react or ibm-products, S6 in `goals.md` section 6) | ready-made (preview) |
| B17 | Filter bar | search, quick filters, filter flyout, applied-filter tags | Search, Dropdown, Tag, M2 | build |
| B18 | KPI / big-number row | 3 to 6 headline numbers with trend | `previewCandidate__BigNumber`, Tile, starter DashboardNumberTiles | adapt |
| B19 | Data table section with batch actions | toolbar, batch action bar, table, pagination | DataTable TableToolbar/TableBatchActions, tanstack-carbon batch-actions | adapt |
| B20 | Form sections | sectioned forms with validation and read-only mode | Form, FormGroup, Fluid*; /patterns/forms-pattern/, read-only-states | build |
| B21 | Activity / audit feed | timeline of changes with actor, time, diff | StructuredList or ContainedList, UserAvatar, Tag | build |
| B22 | Notifications panel | notification center in header | NotificationsPanel, NotificationsEmptyState | ready-made |
| B23 | AI chat panel | assistant side panel | `@carbon/ai-chat` (O9) or build on SidePanel + AILabel + ChatButton; community chatbot pattern | adapt (if O9) / build |
| B24 | Detail summary | key/value summary of a record | StructuredList (M6), Tag, TagSet | build |

### 6.3 Blocks

| # | Item | Purpose | Built from | Ready-made / adapt / build |
|---|---|---|---|---|
| B25 | Table patterns | ai-label, batch-actions, column-alignment, customize columns, nested rows (static and dynamic, selectable), editable cells, filter flyout, filter panel, global filter, infinite scroll, pagination, resizing, row actions, row click, row settings, row expansion, sortable, sticky columns, tabbed header, virtual | tanstack-carbon `react/*` via generate-pattern; TanStack version per D7 | adapt (S4) |
| B26 | Cards | content, action, stat cards | ProductiveCard, ExpressiveCard, Tile, `preview__Card` (O5) | ready-made |
| B27 | Stat tiles | single KPI with trend and sparkline | BigNumber, Tile, `@carbon/charts-react` | adapt |
| B28 | Charts | line, bar, donut, gauge, meter in Afframe theme | `@carbon/charts-react` (M13) | ready-made |
| B29 | Empty-state blocks | inline empty states for tables, panels, search | EmptyState variants | ready-made |
| B30 | Theme toggle | light/dark switch | `carbon/examples/light-dark-mode`, GlobalTheme, `react-theme-settings` (I41) | adapt |
| B31 | Status badge | workflow status | M5 | build |
| B32 | Amount and currency | input and display (GOALS C `[P]`) | NumberInput + M12 | build |

### 6.4 Marketing sections (optional, concept only)

Only if a marketing or landing surface enters scope. No code from `carbon-for-ibm-dotcom` (Lit web components; React package discontinued). Built from core components, following the ibm.com naming.

| # | Item | Purpose | Concept source | Ready-made / adapt / build |
|---|---|---|---|---|
| B33 | Hero (leadspace) | top-of-page hero with CTA or search | leadspace, leadspace-with-search | build |
| B34 | Content and feature sections | text + media, feature grid | content-block family, feature-section; starter FeaturesSection/FeatureTile | build (adapt starter sections) |
| B35 | Card sections | card grids and carousels | card-group, card-section-* | build |
| B36 | CTA section | call to action band | cta-section | build |
| B37 | Pricing table | plan comparison | pricing-table | build |
| B38 | Testimonials, logo grid | social proof | callout-quote, quote, logo-grid | build |

## 7. Decisions this scope creates

S1 to S20, with status: `goals.md` section 6.
