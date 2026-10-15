/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2023
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and icons from @afframe/ui, AI label story styles as plain CSS, source tag, story names unified, hideLabel kept off the group, every story takes args, Disabled, ReadOnly, Invalid and Warning stories, Afframe example data. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import '../AILabel/ailabel-story.css';
import {
  AILabel,
  AILabelActions,
  AILabelContent,
  Button,
  IconButton,
  RadioButton,
  RadioButtonGroup,
  RadioButtonSkeleton,
} from '../../index.js';
import type { AILabelProps, RadioButtonGroupProps } from '../../index.js';
import { FolderOpen, Folders, View } from '../../icons.js';
import mdx from './RadioButton.mdx';

export default {
  title: 'Components/RadioButton',
  component: RadioButton,
  subcomponents: {
    RadioButtonGroup,
    RadioButtonSkeleton,
  },
  argTypes: {
    checked: {
      table: {
        disable: true,
      },
    },
    defaultChecked: {
      table: {
        disable: true,
      },
    },
  },
  tags: ['carbon'],
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof RadioButton>;

const groupArgs = {
  disabled: false,
  helperText: 'Shown on the invoice',
  invalid: false,
  invalidText: 'Choose a payment method.',
  readOnly: false,
  warn: false,
  warnText: 'Cash payments are not matched to invoices automatically.',
};

const groupArgTypes = {
  disabled: {
    description: 'Specify whether the RadioButtonGroup is disabled',
    control: {
      type: 'boolean',
    },
  },
  readOnly: {
    description: 'Specify whether the RadioButtonGroup is read-only',
    control: {
      type: 'boolean',
    },
  },
  helperText: {
    description:
      'Provide text that is used alongside the control label for additional help',
    control: {
      type: 'text',
    },
  },
  invalid: {
    description: 'Specify whether the RadioButtonGroup is invalid',
    control: {
      type: 'boolean',
    },
  },
  invalidText: {
    description:
      'Provide the text that is displayed when the control is in an invalid state',
    control: {
      type: 'text',
    },
  },
  legendText: {
    description: 'Provide the text to be rendered inside of the `<legend>`',
    control: {
      type: 'text',
    },
  },
  orientation: {
    description: 'Provide how radio buttons should be displayed',
    control: 'select',
    options: ['horizontal', 'vertical'],
  },
  warn: {
    description: 'Specify whether the control is currently in warning state',
    control: {
      type: 'boolean',
    },
  },
  warnText: {
    description:
      'Provide the text that is displayed when the control is in warning state',
    control: {
      type: 'text',
    },
  },
} as const;

type GroupStoryArgs = Partial<RadioButtonGroupProps>;

export const Default: StoryFn<GroupStoryArgs & { hideLabel: boolean }> = ({
  hideLabel,
  ...args
}) => {
  return (
    <RadioButtonGroup name="radio-button-default-group" {...args}>
      <RadioButton
        labelText="Bank transfer"
        value="bank-transfer"
        id="radio-1"
        hideLabel={hideLabel}
      />
      <RadioButton
        labelText="Card"
        value="card"
        id="radio-2"
        hideLabel={hideLabel}
      />
      <RadioButton
        labelText="Cash"
        value="cash"
        id="radio-3"
        hideLabel={hideLabel}
      />
    </RadioButtonGroup>
  );
};

Default.args = {
  ...groupArgs,
  defaultSelected: 'card',
  hideLabel: false,
  legendText: 'Payment method',
};

Default.argTypes = {
  ...groupArgTypes,
  defaultSelected: {
    description: 'Specify the `<RadioButton>` to be selected by default',
    options: ['bank-transfer', 'card', 'cash'],
    control: {
      type: 'select',
    },
  },
  hideLabel: {
    description:
      'Specify whether the label should be visually hidden but still available to screen readers',
    control: {
      type: 'boolean',
    },
  },
};

export const Vertical: StoryFn<GroupStoryArgs> = (args) => {
  return (
    <RadioButtonGroup name="radio-button-vertical-group" {...args}>
      <RadioButton
        labelText="Bank transfer"
        value="bank-transfer"
        id="radio-1"
      />
      <RadioButton labelText="Card" value="card" id="radio-2" />
      <RadioButton labelText="Cash" value="cash" id="radio-3" disabled />
    </RadioButtonGroup>
  );
};

Vertical.args = {
  ...groupArgs,
  defaultSelected: 'bank-transfer',
  legendText: 'Payment method',
  orientation: 'vertical',
};

Vertical.argTypes = { ...groupArgTypes };

export const Disabled = Default.bind({});
Disabled.args = { ...Default.args, disabled: true };
Disabled.argTypes = Default.argTypes;

export const ReadOnly = Default.bind({});
ReadOnly.args = { ...Default.args, readOnly: true };
ReadOnly.argTypes = Default.argTypes;

// Carbon sets no aria-invalid and does not link the error text to the
// group (an upstream bug).
export const Invalid = Default.bind({});
Invalid.args = { ...Default.args, invalid: true };
Invalid.argTypes = Default.argTypes;

export const Warning = Default.bind({});
Warning.args = { ...Default.args, warn: true };
Warning.argTypes = Default.argTypes;

export const Skeleton: StoryFn<typeof RadioButtonSkeleton> = (args) => {
  return <RadioButtonSkeleton {...args} />;
};

Skeleton.parameters = {
  controls: { include: ['className'] },
};

export const WithAILabel: StoryFn<GroupStoryArgs> = (args) => {
  const AILabelFunc = (kind: AILabelProps['kind'] = 'default') => (
    <AILabel className="ai-label-container" kind={kind}>
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
    <div className="ai-label-check-radio-container">
      <RadioButtonGroup
        decorator={AILabelFunc('default')}
        orientation="vertical"
        legendText="Payment method"
        name="radio-button-group"
        defaultSelected="radio-1"
        {...args}>
        <RadioButton labelText="Bank transfer" value="radio-1" id="radio-1" />
        <RadioButton labelText="Card" value="radio-2" id="radio-2" />
        <RadioButton labelText="Cash" value="radio-3" id="radio-3" />
      </RadioButtonGroup>

      <RadioButtonGroup
        orientation="vertical"
        legendText="Payment method"
        name="radio-button-group-2"
        defaultSelected="radio-4"
        {...args}>
        <RadioButton
          labelText="Bank transfer"
          value="radio-4"
          id="radio-4"
          decorator={AILabelFunc()}
        />
        <RadioButton
          labelText="Card"
          value="radio-5"
          id="radio-5"
          decorator={AILabelFunc()}
        />
        <RadioButton labelText="Cash" value="radio-6" id="radio-6" />
      </RadioButtonGroup>

      <RadioButtonGroup
        orientation="vertical"
        legendText="Payment method"
        name="radio-button-group-3"
        defaultSelected="radio-7"
        {...args}>
        <RadioButton
          labelText="Bank transfer"
          value="radio-7"
          id="radio-7"
          decorator={AILabelFunc('inline')}
        />
        <RadioButton
          labelText="Card"
          value="radio-8"
          id="radio-8"
          decorator={AILabelFunc('inline')}
        />
        <RadioButton labelText="Cash" value="radio-9" id="radio-9" />
      </RadioButtonGroup>
    </div>
  );
};

WithAILabel.args = { ...groupArgs, helperText: '' };

WithAILabel.argTypes = { ...groupArgTypes };
