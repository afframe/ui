import { render, screen } from '@testing-library/react';
import { createRef, useState } from 'react';
import { afterEach, expect, test, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { userEvent } from 'vitest/browser';
import { FilterFlyout } from './FilterFlyout.js';
import type {
  FilterFlyoutMessages,
  FilterFlyoutProps,
} from './FilterFlyout.js';
import { FilterPanel } from './FilterPanel.js';
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

test('flyout: Escape from a checkbox closes it and returns focus', async () => {
  render(<Harness flyout />);
  const toggle = screen.getByRole('button', { name: 'Filter' });
  await userEvent.click(toggle);
  screen.getByRole('checkbox', { name: 'Paid' }).focus();
  await userEvent.keyboard('{Escape}');
  expect(toggle.getAttribute('aria-expanded')).toBe('false');
  expect(active()).toBe(toggle);
});

test('flyout: defaultOpen renders it open', () => {
  render(<FilterFlyoutHarness defaultOpen />);
  const toggle = screen.getByRole('button', { name: 'Filter (2)' });
  expect(toggle.getAttribute('aria-expanded')).toBe('true');
  expect(screen.getByRole('region', { name: 'Filters' })).toBeTruthy();
  expect(screen.getByRole('checkbox', { name: 'Paid' })).toBeTruthy();
});

function FilterFlyoutHarness(
  props: Omit<FilterFlyoutProps, 'groups' | 'value' | 'onChange'>
) {
  const [value, setValue] = useState<FilterPanelValue>({
    status: ['paid', 'overdue'],
  });
  return (
    <FilterFlyout
      {...props}
      groups={groups}
      value={value}
      onChange={setValue}
    />
  );
}

test('instant: onChange runs per toggle and the flyout stays open', async () => {
  const onChange = vi.fn();
  render(<Harness flyout onChange={onChange} />);
  const toggle = button('Filter');
  await userEvent.tab();
  await userEvent.tab();
  expect(active()).toBe(toggle);
  await userEvent.keyboard('{Enter}');
  await userEvent.tab();
  expect(active()?.textContent).toBe('Status');
  await userEvent.tab();
  expect(active()).toBe(checkbox('Paid'));
  await userEvent.keyboard(' ');
  expect(onChange).toHaveBeenLastCalledWith({ status: ['paid'] });
  await userEvent.click(screen.getByText('Overdue'));
  expect(onChange).toHaveBeenCalledTimes(2);
  expect(onChange).toHaveBeenLastCalledWith({ status: ['paid', 'overdue'] });
  expect(button('Filter (2)')).toBe(toggle);
  expect(screen.getByRole('status').textContent).toBe('2 results');
  expect(screen.queryByRole('button', { name: 'Apply' })).toBeNull();
  expect(toggle.getAttribute('aria-expanded')).toBe('true');
  await userEvent.click(button('Before'));
  expect(toggle.getAttribute('aria-expanded')).toBe('false');
});

test('flyout batch: Apply applies, closes and focuses the trigger; Cancel calls onCancel', async () => {
  const onChange = vi.fn();
  const onCancel = vi.fn();
  render(
    <Harness
      flyout
      updateMethod="batch"
      onChange={onChange}
      onCancel={onCancel}
    />
  );
  const toggle = button('Filter');
  await userEvent.click(toggle);
  await userEvent.click(screen.getByText('Paid'));
  expect(onChange).not.toHaveBeenCalled();
  expect(toggle.textContent).toBe('Filter');
  await userEvent.click(button('Apply'));
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenCalledWith({ status: ['paid'] });
  expect(toggle.getAttribute('aria-expanded')).toBe('false');
  expect(active()).toBe(toggle);
  expect(toggle.textContent).toBe('Filter (1)');
  await userEvent.click(toggle);
  expect(checkbox('Paid').checked).toBe(true);
  await userEvent.click(screen.getByText('Overdue'));
  await userEvent.click(button('Cancel'));
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onCancel).toHaveBeenCalledTimes(1);
  expect(toggle.getAttribute('aria-expanded')).toBe('false');
  expect(active()).toBe(toggle);
  // No close button in the flyout, as IBM's.
  await userEvent.click(toggle);
  expect(shownByLabel('Close filter panel')).toHaveLength(0);
  expect(checkbox('Overdue').checked).toBe(false);
});

test('flyout batch: Escape and a click outside discard the draft', async () => {
  const onChange = vi.fn();
  render(<Harness flyout updateMethod="batch" onChange={onChange} />);
  const toggle = button('Filter');
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

test('flyout: ref, rest props and onKeyDownCapture reach the root; Escape and a click outside still close', async () => {
  const ref = createRef<HTMLDivElement>();
  const onKeyDownCapture = vi.fn();
  render(
    <>
      <button type="button">Before</button>
      <FilterFlyoutHarness
        ref={ref}
        data-testid="flyout"
        onKeyDownCapture={onKeyDownCapture}
      />
    </>
  );
  expect(ref.current?.classList.contains('afframe-filter-flyout')).toBe(true);
  expect(ref.current?.dataset.testid).toBe('flyout');
  const toggle = button('Filter (2)');
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
