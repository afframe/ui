'use client';
import { useId, useMemo } from 'react';
import { EngineSlot, lazyEngine } from './engine.js';
import { safeEChartsOption } from './echartsOption.js';
import { resolveMessages } from '../../messages.js';
import {
  defaultChatChartMessages,
  type ChatChartMessages,
} from './messages.js';
import {
  isChatChartData,
  type ChatChartData,
  type ChatChartEChartsData,
  type ChatChartTabularData,
} from './payloads.js';
import { ElementError } from './states.js';

// Carbon Charts renders the title as HTML, and a truncated title reaches its
// tooltip through textContent, which decodes entities. Angle brackets are
// dropped and ampersands escaped, so that text never holds markup.
function chartsTitle(title: string) {
  return title.replace(/[<>]/g, '').replace(/&/g, '&amp;');
}

interface EngineProps<Payload> {
  payload: Payload;
  animations: boolean;
}

// Each engine loads with import() of its family's index module, so the
// chart code arrives as an async chunk when a message needs it. A static
// value import would put it on every route that imports ChatElements.
const ChartsEngine = lazyEngine(async () => {
  const charts = await import('../Charts/index.js');
  const labels = charts.ScaleTypes.LABELS;
  function Engine({ payload, animations }: EngineProps<ChatChartTabularData>) {
    const { chart_type: type, title } = payload;
    // Only the guarded fields of each point reach Carbon Charts.
    const data = useMemo(
      () =>
        payload.data.map(({ group, key, value }) =>
          key === undefined ? { group, value } : { group, key, value }
        ),
      [payload.data]
    );
    // No toolbar and a legend that does not filter: the chart holds no tab
    // stop. Carbon Charts keeps its own roles (title heading, legend group,
    // labelled bars and slices) inside the figure.
    const base = {
      ...(title !== undefined && { title: chartsTitle(title) }),
      animations,
      height: '20rem',
      toolbar: { enabled: false },
      legend: { clickable: false },
    };
    if (type === 'pie' || type === 'donut') {
      const Chart = type === 'pie' ? charts.PieChart : charts.DonutChart;
      return <Chart data={data} options={base} />;
    }
    const keyed = data.some((datum) => datum.key !== undefined);
    const options = {
      ...base,
      axes: {
        left: { mapsTo: 'value' },
        bottom: { mapsTo: keyed ? 'key' : 'group', scaleType: labels },
      },
    };
    const Chart =
      type === 'bar'
        ? keyed
          ? charts.GroupedBarChart
          : charts.SimpleBarChart
        : type === 'line'
          ? charts.LineChart
          : type === 'area'
            ? charts.AreaChart
            : charts.ScatterChart;
    return <Chart data={data} options={options} />;
  }
  return Engine;
});

const EChartsEngine = lazyEngine(async () => {
  const { EChart } = await import('../ECharts/index.js');
  function Engine({ payload, animations }: EngineProps<ChatChartEChartsData>) {
    const { option } = payload;
    // Only an allowlist of the option reaches ECharts (echartsOption.ts).
    // The figure carries the chart's name and summary, so ECharts' own
    // generated description is off.
    const safe = useMemo(
      () => ({
        ...safeEChartsOption(option),
        aria: { enabled: false },
        ...(!animations && { animation: false }),
      }),
      [option, animations]
    );
    return (
      <EChart className="afframe-chat-chart__echarts" option={safe} notMerge />
    );
  }
  return Engine;
});

interface ChatChartOwnProps {
  messages?: Partial<ChatChartMessages> | undefined;
  className?: string;
  /** Chart animations; off for screenshots. Default `true`. */
  animations?: boolean;
}

export type ChatChartProps = ChatChartData & ChatChartOwnProps;

/** A chart from a chat payload, drawn by Carbon Charts or ECharts. */
export function ChatChart(props: ChatChartProps) {
  const { messages, className, animations = true, ...payload } = props;
  const text = resolveMessages(defaultChatChartMessages, messages);
  const summaryId = useId();
  if (!isChatChartData(payload))
    return <ElementError title={text.invalid('afframe-chart')} />;
  return (
    <div
      className={['afframe-chat-chart', className].filter(Boolean).join(' ')}>
      <EngineSlot
        engine={payload.engine === 'echarts' ? EChartsEngine : ChartsEngine}
        loadErrorTitle={text.loadError}
        renderErrorTitle={text.invalid('afframe-chart')}
        loadingLabel={text.loading}>
        <figure
          className="afframe-chat-chart__figure"
          // Marks where Carbon Charts renders, as Charts.mdx asks of apps.
          {...(payload.engine !== 'echarts' && {
            'data-afframe-extra': 'charts',
          })}
          aria-label={text.chartLabel(payload.title)}
          aria-describedby={summaryId}>
          {payload.engine === 'echarts' ? (
            <EChartsEngine.Engine payload={payload} animations={animations} />
          ) : (
            <ChartsEngine.Engine payload={payload} animations={animations} />
          )}
        </figure>
      </EngineSlot>
      <p id={summaryId} className="cds--visually-hidden">
        {payload.summary}
      </p>
    </div>
  );
}
