/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2023
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, source tag, Default story first, Afframe example data, Default without the step props that currentIndex overrides, Interactive keeps currentIndex in state and logs onChange as an action. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { useState } from 'react';
import { fn } from 'storybook/test';
import {
  ProgressIndicator,
  ProgressIndicatorSkeleton,
  ProgressStep,
} from '../../index.js';
import mdx from './ProgressIndicator.mdx';

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

export const Default: StoryFn<typeof ProgressIndicator> = (args) => (
  <ProgressIndicator {...args}>
    <ProgressStep
      label="Customer"
      description="Step 1: Choose the customer"
      secondaryLabel="Lakeside Furniture"
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
  currentIndex: 1,
  spaceEqually: false,
  vertical: false,
};

Default.argTypes = {
  currentIndex: {
    control: { type: 'number' },
  },
  spaceEqually: {
    control: { type: 'boolean' },
  },
  vertical: {
    control: { type: 'boolean' },
  },
};

export const Interactive: StoryFn<typeof ProgressIndicator> = ({
  onChange,
}) => {
  const [currentIndex, setCurrentIndex] = useState(1);
  return (
    <ProgressIndicator
      currentIndex={currentIndex}
      onChange={(index) => {
        onChange?.(index);
        setCurrentIndex(index);
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
  onChange: fn(),
};

export const Skeleton: StoryFn<typeof ProgressIndicatorSkeleton> = () => {
  return <ProgressIndicatorSkeleton />;
};
