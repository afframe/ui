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
import { EditSidePanel } from './EditSidePanel.js';
import type { EditSidePanelProps } from './EditSidePanel.js';
import mdx from './EditSidePanel.mdx';

type HarnessProps = Pick<EditSidePanelProps, 'onSubmit'> & {
  initialName?: string;
  extraFields?: number;
};

// Opens on load; the launcher reopens it.
function Harness({
  onSubmit,
  initialName = 'Acme Trading',
  extraFields,
}: HarnessProps) {
  const [open, setOpen] = useState(true);
  const form = useCustomerForm('edit-side-panel', initialName, extraFields);
  const launcherRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <Button ref={launcherRef} onClick={() => setOpen(true)}>
        Edit customer
      </Button>
      <EditSidePanel
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={onSubmit}
        launcherRef={launcherRef}
        title="Edit customer"
        subtitle="Changes apply to new invoices."
        formTitle="Contact"
        formDescription="Billing contact for this customer."
        isDirty={form.isDirty}
        submitDisabled={form.submitDisabled}>
        {form.fields}
      </EditSidePanel>
    </>
  );
}

const meta = {
  title: 'Components/Create and Edit/Edit Side Panel',
  component: EditSidePanel,
  tags: ['afframe'],
  parameters: {
    ...afframeA11y,
    layout: 'fullscreen',
    docs: { page: mdx, story: { inline: false, iframeHeight: 640 } },
  },
  args: {
    open: true,
    title: 'Edit customer',
    formTitle: 'Contact',
    onClose: () => undefined,
    onSubmit: () => undefined,
  },
} satisfies Meta<typeof EditSidePanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Harness onSubmit={() => undefined} />,
};

export const WithValidationError: Story = {
  render: () => <Harness onSubmit={rejectSubmit} />,
  play: playRejected('Save'),
};

export const Dirty: Story = {
  render: () => <Harness onSubmit={() => undefined} />,
  play: playDirty,
};

export const Submitting: Story = {
  render: () => <Harness onSubmit={pendingSubmit} />,
  play: clickPrimary('Save'),
};

export const LongForm: Story = {
  render: () => <Harness extraFields={14} onSubmit={() => undefined} />,
  play: playFocusNotObscured('Note 14'),
};

export const Dark: Story = {
  ...Default,
  globals: { theme: 'dark' },
};
