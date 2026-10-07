'use client';
// Afframe data grid: TanStack Table state rendered with Carbon DataTable
// markup. Carbon parts come from @carbon/react directly: importing the
// package barrel here would be a cycle and would pull the other extras in.
import {
  FeatureFlags,
  MenuItem,
  OverflowMenu,
  Pagination,
  Table,
  TableBatchAction,
  TableBatchActions,
  TableBody,
  TableCell,
  TableContainer,
  TableExpandHeader,
  TableExpandRow,
  TableExpandedRow,
  TableHead,
  TableHeader,
  TableRow,
  TableSelectAll,
  TableSelectRow,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
} from '@carbon/react';
import {
  useTable,
  type Column,
  type ReactTable,
  type Row,
  type RowData,
  type StockFeatures,
  type TableFeatures,
  type TableOptions,
} from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  Fragment,
  useId,
  useLayoutEffect,
  useState,
  type ComponentType,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react';
import { resolveMessages } from '../../messages.js';
import { ColumnResizer } from './ColumnResizer.js';
import { ColumnSettings } from './ColumnSettings.js';
import { EditableCell } from './EditableCell.js';
import {
  defaultDataGridMessages,
  type DataGridMessages,
  type DataGridSortAction,
} from './messages.js';

/** A button in the batch action bar, shown while rows are selected. */
export interface DataGridBatchAction<TData extends RowData> {
  /** Stable key. */
  id: string;
  label: string;
  /** A Carbon icon, such as `TrashCan` from `@afframe/ui/icons`. */
  icon?: ElementType;
  /** Called with the selected rows' data. */
  onClick: (rows: TData[]) => void;
}

/** An item in a row's overflow menu. */
export interface DataGridRowAction<TData extends RowData> {
  /** Stable key. */
  id: string;
  label: string;
  /** Styles the item as destructive. */
  danger?: boolean;
  /** Called with the row's data. */
  onClick: (row: TData) => void;
}

/** Column meta read by the grid; register it with `dataGridInlineEdit`. */
export interface DataGridColumnMeta {
  /** The column's cells can be edited inline. */
  editable?: boolean;
}

/** A saved inline edit. */
export interface DataGridCellEdit<TData extends RowData> {
  row: TData;
  rowId: string;
  columnId: string;
  /** A number when the old value was a number, else the text typed. */
  value: string | number;
}

export interface DataGridProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
> {
  /** TanStack Table options: `features`, `columns`, `data` and any state. */
  options: TableOptions<TFeatures, TData>;
  /** Title above the table; also the table's accessible name. */
  title?: ReactNode;
  description?: ReactNode;
  /** Row height. */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  useZebraStyles?: boolean;
  /** Batch actions; they need `dataGridSelection`. */
  batchActions?: DataGridBatchAction<TData>[];
  /** Detail panel of an expanded row; needs `dataGridExpansion`. */
  renderExpandedRow?: (row: TData) => ReactNode;
  /**
   * Height limit of the table body, such as `'20rem'`; the rows scroll under
   * a sticky header.
   */
  maxHeight?: string;
  /**
   * Renders only the rows in view, for long lists. Needs `maxHeight`, which
   * sets the scrolling area.
   */
  virtualize?: boolean;
  /** Saves an inline edit of a column with `meta: { editable: true }`. */
  onCellEdit?: (edit: DataGridCellEdit<TData>) => void;
  /**
   * Names a row in labels such as "Select row ...". Default: the text of the
   * first shown cell, or the row id when that cell holds no text or number.
   */
  getRowLabel?: (row: TData) => string;
  /** Row actions, in an overflow menu at the end of each row. */
  rowActions?: DataGridRowAction<TData>[];
  /** Page sizes offered by the pagination bar. */
  pageSizes?: number[];
  messages?: Partial<DataGridMessages>;
  className?: string;
}

// Inside the grid every feature API is typed; each is used only after a
// check that its feature is registered.
type Grid<TData extends RowData> = ReactTable<StockFeatures, TData>;
type GridColumn<TData extends RowData> = Column<StockFeatures, TData>;
type GridRow<TData extends RowData> = Row<StockFeatures, TData>;

// The v12 overflow menu (rendered under the flag below) takes `label` and
// MenuItem children; Carbon's exported type describes the v11 one.
const RowMenu = OverflowMenu as unknown as ComponentType<{
  label: string;
  menuAlignment: 'bottom-end';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  children: ReactNode;
}>;

