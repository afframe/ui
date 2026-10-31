/**
 * Copyright IBM Corp. 2016, 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2025
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, icons from @afframe/ui/icons, unused IconButton import removed, plain CSS, source tag, numeric size control, size label beside the icon instead of a heading, searchable Gallery story, the size decorator applied to the size stories only, a Gallery play that checks the grid fills the canvas. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useMemo, useState } from 'react';
import type { ComponentType } from 'react';
import type { Decorator, Meta, StoryFn } from '@storybook/react-vite';
import * as icons from '../../icons.js';
import { Bee, Edit } from '../../icons.js';
import { expect } from 'storybook/test';
import { Search } from '../../index.js';
import mdx from './Icons.mdx';
import './Icons.stories.css';

export default {
  title: 'Elements/Icons',
  tags: ['carbon'],
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof Bee>;

// Only on the size stories: around Gallery its flex row shrinks the grid to
// its text, so the column count changed with the "Copied" message.
const sizeLabel: Decorator = (Story, { args }) => {
  const { size } = args as { size?: number | string };
  return (
    <section className="demo-icon-example">
      <Story />
      <span className="demo-icon-example__label">
        {size} {typeof size === 'number' && 'pixel'}{' '}
        {size === 16 && '(default)'}
        {typeof size === 'string' && size.includes('rem') && '(responsive)'}
      </span>
    </section>
  );
};

export const Default: StoryFn<typeof Bee> = (args) => {
  return <Bee {...args} />;
};

Default.decorators = [sizeLabel];

Default.args = {
  size: 16,
};

Default.argTypes = {
  size: {
    options: [16, 20, 24, 32],
    control: { type: 'select' },
  },
};

export const WithRelativeSize: StoryFn<typeof Edit> = (args) => {
  return <Edit {...args} />;
};

WithRelativeSize.decorators = [sizeLabel];

WithRelativeSize.args = {
  size: '1rem',
};

WithRelativeSize.argTypes = { size: { control: 'text' } };

// Every icon export, A to Z, without the base `Icon`, which draws nothing on
// its own. `_4K` and similar start with an underscore because a name cannot
// start with a digit.
const iconNames = Object.keys(icons)
  .filter((name) => name !== 'Icon' && /^_?[A-Z0-9]/.test(name))
  .sort();
const shown = 120;

export const Gallery: StoryFn = () => {
  const [query, setQuery] = useState('');
  const [copied, setCopied] = useState('');
  const matches = useMemo(() => {
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    return iconNames.filter((name) =>
      words.every((word) => name.toLowerCase().includes(word))
    );
  }, [query]);
  const copy = (name: string) => {
    void navigator.clipboard?.writeText(
      `import { ${name} } from '@afframe/ui/icons';`
    );
    setCopied(name);
  };
  return (
    <div className="demo-icon-gallery">
      <Search
        id="icon-gallery-search"
        labelText="Search icons"
        placeholder="Search icons by name"
        size="lg"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <p className="demo-icon-gallery__count" aria-live="polite">
        {matches.length} of {iconNames.length} icons
        {matches.length > shown && `, first ${shown} shown`}
        {copied && `. Copied the import of ${copied}`}
      </p>
      <ul className="demo-icon-gallery__grid">
        {matches.slice(0, shown).map((name) => {
          const Icon = icons[name as keyof typeof icons] as ComponentType<{
            size?: number;
          }>;
          return (
            <li key={name}>
              <button
                type="button"
                className="demo-icon-gallery__item"
                title={`Copy import { ${name} }`}
                onClick={() => copy(name)}>
                <Icon size={24} />
                <span>{name}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

Gallery.parameters = { controls: { disable: true } };

// A grid narrower than the canvas follows its text and changes columns.
Gallery.play = async ({ canvasElement }) => {
  const grid = canvasElement.querySelector('.demo-icon-gallery__grid');
  await expect(grid?.getBoundingClientRect().width).toBeGreaterThan(
    canvasElement.getBoundingClientRect().width * 0.9
  );
};
