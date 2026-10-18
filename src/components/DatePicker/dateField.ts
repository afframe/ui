'use client';
import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useLayoutEffect,
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

// The package has no Node types; bundlers replace process.env.NODE_ENV, as
// they do in Carbon's own development warnings.
declare const process: { env: { NODE_ENV?: string } };

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

/** The part of the flatpickr instance the wrapper uses. */
interface Flatpickr {
  selectedDates: Date[];
  isEnabled: (date: Date) => boolean;
  setDate: (dates: Date[], triggerChange: boolean) => void;
}

interface DateFieldOptions {
  inputMask: boolean | undefined;
  messages: Partial<DatePickerMessages> | undefined;
  /** Component name for the development warning. */
  name: string;
  /** Carbon types a picker's children as `ReactNode | object`. */
  children: unknown;
  dateFormat: string | undefined;
  allowInput: boolean | undefined;
  /** The picker's value: when the app empties it, the inputs are emptied too. */
  value: unknown;
  /** Whether the caller passed `onChange`, so it can take the picker's reports. */
  hasOnChange: boolean;
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
 * end inputs) with the mask. On blur, on Enter and in a range end, an
 * incomplete, impossible or unavailable date stays as typed and the input is
 * marked invalid, unless the input sets `invalid` itself. Call
 * `pickerChanged` with the dates the picker reports.
 */
// fallow-ignore-next-line complexity -- one hook keeps the typed text, the picker's reports and the app's value in step
export function useDateField({
  name,
  children,
  dateFormat: dateFormatProp,
  allowInput,
  inputMask = true,
  messages,
  value,
  hasOnChange,
}: DateFieldOptions) {
  const { dateFormat, pattern } = useMemo(
    () => resolveDateFormat(dateFormatProp),
    [dateFormatProp]
  );
  const typeable = inputMask && allowInput !== false;
  const masked = typeable && pattern !== undefined;
  useUnmaskableFormatWarning(name, dateFormatProp, typeable);
  const effective = pattern ?? defaultDatePattern;
  const spec = useMemo(() => dateMaskSpec(effective), [effective]);
  const masks = [
    useInputMask(spec, masked),
    useInputMask(spec, masked),
  ] as const;
  const text = resolveMessages(defaultDatePickerMessages, messages);
  const inputs = useRef<Pair<HTMLInputElement | null>>([null, null]);
  // The text typed last into each input.
  const typed = useRef<Pair<string>>(['', '']);
  // Typed since the picker last took a date for the input.
  const dirty = useRef<Pair<boolean>>([false, false]);
  // onChange already told the app the typed text holds no date.
  const told = useRef<Pair<boolean>>([false, false]);
  // Whether the dates the picker reported last had a date per input.
  const reported = useRef<Pair<boolean>>([false, false]);
  const [invalid, setInvalid] = useState<Pair<boolean>>([false, false]);

  const cleared = isEmpty(value);
  const wasCleared = useRef(cleared);
  useEffect(() => {
    const emptied = cleared && !wasCleared.current;
    wasCleared.current = cleared;
    if (!emptied) return;
    // Text still kept invalid after onChange told the app it holds no date:
    // the empty value is the app taking that onChange([]), now or after an
    // await, not a reset. With no onChange, nothing can take it. Carbon's
    // reset reaches the picker only in its own effect, after this render.
    if (hasOnChange && told.current.some(Boolean) && invalid.some(Boolean)) {
      for (const [n, input] of inputs.current.entries()) {
        if (input && !input.value) input.value = typed.current[n] ?? '';
      }
      told.current = [false, false];
      return;
    }
    for (const input of inputs.current) if (input) input.value = '';
    typed.current = ['', ''];
    dirty.current = [false, false];
    told.current = [false, false];
    setInvalid([false, false]);
  }, [cleared, invalid, hasOnChange]);

  const isInvalid = (input: string) =>
    input !== '' && parseStrictDate(input, effective) === undefined;
  // Carbon creates flatpickr once with the first parseDate, so the parser is
  // one function that reads the current pattern. A layout effect updates it
  // before Carbon's passive effect hands flatpickr a new dateFormat.
  const effectiveRef = useRef(effective);
  useLayoutEffect(() => {
    effectiveRef.current = effective;
  }, [effective]);
  const [parseDate] = useState(
    () => (input: string) =>
      parseStrictDate(input, effectiveRef.current) ?? (false as const)
  );
  // flatpickr keeps its instance on the input it was created on: the start.
  const instance = () =>
    (inputs.current[0] as { _flatpickr?: Flatpickr } | null)?._flatpickr;
  // A real date that minDate, maxDate, enable or disable rule out.
  const unavailable = (input: string) => {
    const date = parseStrictDate(input, effective);
    const picker = instance();
    return (
      date !== undefined && picker !== undefined && !picker.isEnabled(date)
    );
  };
  const appHolds = (index: number) =>
    value === undefined
      ? reported.current[index]
      : Array.isArray(value)
        ? !isEmpty(value[index])
        : index === 0 && !isEmpty(value);

  /**
   * The picker reported dates: their text replaces the typed one. flatpickr
   * empties text it cannot take (Enter, a range end, minDate): typed text
   * with no date stays and is marked invalid. Returns whether it kept any.
   */
  const pickerChanged = (dates: readonly unknown[]) => {
    reported.current = [dates[0] != null, dates[1] != null];
    if (!masked) return false;
    const next: Pair<boolean> = [false, false];
    for (const n of [0, 1] as const) {
      const input = inputs.current[n];
      if (dates[n] == null && dirty.current[n] && typed.current[n] !== '') {
        const text = typed.current[n];
        const write = () => {
          if (input && input.value === '') input.value = text;
        };
        // Carbon's blur handler on a range end sets the dates again when it
        // finds text there (it takes an unparsable date for a valid one), so
        // a focused end gets its text after the blur.
        if (n === 1 && input === document.activeElement) setTimeout(write);
        else write();
        told.current[n] = true;
        next[n] = true;
      } else {
        typed.current[n] = input?.value ?? '';
        dirty.current[n] = false;
        told.current[n] = false;
      }
    }
    setInvalid(next);
    return next.some(Boolean);
  };

  /**
   * Text that turned invalid on leave: flatpickr dropped the date without
   * onChange, so the app is told once, unless it holds no date already.
   */
  const tellApp = (index: 0 | 1) => {
    const picker = instance();
    if (!picker || told.current[index] || !appHolds(index)) return;
    told.current[index] = true;
    const before = inputs.current.map((input) => input?.value ?? '');
    picker.setDate(index === 0 ? [] : picker.selectedDates.slice(0, 1), true);
    inputs.current.forEach((input, n) => {
      if (input && !input.value) input.value = before[n] ?? '';
    });
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
        // Carbon's own input listener runs first and may have taken the date.
        if (current !== typed.current[index]) {
          typed.current[index] = current;
          dirty.current[index] = true;
          told.current[index] = false;
        }
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
        restore();
        // Tab moves focus into the calendar: the date is not entered yet.
        if (!inCalendar(event.relatedTarget)) {
          const current = event.currentTarget.value;
          const bad = isInvalid(current) || unavailable(current);
          setInvalid((pair) => replaced(pair, index, bad));
          if (bad && dirty.current[index]) tellApp(index);
        }
        own.onBlur?.(event);
      },
    };
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
