# Round 2 research: common brief (read fully before starting)

## Project context
Afframe UI (github.com/afframe/ui) will be the UI package and design system for a future business platform built across several repos, each importing afframe/ui as a package. Foundation: IBM Carbon Design System. The repo is public on GitHub but licensed PolyForm Noncommercial 1.0.0 (source-available, not open source).

Decided by Hleb (the owner):
- React only. Web Components, Angular, Vue and Svelte are out of scope unless something is React-usable.
- He wants the LATEST Carbon: whichever of "v11 latest" or "v12 preview" is most recent and offers the most.
- He wants everything useful from the whole carbon-design-system GitHub org (core, IBM Products, Labs, extensions, templates, patterns, examples) and nothing that isn't.
- Whatever we keep, we improve: Afframe UI should add prebuilt pages, sections, blocks and templates on top of Carbon.

## Ground-truth files (use these, do not rediscover from blogs)
All in docs/research/sources/round2/ unless noted. Query JSON with jq; don't read big files whole.
- react-exports.json: runtime export names of @carbon/react 1.117.0 ({total, prefixed, all}); `prefixed` = names starting unstable_/preview_ etc.
- ibm-products-exports.json: same for @carbon/ibm-products 2.99.0.
- feature-flags.json: all @carbon/feature-flags 1.10.0 flags with default values.
- org-repos.json: all 121 repos of github.com/carbon-design-system {name, description, archived, fork, language, topics, pushed_at, stargazers_count, size, homepage}.
- org-trees.json: directory lists: carbon/examples, carbon/packages, ibm-products examples+packages, carbon-labs/packages.
- ../00-inventory.json: npm data for 139 Carbon-related packages; use `latest_published` for dates (NOT `time.modified`).
- Unpacked package sources: <npm pack>/ (carbon-react-1.117.0, carbon-ibm-products-2.99.0, carbon-styles-1.116.0, carbon-feature-flags-1.10.0) and installed copies in pkg/rt/node_modules.
- Round 1 reference (already verified, do not redo): docs/research/carbon-reference.md. Read only the sections relevant to your lane.
- npm registry dist-tags (2026-09-24): @carbon/react latest=next=1.117.0 (no separate v12 tag); @carbon/ibm-products latest=2.99.0, next=2.99.0-rc.0.

## Tools
`gh api` is authenticated (5000 req/h): use it for GitHub trees, file contents, issues, releases, e.g.
`gh api repos/carbon-design-system/<repo>/contents/<path> --jq '.[].name'`
`gh api repos/carbon-design-system/<repo>/git/trees/HEAD?recursive=1 --jq '.tree[].path'`
Also web search/fetch for carbondesignsystem.com and the Storybooks.

## Rules
- Primary sources: github.com/carbon-design-system (code, READMEs, docs, issues, discussions, releases, RFCs), carbondesignsystem.com, official Storybooks, npm. Never use Russian-language sources or .ru/.рф domains.
- Every non-trivial claim carries a source URL. Mark anything you could not confirm "(unverified)". Retrieval date 2026-09-24.
- English only. Do not use the em-dash character.
- Relevance tags, same vocabulary in every lane, each with a one-line reason:
  - `core`: directly serves a React, latest-Carbon business-platform design system.
  - `optional`: useful depending on a later decision (name the decision).
  - `reference`: worth learning from or copying ideas, not shipping.
  - `out`: not for Afframe UI (other framework, IBM-internal, archived, marketing-only, deprecated, dead).
  These tags are analysis for Hleb to accept or reject; they are not decisions. No "we should".
- Write only your own output file. Touch nothing else.

## Receipt (your final message, under 1,500 characters)
Status (done / done with concerns / blocked) · output file and line count · the 5 findings that matter most · unverified items · surprises.
