> Evidence copy of the independent review of 2026-09-24 (one agent, Opus, xhigh effort, no session context). Line numbers refer to commit `7601dc5`. The name of a private repository and local scratch paths were removed before committing. Rulings and fixes: `docs/goals.md` section 6 and `docs/plans/next-steps.md`.

# Independent review: Afframe UI docs (afframe/ui, branch hlebtkachenko/dar-es-salaam, commit 7601dc5)

Reviewer: independent agent, read-only. Date: 2026-09-24. External checks were run between 08:45 and 09:00 UTC. Facts that can change (milestones, PR state, npm versions) are true as of that time.

## 1. Verdict per document

| Document | Verdict | Reason |
|---|---|---|
| docs/README.md | needs revision | The index is fine, but the evidence conventions skip round 4, and D4 and D5 rest on round 4. |
| docs/goals.md | needs revision | The goals are sensible. But its decision status disagrees with next-steps.md, "full native v12 look" is overstated, and two items are open without being named as open: IBM Telemetry and the accessibility target. |
| docs/scope.md | needs revision | One included package cannot be installed (I42). One included package supports only React 16/17 (O24). Several rows are stale or contradict each other (plane-stack-3d, PageHeader, S4 vs M1). The cost of S15 is understated, and a Carbon merge this morning has overtaken it. |
| docs/consumption.md | needs revision | The consumer model is sound and most of it checks out. But the dependency rule puts tooling packages into runtime dependencies, pnpm strict-peer handling is missing, and it names a private repo. |
| docs/plans/next-steps.md | needs revision | Its "Decided by Hleb" list contradicts goals.md. This is the file an agent resumes from. |
| docs/plans/open-decisions.md | needs revision | The options are framed usefully. But the outcomes appear only in the header paragraph, and item 10's "not merged" has been stale since 06:40 UTC today. |
| docs/research/carbon-reference.md | sound | The facts I checked hold. Minor fixes: the line about the visual-regression tool is outdated (Carbon runs Chromatic), and it lists icons-motion as legacy, which conflicts with scope. |
| docs/research/carbon-catalog.md | sound | Its counts reconcile. Minor fixes: one source reference is broken, and the Labs tags predate the "Labs is mandatory" rule. |
| docs/research/carbon-org-repos.md | needs revision | The tag counts are right, but the category counts are wrong, and its tags disagree with the catalog without saying so. |

## 2. Findings, ranked

IDs are `F1`, `F2` and so on, so they do not clash with scope's I, O, M, B and S rows.

### Blockers

**F1. I42 `@carbon-labs/react-style-picker` cannot be installed today (npm and pnpm)**
- Severity: blocker. Dimension: factual accuracy, feasibility.
- Where: scope.md:152 (I42 is in Include); scope.md:177 (wc-style-picker is "full (same code)"); goals.md:25 (the reading "every live Labs package is in").
- Claim: I42 is included; "It is `wc-style-picker` wrapped with `@lit/react`".
- Evidence:
  - `npm install @carbon-labs/react-style-picker@0.27.0 react@19 react-dom@19` exits with code 1: `ETARGET No matching version found for @carbon-labs/wc-empty-state@^0.23.0`.
  - `npm view @carbon-labs/wc-style-picker@0.36.0 dependencies` (published 2026-07-20) requires `@carbon-labs/wc-empty-state ^0.23.0`, and so does 0.35.0 (published 2026-06-02).
  - Published wc-empty-state versions stop at 0.22.0 (`latest`).
  - `pnpm@12.6.0 install --lockfile-only` of the same package fails too: `ERR_PNPM_NO_MATCHING_VERSION ... @carbon-labs/wc-empty-state@^0.23.0`.
- Why it matters: consumption.md:29 lists Labs packages as exact regular dependencies. With I42 among them, `@afframe/ui` itself would fail to install for every consumer, on npm and pnpm alike (both tested). The research describes I42's API but never installed it.
- Suggested change: mark I42 as blocked upstream and keep it out of `dependencies` until a version resolves. An `overrides` pin to wc-empty-state 0.22.0 is an option only if the reference consumer proves it works. Add "installs cleanly with the rest of the set" as an entry gate for every Labs item. The evidence here is one-sided, so this is a recommendation.

**F2. The tanstack-carbon reuse decision (S4) has no licence behind it**
- Severity: blocker for copying any tanstack-carbon code; the project as a whole is not blocked. Dimension: legal, internal consistency.
- Where:
  - scope.md:330 (S4) records the decision.
  - scope.md:235 (M1: "pattern reference until its license is resolved") and scope.md:301 (B25: "license unresolved") contradict it.
  - open-decisions.md:142.
- Claim: "Decided 2026-09-24: reuse IBM's tanstack-carbon examples (Hleb: TanStack is open source and IBM's licensing covers it)."
- Evidence:
  - `gh api repos/carbon-design-system/tanstack-carbon` returns `license: null`. The repo root has no LICENSE file (root listing: .github, .gitignore, .husky, CONTRIBUTING.md, README.md, eslint.config.mjs, lerna.json, package.json, prettier.config.js, react, web-components, yarn.lock).
  - TanStack's MIT licence covers the TanStack library. It does not cover IBM's example code built on top of it.
  - The docs' own fact: 1 of 40 package.json files declares MIT.
- Why it matters: copying unlicensed code into a public repo and a published package is redistribution without a grant. The documents also disagree with themselves about whether this is decided or unresolved.
- Suggested change: no pick is made here; see Q1. At minimum, give M1, B25 and S4 the same status.

### Major

