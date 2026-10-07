/**
 * Copyright IBM Corp. 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2025
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, Processing from @afframe/ui (styles ship in the package CSS, so the processing.scss import is dropped), unused useArgs calls removed, props typed locally, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ComponentProps } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { Processing } from '../../index.js';
import mdx from './Processing.mdx';

export default {
  title: 'Components/Processing',
  component: Processing,
  tags: ['labs'],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof Processing>;

type ProcessingProps = ComponentProps<typeof Processing>;

const sharedArgTypes = {
  loop: {
    description: 'Specify whether the animation should loop',
  },
};

const linearArgs = {
  loop: true,
};

const linearNoLoopArgs = {
  loop: false,
};

export const LinearLoop: StoryFn<ProcessingProps> = (args) => {
  return <Processing {...args}></Processing>;
};

LinearLoop.argTypes = {
  ...sharedArgTypes,
};

LinearLoop.args = {
  ...linearArgs,
};

export const LinearNoLoop: StoryFn<ProcessingProps> = (args) => {
  return <Processing {...args}></Processing>;
};

LinearNoLoop.argTypes = {
  ...sharedArgTypes,
};

LinearNoLoop.args = {
  ...linearNoLoopArgs,
};
