/**
 * Copyright IBM Corp. 2022, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2022, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and icons from @afframe/ui, source tag, plain CSS story styles; redundant labelText and placeholder removed from second picker (args supply them); skeleton className and isOnlyTwo passed explicitly. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { Information } from '../../icons.js';
import {
  FluidTimePicker,
  FluidTimePickerSelect,
  FluidTimePickerSkeleton,
  SelectItem,
  Toggletip,
  ToggletipButton,
  ToggletipContent,
  type FluidTimePickerProps,
} from '../../index.js';
import styles from './fluid-time-picker-story.css?inline';
import mdx from './FluidTimePicker.mdx';

export default {
  title: 'Components/Fluid Components/FluidTimePicker',
  tags: ['carbon'],
  component: FluidTimePicker,
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
  },
  subcomponents: {
    FluidTimePickerSelect,
    FluidTimePickerSkeleton,
  },
} satisfies Meta<typeof FluidTimePicker>;

export const Skeleton: StoryFn = () => {
  return (
    <div style={{ width: 300 }}>
      <FluidTimePickerSkeleton className="" isOnlyTwo={false} />
      <br />
      <br />
      <FluidTimePickerSkeleton className="" isOnlyTwo />
    </div>
  );
};

export const Default: StoryFn<
  Omit<FluidTimePickerProps, 'id'> & { defaultWidth?: number }
> = (args) => {
  function ClockToggletip({ className }: { className: string }) {
    return (
      <span className={`fluid-time-picker-story__toggletip ${className}`}>
        <Toggletip align="top-left">
          <ToggletipButton label="Show information">
            <Information />
          </ToggletipButton>
          <ToggletipContent>
            <p>Additional field information here.</p>
          </ToggletipContent>
        </Toggletip>
      </span>
    );
  }
  return (
    <div style={{ width: '350px' }}>
      <div className="fluid-time-picker-story">
        <FluidTimePicker id="time-picker-1" {...args}>
          <FluidTimePickerSelect id="select-1" labelText="Clock">
            <SelectItem value="am" text="AM" />
            <SelectItem value="pm" text="PM" />
          </FluidTimePickerSelect>
          <FluidTimePickerSelect id="select-2" labelText="Timezone">
            <SelectItem value="et" text="Eastern Time (ET)" />
            <SelectItem value="ct" text="Central Time (CT)" />
            <SelectItem value="mt" text="Mountain Time (MT)" />
            <SelectItem value="pt" text="Pacific Time (PT)" />
          </FluidTimePickerSelect>
        </FluidTimePicker>
        <ClockToggletip className="fluid-time-picker-story__toggletip--three-inputs" />
      </div>
      <br />
      <br />
      <div className="fluid-time-picker-story">
        <FluidTimePicker id="time-picker-2" {...args}>
          <FluidTimePickerSelect id="select-3" labelText="Clock">
            <SelectItem value="am" text="AM" />
            <SelectItem value="pm" text="PM" />
          </FluidTimePickerSelect>
        </FluidTimePicker>
        <ClockToggletip className="fluid-time-picker-story__toggletip--two-inputs" />
      </div>
    </div>
  );
};

Default.args = {
  className: 'test-class',
  disabled: false,
  invalid: false,
  labelText: 'Time',
  invalidText:
    'Error message that is really long can wrap to more lines but should not be excessively long.',
  placeholder: 'hh:mm',
  readOnly: false,
  warn: false,
  warnText:
    'Warning message that is really long can wrap to more lines but should not be excessively long.',
};

Default.argTypes = {
  className: {
    control: { type: 'text' },
  },
  defaultValue: {
    control: { type: 'text' },
  },
  disabled: {
    control: { type: 'boolean' },
  },
  labelText: {
    control: { type: 'text' },
  },
  invalid: {
    control: { type: 'boolean' },
  },
  invalidText: {
    control: { type: 'text' },
  },
  placeholder: {
    control: { type: 'text' },
  },
  onChange: {
    action: 'onChange',
  },
  onClick: {
    action: 'onClick',
  },
  readOnly: {
    control: { type: 'boolean' },
  },
  value: {
    control: { type: 'text' },
  },
  warn: {
    control: { type: 'boolean' },
  },
  warnText: {
    control: { type: 'text' },
  },
};

Default.parameters = {
  controls: {
    include: [...Object.keys(Default.argTypes)],
  },
};
