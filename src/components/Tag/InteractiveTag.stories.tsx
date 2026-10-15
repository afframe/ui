/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and icons from @afframe/ui, source tag, styles from the shared story.css, selected passed as a boolean, control: false instead of the string 'false', inline spacing as Carbon spacing tokens, Default story added, story names unified, example data from the story glossary. Apache-2.0 text: LICENSES/Apache-2.0.txt.
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
import {
  customers,
  longTagLabel,
  overdueInvoices,
  tagLabels,
} from './exampleTags.js';
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

export const Default: StoryFn<ComponentProps<typeof Tag>> = (args) => (
  <Tag {...args} />
);

Default.args = {
  children: 'Paid',
  type: 'gray',
  size: 'md',
  disabled: false,
};
// The meta component is SelectableTag; show Tag's own controls here.
Default.parameters = {
  controls: { include: ['children', 'type', 'size', 'disabled'] },
};

Default.argTypes = {
  children: { control: 'text' },
  type: {
    options: [
      'red',
      'magenta',
      'purple',
      'blue',
      'cyan',
      'teal',
      'green',
      'gray',
      'cool-gray',
      'warm-gray',
      'high-contrast',
      'outline',
    ],
    control: { type: 'select' },
  },
  size: { options: ['sm', 'md', 'lg'], control: { type: 'select' } },
};

export const Selectable: StoryFn<InteractiveArgs> = (args) => {
  const tags: TagItem[] = [
    {
      id: 1,
      text: longTagLabel,
    },
    {
      id: 2,
      text: 'Recurring',
    },
    {
      id: 3,
      text: 'Export',
    },
    {
      id: 4,
      text: 'VAT exempt',
    },
  ];

  const [selectedTags, setSelectedTags] = useState<TagItem[]>([
    {
      id: 2,
      text: 'Recurring',
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
          text={longTagLabel}
          {...args}
        />
        <OperationalTag
          type="magenta"
          className="some-class"
          renderIcon={Asleep}
          text={tagLabels[0]}
          {...args}
        />
        <OperationalTag
          type="purple"
          className="some-class"
          renderIcon={Asleep}
          text={tagLabels[1]}
          {...args}
        />
        <OperationalTag
          type="blue"
          className="some-class"
          renderIcon={Asleep}
          text={tagLabels[2]}
          {...args}
        />
        <OperationalTag
          type="cyan"
          className="some-class"
          renderIcon={Asleep}
          text={tagLabels[3]}
          {...args}
        />
        <OperationalTag
          type="teal"
          className="some-class"
          renderIcon={Asleep}
          text={tagLabels[4]}
          {...args}
        />
        <OperationalTag
          type="green"
          className="some-class"
          renderIcon={Asleep}
          text={tagLabels[5]}
          {...args}
        />
        <OperationalTag
          type="gray"
          className="some-class"
          renderIcon={Asleep}
          text={tagLabels[6]}
          {...args}
        />
        <OperationalTag
          type="cool-gray"
          className="some-class"
          renderIcon={Asleep}
          text={tagLabels[7]}
          {...args}
        />
        <OperationalTag
          type="warm-gray"
          className="some-class"
          renderIcon={Asleep}
          text={tagLabels[8]}
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
            text="Overdue"
            className="some-class"
            {...args}
          />
          <PopoverContent className="popover-content">
            {overdueInvoices.map((invoice) => (
              <p key={invoice}>{invoice}</p>
            ))}
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
            text="Key customer"
            className="some-class"
            {...args}
          />
          <PopoverContent>
            <div className="tag-group tag-group--column">
              {customers.map((customer) => (
                <Tag
                  key={customer}
                  type="blue"
                  className="some-class"
                  {...args}>
                  {customer}
                </Tag>
              ))}
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
      text: longTagLabel,
      tagTitle: 'Provide a custom title to the tag',
    },
    {
      type: 'magenta',
      text: tagLabels[0],
    },
    {
      type: 'purple',
      text: tagLabels[1],
    },
    {
      type: 'blue',
      text: tagLabels[2],
    },
    {
      type: 'cyan',
      text: tagLabels[3],
    },
    {
      type: 'teal',
      text: tagLabels[4],
    },
    {
      type: 'green',
      text: tagLabels[5],
    },
    {
      type: 'gray',
      text: tagLabels[6],
    },
    {
      type: 'cool-gray',
      text: tagLabels[7],
    },
    {
      type: 'warm-gray',
      text: tagLabels[8],
    },
    {
      type: 'high-contrast',
      text: tagLabels[9],
    },
    {
      type: 'outline',
      text: tagLabels[10],
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
