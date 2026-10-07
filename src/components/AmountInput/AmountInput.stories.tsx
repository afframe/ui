import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { afframeA11y } from '../../../.storybook/afframeA11y.js';
import { AmountInput, type AmountInputProps } from './AmountInput.js';
import mdx from './AmountInput.mdx';

function Controlled(props: AmountInputProps) {
  const [value, setValue] = useState(props.value ?? null);
  return <AmountInput {...props} value={value} onChange={setValue} />;
}

const meta = {
  title: 'Components/Amount Input',
  component: AmountInput,
  tags: ['afframe'],
  args: {
    id: 'amount',
    label: 'Amount',
    value: 1234.5,
    step: 100,
  },
  render: (args) => <Controlled {...args} />,
  parameters: {
    ...afframeA11y,
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof AmountInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: { value: null, helperText: 'Leave empty if not known' },
};

export const WithLimits: Story = {
  args: { value: 2500, min: 0, max: 1000 },
};

export const OtherCurrency: Story = {
  args: { value: -1234.5, currency: 'EUR', locale: 'en-GB' },
};

export const Dark: Story = {
  globals: { theme: 'dark' },
};

export const Focus: Story = {
  play: async ({ canvasElement }) => {
    await userEvent.tab();
    await expect(within(canvasElement).getByLabelText('Amount')).toHaveFocus();
  },
};
