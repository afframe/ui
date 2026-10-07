/**
 * Copyright IBM Corp. 2016, 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2025
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, icons from @afframe/ui/icons, story stylesheet rewritten as plain CSS, source tag, inline spacing as Carbon spacing tokens. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { Folders, FolderOpen, View } from '../../icons.js';
import {
  AILabel,
  AILabelActions,
  AILabelContent,
  Button,
  IconButton,
  Link,
} from '../../index.js';
import mdx from './AILabel.mdx';
import './ailabel-story.css';

export default {
  title: 'Components/AILabel',
  component: AILabel,
  parameters: {
    docs: {
      page: mdx,
    },
    controls: {
      exclude: ['AILabelContent', 'aiTextLabel', 'slugLabel'],
    },
  },
  tags: ['carbon'],
} satisfies Meta<typeof AILabel>;
const sharedArgTypes = {
  aiText: {
    control: {
      type: 'text',
    },
  },
  align: {
    options: [
      'top',
      'top-start',
      'top-end',

      'bottom',
      'bottom-start',
      'bottom-end',

      'left',
      'left-end',
      'left-start',

      'right',
      'right-end',
      'right-start',
    ],
    control: { type: 'select' },
    description:
      'Specify how the `AILabelContent` should align with the trigger element.',
  },
  autoAlign: {
    control: {
      type: 'boolean',
    },
    description:
      'Will auto-align the `AILabelContent` on first render if it is not visible. This prop is currently experimental and is subject to future changes. Requires React v17+',
  },
  'aria-label': {
    control: {
      type: 'text',
    },
  },
  kind: {
    options: ['default', 'inline'],
    control: { type: 'select' },
  },
  revertActive: {
    control: {
      type: 'boolean',
    },
  },
  revertLabel: {
    control: {
      type: 'text',
    },
    if: { arg: 'revertActive', eq: true },
  },
  size: {
    options: ['mini', '2xs', 'xs', 'sm', 'md', 'lg', 'xl'],
    control: { type: 'select' },
    if: { arg: 'revertActive', neq: true },
  },
  textLabel: {
    control: {
      type: 'text',
    },
    if: { arg: 'kind', eq: 'inline' },
    table: {
      category: 'Inline variant',
    },
  },
  defaultOpen: {
    control: {
      type: 'boolean',
    },
    description:
      'Specify if the toggletip should be open by default.\n\n(For the change to this control to be visible, refresh the page.)',
  },
  onRevertClick: {
    action: 'onRevertClick',
  },
} satisfies Meta<typeof AILabel>['argTypes'];

const sharedArgs = {
  aiText: 'AI',
  ['aria-label']: 'Show information',
  kind: 'default',
  revertActive: false,
  revertLabel: 'Revert to AI input',
  size: 'md',
  defaultOpen: false,
  textLabel: '',
  autoAlign: true,
  onRevertClick: (event) => {
    action('onRevertClick')(event);
  },
} satisfies Meta<typeof AILabel>['args'];

export const Default: StoryFn<typeof AILabel> = (args) => {
  const aiContent = (
    <div>
      <p className="secondary">AI Explained</p>
      <h2 className="ai-label-heading">84%</h2>
      <p className="secondary bold">Confidence score</p>
      <p className="secondary">
        Lorem ipsum dolor sit amet, di os consectetur adipiscing elit, sed do
        eiusmod tempor incididunt ut fsil labore et dolore magna aliqua.
      </p>
      <hr />
      <p className="secondary">Model type</p>
      <p className="bold">Foundation model</p>
      <a href="#" style={{ marginRight: 'var(--cds-spacing-04)' }}>
        normal link
      </a>
      <Link href="#">cds link</Link>
    </div>
  );

  return (
    <>
      <div className="ai-label-container ai-label-container-example">
        <AILabel {...args}>
          <AILabelContent>
            {aiContent}
            <AILabelActions>
              <IconButton kind="ghost" label="View" aria-label="View">
                <View />
              </IconButton>
              <IconButton
                kind="ghost"
                label="Open Folder"
                aria-label="Open Folder">
                <FolderOpen />
              </IconButton>
              <IconButton kind="ghost" label="Folders" aria-label="Folders">
                <Folders />
              </IconButton>
              <Button>View details</Button>
            </AILabelActions>
          </AILabelContent>
        </AILabel>
      </div>
    </>
  );
};
Default.args = { ...sharedArgs };
Default.argTypes = { ...sharedArgTypes };
export const Inline: StoryFn<typeof AILabel> = (args) => {
  const aiContent = (
    <div>
      <p className="secondary">AI Explained</p>
      <h2 className="ai-label-heading">84%</h2>
      <p className="secondary bold">Confidence score</p>
      <p className="secondary">
        Lorem ipsum dolor sit amet, di os consectetur adipiscing elit, sed do
        eiusmod tempor incididunt ut fsil labore et dolore magna aliqua.
      </p>
      <hr />
      <p className="secondary">Model type</p>
      <p className="bold">Foundation model</p>
    </div>
  );

  return (
    <>
      <div className="ai-label-container ai-label-container-example">
        <AILabel {...args}>
          <AILabelContent>
            {aiContent}
            <AILabelActions>
              <IconButton kind="ghost" label="View" aria-label="View">
                <View />
              </IconButton>
              <IconButton
                kind="ghost"
                label="Open Folder"
                aria-label="Open Folder">
                <FolderOpen />
              </IconButton>
              <IconButton kind="ghost" label="Folders" aria-label="Folders">
                <Folders />
              </IconButton>
              <Button>View details</Button>
            </AILabelActions>
          </AILabelContent>
        </AILabel>
      </div>
    </>
  );
};
Inline.args = {
  ...sharedArgs,
  // `kind` prop is hidden from the controls table, but its value is still used for conditional `textLabel`,
  // hence the arg value is set even though the prop can’t be updated from controls.
  kind: 'inline',
};
Inline.argTypes = {
  ...sharedArgTypes,
  size: {
    options: ['sm', 'md', 'lg'],
    control: { type: 'select' },
    description:
      'Specify the size of the button, from the following list of sizes:',
    table: {
      defaultValue: {
        summary: 'md',
      },
      type: {
        summary: "'sm' | 'md' | 'lg'",
      },
    },
    if: { arg: 'revertActive', neq: true },
  },
};
Inline.parameters = {
  controls: {
    exclude: [
      'AILabelContent',
      'aiTextLabel',
      'slugLabel',
      'defaultOpen',
      'kind',
    ],
  },
};
export const InlineWithContent: StoryFn<typeof AILabel> = (args) => {
  const aiContent = (
    <div>
      <p className="secondary">AI Explained</p>
      <h2 className="ai-label-heading">84%</h2>
      <p className="secondary bold">Confidence score</p>
      <p className="secondary">
        Lorem ipsum dolor sit amet, di os consectetur adipiscing elit, sed do
        eiusmod tempor incididunt ut fsil labore et dolore magna aliqua.
      </p>
      <hr />
      <p className="secondary">Model type</p>
      <p className="bold">Foundation model</p>
    </div>
  );

  return (
    <>
      <div className="ai-label-container ai-label-container-example">
        <AILabel {...args}>
          <AILabelContent>
            {aiContent}
            <AILabelActions>
              <IconButton kind="ghost" label="View" aria-label="View">
                <View />
              </IconButton>
              <IconButton
                kind="ghost"
                label="Open Folder"
                aria-label="Open Folder">
                <FolderOpen />
              </IconButton>
              <IconButton kind="ghost" label="Folders" aria-label="Folders">
                <Folders />
              </IconButton>
              <Button>View details</Button>
            </AILabelActions>
          </AILabelContent>
        </AILabel>
      </div>
    </>
  );
};
InlineWithContent.args = {
  ...sharedArgs,
  // `kind` prop is hidden from the controls table, but its value is still used for conditional `textLabel`,
  // hence the arg value is set even though the prop can’t be updated from controls.
  kind: 'inline',
  textLabel: 'Text goes here',
};
InlineWithContent.argTypes = {
  ...sharedArgTypes,
  size: {
    options: ['sm', 'md', 'lg'],
    control: { type: 'select' },
    description:
      'Specify the size of the button, from the following list of sizes:',
    table: {
      defaultValue: {
        summary: 'md',
      },
      type: {
        summary: "'sm' | 'md' | 'lg'",
      },
    },
    if: { arg: 'revertActive', neq: true },
  },
};
InlineWithContent.parameters = {
  controls: {
    exclude: [
      'AILabelContent',
      'aiTextLabel',
      'slugLabel',
      'defaultOpen',
      'kind',
    ],
  },
};
