import { DatePickerInput } from '@carbon/react';
import { render, screen } from '@testing-library/react';
import { useState } from 'react';
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

// The app owns the value and takes every onChange.
function Controlled({ onChange }: { onChange: (dates: Date[]) => void }) {
  const [value, setValue] = useState<Date[]>([]);
  return (
    <DatePicker
      datePickerType="single"
      value={value}
      onChange={(dates) => {
        onChange(dates);
        setValue(dates);
      }}>
      <DatePickerInput id="due" labelText="Due date" />
    </DatePicker>
  );
}

const lengths = (onChange: ReturnType<typeof vi.fn>) =>
  (onChange.mock.calls as [Date[]][]).map(([dates]) => dates.length);

// Carbon closes the calendar in an effect after Enter.
const settle = () => new Promise((resolve) => setTimeout(resolve, 50));

async function retype(text: string, label = 'Due date') {
  await userEvent.click(input(label));
  input(label).setSelectionRange(0, input(label).value.length);
  await userEvent.keyboard(text);
}

async function expectKeptInvalid(text: string, label = 'Due date') {
  await vi.waitFor(() =>
    expect(input(label).getAttribute('aria-invalid')).toBe('true')
  );
  expect(input(label).value).toBe(text);
}

test('Enter on an impossible date keeps it, marked invalid', async () => {
  render(<Single />);
  await userEvent.type(input(), '31022026');
  await userEvent.keyboard('{Enter}');
  await settle();
  await expectKeptInvalid('31.02.2026');
});

test('Enter on a date edited to an impossible one keeps it, marked invalid', async () => {
  render(<Single />);
  await userEvent.type(input(), '01102026');
  await leave();
  await retype('31022026');
  await userEvent.keyboard('{Enter}');
  await settle();
  await expectKeptInvalid('31.02.2026');
});

test('controlled: Enter on an edited impossible date keeps it and tells the app once', async () => {
  const onChange = vi.fn();
  render(<Controlled onChange={onChange} />);
  await userEvent.type(input(), '01102026');
  await leave();
  await retype('31022026');
  await userEvent.keyboard('{Enter}');
  await settle();
  await expectKeptInvalid('31.02.2026');
  expect(lengths(onChange)).toEqual([1, 0]);
});

test('controlled: leaving an edited impossible date tells the app once', async () => {
  const onChange = vi.fn();
  render(<Controlled onChange={onChange} />);
  await userEvent.type(input(), '01102026');
  await leave();
  await retype('3102');
  await leave();
  await expectKeptInvalid('31.02.');
  await userEvent.click(input());
  await leave();
  expect(input().value).toBe('31.02.');
  expect(lengths(onChange)).toEqual([1, 0]);
});

test('an impossible date with no date before does not call onChange', async () => {
  const onChange = vi.fn();
  render(<Single onChange={onChange} />);
  await userEvent.type(input(), '3102');
  await leave();
  await expectKeptInvalid('31.02.');
  expect(onChange).not.toHaveBeenCalled();
});

test('a date before minDate stays as typed, marked invalid', async () => {
  const onChange = vi.fn();
  render(<Single minDate={new Date(2026, 0, 1)} onChange={onChange} />);
  await userEvent.type(input(), '01012020');
  await leave();
  await expectKeptInvalid('01.01.2020');
  expect(onChange).not.toHaveBeenCalled();
});

test('controlled: a date edited to before minDate tells the app once', async () => {
  const onChange = vi.fn();
  function WithMin() {
    const [value, setValue] = useState<Date[]>([]);
    return (
      <DatePicker
        datePickerType="single"
        minDate={new Date(2026, 0, 1)}
        value={value}
        onChange={(dates) => {
          onChange(dates);
          setValue(dates);
        }}>
        <DatePickerInput id="due" labelText="Due date" />
      </DatePicker>
    );
  }
  render(<WithMin />);
  await userEvent.type(input(), '01102026');
  await leave();
  await retype('01012020');
  await leave();
  await expectKeptInvalid('01.01.2020');
  expect(lengths(onChange)).toEqual([1, 0]);
});

test('a range keeps an invalid end date, marked invalid', async () => {
  render(
    <DatePicker datePickerType="range">
      <DatePickerInput id="from" labelText="From" />
      <DatePickerInput id="to" labelText="To" />
    </DatePicker>
  );
  await userEvent.type(input('From'), '01102026');
  await userEvent.type(input('To'), '3102');
  await leave();
  await expectKeptInvalid('31.02.', 'To');
  expect(input('From').value).toBe('01.10.2026');
  expect(input('From').getAttribute('aria-invalid')).toBeNull();
});

