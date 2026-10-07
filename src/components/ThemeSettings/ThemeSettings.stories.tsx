/**
 * Copyright IBM Corp. 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2025
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and useThemeSetting from @afframe/ui (styles ship in the package CSS, so the theme-settings.scss import is dropped), story styles as a plain CSS file, the ThemeSwitcher drives the Storybook theme global (which sets data-afframe-theme, so it starts on the toolbar theme instead of system), the InContext media query handler moved into its effect, theme types declared locally, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useEffect, useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { useGlobals } from 'storybook/preview-api';
import {
  Theme,
  ThemeMenuComplement,
  ThemeSetDropdown,
  ThemeSettings,
  ThemeSwitcher,
  useThemeSetting,
} from '../../index.js';
import mdx from './ThemeSettings.mdx';
import './theme-settings-story.css';

// The package's shared types file does not resolve under NodeNext, so its
// theme value types are untyped here: the types as upstream declares them.
type CarbonTheme = 'white' | 'g10' | 'g90' | 'g100';
type ThemeSet = 'white/g90' | 'g10/g90' | 'white/g100' | 'g10/g100';
type ThemeSetting = 'light' | 'system' | 'dark';

export default {
  title: 'Components/ThemeSettings',
  component: ThemeSettings,
  subcomponents: { ThemeSwitcher, ThemeSetDropdown, ThemeMenuComplement },
  tags: ['labs'],
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof ThemeSettings>;

/**
 * useAfframeTheme - the theme setting as the Storybook theme global, which the
 * preview writes to `data-afframe-theme` on `<html>` (light, dark or system)
 *
 * @returns {[ThemeSetting, function]}
 */
const useAfframeTheme = (): [ThemeSetting, (value: ThemeSetting) => void] => {
  const [globals, updateGlobals] = useGlobals();
  return [
    globals.theme as ThemeSetting,
    (theme) => {
      updateGlobals({ theme });
    },
  ];
};

/**
 * createActionHandler - creates an action based on props
 *
 * @param {string} controlName - name of control
 * @param {string} eventName - name of event
 * @param {function} setter - setter function
 *
 * @returns {function}
 */
const createActionHandler = <T,>(
  controlName: string,
  eventName: string,
  setter: (value: T) => void
) => {
  const localAction = action(`${controlName}.${eventName}`);
  return (value: T) => {
    localAction(value);
    setter(value);
  };
};

/**
 * Default story for ThemeSettings
 */
export const Default: StoryFn<typeof ThemeSettings> = () => {
  const [themeSetting, setThemeSetting] = useAfframeTheme();
  const handleThemeSetting = createActionHandler(
    'ThemeSwitcher',
    'onChange',
    setThemeSetting
  );

  return (
    <ThemeSettings>
      <ThemeSwitcher
        onChange={handleThemeSetting}
        value={themeSetting}></ThemeSwitcher>
    </ThemeSettings>
  );
};
Default.parameters = {
  layout: 'centered',
};

/**
 * WithMenuComplement story for ThemeSettings
 */
export const WithMenuComplement: StoryFn<typeof ThemeSettings> = () => {
  const [themeSetting, setThemeSetting] = useAfframeTheme();
  const [themeMenuComplement, setThemeMenuComplement] = useState(false);

  const handleThemeSetting = createActionHandler(
    'ThemeSwitcher',
    'onChange',
    setThemeSetting
  );
  const handleMenuComplement = createActionHandler(
    'ThemeMenuComplement',
    'onChange',
    setThemeMenuComplement
  );

  return (
    <ThemeSettings>
      <ThemeSwitcher
        onChange={handleThemeSetting}
        value={themeSetting}></ThemeSwitcher>
      <ThemeMenuComplement
        id="theme-menu-complement"
        labelText="Complement menu theme"
        checked={themeMenuComplement}
        onChange={handleMenuComplement}
      />
    </ThemeSettings>
  );
};
WithMenuComplement.parameters = {
  layout: 'centered',
};

/**
 * WithThemeSet story for ThemeSettings
 */
export const WithThemeSet: StoryFn<typeof ThemeSettings> = () => {
  const [themeSetting, setThemeSetting] = useAfframeTheme();
  const [themeSet, setThemeSet] = useState<ThemeSet>('white/g100');

  const handleThemeSetting = createActionHandler(
    'ThemeSwitcher',
    'onChange',
    setThemeSetting
  );
  const handleThemeSet = createActionHandler(
    'ThemeSetDropdown',
    'onChange',
    setThemeSet
  );

  return (
    <ThemeSettings>
      <ThemeSwitcher
        onChange={handleThemeSetting}
        value={themeSetting}></ThemeSwitcher>
      <ThemeSetDropdown
        id="theme-dropdown"
        label="Theme set"
        titleText="Theme set"
        value={themeSet}
        onChange={handleThemeSet}
      />
    </ThemeSettings>
  );
};
WithThemeSet.parameters = {
  layout: 'centered',
};

/**
 * Complete story for ThemeSettings
 */
