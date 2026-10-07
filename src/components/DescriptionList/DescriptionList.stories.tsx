import { Link } from '@carbon/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { afframeA11y } from '../../../.storybook/afframeA11y.js';
import { Amount } from '../../index.js';
import { DescriptionList, DescriptionListItem } from './DescriptionList.js';
import mdx from './DescriptionList.mdx';

const items = [
  { term: 'Invoice', description: 'FV-2026-0042' },
  { term: 'Supplier', description: 'Northwind Studio s.r.o.' },
  { term: 'Issued', description: '7. 10. 2026' },
  { term: 'Total', description: <Amount value={12500} /> },
];

const meta = {
  title: 'Components/Description List',
  component: DescriptionList,
  tags: ['afframe'],
  args: { 'aria-label': 'Invoice details', items },
  parameters: {
    ...afframeA11y,
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof DescriptionList>;

export default meta;

type Story = StoryObj<typeof meta>;

// The link is the one focusable element (focus screenshot).
export const Default: Story = {
  render: () => (
    <DescriptionList aria-label="Invoice details">
      {items.map(({ term, description }) => (
        <DescriptionListItem key={term} term={term}>
          {description}
        </DescriptionListItem>
      ))}
      <DescriptionListItem term="Document">
        <Link href="#invoice">FV-2026-0042.pdf</Link>
      </DescriptionListItem>
    </DescriptionList>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '2rem' }}>
      {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
        <section key={size}>
          <h2 id={`size-${size}`}>{size}</h2>
          <DescriptionList
            aria-labelledby={`size-${size}`}
            items={items}
            size={size}
          />
        </section>
      ))}
    </div>
  ),
};

export const Vertical: Story = {
  args: { orientation: 'vertical' },
};

export const WithBorder: Story = {
  args: { border: true },
};

export const EmptyValues: Story = {
  args: {
    items: [
      { term: 'Invoice', description: 'FV-2026-0042' },
      { term: 'Purchase order', description: null },
      { term: 'Note', description: '' },
    ],
  },
};

export const Dark: Story = {
  ...Default,
  globals: { theme: 'dark' },
};
