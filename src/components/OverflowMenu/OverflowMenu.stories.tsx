/**
 * Copyright IBM Corp. 2016, 2023, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2023, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, OverflowMenu and OverflowMenuItem from @afframe/ui, icons from @afframe/ui/icons, source tag, stories rendered with the v11 overflow menu (OverflowMenuItem children). Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ArgTypes, Meta, StoryFn } from '@storybook/react-vite';
import {
  MenuItem,
  OverflowMenu,
  OverflowMenuItem,
  useFeatureFlag,
} from '../../index.js';
import type { OverflowMenuProps } from '../../index.js';
import { Filter } from '../../icons.js';
import { withV11OverflowMenu } from '../../../.storybook/templates/withV11OverflowMenu.js';
import mdx from './OverflowMenu.mdx';

const args: Partial<OverflowMenuProps> = {
  flipped: document?.dir === 'rtl',
  focusTrap: false,
  iconDescription: 'Options',
  open: false,
  size: 'md',
};

const argTypes: Partial<ArgTypes<OverflowMenuProps>> = {
  align: {
    options: [
      'top',
      'top-start',
      'top-end',
      'bottom',
      'bottom-start',
      'bottom-end',
      'left',
      'left-end',
      'left-start',
      'right',
      'right-end',
      'right-start',
    ],
    control: { type: 'select' },
    description:
      'Specify how the tooltip on the trigger button should be aligned',
  },
  autoAlign: {
    control: { type: 'boolean' },
    description:
      'Will attempt to automatically align the tooltip on the trigger button to avoid collisions with the viewport',
  },
  defaultOpen: {
    control: { type: 'boolean' },
    description:
      'Specify whether the tooltip should be open when it first renders',
  },
  disabled: {
    control: { type: 'boolean' },
    description: 'Specify whether the trigger button should be disabled',
  },
  enterDelayMs: {
    control: { type: 'number' },
    description:
      'Specify the duration in milliseconds to delay before displaying the tooltip',
  },
  flipped: {
    control: { type: 'boolean' },
  },
  focusTrap: {
    control: { type: 'boolean' },
  },
  iconDescription: {
    control: { type: 'text' },
  },
  leaveDelayMs: {
    control: { type: 'number' },
    description:
      'Specify the duration in milliseconds to delay before hiding the tooltip',
  },
  open: {
    control: { type: 'boolean' },
  },
  size: {
    options: ['xs', 'sm', 'md', 'lg'],
    control: { type: 'select' },
  },
};

export default {
  title: 'Components/OverflowMenu',
  tags: ['carbon'],
  component: OverflowMenu,
  subcomponents: {
    OverflowMenuItem,
  },
  decorators: [withV11OverflowMenu],
  parameters: {
    docs: {
      page: mdx,
    },
    controls: {
      exclude: [
        'direction',
        'iconClass',
        'id',
        'light',
        'menuOffset',
        'menuOffsetFlip',
        'menuOptionsClass',
        'renderIcon',
      ],
    },
  },
  args,
  argTypes,
} satisfies Meta<typeof OverflowMenu>;

export const RenderCustomIcon: StoryFn<typeof OverflowMenu> = (args) => {
  const enableV12OverflowMenu = useFeatureFlag('enable-v12-overflowmenu');

  return (
    <OverflowMenu {...args} renderIcon={Filter}>
      {enableV12OverflowMenu ? (
        <>
          <MenuItem label="Filter A" />
          <MenuItem label="Filter B" />
        </>
      ) : (
        <>
          <OverflowMenuItem itemText="Filter A" />
          <OverflowMenuItem itemText="Filter B" />
        </>
      )}
    </OverflowMenu>
  );
};
export const Default: StoryFn<typeof OverflowMenu> = (args) => (
  <OverflowMenu aria-label="overflow-menu" {...args}>
    <OverflowMenuItem itemText="Stop app" />
    <OverflowMenuItem itemText="Restart app" />
    <OverflowMenuItem itemText="Rename app" />
    <OverflowMenuItem itemText="Clone and move app" disabled requireTitle />
    <OverflowMenuItem itemText="Edit routes and access" requireTitle />
    <OverflowMenuItem hasDivider isDelete itemText="Delete app" />
  </OverflowMenu>
);
