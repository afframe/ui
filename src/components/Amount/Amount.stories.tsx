import type { Meta, StoryObj } from '@storybook/react-vite';
import { afframeA11y } from '../../../.storybook/afframeA11y.js';
import { Amount } from './Amount.js';
import mdx from './Amount.mdx';

const meta = {
  title: 'Components/Amount',
  component: Amount,
  tags: ['afframe'],
  args: { value: 1234.5 },
  parameters: {
    ...afframeA11y,
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof Amount>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Negative: Story = {
  args: { value: -1234.5, colorNegative: true },
};

export const Currencies: Story = {
  render: () => (
    <ul>
      <li>
        <Amount value={1234.5} />
      </li>
      <li>
        <Amount value={1234.5} currency="EUR" />
      </li>
      <li>
        <Amount value={1234.5} currency="EUR" locale="en-GB" />
      </li>
      <li>
        <Amount value={1234.5} currency="USD" locale="en-US" />
      </li>
      <li>
        <Amount value={1234.5} currency="JPY" locale="ja-JP" />
      </li>
    </ul>
  ),
};

export const Signs: Story = {
  render: () => (
    <ul>
      <li>
        <Amount value={250} signDisplay="exceptZero" colorNegative />
      </li>
      <li>
        <Amount value={-250} signDisplay="exceptZero" colorNegative />
      </li>
      <li>
        <Amount value={-0.004} signDisplay="exceptZero" colorNegative />
      </li>
    </ul>
  ),
};

export const Fallback: Story = {
  render: () => (
    <ul>
      <li>
        <Amount value={Number.NaN} fallback="Not available" />
      </li>
      <li>
        <Amount value={Infinity} fallback="Not available" />
      </li>
    </ul>
  ),
};

export const Dark: Story = {
  ...Signs,
  globals: { theme: 'dark' },
};
