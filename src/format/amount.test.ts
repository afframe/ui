import { expect, test, vi } from 'vitest';
import {
  currencyDigits,
  formatAmount,
  formatNumber,
  roundAmount,
} from './amount.js';

// Explicit code points: U+00A0 no-break space, U+002D hyphen-minus.
const nbsp = String.fromCodePoint(0x00a0);
const minus = String.fromCodePoint(0x002d);

test('formats CZK in Czech with no-break spaces', () => {
  expect(formatAmount(1234.5)).toBe(`1${nbsp}234,50${nbsp}Kč`);
});

test('uses U+00A0 as the group and currency separator', () => {
  const parts = new Intl.NumberFormat('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
  }).formatToParts(1234.5);
  expect(parts.find((part) => part.type === 'group')?.value).toBe(nbsp);
  expect(parts.find((part) => part.type === 'literal')?.value).toBe(nbsp);
});

test('formats negative amounts with a hyphen-minus', () => {
  expect(formatAmount(-1234.5)).toBe(`${minus}1${nbsp}234,50${nbsp}Kč`);
});

test('never prints a negative zero', () => {
  expect(formatAmount(0)).toBe(`0,00${nbsp}Kč`);
  expect(formatAmount(-0)).toBe(`0,00${nbsp}Kč`);
  expect(formatAmount(-0.004)).toBe(`0,00${nbsp}Kč`);
  expect(Object.is(roundAmount(-0), 0)).toBe(true);
  expect(Object.is(roundAmount(-0.004), 0)).toBe(true);
});

test('rounds VAT products as their decimal value, not the binary double', () => {
  // 9.5 * 0.21 is 1.9949999999999999 in binary; the decimal product is 1.995.
  expect(roundAmount(9.5 * 0.21)).toBe(2);
  expect(roundAmount(1.5 * 0.15)).toBe(0.23);
  expect(roundAmount(3.3 * 0.15)).toBe(0.5);
  expect(roundAmount(8.1 * 0.15)).toBe(1.22);
  expect(roundAmount(-9.5 * 0.21)).toBe(-2);
  expect(formatAmount(9.5 * 0.21)).toBe(`2,00${nbsp}Kč`);
});

test('rounds half away from zero on the decimal form', () => {
  expect(roundAmount(0.005)).toBe(0.01);
  expect(roundAmount(1.005)).toBe(1.01);
  expect(roundAmount(-1.005)).toBe(-1.01);
  expect(roundAmount(1.004)).toBe(1);
  expect(roundAmount(2.675)).toBe(2.68);
  expect(roundAmount(0.1 + 0.2)).toBe(0.3);
  expect(formatAmount(0.005)).toBe(`0,01${nbsp}Kč`);
  expect(formatAmount(1.005)).toBe(`1,01${nbsp}Kč`);
  expect(formatAmount(-1.005)).toBe(`${minus}1,01${nbsp}Kč`);
});

test('rounds to zero minor digits for JPY', () => {
  expect(currencyDigits('JPY')).toBe(0);
  expect(roundAmount(2.5, { currency: 'JPY' })).toBe(3);
  expect(roundAmount(-2.5, { currency: 'JPY' })).toBe(-3);
  expect(formatAmount(2.5, { locale: 'en-US', currency: 'JPY' })).toBe('¥3');
  expect(formatAmount(-2.5, { locale: 'en-US', currency: 'JPY' })).toBe(
    `${minus}¥3`
  );
  expect(formatAmount(1.6, { locale: 'en-US', currency: 'JPY' })).toBe('¥2');
});

test('formats large amounts exactly', () => {
  expect(formatAmount(123456789012.34)).toBe(
    `123${nbsp}456${nbsp}789${nbsp}012,34${nbsp}Kč`
  );
  // Exact to 15 significant digits; beyond that the value is cut first.
  expect(roundAmount(9_999_999_999_999.99)).toBe(9_999_999_999_999.99);
  expect(roundAmount(1e15 + 0.25)).toBe(1e15);
  expect(formatAmount(1e21)).toBe(`1${`${nbsp}000`.repeat(7)},00${nbsp}Kč`);
});

