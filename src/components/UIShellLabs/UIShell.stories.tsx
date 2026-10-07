/**
 * Copyright IBM Corp. 2025, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2025, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, Labs UI shell and theme settings components from @afframe/ui (the clashing Labs ones under their Labs names: SideNavLabs, HeaderContainerLabs and the rest of the Labs side nav set), Carbon components and icons from @afframe/ui (styles ship in the package CSS, so the ui-shell.scss import is dropped), story styles converted from SCSS to plain CSS, the header ref that was never attached dropped with the menuTarget it fed (MenuButton falls back to its default target), the internal useMatchMedia hook as a local copy, the @carbon/layout md breakpoint as its 42rem value, isFixedNav dropped from Carbon's HeaderMenuButton (not a prop there; it reached the button element), sample user name, email and instance name replaced with neutral placeholders, title Components/UI Shell/Labs/Overview, the story-wide a11y and accessibilityChecker opt-outs replaced by rule exceptions for the upstream side nav markup, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import {
  useEffect,
  useState,
  type ComponentProps,
  type ComponentType,
} from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import {
  Application,
  BusinessProcesses,
  ChartCustom,
  Dashboard,
  DataAnalytics,
  DocumentMultiple_01,
  EventIncident,
  Group,
  Help,
  Home,
  IbmCloudKeyProtect,
  Launch,
  Layers,
  Logout,
  Money,
  Notification,
  OverflowMenuVertical,
  Platforms,
  Security,
  Settings,
  Share,
  ShoppingCart,
  SquareOutline,
  Switcher as SwitcherIcon,
  User,
  UserAvatar,
  VirtualColumnKey,
  WorkflowAutomation,
} from '../../icons.js';
import {
  Button,
  Column,
  ContainedList,
  ContainedListItem,
  Content,
  Dropdown,
  ExpandableSearch,
  Grid,
  Header,
  HeaderContainerLabs,
  HeaderDivider,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderMenuButton,
  HeaderName,
  HeaderOverflowPanel,
  HeaderPopover,
  HeaderPopoverActions,
  HeaderPopoverButton,
  HeaderPopoverContent,
  Link,
  MenuButton,
  MenuItemRadioGroup,
  Profile,
  SIDE_NAV_TYPE,
  SideNavDivider,
  SideNavItemsLabs,
  SideNavLabs,
  SideNavLinkLabs,
  SideNavMenuItemLabs,
  SideNavMenuLabs,
  SideNavSlot,
  SideNavTitle,
  SkipToContent,
  Theme,
  ThemeSettings,
  ThemeSwitcher as ThemeSwitcherBase,
  TrialCountdown,
} from '../../index.js';
import {
  CarbonDesignSystem,
  CarbonIBMDotCom,
  CarbonforIBMProducts,
  IBMTelemetry,
} from './AppIcons.js';
import mdx from './UIShell.mdx';
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

interface DropdownItem {
  text: string;
}

export default {
  title: 'Components/UI Shell/Labs/Overview',
  component: HeaderDivider,
  subcomponents: {
    HeaderDivider,
    HeaderOverflowPanel,
    HeaderPopover,
    HeaderPopoverActions,
    HeaderPopoverButton,
    HeaderPopoverContent,
    SideNavLabs,
    SideNavItemsLabs,
    SideNavLinkLabs,
    SideNavMenuLabs,
    SideNavMenuItemLabs,
    SideNavSlot,
    TrialCountdown,
  },
  tags: ['labs'],
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof HeaderDivider>;

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
 * Story content
 * @returns {React.ReactElement} The JSX for the story
 */
