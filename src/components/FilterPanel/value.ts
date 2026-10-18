'use client';
// Filter values of FilterPanel groups: types, normalisation, comparison and
// tags. The directive is there because the package index imports this module
// directly (check:pack).
import {
  formatDate,
  formatDateRange,
  formatNumber,
} from '../../format/index.js';

/** One option of a filter group. `value` is stored in `FilterPanelValue`. */
export interface FilterPanelOption {
  value: string;
  label: string;
}

interface FilterPanelGroupBase {
  id: string;
  label: string;
  /** Opens the accordion item on first render. */
  defaultOpen?: boolean;
}

/** A filter group, shown as one accordion item. `variant` defaults to `checkbox`. */
export type FilterPanelGroup = FilterPanelGroupBase &
  (
    | {
        variant?: 'checkbox';
        options: readonly FilterPanelOption[];
        /** Shows a search field that narrows the options by label. */
        searchable?: boolean;
      }
    | {
        variant: 'radio';
        options: readonly FilterPanelOption[];
        searchable?: boolean;
      }
    | { variant: 'select'; options: readonly FilterPanelOption[] }
    | {
        variant: 'multiselect';
        options: readonly FilterPanelOption[];
        /** Uses a filterable multiselect. */
        searchable?: boolean;
      }
    | { variant: 'text'; placeholder?: string }
    | { variant: 'number'; min?: number; max?: number; step?: number }
    | {
        variant: 'dateRange';
        /** ISO `YYYY-MM-DD`. */
        minDate?: string;
        /** ISO `YYYY-MM-DD`. */
        maxDate?: string;
      }
    | { variant: 'slider'; min: number; max: number; step?: number }
  );

/**
 * The value of one group: option values (checkbox, multiselect), one string
 * (radio, select, text), a number (number equals it, slider is the upper
 * bound) or an ISO day range (dateRange).
 */
export type FilterPanelFieldValue =
  | readonly string[]
  | string
  | number
  | readonly [start: string | null, end: string | null];

/** Value per group id. A missing group has no filter. */
export type FilterPanelValue = Readonly<Record<string, FilterPanelFieldValue>>;

/** Text of the tags `filterTags` returns. */
export interface FilterTagMessages {
  /** Text of one tag; `valueText` is the option label or the formatted value. */
  tagLabel: (groupLabel: string, valueText: string) => string;
  /** Date range with only a start. */
  dateFrom: (date: string) => string;
  /** Date range with only an end. */
  dateUntil: (date: string) => string;
  /** Slider upper bound. */
  upTo: (value: string) => string;
}

export const defaultFilterTagMessages: FilterTagMessages = {
  tagLabel: (groupLabel, valueText) => `${groupLabel}: ${valueText}`,
  dateFrom: (date) => `from ${date}`,
  dateUntil: (date) => `until ${date}`,
  upTo: (value) => `up to ${value}`,
};

export interface FilterTag {
  key: string;
  label: string;
  /** The value without this tag's filter. */
  without: () => FilterPanelValue;
}

const variantOf = (group: FilterPanelGroup | undefined) =>
  group?.variant ?? 'checkbox';

/** The string items of an array value; `[]` for any other value. */
export function checkedValues(
  field: FilterPanelFieldValue | undefined
): readonly string[] {
  if (typeof field !== 'object') return [];
  const items: readonly (string | null)[] = field;
  return items.filter((item) => item !== null);
}

// "No filter" is a missing key. table-core's testFalsy treats only undefined,
// null and '' as empty, so 0 stays a filter.
// fallow-ignore-next-line complexity -- one branch per filter variant
function isEmpty(
  group: FilterPanelGroup | undefined,
  field: FilterPanelFieldValue
): boolean {
  if (typeof field === 'string') return field.trim() === '';
  if (typeof field === 'number') {
    // formatNumber throws on Infinity too.
    if (!Number.isFinite(field)) return true;
    return group?.variant === 'slider' && field >= group.max;
  }
  return field.every((item) => item === null || item === '');
}

