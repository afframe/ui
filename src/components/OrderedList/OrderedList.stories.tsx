/**
 * Copyright IBM Corp. 2022, 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2022, 2025
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, source tag, items from the Afframe example invoice flow. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ArgTypes, Meta, StoryFn } from '@storybook/react-vite';
import { ListItem, OrderedList } from '../../index.js';
import mdx from './OrderedList.mdx';

const args = {
  isExpressive: false,
  native: false,
  nested: false,
};

const argTypes: ArgTypes = {
  isExpressive: {
    control: {
      type: 'boolean',
    },
  },
  native: {
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
  title: 'Components/OrderedList',
  component: OrderedList,
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
} satisfies Meta<typeof OrderedList>;

export const Default: StoryFn<typeof OrderedList> = (args) => (
  <OrderedList {...args}>
    <ListItem>Create the invoice</ListItem>
    <ListItem>Send it to the customer</ListItem>
    <ListItem>Record the payment</ListItem>
  </OrderedList>
);

export const Nested: StoryFn<typeof OrderedList> = ({
  nested,
  ...listArgs
}) => {
  return (
    <OrderedList {...listArgs}>
      <ListItem>Create the invoice</ListItem>
      <ListItem>Send it to the customer</ListItem>
      <ListItem>
        Record the payment
        <OrderedList {...listArgs} nested={nested}>
          <ListItem>
            Match the bank transfer
            <OrderedList {...listArgs} nested={nested}>
              <ListItem>Check the invoice number</ListItem>
              <ListItem>Check the amount</ListItem>
            </OrderedList>
          </ListItem>
          <ListItem>Mark the invoice as Paid</ListItem>
        </OrderedList>
      </ListItem>
    </OrderedList>
  );
};

Nested.args = {
  nested: true,
};

Nested.argTypes = {
  nested: {
    control: false,
  },
};

export const NativeListStyles: StoryFn<typeof OrderedList> = ({
  nested,
  ...listArgs
}) => {
  return (
    <OrderedList {...listArgs}>
      <ListItem>Create the invoice</ListItem>
      <ListItem>Send it to the customer</ListItem>
      <ListItem>
        Record the payment
        <OrderedList {...listArgs} nested={nested}>
          <ListItem>Match the bank transfer</ListItem>
          <ListItem>Check the amount</ListItem>
          <ListItem>Mark the invoice as Paid</ListItem>
          <ListItem>Send a receipt</ListItem>
        </OrderedList>
      </ListItem>
      <ListItem>Archive the invoice</ListItem>
    </OrderedList>
  );
};

NativeListStyles.args = {
  native: true,
  nested: true,
};

NativeListStyles.argTypes = {
  native: {
    control: false,
  },
  nested: {
    control: false,
  },
};
