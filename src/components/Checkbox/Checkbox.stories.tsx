/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and icons from @afframe/ui, AI label story styles as plain CSS, source tag, story names unified, Single follows its checked control, Disabled, ReadOnly, Invalid and Warning stories, Afframe example data. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import '../AILabel/ailabel-story.css';
import {
  AILabel,
  AILabelActions,
  AILabelContent,
  Button,
  Checkbox,
  CheckboxGroup,
  CheckboxSkeleton,
  IconButton,
} from '../../index.js';
import type { AILabelProps } from '../../index.js';
import { FolderOpen, Folders, View } from '../../icons.js';
import mdx from './Checkbox.mdx';

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
  subcomponents: {
    CheckboxGroup,
    CheckboxSkeleton,
  },
  tags: ['carbon'],
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof Checkbox>;

const groupArgs = {
  disabled: false,
  helperText: 'Sent by email',
  invalid: false,
  invalidText: 'Choose at least one notification.',
  legendText: 'Notifications',
  orientation: 'vertical',
  readOnly: false,
  warn: false,
  warnText: 'Without notifications, overdue invoices can go unnoticed.',
} as const;

const groupArgTypes = {
  disabled: {
    description: 'Specify whether the checkbox group is disabled',
    control: {
      type: 'boolean',
    },
  },
  helperText: {
    description: 'Provide text for the form group for additional help',
    control: {
      type: 'text',
    },
  },
  invalid: {
    description: 'Specify whether the form group is currently invalid',
    control: {
      type: 'boolean',
    },
  },
  invalidText: {
    description:
      'Provide the text that is displayed when the form group is in an invalid state',
    control: {
      type: 'text',
    },
  },
  legendText: {
    description:
      'Provide the text to be rendered inside of the fieldset `<legend>`',
    control: {
      type: 'text',
    },
  },
  readOnly: {
    description: 'Specify whether the CheckboxGroup is read-only',
    control: {
      type: 'boolean',
    },
  },
  warn: {
    description: 'Specify whether the form group is currently in warning state',
    control: {
      type: 'boolean',
    },
  },
  warnText: {
    description:
      'Provide the text that is displayed when the form group is in warning state',
    control: {
      type: 'text',
    },
  },
  orientation: {
    description: 'Provide how checkbox should be displayed',
    control: 'select',
    options: ['horizontal', 'vertical'],
  },
} as const;

const groupControls = [
  'disabled',
  'helperText',
  'invalid',
  'invalidText',
  'legendText',
  'orientation',
  'readOnly',
  'warn',
  'warnText',
];

const checkboxArgs = {
  checked: false,
  disabled: false,
  helperText: 'Sent every Monday',
  hideLabel: false,
  indeterminate: false,
  invalid: false,
  invalidText: 'Choose at least one notification.',
  labelText: 'Weekly summary',
  readOnly: false,
  title: '',
  warn: false,
  warnText: 'Without the summary, overdue invoices can go unnoticed.',
};

