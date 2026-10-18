import { render, screen } from '@testing-library/react';
import { createRef, useState } from 'react';
import { afterEach, expect, test, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { page, userEvent } from 'vitest/browser';
import { FilterFlyout } from './FilterFlyout.js';
import { FilterSummary } from './FilterSummary.js';
import type {
  FilterFlyoutMessages,
  FilterFlyoutProps,
} from './FilterFlyout.js';
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

test('flyout: Escape from a checkbox closes it and returns focus', async () => {
  render(<Harness flyout />);
  const toggle = screen.getByRole('button', { name: 'Filter' });
  await userEvent.click(toggle);
  screen.getByRole('checkbox', { name: 'Paid' }).focus();
  await userEvent.keyboard('{Escape}');
  expect(toggle.getAttribute('aria-expanded')).toBe('false');
  expect(active()).toBe(toggle);
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
        value={{ status: [...(value.status ?? [])] }}
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
  // The button remounts on collapse, so it is found again each time.
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
