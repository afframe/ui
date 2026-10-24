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
      formatAmount(value, {
        ...options,
        locale: options?.locale ?? locale,
        currency: options?.currency ?? currency,
      }),
    roundAmount: (
      value: number,
      options?: { currency?: string; digits?: number }
    ) =>
      roundAmount(value, {
        ...options,
        currency: options?.currency ?? currency,
      }),
    formatNumber: (
      value: number,
      options?: Intl.NumberFormatOptions & { locale?: string }
    ) => formatNumber(value, { ...options, locale: options?.locale ?? locale }),
    formatDate: (value: DateInput, options?: DateFormatOptions) =>
      formatDate(value, {
        ...options,
        locale: options?.locale ?? locale,
        timeZone: options?.timeZone ?? timeZone,
      }),
    formatDateRange: (
      start: DateInput,
      end: DateInput,
      options?: DateFormatOptions
    ) =>
      formatDateRange(start, end, {
        ...options,
        locale: options?.locale ?? locale,
        timeZone: options?.timeZone ?? timeZone,
      }),
    civilDateIn: (instant: Date | number, zone: string = timeZone) =>
      civilDateIn(instant, zone),
    startOfDayIn: (date: CivilDate, zone: string = timeZone) =>
      startOfDayIn(date, zone),
    getDateRangePreset: (
      preset: DateRangePreset,
      options?: DateRangePresetOptions
    ) =>
      getDateRangePreset(preset, {
        ...options,
        timeZone: options?.timeZone ?? timeZone,
        weekStartsOn: options?.weekStartsOn ?? weekStartsOn,
      }),
  };
}

export type Format = ReturnType<typeof createFormat>;
