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
import { CreateSidePanel } from './CreateSidePanel.js';
import type { CreateSidePanelProps } from './CreateSidePanel.js';
import mdx from './CreateSidePanel.mdx';

type HarnessProps = Pick<CreateSidePanelProps, 'onSubmit'> & {
  initialName?: string;
  extraFields?: number;
};

// Opens on load; the launcher reopens it.
function Harness({ onSubmit, initialName, extraFields }: HarnessProps) {
  const [open, setOpen] = useState(true);
  const form = useCustomerForm('create-side-panel', initialName, extraFields);
  const launcherRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <Button ref={launcherRef} onClick={() => setOpen(true)}>
        New customer
      </Button>
      <CreateSidePanel
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={onSubmit}
        launcherRef={launcherRef}
        title="New customer"
        subtitle="Customers appear in the invoice form once created."
        formTitle="Contact"
        formDescription="Billing contact for this customer."
        isDirty={form.isDirty}
        submitDisabled={form.submitDisabled}>
        {form.fields}
      </CreateSidePanel>
    </>
  );
}

const meta = {
  title: 'Components/Create and Edit/Create Side Panel',
  component: CreateSidePanel,
  tags: ['afframe'],
  parameters: {
    ...afframeA11y,
    layout: 'fullscreen',
    docs: { page: mdx, story: { inline: false, iframeHeight: 640 } },
  },
  args: {
    open: true,
    title: 'New customer',
    formTitle: 'Contact',
    onClose: () => undefined,
    onSubmit: () => undefined,
  },
} satisfies Meta<typeof CreateSidePanel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Harness onSubmit={() => undefined} />,
};

export const WithValidationError: Story = {
  render: () => <Harness initialName="Acme Trading" onSubmit={rejectSubmit} />,
  play: playRejected('Create'),
};

export const Dirty: Story = {
  render: () => <Harness initialName="Acme" onSubmit={() => undefined} />,
  play: playDirty,
};

export const Submitting: Story = {
  render: () => <Harness initialName="Acme Trading" onSubmit={pendingSubmit} />,
  play: clickPrimary('Create'),
};

export const LongForm: Story = {
  render: () => <Harness extraFields={14} onSubmit={() => undefined} />,
  play: playFocusNotObscured('Note 14'),
};

export const Dark: Story = {
  ...Default,
  globals: { theme: 'dark' },
};
