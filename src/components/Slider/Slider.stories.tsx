/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, noValidate (not a Slider prop) removed, source tag, story names unified, Disabled, ReadOnly, Invalid and Warning stories, prop docs written out. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useEffect, useState } from 'react';
import type { ArgTypes, Meta, StoryFn } from '@storybook/react-vite';
import { WithLayer as WithLayerTemplate } from '../../../.storybook/templates/WithLayer/index.js';
import { Slider, SliderSkeleton } from '../../index.js';
import type { SliderProps, SliderSkeletonProps } from '../../index.js';
import mdx from './Slider.mdx';

export default {
  title: 'Components/Slider',
  component: Slider,
  tags: ['carbon'],
  subcomponents: {
    SliderSkeleton,
  },
  parameters: {
    docs: {
      page: mdx,
    },
  },
  // Carbon's prop docs from its 1.118 .d.ts, written out: the generated props
  // table shows only translateWithId (cause not verified).
  argTypes: {
    ariaLabelInput: {
      description: 'The `ariaLabel` for the `<input>`.',
      table: { type: { summary: 'string' } },
    },
    unstable_ariaLabelInputUpper: {
      description:
        'The `ariaLabel` for the upper bound `<input>` and handle when there are two handles.',
      table: { type: { summary: 'string' } },
    },
    children: {
      description: 'The child nodes.',
      table: { type: { summary: 'ReactNode' } },
    },
    className: {
      description:
        'The CSS class name for the slider, set on the wrapping div.',
      table: { type: { summary: 'string' } },
    },
    disabled: {
      description: '`true` to disable this slider.',
      table: { type: { summary: 'boolean' } },
    },
    formatLabel: {
      description:
        'The callback to format the label associated with the minimum/maximum value and the value tooltip when hideTextInput is true.',
      table: {
        type: {
          summary: '(value: number, label: string | undefined) => string',
        },
      },
    },
    hideTextInput: {
      description: '`true` to hide the number input box.',
      table: { type: { summary: 'boolean' } },
    },
    id: {
      description: 'The ID of the `<input>`.',
      table: { type: { summary: 'string' } },
    },
    inputType: {
      description: 'The `type` attribute of the `<input>`.',
      table: { type: { summary: 'string' } },
    },
    invalid: {
      description: '`Specify whether the Slider is currently invalid',
      table: { type: { summary: 'boolean' } },
    },
    invalidText: {
      description:
        'Provide the text that is displayed when the Slider is in an invalid state',
      table: { type: { summary: 'ReactNode' } },
    },
    labelText: {
      description: 'The label for the slider.',
      table: { type: { summary: 'ReactNode' } },
    },
    hideLabel: {
      description:
        'Specify whether you want the underlying label to be visually hidden',
      table: { type: { summary: 'boolean' } },
    },
    light: {
      description: 'Deprecated. `true` to use the light version.',
      table: { type: { summary: 'boolean' } },
    },
    max: {
      description: 'The maximum value.',
      table: { type: { summary: 'number' } },
    },
    maxLabel: {
      description: 'The label associated with the maximum value.',
      table: { type: { summary: 'string' } },
    },
    min: {
      description: 'The minimum value.',
      table: { type: { summary: 'number' } },
    },
    minLabel: {
      description: 'The label associated with the minimum value.',
      table: { type: { summary: 'string' } },
    },
    name: {
      description: 'The `name` attribute of the `<input>`.',
      table: { type: { summary: 'string' } },
    },
    unstable_nameUpper: {
      description:
        'The `name` attribute of the upper bound `<input>` when there are two handles.',
      table: { type: { summary: 'string' } },
    },
    onBlur: {
      description:
        'Provide an optional function to be called when the input element loses focus',
      table: {
        type: {
          summary:
            '(data: { value: string; handlePosition: HandlePosition | undefined; }) => void',
        },
      },
    },
    onChange: {
      description: 'The callback to get notified of change in value.',
      table: {
        type: {
          summary:
            "(data: { value: SliderProps['value']; valueUpper: SliderProps['unstable_valueUpper']; }) => void",
        },
      },
    },
    onInputKeyUp: {
      description:
        'Provide an optional function to be called when a key is pressed in the number input.',
      table: { type: { summary: 'KeyboardEventHandler<HTMLInputElement>' } },
    },
    onRelease: {
      description: 'The callback to get notified of value on handle release.',
      table: {
        type: {
          summary:
            "(data: { value: SliderProps['value']; valueUpper: SliderProps['unstable_valueUpper']; }) => void",
        },
      },
    },
    readOnly: {
      description: 'Whether the slider should be read-only',
      table: { type: { summary: 'boolean' } },
    },
    required: {
      description: '`true` to specify if the control is required.',
      table: { type: { summary: 'boolean' } },
    },
    step: {
      description:
        'A value determining how much the value should increase/decrease by moving the thumb by mouse. If a value other than 1 is provided and the input is *not* hidden, the new step requirement should be added to a visible label. Values outside the `step` increment will be considered invalid.',
      table: { type: { summary: 'number' } },
    },
    stepMultiplier: {
      description:
        'A value determining how much the value should increase/decrease by Shift+arrow keys, which will be `(max - min) / stepMultiplier`.',
      table: { type: { summary: 'number' } },
    },
    value: {
      description:
        'The value of the slider. When there are two handles, value is the lower bound.',
      table: { type: { summary: 'number' } },
    },
    unstable_valueUpper: {
      description: 'The upper bound when there are two handles.',
      table: { type: { summary: 'number' } },
    },
    warn: {
      description: 'Specify whether the Slider is in a warning state.',
      table: { type: { summary: 'boolean' } },
    },
    warnText: {
      description:
        'Provide the text displayed when the Slider is in a warning state.',
      table: { type: { summary: 'ReactNode' } },
    },
  },
} satisfies Meta<typeof Slider>;

