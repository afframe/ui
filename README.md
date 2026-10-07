# Afframe UI

Afframe UI and design system.

`@afframe/ui` is one React package built on IBM's Carbon Design System: Carbon core, IBM Products, Carbon Labs and a set of extras (charts, ECharts, AI chat, data grid, onboarding), configured once and themed for Afframe. It is general purpose for every Afframe product, not bound to any one app.

## Status

Carbon core and IBM Products components are re-exported from `@afframe/ui`, the migrated components under their Carbon v12 core names, with Carbon's icons, pictograms and tokens on their own subpaths and the upstream docs and stories copied into Storybook. Carbon Labs, the extras and the Afframe-owned components are included too; the folder list is in [docs/package-structure.md](docs/package-structure.md). Releases are published to GitHub Packages ([ADR 0016](docs/decisions/0016-first-release-before-carbon-v12.md)).

## Usage

Point the `@afframe` scope at GitHub Packages in `.npmrc` (auth: [docs/guides/consuming.md](docs/guides/consuming.md)):

```ini
@afframe:registry=https://npm.pkg.github.com
```

Installs need a token with `read:packages`, and pnpm apps set `strictDepBuilds: false` in `pnpm-workspace.yaml` (Carbon's telemetry install scripts stay blocked):

```sh
IBM_TELEMETRY_DISABLED=true pnpm add @afframe/ui react react-dom
```

Import the styles once and wrap the app in `AfframeProvider`:

```tsx
import '@afframe/ui/styles.css';
import { AfframeProvider, Button } from '@afframe/ui';

export function App() {
  return (
    <AfframeProvider>
      <Button>Save</Button>
    </AfframeProvider>
  );
}
```

An app that renders Carbon Charts also imports `@afframe/ui/charts.css`. Themes, server rendering, telemetry settings and the rest: [docs/guides/consuming.md](docs/guides/consuming.md).

## Docs

- [ARCHITECTURE.md](ARCHITECTURE.md): how the package is put together
- [AGENTS.md](AGENTS.md): repo conventions for agents and contributors
- [docs/README.md](docs/README.md): index of the docs folder (handbook, package structure, testing, feature flags, guides, decisions)

## License

Copyright 2026 Hleb Tkachenko. Licensed under the [PolyForm Noncommercial License 1.0.0](LICENSES/PolyForm-Noncommercial-1.0.0.txt).

You may use, modify, and share this code for noncommercial purposes only. Commercial use of any kind, including selling this code or using it in a commercial product or service, is not permitted without a separate license from the copyright holder.

The license covers only the original work of the copyright holder. Third-party components included in or used by this project remain under their own licenses, and those licenses govern their use.

Portions of this project are copied from or derived from IBM's Carbon Design System projects (Copyright IBM Corp.), licensed under the Apache License 2.0: see [LICENSES/Apache-2.0.txt](LICENSES/Apache-2.0.txt). Those portions remain under Apache-2.0.

The compiled stylesheets in the package are built from IBM's Carbon, IBM Products, Carbon Labs and Carbon Charts styles (Apache-2.0); the IBM Plex fonts ship unmodified under the SIL Open Font License 1.1 (`dist/fonts/LICENSE.txt`). Per-file licences are machine-readable (REUSE 3.3). IBM, IBM Plex and Carbon are trademarks or registered trademarks of International Business Machines Corporation; Afframe UI is an independent project, not affiliated with or endorsed by IBM.
