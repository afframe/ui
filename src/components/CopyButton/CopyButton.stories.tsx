/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, CopyButton from @afframe/ui, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ArgTypes, Meta, StoryFn } from '@storybook/react-vite';
import { CopyButton } from '../../index.js';
import type { CopyButtonProps } from '../../index.js';
import mdx from './CopyButton.mdx';

const defaultArgs: CopyButtonProps = {
  align: 'bottom',
  autoAlign: true,
  disabled: false,
  feedback: 'Copied!',
  feedbackTimeout: 2000,
  iconDescription: 'Copy to clipboard',
};

const argTypes: Partial<ArgTypes<CopyButtonProps>> = {
  align: {
    control: 'select',
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
  },
  autoAlign: {
    control: 'boolean',
  },
  disabled: {
    control: 'boolean',
  },
  feedback: {
    control: 'text',
  },
  feedbackTimeout: {
    control: { type: 'number', min: 1, step: 1 },
  },
  iconDescription: {
    control: 'text',
  },
  onClick: {
    action: 'onClick',
  },
};

const parameters = {
  controls: {
    include: Object.keys(argTypes),
  },
};

export default {
  title: 'Components/CopyButton',
  component: CopyButton,
  tags: ['carbon'],
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof CopyButton>;

// Note: autoAlign is used here only to make tooltips visible in StackBlitz,
// autoAlign is in preview and not part of the actual implementation.
export const Default: StoryFn<typeof CopyButton> = (args) => (
  <CopyButton {...args} />
);

Default.args = defaultArgs;
Default.argTypes = argTypes;
Default.parameters = parameters;
