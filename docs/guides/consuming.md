# Consuming Afframe UI

How an Afframe repo installs and uses `@afframe/ui`. Releases are published to GitHub Packages (ADR 0016); `examples/nextjs` proves this path against the packed tarball.

## 1. Registry and auth

`@afframe/ui` lives on GitHub Packages (`https://npm.pkg.github.com`), which needs a token for every install, public packages included. It takes a classic token with `read:packages` (a personal access token or the `gh` CLI's token) or a GitHub Actions `GITHUB_TOKEN`; it does not accept fine-grained tokens.

The repo commits only the registry line, in `.npmrc` at the workspace root:

```ini
@afframe:registry=https://npm.pkg.github.com
```

The token line never goes into the repo's `.npmrc`. Current pnpm versions ignore `${...}` in repository-controlled credentials (a cloned repo must not be able to read your environment) and warns `Ignored project-level auth setting`. It goes into a user-level config instead, one way per place:

| Where                                                | Token                                         | Setup, once                                                                                                                 |
| ---------------------------------------------------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Developer machine, and agent sessions that run on it | the `gh` CLI's token                          | the token helper below                                                                                                      |
| Cloud agent sessions                                 | a personal access token, `read:packages` only | `NODE_AUTH_TOKEN` as a secret in the environment settings; the setup script writes the placeholder line below to `~/.npmrc` |
| GitHub Actions                                       | `GITHUB_TOKEN`                                | `permissions: packages: read`; `actions/setup-node` writes the user-level line                                              |
| Docker image builds                                  | the same token as the build host              | a BuildKit secret, below                                                                                                    |
| Dependabot                                           | its own `GITHUB_TOKEN`                        | nothing (section 8)                                                                                                         |

Developer machine. The token helper runs `gh auth token` for each install: no copy of the token on disk and no environment variable, so apps that agents run from (outside a shell) see it too. pnpm reads the helper; npm does not, so a tool that installs with npm needs the placeholder line and `NODE_AUTH_TOKEN` set. With both lines in `~/.npmrc` and the variable unset, pnpm still uses the helper and warns `Failed to replace env in config: ${NODE_AUTH_TOKEN}`; the warning is harmless.

```sh
gh auth refresh -h github.com -s read:packages
mkdir -p ~/.local/bin
printf '#!/bin/sh\nexec %s auth token\n' "$(command -v gh)" > ~/.local/bin/gh-npm-auth
chmod +x ~/.local/bin/gh-npm-auth
echo "//npm.pkg.github.com/:tokenHelper=$HOME/.local/bin/gh-npm-auth" >> ~/.npmrc
```

The placeholder line, for every other place, reads the token from `NODE_AUTH_TOKEN` (single quotes, so the shell writes `${NODE_AUTH_TOKEN}` as is):

```sh
echo '//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}' >> ~/.npmrc
```

GitHub Actions:

```yaml
jobs:
  build:
    runs-on: ubuntu-24.04
    permissions:
      contents: read
      packages: read
    env:
      IBM_TELEMETRY_DISABLED: 'true'
    steps:
      - uses: actions/checkout@<sha>
        with:
          persist-credentials: false
      - uses: pnpm/action-setup@<sha>
      - uses: actions/setup-node@<sha>
        with:
          node-version: 24
          registry-url: https://npm.pkg.github.com
          scope: '@afframe'
      - run: pnpm install --frozen-lockfile
        env:
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

Every workflow that installs needs `packages: read`, image builds and scheduled rebuilds included. Later pnpm steps without `NODE_AUTH_TOKEN` warn `Failed to replace env in config`; the warning is harmless. Keep `scope`: without it `setup-node` sends every package to GitHub Packages.

Docker. The install stage writes a user-level `.npmrc` that holds no secret, and the token arrives as a BuildKit secret, so it stays out of every layer and build argument. The repo's `.npmrc` is not needed in the build context. The `# syntax` line takes effect only as the first line of the Dockerfile:

```dockerfile
# syntax=docker/dockerfile:1
FROM node:24-slim AS deps
ENV IBM_TELEMETRY_DISABLED=true
RUN npm install -g pnpm@<version>
WORKDIR /app
RUN printf '%s\n' '@afframe:registry=https://npm.pkg.github.com' \
    '//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}' > "$HOME/.npmrc"
COPY pnpm-workspace.yaml pnpm-lock.yaml ./
RUN --mount=type=secret,id=NODE_AUTH_TOKEN,env=NODE_AUTH_TOKEN,required=true pnpm fetch
COPY . .
RUN pnpm install --offline --frozen-lockfile
```

`<version>` is the `packageManager` version in the root `package.json`. Only `pnpm fetch` needs the secret; the offline install reads the store it filled. `required=true` fails the build at once when the secret is missing, instead of a 401 later.

The build passes the secret from an environment variable, on a developer machine:

```sh
NODE_AUTH_TOKEN="$(gh auth token)" docker buildx build --secret id=NODE_AUTH_TOKEN .
```

In GitHub Actions, `docker/build-push-action` takes `secrets: NODE_AUTH_TOKEN=${{ secrets.GITHUB_TOKEN }}`.

Check the setup in the consumer repo: `pnpm view @afframe/ui version` prints the latest version.

| Symptom                                                          | Cause                                                                                                                                                                        |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `WARN Ignored project-level auth setting`                        | the token line is in the repo's `.npmrc`; move it to user level                                                                                                              |
| `401 Unauthorized` or `403 Forbidden`                            | no token reached pnpm (user-level line missing, `NODE_AUTH_TOKEN` empty), or GitHub rejected it: a fine-grained token, no `read:packages`, or in Actions no `packages: read` |
| `ERR_PNPM_NO_MATCHING_VERSION` naming an older version as latest | an auth failure: pnpm fell back to cached metadata; fix the token                                                                                                            |
| `ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION` for `@afframe/ui`       | the release is less than a day old; add `minimumReleaseAgeExclude` (section 2)                                                                                               |
| `is not a legal HTTP header value`                               | the token ends in a newline, as when a secret comes from a file; pass it from an environment variable or strip the newline                                                   |

## 2. Telemetry off

Carbon packages arrive as dependencies of `@afframe/ui` and carry IBM Telemetry install scripts (ADR 0007). In the consumer repo:

- Set `IBM_TELEMETRY_DISABLED=true` in every CI job and container build that installs dependencies. In a Dockerfile: `ENV IBM_TELEMETRY_DISABLED=true` in the stage that runs `pnpm fetch` or `pnpm install`.
- pnpm: add `strictDepBuilds: false` and `minimumReleaseAgeExclude: ['@afframe/*']` to the workspace root `pnpm-workspace.yaml`. A Docker build copies that file into the install stage before `pnpm fetch` or `pnpm install`; without it the image build fails with `ERR_PNPM_IGNORED_BUILDS`.

pnpm blocks dependency install scripts by default, and with `strictDepBuilds` (default `true`) it fails the install with `ERR_PNPM_IGNORED_BUILDS` for every package that has one, including transitive dependencies such as Carbon under `@afframe/ui`. Setting `strictDepBuilds: false` keeps the scripts blocked and removes only the failure. Evidence: ADR 0007. A dependency cannot ship this setting, so each consumer repo sets it. pnpm then writes each of these packages under `allowBuilds` as undecided; set them to `false` (as this repo's `pnpm-workspace.yaml` does) so installs leave the file unchanged.

On GitHub's runners and in image builds, pnpm rejects a version published less than a day ago (`ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION`), lockfile entries included, so a fresh `@afframe/ui` release would fail CI and its Dependabot pull request for a day. `minimumReleaseAgeExclude` lifts that for the `@afframe` scope only; other packages keep the delay.

## 3. Install

In the app package that renders UI (a monorepo with several apps: section 6):

```sh
IBM_TELEMETRY_DISABLED=true pnpm add --save-exact @afframe/ui react react-dom
```

Pin `@afframe/ui` exactly. Versions are Afframe's own release numbers, not semver: any release, minor ones included, can carry breaking changes, so a `^` range can pull one in unasked. Updates come as one reviewed version at a time (section 8).

The package is ESM and needs Node.js 22.15 or newer, where `require()` also loads it. React and React DOM 19 are the only required peers. `@types/react` and `@types/react-dom` 19 are optional peers: a TypeScript app installs them, since the package types use React types; `react-is`, `sass` and the Carbon packages IBM Products peers are regular dependencies of `@afframe/ui`, so you add only `react` and `react-dom`. Carbon, IBM Products, Labs and the extras come with `@afframe/ui`.

## 4. Wire it once

In the app root (`app/layout.tsx` in Next.js App Router, `main.tsx` in Vite):

```tsx
import '@afframe/ui/styles.css';
```

An app that renders Carbon Charts (`Charts`, or `ChatChart` with the Carbon Charts engine) must also import `@afframe/ui/charts.css`, after `styles.css`: in the root layout, or only in the routes that render charts. `EChart` needs no stylesheet.

Set the theme on `<html>` in the server-rendered root layout with `data-afframe-theme`: `light`, `dark` or `system`. Runtime switching and the theme hooks: the Theming docs page (`src/theme/Theming.mdx`).

Wrap the app in `<AfframeProvider>`. It turns on the Carbon feature flags Afframe UI uses. Without it, modals show in the page even while closed, with no backdrop. In Next.js App Router it is a client component placed inside the root layout. `@afframe/ui` needs no Sass, no `transpilePackages` and no load-path settings.

In Next.js, build with Turbopack (the default); `next build --webpack` is not supported. The first page loads about 233 KB gzip of Carbon, more on a page with IBM Products components; later pages take it from the cache. `optimizePackageImports` is not needed. Measurements: ADR 0025.

## 5. Use it

Import every component from `@afframe/ui`. Icons, pictograms and JavaScript token values have their own paths, with Carbon's names, as in `@carbon/react/icons`:

```tsx
import { Button } from '@afframe/ui';
import { Add } from '@afframe/ui/icons';
import { AiEthics } from '@afframe/ui/pictograms';
import { g100, durationFast01 } from '@afframe/ui/tokens';
```

IBM Products components come from `@afframe/ui` too. The ones moving into Carbon core in v12 have their core names (`Tearsheet`, `SidePanel`, `PageHeader`), the others keep IBM's names, `preview__` and `previewCandidate__` prefixes included. `usePrefix` is IBM Products' (`c4p`); Carbon's is `useCarbonPrefix`. Render `PageHeader` as `PageHeader.Root` with its parts; a bare `<PageHeader>` renders nothing. A server component can render client components with serializable props but cannot dot into them: `PageHeader.Root`, `Tearsheet.Header` and the parts of `preview__Card` and `preview__Dialog` go in a client component (on the server the build fails with "Element type is invalid").

Formatting functions (`formatAmount`, `formatDate` and the rest) come from `@afframe/ui` too, and alone from `@afframe/ui/format`, which loads no components: use it in server code, route handlers and scripts.

Style your own markup with Carbon tokens as CSS variables (`var(--cds-spacing-05)`, `var(--cds-text-primary)`); `@afframe/ui/tokens` is for token values needed in JavaScript.

Do not:

- install or configure `@carbon/styles` Sass (a second configuration fails to compile);
- override `.cds--` or `.c4p--` classes;
- redefine `--cds-*` tokens: an override is undone inside `Theme` zones and charts and does not reach the values compiled into `styles.css` (`docs/guides/theming.md`);
- import `@carbon/*` (including `@carbon/ibm-products`) or `@carbon-labs/*` directly; it can pull a second Carbon version.

### Formatting on the server

The formatters (`formatAmount`, `formatNumber`, `formatDate`, `formatDateRange` and the other formatters) and `Amount` are server-safe: call or render them in a server component, imported from `@afframe/ui`. Defaults are Czech locale, CZK and Prague time (ADR 0014), overridable per call.

```tsx
import { Amount, formatAmount } from '@afframe/ui';

export default function Total() {
  return (
    <p>
      {formatAmount(1234.5)} <Amount value={-1234.5} colorNegative />
    </p>
  );
}
```

### Afframe components on the server

`Amount`, `StatusIndicator` and `DescriptionList` are server-safe: render them in a server component, with any `messages`, function-valued ones included. The other Afframe components are client modules: `DataGrid`, `FilterPanel`, `FilterSummary`, `AmountInput`, `AccentTag`, `ControlledDatePicker`, the create and edit components (`CreateModal`, `CreateSidePanel`, `EditSidePanel`, `EditTearsheet`, `EditFullPage`), the modals (`RemoveModal`, `ImportModal`, `ExportModal`, `APIKeyModal`), the header components (`EnvironmentSwitcher`, `HelpMenu`, `LogoutTile`, `LogoutBanner`) and the chat elements (`ChatChart`, `renderChatElement`). A server component can pass them only serializable props, string messages included; set event handlers (such as `onSubmit`) and function-valued messages (such as `RemoveModal`'s `confirm(kind)`) in a client component (ADR 0014). The `default<Name>Messages` objects come from the same client modules (`defaultDatePickerMessages` among them), so a server component cannot read or spread them: merge messages in a client component.

### Extras

Carbon Charts, ECharts, the data grid and the AI chat each sit in their own client module, so a route that does not use one ships none of its JavaScript (`scripts/check-example.mjs` checks it).

- Charts and `EChart` load statically with the route that renders them. The server renders an empty container; the chart draws in the browser.
- Carbon Charts components take `chartRef` for IBM's chart instance, where IBM's docs use `ref`. `EChart` takes `chartRef` for the ECharts instance; its `ref` is the container `div`.
- `ChatContainer` and `ChatCustomElement` load `@carbon/ai-chat` lazily in the browser, because it defines custom elements when it loads. The server renders a placeholder.
- IBM's enums (for example `ScaleTypes`, `ChartTheme`, `MessageResponseTypes`) come from client modules, so a server component cannot read their values. Build chart or chat options in a client component, or pass the plain string values.
- Carbon Charts CSS ships separately as `@afframe/ui/charts.css` (about 257 KB, 24 KB gzipped); `styles.css` carries none of it. Import it where charts render (section 4).

### Header components

`EnvironmentSwitcher`, `HelpMenu`, `LogoutTile` and `LogoutBanner` are client modules that import no Labs code, so they work inside Carbon's `Header` and inside the Labs shell alike. A server component can render them with serializable props: `LogoutTile` with `href` renders its log-out link on the server. Event handlers and function-valued messages (such as `LogoutBanner`'s `expiring(minutes)`) come from a client component.

### Chat elements

The AI chat used without the chat element renderers ships none of the Carbon Charts or ECharts code. With `renderChatElement` as the chat's `renderUserDefinedResponse`, each engine loads with `import()` only when a message needs it, behind a skeleton; `ChatChart` used alone loads its engine the same way. Carousels, tables and code need no renderer: `@carbon/ai-chat` draws them natively (the `carousel` item type, and markdown tables and code blocks). Function-valued props such as `renderUserDefinedResponse` and `messages` come from a client component. Payloads and supported element types: the `ChatElements` docs page (`src/components/ChatElements/ChatElements.mdx`).

## 6. Monorepo: a shared UI package

A pnpm workspace with several apps can keep its shared UI setup in one workspace package (here `@acme/ui`) that the apps depend on with `workspace:*`. This is supported; ADR 0001 is about the structure of this repo, not of its consumers.

pnpm lets a package import only its own dependencies, so choose one of two shapes.

Apps import `@afframe/ui` themselves (simpler, recommended). Each app depends on `@afframe/ui` and on `@acme/ui`, and a pnpm catalog keeps one version for all of them:

```yaml
# pnpm-workspace.yaml at the workspace root
catalog:
  '@afframe/ui': <version>
minimumReleaseAgeExclude:
  - '@afframe/*'
```

```json
"dependencies": {
  "@afframe/ui": "catalog:",
  "@acme/ui": "workspace:*"
}
```

`@acme/ui` also depends on `@afframe/ui` with `catalog:` and holds only what the apps share: the client provider, own components, messages. Every import path, rule and check in this guide applies to the apps unchanged.

Or `@acme/ui` re-exports `@afframe/ui`, and apps depend on `@acme/ui` alone. The re-export must keep what the package keeps:

- The barrel has no `'use client'`. `export * from '@afframe/ui';` in a file without a directive keeps the formatters, `Amount`, `StatusIndicator`, `DescriptionList` and `themeSets` usable in server components; with `'use client'` on the barrel, a server component that calls `formatAmount()` fails the build.
- Each subpath stays a subpath in `@acme/ui`'s `exports`: `./icons`, `./pictograms`, `./tokens` and `./format` (server code imports formatters without components) as one-line `export *` files, `./styles.css` and `./charts.css` as CSS files holding only `@import '@afframe/ui/styles.css';` (or `charts.css`).

```json
"exports": {
  ".": "./src/index.ts",
  "./format": "./src/format.ts",
  "./styles.css": "./src/styles.css"
}
```

Both shapes ship the same JavaScript and CSS to the browser.

In both shapes:

- `@acme/ui`'s own client components start each file with `'use client'`, and its client index files use named re-exports, no `export *`.
- No file of `@acme/ui` imports two of Charts, ECharts, `DataGrid` and the AI chat; each one that uses them gets its own entry in `exports`, so a route that does not use one ships none of it.
- `@acme/ui`'s `package.json` sets `"sideEffects": ["**/*.css"]`, so bundlers drop unused re-exports and keep CSS imports.
- Each app root imports `@afframe/ui/styles.css` once (or `@acme/ui/styles.css` in the re-export shape), and `charts.css` where charts render.
- `data-afframe-theme` sits on `<html>` in each app's server root layout. `AfframeProvider` can sit inside `@acme/ui`'s client provider, which each app root renders.
- Next.js: a workspace package that ships TypeScript source goes into the app's `transpilePackages`. `@afframe/ui` itself does not. The app's type check reads that source from the package's own folder, so the package lists `@types/react` and `@types/react-dom` in its `devDependencies`; without them `next build` fails with `TS7016: Could not find a declaration file for module 'react'`.
- The registry line in `.npmrc`, `strictDepBuilds`, `minimumReleaseAgeExclude` and `allowBuilds` live at the workspace root only; a dependency cannot ship them.
- `@acme/ui` does not import `@carbon/*` or `@carbon-labs/*` either.

## 7. Tests

Vitest works as is.

### Trying an unreleased change

To try a change in a consumer app before it is released, pack it in a clone of `afframe/ui`:

```sh
pnpm build && npm pack --ignore-scripts
```

Use `npm pack`, as the release does: `pnpm pack` would also ship the `LICENSE` symlink. In the consumer, point the dependency at the tarball by absolute path (in a catalog: set the catalog entry to `file:/abs/path/afframe-ui-<version>.tgz`):

```sh
pnpm add /abs/path/afframe-ui-<version>.tgz
```

Never commit this change: restore `package.json`, `pnpm-workspace.yaml` and `pnpm-lock.yaml` from git and run `pnpm install`. A Docker build cannot read a tarball outside its build context, so image builds test the released version. `examples/nextjs` in this repo installs the package the same way.

## 8. Updates

Dependabot keeps the exact pin current: one pull request per release. Read the GitHub Release of `afframe/ui` for each version before merging; a release with a breaking change has migration notes there.

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: daily
    cooldown:
      default-days: 7
      exclude: ['@afframe/*']
```

- Dependabot reads GitHub Packages with its own `GITHUB_TOKEN`; no `registries:` entry, no personal token and, for this public package, no "Manage Actions access" grant (checked from a repo without one). If Dependabot reports a blocked host or a 401 for `npm.pkg.github.com`, add a `registries:` entry for it.
- A `cooldown` delays every update by its days; exclude `@afframe/*` so a release arrives the day it ships.
- In a monorepo with a catalog, Dependabot updates the catalog entry.

## 9. Agents

The package ships `dist/agents.md`, generated from the sections "Wire it once" and "Use it" of this guide and the package exports: the wiring and import rules, the exports Afframe renames from upstream, and every export with its runtime. It matches the installed version. Paste this into the consumer repo's `AGENTS.md`; it names the path because agent search tools skip `node_modules`:

```md
## UI: @afframe/ui

Before choosing or writing UI code, read `node_modules/@afframe/ui/dist/agents.md` (in a monorepo: the `node_modules` of the package that depends on `@afframe/ui`). It matches the installed version.

- Import only from `@afframe/ui` and its subpaths, never `@carbon/*` or `@carbon-labs/*`, even when Carbon docs or the Carbon MCP show it.
- Upstream docs use upstream names; use the Afframe name from the renamed exports table.
- A server component renders client exports only with serializable props; event handlers, function-valued messages and dotted parts (`PageHeader.Root`) belong in a client component.
```

In the re-export shape (section 6), write the shared package's name instead of `@afframe/ui` in the import line.

## 10. Licence

`@afframe/ui` is under the PolyForm Noncommercial License 1.0.0 (README, ADR 0011 and its 2026-10-19 amendment). Commercial use needs a separate licence from the copyright holder, granted per product. The IBM parts stay under Apache-2.0.

## 11. Known issues

- Unmounting a `Modal` or `ComposedModal` during its exit animation logs an unhandled `AbortError` in the console. It comes from Carbon's `usePresence` ([carbon#23659](https://github.com/carbon-design-system/carbon/issues/23659)) and is harmless; IBM Products' `Tearsheet` does the same ([ibm-products#9944](https://github.com/carbon-design-system/ibm-products/issues/9944)). This repo patches the Carbon one for its own tests only (`docs/guides/updating-carbon.md`, Local patches).
