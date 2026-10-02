# F · carbon-design-system org triage (121 repos)
Retrieved: 2026-09-24

Source of truth for all rows: `org-repos.json` (121 repos, snapshot 2026-09-24). Fields quoted are `description`, `language`, `pushed_at`, `archived`. Where description was empty or unclear, README fetched via `gh api repos/carbon-design-system/<repo>/readme`. Repos already covered in depth by other round-2 lanes are marked "covered by lane X" and kept short (per brief instruction) rather than re-analyzed here.

## Summary

### By category
Counts from the category column of the triage table below (recounted 2026-09-24; 121 repos):
- core: 4 (carbon, carbon-labs, ibm-products, carbon-ai-chat)
- core (dup): 4 (ibm-cloud-cognitive-1, ibm-cloud-cognitive-2, ibm-products-1, ibm-products-v1)
- core (legacy): 1 (carbon-components-react)
- React extension: 13 (carbon-addons-beta-react, carbon-addons-catalog-react, carbon-addons-cloud-react, carbon-addons-data-viz-react, carbon-addons-iot-react, carbon-charts, carbon-echarts-theme, carbon-mcp, carbon-utils-position, devtools, ibm-security, icons-motion, tanstack-carbon)
- React extension (source): 1 (carbon-icons)
- other-framework (Angular, Vue, Svelte, Web Components, native; out per React-only decision): 14
- other-framework/reference: 1 (carbon-for-ibm-dotcom)
- design kit/Figma: 6 (carbon-design-kit, carbon-for-ibm-dotcom-design-kit, carbon-for-products-design-kit, carbon-design-system.framerfx, carbon-sketch-assistant, team-assets)
- docs/website: 14
- template/starter/tutorial: 18
- tooling/infra: 26
- governance: 13 (.github, archived-v10-release-issues, carbon-contribution, carbon-dco, carbon-job-stories, carbonated, content-planning, issue-tracking, lts-schedule, okrs, pattern-contributions, rfcs, roadmap)
- legacy/archived: 4 (carbon-elements, carbon-spec, carbon-themes, carbon-v11)
- unknown: 2 (digital-design-ideation, svelte-carbon)
- Archived on GitHub (`archived: true`), across all categories: 35

### By relevance tag
- core: 4 (carbon, ibm-products, carbon-labs, carbon-ai-chat)
- optional: 8 (React extensions/tools/kits worth a later decision; includes carbon-mcp)
- reference: 20 (worth reading, not shipping/depending on)
- out: 89 (other framework, archived, internal, marketing, empty, duplicate)
- (Counts corrected 2026-09-24 to match the table below.)
- The tags here are the round-2 triage. Where they differ, `carbon-catalog.md` section 8 supersedes them (for example carbon-ai-chat is `core` here and `optional [core]` there).

Note: carbon, ibm-products, carbon-labs, and the React/Vanilla extension repos (carbon-for-ibm-dotcom, templates) are covered in full depth by other round-2 lanes (core monorepo lane, ibm-products lane, carbon-labs lane, extensions lane, templates lane). Rows below for those are intentionally short with a pointer.

## Triage table

Columns: repo · category · purpose · lang · pushed_at (date only) · archived · tag · reason

