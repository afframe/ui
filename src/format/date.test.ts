import { describe, expect, test, vi } from 'vitest';
import {
  addDays,
  civilDateIn,
  civilDateToLocalDate,
  dateRangePresets,
  defaultDateRangePresetMessages,
  formatDate,
  formatDateRange,
  getDateRangePreset,
  localDateToCivilDate,
  startOfDayIn,
} from './date.js';

// Explicit code points: U+0020 space, U+2013 en dash.
const space = String.fromCodePoint(0x0020);
const dash = String.fromCodePoint(0x2013);

test('formats an instant in Prague time', () => {
  // 22:30 UTC on 6 October is 00:30 on 7 October in Prague (CEST).
  expect(formatDate(new Date('2026-10-06T22:30:00Z'))).toBe('7. 10. 2026');
  expect(
    formatDate(Date.parse('2026-10-06T22:30:00Z'), { timeZone: 'UTC' })
  ).toBe('6. 10. 2026');
  expect(
    formatDate(new Date('2026-10-06T22:30:00Z'), { locale: 'en-GB' })
  ).toBe('7 Oct 2026');
});

test('formats a civil date as that day in every zone', () => {
  expect(formatDate('2026-10-07')).toBe('7. 10. 2026');
  expect(formatDate('2026-10-07', { timeZone: 'Pacific/Honolulu' })).toBe(
    '7. 10. 2026'
  );
  expect(formatDate('2026-10-07', { dateStyle: 'long' })).toBe('7. října 2026');
  expect(() => formatDate('2026-02-30')).toThrow(RangeError);
  expect(() => formatDate('7.10.2026')).toThrow(RangeError);
  expect(() => formatDate(Number.NaN)).toThrow(RangeError);
});

test('formats ISO timestamps with Z or an offset as instants', () => {
  expect(formatDate('2026-10-06T22:30:00Z')).toBe('7. 10. 2026');
  expect(formatDate('2026-10-07T00:30+02:00')).toBe('7. 10. 2026');
  expect(formatDate('2026-10-06T22:30:00.500Z', { timeZone: 'UTC' })).toBe(
    '6. 10. 2026'
  );
  // PostgreSQL timestamptz in JSON: microseconds and an offset.
  expect(
    formatDate('2026-10-06T23:59:59.999999+00:00', {
      timeStyle: 'medium',
      timeZone: 'UTC',
    })
  ).toBe('23:59:59');
  expect(
    formatDateRange('2026-10-01T10:00:00Z', new Date('2026-10-31T10:00:00Z'))
  ).toBe(formatDateRange('2026-10-01', '2026-10-31'));
  for (const bad of [
    '2026-10-07T10:00:00',
    '2026-02-30T10:00:00Z',
    '2026-10-07T24:00:00Z',
    '2026-10-07 10:00:00Z',
    '2026-10-07T10:00:00+2',
    '2026-10-07T10:00:00123Z',
  ]) {
    expect(() => formatDate(bad), bad).toThrow(RangeError);
  }
});

test('uses U+0020 where Node and browsers differ in spaces', () => {
  const time = formatDate('2026-10-07T10:00:00Z', {
    locale: 'en-US',
    timeStyle: 'short',
    timeZone: 'UTC',
  });
  expect(time).toBe(`10:00${space}AM`);
  expect(
    formatDateRange('2026-10-07T10:00:00Z', '2026-10-07T11:00:00Z', {
      locale: 'en-US',
      timeStyle: 'short',
      timeZone: 'UTC',
    })
  ).toBe(`10:00${space}${dash}${space}11:00${space}AM`);
});

test('reuses date formatters across calls', () => {
  formatDate('2026-10-07', { locale: 'de-AT' });
  getDateRangePreset('thisMonth', { now: 0 });
  startOfDayIn('2026-10-06');
  const spy = vi.spyOn(Intl, 'DateTimeFormat');
  formatDate('2026-10-08', { locale: 'de-AT' });
  getDateRangePreset('thisMonth', { now: 1 });
  startOfDayIn('2026-10-07');
  expect(spy).not.toHaveBeenCalled();
  spy.mockRestore();
});

