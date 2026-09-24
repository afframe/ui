# Next steps (temporary)

Delete this file when phase 0 (research, goals, decisions) is closed.

**State, 2026-09-24:** phase 0. Everything in `docs/` is Claude's draft: Hleb's answers from the chat are recorded, but Hleb has not yet reviewed or confirmed the documents themselves. Research rounds 1 to 4 are done and verified. No code yet.

## Decision status
`docs/goals.md` section 6 is the only register. Markers are defined in `docs/README.md`.

## Waiting on Hleb
1. Hleb reviews and confirms the drafts (`docs/goals.md`, `docs/scope.md`, `docs/consumption.md`, `docs/research/*`), then the drafts are reworked with him. Nothing is final until he confirms it.
2. Not now (Hleb, 2026-09-24): no merge of PR #2, no phase 1, no removal of `docs/plans/open-decisions.md`.
3. `[P]` items to rule on: D7 (the TanStack v9 pick), the D11 tool list, the D3 import paths against his pick "a", the readings under D8 and S8, the S7 feature-flags rule and the scoped flag mechanism in `scope.md` section 1, and the `[P]` lines in `consumption.md` section 4. Spot-check the `[A]` rows D2, D4 and D5.
4. Open points from the independent review of 2026-09-24 that Hleb has not ruled on yet:
   - D10: what "ships with it" means in his F10 answer ("we deploy on dev server only but ships with it, so our devs/me can see").
   - I42 `react-style-picker` cannot be installed today (upstream dependency missing), `scope.md` I42.
   - The v12 flags cover only part of the planned v12 design (OKLCH theming, a two-theme model and token consolidation are not behind a flag); what "full v12 look" means today.
   - React 19 conflicts: O24 `@carbon/icons-motion` (React 16 and 17 only) and S16 `wc-resizer` (pulls a second React 18); pnpm strict-peer guidance for consumers.
   - O22 ECharts theme has no import path; Labs tooling packages (I50, I52) should not be runtime dependencies; `react-is` peer and the `@carbon/icons-react` range.
   - PageHeader: S6 (IBM Products) against S15 (copy core's v12 code) now that PageHeader joined Carbon's migration list.
   - How to read "Labs is mandatory": every live Labs package, or Labs packages that map to a need.
   - D18: licensing of the company that runs the consumer products, and terms for outside contributions.
   - Package visibility on GitHub Packages: private or public.

## Proposed for phase 1 `[P]`
- Prove the consumer path in `docs/consumption.md` with in-repo Next.js and Vite reference apps before the first release.
- A v12 breakage gate: render every included component under v12 in Storybook visual tests and record any visible break as a named exception to the v12 rule. Today the breakage check rests on source reading, one Sass compile and rendered Tag and TextInput markup (`research/sources/round3/S-sass-check.md`); no component was rendered under v12 in Storybook.

## Rules for agents working here
- Hleb decides architecture and stack. Stack presets from any global agent configuration do not apply to this project; present options with consequences, no picks unless asked.
- Markers: `docs/README.md`. Never turn `[P]` or `[A]` into `[H]` without his word.
- Build nothing from `docs/scope.md` section 6 without Hleb's approval of that specific item.
- Never merge a PR without Hleb's explicit "merge".
