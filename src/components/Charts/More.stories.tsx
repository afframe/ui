import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ChoroplethChart,
  ComboChart,
  HeatmapChart,
  RadarChart,
  WordCloudChart,
} from './charts.js';
import { ColorLegendType, Projection, ScaleTypes } from './index.js';
import type {
  ChoroplethChartOptions,
  ComboChartOptions,
  HeatmapChartOptions,
  RadarChartOptions,
  WordCloudChartOptions,
} from './index.js';
import mdx from './Charts.mdx';
import { heatmapCells, upstreamA11y } from './upstreamA11y.js';

const meta = {
  title: 'Components/Charts/More',
  tags: ['extras'],
  parameters: { docs: { page: mdx } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const base = { animations: false, height: '400px' } as const;

const comboOptions: ComboChartOptions = {
  ...base,
  title: 'Revenue and orders',
  axes: {
    left: {
      mapsTo: 'value',
      title: 'Revenue (CZK)',
      correspondingDatasets: ['Revenue'],
    },
    right: {
      mapsTo: 'orders',
      title: 'Orders',
      correspondingDatasets: ['Orders'],
    },
    bottom: { mapsTo: 'key', scaleType: ScaleTypes.LABELS },
  },
  comboChartTypes: [
    { type: 'simple-bar', correspondingDatasets: ['Revenue'] },
    { type: 'line', correspondingDatasets: ['Orders'] },
  ],
};

const radarOptions: RadarChartOptions = {
  ...base,
  title: 'Supplier scores',
  radar: { axes: { angle: 'feature', value: 'score' } },
  data: { groupMapsTo: 'supplier' },
};

const heatmapOptions: HeatmapChartOptions = {
  ...base,
  title: 'Invoices by weekday and hour',
  axes: {
    bottom: { mapsTo: 'hour', scaleType: ScaleTypes.LABELS },
    left: { mapsTo: 'day', scaleType: ScaleTypes.LABELS },
  },
  heatmap: { colorLegend: { title: 'Invoices' } },
};

const wordCloudOptions: WordCloudChartOptions = {
  ...base,
  title: 'Common invoice terms',
  wordCloud: { fontSizeMapsTo: 'value', wordMapsTo: 'word' },
};

// Two square regions in a minimal TopoJSON topology, so the story needs no
// map download. Real maps come from a TopoJSON source such as world-atlas.
const geoData = {
  type: 'Topology' as const,
  arcs: [
    [
      [12, 48],
      [12, 51],
      [15, 51],
      [15, 48],
      [12, 48],
    ],
    [
      [15, 48],
      [15, 51],
      [18, 51],
      [18, 48],
      [15, 48],
    ],
  ],
  objects: {
    countries: {
      type: 'GeometryCollection' as const,
      geometries: [
        { type: 'Polygon' as const, arcs: [[0]], properties: { NAME: 'West' } },
        { type: 'Polygon' as const, arcs: [[1]], properties: { NAME: 'East' } },
      ],
    },
  },
};

const choroplethOptions: ChoroplethChartOptions = {
  ...base,
  title: 'Customers by region',
  geoData,
  thematic: { projection: Projection.geoMercator },
  choropleth: {
    colorLegend: { title: 'Customers', type: ColorLegendType.LINEAR },
  },
};

const days = ['Mon', 'Tue', 'Wed'];
const hours = ['9', '12', '15'];

export const Combo: Story = {
  parameters: upstreamA11y(),
  render: () => (
    <ComboChart
      data={[
        { group: 'Revenue', key: 'Q1', value: 12000 },
        { group: 'Revenue', key: 'Q2', value: 18000 },
        { group: 'Revenue', key: 'Q3', value: 9000 },
        { group: 'Orders', key: 'Q1', orders: 30 },
        { group: 'Orders', key: 'Q2', orders: 42 },
        { group: 'Orders', key: 'Q3', orders: 25 },
      ]}
      options={comboOptions}
    />
  ),
};

export const Radar: Story = {
  parameters: upstreamA11y(),
  render: () => (
    <RadarChart
      data={['Price', 'Quality', 'Delivery', 'Support', 'Terms'].flatMap(
        (feature, index) => [
          { supplier: 'Alpha', feature, score: [8, 6, 9, 5, 7][index] },
          { supplier: 'Beta', feature, score: [6, 9, 5, 8, 6][index] },
        ]
      )}
      options={radarOptions}
    />
  ),
};

export const Heatmap: Story = {
  parameters: upstreamA11y(heatmapCells),
  render: () => (
    <HeatmapChart
      data={days.flatMap((day, row) =>
        hours.map((hour, column) => ({
          day,
          hour,
          value: (row + 1) * (column + 2),
        }))
      )}
      options={heatmapOptions}
    />
  ),
};

export const WordCloud: Story = {
  parameters: upstreamA11y(),
  render: () => (
    <WordCloudChart
      data={[
        { word: 'invoice', value: 60, group: 'Documents' },
        { word: 'payment', value: 45, group: 'Documents' },
        { word: 'due', value: 30, group: 'Terms' },
        { word: 'VAT', value: 40, group: 'Terms' },
        { word: 'credit', value: 20, group: 'Documents' },
        { word: 'net', value: 15, group: 'Terms' },
      ]}
      options={wordCloudOptions}
    />
  ),
};

export const Choropleth: Story = {
  parameters: upstreamA11y(),
  render: () => (
    <ChoroplethChart
      data={[
        { name: 'West', value: 40 },
        { name: 'East', value: 25 },
      ]}
      options={choroplethOptions}
    />
  ),
};
