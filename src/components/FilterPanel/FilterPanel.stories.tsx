import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { expect, waitFor } from 'storybook/test';
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
        resultCount={3}
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
        resultCount={3}
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

export const TestFlyoutMenus: FlyoutStory = {
  ...Flyout,
  tags: ['!dev', '!autodocs'],
  play: async ({ canvas, userEvent }) => {
    const toggle = flyoutTrigger(canvas);
    await userEvent.click(toggle);
    // Customer sits in the lower row: opened down, its menu would run past
    // the flyout's scrolling content and be clipped. The whole list stays in
    // the viewport, and its last option is the element at its own centre.
    const customer = canvas.getByRole('combobox', { name: 'Customer' });
    await userEvent.click(customer);
    await expect(customer).toHaveAttribute('aria-expanded', 'true');
    // autoAlign places the menu after it opens.
    await waitFor(() => {
      const list = must(
        must(customer.closest('.cds--list-box__wrapper')).querySelector(
          '[role="listbox"]'
        )
      ).getBoundingClientRect();
      const content = must(
        customer.closest('.afframe-filter-flyout-content')
      ).getBoundingClientRect();
      expect(
        customer.getBoundingClientRect().bottom + list.height
      ).toBeGreaterThan(content.bottom);
      expect(list.top).toBeGreaterThanOrEqual(0);
      expect(list.bottom).toBeLessThanOrEqual(window.innerHeight);
      const last = must(canvas.getAllByRole('option').at(-1));
      const box = last.getBoundingClientRect();
      const hit = document.elementFromPoint(
        box.left + box.width / 2,
        box.top + box.height / 2
      );
      expect(last.contains(hit)).toBe(true);
    });
    // axe runs after play: Carbon's open multiselect options hold checkboxes
    // (nested-interactive). A simulated click leaves focus on the body.
    customer.focus();
    await userEvent.keyboard('{Escape}');
    await expect(customer).toHaveAttribute('aria-expanded', 'false');
  },
};

// The "+N" tag once the overflow is measured.
const moreTag = (canvas: Canvas) =>
  waitFor(() =>
    must(canvas.queryAllByRole('button', { name: /^\+\d+$/ }).at(0))
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
