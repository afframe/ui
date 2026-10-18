# 22. Filtering follows tanstack-carbon

Date: 2026-10-18

## Status

Accepted. Amends [ADR 0004](0004-scope-core-products-labs-extras.md) (the "filter panel" improvement now follows Carbon's tanstack-carbon examples).

## Context

IBM Products deprecated its Datagrid in v2.54.0, keeps sev 1 fixes in v3 and removes it in v4. The deprecation points to [tanstack-carbon](https://github.com/carbon-design-system/tanstack-carbon): the official examples (the repo also has `react/community/tanstack-table-carbon`), not a package, with a filter panel, a filter flyout and a selected-filter summary. They target TanStack Table v8 and React 18. Afframe is on TanStack v9 and React 19, so the code is adapted, not installed.

## Decision

- One general `FilterPanel` that does not depend on a table, plus a DataGrid feature that fills it from the table's columns. A DataGrid flyout mode is not part of this decision.
- Field variants: checkbox, radio, select, multiselect (searchable becomes `FilterableMultiSelect`), text, number (exact match), date range (inclusive ISO day range) and slider (one handle, the upper bound; Carbon's two-handle props are `unstable_`).
- Update method: batch by default, with Clear and Apply; `instant` is an option, with Clear.
- Layout: flat sections by default; accordion is an option.
- Search: per checkbox and radio group.
- Title "Filter". The result count stays.
- `FilterFlyout`: an icon trigger by default, with the count in its accessible name; a text trigger "Filter (n)" is an option.
- `FilterSummary`: one line of tags in IBM Products' `TagOverflow`, the overflow shown in a "+N" popover, then Clear filters. IBM's component replaces an own overflow measurement; it moves focus to the summary group after a dismiss, names "+N" only by its text, and has a "View all" modal for many hidden tags.
- DataGrid: an inline left panel that pushes the table, and a filtered-empty state.
- Files adapted from tanstack-carbon carry IBM's Apache-2.0 header in the repo format, with a "Modified by Afframe" line ([ADR 0011](0011-licence.md)). The upstream files have no header.

## Afframe additions

- Options come from the table's core rows, so they stay stable while another filter is applied.
- A date range filters by inclusive ISO days and needs a start; a value without one is no filter.
- A flyout discards its draft when dismissed.
- A range picker does not pull focus back to the end input after a change (flatpickr's range plugin does), and a click in the calendar does not close the flyout.
- Strings are overridable through `messages` ([ADR 0014](0014-overridable-strings-through-a-messages-prop.md)).
- Accessibility fixes: headings, `aria-expanded` on the trigger, focus returned to the trigger on Escape and click-outside too (upstream does it on Clear and Filter), unique ids, and a result count announced.

## Options not chosen

- Checkbox-only fields, as in the old panel: no ranges, dates or exact values.
- A panel only inside DataGrid: standalone lists and forms lose it.
- Panel-wide search: it mixes groups; search stays per group.
- An overlay panel in DataGrid: it covers the rows being filtered.

## Consequences

- Breaking changes against the previous panel:
  - `FilterPanel` and `FilterFlyout` default to `updateMethod="batch"`; set `"instant"` to apply every change.
  - `FilterPanel` no longer shows selected-filter tags and Clear all; render `FilterSummary`. The messages `selectedFilters`, `removeFilter` and `clearAll` move to `FilterSummaryMessages` (`clearAll` becomes `clearFilters`, "Clear filters").
  - Groups are flat sections; set `layout="accordion"` for accordion items (`defaultOpen` applies only there).
  - The default title is "Filter" (was "Filters").
  - `FilterPanelValue` values are `FilterPanelFieldValue`, not only `string[]`; narrow by the group's variant.
  - `FilterPanelGroup` is a union type keyed by `variant`, no longer an interface, so it cannot be extended or merged.
  - The `FilterFlyout` trigger is an icon button with the count in its name; set `trigger="text"` for the "Filter (n)" button. Its content is up to 642 px wide in two columns.
  - `DataGrid` without `emptyState` shows `NoDataEmptyState` ("No results found") instead of "No rows to show" when a search or column filter leaves no rows; set `filteredEmptyState` or `emptyState` to replace it.
- Changes that break no input main accepted: `countFilterPanelSelections` counts each set non-option field as one.
- Each tanstack-carbon update is read and adapted by hand; nothing is pulled in automatically.
