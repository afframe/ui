# 3. Upstream packages as exact regular dependencies

Date: 2026-10-05

## Status

Accepted

## Context

Afframe UI is the integrator: it chooses the Carbon versions, fixes and improvements. If Carbon were a peer dependency, every consumer would install and pin Carbon itself and keep it in step with Afframe UI. Bundling Carbon into the package would make updates and licence notices harder to track.

## Decision

Carbon, IBM Products, Carbon Labs and the other upstream packages (Carbon Charts, ECharts and its Carbon theme, `@carbon/ai-chat`, TanStack Table v9, icons, pictograms) are regular `dependencies` of `@afframe/ui`, pinned to exact versions. They are not bundled and not peers. The only peers are `react` and `react-dom` `>=19`, plus `@types/react` and `@types/react-dom` `>=19` as optional peers, because the public types use React types. `@carbon/react` 1.117.0 also peers `react-is` and `sass` (non-optional); `@carbon/ibm-products` peers `@carbon/grid`, `@carbon/layout`, `@carbon/motion`, `@carbon/themes` and `@carbon/type`. All of them are regular dependencies of `@afframe/ui`, so consumers add only `react` and `react-dom`.

Dependabot keeps the exact versions current in this repo, with Carbon updates grouped, and in consumer repos (see `docs/guides/updating-carbon.md`).

## Consequences

Consumers install only `@afframe/ui` plus React. Their package manager installs Carbon as a transitive dependency, so Carbon's install scripts still reach consumers: under pnpm the consumer sets `strictDepBuilds: false` (see ADR 0007 and `docs/guides/consuming.md`). A consumer that imports `@carbon/*` directly can end up with a second Carbon version; the consuming guide tells them not to.
