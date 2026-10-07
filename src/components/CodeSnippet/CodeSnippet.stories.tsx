/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: scrollable-region-focusable disabled on the multi-line stories, argTypes typed and defaultValue summaries as strings, TypeScript, components from @afframe/ui, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ComponentProps } from 'react';
import type { ArgTypes, Meta, StoryObj } from '@storybook/react-vite';
import { CodeSnippet, CodeSnippetSkeleton } from '../../index.js';
import { WithLayer } from '../../../.storybook/templates/WithLayer/index.js';
import mdx from './CodeSnippet.mdx';

type SnippetArgs = ComponentProps<typeof CodeSnippet> & { text: string };

const alignOptions = [
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
];

const typeArgType: ArgTypes[string] = {
  control: 'radio',
  options: ['single', 'inline', 'multi'],
  table: { defaultValue: { summary: '"single"' } },
};

const variantArgTypes: ArgTypes = {
  type: {
    ...typeArgType,
    table: {
      ...typeArgType.table,
      readonly: true,
    },
  },
};

export default {
  title: 'Components/CodeSnippet',
  component: CodeSnippet,
  tags: ['carbon'],
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    align: {
      control: 'select',
      options: alignOptions,
      table: { defaultValue: { summary: '"bottom"' } },
    },
    autoAlign: {
      table: { defaultValue: { summary: 'false' } },
    },
    'aria-label': {
      table: { defaultValue: { summary: '"Copy to clipboard"' } },
    },
    copyButtonDescription: {
      table: { defaultValue: { summary: '"Copy to clipboard"' } },
    },
    disabled: {
      table: { defaultValue: { summary: 'false' } },
    },
    feedback: {
      table: { defaultValue: { summary: '"Copied!"' } },
    },
    feedbackTimeout: {
      table: { defaultValue: { summary: '2000' } },
    },
    hideCopyButton: {
      table: { defaultValue: { summary: 'false' } },
    },
    light: {
      table: {
        disable: true,
      },
    },
    type: typeArgType,
    text: {
      control: 'text',
      description: 'Specify the text that is inside the code snippet',
    },
    maxCollapsedNumberOfRows: {
      table: { defaultValue: { summary: '15' } },
    },
    maxExpandedNumberOfRows: {
      table: { defaultValue: { summary: '0' } },
    },
    minCollapsedNumberOfRows: {
      table: { defaultValue: { summary: '3' } },
    },
    minExpandedNumberOfRows: {
      table: { defaultValue: { summary: '16' } },
    },
    showLessText: {
      table: { defaultValue: { summary: '"Show less"' } },
    },
    showMoreText: {
      table: { defaultValue: { summary: '"Show more"' } },
    },
    wrapText: {
      table: { defaultValue: { summary: 'false' } },
    },
  },
} satisfies Meta<SnippetArgs>;

const codeSnippetArgs: SnippetArgs = {
  align: 'bottom',
  autoAlign: false,
  'aria-label': 'Copy to clipboard',
  copyButtonDescription: 'Copy to clipboard',
  copyText: '',
  disabled: false,
  feedback: 'Copied to clipboard',
  feedbackTimeout: 2000,
  hideCopyButton: false,
  maxCollapsedNumberOfRows: 15,
  maxExpandedNumberOfRows: 0,
  minCollapsedNumberOfRows: 3,
  minExpandedNumberOfRows: 16,
  showLessText: 'Show less',
  showMoreText: 'Show more',
  text: 'node -v',
  type: 'single',
  wrapText: false,
};

const codeSnippetParameters = {
  controls: {
    include: Object.keys(codeSnippetArgs),
  },
};

const scrollableRegionException = {
  a11y: {
    config: { rules: [{ id: 'scrollable-region-focusable', enabled: false }] },
  },
};

