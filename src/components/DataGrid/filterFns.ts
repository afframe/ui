'use client';
// Filter functions of the filter panel's column filters.
import { constructFilterFn } from '@tanstack/react-table';
import { civilDateIn, localDateToCivilDate } from '../../format/date.js';
import { isoDay } from '../FilterPanel/value.js';

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

/**
 * The cell's calendar day as `YYYY-MM-DD`. A `Date` uses its local day; an ISO
 * instant uses the default time zone, the day `formatDate` shows.
 */
// fallow-ignore-next-line complexity -- Date, invalid Date, ISO instant, ISO day or other cell
function dayOf(value: unknown): string | undefined {
  if (value instanceof Date)
    return Number.isNaN(value.getTime())
      ? undefined
      : localDateToCivilDate(value);
  if (typeof value !== 'string' || value.length < 10) return undefined;
  if (!value.includes('T')) return value.slice(0, 10);
  const instant = new Date(value);
  return Number.isNaN(instant.getTime()) ? undefined : civilDateIn(instant);
}

type DayRange = readonly [start: string | null, end: string | null];

/**
 * Keeps rows whose day is inside an ISO day range, both ends included.
 * TanStack's `inDateRange` compares with midnight, so rows later on the end
 * day drop out, and it parses date-only strings as UTC.
 */
export const filterFn_inDayRange = constructFilterFn({
  // A range without a start is no filter. autoRemove runs only in TanStack's
  // setters, so a value from initial or controlled state reaches this.
  // fallow-ignore-next-line complexity -- no start, no day, and an open end
  filter: (day: string | undefined, [start, end]: DayRange) =>
    start === null ||
    (day !== undefined && day >= start && (end === null || day <= end)),
  resolveDataValue: dayOf,
  // An end that is not an ISO day is open.
  resolveFilterValue: (value: unknown): DayRange =>
    Array.isArray(value) ? [isoDay(value[0]), isoDay(value[1])] : [null, null],
  autoRemove: (value: unknown) => !Array.isArray(value) || !isoDay(value[0]),
});
