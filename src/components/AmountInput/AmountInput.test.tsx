import { render, screen } from '@testing-library/react';
import { useState } from 'react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { AmountInput, type AmountInputProps } from './AmountInput.js';

const nbsp = String.fromCodePoint(0x00a0);
const minus = String.fromCodePoint(0x002d);

function Controlled({
  initial = null,
  spy,
  ...props
}: Omit<AmountInputProps, 'id' | 'label' | 'value' | 'onChange'> & {
  initial?: number | null;
  spy: (value: number | null) => void;
}) {
  const [value, setValue] = useState<number | null>(initial);
  return (
    <AmountInput
      id="amount"
      label="Amount"
      {...props}
      value={value}
      onChange={(next) => {
        spy(next);
        setValue(next);
      }}
    />
  );
}

const input = () => screen.getByLabelText<HTMLInputElement>('Amount');

async function typeAndBlur(text: string) {
  await userEvent.clear(input());
  if (text) await userEvent.type(input(), text);
  await userEvent.tab();
}

test('shows the value in Czech with the currency', () => {
  render(<Controlled initial={1234.5} spy={vi.fn()} />);
  expect(input().value).toBe(`1${nbsp}234,50${nbsp}Kč`);
  expect(input().type).toBe('text');
});

test('reports a typed amount on blur and formats it', async () => {
  const spy = vi.fn();
  render(<Controlled spy={spy} />);
  await userEvent.type(input(), '1234,5');
  expect(spy).not.toHaveBeenCalled();
  await userEvent.tab();
  expect(spy).toHaveBeenLastCalledWith(1234.5);
  expect(input().value).toBe(`1${nbsp}234,50${nbsp}Kč`);
  // Native constraint validation passes, so a form can submit.
  expect(input().checkValidity()).toBe(true);
});

test('rounds to the currency digits', async () => {
  const spy = vi.fn();
  render(<Controlled spy={spy} />);
  await typeAndBlur('1,005');
  expect(spy).toHaveBeenLastCalledWith(1.01);
  expect(input().value).toBe(`1,01${nbsp}Kč`);
});

test('reports null when cleared and never negative zero', async () => {
  const spy = vi.fn();
  render(<Controlled initial={5} spy={spy} />);
  await typeAndBlur('');
  expect(spy).toHaveBeenLastCalledWith(null);
  expect(input().value).toBe('');
  await typeAndBlur('-0');
  expect(Object.is(spy.mock.lastCall?.[0], 0)).toBe(true);
  expect(input().value).toBe(`0,00${nbsp}Kč`);
});

test('keeps negative amounts', async () => {
  const spy = vi.fn();
  render(<Controlled spy={spy} />);
  await typeAndBlur('-12,3');
  expect(spy).toHaveBeenLastCalledWith(-12.3);
  expect(input().value).toBe(`${minus}12,30${nbsp}Kč`);
});

test('takes another currency and locale', async () => {
  const spy = vi.fn();
  render(<Controlled spy={spy} currency="EUR" locale="en-GB" />);
  await typeAndBlur('-1234.5');
  expect(spy).toHaveBeenLastCalledWith(-1234.5);
  expect(input().value).toBe(`${minus}€1,234.50`);
});

test('arrow keys step by step and the input is the only tab stop', async () => {
  const spy = vi.fn();
  render(<Controlled initial={10} step={5} spy={spy} />);
  await userEvent.tab();
  expect(input()).toHaveFocus();
  await userEvent.keyboard('{ArrowUp}');
  expect(spy).toHaveBeenLastCalledWith(15);
  await userEvent.keyboard('{ArrowDown}{ArrowDown}');
  expect(spy).toHaveBeenLastCalledWith(5);
  expect(input().value).toBe(`5,00${nbsp}Kč`);
  for (const button of screen.getAllByRole('button')) {
    expect(button).toHaveAttribute('tabindex', '-1');
  }
  await userEvent.tab();
  expect(document.body).toHaveFocus();
});

test('names the steppers from messages', () => {
  render(
    <Controlled spy={vi.fn()} messages={{ increment: 'Plus one crown' }} />
  );
  expect(
    screen.getByRole('button', { name: 'Plus one crown' })
  ).toBeInTheDocument();
  expect(
    screen.getByRole('button', { name: 'Decrease amount' })
  ).toBeInTheDocument();
});

