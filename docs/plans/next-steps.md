# Next steps (temporary)

Delete this file when phase 0 (research, goals, decisions) is closed.

**State, 2026-09-24:** phase 0. Research rounds 1 to 3 are done and verified; goals and scope are written. No code yet.

## Decided by Hleb
- D1: React only.
- D8: "Full v12 implementation from day one, except if it breaks some component we need." (Hleb, 2026-09-24; reading in `docs/scope.md` section 1.)
- D12: docs live in this repo: `docs/` permanent, `docs/plans/` temporary; the remote is the source of truth and work is saved through PRs.
- Scope (`docs/scope.md`) accepted, with these rules: Carbon Labs is mandatory (web-components-only Labs: use an overlapping React component, otherwise wrap or rebuild); every Optional item is decided one by one; every Build-new item is approved one by one before it is built, and building new is the last milestone.

## Waiting on Hleb, in this order
1. D2: package distribution (`docs/goals.md` section 6, `docs/research/carbon-reference.md` section 12).
2. The remaining open decisions: D3 to D7, D9 to D11 (`docs/goals.md`) and S3 to S6, S9 to S13 (`docs/scope.md` section 7). Note: S15 (vendored Carbon v12 code) makes Apache-2.0 section 4 obligations apply regardless of D4 and D5.

Round 3 decisions S14 to S20 and the v11-look rule are settled (`docs/scope.md` sections 1.5 and 7).

## Proposed for phase 1 `[P]`
- A v12 breakage gate: render every included component under v12 in Storybook visual tests and record any visible break as a named exception to the v12 rule. Today the breakage check rests on source reading and one Sass compile; nothing was rendered.

## Rules for agents working here
- Hleb decides architecture and stack. Stack presets from any global agent configuration do not apply to this project; present options with consequences, no picks unless asked.
- `[H]` = stated by Hleb, `[P]` = proposal awaiting his accept or reject. Do not turn `[P]` into `[H]` without his word.
- Build nothing from `docs/scope.md` section 6 without Hleb's approval of that specific item.
- Never merge a PR without Hleb's explicit "merge".
