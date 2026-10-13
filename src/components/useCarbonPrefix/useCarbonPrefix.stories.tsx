import type { Meta, StoryObj } from '@storybook/react-vite';
import { useCarbonPrefix } from '../../index.js';
import mdx from './useCarbonPrefix.mdx';

const meta = {
  title: 'Hooks/useCarbonPrefix',
  tags: ['carbon'],
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta;

export default meta;

function Prefix() {
  const prefix = useCarbonPrefix();
  return (
    <p>
      useCarbonPrefix() returns <code>{prefix}</code>
    </p>
  );
}

export const Default: StoryObj<typeof meta> = {
  render: () => <Prefix />,
};
