import { render, screen } from '@testing-library/react';
import { createRef, useState } from 'react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import {
  defaultFilterSummaryMessages,
  FilterSummary,
} from './FilterSummary.js';
import { filterTags } from './value.js';
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
const closeButtons = (label: string | RegExp, within: string) =>
  screen
    .queryAllByLabelText<HTMLButtonElement>(label, { selector: 'button' })
    .filter((item) => item.closest(within));
// TagOverflow keeps its popover list in the DOM while closed.
const lineButtons = (label: string | RegExp = /^Remove filter /) =>
  closeButtons(label, '.c4p--tag-overflow__tag-container');
const popoverButtons = (label: string | RegExp = /^Remove filter /) =>
  closeButtons(label, '.c4p--tag-overflow-popover__tag-list');
const names = (found: HTMLButtonElement[]) =>
  found.map((item) => item.getAttribute('aria-label'));
const dismiss = (label: string) => {
  const [item] = lineButtons(`Remove filter ${label}`);
  if (!item) throw new Error(`No tag ${label}`);
  return item;
};
const moreTag = () => screen.queryByRole('button', { name: /^\+\d+$/ });

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
  await vi.waitFor(() =>
    expect(names(lineButtons())).toEqual([
      'Remove filter Status: Paid',
      'Remove filter Customer: Birch Studio',
    ])
  );
  expect(summaryRoot().textContent).toContain('Status: Paid');
  expect(button('Clear filters')).toBeTruthy();
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
    defaultFilterSummaryMessages
  ).map((tag) => `Remove filter ${tag.label}`);
  expect(expected).toHaveLength(10);
  await vi.waitFor(() => expect(names(lineButtons())).toEqual(expected));
});

test('summary: dismissing a tag removes its value and focuses the root', async () => {
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
  expect(active()).toBe(summaryRoot());
  await vi.waitFor(() => expect(lineButtons()).toHaveLength(2));
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
          // No start: no filter.
          from: [null, '2026-02-10'],
          slider: 40,
        }}
        onChange={() => undefined}
        messages={{
          tagLabel: (group, value) => `${group} = ${value}`,
          removeFilter: (label) => `Odebrat ${label}`,
          clearFilters: 'Zrušit filtry',
          dateRangeValue: (start, end, range) =>
            range ?? `${start} až ${end ?? '…'}`,
          atMostValue: (value) => `nejvýše ${value}`,
        }}
      />
    </div>
  );
  await vi.waitFor(() => expect(lineButtons(/^Odebrat /)).toHaveLength(3));
  const [checkbox, start, slider] = names(lineButtons(/^Odebrat /));
  expect(checkbox).toBe('Odebrat Checkbox = Alpha');
  expect(start).toMatch(/^Odebrat Range = .+ až …$/);
  expect(slider).toBe('Odebrat Slider = nejvýše 40');
  expect(button('Zrušit filtry')).toBeTruthy();
});

test('summary: narrow, "+N" counts, lists and dismisses the hidden tags', async () => {
  const onChange = vi.fn();
  render(
    <SummaryHarness
      initial={{
        status: ['paid', 'overdue'],
        customer: ['acme', 'birch'],
      }}
      onChange={onChange}
      width="470px"
    />
  );
  // The first render shows "+4" before the tags are measured.
  await vi.waitFor(() => {
    expect(moreTag()).toBeTruthy();
    expect(lineButtons().length).toBeGreaterThan(0);
  });
  const shown = lineButtons().length;
  expect(shown).toBeLessThan(4);
  const more = moreTag();
  if (!more) throw new Error('No "+N" tag');
  expect(more.textContent).toBe(`+${4 - shown}`);
  expect(popoverButtons().some((item) => item.checkVisibility())).toBe(false);
  await userEvent.click(more);
  expect(more.getAttribute('aria-expanded')).toBe('true');
  await vi.waitFor(() =>
    expect(popoverButtons().every((item) => item.checkVisibility())).toBe(true)
  );
  expect(names(popoverButtons())).toEqual(
    [
      'Remove filter Status: Paid',
      'Remove filter Status: Overdue',
      'Remove filter Customer: Acme Trading',
      'Remove filter Customer: Birch Studio',
    ].slice(shown)
  );
  const last = popoverButtons().at(-1);
  if (!last) throw new Error('No hidden tag');
  await userEvent.click(last);
  expect(onChange).toHaveBeenLastCalledWith({
    status: ['paid', 'overdue'],
    customer: ['acme'],
  });
  expect(active()).toBe(summaryRoot());
});

test('summary: at most 10 tags in the line', async () => {
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
      />
    </div>
  );
  await vi.waitFor(() => expect(moreTag()?.textContent).toBe('+1'));
  expect(lineButtons()).toHaveLength(10);
});
