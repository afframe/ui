import { FluidDatePickerInput } from '@carbon/react';
import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import {
  FluidDatePicker,
  type FluidDatePickerProps,
} from './FluidDatePicker.js';

function Single(props: Omit<FluidDatePickerProps, 'children'>) {
  return (
    <FluidDatePicker datePickerType="single" {...props}>
      <FluidDatePickerInput id="due" labelText="Due date" />
    </FluidDatePicker>
  );
}

const input = (label = 'Due date') =>
  screen.getByLabelText<HTMLInputElement>(label);
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

test('Enter on an impossible date keeps it, marked invalid', async () => {
  render(<Single />);
  await userEvent.type(input(), '31022026');
  await userEvent.keyboard('{Enter}');
  await vi.waitFor(() =>
    expect(input().getAttribute('aria-invalid')).toBe('true')
  );
  expect(input().value).toBe('31.02.2026');
});

test('inputMask={false} keeps Carbon’s typing', async () => {
  render(<Single inputMask={false} />);
  await userEvent.type(input(), '01102026');
  expect(input().value).toBe('01102026');
});

test('a range masks both inputs', async () => {
  render(
    <FluidDatePicker datePickerType="range">
      <FluidDatePickerInput id="from" labelText="From" />
      <FluidDatePickerInput id="to" labelText="To" />
    </FluidDatePicker>
  );
  await userEvent.type(input('From'), '01102026');
  expect(input('From').value).toBe('01.10.2026');
  await userEvent.type(input('To'), '0510');
  expect(input('To').value).toBe('05.10.');
});
