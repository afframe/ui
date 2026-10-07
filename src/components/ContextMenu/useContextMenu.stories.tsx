/**
 * Copyright IBM Corp. 2020, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2020, 2023
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, Menu parts, CodeSnippet, lists and hooks from @afframe/ui (usePrefix is useCarbonPrefix), source tag, inline spacing as Carbon spacing tokens. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useRef } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import {
  CodeSnippet,
  ListItem,
  Menu,
  MenuItem,
  MenuItemDivider,
  MenuItemRadioGroup,
  UnorderedList,
  useCarbonPrefix as usePrefix,
  useContextMenu,
} from '../../index.js';
import mdx from './useContextMenu.mdx';

export default {
  title: 'Hooks/useContextMenu',
  tags: ['carbon'],
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta;

const Text = () => (
  <div style={{ width: '40rem' }}>
    <h2>Right click anywhere in the story frame</h2>
    <br />
    <p>
      The <CodeSnippet type="inline">{`<Menu>`}</CodeSnippet> props are set
      using the hook{' '}
      <CodeSnippet type="inline">{`useContextMenu()`}</CodeSnippet>. This
      determines the position the menu should have on right click and handles
      opening. Props that the{' '}
      <CodeSnippet type="inline">{`useContextMenu()`}</CodeSnippet>
      hook does not set and can be configured by the user are:
      <UnorderedList
        style={{
          paddingLeft: 'var(--cds-spacing-07)',
          margin: 'var(--cds-spacing-07) 0',
        }}>
        <ListItem>className</ListItem>
        <ListItem>label</ListItem>
        <ListItem>size</ListItem>
        <ListItem>target</ListItem>
      </UnorderedList>
    </p>
    <p>
      The
      <CodeSnippet type="inline">{`<MenuItemGroup>`}</CodeSnippet> and
      <CodeSnippet type="inline">{`<MenuItem>`}</CodeSnippet>
      components accept children items for nested menus, although the{' '}
      <CodeSnippet type="inline">{`<MenuItem>`}</CodeSnippet> component can also
      be used as a stand alone item. The other types of menu items ({' '}
      <CodeSnippet type="inline">{`<MenuItemDivider>`}</CodeSnippet>,
      <CodeSnippet type="inline">{`<MenuItemSelectable>`}</CodeSnippet>,
      <CodeSnippet type="inline">{`<MenuItemRadioGroup>`}</CodeSnippet>) do not
      accept children. The{' '}
      <CodeSnippet type="inline">{`<MenuItemRadioGroup>`}</CodeSnippet> accepts
      an array of items to display as a group of single choice selection.
    </p>
  </div>
);

export const _useContextMenu: StoryFn = () => {
  const onClick = action('onClick (MenuItem)');
  const onChange = action('onClick (MenuItemRadioGroup)');

  const menuProps = useContextMenu();

  return (
    <>
      <Text />
      <Menu {...menuProps} label="Context menu">
        <MenuItem label="Share with">
          <MenuItemRadioGroup
            label="Share with"
            items={['None', 'Product team', 'Organization', 'Company']}
            defaultSelectedItem="Product team"
            onChange={onChange}
          />
        </MenuItem>
        <MenuItemDivider />
        <MenuItem label="Cut" shortcut="⌘X" onClick={onClick} />
        <MenuItem label="Copy" shortcut="⌘C" onClick={onClick} />
        <MenuItem label="Copy path" shortcut="⌥⌘C" onClick={onClick} />
        <MenuItem label="Paste" disabled shortcut="⌘V" onClick={onClick} />
        <MenuItem label="Duplicate" onClick={onClick} />
        <MenuItemDivider />
        <MenuItem label="Rename" onClick={onClick} />
        <MenuItem label="Delete" shortcut="⌫" kind="danger" onClick={onClick} />
      </Menu>
    </>
  );
};

export const SpecificElement: StoryFn = () => {
  const prefix = usePrefix();

  const el = useRef<HTMLDivElement>(null);
  const menuProps = useContextMenu(el);

  return (
    <>
      <div
        ref={el}
        style={{
          cursor: 'context-menu',
          display: 'inline',
          padding: 'var(--cds-spacing-03) var(--cds-spacing-05)',
          backgroundColor: `var(--${prefix}-layer-01)`,
        }}>
        Right click this element
      </div>
      <Menu {...menuProps} label="Element menu">
        <MenuItem label="Edit" />
        <MenuItem label="Delete" kind="danger" />
      </Menu>
    </>
  );
};
