import type { Meta, StoryObj } from '@storybook/react-vite';
import { BoxplotChart, HistogramChart, LollipopChart } from './charts.js';
import { ScaleTypes } from './index.js';
import type {
  BoxplotChartOptions,
  HistogramChartOptions,
  LollipopChartOptions,
} from './index.js';
import mdx from './Charts.mdx';
import { upstreamA11y } from './upstreamA11y.js';

const meta = {
  title: 'Components/Charts/Distribution',
  tags: ['extras'],
  parameters: { docs: { page: mdx } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const days = [3, 5, 7, 8, 10, 12, 14, 14, 15, 18, 21, 25, 30, 45];

const boxplotOptions: BoxplotChartOptions = {
  title: 'Days to payment',
  axes: {
    left: { mapsTo: 'group', scaleType: ScaleTypes.LABELS },
    bottom: { mapsTo: 'value' },
  },
  animations: false,
  height: '300px',
};

const histogramOptions: HistogramChartOptions = {
  title: 'Days to payment',
  axes: {
    bottom: { mapsTo: 'days', bins: 5, limitDomainToBins: true },
    left: { scaleType: ScaleTypes.LINEAR, binned: true, stacked: true },
  },
  animations: false,
  height: '400px',
};

const lollipopOptions: LollipopChartOptions = {
  title: 'Open invoices by customer',
  axes: {
    bottom: { mapsTo: 'key', scaleType: ScaleTypes.LABELS },
    left: { mapsTo: 'value' },
  },
  animations: false,
  height: '400px',
};

export const Boxplot: Story = {
  parameters: upstreamA11y(),
  render: () => (
    <BoxplotChart
      data={[
        ...days.map((value) => ({ group: 'Retail', value })),
        ...days.map((value) => ({ group: 'Wholesale', value: value * 2 })),
      ]}
      options={boxplotOptions}
    />
  ),
};

export const Histogram: Story = {
  parameters: upstreamA11y(),
  render: () => (
    <HistogramChart
      data={days.map((value) => ({ group: 'Invoices', days: value }))}
      options={histogramOptions}
    />
  ),
};

export const Lollipop: Story = {
  parameters: upstreamA11y(),
  render: () => (
    <LollipopChart
      data={[
        { group: 'Open', key: 'Alpha', value: 6 },
        { group: 'Open', key: 'Beta', value: 3 },
        { group: 'Open', key: 'Gamma', value: 9 },
        { group: 'Open', key: 'Delta', value: 2 },
      ]}
      options={lollipopOptions}
    />
  ),
};
