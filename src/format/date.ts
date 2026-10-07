import { defaultLocale, defaultTimeZone } from './defaults.js';

// Instants vs civil dates: src/format/Formatting.mdx. Calendar math runs on UTC
// dates, so the machine's own zone never leaks in.

/** A calendar day as `YYYY-MM-DD`, with no time zone. */
export type CivilDate = `${number}-${number}-${number}`;

export type DateInput = Date | number | string;

export interface DateFormatOptions extends Intl.DateTimeFormatOptions {
  /** BCP 47 locale. Default `cs-CZ`. */
  locale?: string;
}

const civilPattern = /^(\d{4})-(\d{2})-(\d{2})$/;
// Date.parse rolls 30 February over and accepts T24:00, so the parts are
// checked here and the date by parseCivil. PostgreSQL sends microseconds;
// Date.parse is only specified for milliseconds, so the rest is cut.
const instantPattern =
  /^(\d{4}-\d{2}-\d{2})T([01]\d|2[0-3]):[0-5]\d(:[0-5]\d(\.\d{1,9})?)?(Z|[+-]([01]\d|2[0-3]):[0-5]\d)$/;

// Intl formatters are slow to build; presets and tables call them often.
// ponytail: cleared when full, as in amount.ts.
const formatters = new Map<string, Intl.DateTimeFormat>();

function dateTimeFormat(
  locale: string,
  options: Intl.DateTimeFormatOptions
): Intl.DateTimeFormat {
  const key = `${locale}|${JSON.stringify(options)}`;
  let format = formatters.get(key);
  if (!format) {
    if (formatters.size >= 100) formatters.clear();
    format = new Intl.DateTimeFormat(locale, options);
    formatters.set(key, format);
  }
  return format;
}

// Node's ICU puts U+2009 around a range dash and U+202F before AM/PM where
// Chromium may use U+0020; one form keeps server and client output equal.
function plainSpaces(text: string): string {
  return text.replace(/[\u2009\u202f]/g, ' ');
}

/** Parses `YYYY-MM-DD` to UTC midnight; throws on anything else. */
function parseCivil(date: string): Date {
  const match = civilPattern.exec(date);
  const utc = match
    ? new Date(
        Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
      )
    : undefined;
  if (!utc || toCivil(utc) !== date) {
    throw new RangeError(
      `Expected a date as YYYY-MM-DD, got "${date.slice(0, 40)}"`
    );
  }
  return utc;
}

function toCivil(utc: Date): CivilDate {
  return utc.toISOString().slice(0, 10) as CivilDate;
}

const isCivil = (value: DateInput) =>
  typeof value === 'string' && !value.includes('T');

function parseInput(value: DateInput): Date {
  if (typeof value !== 'string') return new Date(value);
  if (isCivil(value)) return parseCivil(value);
  const match = instantPattern.exec(value);
  if (!match) {
    throw new RangeError(
      `Expected YYYY-MM-DD or an ISO timestamp with Z or an offset, got "${value.slice(0, 40)}"`
    );
  }
  parseCivil(match[1] ?? '');
  return new Date(Date.parse(value.replace(/(\.\d{1,3})\d+/, '$1')));
}

function formatter(
  value: DateInput,
  options: DateFormatOptions | undefined
): [Intl.DateTimeFormat, Date] {
  const { locale = defaultLocale, ...intl } = options ?? {};
  const civil = isCivil(value);
  const date = parseInput(value);
  if (Number.isNaN(date.getTime())) {
    throw new RangeError('Invalid date');
  }
  const hasFields = Object.keys(intl).some(
    (key) =>
      key !== 'timeZone' && key !== 'calendar' && key !== 'numberingSystem'
  );
  return [
    dateTimeFormat(locale, {
      ...(hasFields ? {} : { dateStyle: 'medium' }),
      ...intl,
      // A civil date is the same day everywhere.
      timeZone: civil ? 'UTC' : (intl.timeZone ?? defaultTimeZone),
    }),
    date,
  ];
}

/** Formats a date. Default: `cs-CZ`, medium date style, Europe/Prague. */
export function formatDate(
  value: DateInput,
  options?: DateFormatOptions
): string {
  const [format, date] = formatter(value, options);
  return plainSpaces(format.format(date));
}

/**
 * Formats a date range with Intl's range rules; spaces around the dash are
 * U+0020. The ends print in the given order, not sorted.
 */
export function formatDateRange(
  start: DateInput,
  end: DateInput,
  options?: DateFormatOptions
): string {
  if (isCivil(start) !== isCivil(end)) {
    throw new TypeError('Range ends must both be civil dates or both instants');
  }
  const [format, from] = formatter(start, options);
  const [, to] = formatter(end, options);
  return plainSpaces(format.formatRange(from, to));
}

/** The civil date (`YYYY-MM-DD`) of an instant in a time zone. */
export function civilDateIn(
  instant: Date | number,
  timeZone: string = defaultTimeZone
): CivilDate {
  const parts = dateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(instant);
  const part = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? '';
  return `${part('year').padStart(4, '0')}-${part('month')}-${part('day')}` as CivilDate;
}

