import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { expect, fn, waitFor, within } from 'storybook/test';
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
import type { FilterPanelFieldValue } from './value.js';
import mdx from './FilterPanel.mdx';

const options = (labels: string[]) =>
  labels.map((label) => ({ value: label.toLowerCase(), label }));

// One group per variant, in the order of the variant table in the docs.
const groups: FilterPanelGroup[] = [
  {
    id: 'status',
    label: 'Status',
    defaultOpen: true,
    options: options(['Draft', 'Sent', 'Paid', 'Overdue']),
  },
  {
    id: 'payment',
    label: 'Payment method',
    variant: 'radio',
    options: options(['Transfer', 'Card', 'Cash']),
  },
  {
    id: 'currency',
    label: 'Currency',
    variant: 'select',
    options: options(['CZK', 'EUR', 'USD']),
  },
  {
    id: 'customer',
    label: 'Customer',
    variant: 'multiselect',
    searchable: true,
    options: options([
      'Acme Trading',
      'Birch Studio',
      'Cedar Logistics',
      'Delta Foods',
      'Elm Consulting',
    ]),
  },
  { id: 'number', label: 'Invoice number', variant: 'text' },
  { id: 'vat', label: 'VAT rate (%)', variant: 'number', min: 0, max: 21 },
  {
    id: 'issued',
    label: 'Issued',
    variant: 'dateRange',
    minDate: '2026-01-01',
    maxDate: '2026-12-31',
  },
  {
    id: 'amount',
    label: 'Amount (CZK)',
    variant: 'slider',
    min: 0,
    max: 200_000,
    step: 5_000,
  },
];

// Four groups fit the flyout without scrolling; a longer list scrolls under
// the sticky Clear and Apply.
const flyoutGroups = groups.filter((group) =>
  ['status', 'currency', 'customer', 'issued'].includes(group.id)
);

interface Invoice {
  number: string;
  status: string;
  payment: string;
  currency: string;
  customer: string;
  vat: number;
  issued: string;
  amount: number;
}

const row = (
  number: string,
  status: string,
  payment: string,
  currency: string,
  customer: string,
  vat: number,
  issued: string,
  amount: number
): Invoice => ({
  number,
  status,
  payment,
  currency,
  customer,
  vat,
  issued,
  amount,
});

const invoices: Invoice[] = [
  row(
    '2026-0101',
    'paid',
    'transfer',
    'czk',
    'acme trading',
    21,
    '2026-09-02',
    48_400
  ),
  row(
    '2026-0102',
    'sent',
    'transfer',
    'eur',
    'birch studio',
    21,
    '2026-09-05',
    12_100
  ),
  row(
    '2026-0103',
    'overdue',
    'card',
    'czk',
    'cedar logistics',
    12,
    '2026-09-11',
    96_800
  ),
  row(
    '2026-0104',
    'draft',
    'transfer',
    'czk',
    'delta foods',
    12,
    '2026-09-18',
    7_260
  ),
  row(
    '2026-0105',
    'paid',
    'cash',
    'czk',
    'elm consulting',
    21,
    '2026-09-23',
    3_630
  ),
  row(
    '2026-0106',
    'sent',
    'transfer',
    'usd',
    'acme trading',
    0,
    '2026-10-01',
    150_000
  ),
  row(
    '2026-0107',
    'overdue',
    'transfer',
    'czk',
    'birch studio',
    21,
    '2026-10-03',
    24_200
  ),
  row(
    '2026-0108',
    'paid',
    'card',
    'eur',
    'cedar logistics',
    21,
    '2026-10-08',
    60_500
  ),
  row(
    '2026-0109',
    'sent',
    'transfer',
    'czk',
    'delta foods',
    12,
    '2026-10-12',
    18_150
  ),
  row(
    '2026-0110',
    'draft',
    'transfer',
    'czk',
    'acme trading',
    21,
    '2026-10-15',
    121_000
  ),
];

function matches(
  invoice: Invoice,
  group: FilterPanelGroup,
  field: FilterPanelFieldValue
): boolean {
  const cell = invoice[group.id as keyof Invoice];
  if (group.variant === 'text') {
    return String(cell).includes(String(field).trim());
  }
  if (group.variant === 'slider') return Number(cell) <= Number(field);
  if (group.variant === 'dateRange') {
    const [start, end] = field as readonly [string | null, string | null];
    const day = String(cell);
    return (!start || day >= start) && (!end || day <= end);
  }
  return typeof field === 'object'
    ? field.includes(String(cell))
    : String(cell) === String(field);
}

