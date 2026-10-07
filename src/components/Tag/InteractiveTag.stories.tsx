/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and icons from @afframe/ui, source tag, styles from the shared story.css, selected passed as a boolean, control: false instead of the string 'false', inline spacing as Carbon spacing tokens. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useState } from 'react';
import type { ComponentProps, MouseEvent } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { Asleep } from '../../icons.js';
import {
  Button,
  DismissibleTag,
  OperationalTag,
  Popover,
  PopoverContent,
  SelectableTag,
  Tag,
} from '../../index.js';
import mdx from './Tag.mdx';
import './story.css';

type TagItem = { id: number; text: string };

type DismissibleItem = {
  type: ComponentProps<typeof DismissibleTag>['type'];
  text: string;
  tagTitle?: string;
};

type InteractiveArgs = ComponentProps<typeof SelectableTag> &
  ComponentProps<typeof OperationalTag> &
  ComponentProps<typeof DismissibleTag>;

export default {
  title: 'Components/Tag',
  component: SelectableTag,
  tags: ['carbon'],
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof SelectableTag>;

export const Selectable: StoryFn<InteractiveArgs> = (args) => {
  const tags: TagItem[] = [
    {
      id: 1,
      text: 'Tag content with a long text description',
    },
    {
      id: 2,
      text: 'Tag content 1',
    },
    {
      id: 3,
      text: 'Tag content 2',
    },
    {
      id: 4,
      text: 'Tag content 3',
    },
  ];

  const [selectedTags, setSelectedTags] = useState<TagItem[]>([
    {
      id: 2,
      text: 'Tag content 1',
    },
  ]);

  const handleChange = (tag: TagItem, selected: boolean) => {
    const nextSelectedTags = selected
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t.id !== tag.id);

    console.log('Selected tags array: ', nextSelectedTags);
    setSelectedTags(nextSelectedTags);
  };

  return (
    <div className="tag-group" aria-label="Selectable tags" role="group">
      {tags.map((tag, index) => (
        <SelectableTag
          key={index}
          renderIcon={Asleep}
          text={tag.text}
          className="some-class"
          selected={selectedTags.some((t) => t.id === tag.id)}
          onChange={(selected: boolean) => handleChange(tag, selected)}
          {...args}
        />
      ))}
    </div>
  );
};

Selectable.args = {
  disabled: false,
};

Selectable.parameters = {
  controls: {
    exclude: ['type', 'filter', 'title'],
  },
};

Selectable.argTypes = {
  selected: {
    control: false,
    description: 'Specify the state of the selectable tag.',
  },
  size: {
    options: ['sm', 'md', 'lg'],
    control: {
      type: 'select',
    },
  },
  id: {
    control: false,
  },
  renderIcon: {
    control: false,
  },
};

