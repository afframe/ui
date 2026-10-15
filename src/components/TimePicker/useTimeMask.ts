'use client';
import { useMemo, type InputHTMLAttributes } from 'react';
import { defaultTimePattern } from '../../format/index.js';
import { timeMaskSpec, useInputMask } from '../../mask/index.js';

/** The props TimePicker and FluidTimePicker add to Carbon's. */
export interface TimeMaskProps {
  /**
   * `'h23'` (default) takes 00:00 to 23:59; `'h12'` takes 01:00 to 12:59, for
   * a field with an AM/PM select.
   */
  hourCycle?: 'h12' | 'h23';
  /** Adds seconds: `hh:mm:ss` instead of `hh:mm`. */
  seconds?: boolean;
  /**
   * Masks typing to the system time format (`defaultTimeFormat` in
   * `@afframe/ui/format`). `false` keeps Carbon's input as it is.
   */
  inputMask?: boolean;
}

type InputProps = InputHTMLAttributes<HTMLInputElement>;
type Masked = Pick<
  InputProps,
  | 'onFocus'
  | 'onChange'
  | 'onCompositionEnd'
  | 'inputMode'
  | 'autoComplete'
  | 'placeholder'
  | 'pattern'
  | 'maxLength'
>;

/**
 * Splits the time-mask props off `props` and merges the mask into the rest:
 * the mask's handlers run before the caller's, the caller's placeholder,
 * pattern, inputMode and autoComplete win, and maxLength follows the mask.
 */
export function useTimeMask<P extends Partial<Masked>>({
  hourCycle = 'h23',
  seconds = false,
  inputMask = true,
  ...props
}: P & TimeMaskProps): Omit<P, keyof TimeMaskProps> {
  const spec = useMemo(
    () =>
      timeMaskSpec({
        seconds,
        hourCycle,
        separator: defaultTimePattern.separator,
      }),
    [seconds, hourCycle]
  );
  const mask = useInputMask(spec);
  if (!inputMask) return props;
  const {
    onFocus,
    onChange,
    onCompositionEnd,
    inputMode = mask.inputMode,
    autoComplete = mask.autoComplete,
    placeholder = spec.placeholder,
    pattern = mask.pattern,
  } = props;
  const masked: Required<Masked> = {
    inputMode,
    autoComplete,
    placeholder,
    pattern,
    // A shorter limit would block the last digits, so the mask sets it.
    maxLength: spec.placeholder.length,
    onFocus: (event) => {
      mask.onFocus(event);
      onFocus?.(event);
    },
    onChange: (event) => {
      mask.onChange(event);
      onChange?.(event);
    },
    onCompositionEnd: (event) => {
      mask.onCompositionEnd(event);
      onCompositionEnd?.(event);
    },
  };
  return { ...props, ...masked };
}
