import type { Meta, StoryObj } from '@storybook/react-vite';
import { afframeA11y } from '../../.storybook/afframeA11y.js';
import { Button, TextInput } from '../index.js';
import { AfframeProvider } from './AfframeProvider.js';
import mdx from './AfframeProvider.mdx';

const meta = {
  title: 'Afframe/AfframeProvider',
  component: AfframeProvider,
  tags: ['afframe'],
  parameters: {
    ...afframeA11y,
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof AfframeProvider>;

export default meta;

export const Default: StoryObj<typeof meta> = {
  args: {
    children: (
      <>
        <TextInput id="provider-name" labelText="Name" />
        <br />
        <Button>Save</Button>
      </>
    ),
  },
};

export const Dark: StoryObj<typeof meta> = {
  ...Default,
  globals: { theme: 'dark' },
};
