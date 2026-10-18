import { render, screen } from '@testing-library/react';
import { createRef, useState } from 'react';
import { afterEach, expect, test, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { FilterSummary } from './FilterSummary.js';
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

const active = () => document.activeElement;
const button = (name: string) => screen.getByRole('button', { name });

// Carbon names these buttons through a hidden tooltip (aria-labelledby),
// which Testing Library's role query does not read. TagSet also renders a
// hidden copy of every tag for measuring.
const shownByLabel = (label: string | RegExp) =>
  screen
    .queryAllByLabelText<HTMLButtonElement>(label, { selector: 'button' })
    .filter((item) => !item.closest('[aria-hidden="true"]'));
const removeButtons = () => shownByLabel(/^Remove filter /);
const dismiss = (label: string) => {
  const [found] = shownByLabel(`Remove filter ${label}`);
  if (!found) throw new Error(`No tag ${label}`);
  return found;
};

function SummaryHarness({
  initial,
  onChange,
  // Wide enough that no tag overflows into "+N".
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
  await vi.waitFor(() => expect(removeButtons()).toHaveLength(2));
  expect(
    removeButtons().map((item) => item.getAttribute('aria-label'))
  ).toEqual([
    'Remove filter Status: Paid',
    'Remove filter Customer: Birch Studio',
  ]);
  expect(
    screen.getByRole('group', { name: 'Selected filters' }).textContent
  ).toContain('Status: Paid');
  expect(button('Clear filters')).toBeTruthy();
});

test('summary: dismissing a tag removes its value and keeps focus on the tags', async () => {
  const onChange = vi.fn();
  render(
    <SummaryHarness
      initial={{ status: ['paid', 'overdue'], customer: ['acme'] }}
      onChange={onChange}
    />
  );
  await vi.waitFor(() => expect(removeButtons()).toHaveLength(3));
  dismiss('Status: Paid').focus();
  await userEvent.keyboard('{Enter}');
  expect(onChange).toHaveBeenLastCalledWith({
    status: ['overdue'],
    customer: ['acme'],
  });
  await vi.waitFor(() => expect(removeButtons()).toHaveLength(2));
  expect(active()).toBe(dismiss('Status: Overdue'));
  // The last tag hands focus to the one before it, then to the root.
  dismiss('Customer: Acme Trading').focus();
  await userEvent.keyboard('{Enter}');
  expect(onChange).toHaveBeenLastCalledWith({ status: ['overdue'] });
  expect(active()).toBe(dismiss('Status: Overdue'));
  await userEvent.keyboard('{Enter}');
  expect(onChange).toHaveBeenLastCalledWith({});
  expect(active()).toBe(
    screen.getByRole('group', { name: 'Selected filters' })
  );
});

test('summary: Clear filters calls onChange({}) and focuses the root', async () => {
  const onChange = vi.fn();
  render(<SummaryHarness initial={{ status: ['paid'] }} onChange={onChange} />);
  button('Clear filters').focus();
  await userEvent.keyboard('{Enter}');
  expect(onChange).toHaveBeenCalledWith({});
  const root = screen.getByRole('group', { name: 'Selected filters' });
  expect(active()).toBe(root);
  expect(root.childElementCount).toBe(0);
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

// At 470 px two tags and "+2" fit (tag widths 113, 138, 189 and 180 px,
// Clear filters 108 px, View all 48 px); without Status: Overdue the
// Customer: Acme Trading tag does not take its place.
const narrow = '470px';
const allSelected = {
  status: ['paid', 'overdue'],
  customer: ['acme', 'birch'],
};
const overflowTag = () => {
  const [found] = screen
    .queryAllByRole('button', { name: /^\+\d+$/ })
    .filter((item) => !item.closest('[aria-hidden="true"]'));
  if (!found) throw new Error('No "+N" tag');
  return found;
};
const summaryRoot = () =>
  screen.getByRole('group', { name: 'Selected filters' });

test('summary: narrow, "+N" holds the rest and View all toggles multiline', async () => {
  render(<SummaryHarness initial={allSelected} width={narrow} />);
  await vi.waitFor(() => expect(overflowTag().textContent).toBe('+2'));
  expect(removeButtons()).toHaveLength(2);
  const viewAll = () => {
    const [found] = shownByLabel('View all');
    if (!found) throw new Error('No View all');
    return found;
  };
  expect(viewAll().getAttribute('aria-expanded')).toBe('false');
  await userEvent.click(viewAll());
  expect(viewAll().getAttribute('aria-expanded')).toBe('true');
  expect(summaryRoot().className).toContain('--filter-summary__expanded');
  await vi.waitFor(() => expect(removeButtons()).toHaveLength(4));
  await userEvent.click(viewAll());
  await vi.waitFor(() => expect(overflowTag().textContent).toBe('+2'));
  expect(viewAll().getAttribute('aria-expanded')).toBe('false');
  expect(summaryRoot().className).not.toContain('--filter-summary__expanded');
  expect(removeButtons()).toHaveLength(2);
});

test('summary: narrow, View all keeps keyboard focus when it collapses', async () => {
  render(<SummaryHarness initial={allSelected} width={narrow} />);
  await vi.waitFor(() => expect(overflowTag().textContent).toBe('+2'));
  const [viewAll] = shownByLabel('View all');
  if (!viewAll) throw new Error('No View all');
  viewAll.focus();
  await userEvent.keyboard('{Enter}');
  await vi.waitFor(() => expect(removeButtons()).toHaveLength(4));
  expect(active()).toBe(viewAll);
  await userEvent.keyboard('{Enter}');
  await vi.waitFor(() => expect(overflowTag().textContent).toBe('+2'));
  expect(viewAll.isConnected).toBe(true);
  expect(viewAll.getAttribute('aria-expanded')).toBe('false');
  expect(active()).toBe(viewAll);
});

test('summary: narrow, View all collapsing with nothing left to overflow focuses the root', async () => {
  render(<SummaryHarness initial={allSelected} width={narrow} />);
  await vi.waitFor(() => expect(overflowTag().textContent).toBe('+2'));
  const [viewAll] = shownByLabel('View all');
  if (!viewAll) throw new Error('No View all');
  await userEvent.click(viewAll);
  await vi.waitFor(() => expect(removeButtons()).toHaveLength(4));
  await userEvent.click(dismiss('Customer: Birch Studio'));
  await userEvent.click(dismiss('Customer: Acme Trading'));
  await vi.waitFor(() => expect(removeButtons()).toHaveLength(2));
  viewAll.focus();
  await userEvent.keyboard('{Enter}');
  await vi.waitFor(() => expect(viewAll.isConnected).toBe(false));
  await vi.waitFor(() => expect(active()).toBe(summaryRoot()));
  expect(removeButtons()).toHaveLength(2);
});

test('summary: narrow, dismissing the last shown tag keeps focus on a tag', async () => {
  render(<SummaryHarness initial={allSelected} width={narrow} />);
  await vi.waitFor(() => expect(overflowTag().textContent).toBe('+2'));
  dismiss('Status: Overdue').focus();
  await userEvent.keyboard('{Enter}');
  await vi.waitFor(() => expect(removeButtons()).toHaveLength(1));
  expect(active()).toBe(dismiss('Status: Paid'));
});

test('summary: narrow, dismissing the last tag in "+N" keeps focus on a tag', async () => {
  render(<SummaryHarness initial={allSelected} width={narrow} />);
  await vi.waitFor(() => expect(overflowTag().textContent).toBe('+2'));
  await userEvent.click(overflowTag());
  await vi.waitFor(() => expect(removeButtons()).toHaveLength(4));
  dismiss('Customer: Birch Studio').focus();
  await userEvent.keyboard('{Enter}');
  await vi.waitFor(() => expect(overflowTag().textContent).toBe('+1'));
  expect(active()).toBe(dismiss('Customer: Acme Trading'));
});

test('summary: after the last tag goes, new filters start on one line', async () => {
  const at = (value: FilterPanelValue) => (
    <div style={{ inlineSize: narrow }}>
      <FilterSummary groups={groups} value={value} onChange={() => undefined} />
    </div>
  );
  const { rerender } = render(at(allSelected));
  await vi.waitFor(() => expect(overflowTag().textContent).toBe('+2'));
  const [viewAll] = shownByLabel('View all');
  if (!viewAll) throw new Error('No View all');
  await userEvent.click(viewAll);
  expect(summaryRoot().className).toContain('--filter-summary__expanded');
  rerender(at({}));
  rerender(at(allSelected));
  expect(summaryRoot().className).not.toContain('--filter-summary__expanded');
  await vi.waitFor(() => expect(overflowTag().textContent).toBe('+2'));
});
