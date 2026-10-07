/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, TagInput and Carbon components from @afframe/ui (styles ship in the package CSS, so the tag-input.scss import is dropped), story styles converted to plain CSS, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Button,
  DismissibleTag,
  type DismissibleTagProps,
  Layer,
  Stack,
  TagInput,
} from '../../index.js';
import mdx from './TagInput.mdx';
import './tag-input-story.css';

export default {
  title: 'Components/TagInput',
  component: TagInput,
  tags: ['labs'],
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof TagInput>;

type TagInputProps = ComponentProps<typeof TagInput>;
type TagType = NonNullable<DismissibleTagProps<'div'>['type']>;
type Story = StoryObj<typeof TagInput>;

// Controlled component wrapper for Storybook
/**
 * Controlled TagInput wrapper component for Storybook stories
 * @param {object} args - Component props
 * @returns {React.ReactElement} Rendered component
 */
const ControlledTagInput = (args: TagInputProps) => {
  const [tags, setTags] = useState(args.value || []);

  return (
    <TagInput
      {...args}
      value={tags}
      onTagsChange={(newTags: string[]) => {
        setTags(newTags);
        args.onTagsChange?.(newTags);
      }}
    />
  );
};

/**
 * Default story for TagInput
 */
export const Default: Story = {
  parameters: {
    // Labs hides the TagInput label wrapper with display: none, so the field is named only by its title.
    a11y: { config: { rules: [{ id: 'label-title-only', enabled: false }] } },
  },
  render: ControlledTagInput,
  args: {
    id: 'tag-input-default',
    placeholder: 'Type values and press enter key',
    value: [],
    /**
     * Callback when tags change
     * @param {string[]} tags - Updated tags array
     */
    onTagsChange: (tags: string[]) => console.log('Tags updated:', tags),
  },
};

export const WithInitialTags: Story = {
  parameters: {
    // Labs hides the TagInput label wrapper with display: none, so the field is named only by its title.
    a11y: { config: { rules: [{ id: 'label-title-only', enabled: false }] } },
  },
  render: ControlledTagInput,
  args: {
    id: 'tag-input-initial',
    placeholder: 'Add more tags',
    value: ['React', 'TypeScript', 'Carbon'],
    /**
     * Callback when tags change
     * @param {string[]} tags - Updated tags array
     */
    onTagsChange: (tags: string[]) => console.log('Tags updated:', tags),
  },
};

export const CustomPlaceholder: Story = {
  parameters: {
    // Labs hides the TagInput label wrapper with display: none, so the field is named only by its title.
    a11y: { config: { rules: [{ id: 'label-title-only', enabled: false }] } },
  },
  render: ControlledTagInput,
  args: {
    id: 'tag-input-custom',
    placeholder: 'Enter skills (press Enter to add)',
    value: ['JavaScript', 'CSS'],
    /**
     * Callback when tags change
     * @param {string[]} tags - Updated tags array
     */
    onTagsChange: (tags: string[]) => console.log('Tags updated:', tags),
  },
};

// Example showing full control from parent
export const FullyControlled: Story = {
  parameters: {
    // Labs hides the TagInput label wrapper with display: none, so the field is named only by its title.
    a11y: { config: { rules: [{ id: 'label-title-only', enabled: false }] } },
  },
  /**
   * Render function for fully controlled example
   * @param {object} args - Component props
   * @returns {React.ReactElement} Rendered component
   */
  render: function RenderFullyControlled(args) {
    const [tags, setTags] = useState(['Controlled', 'Component']);
    const [log, setLog] = useState<string[]>([]);

    /**
     * Handle tags change
     * @param {string[]} newTags - New tags array
     */
    const handleTagsChange = (newTags: string[]) => {
      setTags(newTags);
      setLog([...log, `Tags changed: ${JSON.stringify(newTags)}`]);
    };

    /**
     *
     */
    const addPredefinedTag = () => {
      setTags([...tags, `Tag ${tags.length + 1}`]);
    };

    /**
     *
     */
    const clearAllTags = () => {
      setTags([]);
    };

    return (
      <div>
        <Stack
          orientation="horizontal"
          gap={'8px'}
          className="fully-controlled-buttons">
          <Button onClick={addPredefinedTag}>Add Predefined Tag</Button>

          <Button kind="danger" onClick={clearAllTags}>
            Clear All Tags
          </Button>
        </Stack>

        <Stack gap={'16px'}>
          <TagInput
            {...args}
            id="fully-controlled"
            placeholder="Type and press Enter"
            value={tags}
            onTagsChange={handleTagsChange}
          />

          <Layer withBackground className="story-info">
            <strong>Current Tags:</strong>
            <pre>{JSON.stringify(tags)}</pre>
            <div>
              <strong>Change Log:</strong>
              {log.map((entry, i) => (
                <div key={i}>{entry}</div>
              ))}
            </div>
          </Layer>
        </Stack>
      </div>
    );
  },
  args: {
    size: 'md',
  },
};

// Example with colored tags using renderTag
export const WithColors: Story = {
  parameters: {
    // Labs hides the TagInput label wrapper with display: none, so the field is named only by its title.
    a11y: { config: { rules: [{ id: 'label-title-only', enabled: false }] } },
  },
  /**
   * Render function for colored tags example
   * @param {object} args - Component props
   * @returns {React.ReactElement} Rendered component
   */
  render: function RenderWithColors(args) {
    const [tags, setTags] = useState(['Error', 'Warning', 'Info', 'Success']);

    return (
      <TagInput
        {...args}
        id="colored-tags"
        placeholder="Add colored tags"
        value={tags}
        onTagsChange={setTags}
        renderTag={(tag, index, onRemove) => {
          let type: TagType = 'gray';
          if (tag === 'Error') {
            type = 'red';
          } else if (tag === 'Warning') {
            type = 'magenta';
          } else if (tag === 'Info') {
            type = 'blue';
          } else if (tag === 'Success') {
            type = 'green';
          }

          return (
            <DismissibleTag
              id={`colored-tags-tag-${index}`}
              text={tag}
              type={type}
              size={args.size}
              onClose={onRemove}
            />
          );
        }}
      />
    );
  },
  args: {
    size: 'md',
  },
};
