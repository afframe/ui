import type { Meta, StoryObj } from '@storybook/react-vite';
import { TrashCan } from '@carbon/icons-react';
import { Link } from '@carbon/react';
import { useState } from 'react';
import { expect, fn, within } from 'storybook/test';
import { createColumnHelper, tableFeatures } from '@tanstack/react-table';
import { afframeA11y } from '../../../.storybook/afframeA11y.js';
import { FilterPanel, type FilterPanelValue } from '../../index.js';
import { DataGrid } from './DataGrid.js';
import mdx from './DataGrid.mdx';
import './DataGrid.stories.css';
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
import {
  invoices,
  manyInvoices,
  nestedInvoices,
  type Invoice,
} from './fixtures.js';

const meta = {
  title: 'Components/Data Grid',
  tags: ['afframe'],
  parameters: {
    ...afframeA11y,
    docs: { page: mdx },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const few = invoices.slice(0, 8);

const sortingFeatures = tableFeatures({ ...dataGridSorting });
const sortingHelper = createColumnHelper<typeof sortingFeatures, Invoice>();
const sortingColumns = sortingHelper.columns([
  sortingHelper.accessor('number', { header: 'Number' }),
  sortingHelper.accessor('customer', { header: 'Customer' }),
  sortingHelper.accessor('status', { header: 'Status' }),
  sortingHelper.accessor('amount', { header: 'Amount' }),
  sortingHelper.accessor('issued', { header: 'Issued' }),
]);

export const Sorting: Story = {
  render: () => (
    <DataGrid
      title="Invoices"
      description="Click a header to sort; Shift adds a second sort."
      options={{
        features: sortingFeatures,
        columns: sortingColumns,
        data: few,
      }}
    />
  ),
};

const filteringFeatures = tableFeatures({
  ...dataGridSorting,
  ...dataGridFiltering,
});
const filteringHelper = createColumnHelper<typeof filteringFeatures, Invoice>();
const filteringColumns = filteringHelper.columns([
  filteringHelper.accessor('number', { header: 'Number' }),
  filteringHelper.accessor('customer', { header: 'Customer' }),
  filteringHelper.accessor('status', { header: 'Status' }),
  filteringHelper.accessor('amount', { header: 'Amount' }),
]);

export const Filtering: Story = {
  render: () => (
    <DataGrid
      title="Invoices"
      options={{
        features: filteringFeatures,
        columns: filteringColumns,
        data: few,
      }}
    />
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(
      canvas.getByRole('searchbox', { name: 'Filter table' }),
      'overdue'
    );
    await expect(canvas.getAllByRole('row')).toHaveLength(3);
  },
};

const paginationFeatures = tableFeatures({
  ...dataGridSorting,
  ...dataGridFiltering,
  ...dataGridPagination,
});
const paginationHelper = createColumnHelper<
  typeof paginationFeatures,
  Invoice
>();
const paginationColumns = paginationHelper.columns([
  paginationHelper.accessor('number', { header: 'Number' }),
  paginationHelper.accessor('customer', { header: 'Customer' }),
  paginationHelper.accessor('amount', { header: 'Amount' }),
]);

export const Pagination: Story = {
  render: () => (
    <DataGrid
      title="Invoices"
      options={{
        features: paginationFeatures,
        columns: paginationColumns,
        data: invoices,
      }}
    />
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    // Carbon names the icon button through its tooltip; find it by aria-label.
    const next = canvasElement.querySelector('[aria-label="Next page"]');
    if (!next) throw new Error('no next page button');
    await userEvent.click(next);
    await expect(canvas.getByText('11–20 of 60 items')).toBeVisible();
  },
};

const selectionFeatures = tableFeatures({
  ...dataGridSorting,
  ...dataGridSelection,
});
const selectionHelper = createColumnHelper<typeof selectionFeatures, Invoice>();
const selectionColumns = selectionHelper.columns([
  selectionHelper.accessor('number', { header: 'Number' }),
  selectionHelper.accessor('customer', { header: 'Customer' }),
  selectionHelper.accessor('amount', { header: 'Amount' }),
]);
const selectionOptions = {
  features: selectionFeatures,
  columns: selectionColumns,
  data: few,
  getRowId: (row: Invoice) => row.id,
};

export const Selection: Story = {
  render: () => <DataGrid title="Invoices" options={selectionOptions} />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole('checkbox', { name: 'Select row 2026-0002' })
    );
    await expect(
      canvas.getByRole('checkbox', { name: 'Select all rows' })
    ).toBePartiallyChecked();
  },
};

