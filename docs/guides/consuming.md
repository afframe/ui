# Consuming Afframe UI

How an Afframe repo installs and uses `@afframe/ui`. Releases are published to GitHub Packages (ADR 0016); `examples/nextjs` proves this path against the packed tarball.

## 1. Registry and auth

`@afframe/ui` lives on GitHub Packages (`https://npm.pkg.github.com`). Add `.npmrc` at the repo root (committed, no secret in it):

```ini
@afframe:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

- CI (GitHub Actions): `permissions: packages: read` and `NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}`. The consumer repo needs read access in the package's "Manage Actions access" settings.
- Developer machines: a classic personal access token with `read:packages` in `NODE_AUTH_TOKEN`. GitHub Packages does not accept fine-grained tokens.

## 2. Telemetry off

Carbon packages arrive as dependencies of `@afframe/ui` and carry IBM Telemetry install scripts (ADR 0007). In the consumer repo:

- Set `IBM_TELEMETRY_DISABLED=true` in every CI job and container build that installs dependencies.
- pnpm: add `strictDepBuilds: false` to `pnpm-workspace.yaml`.

pnpm blocks dependency install scripts by default, and with `strictDepBuilds` (default `true`) it fails the install with `ERR_PNPM_IGNORED_BUILDS` for every package that has one, including transitive dependencies such as Carbon under `@afframe/ui`. Setting `strictDepBuilds: false` keeps the scripts blocked and removes only the failure. 21 of 22 `@carbon/*` and `@ibm/plex` packages run `ibmtelemetry` on postinstall. Checked on pnpm 12.9.1 on 2026-10-05: the default fails, an `allowBuilds` wildcard does not match, `strictDepBuilds: false` passes. A dependency cannot ship this setting, so each consumer repo sets it. pnpm then writes each of these packages under `allowBuilds` as undecided; set them to `false` (as this repo's `pnpm-workspace.yaml` does) so installs leave the file unchanged.

## 3. Install

In the app package that renders UI:

```sh
IBM_TELEMETRY_DISABLED=true pnpm add @afframe/ui react react-dom
```

The package is ESM and needs Node.js 22.15 or newer, where `require()` also loads it. React and React DOM 19 are the only required peers. `@types/react` and `@types/react-dom` 19 are optional peers: a TypeScript app installs them, since the package types use React types; `react-is`, `sass` and the Carbon packages IBM Products peers are regular dependencies of `@afframe/ui`, so you add only `react` and `react-dom`. Carbon, IBM Products, Labs and the extras come with `@afframe/ui`.

## 4. Wire it once

In the app root (`app/layout.tsx` in Next.js App Router, `main.tsx` in Vite):

```tsx
import '@afframe/ui/styles.css';
```

An app that renders Carbon Charts (`Charts`, or `ChatChart` with the Carbon Charts engine) must also import `@afframe/ui/charts.css`, after `styles.css`: in the root layout, or only in the routes that render charts. `EChart` needs no stylesheet.

Set the theme on `<html>` in the server-rendered root layout: `data-afframe-theme="light"`, `"dark"` or `"system"` (follows the OS). Without the attribute the theme is `light`. The type `AfframeTheme` lists the values. The CSS applies the theme, so it does not flash and needs no script.

Wrap the app in `<AfframeProvider>`. It turns on the v12 flags. In Next.js App Router it is a client component placed inside the root layout. No Sass, no `transpilePackages`, no load-path settings.

## 5. Use it

Import every component from `@afframe/ui`. Icons, pictograms and JavaScript token values have their own paths, with Carbon's names, as in `@carbon/react/icons`:

```tsx
import { Button } from '@afframe/ui';
import { Add } from '@afframe/ui/icons';
import { AiEthics } from '@afframe/ui/pictograms';
import { g100, durationFast01 } from '@afframe/ui/tokens';
```

IBM Products components come from `@afframe/ui` too. The ones moving into Carbon core in v12 have their core names (`Tearsheet`, `SidePanel`, `PageHeader`), the others keep IBM's names, `preview__` and `previewCandidate__` prefixes included. `usePrefix` is IBM Products' (`c4p`); Carbon's is `useCarbonPrefix`. Render `PageHeader` as `PageHeader.Root` with its parts; a bare `<PageHeader>` renders nothing.

Formatting functions (`formatAmount`, `formatDate` and the rest) come from `@afframe/ui` too, and alone from `@afframe/ui/format`, which loads no components: use it in server code, route handlers and scripts.

Style your own markup with Carbon tokens as CSS variables (`var(--cds-spacing-05)`, `var(--cds-text-primary)`); `@afframe/ui/tokens` is for token values needed in JavaScript.

Do not:

- install or configure `@carbon/styles` Sass (a second configuration fails to compile);
- override `.cds--` or `.c4p--` classes;
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

`Amount`, `StatusIndicator` and `DescriptionList` are server-safe: render them in a server component, with any `messages`, function-valued ones included. The other Afframe components are client modules: `DataGrid`, `FilterPanel`, `AmountInput`, `AccentTag`, `ControlledDatePicker`, the create and edit components (`CreateModal`, `CreateSidePanel`, `EditSidePanel`, `EditTearsheet`, `EditFullPage`), the modals (`RemoveModal`, `ImportModal`, `ExportModal`, `APIKeyModal`), the header components (`EnvironmentSwitcher`, `HelpMenu`, `LogoutTile`, `LogoutBanner`) and the chat elements (`ChatChart`, `renderChatElement`). A server component can pass them only serializable props, string messages included; set event handlers (such as `onSubmit`) and function-valued messages (such as `RemoveModal`'s `title(kind, name)`) in a client component (ADR 0014).

### Extras

Carbon Charts, ECharts, the data grid and the AI chat each sit in their own client module, so a route that does not use one ships none of its JavaScript (`scripts/check-example.mjs` checks it).

- Charts and `EChart` load statically with the route that renders them. The server renders an empty container; the chart draws in the browser.
- `ChatContainer` and `ChatCustomElement` load `@carbon/ai-chat` lazily in the browser, because it defines custom elements when it loads. The server renders a placeholder.
- IBM's enums (for example `ScaleTypes`, `ChartTheme`, `MessageResponseTypes`) come from client modules, so a server component cannot read their values. Build chart or chat options in a client component, or pass the plain string values.
- Carbon Charts CSS ships separately as `@afframe/ui/charts.css` (about 257 KB, 24 KB gzipped); `styles.css` carries none of it. Import it where charts render (section 4).

### Header components

`EnvironmentSwitcher`, `HelpMenu`, `LogoutTile` and `LogoutBanner` are client modules that import no Labs code, so they work inside Carbon's `Header` and inside the Labs shell alike. A server component can render them with serializable props: `LogoutTile` with `href` renders its log-out link on the server. Event handlers and function-valued messages (such as `LogoutBanner`'s `expiring(minutes)`) come from a client component.

### Chat elements

The AI chat used without the chat element renderers ships none of the Carbon Charts or ECharts code. With `renderChatElement` as the chat's `renderUserDefinedResponse`, each engine loads with `import()` only when a message needs it, behind a skeleton; `ChatChart` used alone loads its engine the same way. Carousels, tables and code need no renderer: `@carbon/ai-chat` draws them natively (the `carousel` item type, and markdown tables and code blocks). Function-valued props such as `renderUserDefinedResponse` and `messages` come from a client component. Payloads and supported element types: the `ChatElements` docs page (`src/components/ChatElements/ChatElements.mdx`).

## 6. Tests

Vitest works as is.

## 7. Updates

Dependabot in the consumer repo keeps `@afframe/ui` current. Each version has release notes on the GitHub Releases page of `afframe/ui`.

## 8. Known issues

- Unmounting a `Modal` or `ComposedModal` during its exit animation logs an unhandled `AbortError` in the console. It comes from Carbon's `usePresence` ([carbon#23659](https://github.com/carbon-design-system/carbon/issues/23659)) and is harmless; IBM Products' `Tearsheet` does the same ([ibm-products#9944](https://github.com/carbon-design-system/ibm-products/issues/9944)). This repo patches the Carbon one for its own tests only (`docs/guides/updating-carbon.md`, Local patches).
