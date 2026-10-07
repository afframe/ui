'use client';
// Every user-facing string of the data grid (ADR 0014).

/** What the next click on a sortable header does. */
export type DataGridSortAction = 'ascending' | 'descending' | 'none';

export interface DataGridMessages {
  /** Description of a sortable header's button: what clicking it does. */
  sortDescription: (header: string, next: DataGridSortAction) => string;
  /** Accessible name of the toolbar. */
  toolbarLabel: string;
  /** Label of the toolbar search field. */
  searchLabel: string;
  /** Label of the button that clears the search field. */
  searchClear: string;
  /** Placeholder of the toolbar search field. */
  searchPlaceholder: string;
  /** Pagination: label of the previous page button. */
  previousPage: string;
  /** Pagination: label of the next page button. */
  nextPage: string;
  /** Pagination: label of the page size select. */
  itemsPerPage: string;
  /** Pagination: the rows shown, such as "1–10 of 60 items". */
  itemRange: (min: number, max: number, total: number) => string;
  /** Pagination: text after the page select, such as "of 6 pages". */
  pageRange: (current: number, total: number) => string;
  /** Pagination: label of the page select. */
  pageSelectLabel: (total: number) => string;
  /** Selection: label of the select-all checkbox. */
  selectAll: string;
  /** Selection: label of a row's checkbox; `row` comes from `getRowLabel`. */
  selectRow: (row: string) => string;
  /** Batch actions: accessible name of the batch action bar. */
  batchActionsLabel: string;
  /** Batch actions: the cancel button, which clears the selection. */
  batchCancel: string;
  /** Batch actions: the button that selects every row. */
  batchSelectAll: (total: number) => string;
  /** Batch actions: how many rows are selected. */
  selectedCount: (count: number) => string;
  /** Row actions: hidden header text of the actions column. */
  rowActionsHeader: string;
  /** Row actions: label of a row's menu button; `row` comes from `getRowLabel`. */
  rowActions: (row: string) => string;
  /** Expansion: label of the header button that expands or collapses all rows. */
  expandAll: string;
  /** Expansion: label of a row's expand button; `row` comes from `getRowLabel`. */
  expandRow: (row: string) => string;
  /** Column customization: label of the toolbar button. */
  columnSettings: string;
  /** Column customization: legend of the column list. */
  columnSettingsLegend: string;
  /** Column customization: label of the button that moves a column up. */
  moveColumnUp: (column: string) => string;
  /** Column customization: label of the button that moves a column down. */
  moveColumnDown: (column: string) => string;
  /** Resizing: label of a header's resize handle. */
  resizeColumn: (column: string) => string;
  /** Inline edit: name of a cell's edit button and field. */
  editCell: (column: string, row: string) => string;
  /** Shown in the body when the table has no rows to show. */
  emptyState: string;
}

export const defaultDataGridMessages: DataGridMessages = {
  sortDescription: (header, next) =>
    next === 'none'
      ? `Click to remove sorting by ${header}`
      : `Click to sort rows by ${header} in ${next} order`,
  toolbarLabel: 'Table toolbar',
  searchLabel: 'Filter table',
  searchClear: 'Clear search input',
  searchPlaceholder: 'Filter table',
  previousPage: 'Previous page',
  nextPage: 'Next page',
  itemsPerPage: 'Items per page:',
  itemRange: (min, max, total) => `${min}–${max} of ${total} items`,
  pageRange: (_current, total) =>
    `of ${total} ${total === 1 ? 'page' : 'pages'}`,
  pageSelectLabel: (total) =>
    `Page of ${total} ${total === 1 ? 'page' : 'pages'}`,
  selectAll: 'Select all rows',
  selectRow: (row) => `Select row ${row}`,
  batchActionsLabel: 'Batch actions',
  batchCancel: 'Cancel',
  batchSelectAll: (total) => `Select all (${total})`,
  selectedCount: (count) =>
    `${count} ${count === 1 ? 'item' : 'items'} selected`,
  rowActionsHeader: 'Actions',
  rowActions: (row) => `Actions for row ${row}`,
  expandAll: 'Expand all rows',
  expandRow: (row) => `Expand row ${row}`,
  columnSettings: 'Customize columns',
  columnSettingsLegend: 'Shown columns',
  moveColumnUp: (column) => `Move ${column} up`,
  moveColumnDown: (column) => `Move ${column} down`,
  resizeColumn: (column) => `Resize ${column} column`,
  editCell: (column, row) => `Edit ${column} of row ${row}`,
  emptyState: 'No rows to show',
};
