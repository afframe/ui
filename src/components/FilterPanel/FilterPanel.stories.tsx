import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { expect, fn, waitFor } from 'storybook/test';
import { afframeA11y } from '../../../.storybook/afframeA11y.js';
import { FilterFlyout } from './FilterFlyout.js';
import type { FilterFlyoutProps } from './FilterFlyout.js';
import { FilterPanel } from './FilterPanel.js';
import type {
  FilterPanelGroup,
  FilterPanelProps,
  FilterPanelValue,
} from './FilterPanel.js';
import { FilterSummary } from './FilterSummary.js';
import type { FilterSummaryProps } from './FilterSummary.js';
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

function PanelHarness(args: FilterPanelProps) {
  const [, updateArgs] = useArgs<FilterPanelProps>();
  return (
    <div style={{ maxInlineSize: '20rem' }}>
      <FilterPanel
        resultCount={countResults(args.value)}
        {...args}
        onChange={(value) => {
          updateArgs({ value });
          args.onChange(value);
        }}
      />
    </div>
  );
}

function FlyoutHarness(args: FilterFlyoutProps) {
  const [, updateArgs] = useArgs<FilterFlyoutProps>();
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <FilterFlyout
        resultCount={countResults(args.value)}
        {...args}
        onChange={(value) => {
          updateArgs({ value });
          args.onChange(value);
        }}
      />
    </div>
  );
}

// Seven tags overflow the narrow wrapper, so the summary shows "+N".
const summaryValue: FilterPanelValue = {
  status: ['paid', 'overdue'],
  currency: ['CZK', 'EUR'],
  customer: ['acme', 'birch', 'cedar'],
};

function SummaryHarness(args: FilterSummaryProps) {
  const [, updateArgs] = useArgs<FilterSummaryProps>();
  return (
    <div style={{ maxInlineSize: '30rem' }}>
      <FilterSummary
        {...args}
        onChange={(value) => {
          updateArgs({ value });
          args.onChange(value);
        }}
      />
    </div>
  );
}

const meta = {
  title: 'Components/FilterPanel',
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
type FlyoutStory = StoryObj<FilterFlyoutProps>;
type SummaryStory = StoryObj<FilterSummaryProps>;

export const Default: Story = {
  render: PanelHarness,
};

/** Batch update: toggles change a draft; Apply calls `onChange`. */
export const Batch: Story = {
  render: PanelHarness,
  args: { updateMethod: 'batch', onClose: fn() },
};

export const TestBatch: Story = {
  ...Batch,
  tags: ['!dev', '!autodocs'],
  args: { ...Batch.args, onChange: fn() },
  play: async ({ args, canvas, userEvent }) => {
    const apply = canvas.getByRole('button', { name: 'Apply' });
    await expect(apply).toBeDisabled();
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Draft' }));
    await expect(apply).toBeEnabled();
    await expect(args.onChange).not.toHaveBeenCalled();
    await userEvent.click(apply);
    await expect(args.onChange).toHaveBeenLastCalledWith({
      status: ['paid', 'overdue', 'draft'],
    });
    await expect(
      canvas.getByRole('heading', { name: 'Filters' })
    ).toHaveFocus();
  },
};

/** The applied filters as tags above the data; the rest overflow into "+N". */
export const Summary: SummaryStory = {
  render: SummaryHarness,
  args: { value: summaryValue },
  play: async ({ canvas }) => {
    // TagSet measures after render and keeps a hidden copy for measuring.
    await waitFor(() => {
      const shown = canvas
        .queryAllByText(/^\+\d+$/)
        .filter((item) => !item.closest('[aria-hidden="true"]'));
      return expect(shown).toHaveLength(1);
    });
  },
};

export const Flyout: FlyoutStory = {
  render: FlyoutHarness,
  parameters: { layout: 'padded' },
};

export const FlyoutOpen: FlyoutStory = {
  ...Flyout,
  args: { defaultOpen: true },
  parameters: { layout: 'padded', docs: { story: { height: '32rem' } } },
};

export const Dark: Story = {
  ...Default,
  tags: ['!dev', '!autodocs'],
  globals: { theme: 'dark' },
};

export const BatchDark: Story = {
  ...Batch,
  tags: ['!dev', '!autodocs'],
  globals: { theme: 'dark' },
};

export const SummaryDark: SummaryStory = {
  ...Summary,
  tags: ['!dev', '!autodocs'],
  globals: { theme: 'dark' },
};

export const FlyoutOpenDark: FlyoutStory = {
  ...FlyoutOpen,
  tags: ['!dev', '!autodocs'],
  globals: { theme: 'dark' },
};
