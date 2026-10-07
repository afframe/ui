import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { expect, waitFor } from 'storybook/test';
import { afframeA11y } from '../../../.storybook/afframeA11y.js';
import { Button } from '../../index.js';
import { RemoveModal } from './RemoveModal.js';
import type { RemoveModalProps } from './RemoveModal.js';
import mdx from './RemoveModal.mdx';

// Opens on first render; the launcher button reopens it.
function Harness(props: RemoveModalProps) {
  const [open, setOpen] = useState(props.open);
  const launcherRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <Button ref={launcherRef} kind="danger" onClick={() => setOpen(true)}>
        Delete invoice
      </Button>
      <RemoveModal
        {...props}
        open={open}
        launcherRef={launcherRef}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

const meta = {
  title: 'Components/Modals/Remove Modal',
  component: RemoveModal,
  tags: ['afframe'],
  args: {
    open: true,
    onClose: () => undefined,
    resourceName: 'Invoice 2026-001',
    onConfirm: () => Promise.resolve(),
  },
  render: (args) => <Harness {...args} />,
  parameters: {
    ...afframeA11y,
    docs: { page: mdx, story: { inline: false, height: '28rem' } },
  },
} satisfies Meta<typeof RemoveModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    const cancel = await canvas.findByRole('button', { name: 'Cancel' });
    await waitFor(() => expect(cancel).toHaveFocus());
  },
};

export const WithTypedConfirmation: Story = {
  args: { confirmByTyping: true, kind: 'remove', label: 'Customers' },
  play: async ({ canvas, userEvent }) => {
    const input = await canvas.findByRole('textbox', {
      name: 'Type Invoice 2026-001 to confirm',
    });
    await waitFor(() => expect(input).toHaveFocus());
    await userEvent.type(input, 'Invoice 2026-001');
    await expect(
      canvas.getByRole('button', { name: 'Danger Remove' })
    ).toBeEnabled();
  },
};

export const Pending: Story = {
  args: { onConfirm: () => new Promise<void>(() => undefined) },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(
      await canvas.findByRole('button', { name: 'Danger Delete' })
    );
    await expect(
      await canvas.findByRole('button', { name: 'Cancel' })
    ).toBeDisabled();
  },
};

export const Dark: Story = {
  ...Default,
  globals: { theme: 'dark' },
};
