'use client';
// Payloads of the chat elements and their runtime guards. A payload arrives
// as JSON in `user_defined`, so every field is checked before it renders.

/** The `user_defined_type` of each chat element. */
export const chatElementTypes = ['afframe-chart'] as const;

export type ChatElementType = (typeof chatElementTypes)[number];

export const chatChartTypes = [
  'bar',
  'line',
  'area',
  'pie',
  'donut',
  'scatter',
] as const;

export type ChatChartType = (typeof chatChartTypes)[number];

/**
 * One data point, as Carbon Charts' tabular data: `group` is the series (or
 * the slice of a pie), `key` the x value of line, area, scatter and grouped
 * bar charts.
 */
export interface ChatChartDatum {
  group: string;
  key?: string | number;
  value: number | null;
}

interface ChatChartBase {
  /** The chart's accessible name. */
  title?: string;
  /** Text alternative: what the chart shows, read by screen readers. */
  summary: string;
}

/** A chart drawn by Carbon Charts from tabular data. */
export interface ChatChartTabularData extends ChatChartBase {
  engine?: 'charts';
  chart_type: ChatChartType;
  data: ChatChartDatum[];
}

/** A chart drawn by ECharts from an ECharts option. */
export interface ChatChartEChartsData extends ChatChartBase {
  engine: 'echarts';
  /** An ECharts option with bar, line, pie or scatter series. */
  option: Record<string, unknown>;
}

export type ChatChartData = ChatChartTabularData | ChatChartEChartsData;

type Guard<T> = (value: unknown) => value is T;

function isRecord(value: unknown): value is Record<string, unknown> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    (Object.getPrototypeOf(value) === Object.prototype ||
      Object.getPrototypeOf(value) === null)
  );
}

const isString = (value: unknown): value is string => typeof value === 'string';
const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);
const optional = <T>(value: unknown, guard: Guard<T>) =>
  value === undefined || guard(value);
const arrayOf = <T>(value: unknown, guard: Guard<T>): value is T[] =>
  Array.isArray(value) && value.every(guard);

// Carbon Charts' tooltips render `group` and `key` as (sanitized) HTML, so
// text with `<` or `>` is refused.
const isPlainText = (value: unknown): value is string =>
  isString(value) && !/[<>]/.test(value);

function isChartDatum(value: unknown): value is ChatChartDatum {
  return (
    isRecord(value) &&
    isPlainText(value.group) &&
    (value.value === null || isFiniteNumber(value.value)) &&
    optional(value.key, (key): key is string | number =>
      isPlainText(key) ? true : isFiniteNumber(key)
    )
  );
}

export function isChatChartData(value: unknown): value is ChatChartData {
  if (!isRecord(value)) return false;
  if (!isString(value.summary) || value.summary.trim() === '') return false;
  if (!optional(value.title, isString)) return false;
  if (value.engine === 'echarts') return isRecord(value.option);
  return (
    (value.engine === undefined || value.engine === 'charts') &&
    chatChartTypes.includes(value.chart_type as ChatChartType) &&
    arrayOf(value.data, isChartDatum)
  );
}

/** The guard for each element type. */
export const chatElementGuards: { [T in ChatElementType]: Guard<unknown> } = {
  'afframe-chart': isChatChartData,
};

export function isChatElementType(value: unknown): value is ChatElementType {
  return chatElementTypes.includes(value as ChatElementType);
}
