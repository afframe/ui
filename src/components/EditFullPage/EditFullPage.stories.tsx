import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { afframeA11y } from '../../../.storybook/afframeA11y.js';
import { Button } from '../../index.js';
import {
  exampleCustomer,
  flowHarnessArgTypes,
  flowStories,
  useCustomerForm,
} from '../FlowParts/storyForm.js';
import type { FlowHarnessArgs } from '../FlowParts/storyForm.js';
import { EditFullPage } from './EditFullPage.js';
import type { EditFullPageProps } from './EditFullPage.js';
import mdx from './EditFullPage.mdx';

type Args = EditFullPageProps & FlowHarnessArgs;

function EditForm({ initialName, extraFields, ...props }: Args) {
  const form = useCustomerForm('edit-full-page', initialName, extraFields);
  return (
    <EditFullPage
      {...props}
      isDirty={form.isDirty}
      submitDisabled={form.submitDisabled}>
      {form.fields}
    </EditFullPage>
  );
}

// Owns the edit mode and the demo form; the rest comes from the args.
// Starts in edit mode; Edit returns to it after leaving.
function Harness(props: Args) {
  const [editing, setEditing] = useState(true);
  const launcherRef = useRef<HTMLButtonElement>(null);
  return editing ? (
    <EditForm
      {...props}
      onClose={() => setEditing(false)}
      launcherRef={launcherRef}
    />
  ) : (
    <Button ref={launcherRef} onClick={() => setEditing(true)}>
      Edit
    </Button>
  );
}

const meta = {
  title: 'Components/Create and Edit/EditFullPage',
  component: EditFullPage,
  tags: ['afframe'],
  parameters: {
    ...afframeA11y,
    layout: 'fullscreen',
    // In an iframe, so 100dvh is the canvas height, not the docs page's.
    docs: { page: mdx, story: { inline: false, iframeHeight: 480 } },
  },
  argTypes: flowHarnessArgTypes,
  args: {
    title: exampleCustomer.name,
    description: 'Changes apply to new invoices.',
    onClose: () => undefined,
    onSubmit: (): void => undefined,
    initialName: exampleCustomer.name,
  },
  // The app's main area: a region of definite height the page fills.
  decorators: [
    (Story) => (
      <div style={{ blockSize: '100dvh' }}>
        <Story />
      </div>
    ),
  ],
  render: (args) => <Harness {...args} />,
} satisfies Meta<Args>;

export default meta;

type Story = StoryObj<typeof meta>;

const stories = flowStories('Save', 20);

export const Default: Story = {};

export const Dirty: Story = stories.Dirty;

export const WithError: Story = stories.WithError;

export const Submitting: Story = stories.Submitting;

export const LongForm: Story = stories.LongForm;

export const FocusNotObscured: Story = stories.FocusNotObscured;

export const Dark: Story = {
  ...Default,
  tags: ['!dev', '!autodocs'],
  globals: { theme: 'dark' },
};
