import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type CompositionEvent,
  type FocusEvent,
  type ReactNode,
} from 'react';
import {
  datePlaceholder,
  defaultDatePattern,
  fromFlatpickrFormat,
  toFlatpickrFormat,
  type DatePattern,
} from '../../format/index.js';
import { useInputMask, dateMaskSpec } from '../../mask/index.js';
import { resolveMessages } from '../../messages.js';

export interface DatePickerMessages {
  /** Shown under a date field whose text is not a complete, real date; `format` is the expected format, `dd.mm.yyyy`. */
  invalidDate: (format: string) => string;
}

export const defaultDatePickerMessages: DatePickerMessages = {
  invalidDate: (format) => `Enter a valid date as ${format}.`,
};

/** Props the Afframe date pickers add to Carbon's. */
export interface DateFieldProps {
  /** Masks typed dates to the date format and keeps an invalid date as typed, marked invalid. `false` keeps Carbon's behaviour. Default `true`. */
  inputMask?: boolean;
  messages?: Partial<DatePickerMessages>;
}

/**
 * The flatpickr format of a picker (the caller's, or the system format) and
 * its pattern, `undefined` when the format is outside the grammar.
 */
function resolveDateFormat(dateFormat: string | undefined): {
  dateFormat: string;
  pattern: DatePattern | undefined;
} {
  if (dateFormat === undefined) {
    return {
      dateFormat: toFlatpickrFormat(defaultDatePattern),
      pattern: defaultDatePattern,
    };
  }
  return { dateFormat, pattern: fromFlatpickrFormat(dateFormat) };
}

/** Warns in development when a caller's `dateFormat` cannot be masked. */
function useUnmaskableFormatWarning(
  name: string,
  dateFormat: string | undefined,
  masked: boolean
) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    if (!masked || dateFormat === undefined) return;
    if (fromFlatpickrFormat(dateFormat)) return;
    console.warn(
      `${name}: dateFormat "${dateFormat}" is not d, m and Y with one separator, so typed dates are not masked. Pass inputMask={false} to silence this.`
    );
  }, [name, dateFormat, masked]);
}

/**
 * A complete, zero-padded, real date in `pattern` (`31.01.2026`), or
 * `undefined`: no rollover of `31.02` into March.
 */
// fallow-ignore-next-line complexity -- one guard per part and per calendar field
export function parseStrictDate(
  text: string,
  pattern: DatePattern
): Date | undefined {
  const parts = text.split(pattern.separator);
  if (parts.length !== 3) return undefined;
  const values = { day: 0, month: 0, year: 0 };
  for (const [index, part] of pattern.order.entries()) {
    const digits = parts[index] ?? '';
    if (!new RegExp(`^\\d{${part === 'year' ? 4 : 2}}$`).test(digits)) {
      return undefined;
    }
    values[part] = Number(digits);
  }
  const date = new Date(2000, 0, 1);
  // setFullYear keeps years below 100 as typed; the Date constructor would
  // move them to 19xx.
  date.setFullYear(values.year, values.month - 1, values.day);
  if (
    date.getFullYear() !== values.year ||
    date.getMonth() !== values.month - 1 ||
    date.getDate() !== values.day
  ) {
    return undefined;
  }
  return date;
}

/** The props of a date input the wrapper reads and chains. */
interface DateInputProps {
  invalid?: boolean;
  invalidText?: ReactNode;
  placeholder?: string;
  value?: string;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  onCompositionEnd?: (event: CompositionEvent<HTMLInputElement>) => void;
}

type Pair<T> = [T, T];

interface DateFieldOptions {
  inputMask: boolean | undefined;
  messages: Partial<DatePickerMessages> | undefined;
  /** Component name for the development warning. */
  name: string;
  /** Carbon types a picker's children as `ReactNode | object`. */
  children: unknown;
  dateFormat: string | undefined;
  allowInput: boolean | undefined;
  /** The picker's value: when it becomes empty, the typed text is forgotten. */
  value: unknown;
  /**
   * flatpickr empties an input whose text it cannot parse, on blur and on a
   * click outside; the text typed last is written back.
   */
  restoreText: boolean;
  /** Set on the inputs as their value (the preview picker drops typed text otherwise). */
  controlText: boolean;
}

const inCalendar = (target: EventTarget | null) =>
  target instanceof Element && target.closest('.flatpickr-calendar') !== null;

const isEmpty = (value: unknown): boolean =>
  value == null ||
  value === '' ||
  (Array.isArray(value) && value.every(isEmpty));

const replaced = <T>(pair: Pair<T>, index: number, value: T): Pair<T> => {
  if (pair[index] === value) return pair;
  const next: Pair<T> = [...pair];
  next[index] = value;
  return next;
};

