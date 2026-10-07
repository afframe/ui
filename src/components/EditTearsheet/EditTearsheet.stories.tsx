import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { afframeA11y } from '../../../.storybook/afframeA11y.js';
import { Button, TextInput } from '../../index.js';
import {
  clickPrimary,
  pendingSubmit,
  playDirty,
  playFocusNotObscured,
  playRejected,
  rejectSubmit,
  useCustomerForm,
} from '../CreateEditFlow/storyForm.js';
import { EditTearsheet, EditTearsheetForm } from './EditTearsheet.js';
import type { EditTearsheetProps } from './EditTearsheet.js';
import mdx from './EditTearsheet.mdx';

type HarnessProps = Pick<EditTearsheetProps, 'onSubmit'> & {
  invalidBilling?: boolean;
  extraFields?: number;
};

// Opens on load; the launcher reopens it.
function Harness({
  onSubmit,
  invalidBilling = false,
  extraFields,
}: HarnessProps) {
  const [open, setOpen] = useState(true);
  const form = useCustomerForm('edit-tearsheet', 'Acme Trading', extraFields);
  const launcherRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <Button ref={launcherRef} onClick={() => setOpen(true)}>
        Edit customer
      </Button>
      <EditTearsheet
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={onSubmit}
        launcherRef={launcherRef}
        label="Customer"
        title="Acme Trading"
        description="Changes apply to new invoices."
        isDirty={form.isDirty}
        submitDisabled={form.submitDisabled}>
        <EditTearsheetForm id="edit-tearsheet-contact" title="Contact">
          {form.fields}
        </EditTearsheetForm>
        <EditTearsheetForm
          id="edit-tearsheet-billing"
          title="Billing"
          description="Used on every invoice for this customer."
          invalid={invalidBilling}>
          <TextInput
            id="edit-tearsheet-vat"
            labelText="VAT number"
            defaultValue="CZ12345678"
          />
        </EditTearsheetForm>
      </EditTearsheet>
    </>
  );
}

const meta = {
  title: 'Components/Create and Edit/Edit Tearsheet',
  component: EditTearsheet,
  subcomponents: { EditTearsheetForm },
  tags: ['afframe'],
  parameters: {
    ...afframeA11y,
    layout: 'fullscreen',
    docs: { page: mdx, story: { inline: false, iframeHeight: 720 } },
  },
  args: {
    open: true,
    title: 'Acme Trading',
    onClose: () => undefined,
    onSubmit: () => undefined,
  },
} satisfies Meta<typeof EditTearsheet>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Harness onSubmit={() => undefined} />,
};

export const WithValidationError: Story = {
  render: () => <Harness onSubmit={rejectSubmit} />,
  play: playRejected('Save'),
};

export const WithInvalidSection: Story = {
  render: () => <Harness invalidBilling onSubmit={() => undefined} />,
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
