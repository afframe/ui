'use client';
// Builds the ECharts option of an `afframe-chart` payload from an allowlist.
// A payload is untrusted: ECharts opens title links with window.open, renders
// HTML tooltips and formatter strings as markup, and loads `image://`
// symbols and background images. Only the keys below pass; everything else
// (links, formatters, rich text, symbols, images, baseOption, media,
// options, timeline) is dropped.

type Plain = Record<string, unknown>;

const isPlain = (value: unknown): value is Plain =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const isText = (value: unknown): value is string => typeof value === 'string';
const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);
const isSize = (value: unknown) => isNumber(value) || isText(value);
const isPrimitive = (value: unknown) =>
  value === null || isNumber(value) || isText(value);

/** Keeps the keys whose value passes their check. */
function pick(
  source: unknown,
  checks: Record<string, (value: unknown) => unknown>
) {
  if (!isPlain(source)) return undefined;
  const picked: Plain = {};
  for (const [key, check] of Object.entries(checks)) {
    if (!Object.hasOwn(source, key)) continue;
    const value = check(source[key]);
    if (value !== undefined) picked[key] = value;
  }
  return picked;
}

const keep =
  (test: (value: unknown) => boolean) =>
  (value: unknown): unknown =>
    test(value) ? value : undefined;
const oneOf = (...allowed: string[]) =>
  keep((value) => allowed.includes(value as string));
const listOf =
  (item: (value: unknown) => unknown) =>
  (value: unknown): unknown =>
    Array.isArray(value)
      ? value.map(item).filter((entry) => entry !== undefined)
      : undefined;
// A component given as one object or a list of objects.
const oneOrMany =
  (item: (value: unknown) => unknown) =>
  (value: unknown): unknown =>
    Array.isArray(value) ? listOf(item)(value) : item(value);

const axis = (value: unknown) =>
  pick(value, {
    type: oneOf('category', 'value', 'time', 'log'),
    name: keep(isText),
    data: listOf(keep(isPrimitive)),
    min: keep(isNumber),
    max: keep(isNumber),
    boundaryGap: keep((entry) => typeof entry === 'boolean'),
  });

const datum = (value: unknown): unknown =>
  isPrimitive(value)
    ? value
    : Array.isArray(value)
      ? value.every(isPrimitive)
        ? value
        : undefined
      : pick(value, {
          name: keep(isText),
          value: (entry) =>
            isPrimitive(entry)
              ? entry
              : Array.isArray(entry) && entry.every(isPrimitive)
                ? entry
                : undefined,
        });

const series = (value: unknown) => {
  const picked = pick(value, {
    type: oneOf('bar', 'line', 'pie', 'scatter'),
    name: keep(isText),
    data: listOf(datum),
    stack: keep(isText),
    smooth: keep((entry) => typeof entry === 'boolean'),
    radius: oneOrMany(keep(isSize)),
    center: listOf(keep(isSize)),
    xAxisIndex: keep(isNumber),
    yAxisIndex: keep(isNumber),
    datasetIndex: keep(isNumber),
    encode: (entry) =>
      pick(entry, {
        x: oneOrMany(keep(isSize)),
        y: oneOrMany(keep(isSize)),
        itemName: keep(isSize),
        value: oneOrMany(keep(isSize)),
      }),
    // An area chart: a line series with an area style.
    areaStyle: (entry) => pick(entry, { opacity: keep(isNumber) }),
  });
  return picked?.type === undefined ? undefined : picked;
};

/** The ECharts option a chat payload may set, with tooltips on the canvas. */
export function safeEChartsOption(option: Plain): Plain {
  const safe =
    pick(option, {
      title: oneOrMany((entry) =>
        pick(entry, { text: keep(isText), subtext: keep(isText) })
      ),
      legend: (entry) =>
        pick(entry, {
          show: keep((show) => typeof show === 'boolean'),
          orient: oneOf('horizontal', 'vertical'),
          data: listOf(keep(isText)),
        }),
      grid: (entry) =>
        pick(entry, {
          left: keep(isSize),
          right: keep(isSize),
          top: keep(isSize),
          bottom: keep(isSize),
          containLabel: keep((contain) => typeof contain === 'boolean'),
        }),
      xAxis: oneOrMany(axis),
      yAxis: oneOrMany(axis),
      dataset: (entry) =>
        pick(entry, {
          source: listOf((row) =>
            Array.isArray(row)
              ? row.every(isPrimitive)
                ? row
                : undefined
              : isPlain(row) && Object.values(row).every(isPrimitive)
                ? row
                : undefined
          ),
          dimensions: listOf(keep(isText)),
        }),
      tooltip: (entry) =>
        pick(entry, {
          trigger: oneOf('item', 'axis', 'none'),
          axisPointer: (pointer) =>
            pick(pointer, { type: oneOf('line', 'shadow', 'cross', 'none') }),
        }),
      series: oneOrMany(series),
      animation: keep((entry) => typeof entry === 'boolean'),
    }) ?? {};
  if (isPlain(safe.tooltip)) safe.tooltip.renderMode = 'richText';
  return safe;
}