/** Extra small rows: the checkboxes keep a 24 px target. */
export const SelectionExtraSmall: Story = {
  render: () => (
    <DataGrid title="Invoices" size="xs" options={selectionOptions} />
  ),
};

export const SelectionSmall: Story = {
  render: () => (
    <DataGrid title="Invoices" size="sm" options={selectionOptions} />
  ),
};

const onDelete = fn();

export const BatchActions: Story = {
  render: () => (
    <DataGrid
      title="Invoices"
      options={selectionOptions}
      batchActions={[
        {
          id: 'delete',
          label: 'Delete',
          icon: TrashCan,
          onClick: onDelete,
        },
      ]}
    />
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole('checkbox', { name: 'Select row 2026-0001' })
    );
    await userEvent.click(canvas.getByRole('button', { name: /Delete/ }));
    await expect(onDelete).toHaveBeenCalledWith([few[0]]);
  },
};

const onEdit = fn();

export const RowActions: Story = {
  render: () => (
    <DataGrid
      title="Invoices"
      options={{
        features: sortingFeatures,
        columns: sortingColumns,
        data: few,
      }}
      rowActions={[
        { id: 'edit', label: 'Edit', onClick: onEdit },
        { id: 'delete', label: 'Delete', danger: true, onClick: fn() },
      ]}
    />
  ),
  play: async ({ canvasElement, userEvent }) => {
    const tooltip = within(canvasElement).getByText(
      'Actions for row 2026-0001'
    );
    const trigger = canvasElement.querySelector(
      `[aria-labelledby="${tooltip.closest('[role="tooltip"]')?.id}"]`
    );
    if (!trigger) throw new Error('no row action menu');
    await userEvent.click(trigger);
    const body = within(canvasElement.ownerDocument.body);
    await userEvent.click(await body.findByRole('menuitem', { name: 'Edit' }));
    await expect(onEdit).toHaveBeenCalledWith(few[0]);
  },
};

const expansionFeatures = tableFeatures({
  ...dataGridExpansion,
  ...dataGridSelection,
});
const expansionHelper = createColumnHelper<typeof expansionFeatures, Invoice>();
const expansionColumns = expansionHelper.columns([
  expansionHelper.accessor('number', { header: 'Number' }),
  expansionHelper.accessor('customer', { header: 'Customer' }),
  expansionHelper.accessor('amount', { header: 'Amount' }),
]);

export const Expansion: Story = {
  render: () => (
    <DataGrid
      title="Invoices"
      options={{
        features: expansionFeatures,
        columns: expansionColumns,
        data: few,
        getRowId: (row) => row.id,
      }}
      renderExpandedRow={(invoice) => (
        <p>
          {invoice.customer}, issued {invoice.issued}, status {invoice.status}.
        </p>
      )}
    />
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      canvas.getByRole('button', { name: 'Expand row 2026-0001' })
    );
    await expect(
      canvas.getByText('Alder Studio, issued 2026-01-01, status Paid.')
    ).toBeVisible();
  },
};

const customizationFeatures = tableFeatures({
  ...dataGridSorting,
  ...dataGridColumnCustomization,
});
const customizationHelper = createColumnHelper<
  typeof customizationFeatures,
  Invoice
>();
const customizationColumns = customizationHelper.columns([
  customizationHelper.accessor('number', {
    header: 'Number',
    enableHiding: false,
  }),
  customizationHelper.accessor('customer', { header: 'Customer' }),
  customizationHelper.accessor('status', { header: 'Status' }),
  customizationHelper.accessor('amount', { header: 'Amount' }),
]);

