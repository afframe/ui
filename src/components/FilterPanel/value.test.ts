import { expect, test } from 'vitest';
import {
  formatDate,
  formatDateRange,
  formatNumber,
} from '../../format/index.js';
import { defaultFilterSummaryMessages } from './FilterSummary.js';
import {
  countFilterPanelSelections,
  filterTags,
  sameFilterValue,
  setGroupValue,
} from './value.js';
import type { FilterPanelGroup, FilterPanelValue } from './value.js';

const options = [
  { value: 'paid', label: 'Paid' },
  { value: 'overdue', label: 'Overdue' },
];
const status = { id: 'status', label: 'Status', options } as const;
const tags = {
  id: 'tags',
  label: 'Tags',
  variant: 'multiselect',
  options,
} as const;
const kind = { id: 'kind', label: 'Kind', variant: 'radio', options } as const;
const state = {
  id: 'state',
  label: 'State',
  variant: 'select',
  options,
} as const;
const note = { id: 'note', label: 'Note', variant: 'text' } as const;
const total = { id: 'total', label: 'Total', variant: 'number' } as const;
const issued = { id: 'issued', label: 'Issued', variant: 'dateRange' } as const;
const amount = {
  id: 'amount',
  label: 'Amount',
  variant: 'slider',
  min: 0,
  max: 10000,
} as const;
const groups: FilterPanelGroup[] = [
  status,
  tags,
  kind,
  state,
  note,
  total,
  issued,
  amount,
];

test('setGroupValue removes the key for every empty value', () => {
  const base: FilterPanelValue = { other: ['x'] };
  expect(setGroupValue(base, status, [])).toEqual(base);
  expect(setGroupValue(base, tags, [])).toEqual(base);
  expect(setGroupValue(base, kind, '')).toEqual(base);
  expect(setGroupValue(base, state, '')).toEqual(base);
  expect(setGroupValue(base, note, '')).toEqual(base);
  expect(setGroupValue(base, note, '  ')).toEqual(base);
  expect(setGroupValue(base, total, Number.NaN)).toEqual(base);
  expect(setGroupValue(base, total, Number.POSITIVE_INFINITY)).toEqual(base);
  expect(setGroupValue(base, issued, [null, null])).toEqual(base);
  expect(setGroupValue(base, amount, 10000)).toEqual(base);
  expect(setGroupValue(base, status, undefined)).toEqual(base);
  expect(setGroupValue({ note: 'a' }, note, ' ')).toEqual({});
});

test('setGroupValue keeps 0 and other values', () => {
  expect(setGroupValue({}, total, 0)).toEqual({ total: 0 });
  expect(setGroupValue({}, amount, 0)).toEqual({ amount: 0 });
  expect(setGroupValue({}, amount, 9999)).toEqual({ amount: 9999 });
  expect(setGroupValue({}, status, ['paid'])).toEqual({ status: ['paid'] });
  expect(setGroupValue({}, kind, 'paid')).toEqual({ kind: 'paid' });
  expect(setGroupValue({}, note, ' a ')).toEqual({ note: ' a ' });
  expect(setGroupValue({}, issued, ['2026-10-01', null])).toEqual({
    issued: ['2026-10-01', null],
  });
  expect(setGroupValue({ status: ['paid'] }, status, ['overdue'])).toEqual({
    status: ['overdue'],
  });
});

test('sameFilterValue compares per variant', () => {
  const same = (a: FilterPanelValue, b: FilterPanelValue) =>
    sameFilterValue(groups, a, b);
  expect(
    same({ status: ['paid', 'overdue'] }, { status: ['overdue', 'paid'] })
  ).toBe(true);
  expect(
    same({ tags: ['paid', 'overdue'] }, { tags: ['overdue', 'paid'] })
  ).toBe(true);
  expect(same({ status: ['paid'] }, { status: ['paid', 'overdue'] })).toBe(
    false
  );
  expect(same({ status: [] }, {})).toBe(true);
  expect(same({ kind: 'paid' }, { kind: 'paid' })).toBe(true);
  expect(same({ kind: 'paid' }, { kind: 'overdue' })).toBe(false);
  expect(same({ note: '  ' }, {})).toBe(true);
  expect(same({ total: 0 }, {})).toBe(false);
  expect(same({ total: 0 }, { total: 0 })).toBe(true);
  expect(same({ total: Number.NaN }, {})).toBe(true);
  expect(same({ amount: 10000 }, {})).toBe(true);
  expect(same({ amount: 5 }, { amount: 6 })).toBe(false);
  expect(
    same({ issued: ['2026-10-01', null] }, { issued: ['2026-10-01', null] })
  ).toBe(true);
  expect(
    same(
      { issued: ['2026-10-01', null] },
      { issued: ['2026-10-01', '2026-10-31'] }
    )
  ).toBe(false);
  expect(same({ issued: [null, null] }, {})).toBe(true);
});

