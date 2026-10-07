/**
 * Copyright IBM Corp. 2020, 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2020, 2025
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and icons from @afframe/ui, source tag, Stackblitz removed, illustration loaded by URL, console.log fallback kept, the action boolean control split from the component props. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { action as storybookAction } from 'storybook/actions';
import { Add, Information } from '../../icons.js';
import { EmptyState, Tooltip } from '../../index.js';
import type { EmptyStateProps } from '../../index.js';
import mdx from './EmptyState.mdx';

const CustomIllustration = new URL(
  './story-assets/empty-state-bright-magnifying-glass.svg',
  import.meta.url
).href;

export default {
  title: 'Patterns/Prebuilt patterns/Empty states/EmptyState',
  component: EmptyState,
  tags: ['ibm-products'],
  argTypes: {
    subtitle: {
      control: {
        type: 'select',
        labels: {
          0: 'default',
          1: 'with tooltip',
        },
      },
      options: [0, 1],
      mapping: { 0: 'default', 1: 'withTooltip' },
    },
  },
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof EmptyState>;

type TemplateArgs = Omit<EmptyStateProps, 'action' | 'subtitle'> & {
  action?: boolean;
  subtitle?: string;
};

const emptyStateCommonProps = {
  title: 'Start by adding data assets',
  subtitle: 'default',
};

const Template: StoryFn<TemplateArgs> = ({ ...args }, context) => {
  const sbDocs = context.viewMode !== 'docs';
  const { subtitle, action, ...rest } = args;

  const getSubTitle = () => {
    return (
      <>
        Click <span>Upload assets</span> to upload your data
      </>
    );
  };
  const getSubTitleWithTooltip = () => {
    return (
      <>
        Click <span>here</span> to upload your data
        <Tooltip label="Facts and statistics collected together for reference or analysis">
          <Information size="16" />
        </Tooltip>
      </>
    );
  };

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
    <EmptyState
      {...rest}
      subtitle={
        subtitle === 'default' ? getSubTitle() : getSubTitleWithTooltip()
      }
      {...(typeof action === 'boolean' ? { action: getAction(action) } : {})}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  ...emptyStateCommonProps,
};

export const WithTooltipInSubtitle = Template.bind({});
WithTooltipInSubtitle.args = {
  ...emptyStateCommonProps,
  subtitle: 'withTooltip',
};

export const WithCustomIllustration = Template.bind({});
WithCustomIllustration.args = {
  ...emptyStateCommonProps,
  illustration: CustomIllustration,
  illustrationDescription: 'Test alt text',
};

export const withAction = Template.bind({});
withAction.args = {
  ...emptyStateCommonProps,
  action: false,
};

export const withActionIconButton = Template.bind({});
withActionIconButton.args = {
  ...emptyStateCommonProps,
  action: true,
};

export const withLink = Template.bind({});
withLink.args = {
  ...emptyStateCommonProps,
  link: {
    text: 'View documentation',
    href: 'https://www.carbondesignsystem.com',
    target: '_blank',
  },
};

export const withActionAndLink = Template.bind({});
withActionAndLink.args = {
  ...emptyStateCommonProps,
  action: true,
  link: {
    text: 'View documentation',
    href: 'https://www.carbondesignsystem.com',
  },
};
