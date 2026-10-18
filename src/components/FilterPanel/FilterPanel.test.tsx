import { render, screen } from '@testing-library/react';
import { createRef, useState } from 'react';
import { afterEach, expect, test, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { page, userEvent } from 'vitest/browser';
import { FilterFlyout } from './FilterFlyout.js';
import type { FilterFlyoutMessages } from './FilterFlyout.js';
import { countFilterPanelSelections, FilterPanel } from './FilterPanel.js';
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

function Harness({
  flyout = false,
  initial = {},
  onChange,
  messages,
  updateMethod = 'instant',
  onCancel,
}: {
  onCancel?: () => void;
  flyout?: boolean;
  initial?: FilterPanelValue;
  onChange?: (value: FilterPanelValue) => void;
  messages?: Partial<FilterFlyoutMessages>;
  updateMethod?: 'batch' | 'instant';
}) {
  const [value, setValue] = useState(initial);
  const Component = flyout ? FilterFlyout : FilterPanel;
  return (
    <>
      <button type="button">Before</button>
      <Component
        groups={groups}
        value={value}
        updateMethod={updateMethod}
        {...(onCancel ? { onCancel } : {})}
        resultCount={Object.values(value).flat().length}
        {...(messages ? { messages } : {})}
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

// Carbon names these buttons through a hidden tooltip (aria-labelledby),
// which Testing Library's role query does not read. TagSet also renders a
// hidden copy of every tag for measuring.
const shownByLabel = (label: string | RegExp) =>
  screen
    .queryAllByLabelText<HTMLButtonElement>(label, { selector: 'button' })
    .filter((item) => !item.closest('[aria-hidden="true"]'));

test('panel: search narrows the options and shows an empty message', async () => {
  render(<Harness />);
  await userEvent.click(screen.getByRole('button', { name: 'Customer' }));
  const search = screen.getByRole('searchbox', { name: 'Search Customer' });
  await userEvent.type(search, 'acm');
  expect(screen.getByRole('checkbox', { name: 'Acme Trading' })).toBeTruthy();
  expect(screen.queryByRole('checkbox', { name: 'Birch Studio' })).toBeNull();
  await userEvent.type(search, 'x');
  expect(screen.getByText('No matching options')).toBeTruthy();
});

test('panel: names, counts and message overrides', () => {
  render(
    <Harness
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
      groups={[
        {
          id: 'cost centre',
          label: 'Cost centre',
          defaultOpen: true,
          searchable: true,
          options: [{ value: 'head office', label: 'Head office' }],
        },
      ]}
      value={{}}
      onChange={onChange}
    />
  );
  const checkbox = screen.getByRole('checkbox', { name: 'Head office' });
  expect(checkbox.id).not.toMatch(/\s/);
  expect(
    screen.getByRole('searchbox', { name: 'Search Cost centre' }).id
  ).not.toMatch(/\s/);
  await userEvent.click(screen.getByText('Head office'));
  expect(onChange).toHaveBeenLastCalledWith({ 'cost centre': ['head office'] });
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
  const region = screen.getByRole('region', { name: 'Filters' });
  expect(ref.current).toBe(region);
  expect(region.tagName).toBe('SECTION');
  expect(region.dataset.testid).toBe('filters');
  expect(region.getAttribute('aria-describedby')).toBe('hint');
  expect(region.className).toBe('afframe-filter-panel extra');
});

test('batch: onChange only on Apply, with the draft; focus moves to the title', async () => {
  const onChange = vi.fn();
  render(<Harness updateMethod="batch" onChange={onChange} />);
  const apply = button('Apply');
  const cancel = button('Cancel');
  expect(apply).toHaveProperty('disabled', true);
  expect(cancel).toHaveProperty('disabled', true);
  await userEvent.click(screen.getByText('Paid'));
  await userEvent.click(screen.getByText('Overdue'));
  expect(onChange).not.toHaveBeenCalled();
  expect(checkbox('Paid').checked).toBe(true);
  expect(button('Status (2)')).toBeTruthy();
  expect(screen.getByRole('status').textContent).toBe('0 results');
  expect(apply).toHaveProperty('disabled', false);
  expect(cancel).toHaveProperty('disabled', false);
  // Unchecking back to the applied value disables both again.
  await userEvent.click(screen.getByText('Overdue'));
  await userEvent.click(screen.getByText('Paid'));
  expect(apply).toHaveProperty('disabled', true);
  await userEvent.click(screen.getByText('Paid'));
  apply.focus();
  await userEvent.keyboard('{Enter}');
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith({ status: ['paid'] });
  expect(active()).toBe(screen.getByRole('heading', { name: 'Filters' }));
  expect(apply).toHaveProperty('disabled', true);
  expect(screen.getByRole('status').textContent).toBe('1 result');
});

function PanelHarness(props: {
  onChange?: (value: FilterPanelValue) => void;
  onCancel?: () => void;
  onClose?: () => void;
  updateMethod?: 'batch' | 'instant';
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
        updateMethod={props.updateMethod ?? 'batch'}
        {...(props.onCancel ? { onCancel: props.onCancel } : {})}
        {...(props.onClose ? { onClose: props.onClose } : {})}
        onChange={(next) => {
          props.onChange?.(next);
          setValue(next);
        }}
      />
    </>
  );
}

test('batch: Cancel restores the applied value, calls onCancel, focuses the title', async () => {
  const onChange = vi.fn();
  const onCancel = vi.fn();
  render(<PanelHarness onChange={onChange} onCancel={onCancel} />);
  // With onCancel, Cancel stays enabled; Apply waits for a change.
  expect(button('Cancel')).toHaveProperty('disabled', false);
  expect(button('Apply')).toHaveProperty('disabled', true);
  await userEvent.click(screen.getByText('Overdue'));
  await userEvent.click(screen.getByText('Paid'));
  await userEvent.click(button('Cancel'));
  expect(onCancel).toHaveBeenCalledTimes(1);
  expect(onChange).not.toHaveBeenCalled();
  expect(checkbox('Paid').checked).toBe(true);
  expect(checkbox('Overdue').checked).toBe(false);
  expect(active()).toBe(screen.getByRole('heading', { name: 'Filters' }));
});

test('batch: an inline value keeps the draft; an outside change replaces it', async () => {
  render(<PanelHarness />);
  await userEvent.click(screen.getByText('Overdue'));
  await userEvent.click(button('Rerender'));
  expect(checkbox('Overdue').checked).toBe(true);
  expect(button('Apply')).toHaveProperty('disabled', false);
  await userEvent.click(button('Outside'));
  expect(checkbox('Paid').checked).toBe(false);
  expect(checkbox('Overdue').checked).toBe(true);
  expect(button('Apply')).toHaveProperty('disabled', true);
});

test('close button: only with onClose; in batch it discards the draft', async () => {
  render(<PanelHarness />);
  expect(shownByLabel('Close filter panel')).toHaveLength(0);
  cleanup();
  const onClose = vi.fn();
  const onChange = vi.fn();
  render(<PanelHarness onClose={onClose} onChange={onChange} />);
  await userEvent.click(screen.getByText('Overdue'));
  await userEvent.click(
    page.getByRole('button', { name: 'Close filter panel' })
  );
  expect(onClose).toHaveBeenCalledTimes(1);
  expect(onChange).not.toHaveBeenCalled();
  expect(checkbox('Overdue').checked).toBe(false);
  expect(button('Apply')).toHaveProperty('disabled', true);
});

test('panel: Enter opens a group', async () => {
  render(<Harness />);
  const customer = button('Customer');
  customer.focus();
  await userEvent.keyboard('{Enter}');
  expect(customer.getAttribute('aria-expanded')).toBe('true');
});

test('panel: headingLevel 3 renders an h3 that keeps the id and focus target', async () => {
  render(
    <FilterPanel
      headingLevel={3}
      updateMethod="batch"
      groups={groups}
      value={{}}
      onChange={() => undefined}
    />
  );
  const heading = screen.getByRole('heading', { name: 'Filters', level: 3 });
  expect(heading.tagName).toBe('H3');
  expect(heading.getAttribute('tabindex')).toBe('-1');
  const region = screen.getByRole('region', { name: 'Filters' });
  expect(region.getAttribute('aria-labelledby')).toBe(heading.id);
  await userEvent.click(screen.getByText('Paid'));
  await userEvent.click(button('Apply'));
  expect(active()).toBe(heading);
});

test('panel: the focused title shows a focus outline', async () => {
  render(<Harness updateMethod="batch" />);
  await userEvent.click(screen.getByText('Paid'));
  await userEvent.click(button('Apply'));
  const heading = screen.getByRole('heading', { name: 'Filters' });
  expect(active()).toBe(heading);
  const style = getComputedStyle(heading);
  expect(style.outlineStyle).toBe('solid');
  expect(style.outlineWidth).toBe('2px');
  expect(style.outlineOffset).toBe('-2px');
});

test('count ignores values that match no option', () => {
  const value = { status: ['paid', 'gone'], missing: ['x'] };
  expect(countFilterPanelSelections(groups, value)).toBe(1);
  render(<Harness flyout initial={value} />);
  expect(button('Filter (1)')).toBeTruthy();
});
