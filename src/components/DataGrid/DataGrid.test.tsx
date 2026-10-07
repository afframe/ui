import { createColumnHelper, tableFeatures } from '@tanstack/react-table';
import { render, screen, within } from '@testing-library/react';
import { useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { DataGrid } from './DataGrid.js';
import {
  dataGridColumnCustomization,
  dataGridExpansion,
  dataGridFiltering,
  dataGridInlineEdit,
  dataGridPagination,
  dataGridResizing,
  dataGridSelection,
  dataGridSorting,
  dataGridStickyColumns,
} from './features.js';
import { invoices, manyInvoices, nestedInvoices } from './fixtures.js';

const sortFeatures = tableFeatures({ ...dataGridSorting });
const sortHelper = createColumnHelper<
  typeof sortFeatures,
  (typeof invoices)[number]
>();
const sortColumns = sortHelper.columns([
  sortHelper.accessor('number', { header: 'Number' }),
  sortHelper.accessor('customer', { header: 'Customer' }),
  sortHelper.accessor('amount', { header: 'Amount', sortDescFirst: false }),
]);
const few = invoices.slice(0, 5);

/** A Carbon icon button, named by its tooltip (aria-labelledby). */
function iconButton(name: string): HTMLButtonElement {
  const tooltip = screen.getByText(name, { selector: '[role="tooltip"] *' });
  const id = tooltip.closest('[role="tooltip"]')?.id;
  const button = document.querySelector(`button[aria-labelledby="${id}"]`);
  if (!(button instanceof HTMLButtonElement)) throw new Error(name);
  return button;
}

const firstColumn = (index: number) =>
  screen
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('cell')[index]?.textContent);

test('sorts by a header with click and keyboard, and sets aria-sort', async () => {
  render(
    <DataGrid
      title="Invoices"
      options={{ features: sortFeatures, columns: sortColumns, data: few }}
    />
  );
  const amount = screen.getByRole('columnheader', { name: /Amount/ });
  expect(amount.getAttribute('aria-sort')).toBe('none');
  await userEvent.click(within(amount).getByRole('button'));
  expect(amount.getAttribute('aria-sort')).toBe('ascending');
  const ascending = firstColumn(2).map(Number);
  expect(ascending).toEqual([...ascending].sort((a, b) => a - b));
  await userEvent.keyboard('{Enter}');
  expect(amount.getAttribute('aria-sort')).toBe('descending');
  await userEvent.keyboard('{Enter}');
  expect(amount.getAttribute('aria-sort')).toBe('none');
  // Shift adds a second sort.
  const customer = screen.getByRole('columnheader', { name: /Customer/ });
  await userEvent.click(within(customer).getByRole('button'));
  await userEvent.click(within(amount).getByRole('button'), {
    modifiers: ['Shift'],
  });
  expect(customer.getAttribute('aria-sort')).toBe('ascending');
  expect(amount.getAttribute('aria-sort')).toBe('ascending');
});

test('describes the next sort action from messages', () => {
  render(
    <DataGrid
      options={{ features: sortFeatures, columns: sortColumns, data: few }}
      messages={{ sortDescription: (header, next) => `${header}:${next}` }}
    />
  );
  expect(screen.getByText('Number:ascending')).toBeTruthy();
});

test('shows the empty state', () => {
  render(
    <DataGrid
      options={{ features: sortFeatures, columns: sortColumns, data: [] }}
      messages={{ emptyState: 'Nothing here' }}
    />
  );
  expect(screen.getByText('Nothing here')).toBeTruthy();
});

const filterFeatures = tableFeatures({ ...dataGridFiltering });
const filterHelper = createColumnHelper<
  typeof filterFeatures,
  (typeof invoices)[number]
>();
const filterColumns = filterHelper.columns([
  filterHelper.accessor('number', { header: 'Number' }),
  filterHelper.accessor('customer', { header: 'Customer' }),
]);

