/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2023
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, source tag, inline spacing as Carbon spacing tokens. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { SkeletonIcon } from '../../index.js';
import mdx from './SkeletonIcon.mdx';

type SkeletonIconStoryArgs = { className: string; size: number };

export default {
  title: 'Components/Skeleton/SkeletonIcon',
  component: SkeletonIcon,
  tags: ['carbon'],
  argTypes: {
    className: {
      control: {
        type: 'text',
      },
    },
    size: {
      control: {
        type: 'range',
        min: 16,
        max: 64,
        step: 1,
      },
    },
  },
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<SkeletonIconStoryArgs>;

export const Default: StoryFn<SkeletonIconStoryArgs> = (args) => {
  const styleProps = {
    style: {
      margin: 'var(--cds-spacing-09)',
      height: args.size,
      width: args.size,
    },
  };
  return <SkeletonIcon className={args.className} {...styleProps} />;
};

Default.args = {
  className: '',
  size: 16,
};
