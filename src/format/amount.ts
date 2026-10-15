import {
  defaultCurrency,
  defaultLocale,
  defaultMaxFractionDigits,
} from './defaults.js';

// Rounding, zero and NaN rules: src/format/Formatting.mdx.

export interface AmountOptions {
  /** BCP 47 locale. Default `cs-CZ`. */
  locale?: string;
  /** ISO 4217 currency code. Default `CZK`. */
  currency?: string;
  /** Minor digits to round to. Default `currencyDigits(currency)`. */
  digits?: number;
}

type IntlAmountOptions = Pick<
  Intl.NumberFormatOptions,
  'signDisplay' | 'currencyDisplay' | 'currencySign' | 'trailingZeroDisplay'
>;

export interface FormatAmountOptions extends AmountOptions, IntlAmountOptions {
  /** Intl `signDisplay`. Default `negative` (no sign on zero). */
  signDisplay?: IntlAmountOptions['signDisplay'];
  /** Intl `currencyDisplay`. Default `symbol`. */
  currencyDisplay?: IntlAmountOptions['currencyDisplay'];
  /** Intl `currencySign`. `accounting` puts negatives in parentheses in some locales. */
  currencySign?: IntlAmountOptions['currencySign'];
  /** Intl `trailingZeroDisplay`. `stripIfInteger` prints `12 Kč` for 12. */
  trailingZeroDisplay?: IntlAmountOptions['trailingZeroDisplay'];
}

// Intl formatters are slow to build; a table renders thousands of amounts.
// ponytail: cleared when full, an LRU if apps use many option sets.
const formatters = new Map<string, Intl.NumberFormat>();

function numberFormat(
  locale: string,
  options: Intl.NumberFormatOptions
): Intl.NumberFormat {
  const key = `${locale}|${JSON.stringify(options)}`;
  let format = formatters.get(key);
  if (!format) {
    if (formatters.size >= 100) formatters.clear();
    format = new Intl.NumberFormat(locale, options);
    formatters.set(key, format);
  }
  return format;
}

function assertFinite(value: number): void {
  if (!Number.isFinite(value)) {
    throw new RangeError(`Expected a finite number, got ${value}`);
  }
}

/**
 * The number of minor digits Intl uses for a currency (CZK 2, JPY 0). It comes
 * from the engine's locale data (CLDR), not ISO 4217: HUF and IDR give 0
 * where ISO 4217 lists 2. Pass `digits` to override.
 */
export function currencyDigits(currency: string = defaultCurrency): number {
  return (
    numberFormat('en-US', {
      style: 'currency',
      currency,
    }).resolvedOptions().maximumFractionDigits ?? 0
  );
}

/** Rounds an amount to the currency's minor digits, half away from zero. */
export function roundAmount(
  value: number,
  options?: Pick<AmountOptions, 'currency' | 'digits'>
): number {
  assertFinite(value);
  const digits = options?.digits ?? currencyDigits(options?.currency);
  // 15 significant digits drop the binary noise of products like 9.5 * 0.21.
  const decimal = `${Number(value.toPrecision(15))}` as `${number}`;
  const rounded = Number(
    numberFormat('en-US', {
      useGrouping: false,
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
      roundingMode: 'halfExpand',
    }).format(decimal)
  );
  // `+ 0` turns -0 into 0.
  return rounded + 0;
}

/** Formats a money amount, rounded to the currency's minor digits. */
export function formatAmount(
  value: number,
  options?: FormatAmountOptions
): string {
  const {
    locale = defaultLocale,
    currency = defaultCurrency,
    digits,
    signDisplay = 'negative',
    ...intl
  } = options ?? {};
  const rounded = roundAmount(value, {
    currency,
    ...(digits === undefined ? {} : { digits }),
  });
  return numberFormat(locale, {
    ...intl,
    style: 'currency',
    currency,
    roundingMode: 'halfExpand',
    signDisplay,
    ...(digits === undefined
      ? {}
      : { minimumFractionDigits: digits, maximumFractionDigits: digits }),
  }).format(rounded);
}

/**
 * Formats a plain number. Intl options pass through; zero never shows a minus
 * sign; NaN and Infinity throw a RangeError. Decimal and unit numbers show at
 * most 2 decimals unless the options set fraction or significant digits.
 */
export function formatNumber(
  value: number,
  options?: Intl.NumberFormatOptions & { locale?: string }
): string {
  assertFinite(value);
  const { locale = defaultLocale, ...intl } = options ?? {};
  // Only where Intl's own default is 3: percent (0), currency (its digits) and
  // compact notation (significant digits) keep Intl's rounding. Any digit
  // option skips it, so a minimumFractionDigits above 2 cannot throw.
  const twoDecimals =
    (intl.style === undefined ||
      intl.style === 'decimal' ||
      intl.style === 'unit') &&
    intl.notation !== 'compact' &&
    intl.minimumFractionDigits === undefined &&
    intl.maximumFractionDigits === undefined &&
    intl.minimumSignificantDigits === undefined &&
    intl.maximumSignificantDigits === undefined;
  return numberFormat(locale, {
    signDisplay: 'negative',
    ...(twoDecimals ? { maximumFractionDigits: defaultMaxFractionDigits } : {}),
    ...intl,
  }).format(value);
}
