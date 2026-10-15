import type { Meta, StoryObj } from '@storybook/react-vite';
import { afframeA11y } from '../../../.storybook/afframeA11y.js';
import {
  exampleCustomer,
  flowHarnessArgTypes,
  flowRender,
  flowStories,
} from '../FlowParts/storyForm.js';
import type { FlowHarnessArgs } from '../FlowParts/storyForm.js';
import { EditSidePanel } from './EditSidePanel.js';
import type { EditSidePanelProps } from './EditSidePanel.js';
import mdx from './EditSidePanel.mdx';

const meta = {
  title: 'Components/Create and Edit/EditSidePanel',
  component: EditSidePanel,
  tags: ['afframe'],
  parameters: {
    ...afframeA11y,
    layout: 'fullscreen',
    docs: { page: mdx, story: { inline: false, iframeHeight: 640 } },
  },
  argTypes: flowHarnessArgTypes,
  args: {
    open: true,
    title: 'Edit customer',
    description: 'Changes apply to new invoices.',
    onClose: () => undefined,
    onSubmit: (): void => undefined,
    initialName: exampleCustomer.name,
  },
  render: flowRender(EditSidePanel, 'edit-side-panel', 'Edit customer'),
} satisfies Meta<EditSidePanelProps & FlowHarnessArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

const stories = flowStories('Save', 14);

export const Default: Story = {};

export const WithError: Story = stories.WithError;

export const Dirty: Story = stories.Dirty;

export const Submitting: Story = stories.Submitting;

export const LongForm: Story = stories.LongForm;

export const FocusNotObscured: Story = stories.FocusNotObscured;

export const Dark: Story = {
  ...Default,
  tags: ['!dev', '!autodocs'],
  globals: { theme: 'dark' },
};
