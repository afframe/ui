/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2023
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, source tag, story names unified, currency example data, state stories. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ComponentProps } from 'react';
import type { ArgTypes, Meta, StoryFn } from '@storybook/react-vite';
import { WithLayer as WithLayerTemplate } from '../../../.storybook/templates/WithLayer/index.js';
import { FolderOpen, Folders, View } from '../../icons.js';
import {
  AILabel,
  AILabelActions,
  AILabelContent,
  Button,
  IconButton,
  Select,
  SelectItem,
  SelectItemGroup,
  SelectSkeleton,
} from '../../index.js';
import mdx from './Select.mdx';

// Stories pass their own id.
type SelectStoryArgs = Omit<ComponentProps<typeof Select>, 'id'>;

export default {
  title: 'Components/Select',
  component: Select,
  tags: ['carbon'],
  argTypes: {
    light: {
      table: {
        disable: true,
      },
    },
  },
  decorators: [(story) => <div style={{ width: '400px' }}>{story()}</div>],
  subcomponents: {
    SelectItem,
    SelectItemGroup,
    SelectSkeleton,
  },
  parameters: {
    docs: {
      page: mdx,
    },
    controls: {
      exclude: ['id', 'defaultValue'],
    },
  },
} satisfies Meta<typeof Select>;

const sharedArgTypes = {
  disabled: {
    control: 'boolean',
  },
  helperText: {
    control: 'text',
  },
  hideLabel: {
    control: 'boolean',
  },
  inline: {
    control: 'boolean',
  },
  invalid: {
    control: 'boolean',
  },
  invalidText: {
    control: 'text',
  },
  labelText: {
    control: 'text',
  },
  onChange: {
    action: 'onChange',
  },
  readOnly: {
    control: 'boolean',
  },
  size: {
    control: 'select',
    options: ['xs', 'sm', 'md', 'lg'],
  },
  warn: {
    control: 'boolean',
  },
  warnText: {
    control: 'text',
  },
} satisfies ArgTypes<SelectStoryArgs>;

const sharedArgs = {
  disabled: false,
  helperText: 'Used on new invoices',
  hideLabel: false,
  inline: false,
  invalid: false,
  invalidText: 'Choose a currency.',
  labelText: 'Currency',
  readOnly: false,
  size: 'md',
  warn: false,
  warnText: 'Your bank charges a fee for payments in this currency.',
} satisfies SelectStoryArgs;

const sharedControls = Object.keys(sharedArgTypes);

const selectItems = (
  <>
    <SelectItem value="" text="Choose a currency" />
    {['CZK', 'EUR', 'USD', 'GBP', 'PLN'].map((code) => (
      <SelectItem key={code} value={code} text={code} />
    ))}
  </>
);

export const Default: StoryFn<SelectStoryArgs> = (args) => {
  return (
    <div>
      <Select id="select-1" {...args}>
        {selectItems}
      </Select>
    </div>
  );
};

Default.args = {
  ...sharedArgs,
};

Default.argTypes = {
  ...sharedArgTypes,
};

Default.parameters = {
  controls: { include: sharedControls },
};

export const Inline: StoryFn<SelectStoryArgs> = (args) => {
  return (
    <div>
      <Select inline id="select-1" {...args}>
        {selectItems}
      </Select>
    </div>
  );
};

Inline.args = {
  ...sharedArgs,
  inline: true,
};

Inline.argTypes = {
  ...sharedArgTypes,
  inline: {
    ...sharedArgTypes.inline,
    table: { readonly: true },
  },
};

Inline.parameters = {
  controls: { include: sharedControls },
};

export const Disabled: StoryFn<SelectStoryArgs> = Default.bind({});
Disabled.args = { ...sharedArgs, disabled: true };
Disabled.argTypes = { ...sharedArgTypes };
// Carbon greys out disabled text below 4.5:1. WCAG 1.4.3 exempts inactive
// components, but axe checks the helper text anyway.
Disabled.parameters = {
  controls: { include: sharedControls },
  a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } },
};

export const ReadOnly: StoryFn<SelectStoryArgs> = Default.bind({});
ReadOnly.args = { ...sharedArgs, readOnly: true, defaultValue: 'EUR' };
ReadOnly.argTypes = { ...sharedArgTypes };
ReadOnly.parameters = { controls: { include: sharedControls } };

export const Invalid: StoryFn<SelectStoryArgs> = Default.bind({});
Invalid.args = { ...sharedArgs, invalid: true };
Invalid.argTypes = { ...sharedArgTypes };
Invalid.parameters = { controls: { include: sharedControls } };

export const Warning: StoryFn<SelectStoryArgs> = Default.bind({});
Warning.args = { ...sharedArgs, warn: true, defaultValue: 'PLN' };
Warning.argTypes = { ...sharedArgTypes };
Warning.parameters = { controls: { include: sharedControls } };

export const Skeleton: StoryFn<typeof SelectSkeleton> = (args) => {
  return <SelectSkeleton {...args} />;
};

Skeleton.args = {
  hideLabel: false,
};

Skeleton.argTypes = {
  hideLabel: {
    control: 'boolean',
  },
};

Skeleton.parameters = {
  controls: { include: ['hideLabel'] },
};

export const WithLayer: StoryFn<SelectStoryArgs> = (args) => (
  <WithLayerTemplate>
    {(layer) => (
      <Select id={`select-${layer}`} {...args}>
        {selectItems}
      </Select>
    )}
  </WithLayerTemplate>
);

WithLayer.args = {
  ...sharedArgs,
};

WithLayer.argTypes = {
  ...sharedArgTypes,
};

WithLayer.parameters = {
  controls: { include: sharedControls },
};

export const WithAILabel: StoryFn<SelectStoryArgs> = (args) => {
  const aiLabel = (
    <AILabel className="ai-label-container">
      <AILabelContent>
        <div>
          <p className="secondary">AI Explained</p>
          <h2 className="ai-label-heading">84%</h2>
          <p className="secondary bold">Confidence score</p>
          <p className="secondary">
            This recommendation is based on the currency of this customer's
            earlier invoices.
          </p>
          <hr />
          <p className="secondary">Model type</p>
          <p className="bold">Foundation model</p>
        </div>
        <AILabelActions>
          <IconButton kind="ghost" label="View">
            <View />
          </IconButton>
          <IconButton kind="ghost" label="Open Folder">
            <FolderOpen />
          </IconButton>
          <IconButton kind="ghost" label="Folders">
            <Folders />
          </IconButton>
          <Button>View details</Button>
        </AILabelActions>
      </AILabelContent>
    </AILabel>
  );

  return (
    <div>
      <Select id="select-1" decorator={aiLabel} {...args}>
        {selectItems}
      </Select>
    </div>
  );
};

WithAILabel.args = {
  ...sharedArgs,
};

WithAILabel.argTypes = {
  ...sharedArgTypes,
};

WithAILabel.parameters = {
  controls: { include: sharedControls },
};
