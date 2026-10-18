'use client';
// Filter functions of the filter panel's column filters.
import { constructFilterFn } from '@tanstack/react-table';

const listOf = (value: unknown): unknown[] =>
  Array.isArray(value) ? value : [value];

/**
 * Keeps rows whose cell, converted with `String()`, is one of the filter's
 * strings. An array cell matches when any of its items does, as the panel
 * builds its options from the items.
 */
export const filterFn_inOptions = constructFilterFn({
  filter: (dataValue: unknown, filterValue: readonly string[]) =>
    listOf(dataValue).some(
      (item) => item != null && filterValue.includes(String(item))
    ),
  resolveFilterValue: (value: unknown) => listOf(value).map(String),
  autoRemove: (value: unknown) =>
    value == null || value === '' || (Array.isArray(value) && !value.length),
});

const pad = (value: number) => String(value).padStart(2, '0');

/** The cell's calendar day as `YYYY-MM-DD`; a `Date` uses its local day. */
// fallow-ignore-next-line complexity -- Date, invalid Date, ISO string or other cell
function dayOf(value: unknown): string | undefined {
  if (value instanceof Date)
    return Number.isNaN(value.getTime())
      ? undefined
      : `${value.getFullYear()}-${pad(value.getMonth() + 1)}-${pad(value.getDate())}`;
  return typeof value === 'string' && value.length >= 10
    ? value.slice(0, 10)
    : undefined;
}

type DayRange = readonly [start: string | null, end: string | null];

/**
 * Keeps rows whose day is inside an ISO day range, both ends included.
 * TanStack's `inDateRange` compares with midnight, so rows later on the end
 * day drop out, and it parses date-only strings as UTC.
 */
export const filterFn_inDayRange = constructFilterFn({
  // fallow-ignore-next-line complexity -- no day, and either end open
  filter: (day: string | undefined, [start, end]: DayRange) =>
    day !== undefined &&
    (start === null || day >= start) &&
    (end === null || day <= end),
  resolveDataValue: dayOf,
  autoRemove: (value: unknown) =>
    !Array.isArray(value) || (value[0] == null && value[1] == null),
});