test('filters rows from the toolbar search and shows the empty state', async () => {
  render(
    <DataGrid
      options={{ features: filterFeatures, columns: filterColumns, data: few }}
    />
  );
  expect(screen.getByRole('group', { name: 'Table toolbar' })).toBeTruthy();
  const search = screen.getByRole('searchbox', { name: 'Filter table' });
  await userEvent.type(search, 'cedar');
  expect(screen.getAllByRole('row')).toHaveLength(2);
  expect(screen.getByText('Cedar Foods')).toBeTruthy();
  await userEvent.type(search, 'zzz');
  expect(screen.getByText('No rows to show')).toBeTruthy();
  await userEvent.keyboard('{Escape}');
  expect(screen.getAllByRole('row')).toHaveLength(6);
});

test('applies column filters from state', () => {
  render(
    <DataGrid
      options={{
        features: filterFeatures,
        columns: filterColumns,
        data: few,
        initialState: {
          columnFilters: [{ id: 'customer', value: 'Alder' }],
        },
      }}
    />
  );
  expect(screen.getAllByRole('row')).toHaveLength(2);
});

const pageFeatures = tableFeatures({ ...dataGridPagination });
const pageHelper = createColumnHelper<
  typeof pageFeatures,
  (typeof invoices)[number]
>();
const pageColumns = pageHelper.columns([
  pageHelper.accessor('number', { header: 'Number' }),
]);

test('pages through rows with the Carbon pagination bar', async () => {
  render(
    <DataGrid
      options={{ features: pageFeatures, columns: pageColumns, data: invoices }}
      messages={{ nextPage: 'Forward' }}
    />
  );
  expect(screen.getAllByRole('row')).toHaveLength(11);
  expect(screen.getByText('1–10 of 60 items')).toBeTruthy();
  const previous = document.querySelector('button[aria-label="Previous page"]');
  expect(previous?.hasAttribute('disabled')).toBe(true);
  // Carbon names the icon button through its tooltip; find it by aria-label.
  const forward = document.querySelector('button[aria-label="Forward"]');
  if (!(forward instanceof HTMLButtonElement)) throw new Error('no button');
  await userEvent.click(forward);
  expect(screen.getByText('11–20 of 60 items')).toBeTruthy();
  expect(screen.getByText('2026-0011')).toBeTruthy();
  await userEvent.selectOptions(
    screen.getByRole('combobox', { name: /Items per page/ }),
    '20'
  );
  expect(screen.getAllByRole('row')).toHaveLength(21);
  await userEvent.selectOptions(
    screen.getByRole('combobox', { name: /Page of/ }),
    '3'
  );
  expect(
    document
      .querySelector('button[aria-label="Forward"]')
      ?.hasAttribute('disabled')
  ).toBe(true);
});

const selectFeatures = tableFeatures({ ...dataGridSelection });
const selectHelper = createColumnHelper<
  typeof selectFeatures,
  (typeof invoices)[number]
>();
const selectColumns = selectHelper.columns([
  selectHelper.accessor('number', { header: 'Number' }),
]);

test('selects rows with Space and all rows with the header checkbox', async () => {
  render(
    <DataGrid
      size="xs"
      options={{
        features: selectFeatures,
        columns: selectColumns,
        data: few,
        getRowId: (row) => row.id,
      }}
    />
  );
  const first = screen.getByRole('checkbox', { name: 'Select row 2026-0001' });
  first.focus();
  await userEvent.keyboard(' ');
  expect((first as HTMLInputElement).checked).toBe(true);
  expect(first.closest('tr')?.className).toContain('cds--data-table--selected');
  const all = screen.getByRole('checkbox', {
    name: 'Select all rows',
  }) as HTMLInputElement;
  expect(all.indeterminate).toBe(true);
  const allLabel = all.parentElement?.querySelector('label');
  if (!allLabel) throw new Error('no label');
  // The input is visually hidden; its label is the click target.
  await userEvent.click(allLabel);
  const box = allLabel.getBoundingClientRect();
  expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(24);
  expect(
    screen
      .getAllByRole('checkbox')
      .every((box) => (box as HTMLInputElement).checked)
  ).toBe(true);
});

