import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { afframeA11y } from '../../../.storybook/afframeA11y.js';
import { Button } from '../../index.js';
import {
  clickPrimary,
  pendingSubmit,
  playDirty,
  playFocusNotObscured,
  playRejected,
  rejectSubmit,
  useCustomerForm,
} from '../CreateEditFlow/storyForm.js';
import { EditFullPage } from './EditFullPage.js';
import type { EditFullPageProps } from './EditFullPage.js';
import mdx from './EditFullPage.mdx';

type HarnessProps = Pick<EditFullPageProps, 'onSubmit'> & {
  extraFields?: number;
};

function EditForm({
  onSubmit,
  extraFields,
  onClose,
  launcherRef,
}: HarnessProps & {
  onClose: () => void;
  launcherRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const form = useCustomerForm('edit-full-page', 'Acme Trading', extraFields);
  return (
    <EditFullPage
      title="Acme Trading"
      description="Changes apply to new invoices."
      onClose={onClose}
      onSubmit={onSubmit}
      launcherRef={launcherRef}
      isDirty={form.isDirty}
      submitDisabled={form.submitDisabled}>
      {form.fields}
    </EditFullPage>
  );
}

// Starts in edit mode; Edit returns to it after leaving.
function Harness(props: HarnessProps) {
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
  title: 'Components/Create and Edit/Edit Full Page',
  component: EditFullPage,
  tags: ['afframe'],
  parameters: {
    ...afframeA11y,
    layout: 'fullscreen',
    docs: { page: mdx },
  },
  args: {
    title: 'Acme Trading',
    onClose: () => undefined,
    onSubmit: () => undefined,
  },
} satisfies Meta<typeof EditFullPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Harness onSubmit={() => undefined} />,
};

export const Dirty: Story = {
  render: () => <Harness onSubmit={() => undefined} />,
  play: playDirty,
};

export const WithValidationError: Story = {
  render: () => <Harness onSubmit={rejectSubmit} />,
  play: playRejected('Save'),
};

export const Submitting: Story = {
  render: () => <Harness onSubmit={pendingSubmit} />,
  play: clickPrimary('Save'),
};

export const LongForm: Story = {
  render: () => <Harness extraFields={20} onSubmit={() => undefined} />,
  play: playFocusNotObscured('Note 20'),
};

export const Dark: Story = {
  ...Default,
  globals: { theme: 'dark' },
};
