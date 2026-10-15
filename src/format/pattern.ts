import { defaultDateFormat, defaultTimeFormat } from './defaults.js';

// The grammar of the system date and time format (ADR 0021) and its
// translations for flatpickr, placeholders and the input `pattern` attribute.

export type DatePart = 'day' | 'month' | 'year';

/** A parsed date format: the order of its parts and the one separator. */
export interface DatePattern {
  readonly order: readonly [DatePart, DatePart, DatePart];
  readonly separator: string;
}

/** A parsed 24-hour time format (`hh:mm` or `hh:mm:ss`). */
export interface TimePattern {
  readonly separator: string;
  readonly seconds: boolean;
}

// One character that is not a letter, a digit or a backslash (flatpickr's
// escape character).
const separator = String.raw`[^\p{L}\p{N}\\]`;

const dateTokens: Record<string, DatePart> = {
  dd: 'day',
  mm: 'month',
  yyyy: 'year',
};
const flatpickrTokens: Record<DatePart, string> = {
  day: 'd',
  month: 'm',
  year: 'Y',
};
const placeholderTokens: Record<DatePart, string> = {
  day: 'dd',
  month: 'mm',
  year: 'yyyy',
};
const digitCounts: Record<DatePart, number> = { day: 2, month: 2, year: 4 };

function matchDate(
  format: string,
  tokens: Record<string, DatePart>
): DatePattern | undefined {
  const token = Object.keys(tokens).join('|');
  const match = new RegExp(
    `^(${token})(${separator})(${token})\\2(${token})$`,
    'u'
  ).exec(format);
  if (!match) return undefined;
  const order = [match[1], match[3], match[4]].map(
    (t) => tokens[t ?? ''] as DatePart
  ) as [DatePart, DatePart, DatePart];
  if (new Set(order).size !== 3) return undefined;
  return { order, separator: match[2] ?? '' };
}

/**
 * Parses a date format: `dd`, `mm` and `yyyy` once each, in any order, joined
 * by one separator character (`dd.mm.yyyy`, `yyyy-mm-dd`). Throws a
 * `RangeError` on anything else.
 */
export function parseDatePattern(format: string): DatePattern {
  const pattern = matchDate(format, dateTokens);
  if (!pattern) {
    throw new RangeError(
      `Expected a date format of dd, mm and yyyy with one separator, got "${format.slice(0, 40)}"`
    );
  }
  return pattern;
}

/** The flatpickr `dateFormat` of a pattern: `dd.mm.yyyy` gives `d.m.Y`. */
export function toFlatpickrFormat(pattern: DatePattern): string {
  return pattern.order
    .map((part) => flatpickrTokens[part])
    .join(pattern.separator);
}

/**
 * The pattern of a flatpickr `dateFormat` (`d.m.Y`), or `undefined` for a
 * format outside the grammar (`F j, Y`, `m/d/y`).
 */
export function fromFlatpickrFormat(format: string): DatePattern | undefined {
  return matchDate(format, { d: 'day', m: 'month', Y: 'year' });
}

/** The placeholder of a date field: the format itself, `dd.mm.yyyy`. */
export function datePlaceholder(pattern: DatePattern): string {
  return pattern.order
    .map((part) => placeholderTokens[part])
    .join(pattern.separator);
}

// Browsers compile the `pattern` attribute with the `v` flag, where escaping
// a non-syntax character (`\-`) is an error that drops the constraint.
const escapeRegExp = (text: string) =>
  text.replace(/[\\^$.*+?()[\]{}|/]/g, String.raw`\$&`);

/** The input `pattern` attribute of a date field: `\d{2}\.\d{2}\.\d{4}`. */
export function dateInputPattern(pattern: DatePattern): string {
  return pattern.order
    .map((part) => String.raw`\d{${digitCounts[part]}}`)
    .join(escapeRegExp(pattern.separator));
}

/**
 * Parses a 24-hour time format, `hh:mm` or `hh:mm:ss`, with one separator
 * character. Throws a `RangeError` on anything else.
 */
export function parseTimePattern(format: string): TimePattern {
  const match = new RegExp(`^hh(${separator})mm(?:\\1(ss))?$`, 'u').exec(
    format
  );
  if (!match) {
    throw new RangeError(
      `Expected a time format of hh, mm and optional ss with one separator, got "${format.slice(0, 40)}"`
    );
  }
  return { separator: match[1] ?? '', seconds: match[2] !== undefined };
}

/** The placeholder of a time field: `hh:mm`, or `hh:mm:ss` with seconds. */
export function timePlaceholder(pattern: TimePattern): string {
  const s = pattern.separator;
  return pattern.seconds ? `hh${s}mm${s}ss` : `hh${s}mm`;
}

// Parsed when the module loads, so a typo in the setting fails at once.
/** The parsed system date format (`defaultDateFormat`). */
export const defaultDatePattern = parseDatePattern(defaultDateFormat);
/** The parsed system time format (`defaultTimeFormat`). */
export const defaultTimePattern = parseTimePattern(defaultTimeFormat);
