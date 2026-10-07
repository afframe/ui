# 5. Migrated components through IBM Products

Date: 2026-10-05

## Status

Accepted

## Context

IBM is moving a set of components from IBM Products into Carbon core for v12 (among them Tearsheet, SidePanel, PageHeader, EditInPlace, NotificationsPanel, UserAvatar, BigNumber, Coachmark, AddSelect, ConditionBuilder). Carbon excludes them from every published `@carbon/react` build, including the v12 alphas. Copying Carbon's unpublished source would mean maintaining and re-syncing a fork.

## Decision

Use the IBM Products versions of these components, exported under Afframe names. When Carbon v12 is stable, switch the Afframe names to the core versions. Resizer comes from `@carbon-labs/react-resizer`. OptionsTile is not included. No Carbon source is copied for this.

## Consequences

The switch to core is internal to Afframe UI; consumers keep the same imports. Until then these components carry IBM Products' styling (prefix `c4p`), compiled together with Carbon's v12 styles. A component IBM Products does not export publicly (ActionSet) is not available until core ships it.

The backing exports are IBM Products' newer implementations, the ones core takes over:

- `Tearsheet` is `preview__Tearsheet`, with `variant="narrow"` and presence built in, so `TearsheetNarrow` and `TearsheetPresence` are not exported.
- `PageHeader` is IBM's `preview__PageHeader` namespace, used as `PageHeader.Root`; a bare `<PageHeader>` renders nothing.
- `Coachmark` is `preview__Coachmark`, and `AddSelect` is `preview__AddSelect`.
- `Resizer` comes from `@carbon-labs/react-resizer`, a regular dependency.
