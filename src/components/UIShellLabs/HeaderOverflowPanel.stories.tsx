/**
 * Copyright IBM Corp. 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2025
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, Labs UI shell and theme settings components from @afframe/ui (the clashing Labs ones under their Labs names: SideNavLabs, HeaderContainerLabs and the rest of the Labs side nav set), Carbon components and icons from @afframe/ui (styles ship in the package CSS, so the ui-shell.scss import is dropped), story styles converted from SCSS to plain CSS, the internal useMatchMedia hook as a local copy, the @carbon/layout md breakpoint as its 42rem value, isFixedNav dropped from Carbon's HeaderMenuButton (not a prop there; it reached the button element), sample user name, email and instance name replaced with neutral placeholders, title under Components/UI Shell/Labs, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import {
  useEffect,
  useState,
  type ComponentProps,
  type ComponentType,
} from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import {
  ChartCustom,
  Group,
  Help,
  IbmCloudKeyProtect,
  Launch,
  Logout,
  Money,
  Notification,
  Settings,
  Switcher as SwitcherIcon,
  User,
  UserAvatar,
} from '../../icons.js';
import {
  ContainedList,
  ContainedListItem,
  ExpandableSearch,
  Header,
  HeaderContainerLabs,
  HeaderGlobalBar,
  HeaderMenuButton,
  HeaderName,
  HeaderOverflowPanel,
  Profile,
  SideNavDivider,
  SideNavItemsLabs,
  SideNavLabs,
  SideNavLinkLabs,
  SideNavMenuLabs,
  SkipToContent,
  Theme,
  ThemeSettings,
  ThemeSwitcher as ThemeSwitcherBase,
} from '../../index.js';
import mdx from './HeaderOverflowPanel.mdx';
import { useMatchMedia } from './useMatchMedia.js';
import './ui-shell-story.css';

// ThemeSwitcher passes other props on to Carbon's ContentSwitcher; its types do
// not declare the ones these stories use.
const ThemeSwitcher = ThemeSwitcherBase as ComponentType<
  ComponentProps<typeof ThemeSwitcherBase> & {
    lowContrast?: boolean;
    size?: string;
  }
>;

// Profile.Root passes other props on to HeaderPopover; its types do not declare
// open and onClick.
const ProfileRoot = Profile.Root as ComponentType<
  ComponentProps<typeof Profile.Root> & { open?: boolean; onClick?: () => void }
>;

type ThemeSetting = NonNullable<ComponentProps<typeof ThemeSwitcher>['value']>;
type CarbonTheme = 'white' | 'g10' | 'g90' | 'g100';

const smMediaQuery = '(max-width: 42rem)';

interface HeaderRenderProps {
  isSideNavExpanded: boolean;
  onClickSideNavExpand: () => void;
  isProfileExpanded: boolean;
  onClickProfileExpand: () => void;
}

export default {
  title: 'Components/UI Shell/Labs/HeaderOverflowPanel',
  component: HeaderOverflowPanel,
  tags: ['labs'],
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof HeaderOverflowPanel>;

const readOnlyItems = [
  { label: 'Instance', title: 'example-instance-dev' },
  { label: 'Instance owner', title: 'user@example.com' },
  { label: 'Region', title: 'us-east-1 (N Virginia)' },
];

/**
 *
 */
function useThemeSettings() {
  const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');

  const [themeSetting, setThemeSetting] = useState<ThemeSetting>('system');
  const [themeMenuComplement] = useState(false);
  const [themeSet] = useState('white/g100');
  const [systemDark, setSystemDark] = useState(mediaQueryList.matches);
  const [currentTheme, setCurrentTheme] = useState<CarbonTheme>('white');
  const [themeHeader, setThemeHeader] = useState<CarbonTheme>('g100');

  useEffect(() => {
    /**
     *
     * @param {MediaQueryListEvent} event - The media query change event object.
     */
    const handleMediaQueryEvent = (event: MediaQueryListEvent) => {
      setSystemDark(event.matches);
    };

    mediaQueryList.addEventListener('change', handleMediaQueryEvent);
    return () =>
      mediaQueryList.removeEventListener('change', handleMediaQueryEvent);
  }, [mediaQueryList]);

  useEffect(() => {
    const [lightTheme, darkTheme] = themeSet.split('/') as [
      CarbonTheme,
      CarbonTheme,
    ];

    if (themeSetting === 'system') {
      setCurrentTheme(systemDark ? darkTheme : lightTheme);
      setThemeHeader(
        (systemDark && !themeMenuComplement) ||
          (!systemDark && themeMenuComplement)
          ? darkTheme
          : lightTheme
      );
    } else if (themeSetting === 'light') {
      setCurrentTheme(lightTheme);
      setThemeHeader(themeMenuComplement ? darkTheme : lightTheme);
    } else {
      setCurrentTheme(darkTheme);
      setThemeHeader(themeMenuComplement ? lightTheme : darkTheme);
    }
  }, [systemDark, themeSetting, themeMenuComplement, themeSet]);

  return {
    themeSetting,
    setThemeSetting,
    themeHeader,
    currentTheme,
  };
}

/**
 * Story for UIShell
 * @returns {React.ReactElement} The JSX for the story
 */
