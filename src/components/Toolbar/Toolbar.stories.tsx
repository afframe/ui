/**
 * Copyright IBM Corp. 2021, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2021, 2024
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and icons from @afframe/ui, source tag, stories exported at their declaration. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ComponentProps } from 'react';
import { useState } from 'react';
import type { Meta } from '@storybook/react-vite';
import {
  AlignHorizontalCenter,
  ColorPalette,
  CopyFile,
  Draggable,
  Move,
  Minimize,
  OpenPanelLeft,
  OpenPanelRight,
  Pin,
  Printer,
  Save,
  Share,
  Undo,
  Upload,
  Redo,
  Rotate,
  RulerAlt,
  SettingsAdjust,
  Table,
  TextAlignCenter,
  TextCreation,
  ZoomIn,
  ZoomOut,
} from '../../icons.js';

import {
  Dropdown,
  OverflowMenu,
  OverflowMenuItem,
  previewCandidate__Toolbar as Toolbar,
  previewCandidate__ToolbarButton as ToolbarButton,
  previewCandidate__ToolbarGroup as ToolbarGroup,
} from '../../index.js';
import mdx from './Toolbar.mdx';

type ToolbarStoryProps = ComponentProps<typeof Toolbar>;

export default {
  title: 'Preview Candidate/Toolbar',
  component: Toolbar,
  tags: ['ibm-products'],
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    vertical: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Toolbar>;

export function _Toolbar(args: ToolbarStoryProps) {
  const dropdownItems = ['11', '12', '14', '16', '18'];

  const [selectedDropdownItem, setSelectedDropdownItem] = useState(
    dropdownItems[(dropdownItems.length / 2) | 0] ?? ''
  );

  return (
    <Toolbar {...args}>
      <ToolbarGroup>
        <ToolbarButton
          label="Save"
          renderIcon={(props: object) => <Save size={16} {...props} />}
        />
        <ToolbarButton
          label="Share"
          renderIcon={(props: object) => <Share size={16} {...props} />}
        />
        <ToolbarButton
          label="Upload"
          renderIcon={(props: object) => <Upload size={16} {...props} />}
        />
        <ToolbarButton
          label="Print"
          renderIcon={(props: object) => <Printer size={16} {...props} />}
        />
      </ToolbarGroup>

      <ToolbarGroup>
        <ToolbarButton
          label="Undo"
          renderIcon={(props: object) => <Undo size={16} {...props} />}
        />
        <ToolbarButton
          label="Redo"
          renderIcon={(props: object) => <Redo size={16} {...props} />}
        />
        <ToolbarButton
          label="Zoom in"
          renderIcon={(props: object) => <ZoomIn size={16} {...props} />}
        />
        <ToolbarButton
          label="Zoom out"
          renderIcon={(props: object) => <ZoomOut size={16} {...props} />}
        />
        <ToolbarButton
          label="Minimize"
          renderIcon={(props: object) => <Minimize size={16} {...props} />}
        />

        <ToolbarButton
          label="Align horizontal center"
          renderIcon={(props: object) => (
            <AlignHorizontalCenter size={16} {...props} />
          )}
        />
      </ToolbarGroup>

      <ToolbarGroup>
        <ToolbarButton
          label="Ruler"
          renderIcon={(props: object) => <RulerAlt size={16} {...props} />}
        />
        <ToolbarButton
          label="Pin"
          renderIcon={(props: object) => <Pin size={16} {...props} />}
        />
        <ToolbarButton
          label="Copy file"
          renderIcon={(props: object) => <CopyFile size={16} {...props} />}
        />
      </ToolbarGroup>

      <ToolbarGroup>
        <Dropdown
          id="dropdown"
          hideLabel
          titleText="Font size"
          initialSelectedItem={selectedDropdownItem}
          items={dropdownItems}
          label={selectedDropdownItem}
          onChange={({ selectedItem }) =>
            setSelectedDropdownItem(selectedItem ?? '')
          }
        />
      </ToolbarGroup>

      <ToolbarGroup>
        <ToolbarButton
          label="Text align center"
          renderIcon={(props: object) => (
            <TextAlignCenter size={16} {...props} />
          )}
        />
      </ToolbarGroup>

      <ToolbarGroup>
        <OverflowMenu aria-label="List" flipped>
          <OverflowMenuItem itemText="Color palette" />
          <OverflowMenuItem itemText="Text creation" />
          <OverflowMenuItem itemText="Bulleted list" />
          <OverflowMenuItem itemText="Delete" hasDivider isDelete />
        </OverflowMenu>
      </ToolbarGroup>

      <ToolbarGroup>
        <ToolbarButton
          label="Table"
          renderIcon={(props: object) => <Table size={16} {...props} />}
        />

        <ToolbarButton
          label="Settings adjust"
          renderIcon={(props: object) => (
            <SettingsAdjust size={16} {...props} />
          )}
        />
      </ToolbarGroup>
    </Toolbar>
  );
}

_Toolbar.args = {
  vertical: false,
};

export function vertical(args: ToolbarStoryProps) {
  return (
    <Toolbar {...args}>
      <ToolbarGroup>
        <ToolbarButton
          label="Drag"
          renderIcon={(props: object) => <Draggable size={16} {...props} />}
        />
      </ToolbarGroup>

      <ToolbarGroup>
        <ToolbarButton
          label="Ruler"
          renderIcon={(props: object) => <RulerAlt size={16} {...props} />}
        />
        <ToolbarButton
          label="Pin"
          renderIcon={(props: object) => <Pin size={16} {...props} />}
        />

        <ToolbarButton
          label="Color palette"
          renderIcon={(props: object) => <ColorPalette size={16} {...props} />}
        />

        <ToolbarButton
          label="Text creation"
          renderIcon={(props: object) => <TextCreation size={16} {...props} />}
        />
      </ToolbarGroup>

      <ToolbarGroup>
        <ToolbarButton
          label="Open panel left"
          renderIcon={(props: object) => <OpenPanelLeft size={16} {...props} />}
        />

        <ToolbarButton
          label="Open panel right"
          renderIcon={(props: object) => (
            <OpenPanelRight size={16} {...props} />
          )}
        />
      </ToolbarGroup>

      <ToolbarGroup>
        <ToolbarButton
          label="Move"
          renderIcon={(props: object) => <Move size={16} {...props} />}
        />
        <ToolbarButton
          label="Rotate"
          renderIcon={(props: object) => <Rotate size={16} {...props} />}
        />
      </ToolbarGroup>

      <ToolbarGroup>
        <ToolbarButton
          label="Zoom in"
          renderIcon={(props: object) => <ZoomIn size={16} {...props} />}
        />
        <ToolbarButton
          label="Zoom out"
          renderIcon={(props: object) => <ZoomOut size={16} {...props} />}
        />
      </ToolbarGroup>
    </Toolbar>
  );
}

vertical.args = {
  vertical: true,
};
