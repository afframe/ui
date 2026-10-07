/**
 * Copyright IBM Corp. 2024, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2024, 2024
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, previewCandidate__TruncatedList and ListItem from @afframe/ui, source tag, scss styles replaced by truncated-list-story.css (the top-alignment override of the centered root is dropped). Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { ListItem, previewCandidate__TruncatedList } from '../../index.js';
import mdx from './TruncatedList.mdx';
import './truncated-list-story.css';

const TruncatedList = previewCandidate__TruncatedList;

const storyClass = 'truncated-list-stories';

export default {
  title: 'Utilities/TruncatedList',
  component: TruncatedList,
  tags: ['ibm-products'],
  parameters: {
    layout: 'centered',
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof TruncatedList>;

const Template: StoryFn<typeof TruncatedList> = (args) => {
  return (
    <div className={`${storyClass}__viewport`}>
      <TruncatedList
        onClick={(isCollapsed) => {
          action(`clicked, is ${isCollapsed ? 'collapsed' : 'expanded'}`)();
        }}
        {...args}>
        <ListItem>Item 1</ListItem>
        <ListItem>Item 2</ListItem>
        <ListItem>Item 3</ListItem>
        <ListItem>Item 4</ListItem>
        <ListItem>Item 5</ListItem>
        <ListItem>Item 6</ListItem>
        <ListItem>Item 7</ListItem>
        <ListItem>Item 8</ListItem>
        <ListItem>Item 9</ListItem>
        <ListItem>Item 10</ListItem>
        <ListItem>Item 11</ListItem>
        <ListItem>Item 12</ListItem>
        <ListItem>Item 13</ListItem>
        <ListItem>Item 14</ListItem>
        <ListItem>Item 15</ListItem>
        <ListItem>Item 16</ListItem>
      </TruncatedList>
    </div>
  );
};

export const truncatedList = Template.bind({});
truncatedList.args = {
  as: 'ul',
  collapsedItemsLimit: 3,
  expandedItemsLimit: 9,
};