test('overrides the minor digits', () => {
  expect(currencyDigits('HUF')).toBe(0);
  expect(roundAmount(1234.567, { currency: 'HUF', digits: 2 })).toBe(1234.57);
  expect(formatAmount(1234.567, { currency: 'HUF', digits: 2 })).toBe(
    `1${nbsp}234,57${nbsp}HUF`
  );
  expect(formatAmount(1234.567, { digits: 0 })).toBe(`1${nbsp}235${nbsp}Kč`);
});

test('passes currencyDisplay, currencySign and trailingZeroDisplay to Intl', () => {
  expect(formatAmount(12, { locale: 'en-US', currencyDisplay: 'code' })).toBe(
    `CZK${nbsp}12.00`
  );
  expect(
    formatAmount(-12, {
      locale: 'en-US',
      currency: 'USD',
      currencySign: 'accounting',
    })
  ).toBe('($12.00)');
  expect(formatAmount(12, { trailingZeroDisplay: 'stripIfInteger' })).toBe(
    `12${nbsp}Kč`
  );
  expect(formatAmount(12.5, { trailingZeroDisplay: 'stripIfInteger' })).toBe(
    `12,50${nbsp}Kč`
  );
});

test('overrides currency and locale per call', () => {
  expect(formatAmount(1234.5, { currency: 'EUR' })).toBe(
    `1${nbsp}234,50${nbsp}€`
  );
  expect(formatAmount(1234.5, { locale: 'en-US', currency: 'USD' })).toBe(
    '$1,234.50'
  );
  expect(formatAmount(1234.5, { locale: 'en-GB', currency: 'EUR' })).toBe(
    '€1,234.50'
  );
  expect(formatAmount(-1234.5, { locale: 'en-GB' })).toBe(
    `${minus}CZK${nbsp}1,234.50`
  );
  expect(formatAmount(0.005, { locale: 'en-US', currency: 'USD' })).toBe(
    '$0.01'
  );
});

test('shows a sign when asked', () => {
  expect(formatAmount(12, { signDisplay: 'exceptZero' })).toBe(
    `+12,00${nbsp}Kč`
  );
  expect(formatAmount(-0.004, { signDisplay: 'exceptZero' })).toBe(
    `0,00${nbsp}Kč`
  );
});

test('throws on NaN and Infinity', () => {
  expect(() => formatAmount(Number.NaN)).toThrow(RangeError);
  expect(() => roundAmount(Number.POSITIVE_INFINITY)).toThrow(RangeError);
});

test('formats plain numbers in Czech, no negative zero', () => {
  expect(formatNumber(1234.5)).toBe(`1${nbsp}234,5`);
  expect(formatNumber(-0)).toBe('0');
  expect(formatNumber(-0.0001)).toBe('0');
  expect(formatNumber(0.256, { style: 'percent' })).toBe(`26${nbsp}%`);
  expect(formatNumber(1234.5, { locale: 'en-GB' })).toBe('1,234.5');
});

test('formatNumber throws on NaN and Infinity', () => {
  expect(() => formatNumber(Number.NaN)).toThrow(RangeError);
  expect(() => formatNumber(Number.NEGATIVE_INFINITY)).toThrow(RangeError);
});

test('reuses formatters across calls', () => {
  formatAmount(1, { locale: 'de-AT', currency: 'CHF' });
  const spy = vi.spyOn(Intl, 'NumberFormat');
  for (const value of [1, 2.5, -3.005]) {
    formatAmount(value, { locale: 'de-AT', currency: 'CHF' });
  }
  expect(spy).not.toHaveBeenCalled();
  spy.mockRestore();
});
