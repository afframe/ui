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
import { SkeletonPlaceholder } from '../../index.js';
import mdx from './SkeletonPlaceholder.mdx';

type SkeletonPlaceholderStoryArgs = {
  className: string;
  height: number;
  width: number;
};

export default {
  title: 'Components/Skeleton/SkeletonPlaceholder',
  component: SkeletonPlaceholder,
  tags: ['carbon'],
  argTypes: {
    className: {
      control: {
        type: 'text',
      },
    },
    height: {
      control: {
        type: 'range',
        min: 16,
        max: 400,
        step: 4,
      },
    },
    width: {
      control: {
        type: 'range',
        min: 16,
        max: 400,
        step: 4,
      },
    },
  },
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<SkeletonPlaceholderStoryArgs>;

export const Default: StoryFn<SkeletonPlaceholderStoryArgs> = (args) => {
  return (
    <SkeletonPlaceholder
      className={args.className}
      style={{ height: args.height, width: args.width }}
    />
  );
};

Default.args = {
  className: '',
  height: 100,
  width: 100,
};
