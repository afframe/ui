import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { expect, waitFor } from 'storybook/test';
import { afframeA11y } from '../../../.storybook/afframeA11y.js';
import { Button } from '../../index.js';
import { ImportModal } from './ImportModal.js';
import type { ImportModalProps } from './ImportModal.js';
import mdx from './ImportModal.mdx';

// Opens on first render; the launcher button reopens it.
function Harness(props: ImportModalProps) {
  const [open, setOpen] = useState(props.open);
  const launcherRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <Button ref={launcherRef} onClick={() => setOpen(true)}>
        Import invoices
      </Button>
      <ImportModal
        {...props}
        open={open}
        launcherRef={launcherRef}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

const fileInput = (root: HTMLElement) => {
  const input = root.querySelector<HTMLInputElement>('input[type=file]');
  if (!input) throw new Error('no file input');
  return input;
};

const meta = {
  title: 'Components/Modals/Import Modal',
  component: ImportModal,
  tags: ['afframe'],
  args: {
    open: true,
    onClose: () => undefined,
    onImport: () => Promise.resolve(),
    title: 'Import invoices',
    accept: ['.csv', '.xlsx'],
    maxFileSize: 5_000_000,
    locale: 'en-GB',
  },
  render: (args) => <Harness {...args} />,
  parameters: {
    ...afframeA11y,
    docs: { page: mdx, story: { inline: false, height: '36rem' } },
  },
} satisfies Meta<typeof ImportModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    const drop = await canvas.findByRole('button', {
      name: 'Drag and drop a file here or click to browse',
    });
    await waitFor(() => expect(drop).toHaveFocus());
  },
};

export const WithErrors: Story = {
  args: { multiple: true },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await canvas.findByRole('dialog');
    await userEvent.upload(fileInput(canvasElement), [
      new File(['a;b'], 'invoices-2026.csv', { type: 'text/csv' }),
      new File(['x'], 'scan.pdf', { type: 'application/pdf' }),
      new File(['x'.repeat(6_000_000)], 'archive.xlsx'),
    ]);
    const error = await canvas.findByText(
      'scan.pdf is not an accepted file type. Use .csv, .xlsx.'
    );
    await waitFor(() => expect(error).toBeVisible());
    await expect(canvas.getByRole('button', { name: 'Import' })).toBeDisabled();
  },
};

export const WithUrl: Story = {
  args: { onImportUrl: () => Promise.resolve() },
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(
      await canvas.findByRole('textbox', { name: 'Or import from a URL' }),
      'https://example.com/invoices.csv'
    );
    await expect(canvas.getByRole('button', { name: 'Import' })).toBeEnabled();
  },
};

export const Pending: Story = {
  args: { onImport: () => new Promise<void>(() => undefined) },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await canvas.findByRole('dialog');
    await userEvent.upload(
      fileInput(canvasElement),
      new File(['a;b'], 'invoices-2026.csv', { type: 'text/csv' })
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Import' }));
    await expect(canvas.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  },
};

export const Dark: Story = {
  ...Default,
  globals: { theme: 'dark' },
};
