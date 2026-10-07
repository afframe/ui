/**
 * Copyright IBM Corp. 2024, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2024, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and icons from @afframe/ui, source tag, story styles as a plain CSS file, headshot loaded by URL, TODO comments dropped, `isDark` typed locally. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { Add, Group, User } from '../../icons.js';
import { Theme, UserAvatar, useTheme } from '../../index.js';
import mdx from './UserAvatar.mdx';
import './UserAvatar-story.css';

const headshot = new URL('./story-assets/headshot.jpg', import.meta.url).href;

export default {
  title: 'Components/UserAvatar',
  component: UserAvatar,
  tags: ['ibm-products'],
  argTypes: {
    backgroundColor: {
      control: {
        type: 'select',
      },
      options: [
        'order-1-cyan',
        'order-2-gray',
        'order-3-green',
        'order-4-magenta',
        'order-5-purple',
        'order-6-teal',
        'order-7-cyan',
        'order-8-gray',
        'order-9-green',
        'order-10-magenta',
        'order-11-purple',
        'order-12-teal',
      ],
    },
    renderIcon: {
      control: {
        type: 'select',
      },
      options: ['No icon', 'User', 'Group', 'Add'],
      mapping: { 'No icon': '', User: User, Group: Group, Add: Add },
    },
    size: {
      control: {
        type: 'radio',
      },
      options: ['xl', 'lg', 'md', 'sm'],
    },
    tooltipAlignment: {
      control: {
        type: 'select',
      },
      options: [
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'right',
      ],
    },
  },
  args: {
    size: 'md',
    tooltipAlignment: 'right',
  },
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof UserAvatar>;

const ThemeText = () => {
  // Carbon's types omit `isDark`, which the hook returns at runtime.
  const { theme, isDark } = useTheme() as ReturnType<typeof useTheme> & {
    isDark?: boolean;
  };

  return (
    <p className="theme-text">
      {`useTheme reveals theme: '${theme}', isDark: '${isDark}'`}
    </p>
  );
};

const Template: StoryFn<typeof UserAvatar> = (args) => {
  return (
    <main>
      <UserAvatar {...args} />
    </main>
  );
};
const ThemeTemplate: StoryFn<typeof UserAvatar> = (args) => {
  return (
    <main>
      <Theme theme="white">
        <section className="theme-section">
          <ThemeText />
          <UserAvatar {...args} />
        </section>
      </Theme>
      <Theme theme="g10">
        <section className="theme-section">
          <ThemeText />
          <UserAvatar {...args} />
        </section>
      </Theme>
      <Theme theme="g90">
        <section className="theme-section">
          <ThemeText />
          <UserAvatar {...args} />
        </section>
      </Theme>
      <Theme theme="g100">
        <section className="theme-section">
          <ThemeText />
          <UserAvatar {...args} />
        </section>
      </Theme>
    </main>
  );
};
export const Default = ThemeTemplate.bind({});
Default.storyName = 'Default';
Default.args = {
  name: 'thomas j. watson',
  tooltipText: 'TW, Thomas J. Watson user profile',
  renderIcon: 'No icon',
};

export const WithImage = Template.bind({});
WithImage.storyName = 'WithImage';
WithImage.args = {
  image: headshot,
  tooltipText: 'TW, Thomas J. Watson user profile',
  imageDescription: 'Avatar of Thomas J. Watson',
};
