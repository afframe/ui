/**
 * Copyright IBM Corp. 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2025
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, Labs UI shell components from @afframe/ui under their Labs names (SideNavLabs and the rest of the Labs side nav set), Carbon components and icons from @afframe/ui (styles ship in the package CSS, so the ui-shell.scss import is dropped), title under Components/UI Shell/Labs, a11y rule exceptions for the upstream treeview and rail panel markup, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { Add, Fade, VirtualColumnKey } from '../../icons.js';
import {
  Dropdown,
  SIDE_NAV_TYPE,
  SideNavDivider,
  SideNavItemsLabs,
  SideNavLabs,
  SideNavLinkLabs,
  SideNavMenuItemLabs,
  SideNavMenuLabs,
  SideNavSlot,
  SideNavTitle,
} from '../../index.js';
import mdx from './SideNav.mdx';

interface DropdownItem {
  text: string;
}

export default {
  title: 'Components/UI Shell/Labs/SideNav',
  component: SideNavLabs,
  subcomponents: {
    SideNavLabs,
    SideNavItemsLabs,
    SideNavLinkLabs,
    SideNavMenuLabs,
    SideNavMenuItemLabs,
    SideNavSlot,
    SideNavTitle,
  },
  tags: ['labs'],
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof SideNavLabs>;

// The Labs treeview puts role="tree" and role="group" on the side nav lists
// but leaves their <li> elements without a role, so the treeitem links lack a
// tree or group parent and the lists hold plain list items (upstream markup).
const treeviewA11y = {
  a11y: {
    config: {
      rules: [
        { id: 'listitem', enabled: false },
        { id: 'aria-required-parent', enabled: false },
        { id: 'aria-required-children', enabled: false },
      ],
    },
  },
};

/**
 * Story for SideNav
 * @returns {React.ReactElement} The JSX for the story
 */
export const Default: StoryFn<typeof SideNavLabs> = () => (
  <SideNavLabs
    isTreeview
    isFixedNav
    expanded
    isChildOfHeader={false}
    aria-label="Side navigation">
    <SideNavItemsLabs>
      <SideNavSlot renderIcon={VirtualColumnKey}>
        <Dropdown
          id="default"
          size="sm"
          itemToString={(item: DropdownItem | null) => (item ? item.text : '')}
          items={[
            { text: 'Option 1' },
            { text: 'Option 2' },
            { text: 'Option 3' },
          ]}
          label="Choose an option"
          titleText="Choose an option"
          hideLabel
        />
      </SideNavSlot>
      <SideNavMenuLabs renderIcon={Fade} title="Sub-menu level 1">
        <SideNavMenuItemLabs href="#">Link</SideNavMenuItemLabs>
        <SideNavMenuItemLabs href="#">Link</SideNavMenuItemLabs>
        <SideNavMenuItemLabs href="#">Link</SideNavMenuItemLabs>
      </SideNavMenuLabs>
      <SideNavMenuLabs renderIcon={Fade} title="Sub-menu level 1">
        <SideNavMenuItemLabs href="#">Link</SideNavMenuItemLabs>
      </SideNavMenuLabs>
      <SideNavMenuLabs renderIcon={Fade} title="Sub-menu level 1">
        <SideNavMenuItemLabs href="#">Link</SideNavMenuItemLabs>
      </SideNavMenuLabs>
      <SideNavMenuLabs renderIcon={Fade} title="Sub-menu level 1">
        <SideNavMenuItemLabs href="#">Link</SideNavMenuItemLabs>
      </SideNavMenuLabs>
      <SideNavMenuLabs renderIcon={Fade} title="Sub-menu level 1">
        <SideNavMenuItemLabs href="#">Link</SideNavMenuItemLabs>
      </SideNavMenuLabs>
      <SideNavDivider />
      <SideNavLinkLabs renderIcon={Fade} href="#">
        Link
      </SideNavLinkLabs>
      <SideNavLinkLabs renderIcon={Fade} href="#">
        Link
      </SideNavLinkLabs>
      <SideNavMenuLabs renderIcon={Fade} title="Sub-menu level 1">
        <SideNavMenuItemLabs href="#">Link</SideNavMenuItemLabs>
        <SideNavMenuItemLabs href="#">Link</SideNavMenuItemLabs>
        <SideNavMenuItemLabs href="#">Link</SideNavMenuItemLabs>
      </SideNavMenuLabs>
    </SideNavItemsLabs>
  </SideNavLabs>
);