export const Operational: StoryFn<InteractiveArgs> = (args) => {
  const [open, setOpen] = useState(false);
  const [openHighContrast, setOpenHighContrast] = useState(false);

  return (
    <>
      <div
        className="tag-group"
        aria-label="Operational tags"
        role="group"
        style={{ marginBottom: 'var(--cds-spacing-05)' }}>
        <OperationalTag
          type="red"
          className="some-class"
          renderIcon={Asleep}
          text="Tag content with a long text description"
          {...args}
        />
        <OperationalTag
          type="magenta"
          className="some-class"
          renderIcon={Asleep}
          text="Tag content"
          {...args}
        />
        <OperationalTag
          type="purple"
          className="some-class"
          renderIcon={Asleep}
          text="Tag content"
          {...args}
        />
        <OperationalTag
          type="blue"
          className="some-class"
          renderIcon={Asleep}
          text="Tag content"
          {...args}
        />
        <OperationalTag
          type="cyan"
          className="some-class"
          renderIcon={Asleep}
          text="Tag content"
          {...args}
        />
        <OperationalTag
          type="teal"
          className="some-class"
          renderIcon={Asleep}
          text="Tag content"
          {...args}
        />
        <OperationalTag
          type="green"
          className="some-class"
          renderIcon={Asleep}
          text="Tag content"
          {...args}
        />
        <OperationalTag
          type="gray"
          className="some-class"
          renderIcon={Asleep}
          text="Tag content"
          {...args}
        />
        <OperationalTag
          type="cool-gray"
          className="some-class"
          renderIcon={Asleep}
          text="Tag content"
          {...args}
        />
        <OperationalTag
          type="warm-gray"
          className="some-class"
          renderIcon={Asleep}
          text="Tag content"
          {...args}
        />
      </div>

      <h4>Interactive examples</h4>
      <div
        id="operational-tag"
        className="tag-group"
        style={{ marginTop: 'var(--cds-spacing-05)' }}
        aria-label="Operational tags with Popover"
        role="group">
        {/* High contrast example */}
        <Popover
          open={openHighContrast}
          highContrast
          onRequestClose={() => {
            setOpenHighContrast(false);
          }}>
          <OperationalTag
            onClick={() => {
              setOpen(false);
              setOpenHighContrast((prev) => !prev);
            }}
            aria-expanded={openHighContrast}
            renderIcon={Asleep}
            text="Tag content"
            className="some-class"
            {...args}
          />
          <PopoverContent className="popover-content">
            <p>Tag 1 name</p>
            <p>Tag 2 name</p>
            <p>Tag 3 name</p>
            <p>Tag 4 name</p>
            <p>Tag 5 name</p>
          </PopoverContent>
        </Popover>

        <Popover
          open={open}
          onRequestClose={() => {
            setOpen(false);
          }}>
          <OperationalTag
            onClick={() => {
              setOpenHighContrast(false);
              setOpen((prev) => !prev);
            }}
            aria-expanded={open}
            renderIcon={Asleep}
            text="Tag content"
            className="some-class"
            {...args}
          />
          <PopoverContent>
            <div className="tag-group tag-group--column">
              <Tag type="blue" className="some-class" {...args}>
                {'Tag 1 name'}
              </Tag>
              <Tag type="blue" className="some-class" {...args}>
                {'Tag 2 name'}
              </Tag>
              <Tag type="blue" className="some-class" {...args}>
                {'Tag 3 name'}
              </Tag>
              <Tag type="blue" className="some-class" {...args}>
                {'Tag 4 name'}
              </Tag>
              <Tag type="blue" className="some-class" {...args}>
                {'Tag 5 name'}
              </Tag>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};

Operational.args = {
  disabled: false,
  size: 'md',
};

Operational.parameters = {
  controls: {
    exclude: ['filter', 'title', 'selected'],
  },
};

Operational.argTypes = {
  id: {
    control: false,
  },
  children: {
    control: false,
  },
  className: {
    control: false,
  },
  type: {
    control: false,
  },
  size: {
    options: ['sm', 'md', 'lg'],
    control: {
      type: 'select',
    },
  },
  renderIcon: {
    control: false,
  },
};

export const Dismissible: StoryFn<InteractiveArgs> = (args) => {
  const tags: DismissibleItem[] = [
    {
      type: 'red',
      text: 'Tag content with a long text description',
      tagTitle: 'Provide a custom title to the tag',
    },
    {
      type: 'magenta',
      text: 'Tag content 1',
    },
    {
      type: 'purple',
      text: 'Tag content 2',
    },
    {
      type: 'blue',
      text: 'Tag content 3',
    },
    {
      type: 'cyan',
      text: 'Tag content 4',
    },
    {
      type: 'teal',
      text: 'Tag content 5',
    },
    {
      type: 'green',
      text: 'Tag content 6',
    },
    {
      type: 'gray',
      text: 'Tag content 7',
    },
    {
      type: 'cool-gray',
      text: 'Tag content 8',
    },
    {
      type: 'warm-gray',
      text: 'Tag content 9',
    },
    {
      type: 'high-contrast',
      text: 'Tag content 10',
    },
    {
      type: 'outline',
      text: 'Tag content 11',
    },
  ];

  const [renderedTags, setRenderedTags] = useState(tags);

  const handleClose = (removedTag: DismissibleItem) => {
    const newTags = renderedTags.filter((tag) => tag !== removedTag);
    setRenderedTags(newTags);
  };

  const resetTabs = () => {
    setRenderedTags(tags);
  };

  return (
    <>
      <Button
        // aria-label="Re-render all tags in the screen"
        style={{ marginBottom: 'var(--cds-spacing-09)' }}
        onClick={resetTabs}>
        Reset
      </Button>
      <br />
      <div className="tag-group" aria-label="Dismissible tags" role="group">
        {renderedTags.map((tag, index) => (
          <DismissibleTag
            key={index}
            type={tag.type}
            className="some-class"
            renderIcon={Asleep}
            text={tag.text}
            tagTitle={tag.tagTitle}
            title="Dismiss"
            dismissTooltipAlignment={args.dismissTooltipAlignment}
            onClose={(e: MouseEvent) => {
              e.preventDefault();
              handleClose(tag);
            }}
            {...args}
          />
        ))}
      </div>
    </>
  );
};

Dismissible.args = {
  disabled: false,
  size: 'md',
  dismissTooltipAlignment: 'bottom',
};

Dismissible.parameters = {
  controls: {
    exclude: ['filter', 'selected'],
  },
};
Dismissible.argTypes = {
  size: {
    options: ['sm', 'md', 'lg'],
    control: {
      type: 'select',
    },
  },
  dismissTooltipAlignment: {
    options: [
      'top',
      'top-start',
      'top-end',
      'bottom',
      'bottom-start',
      'bottom-end',
      'left',
      'left-start',
      'left-end',
      'right',
      'right-start',
      'right-end',
    ],
    control: { type: 'select' },
    description: 'Specify the tooltip alignment for the dismiss button',
    table: {
      defaultValue: { summary: 'bottom' },
    },
  },
  id: {
    control: false,
  },
  renderIcon: {
    control: false,
  },
};
