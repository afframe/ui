# How other Afframe repos use Afframe UI

**Status:** plan, 2026-09-24. Items marked "(to prove)" are checked by the reference consumer apps in phase 1 before the first release.

Inputs (status in `goals.md` section 6): one package (D3); TypeScript, ESM only, Carbon never bundled, tsdown (D4); compiled v12 CSS with fonts inside the package (D5); GitHub Packages (D2). Consumer repos are monorepos (for example pnpm workspaces with `apps/web`, `apps/api`), not microservices. Evidence: `research/sources/round4/V4-recommendation.md`, `research/sources/round1/07a-verify-distribution-legal-security.md`.

## 1. What it is

A normal npm package, `@afframe/ui`, published to the GitHub Packages npm registry (`https://npm.pkg.github.com`). GitHub Packages only accepts scoped names whose scope is the repository owner, so the scope is `@afframe`. Consumers install it like any dependency, pinned to a version. No git submodules, no copied source, no build step in consumers.

What the package contains:

| Import path | Contents |
|---|---|
| `@afframe/ui` | components and the `AfframeProvider` (client entry, `'use client'`) |
| `@afframe/ui/tables` | TanStack v9 tables on Carbon DataTable styling (client) |
| `@afframe/ui/charts` | Carbon Charts wrappers (client) |
| `@afframe/ui/chat` | `@carbon/ai-chat` wrapper (client) |
| `@afframe/ui/server` | server-safe helpers, constants and types (no `'use client'`) |
| `@afframe/ui/styles.css` | compiled native v12 CSS for Carbon, IBM Products, Labs (to prove: Labs web components carry their styles inside shadow DOM) and Afframe; all four themes |
| `@afframe/ui/charts.css` | Carbon Charts CSS, imported after `styles.css` when charts are used |
| `dist/fonts/` | IBM Plex WOFF2 files (OFL-1.1), referenced by relative URLs from `styles.css` |

TypeScript types ship inside the package.

## 2. What afframe/ui needs (this repo)

1. `package.json`: `"name": "@afframe/ui"`, `"type": "module"`, an `exports` map for the paths above, `"repository"` pointing at `afframe/ui` (links the package to the repo), `"publishConfig": { "registry": "https://npm.pkg.github.com" }`, `"files"` limited to `dist/`, the licences and NOTICE.
2. Dependencies: peers `react`, `react-dom` (`^18.3 || ^19`), `@carbon/react` `1.117.0` and `@carbon/ibm-products` `2.99.0` (exact); regular dependencies, exact: Carbon Labs packages, `@tanstack/react-table`, `@carbon/charts-react`, `@carbon/ai-chat`, `@carbon/web-components`, `@carbon/icons-react`; build-only: `sass`, `@carbon/styles`, `@carbon/ibm-products-styles`, `@ibm/plex`, `tsdown`, `typescript`.
3. Build: tsdown for JavaScript (per-file ESM, `'use client'` kept on client entries) plus a separate `tsc` pass for types; Sass compile of one entry with the v12 flag set before Carbon loads, `$font-path: './fonts'`; font copy into `dist/fonts/`; a post-build check that client entries start with `'use client'` and `./server` does not.
4. Licences: PolyForm Noncommercial governs the project (Hleb, 2026-09-24: "we still guided by our licence"). Carbon's Apache-2.0 licence is kept verbatim in `third-party/carbon/LICENSE` and ships in the package; it covers the copied Carbon v12 source and the Carbon-derived CSS. Copied files keep their IBM copyright headers and carry a note when modified (Apache-2.0 section 4). OFL-1.1 ships next to the fonts. Carbon publishes no NOTICE file, so none is carried.
5. Release: a GitHub Actions workflow publishes on a version tag with `permissions: packages: write` and the built-in `GITHUB_TOKEN`. Versioning: semantic versions; publishing needs Hleb's manual approval; changelog tooling comes after the full build (section 4).
6. Access: in the package settings, "Manage Actions access" adds each consumer repo with read access. A package inherits the repository's access permissions but not its visibility, and a newly published package is private by default (GitHub docs, checked 2026-09-24). To confirm at first publish: whether the package must stop inheriting permissions from `afframe/ui` first, and what inherited read access means when the repository is public.
7. Reference consumers inside this repo: a Next.js App Router app and a Vite app that install the packed tarball (`npm pack`), exactly as a real consumer would, and run in CI (to prove: CSS and font loading under Turbopack, webpack and Vite; server and client entries; the Jest allowlist).
8. Docs: a "Getting started" page in Storybook with the consumer steps below.
9. IBM Telemetry off (D13). `[P]` Mechanism: `IBM_TELEMETRY_DISABLED=true` (the exact lowercase string; `1` or `TRUE` do not work) in every CI job and every container or devcontainer build of this repo. With pnpm, every instrumented package is also set to `false` under `allowBuilds` in `pnpm-workspace.yaml`. Side effect: blocking install scripts also blocks `@carbon-labs/vscode-snippets` (I50), whose install script copies snippets into `.vscode/`.

## 3. What each consumer monorepo needs