// Fixed data: the count is the number of invoices that match every group.
const countResults = (value: FilterPanelValue) =>
  invoices.filter((invoice) =>
    groups.every(
      (group) =>
        value[group.id] === undefined ||
        matches(invoice, group, value[group.id] as FilterPanelFieldValue)
    )
  ).length;

const initialValue: FilterPanelValue = {
  status: ['sent', 'overdue'],
  currency: 'czk',
};

function PanelHarness(args: FilterPanelProps) {
  const [, updateArgs] = useArgs<FilterPanelProps>();
  return (
    // Upstream's panel width, as the DataGrid filter column.
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
    // At the right edge, as in a table toolbar.
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

// Eleven tags: more than the ten the line shows, so "+N" always appears.
const summaryValue: FilterPanelValue = {
  status: ['sent', 'overdue'],
  payment: 'transfer',
  currency: 'czk',
  customer: ['acme trading', 'birch studio', 'delta foods'],
  number: '2026-01',
  vat: 21,
  issued: ['2026-09-01', '2026-10-31'],
  amount: 100_000,
};

function SummaryHarness(args: FilterSummaryProps) {
  const [, updateArgs] = useArgs<FilterSummaryProps>();
  return (
    // A fixed width keeps the measured overflow the same in every run.
    <div style={{ inlineSize: '48rem' }}>
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
type Canvas = Parameters<NonNullable<Story['play']>>[0]['canvas'];

function must<T>(found: T | null | undefined): T {
  if (found == null) throw new Error('Not found');
  return found;
}

// Carbon names the icon trigger through a hidden tooltip; the hidden copy
// inside aria-hidden markup does not count.
const flyoutTrigger = (canvas: Canvas) =>
  must(
    canvas
      .queryAllByLabelText<HTMLButtonElement>(/^Filter/, { selector: 'button' })
      .find((item) => !item.closest('[aria-hidden="true"]'))
  );

/** Batch update, flat layout, one group per variant and the result count. */
export const Default: Story = {
  render: PanelHarness,
};

/** Every change calls `onChange`; only Clear sits at the bottom. */
export const Instant: Story = {
  ...Default,
  args: { updateMethod: 'instant' },
};

/** Each group in an accordion item, opened by `defaultOpen`. */
export const Accordion: Story = {
  ...Default,
  args: { layout: 'accordion' },
};

export const Dark: Story = {
  ...Default,
  tags: ['!dev', '!autodocs'],
  globals: { theme: 'dark' },
};

export const TestBatch: Story = {
  ...Default,
  tags: ['!dev', '!autodocs'],
  args: { onChange: fn() },
  play: async ({ args, canvas, userEvent }) => {
    const apply = canvas.getByRole('button', { name: 'Apply' });
    await expect(apply).toBeDisabled();
    await expect(canvas.getByRole('status')).toHaveTextContent('3 results');
    await userEvent.click(canvas.getByRole('checkbox', { name: 'Draft' }));
    await expect(apply).toBeEnabled();
    await expect(args.onChange).not.toHaveBeenCalled();
    await userEvent.click(apply);
    await expect(args.onChange).toHaveBeenLastCalledWith({
      status: ['sent', 'overdue', 'draft'],
      currency: 'czk',
    });
    await expect(canvas.getByRole('heading', { name: 'Filter' })).toHaveFocus();
    await userEvent.click(canvas.getByRole('button', { name: 'Clear' }));
    await expect(args.onChange).toHaveBeenLastCalledWith({});
  },
};

/** The icon trigger; the count of applied filters is in its name and tooltip. */
export const Flyout: FlyoutStory = {
  render: FlyoutHarness,
  args: { groups: flyoutGroups },
  parameters: { layout: 'padded' },
};

/** The text trigger, "Filter (n)". */
export const FlyoutText: FlyoutStory = {
  ...Flyout,
  args: { ...Flyout.args, trigger: 'text' },
};

export const FlyoutOpen: FlyoutStory = {
  ...Flyout,
  args: { ...Flyout.args, defaultOpen: true },
  parameters: { layout: 'padded', docs: { story: { height: '36rem' } } },
};

export const FlyoutOpenDark: FlyoutStory = {
  ...FlyoutOpen,
  tags: ['!dev', '!autodocs'],
  globals: { theme: 'dark' },
};

export const TestFlyoutDateRange: FlyoutStory = {
  ...Flyout,
  tags: ['!dev', '!autodocs'],
  args: { ...Flyout.args, onChange: fn() },
  play: async ({ args, canvas, userEvent }) => {
    const toggle = flyoutTrigger(canvas);
    await userEvent.click(toggle);
    await userEvent.click(canvas.getByLabelText('Start date'));
    // flatpickr puts the calendar on body.
    const calendar = await waitFor(() =>
      must(document.querySelector('.flatpickr-calendar.open'))
    );
    await userEvent.click(
      must(calendar.querySelector('.flatpickr-next-month'))
    );
    // The calendar redraws its days after each pick.
    const day = (index: number) =>
      must(
        calendar.querySelectorAll<HTMLElement>(
          '.flatpickr-day:not(.prevMonthDay):not(.nextMonthDay)'
        )[index]
      );
    await userEvent.click(day(0));
    await userEvent.click(day(4));
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await userEvent.click(canvas.getByRole('button', { name: 'Apply' }));
    await expect(args.onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        issued: [expect.any(String), expect.any(String)],
      })
    );
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toHaveFocus();
  },
};

export const TestFlyoutMenus: FlyoutStory = {
  ...Flyout,
  tags: ['!dev', '!autodocs'],
  play: async ({ canvas, userEvent }) => {
    const toggle = flyoutTrigger(canvas);
    await userEvent.click(toggle);
    const currency = canvas.getByRole('combobox', { name: 'Currency' });
    await userEvent.click(currency);
    await expect(currency).toHaveAttribute('aria-expanded', 'true');
    // A simulated click leaves focus on the body; a real one on the combobox.
    currency.focus();
    // Not clipped by the scrolling content: the last option is the element
    // at its own centre.
    const last = must(canvas.getAllByRole('option').at(-1));
    const box = last.getBoundingClientRect();
    const hit = document.elementFromPoint(
      box.left + box.width / 2,
      box.top + box.height / 2
    );
    await expect(last.contains(hit)).toBe(true);
    await userEvent.keyboard('{Escape}');
    await expect(currency).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await userEvent.keyboard('{Escape}');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toHaveFocus();
  },
};

// The "+N" tag once the overflow is measured.
const moreTag = (canvas: Canvas) =>
  waitFor(() =>
    must(
      canvas.queryAllByRole('button', { name: /^[1-9]\d* more filters$/ }).at(0)
    )
  );

/** One line of tags; the ones that do not fit go into "+N". */
export const Summary: SummaryStory = {
  render: SummaryHarness,
  args: { groups, value: summaryValue, onChange: () => undefined },
  play: async ({ canvas }) => {
    await moreTag(canvas);
  },
};

export const SummaryOverflowOpen: SummaryStory = {
  ...Summary,
  tags: ['!autodocs'],
  parameters: { layout: 'padded' },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(await moreTag(canvas));
  },
};

export const SummaryDark: SummaryStory = {
  ...Summary,
  tags: ['!dev', '!autodocs'],
  globals: { theme: 'dark' },
};

export const TestSummaryOverflow: SummaryStory = {
  ...Summary,
  tags: ['!dev', '!autodocs'],
  args: { ...Summary.args, onChange: fn() },
  play: async ({ args, canvas, userEvent }) => {
    const more = await moreTag(canvas);
    const hidden = Number(more.textContent.slice(1));
    await userEvent.click(more);
    await expect(more).toHaveAttribute('aria-expanded', 'true');
    const popover = within(
      must(
        document.querySelector<HTMLElement>('.afframe-filter-summary-popover')
      )
    );
    const dismiss = popover.getAllByLabelText(/^Remove filter/, {
      selector: 'button',
    });
    await expect(dismiss).toHaveLength(hidden);
    await userEvent.click(must(dismiss[0]));
    await expect(args.onChange).toHaveBeenCalledTimes(1);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Clear filters' })
    );
    await expect(args.onChange).toHaveBeenLastCalledWith({});
  },
};
