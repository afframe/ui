import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { DatePicker, DatePickerInput } from './preview.js';

function Single(props: { inputMask?: boolean }) {
  return (
    <DatePicker datePickerType="single" {...props}>
      <DatePickerInput id="due" labelText="Due date" />
    </DatePicker>
  );
}

const input = (label = 'Due date') =>
  screen.getByLabelText<HTMLInputElement>(label);
const leave = () => userEvent.click(document.body);

test('defaults to the system format and masks typing', async () => {
  render(<Single />);
  expect(input().placeholder).toBe('dd.mm.yyyy');
  await userEvent.type(input(), '01102026');
  expect(input().value).toBe('01.10.2026');
  await leave();
  expect(input().getAttribute('aria-invalid')).toBeNull();
});

test('a typed separator pads the part', async () => {
  render(<Single />);
  await userEvent.type(input(), '1.1.2026');
  expect(input().value).toBe('01.01.2026');
});

test('an impossible date stays as typed and the input turns invalid', async () => {
  render(<Single />);
  await userEvent.type(input(), '31022026');
  await leave();
  expect(input().value).toBe('31.02.2026');
  expect(input().getAttribute('aria-invalid')).toBe('true');
  expect(
    screen.getByText('Enter a valid date as dd.mm.yyyy.')
  ).toBeInTheDocument();
});

test('a picked date replaces the typed text', async () => {
  render(<Single />);
  await userEvent.type(input(), '3102');
  await leave();
  await userEvent.click(input());
  const day = document.querySelector<HTMLElement>(
    '.cds--date-picker__day:not(.cds--date-picker__day--outside)'
  );
  if (!day) throw new Error('no day in the calendar');
  await userEvent.click(day);
  expect(input().value).toMatch(/^\d{2}\.\d{2}\.\d{4}$/);
  expect(input().getAttribute('aria-invalid')).toBeNull();
});

test('inputMask={false} keeps Carbon’s behaviour: typed text is dropped', async () => {
  render(<Single inputMask={false} />);
  await userEvent.type(input(), '01102026');
  expect(input().value).toBe('');
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