Default.parameters = treeviewA11y;

/**
 * Story for SideNavDoublewide
 * @returns {React.ReactElement} The JSX for the story
 */
export const SideNavDoubleWideStory: StoryFn<typeof SideNavLabs> = () => (
  <SideNavLabs
    isTreeview
    isFixedNav
    expanded
    isChildOfHeader={false}
    aria-label="Side navigation">
    <SideNavItemsLabs>
      <SideNavMenuLabs
        renderIcon={Fade}
        title="Sub-menu level 1"
        primary
        defaultExpanded>
        <SideNavSlot>
          <Dropdown
            aria-label="Choose an option"
            id="default"
            size="sm"
            itemToString={(item: DropdownItem | null) =>
              item ? item.text : ''
            }
            items={[
              { text: 'Option 1' },
              { text: 'Option 2' },
              { text: 'Option 3' },
            ]}
            label="Choose an option"
            titleText="Choose an option"
            hideLabel
          />
        </SideNavSlot>
        <SideNavMenuLabs renderIcon={Fade} title="Sub-menu level 2">
          <SideNavMenuItemLabs href="#">Item level 3</SideNavMenuItemLabs>
        </SideNavMenuLabs>
        <SideNavMenuItemLabs renderIcon={Fade} href="#">
          Item level 2
        </SideNavMenuItemLabs>
        <SideNavMenuItemLabs renderIcon={Fade} href="#">
          Item level 2
        </SideNavMenuItemLabs>
        <SideNavMenuItemLabs renderIcon={Fade} href="#">
          Item level 2
        </SideNavMenuItemLabs>
      </SideNavMenuLabs>
      <SideNavMenuLabs renderIcon={Fade} title="Sub-menu level 1" primary>
        <SideNavMenuItemLabs renderIcon={Fade} href="#">
          Item level 2
        </SideNavMenuItemLabs>
      </SideNavMenuLabs>
      <SideNavDivider />
      <SideNavLinkLabs renderIcon={Fade} href="#">
        Link level 1
      </SideNavLinkLabs>
      <SideNavLinkLabs renderIcon={Fade} href="#">
        Link level 1
      </SideNavLinkLabs>
    </SideNavItemsLabs>
  </SideNavLabs>
);
SideNavDoubleWideStory.storyName = 'Double Wide';
SideNavDoubleWideStory.parameters = treeviewA11y;

/**
 * Story for SideNav w/TreeView
 * @returns {React.ReactElement} The JSX for the story
 */
export const SideNavWithFifthLevel: StoryFn<typeof SideNavLabs> = () => (
  <SideNavLabs
    isFixedNav
    expanded={true}
    isChildOfHeader={false}
    aria-label="Side navigation">
    <SideNavItemsLabs>
      <SideNavLinkLabs renderIcon={Add} href="#">
        Link level 1
      </SideNavLinkLabs>
      <SideNavMenuLabs
        defaultExpanded={true}
        renderIcon={Fade}
        title="Sub-menu level 1">
        <SideNavMenuItemLabs href="#">Item level 2</SideNavMenuItemLabs>
        <SideNavMenuItemLabs href="#">Item level 2</SideNavMenuItemLabs>
        <SideNavMenuLabs title="Sub-menu level 2" defaultExpanded={true}>
          <SideNavMenuItemLabs href="#">Item level 3</SideNavMenuItemLabs>
          <SideNavMenuItemLabs href="#">Item level 3</SideNavMenuItemLabs>
          <SideNavMenuLabs title="Sub-menu level 3" defaultExpanded={true}>
            <SideNavMenuItemLabs href="#">Item level 4</SideNavMenuItemLabs>
            <SideNavMenuItemLabs href="#">Item level 4</SideNavMenuItemLabs>
            <SideNavMenuLabs title="Sub-menu level 4" defaultExpanded={true}>
              <SideNavMenuItemLabs isActive href="#">
                Item level 5
              </SideNavMenuItemLabs>
              <SideNavMenuItemLabs href="#">Item level 5</SideNavMenuItemLabs>
            </SideNavMenuLabs>
          </SideNavMenuLabs>
        </SideNavMenuLabs>
      </SideNavMenuLabs>
    </SideNavItemsLabs>
  </SideNavLabs>
);
SideNavWithFifthLevel.storyName = 'With Fifth Level';
SideNavWithFifthLevel.parameters = treeviewA11y;

/**
 * Story for SideNav w/TreeView icons
 * @returns {React.ReactElement} The JSX for the story
 */
