/**
 * Copyright IBM Corp. 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2025
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, Labs UI shell and theme settings components, Carbon components and icons from @afframe/ui (styles ship in the package CSS, so the ui-shell.scss import is dropped), the docs entry and subcomponents as the Profile namespace parts, sample user name, email and instance name replaced with neutral placeholders, title under Components/UI Shell/Labs, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useEffect, useState, type ReactNode } from 'react';
import type { ComponentProps, ComponentType } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import {
  Group,
  IbmCloudKeyProtect,
  Logout,
  Money,
  User,
  UserAvatar,
} from '../../icons.js';
import {
  ContainedList,
  ContainedListItem,
  Header,
  HeaderGlobalBar,
  Profile,
  Theme,
  ThemeSettings,
  ThemeSwitcher as ThemeSwitcherBase,
} from '../../index.js';
import mdx from './Profile.mdx';

// ThemeSwitcher passes other props on to Carbon's ContentSwitcher; its types do
// not declare the ones these stories use.
const ThemeSwitcher = ThemeSwitcherBase as ComponentType<
  ComponentProps<typeof ThemeSwitcherBase> & {
    lowContrast?: boolean;
    size?: string;
  }
>;

type ThemeSetting = NonNullable<ComponentProps<typeof ThemeSwitcher>['value']>;
type CarbonTheme = 'white' | 'g10' | 'g90' | 'g100';

export default {
  title: 'Components/UI Shell/Labs/Profile',
  component: Profile.Root,
  subcomponents: {
    'Profile.UserInfo': Profile.UserInfo,
    'Profile.ReadOnly': Profile.ReadOnly,
  },
  tags: ['labs'],
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof Profile.Root>;

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

  /**
   *
   */
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
 *
 * @param {{ children: React.ReactNode }} props - The children
 * @returns {JSX.Element} The rendered BaseProfile component.
 */
const BaseProfile = ({ children }: { children?: ReactNode }) => (
  <Header aria-label="IBM Platform Name">
    <HeaderGlobalBar>
      <Profile.Root label="Profile" renderIcon={<UserAvatar size={20} />}>
        <Profile.UserInfo name="Sample User" email="user@example.com" />
        {children}
      </Profile.Root>
    </HeaderGlobalBar>
  </Header>
);

/**
 * Story for Profile
 * @returns {React.ReactElement} The JSX for the story
 */
export const Default: StoryFn<typeof Profile.Root> = () => {
  return <BaseProfile></BaseProfile>;
};

/**
 * Story for Profile with read only items
 * @returns {React.ReactElement} The JSX for the story
 */
export const withReadOnly: StoryFn<typeof Profile.Root> = () => (
  <BaseProfile>
    <Profile.ReadOnly items={readOnlyItems} />
  </BaseProfile>
);

/**
 * Story for Profile with theme switcher.
 * @returns {React.ReactElement} The rendered story with theme controls and profile layout.
 */
export const WithThemeSwitcher: StoryFn<typeof Profile.Root> = () => {
  const { themeSetting, setThemeSetting, themeHeader, currentTheme } =
    useThemeSettings();

  return (
    <Theme theme={themeHeader}>
      <Theme
        as="main"
        className="theme-setting-in-context__main"
        theme={currentTheme}>
        <BaseProfile>
          <ThemeSettings legendText="Theme">
            <ThemeSwitcher
              lowContrast
              size="sm"
              value={themeSetting}
              onChange={setThemeSetting}
            />
          </ThemeSettings>
        </BaseProfile>
      </Theme>
    </Theme>
  );
};

/**
 * Story for Profile with links
 * @returns {React.ReactElement} The JSX for the story
 */
export const withLinks: StoryFn<typeof Profile.Root> = () => {
  return (
    <Header aria-label="IBM Platform Name">
      <HeaderGlobalBar>
        <Profile.Root label="Profile" renderIcon={<UserAvatar size={20} />}>
          <Profile.UserInfo name="Sample User" email="user@example.com" />
          <ContainedList>
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
        </Profile.Root>
      </HeaderGlobalBar>
    </Header>
  );
};
