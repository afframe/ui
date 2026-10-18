import { render, screen } from '@testing-library/react';
import { createRef, useState } from 'react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { FilterSummary } from './FilterSummary.js';
import { defaultFilterTagMessages, filterTags } from './value.js';
import type { FilterPanelGroup, FilterPanelValue } from './value.js';

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

const options = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
];
const variantGroups: FilterPanelGroup[] = [
  { id: 'checkbox', label: 'Checkbox', options },
  { id: 'radio', label: 'Radio', variant: 'radio', options },
  { id: 'select', label: 'Select', variant: 'select', options },
  { id: 'multi', label: 'Multi', variant: 'multiselect', options },
  { id: 'text', label: 'Text', variant: 'text' },
  { id: 'number', label: 'Number', variant: 'number' },
  { id: 'range', label: 'Range', variant: 'dateRange' },
  { id: 'from', label: 'From', variant: 'dateRange' },
  { id: 'slider', label: 'Slider', variant: 'slider', min: 0, max: 100 },
];
const variantValue: FilterPanelValue = {
  checkbox: ['a', 'b'],
  radio: 'b',
  select: 'a',
  multi: ['b'],
  text: 'acme',
  number: 1200,
  range: ['2026-01-05', '2026-02-10'],
  from: ['2026-03-01', null],
  slider: 40,
};

const active = () => document.activeElement;
const button = (name: string) => screen.getByRole('button', { name });
const summaryRoot = () =>
  screen.getByRole('group', { name: 'Selected filters' });

// Carbon names the dismiss buttons through a hidden tooltip
// (aria-labelledby), which Testing Library's role query does not read.
const closeButtons = (label: string | RegExp) =>
  screen.queryAllByLabelText<HTMLButtonElement>(label, { selector: 'button' });
// Tags in the line: not hidden by the overflow handler, not in the popover.
const lineButtons = (label: string | RegExp = /^Remove filter /) =>
  closeButtons(label).filter(
    (item) => !item.closest('[data-hidden]') && !item.closest('[data-offset]')
  );
const popoverButtons = (label: string | RegExp = /^Remove filter /) =>
  closeButtons(label).filter((item) =>
    item.closest('.afframe-filter-summary-popover')
  );
const one = (found: HTMLButtonElement[], label: string) => {
  const [item] = found;
  if (!item) throw new Error(`No tag ${label}`);
  return item;
};
const dismiss = (label: string) =>
  one(lineButtons(`Remove filter ${label}`), label);
const dismissInPopover = (label: string) =>
  one(popoverButtons(`Remove filter ${label}`), label);
const moreTag = () => screen.queryByRole('button', { name: /more filters$/ });

function SummaryHarness({
  initial,
  onChange,
  // Wide enough that no tag goes into "+N".
  width = '60rem',
}: {
  initial: FilterPanelValue;
  onChange?: (value: FilterPanelValue) => void;
  width?: string;
}) {
  const [value, setValue] = useState(initial);
  return (
    <div style={{ inlineSize: width }}>
      <FilterSummary
        groups={groups}
        value={value}
        onChange={(next) => {
          onChange?.(next);
          setValue(next);
        }}
      />
    </div>
  );
}

test('summary: a "Group: Option" tag per known selected option', async () => {
  render(
    <SummaryHarness
      initial={{
        status: ['paid', 'gone'],
        customer: ['birch'],
        missing: ['x'],
      }}
    />
  );
  await vi.waitFor(() => expect(lineButtons()).toHaveLength(2));
  expect(lineButtons().map((item) => item.getAttribute('aria-label'))).toEqual([
    'Remove filter Status: Paid',
    'Remove filter Customer: Birch Studio',
  ]);
  expect(summaryRoot().textContent).toContain('Status: Paid');
  expect(button('Clear filters')).toBeTruthy();
  await vi.waitFor(() =>
    expect(
      document.querySelector('[data-offset]')?.hasAttribute('data-hidden')
    ).toBe(true)
  );
  expect(moreTag()).toBeNull();
});

test('summary: a tag per applied value of every variant, as filterTags', async () => {
  render(
    <div style={{ inlineSize: '200rem' }}>
      <FilterSummary
        groups={variantGroups}
        value={variantValue}
        onChange={() => undefined}
      />
    </div>
  );
  const expected = filterTags(
    variantGroups,
    variantValue,
    defaultFilterTagMessages
  ).map((tag) => `Remove filter ${tag.label}`);
  expect(expected).toHaveLength(10);
  await vi.waitFor(() =>
    expect(
      lineButtons().map((item) => item.getAttribute('aria-label'))
    ).toEqual(expected)
  );
});

