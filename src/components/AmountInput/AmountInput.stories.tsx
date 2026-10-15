import type { Meta, StoryObj } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { expect, userEvent, within } from 'storybook/test';
import { afframeA11y } from '../../../.storybook/afframeA11y.js';
import { AmountInput, type AmountInputProps } from './AmountInput.js';
import mdx from './AmountInput.mdx';

const meta = {
  title: 'Components/AmountInput',
  component: AmountInput,
  tags: ['afframe'],
  args: {
    id: 'amount',
    label: 'Amount',
    value: 1234.5,
    step: 100,
  },
  // The value lives in the story args, so the `value` control and typing stay
  // in sync. useArgs works only in the render function itself.
  render: function Render(args) {
    const [, updateArgs] = useArgs<AmountInputProps>();
    return (
      <AmountInput
        {...args}
        onChange={(value) => {
          updateArgs({ value });
          args.onChange?.(value);
        }}
      />
    );
  },
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

export const Disabled: Story = {
  args: { disabled: true },
};

export const ReadOnly: Story = {
  args: { readOnly: true },
};

export const Invalid: Story = {
  args: {
    invalid: true,
    invalidText: 'The amount does not match the invoice total.',
  },
};

export const Warning: Story = {
  args: { warn: true, warnText: 'This amount is higher than usual.' },
};

export const Dark: Story = {
  tags: ['!dev', '!autodocs'],
  globals: { theme: 'dark' },
};

// Focus-ring fixture for the visual test.
export const Focus: Story = {
  tags: ['!dev', '!autodocs'],
  play: async ({ canvasElement }) => {
    await userEvent.tab();
    await expect(within(canvasElement).getByLabelText('Amount')).toHaveFocus();
  },
};