test('runs a batch action on the selected rows and cancels with the keyboard', async () => {
  const onDelete = vi.fn();
  render(
    <DataGrid
      options={{
        features: selectFeatures,
        columns: selectColumns,
        data: few,
        getRowId: (row) => row.id,
      }}
      batchActions={[{ id: 'delete', label: 'Delete', onClick: onDelete }]}
      messages={{ selectedCount: (count) => `${count} chosen` }}
    />
  );
  const bar = screen.getByLabelText('Batch actions', { selector: 'div' });
  expect(bar.getAttribute('aria-hidden')).toBe('true');
  screen.getByRole('checkbox', { name: 'Select row 2026-0002' }).focus();
  await userEvent.keyboard(' ');
  expect(bar.getAttribute('aria-hidden')).toBe('false');
  expect(screen.getByText('1 chosen')).toBeTruthy();
  await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
  expect(onDelete).toHaveBeenCalledWith([few[1]]);
  await userEvent.click(screen.getByRole('button', { name: 'Select all (5)' }));
  expect(screen.getByText('5 chosen')).toBeTruthy();
  screen.getByRole('button', { name: 'Cancel' }).focus();
  await userEvent.keyboard('{Enter}');
  expect(bar.getAttribute('aria-hidden')).toBe('true');
  expect(screen.queryAllByRole('checkbox', { checked: true })).toHaveLength(0);
});

test('opens a row action menu with the keyboard and runs an action', async () => {
  const onEdit = vi.fn();
  render(
    <DataGrid
      options={{ features: sortFeatures, columns: sortColumns, data: few }}
      rowActions={[
        { id: 'edit', label: 'Edit', onClick: onEdit },
        { id: 'delete', label: 'Delete', danger: true, onClick: vi.fn() },
      ]}
    />
  );
  expect(screen.getByRole('columnheader', { name: 'Actions' })).toBeTruthy();
  const trigger = iconButton('Actions for row 2026-0003');
  trigger.focus();
  await userEvent.keyboard('{Enter}');
  const edit = await screen.findByRole('menuitem', { name: 'Edit' });
  expect(document.activeElement).toBe(edit);
  await userEvent.keyboard('{Escape}');
  expect(document.activeElement).toBe(trigger);
  await userEvent.keyboard(' ');
  await expect.poll(() => document.activeElement?.textContent).toBe('Edit');
  await userEvent.keyboard('{ArrowDown}');
  expect(document.activeElement?.textContent).toBe('Delete');
  await userEvent.keyboard('{ArrowUp}');
  await userEvent.keyboard('{Enter}');
  expect(onEdit).toHaveBeenCalledWith(few[2]);
});

const expandFeatures = tableFeatures({ ...dataGridExpansion });
const expandHelper = createColumnHelper<
  typeof expandFeatures,
  (typeof invoices)[number]
>();
const expandColumns = expandHelper.columns([
  expandHelper.accessor('number', { header: 'Number' }),
]);

test('opens a detail panel with the keyboard', async () => {
  render(
    <DataGrid
      options={{ features: expandFeatures, columns: expandColumns, data: few }}
      renderExpandedRow={(invoice) => <p>Detail of {invoice.customer}</p>}
    />
  );
  const button = screen.getByRole('button', { name: 'Expand row 2026-0002' });
  expect(button.getAttribute('aria-expanded')).toBe('false');
  button.focus();
  await userEvent.keyboard('{Enter}');
  expect(button.getAttribute('aria-expanded')).toBe('true');
  const detail = screen.getByText('Detail of Fir Consulting');
  expect(detail.closest('tr')?.id).toBe(button.getAttribute('aria-controls'));
  await userEvent.click(
    screen.getByRole('button', { name: 'Expand all rows' })
  );
  expect(screen.getAllByText(/Detail of/)).toHaveLength(5);
});

const customFeatures = tableFeatures({ ...dataGridColumnCustomization });
const customHelper = createColumnHelper<
  typeof customFeatures,
  (typeof invoices)[number]
>();
const customColumns = customHelper.columns([
  customHelper.accessor('number', { header: 'Number' }),
  customHelper.accessor('customer', { header: 'Customer' }),
  customHelper.accessor('amount', { header: 'Amount' }),
]);
const headerNames = () =>
  screen.getAllByRole('columnheader').map((header) => header.textContent);