test('shows formatted limits when out of range', async () => {
  const spy = vi.fn();
  render(<Controlled spy={spy} min={0} max={1000} />);
  await typeAndBlur('2000');
  expect(spy).toHaveBeenLastCalledWith(2000);
  expect(input()).toHaveAttribute('aria-invalid', 'true');
  expect(input()).toHaveAccessibleDescription(
    `Enter an amount from 0,00${nbsp}Kč to 1${nbsp}000,00${nbsp}Kč.`
  );
});

test('works uncontrolled and never shows negative zero', async () => {
  const spy = vi.fn();
  render(
    <AmountInput id="amount" label="Amount" defaultValue={7} onChange={spy} />
  );
  expect(input().value).toBe(`7,00${nbsp}Kč`);
  await typeAndBlur('-0');
  expect(Object.is(spy.mock.lastCall?.[0], 0)).toBe(true);
  expect(input().value).toBe(`0,00${nbsp}Kč`);
});

test('clears text that is not a number and reports null', async () => {
  const spy = vi.fn();
  render(<Controlled initial={5} spy={spy} />);
  await typeAndBlur('abc');
  expect(spy).toHaveBeenLastCalledWith(null);
  expect(input().value).toBe('');
});

test('takes infinite limits without throwing', async () => {
  const spy = vi.fn();
  render(<Controlled spy={spy} min={0} max={Number.POSITIVE_INFINITY} />);
  await typeAndBlur('-5');
  expect(input()).toHaveAttribute('aria-invalid', 'true');
  expect(input()).toHaveAccessibleDescription(
    `Enter an amount of at least 0,00${nbsp}Kč.`
  );
});

test('offers a minus key unless negatives are out of range', () => {
  const { rerender } = render(<Controlled spy={vi.fn()} />);
  expect(input()).toHaveAttribute('inputmode', 'text');
  rerender(<Controlled spy={vi.fn()} min={-100} />);
  expect(input()).toHaveAttribute('inputmode', 'text');
  rerender(<Controlled spy={vi.fn()} min={0} />);
  expect(input()).toHaveAttribute('inputmode', 'decimal');
});

test('rejects a dot in Czech instead of reading it as decimals', async () => {
  const spy = vi.fn();
  render(<Controlled initial={5} spy={spy} />);
  await typeAndBlur('1.500');
  expect(spy).toHaveBeenLastCalledWith(null);
  expect(input().value).toBe('1.500');
  expect(input()).toHaveAttribute('aria-invalid', 'true');
  expect(input()).toHaveAccessibleDescription('Use "," for decimals.');
  await typeAndBlur('1500');
  expect(spy).toHaveBeenLastCalledWith(1500);
  expect(input().value).toBe(`1${nbsp}500,00${nbsp}Kč`);
  expect(input()).not.toHaveAttribute('aria-invalid', 'true');
});

test('rejects a dot in Czech when uncontrolled', async () => {
  const spy = vi.fn();
  render(<AmountInput id="amount" label="Amount" onChange={spy} />);
  await typeAndBlur('1.5');
  expect(spy).toHaveBeenLastCalledWith(null);
  expect(input().value).toBe('1.5');
  expect(input()).toHaveAttribute('aria-invalid', 'true');
});

test('reads a comma in en-GB as a group separator (Carbon)', async () => {
  const spy = vi.fn();
  render(<Controlled spy={spy} currency="EUR" locale="en-GB" />);
  await typeAndBlur('1,50');
  expect(spy).toHaveBeenLastCalledWith(150);
  expect(input().value).toBe('€150.00');
});

test('from empty or zero the first step is 1 or -1, not step (Carbon)', async () => {
  const spy = vi.fn();
  render(<Controlled initial={0} step={100} spy={spy} />);
  await userEvent.click(input());
  await userEvent.keyboard('{ArrowUp}');
  expect(spy).toHaveBeenLastCalledWith(1);
  await userEvent.keyboard('{ArrowUp}');
  expect(spy).toHaveBeenLastCalledWith(101);
});

test('forgets rejected text once the parent sets a new amount', async () => {
  const rejected = vi.fn();
  const { rerender } = render(
    <AmountInput id="amount" label="Amount" value={5} onChange={rejected} />
  );
  await typeAndBlur('1.5');
  expect(rejected).toHaveBeenLastCalledWith(null);
  const parentSets = (value: number | null) =>
    rerender(
      <AmountInput
        id="amount"
        label="Amount"
        value={value}
        onChange={vi.fn()}
      />
    );
  parentSets(null);
  parentSets(200);
  expect(input().value).toBe(`200,00${nbsp}Kč`);
  parentSets(null);
  expect(input().value).toBe('');
});