export const ColumnCustomization: Story = {
  render: () => (
    <DataGrid
      title="Invoices"
      options={{
        features: customizationFeatures,
        columns: customizationColumns,
        data: few,
        initialState: { columnVisibility: { status: false } },
      }}
    />
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    const tooltip = canvas.getByText('Customize columns');
    const trigger = canvasElement.querySelector(
      `[aria-labelledby="${tooltip.closest('[role="tooltip"]')?.id}"]`
    );
    if (!trigger) throw new Error('no column settings button');
    await userEvent.click(trigger);
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Status' }));
    await expect(
      canvas.getByRole('columnheader', { name: /Status/ })
    ).toBeVisible();
  },
};

const resizingFeatures = tableFeatures({
  ...dataGridSorting,
  ...dataGridResizing,
});
const resizingHelper = createColumnHelper<typeof resizingFeatures, Invoice>();
const resizingColumns = resizingHelper.columns([
  resizingHelper.accessor('number', { header: 'Number', size: 140 }),
  resizingHelper.accessor('customer', { header: 'Customer', size: 220 }),
  resizingHelper.accessor('status', { header: 'Status', size: 120 }),
  resizingHelper.accessor('amount', { header: 'Amount', size: 120 }),
]);

export const Resizing: Story = {
  render: () => (
    <DataGrid
      title="Invoices"
      description="Drag a header edge, or focus it and press the arrow keys."
      options={{
        features: resizingFeatures,
        columns: resizingColumns,
        data: few,
      }}
    />
  ),
  play: async ({ canvas, userEvent }) => {
    const handle = canvas.getByRole('separator', {
      name: 'Resize Customer column',
    });
    handle.focus();
    await userEvent.keyboard('{ArrowLeft}');
    await expect(handle).toHaveAttribute('aria-valuenow', '204');
  },
};

const stickyFeatures = tableFeatures({
  ...dataGridSorting,
  ...dataGridSelection,
  ...dataGridStickyColumns,
});
const stickyHelper = createColumnHelper<typeof stickyFeatures, Invoice>();
const stickyColumns = stickyHelper.columns([
  stickyHelper.accessor('number', {
    header: 'Number',
    size: 160,
    cell: (info) => (
      <Link href={`#${info.row.original.id}`}>{info.getValue()}</Link>
    ),
  }),
  stickyHelper.accessor('customer', { header: 'Customer', size: 400 }),
  stickyHelper.accessor('status', { header: 'Status', size: 320 }),
  stickyHelper.accessor('issued', { header: 'Issued', size: 320 }),
  stickyHelper.accessor('amount', { header: 'Amount', size: 320 }),
]);

/** True when the element's centre is not covered by another element. */
function isUnobscured(element: Element) {
  const box = element.getBoundingClientRect();
  const hit = document.elementFromPoint(
    box.left + box.width / 2,
    box.top + box.height / 2
  );
  return hit !== null && element.contains(hit);
}

export const StickyColumns: Story = {
  render: () => (
    <DataGrid
      title="Invoices"
      description="Number stays in view while the table scrolls."
      maxHeight="16rem"
      options={{
        features: stickyFeatures,
        columns: stickyColumns,
        data: invoices.slice(0, 20),
        getRowId: (row) => row.id,
        initialState: { columnPinning: { start: ['number'], end: [] } },
      }}
    />
  ),
  // WCAG 2.4.11: focus on a sticky header or sticky column cell is never
  // hidden, even when the table is scrolled both ways first.
  play: async ({ canvasElement, userEvent }) => {
    const scroller = canvasElement.querySelector('.cds--data-table-content');
    if (!scroller) throw new Error('no scroll container');
    const tabUntil = async (match: (element: Element) => boolean) => {
      for (let i = 0; i < 100; i++) {
        await userEvent.tab();
        const active = document.activeElement;
        if (active && match(active)) return active;
      }
      throw new Error('focus target not reached');
    };
    // Reach each target once, step back, scroll both ways, then tab onto it.
    const check = async (match: (element: Element) => boolean) => {
      await tabUntil(match);
      await userEvent.tab({ shift: true });
      scroller.scrollTo({ left: 9999, top: 200 });
      await expect(scroller.scrollLeft).toBeGreaterThan(0);
      await expect(scroller.scrollTop).toBeGreaterThan(0);
      await userEvent.tab();
      const target = document.activeElement;
      if (!target || !match(target)) throw new Error('focus target missed');
      await expect(isUnobscured(target)).toBe(true);
      return target;
    };
    await check(
      (element) =>
        element.closest('thead .afframe-data-grid__sticky-start') !== null
    );
    const cell = await check(
      (element) =>
        element.closest('tbody .afframe-data-grid__sticky-start') !== null
    );
    await expect(cell).toHaveTextContent('2026-0001');
  },
};

