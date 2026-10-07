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
import { ComboButton, MenuItem } from '../../index.js';
import type { ComboButtonProps } from '../../index.js';

export default {
  title: 'Components/ComboButton/Feature Flag',
  component: ComboButton,
  tags: ['carbon', '!autodocs'],
} satisfies Meta<typeof ComboButton>;

export const FloatingStyles: StoryFn<Partial<ComboButtonProps>> = (args) => {
  return (
    <ComboButton
      menuAlignment={args.menuAlignment ?? 'bottom'}
      label="Primary action">
      <MenuItem label="Second action with a long label description" />
      <MenuItem label="Third action" />
      <MenuItem label="Fourth action" disabled />
    </ComboButton>
  );
};

FloatingStyles.args = {
  menuAlignment: 'bottom',
};

FloatingStyles.argTypes = {
  menuAlignment: {
    options: ['top', 'bottom'],
    control: {
      type: 'radio',
    },
  },
};
