# P · Which `preview__PageHeader`: core vs IBM Products

Scope: code comparison of the two `preview__PageHeader` implementations for Afframe UI (scope.md S6, I18, I30, B16). Facts and options only, no pick.

Evidence conventions (all read 2026-09-24):

- `C:` = carbon repo at commit `61b90a427aab8fde0ba3356a8ed07d19f179517d` (main), base URL `https://github.com/carbon-design-system/carbon/blob/61b90a427aab8fde0ba3356a8ed07d19f179517d/`
- `P:` = ibm-products repo at commit `4390dd3c8540279f610ec304bfb57fba4122b0fb` (main), base URL `https://github.com/carbon-design-system/ibm-products/blob/4390dd3c8540279f610ec304bfb57fba4122b0fb/`
- `R:` = installed `@carbon/react` 1.117.0 at `<npm pack>/rt/node_modules/@carbon/react`
- `IP:` = installed `@carbon/ibm-products` 2.99.0 at `<npm pack>/rt/node_modules/@carbon/ibm-products`
- Core source dir: `C:packages/react/src/components/PageHeader/`. IBM Products source dir: `P:packages/ibm-products/src/components/PageHeader/next/`.

## 1. Relationship

**Core is the origin, IBM Products forked it, core deprecated its copy, and core is now taking the IBM Products version back for v12.**

| Date | Event | Evidence |
|---|---|---|
| 2025-03-26 | Core ships the first PageHeader (initial components, stories, styles, tests) | carbon PR #18788 |
| 2025-06-11 to 2025-07-07 | Carbon decides PageHeader belongs in ibm-products ("PageHeader: Migrate existing work to ibm-products library", closed 2025-07-07). Core expand/collapse PR #19650 (opened 2025-06-13) closed unmerged 2025-06-16 | carbon #19634, #19650 |
| 2025-07-07 | ibm-products adds "new experimental PageHeader component"; expand/collapse follows 2025-07-16 | ibm-products PR #7733, #7815 (`git log --reverse` on `next/`) |
| 2026-03-30 | Carbon issue "Deprecate PageHeader in `@carbon/react`" | https://github.com/carbon-design-system/carbon/issues/21926 (closed 2026-05-12) |
| 2026-05-12 | Core component and docs deprecated, pointing to ibm-products; stories replaced by a "moved" notice | carbon PR #22120; `C:packages/react/src/components/PageHeader/PageHeader.tsx:7-10,40-50`; `index.tsx:7-10`; `PageHeader.mdx:1-14`; `PageHeader.stories.js` (1 story, "has moved") |
| 2026-05-12 | Codemod `ibm-products-update-page-header` (core imports to ibm-products) ships with the same PR | carbon PR #22120; `C:packages/upgrade/src/upgrades.js:750-779` |
| 2026-06-29 | Codemod `ibm-products-update-page-header-composable` (legacy ibm-products PageHeader to `preview__PageHeader`) | carbon PR #22426; `C:packages/upgrade/src/upgrades.js:780-790` |
| 2026-07-13 (dev leads) | v12 plan: migrate ibm-products components into core, "Option 2: Broader Migration" chosen; ibm-products goes to support and maintenance mode | https://github.com/carbon-design-system/carbon/issues/22572 (milestone v12-alpha, open) |
| 2026-07-20 | ibm-products deprecates its legacy monolithic `PageHeader`, points to `preview__PageHeader` | ibm-products PR #9641 (`3abd2b08`); `P:packages/ibm-products/src/components/PageHeader/next/PageHeader.mdx:797-809` |
| 2026-08-06 | "Migrate `PageHeader` (composable) from ibm-products to `@carbon/react`", "Target status: Stable" | https://github.com/carbon-design-system/carbon/issues/22929 (open, no milestone); listed as row 18 "In Review" in epic https://github.com/carbon-design-system/carbon/issues/22655 (v12-alpha) |
| 2026-09-03 | PR "feat(react): v12 migrate PageHeader from carbon-for-ibm-products": renames today's core folder to `PageHeaderDeprecated/`, copies the ibm-products composable version into `packages/react/src/components/PageHeader/` and styles into `packages/styles/scss/components/page-header/_page-header-next.scss`. Body says "as a **preview** component", export block commented out "uncomment in v12" | https://github.com/carbon-design-system/carbon/pull/23209 (open, approved by 2 reviewers 2026-09-14, 4 failing checks, +8,040 / -720, 36 files, not merged as of 2026-09-24) |

