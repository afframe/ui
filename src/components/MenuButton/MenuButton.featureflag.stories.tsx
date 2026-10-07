/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2023
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, the WithFeatureFlags decorator removed (enable-v12-release turns enable-v12-dynamic-floating-styles on globally), source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { MenuButton, MenuItem } from '../../index.js';
import type { MenuButtonProps } from '../../index.js';

export default {
  title: 'Components/MenuButton/Feature Flag',
  component: MenuButton,
  tags: ['carbon', '!autodocs'],
  parameters: {
    controls: {
      include: ['label', 'menuAlignment'],
    },
  },
} satisfies Meta<typeof MenuButton>;

export const FloatingStyles: StoryFn<MenuButtonProps> = (args) => (
  <MenuButton {...args}>
    <MenuItem label="First action" />
    <MenuItem label="Second action that is a longer item to test overflow and title." />
    <MenuItem label="Third action" disabled />
  </MenuButton>
);

FloatingStyles.args = {
  label: 'Actions',
  menuAlignment: 'bottom',
};

FloatingStyles.argTypes = {
  label: {
    control: {
      type: 'text',
    },
  },
  menuAlignment: {
    options: ['top', 'bottom'],
    control: {
      type: 'radio',
    },
  },
};