**F3. The v12 flag cannot deliver the "full native v12 look", and the deliverables drop a caveat the evidence contains**
- Dimension: factual accuracy, soundness, traceability.
- Where: goals.md:22-27; scope.md:10; goals.md:157 (D8); consumption.md:20 ("all four themes"); consumption.md:55 (consumers use `var(--cds-*)`).
- Claim: "full native v12 look as IBM ships it (rounded corners, full-border fields)".
- Evidence:
  - Open issues in the v12-alpha milestone (gh search, about 08:55 UTC) include:
    - #23334 "[Epic]: V12 Contextual Theming with OKLCH"
    - #22894 "[v12 alpha] Theming: Light/Dark - Two Themes"
    - #23485 "consolidate redundant -01/-02/-03 token variants"
    - #22895 "[Button] v12 design intent 1.0 (corner radius)"
    - #22908 (Modal) and #23316 (Number input)
  - #22382 says "There is some work though that cannot be placed behind a flag". It also describes a `next` release branch where `enable-v12-release` is true by default. That branch exists: `next` at 4a1f30da9, dated 2026-09-22.
  - The evidence already lists these items: `sources/round3/W-v12-day-one.md:69-99` and `sources/round2/V-verify.md` row 4a. No deliverable mentions OKLCH, the two-theme plan or unflagged work.
- Why it matters: "v12 from day one" is really the subset of a still-moving design that the flags cover. Several things are exposed to the v12 theming change: visual baselines, the four-theme CSS, D6 ("Carbon's tokens as they are"), and consumer code written against `--cds-*` layer tokens. The owner's criterion ("most current and gives more") is being answered with an incomplete picture.
- Suggested change:
  - State in scope.md section 1 and in goals D8 that v12 through flags is a subset.
  - List the unflagged v12-alpha work.
  - Flag the risk to token names and theme count under D5 and D6, and in consumption.md section 3.4.

**F4. Copying Carbon's v12 source (S15, M19) costs more than stated, and it can silently duplicate React contexts**
- Dimension: feasibility, hidden cost.
- Where: scope.md:341 (S15); scope.md:253 (M19); goals.md:153 (D4, `allowJs`).
- Claim: "copy Carbon's v12 source ... Tearsheet pulls 5 of the 16 (Tearsheet, SidePanel, ActionSet, Resizer, TruncatedText)".
- Evidence:
  - carbon@main `packages/react/src/components/Tearsheet/*.tsx` import these internal modules:
    - `../../internal/useId`, `useIsomorphicEffect`, `useMatchMedia`, `useMergedRefs`, `usePrefix`, `usePresence`, `useCollapsible`, `useResizeObserver`
  - They also import these components:
    - `../FeatureFlags`, `../ComposedModal`, `../Menu`, `../MenuButton`, `../Layer`, `../AILabel`, `../Button`, `../ButtonSet`, `../IconButton`
  - In the 1.117.0 tarball:
    - `es/internal/useCollapsible` ships only as `.d.ts`, with no JS.
    - `usePresence` is not a public export.
    - `exports` is `null`, so deep imports work but are unsupported.
  - Tearsheet.tsx:24 imports `{ FeatureFlags } from '../FeatureFlags'`, and line 392 renders `<FeatureFlags enable-focus-wrap-without-sentinels>`.
- Why it matters:
  - Every relative import has to become a public `@carbon/react` export, a deep import, or a vendored copy.
  - Vendoring `FeatureFlags`, `usePrefix` or the presence code creates a second React context. The `<FeatureFlags enableV12Release>` in `AfframeProvider` does not reach a second context, so copied components could silently run v11 behaviour. V4 section 3.5 warns about exactly this failure for a second Carbon copy.
  - The "5 of 16" count leaves these internal modules out.
  - V4 section 5 item 7 (does the copied Sass compile against styles 1.116.0) is still open.
  - This risk comes from reading the import lists. Nothing was built.
- Suggested change: add an import-rewrite rule (public exports only, no vendored contexts). Add a test that a copied component sees the provider's flags. Size the copy set for each component before committing to it. See Q3.

**F5. PageHeader joined Carbon's migration list today, so S6 and S15 now conflict (time-sensitive)**
- Dimension: factual accuracy (stale since 06:40 UTC today), internal consistency.
- Where: open-decisions.md:172; scope.md:332 (S6); scope.md:341 (S15); "16 components" in scope.md:30 and goals.md:157.
- Claim: "Carbon is moving the IBM Products PageHeader into core for v12 (#22929, PR #23209, approved, not merged)".
- Evidence:
  - `gh api .../pulls/23209`: merged at 2026-09-24T06:40:09Z.
  - Commit 4be1f9e6f adds `src/components/PageHeader/**/*` to `excludeProductsComponents` in `product-migrated-components.mjs`, which now has 17 unique entries.
  - The same commit renames core's old PageHeader folder to `PageHeaderDeprecated`.
  - `src/index.ts:108-109` still exports `preview__PageHeader` from `PageHeaderDeprecated`.
  - The docs were accurate when they were written.
- Why it matters:
  - S15's rule (copy core's v12 source of every migrating component) now covers PageHeader. S6 picked IBM Products' `preview__PageHeader` (c4p prefix) instead.
  - The count "16" in goals, scope and the reference doc is now stale.
  - The PageHeader lane's prediction (P-pageheader: core's export name keeps pointing at the deprecated code) is confirmed.
- Suggested change: update the counts to 17 and decide PageHeader explicitly (Q4).

**F6. Adopting v12 pre-releases conflicts with the exact peers, the IBM Products peer cap and the no-prerelease rule**
- Dimension: internal consistency, soundness.
- Where:
  - goals.md:23 and scope.md:11: "v12 pre-releases (alpha, beta) adopted as soon as they are published; peer-range caps are install friction, not breakage".
  - goals.md:153: D4 exact peers.
  - consumption.md:65: "Only the latest release ships: no preview or release-candidate versions".
- Claim: "v12 pre-releases (alpha, beta) adopted as soon as they are published; peer-range caps are install friction, not breakage" (goals.md:23), next to D4's "`@carbon/react` 1.117.0, `@carbon/ibm-products` 2.99.0 exact peers" (goals.md:153).
- Evidence:
  - `@carbon/ibm-products` 2.99.0 peers `@carbon/react ^1.115.0` (npm view).
  - V4 section 3.3 justifies exact peers because "Markup must match our compiled CSS".
  - #23451 "Expose IBM Products components" sits in milestone v12-rc.0, due 2026-11-12.
