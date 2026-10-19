/**
 * Copyright IBM Corp. 2016, 2023, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2023, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, OverflowMenu and OverflowMenuItem from @afframe/ui, icons from @afframe/ui/icons, source tag, upstream v12 overflow menu branches removed, Afframe story for the 1.0.1 menu items added, story names unified, innerRef without a control, autoAlign on in the v11 stories, the 1.0.1 story renamed WithMenuItems with controls for the newer menu props and an auto-aligned tooltip. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ArgTypes, Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { afframeA11y } from '../../../.storybook/afframeA11y.js';
import {
  MenuItem,
  MenuItemDivider,
  OverflowMenu,
  OverflowMenuItem,
} from '../../index.js';
import type { IconButtonProps, OverflowMenuProps } from '../../index.js';
import { Filter } from '../../icons.js';
import mdx from './OverflowMenu.mdx';

const args: Partial<OverflowMenuProps> = {
  // Afframe: keeps the trigger tooltip inside the story frame on focus.
  autoAlign: true,
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
  // A ref holds a DOM node, and the Controls panel crashes serialising it.
  innerRef: { control: false },
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

export const RenderCustomIcon: StoryFn<typeof OverflowMenu> = (args) => (
  <OverflowMenu {...args} renderIcon={Filter}>
    <OverflowMenuItem itemText="Filter A" />
    <OverflowMenuItem itemText="Filter B" />
  </OverflowMenu>
);

type NewerMenuArgs = {
  autoAlign: boolean;
  label: string;
  menuAlignment: 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
  size: 'xs' | 'sm' | 'md' | 'lg';
  tooltipAlignment?: IconButtonProps['align'];
  tooltipAutoAlign: boolean;
};

// Afframe: the 1.0.x shape, `label` and MenuItem children. The Afframe
// OverflowMenu turns on Carbon's newer menu for it, so the keyboard works.
export const WithMenuItems: StoryObj<NewerMenuArgs> = {
  tags: ['afframe'],
  parameters: {
    ...afframeA11y,
    controls: {
      include: [
        'autoAlign',
        'label',
        'menuAlignment',
        'size',
        'tooltipAlignment',
        'tooltipAutoAlign',
      ],
    },
  },
  args: {
    autoAlign: false,
    label: 'Row actions',
    menuAlignment: 'bottom-start',
    tooltipAutoAlign: true,
  },
  argTypes: {
    autoAlign: {
      control: { type: 'boolean' },
      description:
        'Will attempt to automatically align the menu to avoid collisions with the viewport',
    },
    label: { control: { type: 'text' } },
    menuAlignment: {
      options: ['top-start', 'top-end', 'bottom-start', 'bottom-end'],
      control: { type: 'select' },
    },
    tooltipAlignment: {
      options: argTypes.align?.options ?? [],
      control: { type: 'select' },
      description: 'Specify how the trigger tooltip should be aligned',
    },
    tooltipAutoAlign: {
      control: { type: 'boolean' },
      description:
        'Will attempt to automatically align the trigger tooltip to avoid collisions with the viewport',
    },
  },
  // Only the newer menu props: the v11 args in Meta would reach its div, and
  // an undefined tooltipAlignment fails exactOptionalPropertyTypes.
  render: ({
    autoAlign,
    label,
    menuAlignment,
    size,
    tooltipAlignment,
    tooltipAutoAlign,
  }) => (
    <OverflowMenu
      autoAlign={autoAlign}
      label={label}
      menuAlignment={menuAlignment}
      size={size}
      {...(tooltipAlignment && { tooltipAlignment })}
      tooltipAutoAlign={tooltipAutoAlign}>
      <MenuItem label="Edit" onClick={action('Edit')} />
      <MenuItem label="Duplicate" onClick={action('Duplicate')} />
      <MenuItemDivider />
      <MenuItem label="Delete" kind="danger" onClick={action('Delete')} />
    </OverflowMenu>
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button');
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    // The menu renders in a portal on the body.
    const body = within(document.body);
    await waitFor(() =>
      expect(body.getByRole('menuitem', { name: 'Edit' })).toHaveFocus()
    );
    await userEvent.keyboard('{ArrowDown}');
    await expect(
      body.getByRole('menuitem', { name: 'Duplicate' })
    ).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};
