/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, source tag, Default story first, Afframe example data, Default without the step props that currentIndex overrides, Interactive moves currentIndex through its args and logs onChange as an action. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ComponentProps } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { fn } from 'storybook/test';
import {
  ProgressIndicator,
  ProgressIndicatorSkeleton,
  ProgressStep,
} from '../../index.js';
import mdx from './ProgressIndicator.mdx';

const progressIndicatorArgs = {
  currentIndex: 0,
  spaceEqually: false,
  vertical: false,
};

const progressIndicatorArgTypes = {
  currentIndex: {
    control: { type: 'number', min: 0, max: 4 },
    description: 'Optionally specify the current step array index.',
    table: { defaultValue: { summary: '0' } },
  },
  spaceEqually: {
    control: { type: 'boolean' },
    description:
      'Specify whether the progress steps should be split equally in size in the div.',
    table: { defaultValue: { summary: 'false' } },
  },
  vertical: {
    control: { type: 'boolean' },
    description:
      'Determines whether or not the ProgressIndicator should be rendered vertically.',
    table: { defaultValue: { summary: 'false' } },
  },
} as const;

export default {
  title: 'Components/ProgressIndicator',
  component: ProgressIndicator,
  tags: ['carbon'],
  subcomponents: {
    ProgressStep,
    ProgressIndicatorSkeleton,
  },
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof ProgressIndicator>;

type DefaultArgs = ComponentProps<typeof ProgressIndicator> & {
  secondaryLabel?: string;
};

export const Default: StoryFn<DefaultArgs> = ({ secondaryLabel, ...args }) => (
  <ProgressIndicator {...args}>
    <ProgressStep
      label="Customer"
      description="Step 1: Choose the customer"
      {...(secondaryLabel ? { secondaryLabel } : {})}
    />
    <ProgressStep
      label="Invoice items"
      description="Step 2: Add the invoice items"
    />
    <ProgressStep
      label="Payment terms"
      description="Step 3: Set the payment terms"
    />
    <ProgressStep
      label="Review"
      description="Step 4: Review the invoice"
      invalid
      secondaryLabel="Missing tax ID"
    />
    <ProgressStep
      label="Send"
      description="Step 5: Send the invoice"
      disabled
    />
  </ProgressIndicator>
);

Default.args = {
  ...progressIndicatorArgs,
  currentIndex: 1,
  secondaryLabel: 'Lakeside Furniture',
};

Default.argTypes = {
  ...progressIndicatorArgTypes,
  secondaryLabel: {
    control: { type: 'text' },
    description: 'Provide an optional secondary label.',
    table: {
      category: 'ProgressStep',
      defaultValue: { summary: 'undefined' },
    },
  },
};

export const Interactive: StoryFn<typeof ProgressIndicator> = (args) => {
  const [, updateArgs] = useArgs();
  return (
    <ProgressIndicator
      {...args}
      onChange={(index) => {
        args.onChange?.(index);
        updateArgs({ currentIndex: index });
      }}>
      <ProgressStep
        label="Customer"
        description="Step 1: Choose the customer"
      />
      <ProgressStep
        label="Payment terms and late fees"
        description="Step 2: Set the payment terms and late fees"
      />
      <ProgressStep label="Review" description="Step 3: Review the invoice" />
    </ProgressIndicator>
  );
};

Interactive.args = {
  ...progressIndicatorArgs,
  currentIndex: 1,
  onChange: fn(),
};

Interactive.argTypes = {
  ...progressIndicatorArgTypes,
  currentIndex: {
    ...progressIndicatorArgTypes.currentIndex,
    control: { type: 'number', min: 0, max: 2 },
  },
  onChange: {
    description:
      'Optional callback called if a ProgressStep is clicked on. Returns the index of the step.',
    table: { defaultValue: { summary: 'undefined' } },
  },
};

export const Skeleton: StoryFn<typeof ProgressIndicatorSkeleton> = (args) => (
  <ProgressIndicatorSkeleton {...args} />
);

Skeleton.args = {
  vertical: false,
};

Skeleton.argTypes = {
  vertical: progressIndicatorArgTypes.vertical,
};

Skeleton.parameters = {
  controls: { include: ['vertical'] },
};
