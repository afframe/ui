/**
 * Copyright IBM Corp. 2016, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2024
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, AISkeletonText from @afframe/ui, eslint directive removed, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { AISkeletonText } from '../../index.js';

export default {
  title: 'Components/Skeleton/AISkeleton',
  component: AISkeletonText,
  tags: ['carbon'],
} satisfies Meta<typeof AISkeletonText>;

export const _AISkeletonText: StoryFn<typeof AISkeletonText> = () => {
  return <AISkeletonText />;
};