const StoryContent = () => (
  <Grid align="start">
    <Column sm={4} md={8} lg={12}>
      <h2 style={{ margin: '0 0 30px 0' }}>Purpose and function</h2>
      <p>
        The shell is perhaps the most crucial piece of any UI built with {''}
        <a href="www.carbondesignsystem.com">Carbon</a>. It contains the shared
        navigation framework for the entire design system and ties the products
        in IBM’s portfolio together in a cohesive and elegant way. The shell is
        the home of the topmost navigation, where users can quickly and
        dependably gain their bearings and move between pages.
        <br />
        <br />
        The shell was designed with maximum flexibility built in, to serve the
        needs of a broad range of products and users. Adopting the shell ensures
        compliance with IBM design standards, simplifies development efforts,
        and provides great user experiences. All IBM products built with Carbon
        are required to use the shell’s header.
        <br />
        <br />
        To better understand the purpose and function of the UI shell, consider
        the “shell” of MacOS, which contains the Apple menu, top-level
        navigation, and universal, OS-level controls at the top of the screen,
        as well as a universal dock along the bottom or side of the screen. The
        Carbon UI shell is roughly analogous in function to these parts of the
        Mac UI. For example, the app switcher portion of the shell can be
        compared to the dock in MacOS.
      </p>
      <h2 style={{ margin: '30px 0' }}>Header responsive behavior</h2>
      <p>
        As a header scales down to fit smaller screen sizes, headers with
        persistent side nav menus should have the side nav collapse into
        “hamburger” menu. See the example to better understand responsive
        behavior of the header.
      </p>
      <h2 style={{ margin: '30px 0' }}>Secondary navigation</h2>
      <p>
        The side-nav contains secondary navigation and fits below the header. It
        can be configured to be either fixed-width or flexible, with only one
        level of nested items allowed. Both links and category lists can be used
        in the side-nav and may be mixed together. There are several
        configurations of the side-nav, but only one configuration should be
        used per product section. If tabs are needed on a page when using a
        side-nav, then the tabs are secondary in hierarchy to the side-nav.
      </p>
      <h2 style={{ margin: '30px 0' }}>Secondary navigation</h2>
      <p>
        The side-nav contains secondary navigation and fits below the header. It
        can be configured to be either fixed-width or flexible, with only one
        level of nested items allowed. Both links and category lists can be used
        in the side-nav and may be mixed together. There are several
        configurations of the side-nav, but only one configuration should be
        used per product section. If tabs are needed on a page when using a
        side-nav, then the tabs are secondary in hierarchy to the side-nav.
      </p>
    </Column>
    <Column sm={4} md={8} lg={4}>
      <h3 style={{ margin: '0 0 30px 0' }}>Secondary navigation</h3>
      <p>
        The side-nav contains secondary navigation and fits below the header. It
        can be configured to be either fixed-width or flexible, with only one
        level of nested items allowed. Both links and category lists can be used
        in the side-nav and may be mixed together. There are several
        configurations of the side-nav, but only one configuration should be
        used per product section. If tabs are needed on a page when using a
        side-nav, then the tabs are secondary in hierarchy to the side-nav.
      </p>
    </Column>
  </Grid>
);

/**
 *
 * @param {boolean} isSm - Indicates whether the viewport is small.
 * @param {string} themeSetting - The current theme setting.
 * @param {(theme: string) => void} setThemeSetting - Function to update the theme setting.
 * @returns {JSX.Element} The rendered HeaderOverflowPanel component.
 */
const headerOverflowPanel = (
  isSm: boolean,
  themeSetting: ThemeSetting,
  setThemeSetting: (theme: ThemeSetting) => void
) => (
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
                onClick={() => (window.location.href = 'https://example.com')}>
                User profile
              </ContainedListItem>
              <ContainedListItem
                renderIcon={IbmCloudKeyProtect}
                onClick={() => (window.location.href = 'https://example.com')}>
                Access keys
              </ContainedListItem>
              <ContainedListItem
                renderIcon={Group}
                onClick={() => (window.location.href = 'https://example.com')}>
                User management
              </ContainedListItem>
              <ContainedListItem
                renderIcon={Money}
                onClick={() => (window.location.href = 'https://example.com')}>
                Plan and billing
              </ContainedListItem>
              <ContainedListItem
                renderIcon={Logout}
                onClick={() => (window.location.href = 'https://example.com')}>
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
);

/**
 * Story for UIShell
 * @returns {React.ReactElement} The JSX for the story
 */
