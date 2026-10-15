export type MaskPartKind =
  'day' | 'month' | 'year' | 'hour' | 'minute' | 'second';

export interface MaskPart {
  kind: MaskPartKind;
  /** Digits in the part. */
  length: number;
  /** Highest first digit; a larger one is padded with `0`. Absent: any digit. */
  firstMax?: number;
  /** Allowed range of the full two-digit value. Absent: any value. */
  min?: number;
  max?: number;
}

export interface MaskSpec {
  /** Parts in display order. */
  parts: readonly MaskPart[];
  /** Printed after every full part except the last. */
  separator: string;
  placeholder: string;
  /** Value of the input's `pattern` attribute. */
  pattern: string;
}

export interface DateMaskOptions {
  order: readonly ('day' | 'month' | 'year')[];
  separator: string;
}

export interface TimeMaskOptions {
  seconds: boolean;
  hourCycle: 'h12' | 'h23';
}

const dateParts: Record<DateMaskOptions['order'][number], MaskPart> = {
  day: { kind: 'day', length: 2, firstMax: 3, min: 1, max: 31 },
  month: { kind: 'month', length: 2, firstMax: 1, min: 1, max: 12 },
  year: { kind: 'year', length: 4 },
};

const placeholders: Record<MaskPartKind, string> = {
  day: 'dd',
  month: 'mm',
  year: 'yyyy',
  hour: 'hh',
  minute: 'mm',
  second: 'ss',
};

// Browsers compile `pattern` with the `v` flag, where escaping a character
// that is not syntax (such as `-`) is an error.
const escapeForPattern = (text: string) =>
  text.replaceAll(/[\\^$.*+?()[\]{}|/]/g, String.raw`\$&`);

function buildSpec(parts: MaskPart[], separator: string): MaskSpec {
  return {
    parts,
    separator,
    placeholder: parts.map((p) => placeholders[p.kind]).join(separator),
    pattern: parts
      .map((p) => String.raw`\d{${p.length}}`)
      .join(escapeForPattern(separator)),
  };
}

export function dateMaskSpec({ order, separator }: DateMaskOptions): MaskSpec {
  return buildSpec(
    order.map((kind) => dateParts[kind]),
    separator
  );
}

export function timeMaskSpec({
  seconds,
  hourCycle,
}: TimeMaskOptions): MaskSpec {
  const hour: MaskPart =
    hourCycle === 'h12'
      ? { kind: 'hour', length: 2, firstMax: 1, min: 1, max: 12 }
      : { kind: 'hour', length: 2, firstMax: 2, min: 0, max: 23 };
  const sixty = { length: 2, firstMax: 5, min: 0, max: 59 };
  const parts: MaskPart[] = [hour, { kind: 'minute', ...sixty }];
  if (seconds) parts.push({ kind: 'second', ...sixty });
  return buildSpec(parts, ':');
}
