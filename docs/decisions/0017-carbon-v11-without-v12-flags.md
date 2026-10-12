# 17. Carbon v11 without the v12 feature flags

Date: 2026-10-12

## Status

Accepted. Supersedes [ADR 0002](0002-stable-carbon-with-v12-flags.md). Amends [ADR 0004](0004-scope-core-products-labs-extras.md), [ADR 0005](0005-migrated-components-via-ibm-products.md) and [ADR 0006](0006-compiled-css-light-dark-plex.md).

## Context

ADR 0002 ran stable Carbon v11 with the v12 feature flags on. Carbon v12 is still alpha, and the flags brought breaks Afframe had to work around: `OverflowMenuItem` children cannot be reached by keyboard under `enable-v12-overflowmenu`, so `DataGrid` forced the v12 menu locally and several stories ran with the v12 flags turned back off.

## Decision

Use stable `@carbon/react` v11 (1.x) and stable `@carbon/ibm-products` with v11 behaviour and look: no `enable-v12-release` and no `enable-v12-*` flag, in React or in Sass. The opt-in flags that are not part of v12 stay on (`docs/feature-flags.md`). One flag Carbon files under v12 stays on: `enable-focus-wrap-without-sentinels`, in React only, because it removes two dead Tab stops from every `ActionableNotification` and changes no look. `enable-v12-dynamic-floating-styles` stays off: its auto-align classes change layout and it drops `flip` from MenuButton and ComboButton. `autoAlign` is the per-instance tool for clipping. No alpha or beta Carbon. A move to v12 is a new decision once IBM ships it as stable.

## Consequences

The package looks and behaves like Carbon v11: square corners on fields and buttons, pill tags, bottom-border fields, the v11 `OverflowMenu` with `OverflowMenuItem` children. Apps on an earlier release see that change. The v12-only copied stories and docs pages are gone, and so are the v11-behaviour story exceptions. `enable-focus-wrap-without-sentinels` is on through `AfframeProvider`; `Modal` and `ComposedModal` log a development warning; `LogoutBanner` keeps its local setting. The Sass build stays, because Afframe sets the opt-in flags, themes and font paths there (ADR 0006). The migrated components keep their Afframe names (ADR 0005).