- Why it matters:
  - The exact-peer rule treats a version mismatch as a correctness problem. The v12 reading calls peer caps mere friction. Both cannot hold.
  - Forcing ibm-products 2.99.0 onto a v12 prerelease is an untested breakage risk (for example, #22473 removes the EmptyState family at v12).
  - Adopting a Carbon alpha means Afframe's "latest" release carries pre-release Carbon into consumers' production apps.
- Suggested change: pick one policy and state it in goals D8 and consumption.md section 4 (Q5).

**F7. Included packages conflict with React 19, and pnpm with strict peers fails**
- Dimension: factual accuracy, feasibility.
- Where:
  - scope.md:211 (O24: `@carbon/icons-motion` is included)
  - scope.md:342 (S16: wrap `wc-resizer`)
  - consumption.md:29 and :48 (no guidance on peer rules)
  - carbon-reference.md:99 (lists icons-motion as legacy and out of scope)
- Claim: "O24 | devtools browser extension, `@carbon/icons-motion` | ... | polish · **included**" (scope.md:211), and S16: "wrap the Labs `wc-resizer` web component ... Consequence: Lit runtime" (scope.md:342). Neither mentions a React-version conflict.
- Evidence:
  - `npm view @carbon/icons-motion`: latest is 2.3.0 (2024-04-03). It peers `react ^16.8.6 || ^17.0.1` and depends on `@carbon/ibm-products ^2.11.0`.
  - I installed the planned set with npm 11.11.0 and React 19.2:
    - `@carbon-labs/wc-resizer@0.5.0` pulls `@carbon-labs/utilities@0.21.0`, which peers React 18 at most. npm therefore nests `react@18.3.1` and `react-dom@18.3.1` under it.
    - `@carbon/ibm-products` depends on `react-table@7.8.0`, which peers React 18 at most. npm flags it `invalid`.
  - `pnpm@12.6.0 install --strict-peer-dependencies` fails with `ERR_PNPM_PEER_DEP_ISSUES` and names all three. The input was react 19.2.0, @carbon/react 1.117.0, @carbon/ibm-products 2.99.0, wc-resizer 0.5.0 and icons-motion 2.3.0.
- Why it matters:
  - S20 excluded plane-stack-3d because it peers only React 18. icons-motion is older still (React 17 at most) and stays in.
  - A second React copy is a known cause of hook errors if any code path imports it.
  - Consumer monorepos with strict peers will fail on IBM Products alone unless they add `peerDependencyRules`. The analytics evidence shows such a setup (`sources/round4/A-analytics.md:21`, `strictPeerDependencies`).
- Suggested change:
  - Put O24 icons-motion and S16 wc-resizer back to the owner with the peer facts attached (Q11). Both are recorded decisions.
  - Whatever is decided, test the nested React under wc-resizer in the reference consumer.
  - Add pnpm `peerDependencyRules` guidance for react-table v7 to consumption.md section 3.

**F8. IBM Telemetry is still undecided, yet open-decisions.md says every phase-0 decision is made**
- Dimension: fit to brief (information control), consistency.
- Where: goals.md:107 (`[P]` "A decision on IBM Telemetry"); open-decisions.md:100 ("All phase-0 decisions in this file are decided"). It is not among D1 to D12.
- Claim: "`[P]` A decision on IBM Telemetry, which `@carbon/react` embeds and enables by default (opt-out), for Afframe UI and its consumers." (goals.md:107). No document records that decision.
- Evidence:
  - `npm view @carbon/react scripts.postinstall` and the same for `@carbon/ibm-products` both return `ibmtelemetry --config=telemetry.yml`.
  - The `@ibm/telemetry-js` README says collection "runs on CI servers, like GitHub Actions ... It never runs locally" and "analyzes your source code".
  - It captures these items, de-identified: repository URL, commit hash, branches, dependency names and versions.
  - It also captures JSX elements and attribute names and values from the instrumented package.
  - Opt-out: `IBM_TELEMETRY_DISABLED='true'`.
  - Labs packages depend on `@ibm/telemetry-js` too.
- Why it matters: the brief says information must be controlled. This telemetry runs in afframe/ui's CI and in the CI of every consumer monorepo that installs the peers, and no decision covers it.
- Suggested change: add it as D13 (Q2).

**F9. The documents disagree on which decisions have been made**
- Dimension: consistency, usability.
- Where:
  - next-steps.md:79-83: "Decided by Hleb" lists only D1, D8, D12 and the scope.
  - goals.md:151-161: D2 to D7, D10 and D11 are "Decided 2026-09-24"; D9 is deferred.
  - docs/README.md:3: "all documents are drafts".
  - scope.md:12: "Scope: accepted as proposed".
- Claim: next-steps.md:79-83, under "Decided by Hleb", lists "D1: React only", "D8", "D12" and the scope. goals.md:153, for example, reads "D4 ... **Decided 2026-09-24:** TypeScript ...; ESM only; ...".
- Evidence: goals.md rows D2 to D7, D10 and D11 carry no `[H]` marker, while the legend (goals.md:6) reserves `[H]` for things Hleb stated.
- Why it matters: the owner cannot tell which decisions he made himself, which Claude recorded as "recommendation accepted", and which are still drafts. next-steps.md is the file agents resume from, so an agent would treat D4 and D5 as open or as decided depending on which file it reads.
- Suggested change: keep one status table in goals.md (decision, who, date, source quote) and have next-steps.md point to it.

**F10. Keeping Storybook unhosted leaves consumers and agents without reachable docs**
- Dimension: fit to brief, soundness.
- Where: goals.md:159 (D10); consumption.md:35 (the Getting started page lives in Storybook); goals.md:30 ("one short guide"); goals.md:92 (agent-ready docs).
- Claim: "Storybook not hosted (local and CI only); component docs inside Storybook" (goals.md:159), and "Docs: a 'Getting started' page in Storybook with the consumer steps below" (consumption.md:35).
- Evidence: the conflict is internal to the docs. The model the docs cite, carbondesignsystem.com/llms.txt, returns HTTP 200 (curl).
- Why it matters: developers and coding agents in consumer repos cannot read an unhosted Storybook without cloning and running afframe/ui, so the consumer guide has no reachable home.
- Suggested change: name a reachable home for the consumer guide and the agent docs (for example the package README or docs inside the tarball), whatever is decided for Storybook hosting. See Q8.

**F11. Disclosure in the public repo: a private repo name, and local paths in the evidence**
- Severity: major. The sensitivity is low, but this is exactly what the brief asks to control. Dimension: public-repo disclosure, traceability.
- Where: consumption.md:66; sources/round4/V4-recommendation.md:4-5; C-carbon-build.md:7; S-solutions.md:47; round3/V3-verify.md:4 and later lines.
- Claim: "Later option on record: the approach of `<private repo>` (its release setup described) ...".
- Evidence:
  - `gh api repos/<private repo>` returns `visibility: private`.
  - The evidence files cited local scratch paths (git-ignored or temporary folders).
- Why it matters:
  - The docs name a private repo and describe its internal release controls in a public file.
  - The local paths are not a real leak. But they point at git-ignored or deleted folders, so nobody can reproduce the evidence from the public repo. They also break the `<npm pack>` convention in docs/README.md:16.
- Suggested change: describe the release approach without naming the repo. Replace the local paths with `<npm pack>/...` paths or the commands that produced them.

**F12. The licensing plan does not cover the repo, the combined CSS or company use**
- Dimension: legal.
- Where: consumption.md:31; consumption.md:72 ("Licence: resolved"); README.md:7-11; open-decisions.md:228-231.
- Claim: "Licences: PolyForm Noncommercial for Afframe code; Apache-2.0 LICENSE and NOTICE for the copied Carbon v12 source and the Carbon-derived CSS" (consumption.md:31), and "Licence: resolved (Hleb, 2026-09-24): the README states that commercial use needs a separate licence from the copyright holder." (consumption.md:72).
- Evidence:
  - Apache-2.0 section 4 applies to redistribution "in Source or Object form" (LICENSE-2.0.txt:90-93). The repo's root LICENSE is PolyForm only.
  - PolyForm NC defines "Your company" (Definitions section of the repo LICENSE) and allows only noncommercial purposes.
  - README.md:9 restates that restriction but records no licence granted to any company.
- Why it matters:
  - (a) Vendored v12 source in the public repo needs, inside the repo and not only in the tarball: an Apache LICENSE, the original file headers, and notices on modified files.
  - (b) `styles.css` mixes Apache-derived and PolyForm CSS in one file, and the package's `license` field is not specified.
  - (c) "Resolved" is premature if the consuming products belong to a company. Open-decisions item 20 lists three options, and none has been picked.
  - (d) There is no CLA or contribution terms. Outside PRs to a public repo therefore cannot later be licensed commercially by Hleb.
- Suggested change: add a licensing section covering (a) to (d), and keep item 20 open until the owner picks (Q9).

**F13. The package shape has an incomplete dependency rule and a missing entry point**
- Dimension: soundness, consistency.
- Where: consumption.md:13-22 and :29; goals.md:153.
- Claim: "regular dependencies, exact: Carbon Labs packages, `@tanstack/react-table`, `@carbon/charts-react`, `@carbon/ai-chat`, `@carbon/web-components`, `@carbon/icons-react`" (consumption.md:29).
- Evidence:
  - consumption.md:29 makes "Carbon Labs packages" regular dependencies. That would ship I50 `vscode-snippets` (editor snippets) and I52 `mdx-components` (docs authoring) to consumers.
  - O22 `@carbon/echarts-theme` is included (scope.md:209) but has no import path and no dependency entry.
  - `react-is` is a peer of @carbon/react (npm view) and appears in V4 section 3.3, but consumption.md:29 omits it.
  - V4 section 3.3 sets `@carbon/icons-react` to `^11.89.0`, while consumption.md:29 says exact.
  - The full install contains three versions of `@carbon-labs/utilities` (0.21.0, 0.26.0, 0.28.0).
- Why it matters: this list becomes the published `package.json`. Tooling packages would land in every consumer install. An included item with no entry point is either dead weight or undocumented surface. Mismatched ranges between the recommendation and the consumer guide cause install-time surprises.
- Suggested change: split Labs packages into runtime dependencies and tooling (devDependencies). Put O22 back to the owner (Q11). Align the version ranges with V4.

### Minor (one line each)

| ID | Dimension | Where | Issue | Fix |
|---|---|---|---|---|
| F14 | consistency | scope.md:161, :213, :229, :346; carbon-catalog.md:318 | plane-stack-3d is both "out" (S20, X12) and "included" (O26 "resolved: plane-stack-3d and mdx-components included (2.5)", catalog "included under the Labs rule"). | Make O26 and catalog:318 say "out (S20)". |
| F15 | consistency | scope.md:13 | Says "open choices S14, S16, S17", but all three are decided at scope.md:340-343. | Drop "open choices". |
| F16 | consistency | goals.md:23 | Says "`scope.md` S15 (pending)", but S15 is decided at scope.md:341. | Remove "(pending)". |
| F17 | consistency | scope.md:110, :127, :287 | I18 still includes core `preview__PageHeader`, which is deprecated (open-decisions.md:171) and was not picked (S6). I30 and B16 still say "pick one ... (section 7)". | Remove it from I18; point I30 and B16 to S6 (after Q4). |
| F18 | traceability | carbon-catalog.md:452 | Cites `round2/F-org-triage.md`, which does not exist. Lane F became `carbon-org-repos.md`. | Cite `carbon-org-repos.md`. |
| F19 | consistency | carbon-org-repos.md:9-19, :22 | Category counts do not match its own table (table rows: React extension 13 vs 8 claimed, tooling/infra 26 vs 20, governance 13 vs 8, other-framework 14 vs 20). The tags also differ from carbon-catalog.md section 8 (for example carbon-ai-chat is "core" here and "optional [core]" at carbon-catalog.md:418), with no pointer between the two. | Recount; add "tags superseded by carbon-catalog.md section 8". |
| F20 | factual accuracy | carbon-reference.md:273, :467, :483 | Calls Carbon's visual-regression tool "unverified". Carbon's `.github/workflows/ci.yml:419` has a `chromatic-react` job, and open-decisions.md:201 already says so. | State "Chromatic (ci.yml)". |
| F21 | traceability | docs/README.md:16 | The evidence conventions list rounds 1 to 3 and their verification files. They omit round 4 (V4), which D4 and D5 cite. | Add round 4 and V4. |
| F22 | usability | goals.md:144 | The heading reads "Open decisions (options, no pick yet)", but every row is decided or deferred. | Rename to "Decisions". |
| F23 | usability | scope.md:18-51, :138-139 | Section numbering skips 1.4. A blank line detaches the I36 row from its table, so it renders as plain text. | Renumber; remove the blank line. |
| F24 | factual accuracy | goals.md:151, consumption.md:33 | The docs list "Whether a package from a public repo can stay private" as open, but GitHub's docs answer it: packages inherit access permissions "but not the visibility", and the default visibility on first publish is private. | Record the answer; keep only the public-repo read-inheritance question open. |
| F25 | factual accuracy | consumption.md:20 | Says styles.css contains Labs CSS. V4 section 4.1 measured only Carbon and IBM Products, and Labs web-component styles live inside shadow DOM, not in a global stylesheet. | Mark Labs CSS "(to prove)". |
| F26 | consistency | next-steps.md:91 | Says "nothing was rendered", but S-sass-check.md:26 says "Rendered Tag and TextInput markup confirms square corners". | Say what was rendered and what was not. |
| F27 | factual accuracy | scope.md:74 | "#23451 blocked" is true (label `status: blocked`), but the row omits that the issue sits in milestone v12-rc.0, due 2026-11-12. That date sets how long the S15 copy has to bridge. | Add the milestone and date. |
| F28 | usability | open-decisions.md:100-231 | Outcomes are recorded only in one dense header paragraph. The item bodies still show every option, and the chosen one is not marked. | Mark the chosen option in each item. |
| F29 | traceability | goals.md:3 | The companion path `carbon-reference.md` is missing its `research/` prefix. | Use `research/carbon-reference.md`. |

## 3. Fact-check table

Verdicts: verified, refuted or unverifiable, against the primary source at review time. Nuance is in the source column.

| Claim | File:line | Verdict | Source and notes |
|---|---|---|---|
| `@carbon/react` 1.117.0, published 2026-09-23; `latest` = `next` = 1.117.0; no 2.x or v12 tag | scope.md:24, carbon-reference.md:12 | verified | `npm view @carbon/react time dist-tags`: 2026-09-23T14:58:17Z. There is also an old `beta` tag = 0.1.0 |
| v12 milestones: alpha 2026-10-31 (28 open / 21 closed), rc.0 2026-11-12 (10), beta 2026-12-31 (13/5), stable 2027-03-31 (5/1), v12.x undated | scope.md:32 | verified | `gh api repos/carbon-design-system/carbon/milestones?state=all`, 08:46 UTC |
| release-schedule: v12 Preview since 2023-05-25, remaining dates TBD | carbon-reference.md:12 | verified | carbon@main docs/release-schedule.md:12 |
| The 16 migrated components are excluded from the 1.117.0 build | scope.md:30 | verified | product-migrated-components.mjs. True for 1.117.0. On main the list is now 17 (PageHeader added by commit 4be1f9e6f, 06:40 UTC) |
| PR #23209 is "approved, not merged" | open-decisions.md:172 | refuted | `gh api .../pulls/23209`: merged 2026-09-24T06:40:09Z. The claim was true when written |
| Core `preview__PageHeader` keeps pointing at the deprecated code | open-decisions.md:172 | verified | carbon@main src/index.ts:108-109 |
| ibm-products 2.99.0 peers `@carbon/react ^1.115.0` | scope.md:33 | verified | `npm view @carbon/ibm-products peerDependencies` |
| ai-chat 1.21.0 peers `@carbon/web-components >=2.54.0 <3.0.0`; ESM only | scope.md:33, consumption.md:57 | verified | `npm view @carbon/ai-chat peerDependencies type exports` |
| TanStack 9.2.4 is `latest`; 9.0.0 published 2026-08-04; ESM only; `react >=18`; `./legacy` export | goals.md:156, carbon-reference.md:17 | verified | `npm view @tanstack/react-table` |
| tsdown 0.23.0 published 2026-09-03; maintainers yyx990803 and sxzz | goals.md:153 via V4 section 3.4 | verified | `npm view tsdown` |
| `'use client'` only at the @carbon/react entry; PR #20391 merged 2025-09-02; `exports` is null | carbon-reference.md:13, :127 | verified | tarball es/index.js:8; package.json; `gh api .../pulls/20391` |
| @carbon/react embeds IBM Telemetry, opt-out | carbon-reference.md:25 | verified | `npm view ... scripts.postinstall`; @ibm/telemetry-js README. The docs omit that it runs in CI and scans JSX (F8) |
| Compiled v12 CSS is 1.77 MB, 173 KB gzip, all four themes, `./fonts` URLs | open-decisions.md:126, consumption.md:20-22 | verified | Local sass 1.105.0 compile of the V4 section 4.1 entry: 1,766,203 B; 172,998 B with gzip -9; 25 selectors each for white, g10, g90 and g100; `url("./fonts/...")` |
| v11 and v12 Sass builds both exit 0 | scope.md:61 | verified | Local compile of the V4 entry: 4.4 s and 4.6 s |
| GitHub Packages needs a token even for public packages; classic PAT only | goals.md:151, consumption.md:45 | verified | docs.github.com npm registry page: "only supports authentication using a personal access token (classic)" |
| A "Manage Actions access" grant lets consumers use `GITHUB_TOKEN`, and Dependabot gets access through the same grant | consumption.md:44 | verified | Access-control page: "Granting a repository access here also allows Dependabot to pull ... without requiring personal access tokens" |
| It is still open whether the package can stay private while the repo is public | goals.md:151, consumption.md:33 | refuted | Access-control page: permissions are inherited "but not the visibility", and the default is private. Still unverifiable: what inherited "read" means for a public linked repo |
| Forks of a public repo granted access may reach private packages | carbon-reference.md:293 | verified | Access-control page |
| tanstack-carbon has no licence; examples pin `^8.20.1` | carbon-reference.md:184-185 | verified | `gh api repos/.../tanstack-carbon`; react/mix-and-match/package.json:17 |
| stylelint plugin: MIT in package.json vs an Apache-2.0 LICENSE file; single maintainer | scope.md:137 | verified | 5.0.6 tarball; `npm view ... maintainers` |
| Carbon uses Chromatic | open-decisions.md:201 | verified | carbon ci.yml:419-485 (`chromatic-react`) |
| Carbon's CI runs only the parts that changed (path filters) | goals.md:160 | verified | ci.yml:203 (`dorny/paths-filter` on the e2e job). Other jobs not checked |
| #23260 open (v12-beta); #22473 open (v12-alpha); #2308 open; #22427 open (v12-stable) | scope.md:58, :67-69 | verified | `gh api` issues |
| PR #22728 merged 2026-08-05 | scope.md:58 | verified | `gh api .../pulls/22728` |
| The Labs date picker needs a Temporal polyfill | scope.md:254 (M20) | verified | @mdn/browser-compat-data 8.1.2: Chrome/Edge 144, Firefox 139, Safari "preview", iOS Safari no support |
| `@carbon/icons-motion` fits the stack (included as O24) | scope.md:211 | refuted | `npm view @carbon/icons-motion`: React 16/17 peers only; last published 2024-04-03 |
| plane-stack-3d peers React 18 only | scope.md:346 | verified | `npm view` peers `react ^18.0.0` |
| `react-style-picker` is usable (included as I42) | scope.md:152 | refuted | npm install fails with ETARGET; pnpm fails with ERR_PNPM_NO_MATCHING_VERSION (F1) |
| `@lit/react` is only a devDependency of react-style-picker | scope.md:152 | verified | `npm view` devDependencies |
| react-ui-shell declares no peers | V4 row 14 | verified | `npm view`: its only dependency is `@ibm/telemetry-js` |
| @carbon/styles 1.116.0 ships the Sass of the migrated components | carbon-catalog.md:179 | verified | Local install: Tearsheet, TagOverflow, side-panel, page-header and others are in scss/components/_index.scss |
| carbondesignsystem.com/llms.txt returns 200; react.carbondesignsystem.com/llms.txt returns 404 | carbon-reference.md:274 | verified | curl |
| afframe/afframe, afframe/docs and afframe/framework are public | goals.md:34 | verified | `gh api repos/...` |
| `<private repo>` can be named publicly (implied by citing it) | consumption.md:66 | refuted | `gh api repos/<private repo>`: private |
| `@ibm/plex` 6.4.1 is OFL-1.1 | carbon-reference.md:88 | verified | `npm view @ibm/plex` |
| The PolyForm URL works without a trailing slash | carbon-reference.md:317 | verified | curl: HTTP 200 |
| The repo LICENSE carries "Required Notice: Copyright 2026 Hleb Tkachenko (https://afframe.com)" | carbon-reference.md:317 | verified | LICENSE:1 |
| The table of the two workflows (triggers, permissions, tag pins, `CLAUDE_CODE_OAUTH_TOKEN`, plugin marketplace, `--allowedTools`) | carbon-reference.md:344-353 | verified | .github/workflows/claude.yml:3-41; claude-code-review.yml:3-92 |
| "the README states that commercial use needs a separate licence from the copyright holder" | consumption.md:72 | verified | README.md:9. The sentence exists, but it grants nobody a licence, so "resolved" does not follow (F12c) |
| npm trusted publishing and provenance rules | goals.md:106 | unverifiable | docs.npmjs.com/trusted-publishers was fetched but not parsed |
| v12-alpha will be published to npm | scope.md:32 | unverifiable | Future event |

## 4. Gaps and overreach

**Gaps (things a production design-system package needs that the docs leave open or skip):**
- **Accessibility target.** It is still "to be set" (goals.md:82), yet the test stack (D11) is already decided. The IBM checklist 7.3 cited at carbon-reference.md:272 includes WCAG 2.2 A/AA, so the choice between 2.1 AA and 2.2 AA is open.
- **SSR of web-component pieces.** ai-chat, the wrapped wc-resizer and style-picker are Lit components. `'use client'` does not stop server rendering, and their Next.js App Router behaviour is untested. carbon-reference.md:159 marks WC SSR as unverified, but consumption.md does not mention it.
- **Localization and RTL.** goals.md:124 asks for localization, but there is no locale list and no plan for overriding Carbon's component strings. O6 (direction primitives) was declined without an RTL statement.
- **Performance budgets.** goals.md:116 (tree-shaking) and goals.md:123 (performance budgets) meet a monolithic 173 KB-gzip CSS with no CSS tree-shaking, and no budget numbers are set.
- **Consumer install guidance.** It lacks pnpm strict-peer rules (F7), Labs' undeclared peers (V4 row 14) and the telemetry opt-out (F8).
- **Public-repo governance.** There is no CLA or DCO, no CODEOWNERS and no SECURITY.md. There is no Apache notice inside the repo for vendored code (F12).
- **Release hygiene.** The changelog is deferred "until the full build" (consumption.md:66), while consumers install from the first release, and every Carbon bump forces a coordinated release. Rollback and deprecation of a bad GitHub Packages version are not covered.
- **Visual regression operations.** Committed baselines across 4 themes and every story need a pinned rendering environment (for example a Docker image) and repo-size control. Neither is planned.
- **v12 theming shift.** OKLCH, a two-theme model and token consolidation are not in the plan (F3).

**Overreach (planned, but the brief or a stated need does not require it):**
- **The reading "every live Labs package is in"** (goals.md:25). It pulls in 0.x packages with no tie to a named need: animated-header, registration-flow 0.2.0, processing, whats-new, and tooling (vscode-snippets, mdx-components). It has already produced one uninstallable item (F1) and one nested React (F7). Hleb's words were "Labs is mandatory", which can also be read as "Labs where it serves a need" (Q7).
- **O22 ECharts theme.** It adds a second charting stack next to Carbon Charts, with no entry point.
- **O24 icons-motion and devtools.** icons-motion does not support the project's React range.
- **Goal G, design-tool parity** (Code Connect, Claude Design sync, drift detection). It is useful but beyond the brief. It is already a separate phase, so treat it as optional.
- **Document volume.** 2,036 lines of deliverables plus about 820 KB of evidence, for a package with no code yet. carbon-reference.md alone is 611 lines, which is heavy for a decision-maker.

## 5. Questions for the owner

For each question, the options and their consequences, one line per option. There is no pick unless the evidence is one-sided.

**Q1. tanstack-carbon code reuse (S4)**
- a. Keep the decision and copy the code: fastest, but you redistribute IBM code that has no licence grant, in a public repo and a published package.
- b. Ask IBM (an issue on tanstack-carbon) to add a licence, and copy after: clean, but timing is unknown.
- c. Write the table layer from TanStack and Carbon docs, using the examples as a behaviour reference only: more work, clean ownership.

**Q2. IBM Telemetry (new D13)**
- a. Accept the default: consumer and afframe/ui CI send de-identified repo, dependency and JSX usage data to IBM.
- b. Set `IBM_TELEMETRY_DISABLED=true` in afframe/ui CI and document it for every consumer CI: one line per workflow, but easy to forget.
- c. Block dependency lifecycle scripts through package-manager settings: covers everything, but other packages that need postinstall steps must then be allowlisted.

**Q3. S15: copy the migrated components now, or wait**
- a. Copy now from main: v12 versions immediately, but it costs the internal-import rewrite, a context-duplication risk and re-syncs until at least rc.0 (target 2026-11-12, not committed).
- b. Use the IBM Products versions (I19 to I26) until Carbon exposes them, then switch behind Afframe's wrapper: v11 look for those components meanwhile, and little throwaway work.
- c. Copy only the components that Afframe needs and IBM Products lacks: a smaller copy set, but a mixed look.

**Q4. PageHeader, now that it is on the migration list**
- a. Keep S6 (IBM Products `preview__PageHeader`, c4p): available today, and moves at v12 through the wrapper.
- b. Treat it under S15 and copy core's v12 PageHeader: consistent with S15, but it was migrated today and is the freshest code to track.
- c. Wait for rc.0: no copy, and IBM Products meanwhile.

**Q5. Carbon v12 pre-releases vs "only the latest release ships"**
- a. Adopt alpha and rc in Afframe releases immediately: most current, but consumers run pre-release Carbon in production and the IBM Products peer cap must be forced.
- b. Track pre-releases on a branch and in Storybook only, and release on v12 stable: stable consumers, but the v12 look arrives later.
- c. Adopt from rc.0: a middle ground, dependent on rc timing.

**Q6. What "full v12 look" means today**
- a. Accept the flag subset as "v12 day one" and re-baseline at alpha or rc: fits the current plan, but expect a second visual migration.
- b. Also watch the `next` branch or the v12 Storybook for unflagged work before freezing tokens and themes: fewer surprises, and some tracking effort.

**Q7. Reading of "Labs is mandatory"**
- a. Every live Labs package (the current reading): widest coverage, but it carries 0.x churn, undeclared peers, one uninstallable package and a nested React.
- b. Labs packages that map to a named need: smaller surface, and it needs a need per package.
- c. Either a or b, plus an install-and-render gate before each inclusion.
- Whichever reading is chosen, I42 cannot be installed today (F1). The evidence on that is one-sided.

**Q8. Where consumers read the docs**
- a. Keep Storybook unhosted: nothing to host, but consumers must clone and run Storybook.
- b. Host Storybook publicly: the source is public anyway, and agents and developers can read it, but it reveals unreleased stories.
- c. Host it behind access control: private, but needs hosting and auth work.
- d. Ship Getting started and machine-readable docs inside the package tarball: reachable offline and by agents, but it duplicates part of Storybook.

**Q9. Licence for company use and for outside contributions**
- a. Keep the copyright personally and give the company a written commercial licence: minimal change, and one document to keep.
- b. Transfer the copyright to the company: the company becomes the PolyForm licensor.
- c. Change the licence of afframe/ui: simplest for consumers, and changes the "not open source" stance.
- Contributions:
  - Require a CLA or copyright assignment: outside code stays licensable, at the cost of contributor friction.
  - Do not accept outside PRs: no friction, and no external help.

**Q10. Package visibility on GitHub Packages**
- a. Private: needs a per-repo "Manage Actions access" grant and a classic PAT for developers. It protects little, because the source is public.
- b. Public: any GitHub token installs it, with no per-repo grant. A token is still required, and a public package cannot be made private again.

**Q11. Three included items that conflict with the stack (O24, S16, O22)**
- O24 `@carbon/icons-motion` (peers React 16/17 only; last published 2024-04-03):
  - a. Keep it: consumers on React 19 get peer warnings or strict-peer failures.
  - b. Exclude it under the same rule as S20 (plane-stack-3d).
  - c. Keep it for design reference only, not as a dependency.
- S16 wrap `wc-resizer` (its `@carbon-labs/utilities@0.21.0` pulls a nested `react@18.3.1` and `react-dom@18.3.1`):
  - a. Keep the wrap: grid, panels and 2D handle, plus a second React copy on disk and a strict-peer failure.
  - b. Keep it, with a package-manager override forcing a single React: needs proof in the reference consumer.
  - c. Use only `react-resizer` (I9) until Labs updates wc-resizer: single handle only.
- O22 `@carbon/echarts-theme` (included, but no import path or dependency in consumption.md):
  - a. Add an `@afframe/ui/echarts` entry: a second charting stack to ship, test and theme.
  - b. Leave ECharts to consumer apps, with docs only: no weight in the package.
  - c. Drop O22.

## 6. What is solid

- **Package facts.** Package names, versions, dates, peers and ESM-only status match npm at review time: @carbon/react, styles, ibm-products, ai-chat, TanStack v9, tsdown, Labs date-picker and resizer.
- **Build and style evidence (V4) reproduces exactly.** The same Sass entry gives 1,766,203 bytes (172,998 with gzip -9 vs 173,001 claimed), all four theme classes and relative `./fonts` URLs.
- **v12 mechanics are right.** The React flag and the Sass flag are both needed, and the precompiled CSS stays v11-styled.
- **GitHub Packages claims hold** against the current GitHub docs: classic PAT only, the `GITHUB_TOKEN` grant, Dependabot access through the grant, and the fork warning.
- **The catalog's per-section tag counts reconcile** with its tables, and the org-repos tag counts total 121.
- **The PageHeader analysis held up.** It predicted that core's `preview__PageHeader` would keep pointing at deprecated code, and today's merge confirms it.
- **The discipline is good.** Claims are tagged "(unverified)", verification passes override the research lanes, corrections are recorded, and runner-ups and costs are stated for D4 and D5.
- **The core architectural choices are well argued:** never bundle Carbon, keep one CSS artifact, and have a reference consumer prove the path.

## 7. Receipt

**Files read in full:**
- docs/README.md, docs/goals.md, docs/scope.md, docs/consumption.md
- docs/plans/next-steps.md, docs/plans/open-decisions.md
- docs/research/carbon-reference.md, docs/research/carbon-catalog.md
- docs/research/sources/round4/V4-recommendation.md, docs/research/sources/round3/S-sass-check.md
- README.md, .gitignore, .github/workflows/claude.yml, .github/workflows/claude-code-review.yml, LICENSE (grep of definitions)

**Files read in part:**
- docs/research/carbon-org-repos.md (whole table and summary)
- sources/round4/A-analytics.md (lines 1-30)
- targeted greps of W-v12-day-one.md, V3-verify.md, V-verify.md, A-v11-vs-v12.md
- other lane files were not read end to end

The author's git-ignored working notes were not read.

**Commands (all read-only toward GitHub and the repo):**
- `npm view` for 28 packages (versions, time, dist-tags, licence, peers, deps, scripts)
- `npm view @ibm/telemetry-js readme`
- `gh api`:
  - milestones
  - issues #23260, #22473, #22427, #23451, #21926, #22817, #22894, #23334, #23485, #22382, #22895; carbon-ai-chat #2308
  - pulls #23209, #22728, #20391
  - commits on product-migrated-components.mjs; commit 4be1f9e6f
  - contents of product-migrated-components.mjs, src/index.ts, Tearsheet/*.tsx, .github/workflows/ci.yml, package.json, docs/release-schedule.md
  - branch `next` and compare main...next
  - a search of the v12-alpha and v12-rc.0 milestones
  - repos: afframe/*, hlebtkachenko/analytics, one private repo, tanstack-carbon
  - rulesets and repo settings of afframe/ui
- `curl`:
  - docs.github.com article API for the npm registry, access-control and permissions pages
  - carbondesignsystem.com/llms.txt, react.carbondesignsystem.com/llms.txt
  - the PolyForm URL, apache.org LICENSE-2.0.txt
  - docs.npmjs.com/trusted-publishers (fetched, not parsed)

**Temp directories created with `mktemp -d` (paths removed):**
- @carbon/react 1.117.0 tarball
- sass 1.105.0 compile of the V4 entry, v12 and v11
- @mdn/browser-compat-data 8.1.2
- react-style-picker install (fails with ETARGET)
- full planned dependency set, npm 11.11.0 and React 19.2
- stylelint-plugin-carbon-tokens 5.0.6 tarball
- pnpm 12.6.0 with `--strict-peer-dependencies`, lockfile only
- pnpm 12.6.0 lockfile-only resolve of react-style-picker (fails with ERR_PNPM_NO_MATCHING_VERSION)

**Other scratch files:**
- Docs page captures (npm registry, access control, permissions, trusted publishers) and pointer files, in a scratch folder

No file in the repository was changed. The only file written inside the repo tree is this report, in a git-ignored folder.

**Could not verify:**
- afframe/ui branch protection and Actions permissions (HTTP 403, "Resource not accessible by integration"). `security_and_analysis` came back null.
- npm trusted-publishing and provenance wording (page not parsed).
- SSR behaviour of the Lit web components under Next.js (not built).
- Whether v12-alpha will be published to npm.
- What inherited "read" access means for a package linked to a public repo.
- Whether the copied v12 components compile or render against 1.117.0 (I read import lists only; nothing was built).
- Runtime behaviour of the nested React 18 under wc-resizer.
- The legal effect of combining PolyForm NC and Apache-2.0. This review is not legal advice.
