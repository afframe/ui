/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, DefinitionTooltip from @afframe/ui, story styles as plain CSS, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ArgTypes, Meta, StoryFn } from '@storybook/react-vite';
import { DefinitionTooltip } from '../../index.js';
import type { DefinitionTooltipProps } from '../../index.js';
import mdx from './DefinitionTooltip.mdx';
import './story.css';

type DefinitionTooltipStoryArgs = DefinitionTooltipProps & {
  alignDeprecated?: DefinitionTooltipProps['align'];
};

const alignOptions = [
  'top',
  'top-start',
  'top-end',
  'bottom',
  'bottom-start',
  'bottom-end',
  'left',
  'left-start',
  'left-end',
  'right',
  'right-start',
  'right-end',
];

const deprecatedAlignOptions = [
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
  'left-bottom',
  'left-top',
  'right-bottom',
  'right-top',
];

const defaultArgs: Partial<DefinitionTooltipStoryArgs> = {
  align: 'bottom-start',
  autoAlign: false,
  defaultOpen: false,
  definition:
    'Uniform Resource Locator; the address of a resource (such as a document or website) on the Internet.',
  openOnHover: true,
};

const argTypes: Partial<ArgTypes<DefinitionTooltipStoryArgs>> = {
  align: {
    options: alignOptions,
    control: 'select',
  },
  alignDeprecated: {
    name: 'align (deprecated)',
    options: deprecatedAlignOptions,
    control: 'select',
    table: {
      category: 'Deprecated',
    },
  },
  autoAlign: {
    control: 'boolean',
  },
  definition: {
    control: 'text',
  },
  defaultOpen: {
    control: 'boolean',
  },
  openOnHover: {
    control: 'boolean',
  },
};

export default {
  title: 'Components/DefinitionTooltip',
  tags: ['carbon'],
  component: DefinitionTooltip,
  parameters: {
    controls: {
      hideNoControlsWarning: true,
      include: Object.keys(argTypes),
    },
    docs: {
      page: mdx,
    },
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="sb-tooltip-story sb-definition-tooltip">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<DefinitionTooltipStoryArgs>;
export const Default: StoryFn<DefinitionTooltipStoryArgs> = (args) => {
  const { align, alignDeprecated, ...rest } = args;
  const resolvedAlign = alignDeprecated || align;
  return (
    <p>
      Custom domains direct requests for your apps in this Cloud Foundry
      organization to a{' '}
      <DefinitionTooltip
        openOnHover
        {...(resolvedAlign ? { align: resolvedAlign } : {})}
        {...rest}>
        URL
      </DefinitionTooltip>{' '}
      that you own. A custom domain can be a shared domain, a shared subdomain,
      or a shared domain and host.
    </p>
  );
};

Default.args = { ...defaultArgs };
Default.argTypes = { ...argTypes };

export const WithLargeText: StoryFn<DefinitionTooltipStoryArgs> = (args) => {
  const { align, alignDeprecated, ...rest } = args;
  const resolvedAlign = alignDeprecated || align;
  return (
    <p>
      Custom domains direct requests for your apps in this Cloud Foundry
      organization to a{' '}
      <DefinitionTooltip
        openOnHover
        {...(resolvedAlign ? { align: resolvedAlign } : {})}
        {...rest}>
        URL that you own. A custom domain can be a shared domain,
      </DefinitionTooltip>{' '}
      a shared subdomain, or a shared domain and host.
    </p>
  );
};

WithLargeText.args = { ...defaultArgs };
WithLargeText.argTypes = { ...argTypes };