const multilineCode = `  "scripts": {
    "build": "lerna run build --stream --prefix --npm-client yarn",
    "ci-check": "carbon-cli ci-check",
    "clean": "lerna run clean && lerna clean --yes && rimraf node_modules",
    "doctoc": "doctoc --title '## Table of Contents'",
    "format": "prettier --write '**/*.{js,md,scss,ts}' '!**/{build,es,lib,storybook,ts,umd}/**'",
    "format:diff": "prettier --list-different '**/*.{js,md,scss,ts}' '!**/{build,es,lib,storybook,ts,umd}/**' '!packages/components/**'",
    "lint": "eslint actions config codemods packages",
    "lint:styles": "stylelint '**/*.{css,scss}' --report-needless-disables --report-invalid-scope-disables",
    "test": "cross-env BABEL_ENV=test jest",
    "test:e2e": "cross-env BABEL_ENV=test jest --testPathPattern=e2e --testPathIgnorePatterns='examples,/packages/components/,/packages/react/'"
  },
  "resolutions": {
    "react": "~16.9.0",
    "react-dom": "~16.9.0",
    "react-is": "~16.9.0",
    "react-test-renderer": "~16.9.0"
  },
  "devDependencies": {
    "@babel/core": "^7.10.0",
    "@babel/plugin-proposal-class-properties": "^7.7.4",
    "@babel/plugin-proposal-export-default-from": "^7.7.4",
    "@babel/plugin-proposal-export-namespace-from": "^7.7.4",
    "@babel/plugin-transform-runtime": "^7.10.0",
    "@babel/preset-env": "^7.10.0",
    "@babel/preset-react": "^7.10.0",
    "@babel/runtime": "^7.10.0",
    "@commitlint/cli": "^8.3.5",`;

const singlelineCode =
  'yarn add carbon-components@latest carbon-components-react@latest @carbon/icons-react@latest carbon-icons@latest';

const renderCodeSnippet = ({ text, ...args }: SnippetArgs) => (
  <CodeSnippet {...args}>{text}</CodeSnippet>
);

const renderCodeSnippetWithLayer = ({ text, ...args }: SnippetArgs) => (
  <WithLayer>
    <CodeSnippet {...args}>{text}</CodeSnippet>
  </WithLayer>
);

export const Inline: StoryObj<SnippetArgs> = {
  args: {
    ...codeSnippetArgs,
    type: 'inline',
  },
  argTypes: variantArgTypes,
  parameters: codeSnippetParameters,
  render: renderCodeSnippet,
};

export const Multiline: StoryObj<SnippetArgs> = {
  args: {
    ...codeSnippetArgs,
    text: multilineCode,
    type: 'multi',
  },
  argTypes: variantArgTypes,
  parameters: {
    ...codeSnippetParameters,
    ...scrollableRegionException,
  },
  render: renderCodeSnippet,
};

export const Singleline: StoryObj<SnippetArgs> = {
  args: {
    ...codeSnippetArgs,
    text: singlelineCode,
  },
  argTypes: variantArgTypes,
  parameters: codeSnippetParameters,
  render: renderCodeSnippet,
};

export const InlineWithLayer: StoryObj<SnippetArgs> = {
  args: {
    ...codeSnippetArgs,
    type: 'inline',
  },
  argTypes: variantArgTypes,
  parameters: codeSnippetParameters,
  render: renderCodeSnippetWithLayer,
};

export const MultilineWithLayer: StoryObj<SnippetArgs> = {
  args: {
    ...codeSnippetArgs,
    text: multilineCode,
    type: 'multi',
  },
  argTypes: variantArgTypes,
  parameters: {
    ...codeSnippetParameters,
    ...scrollableRegionException,
  },
  render: renderCodeSnippetWithLayer,
};

export const SinglelineWithLayer: StoryObj<SnippetArgs> = {
  args: {
    ...codeSnippetArgs,
    text: singlelineCode,
  },
  argTypes: variantArgTypes,
  parameters: codeSnippetParameters,
  render: renderCodeSnippetWithLayer,
};

export const Skeleton: StoryObj<typeof CodeSnippetSkeleton> = {
  args: {
    type: 'single',
  },
  argTypes: {
    type: {
      control: 'radio',
      description: 'Specify the type of Code Snippet skeleton.',
      options: ['single', 'multi'],
      table: { defaultValue: { summary: '"single"' } },
    },
  },
  parameters: {
    controls: {
      include: ['type'],
    },
  },
  render: (args) => <CodeSnippetSkeleton {...args} />,
};