test('summary: dismissing a tag removes its value and keeps focus on the tags', async () => {
  const onChange = vi.fn();
  render(
    <SummaryHarness
      initial={{ status: ['paid', 'overdue'], customer: ['acme'] }}
      onChange={onChange}
    />
  );
  await vi.waitFor(() => expect(lineButtons()).toHaveLength(3));
  dismiss('Status: Paid').focus();
  await userEvent.keyboard('{Enter}');
  expect(onChange).toHaveBeenLastCalledWith({
    status: ['overdue'],
    customer: ['acme'],
  });
  await vi.waitFor(() => expect(active()).toBe(dismiss('Status: Overdue')));
  // The last tag hands focus to the one before it, then to the root.
  dismiss('Customer: Acme Trading').focus();
  await userEvent.keyboard('{Enter}');
  expect(onChange).toHaveBeenLastCalledWith({ status: ['overdue'] });
  await vi.waitFor(() => expect(active()).toBe(dismiss('Status: Overdue')));
  await userEvent.keyboard('{Enter}');
  expect(onChange).toHaveBeenLastCalledWith({});
  expect(active()).toBe(summaryRoot());
});

test('summary: Clear filters calls onChange({}) and focuses the root', async () => {
  const onChange = vi.fn();
  render(<SummaryHarness initial={{ status: ['paid'] }} onChange={onChange} />);
  button('Clear filters').focus();
  await userEvent.keyboard('{Enter}');
  expect(onChange).toHaveBeenCalledWith({});
  expect(active()).toBe(summaryRoot());
  expect(summaryRoot().childElementCount).toBe(0);
});

test('summary: an empty value renders an empty root with ref and rest props', () => {
  const ref = createRef<HTMLDivElement>();
  render(
    <FilterSummary
      ref={ref}
      groups={groups}
      value={{ status: ['gone'] }}
      onChange={() => undefined}
      data-testid="summary"
      className="extra"
      messages={{ selectedFilters: 'Vybrané filtry' }}
    />
  );
  const root = screen.getByRole('group', { name: 'Vybrané filtry' });
  expect(ref.current).toBe(root);
  expect(root.dataset.testid).toBe('summary');
  expect(root.className).toBe('afframe-filter-summary extra');
  expect(root.getAttribute('tabindex')).toBe('-1');
  expect(root.childElementCount).toBe(0);
});

test('summary: custom messages', async () => {
  render(
    <div style={{ inlineSize: '200rem' }}>
      <FilterSummary
        groups={variantGroups}
        value={{
          checkbox: ['a'],
          range: ['2026-01-05', null],
          from: [null, '2026-02-10'],
          slider: 40,
        }}
        onChange={() => undefined}
        messages={{
          tagLabel: (group, value) => `${group} = ${value}`,
          removeFilter: (label) => `Odebrat ${label}`,
          clearFilters: 'Zrušit filtry',
          dateRangeValue: (start, end) => `${start ?? '…'} až ${end ?? '…'}`,
          atMostValue: (value) => `nejvýše ${value}`,
        }}
      />
    </div>
  );
  const names = () =>
    lineButtons(/^Odebrat /).map((item) => item.getAttribute('aria-label'));
  await vi.waitFor(() => expect(names()).toHaveLength(4));
  const [checkbox, start, end, slider] = names();
  expect(checkbox).toBe('Odebrat Checkbox = Alpha');
  expect(start).toMatch(/^Odebrat Range = .+ až …$/);
  expect(end).toMatch(/^Odebrat From = … až .+$/);
  expect(slider).toBe('Odebrat Slider = nejvýše 40');
  expect(button('Zrušit filtry')).toBeTruthy();
});

// At 470 px two tags and "+2" fit (tags 102, 125, 174 and 165 px, an 8 px
// gap, Clear filters 106 px).
const narrow = '470px';
const allSelected = {
  status: ['paid', 'overdue'],
  customer: ['acme', 'birch'],
};

test('summary: narrow, "+N" names and counts the hidden tags', async () => {
  render(<SummaryHarness initial={allSelected} width={narrow} />);
  await vi.waitFor(() => expect(moreTag()?.textContent).toBe('+2'));
  expect(moreTag()?.getAttribute('aria-label')).toBe('2 more filters');
  expect(moreTag()?.getAttribute('aria-expanded')).toBe('false');
  expect(lineButtons()).toHaveLength(2);
  expect(popoverButtons()).toHaveLength(0);
});