test('formats a date range', () => {
  expect(formatDateRange('2026-10-01', '2026-10-31')).toBe(
    `01.10.2026${space}${dash}${space}31.10.2026`
  );
  expect(formatDateRange('2026-10-07', '2026-10-07')).toBe('7. 10. 2026');
  expect(formatDateRange('2026-10-01', '2026-10-31', { locale: 'en-GB' })).toBe(
    `1${space}${dash}${space}31 Oct 2026`
  );
  expect(() =>
    formatDateRange('2026-10-01', new Date('2026-10-31T00:00:00Z'))
  ).toThrow(TypeError);
  expect(() => formatDateRange('2026-10-01', '2026-10-31T00:00:00Z')).toThrow(
    TypeError
  );
  // A reversed range prints in the given order.
  expect(formatDateRange('2026-10-31', '2026-10-01')).toBe(
    `31.10.2026${space}${dash}${space}01.10.2026`
  );
});

test('finds the civil date of an instant in a zone', () => {
  expect(civilDateIn(new Date('2026-10-06T21:59:59Z'))).toBe('2026-10-06');
  expect(civilDateIn(new Date('2026-10-06T22:00:00Z'))).toBe('2026-10-07');
  expect(civilDateIn(new Date('2026-10-06T22:00:00Z'), 'UTC')).toBe(
    '2026-10-06'
  );
});

test('finds the instant a day starts in Prague across DST', () => {
  expect(startOfDayIn('2026-10-07').toISOString()).toBe(
    '2026-10-06T22:00:00.000Z'
  );
  expect(startOfDayIn('2026-01-15').toISOString()).toBe(
    '2026-01-14T23:00:00.000Z'
  );
  // DST starts 29 March 2026 at 02:00 and ends 25 October at 03:00.
  expect(startOfDayIn('2026-03-29').toISOString()).toBe(
    '2026-03-28T23:00:00.000Z'
  );
  expect(startOfDayIn('2026-03-30').toISOString()).toBe(
    '2026-03-29T22:00:00.000Z'
  );
  expect(startOfDayIn('2026-10-25').toISOString()).toBe(
    '2026-10-24T22:00:00.000Z'
  );
  expect(startOfDayIn('2026-10-26').toISOString()).toBe(
    '2026-10-25T23:00:00.000Z'
  );
  expect(startOfDayIn('2026-10-07', 'UTC').toISOString()).toBe(
    '2026-10-07T00:00:00.000Z'
  );
});

test('adds days and builds a local Date for DatePicker', () => {
  expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
  expect(addDays('2024-03-01', -1)).toBe('2024-02-29');
  const local = civilDateToLocalDate('2026-10-07');
  expect([local.getFullYear(), local.getMonth(), local.getDate()]).toEqual([
    2026, 9, 7,
  ]);
  expect([local.getHours(), local.getMinutes()]).toEqual([0, 0]);
});

test('reads the civil date of a local Date from DatePicker', () => {
  expect(localDateToCivilDate(new Date(2026, 9, 7))).toBe('2026-10-07');
  expect(localDateToCivilDate(new Date(2026, 9, 7, 23, 59, 59))).toBe(
    '2026-10-07'
  );
  expect(localDateToCivilDate(new Date(2024, 1, 29, 0, 0, 1))).toBe(
    '2024-02-29'
  );
  expect(localDateToCivilDate(civilDateToLocalDate('2026-03-29'))).toBe(
    '2026-03-29'
  );
  expect(() => localDateToCivilDate(new Date(Number.NaN))).toThrow(RangeError);
});

