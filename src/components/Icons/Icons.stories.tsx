/**
 * Copyright IBM Corp. 2016, 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2025
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, icons from @afframe/ui/icons, unused IconButton import removed, plain CSS, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { Bee, Edit } from '../../icons.js';
import mdx from './Icons.mdx';
import './Icons.stories.css';

export default {
  title: 'Elements/Icons',
  tags: ['carbon'],
  parameters: {
    docs: {
      page: mdx,
    },
  },
  decorators: [
    (Story, { args }) => {
      return (
        <section className="demo-icon-example">
          <h2>
            {args.size} {typeof args.size === 'number' && 'pixel'}{' '}
            {args.size === 16 && '(default)'}
            {typeof args.size === 'string' &&
              args.size.includes('rem') &&
              '(responsive)'}
          </h2>
          <Story />
        </section>
      );
    },
  ],
} satisfies Meta<typeof Bee>;

export const Default: StoryFn<typeof Bee> = (args) => {
  return <Bee {...args} />;
};

Default.args = {
  size: 16,
};

Default.argTypes = {
  size: {
    options: ['16', '20', '32'],
    control: { type: 'select' },
  },
};

export const WithRelativeSize: StoryFn<typeof Edit> = (args) => {
  return <Edit {...args} />;
};

WithRelativeSize.args = {
  size: '1rem',
};

WithRelativeSize.argTypes = { size: { control: 'text' } };