export const NestedRows: Story = {
  render: () => (
    <DataGrid
      title="Invoices and credit notes"
      options={{
        features: expansionFeatures,
        columns: expansionColumns,
        data: nestedInvoices,
        getRowId: (row) => row.id,
        getSubRows: (row) => row.lines,
        initialState: { expanded: { 'inv-1': true } },
      }}
    />
  ),
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByText('CN-2026-0041')).toBeVisible();
    await userEvent.click(
      canvas.getByRole('checkbox', { name: 'Select row 2026-0001' })
    );
    // Selecting a parent selects its credit notes.
    await expect(
      canvas.getByRole('checkbox', { name: 'Select row CN-2026-0041' })
    ).toBeChecked();
  },
};

const editFeatures = tableFeatures({
  ...dataGridSorting,
  ...dataGridInlineEdit,
});
const editHelper = createColumnHelper<typeof editFeatures, Invoice>();
const editColumns = editHelper.columns([
  editHelper.accessor('number', { header: 'Number' }),
  editHelper.accessor('customer', {
    header: 'Customer',
    meta: { editable: true },
  }),
  editHelper.accessor('amount', { header: 'Amount', meta: { editable: true } }),
]);

function InlineEditDemo() {
  const [data, setData] = useState(few);
  return (
    <DataGrid
      title="Invoices"
      options={{
        features: editFeatures,
        columns: editColumns,
        data,
        getRowId: (row) => row.id,
      }}
      onCellEdit={({ rowId, columnId, value }) =>
        setData((rows) =>
          rows.map((row) =>
            row.id === rowId ? { ...row, [columnId]: value } : row
          )
        )
      }
    />
  );
}

export const InlineEdit: Story = {
  render: () => <InlineEditDemo />,
  play: async ({ canvas, canvasElement, userEvent }) => {
    const name = 'Edit Customer of row 2026-0001';
    const tooltip = canvas.getByText(name);
    const button = canvasElement.querySelector(
      `[aria-labelledby="${tooltip.closest('[role="tooltip"]')?.id}"]`
    );
    if (!button) throw new Error('no edit button');
    await userEvent.click(button);
    const field = canvas.getByRole('textbox', { name });
    await userEvent.clear(field);
    await userEvent.type(field, 'Aspen Works{Enter}');
    await expect(canvas.getByText('Aspen Works')).toBeVisible();
  },
};

export const Virtualization: Story = {
  render: () => (
    <DataGrid
      title="1,000 invoices"
      description="Only the rows in view are rendered."
      maxHeight="24rem"
      virtualize
      options={{
        features: selectionFeatures,
        columns: selectionColumns,
        data: manyInvoices,
        getRowId: (row) => row.id,
      }}
    />
  ),
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('table')).toHaveAttribute(
      'aria-rowcount',
      '1001'
    );
    const scroller = canvasElement.querySelector('.cds--data-table-content');
    scroller?.scrollTo({ top: 48 * 900 });
    await expect(await canvas.findByText('2026-0905')).toBeVisible();
  },
};

const fullFeatures = tableFeatures({
  ...dataGridSorting,
  ...dataGridFiltering,
  ...dataGridSelection,
  ...dataGridExpansion,
  ...dataGridColumnCustomization,
  ...dataGridResizing,
  ...dataGridInlineEdit,
});
const fullHelper = createColumnHelper<typeof fullFeatures, Invoice>();
const fullColumns = fullHelper.columns([
  fullHelper.accessor('number', { header: 'Number', size: 140 }),
  fullHelper.accessor('customer', {
    header: 'Customer',
    size: 240,
    meta: { editable: true },
  }),
  fullHelper.accessor('amount', { header: 'Amount', size: 160 }),
]);
const fullOptions = {
  features: fullFeatures,
  columns: fullColumns,
  data: few,
  getRowId: (row: Invoice) => row.id,
};

