import { render, screen, within } from '@testing-library/react';
import { createRef, useState } from 'react';
import { afterEach, expect, test, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { FilterFlyout } from './FilterFlyout.js';
import type { FilterFlyoutProps } from './FilterFlyout.js';
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

const menuGroups: FilterPanelGroup[] = [
  {
    id: 'currency',
    label: 'Currency',
    variant: 'select',
    options: [
      { value: 'czk', label: 'CZK' },
      { value: 'eur', label: 'EUR' },
    ],
  },
  { id: 'issued', label: 'Issued', variant: 'dateRange' },
];

function Harness({
  initial = {},
  onChange,
  ...props
}: Partial<Omit<FilterFlyoutProps, 'value'>> & {
  initial?: FilterPanelValue;
}) {
  const [value, setValue] = useState(initial);
  return (
    <>
      <button type="button">Before</button>
      {/* At the right edge, so bottom-end has room as in a toolbar. */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <FilterFlyout
          groups={groups}
          resultCount={Object.values(value).flat().length}
          {...props}
          value={value}
          onChange={(next) => {
            onChange?.(next);
            setValue(next);
          }}
        />
      </div>
    </>
  );
}

const active = () => document.activeElement;
const button = (name: string) => screen.getByRole('button', { name });
const checkbox = (name: string) =>
  screen.getByRole<HTMLInputElement>('checkbox', { name });
function must<T>(found: T | null | undefined): T {
  if (found == null) throw new Error('Not found');
  return found;
}
const content = () =>
  must(document.querySelector<HTMLElement>('.afframe-filter-flyout-content'));
// PopoverContent puts the id on its outer span.
const contentId = () => must(content().parentElement).id;
const liveRegion = () =>
  document.querySelector('.afframe-filter-flyout > [role="status"]');
const openCalendar = () => document.querySelector('.flatpickr-calendar.open');

// Carbon names icon buttons through a hidden tooltip (aria-labelledby),
// which Testing Library's role query does not read.
const shownByLabel = (label: string | RegExp) =>
  screen
    .queryAllByLabelText<HTMLButtonElement>(label, { selector: 'button' })
    .filter((item) => !item.closest('[aria-hidden="true"]'));
const trigger = (name = 'Filter') => {
  const [found] = shownByLabel(name);
  if (!found) throw new Error(`No trigger named ${name}`);
  return found;
};

test('icon trigger: the count is in its name; it controls the content', async () => {
  render(<Harness initial={{ status: ['paid', 'overdue'] }} />);
  const toggle = trigger('Filter (2)');
  expect(toggle.getAttribute('aria-expanded')).toBe('false');
  expect(toggle.getAttribute('aria-controls')).toBe(contentId());
  await userEvent.click(toggle);
  expect(toggle.getAttribute('aria-expanded')).toBe('true');
});

test('text trigger: a button named with the count', async () => {
  render(<Harness trigger="text" initial={{ status: ['paid'] }} />);
  const toggle = button('Filter (1)');
  expect(shownByLabel('Filter (1)')).toHaveLength(0);
  expect(toggle.getAttribute('aria-controls')).toBe(contentId());
  await userEvent.click(toggle);
  expect(toggle.getAttribute('aria-expanded')).toBe('true');
});

test('content: 642 px wide below the trigger, fields in two columns', async () => {
  render(<Harness />);
  const toggle = trigger();
  await userEvent.click(toggle);
  const box = content().getBoundingClientRect();
  const anchor = toggle.getBoundingClientRect();
  expect(box.width).toBe(642);
  expect(box.top).toBeGreaterThanOrEqual(anchor.bottom - 1);
  expect(Math.abs(box.right - anchor.right)).toBeLessThan(2);
  const [first, second] = Array.from(
    content().querySelectorAll('.afframe-filter-panel-group'),
    (item) => item.getBoundingClientRect()
  );
  expect(must(second).top).toBe(must(first).top);
  expect(must(second).left).toBeGreaterThan(must(first).right - 1);
});

test('Escape on the trigger closes it', async () => {
  render(<Harness />);
  const toggle = trigger();
  await userEvent.click(toggle);
  expect(toggle.getAttribute('aria-expanded')).toBe('true');
  await userEvent.keyboard('{Escape}');
  expect(toggle.getAttribute('aria-expanded')).toBe('false');
  expect(active()).toBe(toggle);
});

test('Escape in a search with text clears it first', async () => {
  render(<Harness />);
  const toggle = trigger();
  await userEvent.click(toggle);
  const search = screen.getByRole('searchbox', { name: 'Search Customer' });
  await userEvent.type(search, 'birch');
  expect(screen.queryByRole('checkbox', { name: 'Acme Trading' })).toBeNull();
  await userEvent.keyboard('{Escape}');
  expect((search as HTMLInputElement).value).toBe('');
  expect(toggle.getAttribute('aria-expanded')).toBe('true');
  await userEvent.keyboard('{Escape}');
  expect(toggle.getAttribute('aria-expanded')).toBe('false');
  expect(active()).toBe(toggle);
});

test('Escape from a checkbox closes it and returns focus', async () => {
  render(<Harness />);
  const toggle = trigger();
  await userEvent.click(toggle);
  checkbox('Paid').focus();
  await userEvent.keyboard('{Escape}');
  expect(toggle.getAttribute('aria-expanded')).toBe('false');
  expect(active()).toBe(toggle);
});

test('Escape with an open dropdown closes only the dropdown', async () => {
  render(<Harness groups={menuGroups} />);
  const toggle = trigger();
  await userEvent.click(toggle);
  const currency = screen.getByRole('combobox', { name: 'Currency' });
  await userEvent.click(currency);
  expect(currency.getAttribute('aria-expanded')).toBe('true');
  await userEvent.keyboard('{Escape}');
  expect(currency.getAttribute('aria-expanded')).toBe('false');
  expect(toggle.getAttribute('aria-expanded')).toBe('true');
  await userEvent.keyboard('{Escape}');
  expect(toggle.getAttribute('aria-expanded')).toBe('false');
  expect(active()).toBe(toggle);
});

test('Escape with the calendar open closes only the calendar', async () => {
  render(<Harness groups={menuGroups} />);
  const toggle = trigger();
  await userEvent.click(toggle);
  await userEvent.click(screen.getByLabelText('Start date'));
  expect(openCalendar()).not.toBeNull();
  await userEvent.keyboard('{Escape}');
  expect(openCalendar()).toBeNull();
  expect(toggle.getAttribute('aria-expanded')).toBe('true');
  await userEvent.keyboard('{Escape}');
  expect(toggle.getAttribute('aria-expanded')).toBe('false');
});

test('picking a range in the calendar keeps the flyout open', async () => {
  const onChange = vi.fn();
  render(<Harness groups={menuGroups} onChange={onChange} />);
  const toggle = trigger();
  await userEvent.click(toggle);
  await userEvent.click(screen.getByLabelText('Start date'));
  const calendar = must(openCalendar());
  await userEvent.click(must(calendar.querySelector('.flatpickr-next-month')));
  // The calendar redraws its days after each pick.
  const day = (index: number) =>
    must(
      calendar.querySelectorAll<HTMLElement>(
        '.flatpickr-day:not(.prevMonthDay):not(.nextMonthDay)'
      )[index]
    );
  await userEvent.click(day(0));
  await userEvent.click(day(4));
  expect(toggle.getAttribute('aria-expanded')).toBe('true');
  expect(screen.getByLabelText<HTMLInputElement>('Start date').value).not.toBe(
    ''
  );
  await userEvent.click(button('Apply'));
  expect(onChange).toHaveBeenCalledWith({
    issued: [expect.any(String), expect.any(String)],
  });
});

test('a click outside with a picked day closes and discards the draft', async () => {
  const onChange = vi.fn();
  render(<Harness groups={menuGroups} onChange={onChange} />);
  const toggle = trigger();
  await userEvent.click(toggle);
  await userEvent.click(screen.getByLabelText('Start date'));
  await userEvent.click(
    must(
      openCalendar()?.querySelector<HTMLElement>(
        '.flatpickr-day:not(.prevMonthDay):not(.nextMonthDay)'
      )
    )
  );
  await userEvent.click(button('Before'));
  expect(toggle.getAttribute('aria-expanded')).toBe('false');
  await userEvent.click(toggle);
  expect(screen.getByLabelText<HTMLInputElement>('Start date').value).toBe('');
  expect(onChange).not.toHaveBeenCalled();
});

test('defaultOpen renders it open', () => {
  render(<Harness defaultOpen initial={{ status: ['paid', 'overdue'] }} />);
  expect(trigger('Filter (2)').getAttribute('aria-expanded')).toBe('true');
  expect(screen.getByRole('region', { name: 'Filter' })).toBeTruthy();
  expect(checkbox('Paid')).toBeTruthy();
});

test('instant: onChange runs per toggle and the flyout stays open', async () => {
  const onChange = vi.fn();
  render(<Harness updateMethod="instant" onChange={onChange} />);
  const toggle = trigger();
  await userEvent.tab();
  await userEvent.tab();
  expect(active()).toBe(toggle);
  await userEvent.keyboard('{Enter}');
  await userEvent.tab();
  expect(active()).toBe(checkbox('Paid'));
  await userEvent.keyboard(' ');
  expect(onChange).toHaveBeenLastCalledWith({ status: ['paid'] });
  await userEvent.click(screen.getByText('Overdue'));
  expect(onChange).toHaveBeenCalledTimes(2);
  expect(onChange).toHaveBeenLastCalledWith({ status: ['paid', 'overdue'] });
  expect(trigger('Filter (2)')).toBe(toggle);
  expect(within(content()).getByRole('status').textContent).toBe('2 results');
  expect(screen.queryByRole('button', { name: 'Apply' })).toBeNull();
  expect(toggle.getAttribute('aria-expanded')).toBe('true');
  await userEvent.click(button('Before'));
  expect(toggle.getAttribute('aria-expanded')).toBe('false');
});

test('batch: Apply applies, closes and focuses the trigger; so does Clear', async () => {
  const onChange = vi.fn();
  render(<Harness onChange={onChange} />);
  const toggle = trigger();
  await userEvent.click(toggle);
  await userEvent.click(screen.getByText('Paid'));
  expect(onChange).not.toHaveBeenCalled();
  expect(shownByLabel('Filter')).toEqual([toggle]);
  await userEvent.click(button('Apply'));
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith({ status: ['paid'] });
  expect(toggle.getAttribute('aria-expanded')).toBe('false');
  expect(active()).toBe(toggle);
  expect(trigger('Filter (1)')).toBe(toggle);
  await userEvent.click(toggle);
  expect(checkbox('Paid').checked).toBe(true);
  // No close button in the flyout, as upstream's.
  expect(shownByLabel('Close')).toHaveLength(0);
  await userEvent.click(button('Clear'));
  expect(onChange).toHaveBeenCalledTimes(2);
  expect(onChange).toHaveBeenLastCalledWith({});
  expect(toggle.getAttribute('aria-expanded')).toBe('false');
  expect(active()).toBe(toggle);
});

test('batch: Escape and a click outside discard the draft', async () => {
  const onChange = vi.fn();
  render(<Harness onChange={onChange} />);
  const toggle = trigger();
  await userEvent.click(toggle);
  await userEvent.click(screen.getByText('Paid'));
  await userEvent.keyboard('{Escape}');
  expect(toggle.getAttribute('aria-expanded')).toBe('false');
  expect(active()).toBe(toggle);
  await userEvent.click(toggle);
  expect(checkbox('Paid').checked).toBe(false);
  await userEvent.click(screen.getByText('Overdue'));
  await userEvent.click(button('Before'));
  expect(toggle.getAttribute('aria-expanded')).toBe('false');
  await userEvent.click(toggle);
  expect(checkbox('Overdue').checked).toBe(false);
  expect(onChange).not.toHaveBeenCalled();
});

test('live region: the result count while closed, empty while open', async () => {
  render(<Harness />);
  const toggle = trigger();
  expect(liveRegion()?.textContent).toBe('0 results');
  await userEvent.click(toggle);
  expect(liveRegion()?.textContent).toBe('');
  await userEvent.click(screen.getByText('Paid'));
  await userEvent.click(button('Apply'));
  expect(liveRegion()?.textContent).toBe('1 result');
});

test('ref, rest props and onKeyDownCapture reach the root; Escape and a click outside still close', async () => {
  const ref = createRef<HTMLDivElement>();
  const onKeyDownCapture = vi.fn();
  render(
    <Harness
      ref={ref}
      data-testid="flyout"
      onKeyDownCapture={onKeyDownCapture}
      initial={{ status: ['paid', 'overdue'] }}
    />
  );
  expect(ref.current?.classList.contains('afframe-filter-flyout')).toBe(true);
  expect(ref.current?.dataset.testid).toBe('flyout');
  const toggle = trigger('Filter (2)');
  expect(ref.current?.contains(toggle)).toBe(true);
  await userEvent.click(toggle);
  await userEvent.click(screen.getByText('Paid'));
  expect(toggle.getAttribute('aria-expanded')).toBe('true');
  checkbox('Overdue').focus();
  await userEvent.keyboard('{Escape}');
  expect(onKeyDownCapture).toHaveBeenCalledWith(
    expect.objectContaining({ key: 'Escape' })
  );
  expect(toggle.getAttribute('aria-expanded')).toBe('false');
  expect(active()).toBe(toggle);
  await userEvent.click(toggle);
  await userEvent.click(button('Before'));
  expect(toggle.getAttribute('aria-expanded')).toBe('false');
});
