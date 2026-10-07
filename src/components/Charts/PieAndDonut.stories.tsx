import type { Meta, StoryObj } from '@storybook/react-vite';
import { DonutChart, PieChart } from './charts.js';
import type { DonutChartOptions, PieChartOptions } from './index.js';
import mdx from './Charts.mdx';
import { upstreamA11y } from './upstreamA11y.js';

const meta = {
  title: 'Components/Charts/Pie and donut',
  tags: ['extras'],
  parameters: { docs: { page: mdx } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const costs = [
  { group: 'Salaries', value: 52000 },
  { group: 'Rent', value: 18000 },
  { group: 'Software', value: 9000 },
  { group: 'Travel', value: 4000 },
];

const pieOptions: PieChartOptions = {
  title: 'Costs by category',
  animations: false,
  height: '400px',
};
const donutOptions: DonutChartOptions = {
  ...pieOptions,
  donut: { center: { label: 'CZK' } },
};

export const Pie: Story = {
  parameters: upstreamA11y(),
  render: () => <PieChart data={costs} options={pieOptions} />,
};

export const Donut: Story = {
  parameters: upstreamA11y(),
  render: () => <DonutChart data={costs} options={donutOptions} />,
};
