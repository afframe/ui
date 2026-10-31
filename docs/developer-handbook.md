# Developer handbook

How to work in this repo.

## Prerequisites

- Node.js LTS, version in `.nvmrc`. Move to the next major when it becomes LTS.
- `engines.node` in `package.json` is the oldest Node consumers may run; it does not follow `.nvmrc`.
- pnpm, version in `packageManager` in `package.json`.
- `IBM_TELEMETRY_DISABLED=true` in your shell environment before any install (ADR 0007).

## Setup

```sh
IBM_TELEMETRY_DISABLED=true pnpm install
pnpm preflight
```

`pnpm preflight` is the gate: Prettier check, ESLint, Stylelint, `tsc` and `pnpm registry --check`. CI runs the same. `pnpm format` fixes formatting. ESLint applies `eslint-plugin-react-hooks` only to own `.ts`/`.tsx` files in `src/` and `.storybook/`: files with Apache-2.0 in their header (copied from IBM) are left as upstream wrote them. `pnpm check:licences` runs the CI licence-label check locally; it needs `reuse` at the version of the `reuse` image pinned in `scripts/ci/toolbox/Dockerfile`.

## Test

```sh
pnpm exec playwright install chromium --only-shell
pnpm test
```

Install the browser once. `pnpm test` builds `dist/styles.css` and `dist/charts.css` and runs the Vitest projects `unit` and `storybook` (every story, accessibility violations fail) in headless Chromium, and `node` (the formatters under Node's ICU). The release checks also run `visual`, the screenshot tests against the committed baselines. `pnpm test:node` runs only the `node` project. Projects, accessibility exceptions and updating baselines: `docs/testing.md`.

## Build

```sh
pnpm build
pnpm check:pack
```

`pnpm build` writes `dist/`: per-file ESM from tsdown, declarations from `tsc`, and `styles.css` with IBM Plex fonts and `charts.css` from the Sass build. `pnpm check:pack` packs the tarball and fails if it ships stories, tests or sources, if an `exports` target is missing or does not load through the package name by `import` and `require()`, or if it carries the v12 field border or misses fonts, the licence texts, the licence banner of `styles.css`, `charts.css` with the Carbon Charts styles (and `styles.css` without them) or `"use client"` on the provider, the Labs modules and the client families. It fails if the provider loses its import of Carbon's flag defaults (`@carbon/react/es/feature-flags.js`, ADR 0025). It also fails if a client module uses `export *`, if shipped component code imports the `src/index.ts` barrel, a Labs module or a `@carbon-labs/*` package, if one heavy family (Charts, ECharts, the data grid, the AI chat) imports another, if the AI chat imports the chat elements, if the chat elements import the AI chat's values or an engine other than through its `index.js`, or if a server-safe family lacks its component file or carries `"use client"`. The family lists: `docs/package-structure.md`. The release checks then install the tarball into `examples/nextjs`, build it, check the rendered pages, and rerun `check:pack` on the oldest Node.js that `engines` allows.

## Storybook

```sh
pnpm storybook
pnpm build:storybook
```

`pnpm storybook` serves it on port 6006; `pnpm build:storybook` writes `storybook-static/`. Both build `dist/styles.css` and `dist/charts.css` first, since stories use the compiled styles. The toolbar switches the theme (`light`, `dark`, `system`) of canvases and docs pages alike (`.storybook/DocsContainer.tsx`). After a Storybook update, `pnpm build:storybook && pnpm check:docgen` checks that the docgen server still fills the API tables of re-exported components. Each component has a docs page first, then its stories.

## Working

- Read `AGENTS.md` and `ARCHITECTURE.md` first.
- Branch from `main`, open a PR. Only the maintainer merges.
- Conventional Commits, one logical unit per commit.
- A decision that shapes the package gets an ADR in `docs/decisions/`.
- CI (`.github/workflows/ci.yml`) runs on every PR and every push to `main`, with no path filters. Target: 2 to 3 minutes. Its jobs:
  - `secrets`: gitleaks over the full git history with `.gitleaks.toml` (from the base branch on a PR); inline `gitleaks:allow` comments are ignored.
  - `pr-title`: the PR title is a Conventional Commit, since the squash merge uses it. PRs only.
  - `workflow-lint`: actionlint (with shellcheck) and zizmor over the workflows and `dependabot.yml`.
  - `preflight`: `pnpm preflight`, `pnpm build` and `pnpm check:pack`; and `reuse lint --json` through `scripts/check-licence-labels.mjs` (the licence labels of the docs pages), in the official reuse container image.
  - `docgen`: `pnpm build:storybook` and `pnpm check:docgen` (`scripts/check-docgen.mjs`: the API tables of sample Carbon and IBM Products components, which the experimental docgen server fills, still have their props).
  - `test (1/2)`, `test (2/2)`: the Vitest projects `node`, `unit` and `storybook`, in two shards.
  - `ci`: passes only when every job above passed (`pr-title` may be skipped on `main`). It is the required check.
- A failed run is retried with a fresh run (a new push, or closing and reopening the PR; `ci.yml` has no manual trigger), not `gh run rerun`: a rerun restores the first attempt's dependency cache and has failed every story with a duplicated React.
- The images for `secrets`, `workflow-lint` and the reuse step of `preflight` are pinned in `scripts/ci/toolbox/Dockerfile`; Dependabot updates them.
- The release checks (`.github/workflows/release-checks.yml`) are called by the release workflow on a `v*` tag and run by hand with `gh workflow run release-checks.yml --ref <branch>`: `visual`, `package` (build, `check:pack`, `examples/nextjs` from the tarball) and `storybook` (the build and `check:docgen`; the build is kept as an artifact).
- CodeQL runs on every PR (GitHub default setup). CodeRabbit reviews only on request (comment `@coderabbitai review`) and only code paths. A Claude review runs only with the `claude-review` label or a manual run of `claude-code-review.yml`. `@claude` (`claude.yml`) answers only on issues and same-repo PRs the owner opened.
- Merge gate: the `main` ruleset in `.github/rulesets/main.json` requires the `ci` check, squash merges, linear and signed history, and blocks force-pushes and deletion. The `tags` ruleset in `.github/rulesets/tags.json` lets only admins create, move or delete `v*` tags, since a `v*` tag publishes the package. A red PR merges only through the admin bypass: `gh pr merge --squash --admin`. GitHub enforces the files only after an admin applies them. On a new repo, create each:

  ```sh
  gh api -X POST repos/afframe/ui/rulesets --input .github/rulesets/main.json
  gh api -X POST repos/afframe/ui/rulesets --input .github/rulesets/tags.json
  ```

  On a repo that has them, update each by id:

  ```sh
  for name in main tags; do
    id="$(gh api repos/afframe/ui/rulesets --jq ".[] | select(.name == \"$name\") | .id")"
    gh api -X PUT "repos/afframe/ui/rulesets/$id" --input ".github/rulesets/$name.json"
  done
  ```

- Keep every doc current in the same change that makes it wrong.

## Release

`.github/workflows/release.yml` publishes to GitHub Packages (`@afframe` scope) on a `v*` tag, only in `afframe/ui` (ADR 0016). It refuses a tag that does not equal `v` plus the `package.json` version or that is not on `main`, runs preflight, the `node`, `unit` and `storybook` tests, `pnpm build` and `check:pack`, and packs the tarball. A parallel job calls the release checks. Once both pass, a reviewer approves the `release` environment and a third job publishes that tarball, and a fourth creates the GitHub Release with notes generated from the merged PR titles. Only admins can push `v*` tags (`tags` ruleset), so apply both rulesets before anyone else gets write access.

Versions are Afframe's own release numbers; they do not follow Carbon's versions. A release with a breaking change gets migration notes added to its GitHub Release by hand.

1. In a PR, set `version` in `package.json` to the release version and merge it.
2. Optional: run the release checks on `main` before tagging to catch a failure early: `gh workflow run release-checks.yml --ref main`. The release workflow runs them again on the tag.
3. Tag the merge commit and push the tag: `git tag -m v<version> v<version> && git push origin v<version>`.
4. Approve the `release` environment on the workflow run.

GitHub Packages creates a new package as private. After the first publish, an org owner sets `@afframe/ui` to public and checks it is linked to this repo (package settings on `github.com/orgs/afframe/packages`); later versions keep both. A public package cannot be made private again.

A consumer repo needs no "Manage Actions access" grant: its workflow token and Dependabot read the public package. If the package ever becomes private, each consumer repo needs Read access there.

## Components

- A Carbon component Afframe does not change: re-export it from `src/index.ts`. No wrapper, and no code in its docs-only folder.
- A Carbon component Afframe wraps (the date and time pickers, ADR 0021): the wrapper goes into the Carbon docs folder, which keeps its `carbon` label; it needs a unit test, a section on the docs page and an `afframe` story with a play test (`docs/package-structure.md`).
- An Afframe-owned component: a co-located folder (`docs/package-structure.md`), Carbon tokens only for styling, overridable strings, tests, stories and a docs page.
- Docs and stories copied from IBM keep IBM's copyright and an SPDX header and say when they were modified (ADR 0011). In `.mdx`, upstream has no header: write the three lines as `//` comments directly after the last `import` line of the first import block, no blank line between (reuse reads them, Prettier keeps them, MDX treats them as code comments). JSX `{/* */}` comments are not parsed reliably by reuse and multi-line ones break under Prettier. Afframe-written pages carry the two Afframe lines in the same place. CI runs `reuse lint --json` through `scripts/check-licence-labels.mjs`, which fails any page that falls back to `REUSE.toml`, any Apache-2.0 page without an IBM source label (`carbon`, `ibm-products`, `labs`) and an IBM copyright, or whose header sits outside the import block, or whose source label is missing or unknown.
- Copied pages drop upstream boilerplate that does not apply to Afframe users: Feedback sections, tables of contents, Slack mentions, Carbon Labs owner and status blocks, other IBM-internal content (ADR 0008). This applies to Carbon, IBM Products and Labs pages alike.
- Mark every docs page with where its component comes from (`carbon`, `ibm-products`, `labs`, `extras`, `afframe`), even when Afframe wrote the page: a tag in the stories file meta, `tags: ['carbon']`, and `<SourceLabel name="carbon" />` under the page title.

## Editor snippets

A developer can install `@carbon-labs/vscode-snippets` (Carbon SCSS editor snippets) for their own editor. It is not a dependency of this package.

## Upstream updates

`docs/guides/updating-carbon.md`.
