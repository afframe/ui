# Next steps (temporary)

Delete this file when phase 0 (research, goals, decisions) is closed.

**State, 2026-09-24:** phase 0. Research rounds 1 and 2 are done and verified; goals and scope are written. No code yet.

## Decided by Hleb
- D1: React only.
- D8: "Full v12 implementation from day one, except if it breaks some component we need." (Hleb, 2026-09-24; reading in `docs/scope.md` section 1.)
- D12: docs live in this repo: `docs/` permanent, `docs/plans/` temporary; the remote is the source of truth and work is saved through PRs.
- Scope (`docs/scope.md`) accepted, with these rules: Carbon Labs is mandatory (web-components-only Labs: use an overlapping React component, otherwise wrap or rebuild); every Optional item is decided one by one; every Build-new item is approved one by one before it is built, and building new is the last milestone.

## Waiting on Hleb, in this order
1. Recheck in progress: WC-only Labs treatment (O21, O26), the v12 day-one surface (O3 to O6, the 16 migrated components). Optional picks O2 to O25 are decided (`docs/scope.md` section 3).
2. D2: package distribution (`docs/goals.md` section 6, `docs/research/carbon-reference.md` section 12).
3. The remaining open decisions: D3 to D7, D9 to D11 (`docs/goals.md`) and S3 to S7, S9 to S13 (`docs/scope.md` section 7).

## Rules for agents working here
- Hleb decides architecture and stack. Stack presets from any global agent configuration do not apply to this project; present options with consequences, no picks unless asked.
- `[H]` = stated by Hleb, `[P]` = proposal awaiting his accept or reject. Do not turn `[P]` into `[H]` without his word.
- Build nothing from `docs/scope.md` section 6 without Hleb's approval of that specific item.
- Never merge a PR without Hleb's explicit "merge".
