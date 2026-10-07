'use client';
import { NumberInput, type NumberInputProps } from '@carbon/react';
import { useMemo, useState } from 'react';
import { defaultCurrency, defaultLocale } from '../../format/defaults.js';
import { formatAmount, roundAmount } from '../../format/amount.js';
import { resolveMessages } from '../../messages.js';

export interface AmountInputMessages {
  /** Accessible name of the step-up button. */
  increment: string;
  /** Accessible name of the step-down button. */
  decrement: string;
  /** Shown when the amount is out of range; limits come formatted. */
  invalidText: (limits: { min?: string; max?: string }) => string;
  /** Shown when the text holds a separator the locale does not use for decimals. */
  invalidSeparator: (decimal: string) => string;
}

export const defaultAmountInputMessages: AmountInputMessages = {
  increment: 'Increase amount',
  decrement: 'Decrease amount',
  invalidText: ({ min, max }) =>
    min !== undefined && max !== undefined
      ? `Enter an amount from ${min} to ${max}.`
      : min !== undefined
        ? `Enter an amount of at least ${min}.`
        : max !== undefined
          ? `Enter an amount of at most ${max}.`
          : 'Enter a valid amount.',
  invalidSeparator: (decimal) => `Use "${decimal}" for decimals.`,
};

export interface AmountInputProps extends Omit<
  NumberInputProps,
  | 'value'
  | 'defaultValue'
  | 'onChange'
  | 'type'
  | 'locale'
  | 'formatOptions'
  | 'allowEmpty'
  | 'translateWithId'
  | 'iconDescription'
  | 'label'
> {
  /** Visible label. */
  label: NonNullable<NumberInputProps['label']>;
  /** The amount; `null` is empty. Leave undefined for an uncontrolled input. */
  value?: number | null;
  /** Starting amount of an uncontrolled input. */
  defaultValue?: number | null;
  /**
   * Called on blur and on each step (not on each keystroke) with the amount
   * rounded to the currency's minor digits, or `null` when empty.
   */
  onChange?: (value: number | null) => void;
  /** ISO 4217 currency code. Default `CZK`. */
  currency?: string;
  /** BCP 47 locale for typing and display. Default `cs-CZ`. */
  locale?: string;
  /** Overrides for the English strings. */
  messages?: Partial<AmountInputMessages>;
}

// Carbon reads NaN as empty; undefined would make the input uncontrolled.
const toCarbon = (value: number | null) => value ?? Number.NaN;

/**
 * The locale's decimal separator and a test for text holding a `.` or `,`
 * that is neither its decimal nor its group separator. Carbon reads such a
 * dot as a decimal point, so cs-CZ "1.500" would become 1,50 Kč.
 */
function separators(locale: string, currency: string) {
  const parts = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).formatToParts(-12345.6);
  const part = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? '';
  const decimal = part('decimal');
  const known = new Set([decimal, part('group')]);
  const symbol = part('currency');
  const isForeign = (text: string) =>
    [...(symbol ? text.replaceAll(symbol, '') : text)].some(
      (char) => (char === '.' || char === ',') && !known.has(char)
    );
  return { decimal, isForeign };
}

/**
 * A money input on Carbon's `NumberInput` (`type="text"`): typed in the
 * locale's format, shown with the currency, reported as a rounded number.
 */
export function AmountInput({
  value,
  defaultValue,
  onChange,
  currency = defaultCurrency,
  locale = defaultLocale,
  messages,
  invalidText,
  min,
  max,
  // Carbon's default `[0-9]*` fails native validation on "7,00 Kč" and
  // blocks form submit; an empty pattern is ignored by Carbon.
  pattern = '.*',
  ...rest
}: AmountInputProps) {
  const text = resolveMessages(defaultAmountInputMessages, messages);
  const formatOptions = useMemo(
    () => ({
      style: 'currency' as const,
      currency,
      signDisplay: 'negative' as const,
    }),
    [currency]
  );
  const { decimal, isForeign } = useMemo(
    () => separators(locale, currency),
    [locale, currency]
  );
  // The text being typed, to pick the invalid message.
  const [draft, setDraft] = useState('');
  // Uncontrolled: the last reported amount, for the range check.
  const [reported, setReported] = useState(defaultValue ?? null);
  // Controlled: after rejected text is reported as null, Carbon keeps the
  // previous amount so it does not clear the text the person typed.
  const [held, setHeld] = useState<number | null | undefined>(undefined);
  // A new amount from the parent ends the hold (React's adjust-state-on-prop
  // pattern; the parent's null after a rejection keeps it).
  if (held !== undefined && value !== undefined && value !== null) {
    setHeld(undefined);
  }
  const report = (next: number | null) => {
    setReported(next);
    onChange?.(next);
  };
  const current = value === undefined ? reported : value;
  const outOfRange =
    current !== null &&
    ((min !== undefined && current < min) ||
      (max !== undefined && current > max));
  const limit = (bound: number) => formatAmount(bound, { currency, locale });
  // An infinite bound is no bound to show (formatAmount throws on it).
  const limits = {
    ...(min !== undefined && Number.isFinite(min) && { min: limit(min) }),
    ...(max !== undefined && Number.isFinite(max) && { max: limit(max) }),
  };
  return (
    <NumberInput
      {...rest}
      {...(min === undefined ? {} : { min })}
      {...(max === undefined ? {} : { max })}
      {...(value === undefined
        ? {}
        : {
            value: toCarbon(
              value === null && held !== undefined ? held : value
            ),
          })}
      {...(defaultValue === undefined
        ? {}
        : { defaultValue: toCarbon(defaultValue) })}
      // iOS's decimal keyboard has no minus key.
      inputMode={
        rest.inputMode ?? (min === undefined || min < 0 ? 'text' : 'decimal')
      }
      type="text"
      pattern={pattern}
      allowEmpty
      locale={locale}
      formatOptions={formatOptions}
      translateWithId={(id) =>
        id === 'increment.number' ? text.increment : text.decrement
      }
      // With `validate` set, Carbon checks min and max on the formatted
      // text, which it cannot parse; the range is checked here instead.
      invalid={rest.invalid === true || outOfRange}
      validate={(input) => !isForeign(input)}
      invalidText={
        invalidText ??
        (isForeign(draft)
          ? text.invalidSeparator(decimal)
          : text.invalidText(limits))
      }
      onInput={(event) => {
        setDraft(event.currentTarget.value);
        rest.onInput?.(event);
      }}
      onBlur={(event, parsed) => {
        // Carbon keeps rejected text and reports nothing; report null.
        if (isForeign(event.target.value)) {
          if (value !== undefined && held === undefined) setHeld(value);
          report(null);
        }
        rest.onBlur?.(event, parsed);
      }}
      onChange={(_event, state) => {
        const next = state.value;
        setDraft('');
        setHeld(undefined);
        report(
          typeof next === 'number' && Number.isFinite(next)
            ? roundAmount(next, { currency })
            : null
        );
      }}
    />
  );
}
