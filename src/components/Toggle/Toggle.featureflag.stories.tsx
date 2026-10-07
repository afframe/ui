/**
 * Copyright IBM Corp. 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2025
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, Toggle from @afframe/ui, the WithFeatureFlags decorator removed, toggle-story.scss and its v12-toggle wrapper class dropped (enable-v12-release turns enable-v12-toggle-reduced-label-spacing on in styles.css), source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { Toggle } from '../../index.js';
import type { ToggleProps } from '../../index.js';

export default {
  title: 'Components/Toggle/Feature Flag',
  component: Toggle,
  tags: ['carbon', '!autodocs'],
} satisfies Meta<typeof Toggle>;

export const _Toggle: StoryFn<Partial<ToggleProps>> = (args) => {
  return (
    <div>
      <Toggle
        labelText="Label"
        labelA="Off"
        labelB="On"
        defaultToggled
        id="toggle-3"
        {...args}
      />
    </div>
  );
};

_Toggle.args = {
  disabled: false,
};

_Toggle.argTypes = {
  disabled: {
    control: {
      type: 'boolean',
    },
  },
};
