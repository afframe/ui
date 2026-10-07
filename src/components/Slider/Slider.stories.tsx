/**
 * Copyright IBM Corp. 2016, 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2025
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, noValidate (not a Slider prop) and an undefined arg removed, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { WithLayer } from '../../../.storybook/templates/WithLayer/index.js';
import { Slider, SliderSkeleton } from '../../index.js';
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
} satisfies Meta<typeof Slider>;

export const Default: StoryFn<typeof Slider> = (args) => {
  return (
    <Slider
      {...args}
      labelText={`Slider (must be an increment of ${args.step})`}
    />
  );
};

Default.parameters = {
  controls: {
    exclude: ['light', 'formatLabel', 'labelText'],
  },
};

Default.argTypes = {
  ariaLabelInput: {
    control: { type: 'text' },
  },
  unstable_ariaLabelInputUpper: {
    control: { type: 'text' },
  },
  disabled: {
    control: {
      control: {
        type: 'boolean',
      },
    },
  },
  hideTextInput: {
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
  min: {
    control: { type: 'number' },
  },
  max: {
    control: { type: 'number' },
  },
  name: {
    control: { type: 'text' },
  },
  unstable_nameUpper: {
    control: { type: 'text' },
  },
  readOnly: {
    control: {
      type: 'boolean',
    },
  },
  required: {
    control: {
      type: 'boolean',
    },
  },
  step: {
    control: { type: 'number' },
  },
  stepMultiplier: {
    control: { type: 'number' },
  },
  value: {
    control: { type: 'number' },
  },
  unstable_valueUpper: {
    control: { type: 'number' },
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

Default.args = {
  ariaLabelInput: 'Lower bound',
  unstable_ariaLabelInputUpper: 'Upper bound',
  disabled: false,
  hideTextInput: false,
  invalid: false,
  invalidText: 'Invalid message goes here',
  min: 0,
  max: 100,
  readOnly: false,
  required: false,
  step: 5,
  stepMultiplier: 5,
  value: 50,
  warn: false,
  warnText: 'Warning message goes here',
};

export const SliderWithHiddenInputs: StoryFn = () => {
  return (
    <Slider
      labelText="Slider label"
      value={50}
      min={0}
      max={100}
      step={1}
      stepMultiplier={10}
      invalidText="Invalid message goes here"
      hideTextInput={true}
    />
  );
};

export const SliderWithCustomValueLabel: StoryFn = () => {
  return (
    <Slider
      labelText="Slider label with low/medium/high"
      value={50}
      min={0}
      max={100}
      stepMultiplier={50}
      step={1}
      hideTextInput
      formatLabel={(val) => {
        if (val < 25) {
          return 'Low';
        } else if (val > 75) {
          return 'High';
        }
        return 'Medium';
      }}
    />
  );
};

export const ControlledSlider: StoryFn = () => {
  const [val, setVal] = useState(87);
  return (
    <>
      <button
        type="button"
        onClick={() => setVal(Math.round(Math.random() * 100))}>
        randomize value
      </button>
      <Slider
        labelText="Slider label"
        max={100}
        min={0}
        value={val}
        onChange={({ value }) => setVal(value)}
      />
      <h1>{val}</h1>
    </>
  );
};

export const _WithLayer: StoryFn = () => (
  <WithLayer>
    <Slider
      labelText="Slider label"
      value={50}
      min={0}
      max={100}
      step={1}
      stepMultiplier={10}
    />
  </WithLayer>
);

export const ControlledSliderWithLayer: StoryFn = () => {
  const [val, setVal] = useState(87);
  return (
    <WithLayer>
      <button
        type="button"
        onClick={() => setVal(Math.round(Math.random() * 100))}>
        randomize value
      </button>
      <Slider
        labelText="Slider label"
        max={100}
        min={0}
        value={val}
        onChange={({ value }) => setVal(value)}
      />
      <h1>{val}</h1>
    </WithLayer>
  );
};

export const TwoHandleSlider: StoryFn = () => {
  return (
    <Slider
      ariaLabelInput="Lower bound"
      unstable_ariaLabelInputUpper="Upper bound"
      labelText="Slider label"
      value={10}
      unstable_valueUpper={90}
      min={0}
      max={100}
      step={1}
      stepMultiplier={10}
      invalidText="Invalid message goes here"
    />
  );
};

export const TwoHandleSliderWithHiddenInputs: StoryFn = () => {
  return (
    <Slider
      ariaLabelInput="Lower bound"
      unstable_ariaLabelInputUpper="Upper bound"
      labelText="Slider label"
      value={10}
      unstable_valueUpper={90}
      min={0}
      max={100}
      step={1}
      stepMultiplier={10}
      invalidText="Invalid message goes here"
      hideTextInput={true}
    />
  );
};

export const Skeleton: StoryFn = () => {
  return <SliderSkeleton />;
};

export const TwoHandleSkeleton: StoryFn = () => {
  return <SliderSkeleton twoHandles={true} />;
};