Derivation evidence in code: both share the same sub-component names and aliases (`Root`, `BreadcrumbBar`, `Content`, `ContentPageActions`, `ContentText`, `HeroImage`, `TabBar`), the same `BreadcrumbBar` props (`border`, `renderIcon`, `contentActions`, `contentActionsFlush`, `pageActions`, `pageActionsFlush`), the same `createOverflowHandler`-into-`MenuButton` page-actions pattern, and identical test `describe` names ("PageHeader.Root component api", "PageHeader.TabBar component with tags", "Overflow functionality"): `C:.../PageHeader-test.js:136,523,694` vs `P:.../next/PageHeader.test.jsx:121,769,941`. IBM Products does not import core's PageHeader (section 4).

**v12 plan status (including negatives the brief asked for):**

- `C:docs/migration/v12.md`: no mention of PageHeader (grep for `pageheader|page-header|page header`: 0 hits). Confirmed independently in `round3/V3-verify.md` row 8.
- `C:packages/react/product-migrated-components.mjs:14-62` on main: PageHeader is **not** listed. It is added to both `productMigratedStoryGlobs` and `excludeProductsComponents` only in PR #23209.
- Milestones 101 (v12-alpha), 102 (v12-beta), 103 (v12-rc.0), 104 (v12-stable), all issues, state=all: no issue titled or describing PageHeader directly. PageHeader appears only via the epics #22572 and #22655 (both v12-alpha). #22929 itself has no milestone.
- No feature flag touches either PageHeader: `C:packages/feature-flags/feature-flags.yml` has no page-header flag; core `PageHeader.tsx` reads no flag (grep `useFeatureFlag|enable-`: 0 hits).
- ibm-products' own promotion plan (preview to stable, feature flag for the switch) is open since 2025-09-16: https://github.com/carbon-design-system/ibm-products/issues/8253.
- **Conflict, not resolved here:** #22929 says the core target is "Stable"; PR #23209 says it lands as "preview" with exports commented out until v12.

**Which one Carbon positions as the future:** the IBM Products composable one. Core's copy is `@deprecated` in source and docs (`C:.../PageHeader.tsx:7-10`), and Carbon's v12 work imports the IBM Products code, not core's current code, into core.

**Naming trap after #23209:** core's `preview__PageHeader` and `unstable__PageHeader` keep pointing at the old deprecated code (`PageHeaderDeprecated`). The new component is planned as flat named exports (`PageHeader`, `PageHeaderContent`, `PageHeaderBreadcrumbBar`, ...), not as a `preview__` namespace (PR #23209 diff of `packages/react/src/index.ts`). "`preview__PageHeader` from `@carbon/react`" will keep meaning the deprecated one.

**Codemod mismatch (exit risk for option a):** `ibm-products-update-page-header` rewrites `preview__PageHeader` and `PageHeaderBreadcrumbBar`, `PageHeaderContent`, etc. from `@carbon/react` into top-level `PageHeader`, `PageHeaderBreadcrumbBar`, ... from `@carbon/ibm-products` (`C:packages/upgrade/transforms/ibm-products-update-page-header.js:9-41`; fixture `__testfixtures__/ibm-products-update-page-header.output.js`). In 2.99.0, top-level `PageHeader` is the deprecated legacy monolith (`IP:lib/components/PageHeader/index.d.ts` exports only `PageHeader` from `./PageHeader`), and `PageHeaderBreadcrumbBar` etc. are not top-level exports (grep of `IP:lib/components/index.d.ts`: 0 hits; only `export * as preview__PageHeader from './PageHeader/next'` at line 53). The codemod output does not resolve to the composable component on 2.99.0; it only makes sense for a future ibm-products or core release where `PageHeader` is the composable one.

## 2. Features

### Sub-components

