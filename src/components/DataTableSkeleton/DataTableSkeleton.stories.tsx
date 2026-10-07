/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, DataTableSkeleton from @afframe/ui, source tag, DataTable docs page. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { DataTableSkeleton } from '../../index.js';
import { headers } from '../DataTable/stories/shared.js';
import mdx from '../DataTable/DataTable.mdx';

const props = () => ({
  zebra: false,
  showHeader: true,
  showToolbar: true,
});

export default {
  title: 'Components/DataTable/Skeleton',
  component: DataTableSkeleton,
  tags: ['carbon'],
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof DataTableSkeleton>;

export const Skeleton: StoryFn<typeof DataTableSkeleton> = (args) => {
  const { ...rest } = props();

  return (
    <div style={{ width: '800px' }}>
      <DataTableSkeleton
        {...rest}
        {...args}
        headers={headers}
        aria-label="sample table"
      />
      <br />
    </div>
  );
};

Skeleton.parameters = {
  controls: {
    exclude: ['headers'],
  },
};
