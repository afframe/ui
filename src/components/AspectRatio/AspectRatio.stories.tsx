/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2023
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, source tag, styles from a plain CSS file instead of ?inline SCSS, Grid no longer receives the AspectRatio args. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { AspectRatio, Column, Grid } from '../../index.js';
import mdx from './AspectRatio.mdx';
import './AspectRatio-story.css';

export default {
  title: 'Components/AspectRatio',
  component: AspectRatio,
  tags: ['carbon'],
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof AspectRatio>;

export const Default: StoryFn<typeof AspectRatio> = (args) => {
  return (
    <div className="aspect-ratio-story">
      <Grid>
        <Column sm={1} md={2} lg={4}>
          <AspectRatio {...args}>Content</AspectRatio>
        </Column>
        <Column sm={1} md={2} lg={4}>
          <AspectRatio {...args}>Content</AspectRatio>
        </Column>
        <Column sm={1} md={2} lg={4}>
          <AspectRatio {...args}>Content</AspectRatio>
        </Column>
        <Column sm={1} md={2} lg={4}>
          <AspectRatio {...args}>Content</AspectRatio>
        </Column>
      </Grid>
    </div>
  );
};

Default.argTypes = {
  as: {
    control: false,
  },
  children: {
    control: false,
  },
  className: {
    control: false,
  },
  ratio: {
    control: {
      type: 'select',
    },
    options: ['16x9', '9x16', '2x1', '1x2', '4x3', '3x4', '1x1'],
    table: {
      category: 'AspectRatio',
    },
  },
};