export const SideNavWithFifthLevelIcons: StoryFn<typeof SideNavLabs> = () => (
  <SideNavLabs
    isFixedNav
    expanded={true}
    isChildOfHeader={false}
    aria-label="Side navigation">
    <SideNavItemsLabs>
      <SideNavLinkLabs renderIcon={Fade} href="#">
        Link level 1
      </SideNavLinkLabs>
      <SideNavMenuLabs
        defaultExpanded={true}
        renderIcon={Fade}
        title="Sub-menu level 1">
        <SideNavMenuItemLabs renderIcon={Fade} href="#">
          Item level 2
        </SideNavMenuItemLabs>
        <SideNavMenuItemLabs renderIcon={Fade} href="#">
          Item level 2
        </SideNavMenuItemLabs>
        <SideNavMenuLabs
          renderIcon={Fade}
          title="Sub-menu level 2"
          defaultExpanded={true}>
          <SideNavMenuItemLabs href="#">Item level 3</SideNavMenuItemLabs>
          <SideNavMenuItemLabs href="#">Item level 3</SideNavMenuItemLabs>
          <SideNavMenuLabs title="Sub-menu level 3" defaultExpanded={true}>
            <SideNavMenuItemLabs href="#">Item level 4</SideNavMenuItemLabs>
            <SideNavMenuItemLabs href="#">Item level 4</SideNavMenuItemLabs>
            <SideNavMenuLabs title="Sub-menu level 4" defaultExpanded={true}>
              <SideNavMenuItemLabs isActive href="#">
                Item level 5
              </SideNavMenuItemLabs>
              <SideNavMenuItemLabs href="#">Item level 5</SideNavMenuItemLabs>
            </SideNavMenuLabs>
          </SideNavMenuLabs>
        </SideNavMenuLabs>
      </SideNavMenuLabs>
    </SideNavItemsLabs>
  </SideNavLabs>
);
SideNavWithFifthLevelIcons.storyName = 'With Fifth Level Icons';
SideNavWithFifthLevelIcons.parameters = treeviewA11y;

/**
 * Story for SideNav rail
 * @returns {React.ReactElement} The JSX for the story
 */
export const Rail: StoryFn<typeof SideNavLabs> = () => (
  <SideNavLabs
    isRail
    hideOverlay
    isChildOfHeader={false}
    aria-label="Product navigation">
    <SideNavItemsLabs>
      <SideNavSlot renderIcon={VirtualColumnKey}>
        <Dropdown
          aria-label="Choose an option"
          id="default"
          size="sm"
          itemToString={(item: DropdownItem | null) => (item ? item.text : '')}
          items={[
            { text: 'Option 1' },
            { text: 'Option 2' },
            { text: 'Option 3' },
          ]}
          label="Choose an option"
          titleText="Choose an option"
          hideLabel
        />
      </SideNavSlot>
      <SideNavMenuLabs renderIcon={Fade} title="Sub-menu level 1">
        <SideNavMenuItemLabs href="#">Item level 2</SideNavMenuItemLabs>
        <SideNavMenuItemLabs href="#">Item level 2</SideNavMenuItemLabs>
        <SideNavMenuItemLabs href="#">Item level 2</SideNavMenuItemLabs>
      </SideNavMenuLabs>
      <SideNavMenuLabs renderIcon={Fade} title="Sub-menu level 1">
        <SideNavMenuItemLabs href="#">Item level 2</SideNavMenuItemLabs>
        <SideNavMenuItemLabs href="#">Item level 2</SideNavMenuItemLabs>
        <SideNavMenuItemLabs href="#">Item level 2</SideNavMenuItemLabs>
      </SideNavMenuLabs>
      <SideNavMenuLabs renderIcon={Fade} title="Sub-menu level 1">
        <SideNavMenuItemLabs href="#">Item level 2</SideNavMenuItemLabs>
        <SideNavMenuItemLabs href="#">Item level 2</SideNavMenuItemLabs>
        <SideNavMenuItemLabs href="#">Item level 2</SideNavMenuItemLabs>
      </SideNavMenuLabs>
      <SideNavMenuLabs renderIcon={Fade} title="Sub-menu level 1">
        <SideNavMenuItemLabs href="#">Item level 2</SideNavMenuItemLabs>
        <SideNavMenuItemLabs href="#">Item level 2</SideNavMenuItemLabs>
        <SideNavMenuItemLabs href="#">Item level 2</SideNavMenuItemLabs>
      </SideNavMenuLabs>
      <SideNavDivider />
      <SideNavLinkLabs renderIcon={Fade} href="#">
        Link
      </SideNavLinkLabs>
      <SideNavLinkLabs renderIcon={Fade} href="#">
        Link
      </SideNavLinkLabs>
      <SideNavLinkLabs renderIcon={Fade} href="#">
        Link
      </SideNavLinkLabs>
      <SideNavLinkLabs renderIcon={Fade} href="#">
        Link
      </SideNavLinkLabs>
      <SideNavDivider />
      <SideNavLinkLabs renderIcon={Fade} href="#">
        Link
      </SideNavLinkLabs>
      <SideNavLinkLabs renderIcon={Fade} href="#">
        Link
      </SideNavLinkLabs>
    </SideNavItemsLabs>
  </SideNavLabs>
);

