# Next steps (temporary)

Delete this file when phase 0 (research, goals, decisions) is closed.

**State, 2026-09-24:** phase 0 decisions complete. Research rounds 1 to 4 are done and verified; goals and scope are written. No code yet.

## Decided by Hleb
- D1: React only.
- D8: "Full v12 implementation from day one, except if it breaks some component we need." (Hleb, 2026-09-24; reading in `docs/scope.md` section 1.)
- D12: docs live in this repo: `docs/` permanent, `docs/plans/` temporary; the remote is the source of truth and work is saved through PRs.
- Scope (`docs/scope.md`) accepted, with these rules: Carbon Labs is mandatory (web-components-only Labs: use an overlapping React component, otherwise wrap or rebuild); every Optional item is decided one by one; every Build-new item is approved one by one before it is built, and building new is the last milestone.

## Waiting on Hleb
1. All phase-0 decisions are made (`docs/goals.md`, `docs/scope.md`, `docs/consumption.md`). D9 brand is deferred until all components work on native v12.
2. Next: a "go" for phase 1 (foundation) and the merge decision for PR #2.
3. `docs/plans/open-decisions.md` is fully decided; remove it once Hleb agrees.

## Proposed for phase 1 `[P]`
- Prove the consumer path in `docs/consumption.md` with in-repo Next.js and Vite reference apps before the first release.
- A v12 breakage gate: render every included component under v12 in Storybook visual tests and record any visible break as a named exception to the v12 rule. Today the breakage check rests on source reading and one Sass compile; nothing was rendered.

## Rules for agents working here
- Hleb decides architecture and stack. Stack presets from any global agent configuration do not apply to this project; present options with consequences, no picks unless asked.
- `[H]` = stated by Hleb, `[P]` = proposal awaiting his accept or reject. Do not turn `[P]` into `[H]` without his word.
- Build nothing from `docs/scope.md` section 6 without Hleb's approval of that specific item.
- Never merge a PR without Hleb's explicit "merge".