| repo | category | purpose | lang | pushed | archived | tag | reason |
|---|---|---|---|---|---|---|---|
| carbon | core | Main Carbon monorepo (React, styles, icons, pictograms, grid, etc.) | JavaScript | 2026-09-23 | no | core | covered by lane: core monorepo — the foundation itself |
| ibm-products | core | Carbon-powered React + Web Component library for IBM Products (extra patterns) | TypeScript | 2026-09-23 | no | core | covered by lane: ibm-products — largest extension surface |
| carbon-labs | core | Innovation space for experimental components on top of Carbon | JavaScript | 2026-09-23 | no | core | covered by lane: carbon-labs — pre-stable components worth watching |
| carbon-ai-chat | core | Front-end AI chat framework from the Carbon team | TypeScript | 2026-09-23 | no | core | React-usable chat UI framework, actively maintained, plausible fit for a business platform needing chat/assistant UI |
| carbon-mcp | React extension | Carbon MCP: AI agent tool server exposing Carbon components/tokens/docs for code generation | (issue-tracker repo, no source) | 2026-09-01 | no | optional | dev-tool for AI-assisted coding with Carbon, not a runtime dependency; useful if the team adopts MCP-based codegen |
| carbon-charts | React extension | D3/TypeScript dataviz framework with Carbon theming, has React wrapper | HTML | 2026-09-16 | no | optional | most complete charting option in the org if native charts are needed; decision: whether to add charts to Afframe UI |
| carbon-addons-iot-react | React extension | Shared React components for IBM Maximo/Watson IoT/Graphite products | JavaScript | 2026-09-01 | no | reference | large legacy IoT-specific component set, mostly superseded by ibm-products; useful for pattern ideas (dashboards, tables) not for direct use |
| carbon-echarts-theme | React extension | ECharts theme matching Carbon tokens | TypeScript | 2026-09-03 | no | optional | alternative charting theme if ECharts is preferred over carbon-charts |
| icons-motion | React extension | Animated versions of Carbon icons as standalone React components (`@carbon/icons-motion`) | JavaScript | 2026-07-27 | no | optional | drop-in animated icon replacements, framework-agnostic to Carbon version; nice-to-have polish |
| tanstack-carbon | React extension | Explorations using Carbon DataTable styling with @tanstack/table | JavaScript | 2026-09-07 | no | reference | proof-of-concept for headless-table + Carbon styling, good reference for building advanced tables, not a package to depend on |
| carbon-utils-position | React extension | Small utility to position floating elements (tooltips/popovers) | TypeScript | 2024-06-17 | no | reference | tiny positioning helper; Carbon react likely already uses Floating UI internally, check for overlap before adopting |
| devtools | React extension | Browser dev tools for inspecting/debugging live Carbon pages | JavaScript | 2026-06-17 | no | reference | developer-experience tool, not shippable code but useful during Afframe UI development |
| carbon-components-svelte | other-framework | Svelte implementation of Carbon | TypeScript | 2026-09-24 | no | out | Svelte is out of scope per decision |
| carbon-components-angular | other-framework | Angular implementation of Carbon | TypeScript | 2026-09-11 | no | out | Angular is out of scope per decision |
| carbon-components-vue | other-framework | Vue implementation of Carbon | JavaScript | 2026-09-12 | no | out | Vue is out of scope per decision |
| carbon-icons-svelte | other-framework | Carbon icons as Svelte components | TypeScript | 2026-09-17 | no | out | Svelte is out of scope |
| carbon-icons-angular | other-framework | Carbon icons as Angular components | JavaScript | 2023-07-12 | no | out | Angular is out of scope |
| carbon-pictograms-svelte | other-framework | Carbon pictograms as Svelte components | TypeScript | 2026-08-28 | no | out | Svelte is out of scope |
| carbon-preprocess-svelte | other-framework | Svelte preprocessors for Carbon | TypeScript | 2026-09-18 | no | out | Svelte tooling, out of scope |
| sveld | other-framework | Generates TS defs/docs for Svelte components | TypeScript | 2026-09-23 | no | out | Svelte tooling, out of scope |
| svelte-carbon | unknown | Description empty; likely a Svelte-Carbon integration/org placeholder | (none) | 2025-05-15 | no | out | Svelte, out of scope; low activity, unclear content |
| carbon-tutorial-svelte | template/starter/tutorial | Tutorial app for Carbon Svelte | Svelte | 2022-11-11 | no | out | Svelte tutorial, out of scope |
| carbon-web-components | other-framework | Web Components variant of Carbon | TypeScript | 2023-03-08 | yes | out | archived; Web Components out of scope per decision |
| carbon-for-ibm-dotcom-web-components-template | other-framework | HTML/Handlebars template using Carbon for IBM.com Web Components | Handlebars | 2026-01-22 | yes | out | archived; Web Components template, out of scope |
| carbon-for-ibm-dotcom-web-components-test | other-framework | Test env for Carbon for IBM.com web components | Handlebars | 2026-03-28 | no | out | Web Components, out of scope |
| carbon-tutorial-web-components | other-framework | Web Components tutorial app (description empty, name implies) | CSS | 2026-02-02 | no | out | Web Components, out of scope |
| carbon-tutorial-angular | template/starter/tutorial | Angular tutorial app for Carbon | (none) | 2023-12-13 | no | out | Angular, out of scope |
| carbon-tutorial-vue | template/starter/tutorial | Vue tutorial app (description empty) | JavaScript | 2024-01-31 | no | out | Vue, out of scope |
| carbon-angular-starter | template/starter/tutorial | Starter app for bootstrapping with Carbon Angular | TypeScript | 2024-05-23 | no | out | Angular, out of scope |
| carbon-react-native | other-framework | React Native implementation of Carbon | TypeScript | 2026-02-14 | no | out | native mobile, not web React; out unless a mobile app is planned (name it as the decision if reconsidered) |
| carbon-for-ibm-dotcom | other-framework/reference | Carbon for IBM.com: patterns/components for ibm.com, both React and Web Components variants | TypeScript | 2026-09-23 | no | reference | covered by lane: extensions — large marketing-site-oriented pattern library; React parts may be worth mining for page/section patterns per the brief's "add prebuilt pages/sections" goal, but IBM.com-branded and heavily coupled to their content model |
| carbon-for-ibm-dotcom-design-kit | design kit/Figma | Figma kit of Carbon for IBM.com visual assets | (none) | 2024-04-16 | no | out | IBM.com-specific branding kit, not relevant if team already has core Carbon Figma kit |
| carbon-for-ibm-dotcom-nextjs-template | template/starter/tutorial | Next.js template using Carbon for IBM.com React | JavaScript | 2026-03-30 | yes | out | archived; IBM.com-branded template |
| carbon-for-ibm-dotcom-nextjs-test | template/starter/tutorial | Sample Next.js app using Carbon for IBM.com | JavaScript | 2026-03-30 | yes | out | archived, test/sample repo |
| carbon-for-ibm-dotcom-tutorial | template/starter/tutorial | Tutorial repo | (none) | 2022-12-23 | yes | out | archived tutorial |
| carbon-for-ibm-dotcom-website | docs/website | Docs/guidelines website for Carbon for IBM.com | MDX | 2024-09-23 | no | out | IBM.com-internal documentation site |
| ibm-products-1 | core (dup) | "A Carbon-powered React component library for IBM Products" — appears to be an old/duplicate name slot | (none) | 2023-05-22 | no | out | duplicate/legacy naming artifact of ibm-products; superseded by `ibm-products` |
| ibm-products-v1 | core (dup) | Same description, legacy v1 slot | (none) | 2023-05-16 | no | out | superseded by `ibm-products` |
| ibm-cloud-cognitive-1 | core (dup) | "A Carbon-powered React component library for IBM Products" | (none) | 2023-02-08 | no | out | old name for what became ibm-products; superseded |
| ibm-cloud-cognitive-2 | core (dup) | "A Carbon-powered React component library for Cloud & Cognitive" | (none) | 2023-05-08 | no | out | old name/duplicate; superseded by ibm-products |
| ibm-security | React extension | Carbon-powered React component library built by IBM Security | JavaScript | 2025-11-17 | no | reference | domain-specific (security dashboards/tables) component set; useful pattern reference, not a general dependency |
| carbon-addons-beta-react | React extension | Beta React components (legacy, pre-v10) | JavaScript | 2018-03-26 | yes | out | archived, pre-v10, obsolete |
| carbon-addons-boilerplate-react | template/starter/tutorial | Boilerplate (empty description) | JavaScript | 2018-06-13 | yes | out | archived, ancient boilerplate |
| carbon-addons-catalog-react | React extension | Bluemix Catalog components in React | JavaScript | 2018-07-18 | yes | out | archived, Bluemix-era, obsolete |
| carbon-addons-cloud | tooling/infra | "[DEPRECATED] Carbon Design System add-on for IBM Cloud" | CSS | 2024-05-23 | no | out | explicitly deprecated |
| carbon-addons-cloud-react | React extension | "[DEPRECATED] React components for the Cloud Add-on" | JavaScript | 2020-02-07 | yes | out | archived and deprecated |
| carbon-addons-cloud-vanilla | other-framework | Vanilla JS cloud add-on (empty description) | JavaScript | 2019-12-28 | yes | out | archived, vanilla JS, obsolete |
| carbon-addons-data-viz-react | React extension | "DEPRECATED. Please use Carbon Charts instead" | JavaScript | 2024-05-23 | no | out | explicitly deprecated in favor of carbon-charts |
| carbon-addons-ics | tooling/infra | Carbon Add-on for IBM Collaboration Solutions | JavaScript | 2024-05-23 | yes | out | archived, IBM-internal product add-on |
| carbon-addons-infrastructure | tooling/infra | Carbon Add-on for IBM Cloud Infrastructure | JavaScript | 2020-06-06 | yes | out | archived, IBM-internal |
| carbon-addons-website | docs/website | Add-on for design system website (empty desc) | CSS | 2018-01-30 | yes | out | archived, ancient website add-on |
| carbon-components-react | core (legacy) | "React components for the Carbon Design System" — pre-v11 predecessor of @carbon/react | JavaScript | 2020-07-27 | yes | out | archived; fully superseded by @carbon/react inside the `carbon` monorepo |
| carbon-elements | legacy/archived | "Project moved to carbon-design-system/carbon" | (none) | 2019-07-12 | yes | out | explicitly merged into carbon monorepo |
| carbon-themes | legacy/archived | Collection of themes for Carbon Components (pre-token era) | (none) | 2019-07-12 | yes | out | archived, superseded by @carbon/themes in monorepo |
| carbon-spec | legacy/archived | "[WIP] Specification for the Carbon Design System" | (none) | 2019-07-12 | yes | out | archived, abandoned WIP |
| carbon-upgrade | tooling/infra | "[Experimental] A tool for upgrading Carbon versions (to v10)" | (none) | 2019-07-12 | yes | out | archived, targets v10 upgrade only, obsolete |
| carbon-v11 | legacy/archived | Empty description, likely a planning repo for the v11 migration | (none) | 2021-06-10 | yes | out | archived planning repo, historical only |
| carbon-website-archive | docs/website | "The old website for the Carbon Design System" | JavaScript | 2024-02-05 | yes | out | explicitly archived old site |
| design-system-website | docs/website | "This repo has been archived, the new repo can be found at..." | JavaScript | 2019-01-24 | yes | out | explicitly superseded |
| archived-v10-release-issues | governance | Private-issue overflow repo for v10 release | (none) | 2019-03-21 | yes | out | archived process repo, no design/code content |
| content-planning | governance | "Place to plan, organize, and communicate about Carbon content" | (none) | 2019-08-20 | yes | out | archived internal planning repo |
| issue-tracking | governance | Overflow issue tracker repo, deprecating GHE tracking | (none) | 2019-04-23 | yes | out | archived internal process repo |
| developer-essentials | docs/website | Course material for "Developer Essentials"/Front-end Skills | (none) | 2019-05-08 | yes | out | archived internal training repo |
| carbon-badges | tooling/infra | "A site to apply for Carbon badges" | JavaScript | 2022-07-11 | yes | out | archived, community-recognition site, not design-system content |
| carbon-boilerplate | template/starter/tutorial | "A simple boilerplate for rapid UI prototyping with Carbon components" | JavaScript | 2018-06-06 | yes | out | archived, ancient, pre-v10 boilerplate |
| carbon-shared-tests | tooling/infra | "Carbon Shared Tests are re-usable UI unit tests aligned to the Carbon Design System" | TypeScript | 2023-11-16 | yes | out | archived test-sharing tool, superseded/abandoned |
| carbon-triage | tooling/infra | "Tools for helping with issue triage" | JavaScript | 2022-12-03 | yes | out | archived internal maintainer tool |
| carbon-tutorial | template/starter/tutorial | "An app for the Carbon Design System tutorial" | JavaScript | 2023-11-03 | yes | out | archived; superseded by carbon-tutorial-1/-2 |
| incubator | tooling/infra | "[Experimental] Explore, build, and try-out new work with Carbon" | JavaScript | 2023-01-06 | yes | out | archived experimental sandbox, superseded by carbon-labs |
| tailwind-preset-carbon | tooling/infra | Tailwind preset using Carbon tokens (empty desc) | JavaScript | 2023-07-07 | yes | reference | archived; interesting if Afframe UI ever pairs Carbon tokens with Tailwind, but currently unmaintained |
| toolkit | tooling/infra | "[Experimental] A UI Toolkit for the Carbon Design System" | JavaScript | 2022-12-10 | yes | out | archived experimental toolkit, superseded |
| Contentful-for-IBM.com | tooling/infra | No description; Contentful CMS integration for ibm.com | JavaScript | 2026-06-29 | yes | out | archived, IBM.com CMS integration, not design-system code |
| carbon-day-microsite | docs/website | Microsite for Carbon Days (community event) | JavaScript | 2026-04-15 | no | out | event marketing microsite |
| carbon-job-stories | governance | Empty description; likely job-stories/UX research repo | (none) | 2021-12-09 | no | out | low activity, internal research artifact, no reusable content found |
| digital-design-ideation | unknown | Empty description | (none) | 2020-08-03 | no | out | empty/unclear content, likely a design ideation scratch repo |
| remote-learning-enablement | docs/website | Training site link (remotelearning vercel app) | JavaScript | 2023-06-10 | no | out | internal training site, not design-system content |
| carbon-sandbox | tooling/infra | "A theme playground for Carbon Components" | CSS | 2024-05-23 | no | reference | small theme-testing playground; useful reference for theme experimentation, not a dependency |
| carbon-style-stats | tooling/infra | "Dashboard for analyzing various Carbon stylesheet statistics" | JavaScript | 2021-06-04 | no | out | low-activity internal analytics dashboard |
| stylelint-plugin-carbon-tokens | tooling/infra | Stylelint plugin enforcing Carbon token usage in CSS | TypeScript | 2026-09-23 | no | optional | useful lint rule if Afframe UI wants to enforce token discipline in SCSS/CSS |
| carbon-element-styles | tooling/infra | Empty description; likely low-level style/token package | SCSS | 2026-09-21 | no | reference | actively maintained but purpose unclear from metadata; worth a closer look if styling foundations are revisited |
| carb | tooling/infra | "[Experimental] Tooling for managing design systems" (Rust) | Rust | 2023-09-04 | no | out | experimental Rust tooling, unclear relevance, low recent activity |
| generate-pattern | tooling/infra | "CLI tool to scaffold example code" | TypeScript | 2024-12-04 | no | reference | scaffolding CLI for Carbon example/pattern generation; could inform Afframe UI's own scaffolding tooling |
| sandboxes | tooling/infra | Empty description; likely internal CodeSandbox/StackBlitz examples | JavaScript | 2026-09-14 | no | reference | actively updated example sandboxes, good for finding usage patterns |
| gatsby-theme-carbon | docs/website | "A Carbon inspired Gatsby theme" | MDX | 2026-09-23 | no | out | Gatsby-specific site theme, not a React component library; only relevant if building a Gatsby doc site |
| gatsby-starter-carbon-theme | template/starter/tutorial | Gatsby starter demonstrating the theme | MDX | 2024-10-22 | no | out | depends on gatsby-theme-carbon, same scope note |
| gatsby-theme-presentation | docs/website | Empty description, presentation-deck Gatsby theme | JavaScript | 2026-02-03 | no | out | niche presentation-deck theme, not relevant |
| carbon-nextjs-template | template/starter/tutorial | "Template for Next.js and Carbon" | JavaScript | 2023-09-07 | no | optional | covered by lane: templates — candidate starting point for Afframe UI's Next.js app shell |
| carbon-react-router-starter | template/starter/tutorial | "A template for developers to start new UIs with Carbon, with Vite and server-side rendering" | JavaScript | 2026-09-23 | no | optional | covered by lane: templates — most recently active starter, React Router + Vite + SSR |
| carbon-tutorial-1 | template/starter/tutorial | Tutorial app (duplicate slot) | (none) | 2023-06-28 | no | reference | walkthrough tutorial app, good onboarding reference, not shippable code |
| carbon-tutorial-2 | template/starter/tutorial | Tutorial app (duplicate slot) | (none) | 2023-06-28 | no | reference | same as above |
| carbon-tutorial-next | template/starter/tutorial | "Carbon Tutorial for NextJS 13" | JavaScript | 2023-08-14 | no | reference | Next.js tutorial reference, superseded in currency by carbon-nextjs-template |
| carbon-tutorial-nextjs | template/starter/tutorial | Empty description, likely duplicate Next.js tutorial | CSS | 2024-08-21 | no | out | unclear/duplicate of carbon-tutorial-next |
| carbon-tutorial-test1 | template/starter/tutorial | "Build an app with the Carbon Design System and Next.js" | (none) | 2023-12-15 | no | out | test/scratch repo, name implies throwaway |
| carbon-website | docs/website | The official carbondesignsystem.com website source | MDX | 2026-09-23 | no | reference | primary documentation source for guidelines/usage; reference for copy and patterns, not code to ship |
| carbon-website-1 | docs/website | Duplicate/legacy slot of the website | JavaScript | 2023-03-15 | no | out | superseded by carbon-website |
| carbon-website-latest | docs/website | Empty description, likely another website slot | (none) | 2024-02-24 | no | out | unclear duplicate, low signal vs carbon-website |
| carbon-platform | docs/website | "The 'next' version of the Carbon Design System website, as a platform" | JavaScript | 2025-04-01 | no | reference | in-progress next-gen docs platform; watch for future docs/tooling ideas |
| design-language-website | docs/website | IBM Design Language website | CSS | 2026-09-23 | no | out | IBM corporate design-language marketing site, not component-level content |
| carbon-icons | React extension (source) | "SVG icon library for the Carbon Design System" | HTML | 2024-05-23 | no | reference | covered by lane: core monorepo — icon source lives here but is consumed via @carbon/react/@carbon/icons-react |
| carbon-dco | governance | "Signed Developer Certificate of Origins for the Carbon Design System" | JavaScript | 2026-09-23 | no | out | contributor legal/process automation, irrelevant to a consuming team |
| ibm-cdai | tooling/infra | "IBM CDAI" (unclear, likely internal AI/data project) | (none) | 2020-04-28 | no | out | unclear internal IBM project, low activity, no evident Carbon relevance |
| insights | tooling/infra | "surfacing issues and metrics not available through github's interface" | JavaScript | 2026-07-21 | no | out | internal maintainer metrics tool for the Carbon team itself |
| platform | tooling/infra | "[Internal] Tools and services for managing a design system" | JavaScript | 2023-05-07 | no | out | explicitly internal IBM tooling |
| sync | tooling/infra | "Internal tool for keeping project repositories in sync" | JavaScript | 2024-05-23 | no | out | explicitly internal repo-sync tool |
| uptime | tooling/infra | "Uptime monitoring for Carbon" (properties/sites) | Markdown | 2022-12-07 | no | out | internal ops monitoring, no design-system content |
| .bob | tooling/infra | "A shared config for Carbon squads" | (none) | 2026-04-21 | no | out | internal CI/config sharing repo for the Carbon team |
| .github | governance | Org-level GitHub community health files (empty desc) | (none) | 2024-04-30 | no | out | org meta repo (issue templates, org profile), no product content |
| action-ibmcloud-cf | tooling/infra | "Common GitHub actions...for deploying a IBM Cloud CF app" | JavaScript | 2020-10-15 | no | out | CI deployment action for IBM Cloud Foundry, internal infra |
| carbon-sketch-assistant | design kit/Figma | "Carbon Design System design validation directly in Sketch" | TypeScript | 2021-05-07 | no | out | Sketch plugin; team already uses Figma kit, Sketch tooling not relevant |
| carbon-design-system.framerfx | design kit/Figma | Framer component kit (empty desc) | CSS | 2020-12-14 | no | out | old Framer prototyping kit, low activity, superseded by Figma kit |
| rfcs | governance | RFC process repo for substantial Carbon changes | (none) | 2024-05-23 | no | reference | see Governance findings; worth watching for upcoming breaking API changes, not a dependency |
| roadmap | governance | Points to the live roadmap Projects board; README maps all Carbon libraries/services | (none) | 2021-06-14 | no | reference | see Governance findings; useful org-wide map, no dated support info itself |
| lts-schedule | governance | CLI tool that generates an LTS schedule graph from JSON input (not a published schedule itself) | JavaScript | 2025-09-29 | no | out | a schedule-rendering tool, not a source of current support-window dates; see Governance findings |
| carbon-contribution | governance | Defines Light/Medium/Heavy models for contributing back to Carbon | (none) | 2024-05-23 | no | out | relevant only if upstreaming contributions to Carbon, not for internal planning |
| pattern-contributions | governance | Single place to triage/manage pattern contributions to Carbon | (none) | 2019-09-03 | no | out | maintainer-facing triage repo, no planning content surfaced |
| okrs | governance | Objectives/Key Results for the Carbon team, links to 2020 Zenhub boards | (none) | 2020-10-21 | no | out | historical (2020) team OKRs only, no current planning signal |
| carbon-design-kit | design kit/Figma | Versioned Figma-first kit of all Carbon visual assets (components, icons, pictograms, styles, grids) | (none) | 2025-08-21 | no | reference | see Design kits section; adds only changelog/legacy Sketch export if team already has the Figma kit |
| carbon-for-products-design-kit | design kit/Figma | Figma kit (Beta) of IBM Products visual assets, extends base Carbon kit | (none) | 2025-04-04 | no | optional | see Design kits section; relevant only if IBM Products' extra components are wanted in Figma to mirror the ibm-products code lane |
| team-assets | design kit/Figma | "Central repository for team assets and shared resources" | (none) | 2026-08-05 | no | out | appears to be internal Carbon-team asset storage, not consumer-facing design assets |
| carbon-vega-theme | tooling/infra | "The official 4 Carbon themes offered for Vega users" | SCSS | 2024-06-17 | no | out | Vega (dataviz grammar) theming, niche and unrelated to React/Carbon component work |
| carbonated | governance | "[Internal services for building the Carbon Design System]" | JavaScript | 2023-10-16 | yes | out | archived, explicitly internal service tooling for the Carbon team itself |

