import { DatePickerInput } from '@carbon/react';
import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { DatePicker, type DatePickerProps } from './DatePicker.js';

type Props = Omit<DatePickerProps, 'children'> & {
  inputProps?: Record<string, unknown>;
};

function Single({ inputProps, ...props }: Props) {
  return (
    <DatePicker datePickerType="single" {...props}>
      <DatePickerInput id="due" labelText="Due date" {...inputProps} />
    </DatePicker>
  );
}

const input = (label = 'Due date') =>
  screen.getByLabelText<HTMLInputElement>(label);

// flatpickr blurs on a click outside its calendar; the outside target is
// the page body.
const leave = () => userEvent.click(document.body);

test('defaults to the system format and masks typing', async () => {
  const onChange = vi.fn();
  render(<Single onChange={onChange} />);
  expect(input().placeholder).toBe('dd.mm.yyyy');
  await userEvent.type(input(), '01102026');
  expect(input().value).toBe('01.10.2026');
  const dates = onChange.mock.lastCall?.[0] as Date[];
  expect(dates[0]?.toDateString()).toBe(new Date(2026, 9, 1).toDateString());
});

test('a typed separator pads the part', async () => {
  render(<Single />);
  await userEvent.type(input(), '1.1.2026');
  expect(input().value).toBe('01.01.2026');
  await leave();
  expect(input().value).toBe('01.01.2026');
  expect(input().getAttribute('aria-invalid')).toBeNull();
});

test('an impossible date stays as typed and the input turns invalid', async () => {
  const onChange = vi.fn();
  render(<Single onChange={onChange} />);
  await userEvent.type(input(), '31022026');
  await leave();
  expect(input().value).toBe('31.02.2026');
  expect(input().getAttribute('aria-invalid')).toBe('true');
  expect(
    screen.getByText('Enter a valid date as dd.mm.yyyy.')
  ).toBeInTheDocument();
  // No date rolled over into March.
  for (const [dates] of onChange.mock.calls as [Date[]][]) {
    expect(dates).toHaveLength(0);
  }
});

test('an incomplete date stays as typed; a fix clears the error', async () => {
  render(<Single messages={{ invalidDate: (f) => `Use ${f}` }} />);
  await userEvent.type(input(), '0110');
  await leave();
  expect(input().value).toBe('01.10.');
  expect(screen.getByText('Use dd.mm.yyyy')).toBeInTheDocument();
  await userEvent.type(input(), '2026');
  expect(input().value).toBe('01.10.2026');
  expect(input().getAttribute('aria-invalid')).toBeNull();
});

test('the input’s own invalid wins', async () => {
  render(<Single inputProps={{ invalid: false }} />);
  await userEvent.type(input(), '3102');
  await leave();
  expect(input().value).toBe('31.02.');
  expect(input().getAttribute('aria-invalid')).toBeNull();
});

test('inputMask={false} keeps Carbon’s typing', async () => {
  render(<Single inputMask={false} />);
  expect(input().placeholder).toBe('');
  await userEvent.type(input(), '01102026');
  expect(input().value).toBe('01102026');
});

test('a caller’s format in the grammar is masked; another warns', async () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  const { unmount } = render(<Single dateFormat="Y-m-d" />);
  await userEvent.type(input(), '20261001');
  expect(input().value).toBe('2026-10-01');
  expect(warn).not.toHaveBeenCalled();
  unmount();
  render(<Single dateFormat="F j, Y" />);
  expect(warn).toHaveBeenCalledOnce();
  warn.mockRestore();
});

test('a range masks both inputs', async () => {
  render(
    <DatePicker datePickerType="range">
      <DatePickerInput id="from" labelText="From" />
      <DatePickerInput id="to" labelText="To" />
    </DatePicker>
  );
  await userEvent.type(input('From'), '01102026');
  expect(input('From').value).toBe('01.10.2026');
  await userEvent.type(input('To'), '0510');
  expect(input('To').value).toBe('05.10.');
});
