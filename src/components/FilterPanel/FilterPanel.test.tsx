import { cleanup, render, screen, within } from '@testing-library/react';
import { createRef, useState } from 'react';
import { afterEach, expect, test, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { countFilterPanelSelections, FilterPanel } from './FilterPanel.js';
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

test('ids stay valid when group ids and values contain spaces', async () => {
  const onChange = vi.fn();
  render(
    <FilterPanel
      updateMethod="instant"
      groups={[
        {
          id: 'cost centre',
          label: 'Cost centre',
          searchable: true,
          options: [{ value: 'head office', label: 'Head office' }],
        },
      ]}
      value={{}}
      onChange={onChange}
    />
  );
  const box = screen.getByRole('checkbox', { name: 'Head office' });
  expect(box.id).not.toMatch(/\s/);
  expect(
    screen.getByRole('searchbox', { name: 'Search Cost centre' }).id
  ).not.toMatch(/\s/);
  await userEvent.click(screen.getByText('Head office'));
  expect(onChange).toHaveBeenLastCalledWith({ 'cost centre': ['head office'] });
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
  expect(screen.getByText('Min: 0')).toBeTruthy();
  expect(screen.getByText('Max: 100')).toBeTruthy();
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
  await userEvent.type(screen.getByLabelText('Start date'), '01102026');
  await userEvent.type(screen.getByLabelText('End date'), '05102026');
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
  expect(screen.getByLabelText<HTMLInputElement>('Start date').value).toBe('');
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

test('count ignores values that match no option', () => {
  const value = { status: ['paid', 'gone'], missing: ['x'] };
  expect(countFilterPanelSelections(groups, value)).toBe(1);
  render(<Harness layout="accordion" initial={value} />);
  expect(button('Status (1)')).toBeTruthy();
});

const startDate = () => screen.getByLabelText<HTMLInputElement>('Start date');

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
  expect(screen.getByLabelText<HTMLInputElement>('End date').value).toBe('');
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

const endDate = () => screen.getByLabelText<HTMLInputElement>('End date');
// After flatpickr's range plugin empties the end on a timer (10 ms).
const afterClearTimer = () => new Promise((resolve) => setTimeout(resolve, 50));

function EndOnly(props: Partial<Omit<FilterPanelProps, 'value'>>) {
  return (
    <Harness
      groups={[{ id: 'issued', label: 'Issued', variant: 'dateRange' }]}
      initial={{ issued: [null, '2026-10-05'] }}
      updateMethod="instant"
      {...props}
    />
  );
}

test('date range: an end-only range shows in End with Start empty', async () => {
  render(<EndOnly />);
  await afterClearTimer();
  expect(startDate().value).toBe('');
  expect(endDate().value).toBe('05.10.2026');
});

test('date range: a start typed before an end-only end keeps the end', async () => {
  const onChange = vi.fn();
  render(<EndOnly onChange={onChange} />);
  await userEvent.type(startDate(), '01102026{Enter}');
  await afterClearTimer();
  expect(onChange).toHaveBeenLastCalledWith({
    issued: ['2026-10-01', '2026-10-05'],
  });
  expect(startDate().value).toBe('01.10.2026');
  expect(endDate().value).toBe('05.10.2026');
});

test('date range: a start picked in the calendar keeps an end-only end', async () => {
  const onChange = vi.fn();
  render(<EndOnly onChange={onChange} />);
  await userEvent.click(startDate());
  (
    startDate() as HTMLInputElement & {
      _flatpickr: { jumpToDate: (date: Date) => void };
    }
  )._flatpickr.jumpToDate(new Date(2026, 9, 1));
  const day = document.querySelector<HTMLElement>(
    '.flatpickr-calendar.open .flatpickr-day[aria-label$="October 2, 2026"]'
  );
  if (!day) throw new Error('No October 2 in the open calendar');
  await userEvent.click(day);
  await afterClearTimer();
  expect(onChange).toHaveBeenLastCalledWith({
    issued: ['2026-10-02', '2026-10-05'],
  });
  expect(endDate().value).toBe('05.10.2026');
});

test('date range: emptying an end-only end removes the filter', async () => {
  const onChange = vi.fn();
  render(<EndOnly onChange={onChange} />);
  await userEvent.click(endDate());
  endDate().setSelectionRange(0, endDate().value.length);
  await userEvent.keyboard('{Backspace}');
  await userEvent.click(document.body);
  await afterClearTimer();
  expect(onChange).toHaveBeenLastCalledWith({});
  expect(endDate().value).toBe('');
});

test('date range: a new end typed into an end-only range stays end-only', async () => {
  const onChange = vi.fn();
  render(<EndOnly onChange={onChange} />);
  await userEvent.click(endDate());
  endDate().setSelectionRange(0, endDate().value.length);
  await userEvent.keyboard('20102026{Enter}');
  await afterClearTimer();
  expect(onChange).toHaveBeenLastCalledWith({ issued: [null, '2026-10-20'] });
  expect(startDate().value).toBe('');
  expect(endDate().value).toBe('20.10.2026');
});

const issuedGroup: FilterPanelGroup[] = [
  { id: 'issued', label: 'Issued', variant: 'dateRange' },
];

function OutsideRange(props: Partial<Omit<FilterPanelProps, 'value'>>) {
  const [value, setValue] = useState<FilterPanelValue>({
    issued: ['2026-10-01', '2026-10-05'],
  });
  return (
    <>
      <button
        type="button"
        onClick={() => setValue({ issued: [null, '2026-10-05'] })}>
        End only
      </button>
      <button type="button" onClick={() => setValue({})}>
        Empty
      </button>
      <FilterPanel
        groups={issuedGroup}
        value={value}
        {...props}
        onChange={(next) => {
          props.onChange?.(next);
          setValue(next);
        }}
      />
    </>
  );
}

test('date range: Clear and an outside empty value empty an end-only End', async () => {
  render(<EndOnly />);
  await afterClearTimer();
  await userEvent.click(button('Clear'));
  await afterClearTimer();
  expect(endDate().value).toBe('');
  cleanup();
  render(<OutsideRange updateMethod="instant" />);
  await userEvent.click(button('End only'));
  await afterClearTimer();
  await userEvent.click(button('Empty'));
  await afterClearTimer();
  expect(startDate().value).toBe('');
  expect(endDate().value).toBe('');
});

test('date range: a new end typed into an end-only End applies on leaving it', async () => {
  const onChange = vi.fn();
  render(<EndOnly onChange={onChange} />);
  await userEvent.click(endDate());
  endDate().setSelectionRange(0, endDate().value.length);
  await userEvent.keyboard('20102026');
  await userEvent.click(document.body);
  await afterClearTimer();
  expect(onChange).toHaveBeenLastCalledWith({ issued: [null, '2026-10-20'] });
  expect(endDate().value).toBe('20.10.2026');
});

test('date range: leaving an invalid end-only End removes the filter, marked invalid', async () => {
  const onChange = vi.fn();
  render(<EndOnly onChange={onChange} />);
  await userEvent.click(endDate());
  endDate().setSelectionRange(0, endDate().value.length);
  await userEvent.keyboard('3102');
  await userEvent.click(document.body);
  await afterClearTimer();
  expect(onChange).toHaveBeenLastCalledWith({});
  expect(endDate().value).toBe('31.02.');
  await vi.waitFor(() =>
    expect(endDate().getAttribute('aria-invalid')).toBe('true')
  );
});

test.each([
  [15, [null, '2026-10-15']],
  [25, [null, '2026-10-25']],
])(
  'date range: day %i picked from End’s calendar sets an end-only end',
  async (date, issued) => {
    const onChange = vi.fn();
    render(
      <Harness
        groups={issuedGroup}
        initial={{ issued: [null, '2026-10-20'] }}
        updateMethod="instant"
        onChange={onChange}
      />
    );
    await afterClearTimer();
    await userEvent.click(endDate());
    (
      startDate() as HTMLInputElement & {
        _flatpickr: { jumpToDate: (date: Date) => void };
      }
    )._flatpickr.jumpToDate(new Date(2026, 9, 1));
    const day = document.querySelector<HTMLElement>(
      `.flatpickr-calendar.open .flatpickr-day[aria-label$="October ${date}, 2026"]`
    );
    if (!day) throw new Error(`No October ${date} in the open calendar`);
    await userEvent.click(day);
    await afterClearTimer();
    expect(onChange).toHaveBeenLastCalledWith({ issued });
    expect(startDate().value).toBe('');
  }
);

test('date range: an outside change to end-only keeps the filter (instant)', async () => {
  const onChange = vi.fn();
  render(<OutsideRange updateMethod="instant" onChange={onChange} />);
  await userEvent.click(button('End only'));
  await afterClearTimer();
  expect(onChange).not.toHaveBeenCalled();
  expect(startDate().value).toBe('');
  expect(endDate().value).toBe('05.10.2026');
});

test('date range: Close in batch returns a picked start to the end-only value', async () => {
  const onChange = vi.fn();
  render(
    <EndOnly updateMethod="batch" onChange={onChange} onClose={() => {}} />
  );
  await userEvent.type(startDate(), '01102026{Enter}');
  await afterClearTimer();
  expect(button('Apply')).toHaveProperty('disabled', false);
  await userEvent.click(page.getByRole('button', { name: 'Close' }));
  await afterClearTimer();
  expect(button('Apply')).toHaveProperty('disabled', true);
  expect(startDate().value).toBe('');
  expect(endDate().value).toBe('05.10.2026');
  expect(onChange).not.toHaveBeenCalled();
});
