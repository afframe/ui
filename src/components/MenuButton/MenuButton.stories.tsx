/**
 * Copyright IBM Corp. 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2023
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, MenuButton and Menu parts from @afframe/ui, icons from @afframe/ui/icons, source tag, inline spacing as Carbon spacing tokens. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ArgTypes, Meta, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { MenuButton, MenuItem, MenuItemDivider } from '../../index.js';
import type { MenuButtonProps } from '../../index.js';
import { Asset, User, Group } from '../../icons.js';
import mdx from './MenuButton.mdx';

const commonArgs = {
  disabled: false,
  kind: 'primary',
  label: 'Actions',
  menuAlignment: 'bottom',
  menuBackgroundToken: 'layer',
  menuBorder: false,
  size: 'lg',
  tabIndex: 0,
} satisfies Partial<MenuButtonProps>;

const commonArgTypes: Partial<ArgTypes<MenuButtonProps>> = {
  disabled: {
    control: { type: 'boolean' },
  },
  kind: {
    control: { type: 'radio' },
    options: ['primary', 'tertiary', 'ghost'],
  },
  label: {
    control: { type: 'text' },
  },
  menuAlignment: {
    control: { type: 'select' },
    options: [
      'top',
      'top-start',
      'top-end',
      'bottom',
      'bottom-start',
      'bottom-end',
    ],
  },
  menuBackgroundToken: {
    control: { type: 'select' },
    options: ['layer', 'background'],
  },
  menuBorder: {
    control: { type: 'boolean' },
  },
  size: {
    control: { type: 'radio' },
    options: ['xs', 'sm', 'md', 'lg'],
  },
  tabIndex: {
    control: { type: 'number' },
  },
};

export default {
  title: 'Components/MenuButton',
  tags: ['carbon'],
  component: MenuButton,
  argTypes: commonArgTypes,
  subcomponents: {
    MenuItem,
    MenuItemDivider,
  },
  parameters: {
    docs: {
      page: mdx,
    },
    controls: {
      exclude: ['children', 'menuTarget'],
    },
  },
} satisfies Meta<typeof MenuButton>;

export const Default: StoryFn<typeof MenuButton> = (args) => {
  return (
    <MenuButton {...args} onClick={action('onClick')}>
      <MenuItem
        label="First action with a long label description"
        onClick={action('onClick')}
      />
      <MenuItem label="Second action" onClick={action('onClick')} />
      <MenuItem label="Third action" onClick={action('onClick')} disabled />
    </MenuButton>
  );
};

Default.args = commonArgs;

export const ExperimentalAutoAlign: StoryFn<typeof MenuButton> = (args) => (
  <div style={{ width: '5000px', height: '5000px' }}>
    <div
      style={{
        position: 'absolute',
        bottom: 'var(--cds-spacing-06)',
      }}>
      <MenuButton {...args}>
        <MenuItem label="First action" />
        <MenuItem label="Second action that is a longer item to test overflow and title." />
        <MenuItem label="Third action" disabled />
      </MenuButton>
    </div>
  </div>
);

ExperimentalAutoAlign.args = commonArgs;

export const WithDanger: StoryFn<typeof MenuButton> = (args) => {
  return (
    <MenuButton {...args}>
      <MenuItem label="First action" />
      <MenuItem label="Second action" />
      <MenuItem label="Third action" />
      <MenuItemDivider />
      <MenuItem label="Danger action" kind="danger" />
    </MenuButton>
  );
};

WithDanger.args = commonArgs;

export const WithDividers: StoryFn<typeof MenuButton> = (args) => {
  return (
    <MenuButton {...args}>
      <MenuItem label="Create service request" />
      <MenuItem label="Create work order" />
      <MenuItemDivider />
      <MenuItem label="Add plan" />
      <MenuItem label="Add flag" />
      <MenuItemDivider />
      <MenuItem label="Edit source location" />
      <MenuItem label="Recalculate source" />
    </MenuButton>
  );
};

WithDividers.args = commonArgs;

export const WithIcons: StoryFn<typeof MenuButton> = (args) => {
  return (
    <MenuButton {...args}>
      <MenuItem label="Asset" renderIcon={Asset} />
      <MenuItem label="User" renderIcon={User} />
      <MenuItem label="User group" renderIcon={Group} />
    </MenuButton>
  );
};

WithIcons.args = {
  ...commonArgs,
  label: 'Add',
};

export const WithNestedMenu: StoryFn<typeof MenuButton> = (args) => (
  <MenuButton {...args}>
    <MenuItem label="Save" shortcut="⌘S" />
    <MenuItem label="Save as" shortcut="⌥⌘S" />
    <MenuItem label="Export as">
      <MenuItem label="PDF" />
      <MenuItem label="JPG" />
      <MenuItem label="PNG" />
    </MenuItem>
    <MenuItemDivider />
    <MenuItem label="Delete" kind="danger" />
  </MenuButton>
);

WithNestedMenu.args = commonArgs;

export const WithMenuAlignment: StoryFn<typeof MenuButton> = ({
  disabled,
  kind,
  menuBackgroundToken,
  menuBorder,
  size,
  tabIndex,
}) => {
  // Controls left unset stay undefined, as upstream passes them.
  const sharedProps = {
    disabled,
    kind,
    menuBackgroundToken,
    menuBorder,
    size,
    tabIndex,
  } as Pick<
    MenuButtonProps,
    | 'disabled'
    | 'kind'
    | 'menuBackgroundToken'
    | 'menuBorder'
    | 'size'
    | 'tabIndex'
  >;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <MenuButton {...sharedProps} label="Bottom" menuAlignment="bottom">
          <MenuItem label="First action" />
          <MenuItem label="Second action that is a longer item to test overflow and title." />
          <MenuItem label="Third action" disabled />
        </MenuButton>

        <MenuButton
          {...sharedProps}
          label="Bottom start"
          menuAlignment="bottom-start">
          <MenuItem label="First action" />
          <MenuItem label="Second action that is a longer item to test overflow and title." />
          <MenuItem label="Third action" disabled />
        </MenuButton>

        <MenuButton
          {...sharedProps}
          label="Bottom end"
          menuAlignment="bottom-end">
          <MenuItem label="First action" />
          <MenuItem label="Second action that is a longer item to test overflow and title." />
          <MenuItem label="Third action" disabled />
        </MenuButton>
      </div>

      <div
        style={{
          display: 'flex',
          marginTop: '15rem',
          justifyContent: 'space-between',
        }}>
        <MenuButton {...sharedProps} label="Top" menuAlignment="top">
          <MenuItem label="First action" />
          <MenuItem label="Second action that is a longer item to test overflow and title." />
          <MenuItem label="Third action" disabled />
        </MenuButton>

        <MenuButton
          {...sharedProps}
          label="Top start"
          menuAlignment="top-start">
          <MenuItem label="First action" />
          <MenuItem label="Second action that is a longer item to test overflow and title." />
          <MenuItem label="Third action" disabled />
        </MenuButton>

        <MenuButton {...sharedProps} label="Top end" menuAlignment="top-end">
          <MenuItem label="First action" />
          <MenuItem label="Second action that is a longer item to test overflow and title." />
          <MenuItem label="Third action" disabled />
        </MenuButton>
      </div>
    </>
  );
};

WithMenuAlignment.args = {
  disabled: commonArgs.disabled,
  kind: commonArgs.kind,
  menuBackgroundToken: commonArgs.menuBackgroundToken,
  menuBorder: commonArgs.menuBorder,
  size: commonArgs.size,
  tabIndex: commonArgs.tabIndex,
};

WithMenuAlignment.parameters = {
  controls: {
    include: [
      'disabled',
      'kind',
      'menuBackgroundToken',
      'menuBorder',
      'size',
      'tabIndex',
    ],
  },
};
