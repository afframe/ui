import { render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';
import { Amount } from './Amount.js';

const nbsp = String.fromCodePoint(0x00a0);
const minus = String.fromCodePoint(0x002d);

test('renders the formatted amount in a data element', () => {
  render(<Amount value={1234.5} data-testid="amount" />);
  const amount = screen.getByTestId('amount');
  expect(amount.tagName).toBe('DATA');
  expect(amount.textContent).toBe(`1${nbsp}234,50${nbsp}Kč`);
  expect(amount).toHaveAttribute('value', '1234.5');
  expect(amount).toHaveClass('afframe-amount');
});

test('value and text come from the same rounding', () => {
  render(<Amount value={1.005} data-testid="amount" />);
  const amount = screen.getByTestId('amount');
  expect(amount).toHaveAttribute('value', '1.01');
  expect(amount.textContent).toBe(`1,01${nbsp}Kč`);
});

test('colours negatives only when asked, never negative zero', () => {
  const { rerender } = render(
    <Amount value={-12} colorNegative data-testid="amount" />
  );
  const amount = screen.getByTestId('amount');
  expect(amount.textContent).toBe(`${minus}12,00${nbsp}Kč`);
  expect(amount).toHaveClass('afframe-amount-negative');
  rerender(<Amount value={-0.004} colorNegative data-testid="amount" />);
  expect(amount.textContent).toBe(`0,00${nbsp}Kč`);
  expect(amount).toHaveAttribute('value', '0');
  expect(amount).not.toHaveClass('afframe-amount-negative');
  rerender(<Amount value={-12} data-testid="amount" />);
  expect(amount).not.toHaveClass('afframe-amount-negative');
});

test('overrides currency, locale and sign', () => {
  render(
    <Amount
      value={1234.5}
      currency="EUR"
      locale="en-GB"
      signDisplay="always"
      className="total"
      data-testid="amount"
    />
  );
  const amount = screen.getByTestId('amount');
  expect(amount.textContent).toBe('+€1,234.50');
  expect(amount).toHaveClass('afframe-amount', 'total');
});

test('passes digits and Intl currency options, not as attributes', () => {
  render(
    <Amount
      value={-1234.567}
      currency="USD"
      locale="en-US"
      digits={3}
      currencySign="accounting"
      currencyDisplay="code"
      data-testid="amount"
    />
  );
  const amount = screen.getByTestId('amount');
  expect(amount.textContent).toBe(`(USD${nbsp}1,234.567)`);
  expect(amount).toHaveAttribute('value', '-1234.567');
  for (const name of ['digits', 'currencysign', 'currencydisplay']) {
    expect(amount).not.toHaveAttribute(name);
  }
});

test('renders on the server', () => {
  expect(renderToStaticMarkup(<Amount value={-1234.5} colorNegative />)).toBe(
    `<data class="afframe-amount afframe-amount-negative" value="-1234.5">${minus}1${nbsp}234,50${nbsp}Kč</data>`
  );
});

test.each([Number.NaN, Infinity, -Infinity])(
  'renders the fallback for %s in a span',
  (value) => {
    render(
      <Amount
        value={value}
        fallback="n/a"
        colorNegative
        className="total"
        data-testid="amount"
      />
    );
    const amount = screen.getByTestId('amount');
    expect(amount.tagName).toBe('SPAN');
    expect(amount.textContent).toBe('n/a');
    expect(amount).toHaveClass('afframe-amount', 'total');
    expect(amount).not.toHaveClass('afframe-amount-negative');
  }
);

test.each([Number.NaN, Infinity, -Infinity])(
  'throws for %s without a fallback',
  (value) => {
    expect(() => renderToStaticMarkup(<Amount value={value} />)).toThrow(
      RangeError
    );
  }
);

test('ignores the fallback for a finite value', () => {
  render(<Amount value={0} fallback="n/a" data-testid="amount" />);
  const amount = screen.getByTestId('amount');
  expect(amount.textContent).toBe(`0,00${nbsp}Kč`);
  expect(amount).toHaveAttribute('value', '0');
});

test('renders the fallback on the server', () => {
  expect(
    renderToStaticMarkup(<Amount value={Number.NaN} fallback={<i>n/a</i>} />)
  ).toBe('<span class="afframe-amount"><i>n/a</i></span>');
});
