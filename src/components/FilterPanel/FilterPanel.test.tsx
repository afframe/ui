import { cleanup, render, screen, within } from '@testing-library/react';
import { createRef, useState } from 'react';
import { afterEach, expect, test, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { FilterPanel } from './FilterPanel.js';
import type { FilterPanelMessages, FilterPanelProps } from './FilterPanel.js';
import type { FilterPanelGroup, FilterPanelValue } from './FilterPanel.js';

afterEach(cleanup);

const groups: FilterPanelGroup[] = [
  {
    id: 'status',
    label: 'Status',
    defaultOpen: true,
    options: [
      { value: 'paid', label: 'Paid' },
      { value: 'overdue', label: 'Overdue' },
    ],
  },
  {
    id: 'customer',
    label: 'Customer',
    searchable: true,
    options: [
      { value: 'acme', label: 'Acme Trading' },
      { value: 'birch', label: 'Birch Studio' },
    ],
  },
];

const allVariants: FilterPanelGroup[] = [
  {
    id: 'status',
    label: 'Status',
    options: [
      { value: 'paid', label: 'Paid' },
      { value: 'overdue', label: 'Overdue' },
    ],
  },
  {
    id: 'kind',
    label: 'Kind',
    variant: 'radio',
    options: [
      { value: 'invoice', label: 'Invoice' },
      { value: 'credit', label: 'Credit note' },
    ],
  },
  {
    id: 'currency',
    label: 'Currency',
    variant: 'select',
    options: [
      { value: 'czk', label: 'CZK' },
      { value: 'eur', label: 'EUR' },
    ],
  },
  {
    id: 'tags',
    label: 'Tags',
    variant: 'multiselect',
    options: [
      { value: 'urgent', label: 'Urgent' },
      { value: 'export', label: 'Export' },
    ],
  },
  { id: 'reference', label: 'Reference', variant: 'text' },
  { id: 'lines', label: 'Lines', variant: 'number' },
  { id: 'issued', label: 'Issued', variant: 'dateRange' },
  { id: 'amount', label: 'Amount', variant: 'slider', min: 0, max: 100 },
];

function Harness({
  initial = {},
  onChange,
  groups: shownGroups = groups,
  ...props
}: Partial<Omit<FilterPanelProps, 'value'>> & { initial?: FilterPanelValue }) {
  const [value, setValue] = useState(initial);
  return (
    <>
      <button type="button">Before</button>
      <FilterPanel
        groups={shownGroups}
        value={value}
        resultCount={Object.values(value).flat().length}
        {...props}
        onChange={(next) => {
          onChange?.(next);
          setValue(next);
        }}
      />
    </>
  );
}

const active = () => document.activeElement;
const button = (name: string) => screen.getByRole('button', { name });
const checkbox = (name: string) =>
  screen.getByRole<HTMLInputElement>('checkbox', { name });
const title = () => screen.getByRole('heading', { name: 'Filter' });

// Carbon names these buttons through a hidden tooltip (aria-labelledby),
// which Testing Library's role query does not read.
const byLabel = (label: string) =>
  screen.queryAllByLabelText<HTMLButtonElement>(label, { selector: 'button' });

test('panel: search narrows the options and shows an empty message', async () => {
  render(<Harness />);
  const search = screen.getByRole('searchbox', { name: 'Search Customer' });
  await userEvent.type(search, 'acm');
  expect(screen.getByRole('checkbox', { name: 'Acme Trading' })).toBeTruthy();
  expect(screen.queryByRole('checkbox', { name: 'Birch Studio' })).toBeNull();
  await userEvent.type(search, 'x');
  expect(screen.getByText('No matching options')).toBeTruthy();
});

test('accordion: names, counts and message overrides', () => {
  render(
    <Harness
      layout="accordion"
      initial={{ status: ['paid'] }}
      messages={{
        title: 'Filtry',
        resultCount: (count) => `${count} výsledek`,
        groupTitle: (label, count) => `${label}: ${count}`,
      }}
    />
  );
  expect(screen.getByRole('region', { name: 'Filtry' })).toBeTruthy();
  expect(screen.getByRole('status').textContent).toBe('1 výsledek');
  expect(screen.getByRole('button', { name: 'Status: 1' })).toBeTruthy();
  expect(screen.getByRole('group', { name: 'Status' })).toBeTruthy();
});

test('ids are unique across groups and panels', () => {
  const { container } = render(
    <>
      <FilterPanel groups={allVariants} value={{}} onChange={() => {}} />
      <FilterPanel
        groups={allVariants}
        layout="accordion"
        value={{}}
        onChange={() => {}}
      />
    </>
  );
  const ids = [...container.querySelectorAll('[id]')].map((node) => node.id);
  expect(ids.length).toBeGreaterThan(20);
  expect(new Set(ids).size).toBe(ids.length);
});

test('panel: ref and rest props reach the section', () => {
  const ref = createRef<HTMLElement>();
  render(
    <FilterPanel
      ref={ref}
      groups={groups}
      value={{}}
      onChange={() => undefined}
      data-testid="filters"
      aria-describedby="hint"
      className="extra"
    />
  );
  const region = screen.getByRole('region', { name: 'Filter' });
  expect(ref.current).toBe(region);
  expect(region.tagName).toBe('SECTION');
  expect(region.dataset.testid).toBe('filters');
  expect(region.getAttribute('aria-describedby')).toBe('hint');
  expect(region.className).toBe('afframe-filter-panel extra');
});

test('flat: fieldsets and legends for checkbox, radio, date range and slider; labels for the rest', () => {
  render(<FilterPanel groups={allVariants} value={{}} onChange={() => {}} />);
  for (const name of ['Status', 'Kind', 'Issued', 'Amount']) {
    const group = screen.getByRole('group', { name });
    expect(group.tagName).toBe('FIELDSET');
    expect(within(group).getByText(name, { selector: 'legend' })).toBeTruthy();
  }
  expect(screen.getByRole('combobox', { name: 'Currency' })).toBeTruthy();
  expect(screen.getByRole('combobox', { name: 'Tags' })).toBeTruthy();
  expect(screen.getByRole('textbox', { name: 'Reference' })).toBeTruthy();
  expect(screen.getByRole('spinbutton', { name: 'Lines' })).toBeTruthy();
  expect(screen.getByRole('slider', { name: 'Amount' })).toBeTruthy();
  // Carbon's range labels show the bounds; no value input.
  const rangeLabels = document.querySelectorAll('.cds--slider__range-label');
  expect([...rangeLabels].map((label) => label.textContent)).toEqual([
    '0',
    '100',
  ]);
  expect(screen.queryByRole('spinbutton', { name: 'Amount' })).toBeNull();
});

test('locale: the slider bounds follow it', () => {
  const slider: FilterPanelGroup[] = [
    { id: 'amount', label: 'Amount', variant: 'slider', min: 0, max: 5000.5 },
  ];
  render(
    <FilterPanel
      groups={slider}
      value={{}}
      onChange={() => {}}
      locale="en-US"
    />
  );
  const rangeLabels = document.querySelectorAll('.cds--slider__range-label');
  expect([...rangeLabels].map((label) => label.textContent)).toEqual([
    '0',
    '5,000.5',
  ]);
});

/** Sets one value in every variant of `allVariants`. */
async function fillEveryVariant() {
  await userEvent.click(screen.getByText('Paid'));
  await userEvent.click(screen.getByText('Credit note'));
  await userEvent.click(screen.getByRole('combobox', { name: 'Currency' }));
  await userEvent.click(screen.getByRole('option', { name: 'EUR' }));
  await userEvent.click(screen.getByRole('combobox', { name: 'Tags' }));
  await userEvent.click(screen.getByRole('option', { name: 'Urgent' }));
  await userEvent.keyboard('{Escape}');
  await userEvent.type(
    screen.getByRole('textbox', { name: 'Reference' }),
    'A1'
  );
  await userEvent.type(screen.getByRole('spinbutton', { name: 'Lines' }), '0');
  // Before the date range: an open calendar takes the arrow keys.
  screen.getByRole('slider', { name: 'Amount' }).focus();
  await userEvent.keyboard('{ArrowLeft}');
  await userEvent.type(screen.getByLabelText('Date from'), '01102026');
  await userEvent.type(screen.getByLabelText('Date to'), '05102026');
  await userEvent.click(document.body);
}

const everyVariant = {
  status: ['paid'],
  kind: 'credit',
  currency: 'eur',
  tags: ['urgent'],
  reference: 'A1',
  lines: 0,
  issued: ['2026-10-01', '2026-10-05'],
  amount: 99,
};

test('batch: every variant changes the draft; Apply sends it', async () => {
  const onChange = vi.fn();
  render(<Harness groups={allVariants} onChange={onChange} />);
  await fillEveryVariant();
  expect(onChange).not.toHaveBeenCalled();
  await userEvent.click(button('Apply'));
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith(everyVariant);
});

test('instant: every variant calls onChange; only Clear is shown', async () => {
  const onChange = vi.fn();
  render(
    <Harness groups={allVariants} updateMethod="instant" onChange={onChange} />
  );
  expect(screen.queryByRole('button', { name: 'Apply' })).toBeNull();
  expect(button('Clear')).toHaveProperty('disabled', true);
  await fillEveryVariant();
  expect(onChange).toHaveBeenLastCalledWith(everyVariant);
  expect(button('Clear')).toHaveProperty('disabled', false);
  await userEvent.click(button('Clear'));
  expect(onChange).toHaveBeenLastCalledWith({});
  expect(active()).toBe(title());
  expect(checkbox('Paid').checked).toBe(false);
  expect(
    screen.getByRole<HTMLInputElement>('textbox', { name: 'Reference' }).value
  ).toBe('');
  expect(screen.getByLabelText<HTMLInputElement>('Date from').value).toBe('');
  expect(button('Clear')).toHaveProperty('disabled', true);
});

test('batch: onChange only on Apply, with the draft; focus moves to the title', async () => {
  const onChange = vi.fn();
  render(<Harness layout="accordion" onChange={onChange} />);
  const apply = button('Apply');
  const clear = button('Clear');
  expect(apply).toHaveProperty('disabled', true);
  expect(clear).toHaveProperty('disabled', true);
  await userEvent.click(screen.getByText('Paid'));
  await userEvent.click(screen.getByText('Overdue'));
  expect(onChange).not.toHaveBeenCalled();
  expect(checkbox('Paid').checked).toBe(true);
  expect(button('Status (2)')).toBeTruthy();
  expect(screen.getByRole('status').textContent).toBe('0 results');
  expect(apply).toHaveProperty('disabled', false);
  expect(clear).toHaveProperty('disabled', false);
  // Unchecking back to the applied value disables both again.
  await userEvent.click(screen.getByText('Overdue'));
  await userEvent.click(screen.getByText('Paid'));
  expect(apply).toHaveProperty('disabled', true);
  expect(clear).toHaveProperty('disabled', true);
  await userEvent.click(screen.getByText('Paid'));
  apply.focus();
  await userEvent.keyboard('{Enter}');
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith({ status: ['paid'] });
  expect(active()).toBe(title());
  expect(apply).toHaveProperty('disabled', true);
  expect(screen.getByRole('status').textContent).toBe('1 result');
});

function PanelHarness(props: {
  onChange?: (value: FilterPanelValue) => void;
  onClose?: () => void;
  messages?: Partial<FilterPanelMessages>;
}) {
  const [value, setValue] = useState<FilterPanelValue>({ status: ['paid'] });
  const [, setTick] = useState(0);
  return (
    <>
      <button type="button" onClick={() => setTick((tick) => tick + 1)}>
        Rerender
      </button>
      <button type="button" onClick={() => setValue({ status: ['overdue'] })}>
        Outside
      </button>
      <FilterPanel
        groups={groups}
        // A new object with the same content on every render.
        value={{ status: [...((value.status ?? []) as readonly string[])] }}
        {...(props.onClose ? { onClose: props.onClose } : {})}
        {...(props.messages ? { messages: props.messages } : {})}
        onChange={(next) => {
          props.onChange?.(next);
          setValue(next);
        }}
      />
    </>
  );
}

test('batch: Clear empties the draft and the value, focuses the title', async () => {
  const onChange = vi.fn();
  render(<PanelHarness onChange={onChange} />);
  // A value is applied, so Clear is on; Apply waits for a change.
  expect(button('Clear')).toHaveProperty('disabled', false);
  expect(button('Apply')).toHaveProperty('disabled', true);
  await userEvent.click(screen.getByText('Overdue'));
  await userEvent.click(screen.getByText('Acme Trading'));
  await userEvent.click(button('Clear'));
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith({});
  expect(checkbox('Paid').checked).toBe(false);
  expect(checkbox('Overdue').checked).toBe(false);
  expect(checkbox('Acme Trading').checked).toBe(false);
  expect(active()).toBe(title());
  expect(button('Clear')).toHaveProperty('disabled', true);
  expect(button('Apply')).toHaveProperty('disabled', true);
});

test('batch: an inline value keeps the draft; an outside change rebases only the groups it changed', async () => {
  render(<PanelHarness />);
  await userEvent.click(screen.getByText('Overdue'));
  await userEvent.click(screen.getByText('Acme Trading'));
  await userEvent.click(button('Rerender'));
  expect(checkbox('Overdue').checked).toBe(true);
  expect(button('Apply')).toHaveProperty('disabled', false);
  await userEvent.click(button('Outside'));
  // Status took the outside value; Customer kept its draft.
  expect(checkbox('Paid').checked).toBe(false);
  expect(checkbox('Overdue').checked).toBe(true);
  expect(checkbox('Acme Trading').checked).toBe(true);
  expect(button('Apply')).toHaveProperty('disabled', false);
  await userEvent.click(screen.getByText('Acme Trading'));
  expect(button('Apply')).toHaveProperty('disabled', true);
});

test('close button: only with onClose; in batch it discards the draft', async () => {
  render(<PanelHarness />);
  expect(byLabel('Close')).toHaveLength(0);
  cleanup();
  const onClose = vi.fn();
  const onChange = vi.fn();
  render(<PanelHarness onClose={onClose} onChange={onChange} />);
  await userEvent.click(screen.getByText('Overdue'));
  await userEvent.click(page.getByRole('button', { name: 'Close' }));
  expect(onClose).toHaveBeenCalledTimes(1);
  expect(onChange).not.toHaveBeenCalled();
  expect(checkbox('Overdue').checked).toBe(false);
  expect(button('Apply')).toHaveProperty('disabled', true);
});

test('accordion: Enter opens a group', async () => {
  render(<Harness layout="accordion" />);
  const customer = button('Customer');
  expect(customer.getAttribute('aria-expanded')).toBe('false');
  customer.focus();
  await userEvent.keyboard('{Enter}');
  expect(customer.getAttribute('aria-expanded')).toBe('true');
});

test('panel: headingLevel 3 renders an h3 that keeps the id and focus target', async () => {
  render(
    <FilterPanel
      headingLevel={3}
      groups={groups}
      value={{}}
      onChange={() => undefined}
    />
  );
  const heading = screen.getByRole('heading', { name: 'Filter', level: 3 });
  expect(heading.tagName).toBe('H3');
  expect(heading.getAttribute('tabindex')).toBe('-1');
  const region = screen.getByRole('region', { name: 'Filter' });
  expect(region.getAttribute('aria-labelledby')).toBe(heading.id);
  await userEvent.click(screen.getByText('Paid'));
  await userEvent.click(button('Apply'));
  expect(active()).toBe(heading);
});

test('panel: the focused title shows a focus outline', async () => {
  render(<Harness />);
  await userEvent.click(screen.getByText('Paid'));
  await userEvent.click(button('Apply'));
  expect(active()).toBe(title());
  const style = getComputedStyle(title());
  expect(style.outlineStyle).toBe('solid');
  expect(style.outlineWidth).toBe('2px');
  expect(style.outlineOffset).toBe('-2px');
});

const startDate = () => screen.getByLabelText<HTMLInputElement>('Date from');

test('date range: text kept invalid stays when another field changes', async () => {
  render(
    <Harness
      groups={[
        groups[0] as FilterPanelGroup,
        {
          id: 'issued',
          label: 'Issued',
          variant: 'dateRange',
          minDate: '2026-01-01',
          maxDate: '2026-12-31',
        },
      ]}
      initial={{ issued: ['2026-10-01', '2026-10-05'] }}
    />
  );
  await userEvent.click(startDate());
  startDate().setSelectionRange(0, startDate().value.length);
  await userEvent.keyboard('0310');
  await userEvent.click(screen.getByText('Paid'));
  await new Promise((resolve) => setTimeout(resolve, 50));
  expect(checkbox('Paid').checked).toBe(true);
  expect(startDate().value).toBe('03.10.');
});

test('date range: a stored day or bound that is not an ISO day is no date', () => {
  render(
    <Harness
      groups={[
        { id: 'issued', label: 'Issued', variant: 'dateRange', minDate: 'x' },
      ]}
      initial={{ issued: ['2026-10-01', 'soon'] }}
    />
  );
  expect(startDate().value).toBe('01.10.2026');
  expect(screen.getByLabelText<HTMLInputElement>('Date to').value).toBe('');
});

test('date range: a range without a start shows both inputs empty', async () => {
  render(
    <Harness
      groups={[{ id: 'issued', label: 'Issued', variant: 'dateRange' }]}
      initial={{ issued: [null, '2026-10-05'] }}
    />
  );
  await new Promise((resolve) => setTimeout(resolve, 50));
  expect(startDate().value).toBe('');
  expect(screen.getByLabelText<HTMLInputElement>('Date to').value).toBe('');
});

test('text: spaces stay as typed; the stored value is trimmed', async () => {
  const onChange = vi.fn();
  render(
    <Harness
      groups={[{ id: 'reference', label: 'Reference', variant: 'text' }]}
      updateMethod="instant"
      onChange={onChange}
    />
  );
  const field = screen.getByRole<HTMLInputElement>('textbox', {
    name: 'Reference',
  });
  await userEvent.type(field, ' A1 ');
  expect(field.value).toBe(' A1 ');
  expect(onChange).toHaveBeenLastCalledWith({ reference: 'A1' });
  await userEvent.click(button('Clear'));
  expect(field.value).toBe('');
});

test.each(['flat', 'accordion'] as const)(
  'searchable multiselect: the input is named by the group label (%s)',
  (layout) => {
    render(
      <Harness
        layout={layout}
        groups={[
          {
            id: 'customer',
            label: 'Customer',
            variant: 'multiselect',
            searchable: true,
            defaultOpen: true,
            options: [{ value: 'acme', label: 'Acme Trading' }],
          },
        ]}
      />
    );
    expect(screen.getByRole('combobox', { name: 'Customer' })).toBeTruthy();
  }
);

test('radio and select: "All" is first, selected without a value, and removes the filter', async () => {
  const onChange = vi.fn();
  render(
    <Harness
      groups={allVariants.filter(
        (group) => group.id === 'kind' || group.id === 'currency'
      )}
      initial={{ kind: 'credit', currency: 'eur' }}
      updateMethod="instant"
      onChange={onChange}
    />
  );
  const radios = screen.getAllByRole<HTMLInputElement>('radio');
  expect(radios.map((radio) => radio.labels?.[0]?.textContent)).toEqual([
    'All',
    'Invoice',
    'Credit note',
  ]);
  expect(radios[0]?.checked).toBe(false);
  await userEvent.click(screen.getByText('All'));
  expect(onChange).toHaveBeenLastCalledWith({ currency: 'eur' });
  expect(radios[0]?.checked).toBe(true);
  const select = screen.getByRole('combobox', { name: 'Currency' });
  expect(select.textContent).toContain('EUR');
  await userEvent.click(select);
  const options = screen.getAllByRole('option');
  expect(options.map((option) => option.textContent)).toEqual([
    'All',
    'CZK',
    'EUR',
  ]);
  await userEvent.click(screen.getByRole('option', { name: 'All' }));
  expect(onChange).toHaveBeenLastCalledWith({});
  expect(select.textContent).toContain('All');
});
