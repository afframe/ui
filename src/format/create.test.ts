import { expect, test } from 'vitest';
import { formatAmount, formatDate, getDateRangePreset } from './index.js';
import { createFormat } from './create.js';

test('defaults match the plain functions', () => {
  const format = createFormat();
  expect(format.formatAmount(1234.5)).toBe(formatAmount(1234.5));
  expect(format.formatDate('2026-10-07')).toBe(formatDate('2026-10-07'));
  expect(format.locale).toBe('cs-CZ');
  expect(format.currency).toBe('CZK');
  expect(format.timeZone).toBe('Europe/Prague');
});

test('app defaults apply, options per call win', () => {
  const format = createFormat({
    locale: 'en-US',
    currency: 'EUR',
    timeZone: 'America/New_York',
  });
  expect(format.formatAmount(1234.5)).toBe('€1,234.50');
  expect(format.formatAmount(1234.5, { currency: 'USD' })).toBe('$1,234.50');
  expect(format.roundAmount(1.005)).toBe(1.01);
  expect(format.roundAmount(2.5, { currency: 'JPY' })).toBe(3);
  expect(format.formatNumber(1234.5)).toBe('1,234.5');
  // 02:30 UTC is still the previous day in New York.
  expect(format.formatDate('2026-10-07T02:30:00Z')).toBe('Oct 6, 2026');
  expect(format.civilDateIn(Date.UTC(2026, 9, 7, 2, 30))).toBe('2026-10-06');
  expect(format.formatDate('2026-10-07T02:30:00Z', { locale: 'cs-CZ' })).toBe(
    `6. 10. 2026`
  );
});

test('presets use the app time zone and week start', () => {
  const now = Date.UTC(2026, 9, 7, 2, 30);
  const format = createFormat({
    timeZone: 'America/New_York',
    weekStartsOn: 0,
  });
  expect(format.getDateRangePreset('today', { now })).toEqual({
    start: '2026-10-06',
    end: '2026-10-06',
  });
  expect(format.getDateRangePreset('thisWeek', { now })).toEqual(
    getDateRangePreset('thisWeek', {
      now,
      timeZone: 'America/New_York',
      weekStartsOn: 0,
    })
  );
});
