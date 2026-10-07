import type { Meta, StoryObj } from '@storybook/react-vite';
import { BulletChart, GaugeChart, MeterChart } from './charts.js';
import { GaugeTypes, ScaleTypes, Statuses } from './index.js';
import type {
  BulletChartOptions,
  GaugeChartOptions,
  MeterChartOptions,
} from './index.js';
import mdx from './Charts.mdx';
import { upstreamA11y } from './upstreamA11y.js';

const meta = {
  title: 'Components/Charts/Gauge and meter',
  tags: ['extras'],
  parameters: { docs: { page: mdx } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const gaugeOptions: GaugeChartOptions = {
  title: 'Invoices paid on time',
  gauge: { type: GaugeTypes.SEMI, status: Statuses.SUCCESS },
  animations: false,
  height: '250px',
};

const meterOptions: MeterChartOptions = {
  title: 'Budget used',
  meter: {
    peak: 90,
    status: {
      ranges: [
        { range: [0, 60], status: Statuses.SUCCESS },
        { range: [60, 80], status: Statuses.WARNING },
        { range: [80, 100], status: Statuses.DANGER },
      ],
    },
  },
  animations: false,
  height: '130px',
};

const bulletOptions: BulletChartOptions = {
  title: 'Targets',
  axes: {
    bottom: { mapsTo: 'value' },
    left: { mapsTo: 'title', scaleType: ScaleTypes.LABELS },
  },
  animations: false,
  height: '300px',
};

export const Gauge: Story = {
  parameters: upstreamA11y(),
  render: () => (
    <GaugeChart
      data={[
        { group: 'value', value: 72 },
        { group: 'delta', value: 4 },
      ]}
      options={gaugeOptions}
    />
  ),
};

export const Meter: Story = {
  parameters: upstreamA11y(),
  render: () => (
    <MeterChart
      data={[{ group: 'Budget', value: 64 }]}
      options={meterOptions}
    />
  ),
};

export const Bullet: Story = {
  parameters: upstreamA11y(),
  render: () => (
    <BulletChart
      data={[
        {
          title: 'Revenue',
          group: 'Prague',
          ranges: [350, 650, 980],
          marker: 1200,
          value: 400,
        },
        {
          title: 'Orders',
          group: 'Brno',
          ranges: [300, 500, 800],
          marker: 600,
          value: 620,
        },
      ]}
      options={bulletOptions}
    />
  ),
};
