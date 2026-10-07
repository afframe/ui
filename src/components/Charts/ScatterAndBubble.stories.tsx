import type { Meta, StoryObj } from '@storybook/react-vite';
import { BubbleChart, ScatterChart } from './charts.js';
import { ScaleTypes } from './index.js';
import type { BubbleChartOptions, ScatterChartOptions } from './index.js';
import mdx from './Charts.mdx';
import { upstreamA11y } from './upstreamA11y.js';

const meta = {
  title: 'Components/Charts/Scatter and bubble',
  tags: ['extras'],
  parameters: { docs: { page: mdx } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const customers = [
  { group: 'Retail', orders: 12, revenue: 34000, margin: 8 },
  { group: 'Retail', orders: 25, revenue: 51000, margin: 12 },
  { group: 'Retail', orders: 31, revenue: 72000, margin: 6 },
  { group: 'Wholesale', orders: 8, revenue: 88000, margin: 15 },
  { group: 'Wholesale', orders: 14, revenue: 120000, margin: 10 },
  { group: 'Wholesale', orders: 19, revenue: 150000, margin: 18 },
];

const axes = {
  bottom: { mapsTo: 'orders', title: 'Orders', scaleType: ScaleTypes.LINEAR },
  left: {
    mapsTo: 'revenue',
    title: 'Revenue (CZK)',
    scaleType: ScaleTypes.LINEAR,
  },
};

const scatterOptions: ScatterChartOptions = {
  title: 'Orders and revenue',
  axes,
  animations: false,
  height: '400px',
};
const bubbleOptions: BubbleChartOptions = {
  ...scatterOptions,
  title: 'Orders, revenue and margin',
  bubble: { radiusMapsTo: 'margin' },
};

export const Scatter: Story = {
  parameters: upstreamA11y(),
  render: () => <ScatterChart data={customers} options={scatterOptions} />,
};

export const Bubble: Story = {
  parameters: upstreamA11y(),
  render: () => <BubbleChart data={customers} options={bubbleOptions} />,
};
