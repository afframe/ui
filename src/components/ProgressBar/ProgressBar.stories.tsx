/**
 * Copyright IBM Corp. 2021, 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2021, 2025
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript (value omitted instead of null while not running, defaults for the destructured args), components from @afframe/ui, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { ProgressBar } from '../../index.js';
import { WithLayer } from '../../../.storybook/templates/WithLayer/index.js';
import mdx from './ProgressBar.mdx';

export default {
  title: 'Components/ProgressBar',
  component: ProgressBar,
  tags: ['carbon'],
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof ProgressBar>;

const sharedArgs = {
  helperText: '75 MB of 100 MB',
  hideLabel: false,
  label: 'Uploading files',
  max: 100,
  size: 'big',
  status: 'active',
  type: 'default',
  value: 75,
} as const;

const sharedArgTypes = {
  helperText: {
    control: { type: 'text' },
  },
  hideLabel: {
    control: { type: 'boolean' },
  },
  label: {
    control: { type: 'text' },
  },
  max: {
    control: { type: 'number' },
  },
  size: {
    options: ['small', 'big'],
    control: { type: 'select' },
  },
  status: {
    options: ['active', 'finished', 'error'],
    control: { type: 'select' },
  },
  type: {
    options: ['default', 'inline', 'indented'],
    control: { type: 'select' },
  },
  value: {
    control: { type: 'number' },
  },
} as const;

export const Default: StoryFn<typeof ProgressBar> = (args) => (
  <ProgressBar {...args} />
);

Default.args = {
  ...sharedArgs,
};

Default.argTypes = {
  ...sharedArgTypes,
};

export const Indeterminate: StoryFn<typeof ProgressBar> = (args) => (
  <ProgressBar {...args} />
);

Indeterminate.args = {
  ...sharedArgs,
  helperText: 'Preparing files...',
  label: 'Preparing upload',
  value: undefined as never,
};

Indeterminate.argTypes = {
  ...sharedArgTypes,
  status: {
    table: { readonly: true },
  },
  value: {
    control: false,
    table: { readonly: true },
  },
};

Indeterminate.parameters = {
  controls: {
    include: ['helperText', 'hideLabel', 'label', 'size', 'status', 'type'],
  },
};

export const Determinate: StoryFn<typeof ProgressBar> = ({
  hideLabel = false,
  label = '',
  size: barSize = 'big',
  type = 'default',
}) => {
  const size = 728;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      const interval = setInterval(() => {
        setProgress((currentProgress) => {
          const advancement = Math.random() * 8;
          if (currentProgress + advancement < size) {
            return currentProgress + advancement;
          } else {
            clearInterval(interval);
            return size;
          }
        });
      }, 50);
    }, 3000);
  }, []);

  const running = progress > 0;

  let helperText = running
    ? `${progress.toFixed(1)}MB of ${size}MB`
    : 'Fetching assets...';
  if (progress >= size) {
    helperText = 'Done';
  }

  return (
    <ProgressBar
      {...(running ? { value: progress } : {})}
      max={size}
      status={progress === size ? 'finished' : 'active'}
      hideLabel={hideLabel}
      label={label}
      helperText={helperText}
      size={barSize}
      type={type}
    />
  );
};

Determinate.args = {
  ...sharedArgs,
  helperText: 'Fetching assets...',
  label: 'Exporting data',
  max: 728,
  status: 'active',
  value: undefined as never,
};

Determinate.argTypes = {
  ...sharedArgTypes,
  helperText: {
    control: false,
    table: { readonly: true },
  },
  max: {
    control: false,
    table: { readonly: true },
  },
  status: {
    control: false,
    table: { readonly: true },
  },
  value: {
    control: false,
    table: { readonly: true },
  },
};

Determinate.parameters = {
  controls: {
    include: ['hideLabel', 'label', 'size', 'type'],
  },
};

export const _WithLayer: StoryFn<typeof ProgressBar> = (args) => (
  <WithLayer>
    <ProgressBar {...args} />
  </WithLayer>
);

_WithLayer.args = {
  ...sharedArgs,
  helperText: '42 MB of 100 MB',
  value: 42,
};

_WithLayer.argTypes = {
  ...sharedArgTypes,
};
