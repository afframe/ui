/**
 * Copyright IBM Corp. 2020, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2020, 2024
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, TagSet from @afframe/ui, tag types and the c4p prefix as literals, DisplayBox replaced by a div with tag-set-story.css, docs page is an MDX file, source tag, the invalid function control on onOverflowClick disabled. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ComponentProps, ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { TagSet } from '../../index.js';
import type { TagSetProps } from '../../index.js';
import mdx from './TagSet.mdx';
import './tag-set-story.css';

type TagSetStoryProps = ComponentProps<typeof TagSet> & {
  containerWidth?: number;
  allTagsModalTargetCustomDomNode?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

const tagTypes = {
  red: 'Red',
  magenta: 'Magenta',
  purple: 'Purple',
  blue: 'Blue',
  cyan: 'Cyan',
  teal: 'Teal',
  green: 'Green',
  gray: 'Gray',
  'cool-gray': 'Cool-Gray',
  'warm-gray': 'Warm-Gray',
  'high-contrast': 'High-Contrast',
  outline: 'Outline',
};

const blockClass = 'c4p--tag-set';
const blockClassModal = `${blockClass}-modal`;

const tags = [
  { type: 'blue', label: 'Tag 1' },
  { type: 'high-contrast', label: 'Tag 123' },
  { type: 'cyan', label: 'Tag 1234' },
  { type: 'red', label: 'Tag 12345' },
];

const manyTags = [
  {
    label: 'One',
    type: 'blue',
    ['data-search']: 'single',
  },
  {
    label: 'Two',
    type: 'red',
  },
  {
    label: 'Three',
    type: 'cyan',
  },
  {
    label: 'Four',
    type: 'high-contrast',
  },
  {
    label: 'Five',
    type: 'blue',
  },
  {
    label: 'Six',
    type: 'red',
  },
  {
    label: 'Seven',
    type: 'cyan',
  },
  {
    label: 'Eight',
    type: 'high-contrast',
  },
  {
    label: 'Nine',
    type: 'red',
  },
  {
    label: 'Ten',
    type: 'blue',
  },
  {
    label: 'Eleven',
    type: 'cyan',
  },
  {
    label: 'Twelve',
    type: 'high-contrast',
    ['data-search']: 'dozen',
  },
  {
    label: 'Thirteen',
    type: 'red',
  },
  {
    label: 'Fourteen',
    type: 'cyan',
  },
  {
    label: 'Fifteen',
    type: 'blue',
  },
  {
    label: 'Sixteen',
    type: 'high-contrast',
  },
  {
    label: 'Seventeen',
    type: 'red',
  },
  {
    label: 'Eighteen',
    type: 'cyan',
  },
  {
    label: 'Nineteen',
    type: 'red',
  },
  {
    label: 'Twenty',
    type: 'high-contrast',
  },
].map((item, index) => ({
  ...item,
  ['data-search']: '' + (index + 1) + ' ' + item?.['data-search'],
}));

const hundredsOfTags: TagSetProps['tags'] = [];
for (let i = 0; i < 200; i++) {
  const label = `Label_${i + 1}`;
  const values = Object.keys(tagTypes);
  const typeValue = values[Math.floor(Math.random() * values.length)];

  hundredsOfTags.push({ type: typeValue, label });
}

const overflowAndModalStrings = {
  allTagsModalTitle: 'All tags',
  allTagsModalSearchLabel: 'Search all tags',
  allTagsModalSearchPlaceholderText: 'Search all tags',
  showAllTagsLabel: 'View all tags',
};

export default {
  title: 'Components/TagSet',
  component: TagSet,
  tags: ['ibm-products'],
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    containerWidth: {
      control: { type: 'range', min: 20, max: 800, step: 10 },
    },
    size: {
      control: {
        type: 'select',
      },
      options: ['sm', 'md', 'lg'],
      type: 'string',
      description:
        'This prop is only for storybook representation, and does not belong to `tagset` component, the size can be passed to each tag{} in tags[], the overflow tag takes the size of last tag{} in tags[]',
    },
    onOverflowClick: {
      control: { disable: true },
      description:
        'An optional click handler that overrides the default functionality of displaying all tags in a modal',
    },
    allTagsModalTargetCustomDomNode: {
      control: { type: 'boolean' },
      description: 'Optional DOM node: Modal target defaults to document.body',
    },
  },
  decorators: [
    (story: () => ReactNode) => (
      <>
        <style>
          {`.${blockClassModal} { opacity: 0; visibility: hidden; /* prevents glitch storybook modal css load */ }`}
          ;
        </style>
        <div className="tag-set-story__display-box">{story()}</div>
      </>
    ),
  ],
} satisfies Meta;

const Template: StoryFn<TagSetStoryProps> = (argsIn) => {
  const { containerWidth, allTagsModalTargetCustomDomNode, size, ...args } = {
    ...argsIn,
  };
  if (args.tags) {
    args.tags = args.tags.map((tag) => ({ ...tag, size }));
  }

  const ref = useRef<HTMLElement>(null);
  return (
    <main style={{ width: containerWidth }} ref={ref}>
      <TagSet
        {...args}
        allTagsModalTarget={
          (allTagsModalTargetCustomDomNode
            ? ref.current
            : undefined) as unknown as ReactNode
        }
      />
    </main>
  );
};

export const FiveTags = Template.bind({});
FiveTags.args = {
  tags: tags,
  containerWidth: 500,
};

export const ManyTags = Template.bind({});
ManyTags.args = {
  tags: manyTags,
  containerWidth: 500,
  ...overflowAndModalStrings,
};

export const MultilineTags = Template.bind({});
MultilineTags.args = {
  tags: manyTags,
  containerWidth: 500,
  multiline: true,
  ...overflowAndModalStrings,
};

export const HundredsOfTags = Template.bind({});
HundredsOfTags.args = {
  tags: hundredsOfTags,
  containerWidth: 500,
  ...overflowAndModalStrings,
};
HundredsOfTags.parameters = {
  chromatic: { disableSnapshot: true },
};

const TemplateWithClose: StoryFn<TagSetStoryProps> = (argsIn) => {
  const {
    containerWidth,
    allTagsModalTargetCustomDomNode,
    size,
    tags = [],
    ...args
  } = {
    ...argsIn,
  };
  const [liveTags, setLiveTags] = useState(
    tags.map((tag) => ({
      ...tag,
      filter: true,
      size: size,
      onClose: () => handleTagClose(tag.label),
    }))
  );

  const handleTagClose = (key: string) => {
    setLiveTags((prev) => prev.filter((tag) => tag.label !== key));
  };

  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    setLiveTags((prevTags) =>
      prevTags.map((tag) => ({
        ...tag,
        size: size,
      }))
    );
  }, [size]);
  return (
    <main style={{ width: containerWidth }} ref={ref}>
      <TagSet
        {...args}
        tags={liveTags}
        allTagsModalTarget={
          (allTagsModalTargetCustomDomNode
            ? ref.current
            : undefined) as unknown as ReactNode
        }
      />
    </main>
  );
};

export const WithClose = TemplateWithClose.bind({});
WithClose.args = {
  tags: manyTags,
  containerWidth: 500,
  ...overflowAndModalStrings,
};

export const WithCloseAndOverflowTags = TemplateWithClose.bind({});
WithCloseAndOverflowTags.args = {
  tags: manyTags,
  containerWidth: 500,
  overflowType: 'tag',
  ...overflowAndModalStrings,
};
