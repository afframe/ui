import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { action } from 'storybook/actions';
import { expect } from 'storybook/test';
import { afframeA11y } from '../../../.storybook/afframeA11y.js';
import { Button } from '../../index.js';
import { LogoutBanner } from './LogoutBanner.js';
import type { LogoutBannerProps } from './LogoutBanner.js';
import mdx from './LogoutBanner.mdx';
import { CarbonShell, LabsShell } from './storyShells.js';

const meta = {
  title: 'Components/UI Shell/Afframe/Logout Banner',
  component: LogoutBanner,
  tags: ['afframe'],
  args: {
    variant: 'expiring',
    minutesLeft: 5,
    onStaySignedIn: action('onStaySignedIn'),
    onDismiss: action('onDismiss'),
  },
  render: (args) => (
    <CarbonShell>
      <LogoutBanner {...args} />
    </CarbonShell>
  ),
  parameters: {
    ...afframeA11y,
    layout: 'fullscreen',
    docs: { page: mdx, story: { inline: false, height: '12rem' } },
  },
} satisfies Meta<typeof LogoutBanner>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

// The app owns the clock: the button stands in for a timer that lowers
// `minutesLeft` once a minute.
function Countdown(props: LogoutBannerProps) {
  const [minutes, setMinutes] = useState(2);
  return (
    <CarbonShell>
      <LogoutBanner {...props} variant="expiring" minutesLeft={minutes} />
      <Button size="sm" kind="tertiary" onClick={() => setMinutes(1)}>
        One minute passes
      </Button>
    </CarbonShell>
  );
}

export const Expiring: Story = {
  render: (args) => <Countdown {...args} />,
  play: async ({ canvas, userEvent }) => {
    const banner = canvas.getByRole('status');
    await expect(banner).toHaveTextContent('Your session ends in 2 minutes.');
    await userEvent.click(
      canvas.getByRole('button', { name: 'One minute passes' })
    );
    await expect(banner).toHaveTextContent('Your session ends in 1 minute.');
  },
};

export const SignedOut: Story = {
  render: () => (
    <CarbonShell>
      <LogoutBanner variant="signed-out" onSignIn={action('onSignIn')} />
    </CarbonShell>
  ),
  play: async ({ canvas }) => {
    const banner = canvas.getByRole('alert');
    await expect(banner).toHaveTextContent('You have been signed out.');
    await expect(
      canvas.queryByRole('button', { name: 'Close' })
    ).not.toBeInTheDocument();
  },
};

export const InLabsShell: Story = {
  render: (args) => (
    <LabsShell>
      <LogoutBanner {...args} />
    </LabsShell>
  ),
};

export const Dark: Story = {
  globals: { theme: 'dark' },
};
