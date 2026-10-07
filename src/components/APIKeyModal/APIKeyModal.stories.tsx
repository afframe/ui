import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { expect, waitFor } from 'storybook/test';
import { afframeA11y } from '../../../.storybook/afframeA11y.js';
import { Button } from '../../index.js';
import { APIKeyModal } from './APIKeyModal.js';
import type { APIKeyModalProps } from './APIKeyModal.js';
import mdx from './APIKeyModal.mdx';

// Opens on first render; the launcher button reopens it.
function Harness(props: APIKeyModalProps) {
  const [open, setOpen] = useState(props.open);
  const launcherRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <Button ref={launcherRef} onClick={() => setOpen(true)}>
        Create API key
      </Button>
      <APIKeyModal
        {...props}
        open={open}
        launcherRef={launcherRef}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

const meta = {
  title: 'Components/Modals/API Key Modal',
  component: APIKeyModal,
  tags: ['afframe'],
  args: {
    open: true,
    onClose: () => undefined,
    // Fixed demo value, not a real key.
    onGenerate: () => Promise.resolve('demo_key_0123456789abcdef'),
    showDownload: true,
  },
  render: (args) => <Harness {...args} />,
  parameters: {
    ...afframeA11y,
    docs: { page: mdx, story: { inline: false, height: '30rem' } },
  },
} satisfies Meta<typeof APIKeyModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas }) => {
    const name = await canvas.findByRole('textbox', { name: 'Name' });
    await waitFor(() => expect(name).toHaveFocus());
  },
};

export const GenerateSuccess: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(
      await canvas.findByRole('textbox', { name: 'Name' }),
      'CI pipeline'
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Generate' }));
    const key = await canvas.findByLabelText('API key', { selector: 'input' });
    await waitFor(() => expect(key).toHaveFocus());
  },
};

export const WithSteps: Story = {
  args: {
    steps: [
      {
        title: 'Access',
        content: <p>The key can read invoices and customers.</p>,
      },
    ],
  },
};

export const Edit: Story = {
  args: { mode: 'edit', apiKeyName: 'CI pipeline', onSave: () => undefined },
};

export const Pending: Story = {
  args: { onGenerate: () => new Promise<string>(() => undefined) },
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(
      await canvas.findByRole('textbox', { name: 'Name' }),
      'CI pipeline'
    );
    await userEvent.click(canvas.getByRole('button', { name: 'Generate' }));
    await expect(canvas.getByRole('button', { name: 'Cancel' })).toBeDisabled();
  },
};

export const Dark: Story = {
  ...Default,
  globals: { theme: 'dark' },
};
