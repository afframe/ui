# 15. Carbon Charts CSS in its own file

Date: 2026-10-07

## Status

Accepted. Amends [ADR 0006](0006-compiled-css-light-dark-plex.md).

## Context

Carbon Charts styles grow `styles.css` by about 257 KB raw (24 KB gzip) on every route, though most apps render charts on few pages.

## Decision

The package ships two compiled stylesheets: `@afframe/ui/styles.css` (Carbon, IBM Products, Afframe) and `@afframe/ui/charts.css` (Carbon Charts only). An app that renders Carbon Charts, directly or through `ChatChart`, imports `charts.css` as well, globally or on the routes that render charts. ECharts needs no CSS.

## Consequences

- Routes without charts no longer load the Charts CSS.
- Forgetting `charts.css` leaves Carbon Charts unstyled. The styles entry, the consuming guide and the Charts and ChatElements docs pages say so.
- `check:pack` asserts that `styles.css` carries no Carbon Charts rules and that `charts.css` exists.