test('filterTags: one tag per known option, without() drops only it', () => {
  const value: FilterPanelValue = {
    status: ['paid', 'gone', 'overdue'],
    tags: ['overdue'],
  };
  const result = filterTags(groups, value, defaultFilterSummaryMessages);
  expect(result.map((tag) => tag.label)).toEqual([
    'Status: Paid',
    'Status: Overdue',
    'Tags: Overdue',
  ]);
  expect(new Set(result.map((tag) => tag.key)).size).toBe(3);
  expect(result[0]?.without()).toEqual({
    status: ['gone', 'overdue'],
    tags: ['overdue'],
  });
  expect(result[2]?.without()).toEqual({
    status: ['paid', 'gone', 'overdue'],
  });
});

test('filterTags: single-value variants', () => {
  const value: FilterPanelValue = {
    kind: 'paid',
    state: 'unknown',
    note: 'acme',
    total: 1234.5,
    amount: 5000,
  };
  const result = filterTags(groups, value, defaultFilterSummaryMessages);
  expect(result.map((tag) => tag.label)).toEqual([
    'Kind: Paid',
    'State: unknown',
    'Note: acme',
    `Total: ${formatNumber(1234.5)}`,
    `Amount: up to ${formatNumber(5000)}`,
  ]);
  expect(result[0]?.without()).toEqual({
    state: 'unknown',
    note: 'acme',
    total: 1234.5,
    amount: 5000,
  });
  expect(result[4]?.without()).not.toHaveProperty('amount');
});

test('filterTags: date range text for both ends and only a start', () => {
  const label = (issuedValue: readonly [string | null, string | null]) =>
    filterTags(groups, { issued: issuedValue }, defaultFilterSummaryMessages)[0]
      ?.label;
  expect(label(['2026-10-01', '2026-10-31'])).toBe(
    `Issued: ${formatDateRange('2026-10-01', '2026-10-31')}`
  );
  expect(label(['2026-10-01', null])).toBe(
    `Issued: from ${formatDate('2026-10-01')}`
  );
  expect(label([null, null])).toBeUndefined();
  expect(
    filterTags(
      groups,
      { issued: ['2026-10-01', null] },
      defaultFilterSummaryMessages
    )[0]?.without()
  ).toEqual({});
});

test('filterTags: empty values give no tag; messages shape the text', () => {
  expect(
    filterTags(
      groups,
      { note: ' ', amount: 10000, total: Number.NaN, status: [] },
      defaultFilterSummaryMessages
    )
  ).toEqual([]);
  const [tag] = filterTags(
    groups,
    { amount: 5 },
    {
      ...defaultFilterSummaryMessages,
      tagLabel: (group, text) => `${group} = ${text}`,
      atMostValue: (text) => `≤ ${text}`,
    }
  );
  expect(tag?.label).toBe(`Amount = ≤ ${formatNumber(5)}`);
});

test('countFilterPanelSelections counts known options and 1 per other filter', () => {
  expect(countFilterPanelSelections(groups, {})).toBe(0);
  expect(
    countFilterPanelSelections(groups, {
      status: ['paid', 'gone', 'overdue'],
      tags: ['paid'],
      missing: ['x'],
    })
  ).toBe(3);
  expect(
    countFilterPanelSelections(groups, {
      kind: 'paid',
      state: 'unknown',
      note: 'acme',
      total: 0,
      issued: ['2026-10-01', null],
      amount: 5,
    })
  ).toBe(6);
  expect(
    countFilterPanelSelections(groups, {
      note: ' ',
      total: Number.NaN,
      issued: [null, null],
      amount: 10000,
    })
  ).toBe(0);
});

test('filterTags: a custom dateRange gets both ends and the joined range', () => {
  const calls: unknown[] = [];
  filterTags(
    [issued],
    { issued: ['2026-10-01', '2026-10-31'] },
    {
      ...defaultFilterSummaryMessages,
      dateRangeValue: (...args) => {
        calls.push(args);
        return '';
      },
    }
  );
  expect(calls).toEqual([
    [
      formatDate('2026-10-01'),
      formatDate('2026-10-31'),
      formatDateRange('2026-10-01', '2026-10-31'),
    ],
  ]);
});

test('a date day that is not an ISO day counts as missing', () => {
  // From a URL, for example: none of these may throw.
  const bad = { issued: ['soon', '2026-02-30'] } as const;
  expect(countFilterPanelSelections(groups, bad)).toBe(0);
  expect(filterTags(groups, bad, defaultFilterSummaryMessages)).toEqual([]);
  expect(setGroupValue({}, issued, bad.issued)).toEqual({});
  expect(sameFilterValue(groups, bad, {})).toBe(true);
  const [tag] = filterTags(
    groups,
    { issued: ['2026-10-01', '2026-10-31T00:00:00Z'] },
    defaultFilterSummaryMessages
  );
  expect(tag?.label).toBe(`Issued: from ${formatDate('2026-10-01')}`);
});

test('a date range without a start is no filter', () => {
  const endOnly = { issued: [null, '2026-10-31'] } as const;
  expect(setGroupValue({}, issued, endOnly.issued)).toEqual({});
  expect(filterTags(groups, endOnly, defaultFilterSummaryMessages)).toEqual([]);
  expect(countFilterPanelSelections(groups, endOnly)).toBe(0);
  expect(sameFilterValue(groups, endOnly, {})).toBe(true);
});
