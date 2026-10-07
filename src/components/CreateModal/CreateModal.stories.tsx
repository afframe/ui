import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { afframeA11y } from '../../../.storybook/afframeA11y.js';
import { Button } from '../../index.js';
import {
  clickPrimary,
  pendingSubmit,
  playDirty,
  playRejected,
  rejectSubmit,
  useCustomerForm,
} from '../CreateEditFlow/storyForm.js';
import { CreateModal } from './CreateModal.js';
import type { CreateModalProps } from './CreateModal.js';
import mdx from './CreateModal.mdx';

type HarnessProps = Pick<CreateModalProps, 'onSubmit'> & {
  initialName?: string;
};

// Opens on load; the launcher reopens it.
function Harness({ onSubmit, initialName }: HarnessProps) {
  const [open, setOpen] = useState(true);
  const form = useCustomerForm('create-modal', initialName);
  const launcherRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <Button ref={launcherRef} onClick={() => setOpen(true)}>
        New customer
      </Button>
      <CreateModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={onSubmit}
        launcherRef={launcherRef}
        title="New customer"
        description="The customer appears in the invoice form once created."
        isDirty={form.isDirty}
        submitDisabled={form.submitDisabled}>
        {form.fields}
      </CreateModal>
    </>
  );
}

const meta = {
  title: 'Components/Create and Edit/Create Modal',
  component: CreateModal,
  tags: ['afframe'],
  parameters: {
    ...afframeA11y,
    layout: 'padded',
    docs: { page: mdx, story: { inline: false, iframeHeight: 560 } },
  },
  args: {
    open: true,
    title: 'New customer',
    onClose: () => undefined,
    onSubmit: () => undefined,
  },
} satisfies Meta<typeof CreateModal>;

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

export const Dark: Story = {
  ...Default,
  globals: { theme: 'dark' },
};
