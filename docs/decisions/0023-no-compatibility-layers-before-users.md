# 23. No compatibility layers before users

Date: 2026-10-19

## Status

Accepted. Supersedes in part [ADR 0018](0018-carbon-v11-without-v12-flags.md): the per-instance `enable-v12-overflowmenu` switch of `OverflowMenu` and `TableToolbarMenu` and its 1.0.x consequences.

## Context

The package is in development and has no users. ADR 0018 kept the `@afframe/ui` 1.0.x menu shape working: Afframe wrappers of `OverflowMenu` and `TableToolbarMenu` took `label` and `menuAlignment` props and `MenuItem` children and turned `enable-v12-overflowmenu` on for that one menu. The wrappers, their stories, tests and docs existed only for code no one runs.

## Decision

While the package has no users, a breaking change replaces the old API outright. No compatibility shims, deprecated variants or stories of an old shape.

First application: the 1.0.x menu shape goes. `OverflowMenu` and `TableToolbarMenu` are Carbon's own components, re-exported from `src/index.ts` like every other Carbon component, and `enable-v12-overflowmenu` is off like the other v12 flags (ADR 0018).

## Consequences

Less code to keep in step with Carbon: no menu switch points to recheck on a Carbon update. `OverflowMenu` takes `OverflowMenuItem` children and `TableToolbarMenu` takes `TableToolbarAction` children; `label`, `menuAlignment` and `MenuItem` children are not supported. Carbon's `OverflowMenuProps` still declares `label` and `menuAlignment` (from its v12 menu types), so TypeScript does not flag them: on the v11 menu `label` is ignored and `menuAlignment` reaches the DOM.