const initialRows = 20;
const always = () => true;
const rowHeights = { xs: 24, sm: 32, md: 40, lg: 48, xl: 64 } as const;

const defaultPageSizes = [10, 20, 50];
const carbonSort = { asc: 'ASC', desc: 'DESC' } as const;

/** The column's header text, for labels; falls back to its id. */
function columnLabel<TData extends RowData>(column: GridColumn<TData>): string {
  const { header } = column.columnDef;
  return typeof header === 'string' ? header : column.id;
}

/** A row's name for labels: the first shown cell's text value, else its id. */
function firstCellLabel<TData extends RowData>(
  row: GridRow<TData>,
  cells: { getValue: () => unknown }[]
): string {
  const value = cells[0]?.getValue();
  return typeof value === 'string' || typeof value === 'number'
    ? String(value)
    : row.id;
}

function nextSortAction<TData extends RowData>(
  column: GridColumn<TData>
): DataGridSortAction {
  const next = column.getNextSortingOrder();
  return next === 'asc' ? 'ascending' : next === 'desc' ? 'descending' : 'none';
}

export function DataGrid<
  TFeatures extends TableFeatures,
  TData extends RowData,
>({
  options,
  title,
  description,
  size,
  useZebraStyles,
  pageSizes = defaultPageSizes,
  batchActions,
  rowActions,
  renderExpandedRow,
  maxHeight,
  onCellEdit,
  getRowLabel,
  virtualize = false,
  messages,
  className,
}: DataGridProps<TFeatures, TData>) {
  const text = resolveMessages(defaultDataGridMessages, messages);
  // A detail panel can open on every row unless the app decides per row.
  const tableOptions =
    renderExpandedRow && !('getRowCanExpand' in options)
      ? { ...options, getRowCanExpand: always }
      : options;
  const table = useTable(tableOptions) as unknown as Grid<TData>;
  const id = useId();
  const has = (feature: keyof StockFeatures) => feature in table._features;
  const sorting = has('rowSortingFeature');
  // The bar needs rows to page: a paginated row model, or server paging.
  const paginating =
    has('rowPaginationFeature') &&
    ('paginatedRowModel' in table.options.features ||
      table.options.manualPagination === true);
  const filtering = has('globalFilteringFeature');
  const selecting = has('rowSelectionFeature');
  const batching = selecting && batchActions !== undefined;
  // Batch actions see the selected rows the filters show, as select-all does.
  const selected = selecting
    ? table.getFilteredSelectedRowModel().flatRows
    : [];
  const selectable = has('columnFilteringFeature')
    ? table.getFilteredRowModel().flatRows.length
    : table.getCoreRowModel().flatRows.length;
  const batchOpen = batching && selected.length > 0;
  const customizing = has('columnVisibilityFeature');
  const toolbar = filtering || batching || customizing;
  const acting = rowActions !== undefined && rowActions.length > 0;
  const menuSize = size === 'xl' ? 'lg' : size;
  const inputSize =
    size === 'xs' || size === 'sm' ? 'sm' : size === 'md' ? 'md' : 'lg';
  const visibility = has('columnVisibilityFeature');
  const pinning = has('columnPinningFeature');
  const columns = pinning
    ? [
        ...table.getStartVisibleLeafColumns(),
        ...table.getCenterVisibleLeafColumns(),
        ...table.getEndVisibleLeafColumns(),
      ]
    : visibility
      ? table.getVisibleLeafColumns()
      : table.getAllLeafColumns();
  const rows = table.getRowModel().rows;
  const cellsOf = (row: (typeof rows)[number]) =>
    pinning
      ? [
          ...row.getStartVisibleCells(),
          ...row.getCenterVisibleCells(),
          ...row.getEndVisibleCells(),
        ]
      : visibility
        ? row.getVisibleCells()
        : row.getAllCells();
  const expanding = has('rowExpandingFeature');
  const span =
    columns.length + Number(selecting) + Number(acting) + Number(expanding);
  const sizing = has('columnSizingFeature');
  const resizing = has('columnResizingFeature');
  const extras = span - columns.length;
  const pinnedStart = pinning && table.getIsSomeColumnsPinned('start');
  const pinnedEnd = pinning && table.getIsSomeColumnsPinned('end');
  // Expand and select columns stick too when columns are pinned at the start.
  const leading = Number(expanding) + Number(selecting);
  const sticky = (column: GridColumn<TData>) => {
    const side = pinning ? column.getIsPinned() : false;
    if (!side) return undefined;
    return side === 'start'
      ? {
          className: 'afframe-data-grid__sticky-start',
          offset: `calc(${leading * 3}rem + ${column.getStart('start')}px)`,
        }
      : {
          className: 'afframe-data-grid__sticky-end',
          offset: `calc(${Number(acting) * 3}rem + ${column.getAfter('end')}px)`,
        };
  };
  const stickyCell = (pin: ReturnType<typeof sticky>) =>
    pin && {
      className: pin.className,
      style: { '--afframe-data-grid-sticky': pin.offset } as CSSProperties,
    };
  const containerStyle = {
    ...(sizing && {
      '--afframe-data-grid-width': `calc(${table.getTotalSize()}px + ${extras * 3}rem)`,
    }),
    ...(pinnedStart && {
      '--afframe-data-grid-start': `calc(${leading * 3}rem + ${table.getStartTotalSize()}px)`,
      '--afframe-data-grid-select-start': `${Number(expanding) * 3}rem`,
    }),
    ...(maxHeight && { '--afframe-data-grid-max-height': maxHeight }),
  } as CSSProperties;
  // Virtualization: the scrolling element is Carbon's table content wrapper.
  const containerId = `${id}-grid`;
  const [scroller, setScroller] = useState<HTMLElement | null>(null);
  useLayoutEffect(() => {
    setScroller(
      document
        .getElementById(containerId)
        ?.querySelector<HTMLElement>('.cds--data-table-content') ?? null
    );
  }, [containerId]);
  // A detail panel is not part of its row's measured size, so a grid with
  // `renderExpandedRow` is not virtualized.
  const virtual =
    virtualize && maxHeight !== undefined && renderExpandedRow === undefined;
  const headerRows = table.getHeaderGroups().length;
  const estimate = rowHeights[size ?? 'lg'];
  const virtualizer = useVirtualizer({
    count: virtual ? rows.length : 0,
    getScrollElement: () => scroller,
    estimateSize: () => estimate,
    overscan: 8,
  });
  const items = virtualizer.getVirtualItems();
  // Before the scroller is known (server render, first client render) the
  // first rows render, so the HTML is not empty.
  const measuring = virtual && scroller !== null;
  const windowRows = !virtual
    ? rows.map((row, index) => ({ row, index }))
    : measuring
      ? items.flatMap(({ index }) => {
          const row = rows[index];
          return row ? [{ row, index }] : [];
        })
      : rows.slice(0, initialRows).map((row, index) => ({ row, index }));
  const before = measuring ? (items[0]?.start ?? 0) : 0;
  const after = !virtual
    ? 0
    : measuring
      ? virtualizer.getTotalSize() - (items.at(-1)?.end ?? 0)
      : (rows.length - windowRows.length) * estimate;
  // Rendered rows are measured, so wrapped and nested rows keep their size;
  // indices count the header rows (ARIA rows start at 1).
  const position = (index: number) =>
    virtual
      ? {
          'aria-rowindex': index + headerRows + 1,
          'data-index': index,
          ref: virtualizer.measureElement,
        }
      : {};
  const spacer = (height: number) =>
    height > 0 && (
      <tr
        aria-hidden="true"
        className="afframe-data-grid__spacer"
        style={{ blockSize: height }}>
        <td colSpan={span} />
      </tr>
    );
  const rowLabel = (row: GridRow<TData>) =>
    getRowLabel ? getRowLabel(row.original) : firstCellLabel(row, cellsOf(row));
  const lastGroup = table.getHeaderGroups().length - 1;

  return (
    <TableContainer
      id={containerId}
      title={title}
      description={description}
      style={containerStyle}
      className={[
        'afframe-data-grid',
        sizing && 'afframe-data-grid--sized',
        maxHeight && 'afframe-data-grid--sticky-header',
        pinnedStart && 'afframe-data-grid--pinned-start',
        pinnedEnd && 'afframe-data-grid--pinned-end',
        className,
      ]
        .filter(Boolean)
        .join(' ')}>
      {toolbar && (
        <TableToolbar aria-label={text.toolbarLabel}>
          {batching && (
            <TableBatchActions
              aria-label={text.batchActionsLabel}
              shouldShowBatchActions={batchOpen}
              totalSelected={selected.length}
              totalCount={selectable}
              onCancel={() => table.resetRowSelection(true)}
              onSelectAll={() => table.toggleAllRowsSelected(true)}
              translateWithId={(messageId, args) =>
                messageId === 'carbon.table.batch.cancel'
                  ? text.batchCancel
                  : messageId === 'carbon.table.batch.selectAll'
                    ? text.batchSelectAll(args?.totalCount ?? 0)
                    : text.selectedCount(args?.totalSelected ?? 0)
              }>
              {batchActions.map((action) => (
                <TableBatchAction
                  key={action.id}
                  tabIndex={batchOpen ? 0 : -1}
                  {...(action.icon && { renderIcon: action.icon })}
                  onClick={() =>
                    action.onClick(selected.map((row) => row.original))
                  }>
                  {action.label}
                </TableBatchAction>
              ))}
            </TableBatchActions>
          )}
          <TableToolbarContent aria-hidden={batchOpen} inert={batchOpen}>
            {filtering && (
              <TableToolbarSearch
                persistent
                labelText={text.searchLabel}
                closeButtonLabelText={text.searchClear}
                placeholder={text.searchPlaceholder}
                value={String(table.state.globalFilter ?? '')}
                onChange={(_event, value) => table.setGlobalFilter(value ?? '')}
              />
            )}
            {customizing && (
              <ColumnSettings table={table} text={text} label={columnLabel} />
            )}
          </TableToolbarContent>
        </TableToolbar>
      )}
      <Table
        {...(size && { size })}
        useZebraStyles={useZebraStyles ?? false}
        isSortable={sorting}
        {...(virtual && { 'aria-rowcount': rows.length + headerRows })}>
        {sizing && (
          <colgroup>
            {expanding && <col className="afframe-data-grid__control" />}
            {selecting && <col className="afframe-data-grid__control" />}
            {columns.map((column) => (
              <col key={column.id} style={{ inlineSize: column.getSize() }} />
            ))}
            {acting && <col className="afframe-data-grid__control" />}
          </colgroup>
        )}
        <TableHead>
          {table.getHeaderGroups().map((group, depth) => (
            <TableRow
              key={group.id}
              {...(virtual && { 'aria-rowindex': depth + 1 })}>
              {expanding &&
                (depth === lastGroup ? (
                  <TableExpandHeader
                    id={`${id}-expand`}
                    enableToggle
                    aria-label={text.expandAll}
                    isExpanded={table.getIsAllRowsExpanded()}
                    onExpand={() => table.toggleAllRowsExpanded()}
                  />
                ) : (
                  <TableHeader />
                ))}
              {selecting &&
                (depth === lastGroup ? (
                  <TableSelectAll
                    id={`${id}-select-all`}
                    name={`${id}-select`}
                    aria-label={text.selectAll}
                    checked={table.getIsAllRowsSelected()}
                    indeterminate={
                      table.getIsSomeRowsSelected() &&
                      !table.getIsAllRowsSelected()
                    }
                    onSelect={() => table.toggleAllRowsSelected()}
                  />
                ) : (
                  <TableHeader />
                ))}
              {group.headers.map((header) => {
                const { column } = header;
                const sortable = sorting && column.getCanSort();
                const sorted = sortable ? column.getIsSorted() : false;
                const pin = sticky(column);
                return (
                  <TableHeader
                    key={header.id}
                    {...(pin && {
                      className: pin.className,
                      // Carbon passes `style` to the sort button, not the th.
                      ref: (th: HTMLTableCellElement | null) =>
                        th?.style.setProperty(
                          '--afframe-data-grid-sticky',
                          pin.offset
                        ),
                    })}
                    colSpan={header.colSpan}
                    isSortable={sortable}
                    isSortHeader={sorted !== false}
                    sortDirection={sorted ? carbonSort[sorted] : 'NONE'}
                    {...(sortable && {
                      onClick: (event) =>
                        column.getToggleSortingHandler()?.(event),
                    })}
                    translateWithId={() =>
                      text.sortDescription(
                        columnLabel(column),
                        nextSortAction(column)
                      )
                    }
                    {...(resizing &&
                      column.getCanResize() &&
                      !header.isPlaceholder && {
                        decorator: (
                          <ColumnResizer
                            header={header}
                            label={text.resizeColumn(columnLabel(column))}
                          />
                        ),
                      })}>
                    {header.isPlaceholder ? null : (
                      <table.FlexRender header={header} />
                    )}
                  </TableHeader>
                );
              })}
              {acting && (
                <TableHeader className="cds--table-column-menu">
                  {depth === lastGroup && (
                    <span className="cds--visually-hidden">
                      {text.rowActionsHeader}
                    </span>
                  )}
                </TableHeader>
              )}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {spacer(before)}
          {windowRows.map(({ row, index }) => {
            const cells = (
              <>
                {selecting && (
                  <TableSelectRow
                    id={`${id}-select-${row.id}`}
                    name={`${id}-select`}
                    aria-label={text.selectRow(rowLabel(row))}
                    checked={row.getIsSelected()}
                    disabled={!row.getCanSelect()}
                    onSelect={() => row.toggleSelected()}
                  />
                )}
                {cellsOf(row).map((cell, index) => (
                  <TableCell key={cell.id} {...stickyCell(sticky(cell.column))}>
                    {onCellEdit &&
                    (
                      cell.column.columnDef.meta as
                        DataGridColumnMeta | undefined
                    )?.editable ? (
                      <EditableCell
                        value={cell.getValue()}
                        label={text.editCell(
                          columnLabel(cell.column),
                          rowLabel(row)
                        )}
                        size={inputSize}
                        onSave={(value) =>
                          onCellEdit({
                            row: row.original,
                            rowId: row.id,
                            columnId: cell.column.id,
                            value,
                          })
                        }>
                        <table.FlexRender cell={cell} />
                      </EditableCell>
                    ) : index === 0 && row.depth > 0 ? (
                      // Nested rows: the first cell is indented by depth.
                      <span
                        className="afframe-data-grid__nested"
                        style={
                          {
                            '--afframe-data-grid-depth': row.depth,
                          } as CSSProperties
                        }>
                        <table.FlexRender cell={cell} />
                      </span>
                    ) : (
                      <table.FlexRender cell={cell} />
                    )}
                  </TableCell>
                ))}
                {acting && (
                  <TableCell className="cds--table-column-menu">
                    {/* The v12 overflow menu everywhere, whatever the app's flags. */}
                    <FeatureFlags enableV12Overflowmenu>
                      <RowMenu
                        label={text.rowActions(rowLabel(row))}
                        menuAlignment="bottom-end"
                        {...(menuSize && { size: menuSize })}>
                        {rowActions.map((action) => (
                          <MenuItem
                            key={action.id}
                            label={action.label}
                            kind={action.danger ? 'danger' : 'default'}
                            onClick={() => action.onClick(row.original)}
                          />
                        ))}
                      </RowMenu>
                    </FeatureFlags>
                  </TableCell>
                )}
              </>
            );
            const isSelected = selecting && row.getIsSelected();
            if (!expanding)
              return (
                <TableRow
                  key={row.id}
                  isSelected={isSelected}
                  {...position(index)}>
                  {cells}
                </TableRow>
              );
            // Nested rows: a row without children keeps an empty expand cell.
            if (!renderExpandedRow && !row.getCanExpand())
              return (
                <TableRow
                  key={row.id}
                  isSelected={isSelected}
                  {...position(index)}>
                  <TableCell className="cds--table-expand" />
                  {cells}
                </TableRow>
              );
            const detailId = `${id}-detail-${row.id}`;
            const open = row.getIsExpanded();
            return (
              <Fragment key={row.id}>
                <TableExpandRow
                  aria-label={text.expandRow(rowLabel(row))}
                  {...(renderExpandedRow && { 'aria-controls': detailId })}
                  expandHeader={`${id}-expand`}
                  isExpanded={open}
                  isSelected={isSelected}
                  {...position(index)}
                  onExpand={() => row.toggleExpanded()}>
                  {cells}
                </TableExpandRow>
                {open && renderExpandedRow && (
                  <TableExpandedRow id={detailId} colSpan={span}>
                    {renderExpandedRow(row.original)}
                  </TableExpandedRow>
                )}
              </Fragment>
            );
          })}
          {spacer(after)}
          {rows.length === 0 && (
            <TableRow>
              <TableCell colSpan={span}>{text.emptyState}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {paginating && (
        <Pagination
          page={table.state.pagination.pageIndex + 1}
          pageSize={table.state.pagination.pageSize}
          pageSizes={pageSizes}
          totalItems={table.getRowCount()}
          backwardText={text.previousPage}
          forwardText={text.nextPage}
          itemsPerPageText={text.itemsPerPage}
          itemRangeText={text.itemRange}
          pageRangeText={text.pageRange}
          pageSelectLabelText={text.pageSelectLabel}
          onChange={({ page, pageSize }) =>
            table.setPagination({ pageIndex: page - 1, pageSize })
          }
        />
      )}
    </TableContainer>
  );
}
