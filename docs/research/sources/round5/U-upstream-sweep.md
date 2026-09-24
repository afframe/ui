> Evidence copy of the upstream sweep of 2026-09-24 (one agent, Opus). Line numbers refer to commit `3090535`; the fixes it lists were applied in the next commits.

# Upstream sweep of the afframe/ui planning docs

**Date:** 2026-09-24. The last upstream check ran at 2026-09-24T09:56Z (`date -u`).
**Docs checked at:** commit `3090535` (2026-09-24T09:41:33Z, "docs: one decision register in goals.md, markers defined in README"). The owner committed twice while the sweep ran, so every line number below was re-read at `3090535`.
**Method:** read-only.
- `gh api` against carbon-design-system/{carbon, ibm-products, carbon-labs, carbon-ai-chat, carbon-charts}, pnpm/{pnpm, pnpm.io}, npm/cli, ibm-telemetry/telemetry-js and dependabot/dependabot-core.
- `npm view` against the registry.
- `npm pack` into `mktemp -d` for tarball reads.
- One throwaway `pnpm install` in `mktemp -d`, with `IBM_TELEMETRY_DISABLED=true` and a private store.

Nothing in the repo was edited.

---

## 1. Stale claims

"Main" means the default branch of the named repo. "Unpublished" means merged there but not yet in the npm version the docs pin.

