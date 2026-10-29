/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, no PropTypes, AILabel story styles dropped, source tag, story names unified, Afframe example messages. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { Form } from '../../index.js';
import mdx from './Form.mdx';
import FormDemo from './stories/form-demo.js';
import type { FormStoryArgs } from './stories/form-demo.js';

export default {
  title: 'Components/Form',
  component: Form,
  tags: ['carbon'],
  parameters: {
    docs: {
      page: mdx,
    },
  },
  // ── Shared controls inherited by every story ──────────────────────────────
  args: {
    className: 'some-class',
    skeleton: false,
    aiLabel: false,
    revertActive: false,
    showInModal: false,
    disabled: false,
    readOnly: false,
    invalid: false,
    invalidText: 'Check this field before you save.',
    warn: false,
    warnText: 'This change also affects existing invoices.',
  },
  argTypes: {
    className: {
      control: { type: 'text' },
      description: 'Specify a custom className to be applied to the form',
    },
    onSubmit: {
      action: 'onSubmit',
    },
    skeleton: {
      control: { type: 'boolean' },
      description: 'Render all form inputs as skeleton loaders simultaneously',
    },
    aiLabel: {
      control: { type: 'boolean' },
      description: 'Attach an AI Label decorator to all inputs that support it',
      table: { category: 'AILabel' },
    },
    revertActive: {
      control: { type: 'boolean' },
      table: { category: 'AILabel' },
    },
    showInModal: {
      control: { type: 'boolean' },
      description:
        'Render the entire form inside a ComposedModal with a trigger button',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Specify whether the form inputs should be disabled',
    },
    readOnly: {
      control: { type: 'boolean' },
      description: 'Specify whether the form inputs should be read-only',
    },
    invalid: {
      control: { type: 'boolean' },
      description: 'Specify whether the form inputs are in an invalid state',
    },
    invalidText: {
      control: { type: 'text' },
      description: 'Provide the text for the invalid state',
    },
    warn: {
      control: { type: 'boolean' },
      description: 'Specify whether the form inputs should display a warning',
    },
    warnText: {
      control: { type: 'text' },
      description: 'Provide the text for the warning state',
    },
  },
} satisfies Meta<FormStoryArgs>;

export const Default: StoryFn<FormStoryArgs> = (args) => <FormDemo {...args} />;

// Story-specific args: shared controls come from the export default above
Default.args = {
  size: 'md',
  showInModal: false,
};

Default.argTypes = {
  showInModal: {
    control: { type: 'boolean' },
    description:
      'Render the entire form inside a ComposedModal with a trigger button',
  },
  size: {
    control: { type: 'select' },
    options: ['xs', 'sm', 'md', 'lg'],
    description:
      'Size of all form inputs. xs is supported by TextInput, Select and Search; other components clamp to sm.',
  },
};

export const WithAILabel: StoryFn<FormStoryArgs> = (args) => {
  const mergedArgs: FormStoryArgs = { ...args, size: 'md' };
  return <FormDemo {...mergedArgs} />;
};

WithAILabel.args = {
  aiLabel: true,
};

WithAILabel.argTypes = {
  size: {
    table: { disable: true },
  },
};
