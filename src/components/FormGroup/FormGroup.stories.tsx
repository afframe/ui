/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2023
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, source tag, prop descriptions with tags in backticks, Disabled and Invalid stories, Afframe example data. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import {
  Button,
  FormGroup,
  RadioButton,
  RadioButtonGroup,
  Stack,
  TextInput,
} from '../../index.js';
import mdx from './FormGroup.mdx';

export default {
  title: 'Components/FormGroup',
  component: FormGroup,
  tags: ['carbon'],
  parameters: {
    docs: {
      page: mdx,
    },
    controls: {
      exclude: ['children'],
    },
  },
  // Carbon's descriptions say `<FormGroup>` without backticks; the props
  // table renders them as Markdown, so React logged an unknown-tag warning.
  argTypes: {
    invalid: { description: 'Specify whether the `<FormGroup>` is invalid' },
    message: {
      description:
        'Specify whether the message should be displayed in the `<FormGroup>`',
    },
    messageText: {
      description: 'Provide the text for the message in the `<FormGroup>`',
    },
  },
} satisfies Meta<typeof FormGroup>;

export const Default: StoryFn<typeof FormGroup> = (args) => {
  return (
    <FormGroup style={{ maxWidth: '400px' }} {...args}>
      <Stack gap={7}>
        <TextInput id="one" labelText="Street" />
        <TextInput id="two" labelText="City" />
        <TextInput id="three" labelText="Postal code" />
        <RadioButtonGroup
          legendText="Address type"
          name="formgroup-default-radio-button-group"
          defaultSelected="radio-1">
          <RadioButton labelText="Office" value="radio-1" id="radio-1" />
          <RadioButton labelText="Warehouse" value="radio-2" id="radio-2" />
          <RadioButton labelText="Other" value="radio-3" id="radio-3" />
        </RadioButtonGroup>
        <Button>Save</Button>
      </Stack>
    </FormGroup>
  );
};

Default.argTypes = {
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
  legendId: {
    control: {
      type: 'text',
    },
  },
  legendText: {
    control: {
      type: 'text',
    },
  },
  message: {
    control: {
      type: 'boolean',
    },
  },
  messageText: {
    control: {
      type: 'text',
    },
  },
};

Default.args = {
  className: 'some-class',
  disabled: false,
  invalid: false,
  legendId: 'form-group-1',
  legendText: 'Billing address',
  message: false,
  messageText: 'Invoices are sent to this address.',
};

export const Disabled = Default.bind({});
Disabled.args = { ...Default.args, disabled: true };
Disabled.argTypes = Default.argTypes;

// Carbon's `invalid` only sets `data-invalid` on the fieldset; the message
// shows through `message` and `messageText`.
export const Invalid = Default.bind({});
Invalid.args = {
  ...Default.args,
  invalid: true,
  message: true,
  messageText: 'Enter a postal code.',
};
Invalid.argTypes = Default.argTypes;
