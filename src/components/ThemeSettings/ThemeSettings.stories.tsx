/**
 * Copyright IBM Corp. 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2025
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and useThemeSetting from @afframe/ui (styles ship in the package CSS, so the theme-settings.scss import is dropped), story styles as a plain CSS file, the ThemeSwitcher drives the Storybook theme global (which sets data-afframe-theme, so it starts on the toolbar theme instead of system), the InContext media query handler moved into its effect, theme types declared locally, source tag, stories cut to Afframe's light, system and dark themes (theme-set stories and the hand-rolled InContext removed; InContextUseThemeSetting renamed InContext with the white/g100 set), the React state of WithMenuComplement and InContext moved into child components so it does not re-run the story function's Storybook hook, play functions that toggle the menu complement. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { useGlobals } from 'storybook/preview-api';
import { expect } from 'storybook/test';
import {
  Theme,
  ThemeMenuComplement,
  ThemeSettings,
  ThemeSwitcher,
  useThemeSetting,
} from '../../index.js';
import mdx from './ThemeSettings.mdx';
import './theme-settings-story.css';

// The package's shared types file does not resolve under NodeNext, so its
// theme value types are untyped here: the types as upstream declares them.
type ThemeSet = 'white/g100';
type ThemeSetting = 'light' | 'system' | 'dark';

export default {
  title: 'Components/ThemeSettings',
  component: ThemeSettings,
  subcomponents: { ThemeSwitcher, ThemeMenuComplement },
  tags: ['labs'],
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof ThemeSettings>;

/**
 * useThemeGlobal - the theme setting as the Storybook theme global, which the
 * preview writes to `data-afframe-theme` on `<html>` (light, dark or system)
 *
 * @returns {[ThemeSetting, function]}
 */
const useThemeGlobal = (): [ThemeSetting, (value: ThemeSetting) => void] => {
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

// The toggle re-renders through React state; it must not break the story.
const toggleTwice: StoryFn<typeof ThemeSettings>['play'] = async ({
  canvas,
  userEvent,
}) => {
  const toggle = canvas.getByRole('checkbox', {
    name: 'Complement menu theme',
  });
  await userEvent.click(toggle);
  await expect(
    canvas.getByRole('checkbox', { name: 'Complement menu theme' })
  ).toBeChecked();
  await userEvent.click(
    canvas.getByRole('checkbox', { name: 'Complement menu theme' })
  );
  await expect(
    canvas.getByRole('checkbox', { name: 'Complement menu theme' })
  ).not.toBeChecked();
};

/**
 * Default story for ThemeSettings
 */
export const Default: StoryFn<typeof ThemeSettings> = () => {
  const [themeSetting, setThemeSetting] = useThemeGlobal();
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

type ThemeGlobalProps = {
  themeSetting: ThemeSetting;
  setThemeSetting: (value: ThemeSetting) => void;
};

// Storybook's useGlobals stays in the story function; React state lives in
// this child, whose re-renders do not re-run the story function, where
// Storybook hooks throw.
const MenuComplementSettings = ({
  themeSetting,
  setThemeSetting,
}: ThemeGlobalProps) => {
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

/**
 * WithMenuComplement story for ThemeSettings
 */
export const WithMenuComplement: StoryFn<typeof ThemeSettings> = () => {
  const [themeSetting, setThemeSetting] = useThemeGlobal();
  return (
    <MenuComplementSettings
      themeSetting={themeSetting}
      setThemeSetting={setThemeSetting}
    />
  );
};
WithMenuComplement.parameters = {
  layout: 'centered',
};
WithMenuComplement.play = toggleTwice;

const InContextApp = ({ themeSetting, setThemeSetting }: ThemeGlobalProps) => {
  const [themeMenuComplement, setThemeMenuComplement] = useState(false);
  // Afframe's page themes: white for light, g100 for dark.
  const themeSet: ThemeSet = 'white/g100';
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
        </ThemeSettings>
      </Theme>
    </Theme>
  );
};

/**
 * InContext story for ThemeSettings
 */
export const InContext: StoryFn<typeof ThemeSettings> = () => {
  const [themeSetting, setThemeSetting] = useThemeGlobal();
  return (
    <InContextApp
      themeSetting={themeSetting}
      setThemeSetting={setThemeSetting}
    />
  );
};
InContext.play = toggleTwice;
