import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { expect, waitFor } from 'storybook/test';
import { afframeA11y } from '../../../.storybook/afframeA11y.js';
import { Button } from '../../index.js';
import { ExportModal } from './ExportModal.js';
import type { ExportModalProps } from './ExportModal.js';
import mdx from './ExportModal.mdx';

// Opens on first render; the launcher button reopens it.
function Harness(props: ExportModalProps) {
  const [open, setOpen] = useState(props.open);
  const launcherRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <Button ref={launcherRef} onClick={() => setOpen(true)}>
        Export invoices
      </Button>
      <ExportModal
        {...props}
        open={open}
        launcherRef={launcherRef}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

const meta = {
  title: 'Components/Modals/Export Modal',
  component: ExportModal,
  tags: ['afframe'],
  args: {
    open: true,
    onClose: () => undefined,
    filename: 'invoices-2026',
    formats: [
      { extension: 'csv', description: 'Spreadsheet' },
      { extension: 'xlsx', description: 'Excel workbook' },
      { extension: 'pdf', description: 'PDF document' },
    ],
    onExport: () => Promise.resolve(),
    closeOnSuccess: false,
  },
  render: (args) => <Harness {...args} />,
  parameters: {
    ...afframeA11y,
    docs: { page: mdx, story: { inline: false, height: '36rem' } },
  },
} satisfies Meta<typeof ExportModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    const name = await canvas.findByRole('textbox', { name: 'File name' });
    await waitFor(() => expect(name).toHaveFocus());
  },
};

export const WithPassword: Story = {
  args: { password: { required: true } },
  play: async ({ canvas, userEvent }) => {
    const name = await canvas.findByRole('textbox', { name: 'File name' });
    await waitFor(() => expect(name).toHaveFocus());
    await userEvent.type(
      canvas.getByLabelText('Password', { selector: 'input' }),
      'correct horse'
    );
    await expect(canvas.getByRole('button', { name: 'Export' })).toBeEnabled();
  },
};

export const Success: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      await canvas.findByRole('button', { name: 'Export' })
    );
    await expect(
      await canvas.findByText('invoices-2026.csv was exported.')
    ).toBeInTheDocument();
  },
};

export const Pending: Story = {
  args: { onExport: () => new Promise<void>(() => undefined) },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      await canvas.findByRole('button', { name: 'Export' })
    );
    await expect(canvas.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  },
};

export const Dark: Story = {
  ...Default,
  globals: { theme: 'dark' },
};
