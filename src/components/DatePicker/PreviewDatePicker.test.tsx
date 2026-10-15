import { render, screen } from '@testing-library/react';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { DatePicker, DatePickerInput } from './preview.js';

const input = (label: string) => screen.getByLabelText<HTMLInputElement>(label);

test('defaults to the system format and its placeholder', async () => {
  render(
    <DatePicker datePickerType="single">
      <DatePickerInput id="due" labelText="Due date" />
    </DatePicker>
  );
  expect(input('Due date').placeholder).toBe('dd.mm.yyyy');
  await userEvent.click(input('Due date'));
  const day = document.querySelector<HTMLElement>(
    '.cds--date-picker__day:not(.cds--date-picker__day--outside)'
  );
  if (!day) throw new Error('no day in the calendar');
  await userEvent.click(day);
  expect(input('Due date').value).toMatch(/^\d{2}\.\d{2}\.\d{4}$/);
});

test('follows a passed dateFormat; an own placeholder wins', () => {
  render(
    <DatePicker datePickerType="range" dateFormat="Y-m-d">
      <DatePickerInput id="from" labelText="From" />
      <DatePickerInput id="to" labelText="To" placeholder="End" />
    </DatePicker>
  );
  expect(input('From').placeholder).toBe('yyyy-mm-dd');
  expect(input('To').placeholder).toBe('End');
});
