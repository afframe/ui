/**
 * Copyright IBM Corp. 2020, 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2020, 2025
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and icons from @afframe/ui, source tag, Stackblitz removed, commented-out styles import dropped, console.log fallback kept, the action boolean control split from the component props. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { action as storybookAction } from 'storybook/actions';
import { Add } from '../../icons.js';
import { NoDataEmptyState } from '../../index.js';
import type { NoDataEmptyStateProps } from '../../index.js';
import mdx from './NoDataEmptyState.mdx';

export default {
  title: 'Patterns/Prebuilt patterns/Empty states/NoDataEmptyState',
  component: NoDataEmptyState,
  tags: ['ibm-products'],
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof NoDataEmptyState>;

type TemplateArgs = Omit<NoDataEmptyStateProps, 'action'> & {
  action?: boolean;
};

const defaultStoryProps = {
  headingAs: 'h3',
  title: 'Empty state title',
  subtitle: 'Description text explaining why this section is empty.',
  illustrationDescription: 'Test alt text',
};

const Template: StoryFn<TemplateArgs> = ({ ...args }, context) => {
  const sbDocs = context.viewMode !== 'docs';
  const { action, ...rest } = args;
  const getAction = (icon = false) => {
    const actionObj = {
      text: 'Create new',
      onClick: () => {
        if (sbDocs) {
          storybookAction('Clicked empty state action button')();
        } else {
          console.log('Clicked empty state action button');
        }
      },
    };

    if (icon) {
      return {
        ...actionObj,
        renderIcon: (props: object) => <Add size={20} {...props} />,
        iconDescription: 'Add icon',
      };
    }

    return actionObj;
  };
  return (
    <NoDataEmptyState
      {...rest}
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

export const withAction = Template.bind({});
withAction.args = {
  ...defaultStoryProps,
  action: false,
};

export const withActionIconButton = Template.bind({});
withActionIconButton.args = {
  ...defaultStoryProps,
  action: true,
};

export const withLink = Template.bind({});
withLink.args = {
  ...defaultStoryProps,
  link: {
    text: 'View documentation',
    href: 'https://www.carbondesignsystem.com',
  },
};

export const withActionAndLink = Template.bind({});
withActionAndLink.args = {
  ...defaultStoryProps,
  action: true,
  link: {
    text: 'View documentation',
    href: 'https://www.carbondesignsystem.com',
  },
};
