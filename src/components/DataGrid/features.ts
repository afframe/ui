'use client';
// Feature fragments: an app opts into a data grid feature by spreading its
// fragment into TanStack's `tableFeatures({ ... })`. The grid shows the UI of
// each registered feature and nothing else.
import {
  columnFilteringFeature,
  columnOrderingFeature,
  columnPinningFeature,
  columnResizingFeature,
  columnSizingFeature,
  columnVisibilityFeature,
  createExpandedRowModel,
  createFilteredRowModel,
  createPaginatedRowModel,
  createSortedRowModel,
  filterFn_arrIncludesSome,
  filterFn_equals,
  filterFn_equalsString,
  filterFn_inNumberRange,
  filterFn_includesString,
  filterFn_lessThanOrEqualTo,
  filterFn_weakEquals,
  globalFilteringFeature,
  metaHelper,
  rowExpandingFeature,
  rowPaginationFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
} from '@tanstack/react-table';
import type { DataGridColumnMeta } from './DataGrid.js';
import { filterFn_inDayRange, filterFn_inOptions } from './filterFns.js';

/** Sortable headers: click or Enter cycles ascending, descending, none. */
export const dataGridSorting = {
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
    basic: sortFn_basic,
    datetime: sortFn_datetime,
    text: sortFn_text,
  },
};

// One row model and one set of filter functions for both filtering fragments:
// spreading two different `filterFns` objects would let the second win.
const filteredRowModel = createFilteredRowModel();
const filterFns = {
  arrIncludesSome: filterFn_arrIncludesSome,
  equals: filterFn_equals,
  equalsString: filterFn_equalsString,
  inNumberRange: filterFn_inNumberRange,
  includesString: filterFn_includesString,
  weakEquals: filterFn_weakEquals,
  lessThanOrEqualTo: filterFn_lessThanOrEqualTo,
  inOptions: filterFn_inOptions,
  inDayRange: filterFn_inDayRange,
};

/**
 * Filtering: a search field in the toolbar filters every column
 * (`globalFilter`); column filters (`columnFilters`) narrow single columns.
 */
export const dataGridFiltering = {
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel,
  filterFns,
};

/**
 * Filter panel: a toolbar button opens a panel beside the table with a field
 * per column that has `meta: { filter }`; it sets `columnFilters`. Combine
 * with `dataGridFiltering` for a search field too.
 */
export const dataGridFilterPanel = {
  columnFilteringFeature,
  filteredRowModel,
  filterFns,
  columnMeta: metaHelper<DataGridColumnMeta>(),
};

/** Pagination: Carbon's pagination bar under the table. */
export const dataGridPagination = {
  rowPaginationFeature,
  paginatedRowModel: createPaginatedRowModel(),
};

/** Selection: a checkbox per row and a select-all checkbox in the header. */
export const dataGridSelection = { rowSelectionFeature };

/**
 * Expansion: an expand button per row. With `renderExpandedRow` it opens a
 * detail panel; with `getSubRows` it shows nested rows.
 */
export const dataGridExpansion = {
  rowExpandingFeature,
  expandedRowModel: createExpandedRowModel(),
};

/** Column customization: a toolbar popover to show, hide and reorder columns. */
export const dataGridColumnCustomization = {
  columnVisibilityFeature,
  columnOrderingFeature,
};

/** Resizing: a drag and keyboard handle at the end of each header. */
export const dataGridResizing = {
  columnSizingFeature,
  columnResizingFeature,
};

/**
 * Sticky columns: columns pinned with `columnPinning` state (`start` or
 * `end`) stay in view while the table scrolls sideways.
 */
export const dataGridStickyColumns = {
  columnSizingFeature,
  columnPinningFeature,
};

/**
 * Column meta: types the column `meta` keys `editable` and `align`; it adds no
 * UI on its own. Register it for grids that only use `meta.align`.
 */
export const dataGridColumnMeta = {
  columnMeta: metaHelper<DataGridColumnMeta>(),
};

/**
 * Inline edit: the `dataGridColumnMeta` fragment, named for grids with
 * editable columns. Columns with `meta: { editable: true }` get an edit
 * button, and the grid saves edits through `onCellEdit`.
 */
export const dataGridInlineEdit = dataGridColumnMeta;