function offsetAt(instant: number, timeZone: string): number {
  const parts = dateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }).formatToParts(instant);
  const part = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value);
  const wall = Date.UTC(
    part('year'),
    part('month') - 1,
    part('day'),
    part('hour'),
    part('minute'),
    part('second')
  );
  return wall - Math.floor(instant / 1000) * 1000;
}

/**
 * The instant a civil date starts in a time zone. For queries use half-open
 * bounds: `start <= t < startOfDayIn(dayAfterEnd)`.
 */
// ponytail: assumes local midnight exists; zones that jump at 00:00 (America/Santiago) get the hour before. Prague jumps at 02:00.
export function startOfDayIn(
  date: CivilDate,
  timeZone: string = defaultTimeZone
): Date {
  const midnight = parseCivil(date).getTime();
  const guess = midnight - offsetAt(midnight, timeZone);
  return new Date(midnight - offsetAt(guess, timeZone));
}

/** Adds days to a civil date. */
export function addDays(date: CivilDate, days: number): CivilDate {
  const utc = parseCivil(date);
  utc.setUTCDate(utc.getUTCDate() + days);
  return toCivil(utc);
}

/**
 * A civil date as a local `Date` at midnight, the form Carbon's `DatePicker`
 * reads (it works in the browser's own time zone).
 */
export function civilDateToLocalDate(date: CivilDate): Date {
  const utc = parseCivil(date);
  return new Date(utc.getUTCFullYear(), utc.getUTCMonth(), utc.getUTCDate());
}

/**
 * The civil date of a local `Date`, the form Carbon's `DatePicker` returns.
 * Reads the local calendar fields, so the browser's zone gives the day the
 * user picked.
 */
export function localDateToCivilDate(date: Date): CivilDate {
  if (Number.isNaN(date.getTime())) throw new RangeError('Invalid date');
  return toCivil(
    new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  );
}

export const dateRangePresets = [
  'today',
  'yesterday',
  'thisWeek',
  'lastWeek',
  'last7Days',
  'last30Days',
  'thisMonth',
  'lastMonth',
  'thisQuarter',
  'lastQuarter',
  'thisYear',
  'lastYear',
] as const;

export type DateRangePreset = (typeof dateRangePresets)[number];

/** English labels for the presets (ADR 0014); override per app. */
export const defaultDateRangePresetMessages: Record<DateRangePreset, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  thisWeek: 'This week',
  lastWeek: 'Last week',
  last7Days: 'Last 7 days',
  last30Days: 'Last 30 days',
  thisMonth: 'This month',
  lastMonth: 'Last month',
  thisQuarter: 'This quarter',
  lastQuarter: 'Last quarter',
  thisYear: 'This year',
  lastYear: 'Last year',
};

export interface DateRangePresetOptions {
  /** The current instant. Default: now. */
  now?: Date | number;
  /** Time zone that decides what "today" is. Default `Europe/Prague`. */
  timeZone?: string;
  /** First day of the week, 0 Sunday to 6 Saturday. Default 1 (Monday, ISO 8601). */
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

/** An inclusive range of civil dates (`YYYY-MM-DD`). */
export interface CivilDateRange {
  start: CivilDate;
  end: CivilDate;
}

/**
 * The civil date range of a preset. Week, month, quarter and year presets
 * cover the whole period, including days after today.
 */
export function getDateRangePreset(
  preset: DateRangePreset,
  options?: DateRangePresetOptions
): CivilDateRange {
  const today = civilDateIn(options?.now ?? Date.now(), options?.timeZone);
  const t = parseCivil(today);
  const year = t.getUTCFullYear();
  const month = t.getUTCMonth();
  const day = (y: number, m: number, d: number) =>
    toCivil(new Date(Date.UTC(y, m, d)));
  const weekStart = addDays(
    today,
    -((t.getUTCDay() - (options?.weekStartsOn ?? 1) + 7) % 7)
  );
  const quarter = month - (month % 3);
  switch (preset) {
    case 'today':
      return { start: today, end: today };
    case 'yesterday': {
      const yesterday = addDays(today, -1);
      return { start: yesterday, end: yesterday };
    }
    case 'thisWeek':
      return { start: weekStart, end: addDays(weekStart, 6) };
    case 'lastWeek':
      return { start: addDays(weekStart, -7), end: addDays(weekStart, -1) };
    case 'last7Days':
      return { start: addDays(today, -6), end: today };
    case 'last30Days':
      return { start: addDays(today, -29), end: today };
    case 'thisMonth':
      return { start: day(year, month, 1), end: day(year, month + 1, 0) };
    case 'lastMonth':
      return { start: day(year, month - 1, 1), end: day(year, month, 0) };
    case 'thisQuarter':
      return { start: day(year, quarter, 1), end: day(year, quarter + 3, 0) };
    case 'lastQuarter':
      return { start: day(year, quarter - 3, 1), end: day(year, quarter, 0) };
    case 'thisYear':
      return { start: day(year, 0, 1), end: day(year, 11, 31) };
    case 'lastYear':
      return { start: day(year - 1, 0, 1), end: day(year - 1, 11, 31) };
  }
}
