import { render, screen } from '@testing-library/react';
import { useState } from 'react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { dateMaskSpec, timeMaskSpec, type MaskSpec } from './spec.js';
import { useInputMask } from './useInputMask.js';

const dotted = dateMaskSpec({
  order: ['day', 'month', 'year'],
  separator: '.',
});

function Field({
  spec = dotted,
  enabled,
  spy,
}: {
  spec?: MaskSpec;
  enabled?: boolean;
  spy: (value: string) => void;
}) {
  const mask = useInputMask(spec, enabled);
  const [value, setValue] = useState('');
  return (
    <input
      aria-label="Field"
      {...(enabled === false ? {} : mask)}
      value={value}
      onChange={(event) => {
        if (enabled !== false) mask.onChange(event);
        setValue(event.target.value);
        spy(event.target.value);
      }}
    />
  );
}

const input = () => screen.getByLabelText<HTMLInputElement>('Field');

test('inserts separators while typing and reports the masked value', async () => {
  const spy = vi.fn();
  render(<Field spy={spy} />);
  await userEvent.type(input(), '01102026');
  expect(input().value).toBe('01.10.2026');
  expect(input().selectionStart).toBe(10);
  expect(spy).toHaveBeenLastCalledWith('01.10.2026');
  expect(spy.mock.calls.map(([value]) => value)).toContain('01.');
  expect(input().placeholder).toBe('dd.mm.yyyy');
  expect(input().inputMode).toBe('numeric');
  expect(input().checkValidity()).toBe(true);
});

test('a typed separator pads the part', async () => {
  const spy = vi.fn();
  render(<Field spy={spy} />);
  await userEvent.type(input(), '1.1.2026');
  expect(input().value).toBe('01.01.2026');
  expect(spy).toHaveBeenLastCalledWith('01.01.2026');
});

test('a rejected digit changes nothing and fires no onChange', async () => {
  const spy = vi.fn();
  render(<Field spy={spy} />);
  await userEvent.type(input(), '011');
  const calls = spy.mock.calls.length;
  await userEvent.type(input(), '3');
  expect(input().value).toBe('01.1');
  expect(spy).toHaveBeenCalledTimes(calls);
});

test('Backspace after a separator deletes the digit before it', async () => {
  const spy = vi.fn();
  render(<Field spy={spy} />);
  await userEvent.type(input(), '01{Backspace}');
  expect(input().value).toBe('0');
  expect(spy).toHaveBeenLastCalledWith('0');
});

test('masks a time', async () => {
  const spy = vi.fn();
  render(
    <Field
      spec={timeMaskSpec({ seconds: false, hourCycle: 'h23' })}
      spy={spy}
    />
  );
  await userEvent.type(input(), '905');
  expect(input().value).toBe('09:05');
  expect(input().placeholder).toBe('hh:mm');
});

test('normalises composed text on compositionend', async () => {
  const spy = vi.fn();
  render(<Field spy={spy} />);
  await userEvent.click(input());
  Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value'
  )?.set?.call(input(), '1.2.2026');
  input().dispatchEvent(
    new CompositionEvent('compositionend', { bubbles: true })
  );
  expect(input().value).toBe('01.02.2026');
  expect(spy).toHaveBeenLastCalledWith('01.02.2026');
});

test('a disabled mask stops its listener on an input that stays mounted', async () => {
  const spy = vi.fn();
  const { rerender } = render(<Field spy={spy} />);
  await userEvent.type(input(), '01');
  expect(input().value).toBe('01.');
  rerender(<Field enabled={false} spy={spy} />);
  await userEvent.type(input(), 'a');
  expect(input().value).toBe('01.a');
});