test('a valid date with Enter, or edited away and back, stays valid', async () => {
  const onChange = vi.fn();
  render(<Single onChange={onChange} />);
  await userEvent.type(input(), '01102026');
  await userEvent.keyboard('{Enter}');
  await settle();
  expect(input().value).toBe('01.10.2026');
  expect(input().getAttribute('aria-invalid')).toBeNull();
  await userEvent.click(input());
  await userEvent.keyboard('{Backspace}6');
  expect(input().value).toBe('01.10.2026');
  await leave();
  expect(input().value).toBe('01.10.2026');
  expect(input().getAttribute('aria-invalid')).toBeNull();
  expect(lengths(onChange).every((length) => length === 1)).toBe(true);
});

test('the app emptying its value empties text kept invalid', async () => {
  const { rerender } = render(<Single value={[new Date(2026, 9, 1)]} />);
  expect(input().value).toBe('01.10.2026');
  await retype('3102');
  await leave();
  await expectKeptInvalid('31.02.');
  rerender(<Single value={[]} />);
  await vi.waitFor(() => expect(input().value).toBe(''));
  expect(input().getAttribute('aria-invalid')).toBeNull();
});

test('the app emptying its value while a date is held empties the edit', async () => {
  const { rerender } = render(<Single value={[new Date(2026, 9, 1)]} />);
  await retype('0110');
  rerender(<Single value={[]} />);
  await vi.waitFor(() => expect(input().value).toBe(''));
  expect(input().getAttribute('aria-invalid')).toBeNull();
});

test('a new key resets text kept invalid', async () => {
  const { rerender } = render(<Single key="a" />);
  await userEvent.type(input(), '3102');
  await leave();
  await expectKeptInvalid('31.02.');
  rerender(<Single key="b" />);
  expect(input().value).toBe('');
  expect(input().getAttribute('aria-invalid')).toBeNull();
});

// The app takes every onChange only after an await, then can clear on its own.
function AsyncControlled({ onChange }: { onChange: (dates: Date[]) => void }) {
  const [value, setValue] = useState<Date[]>([]);
  return (
    <>
      <DatePicker
        datePickerType="single"
        value={value}
        onChange={async (dates) => {
          onChange(dates);
          await new Promise((resolve) => setTimeout(resolve, 20));
          setValue(dates);
        }}>
        <DatePickerInput id="due" labelText="Due date" />
      </DatePicker>
      <button type="button" onClick={() => setValue([])}>
        Clear
      </button>
    </>
  );
}

test('controlled after an await: an impossible date stays; a later clear empties', async () => {
  const onChange = vi.fn();
  render(<AsyncControlled onChange={onChange} />);
  await userEvent.type(input(), '01102026');
  await leave();
  await settle();
  await retype('31022026');
  await leave();
  await settle();
  await expectKeptInvalid('31.02.2026');
  expect(lengths(onChange)).toEqual([1, 0]);
  await retype('05102026');
  await leave();
  await settle();
  expect(input().value).toBe('05.10.2026');
  expect(input().getAttribute('aria-invalid')).toBeNull();
  await userEvent.click(screen.getByRole('button', { name: 'Clear' }));
  await vi.waitFor(() => expect(input().value).toBe(''));
  expect(input().getAttribute('aria-invalid')).toBeNull();
});

test('a dateFormat change after mount parses typed text in the new format', async () => {
  const onChange = vi.fn();
  const { rerender } = render(<Single onChange={onChange} />);
  rerender(<Single dateFormat="Y-m-d" onChange={onChange} />);
  await userEvent.type(input(), '20261001');
  await leave();
  expect(input().value).toBe('2026-10-01');
  expect(input().getAttribute('aria-invalid')).toBeNull();
  const dates = onChange.mock.lastCall?.[0] as Date[];
  expect(dates[0]?.toDateString()).toBe(new Date(2026, 9, 1).toDateString());
});

test('an empty value right after onChange([]) is the echo only with onChange', async () => {
  const { rerender } = render(
    <Single value={[new Date(2026, 9, 1)]} onChange={() => {}} />
  );
  await retype('3102');
  await leave();
  await expectKeptInvalid('31.02.');
  rerender(<Single value={[]} onChange={() => {}} />);
  await settle();
  await expectKeptInvalid('31.02.');
  rerender(<Single key="b" value={[new Date(2026, 9, 1)]} />);
  await retype('3102');
  await leave();
  await expectKeptInvalid('31.02.');
  rerender(<Single key="b" value={[]} />);
  await vi.waitFor(() => expect(input().value).toBe(''));
  expect(input().getAttribute('aria-invalid')).toBeNull();
});
