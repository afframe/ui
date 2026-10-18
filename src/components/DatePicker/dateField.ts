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
import { usePrefix } from '@carbon/react';
import { useInputMask, dateMaskSpec } from '../../mask/index.js';
import { resolveMessages } from '../../messages.js';

export interface DatePickerMessages {
  /** Shown under a date field whose text is incomplete or malformed; `format` is the expected format, `dd.mm.yyyy`. */
  invalidDate: (format: string) => string;
  /** Shown under a date field whose full date does not exist, `31.02.2026`; `text` is the typed text. */
  impossibleDate: (text: string) => string;
  /** Shown under a date field whose real date `minDate`, `maxDate`, `enable` or `disable` rule out; `text` is the typed text. */
  unavailableDate: (text: string) => string;
}

export const defaultDatePickerMessages: DatePickerMessages = {
  invalidDate: (format) => `Enter the full date as ${format}.`,
  impossibleDate: (text) => `${text} is not a real date.`,
  unavailableDate: (text) => `${text} cannot be selected.`,
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

/** The parts of a complete, zero-padded date in `pattern`, real or not. */
function fullDateParts(text: string, pattern: DatePattern) {
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
  return values;
}

/**
 * A complete, zero-padded, real date in `pattern` (`31.01.2026`), or
 * `undefined`: no rollover of `31.02` into March.
 */
export function parseStrictDate(
  text: string,
  pattern: DatePattern
): Date | undefined {
  const values = fullDateParts(text, pattern);
  if (!values) return undefined;
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

/** Why kept text is invalid, with the text, for its message. */
interface Problem {
  reason: 'incomplete' | 'impossible' | 'unavailable';
  text: string;
}

/** The part of the flatpickr instance the wrapper uses. */
export interface Flatpickr {
  selectedDates: Date[];
  input: HTMLInputElement;
  calendarContainer?: HTMLElement;
  isOpen: boolean;
  config: {
    onChange: ((dates: Date[], text: string, picker: Flatpickr) => void)[];
  };
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

/** The flatpickr instance that Carbon attaches to a date input. */
export const pickerOf = (input: Element | null | undefined) =>
  (input as { _flatpickr?: Flatpickr } | null | undefined)?._flatpickr;

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
 * Leaves only the start date selected, with onChange. With a change, the
 * range plugin rebuilds a shorter selection from the dates before it
 * ([start, start] after the end had focus), so the date is set silently and
 * flatpickr's change hooks run as it would run them.
 */
function setRangeStart(picker: Flatpickr, start: Date) {
  picker.setDate([start], false);
  for (const hook of picker.config.onChange) {
    hook(picker.selectedDates, picker.input.value, picker);
  }
}

/**
 * flatpickr 4.6.13's rangePlugin marks the end input focused on its focus
 * (rangePlugin.js:44), clears the mark only when the start input takes focus
 * (:85), and on every onChange while marked refocuses the end on a timer
 * (:114-116). So once the end had focus, a later change (the app emptying the
 * value, Carbon's blur handler, tellApp) pulls focus back and opens the
 * calendar. For one timer turn after a change, the end's focus() only goes
 * through while focus is in the picker or its open calendar. A picked day is
 * redrawn, so focus is on the body then. Every change re-arms the guard, so
 * an earlier change's end does not lift it before a later change's timer.
 */
const guards = new WeakMap<
  HTMLInputElement,
  { generation: number; installed: unknown }
>();

// fallow-ignore-next-line complexity -- re-arm and the guarded focus checks
function guardEndRefocus(picker: Flatpickr, prefix: string) {
  const field = picker.input.closest(`.${prefix}--date-picker`);
  const end = field?.querySelectorAll<HTMLInputElement>(
    `.${prefix}--date-picker__input`
  )[1];
  if (!field || !end) return;
  const armed = guards.get(end);
  const generation = (armed?.generation ?? 0) + 1;
  // The plugin's timer may be queued after this hook: the nested timer runs
  // after it.
  setTimeout(() =>
    setTimeout(() => {
      const guard = guards.get(end);
      if (guard?.generation !== generation) return;
      guards.delete(end);
      if (end.focus === guard.installed) Reflect.deleteProperty(end, 'focus');
    })
  );
  if (armed && end.focus === armed.installed) {
    guards.set(end, { ...armed, generation });
    return;
  }
  const focus = end.focus;
  // An own property: an assignment would reach a setter on the prototype
  // (Storybook's play tests share one focus for every element through one).
  Object.defineProperty(end, 'focus', {
    configurable: true,
    writable: true,
    value(this: HTMLInputElement, options?: FocusOptions) {
      const active = document.activeElement;
      const inCalendar =
        picker.isOpen &&
        (active === document.body ||
          picker.calendarContainer?.contains(active) === true);
      if (!field.contains(active) && !inCalendar) return;
      focus.call(this, options);
    },
  });
  guards.set(end, { generation, installed: end.focus });
}

/** The range end input of a start input, unless it takes no typing. */
function rangeEndOf(start: HTMLInputElement, prefix: string) {
  const end = start
    .closest(`.${prefix}--date-picker`)
    ?.querySelectorAll<HTMLInputElement>(`.${prefix}--date-picker__input`)[1];
  return end && !end.disabled && !end.readOnly ? end : undefined;
}

/** An edit that inserted text (typed, pasted, composed) and left the caret at its end. */
function insertedAtEnd(event: ChangeEvent<HTMLInputElement>) {
  const { value, selectionStart, selectionEnd } = event.currentTarget;
  // flatpickr's calendar picks dispatch plain events with no inputType.
  const inserted = (event.nativeEvent as InputEvent).inputType?.startsWith(
    'insert'
  );
  return (
    inserted === true &&
    selectionStart === value.length &&
    selectionEnd === value.length
  );
}

const datesKey = (dates: readonly unknown[]) =>
  dates.map((date) => (date instanceof Date ? date.getTime() : '')).join();

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
  const lastReport = useRef<readonly unknown[]>([]);
  const [invalid, setInvalid] = useState<Pair<Problem | undefined>>([
    undefined,
    undefined,
  ]);

  const forget = () => {
    typed.current = ['', ''];
    dirty.current = [false, false];
    told.current = [false, false];
    setInvalid([undefined, undefined]);
  };

  // How the value was emptied, decided in a layout effect before Carbon's
  // reset in its passive effect: that reset clears flatpickr, whose
  // onChange([]) then keeps no typed text. The inputs are written in a
  // passive effect, after Carbon's effects have rewritten them.
  const emptiedBy = useRef<'echo' | 'reset' | null>(null);
  const cleared = isEmpty(value);
  const wasCleared = useRef(cleared);
  useLayoutEffect(() => {
    const emptied = cleared && !wasCleared.current;
    wasCleared.current = cleared;
    if (!emptied) return;
    // Text still kept invalid after onChange told the app it holds no date:
    // the empty value is the app taking that onChange([]), now or after an
    // await, not a reset. With no onChange, nothing can take it. A range end
    // kept invalid reports the start date, so that app still held a date.
    const echo =
      hasOnChange &&
      told.current.some(Boolean) &&
      invalid.some(Boolean) &&
      !reported.current.some(Boolean);
    emptiedBy.current = echo ? 'echo' : 'reset';
  }, [cleared, invalid, hasOnChange]);
  useEffect(() => {
    const by = emptiedBy.current;
    emptiedBy.current = null;
    if (by === 'echo') {
      for (const [n, input] of inputs.current.entries()) {
        if (input && !input.value) input.value = typed.current[n] ?? '';
      }
      told.current = [false, false];
    } else if (by === 'reset') {
      for (const input of inputs.current) if (input) input.value = '';
      forget();
    }
  });

  // A new date from the app: Carbon sets it without onChange, so typed text
  // and its error are stale. The app taking the picker's report is not new.
  const valueKey = isEmpty(value) ? '' : JSON.stringify(value);
  const lastValueKey = useRef(valueKey);
  useEffect(() => {
    const changed = valueKey !== lastValueKey.current;
    lastValueKey.current = valueKey;
    const picker = instance();
    if (!changed || valueKey === '' || !picker) return;
    if (datesKey(picker.selectedDates) !== datesKey(lastReport.current)) {
      forget();
    }
  }, [valueKey]);

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
  const prefix = usePrefix();
  // Carbon puts its own refs on the inputs, so they are found in the DOM
  // from the one in focus. Text the app set (not typed) is taken as typed, so
  // it can be written back after flatpickr empties it: on leave, a range with
  // one date clears both inputs without onChange.
  const track = (index: 0 | 1, input: HTMLInputElement) => {
    inputs.current[index] = input;
    const all = input
      .closest(`.${prefix}--date-picker`)
      ?.querySelectorAll<HTMLInputElement>(`.${prefix}--date-picker__input`);
    for (const n of [0, 1] as const) {
      const found = inputs.current[n] ?? all?.[n] ?? null;
      inputs.current[n] = found;
      if (found && !dirty.current[n]) typed.current[n] = found.value;
    }
  };
  const instance = () => pickerOf(inputs.current[0]);
  // A real date that minDate, maxDate, enable or disable rule out.
  const unavailable = (input: string) => {
    const date = parseStrictDate(input, effective);
    const picker = instance();
    return (
      date !== undefined && picker !== undefined && !picker.isEnabled(date)
    );
  };
  const problem = (input: string): Problem | undefined => {
    if (input === '') return undefined;
    if (!fullDateParts(input, effective)) {
      return { reason: 'incomplete', text: input };
    }
    if (isInvalid(input)) return { reason: 'impossible', text: input };
    if (unavailable(input)) return { reason: 'unavailable', text: input };
    return undefined;
  };
  const message = ({ reason, text: typedText }: Problem) =>
    reason === 'impossible'
      ? text.impossibleDate(typedText)
      : reason === 'unavailable'
        ? text.unavailableDate(typedText)
        : text.invalidDate(datePlaceholder(effective));
  const appHolds = (index: number) =>
    value === undefined
      ? reported.current[index]
      : Array.isArray(value)
        ? !isEmpty(value[index])
        : index === 0 && !isEmpty(value);

  /**
   * The picker reported dates: their text replaces the typed one. flatpickr
   * empties text it cannot take (Enter, a range end, minDate): typed text
   * with no date stays and is marked invalid. Pass the flatpickr instance
   * too, so a range end does not pull focus back after the change. Returns whether it kept any.
   */
  // fallow-ignore-next-line complexity -- per input: keep the typed text or take the picker's
  const pickerChanged = (dates: readonly unknown[], picker?: unknown) => {
    if (picker) guardEndRefocus(picker as Flatpickr, prefix);
    reported.current = [dates[0] != null, dates[1] != null];
    lastReport.current = dates;
    if (!masked || emptiedBy.current === 'reset') return false;
    const next: Pair<Problem | undefined> = [undefined, undefined];
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
        // A full, real date the picker still refused (a range end flatpickr
        // would not take) is unavailable.
        next[n] = problem(text) ?? { reason: 'unavailable', text };
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
    // A range start whose date flatpickr dropped on leave comes from its
    // written-back text.
    const start =
      picker.selectedDates[0] ??
      parseStrictDate(inputs.current[0]?.value ?? '', effective);
    if (index === 1 && start) setRangeStart(picker, start);
    else picker.setDate([], true);
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

  /**
   * Typing that just completed a usable start date, ending at the caret,
   * moves focus to the end input with the caret first.
   */
  const advanceToEnd = (
    event: ChangeEvent<HTMLInputElement>,
    before: string
  ) => {
    const current = event.currentTarget.value;
    const end = rangeEndOf(event.currentTarget, prefix);
    const completed =
      !fullDateParts(before, effective) && current !== '' && !problem(current);
    if (!end || !completed || !insertedAtEnd(event)) return;
    end.focus();
    // The start's commit on blur rewrites the end's text, which moves its caret.
    end.setSelectionRange(0, 0);
  };

  const inputProps = (index: 0 | 1, own: DateInputProps) => {
    const mask = masks[index];
    const props: DateInputProps & Record<string, unknown> = {
      inputMode: mask.inputMode,
      autoComplete: mask.autoComplete,
      pattern: mask.pattern,
      placeholder: own.placeholder ?? mask.placeholder,
      onFocus: (event) => {
        track(index, event.currentTarget);
        mask.onFocus(event);
        own.onFocus?.(event);
      },
      onChange: (event) => {
        mask.onChange(event);
        const before = typed.current[index];
        const current = event.currentTarget.value;
        // Carbon's own input listener runs first and may have taken the date.
        if (current !== typed.current[index]) {
          typed.current[index] = current;
          dirty.current[index] = true;
          told.current[index] = false;
        }
        // A shown error follows the edit, so its message quotes this text.
        setInvalid((pair) =>
          pair[index]
            ? replaced(
                pair,
                index,
                isInvalid(current) ? problem(current) : undefined
              )
            : pair
        );
        own.onChange?.(event);
        if (index === 0) advanceToEnd(event, before);
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
          const bad = problem(current);
          setInvalid((pair) => replaced(pair, index, bad));
          if (bad && dirty.current[index]) tellApp(index);
        }
        own.onBlur?.(event);
      },
    };
    const kept = invalid[index];
    if (own.invalid === undefined && kept) {
      props.invalid = true;
      props.invalidText = own.invalidText ?? message(kept);
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
