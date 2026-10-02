# Next steps (temporary)

Delete this file when phase 0 (research, goals, decisions) is closed.

**State, 2026-10-02:** phase 0. Everything in `docs/` is Claude's draft: Hleb's answers from the chat are recorded, but Hleb has not yet reviewed or confirmed the documents themselves. Research rounds 1 to 6, an independent review, an upstream sweep and an outside advisor review are done; upstream facts were re-checked against npm and GitHub on 2026-10-02. No code yet.

## Decision status
`docs/goals.md` section 6 is the only register. Markers are defined in `docs/README.md`.

## Waiting on Hleb
1. Hleb reviews and confirms the drafts (`docs/goals.md`, `docs/scope.md`, `docs/consumption.md`, `docs/research/*`). Nothing is final until he confirms it.
2. Not now: no merge of PR #2, no phase 1, no removal of `docs/plans/open-decisions.md`.
3. Repo structure questions (research round 6):
   - Q1 where Carbon's Apache-2.0 licence lives (the current `third-party/carbon/LICENSE` path is not approved);
   - Q2 the `docs/` structure (never approved);
   - Q3 component folder layout;
   - Q4 import paths;
   - Q5 test apps;
   - Q6 React range for consumers;
   - Q7 update bot.
4. Decisions to revisit, raised by the outside review:
   - R1 the S15 copy set (now 19 components, including the declined OptionsTile);
   - R2 exact peers or regular dependencies;
   - R3 the TypeScript toolchain (TypeScript 7 has no classic compiler API);
   - R4 public repo or private;
   - R5 what v1.0.0 includes;
   - R6 full-suite CI triggers;
   - R7 Jest or Vitest;
   - R8 dropping the S18 workaround;
   - R9 private or public package;
   - R10 an install-and-render gate per Labs package;
   - R11 the deprecated Create flows, Saving and WebTerminal.
5. Other open items:
   - whether a release may be built on a Carbon pre-release (M0-10);
   - the accessibility target, locales, browser matrix and size budgets;
   - the docs coverage strategy for Storybook (M0-27): copy Carbon's and IBM Products' docs pages and stories, write our own, link IBM's public Storybooks, or a mix; foundations pages (tokens, icons) are an Afframe extra, and prop tables depend on R3;
   - a re-ruling on O23 (carbon-mcp);
   - whether to reopen the company licence (outside review X2) and the S4 attribution sentence (PR #2 review comment);
   - the `[P]` items in `goals.md` sections 3 to 5 and 7.

## Proposed for phase 1 `[P]`
- Prove the consumer path in `docs/consumption.md` with in-repo Next.js and Vite reference apps before the first release.
- A v12 breakage gate: render every included component under v12 in Storybook visual tests and record any visible break as a named exception to the v12 rule.

## Rules for agents working here
- Hleb decides architecture and stack. Stack presets from any global agent configuration do not apply to this project; present options with consequences, no picks unless asked.
- Markers: `docs/README.md`. Never turn `[P]` or `[A]` into `[H]` without his word.
- Build nothing from `docs/scope.md` section 6 without Hleb's approval of that specific item.
- Never merge a PR without Hleb's explicit "merge".
- Prefix every package install with `IBM_TELEMETRY_DISABLED=true`.
- `afframe/carbon` is unrelated to this project (Hleb, 2026-09-24); do not propose it.
