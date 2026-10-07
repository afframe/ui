import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { afframeA11y } from '../../../.storybook/afframeA11y.js';
import { ChatChart, type ChatChartProps } from './ChatChart.js';
import mdx from './ChatElements.mdx';

const quarters = [
  { group: 'Revenue', key: 'Q1', value: 1200 },
  { group: 'Revenue', key: 'Q2', value: 1800 },
  { group: 'Revenue', key: 'Q3', value: 1500 },
  { group: 'Revenue', key: 'Q4', value: 2000 },
  { group: 'Costs', key: 'Q1', value: 900 },
  { group: 'Costs', key: 'Q2', value: 1100 },
  { group: 'Costs', key: 'Q3', value: 1000 },
  { group: 'Costs', key: 'Q4', value: 1300 },
];

const shares = [
  { group: 'Invoices', value: 62 },
  { group: 'Receipts', value: 24 },
  { group: 'Contracts', value: 14 },
];

const meta: Meta<typeof ChatChart> = {
  title: 'Components/Chat Elements/Chat Chart',
  component: ChatChart,
  tags: ['afframe'],
  parameters: {
    ...afframeA11y,
    docs: { page: mdx },
  },
  // A figure named by the title and described by the summary, with no tab
  // stop inside.
  play: async ({ canvasElement, args }) => {
    const figure = await within(canvasElement).findByRole(
      'figure',
      { name: args.title ?? '' },
      { timeout: 10000 }
    );
    await expect(figure).toHaveAccessibleDescription(args.summary);
    await expect(figure.querySelector('svg, canvas')).not.toBeNull();
    await expect(
      figure.querySelector('a, button, [tabindex]:not([tabindex="-1"])')
    ).toBeNull();
  },
};

export default meta;

type Story = StoryObj<typeof ChatChart>;

const pie: ChatChartProps = {
  chart_type: 'pie',
  title: 'Documents by type',
  summary: 'Invoices 62 %, receipts 24 %, contracts 14 %.',
  data: shares,
  animations: false,
};

export const Bar: Story = {
  args: {
    chart_type: 'bar',
    title: 'Revenue by region',
    summary: 'Prague leads with 2,000; Brno 1,400; Ostrava 900.',
    data: [
      { group: 'Prague', value: 2000 },
      { group: 'Brno', value: 1400 },
      { group: 'Ostrava', value: 900 },
    ],
    animations: false,
  },
};

export const Line: Story = {
  args: {
    chart_type: 'line',
    title: 'Revenue and costs by quarter',
    summary: 'Revenue rose from 1,200 to 2,000; costs from 900 to 1,300.',
    data: quarters,
    animations: false,
  },
};

export const Pie: Story = { args: pie };

export const Donut: Story = {
  args: { ...pie, chart_type: 'donut' },
};

export const Echarts: Story = {
  args: {
    engine: 'echarts',
    title: 'Orders per day',
    summary: 'Orders peaked on Wednesday with 31.',
    option: {
      animation: false,
      xAxis: { type: 'category', data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
      yAxis: { type: 'value' },
      series: [{ type: 'bar', data: [12, 20, 31, 18, 9] }],
    },
  },
};

export const Dark: Story = {
  ...Line,
  globals: { theme: 'dark' },
};