/**
 * Every control at once. While rows are selected the toolbar under the batch
 * bar is inert; axe checks the open state.
 */
export const AllFeatures: Story = {
  render: () => (
    <DataGrid
      title="Invoices"
      options={fullOptions}
      batchActions={[
        { id: 'delete', label: 'Delete', icon: TrashCan, onClick: fn() },
      ]}
      rowActions={[{ id: 'edit', label: 'Edit', onClick: fn() }]}
      renderExpandedRow={(invoice) => <p>{invoice.customer}</p>}
      onCellEdit={fn()}
    />
  ),
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(
      canvas.getByRole('checkbox', { name: 'Select row 2026-0001' })
    );
    const content = canvasElement.querySelector('.cds--toolbar-content');
    await expect(content).toHaveAttribute('inert');
    // Tab from the batch bar skips the hidden search field.
    canvas.getByRole('button', { name: 'Cancel' }).focus();
    await userEvent.tab();
    await expect(content?.contains(document.activeElement)).toBe(false);
  },
};

/** Extra small rows with every control: each keeps a 24 px target. */
export const AllFeaturesExtraSmall: Story = {
  render: () => (
    <DataGrid
      title="Invoices"
      size="xs"
      options={fullOptions}
      rowActions={[{ id: 'edit', label: 'Edit', onClick: fn() }]}
      renderExpandedRow={(invoice) => <p>{invoice.customer}</p>}
      onCellEdit={fn()}
    />
  ),
};

const panelFeatures = tableFeatures({
  ...dataGridSorting,
  ...dataGridFiltering,
});
const panelHelper = createColumnHelper<typeof panelFeatures, Invoice>();
// A row matches when its value is one of the selected options.
const oneOf = {
  filterFn: (
    row: { getValue: (id: string) => unknown },
    id: string,
    value: readonly string[]
  ) => value.includes(String(row.getValue(id))),
};
const panelColumns = panelHelper.columns([
  panelHelper.accessor('number', { header: 'Number' }),
  panelHelper.accessor('customer', { header: 'Customer', ...oneOf }),
  panelHelper.accessor('status', { header: 'Status', ...oneOf }),
  panelHelper.accessor('amount', { header: 'Amount' }),
]);
const panelGroups = [
  {
    id: 'status',
    label: 'Status',
    defaultOpen: true,
    options: ['Paid', 'Open', 'Overdue'].map((v) => ({ value: v, label: v })),
  },
  {
    id: 'customer',
    label: 'Customer',
    options: [...new Set(few.map((row) => row.customer))].map((v) => ({
      value: v,
      label: v,
    })),
  },
];

function FilterPanelDemo() {
  const [filters, setFilters] = useState<FilterPanelValue>({});
  const columnFilters = Object.entries(filters)
    .filter(([, selected]) => selected.length > 0)
    .map(([id, value]) => ({ id, value }));
  const resultCount = few.filter((row) =>
    columnFilters.every(({ id, value }) =>
      value.includes(String(row[id as keyof Invoice]))
    )
  ).length;
  return (
    <div className="afframe-data-grid-demo">
      <FilterPanel
        groups={panelGroups}
        value={filters}
        onChange={setFilters}
        resultCount={resultCount}
      />
      <DataGrid
        title="Invoices"
        options={{
          features: panelFeatures,
          columns: panelColumns,
          data: few,
          state: { columnFilters },
        }}
      />
    </div>
  );
}

/** A filter panel beside the grid sets `columnFilters` as controlled state. */
export const WithFilterPanel: Story = {
  render: () => <FilterPanelDemo />,
  play: async ({ canvas, userEvent }) => {
    const table = within(canvas.getByRole('table'));
    await expect(table.getAllByRole('row')).toHaveLength(9);
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Overdue' }));
    // Header row plus the two overdue invoices.
    await expect(table.getAllByRole('row')).toHaveLength(3);
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Overdue' }));
    await expect(table.getAllByRole('row')).toHaveLength(9);
  },
};

export const Dark: Story = {
  ...Sorting,
  globals: { theme: 'dark' },
};
