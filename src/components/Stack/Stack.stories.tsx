/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2023
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, source tag, title under Components (upstream Layout/Stack). Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ArgTypes, Meta, StoryFn } from '@storybook/react-vite';
import { Stack } from '../../index.js';
import type { StackProps } from '../../index.js';

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
  title: 'Components/Stack',
  component: Stack,
  tags: ['carbon'],
  args,
  argTypes,
} satisfies Meta<typeof Stack>;

export const Horizontal: StoryFn<typeof Stack> = (args) => {
  return (
    <Stack {...args}>
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
    </Stack>
  );
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

export const Default: StoryFn<typeof Stack> = (args) => {
  return (
    <Stack {...args}>
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
    </Stack>
  );
};
