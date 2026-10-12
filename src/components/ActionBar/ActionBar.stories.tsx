/**
 * Copyright IBM Corp. 2020, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2020, 2024
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and icons from @afframe/ui, source tag, the MDX page replaces the docs page component, DisplayBox decorator and its styles dropped. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ComponentProps, ComponentType } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { Bee, Lightning } from '../../icons.js';
import { ActionBar } from '../../index.js';
import mdx from './ActionBar.mdx';

type ActionBarProps = ComponentProps<typeof ActionBar>;

// `actions` holds an option index; Storybook maps it to the array.
type StoryArgs = Omit<ActionBarProps, 'actions'> & {
  actions: number;
  containerWidth: number;
};

const getActions = (num: number) =>
  Array.from({ length: num }, (_, num) => ({
    key: `a-key-${num}`,
    renderIcon:
      num % 2
        ? (props: object) => <Lightning size={16} {...props} />
        : (props: object) => <Bee size={16} {...props} />,
    iconDescription: `Action ${num}`,
    label: `Action ${num}`,
    onClick: action(`Action ${num}`),
  }));

export default {
  title: 'Utilities/ActionBar',
  component: ActionBar as unknown as ComponentType<StoryArgs>,
  tags: ['ibm-products'],
  argTypes: {
    actions: {
      control: {
        type: 'select',
        labels: ['None', 'A few', 'A lot'],
      },
      options: [0, 1, 2],
      mapping: [[], getActions(10), getActions(20)],
    },
    containerWidth: {
      control: { type: 'range', min: 20, max: 800, step: 10 },
    },
  },
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<StoryArgs>;

const Template: StoryFn<StoryArgs> = ({ containerWidth, actions, ...args }) => {
  return (
    <div style={{ width: containerWidth }}>
      <ActionBar
        {...args}
        actions={actions as unknown as NonNullable<ActionBarProps['actions']>}
      />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  actions: 1,
  containerWidth: 500,
  overflowAriaLabel: 'Open and close additional action bar items list.',
};
