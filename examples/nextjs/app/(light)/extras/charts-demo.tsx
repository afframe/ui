'use client';
import { ChartTheme, ScaleTypes, SimpleBarChart } from '@afframe/ui';
import type { BarChartOptions } from '@afframe/ui';

const data = [
  { group: 'Q1', value: 12 },
  { group: 'Q2', value: 18 },
  { group: 'Q3', value: 9 },
];

// IBM's enums are client references, so the options live in a client file.
const options: BarChartOptions = {
  title: 'Revenue',
  axes: {
    left: { mapsTo: 'value' },
    bottom: { mapsTo: 'group', scaleType: ScaleTypes.LABELS },
  },
  height: '300px',
  theme: ChartTheme.WHITE,
};

export function ChartsDemo() {
  return <SimpleBarChart data={data} options={options} />;
}
