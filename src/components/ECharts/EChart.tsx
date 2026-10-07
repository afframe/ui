'use client';
import { BarChart, LineChart, PieChart, ScatterChart } from 'echarts/charts';
import type {
  BarSeriesOption,
  LineSeriesOption,
  PieSeriesOption,
  ScatterSeriesOption,
} from 'echarts/charts';
import {
  AriaComponent,
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components';
import type {
  AriaComponentOption,
  DatasetComponentOption,
  GridComponentOption,
  LegendComponentOption,
  TitleComponentOption,
  TooltipComponentOption,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import type {
  ComposeOption,
  ECElementEvent,
  EChartsCoreOption,
  EChartsType,
} from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { registerCarbonThemes, THEME_NAMES } from '@carbon/echarts-theme';
import {
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { HTMLAttributes, Ref } from 'react';
import { useCarbonTheme } from '../../theme/use-afframe-theme.js';

echarts.use([
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  AriaComponent,
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  CanvasRenderer,
]);
registerCarbonThemes(echarts);

/** The option type for the series and components `EChart` registers. */
export type EChartOption = ComposeOption<
  | BarSeriesOption
  | LineSeriesOption
  | PieSeriesOption
  | ScatterSeriesOption
  | AriaComponentOption
  | DatasetComponentOption
  | GridComponentOption
  | LegendComponentOption
  | TitleComponentOption
  | TooltipComponentOption
>;

/** The ECharts instance (`echarts/core` `EChartsType`). */
export type EChartInstance = EChartsType;

// A method signature, so a handler may take a narrower event type than
// ECharts' mouse event (as for `legendselectchanged`).
interface EChartEventHandlerMethod {
  handle(params: ECElementEvent): void;
}
export type EChartEventHandler = EChartEventHandlerMethod['handle'];

export interface EChartProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'children'
> {
  /**
   * The ECharts option (`setOption`). Registered: bar, line, pie and scatter
   * series; aria, dataset, grid, legend, title and tooltip components.
   * `EChartOption` is the strict type for them.
   */
  option: EChartsCoreOption;
  /** Replace the previous option instead of merging into it. */
  notMerge?: boolean;
  /** ECharts event handlers by event name, as for `chart.on(name, handler)`. */
  onEvents?: Record<string, EChartEventHandler>;
  /** The ECharts instance, `null` before mount and after unmount. */
  ref?: Ref<EChartInstance | null>;
}

const ariaOn = { enabled: true };

/** One ECharts instance with the Carbon theme for the page's colour scheme. */
export function EChart({
  option,
  notMerge = false,
  onEvents,
  ref,
  ...rest
}: EChartProps) {
  const container = useRef<HTMLDivElement>(null);
  const [chart, setChart] = useState<EChartsType | null>(null);
  const theme = THEME_NAMES[useCarbonTheme()];
  const themeAtInit = useRef(theme);
  themeAtInit.current = theme;

  useLayoutEffect(() => {
    if (!container.current) return;
    const instance = echarts.init(container.current, themeAtInit.current);
    setChart(instance);
    const observer = new ResizeObserver(() => instance.resize());
    observer.observe(container.current);
    return () => {
      observer.disconnect();
      instance.dispose();
      setChart(null);
    };
  }, []);

  useImperativeHandle<EChartInstance | null, EChartInstance | null>(
    ref,
    () => chart,
    [chart]
  );

  useEffect(() => {
    chart?.setTheme(theme);
  }, [chart, theme]);

  // ECharts' aria component gives the canvas an accessible description
  // unless the app sets `aria` itself.
  const withAria = useMemo(
    () => ('aria' in option ? option : { ...option, aria: ariaOn }),
    [option]
  );
  useEffect(() => {
    chart?.setOption(withAria, { notMerge });
  }, [chart, withAria, notMerge]);

  useEffect(() => {
    if (!chart || !onEvents) return;
    // ECharts types string-named handlers as taking unknown arguments.
    const entries = Object.entries(onEvents) as [
      string,
      (...args: unknown[]) => void,
    ][];
    for (const [name, handler] of entries) chart.on(name, handler);
    return () => {
      // The layout effect may have disposed the chart first (unmount).
      if (chart.isDisposed()) return;
      for (const [name, handler] of entries) chart.off(name, handler);
    };
  }, [chart, onEvents]);

  return <div data-afframe-extra="echarts" ref={container} {...rest} />;
}
