/**
 * Copyright IBM Corp. 2022, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2022, 2024
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, EditInPlace from @afframe/ui, DisplayBox replaced by a div, story styles converted from SCSS to plain CSS, StoryDocsPage and the unused className dropped, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { EditInPlace, type EditInplaceProps } from '../../index.js';
import './edit-in-place-story.css';

const storyClass = 'edit-in-place-example';

const tooltipAlignmentOptions = {
  'Default / undefined': undefined,
  'All top': 'top',
  'All top-left': 'top-left',
  'All top-right': 'top-right',
  'All bottom': 'bottom',
  'All bottom-left': 'bottom-left',
  'All bottom-right': 'bottom-right',
  'All left': 'left',
  'All right': 'right',
  'Edit and save right, cancel left': {
    edit: 'right',
    cancel: 'left',
    save: 'right',
  },
};

type StoryArgs = EditInplaceProps & { containerWidth: number };

export default {
  title: 'Components/EditInPlace',
  component: EditInPlace,
  tags: ['ibm-products'],
  argTypes: {
    containerWidth: {
      control: { type: 'range', min: 20, max: 800, step: 10 },
      description:
        'Controls containing element width. Used for demonstration purposes, not property of the component.',
    },
    tooltipAlignment: {
      control: {
        type: 'select',
        labels: Object.keys(tooltipAlignmentOptions),
      },
      options: Object.values(tooltipAlignmentOptions).map((_k, i) => i),
      mapping: Object.values(tooltipAlignmentOptions),
    },
  },
  decorators: [
    (story) => <div className={`${storyClass}__viewport`}>{story()}</div>,
  ],
} satisfies Meta<StoryArgs>;

const actionSave = action('save');
const actionChange = action('change');
const actionCancel = action('cancel');
const actionBlur = action('blur');

const defaultProps: StoryArgs = {
  cancelLabel: 'Cancel',
  containerWidth: 300,
  editLabel: 'Edit',
  id: 'story-id',
  invalid: false,
  invalidText: 'This field is required',
  labelText: 'Label text',
  onCancel: () => {},
  onChange: () => {},
  onSave: () => {},
  // onBlur is intentionally omitted to use default auto-save/cancel behavior
  readOnlyToggleTipText: 'This field is read-only and cannot be edited',
  toggleTipAlignment: 'bottom',
  saveLabel: 'Save',
  value: 'default',
  placeholder: 'placeholder text',
};

const Template: StoryFn<StoryArgs> = ({ containerWidth, ...args }) => {
  const [value, setValue] = useState(defaultProps.value);

  const onChange = (val: string) => {
    setValue(val);
    actionChange(val);
  };

  const onSave = () => {
    actionSave(value);
  };

  const onCancel = (initialVal: string) => {
    setValue(initialVal);
    actionCancel(initialVal);
  };

  const props = {
    ...args,
    value,
    onChange,
    onSave,
    onCancel,
  };

  return (
    <div style={{ width: containerWidth }}>
      <EditInPlace {...props} />
    </div>
  );
};

const TemplateBlur: StoryFn<StoryArgs> = ({ containerWidth, ...args }) => {
  const [value, setValue] = useState(defaultProps.value);

  const onChange = (val: string) => {
    setValue(val);
    actionChange(val);
  };

  const onSave = () => {
    // Update parent state so the value prop changes and component can sync initialValue
    setValue(value);
    actionSave(value);
  };

  const onCancel = (initialVal: string) => {
    setValue(initialVal);
    actionCancel(initialVal);
  };

  const onBlur = (initialVal: string) => {
    const shouldSaveValue = false;
    if (shouldSaveValue) {
      // Update parent state when saving via blur
      setValue(value);
      actionSave(value);
    } else {
      setValue(initialVal);
      actionCancel(initialVal);
    }
    actionBlur(initialVal);
  };

  const props = {
    ...args,
    value,
    onChange,
    onSave,
    onCancel,
    onBlur,
  };

  return (
    <div style={{ width: containerWidth }}>
      <EditInPlace {...props} />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  ...defaultProps,
};

export const Invalid = Template.bind({});
Invalid.args = {
  ...defaultProps,
  invalid: true,
};

export const CustomBlurFunction = TemplateBlur.bind({});
CustomBlurFunction.args = {
  ...defaultProps,
};

export const ReadOnly = Template.bind({});
ReadOnly.args = {
  ...defaultProps,
  readOnly: true,
  readOnlyLabel: 'Edit off',
};
// IBM's read-only mode renders an IconButton inside the ToggletipButton.
ReadOnly.parameters = {
  a11y: {
    config: { rules: [{ id: 'nested-interactive', enabled: false }] },
  },
};