export const Default: StoryFn<typeof HeaderOverflowPanel> = () => {
  const { themeSetting, setThemeSetting, themeHeader } = useThemeSettings();

  const isSm = useMatchMedia(smMediaQuery);

  return (
    <Theme theme={themeHeader}>
      <HeaderContainerLabs
        themeSetting={themeSetting}
        render={({
          isSideNavExpanded,
          onClickSideNavExpand,
          isProfileExpanded,
          onClickProfileExpand,
        }: HeaderRenderProps) => (
          <Header aria-label="IBM Platform Name">
            <SkipToContent />
            <HeaderMenuButton
              aria-label={isSideNavExpanded ? 'Close menu' : 'Open menu'}
              onClick={onClickSideNavExpand}
              isActive={isSideNavExpanded}
              aria-expanded={isSideNavExpanded}
              isCollapsible //shows menu at desktop
              renderMenuIcon={<SwitcherIcon size={20} />}
            />
            <HeaderName href="#" prefix="IBM">
              [Platform]
            </HeaderName>

            <HeaderGlobalBar>
              <ExpandableSearch
                size="lg"
                labelText="Search"
                closeButtonLabelText="Clear search input"
                id="search-expandable-1"
              />
              <HeaderOverflowPanel label="Options">
                <SideNavLabs
                  isTreeview
                  isFixedNav
                  expanded
                  isChildOfHeader={false}
                  aria-label="Header navigation"
                  headerOverflowPanel>
                  <SideNavItemsLabs>
                    {isSm && (
                      <SideNavMenuLabs
                        renderIcon={UserAvatar}
                        title="Profile"
                        primary
                        backButtonTitle="Back">
                        <Profile.UserInfo
                          name="Sample User"
                          email="user@example.com"
                        />
                        <ThemeSettings legendText="Theme">
                          <ThemeSwitcher
                            lowContrast
                            size="sm"
                            value={themeSetting}
                            onChange={setThemeSetting}
                          />
                        </ThemeSettings>
                        <Profile.ReadOnly items={readOnlyItems} />
                        <ContainedList label="Profile links">
                          <ContainedListItem
                            renderIcon={User}
                            onClick={() =>
                              (window.location.href = 'https://example.com')
                            }>
                            User profile
                          </ContainedListItem>
                          <ContainedListItem
                            renderIcon={IbmCloudKeyProtect}
                            onClick={() =>
                              (window.location.href = 'https://example.com')
                            }>
                            Access keys
                          </ContainedListItem>
                          <ContainedListItem
                            renderIcon={Group}
                            onClick={() =>
                              (window.location.href = 'https://example.com')
                            }>
                            User management
                          </ContainedListItem>
                          <ContainedListItem
                            renderIcon={Money}
                            onClick={() =>
                              (window.location.href = 'https://example.com')
                            }>
                            Plan and billing
                          </ContainedListItem>
                          <ContainedListItem
                            renderIcon={Logout}
                            onClick={() =>
                              (window.location.href = 'https://example.com')
                            }>
                            Log out
                          </ContainedListItem>
                        </ContainedList>
                      </SideNavMenuLabs>
                    )}
                    <SideNavMenuLabs
                      renderIcon={Settings}
                      primary
                      title="Settings"
                      backButtonTitle="Back">
                      <SideNavDivider />
                      <SideNavLinkLabs renderIcon={ChartCustom} href="#">
                        Customize
                        <Launch />
                      </SideNavLinkLabs>
                    </SideNavMenuLabs>
                    <SideNavLinkLabs renderIcon={Notification} href="#">
                      Notifications
                      <Launch />
                    </SideNavLinkLabs>
                    <SideNavLinkLabs renderIcon={Help} href="#">
                      Help
                      <Launch />
                    </SideNavLinkLabs>
                    <SideNavLinkLabs renderIcon={ChartCustom} href="#">
                      Custom action
                      <Launch />
                    </SideNavLinkLabs>
                    {isSm && (
                      <>
                        <SideNavDivider />
                        <SideNavLinkLabs renderIcon={Logout} href="#">
                          Logout
                        </SideNavLinkLabs>
                      </>
                    )}
                  </SideNavItemsLabs>
                </SideNavLabs>
              </HeaderOverflowPanel>
              <ProfileRoot
                open={isProfileExpanded}
                onClick={onClickProfileExpand}
                label="Profile"
                renderIcon={<UserAvatar size={20} />}>
                <Profile.UserInfo name="Sample User" email="user@example.com" />
                <ThemeSettings legendText="Theme">
                  <ThemeSwitcher
                    lowContrast
                    size="sm"
                    value={themeSetting}
                    onChange={setThemeSetting}
                  />
                </ThemeSettings>
                <Profile.ReadOnly items={readOnlyItems} />
                <ContainedList label="Profile links">
                  <ContainedListItem
                    renderIcon={User}
                    onClick={() =>
                      (window.location.href = 'https://example.com')
                    }>
                    User profile
                  </ContainedListItem>
                  <ContainedListItem
                    renderIcon={IbmCloudKeyProtect}
                    onClick={() =>
                      (window.location.href = 'https://example.com')
                    }>
                    Access keys
                  </ContainedListItem>
                  <ContainedListItem
                    renderIcon={Group}
                    onClick={() =>
                      (window.location.href = 'https://example.com')
                    }>
                    User management
                  </ContainedListItem>
                  <ContainedListItem
                    renderIcon={Money}
                    onClick={() =>
                      (window.location.href = 'https://example.com')
                    }>
                    Plan and billing
                  </ContainedListItem>
                  <ContainedListItem
                    renderIcon={Logout}
                    onClick={() =>
                      (window.location.href = 'https://example.com')
                    }>
                    Log out
                  </ContainedListItem>
                </ContainedList>
              </ProfileRoot>
            </HeaderGlobalBar>
          </Header>
        )}
      />
    </Theme>
  );
};

Default.parameters = {
  controls: { disable: true },
  actions: { disable: true },
};