test('hides and reorders columns from the toolbar with the keyboard', async () => {
  render(
    <DataGrid
      options={{ features: customFeatures, columns: customColumns, data: few }}
    />
  );
  const trigger = iconButton('Customize columns');
  trigger.focus();
  await userEvent.keyboard('{Enter}');
  expect(trigger.getAttribute('aria-expanded')).toBe('true');
  const customer = screen.getByRole('checkbox', { name: 'Customer' });
  customer.focus();
  await userEvent.keyboard(' ');
  expect(headerNames()).toEqual(['Number', 'Amount']);
  iconButton('Move Amount up').focus();
  await userEvent.keyboard('{Enter}');
  expect(document.activeElement).toBe(iconButton('Move Amount up'));
  await userEvent.keyboard('{Enter}');
  expect(headerNames()).toEqual(['Amount', 'Number']);
  // Amount is first now: focus moved to its enabled "down" button.
  expect(document.activeElement).toBe(iconButton('Move Amount down'));
  await userEvent.keyboard('{Escape}');
  expect(trigger.getAttribute('aria-expanded')).toBe('false');
  expect(document.activeElement).toBe(trigger);
});

const sizeFeatures = tableFeatures({ ...dataGridSorting, ...dataGridResizing });
const sizeHelper = createColumnHelper<
  typeof sizeFeatures,
  (typeof invoices)[number]
>();
const sizeColumns = sizeHelper.columns([
  sizeHelper.accessor('number', { header: 'Number', size: 160 }),
  sizeHelper.accessor('customer', { header: 'Customer', size: 200 }),
]);

test('resizes a column with the arrow keys and a pointer drag', async () => {
  render(
    <DataGrid
      options={{ features: sizeFeatures, columns: sizeColumns, data: few }}
    />
  );
  const handle = screen.getByRole('separator', {
    name: 'Resize Number column',
  });
  const header = screen.getByRole('columnheader', { name: /Number/ });
  expect(header.getBoundingClientRect().width).toBeCloseTo(160, 0);
  handle.focus();
  await userEvent.keyboard('{ArrowRight}{ArrowRight}');
  expect(handle.getAttribute('aria-valuenow')).toBe('192');
  expect(header.getBoundingClientRect().width).toBeCloseTo(192, 0);
  await userEvent.keyboard('{End}');
  expect(handle.getAttribute('aria-valuenow')).toBe('1200');
  await userEvent.keyboard('{Home}');
  expect(handle.getAttribute('aria-valuenow')).toBe('48');
  handle.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
  await expect.poll(() => handle.getAttribute('aria-valuenow')).toBe('160');
  handle.focus();
  await userEvent.keyboard('{Home}');
  // Keys on the handle do not sort the column.
  expect(header.getAttribute('aria-sort')).toBe('none');
  const box = handle.getBoundingClientRect();
  const x = box.left + box.width / 2;
  const y = box.top + box.height / 2;
  handle.dispatchEvent(
    new MouseEvent('mousedown', { bubbles: true, clientX: x, clientY: y })
  );
  document.dispatchEvent(
    new MouseEvent('mousemove', { bubbles: true, clientX: x + 100, clientY: y })
  );
  document.dispatchEvent(
    new MouseEvent('mouseup', { bubbles: true, clientX: x + 100, clientY: y })
  );
  await expect.poll(() => handle.getAttribute('aria-valuenow')).toBe('148');
});

const stickyFeatures = tableFeatures({ ...dataGridStickyColumns });
const stickyHelper = createColumnHelper<
  typeof stickyFeatures,
  (typeof invoices)[number]
>();
const stickyColumns = stickyHelper.columns([
  stickyHelper.accessor('customer', { header: 'Customer', size: 400 }),
  stickyHelper.accessor('number', { header: 'Number', size: 400 }),
  stickyHelper.accessor('amount', { header: 'Amount', size: 400 }),
]);

