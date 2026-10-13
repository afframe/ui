/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2023
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, source tag, Default story first, docs page, bordered items, HStackAndVStack story. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ArgTypes, Meta, StoryFn } from '@storybook/react-vite';
import { HStack, Stack, VStack } from '../../index.js';
import type { StackProps } from '../../index.js';
import mdx from './Stack.mdx';
import './Stack.stories.css';

const items = ['Item 1', 'Item 2', 'Item 3'].map((item) => (
  <div key={item} className="demo-stack-item">
    {item}
  </div>
));

const args = {
  as: 'div',
  gap: 6,
  orientation: 'vertical',
} satisfies StackProps;

const argTypes = {
  as: {
    control: {
      type: 'text',
    },
  },
  gap: {
    options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    control: {
      type: 'select',
    },
  },
  orientation: {
    options: ['horizontal', 'vertical'],
    control: {
      type: 'select',
    },
  },
} satisfies ArgTypes;

export default {
  title: 'Layout/Stack',
  component: Stack,
  subcomponents: { HStack, VStack },
  tags: ['carbon'],
  args,
  argTypes,
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof Stack>;

export const Default: StoryFn<typeof Stack> = (args) => {
  return <Stack {...args}>{items}</Stack>;
};

export const Horizontal: StoryFn<typeof Stack> = (args) => {
  return <Stack {...args}>{items}</Stack>;
};

Horizontal.args = {
  orientation: 'horizontal',
};

Horizontal.argTypes = {
  orientation: {
    ...argTypes.orientation,
    table: {
      readonly: true,
    },
  },
};

export const HStackAndVStack: StoryFn<typeof Stack> = () => {
  return (
    <VStack gap={6}>
      <HStack gap={3}>{items}</HStack>
      <HStack gap={7}>{items}</HStack>
    </VStack>
  );
};

HStackAndVStack.parameters = {
  controls: { disable: true },
};
