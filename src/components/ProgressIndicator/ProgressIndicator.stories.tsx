/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2023
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
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

export const Interactive: StoryFn<typeof ProgressIndicator> = () => {
  return (
    <ProgressIndicator currentIndex={1} onChange={() => alert('Clicked')}>
      <ProgressStep
        label="Click me"
        description="Step 1: Register an onChange event"
      />
      <ProgressStep
        label="Really long label"
        description="The progress indicator will listen for clicks on the steps"
      />
      <ProgressStep
        label="Third step"
        description="The progress indicator will listen for clicks on the steps"
      />
    </ProgressIndicator>
  );
};

export const Skeleton: StoryFn<typeof ProgressIndicatorSkeleton> = () => {
  return <ProgressIndicatorSkeleton />;
};

export const Default: StoryFn<typeof ProgressIndicator> = (args) => (
  <ProgressIndicator {...args}>
    <ProgressStep
      complete
      label="First step"
      description="Step 1: Getting started with Carbon Design System"
      secondaryLabel="Optional label"
    />
    <ProgressStep
      current
      label="Second step with tooltip"
      description="Step 2: Getting started with Carbon Design System"
    />
    <ProgressStep
      label="Third step with tooltip"
      description="Step 3: Getting started with Carbon Design System"
    />
    <ProgressStep
      label="Fourth step"
      description="Step 4: Getting started with Carbon Design System"
      invalid
      secondaryLabel="Example invalid step"
    />
    <ProgressStep
      label="Fifth step"
      description="Step 5: Getting started with Carbon Design System"
      disabled
    />
  </ProgressIndicator>
);

Default.args = {
  currentIndex: 0,
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
