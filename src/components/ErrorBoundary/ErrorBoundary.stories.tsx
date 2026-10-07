/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { ErrorBoundary, ErrorBoundaryContext, Button } from '../../index.js';
import { useEffect, useState, type ReactNode } from 'react';
import mdx from './ErrorBoundary.mdx';

interface DemoArgs {
  buttonLabel: string;
  children: ReactNode;
  errorMessage: string;
  fallback: ReactNode;
  shouldThrowError: boolean;
}

const defaultArgs = {
  buttonLabel: 'Toggle throwing error',
  children: 'Successfully rendered',
  errorMessage: 'Component threw error',
  fallback: 'Whoops',
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
  title: 'Components/ErrorBoundary',
  component: ErrorBoundary,
  tags: ['carbon'],
  parameters: {
    docs: {
      page: mdx,
    },
    controls: { include: Object.keys(argTypes) },
  },
} satisfies Meta<typeof ErrorBoundary>;

function ThrowError({
  children,
  errorMessage,
  shouldThrowError,
}: Pick<DemoArgs, 'children' | 'errorMessage' | 'shouldThrowError'>) {
  if (shouldThrowError) {
    throw new Error(errorMessage);
  }
  return children;
}

function DemoComponent({
  buttonLabel,
  children,
  errorMessage,
  fallback,
  shouldThrowError: shouldThrowErrorArg,
}: DemoArgs) {
  const [shouldThrowError, setShouldThrowError] = useState(shouldThrowErrorArg);

  useEffect(() => {
    setShouldThrowError(shouldThrowErrorArg);
  }, [shouldThrowErrorArg]);

  function onClick() {
    setShouldThrowError(!shouldThrowError);
  }

  return (
    <>
      <Button onClick={onClick}>{buttonLabel}</Button>
      <div>
        <ErrorBoundary fallback={fallback}>
          <ThrowError
            shouldThrowError={shouldThrowError}
            errorMessage={errorMessage}>
            {children}
          </ThrowError>
        </ErrorBoundary>
      </div>
    </>
  );
}

export const Default: StoryFn<DemoArgs> = (args) => {
  return <DemoComponent {...args} />;
};

Default.args = { ...defaultArgs };
Default.argTypes = { ...argTypes };

export const WithCustomContext: StoryFn<DemoArgs> = (args) => {
  return (
    <ErrorBoundaryContext.Provider
      value={{ log: (...logArgs: unknown[]) => console.log(...logArgs) }}>
      <DemoComponent {...args} />
    </ErrorBoundaryContext.Provider>
  );
};

WithCustomContext.storyName = 'with custom context';
WithCustomContext.args = { ...defaultArgs };
WithCustomContext.argTypes = { ...argTypes };
