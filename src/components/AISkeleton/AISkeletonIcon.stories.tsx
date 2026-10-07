/**
 * Copyright IBM Corp. 2016, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2024
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, AISkeletonIcon from @afframe/ui, unused module-level props and eslint directive removed, source tag, inline spacing as Carbon spacing tokens. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { AISkeletonIcon } from '../../index.js';
import mdx from './AISkeleton.mdx';

export default {
  title: 'Components/Skeleton/AISkeleton',
  component: AISkeletonIcon,
  tags: ['carbon'],
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof AISkeletonIcon>;

export const _AISkeletonIcon: StoryFn<typeof AISkeletonIcon> = () => {
  const propsSkeleton = {
    style: {
      margin: 'var(--cds-spacing-09)',
    },
  };

  const propsSkeleton2 = {
    style: {
      margin: 'var(--cds-spacing-09)',
      width: '24px',
      height: '24px',
    },
  };
  return (
    <>
      <AISkeletonIcon {...propsSkeleton} />
      <AISkeletonIcon {...propsSkeleton2} />
    </>
  );
};
