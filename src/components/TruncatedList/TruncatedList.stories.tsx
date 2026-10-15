/**
 * Copyright IBM Corp. 2024, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2024, 2024
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, previewCandidate__TruncatedList and ListItem from @afframe/ui, source tag, scss styles replaced by truncated-list-story.css (the top-alignment override of the centered root is dropped), story names unified, items are example invoice numbers. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { ListItem, previewCandidate__TruncatedList } from '../../index.js';
import mdx from './TruncatedList.mdx';
import './truncated-list-story.css';

const TruncatedList = previewCandidate__TruncatedList;

const storyClass = 'truncated-list-stories';

const invoiceNumbers = Array.from(
  { length: 16 },
  (_, i) => `INV-2026-${String(i + 1).padStart(4, '0')}`
);

export default {
  title: 'Preview/previewCandidate__TruncatedList',
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
        {invoiceNumbers.map((invoice) => (
          <ListItem key={invoice}>Invoice {invoice}</ListItem>
        ))}
      </TruncatedList>
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  as: 'ul',
  collapsedItemsLimit: 3,
  expandedItemsLimit: 9,
};
