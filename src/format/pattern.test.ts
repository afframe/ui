import { describe, expect, test } from 'vitest';
import { defaultDateFormat, defaultTimeFormat } from './defaults.js';
import {
  dateInputPattern,
  datePlaceholder,
  defaultDatePattern,
  defaultTimePattern,
  fromFlatpickrFormat,
  parseDatePattern,
  parseTimePattern,
  timePlaceholder,
  toFlatpickrFormat,
} from './pattern.js';

test('the shipped formats parse', () => {
  expect(parseDatePattern(defaultDateFormat)).toEqual(defaultDatePattern);
  expect(datePlaceholder(defaultDatePattern)).toBe(defaultDateFormat);
  expect(parseTimePattern(defaultTimeFormat)).toEqual(defaultTimePattern);
  expect(timePlaceholder(defaultTimePattern)).toBe(defaultTimeFormat);
});

describe('date patterns', () => {
  test('read the order and the separator', () => {
    expect(parseDatePattern('dd.mm.yyyy')).toEqual({
      order: ['day', 'month', 'year'],
      separator: '.',
    });
    expect(parseDatePattern('yyyy-mm-dd')).toEqual({
      order: ['year', 'month', 'day'],
      separator: '-',
    });
    expect(parseDatePattern('mm/dd/yyyy')).toEqual({
      order: ['month', 'day', 'year'],
      separator: '/',
    });
  });

  test('reject anything outside the grammar', () => {
    for (const bad of [
      '',
      'dd.mm.yy',
      'd.m.yyyy',
      'dd.mm-yyyy',
      'dd..mm..yyyy',
      'ddmmyyyy',
      'dd.dd.yyyy',
      'dd.mm.yyyy ',
      'ddamma yyyy',
      'dd1mm1yyyy',
      String.raw`dd\mm\yyyy`,
      'DD.MM.YYYY',
    ]) {
      expect(() => parseDatePattern(bad), bad).toThrow(RangeError);
    }
  });

  test('map to and from flatpickr', () => {
    const cases = [
      ['dd.mm.yyyy', 'd.m.Y'],
      ['dd/mm/yyyy', 'd/m/Y'],
      ['yyyy-mm-dd', 'Y-m-d'],
    ] as const;
    for (const [format, flatpickr] of cases) {
      const pattern = parseDatePattern(format);
      expect(toFlatpickrFormat(pattern)).toBe(flatpickr);
      expect(fromFlatpickrFormat(flatpickr)).toEqual(pattern);
    }
    for (const outside of ['F j, Y', 'm/d/y', 'j.n.Y', 'd.m.Y H:i', 'd.d.Y']) {
      expect(fromFlatpickrFormat(outside), outside).toBeUndefined();
    }
  });

  test('build placeholders and input patterns that browsers accept', () => {
    expect(datePlaceholder(parseDatePattern('yyyy-mm-dd'))).toBe('yyyy-mm-dd');
    expect(dateInputPattern(parseDatePattern('dd.mm.yyyy'))).toBe(
      String.raw`\d{2}\.\d{2}\.\d{4}`
    );
    expect(dateInputPattern(parseDatePattern('yyyy-mm-dd'))).toBe(
      String.raw`\d{4}-\d{2}-\d{2}`
    );
    const cases = [
      ['dd.mm.yyyy', '07.10.2026', '07-10-2026'],
      ['dd/mm/yyyy', '07/10/2026', '07.10.2026'],
      ['yyyy-mm-dd', '2026-10-07', '2026.10.07'],
      ['dd mm yyyy', '07 10 2026', '7 10 2026'],
    ] as const;
    for (const [format, good, bad] of cases) {
      // Browsers wrap the attribute as ^(?:...)$ with the v flag.
      const regExp = new RegExp(
        `^(?:${dateInputPattern(parseDatePattern(format))})$`,
        'v'
      );
      expect(regExp.test(good), good).toBe(true);
      expect(regExp.test(bad), bad).toBe(false);
    }
  });
});

describe('time patterns', () => {
  test('read the separator and seconds', () => {
    expect(parseTimePattern('hh:mm')).toEqual({
      separator: ':',
      seconds: false,
    });
    expect(parseTimePattern('hh:mm:ss')).toEqual({
      separator: ':',
      seconds: true,
    });
    expect(parseTimePattern('hh.mm')).toEqual({
      separator: '.',
      seconds: false,
    });
  });

  test('build placeholders', () => {
    expect(timePlaceholder(parseTimePattern('hh:mm:ss'))).toBe('hh:mm:ss');
    expect(timePlaceholder({ ...defaultTimePattern, seconds: true })).toBe(
      'hh:mm:ss'
    );
  });

  test('reject anything outside the grammar', () => {
    for (const bad of [
      '',
      'hh',
      'h:mm',
      'hh:mm:s',
      'hh:mm.ss',
      'mm:hh',
      'hhmm',
      'HH:mm',
      'hh:mm a',
    ]) {
      expect(() => parseTimePattern(bad), bad).toThrow(RangeError);
    }
  });
});
