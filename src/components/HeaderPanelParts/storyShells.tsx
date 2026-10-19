// Story scaffolds for the four header gap components (EnvironmentSwitcher,
// HelpMenu, LogoutTile, LogoutBanner): a Carbon header and the Labs shell.
// Stories only; not exported from the package.
import { useState } from 'react';
import type { ComponentProps, ComponentType, ReactNode } from 'react';
import { UserAvatar } from '../../icons.js';
import {
  Content,
  Header,
  HeaderGlobalBar,
  HeaderName,
  Profile,
} from '../../index.js';

// Profile.Root passes other props on to HeaderPopover; its types do not declare
// open and onClick.
const ProfileRoot = Profile.Root as ComponentType<
  ComponentProps<typeof Profile.Root> & { open?: boolean; onClick?: () => void }
>;

interface ShellProps {
  /** Header actions, right-aligned in the global bar. */
  actions?: ReactNode;
  /** Page content under the header. */
  children?: ReactNode;
}

export function CarbonShell({ actions, children }: ShellProps) {
  return (
    <>
      <Header aria-label="Afframe">
        <HeaderName href="#" prefix="Afframe">
          Ledger
        </HeaderName>
        <HeaderGlobalBar>{actions}</HeaderGlobalBar>
      </Header>
      <Content>{children}</Content>
    </>
  );
}

interface LabsShellProps extends ShellProps {
  /** Content of the Labs Profile popover (for example a LogoutTile). */
  profile?: ReactNode;
  /** Opens the Profile popover on first render. */
  profileOpen?: boolean;
}

// Labs shell header: Carbon Header with the Labs Profile popover. The Labs
// HeaderContainer is left out: on mount it focuses the theme switcher inside
// the profile (and throws when there is none), which would move focus away
// from the component under test.
export function LabsShell({
  actions,
  profile,
  profileOpen: initialProfileOpen = false,
  children,
}: LabsShellProps) {
  const [profileOpen, setProfileOpen] = useState(initialProfileOpen);
  return (
    <>
      <Header aria-label="Afframe">
        <HeaderName href="#" prefix="Afframe">
          Ledger
        </HeaderName>
        <HeaderGlobalBar>
          {actions}
          <ProfileRoot
            open={profileOpen}
            onClick={() => setProfileOpen((open) => !open)}
            label="Profile"
            renderIcon={<UserAvatar size={20} />}>
            <Profile.UserInfo name="Sample User" email="user@example.com" />
            {profile}
          </ProfileRoot>
        </HeaderGlobalBar>
      </Header>
      <Content>{children}</Content>
    </>
  );
}
