/**
 * Copyright IBM Corp. 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2023
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript (OverflowMenu cast to its v12 props, which Carbon's export type leaves out), components from @afframe/ui, the WithFeatureFlags decorator removed (enable-v12-release turns enable-v12-overflowmenu and enable-v12-dynamic-floating-styles on globally), the Nested story's inner FeatureFlags wrapper rewritten to individual props with enableV12Release off (under enable-v12-release a v12 flag cannot be turned off alone), keyboard play test on Default, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useRef, useEffect } from 'react';
import type { ComponentType, ReactNode } from 'react';
import type { ArgTypes, Meta, StoryFn } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  FeatureFlags,
  MenuItem,
  MenuItemDivider,
  MenuItemGroup,
  MenuItemRadioGroup,
  MenuItemSelectable,
  OverflowMenu as CarbonOverflowMenu,
} from '../../index.js';
import type { PopoverProps } from '../../index.js';

interface OverflowMenuStoryArgs {
  autoAlign?: boolean | undefined;
  label?: string | undefined;
  menuAlignment?:
    'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | undefined;
  size?: 'xs' | 'sm' | 'md' | 'lg' | undefined;
  tooltipAlignment?: PopoverProps<'span'>['align'];
}

// Under enable-v12-overflowmenu, OverflowMenu renders the v12 menu, whose
// props Carbon's export type does not list.
const OverflowMenu = CarbonOverflowMenu as ComponentType<
  OverflowMenuStoryArgs & { children?: ReactNode }
>;

const args: OverflowMenuStoryArgs = {
  autoAlign: false,
  label: 'Options',
  menuAlignment: 'bottom-start',
  size: 'md',
  tooltipAlignment: 'top',
};

const tooltipAlignmentOptions = [
  'top',
  'top-start',
  'top-end',
  'bottom',
  'bottom-start',
  'bottom-end',
  'left',
  'left-start',
  'left-end',
  'right',
  'right-start',
  'right-end',
];

const argTypes: Partial<ArgTypes<OverflowMenuStoryArgs>> = {
  autoAlign: {
    control: { type: 'boolean' },
  },
  label: {
    control: { type: 'text' },
  },
  menuAlignment: {
    options: ['bottom-start', 'bottom-end', 'top-start', 'top-end'],
    control: { type: 'select' },
    description:
      'Specify how the menu should align with the button element `bottom-start` `bottom-end` `top-start` `top-end`',
  },
  size: {
    options: ['xs', 'sm', 'md', 'lg'],
    control: { type: 'select' },
  },
  tooltipAlignment: {
    options: tooltipAlignmentOptions,
    control: { type: 'select' },
  },
};

export default {
  title: 'Components/OverflowMenu/Feature Flag',
  component: OverflowMenu,
  subcomponents: {
    MenuItem,
    MenuItemSelectable,
    MenuItemGroup,
    MenuItemRadioGroup,
    MenuItemDivider,
  },
  tags: ['carbon', '!autodocs'],
  args,
  argTypes,
  parameters: {
    controls: {
      exclude: ['renderIcon', 'menuTarget'],
    },
  },
} satisfies Meta<OverflowMenuStoryArgs>;

export const AutoAlign: StoryFn<OverflowMenuStoryArgs> = (args) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref?.current?.scrollIntoView({ block: 'center', inline: 'center' });
  });

  return (
    <div style={{ width: '4900px', height: '4900px' }}>
      <div
        style={{
          position: 'absolute',
          top: '2450px',
          left: '2450px',
        }}
        ref={ref}>
        <OverflowMenu {...args}>
          <MenuItem label="Stop app" />
          <MenuItem label="Restart app" />
          <MenuItem label="Rename app" />
          <MenuItem label="Edit routes and access" />
          <MenuItemDivider />
          <MenuItem label="Delete app" kind="danger" />
        </OverflowMenu>
      </div>
    </div>
  );
};

AutoAlign.args = {
  autoAlign: true,
};

AutoAlign.argTypes = {
  autoAlign: {
    table: { readonly: true },
  },
};

export const Nested: StoryFn<OverflowMenuStoryArgs> = (args) => {
  return (
    <FeatureFlags
      enableV12Release={false}
      enableV12Overflowmenu
      enableV12DynamicFloatingStyles={false}>
      <OverflowMenu {...args}>
        <MenuItem label="Level 1" />
        <MenuItem label="Level 1" />
        <MenuItem label="Level 1">
          <MenuItem label="Level 2">
            <MenuItem label="Level 3" />
            <MenuItem label="Level 3">
              <MenuItem label="Level 4" />
            </MenuItem>
          </MenuItem>
          <MenuItem label="Level 2" />
          <MenuItem label="Level 2" />
        </MenuItem>
        <MenuItem label="Level 1" />
      </OverflowMenu>
    </FeatureFlags>
  );
};

export const WithMenuAlignment: StoryFn<OverflowMenuStoryArgs> = (args) => {
  const { autoAlign, label, size } = args;
  const menuArgs = { autoAlign, label, size };

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <OverflowMenu {...menuArgs} menuAlignment="bottom-start">
          <MenuItem label="Stop app" />
          <MenuItem label="Restart app" />
          <MenuItem label="Rename app" />
          <MenuItem label="Edit routes and access" />
          <MenuItemDivider />
          <MenuItem label="Delete app" kind="danger" />
        </OverflowMenu>

        <OverflowMenu {...menuArgs} menuAlignment="bottom-end">
          <MenuItem label="Stop app" />
          <MenuItem label="Restart app" />
          <MenuItem label="Rename app" />
          <MenuItem label="Edit routes and access" />
          <MenuItemDivider />
          <MenuItem label="Delete app" kind="danger" />
        </OverflowMenu>
      </div>

      <div
        style={{
          display: 'flex',
          marginTop: '15rem',
          justifyContent: 'space-between',
        }}>
        <OverflowMenu
          {...menuArgs}
          menuAlignment="top-start"
          tooltipAlignment="bottom">
          <MenuItem label="Stop app" />
          <MenuItem label="Restart app" />
          <MenuItem label="Rename app" />
          <MenuItem label="Edit routes and access" />
          <MenuItemDivider />
          <MenuItem label="Delete app" kind="danger" />
        </OverflowMenu>

        <OverflowMenu
          {...menuArgs}
          menuAlignment="top-end"
          tooltipAlignment="bottom">
          <MenuItem label="Stop app" />
          <MenuItem label="Restart app" />
          <MenuItem label="Rename app" />
          <MenuItem label="Edit routes and access" />
          <MenuItemDivider />
          <MenuItem label="Delete app" kind="danger" />
        </OverflowMenu>
      </div>
    </>
  );
};

WithMenuAlignment.parameters = {
  controls: {
    include: ['autoAlign', 'label', 'size'],
  },
};

export const FloatingStyles: StoryFn<OverflowMenuStoryArgs> = (args) => {
  return (
    <div>
      <OverflowMenu {...args}>
        <MenuItem label="Stop app" />
        <MenuItem label="Restart app" />
        <MenuItem label="Rename app" />
        <MenuItem label="Edit routes and access" />
        <MenuItemDivider />
        <MenuItem label="Delete app" kind="danger" />
      </OverflowMenu>
    </div>
  );
};

export const Default: StoryFn<OverflowMenuStoryArgs> = (args) => {
  return (
    <OverflowMenu {...args}>
      <MenuItem label="Stop app" />
      <MenuItem label="Restart app" />
      <MenuItem label="Rename app" />
      <MenuItem label="Edit routes and access" />
      <MenuItemDivider />
      <MenuItem label="Delete app" kind="danger" />
    </OverflowMenu>
  );
};

// The v12 menu opens on Enter and moves focus to its first item.
Default.play = async ({ canvasElement }) => {
  within(canvasElement).getByRole('button').focus();
  await userEvent.keyboard('{Enter}');
  const body = within(canvasElement.ownerDocument.body);
  await waitFor(() =>
    expect(body.getByRole('menuitem', { name: 'Stop app' })).toHaveFocus()
  );
  await userEvent.keyboard('{ArrowDown}');
  await expect(
    body.getByRole('menuitem', { name: 'Restart app' })
  ).toHaveFocus();
  await userEvent.keyboard('{Escape}');
};
