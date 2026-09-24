# How other Afframe repos use Afframe UI

**Status:** plan, 2026-09-24. Items marked "(to prove)" are checked by the reference consumer apps in phase 1 before the first release.

Decided inputs: one package (D3); TypeScript, ESM only, Carbon never bundled, tsdown (D4); compiled v12 CSS with fonts inside the package (D5); GitHub Packages (D2). Consumer repos are monorepos (for example pnpm workspaces with `apps/web`, `apps/api`), not microservices. Evidence: `research/sources/round4/V4-recommendation.md`, `research/sources/round1/07a-verify-distribution-legal-security.md`.

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
| `@afframe/ui/styles.css` | compiled native v12 CSS for Carbon, IBM Products, Labs and Afframe; all four themes |
| `@afframe/ui/charts.css` | Carbon Charts CSS, imported after `styles.css` when charts are used |
| `dist/fonts/` | IBM Plex WOFF2 files (OFL-1.1), referenced by relative URLs from `styles.css` |

TypeScript types ship inside the package.

## 2. What afframe/ui needs (this repo)

1. `package.json`: `"name": "@afframe/ui"`, `"type": "module"`, an `exports` map for the paths above, `"repository"` pointing at `afframe/ui` (links the package to the repo), `"publishConfig": { "registry": "https://npm.pkg.github.com" }`, `"files"` limited to `dist/`, the licences and NOTICE.
2. Dependencies: peers `react`, `react-dom` (`^18.3 || ^19`), `@carbon/react` `1.117.0` and `@carbon/ibm-products` `2.99.0` (exact); regular dependencies, exact: Carbon Labs packages, `@tanstack/react-table`, `@carbon/charts-react`, `@carbon/ai-chat`, `@carbon/web-components`, `@carbon/icons-react`; build-only: `sass`, `@carbon/styles`, `@carbon/ibm-products-styles`, `@ibm/plex`, `tsdown`, `typescript`.
3. Build: tsdown for JavaScript (per-file ESM, `'use client'` kept on client entries) plus a separate `tsc` pass for types; Sass compile of one entry with the v12 flag set before Carbon loads, `$font-path: './fonts'`; font copy into `dist/fonts/`; a post-build check that client entries start with `'use client'` and `./server` does not.
4. Licences: PolyForm Noncommercial for Afframe code; Apache-2.0 LICENSE and NOTICE for the copied Carbon v12 source and the Carbon-derived CSS; OFL-1.1 next to the fonts.
5. Release: a GitHub Actions workflow publishes on a version tag with `permissions: packages: write` and the built-in `GITHUB_TOKEN`. Versioning: semantic versions and a changelog per release (tool to be picked in phase 1).
6. Access: in the package settings, "Manage Actions access" adds each consumer repo with read access. To confirm at first publish: whether the package must stop inheriting permissions from `afframe/ui` first, and whether it can stay private while the repo is public.
7. Reference consumers inside this repo: a Next.js App Router app and a Vite app that install the packed tarball (`npm pack`), exactly as a real consumer would, and run in CI (to prove: CSS and font loading under Turbopack, webpack and Vite; server and client entries; the Jest allowlist).
8. Docs: a "Getting started" page in Storybook with the consumer steps below.

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
3. **Wire it once** in the app root:
   - `import '@afframe/ui/styles.css'` (and `@afframe/ui/charts.css` after it if charts are used) in `app/layout.tsx` (Next.js) or `main.tsx` (Vite).
   - Wrap the app in `<AfframeProvider>`; it turns on the React side of v12 and the theme. In Next.js App Router the provider is a client component placed inside the root layout.
   - No Sass, no `transpilePackages`, no load-path settings.
4. **Use it**: components from `@afframe/ui` (and `/tables`, `/charts`, `/chat`); in Server Components only `@afframe/ui/server`. Own styles use Carbon tokens as CSS variables (`var(--cds-spacing-05)`, `var(--cds-text-primary)`).
5. **Rules for consumers**: do not install or configure `@carbon/styles` Sass (a second configuration is a compile error); do not override `.cds--` or `.c4p--` classes; do not import `@carbon/*` directly for things Afframe UI wraps.
6. **Tests**: Vitest works as is; Jest needs `transformIgnorePatterns` to let `@afframe/ui`, `@tanstack`, `@carbon/ai-chat` and `lit` through (exact list to prove).
7. **Optional app-level package**: a consumer monorepo may keep its own thin internal package for app-specific composites (like analytics' design-system facade), which depends on `@afframe/ui` instead of on Carbon.

## 4. Working across repos

Decided 2026-09-24:
- **Carbon upgrades in afframe/ui**: on a regular schedule plus on demand (security fixes, needed features). Dependabot opens the update PR, tests and visual tests gate it, and a release is published only after Hleb approves it; nothing releases automatically.
- **Consumer updates**: Dependabot in each consumer monorepo, grouping `@afframe/ui` with its two Carbon peers in one PR.
- **Only the latest release ships**: no preview or release-candidate versions. Changes are tried inside afframe/ui (Storybook and the reference apps) before a release.
- **Versioning and changelog**: not now; commit history is enough until the full build is done. Later option on record: the approach of `hlebtkachenko/monorepo` (tag-triggered release workflow, `changelog.d/` fragments compiled into `CHANGELOG.md`, a `release-hold` environment).
- **Breaking changes**: semantic versioning and a migration note per breaking release.

## 5. Open points

- The "(to prove)" items in section 2.7 and the access questions in section 2.6.
- Licence: resolved (Hleb, 2026-09-24): the README states that commercial use needs a separate licence from the copyright holder.