| Sub-component | Core 1.117.0 | IBM Products 2.99.0 |
|---|---|---|
| Root (`PageHeader`) | yes, `children`, `className` only (`C:.../PageHeader.tsx:57-77`) | yes, plus `onContentFullyCollapsed`, `onTitleClipped`, `onContentActionsClipped`, `fullWidthGrid` (`boolean \| 'xl'`), `narrowGrid` (`P:.../next/PageHeader.tsx:64-89`) |
| BreadcrumbBar | yes (`:85-176`) | yes, actions may also be render functions receiving observer state, plus `actionsAriaLabel` (`PageHeaderBreadcrumbBar.tsx:22-59`) |
| Content | yes, `title: string` required, `renderIcon`, `contextualActions`, `pageActions` (`:178-325`) | yes, `title: ReactNode` (string auto-truncated via `TruncatedText`), `titleAs`, `titleTruncate`, render-function `pageActions` (`PageHeaderContent.tsx:27-67`) |
| ContentPageActions | yes, `menuButtonLabel`, `actions` (`:327-462`) | yes, same props (`PageHeaderContentPageActions.tsx:22-39`) |
| ContentText | yes, `subtitle` (`:464-524`) | yes, plus `subtitleAs` (`PageHeaderContentText.tsx:18-35`) |
| HeroImage | yes (`:526-574`) | yes, plus `objectFit` (`PageHeaderHeroImage.tsx:19-36`) |
| TabBar | yes, `tags?: TagItem[]` data array (`:576-709`) | yes, `tags?: ReactNode`, `scroller?: ReactNode`, `disableStickyTabBar` (`PageHeaderTabBar.tsx:19-28`) |
| ScrollButton | no | yes, collapse/expand toggle, `collapseText`, `expandText` (`PageHeaderScrollButton.tsx:16-100`) |
| TitleBreadcrumb | no | yes, title shown in breadcrumb bar once clipped (`PageHeaderTitleBreadcrumb.tsx`) |
| BreadcrumbOverflow | no | yes, wraps `Breadcrumb`, hides overflowing items, `renderOverflowBreadcrumb(hidden)` render prop (`PageHeaderBreadcrumbOverflow.tsx:20-24`) |
| BreadcrumbPageActions | no | yes, icon-button actions with overflow menu, `actions[]`, `overflowMenuLabel`, `buttonSize`, `buttonKind` (`PageHeaderBreadcrumbPageActions.tsx:20-66`) |
| TagOverflow | no (tags overflow is built into TabBar) | yes, composable, `renderOverflowTag`, `renderPopoverContent` (`PageHeaderTagOverflow.tsx:20-32`) |

Totals: core 7 components + 7 aliases = 14 (`C:.../index.tsx:11-27`); IBM Products 12 + 12 = 24 (`P:.../next/index.ts:8-33`).

### Behaviours

