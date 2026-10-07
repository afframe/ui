/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2023
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, plain CSS with Carbon type tokens instead of Sass font mixins, docs page, source tag, stories for the Arabic, Devanagari, Hebrew and Thai families removed (not shipped; Arabic and Hebrew are right-to-left, which Afframe UI does not support). Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { CSSProperties } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import mdx from './Plex.mdx';
import './Plex.stories.css';

type PlexArgs = { fontWeight: CSSProperties['fontWeight'] };

export default {
  title: 'Elements/IBM Plex',
  tags: ['carbon'],
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    fontWeight: {
      control: {
        type: 'radio',
      },
      mapping: {
        Light: 300,
        Regular: 400,
        SemiBold: 600,
      },
      options: ['Light', 'Regular', 'SemiBold'],
    },
  },
  args: {
    fontWeight: 'Regular',
  },
} satisfies Meta<PlexArgs>;

export const IBMPlexMono: StoryFn<PlexArgs> = (args) => {
  return (
    <code dir="auto" style={args} className="text-mono">
      This paragraph is in English and goes left to right.
    </code>
  );
};

export const IBMPlexSans: StoryFn<PlexArgs> = (args) => {
  return (
    <p dir="auto" style={args} className="text-sans">
      This paragraph is in English and goes left to right.
    </p>
  );
};

export const IBMPlexSerif: StoryFn<PlexArgs> = (args) => {
  return (
    <p dir="auto" style={args} className="text-serif">
      This paragraph is in English and goes left to right.
    </p>
  );
};