| # | file:line | Current text (short) | Current fact | Source | Suggested replacement |
|---|---|---|---|---|---|
| 1 | plans/open-decisions.md:73 | "PR #23209, approved, not merged" | #23209 merged 2026-09-24T06:40:09Z (merge commit `4be1f9e6f`, no milestone). It closes #22929, which closed as completed at 06:40:10Z. The composable IBM Products PageHeader now lives in carbon `packages/react/src/components/PageHeader/`. Its export block in `src/index.ts` is commented out until v12. | `gh api repos/carbon-design-system/carbon/pulls/23209`; `.../issues/22929` | "Carbon moved the IBM Products PageHeader into core source for v12 (#22929, PR #23209, merged 2026-09-24). It stays out of the published build until v12. Core's current `preview__PageHeader` name still points at the old deprecated code." |
| 2 | plans/open-decisions.md:72 | core `preview__PageHeader` "last changed 2026-05-12" | On 2026-09-24, #23209 renamed the old folder to `PageHeaderDeprecated/`. `preview__PageHeader` and `unstable__PageHeader` now import from `./components/PageHeaderDeprecated` (`src/index.ts:108-109`). `PageHeaderDeprecated/PageHeader.tsx` and `index.tsx` on main are byte-identical to `PageHeader/PageHeader.tsx` and `index.tsx` at tag `v11.117.0` (empty diff, 758 lines). | `gh api repos/carbon-design-system/carbon/contents/packages/react/src/index.ts?ref=main`; `.../contents/packages/react/src/components/PageHeaderDeprecated/PageHeader.tsx?ref=main` against `.../PageHeader/PageHeader.tsx?ref=v11.117.0` | "...no removal date. On 2026-09-24 it moved to `PageHeaderDeprecated/` (#23209); the code is identical to the published 1.117.0 source." |
| 3 | goals.md:22, :156 (D8), :188 (S15, twice: "The 16 components", "Tearsheet pulls 5 of the 16"); scope.md:11, :30, :49, :74, :241 (M8), :252 (M19); research/carbon-reference.md:15, :120, :176, :367, :446; research/carbon-catalog.md:28, :239 (and :179, which describes the published `@carbon/styles` 1.116.0, where 16 is correct; on main the count is 17) | "16 components" moving from IBM Products into core | `product-migrated-components.mjs` on main now lists **17 unique** components, PageHeader included. `excludeProductsComponents` (lines 45-64) has 18 entries because `Resizer` appears twice (lines 49 and 57). `productMigratedStoryGlobs` (lines 14-32) has 17. None is published. | `gh api repos/carbon-design-system/carbon/contents/packages/react/product-migrated-components.mjs?ref=main` | "17 components (the earlier 16 plus PageHeader, added 2026-09-24 by #23209)". Add PageHeader to the name lists at reference.md:120 and scope.md:241. For S15's "5 of the 16", re-count against 17. Whether the copied Tearsheet also pulls PageHeader was not checked. |
| 4 | scope.md:30; research/carbon-catalog.md:28, :239 | "Today 14 come from `@carbon/ibm-products` 2.99.0"; "14 of 16"; cites `product-migrated-components.mjs:34-62` | 15 of the 17 are `@carbon/ibm-products` 2.99.0 exports; PageHeader ships there as `preview__PageHeader`. The exclude list is now at lines 45-64. | same file; ibm-products 2.99.0 exports as inventoried in the docs | "Today 15 come from `@carbon/ibm-products` 2.99.0 (PageHeader as `preview__PageHeader`), Resizer from `@carbon-labs/react-resizer`; ActionSet is not public (`product-migrated-components.mjs:45-64`)." |
| 5 | research/carbon-catalog.md:215 | PageHeader (new): "Moving to @carbon/react v12: no (core has its own `preview__PageHeader`)" | Yes. #23209 moved it into core source. Core's old `preview__PageHeader` is the deprecated code (#21926). | as rows 1-2 | "yes (#23209, merged 2026-09-24); core's old `preview__PageHeader` is the deprecated `PageHeaderDeprecated`" |
| 6 | scope.md:34; research/carbon-catalog.md:344, :445 | "Whether published 11.46.0 already contains the `enable-v12-release` codemod is (unverified)" | It does. The tarball ships `transforms/enable-v12-release.js` and its test, plus a `name: "enable-v12-release"` migration entry at `cli.js:36998`. | `npm pack @carbon/upgrade@11.46.0` | "Published `@carbon/upgrade` 11.46.0 contains the `enable-v12-release` codemod." Delete the open question at catalog.md:445. |
| 7 | goals.md:161 (D13, "Fact that matters most") | "`@carbon/react` and `@carbon/ibm-products` run `ibmtelemetry` at install; it reports repo, dependency and JSX usage data to IBM from CI" | Of 56 packages checked, 47 run `ibmtelemetry --config=telemetry.yml` as `postinstall`: all 28 `@carbon/*` packages checked, `@ibm/plex`, `stylelint-plugin-carbon-tokens`, and 17 of 26 Labs packages. It also collects JS import and argument data, not only JSX. It collects in containers as well as in CI. Details and package list: section 4. | `npm view <pkg> scripts.postinstall`; telemetry-js 1.11.0 `dist/spawn-background-process.js` | "Almost every Carbon package in the plan (every `@carbon/*` package, `@ibm/plex`, `stylelint-plugin-carbon-tokens`, most Labs packages) runs `ibmtelemetry` as a `postinstall` script. It reports repo, dependency, JSX and JS usage data to IBM when the install runs in CI or inside a container." |
| 8 | research/carbon-reference.md:25, :130, :381; research/carbon-catalog.md:192 | "embeds IBM Telemetry by default (opt-out)"; "IBM Telemetry is bundled, opt-out"; "IBM Telemetry is embedded" | Nothing ships in runtime code. `@ibm/telemetry-js` is a regular dependency with no `main` or `exports`; its only entry is the `ibmtelemetry` bin. `postinstall` runs that bin, which statically analyses the installing project's source. The README says: "this is not a runtime package". It is not specific to `@carbon/react` (row 7). | telemetry-js README (`gh api repos/ibm-telemetry/telemetry-js/readme`); `npm pack @ibm/telemetry-js@1.11.0` | "`@carbon/react`, like almost every Carbon package, runs IBM Telemetry at install time through a `postinstall` script (opt-out). No telemetry code ships in the runtime bundle." |
| 9 | research/carbon-reference.md:327 | "IBM Telemetry in `@carbon/react` is a data-collection consideration for redistribution" | Collection runs wherever the Carbon packages get installed. Afframe keeps Carbon as peers and dependencies (D4), so each consumer's CI installs them and triggers collection there. Only settings in the consumer's own environment or root config stop it (section 4). | as rows 7-8; npm and pnpm docs cited in section 4 | "Consumers of `@afframe/ui` install the Carbon packages themselves, so collection runs in their CI unless each consumer repo switches it off (section 4)." |
| 10 | scope.md:118 (I21), :271 (B6), :272 (B7 "ready-made"); research/carbon-catalog.md:204, :205, :277 | "CreateFullPage(+Step), CreateTearsheet(+Step, Divider, Narrow) \| stable" | On ibm-products main, not in published 2.99.0: PR #9900 (merged 2026-09-23T13:42Z) marks `CreateTearsheet`, `CreateTearsheetNarrow`, `CreateFullPage` and their Step and Divider parts `@deprecated`. The replacement is example code under `examples/carbon-for-ibm-products/Create*`. ADR 0007 (proposed) lists "Create flows" as patterns, not components. | `gh api repos/carbon-design-system/ibm-products/pulls/9900`; `.../issues/9870`; `CreateTearsheet.tsx@main:196` | I21: "stable in 2.99.0; deprecated on ibm-products main 2026-09-23 (#9900); replacement is example code under `examples/carbon-for-ibm-products/Create*`". B6/B7: "adapt (IBM example patterns)" instead of "ready-made". |
| 11 | scope.md:125 (I28), :270 (B5); research/carbon-catalog.md:213, :284 | "Saving \| stable" | Deprecated on ibm-products main by #9888 (merged 2026-09-23T12:14Z), which redirects to the "Saving true pattern". Not in 2.99.0. | `gh api repos/carbon-design-system/ibm-products/pulls/9888`; `.../issues/9871` | "stable in 2.99.0; deprecated on ibm-products main 2026-09-23 (#9888), replaced by a pattern" |
| 12 | research/carbon-catalog.md:233 | WebTerminal "stable" (reference) | Deprecated on ibm-products main by #9890 (merged 2026-09-23T12:32Z). | `.../ibm-products/pulls/9890` | "deprecated on ibm-products main 2026-09-23 (#9890)" |
| 13 | scope.md:194 (O5); research/carbon-catalog.md:97 | "`preview__Card` \| new core Card", set against ProductiveCard/ExpressiveCard | Core `preview__Card` in 1.117.0 is IBM Products' composable Card (`Card/next`), moved into core by carbon PR #22867 (merged 2026-08-12; closes ibm-products #9661). Two upstream plans make it the successor of ProductiveCard/ExpressiveCard: ibm-products issue #9308 (ibm-products v12-alpha) and ADR 0007 (proposed). | `gh api repos/carbon-design-system/carbon/pulls/22867`; `.../ibm-products/issues/9308`; PR #22880 | "`preview__Card`: IBM Products' composable Card, moved into core (#22867, 2026-08-12); upstream plans it as the successor of ProductiveCard/ExpressiveCard (I29)". The decline stays Hleb's call; this only adds the lineage. |
| 14 | scope.md:179; research/carbon-catalog.md:316; research/carbon-reference.md:227 | "`@carbon-labs/wc-wysiwyg` 0.2.0 (2026-09-21)" | 0.3.0, published 2026-09-24T08:27Z (tiptap security update, carbon-labs commit `a967941e0`). The package is out of scope (X12), so only the version changes. | `npm view @carbon-labs/wc-wysiwyg time` | "0.3.0 (2026-09-24)" |
| 15 | scope.md:24 (fact 1) | "no 2.x, alpha or v12 tag exists" | True for 2.x, alpha and v12. A legacy `beta` dist-tag also exists and points to 0.1.0 (published 2021-07-30). | `npm view @carbon/react dist-tags`; `npm view @carbon/react time` | "...no 2.x, alpha or v12 tag exists (a legacy `beta` tag points to 0.1.0 from 2021)." |

Rows the new commits already fixed, so they are not listed: next-steps.md:20 covers PageHeader joining the migration list, and next-steps.md:17 flags OKLCH, two themes and token consolidation.

## 2. Claims checked and still true

**npm versions and dates** (`npm view <pkg> dist-tags` and `time`):
- `@carbon/react` 1.117.0 was published 2026-09-23T14:58:17Z; `latest` = `next` = 1.117.0.
- `@carbon/styles` 1.116.0 (2026-09-23T14:55Z).
- `@carbon/ibm-products` 2.99.0 (2026-09-16T07:58Z); its `next` is 2.99.0-rc.0.
- `@carbon/ibm-products-styles` 2.95.0 (2026-09-16).
- `@carbon/icons-react` 11.89.0.
- `@carbon/pictograms-react` 11.111.0.
- `@carbon/feature-flags` 1.10.0.
- `@carbon/upgrade` 11.46.0.
- `@carbon/web-components` 2.64.0 (2026-09-23).
- `@carbon/ai-chat` 1.21.0 (2026-09-21); `@carbon/ai-chat-components` 1.11.0.
- `@carbon/charts` and `@carbon/charts-react` 1.27.20 (2026-09-16).
- charts-vue, charts-angular and charts-svelte: `latest` is still stale, and `next` is 1.27.20.
- `@carbon/themes` 11.82.0, `colors` 11.59.0, `layout` 11.60.0, `grid` 11.63.0, `type` 11.68.0, `motion` 11.53.0.
- `@carbon/utilities` 0.26.0; `utilities-react` 0.29.0.
- `@carbon/echarts-theme` 0.7.0; `echarts-toolbar` 0.4.0.
- `@carbon/element-styles` 0.3.13; `agentic-renderer` 0.1.0; `ibm-products-web-components` 0.48.0; `icons-motion` 2.3.0.
- `@tanstack/react-table` 9.2.4 (2026-08-28); `@tanstack/react-virtual` 3.14.13.
- `stylelint-plugin-carbon-tokens` 5.0.6.
- `@ibm/plex` 6.4.1.

**Labs versions in scope.md 2.5/2.6, catalog.md 5 and reference.md 5.4** (`npm view @carbon-labs/<name>`): all match except wc-wysiwyg (row 14).
- react-resizer 0.25.0
- react-ui-shell 0.106.0
- react-date-picker 0.12.0 (2026-09-18)
- react-calendar 0.11.0
- react-tag-input 0.6.0
- react-theme-settings 0.30.0
- react-style-picker 0.27.0 (2026-09-21)
- react-whats-new 0.28.0
- react-first-time-orientation 0.21.0
- react-registration-flow 0.2.0
- react-processing 0.21.0
- react-text-highlighter 0.23.0
- react-animated-header 0.61.0
- utilities 0.28.0
- vscode-snippets 0.5.0
- mdx-components 0.29.0
- primitives 0.6.0
- wc-resizer 0.5.0
- wc-style-picker 0.36.0
- wc-empty-state 0.22.0
- wc-date-picker 0.16.0
- wc-ai-tag 0.27.0
- wc-global-header 0.95.0
- ai-chat 0.39.0
- react-plane-stack-3d 0.10.0 (peers `react ^18.0.0`)

**Peers** (`npm view <pkg>@<v> peerDependencies`):
- `@carbon/react` 1.117.0: react, react-dom and react-is `^16.8.6 || ^17.0.1 || ^18.2.0 || ^19.0.0`, plus `sass ^1.33.0`.
- `@carbon/ibm-products` 2.99.0: `@carbon/react ^1.115.0`, grid `^11.61.0`, layout `^11.58.0`, motion `^11.51.0`, themes `^11.80.0`, type `^11.66.0`.
- `@carbon/ai-chat` 1.21.0: `@carbon/web-components >=2.54.0 <3.0.0`. There is no `peerDependenciesMeta`, so the peer is required.
- S16 (goals.md:189): `@carbon-labs/wc-resizer` 0.5.0 depends on `@carbon-labs/utilities` at exactly `0.21.0`, whose peers are `react ^16.8.0 || ^17.0.0 || ^18.0.0`. The install behaviour that follows was not re-tested.

**Milestones** (`gh api repos/carbon-design-system/carbon/milestones?state=all`):

| Milestone | Due | Open / closed |
|---|---|---|
| v12-alpha | 2026-10-31 | 28 / 21 |
| v12-rc.0 | 2026-11-12 | 10 / 0 |
| v12-beta | 2026-12-31 | 13 / 5 |
| v12-stable | 2027-03-31 | 5 / 1 |
| v12.x | undated | 0 / 0 |

`docs/release-schedule.md` on main still lists v12 as Preview since 2023-05-25, with the other columns TBD. The `version: 12` label has 166 issues, 135 of them open (search API).

**Flags and v12 docs:**
- `packages/feature-flags/feature-flags.yml` on main has 18 flags: the root flag plus six `enable-v12-*` sub-flags. No main commit since 1.117.0 touched it.
- `docs/working-with-v12.md:35` still describes a prefix-only cascade. The code side (`FeatureFlagScope.ts`) was not re-read.
- `docs/migration/v12.md` on main still does not document the text-input and list-box restyle; a grep finds only Tag, ProgressBar, Popover/Toggletip/Tooltip and Menu radius sections.
- `docs/feature-flags.md:76` still says the migrated components "will be part of the public `@carbon/react` API when v12 ships".
- `@carbon/react` 1.117.0 `es/index.js:255` exports `preview__Card`, `preview__DatePicker`, `preview__Dialog`, `preview__PageHeader`, `preview__IconIndicator` and `preview__ShapeIndicator`.

**Issue and PR states:**
- #23260: open, v12-beta, and still not fixed on main (see section 3 for PR #23375).
- #23259: open. It closes #22895, not #23260, so scope.md:67 "PR #23259 does not fix it" still holds.
- #23451: open, v12-rc.0, labelled `status: blocked`. Its body: "only exposed in the major release".
- #22473: open, v12-alpha. Its planned replacement is coded examples in the Core and Charts Storybooks, not a Core component, so "no Core component replacement" still holds.
- #22427: open, v12-stable.
- #22817: open, v12-stable.
- #21926: closed as completed 2026-05-12.
- #22728: merged 2026-08-05.
- #20391: merged 2025-09-02.
- carbon-labs PR #1228: merged 2026-06-02.
- carbon-ai-chat #2308: open.
- #23255: open, now in v12-alpha.
- #23088 and #23372: open.
- PRs #23382 and #23384: open, unmerged.

**Sass:** on main, `styles/scss/components/_index.scss:65` `@use`s `page-header`, and that module includes the new `page-header-next` mixin. Catalog.md:179, "Sass partials of all ... migrating components are `@use`d", therefore also holds for PageHeader on main.

**Carbon `main` vs 1.117.0** (`gh api repos/carbon-design-system/carbon/compare/v11.117.0...main`): main is 6 commits ahead and 0 behind. All six are unpublished.

| PR | Change | Doc items touched |
|---|---|---|
| #22777 | tabs focus fix; Web Components only | none (X1) |
| #22864 | Notification Storybook controls | none |
| #23085 | `useResizeObserver` coalesces updates | internal; any component using it |
| #23340 | high-contrast-mode focus outline for text-input and text-area | I11 |
| #22994 | DataTable clears selection state of removed rows | I12, M1 |
| #23209 | PageHeader migration | stale rows 1-5 |

**Carbon `next` vs `main`:** `next` was created 2026-09-22 by #23453 and is currently 0 commits ahead of main and 9 behind (`gh api repos/carbon-design-system/carbon/compare/main...next`). Its planned role is in section 3 (#22382, #23394, #23455).

**Other repos:**
- carbon-charts: no commit since the 1.27.20 release on 2026-09-16 (`gh api repos/carbon-design-system/carbon-charts/commits?since=2026-09-16T00:00:00Z`).
- IBM Products PageHeader: last source changes 2026-09-01 and 2026-09-02 (#9832, #9833), which matches open-decisions.md:74.

## 3. Planned upstream work by milestone

"Approvals" counts submitted APPROVED reviews and names the reviewer where it matters. Doc ids follow scope.md and goals.md section 6.

### 3.1 Release mechanics (cross-milestone, affects D8, D17, goals.md:22, scope.md:11, :44, :49, catalog.md:438)

| # | Title | Milestone | State | What it says | Affects |
|---|---|---|---|---|---|
| carbon #22382 | Release and publish a v12.0.0-rc.0 release candidate | v12-alpha | open | Update in the body: a `next` release branch was created early because the Web Components pure-exports change (#23097, merged 2026-09-04) cannot sit behind a flag. On `next`, "`enable-v12-release` ... will also be true by default". Flag-gatable v12 work keeps going to `main`. | D8, scope.md:44 (option D), D17 |
| carbon PR #23394 | feat: set up v12 release branch | none | open, base `next`, no approvals, blocked | Flips `enable-v12-release` to `true` by default in `feature-flags.yml`, `react/src/feature-flags.js` and `styles/scss/_feature-flags.scss` on `next`. Makes pure exports the Web Components default. Closes #22383. | D8, I36 |
| carbon #23455 | Set publish workflow for `next` release branch | v12-rc.0 | open | Planned: publish under an npm `v12-alpha` dist-tag, "with the `alpha` prerelease identifier (ie. v12.0.0-alpha.0)", on each push to `next` or by manual trigger. | scope.md:44, catalog.md:438 ("whether v12-alpha is published to npm"), D17 |
| carbon PR #23363 | chore(gh): update release tags | none | open, approved | `-rc` tags publish to `next` and all other tags to `latest`. Currently everything publishes to `next` and stable versions are promoted afterwards. | scope.md:24 (meaning of `next`) |

### 3.2 v12-alpha (due 2026-10-31): open items that touch the docs

| # | Title | State | Affects |
|---|---|---|---|
| #22655 | Migrate React components to @carbon/react (epic) | open. Its table marks ConditionBuilder (#22919), AddSelect (#22920) and PageHeader (now merged) as "In Review", and Card as done. | S15, M8, M19, O14, O15 |
| #22572 | Migrate ibm-products components to core (epic) | open. Its body records "option 2", a broad migration after which *ibm-products* "would transition to v1 and shift primarily into a support and maintenance mode". | I6, I19 to I33, S15 |
| #22866 / PR #22880 | ADR 0007: migrate ibm-products components to Carbon core | open. ADR status is **Proposed**; one approval (heloiselui, 2026-08-18). | Proposals only, see 3.6 |
| #22894 | [v12 alpha] Theming: Light/Dark, Two Themes | open | consumption.md:20 and open-decisions.md:27 ("all four themes"); D5; D6; D11 and goals.md:80, :138 ("every theme"); reference.md:18, :468 |
| #23448 (RFC, related to #22894) | V12 theme strategy: runtime aliasing for v11 themes | **closed as completed 2026-09-23**, with a comment: "we're moving forward with the Runtime Aliasing". Decided: v12 "will natively output and maintain **only 2 themes**: `light` and `dark`". `white` and `g10` alias to `light`; `g90` and `g100` alias to `dark`. Nested g10/white contrast needs migration. | same as #22894; still true for 1.117.0, so not a stale row |
| #23334 | [Epic] V12 Contextual Theming with OKLCH | open. Moves tokens from static hex to OKLCH with a fixed hue of 262 and chroma of 0.004, with lightness as the single variable. Three tiers: seed, contextual, state modifiers. | D6 (Carbon tokens as they are), D9, goals.md:71-73 (token tiers, themes), I4, M13 |
| #23429 | Build initial V12 OKLCH token generation pipeline (POC) | open; every checklist item ticked. Style Dictionary emits OKLCH Sass maps and JS, with a hex fallback under `@supports not (color: oklch(...))`; isolated from v11. | D6, D5 (compiled CSS contents) |
| #23484 | Add interactive states rules to OKLCH pipeline | open | D6 |
| #23485 | Research: consolidate redundant `-01/-02/-03` token variants into single derived rules | open; includes "Assess breaking change surface for external consumers" | D6, goals.md:71 (component tokens), M13 |
| #23000, #23252, #23253, #23254, #23255 | Figma and code token sync and parity (epic plus four tasks) | open | goals.md:95-97 (G), D6 ("Figma kept in sync by hand"), reference.md:261 |
| #22895 (PR #23259) | [Button] v12 design intent 1.0 (corner radius) | PR open; 3 approvals (Kritvi-bhatia17, maradwan26, annawen1, last on 2026-09-23); `mergeable_state` behind | I10, and D9 radius handling. The PR also edits many partials under the v12 flag: card, side-panel, edit-in-place, coachmark, date-picker, data-table action, text-input, modal, dropdown, search, select, notification. |
| #22908 | [Modal] v12 design intent 1.0 | open | I14 |
| #23316 | [Number input] v12 design intent 2.0 | open | I11, B32 |
| #22905 | [v12 alpha] Tag Set: rounding corners ("The migrated Tag set from C4IP should use the updated v12 Tag design") | open | I27 |
| #22906 | [v12 alpha] UI Shell: design only | open | I13, S9, B1 |
| #23228 | Motion with purpose | open | I4 |
| #22912 | MVP components for private preview (umbrella) | open | scope.md 1.5 (day-one v12 surface) |
| #22473 | Replace deprecated Empty States pattern with coded examples | open | I23, S17, B14, B29 |
| #22421 | Refactor Web Component package structure | open | O9, I42, M21 (WC runtime under Labs and ai-chat) |
| #23170, #23180, #23143, #22996, #22794 | WC AddSelect, cds-card, WC migration | open | X1 only |

### 3.3 v12-rc.0 (due 2026-11-12)

| # | Title | State | Affects |
|---|---|---|---|
| #23451 | Expose IBM Products components | open, `status: blocked`. Body: migrated components "are meant to be only exposed in the major release". | S15, M8, M19, scope.md:30, :74 |
| #23455 | Set publish workflow for `next` | open (3.1) | D8, D17 |
| #23471 | [v12] Align dynamic floating styles / `autoalign` between WC and React | open. Only `cds-overflow-menu` in WC checks `enable-v12-dynamic-floating-styles`. Option A gates everything behind the flag; option B makes dynamic positioning the WC default. | I36, I42, M21, O9 (scoped `<feature-flags>` rule in scope.md 1.5) |
| #22512 | Removal of canary mechanism spike | open | M11, O13 (ScrollGradient canary), I27 (TagOverflow canary) |
| #20479 | Use PDLC `preview` label instead of `experimental`/`unstable` | open | S5, M7 |
| #17765 | Move `autoAlign` to stable | open | I14, I36 |
| #15498 | Remove function export wrappers (`createClassWrapper`; a breaking change for refs) | open | I11, I13 (components still wrapped; the list was not enumerated), M9 |
| #23053, #22783, #20670 | WC empty states, WC motion controller, Custom Elements Manifest | open | X1 only |

### 3.4 v12-beta (due 2026-12-31)

| # | Title | State | Affects |
|---|---|---|---|
| #23260 (PR #23375) | [Bug] DataTable overflow menu usage to v12 | Issue open. PR #23375 says "Closes #23260" and is open with 1 approval (sangeethababu9223, 2026-09-22), blocked. It changes the components themselves, not only stories. Under `enable-v12-overflowmenu`, `TableToolbarAction` renders `MenuItem`, and `TableToolbarMenu` renders `OverflowMenu/next` with `label` and `menuAlignment: 'bottom-end'`. | S18 (goals.md:191), M17 (scope.md:250), scope.md:67, I12, B19. If it merges and ships, the S18 workaround is no longer needed. |
| #23269 | [Card] v12 design intent 1.0 (React) | open | O5, B26, I29 |
| #23193 | Notification | open. React 80% implementation pending. | I15 |
| #23131, #23132, #23134 | Inset or flush buttons for fields and system components; button variants | open (design) | I10, I11 |
| #23130 | Options tile and accordion v12 design | open | I12 (Accordion), O12 |
| #23135 | Shadows | open | D6 |
| #22990, #22411 | Motion for primitives; motion standards | open | I4 |
| #23046 | v12 Design intent (umbrella) | open | goals.md:26 (native v12 look), D9 |
| #22461 | Deliver v12 migration guide (codemods, v12.md changelog) | open | I34, D8 |
| #16711 | Improve changelog consumability | open | D14 |

v12-stable (context only): #22427 graduates the Labs DatePicker to core (I38, S19); #22817 is the WC v3 checklist, whose completion unblocks the ai-chat peer cap (O9, scope.md:33).

### 3.5 Open PRs close to merge that are not in a milestone

| PR | Title | Review state | Affects |
|---|---|---|---|
| carbon #23219 | feat(ConditionBuilder): v12 migrate from Carbon for IBM Products | 1 approval (anamikaanu96, 2026-09-24T09:31), given after her own change request. A change request from makafsal (2026-09-21) is still outstanding; blocked. Adds `src/components/ConditionBuilder/**/*` to `excludeProductsComponents`. | O15, S15, M19, catalog.md:224 ("Moving: no"). The migration count would reach 18. |
| carbon #23181 | feat(react): v12 migrate AddSelect from carbon-for-ibm-products | 2 approvals, both by the same reviewer (amal-k-joy, 2026-09-03 and 2026-09-14). Adds `src/components/AddSelect/**/*`. | O14, S15, M19, catalog.md:223. The count would reach 19 with #23219. |
| carbon #23375 | DataTable overflow menu v12 | see 3.4 | S18, M17 |
| carbon #23259 | Button border radius and v12 fixes | 3 approvals | I10 to I15 styling under v12 |
| carbon #22267 | fix: incorrect disabled bottom border colour for fluid components | approved | I11 (Fluid*) |
| carbon #23165 | fix(DatePicker): call onChange for typed dates | approved | I11 stable DatePicker (Afframe uses the Labs copy per S19) |
| carbon #22611 | fix(Tabs): hover states only on supported input devices | approved | I13 |
| carbon #22342 | feat: support for button side nav items | approved | I13, B1 |
| carbon #23309, #23469 | migrate Create, Delete & Remove and Export Modal examples from ibm-products to core | open; #23309 has a change request | M3, M4, B6 to B9 (pattern sources) |

### 3.6 IBM Products plans (ibm-products repo and ADR 0007)

The ADR is a proposal: status Proposed, PR #22880 open with one approval. Its disposition tables would affect these included items.

| ADR 0007 proposal (not decided) | Docs items affected |
|---|---|
| Migrate to core: AddSelect, BigNumber, Coachmark, composable Card, ConditionBuilder, FullPageError, Guidebanner, EditInPlace, InterstitialScreen, NotificationsPanel, OptionsTile, PageHeader, ScrollGradient, SidePanel, TagOverflow, Tearsheet, TruncatedText, UserAvatar (18 rows) | S15, M8, M19, O14, O15 |
| Deprecate in ibm-products, not migrated: AboutModal, ActionBar, Decorator, **ExpressiveCard**, **GetStartedCard**, **ProductiveCard**, **SearchBar**, **TagSet** ("deprecate `TagSet` in favour of `TagOverflow`"), **Toolbar** | I27 (TagSet), I29, B24 (TagSet), B26, O11 (GetStartedCard), O16 (Toolbar, SearchBar, Decorator) |
| Move to Carbon Labs: Cascade, Checklist, InlineTip, NonLinearReading, TruncatedList | O11 (Cascade, Checklist, InlineTip), O16 (TruncatedList, NonLinearReading) |
| Patterns, not components: AddSelect patterns, Coachmark patterns, Create flows (CreateFullPage, CreateModal, CreateSidePanel, CreateTearsheet, CreateTearsheetNarrow), Delete and remove, Export, Generate an API key, Import and upload | I21, B6, B7, M3, M4 |

Other IBM Products items:
- **ibm-products #9874**, open: "Deprecate stable `Tearsheet` and `TearsheetNarrow` in favour of `preview__Tearsheet`". `TearsheetPresence` would be replaced by `StackProvider`. Affects I19 and B7/B10.
- **ibm-products #9804 and #9805**, open: `preview__PageHeader` lacks features of the deprecated PageHeader, including a title loading or skeleton state (G1) and an inline-editable title via EditInPlace (G2). Affects S6, I30 and B16.
- **ibm-products #9643**, open: review and deprecate ActionBar. Affects catalog.md:234 (reference only).
- **ibm-products milestones** (`gh api repos/carbon-design-system/ibm-products/milestones`):
  - v12-alpha, due 2026-10-31: #9308 "Implement the new composable Card component for v12", consolidating ProductiveCard and ExpressiveCard (I29, O5, B26); #9306, the composability epic.
  - v12-rc.0 is due **2026-12-01**, not carbon's 2026-11-12; it has 0 open items.
  - v12-beta, due 2026-12-31: #8694 and #9881, the composable SidePanel. ADR 0007 moves SidePanel into core as-is, with the composable redesign after v12 (I20, S15).
- **Merged on ibm-products main after 2.99.0, unpublished:** #9900, #9888 and #9890 (stale rows 10 to 12).

### 3.7 Other repos

- **carbon-ai-chat #2308** (open; updated 2026-09-22), now titled "Move the chat's overflow menus to Carbon 12 with the 3.0.0 alpha".
  - It is "on hold for Carbon's 3.0.0 alpha, which is expected within days of 2026-09-22".
  - The fixes land on branch `integration/v2.0.0` (last commit 2026-09-21) for `@carbon/ai-chat` 2.0.0, and "1.x consumers stay on Carbon 11".
  - The chat will add no `feature-flags` element to the page.
  - Affects O9, S7 (goals.md:180), scope.md:68 and :78, and fact 10 (scope.md:33): the WC peer cap widens only in ai-chat 2.0.0.
- **carbon-ai-chat #1543** (epic "2.0.0 - Carbon 12") has a timeline headed "PLACEHOLDER INFO" that puts `@carbon/web-components@3.0.0` GA and ai-chat 2.0.0 in March 2027. Those dates are placeholders.
- **carbon-charts #2098** "Charts: Support Carbon v12" (open, in carbon-charts' own v12-rc.0 milestone, due 2026-12-01).
  - Goal: an upgrade "with zero breaking changes and zero API changes"; colour palettes are out of scope.
  - "eCharts is the future ... eCharts adoption + a Carbon Charts deprecation plan is a post-V12 conversation."
  - Affects I8, M13, O22, B27 and B28.
- **carbon-labs:** no release relevant to the included packages since the docs were written; the only new publish is `wc-wysiwyg` 0.3.0. Commit `6bd87e916` "Update telemetry.yml" landed 2026-09-21.

## 4. IBM Telemetry facts (D13)

Every item below is a fact with its source. It is not a policy recommendation.

### 4.1 Which packages run it

Every package listed below has `"postinstall": "ibmtelemetry --config=telemetry.yml"` and a regular dependency on `@ibm/telemetry-js` (`npm view <pkg>@<latest> scripts.postinstall dependencies`). That is 47 of the 56 packages checked.

| Group | Packages |
|---|---|
| All 28 `@carbon/*` packages checked | react, styles, ibm-products, ibm-products-styles, icons-react, icons, pictograms-react, pictograms, web-components, ai-chat, ai-chat-components, charts, charts-react, themes, colors, layout, grid, type, motion, feature-flags, utilities, utilities-react, upgrade, icon-helpers, elements, icons-motion, echarts-theme, echarts-toolbar |
| Others | `@ibm/plex` 6.4.1, `stylelint-plugin-carbon-tokens` 5.0.6 |
| Labs, 17 of 26 | react-resizer, react-ui-shell, react-date-picker, react-calendar, react-theme-settings, react-style-picker, react-whats-new, react-first-time-orientation, react-processing, react-text-highlighter, react-animated-header, mdx-components, wc-style-picker, wc-empty-state, wc-ai-tag, ai-chat, react-plane-stack-3d |
| Labs with no install script | react-tag-input, react-registration-flow, utilities, primitives, wc-resizer, wc-date-picker, wc-global-header, wc-wysiwyg |

Other install-time behaviour:
- `@carbon-labs/vscode-snippets` (I50) has a different postinstall, `node post-install.js`. It is not telemetry: it copies `.code-snippets` files into the installing project's `.vscode/` folder (`install/index.js`).
- Transitively, `@carbon/ibm-products` 2.99.0 depends on the instrumented `@carbon/feature-flags`, `@carbon/utilities`, `@carbon/utilities-react`, `@carbon/ibm-products-styles` and `@carbon-labs/react-resizer`. Installing the Afframe peers alone therefore pulls in many instrumented packages.
- `@carbon/ibm-products` also depends on `@carbon/telemetry` 0.1.0. That is a CLI (bin `carbon-telemetry`) with no install scripts, and no ibm-products script or shipped file references it. It is inert.

### 4.2 When it collects

From the `@ibm/telemetry-js` 1.11.0 code, `dist/spawn-background-process.js` and `dist/background-process.js`:
1. `postinstall` runs `ibmtelemetry`, which exits if Node is below 16. Only when `isCI` is true and telemetry is enabled does it print the notice and spawn a detached background process. That process logs to `os.tmpdir()/ibmtelemetry-<timestamp>-<random>.log` and re-checks both conditions before collecting.
2. `isCI` is true when any of these holds:
   - **ci-info check:** `CI !== "false"` AND (any of `BUILD_ID`, `BUILD_NUMBER`, `CI`, `CI_APP_ID`, `CI_BUILD_ID`, `CI_BUILD_NUMBER`, `CI_NAME`, `CONTINUOUS_INTEGRATION`, `RUN_ID` is set, OR a known CI vendor is detected, for example `GITHUB_ACTIONS`, `GITLAB_CI` or Jenkins). Both the generic variables and vendor detection sit inside the `CI !== "false"` guard.
   - **Secure Pipelines:** `PIPELINE_RUN_URL`, `PIPELINE_RUN_ID` or `PIPELINE_ID` is set.
   - **A container is detected:** `/run/.containerenv` exists (Podman), `/.dockerenv` exists, or `/proc/self/cgroup` contains `docker`.
3. So collection also happens outside CI: local Docker builds, devcontainers, and any shell where `CI` is set. `CI=false` disables the ci-info check, both generic variables and vendor detection. The Secure Pipelines and container checks still fire. The README says "never runs locally on a developer's machine" but also "collection will occur when running inside a container".
4. What it collects: static analysis of the installing project. That includes a de-identified repo URL, commit, branches and tags; the project name, version and dependencies; and JSX elements and props plus JS imports and arguments from the instrumented package, with non-allowlisted values anonymised. It sends them to `https://www-api.ibm.com/ibm-telemetry/v1/metrics` (`@carbon/react` 1.117.0 `telemetry.yml`).

### 4.3 Opt-out variables and accepted values

| Variable | Effect | Accepted value |
|---|---|---|
| `IBM_TELEMETRY_DISABLED` | Nothing runs: no notice, no spawn, no collection | Only the exact string `true`. The code tests `process.env.IBM_TELEMETRY_DISABLED !== "true"`, so `1`, `TRUE` or `yes` do **not** disable it. |
| `IBM_TELEMETRY_EXPORT_DISABLED` | Collection and analysis still run and are logged locally; only sending is skipped | Only the exact string `true` |

The variable is read from the environment of the process that runs the install. A dependency cannot set it for the project that installs it. So setting it in afframe/ui's CI does not cover consumer repos.

### 4.4 Package-manager defaults

| Package manager | Version facts | Default for dependency install scripts | Settings |
|---|---|---|---|
| pnpm | Latest is **12.6.0** (`npm view pnpm dist-tags`); 12.0.0 was released 2026-08-26 | Not run unless allowed, as since v10. Since v11, `strictDepBuilds` defaults to `true`, so an install with an unreviewed build script **fails**. It also writes a placeholder entry into `pnpm-workspace.yaml`. | `allowBuilds` (a map of package name to `true`/`false`; added 10.26.0); `strictDepBuilds`; `dangerouslyAllowAllBuilds` (default false); `ignoreScripts` (default false; blocks all scripts). v11 removed `onlyBuiltDependencies`, `onlyBuiltDependenciesFile`, `neverBuiltDependencies`, `ignoredBuiltDependencies` and `ignoreDepScripts`. Since v11, `.npmrc` carries only auth and registry settings; everything else goes in `pnpm-workspace.yaml`. |
| npm | Latest is **12.1.0** (2026-09-22); latest-11 is 11.20.0 | **npm 12:** blocked by default unless the root `package.json` `allowScripts` allows them. Unreviewed scripts are skipped silently and listed at the end, which is not an error (v12.0.0 release notes; `npm-install-scripts.md`). **npm 11:** unreviewed scripts run; only an explicit `false` in `allowScripts` blocks one. This follows the v11.20.0 arborist code; the v11.20.0 docs page says otherwise (section 5). | `allowScripts` in the root `package.json` (supports `false` denials); `npm install-scripts deny <pkg>` and `approve <pkg>`; `--allow-scripts` for global and npx use only; `dangerously-allow-all-scripts`; `ignore-scripts` (default false; blocks all scripts, including the root's pre and post scripts). |

Sources:
- pnpm: `gh api repos/pnpm/pnpm/releases/tags/v11.0.0` and `v12.0.0`; `gh api repos/pnpm/pnpm.io/contents/docs/settings/build.md`.
- npm: `gh api repos/npm/cli/releases/tags/v12.0.0`; `workspaces/arborist/lib/arborist/rebuild.js` at `v11.20.0` (lines 202-209) and at `v12.1.0` (lines 202-217).

Two details from the pnpm source:
- **Exact names only.** `allowBuilds` keys are matched against the package name, or name@version, through a `Set`/`HashSet` lookup: `pnpm11/building/policy/src/index.ts` and the Rust `pnpm/crates/deps-restorer/src/build_modules/allow_build_policy.rs`. **There is no scope wildcard.** `'@carbon/*': false` does not match `@carbon/react`, so every instrumented package in the resolved tree needs its own entry, transitive ones included.
- **Observed on pnpm 11.20.0.** The sandbox has pnpm 11.20.0, npm 11.11.0 and Node v24.14.1.
  - `pnpm install` of `@carbon/layout@11.60.0` in `mktemp -d` exited 1 with `[ERR_PNPM_IGNORED_BUILDS] Ignored build scripts: @carbon/layout@11.60.0`. It wrote `allowBuilds: '@carbon/layout': set this to true or false`.
  - With `allowBuilds: {'@carbon/layout': false}`, the same install exited 0 and left no `ibmtelemetry` log in `/tmp`.
  - Consequence for consumption.md:48 (`pnpm --filter web add @afframe/ui ... @carbon/react@1.117.0 @carbon/ibm-products@2.99.0`): under pnpm 11 or 12 it fails until the consumer's `pnpm-workspace.yaml` lists each instrumented package in `allowBuilds`.

### 4.5 Off-switch mechanics (stated as facts)

1. **Environment variable.** Set `IBM_TELEMETRY_DISABLED=true` (exact lowercase) in every environment that installs Carbon packages and meets the `isCI` test. That means every CI job, every Docker or devcontainer build, and any shell with `CI` set, in afframe/ui and in each consumer repo. afframe/ui cannot set it for consumers.
2. **pnpm 11 and 12.** Set each instrumented package name to `false` under `allowBuilds` in the root `pnpm-workspace.yaml` of each repo. Names must be exact, and the list must cover the resolved tree. With the default `strictDepBuilds: true`, a missing name fails the install instead of silently running or skipping.
3. **npm 12.** Unreviewed scripts are already skipped. `npm install-scripts deny <pkg>` records an explicit `false`, which later survives `approve --all`.
4. **npm 11.** Scripts run unless the root `allowScripts` has `false` entries, or `ignore-scripts=true` is set. The latter also disables every other install-time script.
5. **Side effect.** Blocking all builds also blocks the non-telemetry `@carbon-labs/vscode-snippets` postinstall (I50). No other functional install script was found in the checked set.
6. **Dependabot (D15).** Its npm and pnpm updaters regenerate lockfiles with lockfile-only commands, which do not run dependency lifecycle scripts: `npm install --package-lock-only` (`npm_and_yarn/lib/dependabot/npm_and_yarn/file_updater/npm_lockfile_updater.rb:396-426`), `npm update ... --force --ignore-scripts --package-lock-only` and `npm audit fix ... --ignore-scripts` (`native_helpers.rb:30-71`), and `pnpm install --lockfile-only` / `pnpm update ... --lockfile-only` (`file_updater/pnpm_lockfile_updater.rb:285-295`). The consumer's own CI run on a Dependabot PR is a normal CI install and falls under point 1.
7. **Runtime (browser) telemetry.** None found. Method: a grep of the shipped JS in `@carbon/react` 1.117.0, `@carbon/web-components` 2.64.0, `@carbon/ai-chat` 1.21.0, `@carbon/ibm-products` 2.99.0 and `@carbon/charts` 1.27.20 for `ibm-telemetry`, `telemetry-js`, `www-api.ibm.com`, `sendBeacon` and common analytics hosts. The telemetry-js README says it "is not a runtime package". Other packages were not grepped.

## 5. Could not verify

- **Alpha version numbers.** Whether the first v12 alpha of `@carbon/react` will be versioned 2.x-alpha or 12.0.0-alpha. #23455 says "v12.0.0-alpha.0, starting from v12" without naming packages, and the v12 Storybook brands itself "@carbon/react v2.x". Also unknown: whether the WC "3.0.0 alpha" the ai-chat team expects is published before 2026-10-31.
- **Labs package count.** The count of 36 published `@carbon-labs/*` packages (catalog.md:328, :448) was not re-enumerated. The npm search API does not filter by scope, so only the 26 named packages were checked.
- **npm 11 source conflict.** At tag `v11.20.0`, `docs/lib/content/commands/npm-install-scripts.md` says "Dependency install scripts are blocked by default". But `workspaces/arborist/lib/arborist/rebuild.js` at the same tag skips scripts only when `isScriptAllowed(...) === false`, and the v12.0.0 release notes list "blocked by default" as a v12 breaking change. Section 4.4 follows the code; npm 11 was not run to settle it.
- **pnpm and npm 12 behaviour.** Only pnpm 11.20.0 was run. pnpm 12 behaviour comes from docs, release notes and Rust source. npm 12 behaviour comes from release notes, docs and source; npm 12 was not run.
- **Dependabot coverage.** Only the npm and pnpm lockfile-updater paths named above were read. Whether any other Dependabot path runs a full install was not established.
- **Runtime telemetry coverage.** No runtime telemetry was found in the five tarballs grepped; Labs, icons and the remaining packages were not grepped.
- **Proposals and placeholders.** ADR 0007 is Proposed; whether its deprecations (TagSet, Productive/ExpressiveCard, Toolbar, SearchBar and the rest) and Labs moves will be accepted is open. The ai-chat 2.0.0 and WC 3.0.0 dates in #1543 are marked "PLACEHOLDER INFO".
- **Row 3 recount.** Whether the copied v12 Tearsheet source also pulls PageHeader, which would change S15's "5 of the 16" beyond the base count.
- **Carbon code not re-read.** `FeatureFlagScope.ts` was not re-read, so the code side of the root-flag cascade (it also enables `enable-focus-wrap-without-sentinels`) is taken from the docs' earlier sources. The same applies to the list of components still using `createClassWrapper` (#15498).
- **S16 install behaviour.** Whether `wc-resizer` 0.5.0 makes npm install a second React 18 copy was not re-tested; only the dependency and peer facts were confirmed.
- **Telemetry in this sandbox.** Whether the container check would fire here was not tested; every test install ran with `IBM_TELEMETRY_DISABLED=true`.
