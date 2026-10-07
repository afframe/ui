import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { afframeA11y } from '../../../.storybook/afframeA11y.js';
import { FilterFlyout } from './FilterFlyout.js';
import { FilterPanel } from './FilterPanel.js';
import type { FilterPanelGroup, FilterPanelValue } from './FilterPanel.js';
import mdx from './FilterPanel.mdx';

const groups: FilterPanelGroup[] = [
  {
    id: 'status',
    label: 'Status',
    defaultOpen: true,
    options: [
      { value: 'draft', label: 'Draft' },
      { value: 'sent', label: 'Sent' },
      { value: 'paid', label: 'Paid' },
      { value: 'overdue', label: 'Overdue' },
    ],
  },
  {
    id: 'currency',
    label: 'Currency',
    options: [
      { value: 'CZK', label: 'CZK' },
      { value: 'EUR', label: 'EUR' },
      { value: 'USD', label: 'USD' },
    ],
  },
  {
    id: 'customer',
    label: 'Customer',
    searchable: true,
    options: [
      { value: 'acme', label: 'Acme Trading' },
      { value: 'birch', label: 'Birch Studio' },
      { value: 'cedar', label: 'Cedar Logistics' },
      { value: 'delta', label: 'Delta Foods' },
    ],
  },
];

const invoices = [
  { status: 'draft', currency: 'CZK', customer: 'acme' },
  { status: 'sent', currency: 'CZK', customer: 'birch' },
  { status: 'paid', currency: 'EUR', customer: 'cedar' },
  { status: 'overdue', currency: 'CZK', customer: 'delta' },
  { status: 'paid', currency: 'CZK', customer: 'acme' },
  { status: 'sent', currency: 'USD', customer: 'birch' },
  { status: 'paid', currency: 'CZK', customer: 'delta' },
  { status: 'overdue', currency: 'EUR', customer: 'acme' },
] as const;

// Fixed data: the count is the number of invoices that match every group.
function countResults(value: FilterPanelValue): number {
  return invoices.filter((invoice) =>
    Object.entries(value).every(([group, selected]) =>
      selected.includes(invoice[group as keyof typeof invoice])
    )
  ).length;
}

const initialValue: FilterPanelValue = { status: ['paid', 'overdue'] };

function PanelHarness() {
  const [value, setValue] = useState(initialValue);
  return (
    <div style={{ maxInlineSize: '20rem' }}>
      <FilterPanel
        groups={groups}
        value={value}
        onChange={setValue}
        resultCount={countResults(value)}
      />
    </div>
  );
}

function FlyoutHarness() {
  const [value, setValue] = useState(initialValue);
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <FilterFlyout
        groups={groups}
        value={value}
        onChange={setValue}
        resultCount={countResults(value)}
      />
    </div>
  );
}

const meta = {
  title: 'Components/Filter Panel',
  component: FilterPanel,
  tags: ['afframe'],
  parameters: {
    ...afframeA11y,
    docs: { page: mdx },
  },
  args: { groups, value: initialValue, onChange: () => undefined },
} satisfies Meta<typeof FilterPanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <PanelHarness />,
};

export const Flyout: Story = {
  render: () => <FlyoutHarness />,
  parameters: { layout: 'padded' },
};

export const FlyoutOpen: Story = {
  render: () => <FlyoutHarness />,
  parameters: { layout: 'padded' },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Filter (2)' }));
  },
};

export const Dark: Story = {
  ...Default,
  globals: { theme: 'dark' },
};

export const FlyoutOpenDark: Story = {
  ...FlyoutOpen,
  globals: { theme: 'dark' },
};