export const Demo: StoryFn<typeof HeaderDivider> = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const { themeSetting, setThemeSetting, themeHeader, currentTheme } =
    useThemeSettings();

  const options: Record<string, string[]> = {
    Fruits: ['Apple', 'Banana', 'Orange'],
    Vegetables: ['Carrot', 'Broccoli', 'Spinach'],
    Animals: ['Cat', 'Dog', 'Snake'],
  };

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
          <>
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
              <HeaderDivider className="hide-at-md" />
              <HeaderPopover align="bottom">
                <HeaderPopoverButton
                  label="Trial Countdown"
                  as={Button}
                  kind="ghost">
                  <TrialCountdown count={30} className="hide-at-md" />
                </HeaderPopoverButton>
                <HeaderPopoverContent>
                  <p>Your trial ends on May 13, 2025</p>
                  <Link href="#" renderIcon={Share}>
                    Invite team members
                  </Link>
                  <Link href="#" renderIcon={User}>
                    Contact sales
                  </Link>
                  <Button size="sm" renderIcon={ShoppingCart}>
                    Buy
                  </Button>
                </HeaderPopoverContent>
              </HeaderPopover>
              <HeaderGlobalBar>
                <ExpandableSearch
                  size="lg"
                  labelText="Search"
                  closeButtonLabelText="Clear search input"
                  id="search-expandable-1"
                />
                <HeaderGlobalAction
                  className="hide-at-md"
                  aria-label="Custom action"
                  tooltipHighContrast={false}>
                  <SquareOutline size={20} />
                </HeaderGlobalAction>
                <HeaderPopover align="bottom-end" className="hide-at-md">
                  <HeaderPopoverButton align="bottom" label="Help">
                    <Help size={20} />
                  </HeaderPopoverButton>
                  <HeaderPopoverContent>
                    <p>
                      Lorem ipsum dolor sit amet, di os consectetur adipiscing
                      elit, sed do eiusmod tempor incididunt ut fsil labore et
                      dolore magna aliqua.
                    </p>
                    <HeaderPopoverActions>
                      <Link href="#">Link action</Link>
                      <Button size="sm">Button</Button>
                    </HeaderPopoverActions>
                  </HeaderPopoverContent>
                </HeaderPopover>
                <HeaderPopover align="bottom-end" className="hide-at-md">
                  <HeaderPopoverButton align="bottom" label="Notifications">
                    <Notification size={20} />
                  </HeaderPopoverButton>
                  <HeaderPopoverContent>
                    <p>
                      Lorem ipsum dolor sit amet, di os consectetur adipiscing
                      elit, sed do eiusmod tempor incididunt ut fsil labore et
                      dolore magna aliqua.
                    </p>
                    <HeaderPopoverActions>
                      <Link href="#">Link action</Link>
                      <Button size="sm">Button</Button>
                    </HeaderPopoverActions>
                  </HeaderPopoverContent>
                </HeaderPopover>
                <HeaderDivider className="hide-at-md" />
                <MenuButton
                  className="hide-at-md"
                  kind="ghost"
                  menuAlignment="bottom-end"
                  menuBackgroundToken="background"
                  menuBorder
                  label={selectedCategory || 'Select Category'}>
                  <MenuItemRadioGroup
                    label="Category"
                    items={Object.keys(options)}
                    selectedItem={selectedCategory || null}
                    onChange={(newCategory) => {
                      setSelectedCategory(newCategory as string);
                      setSelectedItem('');
                    }}
                  />
                </MenuButton>
                <MenuButton
                  className="hide-at-md"
                  kind="ghost"
                  menuAlignment="bottom-end"
                  menuBackgroundToken="background"
                  menuBorder
                  label={selectedItem || 'Select Item'}
                  disabled={!selectedCategory}>
                  <MenuItemRadioGroup
                    label="Items"
                    items={
                      selectedCategory ? (options[selectedCategory] ?? []) : []
                    }
                    selectedItem={selectedItem || null}
                    onChange={(newItem) => setSelectedItem(newItem as string)}
                  />
                </MenuButton>
                <HeaderDivider className="hide-at-md" />
                {headerOverflowPanel(isSm, themeSetting, setThemeSetting)}

                <ProfileRoot
                  open={isProfileExpanded}
                  onClick={onClickProfileExpand}
                  label="Profile"
                  renderIcon={<UserAvatar size={20} />}>
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
                  <ContainedList>
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

            <SideNavLabs
              isTreeview={true}
              aria-label="Main navigation"
              expanded={isSideNavExpanded}
              onSideNavBlur={onClickSideNavExpand}
              isCollapsible
              onOverlayClick={onClickSideNavExpand}
              className="nav--global">
              <SideNavItemsLabs>
                <SideNavMenuLabs
                  renderIcon={CarbonDesignSystem}
                  title="Product 1"
                  primary
                  defaultExpanded>
                  <SideNavSlot renderIcon={VirtualColumnKey}>
                    <Dropdown
                      aria-label="Choose an option"
                      id="default"
                      size="sm"
                      itemToString={(item: DropdownItem | null) =>
                        item ? item.text : ''
                      }
                      items={[
                        { text: 'Option 1' },
                        { text: 'Option 2' },
                        { text: 'Option 3' },
                      ]}
                      label="Choose an option"
                      titleText="Choose an option"
                      hideLabel
                    />
                  </SideNavSlot>
                  <SideNavMenuLabs
                    renderIcon={Home}
                    title="Home"
                    defaultExpanded>
                    <SideNavMenuItemLabs href="#">
                      Item level 3
                    </SideNavMenuItemLabs>
                    <SideNavMenuItemLabs href="#">
                      Item level 3
                    </SideNavMenuItemLabs>
                    <SideNavMenuItemLabs href="#">
                      Item level 3
                    </SideNavMenuItemLabs>
                  </SideNavMenuLabs>
                  <SideNavLinkLabs href="#" renderIcon={BusinessProcesses}>
                    Business
                  </SideNavLinkLabs>
                  <SideNavLinkLabs href="#" renderIcon={Application}>
                    Applications
                  </SideNavLinkLabs>
                  <SideNavLinkLabs href="#" renderIcon={Platforms}>
                    Platforms
                  </SideNavLinkLabs>
                  <SideNavLinkLabs href="#" renderIcon={Layers}>
                    Infrastructure
                  </SideNavLinkLabs>
                  <SideNavTitle>Experience services</SideNavTitle>
                  <SideNavLinkLabs href="#" renderIcon={Dashboard}>
                    Dashboard
                  </SideNavLinkLabs>
                  <SideNavLinkLabs href="#" renderIcon={DataAnalytics}>
                    Analytics
                  </SideNavLinkLabs>
                  <SideNavLinkLabs href="#" renderIcon={EventIncident}>
                    Incidents
                  </SideNavLinkLabs>
                  <SideNavLinkLabs href="#" renderIcon={Security}>
                    Security
                  </SideNavLinkLabs>
                  <SideNavLinkLabs href="#" renderIcon={WorkflowAutomation}>
                    Automations
                  </SideNavLinkLabs>
                  <SideNavDivider />
                  <SideNavLinkLabs href="#" renderIcon={DocumentMultiple_01}>
                    Docs
                  </SideNavLinkLabs>
                  <SideNavLinkLabs href="#" renderIcon={Settings}>
                    Settings
                  </SideNavLinkLabs>
                  <SideNavLinkLabs href="#" renderIcon={OverflowMenuVertical}>
                    More
                  </SideNavLinkLabs>
                </SideNavMenuLabs>
                <SideNavMenuLabs
                  renderIcon={CarbonIBMDotCom}
                  title="Product 2"
                  primary>
                  <SideNavMenuItemLabs renderIcon={Home} href="#">
                    Home product 2
                  </SideNavMenuItemLabs>
                </SideNavMenuLabs>
                <SideNavMenuLabs
                  renderIcon={CarbonforIBMProducts}
                  title="Product 3"
                  primary>
                  <SideNavMenuItemLabs renderIcon={Home} href="#">
                    Home product 3
                  </SideNavMenuItemLabs>
                </SideNavMenuLabs>
                <SideNavMenuLabs
                  renderIcon={IBMTelemetry}
                  title="Product 4"
                  primary>
                  <SideNavMenuItemLabs renderIcon={Home} href="#">
                    Home product 4
                  </SideNavMenuItemLabs>
                </SideNavMenuLabs>
                <SideNavDivider />
                <SideNavLinkLabs renderIcon={DocumentMultiple_01} href="#">
                  Docs
                </SideNavLinkLabs>
                <SideNavLinkLabs renderIcon={Settings} href="#">
                  Settings
                </SideNavLinkLabs>
              </SideNavItemsLabs>
            </SideNavLabs>
            <Theme theme={currentTheme === 'white' ? 'g10' : 'g90'}>
              <SideNavLabs
                hideRailBreakpointDown="md"
                isChildOfHeader={false}
                navType={SIDE_NAV_TYPE.RAIL_PANEL}
                aria-label="Product navigation">
                <SideNavItemsLabs>
                  <SideNavSlot renderIcon={VirtualColumnKey}>
                    <Dropdown
                      id="default"
                      size="sm"
                      itemToString={(item: DropdownItem | null) =>
                        item ? item.text : ''
                      }
                      items={[
                        { text: 'Option 1' },
                        { text: 'Option 2' },
                        { text: 'Option 3' },
                      ]}
                      label="Choose an option"
                      titleText="Choose an option"
                      hideLabel
                    />
                  </SideNavSlot>
                  <SideNavMenuLabs renderIcon={Home} title="Home">
                    <SideNavMenuItemLabs href="#">
                      Item level 3
                    </SideNavMenuItemLabs>
                    <SideNavMenuItemLabs href="#">
                      Item level 3
                    </SideNavMenuItemLabs>
                    <SideNavMenuItemLabs href="#">
                      Item level 3
                    </SideNavMenuItemLabs>
                  </SideNavMenuLabs>
                  <SideNavLinkLabs href="#" renderIcon={BusinessProcesses}>
                    Business
                  </SideNavLinkLabs>
                  <SideNavLinkLabs href="#" renderIcon={Application}>
                    Applications
                  </SideNavLinkLabs>
                  <SideNavLinkLabs href="#" renderIcon={Platforms}>
                    Platforms
                  </SideNavLinkLabs>
                  <SideNavLinkLabs href="#" renderIcon={Layers}>
                    Infrastructure
                  </SideNavLinkLabs>
                  <SideNavTitle>Experience services</SideNavTitle>
                  <SideNavLinkLabs href="#" renderIcon={Dashboard}>
                    Dashboard
                  </SideNavLinkLabs>
                  <SideNavLinkLabs href="#" renderIcon={DataAnalytics}>
                    Analytics
                  </SideNavLinkLabs>
                  <SideNavLinkLabs href="#" renderIcon={EventIncident}>
                    Incidents
                  </SideNavLinkLabs>
                  <SideNavLinkLabs href="#" renderIcon={Security}>
                    Security
                  </SideNavLinkLabs>
                  <SideNavLinkLabs href="#" renderIcon={WorkflowAutomation}>
                    Automations
                  </SideNavLinkLabs>
                  <SideNavDivider />
                  <SideNavLinkLabs href="#" renderIcon={DocumentMultiple_01}>
                    Docs
                  </SideNavLinkLabs>
                  <SideNavLinkLabs href="#" renderIcon={Settings}>
                    Settings
                  </SideNavLinkLabs>
                  <SideNavLinkLabs href="#" renderIcon={OverflowMenuVertical}>
                    More
                  </SideNavLinkLabs>
                </SideNavItemsLabs>
              </SideNavLabs>
            </Theme>
            <Theme
              as={Content}
              theme={currentTheme === 'white' ? 'g10' : 'g90'}>
              <StoryContent />
            </Theme>
          </>
        )}
      />
    </Theme>
  );
};

// The Labs treeview and rail panel side navs leave their <li> elements
// without a role under role="tree" and role="group", and the rail panel's
// toggle list holds a <span> (upstream markup).
Demo.parameters = {
  controls: { disable: true },
  actions: { disable: true },
  a11y: {
    config: {
      rules: [
        { id: 'listitem', enabled: false },
        { id: 'list', enabled: false },
        { id: 'aria-required-parent', enabled: false },
        { id: 'aria-required-children', enabled: false },
      ],
    },
  },
};