export const Complete: StoryFn<typeof ThemeSettings> = () => {
  const [themeSetting, setThemeSetting] = useAfframeTheme();
  const [themeMenuComplement, setThemeMenuComplement] = useState(false);
  const [themeSet, setThemeSet] = useState<ThemeSet>('white/g100');

  const handleThemeSetting = createActionHandler(
    'ThemeSwitcher',
    'onChange',
    setThemeSetting
  );
  const handleMenuComplement = createActionHandler(
    'ThemeMenuComplement',
    'onChange',
    setThemeMenuComplement
  );
  const handleThemeSet = createActionHandler(
    'ThemeSetDropdown',
    'onChange',
    setThemeSet
  );

  return (
    <ThemeSettings>
      <ThemeSwitcher
        onChange={handleThemeSetting}
        value={themeSetting}></ThemeSwitcher>
      <ThemeMenuComplement
        id="theme-menu-complement"
        labelText="Complement menu theme"
        checked={themeMenuComplement}
        onChange={handleMenuComplement}
      />
      <ThemeSetDropdown
        id="theme-dropdown"
        label="Theme set"
        titleText="Theme set"
        value={themeSet}
        onChange={handleThemeSet}
      />
    </ThemeSettings>
  );
};
Complete.parameters = {
  layout: 'centered',
};

const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');

/**
 * InContext story for ThemeSettings
 */
export const InContext: StoryFn<typeof ThemeSettings> = () => {
  const [themeSetting, setThemeSetting] = useAfframeTheme();
  const [themeMenuComplement, setThemeMenuComplement] = useState(false);
  const [themeSet, setThemeSet] = useState<ThemeSet>('white/g100');
  const [systemDark, setSystemDark] = useState(mediaQueryList.matches);
  const [theme, setTheme] = useState<CarbonTheme>('white');
  const [themeHeader, setThemeHeader] = useState<CarbonTheme>('g100');

  useEffect(() => {
    /**
     * @param {MediaQueryListEvent} event media query event
     */
    const handleMediaQueryEvent = (event: MediaQueryListEvent) => {
      setSystemDark(event.matches);
    };

    mediaQueryList.addEventListener('change', handleMediaQueryEvent);

    return () =>
      mediaQueryList.removeEventListener('change', handleMediaQueryEvent);
  }, []);

  useEffect(() => {
    const themes = themeSet.split('/') as [CarbonTheme, CarbonTheme];

    if (themeSetting === 'system') {
      setTheme(systemDark ? themes[1] : themes[0]);
      setThemeHeader(
        (systemDark && !themeMenuComplement) ||
          (!systemDark && themeMenuComplement)
          ? themes[1]
          : themes[0]
      );
    } else {
      if (themeSetting === 'light') {
        setTheme(themes[0]);
        setThemeHeader(themeMenuComplement ? themes[1] : themes[0]);
      } else {
        setTheme(themes[1]);
        setThemeHeader(themeMenuComplement ? themes[0] : themes[1]);
      }
    }
  }, [systemDark, themeSetting, themeMenuComplement, themeSet]);

  return (
    <Theme className={'theme-setting-in-context'} theme={themeHeader}>
      <header className="theme-setting-in-context__header">
        A sample header
      </header>
      <Theme as="main" className="theme-setting-in-context__main" theme={theme}>
        <h2>Your app goes here.</h2>

        <ThemeSettings>
          <ThemeSwitcher
            onChange={setThemeSetting}
            value={themeSetting}></ThemeSwitcher>
          <ThemeMenuComplement
            id="theme-menu-complement"
            labelText="Complement menu theme"
            checked={themeMenuComplement}
            onChange={setThemeMenuComplement}
          />
          <ThemeSetDropdown
            id="theme-dropdown"
            label="Theme set"
            titleText="Theme set"
            value={themeSet}
            onChange={setThemeSet}
          />
        </ThemeSettings>
      </Theme>
    </Theme>
  );
};

/**
 * InContext story for ThemeSettings
 */
export const InContextUseThemeSetting: StoryFn<typeof ThemeSettings> = () => {
  const [themeSetting, setThemeSetting] = useAfframeTheme();
  const [themeMenuComplement, setThemeMenuComplement] = useState(false);
  const [themeSet, setThemeSet] = useState<ThemeSet>('white/g100');
  const theme = useThemeSetting(themeSetting, themeSet, false);
  const themeHeader = useThemeSetting(
    themeSetting,
    themeSet,
    themeMenuComplement
  );

  return (
    <Theme className={'theme-setting-in-context'} theme={themeHeader}>
      <header className="theme-setting-in-context__header">
        A sample header
      </header>

      <Theme as="main" className="theme-setting-in-context__main" theme={theme}>
        <h2>Your app goes here.</h2>

        <ThemeSettings>
          <ThemeSwitcher
            onChange={setThemeSetting}
            value={themeSetting}></ThemeSwitcher>
          <ThemeMenuComplement
            id="theme-menu-complement"
            labelText="Complement menu theme"
            checked={themeMenuComplement}
            onChange={setThemeMenuComplement}
          />
          <ThemeSetDropdown
            id="theme-dropdown"
            label="Theme set"
            titleText="Theme set"
            value={themeSet}
            onChange={setThemeSet}
          />
        </ThemeSettings>
      </Theme>
    </Theme>
  );
};
