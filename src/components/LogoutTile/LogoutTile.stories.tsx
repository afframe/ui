import type { Meta, StoryObj } from '@storybook/react-vite';
import { useId } from 'react';
import { action } from 'storybook/actions';
import { expect, waitFor } from 'storybook/test';
import { afframeA11y } from '../../../.storybook/afframeA11y.js';
import { UserAvatar } from '../../icons.js';
import { HeaderGlobalAction, HeaderPanel } from '../../index.js';
import { CarbonShell, LabsShell } from '../LogoutBanner/storyShells.js';
import { LogoutTile } from './LogoutTile.js';
import type { LogoutTileProps } from './LogoutTile.js';
import mdx from './LogoutTile.mdx';

// A Carbon header with the profile panel open, holding the tile.
function InCarbonHeader(props: LogoutTileProps) {
  const panelId = useId();
  return (
    <CarbonShell
      actions={
        <>
          <HeaderGlobalAction
            aria-label="Profile"
            isActive
            {...{ 'aria-expanded': true, 'aria-controls': panelId }}>
            <UserAvatar size={20} />
          </HeaderGlobalAction>
          <HeaderPanel {...{ id: panelId }} expanded addFocusListeners={false}>
            <LogoutTile {...props} />
          </HeaderPanel>
        </>
      }
    />
  );
}

const meta = {
  title: 'Components/UI Shell/Afframe/Logout Tile',
  component: LogoutTile,
  tags: ['afframe'],
  args: {
    userName: 'Sample User',
    userEmail: 'user@example.com',
    onLogout: action('onLogout'),
  },
  render: (args) => <InCarbonHeader {...args} />,
  parameters: {
    ...afframeA11y,
    layout: 'fullscreen',
    docs: { page: mdx, story: { inline: false, height: '16rem' } },
  },
} satisfies Meta<typeof LogoutTile>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: { loading: true },
  play: async ({ canvas }) => {
    const button = canvas.getByRole('button', { name: /Logging out/ });
    await expect(button).toBeDisabled();
    await expect(button.closest('[aria-busy="true"]')).not.toBeNull();
  },
};

export const AsLink: Story = {
  render: ({ userName, userEmail }) => (
    <InCarbonHeader
      href="#signed-out"
      {...(userName === undefined ? {} : { userName })}
      {...(userEmail === undefined ? {} : { userEmail })}
    />
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Log out' })).toHaveAttribute(
      'href',
      '#signed-out'
    );
  },
};

// Inside the Labs Profile popover, after the Labs user info.
export const InLabsShell: Story = {
  render: (args) => (
    <LabsShell
      profileOpen
      profile={<LogoutTile {...(args as LogoutTileProps)} />}
    />
  ),
  play: async ({ canvas }) => {
    await waitFor(() =>
      expect(canvas.getByRole('button', { name: 'Log out' })).toBeVisible()
    );
  },
};

export const Dark: Story = {
  globals: { theme: 'dark' },
};
