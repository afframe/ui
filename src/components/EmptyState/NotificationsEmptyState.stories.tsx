/**
 * Copyright IBM Corp. 2020, 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2020, 2025
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and icons from @afframe/ui, source tag, Stackblitz removed, commented-out styles import dropped, the action logs through Storybook actions only, illustration follows the Storybook theme, invoice data, links to #, headingAs in meta args, the action boolean control split from the component props, story names unified. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { action as storybookAction } from 'storybook/actions';
import { Add } from '../../icons.js';
import { NotificationsEmptyState, useColorScheme } from '../../index.js';
import type { NotificationsEmptyStateProps } from '../../index.js';
import mdx from './NotificationsEmptyState.mdx';

export default {
  title: 'Components/Empty States/NotificationsEmptyState',
  component: NotificationsEmptyState,
  tags: ['ibm-products'],
  args: { headingAs: 'h3' },
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof NotificationsEmptyState>;

type TemplateArgs = Omit<NotificationsEmptyStateProps, 'action'> & {
  action?: boolean;
};

const defaultStoryProps = {
  title: 'No notifications',
  subtitle: 'Payment reminders and overdue invoices show up here.',
  illustrationDescription: 'Bell',
};

const Template: StoryFn<TemplateArgs> = ({ ...args }) => {
  const { action, ...rest } = args;
  // IBM draws the light illustration unless the app passes the theme.
  const scheme = useColorScheme();
  const getAction = (icon = false) => {
    const actionObj = {
      text: 'Set up reminders',
      onClick: storybookAction('Clicked empty state action button'),
    };

    if (icon) {
      return {
        ...actionObj,
        renderIcon: (props: object) => <Add size={20} {...props} />,
        iconDescription: 'Add',
      };
    }

    return actionObj;
  };
  return (
    <NotificationsEmptyState
      {...rest}
      illustrationTheme={rest.illustrationTheme ?? scheme}
      {...(typeof action === 'boolean' ? { action: getAction(action) } : {})}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  ...defaultStoryProps,
};

export const WithDarkModeIllustration = Template.bind({});
WithDarkModeIllustration.args = {
  ...defaultStoryProps,
  illustrationTheme: 'dark',
};

export const WithAction = Template.bind({});
WithAction.args = {
  ...defaultStoryProps,
  action: false,
};

export const WithActionIconButton = Template.bind({});
WithActionIconButton.args = {
  ...defaultStoryProps,
  action: true,
};

export const WithLink = Template.bind({});
WithLink.args = {
  ...defaultStoryProps,
  link: {
    text: 'Notification settings',
    href: '#',
  },
};

export const WithActionAndLink = Template.bind({});
WithActionAndLink.args = {
  ...defaultStoryProps,
  action: true,
  link: {
    text: 'Notification settings',
    href: '#',
  },
};
