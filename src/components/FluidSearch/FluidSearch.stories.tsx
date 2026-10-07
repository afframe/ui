/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and icons from @afframe/ui, source tag, plain CSS story styles; typed args. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import {
  FluidSearch,
  FluidSearchSkeleton,
  type FluidSearchProps,
} from '../../index.js';
import mdx from './FluidSearch.mdx';

export default {
  title: 'Components/Fluid Components/FluidSearch',
  tags: ['carbon'],
  component: FluidSearch,
  args: {
    autoComplete: 'off',
    closeButtonLabelText: 'Clear search input',
    defaultWidth: 400,
    disabled: false,
    labelText: 'Search',
    placeholder: 'Prompt text',
    role: 'searchbox',
    type: 'search',
  },
  argTypes: {
    autoComplete: {
      control: { type: 'text' },
    },
    closeButtonLabelText: {
      control: { type: 'text' },
    },
    defaultValue: {
      control: { type: 'text' },
    },
    defaultWidth: {
      control: { type: 'range', min: 300, max: 800, step: 50 },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    labelText: {
      control: { type: 'text' },
    },
    onChange: {
      action: 'onChange',
    },
    placeholder: {
      control: { type: 'text' },
    },
    role: {
      control: { type: 'text' },
    },
    type: {
      control: { type: 'text' },
    },
    value: {
      control: { type: 'text' },
    },
  },
  parameters: {
    docs: {
      page: mdx,
    },
    controls: {
      exclude: ['id'],
    },
  },
  subcomponents: {
    FluidSearchSkeleton,
  },
} satisfies Meta<FluidSearchProps & { defaultWidth?: number }>;

export const Skeleton: StoryFn<FluidSearchProps & { defaultWidth?: number }> = (
  args
) => {
  const { defaultWidth } = args;
  return (
    <div style={{ width: defaultWidth }}>
      <FluidSearchSkeleton />
    </div>
  );
};

Skeleton.parameters = {
  controls: {
    include: ['defaultWidth'],
  },
};

export const Default: StoryFn<FluidSearchProps & { defaultWidth?: number }> = (
  args
) => {
  const { defaultWidth, ...searchArgs } = args;
  return (
    <div style={{ width: defaultWidth }}>
      <FluidSearch {...searchArgs} />
    </div>
  );
};

Default.args = {
  autoComplete: 'off',
  closeButtonLabelText: 'Clear search input',
  defaultWidth: 400,
  disabled: false,
  labelText: 'Search',
  placeholder: 'Prompt text',
  role: 'searchbox',
  type: 'search',
};
