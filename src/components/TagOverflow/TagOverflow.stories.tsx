/**
 * Copyright IBM Corp. 2024, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2024
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, title Components/TagOverflow, pkg.prefix as the 'c4p' literal, DisplayBox replaced by a div, story styles converted from SCSS to plain CSS, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useState, useRef, type ComponentType } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import {
  TagOverflow,
  Theme,
  UserAvatar,
  type TagOverflowProps,
} from '../../index.js';
import mdx from './TagOverflow.mdx';
import './tag-overflow-story.css';
import {
  IconComponent,
  IconComponentArr,
  ManyUserAvatarArr,
  UserAvatarArr,
  fiveTags,
  longTags,
  overflowAndModalStrings,
  tags,
} from './utils.js';

const blockClass = `c4p--tag-set`;
const blockClassModal = `${blockClass}-modal`;

// IBM types items as TagOverflowItem (onClose required) and tagComponent as a
// string; the stories pass plain items and components, as upstream does.
type StoryArgs = Omit<TagOverflowProps, 'items' | 'tagComponent'> & {
  containerWidth?: number;
  items: object[];
  tagComponent?: ComponentType<never>;
  allTagsModalTargetCustomDomNode?: boolean;
};

export default {
  title: 'Components/TagOverflow',
  component: TagOverflow as unknown as ComponentType<StoryArgs>,
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
  },
  decorators: [
    (story) => (
      <>
        <style>
          {`.${blockClassModal} { opacity: 0; visibility: hidden; /* prevents glitch storybook modal css load */ }`}
          ;
        </style>
        <Theme theme="g10">
          <div>{story()}</div>
        </Theme>
      </>
    ),
  ],
} satisfies Meta<StoryArgs>;

const Template: StoryFn<StoryArgs> = (argsIn) => {
  const { containerWidth, ...args } = {
    ...argsIn,
  };
  return (
    <div style={{ width: containerWidth }}>
      <TagOverflow {...(args as unknown as TagOverflowProps)} />
    </div>
  );
};

// Declaration of stories
export const TagsWithOverflowCount = Template.bind({});
TagsWithOverflowCount.args = {
  containerWidth: 250,
  items: fiveTags,
  onOverflowTagChange: (items) => console.log(items),
};
TagsWithOverflowCount.parameters = {
  chromatic: { disableSnapshot: true },
};

export const TagsWithTruncation = Template.bind({});
TagsWithTruncation.args = {
  containerWidth: 300,
  items: longTags,
};

export const TagsWithOverflowModal = Template.bind({});
TagsWithOverflowModal.args = {
  containerWidth: 500,
  items: tags,
  ...overflowAndModalStrings,
};

export const MultilineTags = Template.bind({});
MultilineTags.args = {
  containerWidth: 500,
  items: tags,
  multiline: true,
  ...overflowAndModalStrings,
};

export const UserAvatarsWithOverflowCount = Template.bind({});
UserAvatarsWithOverflowCount.args = {
  containerWidth: 250,
  items: UserAvatarArr,
  tagComponent: UserAvatar,
};
UserAvatarsWithOverflowCount.parameters = {
  chromatic: { disableSnapshot: true },
};

export const UserAvatarsWithOverflowModal = Template.bind({});
UserAvatarsWithOverflowModal.args = {
  containerWidth: 300,
  items: ManyUserAvatarArr,
  tagComponent: UserAvatar,
  ...overflowAndModalStrings,
};
UserAvatarsWithOverflowModal.parameters = {
  chromatic: { disableSnapshot: true },
};

export const CustomComponentsWithOverflowModal = Template.bind({});
CustomComponentsWithOverflowModal.args = {
  containerWidth: 200,
  items: IconComponentArr,
  tagComponent: IconComponent,
  ...overflowAndModalStrings,
};

const TemplateWithClose: StoryFn<StoryArgs> = (argsIn) => {
  const { containerWidth, allTagsModalTargetCustomDomNode, items, ...args } = {
    ...argsIn,
  };
  const [liveTags, setLiveTags] = useState(
    (items as { label: string }[]).map((item) => ({
      ...item,
      filter: true,
      onClose: () => handleTagClose(item.label),
    }))
  );

  const handleTagClose = (key: string) => {
    setLiveTags((prev) => prev.filter((item) => item.label !== key));
  };

  const ref = useRef<HTMLDivElement>(null);
  return (
    <div style={{ width: containerWidth }} ref={ref}>
      <TagOverflow
        {...(args as unknown as TagOverflowProps)}
        items={liveTags as TagOverflowProps['items']}
        {...(allTagsModalTargetCustomDomNode && ref.current
          ? { allTagsModalTarget: ref.current }
          : {})}
      />
    </div>
  );
};

export const InteractiveTags = TemplateWithClose.bind({});
InteractiveTags.args = {
  items: tags,
  containerWidth: 500,
  ...overflowAndModalStrings,
};
