> **Working brief** given to the round 3 research agents on 2026-09-24. Paths refer to the agents' workspace at the time.

# Round 3 recheck: common brief (read fully)

## Context
Afframe UI (github.com/afframe/ui) is a React design-system package built on IBM Carbon, imported by several repos of a business platform. Repo docs (authoritative, read the sections named in your task): docs/scope.md, docs/goals.md, docs/research/carbon-catalog.md, docs/research/carbon-reference.md. Evidence: docs/research/sources/ (round1, round2 lane drafts are pre-verification; V-verify.md, 07a, 07b override them).

## Hleb's rules (verbatim, 2026-09-24)
- D1: React only.
- v12: "Full v12 implementation from day one, except if it breaks some component we need."
- Labs: "Labs is mandatory. If they are web-components only, then in our version we need rebuild or adaptation with dependencies, what is correct idk." And: "If something overlaps with Labs, and Labs are not React, then we better use what overlaps than rebuild Labs to React for this component. recheck."
- Optional items he INCLUDED: O2 (non-v12 flags: dialog-element, presence, enhanced-file-uploader, treeview-controllable, tile-contrast), O7 TreeView, O9 @carbon/ai-chat + ChatButton, O10 preview__Coachmark family, O11 onboarding set (InterstitialScreen, Guidebanner, GetStartedCard, Checklist, Cascade, InlineTip), O13 ScrollGradient, O14 AddSelect, O15 ConditionBuilder, O16 Toolbar/SearchBar/Decorator/TruncatedList/NonLinearReading, O22 @carbon/echarts-theme, O24 devtools + @carbon/icons-motion, O25 IBM Products Figma kit.
- He DECLINED: O4 preview__Dialog, O5 preview__Card, O6 preview_Layout/preview_Text, O8 ClassPrefix/IdPrefix, O12 OptionsTile, O17 AboutModal, O23 carbon-mcp.

## Ground truth (use it, do not rediscover)
- docs/research/sources/round3/labs-tech.json: all 36 published @carbon-labs packages: version, latest_published, deprecated, and relevant deps/peers (react, lit, @carbon/web-components, @carbon/react, @carbon/ibm-products, @carbon/styles). Empty deps = check the package files yourself.
- docs/research/sources/round3/labs-repo-names.txt: every package.json in the carbon-labs repo (name, private flag, path); some web-component packages exist in the repo but are private/unpublished.
- npm facts checked 2026-09-24: @carbon/react has no 2.x, alpha, canary or v12 build (latest 1.117.0, only 1.x rc builds); @carbon/web-components has no 3.x (latest 2.64.0). @carbon/ai-chat 1.21.0 peers: react >=17 <20, react-dom >=17 <20, @carbon/web-components >=2.54.0 <3.0.0; deps include lit ^3.1.0, @lit/react ^1.0.6, @carbon/ai-chat-components ^1.11.0.
- v12 milestones (gh api, 2026-09-24): v12-alpha due 2026-10-31, v12-rc.0 2026-11-12, v12-beta 2026-12-31, v12-stable 2027-03-31.
- Installed packages for inspection: <npm pack>/rt/node_modules (@carbon/react 1.117.0, @carbon/ibm-products 2.99.0). Use `npm pack <pkg>@<ver>` into /tmp for others.

## Tools and rules
- `gh api` is authenticated. Web search/fetch allowed.
- Primary sources only (carbon-design-system repos, npm, carbondesignsystem.com, react.dev, lit.dev, official docs). Never Russian-language sources or .ru/.рф domains.
- Every non-trivial claim has a source URL or file path. Mark "(unverified)" what you could not confirm. Retrieval date 2026-09-24. English only, no em-dash character.
- Options with consequences; map Hleb's rules onto them; no picks of your own.
- Write only your own output file.

## Receipt (final message, under 1,500 characters)
Status · file and line count · 5 key findings · unverified items.
