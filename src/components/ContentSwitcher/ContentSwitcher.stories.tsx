/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and icons from @afframe/ui, table default summaries as strings, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { WithLayer } from '../../../.storybook/templates/WithLayer/index.js';
import { ContentSwitcher, IconSwitch, Switch } from '../../index.js';
import type { ContentSwitcherProps } from '../../index.js';
import { TableOfContents, ViewMode_2, Workspace } from '../../icons.js';
import mdx from './ContentSwitcher.mdx';

type StoryArgs = ContentSwitcherProps & { disabled: boolean };

const sharedArgs = {
  disabled: false,
  lowContrast: false,
  selectedIndex: 0,
  selectionMode: 'automatic',
  size: 'md',
} as const;

const sharedArgTypes = {
  children: {
    control: false,
  },
  className: {
    control: false,
  },
  disabled: {
    control: 'boolean',
    description: 'Specify disabled attribute to true to disable a button.',
    table: {
      type: { summary: 'bool' },
      defaultValue: { summary: 'false' },
    },
  },
  lowContrast: {
    control: 'boolean',
    table: {
      defaultValue: { summary: 'false' },
    },
  },
  onChange: {
    action: 'onChange',
  },
  selectedIndex: {
    control: {
      type: 'number',
      min: 0,
      max: 2,
      step: 1,
    },
    table: {
      defaultValue: { summary: '0' },
    },
  },
  selectionMode: {
    control: 'radio',
    options: ['automatic', 'manual'],
    table: {
      defaultValue: { summary: '"automatic"' },
    },
  },
  size: {
    control: 'radio',
    options: ['sm', 'md', 'lg'],
    table: {
      defaultValue: { summary: '"md"' },
    },
  },
} as const;

const sharedParameters = {
  controls: {
    include: Object.keys(sharedArgs),
  },
};

export default {
  title: 'Components/ContentSwitcher',
  component: ContentSwitcher,
  subcomponents: {
    IconSwitch,
    Switch,
  },
  parameters: {
    docs: {
      page: mdx,
    },
    ...sharedParameters,
  },
  tags: ['carbon'],
} satisfies Meta<typeof ContentSwitcher>;

export const Default: StoryFn<StoryArgs> = (args) => {
  return (
    <ContentSwitcher {...args}>
      <Switch name="one" text="First section" disabled={args.disabled} />
      <Switch name="two" text="Second section" disabled={args.disabled} />
      <Switch name="three" text="Third section" disabled={args.disabled} />
    </ContentSwitcher>
  );
};

Default.args = { ...sharedArgs };
Default.argTypes = { ...sharedArgTypes };

export const _WithLayer: StoryFn<StoryArgs> = (args) => {
  return (
    <WithLayer>
      <ContentSwitcher {...args}>
        <Switch name="one" text="First section" disabled={args.disabled} />
        <Switch name="two" text="Second section" disabled={args.disabled} />
        <Switch name="three" text="Third section" disabled={args.disabled} />
      </ContentSwitcher>
    </WithLayer>
  );
};

_WithLayer.args = { ...sharedArgs };
_WithLayer.argTypes = { ...sharedArgTypes };

export const IconOnly: StoryFn<StoryArgs> = (args) => {
  return (
    <ContentSwitcher {...args}>
      <IconSwitch name="one" text="Table of Contents" disabled={args.disabled}>
        <TableOfContents />
      </IconSwitch>
      <IconSwitch name="two" text="Workspace Test" disabled={args.disabled}>
        <Workspace />
      </IconSwitch>
      <IconSwitch name="three" text="View Mode" disabled={args.disabled}>
        <ViewMode_2 />
      </IconSwitch>
    </ContentSwitcher>
  );
};

IconOnly.args = { ...sharedArgs };
IconOnly.argTypes = { ...sharedArgTypes };

export const IconOnlyWithLayer: StoryFn<StoryArgs> = (args) => {
  return (
    <WithLayer>
      <ContentSwitcher {...args}>
        <IconSwitch
          name="one"
          text="Table of Contents"
          disabled={args.disabled}>
          <TableOfContents />
        </IconSwitch>
        <IconSwitch name="two" text="Workspace Test" disabled={args.disabled}>
          <Workspace />
        </IconSwitch>
        <IconSwitch name="three" text="View Mode" disabled={args.disabled}>
          <ViewMode_2 />
        </IconSwitch>
      </ContentSwitcher>
    </WithLayer>
  );
};

IconOnlyWithLayer.args = { ...sharedArgs };
IconOnlyWithLayer.argTypes = { ...sharedArgTypes };

export const lowContrast: StoryFn<StoryArgs> = (args) => {
  return (
    <ContentSwitcher {...args}>
      <Switch name="one" text="First section" disabled={args.disabled} />
      <Switch name="two" text="Second section" disabled={args.disabled} />
      <Switch name="three" text="Third section" disabled={args.disabled} />
    </ContentSwitcher>
  );
};

lowContrast.args = {
  ...sharedArgs,
  lowContrast: true,
};
lowContrast.argTypes = {
  ...sharedArgTypes,
  lowContrast: {
    ...sharedArgTypes.lowContrast,
    table: {
      ...sharedArgTypes.lowContrast.table,
      readonly: true,
    },
  },
};

export const lowContrastIconOnly: StoryFn<StoryArgs> = ({
  disabled,
  ...args
}) => (
  <ContentSwitcher {...args}>
    <IconSwitch name="one" text="Table of Contents" disabled={disabled}>
      <TableOfContents />
    </IconSwitch>
    <IconSwitch name="two" text="Workspace Test" disabled={disabled}>
      <Workspace />
    </IconSwitch>
    <IconSwitch name="three" text="View Mode" disabled={disabled}>
      <ViewMode_2 />
    </IconSwitch>
  </ContentSwitcher>
);

lowContrastIconOnly.args = {
  ...sharedArgs,
  lowContrast: true,
};
lowContrastIconOnly.argTypes = {
  ...sharedArgTypes,
  lowContrast: {
    ...sharedArgTypes.lowContrast,
    table: {
      ...sharedArgTypes.lowContrast.table,
      readonly: true,
    },
  },
};
