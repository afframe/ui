import { defaultCurrency, defaultLocale, defaultTimeZone } from './defaults.js';
import {
  formatAmount,
  formatNumber,
  roundAmount,
  type FormatAmountOptions,
} from './amount.js';
import {
  civilDateIn,
  formatDate,
  formatDateRange,
  getDateRangePreset,
  startOfDayIn,
  type CivilDate,
  type DateFormatOptions,
  type DateInput,
  type DateRangePreset,
  type DateRangePresetOptions,
} from './date.js';

export interface FormatDefaults {
  /** BCP 47 locale. Default `cs-CZ`. */
  locale?: string;
  /** ISO 4217 currency code. Default `CZK`. */
  currency?: string;
  /** IANA time zone. Default `Europe/Prague`. */
  timeZone?: string;
  /** First day of the week for presets, 0 Sunday to 6 Saturday. Default 1. */
  weekStartsOn?: DateRangePresetOptions['weekStartsOn'];
}

/**
 * The formatters with app-wide defaults. Call it once in a module and import
 * that module where the app formats; options per call still win. Server-safe,
 * so it works in server and client components alike.
 */
export function createFormat(defaults: FormatDefaults = {}) {
  const locale = defaults.locale ?? defaultLocale;
  const currency = defaults.currency ?? defaultCurrency;
  const timeZone = defaults.timeZone ?? defaultTimeZone;
  const weekStartsOn = defaults.weekStartsOn ?? 1;
  return {
    locale,
    currency,
    timeZone,
    formatAmount: (value: number, options?: FormatAmountOptions) =>
      formatAmount(value, { locale, currency, ...options }),
    roundAmount: (
      value: number,
      options?: { currency?: string; digits?: number }
    ) => roundAmount(value, { currency, ...options }),
    formatNumber: (
      value: number,
      options?: Intl.NumberFormatOptions & { locale?: string }
    ) => formatNumber(value, { locale, ...options }),
    formatDate: (value: DateInput, options?: DateFormatOptions) =>
      formatDate(value, { locale, timeZone, ...options }),
    formatDateRange: (
      start: DateInput,
      end: DateInput,
      options?: DateFormatOptions
    ) => formatDateRange(start, end, { locale, timeZone, ...options }),
    civilDateIn: (instant: Date | number, zone: string = timeZone) =>
      civilDateIn(instant, zone),
    startOfDayIn: (date: CivilDate, zone: string = timeZone) =>
      startOfDayIn(date, zone),
    getDateRangePreset: (
      preset: DateRangePreset,
      options?: DateRangePresetOptions
    ) => getDateRangePreset(preset, { timeZone, weekStartsOn, ...options }),
  };
}

export type Format = ReturnType<typeof createFormat>;
