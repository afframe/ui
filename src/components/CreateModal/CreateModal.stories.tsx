import type { Meta, StoryObj } from '@storybook/react-vite';
import { afframeA11y } from '../../../.storybook/afframeA11y.js';
import {
  exampleCustomer,
  flowHarnessArgTypes,
  flowRender,
  flowStories,
} from '../FlowParts/storyForm.js';
import type { FlowHarnessArgs } from '../FlowParts/storyForm.js';
import { CreateModal } from './CreateModal.js';
import type { CreateModalProps } from './CreateModal.js';
import mdx from './CreateModal.mdx';

const meta = {
  title: 'Components/Create and Edit/CreateModal',
  component: CreateModal,
  tags: ['afframe'],
  parameters: {
    ...afframeA11y,
    layout: 'padded',
    docs: { page: mdx, story: { inline: false, iframeHeight: 560 } },
  },
  argTypes: flowHarnessArgTypes,
  args: {
    open: true,
    title: 'New customer',
    description: 'The customer appears in the invoice form once created.',
    onClose: () => undefined,
    onSubmit: (): void => undefined,
  },
  render: flowRender(CreateModal, 'create-modal', 'New customer'),
} satisfies Meta<CreateModalProps & FlowHarnessArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

const stories = flowStories('Create', 14, exampleCustomer.name);

export const Default: Story = {};

export const WithError: Story = stories.WithError;

export const Dirty: Story = stories.Dirty;

export const Submitting: Story = stories.Submitting;

export const Dark: Story = {
  ...Default,
  tags: ['!dev', '!autodocs'],
  globals: { theme: 'dark' },
};