1. **Registry and auth**, in `.npmrc` at the monorepo root (committed, no secret in it):
   ```ini
   @afframe:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
   ```
   - CI (GitHub Actions): `permissions: packages: read` and `NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}`, after the repo is granted access in step 2.6. Dependabot gets access through the same grant.
   - Developer machines: a classic personal access token with `read:packages` in the `NODE_AUTH_TOKEN` environment variable (fine-grained tokens are not supported by GitHub Packages).
2. **Install** in each app that renders UI, not at the monorepo root and not in server-only apps:
   ```sh
   pnpm --filter web add @afframe/ui react react-dom @carbon/react@1.117.0 @carbon/ibm-products@2.99.0
   ```
   Keep one version per monorepo (for example a pnpm catalog or root overrides), because the Carbon peers are exact.
   With pnpm 11 or later this install fails (`ERR_PNPM_IGNORED_BUILDS`) until every Carbon package with an install script is listed under `allowBuilds` in the root `pnpm-workspace.yaml` (checked on pnpm 11.20.0, 2026-09-24). Names must be exact (no `@carbon/*` wildcard) and cover the whole resolved tree. Set them to `false` (step 7). `[P]` The Getting started page carries the full list.
   `[P]` When an Afframe release is built on a Carbon pre-release that IBM Products' peer range does not cover (2.99.0 peers `@carbon/react ^1.115.0`), the consumer's root config overrides it: npm `overrides` in the root `package.json`, or pnpm `overrides` or `peerDependencyRules` in `pnpm-workspace.yaml`. Without it npm fails with `ERESOLVE` and pnpm reports a peer issue (an install failure when strict peers are on). The Getting started page states the exact override for each such release.
3. **Wire it once** in the app root:
   - `import '@afframe/ui/styles.css'` (and `@afframe/ui/charts.css` after it if charts are used) in `app/layout.tsx` (Next.js) or `main.tsx` (Vite).
   - Wrap the app in `<AfframeProvider>`; it turns on the React side of v12 and the theme. In Next.js App Router the provider is a client component placed inside the root layout.
   - No Sass, no `transpilePackages`, no load-path settings.
4. **Use it**: components from `@afframe/ui` (and `/tables`, `/charts`, `/chat`); in Server Components only `@afframe/ui/server`. Own styles use Carbon tokens as CSS variables (`var(--cds-spacing-05)`, `var(--cds-text-primary)`).
5. **Rules for consumers**: do not install or configure `@carbon/styles` Sass (a second configuration is a compile error); do not override `.cds--` or `.c4p--` classes; do not import `@carbon/*` directly for things Afframe UI wraps.
6. **Tests**: Vitest works as is; Jest needs `transformIgnorePatterns` to let `@afframe/ui`, `@tanstack`, `@carbon/ai-chat` and `lit` through (exact list to prove).
7. **IBM Telemetry off (D13)**: almost every Carbon package runs `ibmtelemetry` at install time, and it collects when the install runs in CI or inside a container (Docker, devcontainers). afframe/ui cannot switch it off for a consumer; each consumer repo does it:
   - `IBM_TELEMETRY_DISABLED=true` (exact lowercase string) in every CI workflow and container build that installs dependencies.
   - pnpm 11 or later: each instrumented package set to `false` under `allowBuilds` (step 2).
   - npm 12 skips unreviewed install scripts by default; npm 11 runs them unless root `allowScripts` denies them.
   - Dependabot's lockfile updates do not run install scripts; the consumer's CI run on the Dependabot PR does, and the environment variable covers it.
   Evidence: `research/sources/round5/U-upstream-sweep.md` section 4.
8. **Optional app-level package**: a consumer monorepo may keep its own thin internal package for app-specific composites (like analytics' design-system facade), which depends on `@afframe/ui` instead of on Carbon.

## 4. Working across repos

Detail for D14 to D17 (status in `goals.md` section 6):
- **Carbon upgrades in afframe/ui**: on a regular schedule plus on demand (security fixes, needed features). `[P]` Dependabot opens the update PR, tests and visual tests gate it, and a release is published only after Hleb approves it; nothing releases automatically.
- **Consumer updates**: Dependabot in each consumer monorepo, grouping `@afframe/ui` with its two Carbon peers in one PR.
- **Only the latest release ships**: `@afframe/ui` publishes only normal versions, never preview or release-candidate versions, so consumer repos can always update to the latest. Inside, afframe/ui may use any Carbon version, including v12 pre-releases, however it needs (Hleb, 2026-09-24: "we ship latest so other repos can update. but we can use all carbon we want and how we want"). The Carbon peers stay exact at whatever version a release is built on. When IBM Products' own peer range lags behind a Carbon pre-release, the override has to live in each consumer repo, because npm and pnpm ignore overrides declared by a dependency (section 3, step 2). Changes are tried inside afframe/ui (Storybook and the reference apps) before a release.
- **Versioning and changelog**: not now; commit history is enough until the full build is done. Later option on record: a tag-triggered release workflow, changelog fragments compiled into `CHANGELOG.md`, and a protected environment that holds each release for approval.
- **Breaking changes**: `[P]` semantic versioning and a migration note per breaking release (D16 defers changelog tooling until the full build).

## 5. Open points

- The "(to prove)" items in section 2.7 and the access questions in section 2.6.
- Licence: D18 in `goals.md` section 6.
