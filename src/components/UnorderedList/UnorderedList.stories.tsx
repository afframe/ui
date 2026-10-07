/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ArgTypes, Meta, StoryFn } from '@storybook/react-vite';
import { ListItem, UnorderedList } from '../../index.js';
import mdx from './UnorderedList.mdx';

const args = {
  isExpressive: false,
  nested: false,
};

const argTypes: ArgTypes = {
  isExpressive: {
    control: {
      type: 'boolean',
    },
  },
  nested: {
    control: {
      type: 'boolean',
    },
  },
};

export default {
  title: 'Components/UnorderedList',
  component: UnorderedList,
  tags: ['carbon'],
  subcomponents: {
    ListItem,
  },
  parameters: {
    docs: {
      page: mdx,
    },
  },
  args,
  argTypes,
} satisfies Meta<typeof UnorderedList>;

export const Default: StoryFn<typeof UnorderedList> = (args) => {
  return (
    <UnorderedList {...args}>
      <ListItem>Review pull requests</ListItem>
      <ListItem>Update dependencies</ListItem>
      <ListItem>Publish the release notes</ListItem>
    </UnorderedList>
  );
};

export const Nested: StoryFn<typeof UnorderedList> = ({
  nested,
  ...listArgs
}) => {
  return (
    <UnorderedList {...listArgs}>
      <ListItem>
        Prepare the release
        <UnorderedList {...listArgs} nested={nested}>
          <ListItem>Review pull requests</ListItem>
          <ListItem>
            Update dependencies
            <UnorderedList {...listArgs} nested={nested}>
              <ListItem>Run the test suite</ListItem>
              <ListItem>Resolve security alerts</ListItem>
            </UnorderedList>
          </ListItem>
        </UnorderedList>
      </ListItem>
      <ListItem>Publish the release notes</ListItem>
      <ListItem>Notify maintainers</ListItem>
    </UnorderedList>
  );
};

Nested.args = {
  nested: true,
};

Nested.argTypes = {
  ...argTypes,
  nested: {
    ...argTypes.nested,
    table: { readonly: true },
  },
};

Nested.storyName = 'nested';
