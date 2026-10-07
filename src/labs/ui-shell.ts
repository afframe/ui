'use client';
// @carbon-labs/react-ui-shell exports; see the Labs note in src/index.ts.
import { Profile as ProfileValue } from '@carbon-labs/react-ui-shell';
import type * as ProfileType from '@carbon-labs/react-ui-shell/es/components/Profile.js';

export {
  SideNav as SideNavLabs,
  SIDE_NAV_TYPE,
} from '@carbon-labs/react-ui-shell/es/components/SideNav.js';
export { SideNavItems as SideNavItemsLabs } from '@carbon-labs/react-ui-shell/es/components/SideNavItems.js';
export { SideNavLink as SideNavLinkLabs } from '@carbon-labs/react-ui-shell/es/components/SideNavLink.js';
export { SideNavLinkPopover } from '@carbon-labs/react-ui-shell/es/components/SideNavLinkPopover.js';
export { SideNavMenu as SideNavMenuLabs } from '@carbon-labs/react-ui-shell/es/components/SideNavMenu.js';
export { SideNavMenuItem as SideNavMenuItemLabs } from '@carbon-labs/react-ui-shell/es/components/SideNavMenuItem.js';
export { SideNavSlot } from '@carbon-labs/react-ui-shell/es/components/SideNavSlot.js';
export { SideNavTitle } from '@carbon-labs/react-ui-shell/es/components/SideNavTitle.js';
export { HeaderContainer as HeaderContainerLabs } from '@carbon-labs/react-ui-shell/es/components/HeaderContainer.js';
export { HeaderDivider } from '@carbon-labs/react-ui-shell/es/components/HeaderDivider.js';
export { HeaderOverflowPanel } from '@carbon-labs/react-ui-shell/es/components/HeaderOverflowPanel.js';
export {
  HeaderPopover,
  HeaderPopoverActions,
  HeaderPopoverButton,
  HeaderPopoverContent,
} from '@carbon-labs/react-ui-shell/es/components/HeaderPopover.js';
export { SharkFinIcon } from '@carbon-labs/react-ui-shell/es/components/SharkFinIcon.js';
export { TrialCountdown } from '@carbon-labs/react-ui-shell/es/components/TrialCountdown.js';
// A namespace: render <Profile.Root> and its parts. A bundler builds its own
// namespace object per import path, so the value comes from the package entry.
export const Profile: typeof ProfileType = ProfileValue;