## Governance findings

- **rfcs** (`https://github.com/carbon-design-system/rfcs`): active process repo. RFCs are used for "substantial" changes (new feature-flagged APIs, removal of shipped features, new idiomatic conventions). Active list is the repo's open PRs: `https://github.com/carbon-design-system/rfcs/pulls`. No LTS/support-window content here; useful mainly to watch for upcoming breaking API changes relevant to core (e.g. anything touching `@carbon/react` prop surfaces used by Afframe UI).
- **roadmap** (`https://github.com/carbon-design-system/roadmap`): the README states the actual roadmap now lives in a GitHub Projects board (`https://github.com/carbon-design-system/roadmap/projects/1`) and discussion happens in `carbon-design-system/carbon` Discussions, not in this repo's issues. The README enumerates all "Libraries" and "Services" the Carbon team maintains (Carbon Components, Carbon React, Carbon Angular, Carbon Vue, Carbon Svelte, Carbon Web Components, Carbon Icons, Carbon Charts, Carbon React Native, design kits for Figma/Adobe XD/Axure/Sketch, IBM Plex, devtools, telemetry, website) — this is a good one-page map of "everything the org ships" but carries no dated support/EOL info itself.
- **lts-schedule** (`https://github.com/carbon-design-system/lts-schedule`): this is a CLI tool (`lts`) that *generates* an LTS graph (HTML/SVG/PNG) from a JSON schedule input; it is not itself a published schedule with dates. No JSON schedule data file was found in the README; the actual current Carbon LTS/support-window dates (if published) would need to be pulled from the generated site or from `carbon-website`/npm, not from this repo. Flag as: tool for producing a schedule graphic, not a data source of current support windows. (unverified whether a live schedule is currently hosted anywhere from this tool's output)
- **carbon-contribution** (`https://github.com/carbon-design-system/carbon-contribution`): defines three contribution tiers (Light/Medium/Heavy) for design contributions back to Carbon, with wiki pages per tier. Relevant only if Afframe UI intends to upstream fixes/components to Carbon itself, not for internal planning.
- **pattern-contributions** (`https://github.com/carbon-design-system/pattern-contributions`): single-line description repo for triaging pattern contributions; no further planning content surfaced via README in the time available. (unverified — did not open issues/wiki)
- **okrs** (`https://github.com/carbon-design-system/okrs`): links to Zenhub boards for 2020 Q3/Q4 OKRs only; last meaningfully updated content is from 2020, so it reflects historical team objectives, not current plans. No upcoming-work signal.
- **carbon-dco**: automates Developer Certificate of Origin signing for contributors; process-only, no planning content.
- **carbon-job-stories**: empty description, no README content of substance found for planning purposes; likely a UX research artifact repo.

Net effect on planning: none of the governance repos surface a hard, dated support/EOL schedule for `@carbon/react`/`@carbon/ibm-products` versions usable for Afframe UI's own planning — that data, if it exists, should be sought on carbondesignsystem.com or in `carbon`'s own CHANGELOG/release notes (round 1 or core-lane territory), not in these process repos.

## Design kits

- **carbon-design-kit** (`https://github.com/carbon-design-system/carbon-design-kit`): the canonical Figma-first design kit repo. README confirms Figma is the primary supported tool ("Figma, the primary design kit tool we support and maintain"); Sketch is explicitly no-longer-maintained but still downloadable from this repo. Holds versioned release notes (`v10.20.0` tag referenced) and points to `carbondesignsystem.com/designing/kits/figma/` for the live kit. **If the team already has the Carbon Figma kit, this repo adds nothing beyond changelog/versioning history and the legacy Sketch file** — no code, no new assets beyond what's in Figma itself.
- **carbon-for-products-design-kit** (`https://github.com/carbon-design-system/carbon-for-products-design-kit`): Figma kit for IBM Products (extends the base kit with IBM Products' additional components/patterns). Still marked Beta in its README; relevant only if the team also wants IBM Products' additional Figma components alongside the core Carbon kit — otherwise redundant with `ibm-products`'s React source itself, which is the higher-value artifact for a React team.
- **carbon-for-ibm-dotcom-design-kit**: IBM.com-branded Figma kit; not relevant unless building ibm.com-styled marketing pages.
- **team-assets**: one-line description "Central repository for team assets and shared resources", no further content surfaced; likely internal-team (Carbon maintainers) assets, not a design kit for consumers. (unverified — README not distinct from description)
- **carbon-sketch-assistant** and **carbon-design-system.framerfx**: legacy tooling for Sketch and Framer respectively; both superseded by the Figma-first workflow and not relevant to a Figma-based team.
- Net: for a team that already has the Carbon Figma kit, none of these repos add new visual assets — they hold changelogs, legacy-tool exports, or beta/branded variants. The one exception worth a look is `carbon-for-products-design-kit` if IBM Products' extra components are wanted visually in Figma to mirror what's already being pulled in via `ibm-products` in code.

## Open questions

- `lts-schedule`'s actual current-data source (the JSON schedule file it renders) was not located within the time budget; if Hleb needs a concrete Carbon support-window/EOL date, it should be chased separately (npm dist-tags / carbon-website / carbon CHANGELOG), not assumed to exist in this repo.
- Several repos have empty `description` fields and generic one-line READMEs that didn't reveal enough to categorize with full confidence: `carbon-element-styles`, `team-assets`, `pattern-contributions`, `carbon-job-stories`, `digital-design-ideation`, `svelte-carbon`, `carbon-website-latest`, `sandboxes`, `carb`. These are flagged `reference`/`out` based on best-effort reading of name + limited signal; a deeper look (full repo tree, not just README) would be needed to be fully certain none hide something useful.
- `ibm-security` and `carbon-addons-iot-react` are large, actively-touched domain-specific component libraries; this pass tags them `reference` for pattern-mining, but a dedicated look at their component lists was out of scope here (that depth belongs to the extensions lane if Hleb wants it).

## Sources

- `docs/research/sources/round2/org-repos.json` (all 121 repos, snapshot 2026-09-24)
- `gh api repos/carbon-design-system/<repo>/readme` for: rfcs, roadmap, lts-schedule, carbon-contribution, pattern-contributions, okrs, carbon-design-kit, carbon-for-products-design-kit, team-assets, icons-motion, carbon-mcp
- https://github.com/carbon-design-system/rfcs
- https://github.com/carbon-design-system/roadmap
- https://github.com/carbon-design-system/lts-schedule
- https://github.com/carbon-design-system/carbon-contribution
- https://github.com/carbon-design-system/pattern-contributions
- https://github.com/carbon-design-system/okrs
- https://github.com/carbon-design-system/carbon-design-kit
- https://github.com/carbon-design-system/carbon-for-products-design-kit
- https://github.com/carbon-design-system/team-assets
- https://github.com/carbon-design-system/icons-motion
- https://github.com/carbon-design-system/carbon-mcp