const checkboxArgTypes = {
  checked: {
    control: {
      type: 'boolean',
    },
  },
  disabled: {
    control: {
      type: 'boolean',
    },
  },
  helperText: {
    control: {
      type: 'text',
    },
  },
  hideLabel: {
    control: {
      type: 'boolean',
    },
  },
  indeterminate: {
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
  readOnly: {
    control: {
      type: 'boolean',
    },
  },
  title: {
    control: {
      type: 'text',
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
} as const;

const checkboxControls = Object.keys(checkboxArgTypes);

export const Default: StoryFn<typeof CheckboxGroup> = ({
  readOnly,
  ...args
}) => (
  <CheckboxGroup {...args} {...(readOnly ? { readOnly } : {})}>
    <Checkbox labelText="Payment received" id="checkbox-label-1" />
    <Checkbox labelText="Invoice overdue" id="checkbox-label-2" />
  </CheckboxGroup>
);

Default.args = {
  ...groupArgs,
};

Default.argTypes = { ...groupArgTypes };

Default.parameters = {
  controls: {
    include: groupControls,
  },
};

export const Horizontal: StoryFn<typeof CheckboxGroup> = ({
  readOnly,
  ...args
}) => {
  return (
    <CheckboxGroup {...args} {...(readOnly ? { readOnly } : {})}>
      <Checkbox labelText="Payment received" id="checkbox-label-1" />
      <Checkbox labelText="Invoice overdue" id="checkbox-label-2" />
      <Checkbox labelText="Weekly summary" id="checkbox-label-3" />
    </CheckboxGroup>
  );
};

Horizontal.args = {
  ...groupArgs,
  orientation: 'horizontal',
};

Horizontal.argTypes = {
  ...groupArgTypes,
  orientation: {
    ...groupArgTypes.orientation,
    table: {
      readonly: true,
    },
  },
};

Horizontal.parameters = {
  controls: {
    include: groupControls,
  },
};

export const Disabled = Default.bind({});
Disabled.args = { ...Default.args, disabled: true };
Disabled.argTypes = Default.argTypes;
Disabled.parameters = Default.parameters;

export const ReadOnly = Default.bind({});
ReadOnly.args = { ...Default.args, readOnly: true };
ReadOnly.argTypes = Default.argTypes;
// Carbon puts aria-readonly on the group's fieldset, which the group role does
// not allow (upstream issue drafted, not filed).
ReadOnly.parameters = {
  ...Default.parameters,
  a11y: {
    config: { rules: [{ id: 'aria-allowed-attr', enabled: false }] },
  },
};

// Carbon sets no aria-invalid and does not link the error text to the
// group (upstream issue drafted, not filed).
export const Invalid = Default.bind({});
Invalid.args = { ...Default.args, invalid: true };
Invalid.argTypes = Default.argTypes;
Invalid.parameters = Default.parameters;

export const Warning = Default.bind({});
Warning.args = { ...Default.args, warn: true };
Warning.argTypes = Default.argTypes;
Warning.parameters = Default.parameters;

export const Single: StoryFn<typeof Checkbox> = (args) => {
  const [, updateArgs] = useArgs();

  return (
    <Checkbox
      {...args}
      id="checkbox-single"
      onChange={(event, data) => {
        updateArgs({ checked: data.checked });
        args.onChange?.(event, data);
      }}
    />
  );
};

Single.args = {
  ...checkboxArgs,
};

Single.argTypes = {
  ...checkboxArgTypes,
};

Single.parameters = {
  controls: {
    include: checkboxControls,
  },
};

export const Skeleton: StoryFn<typeof CheckboxSkeleton> = (args) => (
  <CheckboxSkeleton {...args} />
);

Skeleton.parameters = {
  controls: {
    disable: true,
  },
};

export const WithAILabel: StoryFn<typeof CheckboxGroup> = ({
  readOnly,
  ...args
}) => {
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
      <CheckboxGroup
        decorator={AILabelFunc()}
        {...args}
        {...(readOnly ? { readOnly } : {})}>
        <Checkbox labelText="Payment received" id="checkbox-label-1" />
        <Checkbox labelText="Invoice overdue" id="checkbox-label-2" />
        <Checkbox labelText="Weekly summary" id="checkbox-label-3" />
      </CheckboxGroup>

      <CheckboxGroup {...args} {...(readOnly ? { readOnly } : {})}>
        <Checkbox
          labelText="Payment received"
          id="checkbox-label-4"
          decorator={AILabelFunc()}
        />
        <Checkbox
          labelText="Invoice overdue"
          id="checkbox-label-5"
          decorator={AILabelFunc()}
        />
        <Checkbox labelText="Weekly summary" id="checkbox-label-6" />
      </CheckboxGroup>

      <CheckboxGroup {...args} {...(readOnly ? { readOnly } : {})}>
        <Checkbox
          labelText="Payment received"
          id="checkbox-label-7"
          decorator={AILabelFunc('inline')}
        />
        <Checkbox
          labelText="Invoice overdue"
          id="checkbox-label-8"
          decorator={AILabelFunc('inline')}
        />
        <Checkbox labelText="Weekly summary" id="checkbox-label-9" />
      </CheckboxGroup>
    </div>
  );
};

WithAILabel.args = {
  ...groupArgs,
  helperText: '',
};

WithAILabel.argTypes = { ...groupArgTypes };

WithAILabel.parameters = {
  controls: {
    include: groupControls,
  },
};
