import { Link } from '@carbon/react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { afframeA11y } from '../../../.storybook/afframeA11y.js';
import { Amount, formatDate } from '../../index.js';
import { DescriptionList } from './DescriptionList.js';
import mdx from './DescriptionList.mdx';

const items = [
  { term: 'Invoice', description: 'INV-2026-0042' },
  { term: 'Customer', description: 'Lakeside Furniture' },
  { term: 'Issued', description: formatDate('2026-10-07') },
  { term: 'Total', description: <Amount value={12500} /> },
];

const meta = {
  title: 'Components/DescriptionList',
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
  args: {
    items: [
      ...items,
      {
        term: 'Document',
        description: <Link href="#invoice">INV-2026-0042.pdf</Link>,
      },
    ],
  },
};

export const Sizes: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div style={{ display: 'grid', gap: '2rem' }}>
      {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
        <section key={size}>
          <p id={`size-${size}`} className="cds--label">
            {size}
          </p>
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
      { term: 'Invoice', description: 'INV-2026-0042' },
      { term: 'Purchase order', description: null },
      { term: 'Note', description: '' },
    ],
  },
};

export const Dark: Story = {
  ...Default,
  tags: ['!dev', '!autodocs'],
  globals: { theme: 'dark' },
};
