/**
 * Copyright IBM Corp. 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2023
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, Menu parts from @afframe/ui, icons from @afframe/ui/icons, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import {
  Copy,
  Cut,
  FolderShared,
  Paste,
  TextBold,
  TextItalic,
  TrashCan,
} from '../../icons.js';
import {
  Menu,
  MenuItem,
  MenuItemSelectable,
  MenuItemGroup,
  MenuItemRadioGroup,
  MenuItemDivider,
} from '../../index.js';
import mdx from './Menu.mdx';

export default {
  title: 'Components/Menu',
  tags: ['carbon'],
  component: Menu,
  subcomponents: {
    MenuItem,
    MenuItemSelectable,
    MenuItemGroup,
    MenuItemRadioGroup,
    MenuItemDivider,
  },
  parameters: {
    docs: {
      page: mdx,
    },
    controls: {
      exclude: ['target'],
    },
  },
  argTypes: {
    mode: {
      control: false,
    },
  },
} satisfies Meta<typeof Menu>;

export const Default: StoryFn<typeof Menu> = (args) => {
  const itemOnClick = action('onClick (MenuItem)');
  const selectableOnChange = action('onChange (MenuItemSelectable)');
  const radioOnChange = action('onChange (MenuItemRadioGroup)');

  // Falls back to the body, the Menu default, when the root is missing.
  const target = document.getElementById('storybook-root') ?? document.body;

  return (
    <Menu {...args} target={target} x={document?.dir === 'rtl' ? 250 : 0}>
      <MenuItem label="Share with" renderIcon={FolderShared}>
        <MenuItemRadioGroup
          label="Share with"
          items={['None', 'Product team', 'Organization', 'Company']}
          defaultSelectedItem="Product team"
          onChange={radioOnChange}
        />
      </MenuItem>
      <MenuItemDivider />
      <MenuItem
        label="Cut"
        shortcut="⌘X"
        onClick={itemOnClick}
        renderIcon={Cut}
      />
      <MenuItem
        label="Copy"
        shortcut="⌘C"
        onClick={itemOnClick}
        renderIcon={Copy}
      />
      <MenuItem
        label="Paste"
        shortcut="⌘V"
        disabled
        onClick={itemOnClick}
        renderIcon={Paste}
      />
      <MenuItemDivider />
      <MenuItemGroup label="Font style">
        <MenuItemSelectable
          label="Bold"
          shortcut="⌘B"
          defaultSelected
          onChange={selectableOnChange}
          renderIcon={TextBold}
        />
        <MenuItemSelectable
          label="Italic"
          shortcut="⌘I"
          onChange={selectableOnChange}
          renderIcon={TextItalic}
        />
      </MenuItemGroup>
      <MenuItemDivider />
      <MenuItemRadioGroup
        label="Text decoration"
        items={['None', 'Overline', 'Line-through', 'Underline']}
        defaultSelectedItem="None"
        onChange={radioOnChange}
      />
      <MenuItemDivider />
      <MenuItem
        label="Delete"
        shortcut="⌫"
        kind="danger"
        onClick={itemOnClick}
        renderIcon={TrashCan}
      />
    </Menu>
  );
};

Default.args = {
  onClose: action('onClose'),
  open: true,
};
