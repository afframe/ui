import type { Meta, StoryObj } from '@storybook/react-vite';
import { afframeA11y } from '../../../.storybook/afframeA11y.js';
import { TextInput } from '../../index.js';
import {
  exampleCustomer,
  flowHarnessArgTypes,
  flowRender,
  flowStories,
} from '../FlowParts/storyForm.js';
import type { FlowHarnessArgs } from '../FlowParts/storyForm.js';
import { EditTearsheet, EditTearsheetForm } from './EditTearsheet.js';
import type { EditTearsheetProps } from './EditTearsheet.js';
import mdx from './EditTearsheet.mdx';

// An array, not a fragment: EditTearsheet lists only direct form children.
const renderSheet = (invalidBilling: boolean) =>
  flowRender(EditTearsheet, 'edit-tearsheet', 'Edit customer', (fields) => [
    <EditTearsheetForm
      key="contact"
      id="edit-tearsheet-contact"
      title="Contact">
      {fields}
    </EditTearsheetForm>,
    <EditTearsheetForm
      key="billing"
      id="edit-tearsheet-billing"
      title="Billing"
      description="Used on every invoice for this customer."
      invalid={invalidBilling}>
      <TextInput
        id="edit-tearsheet-billing-email"
        labelText="Billing email"
        type="email"
        defaultValue={exampleCustomer.billingEmail}
      />
    </EditTearsheetForm>,
  ]);

const meta = {
  title: 'Components/Create and Edit/EditTearsheet',
  component: EditTearsheet,
  subcomponents: { EditTearsheetForm },
  tags: ['afframe'],
  parameters: {
    ...afframeA11y,
    layout: 'fullscreen',
    docs: { page: mdx, story: { inline: false, iframeHeight: 720 } },
  },
  argTypes: flowHarnessArgTypes,
  args: {
    open: true,
    label: 'Customer',
    title: exampleCustomer.name,
    description: 'Changes apply to new invoices.',
    onClose: () => undefined,
    onSubmit: (): void => undefined,
    initialName: exampleCustomer.name,
  },
  render: renderSheet(false),
} satisfies Meta<EditTearsheetProps & FlowHarnessArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

const stories = flowStories('Save', 14);

export const Default: Story = {};

export const WithError: Story = stories.WithError;

export const WithInvalidSection: Story = { render: renderSheet(true) };

export const Dirty: Story = stories.Dirty;

export const Submitting: Story = stories.Submitting;

export const LongForm: Story = stories.LongForm;

export const Dark: Story = {
  ...Default,
  tags: ['!dev', '!autodocs'],
  globals: { theme: 'dark' },
};
