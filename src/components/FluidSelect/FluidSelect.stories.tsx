/**
 * Copyright IBM Corp. 2022, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2022, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and icons from @afframe/ui, source tag, plain CSS story styles; unsupported light argType removed; decorator passed by spread (missing from types), story names unified, currency example data, state stories. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ArgTypes, Meta, StoryFn } from '@storybook/react-vite';
import { Information, View, FolderOpen, Folders } from '../../icons.js';
import {
  AILabel,
  AILabelActions,
  AILabelContent,
  Button,
  FluidSelect,
  FluidSelectSkeleton,
  IconButton,
  SelectItem,
  Toggletip,
  ToggletipButton,
  ToggletipContent,
  type FluidSelectProps,
} from '../../index.js';
import styles from './fluid-select-story.css?inline';
import mdx from './FluidSelect.mdx';

export default {
  title: 'Components/Fluid Inputs/FluidSelect',
  tags: ['carbon'],
  component: FluidSelect,
  subcomponents: {
    FluidSelectSkeleton,
  },
  decorators: [
    (Story) => (
      <>
        <style>{styles}</style>
        <Story />
      </>
    ),
  ],
  parameters: {
    styles,
    docs: {
      page: mdx,
    },
    controls: {
      exclude: ['defaultValue', 'id'],
    },
  },
} satisfies Meta<typeof FluidSelect>;

const sharedArgTypes: ArgTypes = {
  className: {
    control: {
      type: 'text',
    },
  },
  disabled: {
    control: {
      type: 'boolean',
    },
  },
  invalid: {
    control: {
      type: 'boolean',
    },
  },
  invalidText: {
    control: {
      type: 'text',
    },
  },
  labelText: {
    control: {
      type: 'text',
    },
  },
  onChange: {
    action: 'onChange',
  },
  readOnly: {
    control: {
      type: 'boolean',
    },
  },
  warn: {
    control: {
      type: 'boolean',
    },
  },
  warnText: {
    control: {
      type: 'text',
    },
  },
};

const sharedArgs = {
  className: 'test-class',
  disabled: false,
  invalid: false,
  invalidText: 'Choose a currency.',
  labelText: 'Currency',
  readOnly: false,
  warn: false,
  warnText: 'Your bank charges a fee for payments in this currency.',
};

const currencyItems = (
  <>
    <SelectItem value="" text="" />
    {['CZK', 'EUR', 'USD', 'GBP', 'PLN'].map((code) => (
      <SelectItem key={code} value={code} text={code} />
    ))}
  </>
);

const sharedControls = Object.keys(sharedArgTypes);
const widthArgType: ArgTypes[string] = {
  control: { type: 'range', min: 300, max: 800, step: 50 },
};

export const Default: StoryFn<FluidSelectProps & { defaultWidth?: number }> = (
  args
) => {
  const { defaultWidth, ...selectArgs } = args;
  return (
    <div className="fluid-select-story" style={{ width: defaultWidth }}>
      {/* Keep the toggletip outside `labelText`; interactive content is invalid in labels. */}
      <span className="fluid-select-story__toggletip">
        <Toggletip align="top-left">
          <ToggletipButton label="Show information">
            <Information />
          </ToggletipButton>
          <ToggletipContent>
            <p>Additional field information here.</p>
          </ToggletipContent>
        </Toggletip>
      </span>
      <FluidSelect {...selectArgs} id="select-1">
        {currencyItems}
      </FluidSelect>
    </div>
  );
};

Default.args = {
  ...sharedArgs,
  defaultWidth: 400,
};

Default.argTypes = {
  ...sharedArgTypes,
  defaultWidth: widthArgType,
};

Default.parameters = {
  controls: { include: [...sharedControls, 'defaultWidth'] },
};

export const WithAILabel: StoryFn<
  Partial<FluidSelectProps> & { defaultWidth?: number }
> = (args) => {
  const { defaultWidth, ...selectArgs } = args;
  const aiLabel = (
    <AILabel className="ai-label-container">
      <AILabelContent>
        <div>
          <p className="secondary">AI Explained</p>
          <h2 className="ai-label-heading">84%</h2>
          <p className="secondary bold">Confidence score</p>
          <p className="secondary">
            Lorem ipsum dolor sit amet, di os consectetur adipiscing elit, sed
            do eiusmod tempor incididunt ut fsil labore et dolore magna aliqua.
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
    <div style={{ width: defaultWidth }}>
      <FluidSelect
        id="select-1"
        labelText="Currency"
        // `decorator` is missing from FluidSelectProps in Carbon 11.119.0.
        {...{ decorator: aiLabel }}
        {...selectArgs}>
        {currencyItems}
      </FluidSelect>
    </div>
  );
};

WithAILabel.args = {
  ...sharedArgs,
  defaultWidth: 400,
};

WithAILabel.argTypes = {
  ...sharedArgTypes,
  defaultWidth: widthArgType,
};

WithAILabel.parameters = {
  controls: { include: [...sharedControls, 'defaultWidth'] },
};

export const Disabled: typeof Default = Default.bind({});
Disabled.args = { ...Default.args, disabled: true };
Disabled.argTypes = Default.argTypes;
// Carbon greys out disabled text below 4.5:1. WCAG 1.4.3 exempts inactive
// components, but axe checks the helper text anyway.
Disabled.parameters = {
  ...Default.parameters,
  a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } },
};

export const ReadOnly: typeof Default = Default.bind({});
ReadOnly.args = { ...Default.args, readOnly: true, defaultValue: 'EUR' };
ReadOnly.argTypes = Default.argTypes;
ReadOnly.parameters = Default.parameters;

export const Invalid: typeof Default = Default.bind({});
Invalid.args = { ...Default.args, invalid: true };
Invalid.argTypes = Default.argTypes;
Invalid.parameters = Default.parameters;

export const Warning: typeof Default = Default.bind({});
Warning.args = { ...Default.args, warn: true, defaultValue: 'PLN' };
Warning.argTypes = Default.argTypes;
Warning.parameters = Default.parameters;

export const Skeleton: StoryFn<FluidSelectProps & { defaultWidth?: number }> = (
  args
) => {
  const { defaultWidth } = args;
  return (
    <div style={{ width: defaultWidth }}>
      <FluidSelectSkeleton />
    </div>
  );
};

Skeleton.args = {
  defaultWidth: 400,
};

Skeleton.argTypes = {
  defaultWidth: widthArgType,
};

Skeleton.parameters = {
  controls: { include: ['defaultWidth'] },
};
