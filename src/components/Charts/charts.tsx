'use client';
import * as IBM from '@carbon/charts-react';
import type {
  AlluvialChartOptions,
  AreaChartOptions,
  BarChartOptions,
  BaseChartOptions,
  BoxplotChartOptions,
  BubbleChartOptions,
  BulletChartOptions,
  ChartTabularData,
  ChoroplethChartOptions,
  CirclePackChartOptions,
  ComboChartOptions,
  DonutChartOptions,
  GaugeChartOptions,
  HeatmapChartOptions,
  HistogramChartOptions,
  LineChartOptions,
  LollipopChartOptions,
  MeterChartOptions,
  PieChartOptions,
  RadarChartOptions,
  ScatterChartOptions,
  StackedAreaChartOptions,
  StackedBarChartOptions,
  TreeChartOptions,
  TreemapChartOptions,
  WordCloudChartOptions,
} from '@carbon/charts';
import { createElement, useMemo } from 'react';
import type { ComponentClass, ReactElement, Ref } from 'react';
import { useCarbonTheme } from '../../theme/use-afframe-theme.js';

/** Props of a Carbon Charts component; `ref` reaches IBM's class instance (its `chart` field is the core chart). */
export interface CarbonChartProps<Options extends BaseChartOptions, Instance> {
  data: ChartTabularData;
  options: Options;
  ref?: Ref<Instance>;
}

/** A Carbon Charts component with the page's theme as its default. */
export interface CarbonChart<Options extends BaseChartOptions, Instance> {
  (props: CarbonChartProps<Options, Instance>): ReactElement;
  displayName: string;
}

// IBM's chart with `options.theme` defaulting to the page's Carbon theme
// (`useCarbonTheme`). An explicit `options.theme` wins. Every export below
// names IBM's types explicitly: IBM's declarations resolve only with bundler
// module resolution, and an inferred type would be emitted as whatever this
// build resolved.
function withCarbonTheme<Options extends BaseChartOptions, Instance>(
  Chart: unknown,
  name: string
): CarbonChart<Options, Instance> {
  function Themed(props: CarbonChartProps<Options, Instance>) {
    const { options } = props;
    const theme = useCarbonTheme();
    const themed = useMemo(
      () =>
        options.theme
          ? options
          : {
              ...options,
              theme:
                theme === 'g100' ? IBM.ChartTheme.G100 : IBM.ChartTheme.WHITE,
            },
      [options, theme]
    );
    return createElement(
      Chart as ComponentClass<CarbonChartProps<Options, Instance>>,
      { ...props, options: themed }
    );
  }
  Themed.displayName = name;
  return Themed;
}

export const AlluvialChart: CarbonChart<
  AlluvialChartOptions,
  IBM.AlluvialChart
> = withCarbonTheme(IBM.AlluvialChart, 'AlluvialChart');
export const AreaChart: CarbonChart<AreaChartOptions, IBM.AreaChart> =
  withCarbonTheme(IBM.AreaChart, 'AreaChart');
export const BoxplotChart: CarbonChart<BoxplotChartOptions, IBM.BoxplotChart> =
  withCarbonTheme(IBM.BoxplotChart, 'BoxplotChart');
export const BubbleChart: CarbonChart<BubbleChartOptions, IBM.BubbleChart> =
  withCarbonTheme(IBM.BubbleChart, 'BubbleChart');
export const BulletChart: CarbonChart<BulletChartOptions, IBM.BulletChart> =
  withCarbonTheme(IBM.BulletChart, 'BulletChart');
export const ChoroplethChart: CarbonChart<
  ChoroplethChartOptions,
  IBM.ChoroplethChart
> = withCarbonTheme(IBM.ChoroplethChart, 'ChoroplethChart');
export const CirclePackChart: CarbonChart<
  CirclePackChartOptions,
  IBM.CirclePackChart
> = withCarbonTheme(IBM.CirclePackChart, 'CirclePackChart');
export const ComboChart: CarbonChart<ComboChartOptions, IBM.ComboChart> =
  withCarbonTheme(IBM.ComboChart, 'ComboChart');
export const DonutChart: CarbonChart<DonutChartOptions, IBM.DonutChart> =
  withCarbonTheme(IBM.DonutChart, 'DonutChart');
export const GaugeChart: CarbonChart<GaugeChartOptions, IBM.GaugeChart> =
  withCarbonTheme(IBM.GaugeChart, 'GaugeChart');
export const GroupedBarChart: CarbonChart<
  BarChartOptions,
  IBM.GroupedBarChart
> = withCarbonTheme(IBM.GroupedBarChart, 'GroupedBarChart');
export const HeatmapChart: CarbonChart<HeatmapChartOptions, IBM.HeatmapChart> =
  withCarbonTheme(IBM.HeatmapChart, 'HeatmapChart');
export const HistogramChart: CarbonChart<
  HistogramChartOptions,
  IBM.HistogramChart
> = withCarbonTheme(IBM.HistogramChart, 'HistogramChart');
export const LineChart: CarbonChart<LineChartOptions, IBM.LineChart> =
  withCarbonTheme(IBM.LineChart, 'LineChart');
export const LollipopChart: CarbonChart<
  LollipopChartOptions,
  IBM.LollipopChart
> = withCarbonTheme(IBM.LollipopChart, 'LollipopChart');
export const MeterChart: CarbonChart<MeterChartOptions, IBM.MeterChart> =
  withCarbonTheme(IBM.MeterChart, 'MeterChart');
export const PieChart: CarbonChart<PieChartOptions, IBM.PieChart> =
  withCarbonTheme(IBM.PieChart, 'PieChart');
export const RadarChart: CarbonChart<RadarChartOptions, IBM.RadarChart> =
  withCarbonTheme(IBM.RadarChart, 'RadarChart');
export const ScatterChart: CarbonChart<ScatterChartOptions, IBM.ScatterChart> =
  withCarbonTheme(IBM.ScatterChart, 'ScatterChart');
export const SimpleBarChart: CarbonChart<BarChartOptions, IBM.SimpleBarChart> =
  withCarbonTheme(IBM.SimpleBarChart, 'SimpleBarChart');
export const StackedAreaChart: CarbonChart<
  StackedAreaChartOptions,
  IBM.StackedAreaChart
> = withCarbonTheme(IBM.StackedAreaChart, 'StackedAreaChart');
export const StackedBarChart: CarbonChart<
  StackedBarChartOptions,
  IBM.StackedBarChart
> = withCarbonTheme(IBM.StackedBarChart, 'StackedBarChart');
export const TreeChart: CarbonChart<TreeChartOptions, IBM.TreeChart> =
  withCarbonTheme(IBM.TreeChart, 'TreeChart');
export const TreemapChart: CarbonChart<TreemapChartOptions, IBM.TreemapChart> =
  withCarbonTheme(IBM.TreemapChart, 'TreemapChart');
export const WordCloudChart: CarbonChart<
  WordCloudChartOptions,
  IBM.WordCloudChart
> = withCarbonTheme(IBM.WordCloudChart, 'WordCloudChart');
