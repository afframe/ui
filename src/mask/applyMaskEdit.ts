import type { MaskPart, MaskSpec } from './spec.js';

export interface MaskState {
  value: string;
  selectionStart: number;
  selectionEnd: number;
}

/** The `inputType` and `data` of a `beforeinput` event. */
export interface MaskEdit {
  inputType: string;
  data: string | null;
}

interface Digits {
  digits: string;
  /** Caret as a count of digits before it. */
  k: number;
}

const capacity = (spec: MaskSpec) =>
  spec.parts.reduce((sum, part) => sum + part.length, 0);

/** The part holding digit index `k`, if `k` is within capacity. */
function locate(spec: MaskSpec, k: number) {
  let start = 0;
  for (const [index, part] of spec.parts.entries()) {
    if (k < start + part.length) {
      return { part, start, last: index === spec.parts.length - 1 };
    }
    start += part.length;
  }
  return undefined;
}

function render(digits: string, spec: MaskSpec) {
  let out = '';
  let start = 0;
  for (const [index, part] of spec.parts.entries()) {
    const chunk = digits.slice(start, start + part.length);
    out += chunk;
    start += part.length;
    if (chunk.length < part.length || index === spec.parts.length - 1) break;
    out += spec.separator;
  }
  return out;
}

const isDigit = (char: string | undefined) =>
  char !== undefined && char >= '0' && char <= '9';

function toState({ digits, k }: Digits, spec: MaskSpec): MaskState {
  const value = render(digits, spec);
  let offset = 0;
  // `render` drops digits past capacity, so `k` can exceed what is shown.
  for (let seen = 0; seen < k && offset < value.length; offset++) {
    if (isDigit(value[offset])) seen++;
  }
  // A caret left in front of a separator would make the next digit land
  // visually before it.
  if (value.startsWith(spec.separator, offset)) {
    offset += spec.separator.length;
  }
  return { value, selectionStart: offset, selectionEnd: offset };
}

/**
 * Reads digits out of free text. A two-digit part left with one digit by a
 * following non-digit is padded (`1.2` -> `0102`). `from` is the digit index
 * the text starts at, so padding follows the parts it lands in.
 */
function tokenize(text: string, caret: number, spec: MaskSpec, from = 0) {
  let digits = '';
  let k = 0;
  for (const run of text.matchAll(/\d+/g)) {
    const end = run.index + run[0].length;
    k += Math.min(Math.max(caret - run.index, 0), run[0].length);
    digits += run[0];
    if (end === text.length) continue;
    const at = locate(spec, from + digits.length - 1);
    if (
      at &&
      !at.last &&
      at.part.length === 2 &&
      from + digits.length - at.start === 1
    ) {
      digits = digits.slice(0, -1) + '0' + digits.slice(-1);
      if (caret > end - 1) k++;
    }
  }
  return { digits, k };
}

const outOfRange = (chunk: string, part: MaskPart) =>
  chunk.length === part.length &&
  part.min !== undefined &&
  (Number(chunk) < part.min || Number(chunk) > (part.max ?? Infinity));

// Inserting before later digits shifts them into the next parts. A part
// already out of range (a cut selection or a deletion shifted digits into it)
// does not block typing; the part the digit completes, and any part the
// insert pushes out of range, do.
function accepts(before: string, after: string, last: number, spec: MaskSpec) {
  let start = 0;
  return spec.parts.every((part) => {
    const from = start;
    start += part.length;
    return (
      !outOfRange(after.slice(from, start), part) ||
      (start - 1 !== last && outOfRange(before.slice(from, start), part))
    );
  });
}

// fallow-ignore-next-line complexity -- one branch per range rule of the design
function insertDigit(
  { digits, k }: Digits,
  digit: string,
  spec: MaskSpec
): Digits | undefined {
  const room = capacity(spec) - digits.length;
  const at = locate(spec, k);
  if (room < 1 || !at) return undefined;
  const { part } = at;
  const position = k - at.start;
  if (
    position === 0 &&
    part.firstMax !== undefined &&
    Number(digit) > part.firstMax
  ) {
    if (room < 2) return undefined;
    const padded = digits.slice(0, k) + '0' + digit + digits.slice(k);
    return accepts(digits, padded, k + 1, spec)
      ? { digits: padded, k: k + 2 }
      : undefined;
  }
  const next = digits.slice(0, k) + digit + digits.slice(k);
  return accepts(digits, next, k, spec)
    ? { digits: next, k: k + 1 }
    : undefined;
}

/** A typed non-digit: pads a one-digit part or steps past a full one. */
function separate({ digits, k }: Digits, spec: MaskSpec): Digits | undefined {
  const at = k === digits.length && k > 0 ? locate(spec, k - 1) : undefined;
  if (!at) return undefined;
  const filled = k - at.start;
  if (filled === at.part.length) return { digits, k };
  if (filled === 1 && at.part.length === 2 && !at.last) {
    return { digits: digits.slice(0, -1) + '0' + digits.slice(-1), k: k + 1 };
  }
  return undefined;
}

/** Inserts digits at the caret, stopping at the first one the parts reject. */
function insertDigits(state: Digits, text: string, spec: MaskSpec) {
  let next = state;
  for (const digit of text) {
    const inserted = insertDigit(next, digit, spec);
    if (!inserted) break;
    next = inserted;
  }
  return next;
}

const yearFirst = /^(\d{4})[-./](\d{1,2})[-./](\d{1,2})(?:[T ].*)?$/;
const dayFirst = /^(\d{1,2})[-./](\d{1,2})[-./](\d{4})$/;

