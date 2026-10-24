/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, source tag, story names unified, invoice data, the custom log goes to Storybook actions. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { ErrorBoundary, ErrorBoundaryContext } from '../../index.js';
import mdx from './ErrorBoundary.mdx';
import DemoComponent from './stories/demo.js';
import type { DemoArgs } from './stories/demo.js';

const defaultArgs = {
  buttonLabel: 'Throw an error',
  children: 'Invoice list',
  errorMessage: 'Invoice list failed to render',
  fallback: 'This section could not be loaded.',
  shouldThrowError: false,
};

const argTypes = {
  buttonLabel: { control: 'text' },
  children: { control: 'text' },
  errorMessage: { control: 'text' },
  fallback: { control: 'text' },
  onLog: { action: 'log' },
  shouldThrowError: { control: 'boolean' },
} as const;

export default {
  title: 'Utilities/ErrorBoundary',
  component: ErrorBoundary,
  tags: ['carbon'],
  parameters: {
    docs: {
      page: mdx,
    },
    controls: { include: Object.keys(argTypes) },
  },
} satisfies Meta<typeof ErrorBoundary>;

export const Default: StoryFn<DemoArgs> = (args) => {
  return <DemoComponent {...args} />;
};

Default.args = { ...defaultArgs };
Default.argTypes = { ...argTypes };

export const WithCustomContext: StoryFn<DemoArgs> = (args) => {
  return (
    <ErrorBoundaryContext.Provider value={{ log: args.onLog }}>
      <DemoComponent {...args} />
    </ErrorBoundaryContext.Provider>
  );
};

WithCustomContext.args = { ...defaultArgs };
WithCustomContext.argTypes = { ...argTypes };
