import { render, screen } from '@testing-library/react';
import { useState } from 'react';
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
}: {
  flyout?: boolean;
  initial?: FilterPanelValue;
  onChange?: (value: FilterPanelValue) => void;
  messages?: Partial<FilterFlyoutMessages>;
}) {
  const [value, setValue] = useState(initial);
  const Component = flyout ? FilterFlyout : FilterPanel;
  return (
    <>
      <button type="button">Before</button>
      <Component
        groups={groups}
        value={value}
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
// The dismiss button is named through Carbon's tooltip (aria-labelledby).
const dismiss = (label: string) =>
  screen.getByLabelText(`Remove filter ${label}`, { selector: 'button' });

test('flyout: open, tab through groups, toggle, clear all, Escape', async () => {
  const onChange = vi.fn();
  render(<Harness flyout onChange={onChange} />);
  const toggle = screen.getByRole('button', { name: 'Filter' });
  expect(toggle.getAttribute('aria-expanded')).toBe('false');

  await userEvent.tab();
  await userEvent.tab();
  expect(active()).toBe(toggle);
  await userEvent.keyboard('{Enter}');
  expect(toggle.getAttribute('aria-expanded')).toBe('true');
  expect(active()).toBe(toggle);

  // Tab into the panel: first group heading, then its checkboxes.
  await userEvent.tab();
  expect(active()?.textContent).toBe('Status');
  expect(active()?.getAttribute('aria-expanded')).toBe('true');
  await userEvent.tab();
  expect(active()).toBe(screen.getByRole('checkbox', { name: 'Paid' }));
  await userEvent.keyboard(' ');
  expect(onChange).toHaveBeenLastCalledWith({ status: ['paid'] });
  expect(screen.getByRole('button', { name: 'Filter (1)' })).toBe(toggle);
  expect(screen.getByRole('status').textContent).toBe('1 result');

  await userEvent.tab();
  await userEvent.keyboard(' ');
  await userEvent.tab();
  expect(active()?.textContent).toBe('Customer');

  // Clear all keeps the flyout open and moves focus to the panel title.
  screen.getByRole('button', { name: 'Clear all' }).focus();
  await userEvent.keyboard('{Enter}');
  expect(onChange).toHaveBeenLastCalledWith({});
  expect(toggle.getAttribute('aria-expanded')).toBe('true');
  expect(active()).toBe(screen.getByRole('heading', { name: 'Filters' }));
  expect(toggle.getAttribute('aria-expanded')).toBe('true');

  await userEvent.keyboard('{Escape}');
  expect(toggle.getAttribute('aria-expanded')).toBe('false');
  expect(active()).toBe(toggle);
});

test('flyout: Escape on the button closes it', async () => {
  render(<Harness flyout />);
  const toggle = screen.getByRole('button', { name: 'Filter' });
  await userEvent.click(toggle);
  expect(toggle.getAttribute('aria-expanded')).toBe('true');
  await userEvent.keyboard('{Escape}');
  expect(toggle.getAttribute('aria-expanded')).toBe('false');
  expect(active()).toBe(toggle);
});

test('flyout: Escape in a search with text clears it first', async () => {
  render(<Harness flyout />);
  const toggle = screen.getByRole('button', { name: 'Filter' });
  await userEvent.click(toggle);
  await userEvent.click(screen.getByRole('button', { name: 'Customer' }));
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

test('panel: dismissing a tag moves focus to the next tag, then the title', async () => {
  render(<Harness initial={{ status: ['paid', 'overdue'] }} />);
  expect(
    screen.getByRole('list', { name: 'Selected filters' }).children
  ).toHaveLength(2);
  dismiss('Paid').focus();
  await userEvent.keyboard('{Enter}');
  const overdue = dismiss('Overdue');
  expect(active()).toBe(overdue);
  expect(screen.getByRole('checkbox', { name: 'Paid' })).toHaveProperty(
    'checked',
    false
  );
  await userEvent.keyboard('{Enter}');
  expect(active()).toBe(screen.getByRole('heading', { name: 'Filters' }));
  expect(screen.queryByRole('list', { name: 'Selected filters' })).toBeNull();
});

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

test('flyout: removing filters keeps it open; a click outside closes it', async () => {
  render(<Harness flyout initial={{ status: ['paid', 'overdue'] }} />);
  const toggle = screen.getByRole('button', { name: 'Filter (2)' });
  await userEvent.click(toggle);
  await userEvent.click(dismiss('Paid'));
  expect(toggle.getAttribute('aria-expanded')).toBe('true');
  dismiss('Overdue').focus();
  await userEvent.keyboard('{Enter}');
  expect(toggle.getAttribute('aria-expanded')).toBe('true');
  expect(toggle.textContent).toBe('Filter');
  await userEvent.click(screen.getByRole('button', { name: 'Before' }));
  expect(toggle.getAttribute('aria-expanded')).toBe('false');
});

test('flyout: Escape from a checkbox closes it and returns focus', async () => {
  render(<Harness flyout />);
  const toggle = screen.getByRole('button', { name: 'Filter' });
  await userEvent.click(toggle);
  screen.getByRole('checkbox', { name: 'Paid' }).focus();
  await userEvent.keyboard('{Escape}');
  expect(toggle.getAttribute('aria-expanded')).toBe('false');
  expect(active()).toBe(toggle);
});

test('panel: Enter opens a group, Space removes a tag, names are exposed', async () => {
  render(<Harness initial={{ status: ['paid'] }} />);
  await expect
    .element(page.getByRole('button', { name: 'Remove filter Paid' }))
    .toBeInTheDocument();
  const customer = screen.getByRole('button', { name: 'Customer' });
  customer.focus();
  await userEvent.keyboard('{Enter}');
  expect(customer.getAttribute('aria-expanded')).toBe('true');
  dismiss('Paid').focus();
  await userEvent.keyboard(' ');
  expect(active()).toBe(screen.getByRole('heading', { name: 'Filters' }));
  expect(screen.getByRole('status').textContent).toBe('0 results');
});

test('count ignores values that match no option', async () => {
  const value = { status: ['paid', 'gone'], missing: ['x'] };
  expect(countFilterPanelSelections(groups, value)).toBe(1);
  render(<Harness flyout initial={value} />);
  const toggle = screen.getByRole('button', { name: 'Filter (1)' });
  await userEvent.click(toggle);
  expect(
    screen.getByRole('list', { name: 'Selected filters' }).children
  ).toHaveLength(1);
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