/**
 * A whole pasted date as digits in the spec's order. Day-first text is only
 * reordered into a year-first spec: a year-last spec already reads it digit
 * by digit in its own order, which keeps `mm/dd/yyyy` pastes as typed.
 */
function wholeDate(text: string, spec: MaskSpec) {
  const kinds = spec.parts.map((part) => part.kind);
  if ([...kinds].sort().join() !== 'day,month,year') return undefined;
  const ymd = yearFirst.exec(text.trim());
  const dmy = kinds[0] === 'year' ? dayFirst.exec(text.trim()) : null;
  const found: Record<string, string | undefined> | null = ymd
    ? { year: ymd[1], month: ymd[2], day: ymd[3] }
    : dmy && { year: dmy[3], month: dmy[2], day: dmy[1] };
  if (!found) return undefined;
  return kinds
    .map((kind) => (found[kind] ?? '').padStart(kind === 'year' ? 4 : 2, '0'))
    .join('');
}

const pasted = (text: string, spec: MaskSpec, from: number) =>
  wholeDate(text, spec) ?? tokenize(text, text.length, spec, from).digits;

interface EditContext {
  digits: string;
  start: number;
  selected: boolean;
  /** The digits with the selection removed. */
  base: Digits;
  data: string;
  spec: MaskSpec;
  cut: (from: number, to: number) => Digits;
}

type Handler = (context: EditContext) => Digits | undefined;

const changed = (base: Digits, next: Digits) =>
  next === base ? undefined : next;

const deleteBackward =
  (toStart: boolean): Handler =>
  ({ selected, base, start, cut }) => {
    if (selected) return base;
    return start > 0 ? cut(toStart ? 0 : start - 1, start) : undefined;
  };

const deleteForward =
  (toEnd: boolean): Handler =>
  ({ selected, base, start, digits, cut }) => {
    if (selected) return base;
    return start < digits.length
      ? cut(start, toEnd ? digits.length : start + 1)
      : undefined;
  };

const paste: Handler = ({ selected, base, data, spec }) => {
  const whole = pasted(data, spec, 0);
  // A full value pasted with nothing selected replaces the field; inserted at
  // the caret of a full field it would find no room.
  if (!selected && whole.length === capacity(spec)) {
    const replaced = insertDigits({ digits: '', k: 0 }, whole, spec);
    if (replaced.digits.length === capacity(spec)) return replaced;
  }
  return changed(base, insertDigits(base, pasted(data, spec, base.k), spec));
};

const typeText: Handler = ({ base, data, spec }) => {
  let typed = base;
  for (const char of data) {
    const step = isDigit(char)
      ? insertDigit(typed, char, spec)
      : (separate(typed, spec) ?? typed);
    if (!step) break;
    typed = step;
  }
  return changed(base, typed);
};

const handlers = new Map<string, Handler>([
  ['insertText', typeText],
  ['insertFromPaste', paste],
  ['insertFromDrop', paste],
  ['insertReplacementText', paste],
  ['deleteContentBackward', deleteBackward(false)],
  ['deleteWordBackward', deleteBackward(true)],
  ['deleteSoftLineBackward', deleteBackward(true)],
  ['deleteHardLineBackward', deleteBackward(true)],
  ['deleteContentForward', deleteForward(false)],
  ['deleteWordForward', deleteForward(true)],
  ['deleteSoftLineForward', deleteForward(true)],
  ['deleteHardLineForward', deleteForward(true)],
]);

/**
 * Applies one `beforeinput` edit to a masked value. Returns `null` for an
 * input type the mask does not handle (let the browser apply it), and the
 * unchanged state for a handled edit that changes nothing (a rejected digit);
 * the caller cancels the event in both of the other cases.
 */
export function applyMaskEdit(
  state: MaskState,
  edit: MaskEdit,
  spec: MaskSpec
): MaskState | null {
  const handler = handlers.get(edit.inputType);
  if (!handler) return null;
  const { digits, k: start } = tokenize(
    state.value,
    state.selectionStart,
    spec
  );
  const end = tokenize(state.value, state.selectionEnd, spec).k;
  const selected = state.selectionStart !== state.selectionEnd;
  const cut = (from: number, to: number): Digits => ({
    digits: digits.slice(0, from) + digits.slice(to),
    k: from,
  });
  const next = handler({
    digits,
    start,
    selected,
    base: selected ? cut(start, end) : { digits, k: start },
    data: edit.data ?? '',
    spec,
    cut,
  });
  return next ? toState(next, spec) : state;
}

/**
 * Rewrites free text (composition, autofill, undo) into the mask, without
 * range checks. `caret` is the caret offset in `raw`.
 */
export function normalizeMaskValue(
  raw: string,
  caret: number,
  spec: MaskSpec
): { value: string; caret: number } {
  const tokens = tokenize(raw, caret, spec);
  // A year-first field already reads year-first text in order; padding its
  // own partial value would jump the caret while typing.
  const date =
    spec.parts[0]?.kind === 'year' && yearFirst.test(raw.trim())
      ? undefined
      : wholeDate(raw, spec);
  // A reordered date has no caret mapping; it goes to the end.
  const { digits, k } =
    date && date !== tokens.digits ? { digits: date, k: date.length } : tokens;
  const max = capacity(spec);
  const state = toState(
    { digits: digits.slice(0, max), k: Math.min(k, max) },
    spec
  );
  return { value: state.value, caret: state.selectionStart };
}
