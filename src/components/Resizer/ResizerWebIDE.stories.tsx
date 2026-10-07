/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, Resizer from @afframe/ui (styles ship in the package CSS, so the resizer.scss import is dropped), story styles converted from SCSS to plain CSS, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

// cspell:ignore resizer
import type { Meta, StoryFn } from '@storybook/react-vite';
import { Resizer } from '../../index.js';
import { WebIDEStory } from './WebIDEStory.js';
import './resizer-web-ide-story.css';

export default {
  title: 'Components/Resizer/Examples',
  component: Resizer,
  tags: ['labs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    orientation: {
      control: false,
    },
    children: {
      control: false,
    },
  },
} satisfies Meta<typeof Resizer>;

/**
 * WebIDE example - A complete Web IDE-like interface with resizable panels
 */
export const WebIDE: StoryFn<typeof Resizer> = (args) => {
  return <WebIDEStory {...args} />;
};

// The labs Resizer separators have no aria-valuenow until the story measures
// them, and Carbon's dismissable contained TabList renders an aria-hidden
// button inside the tablist.
WebIDE.parameters = {
  a11y: {
    config: {
      rules: [
        { id: 'aria-required-attr', enabled: false },
        { id: 'aria-required-children', enabled: false },
      ],
    },
  },
};
