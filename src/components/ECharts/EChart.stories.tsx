import type { Meta, StoryObj } from '@storybook/react-vite';
import { EChart } from './EChart.js';
import type { EChartOption } from './EChart.js';
import mdx from './ECharts.mdx';

const meta = {
  title: 'Components/ECharts',
  component: EChart,
  tags: ['extras'],
  parameters: { docs: { page: mdx } },
  args: { style: { height: 400 } },
} satisfies Meta<typeof EChart>;

export default meta;
type Story = StoryObj<typeof meta>;

const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];

const bar: EChartOption = {
  animation: false,
  title: { text: 'Revenue by quarter' },
  tooltip: {},
  xAxis: { type: 'category', data: quarters },
  yAxis: { type: 'value', name: 'CZK' },
  series: [{ type: 'bar', name: 'Revenue', data: [12000, 18000, 9000, 15000] }],
};

const line: EChartOption = {
  animation: false,
  title: { text: 'Documents per month' },
  tooltip: { trigger: 'axis' },
  legend: { bottom: 0 },
  xAxis: { type: 'category', data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] },
  yAxis: { type: 'value' },
  series: [
    { type: 'line', name: 'Invoices', data: [40, 52, 47, 61, 58, 70] },
    { type: 'line', name: 'Payments', data: [32, 45, 50, 49, 60, 66] },
  ],
};

const pie: EChartOption = {
  animation: false,
  title: { text: 'Costs by category' },
  tooltip: { trigger: 'item' },
  legend: { bottom: 0 },
  series: [
    {
      type: 'pie',
      name: 'Costs',
      radius: ['40%', '70%'],
      data: [
        { name: 'Salaries', value: 52000 },
        { name: 'Rent', value: 18000 },
        { name: 'Software', value: 9000 },
        { name: 'Travel', value: 4000 },
      ],
    },
  ],
};

const scatter: EChartOption = {
  animation: false,
  title: { text: 'Orders and revenue' },
  tooltip: {},
  xAxis: { type: 'value', name: 'Orders' },
  yAxis: { type: 'value', name: 'CZK' },
  series: [
    {
      type: 'scatter',
      name: 'Customers',
      data: [
        [12, 34000],
        [25, 51000],
        [31, 72000],
        [8, 88000],
        [14, 120000],
        [19, 150000],
      ],
    },
  ],
};

const dataset: EChartOption = {
  animation: false,
  title: { text: 'Revenue by region' },
  tooltip: { trigger: 'axis' },
  legend: { bottom: 0 },
  dataset: {
    source: [
      ['quarter', 'Prague', 'Brno'],
      ['Q1', 12000, 7000],
      ['Q2', 18000, 8000],
      ['Q3', 9000, 11000],
    ],
  },
  xAxis: { type: 'category' },
  yAxis: { type: 'value' },
  series: [{ type: 'bar' }, { type: 'bar' }],
};

export const Bar: Story = { args: { option: bar } };

export const BarDark: Story = {
  args: { option: bar },
  globals: { theme: 'dark' },
};

export const Line: Story = { args: { option: line } };

export const Pie: Story = { args: { option: pie } };

export const Scatter: Story = { args: { option: scatter } };

export const Dataset: Story = { args: { option: dataset } };
