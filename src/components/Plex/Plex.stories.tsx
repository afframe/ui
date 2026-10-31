/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2023
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, a Default story with every family and weight plus Regular italic, Czech sample text, plain CSS with Carbon type tokens instead of Sass font mixins, docs page, source tag, stories for the Arabic, Devanagari, Hebrew and Thai families removed (not shipped; Arabic and Hebrew are right-to-left, which Afframe UI does not support), page moved under Elements/Typography. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { CSSProperties } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import mdx from './Plex.mdx';
import './Plex.stories.css';

type PlexArgs = { fontWeight: CSSProperties['fontWeight'] };

export default {
  title: 'Elements/Typography/IBM Plex',
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

const czech = 'Příliš žluťoučký kůň úpěl ďábelské ódy. 1 234,50 Kč';

const families = [
  { name: 'IBM Plex Sans', className: 'text-sans' },
  { name: 'IBM Plex Mono', className: 'text-mono' },
  { name: 'IBM Plex Serif', className: 'text-serif' },
] as const;

const weights = [
  { name: 'Light', value: 300, style: 'normal' },
  { name: 'Regular', value: 400, style: 'normal' },
  { name: 'SemiBold', value: 600, style: 'normal' },
  { name: 'Regular italic', value: 400, style: 'italic' },
] as const;

export const Default: StoryFn<PlexArgs> = () => {
  return (
    <div className="plex-specimen">
      {families.map((family) => (
        <section key={family.name}>
          <h3 className="plex-specimen__family">{family.name}</h3>
          {weights.map((weight) => (
            <p
              key={weight.name}
              className={family.className}
              style={{ fontWeight: weight.value, fontStyle: weight.style }}>
              <span className="plex-specimen__weight">
                {weight.name} {weight.value}
              </span>
              {czech}
            </p>
          ))}
        </section>
      ))}
    </div>
  );
};

Default.parameters = { controls: { disable: true } };

export const IBMPlexMono: StoryFn<PlexArgs> = (args) => {
  return (
    <code dir="auto" style={args} className="text-mono">
      {czech}
    </code>
  );
};

export const IBMPlexSans: StoryFn<PlexArgs> = (args) => {
  return (
    <p dir="auto" style={args} className="text-sans">
      {czech}
    </p>
  );
};

export const IBMPlexSerif: StoryFn<PlexArgs> = (args) => {
  return (
    <p dir="auto" style={args} className="text-serif">
      {czech}
    </p>
  );
};