describe('date-range presets', () => {
  // Wednesday 7 October 2026, 00:30 in Prague, still 6 October in UTC.
  const now = new Date('2026-10-06T22:30:00Z');
  const range = (preset: Parameters<typeof getDateRangePreset>[0]) =>
    getDateRangePreset(preset, { now });

  test('every preset has an English label', () => {
    expect(Object.keys(defaultDateRangePresetMessages)).toEqual([
      ...dateRangePresets,
    ]);
  });

  test('take today from Prague, not UTC', () => {
    expect(range('today')).toEqual({ start: '2026-10-07', end: '2026-10-07' });
    expect(getDateRangePreset('today', { now, timeZone: 'UTC' })).toEqual({
      start: '2026-10-06',
      end: '2026-10-06',
    });
    expect(range('yesterday')).toEqual({
      start: '2026-10-06',
      end: '2026-10-06',
    });
  });

  test('weeks start on Monday by default', () => {
    expect(range('thisWeek')).toEqual({
      start: '2026-10-05',
      end: '2026-10-11',
    });
    expect(range('lastWeek')).toEqual({
      start: '2026-09-28',
      end: '2026-10-04',
    });
    expect(getDateRangePreset('thisWeek', { now, weekStartsOn: 0 })).toEqual({
      start: '2026-10-04',
      end: '2026-10-10',
    });
    // Sunday 11 October 23:30 in Prague is still this week; Monday 00:30 is not.
    expect(
      getDateRangePreset('thisWeek', { now: new Date('2026-10-11T21:30:00Z') })
    ).toEqual({ start: '2026-10-05', end: '2026-10-11' });
    expect(
      getDateRangePreset('thisWeek', { now: new Date('2026-10-11T22:30:00Z') })
    ).toEqual({ start: '2026-10-12', end: '2026-10-18' });
  });

  test('rolling ranges end today', () => {
    expect(range('last7Days')).toEqual({
      start: '2026-10-01',
      end: '2026-10-07',
    });
    expect(range('last30Days')).toEqual({
      start: '2026-09-08',
      end: '2026-10-07',
    });
  });

  test('months, quarters and years cover the whole period', () => {
    expect(range('thisMonth')).toEqual({
      start: '2026-10-01',
      end: '2026-10-31',
    });
    expect(range('lastMonth')).toEqual({
      start: '2026-09-01',
      end: '2026-09-30',
    });
    expect(range('thisQuarter')).toEqual({
      start: '2026-10-01',
      end: '2026-12-31',
    });
    expect(range('lastQuarter')).toEqual({
      start: '2026-07-01',
      end: '2026-09-30',
    });
    expect(range('thisYear')).toEqual({
      start: '2026-01-01',
      end: '2026-12-31',
    });
    expect(range('lastYear')).toEqual({
      start: '2025-01-01',
      end: '2025-12-31',
    });
  });

  test('New Year in Prague comes an hour before UTC', () => {
    const newYear = { now: new Date('2025-12-31T23:30:00Z') };
    expect(getDateRangePreset('today', newYear)).toEqual({
      start: '2026-01-01',
      end: '2026-01-01',
    });
    expect(getDateRangePreset('thisYear', newYear)).toEqual({
      start: '2026-01-01',
      end: '2026-12-31',
    });
    expect(getDateRangePreset('lastMonth', newYear)).toEqual({
      start: '2025-12-01',
      end: '2025-12-31',
    });
    expect(getDateRangePreset('lastQuarter', newYear)).toEqual({
      start: '2025-10-01',
      end: '2025-12-31',
    });
  });

  test('DST switch days and leap years', () => {
    // 29 March 2026, 23:30 CEST.
    expect(
      getDateRangePreset('today', { now: new Date('2026-03-29T21:30:00Z') })
    ).toEqual({ start: '2026-03-29', end: '2026-03-29' });
    // 25 October 2026, 23:30 CET.
    expect(
      getDateRangePreset('today', { now: new Date('2026-10-25T22:30:00Z') })
    ).toEqual({ start: '2026-10-25', end: '2026-10-25' });
    expect(
      getDateRangePreset('lastMonth', { now: new Date('2024-03-15T12:00:00Z') })
    ).toEqual({ start: '2024-02-01', end: '2024-02-29' });
  });
});
