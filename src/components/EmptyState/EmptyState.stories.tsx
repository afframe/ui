/**
 * Copyright IBM Corp. 2020, 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2020, 2025
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and icons from @afframe/ui, source tag, Stackblitz removed, illustration loaded by URL, the action logs through Storybook actions only, customer data, decorative illustration with empty alt, links to #, headingAs in meta args, the action boolean control split from the component props, story names unified. Apache-2.0 text: LICENSES/Apache-2.0.txt.
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
  title: 'Components/Empty States/EmptyState',
  component: EmptyState,
  tags: ['ibm-products'],
  args: { headingAs: 'h3' },
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
  title: 'No customers yet',
  subtitle: 'default',
};

const Template: StoryFn<TemplateArgs> = ({ ...args }) => {
  const { subtitle, action, ...rest } = args;

  const getSubTitle = () => 'Add a customer to send them invoices.';
  const getSubTitleWithTooltip = () => {
    return (
      <>
        Add a customer to send them invoices.
        <Tooltip label="A customer is a company or person you invoice">
          <Information size="16" />
        </Tooltip>
      </>
    );
  };

  const getAction = (icon = false) => {
    const actionObj = {
      text: 'Add customer',
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
  illustrationDescription: '',
};

export const WithAction = Template.bind({});
WithAction.args = {
  ...emptyStateCommonProps,
  action: false,
};

export const WithActionIconButton = Template.bind({});
WithActionIconButton.args = {
  ...emptyStateCommonProps,
  action: true,
};

export const WithLink = Template.bind({});
WithLink.args = {
  ...emptyStateCommonProps,
  link: {
    text: 'Import customers',
    href: '#',
  },
};

export const WithActionAndLink = Template.bind({});
WithActionAndLink.args = {
  ...emptyStateCommonProps,
  action: true,
  link: {
    text: 'Import customers',
    href: '#',
  },
};
