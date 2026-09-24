# Next steps (temporary)

Delete this file when phase 0 (research, goals, decisions) is closed.

**State, 2026-09-24:** phase 0. Research rounds 1 and 2 are done and verified; goals and scope are written. No code yet.

## Decided by Hleb
- D1: React only.
- D8: full Carbon v12 wherever it does not limit us: `enable-v12-release` in React and Sass now; v12 packages once every included package accepts them.
- D12: docs live in this repo: `docs/` permanent, `docs/plans/` temporary; the remote is the source of truth and work is saved through PRs.
- Scope (`docs/scope.md`) accepted, with three rules: Carbon Labs is mandatory; every Optional item is decided one by one; every Build-new item is approved one by one before it is built, and building new is the last milestone.

## Waiting on Hleb, in this order
1. Optional items O2 to O26 (`docs/scope.md` section 3): yes or no each.
2. D2: package distribution (`docs/goals.md` section 6, `docs/research/carbon-reference.md` section 12).
3. The remaining open decisions: D3 to D7, D9 to D11 (`docs/goals.md`) and S3 to S7, S9 to S13 (`docs/scope.md` section 7).

## Rules for agents working here
- Hleb decides architecture and stack. Stack presets from any global agent configuration do not apply to this project; present options with consequences, no picks unless asked.
- `[H]` = stated by Hleb, `[P]` = proposal awaiting his accept or reject. Do not turn `[P]` into `[H]` without his word.
- Build nothing from `docs/scope.md` section 6 without Hleb's approval of that specific item.
- Never merge a PR without Hleb's explicit "merge".