/**
 * Story for SideNav panel with flyouts
 * @returns {React.ReactElement} The JSX for the story
 */
export const RailPanel: StoryFn<typeof SideNavLabs> = () => (
  <SideNavLabs
    navType={SIDE_NAV_TYPE.RAIL_PANEL}
    hideOverlay
    isChildOfHeader={false}
    aria-label="Product navigation">
    <SideNavItemsLabs>
      <SideNavSlot renderIcon={VirtualColumnKey}>
        <Dropdown
          aria-label="Choose an option"
          id="default"
          size="sm"
          itemToString={(item: DropdownItem | null) => (item ? item.text : '')}
          items={[
            { text: 'Option 1' },
            { text: 'Option 2' },
            { text: 'Option 3' },
          ]}
          label="Choose an option"
          titleText="Choose an option"
          hideLabel
        />
      </SideNavSlot>
      <SideNavMenuLabs renderIcon={Fade} title="Sub-menu level 1">
        <SideNavMenuItemLabs href="#">Item level 2</SideNavMenuItemLabs>
        <SideNavMenuItemLabs href="#">Item level 2</SideNavMenuItemLabs>
        <SideNavMenuItemLabs href="#">Item level 2</SideNavMenuItemLabs>
      </SideNavMenuLabs>
      <SideNavMenuLabs renderIcon={Fade} title="Sub-menu level 1">
        <SideNavMenuItemLabs href="#">Item level 2</SideNavMenuItemLabs>
        <SideNavMenuItemLabs href="#">Item level 2</SideNavMenuItemLabs>
        <SideNavMenuItemLabs href="#">Item level 2</SideNavMenuItemLabs>
      </SideNavMenuLabs>
      <SideNavMenuLabs renderIcon={Fade} title="Sub-menu level 1">
        <SideNavMenuItemLabs href="#">Item level 2</SideNavMenuItemLabs>
        <SideNavMenuItemLabs href="#">Item level 2</SideNavMenuItemLabs>
        <SideNavMenuItemLabs href="#">Item level 2</SideNavMenuItemLabs>
      </SideNavMenuLabs>
      <SideNavMenuLabs renderIcon={Fade} title="Sub-menu level 1">
        <SideNavMenuItemLabs href="#">Item level 2</SideNavMenuItemLabs>
        <SideNavMenuItemLabs href="#">Item level 2</SideNavMenuItemLabs>
        <SideNavMenuItemLabs href="#">Item level 2</SideNavMenuItemLabs>
      </SideNavMenuLabs>
      <SideNavDivider />
      <SideNavLinkLabs renderIcon={Fade} href="#">
        Link
      </SideNavLinkLabs>
      <SideNavLinkLabs renderIcon={Fade} href="#">
        Link
      </SideNavLinkLabs>
      <SideNavLinkLabs renderIcon={Fade} href="#">
        Link
      </SideNavLinkLabs>
      <SideNavLinkLabs renderIcon={Fade} href="#">
        Link
      </SideNavLinkLabs>
      <SideNavDivider />
      <SideNavLinkLabs renderIcon={Fade} href="#">
        Link
      </SideNavLinkLabs>
      <SideNavLinkLabs renderIcon={Fade} href="#">
        Link
      </SideNavLinkLabs>
    </SideNavItemsLabs>
  </SideNavLabs>
);

// The rail panel's collapsed menu list renders <li> elements outside a list
// and its toggle list holds a <span> (upstream markup).
RailPanel.parameters = {
  a11y: {
    config: {
      rules: [
        { id: 'listitem', enabled: false },
        { id: 'list', enabled: false },
      ],
    },
  },
};