test('summary: narrow, "+N" lists the hidden tags; dismissing there moves focus to the next, then the root', async () => {
  const onChange = vi.fn();
  render(
    <SummaryHarness initial={allSelected} width={narrow} onChange={onChange} />
  );
  await vi.waitFor(() => expect(moreTag()?.textContent).toBe('+2'));
  const more = moreTag();
  if (!more) throw new Error('No "+N" tag');
  await userEvent.click(more);
  expect(more.getAttribute('aria-expanded')).toBe('true');
  expect(
    document.getElementById(more.getAttribute('aria-controls') ?? '')
  ).toBeTruthy();
  expect(
    popoverButtons().map((item) => item.getAttribute('aria-label'))
  ).toEqual([
    'Remove filter Customer: Acme Trading',
    'Remove filter Customer: Birch Studio',
  ]);
  // A click there leaves the popover open while tags stay hidden.
  await userEvent.click(dismissInPopover('Customer: Birch Studio'));
  expect(onChange).toHaveBeenLastCalledWith({
    status: ['paid', 'overdue'],
    customer: ['acme'],
  });
  await vi.waitFor(() => expect(more.textContent).toBe('+1'));
  await vi.waitFor(() =>
    expect(active()).toBe(dismissInPopover('Customer: Acme Trading'))
  );
  expect(more.getAttribute('aria-expanded')).toBe('true');
  await userEvent.keyboard('{Enter}');
  await vi.waitFor(() => expect(moreTag()).toBeNull());
  expect(more.getAttribute('aria-expanded')).toBe('false');
  expect(popoverButtons()).toHaveLength(0);
  expect(lineButtons()).toHaveLength(2);
  expect(active()).toBe(summaryRoot());
});

test('summary: narrow, Escape closes the popover and focuses "+N"', async () => {
  render(<SummaryHarness initial={allSelected} width={narrow} />);
  await vi.waitFor(() => expect(moreTag()?.textContent).toBe('+2'));
  const more = moreTag();
  if (!more) throw new Error('No "+N" tag');
  await userEvent.click(more);
  dismissInPopover('Customer: Acme Trading').focus();
  // The first Escape closes the dismiss button's tooltip (Carbon).
  await userEvent.keyboard('{Escape}');
  expect(more.getAttribute('aria-expanded')).toBe('true');
  await userEvent.keyboard('{Escape}');
  expect(more.getAttribute('aria-expanded')).toBe('false');
  expect(active()).toBe(more);
});

test('summary: narrow, dismissing the last shown tag focuses the shown tag in its place', async () => {
  render(<SummaryHarness initial={allSelected} width={narrow} />);
  await vi.waitFor(() => expect(moreTag()?.textContent).toBe('+2'));
  dismiss('Status: Overdue').focus();
  await userEvent.keyboard('{Enter}');
  // Customer: Acme Trading moves up into the line.
  await vi.waitFor(() => expect(moreTag()?.textContent).toBe('+1'));
  await vi.waitFor(() =>
    expect(active()).toBe(dismiss('Customer: Acme Trading'))
  );
  expect(active()).not.toBe(document.body);
});

test('summary: after the last tag goes, new filters are measured again', async () => {
  const at = (value: FilterPanelValue) => (
    <div style={{ inlineSize: narrow }}>
      <FilterSummary groups={groups} value={value} onChange={() => undefined} />
    </div>
  );
  const { rerender } = render(at(allSelected));
  await vi.waitFor(() => expect(moreTag()?.textContent).toBe('+2'));
  rerender(at({}));
  expect(summaryRoot().childElementCount).toBe(0);
  rerender(at({ status: ['paid'] }));
  await vi.waitFor(() =>
    expect(
      document.querySelector('[data-offset]')?.hasAttribute('data-hidden')
    ).toBe(true)
  );
  expect(lineButtons()).toHaveLength(1);
  expect(moreTag()).toBeNull();
  rerender(at(allSelected));
  await vi.waitFor(() => expect(moreTag()?.textContent).toBe('+2'));
});

test('summary: at most 10 tags in the line; custom "+N" name', async () => {
  const many: FilterPanelGroup[] = [
    {
      id: 'n',
      label: 'N',
      options: Array.from({ length: 11 }, (_, index) => ({
        value: String(index),
        label: String(index),
      })),
    },
  ];
  render(
    <div style={{ inlineSize: '200rem' }}>
      <FilterSummary
        groups={many}
        value={{ n: Array.from({ length: 11 }, (_, index) => String(index)) }}
        onChange={() => undefined}
        messages={{ moreFilters: (count) => `Další filtry: ${count}` }}
      />
    </div>
  );
  const more = () => screen.queryByRole('button', { name: /^Další filtry/ });
  await vi.waitFor(() => expect(more()?.textContent).toBe('+1'));
  expect(more()?.getAttribute('aria-label')).toBe('Další filtry: 1');
  expect(lineButtons()).toHaveLength(10);
});
