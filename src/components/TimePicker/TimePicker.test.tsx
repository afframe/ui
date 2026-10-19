import { SelectItem, TimePickerSelect } from '@carbon/react';
import { render, screen } from '@testing-library/react';
import { useState } from 'react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { failOnConsoleError } from '../../testUtils.js';
import { TimePicker } from './TimePicker.js';

failOnConsoleError();

const input = () => screen.getByLabelText<HTMLInputElement>('Start time');

test('types a 24-hour hh:mm time and reports the masked value', async () => {
  const onChange = vi.fn();
  const onFocus = vi.fn();
  render(
    <TimePicker
      id="start"
      labelText="Start time"
      onChange={onChange}
      onFocus={onFocus}
    />
  );
  await userEvent.type(input(), '905');
  expect(input().value).toBe('09:05');
  expect(onFocus).toHaveBeenCalled();
  expect(onChange).toHaveBeenLastCalledWith(
    expect.objectContaining({ target: input() })
  );
  expect(input().placeholder).toBe('hh:mm');
  expect(input().maxLength).toBe(5);
  expect(input().inputMode).toBe('numeric');
  expect(input().checkValidity()).toBe(true);
});

test('a typed separator pads the hour', async () => {
  render(<TimePicker id="start" labelText="Start time" />);
  await userEvent.type(input(), '9:');
  expect(input().value).toBe('09:');
});

test('rejects hour 24 by default', async () => {
  render(<TimePicker id="start" labelText="Start time" />);
  await userEvent.type(input(), '24');
  expect(input().value).toBe('2');
});

test('seconds give hh:mm:ss', async () => {
  render(<TimePicker id="start" labelText="Start time" seconds />);
  await userEvent.type(input(), '235959');
  expect(input().value).toBe('23:59:59');
  expect(input().placeholder).toBe('hh:mm:ss');
  expect(input().maxLength).toBe(8);
});

test.each([false, true])(
  'seconds widen the input so hh:mm:ss is not clipped (invalid: %s)',
  async (invalid) => {
    render(
      <TimePicker id="start" labelText="Start time" seconds invalid={invalid} />
    );
    await userEvent.type(input(), '235959');
    expect(input().scrollWidth).toBeLessThanOrEqual(input().clientWidth);
  }
);

test('stays 24-hour beside an AM/PM select unless hourCycle="h12"', async () => {
  const { unmount } = render(
    <TimePicker id="start" labelText="Start time">
      <TimePickerSelect id="period" aria-label="AM or PM">
        <SelectItem value="AM" text="AM" />
        <SelectItem value="PM" text="PM" />
      </TimePickerSelect>
    </TimePicker>
  );
  await userEvent.type(input(), '13');
  expect(input().value).toBe('13:');
  unmount();
  render(<TimePicker id="start" labelText="Start time" hourCycle="h12" />);
  await userEvent.type(input(), '13');
  expect(input().value).toBe('1');
});

test("the caller's placeholder and pattern win", () => {
  render(
    <TimePicker
      id="start"
      labelText="Start time"
      placeholder="Start"
      pattern="\d\d:\d\d"
    />
  );
  expect(input().placeholder).toBe('Start');
  expect(input().pattern).toBe(String.raw`\d\d:\d\d`);
});

test('a controlled value follows the masked typing', async () => {
  function Controlled() {
    const [value, setValue] = useState('');
    return (
      <TimePicker
        id="start"
        labelText="Start time"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
    );
  }
  render(<Controlled />);
  await userEvent.type(input(), '1730');
  expect(input().value).toBe('17:30');
});

test("inputMask={false} keeps Carbon's input", async () => {
  render(<TimePicker id="start" labelText="Start time" inputMask={false} />);
  await userEvent.type(input(), '905');
  expect(input().value).toBe('905');
  expect(input().pattern).toBe(String.raw`(1[012]|[1-9]):[0-5][0-9](\s)?`);
  expect(input().inputMode).toBe('');
});

test('turning inputMask off after focus drops the mask', async () => {
  const { rerender } = render(<TimePicker id="start" labelText="Start time" />);
  await userEvent.type(input(), '9');
  rerender(<TimePicker id="start" labelText="Start time" inputMask={false} />);
  await userEvent.type(input(), '905');
  expect(input().value).toBe('905');
});