/** Sets one group's value; an empty value removes the key. */
export function setGroupValue(
  value: FilterPanelValue,
  group: FilterPanelGroup,
  field: FilterPanelFieldValue | undefined
): FilterPanelValue {
  return Object.fromEntries([
    ...Object.entries(value).filter(([key]) => key !== group.id),
    ...(field === undefined || isEmpty(group, field)
      ? []
      : [[group.id, field]]),
  ]);
}

// fallow-ignore-next-line complexity -- one branch per filter variant
function sameField(
  group: FilterPanelGroup | undefined,
  a: FilterPanelFieldValue | undefined,
  b: FilterPanelFieldValue | undefined
): boolean {
  const left = a === undefined || isEmpty(group, a) ? undefined : a;
  const right = b === undefined || isEmpty(group, b) ? undefined : b;
  if (typeof left !== 'object' || typeof right !== 'object') {
    return left === right;
  }
  if (variantOf(group) === 'dateRange') {
    return left[0] === right[0] && left[1] === right[1];
  }
  const set = new Set(right);
  return new Set(left).size === set.size && left.every((v) => set.has(v));
}

/**
 * Same filters per group, compared per variant: option sets in any order,
 * date ranges per end. A missing group equals an empty one.
 */
export function sameFilterValue(
  groups: readonly FilterPanelGroup[],
  a: FilterPanelValue,
  b: FilterPanelValue
): boolean {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  return [...keys].every((key) =>
    sameField(
      groups.find((group) => group.id === key),
      a[key],
      b[key]
    )
  );
}

/** Options of an option group that the value selects, in option order. */
export function selectedOptions(
  group: FilterPanelGroup,
  field: FilterPanelFieldValue | undefined
): readonly FilterPanelOption[] {
  if (!('options' in group) || field === undefined) return [];
  const selected = typeof field === 'string' ? [field] : checkedValues(field);
  return group.options.filter((option) => selected.includes(option.value));
}

const multiple = (group: FilterPanelGroup) =>
  variantOf(group) === 'checkbox' || variantOf(group) === 'multiselect';

/**
 * Number of applied filters: per checkbox or multiselect group the known
 * options selected, values matching no option ignored; 1 per other group
 * that holds a value.
 */
export function countFilterPanelSelections(
  groups: readonly FilterPanelGroup[],
  value: FilterPanelValue
): number {
  return groups.reduce((sum, group) => {
    const field = value[group.id];
    if (field === undefined || isEmpty(group, field)) return sum;
    return sum + (multiple(group) ? selectedOptions(group, field).length : 1);
  }, 0);
}

// fallow-ignore-next-line complexity -- one branch per filter variant
function valueText(
  group: FilterPanelGroup,
  field: FilterPanelFieldValue,
  text: FilterTagMessages
): string {
  if (typeof field === 'number') {
    const number = formatNumber(field);
    return group.variant === 'slider' ? text.upTo(number) : number;
  }
  if (typeof field === 'string') {
    // A radio or select value that matches no option shows as stored.
    return selectedOptions(group, field)[0]?.label ?? field;
  }
  const [start, end] = field;
  if (start && end) return formatDateRange(start, end);
  return start
    ? text.dateFrom(formatDate(start))
    : text.dateUntil(formatDate(end ?? ''));
}

/**
 * One tag per applied filter, in group order: one per known selected option
 * of a checkbox or multiselect group, one per other group with a value.
 */
export function filterTags(
  groups: readonly FilterPanelGroup[],
  value: FilterPanelValue,
  text: FilterTagMessages
): FilterTag[] {
  return groups.flatMap((group): FilterTag[] => {
    const field = value[group.id];
    if (field === undefined || isEmpty(group, field)) return [];
    if (multiple(group)) {
      return selectedOptions(group, field).map((option) => ({
        key: `${group.id}:${option.value}`,
        label: text.tagLabel(group.label, option.label),
        without: () =>
          setGroupValue(
            value,
            group,
            checkedValues(field).filter((item) => item !== option.value)
          ),
      }));
    }
    return [
      {
        key: group.id,
        label: text.tagLabel(group.label, valueText(group, field, text)),
        without: () => setGroupValue(value, group, undefined),
      },
    ];
  });
}
