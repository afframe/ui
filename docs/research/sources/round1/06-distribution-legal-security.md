> **Pre-verification draft, kept as evidence.** Claims here were checked afterwards; the verification files (`round1/07a-verify-distribution-legal-security.md`, `round1/07b-verify-carbon.md`) override this file, and the authoritative text is `docs/research/carbon-reference.md` and `docs/research/carbon-catalog.md`.

# 06 · Distribution, build, legal, security
Retrieved: 2026-09-23 · Lane: distribution-legal-security

Informational research only — not legal advice, especially the Legal section.

## Summary (5-10 bullets)

- GitHub Packages npm registry requires an access token to install packages **even when the source repo is public**: "You need an access token to publish, install, and delete private, internal, and public packages." Consumer repos need a classic PAT (`read:packages` scope); GitHub Packages does not support fine-grained PATs. [docs.github.com/packages]
- The Actions-provided `GITHUB_TOKEN` only authenticates against packages in its **own** repository. To install a package published from a *different* repo (even same org) in CI, workflows need a PAT (classic) or a GitHub App token — `GITHUB_TOKEN` does not cross repository boundaries for package installs. [docs.github.com/packages/about-permissions]
- npmjs.com scoped packages are **private by default**; publishing private packages (user- or org-scoped) requires a **paid** npm account/org. Publishing publicly on npmjs.com is free but makes the package world-readable with no auth needed to install. [docs.npmjs.com]
- npm now supports **trusted publishing via OIDC** from GitHub Actions (npm CLI ≥11.5.1, Node ≥22.14.0): no long-lived npm token stored as a secret, workflow needs `id-token: write`, and provenance attestations are generated automatically. [docs.npmjs.com/trusted-publishers]
- npm **provenance** requires a public source repo (or provenance won't verify the link) and a supported cloud CI (GitHub Actions or GitLab CI) with `id-token: write` plus `npm publish --provenance`. [docs.npmjs.com/generating-provenance-statements]
- Redistributing modified Apache-2.0 (Carbon) code inside a differently-licensed package still requires: license copy included, modified files marked as changed, and all copyright/patent/trademark/attribution notices retained, including reproducing NOTICE-file content. [apache.org/licenses/LICENSE-2.0 §4]
- PolyForm Noncommercial 1.0.0 requires that recipients of redistributed/modified software get a copy of the PolyForm terms (or URL) **and** any `Required Notice:` lines from the original — this sits on top of, not instead of, upstream Apache-2.0 obligations. [polyformproject.org]
- Secret scanning runs free automatically on public repos; push protection is described as stopping secret pushes "to public repositories on GitHub" and enabled by default there — but GitHub's own docs do not give an unambiguous single-line pricing statement distinguishing public-repo push protection from the paid GHAS push-protection-for-users feature (flag as needing direct confirmation in-product). [docs.github.com/secret-scanning]
- CodeQL code scanning is free for public repositories; on private repos it ships as part of paid GitHub Advanced Security / Code Security. [docs.github.com/code-scanning, GitHub community/pricing pages — secondary source, not docs.github.com pricing page itself]
- `anthropics/claude-code-action` restricts triggering to users with write access by default for issue/PR/comment/review events; `allowed_bots` and `allowed_non_write_users` are explicit opt-in escape hatches that weaken this, and fork-PR `workflow_run` triggers are checked against the access level of the actor who started the upstream run. [github.com/anthropics/claude-code-action docs/security.md]

## Packages and tools (table: name · version or n/a · license · purpose)

| Name | Version | License | Purpose |
|---|---|---|---|
| Carbon npm packages (e.g. `@carbon-labs/*`) | see `docs/research/sources/round1/00-inventory.json` (e.g. `@carbon-labs/ai-chat` 0.39.0) | Apache-2.0 | Upstream component/source packages consumed by Afframe UI |
| npm CLI | ≥11.5.1 for OIDC trusted publishing | Artistic-2.0/npm | Publish/install; version floor from docs.npmjs.com/trusted-publishers |
| Verdaccio | n/a (self-hosted) | MIT | Self-hosted private npm-compatible registry, unverified current version |
| tsup | n/a | MIT | esbuild-based library bundler (self-reported; not independently verified this session) |
| tsdown | n/a | MIT | Rolldown-based library bundler (unverified this session, name/scope not confirmed against primary docs) |
| Vite (library mode) | n/a | MIT | Bundler with `build.lib` mode |
| Rollup | n/a | MIT | Underlying bundler used by Vite/others |
| Rslib | n/a | MIT | Rspack-based library build tool (unverified this session) |
| unbuild | n/a | MIT | UnJS bundler for libraries (unverified this session) |
| bunchee | n/a | MIT | Zero-config bundler (unverified this session) |
| Changesets | n/a | MIT | Versioning/release automation for monorepos (unverified this session) |
| Turborepo | n/a | MIT | Monorepo task runner (unverified this session) |
| Nx | n/a | MIT | Monorepo task runner/build system (unverified this session) |
| semantic-release | n/a | MIT | Automated versioning from commit messages (unverified this session) |
| release-please | n/a | Apache-2.0 | Google's release automation via PRs (unverified this session) |
| CodeQL | n/a | proprietary/free-for-public | GitHub's static analysis, free on public repos |
| Dependabot | n/a | built into GitHub | Dependency update bot |
| Renovate | n/a | AGPL-3.0 (app) | Alternative dependency update bot (unverified license detail this session) |
| gitleaks | n/a | MIT | Secret scanner (unverified this session) |
| trufflehog | n/a | AGPL-3.0 | Secret scanner (unverified this session) |
| OpenSSF Scorecard | n/a | Apache-2.0 | Supply-chain security scoring tool (unverified this session) |
| IBM Plex fonts | n/a | OFL-1.1 | Typeface used by Carbon; Reserved Font Name "Plex" |

Note: several tool license/version cells are marked "unverified this session" because time budget was spent on the higher-priority auth/legal primary sources per task instructions; they were not pulled from `00-inventory.json` since that file's `npm` array is scoped to `carbon-design-system` packages only, not generic build tooling.

## Capabilities (distribution options table: option · who can download · auth needed · CI setup)

| Option | Who can download | Auth needed | CI setup |
|---|---|---|---|
| GitHub Packages npm registry (from a public repo) | Anyone with a valid GitHub-linked token | Yes — even for public packages, a classic PAT with `read:packages` (or `GITHUB_TOKEN` if same repo) is required to `npm install`; GitHub Packages "only supports authentication using a personal access token (classic)" [docs.github.com/packages] | Consumer CI needs a PAT (classic, `read:packages`) stored as an Actions secret and referenced in `.npmrc`; same-repo Actions can use built-in `GITHUB_TOKEN`, cross-repo cannot |
| npmjs.com, public package | Anyone, unauthenticated | No auth needed to install | Publish needs npm auth (token or OIDC trusted publishing); free tier suffices for publishing public packages |
| npmjs.com, private scoped package | Only accounts granted access on the paid org/user account | Yes — npm auth token or login required to install | Requires paid npm org; CI needs an `NPM_TOKEN` (or OIDC) with read access granted to the consuming identity |
| Self-hosted registry (e.g. Verdaccio) | Whoever the registry operator grants access to / network-reachable | Configurable (can be open or token-gated) | CI/consumers point `.npmrc` registry field at the self-hosted URL; operator manages auth and uptime |
| Git URL dependency (e.g. `git+https://github.com/afframe/ui.git#tag`) | Anyone with repo read access (public repo = anyone) | Repo-level auth only (none, since repo is public) — no package-registry auth layer at all | `npm install`/`pnpm add` pulls from GitHub directly; no publish step; consumers get raw source, must build themselves unless a build step/postinstall is added |
| GitHub Release tarball (attached asset or source archive) | Anyone who can read the public repo's Releases page | None for public repo releases | Consumers fetch tarball URL in install scripts or lockfile-pinned URL dependency; versioning via Git tags/Releases |
| pnpm/npm/yarn "workspace-free" (npm/yarn/pnpm without workspaces, single published package) | Same as npmjs.com or GitHub Packages options above | Same as chosen registry | Standard single-package publish pipeline, no workspace tooling required |

## Customization hooks (build and release options)

- ESM-only vs dual (ESM+CJS) output: dual builds add complexity (conditional exports, two artifact sets) but support older CJS-only consumers; ESM-only is simpler but requires all consumers to support ESM. (General knowledge from tool ecosystems; not independently re-verified against each tool's docs this session — flag as needing per-tool confirmation.)
- Preserving `'use client'` directives matters only if components are consumed inside a React Server Components framework (e.g. Next.js App Router); bundlers vary in whether they retain/hoist the directive per output chunk — unverified per-tool behavior this session.
- CSS output strategies: ship Sass/SCSS source (consumer compiles, more flexible theming but requires Sass toolchain downstream), ship precompiled CSS (simpler consumption, less consumer-side control), or ship both (larger package, most flexible).
- `sideEffects` field in package.json affects tree-shaking; CSS imports typically must be marked as side effects to avoid being dropped by bundlers.
- `peerDependencies` on Carbon packages avoid bundling/duplicating Carbon's React/Web Components and let consumers control the Carbon version, at the cost of requiring consumers to install matching versions themselves.
- Subpath exports (`exports` map in package.json) allow per-component imports and code-splitting without a monolithic entry point.
- Monorepo (pnpm/npm workspaces) vs single package: monorepo needed only if Afframe UI is split into multiple publishable packages; otherwise a single package avoids workspace tooling overhead entirely.
- Release automation options (Changesets, semantic-release, release-please) differ mainly in whether version bumps are developer-authored (Changesets: PR-time changeset files), commit-message-driven (semantic-release: Conventional Commits), or PR-based accumulation (release-please: keeps a running "Release PR"). Not independently verified against each project's own docs this session.

## Known gaps, pitfalls, open issues

- GitHub Packages requiring a token even for public-repo packages is a real distribution friction point for "several other repos importing this package" — every consumer repo's CI needs a PAT (not just `GITHUB_TOKEN`) if the consumer repo differs from the publisher repo. [docs.github.com/packages]
- GHAS/push-protection pricing/availability wording differs across GitHub's own pages (secret scanning free-for-public one page; push protection page discusses GitHub Team/Enterprise reporting features without a clean public-repo-free statement) — treat as **unverified** exact scope until confirmed directly in the repo's Settings > Code security UI.
- `allowed_bots` bypasses claude-code-action's repository-permission check entirely ("Allowed bots are not checked for repository permissions") — a meaningful risk surface on a public repo if misconfigured.
- Apache-2.0 §4 NOTICE-file obligations interact with PolyForm's "Required Notice:" concept differently; whether a combined package can carry only PolyForm terms on top (vs. needing dual-license disclosure per included Apache-2.0 file) is a legal question this research cannot resolve — see Open questions.
- No independent verification this session of tsup/tsdown/Rslib/unbuild/bunchee exact capabilities (dual output, 'use client' preservation) — each claim in "Customization hooks" for these tools should be confirmed against that tool's own docs before being treated as settled.

## Options for Afframe UI (option · consequence, one line each)

- GitHub Packages npm registry (public repo) · every consumer repo's CI needs its own PAT with `read:packages`, adding secret-management overhead across all consumer repos.
- npmjs.com public package · zero-friction installs for consumers (no auth) but the package tarball itself becomes world-downloadable regardless of the source repo's PolyForm license.
- npmjs.com private scoped package · requires a paid npm org and per-consumer token provisioning, but installs are access-controlled at the registry level.
- Self-hosted registry (Verdaccio) · full control over who can install, but adds hosting/uptime/ops burden.
- Git URL dependency on the public GitHub repo · no registry or token needed for install (repo already public), but consumers get raw/unbuilt source unless a build step is arranged, and there is no registry-level access control beyond "repo is public."
- GitHub Release tarball · simple, no registry auth, but versioning/update ergonomics are weaker than a real package manager flow.
- npm provenance / OIDC trusted publishing · removes long-lived publish tokens from CI secrets, but requires the source repo to be public (already true here) and a supported CI provider.
- ESM-only build output · simpler build/test matrix, consequence: any consumer stuck on CJS-only tooling cannot import the package.
- Ship both Sass source and compiled CSS · maximizes consumer flexibility, consequence: larger package size and two theming paths to keep in sync.
- Monorepo with Changesets · scales cleanly if Afframe UI splits into multiple packages, consequence: added workspace/tooling complexity if it stays single-package.
- Keep "PolyForm Noncommercial" as the umbrella license with Apache-2.0 notices preserved per-file · avoids a full relicense/fork, consequence: still must retain Carbon's copyright/NOTICE text throughout, which is an ongoing compliance surface as files are modified.
- Avoid "Carbon" or "IBM" in the package/repo name and marketing · reduces trademark-confusion risk, consequence: cannot use those names for products/branding without IBM permission; text-only factual references to IBM/Carbon (e.g., "built on IBM Carbon Design System") are described as generally permitted "fair use" if truthful and non-disparaging, per IBM's public trademark guidance page — logos are never permitted without written permission.
- Restrict `claude-code-action` triggers to default (write-access-only) behavior, avoid `allowed_bots`/`allowed_non_write_users` · lowest exposure on a public repo, consequence: contributors without write access (including fork PRs) cannot invoke @claude at all.
- Enable secret scanning + push protection, pin Actions to commit SHA, least-privilege `permissions:` blocks, avoid `pull_request_target` on untrusted forks · standard public-repo hardening, consequence: more workflow-file maintenance overhead (SHA pins need periodic updates, permissions must be set explicitly per job).

## Open questions (could not verify)

- Exact scope/tier of GitHub push protection for public repositories vs. GitHub Team/Enterprise "push protection for users" — GitHub's own pages give partially conflicting/incomplete statements; needs direct confirmation in a live repo's security settings.
- Whether a combined Apache-2.0 (Carbon-derived) + PolyForm Noncommercial package can legally present a single PolyForm license file at the package root, or whether Apache-2.0's NOTICE/license-copy requirements mean the package must also ship the full Apache-2.0 text and NOTICE content alongside PolyForm terms — this is a legal interpretation question, not resolved by primary sources read this session.
- Whether modifying Carbon source files (not just wrapping/importing them) and redistributing triggers additional "state changes made" notice obligations beyond what was captured in Apache-2.0 §4 (the "modified files must carry prominent notices" clause) — confirmed the clause exists, but exact practical implementation (per-file banner vs. changelog) is unverified.
- Current pricing figures for npmjs.com paid org/user accounts (cost not verified this session — docs describe the requirement but not the dollar amount).
- Renovate's exact license and hosting model (self-hosted vs. Mend-hosted app) — not independently verified this session.
- Whether GitHub Advanced Security's free-for-public-repos scope covers CodeQL only, or also secret scanning custom patterns / dependency review at no cost — pricing page not fetched directly, relied on search-engine synthesis (secondary, not docs.github.com pricing itself).
- Exact current versions/licenses of tsup, tsdown, Vite, Rollup, Rslib, unbuild, bunchee, Changesets, Turborepo, Nx, semantic-release, release-please, gitleaks, trufflehog, OpenSSF Scorecard — not in `00-inventory.json` (which is Carbon-scoped) and not independently queried against npm registry this session due to time budget.

## Sources (URL · what it supports)

- https://docs.github.com/en/packages/learn-github-packages/introduction-to-github-packages · GitHub Packages requires an access token to install public/private/internal packages; token type constraints (classic PAT only)
- https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry · npm-specific auth setup (.npmrc, npm login) and `read:packages` scope requirement
- https://docs.github.com/en/packages/learn-github-packages/about-permissions-for-github-packages · confirms `GITHUB_TOKEN` cannot access packages from other repositories; PAT needed for cross-repo installs
- https://docs.github.com/en/actions/security-guides/automatic-token-authentication · `GITHUB_TOKEN` least-privilege guidance for Actions
- https://docs.npmjs.com/generating-provenance-statements · npm provenance requirements: public repo, supported CI, `id-token: write`, `--provenance` flag
- https://docs.npmjs.com/trusted-publishers · npm OIDC trusted publishing setup, version floors, automatic provenance
- https://docs.npmjs.com/creating-and-publishing-private-packages · private scoped packages default to private, require paid npm account/org
- https://www.apache.org/licenses/LICENSE-2.0 · Section 4 redistribution obligations (license copy, modified-file notices, NOTICE handling, retaining copyright/patent/trademark notices)
- https://polyformproject.org/licenses/noncommercial/1.0.0 · PolyForm Noncommercial 1.0.0 text: acceptance, redistribution, notices requirement (Required Notice lines), restrictions on sublicensing
- https://github.com/IBM/plex/blob/master/LICENSE.txt (via search synthesis) · IBM Plex licensed under SIL OFL 1.1 with Reserved Font Name "Plex"
- https://www.ibm.com/design/language/files/IBM_Logo_3rdParties_300822.pdf (via search synthesis) · IBM logo/trademark third-party use restrictions
- https://github.com/carbon-design-system/carbon/blob/main/LICENSE (referenced via search) · Carbon's own Apache-2.0 licensing, no trademark license granted alongside code license
- https://docs.github.com/en/code-security/secret-scanning/introduction/about-secret-scanning · secret scanning runs free automatically on public repos
- https://docs.github.com/en/code-security/secret-scanning/introduction/about-push-protection · push protection default-on for public repos; ambiguity on pricing tier noted
- https://docs.github.com/en/actions/security-for-github-actions/security-guides/security-hardening-for-github-actions · `pull_request_target` risks with fork PRs, least-privilege token permissions, pinning actions to full commit SHA
- https://docs.github.com/en/code-security/code-scanning/introduction-to-code-scanning/about-code-scanning-with-codeql · CodeQL usage overview (pricing not stated on this page)
- https://github.com/anthropics/claude-code-action (docs/security.md, fetched via raw.githubusercontent.com) · claude-code-action security model: default write-access-only trigger, `allowed_bots` bypasses permission checks, `allowed_non_write_users` risk and mitigations, fork-PR `workflow_run` actor-permission check
