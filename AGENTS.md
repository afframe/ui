`@afframe/ui`: one React package on IBM's Carbon Design System. Install: `IBM_TELEMETRY_DISABLED=true pnpm install`. Gate before every push: `pnpm preflight`.

## Layout

| Path                                         | Role                                                                                           |
| -------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `src/index.ts`                               | The `@afframe/ui` entry: Carbon, IBM Products, Labs and Afframe exports                        |
| `src/icons.ts`, `pictograms.ts`, `tokens.ts` | Subpath entries with Carbon's names                                                            |
| `src/components/<Name>/`                     | Afframe-owned components, and docs-only folders for copied Carbon, IBM Products and Labs pages |
| `src/labs/`                                  | One `'use client'` module per Carbon Labs package                                              |
| `src/provider/`, `src/theme/`                | `AfframeProvider`, feature flags, theme helpers                                                |
| `src/format/`                                | Server-safe amount, number and date formatters                                                 |
| `src/styles/`                                | Sass sources of `styles.css` and `charts.css`                                                  |
| `.storybook/`                                | Storybook config, source labels, story templates                                               |
| `examples/nextjs/`                           | Example app that installs the packed tarball                                                   |
| `scripts/`                                   | Build, pack, example and licence checks; `scripts/ci/` holds CI helpers and image pins         |
| `docs/`                                      | Handbook, package structure, testing, guides, ADRs (`docs/README.md`)                          |

Detail: `docs/package-structure.md`; architecture: `ARCHITECTURE.md`; every public export with its import path, runtime and docs: `docs/registry.json`.

## Commands

| Command                         | When                                                            |
| ------------------------------- | --------------------------------------------------------------- |
| `pnpm preflight`                | Always: format, lint, types, registry check                     |
| `pnpm test`                     | After a change to `src/`, `.storybook/` or styles               |
| `pnpm build && pnpm check:pack` | After a change to exports, build config or `package.json`       |
| `pnpm check:licences`           | After a change to `.mdx` pages or licence files (needs `reuse`) |
| `pnpm registry`                 | After a change to exports or component folders (regenerates)    |

Once before tests: `pnpm exec playwright install chromium --only-shell`. CI also runs gitleaks, actionlint and zizmor; `docs/developer-handbook.md` lists every job.

## Rules

- UI stack is Carbon, not shadcn/ui or Tailwind.
- TypeScript stays on the version pinned in `package.json` (ADR 0010).
- Prefix every install with `IBM_TELEMETRY_DISABLED=true` (ADR 0007).
- Decisions that shape the package are ADRs in `docs/decisions/`; superseded ones stay, linked both ways.
- `afframe/carbon` is unrelated; do not propose it.
- Claude review runs only with the `claude-review` label or a manual run of `claude-code-review.yml`. CodeRabbit reviews only on request: comment `@coderabbitai review`.
- PR titles are Conventional Commits; the squash merge uses them.

## Public repo

Files, commits, PRs and issues never carry secrets, host or tailnet names, internal URLs, local paths, account names, private repo names or contents, client names, business plans or security incidents.

## Licensing

Files copied from IBM keep IBM's SPDX headers (Apache-2.0); in `.mdx` they are `//` comments in the first import block. Own files are PolyForm Noncommercial through `REUSE.toml`. Check with `pnpm check:licences` (ADR 0011).

## Docs and comments

- Short, plain, no em-dashes, no status markers or milestone names. A value lives in one file; other docs point to it.
- Fix a doc in the same change that makes it wrong.
- Comments keep only the non-obvious why: a constraint, an upstream bug, a surprising order. No restating the code, no history.
- Component docs per ADR 0008.
