# 17. IBM's declarations for untyped IBM Products exports

Date: 2026-10-12

## Status

Accepted. An exception to the no-copy rule of [ADR 0005](0005-migrated-components-via-ibm-products.md).

## Context

`@carbon/ibm-products` 2.100.0 exports `AddSelectData`, the data helper of `AddSelect`, but its published declarations import it from `@carbon/ibm-products-utilities`. IBM marks that package private and never publishes it, so for every consumer the export has no types. ADR 0004 puts the non-deprecated IBM Products exports in scope.

## Decision

`src/ibm-products/` holds one module per such export. `add-select-data.ts` carries IBM's declarations, generated with `tsc` from `packages/ibm-products-utilities/src/utils/add-select/add-select-data.ts` at the pinned IBM Products tag (Apache-2.0 header kept), and exports IBM's run-time value cast to them. Only declarations are copied, never run-time code. `src/index.ts` re-exports the module with `export *`, and the registry lists its exports as IBM Products exports.

## Options not chosen

- Depend on `@carbon/ibm-products-utilities`: not on npm.
- Export the value untyped: consumers get `any`.
- Leave `AddSelectData` out: an in-scope export would be missing.

## Consequences

Each IBM Products update regenerates the declarations from the new tag (`docs/guides/updating-carbon.md`). When IBM's published types resolve the export, the module goes and `AddSelectData` is re-exported from `@carbon/ibm-products` directly.
