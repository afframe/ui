import type { Meta, StoryObj } from '@storybook/react-vite';
import { AreaChart, LineChart, StackedAreaChart } from './charts.js';
import { ScaleTypes } from './index.js';
import type {
  AreaChartOptions,
  LineChartOptions,
  StackedAreaChartOptions,
} from './index.js';
import mdx from './Charts.mdx';
import { upstreamA11y } from './upstreamA11y.js';

const meta = {
  title: 'Components/Charts/Line and area',
  tags: ['extras'],
  parameters: { docs: { page: mdx } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const series = (group: string, values: number[]) =>
  values.map((value, index) => ({ group, key: months[index], value }));
const data = [
  ...series('Invoices', [40, 52, 47, 61, 58, 70]),
  ...series('Payments', [32, 45, 50, 49, 60, 66]),
];

const axes = {
  left: { mapsTo: 'value', title: 'Documents' },
  bottom: { mapsTo: 'key', scaleType: ScaleTypes.LABELS },
};

const lineOptions: LineChartOptions = {
  title: 'Documents per month',
  axes,
  animations: false,
  height: '400px',
};
const areaOptions: AreaChartOptions = { ...lineOptions };
const stackedAreaOptions: StackedAreaChartOptions = {
  ...lineOptions,
  axes: { ...axes, left: { ...axes.left, stacked: true } },
};

export const Line: Story = {
  parameters: upstreamA11y(),
  render: () => <LineChart data={data} options={lineOptions} />,
};

export const Area: Story = {
  parameters: upstreamA11y(),
  render: () => (
    <AreaChart
      data={series('Invoices', [40, 52, 47, 61, 58, 70])}
      options={areaOptions}
    />
  ),
};

export const StackedArea: Story = {
  parameters: upstreamA11y(),
  render: () => <StackedAreaChart data={data} options={stackedAreaOptions} />,
};