/**
 * The shared part of the Afframe date pickers. Resolves `dateFormat` (the
 * system format by default) and clones the first two children (the start and
 * end inputs) with the mask. On blur an incomplete or impossible date stays
 * as typed and the input is marked invalid, unless the input sets `invalid`
 * itself. Call `pickerChanged` with the dates the picker reports.
 */
export function useDateField({
  name,
  children,
  dateFormat: dateFormatProp,
  allowInput,
  inputMask = true,
  messages,
  value,
  restoreText,
  controlText,
}: DateFieldOptions) {
  const { dateFormat, pattern } = resolveDateFormat(dateFormatProp);
  const typeable = inputMask && allowInput !== false;
  const masked = typeable && pattern !== undefined;
  useUnmaskableFormatWarning(name, dateFormatProp, typeable);
  const effective = pattern ?? defaultDatePattern;
  const spec = useMemo(() => dateMaskSpec(effective), [effective]);
  const masks = [useInputMask(spec), useInputMask(spec)] as const;
  const text = resolveMessages(defaultDatePickerMessages, messages);
  const inputs = useRef<Pair<HTMLInputElement | null>>([null, null]);
  // The text typed last into each input.
  const typed = useRef<Pair<string>>(['', '']);
  const [invalid, setInvalid] = useState<Pair<boolean>>([false, false]);
  const [shown, setShown] = useState<Pair<string>>(['', '']);

  const cleared = isEmpty(value);
  useEffect(() => {
    if (!cleared) return;
    typed.current = ['', ''];
    setShown(['', '']);
    setInvalid([false, false]);
  }, [cleared]);

  const isInvalid = (input: string) =>
    input !== '' && parseStrictDate(input, effective) === undefined;
  const parseDate = (input: string) =>
    parseStrictDate(input, effective) ?? (false as const);

  /** The picker selected dates: its text replaces the typed one. */
  const pickerChanged = (dates: readonly unknown[]) => {
    if (!masked || dates.length === 0) return;
    typed.current = [
      inputs.current[0]?.value ?? '',
      inputs.current[1]?.value ?? '',
    ];
    setShown(['', '']);
    setInvalid([false, false]);
  };

  // The written-back text of every input, not only the blurred one: in a
  // range, flatpickr rewrites both inputs from its selected dates.
  const restore = () => {
    for (const [n, input] of inputs.current.entries()) {
      const last = typed.current[n] ?? '';
      if (input && input.value === '' && last !== '') input.value = last;
    }
  };

  const inputProps = (index: 0 | 1, own: DateInputProps) => {
    const mask = masks[index];
    const props: DateInputProps & Record<string, unknown> = {
      inputMode: mask.inputMode,
      autoComplete: mask.autoComplete,
      pattern: mask.pattern,
      placeholder: own.placeholder ?? mask.placeholder,
      onFocus: (event) => {
        inputs.current[index] = event.currentTarget;
        mask.onFocus(event);
        own.onFocus?.(event);
      },
      onChange: (event) => {
        mask.onChange(event);
        const current = event.currentTarget.value;
        typed.current[index] = current;
        if (controlText) setShown((pair) => replaced(pair, index, current));
        if (!isInvalid(current))
          setInvalid((pair) => replaced(pair, index, false));
        own.onChange?.(event);
      },
      onCompositionEnd: (event) => {
        mask.onCompositionEnd(event);
        own.onCompositionEnd?.(event);
      },
      onBlur: (event) => {
        inputs.current[index] = event.currentTarget;
        // React's onBlur listens to focusout, which follows the native blur
        // where flatpickr has already parsed and emptied the input.
        if (restoreText) restore();
        // Tab moves focus into the calendar: the date is not entered yet.
        if (!inCalendar(event.relatedTarget)) {
          const bad = isInvalid(event.currentTarget.value);
          setInvalid((pair) => replaced(pair, index, bad));
        }
        own.onBlur?.(event);
      },
    };
    if (controlText && own.value === undefined && shown[index] !== '') {
      props.value = shown[index];
    }
    if (own.invalid === undefined && invalid[index]) {
      props.invalid = true;
      props.invalidText =
        own.invalidText ?? text.invalidDate(datePlaceholder(effective));
    }
    return props;
  };

  const fieldChildren: ReactNode = masked
    ? Children.toArray(children as ReactNode).map((child, index) =>
        index < 2 && isValidElement<DateInputProps>(child)
          ? cloneElement(child, inputProps(index as 0 | 1, child.props))
          : child
      )
    : (children as ReactNode);

  return {
    dateFormat,
    /** The strict parser for flatpickr; absent when the format is outside the grammar. */
    parseDate: pattern && parseDate,
    children: fieldChildren,
    pickerChanged,
  };
}
