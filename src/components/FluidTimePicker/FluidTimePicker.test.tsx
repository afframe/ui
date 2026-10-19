import { FluidTimePickerSelect, SelectItem } from '@carbon/react';
import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { failOnConsoleError } from '../../testUtils.js';
import { FluidTimePicker } from './FluidTimePicker.js';

failOnConsoleError();

const input = () => screen.getByLabelText<HTMLInputElement>('Start time');
const zone = (
  <FluidTimePickerSelect id="zone" labelText="Time zone">
    <SelectItem value="cet" text="CET" />
  </FluidTimePickerSelect>
);

test('types a 24-hour hh:mm time and reports the masked value', async () => {
  const onChange = vi.fn();
  render(
    <FluidTimePicker id="start" labelText="Start time" onChange={onChange}>
      {zone}
    </FluidTimePicker>
  );
  await userEvent.type(input(), '905');
  expect(input().value).toBe('09:05');
  expect(onChange).toHaveBeenCalled();
  expect(input().placeholder).toBe('hh:mm');
  expect(input().maxLength).toBe(5);
  expect(input().checkValidity()).toBe(true);
});

test('rejects hour 24 and pads on a typed separator', async () => {
  render(
    <FluidTimePicker id="start" labelText="Start time">
      {zone}
    </FluidTimePicker>
  );
  await userEvent.type(input(), '24');
  expect(input().value).toBe('2');
  await userEvent.clear(input());
  await userEvent.type(input(), '9:');
  expect(input().value).toBe('09:');
});

test('seconds give hh:mm:ss', async () => {
  render(
    <FluidTimePicker id="start" labelText="Start time" seconds>
      {zone}
    </FluidTimePicker>
  );
  await userEvent.type(input(), '235959');
  expect(input().value).toBe('23:59:59');
  expect(input().placeholder).toBe('hh:mm:ss');
  expect(input().scrollWidth).toBeLessThanOrEqual(input().clientWidth);
});

test("inputMask={false} keeps Carbon's input", async () => {
  render(
    <FluidTimePicker id="start" labelText="Start time" inputMask={false}>
      {zone}
    </FluidTimePicker>
  );
  await userEvent.type(input(), '905');
  expect(input().value).toBe('905');
  expect(input().inputMode).toBe('');
});
