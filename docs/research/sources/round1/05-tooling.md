> **Pre-verification draft, kept as evidence.** Claims here were checked afterwards; the verification files (`round1/07a-verify-distribution-legal-security.md`, `round1/07b-verify-carbon.md`) override this file, and the authoritative text is `docs/research/carbon-reference.md` and `docs/research/carbon-catalog.md`.

# 05 · Design and engineering tooling
Retrieved: 2026-09-23 · Lane: tooling

## Summary (5-10 bullets)

- Carbon publishes official Figma kits on Figma Community: a core `(v11) Carbon Design System` library covering all four themes (White, Gray 10, Gray 90, Gray 100) plus separate per-theme files, and IBM says the core kits now use **Figma variables and modes** so the four themes live in one file with mode-switching instead of four separate files. Source: [Medium — Introducing Figma variables and a consolidated "All themes" library](https://medium.com/carbondesign/introducing-figma-variables-and-a-consolidated-all-themes-library-d4893d1b8920), [Figma Community — (v11) Carbon Design System](https://www.figma.com/community/file/1157761560874207208/v11-carbon-design-system).
- A separate **Carbon for IBM Products Figma kit** exists (Beta per IBM's own kits page) and is versioned in the `carbon-for-products-design-kit` GitHub repo (active, pushed 2025-04-04). A **Carbon Charts / Data Visualization Figma kit** also exists, first shipped as an Alpha in 2023, with an `(Alpha) Carbon Charts Library` file live on Figma Community. Sources: [carbondesignsystem.com/designing/kits/figma/](https://carbondesignsystem.com/designing/kits/figma/), [GitHub carbon-for-products-design-kit](https://github.com/carbon-design-system/carbon-for-products-design-kit), [Medium — Introducing the Data Viz Figma Kit: Alpha release](https://medium.com/carbondesign/introducing-the-data-viz-figma-kit-alpha-release-bc3cb9113555), [Figma — (Alpha) Carbon Charts Library](https://www.figma.com/community/file/1342888187036080999/alpha-carbon-charts-library).
- `@carbon/react` has **official Figma Code Connect** integration, exposing real Carbon React source in Figma Dev Mode; per Carbon's own team, "Variable modes aren't currently supported in Code Connect" yet (an upstream Figma limitation Carbon is tracking). Source: [Medium — Carbon and Figma Code Connect: Redefining the Design-to-Code Experience](https://medium.com/carbondesign/carbon-and-figma-code-connect-redefining-the-design-to-code-experience-836eb3f454fc), [GitHub issue #17607 — Figma Code Connect: Upstream Bugs (blocked by Figma)](https://github.com/carbon-design-system/carbon/issues/17607).
- Carbon ships an **official MCP server** ("Carbon MCP", repo `carbon-design-system/carbon-mcp`, active) that exposes component docs/code/tokens/icons for `@carbon/react`, `@carbon/web-components`, Carbon for IBM Products, icons/pictograms, `@carbon/ai-chat`, `@carbon/charts`, and select `@carbon-labs/*` preview components to AI coding agents. It is explicitly labeled **public preview**; access requires onboarding, and the repo README states "IBMers can immediately start using Carbon MCP by following the onboarding instructions, while non-IBMers can request access." Source: [carbondesignsystem.com/developing/carbon-mcp/overview/](https://carbondesignsystem.com/developing/carbon-mcp/overview/), [GitHub carbon-design-system/carbon-mcp README](https://github.com/carbon-design-system/carbon-mcp).
- `carbondesignsystem.com` serves an **`llms.txt`** file (confirmed HTTP 200) with a curated, categorized link index (Getting Started, Foundations, Components with per-component usage links, etc.) intended for LLM consumption. `react.carbondesignsystem.com/llms.txt` returned 404 (not present on the React Storybook subdomain). Source: direct fetch of `https://carbondesignsystem.com/llms.txt` (2026-09-23); `https://react.carbondesignsystem.com/llms.txt`.
- Carbon's website is `carbondesignsystem.com`, built on **`@carbon/gatsby-theme-carbon`** (Gatsby-based, monorepo with Yarn workspaces/Lerna); no evidence of a Next.js or other successor migration was found. A parallel "Carbon Platform" repo (`carbon-platform`, described as "the 'next' version of the Carbon Design System website, as a platform") exists but its production status is unverified. Source: [GitHub gatsby-theme-carbon](https://github.com/carbon-design-system/gatsby-theme-carbon), [gatsby.carbondesignsystem.com](https://gatsby.carbondesignsystem.com/), inventory `.github_repos[]` entry for `carbon-platform` (not archived, pushed 2025-04-01).
- Each Carbon component doc page is split into **Usage / Style / Code (Accessibility appears as its own tab or sub-page, e.g. `/components/<name>/accessibility/`)**, e.g. `carbondesignsystem.com/components/tabs/usage/` and `carbondesignsystem.com/components/tabs/accessibility/`. Accessibility pages document keyboard interaction, ARIA roles, and known caveats per component. Source: [carbondesignsystem.com/components/tabs/usage/](https://carbondesignsystem.com/components/tabs/usage/), [carbondesignsystem.com/components/tabs/accessibility/](https://carbondesignsystem.com/components/tabs/accessibility/).
- Carbon's stated accessibility bar: color themes and components target **WCAG 2.1 AA**, layered onto the "IBM Accessibility Checklist" (itself based on WCAG AA, Section 508, and EN 301 549/European standards). Source: [carbondesignsystem.com/guidelines/accessibility/overview/](https://carbondesignsystem.com/guidelines/accessibility/overview/) (per search-engine cache/summary — page itself is JS-rendered and could not be scraped directly, see Open questions).
- The underlying tooling for automated a11y checks is IBM's own **Equal Access** engine, published on npm as `accessibility-checker` (and `accessibility-checker-engine`), supporting rule sets for **WCAG 2.0/2.1/2.2 (A & AA)** and "IBM Accessibility v7.2"; it plugs into Selenium/Puppeteer/Playwright for CI pipelines. Per the project inventory, `accessibility-checker` v4.0.34 (Apache-2.0, last published 2026-09-08) is in the dependency graph already. Source: [GitHub IBMa/equal-access](https://github.com/IBMa/equal-access), [npm accessibility-checker-engine](https://www.npmjs.com/package/accessibility-checker-engine), inventory `00-inventory.json`.
- Carbon runs **Playwright-based accessibility tests** in its own CI, invoked as `yarn avt`, executing files like `e2e/components/<Component>/<Component>-test.avt.e2e.js --project chromium`; this is separate from Storybook's own `@storybook/addon-a11y` (axe-core based) which Carbon PRs also touch for Storybook controls/docs work. Source: search-engine aggregation of Carbon PR titles/commands (e.g. `carbon-design-system/carbon` PR #22864, #22860) — could not directly open CI config files in this pass; see Open questions.

## Packages (table: package · version · last publish · license · status · purpose; from the inventory)

| package | version | last publish | license | status | purpose |
|---|---|---|---|---|---|
| `@carbon/react` | 1.117.0 | 2026-09-23 | Apache-2.0 | active | React component library (Carbon v11), Code Connect target |
| `@carbon/web-components` | 2.64.0 | 2026-09-23 | Apache-2.0 | active | Web Components implementation of Carbon v11 |
| `@carbon/styles` | 1.116.0 | 2026-09-23 | Apache-2.0 | active | Sass/CSS design tokens and component styles |
| `@carbon/themes` | 11.82.0 | 2026-09-23 | Apache-2.0 | active | Theme token definitions (White, g10, g90, g100) |
| `@carbon/colors` | 11.59.0 | 2026-09-23 | Apache-2.0 | active | Color token package |
| `@carbon/grid` | 11.63.0 | 2026-09-23 | Apache-2.0 | active | Layout grid tokens/utilities |
| `@carbon/type` | 11.68.0 | 2026-09-23 | Apache-2.0 | active | Typography tokens |
| `@carbon/motion` | 11.53.0 | 2026-09-23 | Apache-2.0 | active | Motion/easing tokens |
| `@carbon/elements` | 11.98.0 | 2026-09-23 | Apache-2.0 | active | Aggregate token package (colors+type+grid+motion) |
| `@carbon/icons` | 11.89.0 | 2026-09-23 | Apache-2.0 | active | SVG icon source library |
| `@carbon/icons-react` | 11.89.0 | 2026-09-23 | Apache-2.0 | active | React icon components |
| `@carbon/pictograms` / `-react` | 12.85.0 / 11.111.0 | 2026-09-23 | Apache-2.0 | active | Pictogram assets |
| `@carbon/charts` / `-react` | 1.27.20 | 2026-09-16 | Apache-2.0 | active | D3-based data-viz library, Carbon Charts Figma kit's code counterpart |
| `@carbon/ibm-products` | 2.99.0 | 2026-09-16 | Apache-2.0 | active | "Carbon for IBM Products" pattern library (React) |
| `@carbon/ibm-products-web-components` | 0.48.0 | 2026-09-16 | Apache-2.0 | active | Web Components variant of IBM Products |
| `@carbon/ibm-products-styles` | 2.95.0 | 2026-09-16 | Apache-2.0 | active | Styles for IBM Products |
| `@carbon/ai-chat` | 1.21.0 | 2026-09-21 | Apache-2.0 | active | Carbon AI Chat framework (covered by Carbon MCP) |
| `@carbon/ai-chat-components` | 1.11.0 | 2026-09-21 | Apache-2.0 | active | Web-component primitives for AI Chat |
| `@carbon/storybook-addon-theme` | 2.27.0 | 2025-12-04 | Apache-2.0 | active but slower cadence | Theme switcher addon for Storybook, publicly reusable |
| `accessibility-checker` | 4.0.34 | 2026-09-08 | Apache-2.0 | active | IBM Equal Access a11y test engine (Node/CI) |
| `carbon-components` | 10.58.15 | 2026-08-21 | Apache-2.0 | **deprecated** ("no longer supported", see carbondesignsystem.com/deprecations/) | legacy v10 vanilla component CSS/JS |
| `carbon-components-react` | 8.67.0 | 2026-08-21 | Apache-2.0 | **deprecated** (same notice) | legacy v10 React components |
| `carbon-components-angular` | 5.72.2 | 2026-08-10 | Apache-2.0 | active | Angular implementation (v11-era) |
| `carbon-components-svelte` | 0.112.0 | 2026-09-11 | Apache-2.0 | active (community-maintained) | Svelte implementation |
| `carbon-components-vue` | 0.0.1 | 2022-04-12 | none listed | stale (last publish 2022) | early/abandoned Vue package name; superseded by `@carbon/vue` 3.0.32 |
| `carbon-addons-iot-react` | 5.18.2 | 2026-09-01 | Apache-2.0 | active | IoT/Maximo-specific React components on Carbon |

Note: the inventory query for "carbon" also returned dozens of `@carbon-labs/*` experimental packages (AI components, date picker, resizer, etc.) at 0.x versions, actively published (Aug–Sep 2026); these are Carbon Labs incubation packages, not yet part of core Carbon, and several (`@carbon-labs/wc-wysiwyg`, `@carbon-labs/ai-extended-button`) are pre-1.0/rc. Full list in inventory query output captured during this research session.

## Capabilities

- **Figma**: core v11 kit with all 4 themes via variables/modes in one library file; IBM Products kit (Beta) and Carbon Charts kit (Alpha-origin) as separate, independently versioned Figma Community files/GitHub repos (`carbon-for-products-design-kit`, kit for charts referenced in Medium post, not confirmed to have its own dedicated GitHub repo — see Open questions). Figma Code Connect ships for `@carbon/react` so Dev Mode can show real component code next to Figma layers.
- **Storybook**: Carbon's React docs/demo site runs on Storybook (`react.carbondesignsystem.com`, confirmed to be Storybook-branded and serving `storybook-core-server-presets`/`manager-bundle.js` assets); Web Components equivalent lives at `web-components.carbondesignsystem.com`. `@carbon/storybook-addon-theme` is published to npm/the Storybook integrations catalog for a theme switcher, reusable by any consuming Storybook. `@storybook/addon-a11y` (axe-core-based) is the generic a11y-in-Storybook mechanism Carbon-adjacent PRs reference.
- **Docs site structure**: per-component pages split into Usage / Style / Code / Accessibility (confirmed via `/components/tabs/usage/`, `/components/tabs/accessibility/`, `/components/code-snippet/accessibility/` URL patterns).
- **AI tooling**: official Carbon MCP server (public preview, gated access) plus a machine-readable `llms.txt` at the root of carbondesignsystem.com. No evidence found of an official GitHub Copilot extension or similar; only the MCP server and llms.txt are confirmed first-party AI integrations.
- **Accessibility tooling**: `accessibility-checker` npm package (IBM Equal Access engine) is the reusable CI tool; supports WCAG 2.0/2.1/2.2 A/AA rule sets and plugs into Selenium/Puppeteer/Playwright.
- **Testing**: Carbon's own e2e/a11y suite runs on Playwright with a distinct `avt` (accessibility verification test) naming convention (`*-test.avt.e2e.js`), run via `yarn avt` / `yarn playwright test ... --project chromium`, observed in multiple live `carbon-design-system/carbon` PRs.

## Customization hooks

- `@carbon/themes` + Sass tokens (and Figma variables/modes on the design side) are the intended token-driven customization surface — same conceptual token set on both sides, though Figma variable modes and Figma Code Connect are not yet unified (Code Connect doesn't read variable modes, per Carbon's own issue tracker).
- `@carbon/storybook-addon-theme` can be composed into a downstream Storybook instance for theme switching without forking Carbon's Storybook config.
- Storybook Composition (referencing another Storybook's `refs` config to pull in its story index) is the generic Storybook mechanism a downstream design system could use to surface Carbon's own Storybook stories inside its own instance; no evidence was found that Carbon documents or endorses this pattern itself — this is a generic Storybook capability, not a Carbon-specific one (see Open questions).
- Carbon MCP and `llms.txt` are both consumable by a downstream team's own AI tooling/agents as read-only reference sources; Carbon MCP is gated (request-access) for non-IBMers.

## Known gaps, pitfalls, open issues (link issues)

- Figma Code Connect + variable modes: not integrated yet — [GitHub #17607](https://github.com/carbon-design-system/carbon/issues/17607).
- `carbon-components` and `carbon-components-react` (Carbon v10) are formally deprecated with a redirect to `carbondesignsystem.com/deprecations/` — do not build on these.
- `carbon-components-vue` (unscoped, 0.0.1, last published 2022) looks abandoned in favor of `@carbon/vue`; a downstream team should not depend on the unscoped package.
- Recurring per-component accessibility bugs are actively tracked and fixed on a rolling basis, e.g. missing ARIA roles on tabs ([#23373](https://github.com/carbon-design-system/carbon/issues/23373)), Pagination a11y issues ([#21932](https://github.com/carbon-design-system/carbon/issues/21932)), Dropdown `aria-label` misapplication ([#17558](https://github.com/carbon-design-system/carbon/issues/17558)), RadioButton group accessible name ([#17753](https://github.com/carbon-design-system/carbon/issues/17753)) — i.e. WCAG 2.1 AA is a target, not a guarantee for every component at every point in time.
- IBM Products has its own open a11y issues too, e.g. UserAvatar violations ([#6353](https://github.com/carbon-design-system/ibm-products/issues/6353)), DataGrid issues ([#6669](https://github.com/carbon-design-system/ibm-products/issues/6669)), TagSet overflow button not announcing count ([#9910](https://github.com/carbon-design-system/ibm-products/issues/9910)).
- Carbon MCP is explicitly "public preview" and access-gated for non-IBM users — a downstream team outside IBM cannot assume unrestricted access; feature request thread for a fully open MCP server exists at [GitHub #20855](https://github.com/carbon-design-system/carbon/issues/20855).
- The `carbon-platform` "next" website repo exists in parallel with the live `carbon-website`/`gatsby-theme-carbon` stack; its relationship to (or replacement timeline for) the current Gatsby site is unverified from primary sources in this pass.

## Options for Afframe UI (option · consequence, one line each)

- **Use Carbon's official Figma kit + Code Connect as the design source of truth** — inherits Carbon's token/variable structure directly but is bound by Code Connect's current lack of variable-mode support, so multi-theme Dev Mode handoff will need a manual workaround.
- **Fork/re-theme the Figma kit for Afframe-specific components** — full control over Afframe's own variables/components, but loses automatic sync with upstream Carbon Figma updates and requires manual re-application of Carbon's changes.
- **Compose Carbon's public Storybook into Afframe UI's Storybook via Storybook Composition** — lets consumers browse both libraries from one Storybook instance with no fork, but composition is a generic Storybook feature (not something Carbon documents/guarantees), so it depends on Carbon's Storybook staying publicly reachable and stable.
- **Build Afframe UI's own Storybook from scratch, treating Carbon only as an npm dependency** — full control over addons/docs/testing setup, but duplicates work Carbon has already done and risks visual/behavioral drift from Carbon's canonical demos.
- **Adopt `accessibility-checker` (IBM Equal Access) as the CI a11y gate** — reuses the same engine/rule sets Carbon itself is measured against (useful for saying "WCAG 2.1 AA, same tooling as upstream"), but it is a separate install/config effort from Storybook's `addon-a11y` and the two can disagree on findings.
- **Rely on Carbon MCP for AI-assisted development against Carbon** — gives agents grounded, first-party Carbon knowledge, but is gated as "public preview" access for non-IBM orgs, so availability/continuity is not guaranteed.
- **Publish an `llms.txt` for Afframe UI's own docs (Mintlify site)** modeled on Carbon's — cheap to add and consistent with what Carbon itself does, but is purely a nice-to-have convention, not a standard with guaranteed AI-tool support.
- **Route Claude Design sync (the `/design-sync` flow) at the Afframe UI component previews** — treats claude.ai/design as a downstream consumer of Afframe's own component library rather than of Carbon directly, keeping Carbon's Figma kit and the Claude Design project as two separate, unlinked sources of truth unless bridged manually.

## Open questions (could not verify)

- Exact Storybook major version(s) in use on `react.carbondesignsystem.com` and `web-components.carbondesignsystem.com` (site confirmed to run Storybook via asset paths, but the specific version number could not be extracted from this pass — the Gatsby-style JS-rendered pages and Storybook's own bundle did not expose a clean version string via `curl`).
- Whether `ibm-products`' own Storybook instance exists at a separate subdomain and what addons it runs (not directly checked in this pass).
- Full, verbatim text of `carbondesignsystem.com/guidelines/accessibility/overview/` — the page is JS-rendered (Gatsby) and could not be scraped as plain text with `curl`; the WCAG 2.1 AA claim and "IBM Accessibility Checklist" wording are reconstructed from search-engine result snippets, not a direct page read, so should be treated as lower-confidence and re-verified with a JS-capable fetch before citing externally.
- Whether Carbon documents or officially recommends Storybook Composition as a pattern for downstream consumers (not found in this pass; treated here as a generic Storybook capability only).
- Whether a distinct, independently versioned "Carbon Charts Figma kit" GitHub repo exists (only a Medium announcement and a Figma Community Alpha file were confirmed; no dedicated `carbon-charts-design-kit`-style repo was found in the inventory's `github_repos[]`).
- Current production status of `carbon-platform` ("next" website) relative to the live Gatsby-based `carbon-website`.
- Whether Percy, Chromatic, or another visual-regression tool is used by Carbon alongside Playwright `avt` tests (only Playwright a11y test naming/commands were confirmed from PR titles; visual-diff tooling was not directly confirmed).
- Exact list of components/packages still uncovered by Carbon MCP beyond "Carbon TanStack" and "Carbon Patterns" (README marks these "coming soon" as of the fetch date; the boundary may have moved since).

## Sources (URL · what it supports)

- https://www.figma.com/community/file/1157761560874207208/v11-carbon-design-system · official v11 core Figma kit listing
- https://medium.com/carbondesign/introducing-figma-variables-and-a-consolidated-all-themes-library-d4893d1b8920 · Figma variables/modes adoption for Carbon's theme libraries
- https://carbondesignsystem.com/designing/kits/figma/ · Carbon's own Figma kits landing page (confirmed reachable, content not fully extractable via curl)
- https://github.com/carbon-design-system/carbon-for-products-design-kit · IBM Products Figma kit source repo
- https://medium.com/carbondesign/introducing-the-data-viz-figma-kit-alpha-release-bc3cb9113555 · Carbon Charts/Data Viz Figma kit announcement
- https://www.figma.com/community/file/1342888187036080999/alpha-carbon-charts-library · Carbon Charts Figma kit file
- https://medium.com/carbondesign/carbon-and-figma-code-connect-redefining-the-design-to-code-experience-836eb3f454fc · Figma Code Connect for `@carbon/react`
- https://github.com/carbon-design-system/carbon/issues/17607 · Code Connect / variable-mode limitation tracked upstream
- https://github.com/carbon-design-system/carbon-mcp · official Carbon MCP server repo/README, tool coverage list, access model
- https://carbondesignsystem.com/developing/carbon-mcp/overview/ · Carbon MCP overview page (site)
- https://carbondesignsystem.com/llms.txt · confirmed live llms.txt for Carbon docs (fetched 2026-09-23, HTTP 200)
- https://github.com/carbon-design-system/gatsby-theme-carbon · Carbon website's Gatsby theme source
- https://gatsby.carbondesignsystem.com/ · Gatsby Theme Carbon docs site
- https://carbondesignsystem.com/components/tabs/usage/ and /accessibility/ · component doc tab structure example
- https://carbondesignsystem.com/guidelines/accessibility/overview/ · Carbon's accessibility guidelines (WCAG 2.1 AA target; page JS-rendered, content via search snippets only)
- https://github.com/IBMa/equal-access · IBM Equal Access Accessibility Checker engine (source of `accessibility-checker` npm package)
- https://www.npmjs.com/package/accessibility-checker-engine · rule-set coverage (WCAG 2.0/2.1/2.2 A/AA, IBM Accessibility v7.2)
- https://github.com/carbon-design-system/carbon/pull/22864 and /pull/22860 · example PRs showing Storybook controls work and `avt` Playwright test commands
- https://github.com/carbon-design-system/carbon/issues/23373, /21932, /17558, /17753 · open component a11y issues in core Carbon
- https://github.com/carbon-design-system/ibm-products/issues/6353, /6669, /9910 · open component a11y issues in IBM Products
- https://github.com/carbon-design-system/carbon/issues/20855 · community feature request for broader Carbon MCP access
- docs/research/sources/round1/00-inventory.json · ground truth for all package versions, publish dates, license, deprecation status cited in the Packages table
