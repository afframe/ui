/**
 * Copyright IBM Corp. 2016, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2024
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, AISkeletonPlaceholder from @afframe/ui, eslint directive removed, source tag, story names unified. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { AISkeletonPlaceholder } from '../../index.js';

export default {
  title: 'Components/Skeletons/AISkeleton',
  component: AISkeletonPlaceholder,
  tags: ['carbon'],
} satisfies Meta<typeof AISkeletonPlaceholder>;

export const Placeholder: StoryFn<typeof AISkeletonPlaceholder> = () => {
  return <AISkeletonPlaceholder className="test" />;
};
