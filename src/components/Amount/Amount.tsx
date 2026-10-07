import type { DataHTMLAttributes, ReactNode } from 'react';
import {
  formatAmount,
  roundAmount,
  type FormatAmountOptions,
} from '../../format/amount.js';

export interface AmountProps
  extends
    FormatAmountOptions,
    Omit<DataHTMLAttributes<HTMLDataElement>, 'value' | 'children'> {
  /** The amount, rounded to the currency's minor digits for display. */
  value: number;
  /** Colour negative amounts with Carbon's `text-error` token. */
  colorNegative?: boolean;
  /**
   * Shown instead of the amount when `value` is NaN or Infinity. Without it
   * a non-finite `value` throws.
   */
  fallback?: ReactNode;
}

/**
 * A money amount in a `<data>` element: the text is formatted (default
 * `cs-CZ`, CZK) and `value` holds the rounded number for machines.
 * Server-safe: no hooks, no client code.
 */
export function Amount({
  value,
  currency,
  locale,
  digits,
  signDisplay,
  currencyDisplay,
  currencySign,
  trailingZeroDisplay,
  colorNegative = false,
  fallback,
  className,
  ...rest
}: AmountProps) {
  if (fallback !== undefined && !Number.isFinite(value)) {
    // A <data> element needs a value, so the fallback renders in a <span>.
    return (
      <span
        {...rest}
        className={
          className ? `afframe-amount ${className}` : 'afframe-amount'
        }>
        {fallback}
      </span>
    );
  }
  const options: FormatAmountOptions = {
    ...(currency === undefined ? {} : { currency }),
    ...(locale === undefined ? {} : { locale }),
    ...(digits === undefined ? {} : { digits }),
    ...(signDisplay === undefined ? {} : { signDisplay }),
    ...(currencyDisplay === undefined ? {} : { currencyDisplay }),
    ...(currencySign === undefined ? {} : { currencySign }),
    ...(trailingZeroDisplay === undefined ? {} : { trailingZeroDisplay }),
  };
  const rounded = roundAmount(value, options);
  const classes = ['afframe-amount'];
  if (colorNegative && rounded < 0) classes.push('afframe-amount-negative');
  if (className) classes.push(className);
  return (
    <data {...rest} className={classes.join(' ')} value={String(rounded)}>
      {formatAmount(rounded, options)}
    </data>
  );
}
