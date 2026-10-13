/**
 * Copyright IBM Corp. 2016, 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2025
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, source tag, story styles as plain CSS, story names unified, prop descriptions, a Default story that uses the theme control. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import './Theme-story.css';
import type { Meta, StoryFn } from '@storybook/react-vite';
import type { ComponentProps, ReactNode } from 'react';

import { WithLayer as WithLayerTemplate } from '../../../.storybook/templates/WithLayer/index.js';
import {
  Button,
  GlobalTheme,
  Theme,
  TextInput,
  usePrefersDarkScheme,
  useTheme,
  VStack,
} from '../../index.js';
import type { GlobalThemeProps } from '../../index.js';
import mdx from './Theme.mdx';

type ThemeName = NonNullable<ComponentProps<typeof Theme>['theme']>;

export default {
  title: 'Components/Theme',
  component: Theme,
  subcomponents: {
    GlobalTheme,
  },
  tags: ['carbon'],
  parameters: {
    controls: {
      hideNoControlsWarning: true,
    },
    docs: {
      page: mdx,
    },
  },
  args: {
    theme: 'g10',
  },
  // Carbon's prop docs; docgen reads none from Theme's polymorphic type.
  argTypes: {
    theme: {
      control: 'select',
      options: ['white', 'g10', 'g90', 'g100'],
      description: 'Specify the theme',
      table: { type: { summary: "'white' | 'g10' | 'g90' | 'g100'" } },
    },
    as: {
      control: false,
      description:
        'Specify a custom component or element to be rendered as the top-level element in the component',
      table: {
        type: { summary: 'ElementType' },
        defaultValue: { summary: "'div'" },
      },
    },
    children: {
      control: false,
      description: 'Provide child elements to be rendered inside of `Theme`',
    },
    className: {
      control: false,
      description:
        'Provide a custom class name to be used on the outermost element rendered by the component',
    },
  },
} satisfies Meta<typeof Theme>;

const ThemeText = ({
  children,
  showIsDark,
}: {
  children?: ReactNode;
  showIsDark?: boolean;
}) => {
  // Carbon's useTheme type omits the isDark value it returns at runtime.
  const { theme, isDark } = useTheme() as GlobalThemeProps & {
    isDark?: boolean;
  };

  return (
    <p>
      {children}
      {showIsDark
        ? ` useTheme reveals... { theme: '${theme}', isDark: '${isDark}'}`
        : theme}
    </p>
  );
};

export const Default: StoryFn<typeof Theme> = ({ theme }) => {
  return (
    <Theme theme={theme ?? 'white'}>
      <section className="theme-section">
        <VStack gap={5}>
          <TextInput id="theme-default-name" labelText="Company name" />
          <Button>Save</Button>
        </VStack>
      </section>
    </Theme>
  );
};

export const AllThemes: StoryFn<typeof Theme> = () => {
  return (
    <>
      <Theme theme="g100">
        <section className="theme-section">g100</section>
      </Theme>
      <Theme theme="g90">
        <section className="theme-section">g90</section>
      </Theme>
      <Theme theme="g10">
        <section className="theme-section">g10</section>
      </Theme>
      <Theme theme="white">
        <section className="theme-section">white</section>
      </Theme>
    </>
  );
};

AllThemes.parameters = { controls: { disable: true } };

export const UseTheme: StoryFn<typeof Theme> = () => {
  return (
    <div>
      <section className="theme-section">
        <ThemeText showIsDark={true} />
      </section>
      <Theme theme="g100">
        <section className="theme-section">
          <ThemeText showIsDark={true} />
        </section>
      </Theme>
    </div>
  );
};

export const UsePrefersDarkScheme: StoryFn<typeof Theme> = () => {
  const prefersDark = usePrefersDarkScheme();

  const theme1: ThemeName = prefersDark ? 'g100' : 'white';
  const theme2: ThemeName = prefersDark ? 'white' : 'g100';
  const theme3: ThemeName = prefersDark ? 'g90' : 'g10';
  const theme4: ThemeName = prefersDark ? 'g10' : 'g90';

  return (
    <Theme theme={theme1}>
      <section className="theme-section">
        <ThemeText showIsDark={true}>
          usePrefersDarkScheme() is {prefersDark ? '`true`' : '`false`'}. Theme
          set to `{theme1}`.
        </ThemeText>
      </section>
      <Theme theme={theme2}>
        <section className="theme-section">
          <ThemeText showIsDark={true}>
            usePrefersDarkScheme() is {prefersDark ? '`true`' : '`false`'}. An
            alternative theme set of `{theme2}`.
          </ThemeText>
        </section>
      </Theme>
      <Theme theme={theme3}>
        <section className="theme-section">
          <ThemeText showIsDark={true}>
            usePrefersDarkScheme() is {prefersDark ? '`true`' : '`false`'}.
            Theme set to `{theme3}`.
          </ThemeText>
        </section>
      </Theme>
      <Theme theme={theme4}>
        <section className="theme-section">
          <ThemeText showIsDark={true}>
            usePrefersDarkScheme() is {prefersDark ? '`true`' : '`false`'}. An
            alternative theme set of `{theme4}`.
          </ThemeText>
        </section>
      </Theme>
    </Theme>
  );
};

export const WithLayer: StoryFn<typeof Theme> = () => {
  const themes: ThemeName[] = ['white', 'g10', 'g90', 'g100'];

  return (
    <VStack gap={7}>
      {themes.map((theme) => (
        <Theme key={theme} theme={theme}>
          <article className="theme-layer-example">
            <header className="theme-layer-header">{theme} theme</header>
            <WithLayerTemplate>
              <div className="theme-with-layer">Content</div>
            </WithLayerTemplate>
          </article>
        </Theme>
      ))}
    </VStack>
  );
};