| Behaviour | Core | IBM Products |
|---|---|---|
| Collapse on scroll | no (core PR #19650 closed unmerged) | yes, three `IntersectionObserver`s for content, title, content actions with callbacks (`P:.../next/PageHeader.tsx:146-215`); `ResizeObserver` writes offset CSS vars for sticky positioning (`:122-140`) |
| Sticky tab bar | no (grep `sticky` in core `PageHeader.tsx` and `_page-header.scss`: 0 hits) | yes, on by default, `disableStickyTabBar` opt-out (ibm-products PR #9365) |
| Manual collapse button | no | `ScrollButton` |
| Title truncation | `DefinitionTooltip` when ellipsis detected (`C:.../PageHeader.tsx:233-263`) | `TruncatedText` from ibm-products (PR #9742), `titleTruncate` lines |
| Page actions overflow | `createOverflowHandler` into `MenuButton` (`:388-429`) | same pattern (`PageHeaderContentPageActions.tsx:80-157`) |
| Breadcrumb overflow | none; you pass a plain `Breadcrumb` | `BreadcrumbOverflow` with local `overflowHandler.ts` (255 lines) |
| Breadcrumb bar icon actions | pass your own nodes | `BreadcrumbPageActions` with built-in overflow |
| Tags overflow | `useOverflowItems` + `Popover` + `OperationalTag` "+N" (`:606-690`), data-driven | `TagOverflow` render props, children-driven |
| Hero image | `AspectRatio`, shown only at `lg` via `useMatchMedia` (`:550-551`) | `AspectRatio`, `breakpoints`, `objectFit` |
| Responsive | `lg` media query for hero; overflow handlers | same, plus responsive tabs/tags/collapse button (PR #9278), breadcrumb mobile fixes (PR #9072) |
| Grid width | fixed Carbon grid | `fullWidthGrid`, `narrowGrid` (PR #9833) |
| Deprecation side effect | every sub-component calls `deprecateComponent` on mount (`C:.../PageHeader.tsx:43-50,63,131,221,353,484,541,597`). It warns once per component name and does not throw (`R:lib/prop-types/deprecateComponent.js`); v12 flags do not change this (the "throw under `enable-v12-release`" rule in `C:docs/migration/v12.md:66-73` is about label-content validation only) | none |

Known gaps in IBM Products vs its own deprecated legacy PageHeader (title skeleton/loading, EditInPlace title, etc.): https://github.com/carbon-design-system/ibm-products/issues/9804 (open; G3 done in PR #9832, G4 "no change needed", rest moved to icebox per maintainer comment 2026-08-18). Core lacks the same features.

## 3. Code quality

| | Core | IBM Products |
|---|---|---|
| Language | TypeScript, single file `PageHeader.tsx` 758 lines + `index.tsx` 36 | TypeScript, 16 files, 2,226 lines under `next/` (`.tsx`/`.ts`, excluding the Figma file and stories) |
| Prop types | TS interfaces + PropTypes | TS interfaces + PropTypes (PR #23209 strips PropTypes for core, per carbon #22384) |
| Unit tests | `PageHeader-test.js` 866 lines, 46 tests in 12 describes: deprecation warnings, exports, each sub-component API, tags overflow | `PageHeader.test.jsx` 2,136 lines, 91 tests in 31 describes: all of core's areas plus scroll button, breadcrumb overflow, observer callbacks, render-prop observer state, sticky opt-out, breadcrumb page actions, utils, tag overflow, title breadcrumb (PR #9820 added tests 2026-08-21) |
| Axe / a11y in unit tests | 0 axe checks | 0 axe checks; a11y fix PRs #9519, #9819 |
| AVT e2e | `C:e2e/components/PageHeader/PageHeader-test.avt.e2e.js` 24 lines, single test, `test.skip` | `P:e2e/components/PageHeader/PageHeader-test.avt.e2e.js` 340 lines, but every test targets `deprecated-pageheader--*` stories (legacy). The preview has no AVT coverage |
| Stories | 1 (a "moved" notice), `Deprecated/preview__PageHeader` | 9 in `Preview/PageHeader` (Default, ContentWithIcon, ContextualActions, HeroImage, ContextualActionsAndPageActions, TabBarWithTabsAndTags, Compact, CustomRenderWithCallbacks, WithDisabledStickyTabBar) |
| Docs | `PageHeader.mdx` 14 lines, "has moved" | `next/PageHeader.mdx` 1,016 lines incl. migration guide from legacy |
| Figma Code Connect | no | `next/PageHeader.figma.tsx` 292 lines |
| Styles size | 199 lines | preview section 556 lines (`_page-header.scss:714-1269`) of a 1,269-line file shared with legacy |

## 4. Dependencies

**Core** (`C:.../PageHeader.tsx:11-38`): React, `prop-types`, `classnames`, `@carbon/layout` (breakpoints), `@carbon/utilities` (`createOverflowHandler`), and core internals `usePrefix`, `useMatchMedia`, `useOverflowItems`, `useId`, `useIsomorphicEffect`, `deprecateComponent`, plus components `Text`, `MenuButton`, `MenuItem`, `DefinitionTooltip`, `AspectRatio`, `Tag`, `OperationalTag`, `Popover`, `PopoverContent`, `Grid`, `Column`.

**IBM Products** (import lines of each `next/*.tsx`):

- From `@carbon/react` public API only: `Button`, `OverflowMenu`, `MenuItem`, `MenuButton`, `FeatureFlags`, `Popover`, `PopoverContent`, `Grid`, `Column`, `Section`, `Heading`, `AspectRatio`, `BreadcrumbItem`, `IconButton`, `unstable_Text` (preview Text, `PageHeaderContentText.tsx:10`), icons `ChevronUp`.
- `@carbon/utilities` (`createOverflowHandler`), `@carbon/layout`.
- ibm-products internals: `pkg` settings (prefix `c4p`), `../PageHeaderUtils` (`blockClass`, shared with the legacy component), `global/js/hooks` (`useResizeObserver`, `useIsomorphicEffect`), `pconsole`, `TruncatedText` (another ibm-products component, itself on the v12 migration list).
- **Does not depend on core's PageHeader**: no import of `preview__PageHeader` or `components/PageHeader` from `@carbon/react`.
- Peer: `@carbon/react ^1.115.0` (`P:packages/ibm-products/package.json:128`), which excludes 2.x (scope.md fact 10).
- Note on O6: Hleb declined `preview_Text` for Afframe's own API; IBM Products uses it internally for the subtitle. Core's deprecated version also uses `Text` (`C:.../PageHeader.tsx:24`).

## 5. v12 fit

- Neither component is switched, replaced, or mentioned by `enable-v12-release` (section 1; V3-verify row 8).
- Core: uses `MenuButton` (already Menu-based), no `OverflowMenu`, reads no flag. It is fine under v12 flags technically, but it is the code that PR #23209 renames to `PageHeaderDeprecated` and that #21926 plans to remove "once Telemetry shows 0 usage, or as part of #15803". #15803 ("v12") was closed 2026-07-21 without that removal, and PR #23209 keeps the code exported as `PageHeaderDeprecated`, so no removal date is set.
- IBM Products: `BreadcrumbPageActions` self-scopes `<FeatureFlags enableV12Overflowmenu>` and passes `MenuItem` children (`PageHeaderBreadcrumbPageActions.tsx:121-131`), so it is v12 composition already, whatever the app flag. PR #23209 keeps that wrapper in core.
- IBM Products `BreadcrumbOverflow` leaves the overflow menu to the consumer's `renderOverflowBreadcrumb`. Both repos' stories render `OverflowMenu` + `OverflowMenuItem` there (`P:.../next/PageHeader.stories.jsx:164-171`; PR #23209 stories). That is the same breakage class as carbon #23260 (legacy `OverflowMenuItem` under `enable-v12-overflowmenu`), so Afframe's wrapper must pass `MenuItem` children.
- IBM Products CSS is compiled with v12 off, but Carbon elements inside it pick up v12 styling from the same Sass build (scope.md, S-sass-check.md).
- No open v12-labelled bug for either PageHeader: the only open issues labelled bug plus `version: 12` in carbon are #23260 and #13096 (`round3/W-v12-day-one.md:14`).

## 6. Maintenance

| | Core | IBM Products |
|---|---|---|
| Last commit touching the component | 2026-05-12 (`4ac71d0a9`, deprecation). Before that bug fixes 2026-03-07 and 2026-02-26 | 2026-09-02 (`2048b44f`, fullWidthGrid/narrowGrid); 2026-09-01 ReactNode title; 2026-08-21 a11y fixes and unit tests |
| Commits in 2026 | 8 (react + styles dirs) | 32 (`next/` + styles) |
| Styles last touched | 2025-06-06 (`C:packages/styles/scss/components/page-header`) | 2026-09-02 |
| Open issues | carbon #20971 (story controls, docs), #18744 (popover under PageHeader, older), plus the migration issues #22929, #22948 | ibm-products #9804 (missing features vs legacy), #8253 (promotion plan), #8048 and #8049 (a11y: regions and labelled actions region, low priority, React and WC), #4953 and #1073 (legacy era) |
| Direction | Deprecated, removal planned | Active; this code is what core imports for v12 |

## 7. Styling

- Core: `@carbon/styles`, `C:packages/styles/scss/components/page-header/_page-header.scss` (199 lines), in the global bundle (installed `@carbon/styles` `scss/components/_index.scss:65` `@use 'page-header'`). Class prefix `cds--page-header`.
- IBM Products: `@carbon/ibm-products-styles`, `P:packages/ibm-products-styles/src/components/PageHeader/_page-header.scss`, preview rules at lines 714-1269 under `c4p--page-header__next`. The same file `@use`s legacy ActionBar, BreadcrumbWithOverflow, TagSet and ButtonSetWithOverflow styles (lines 23-28), so including PageHeader styles also pulls those in.
- After #23209 (v12): styles move to `@carbon/styles` `page-header/_page-header-next.scss`, and the class prefix becomes `cds--page-header` (PR table "Static `blockClass = 'cds--page-header'`"). Any Afframe CSS overrides written against `c4p--page-header__next*` would need rewriting at that point.

## 8. Options

**(a) Core's `preview__PageHeader` (`@carbon/react` 1.117.0)**

- Consequences: no extra styles package for this component; `cds` prefix. You adopt code that is `@deprecated` in source and docs with a planned removal, and every sub-component logs a one-time deprecation warning in development. No collapse on scroll, no sticky tabs, no breadcrumb overflow, no title-in-breadcrumb, no grid width options. Last change 2026-05-12, no active feature work. At v12 the name `preview__PageHeader` stays bound to the deprecated code while the maintained PageHeader arrives under different names; moving over is a rewrite of Afframe's wrapper, and Carbon's own codemod targets names that do not resolve on ibm-products 2.99.0. Scope fact: scope.md X2 excludes ibm-products exports on the rule "deprecated in source"; core's `preview__PageHeader` is also deprecated in source (`C:.../PageHeader.tsx:7-10`). Whether X2's rule applies here is Hleb's call.

**(b) IBM Products' `preview__PageHeader` (`@carbon/ibm-products` 2.99.0)**

- Consequences: all 24 exports and the behaviours in section 2; actively maintained (last change 2026-09-02); 91 unit tests; this exact code is what Carbon is moving into core for v12 (PR #23209, approved, not merged). No new package: ibm-products is already included (scope.md I6). Adds the `c4p` prefix and the ibm-products styles for PageHeader, which also pull in 4 legacy component style partials. Still preview, no AVT coverage, open a11y issues #8048/#8049, missing legacy features per #9804. At v12: imports move from `@carbon/ibm-products` `preview__PageHeader.X` to `@carbon/react` named `PageHeaderX`, and the class prefix changes `c4p--page-header__next` to `cds--page-header`. ibm-products peers `@carbon/react ^1.115.0` (excludes 2.x, scope.md fact 10), so the switch to core's PageHeader has to land in the same step as Afframe's move to `@carbon/react` 2.x unless that peer widens first. The move needs to happen inside Afframe's wrapper (scope.md M8 pattern), and CSS overrides need to be prefix-agnostic or rewritten. Afframe's `renderOverflowBreadcrumb` must use `MenuItem`, not `OverflowMenuItem`.

**(c) Core's plus the missing parts built by Afframe**

- Missing parts and rough size, taken from IBM Products' own files: Root observers + sticky offsets + callbacks + grid options (about 200 of 359 lines in `PageHeader.tsx`), `ScrollButton` (100), `TitleBreadcrumb` (51), `BreadcrumbOverflow` (121), `BreadcrumbPageActions` (175), `TagOverflow` (125), `overflowHandler.ts` (255), `context.ts` (75), `utils.ts` (93), plus prop extensions on Content (`ReactNode` title, `titleAs`, `titleTruncate`), ContentText (`subtitleAs`), HeroImage (`objectFit`), BreadcrumbBar (render-function actions, `actionsAriaLabel`), TabBar (`disableStickyTabBar`, `scroller`, node tags). About 1,000 to 1,200 lines of TypeScript, about 350 extra SCSS lines on top of core's 199, and roughly 1,300 extra test lines to match IBM Products' coverage.
- Consequences: in practice this re-implements (or ports, Apache-2.0) IBM Products' component on top of a deprecated base. Afframe owns and maintains all of it, keeps the `cds` prefix, and keeps the core deprecation warnings unless it forks the core code too. At v12, Afframe's build diverges from the PageHeader Carbon ships in core, which is the IBM Products code, so Afframe carries a parallel implementation or migrates again.
