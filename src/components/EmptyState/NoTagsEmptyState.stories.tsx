/**
 * Copyright IBM Corp. 2020, 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2020, 2025
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and icons from @afframe/ui, source tag, Stackblitz removed, empty-heading a11y rule disabled per story (upstream defect), commented-out styles import dropped, the action logs through Storybook actions only, illustration follows the Storybook theme, invoice data, links to #, headingAs in meta args, the action boolean control split from the component props, story names unified. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { action as storybookAction } from 'storybook/actions';
import { Add } from '../../icons.js';
import { NoTagsEmptyState, useColorScheme } from '../../index.js';
import type { NoTagsEmptyStateProps } from '../../index.js';
import mdx from './NoTagsEmptyState.mdx';

export default {
  title: 'Components/Empty States/NoTagsEmptyState',
  component: NoTagsEmptyState,
  tags: ['ibm-products'],
  args: { headingAs: 'h3' },
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof NoTagsEmptyState>;

type TemplateArgs = Omit<NoTagsEmptyStateProps, 'action'> & {
  action?: boolean;
};

// IBM's NoTagsEmptyState discards `title` (it assigns `title = ''`), so the heading renders empty.
const emptyHeading = {
  a11y: { config: { rules: [{ id: 'empty-heading', enabled: false }] } },
};

const defaultStoryProps = {
  title: 'No tags yet',
  subtitle: 'Add tags such as Urgent or Recurring to group invoices.',
  illustrationDescription: 'Tag',
};

const Template: StoryFn<TemplateArgs> = ({ ...args }) => {
  const { action, ...rest } = args;
  // IBM draws the light illustration unless the app passes the theme.
  const scheme = useColorScheme();
  const getAction = (icon = false) => {
    const actionObj = {
      text: 'Add tag',
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
    <NoTagsEmptyState
      {...rest}
      illustrationTheme={rest.illustrationTheme ?? scheme}
      {...(typeof action === 'boolean' ? { action: getAction(action) } : {})}
    />
  );
};

export const Default = Template.bind({});
Default.parameters = emptyHeading;
Default.args = {
  ...defaultStoryProps,
};

export const WithDarkModeIllustration = Template.bind({});
WithDarkModeIllustration.parameters = emptyHeading;
WithDarkModeIllustration.args = {
  ...defaultStoryProps,
  illustrationTheme: 'dark',
};

export const WithAction = Template.bind({});
WithAction.parameters = emptyHeading;
WithAction.args = {
  ...defaultStoryProps,
  action: false,
};

export const WithActionIconButton = Template.bind({});
WithActionIconButton.parameters = emptyHeading;
WithActionIconButton.args = {
  ...defaultStoryProps,
  action: true,
};

export const WithLink = Template.bind({});
WithLink.parameters = emptyHeading;
WithLink.args = {
  ...defaultStoryProps,
  link: {
    text: 'Learn about tags',
    href: '#',
  },
};

export const WithActionAndLink = Template.bind({});
WithActionAndLink.parameters = emptyHeading;
WithActionAndLink.args = {
  ...defaultStoryProps,
  action: true,
  link: {
    text: 'Learn about tags',
    href: '#',
  },
};
