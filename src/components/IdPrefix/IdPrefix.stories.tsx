/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2023
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, source tag, "none" shown when no prefix is set. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { IdPrefix, useIdPrefix } from '../../index.js';
import mdx from './IdPrefix.mdx';

export default {
  title: 'Utilities/IdPrefix',
  component: IdPrefix,
  tags: ['carbon'],
  args: {
    prefix: 'custom',
  },
  argTypes: {
    prefix: {
      control: { type: 'text' },
    },
  },
  parameters: {
    controls: {
      exclude: ['children'],
    },
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof IdPrefix>;

export const Default: StoryFn<typeof IdPrefix> = (args) => {
  function ExampleComponent() {
    const idPrefix = useIdPrefix();
    return <p>The current id prefix is: {idPrefix ?? 'none'}</p>;
  }

  return (
    <>
      <ExampleComponent />
      <IdPrefix {...args}>
        <ExampleComponent />
      </IdPrefix>
    </>
  );
};
