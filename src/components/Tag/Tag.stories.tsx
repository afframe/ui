/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and icons from @afframe/ui, source tag, styles from a plain CSS file, Skeleton args typed loosely because upstream passes size md, inline spacing as Carbon spacing tokens, story names unified, example data from the story glossary. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ComponentProps } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { Asleep, Folders, FolderOpen, View } from '../../icons.js';
import {
  AILabel,
  AILabelActions,
  AILabelContent,
  Button,
  DismissibleTag,
  IconButton,
  Tag,
  TagSkeleton,
} from '../../index.js';
import { longTagLabel, tagLabels } from './exampleTags.js';
import mdx from './Tag.mdx';
import './story.css';

type TagStoryArgs = ComponentProps<typeof Tag> & { text?: string };

export default {
  title: 'Components/Tag',
  component: Tag,
  tags: ['carbon'],
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof Tag>;

export const ReadOnly: StoryFn<TagStoryArgs> = (args) => {
  return (
    <div className="tag-group">
      <Tag className="some-class" type="red" {...args}>
        {longTagLabel}
      </Tag>
      <Tag className="some-class" type="magenta" {...args}>
        {tagLabels[0]}
      </Tag>
      <Tag className="some-class" type="purple" {...args}>
        {tagLabels[1]}
      </Tag>
      <Tag className="some-class" type="blue" {...args}>
        {tagLabels[2]}
      </Tag>
      <Tag className="some-class" type="cyan" {...args}>
        {tagLabels[3]}
      </Tag>
      <Tag className="some-class" type="teal" {...args}>
        {tagLabels[4]}
      </Tag>
      <Tag className="some-class" type="green" {...args}>
        {tagLabels[5]}
      </Tag>
      <Tag className="some-class" type="gray" {...args}>
        {tagLabels[6]}
      </Tag>
      <Tag className="some-class" type="cool-gray" {...args}>
        {tagLabels[7]}
      </Tag>
      <Tag className="some-class" type="warm-gray" {...args}>
        {tagLabels[8]}
      </Tag>
      <Tag className="some-class" type="high-contrast" {...args}>
        {tagLabels[9]}
      </Tag>
      <Tag className="some-class" type="outline" {...args}>
        {tagLabels[10]}
      </Tag>
    </div>
  );
};

ReadOnly.args = {
  disabled: false,
  filter: false,
  size: 'md',
  title: 'Clear filter',
};

ReadOnly.argTypes = {
  children: {
    control: false,
  },
  className: {
    control: false,
  },
  disabled: {
    control: {
      type: 'boolean',
    },
  },
  filter: {
    control: {
      type: 'boolean',
    },
  },
  id: {
    control: false,
  },
  renderIcon: {
    control: false,
  },
  size: {
    options: ['sm', 'md', 'lg'],
    control: {
      type: 'select',
    },
  },
  title: {
    control: {
      type: 'text',
    },
  },
  type: {
    options: [
      'red',
      'blue',
      'cyan',
      'teal',
      'green',
      'gray',
      'high-contrast',
      'outline',
    ],
    control: {
      type: 'select',
    },
  },
};

export const Skeleton: StoryFn<{ size: 'sm' | 'md' | 'lg' }> = (args) => (
  <div>
    <TagSkeleton {...(args as ComponentProps<typeof TagSkeleton>)} />
  </div>
);

Skeleton.args = {
  size: 'md',
};

Skeleton.parameters = {
  controls: {
    exclude: ['disabled', 'filter', 'id', 'renderIcon', 'title', 'type'],
  },
};

Skeleton.argTypes = {
  size: {
    options: ['sm', 'md', 'lg'],
    control: {
      type: 'select',
    },
  },
};

export const WithAILabel: StoryFn<TagStoryArgs> = (args) => {
  const aiLabel = (
    <AILabel className="ai-label-container">
      <AILabelContent>
        <div>
          <p className="secondary">AI Explained</p>
          <h2 className="ai-label-heading">84%</h2>
          <p className="secondary bold">Confidence score</p>
          <p className="secondary">
            Amounts suggested from the last 12 months of invoices.
          </p>
          <hr />
          <p className="secondary">Model type</p>
          <p className="bold">Foundation model</p>
        </div>
        <AILabelActions>
          <IconButton kind="ghost" label="View">
            <View />
          </IconButton>
          <IconButton kind="ghost" label="Open Folder">
            <FolderOpen />
          </IconButton>
          <IconButton kind="ghost" label="Folders">
            <Folders />
          </IconButton>
          <Button>View details</Button>
        </AILabelActions>
      </AILabelContent>
    </AILabel>
  );

  return (
    <div
      className="tag-group"
      style={{ marginBottom: 'var(--cds-spacing-10)' }}>
      <Tag
        decorator={aiLabel}
        className="some-class"
        type="red"
        title="Clear Filter"
        {...args}>
        {args.text}
      </Tag>

      <DismissibleTag
        decorator={aiLabel}
        className="some-class"
        type="purple"
        title="Clear Filter"
        {...args}></DismissibleTag>

      <Tag
        renderIcon={Asleep}
        decorator={aiLabel}
        className="some-class"
        type="blue"
        title="Clear Filter"
        {...args}>
        {args.text}
      </Tag>

      <DismissibleTag
        renderIcon={Asleep}
        decorator={aiLabel}
        className="some-class"
        type="green"
        title="Clear Filter"
        {...args}></DismissibleTag>
    </div>
  );
};

WithAILabel.args = {
  disabled: false,
  size: 'md',
  text: 'Recurring',
};

WithAILabel.argTypes = {
  children: {
    control: false,
  },
  className: {
    control: false,
  },
  decorator: {
    control: false,
  },
  disabled: {
    control: {
      type: 'boolean',
    },
  },
  filter: {
    control: false,
  },
  id: {
    control: false,
  },
  renderIcon: {
    control: false,
  },
  size: {
    options: ['sm', 'md', 'lg'],
    control: {
      type: 'select',
    },
  },
  title: {
    control: {
      type: 'text',
    },
  },
  type: {
    options: [
      'red',
      'blue',
      'cyan',
      'teal',
      'green',
      'gray',
      'high-contrast',
      'outline',
    ],
    control: {
      type: 'select',
    },
  },
  text: {
    control: {
      type: 'text',
    },
  },
};

WithAILabel.parameters = {
  controls: {
    exclude: ['filter'],
  },
};
