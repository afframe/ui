import type { Meta, StoryObj } from '@storybook/react-vite';
import { GroupedBarChart, SimpleBarChart, StackedBarChart } from './charts.js';
import { ScaleTypes } from './index.js';
import type { BarChartOptions, StackedBarChartOptions } from './index.js';
import mdx from './Charts.mdx';
import { upstreamA11y } from './upstreamA11y.js';

const meta = {
  title: 'Components/Charts/Bar',
  tags: ['extras'],
  parameters: { docs: { page: mdx } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const quarters = [
  { group: 'Q1', value: 12000 },
  { group: 'Q2', value: 18000 },
  { group: 'Q3', value: 9000 },
  { group: 'Q4', value: 15000 },
];

const regions = [
  { group: 'Prague', key: 'Q1', value: 12000 },
  { group: 'Prague', key: 'Q2', value: 18000 },
  { group: 'Prague', key: 'Q3', value: 9000 },
  { group: 'Brno', key: 'Q1', value: 7000 },
  { group: 'Brno', key: 'Q2', value: 8000 },
  { group: 'Brno', key: 'Q3', value: 11000 },
];

const simpleOptions: BarChartOptions = {
  title: 'Revenue by quarter',
  axes: {
    left: { mapsTo: 'value', title: 'Revenue (CZK)' },
    bottom: { mapsTo: 'group', scaleType: ScaleTypes.LABELS },
  },
  animations: false,
  height: '400px',
};

const groupedOptions: BarChartOptions = {
  title: 'Revenue by region',
  axes: {
    left: { mapsTo: 'value', title: 'Revenue (CZK)' },
    bottom: { mapsTo: 'key', scaleType: ScaleTypes.LABELS },
  },
  animations: false,
  height: '400px',
};

const stackedOptions: StackedBarChartOptions = {
  ...groupedOptions,
  axes: {
    left: { mapsTo: 'value', title: 'Revenue (CZK)', stacked: true },
    bottom: { mapsTo: 'key', scaleType: ScaleTypes.LABELS },
  },
};

export const Simple: Story = {
  parameters: upstreamA11y(),
  render: () => <SimpleBarChart data={quarters} options={simpleOptions} />,
};

export const SimpleDark: Story = {
  parameters: upstreamA11y(),
  globals: { theme: 'dark' },
  render: () => <SimpleBarChart data={quarters} options={simpleOptions} />,
};

export const Grouped: Story = {
  parameters: upstreamA11y(),
  render: () => <GroupedBarChart data={regions} options={groupedOptions} />,
};

export const Stacked: Story = {
  parameters: upstreamA11y(),
  render: () => <StackedBarChart data={regions} options={stackedOptions} />,
};