const sharedArgs: SliderProps = {
  ariaLabelInput: 'Slider value',
  disabled: false,
  hideLabel: false,
  hideTextInput: false,
  inputType: 'number',
  invalid: false,
  invalidText: 'Enter a value within the allowed range',
  labelText: 'Storage allocation',
  max: 100,
  maxLabel: ' GB',
  min: 0,
  minLabel: ' GB',
  name: 'storage-allocation',
  readOnly: false,
  required: false,
  step: 1,
  stepMultiplier: 10,
  value: 50,
  warn: false,
  warnText: 'Storage allocation is approaching the recommended limit',
};

const twoHandleArgs: SliderProps = {
  ...sharedArgs,
  ariaLabelInput: 'Minimum storage allocation',
  labelText: 'Storage allocation range',
  name: 'minimum-storage-allocation',
  unstable_ariaLabelInputUpper: 'Maximum storage allocation',
  unstable_nameUpper: 'maximum-storage-allocation',
  unstable_valueUpper: 90,
  value: 10,
};

const sharedArgTypes: Partial<ArgTypes<SliderProps>> = {
  ariaLabelInput: {
    control: 'text',
  },
  disabled: {
    control: 'boolean',
  },
  hideLabel: {
    control: 'boolean',
  },
  hideTextInput: {
    control: 'boolean',
  },
  inputType: {
    control: 'text',
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
  max: {
    control: 'number',
  },
  maxLabel: {
    control: 'text',
  },
  min: {
    control: 'number',
  },
  minLabel: {
    control: 'text',
  },
  name: {
    control: 'text',
  },
  onBlur: {
    action: 'onBlur',
  },
  onChange: {
    action: 'onChange',
  },
  onInputKeyUp: {
    action: 'onInputKeyUp',
  },
  onRelease: {
    action: 'onRelease',
  },
  readOnly: {
    control: 'boolean',
  },
  required: {
    control: 'boolean',
  },
  step: {
    control: 'number',
  },
  stepMultiplier: {
    control: 'number',
  },
  unstable_ariaLabelInputUpper: {
    control: 'text',
  },
  unstable_nameUpper: {
    control: 'text',
  },
  unstable_valueUpper: {
    control: 'number',
  },
  value: {
    control: 'number',
  },
  warn: {
    control: 'boolean',
  },
  warnText: {
    control: 'text',
  },
};

const singleHandleControls = Object.keys(sharedArgs);
const twoHandleControls = Object.keys(twoHandleArgs);

const singleHandleParameters = {
  controls: {
    include: singleHandleControls,
  },
};

const twoHandleParameters = {
  controls: {
    include: twoHandleControls,
  },
};

const hiddenInputArgTypes: Partial<ArgTypes<SliderProps>> = {
  ...sharedArgTypes,
  hideTextInput: {
    ...sharedArgTypes.hideTextInput,
    table: {
      readonly: true,
    },
  },
};

const randomValue = ({
  max,
  min,
  step = 1,
}: Pick<SliderProps, 'max' | 'min' | 'step'>) => {
  const range = max - min;
  if (range <= 0 || step <= 0) {
    return min;
  }

  return Math.min(max, min + Math.round((Math.random() * range) / step) * step);
};

export const Default: StoryFn<typeof Slider> = (args) => <Slider {...args} />;

Default.args = { ...sharedArgs };
Default.argTypes = { ...sharedArgTypes };
Default.parameters = singleHandleParameters;

export const WithHiddenInputs: StoryFn<typeof Slider> = (args) => (
  <Slider {...args} />
);

WithHiddenInputs.args = {
  ...sharedArgs,
  hideTextInput: true,
};
WithHiddenInputs.argTypes = hiddenInputArgTypes;
WithHiddenInputs.parameters = singleHandleParameters;

export const WithCustomValueLabel: StoryFn<typeof Slider> = (args) => (
  <Slider
    {...args}
    formatLabel={(value) => {
      if (value < 25) {
        return 'Low';
      } else if (value > 75) {
        return 'High';
      }
      return 'Medium';
    }}
  />
);

WithCustomValueLabel.args = {
  ...sharedArgs,
  hideTextInput: true,
  labelText: 'Storage usage',
  stepMultiplier: 50,
};
WithCustomValueLabel.argTypes = {
  ...hiddenInputArgTypes,
};
WithCustomValueLabel.parameters = singleHandleParameters;

export const Controlled: StoryFn<typeof Slider> = (args) => {
  const [value, setValue] = useState(args.value);

  useEffect(() => {
    setValue(args.value);
  }, [args.value]);

  return (
    <>
      <button type="button" onClick={() => setValue(randomValue(args))}>
        Randomize value
      </button>
      <Slider
        {...args}
        value={value}
        onChange={(data) => {
          setValue(data.value);
          args.onChange?.(data);
        }}
      />
      <p>Current value: {value}</p>
    </>
  );
};

Controlled.args = { ...sharedArgs, value: 87 };
Controlled.argTypes = { ...sharedArgTypes };
Controlled.parameters = singleHandleParameters;

export const WithLayer: StoryFn<typeof Slider> = (args) => (
  <WithLayerTemplate>
    <Slider {...args} />
  </WithLayerTemplate>
);

WithLayer.args = { ...sharedArgs };
WithLayer.argTypes = { ...sharedArgTypes };
WithLayer.parameters = singleHandleParameters;

export const ControlledWithLayer: StoryFn<typeof Slider> = (args) => {
  const [value, setValue] = useState(args.value);

  useEffect(() => {
    setValue(args.value);
  }, [args.value]);

  return (
    <WithLayerTemplate>
      <button type="button" onClick={() => setValue(randomValue(args))}>
        Randomize value
      </button>
      <Slider
        {...args}
        value={value}
        onChange={(data) => {
          setValue(data.value);
          args.onChange?.(data);
        }}
      />
      <p>Current value: {value}</p>
    </WithLayerTemplate>
  );
};

ControlledWithLayer.args = { ...sharedArgs, value: 87 };
ControlledWithLayer.argTypes = { ...sharedArgTypes };
ControlledWithLayer.parameters = singleHandleParameters;

export const TwoHandle: StoryFn<typeof Slider> = (args) => <Slider {...args} />;

TwoHandle.args = { ...twoHandleArgs };
TwoHandle.argTypes = { ...sharedArgTypes };
TwoHandle.parameters = twoHandleParameters;

export const TwoHandleWithHiddenInputs: StoryFn<typeof Slider> = (args) => (
  <Slider {...args} />
);

TwoHandleWithHiddenInputs.args = {
  ...twoHandleArgs,
  hideTextInput: true,
};
TwoHandleWithHiddenInputs.argTypes = {
  ...hiddenInputArgTypes,
};
TwoHandleWithHiddenInputs.parameters = twoHandleParameters;

export const Disabled: StoryFn<typeof Slider> = (args) => <Slider {...args} />;
Disabled.args = { ...sharedArgs, disabled: true };
Disabled.argTypes = { ...sharedArgTypes };
// WCAG 1.4.3 exempts inactive components; Carbon greys the label and range
// labels of a disabled slider (1.7:1).
Disabled.parameters = {
  ...singleHandleParameters,
  a11y: { config: { rules: [{ id: 'color-contrast', enabled: false }] } },
};

export const ReadOnly: StoryFn<typeof Slider> = (args) => <Slider {...args} />;
ReadOnly.args = { ...sharedArgs, readOnly: true };
ReadOnly.argTypes = { ...sharedArgTypes };
ReadOnly.parameters = singleHandleParameters;

// The invalid text is not linked to the input (upstream issue drafted, not
// filed); axe does not flag it.
export const Invalid: StoryFn<typeof Slider> = (args) => <Slider {...args} />;
Invalid.args = { ...sharedArgs, invalid: true };
Invalid.argTypes = { ...sharedArgTypes };
Invalid.parameters = singleHandleParameters;

export const Warning: StoryFn<typeof Slider> = (args) => <Slider {...args} />;
Warning.args = { ...sharedArgs, value: 92, warn: true };
Warning.argTypes = { ...sharedArgTypes };
Warning.parameters = singleHandleParameters;

const skeletonArgs: SliderSkeletonProps = {
  ariaLabel: 'Slider handle',
  hideLabel: false,
  twoHandles: false,
  unstable_ariaLabelHandleUpper: 'Upper slider handle',
};

const skeletonArgTypes: Partial<ArgTypes<SliderSkeletonProps>> = {
  ariaLabel: {
    control: 'text',
  },
  hideLabel: {
    control: 'boolean',
  },
  twoHandles: {
    control: 'boolean',
  },
  unstable_ariaLabelHandleUpper: {
    control: 'text',
  },
};

const skeletonParameters = {
  controls: {
    include: Object.keys(skeletonArgs),
  },
};

export const Skeleton: StoryFn<SliderSkeletonProps> = (args) => (
  <SliderSkeleton {...args} />
);

Skeleton.args = { ...skeletonArgs };
Skeleton.argTypes = { ...skeletonArgTypes };
Skeleton.parameters = skeletonParameters;

export const TwoHandleSkeleton: StoryFn<SliderSkeletonProps> = (args) => (
  <SliderSkeleton {...args} />
);

TwoHandleSkeleton.args = {
  ...skeletonArgs,
  twoHandles: true,
};
TwoHandleSkeleton.argTypes = {
  ...skeletonArgTypes,
  twoHandles: {
    ...skeletonArgTypes.twoHandles,
    table: {
      readonly: true,
    },
  },
};
TwoHandleSkeleton.parameters = skeletonParameters;
