import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  AlluvialChart,
  CirclePackChart,
  TreeChart,
  TreemapChart,
} from './charts.js';
import { TreeTypes } from './index.js';
import type {
  AlluvialChartOptions,
  CirclePackChartOptions,
  TreeChartOptions,
  TreemapChartOptions,
} from './index.js';
import mdx from './Charts.mdx';
import { alluvialLinks, upstreamA11y } from './upstreamA11y.js';

const meta = {
  title: 'Components/Charts/Flow and hierarchy',
  tags: ['extras'],
  parameters: { docs: { page: mdx } },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const company = [
  {
    name: 'Sales',
    children: [
      { name: 'Retail', value: 40 },
      { name: 'Wholesale', value: 25 },
    ],
  },
  {
    name: 'Operations',
    children: [
      { name: 'Finance', value: 15 },
      { name: 'IT', value: 12 },
      { name: 'Legal', value: 8 },
    ],
  },
];

const base = { animations: false, height: '400px' } as const;

const alluvialOptions: AlluvialChartOptions = {
  ...base,
  title: 'Leads to orders',
  alluvial: {
    nodes: [
      { name: 'Web', category: 'Source' },
      { name: 'Referral', category: 'Source' },
      { name: 'Quote', category: 'Stage' },
      { name: 'Order', category: 'Outcome' },
      { name: 'Lost', category: 'Outcome' },
    ],
  },
};

const treeOptions: TreeChartOptions = {
  ...base,
  title: 'Departments',
  tree: { type: TreeTypes.TREE },
};

const circlePackOptions: CirclePackChartOptions = {
  ...base,
  title: 'Headcount',
};

const treemapOptions: TreemapChartOptions = {
  ...base,
  title: 'Headcount',
};

export const Alluvial: Story = {
  parameters: upstreamA11y(alluvialLinks),
  render: () => (
    <AlluvialChart
      data={[
        { source: 'Web', target: 'Quote', value: 30 },
        { source: 'Referral', target: 'Quote', value: 20 },
        { source: 'Quote', target: 'Order', value: 35 },
        { source: 'Quote', target: 'Lost', value: 15 },
      ]}
      options={alluvialOptions}
    />
  ),
};

export const Tree: Story = {
  parameters: upstreamA11y(),
  render: () => (
    <TreeChart
      data={[{ name: 'Company', children: company }]}
      options={treeOptions}
    />
  ),
};

export const CirclePack: Story = {
  parameters: upstreamA11y(),
  render: () => <CirclePackChart data={company} options={circlePackOptions} />,
};

export const Treemap: Story = {
  parameters: upstreamA11y(),
  render: () => <TreemapChart data={company} options={treemapOptions} />,
};