test('keeps pinned columns and the header in view while scrolling', () => {
  render(
    <DataGrid
      maxHeight="10rem"
      options={{
        features: stickyFeatures,
        columns: stickyColumns,
        data: invoices,
        initialState: { columnPinning: { start: ['number'], end: [] } },
      }}
    />
  );
  // The pinned column moves to the start.
  expect(headerNames()).toEqual(['Number', 'Customer', 'Amount']);
  const pinned = screen.getByText('2026-0001');
  const header = screen.getByRole('columnheader', { name: 'Number' });
  const before = [pinned, header].map((el) => el.getBoundingClientRect());
  const scroller = document.querySelector('.cds--data-table-content');
  scroller?.scrollTo({ left: 300, top: 0 });
  expect(pinned.getBoundingClientRect().left).toBe(before[0]?.left);
  scroller?.scrollTo({ left: 300, top: 200 });
  expect(header.getBoundingClientRect().top).toBe(before[1]?.top);
  // Pinned cells are opaque, so scrolled cells do not show through.
  const td = pinned.closest('td');
  if (!td) throw new Error('no cell');
  expect(getComputedStyle(td).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
});

test('shows nested rows under their parent with the keyboard', async () => {
  render(
    <DataGrid
      options={{
        features: expandFeatures,
        columns: expandColumns,
        data: nestedInvoices,
        getSubRows: (row) => row.lines,
      }}
    />
  );
  expect(screen.getAllByRole('row')).toHaveLength(5);
  const button = screen.getByRole('button', { name: 'Expand row 2026-0002' });
  button.focus();
  await userEvent.keyboard('{Enter}');
  expect(button.getAttribute('aria-expanded')).toBe('true');
  const rows = screen.getAllByRole('row').map((row) => row.textContent);
  expect(rows.slice(2, 5)).toEqual([
    '2026-0002',
    'CN-2026-0043',
    'CN-2026-0044',
  ]);
  // Children have no expand button and are indented.
  const child = screen.getByText('CN-2026-0043');
  expect(child.closest('tr')?.querySelector('button')).toBeNull();
  expect(getComputedStyle(child).paddingInlineStart).toBe('24px');
});

const editFeatures = tableFeatures({ ...dataGridInlineEdit });
const editHelper = createColumnHelper<
  typeof editFeatures,
  (typeof invoices)[number]
>();
const editColumns = editHelper.columns([
  editHelper.accessor('number', { header: 'Number' }),
  editHelper.accessor('amount', { header: 'Amount', meta: { editable: true } }),
]);

test('edits a cell with the keyboard: Enter saves, Escape cancels', async () => {
  const onCellEdit = vi.fn();
  render(
    <DataGrid
      options={{ features: editFeatures, columns: editColumns, data: few }}
      onCellEdit={onCellEdit}
    />
  );
  const edit = iconButton('Edit Amount of row 2026-0002');
  edit.focus();
  await userEvent.keyboard('{Enter}');
  const field = screen.getByRole('spinbutton', {
    name: 'Edit Amount of row 2026-0002',
  });
  expect(document.activeElement).toBe(field);
  await userEvent.keyboard('{Escape}');
  expect(onCellEdit).not.toHaveBeenCalled();
  expect(document.activeElement).toBe(
    iconButton('Edit Amount of row 2026-0002')
  );
  await userEvent.keyboard('{Enter}');
  await userEvent.clear(document.activeElement as HTMLInputElement);
  await userEvent.keyboard('1234{Enter}');
  expect(onCellEdit).toHaveBeenCalledWith({
    row: few[1],
    rowId: '1',
    columnId: 'amount',
    value: 1234,
  });
  expect(document.activeElement).toBe(
    iconButton('Edit Amount of row 2026-0002')
  );
});

test('renders only the rows in view and keeps the row count', async () => {
  render(
    <DataGrid
      maxHeight="20rem"
      virtualize
      options={{
        features: sortFeatures,
        columns: sortColumns,
        data: manyInvoices,
      }}
    />
  );
  const table = screen.getByRole('table');
  expect(table.getAttribute('aria-rowcount')).toBe('1001');
  await expect.poll(() => screen.getAllByRole('row').length).toBeGreaterThan(3);
  expect(screen.getAllByRole('row').length).toBeLessThan(40);
  const scroller = document.querySelector('.cds--data-table-content');
  scroller?.scrollTo({ top: 48 * 500 });
  await expect.poll(() => screen.queryByText('2026-0505')).toBeTruthy();
  expect(screen.queryByText('2026-0001')).toBeNull();
  const row = screen.getByText('2026-0505').closest('tr');
  expect(row?.getAttribute('aria-rowindex')).toBe('506');
  // Sorting reorders all 1,000 rows, not just the rendered ones.
  scroller?.scrollTo({ top: 0 });
  await userEvent.click(
    within(screen.getByRole('columnheader', { name: /Number/ })).getByRole(
      'button'
    )
  );
  await userEvent.click(
    within(screen.getByRole('columnheader', { name: /Number/ })).getByRole(
      'button'
    )
  );
  await expect.poll(() => screen.queryByText('2026-1000')).toBeTruthy();
});

test('shows only the UI of the features the app registered', () => {
  render(
    <DataGrid
      options={{
        features: filterFeatures,
        columns: filterColumns,
        data: invoices,
      }}
    />
  );
  expect(screen.queryByRole('checkbox')).toBeNull();
  expect(screen.queryByText(/of 60 items/)).toBeNull();
  expect(screen.getAllByRole('row')).toHaveLength(61);
});

const pageWithoutModel = tableFeatures({
  rowPaginationFeature: dataGridPagination.rowPaginationFeature,
});
const noModelHelper = createColumnHelper<
  typeof pageWithoutModel,
  (typeof invoices)[number]
>();
const noModelColumns = noModelHelper.columns([
  noModelHelper.accessor('number', { header: 'Number' }),
]);

test('shows no pagination bar without a paginated row model', () => {
  render(
    <DataGrid
      options={{
        features: pageWithoutModel,
        columns: noModelColumns,
        data: invoices,
      }}
    />
  );
  expect(screen.queryByText(/of 60 items/)).toBeNull();
});

const filterSelectFeatures = tableFeatures({
  ...dataGridFiltering,
  ...dataGridSelection,
});
const filterSelectHelper = createColumnHelper<
  typeof filterSelectFeatures,
  (typeof invoices)[number]
>();
const filterSelectColumns = filterSelectHelper.columns([
  filterSelectHelper.accessor('number', { header: 'Number' }),
  filterSelectHelper.accessor('customer', { header: 'Customer' }),
]);

test('batch actions act only on selected rows that the filter shows', async () => {
  const onDelete = vi.fn();
  render(
    <DataGrid
      options={{
        features: filterSelectFeatures,
        columns: filterSelectColumns,
        data: few,
        getRowId: (row) => row.id,
        // Row 2026-0001 (Alder Studio) is selected but filtered out.
        initialState: {
          rowSelection: { 'inv-1': true },
          globalFilter: 'cedar',
        },
      }}
      batchActions={[{ id: 'delete', label: 'Delete', onClick: onDelete }]}
    />
  );
  expect(screen.getByRole('searchbox', { name: 'Filter table' })).toBeTruthy();
  screen.getByRole('checkbox', { name: 'Select row 2026-0005' }).focus();
  await userEvent.keyboard(' ');
  expect(screen.getByText('1 item selected')).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Select all (1)' })).toBeTruthy();
  await userEvent.click(screen.getByRole('button', { name: 'Delete' }));
  expect(onDelete).toHaveBeenCalledWith([few[4]]);
});

test('inline edit: leaving the field keeps focus where the user went', async () => {
  const onCellEdit = vi.fn();
  render(
    <>
      <DataGrid
        options={{ features: editFeatures, columns: editColumns, data: few }}
        onCellEdit={onCellEdit}
      />
      <button type="button">Outside</button>
    </>
  );
  await userEvent.click(iconButton('Edit Amount of row 2026-0002'));
  await userEvent.click(screen.getByRole('button', { name: 'Outside' }));
  expect(document.activeElement?.textContent).toBe('Outside');
});

test('inline edit: no save when unchanged or when a number is empty', async () => {
  const onCellEdit = vi.fn();
  render(
    <DataGrid
      options={{ features: editFeatures, columns: editColumns, data: few }}
      onCellEdit={onCellEdit}
    />
  );
  iconButton('Edit Amount of row 2026-0002').focus();
  await userEvent.keyboard('{Enter}');
  await userEvent.keyboard('{Enter}');
  expect(onCellEdit).not.toHaveBeenCalled();
  await userEvent.keyboard('{Enter}');
  await userEvent.clear(document.activeElement as HTMLInputElement);
  await userEvent.keyboard('{Enter}');
  expect(onCellEdit).not.toHaveBeenCalled();
  // The empty field stays open so the user can fix or cancel it.
  expect(
    screen.getByRole('spinbutton', { name: 'Edit Amount of row 2026-0002' })
  ).toBeTruthy();
});

const fourColumns = customHelper.columns([
  customHelper.accessor('number', { header: 'Number' }),
  customHelper.accessor('customer', { header: 'Customer' }),
  customHelper.accessor('status', { header: 'Status' }),
  customHelper.accessor('amount', { header: 'Amount' }),
]);

test('keeps focus on the move button across repeated moves', async () => {
  render(
    <DataGrid
      options={{ features: customFeatures, columns: fourColumns, data: few }}
    />
  );
  await userEvent.click(iconButton('Customize columns'));
  iconButton('Move Number down').focus();
  await userEvent.keyboard('{Enter}');
  expect(document.activeElement).toBe(iconButton('Move Number down'));
  await userEvent.keyboard('{Enter}');
  expect(headerNames()).toEqual(['Customer', 'Status', 'Number', 'Amount']);
  expect(document.activeElement).toBe(iconButton('Move Number down'));
  // A click outside still closes the list.
  await userEvent.click(screen.getAllByRole('cell')[0] as HTMLElement);
  await expect
    .poll(() => iconButton('Customize columns').getAttribute('aria-expanded'))
    .toBe('false');
});

const labelFeatures = tableFeatures({
  ...dataGridSelection,
  ...dataGridColumnCustomization,
});
const labelHelper = createColumnHelper<
  typeof labelFeatures,
  (typeof invoices)[number]
>();
const labelColumns = labelHelper.columns([
  labelHelper.accessor('number', { header: 'Number' }),
  labelHelper.accessor((row) => ({ name: row.customer }), {
    id: 'customerObject',
    header: 'Customer',
    cell: (info) => info.getValue().name,
  }),
]);

test('names rows by the first shown cell, a text value or the row id', () => {
  const { unmount } = render(
    <DataGrid
      options={{
        features: labelFeatures,
        columns: labelColumns,
        data: few,
        getRowId: (row) => row.id,
        initialState: { columnVisibility: { number: false } },
      }}
    />
  );
  // The first shown cell holds an object: the row id names the row.
  expect(
    screen.getByRole('checkbox', { name: 'Select row inv-1' })
  ).toBeTruthy();
  unmount();
  render(
    <DataGrid
      options={{
        features: labelFeatures,
        columns: labelColumns,
        data: few,
        getRowId: (row) => row.id,
      }}
      getRowLabel={(row) => row.number}
    />
  );
  expect(
    screen.getByRole('checkbox', { name: 'Select row 2026-0001' })
  ).toBeTruthy();
});

test('virtualization: server HTML has rows; nested rows count right', async () => {
  const html = renderToStaticMarkup(
    <DataGrid
      maxHeight="20rem"
      virtualize
      options={{
        features: sortFeatures,
        columns: sortColumns,
        data: manyInvoices,
      }}
    />
  );
  expect(html).toContain('2026-0001');
  expect(html).toContain('aria-rowcount="1001"');
  render(
    <DataGrid
      maxHeight="20rem"
      virtualize
      options={{
        features: expandFeatures,
        columns: expandColumns,
        data: nestedInvoices,
        getSubRows: (row) => row.lines,
        initialState: { expanded: true },
      }}
    />
  );
  // 4 invoices and 8 credit notes, plus the header row.
  expect(screen.getByRole('table').getAttribute('aria-rowcount')).toBe('13');
  const child = await screen.findByText('CN-2026-0041');
  expect(child.closest('tr')?.getAttribute('aria-rowindex')).toBe('3');
});

function ControlledPages({ onChange }: { onChange: (page: number) => void }) {
  const [pagination, setPagination] = useState({ pageIndex: 2, pageSize: 10 });
  return (
    <DataGrid
      options={{
        features: pageFeatures,
        columns: pageColumns,
        data: invoices,
        state: { pagination },
        onPaginationChange: (updater) => {
          const next =
            typeof updater === 'function' ? updater(pagination) : updater;
          onChange(next.pageIndex);
          setPagination(next);
        },
      }}
    />
  );
}

test('follows controlled state and reports changes', async () => {
  const onChange = vi.fn();
  render(<ControlledPages onChange={onChange} />);
  expect(screen.getByText('21–30 of 60 items')).toBeTruthy();
  const previous = document.querySelector('button[aria-label="Previous page"]');
  if (!(previous instanceof HTMLButtonElement)) throw new Error('no button');
  await userEvent.click(previous);
  expect(onChange).toHaveBeenCalledWith(1);
  expect(screen.getByText('11–20 of 60 items')).toBeTruthy();
});
