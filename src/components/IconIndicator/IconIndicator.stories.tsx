/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, preview__IconIndicator from @afframe/ui, source tag, unused import dropped, inline spacing as Carbon spacing tokens. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ComponentProps } from 'react';
import type { ArgTypes, Meta, StoryFn } from '@storybook/react-vite';
import { preview__IconIndicator as Indicator } from '../../index.js';
import mdx from './IconIndicator.mdx';

type IndicatorArgs = Omit<ComponentProps<typeof Indicator>, 'kind' | 'label'>;

export default {
  title: 'Preview/StatusIndicators/preview__IconIndicator',
  component: Indicator,
  tags: ['carbon'],
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof Indicator>;

const sharedArgTypes: ArgTypes = {
  align: {
    control: {
      type: 'select',
    },
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
    control: {
      type: 'boolean',
    },
  },
  compact: {
    control: {
      type: 'boolean',
    },
  },
  iconDescription: {
    control: {
      type: 'text',
    },
  },
  label: {
    control: {
      type: 'text',
    },
  },
  kind: {
    control: false,
  },
  size: {
    control: {
      type: 'select',
    },
    options: [16, 20],
  },
};

export const Default: StoryFn<IndicatorArgs> = (props) => {
  return (
    <div
      style={{
        display: 'inline-flex',
        flexFlow: 'column',
        rowGap: 'var(--cds-spacing-03)',
      }}>
      <Indicator kind="failed" label="Failed" {...props} />
      <Indicator kind="caution-major" label="Caution major" {...props} />
      <Indicator kind="caution-minor" label="Caution minor" {...props} />
      <Indicator kind="undefined" label="Undefined" {...props} />
      <Indicator kind="succeeded" label="Succeeded" {...props} />
      <Indicator kind="normal" label="Normal" {...props} />
      <Indicator kind="in-progress" label="In progress" {...props} />
      <Indicator kind="incomplete" label="Incomplete" {...props} />
      <Indicator kind="not-started" label="Not started" {...props} />
      <Indicator kind="pending" label="Pending" {...props} />
      <Indicator kind="unknown" label="Unknown" {...props} />
      <Indicator kind="informative" label="Informative" {...props} />
    </div>
  );
};

Default.args = {
  align: 'right',
  autoAlign: false,
  iconDescription: 'Icon',
  compact: false,
  size: 16,
};
Default.argTypes = sharedArgTypes;

export const DefaultWithSize20: StoryFn<IndicatorArgs> = (props) => {
  return (
    <div
      style={{
        display: 'inline-flex',
        flexFlow: 'column',
        rowGap: 'var(--cds-spacing-03)',
      }}>
      <Indicator kind="failed" label="Failed" {...props} />
      <Indicator kind="caution-major" label="Caution major" {...props} />
      <Indicator kind="caution-minor" label="Caution minor" {...props} />
      <Indicator kind="undefined" label="Undefined" {...props} />
      <Indicator kind="succeeded" label="Succeeded" {...props} />
      <Indicator kind="normal" label="Normal" {...props} />
      <Indicator kind="in-progress" label="In progress" {...props} />
      <Indicator kind="incomplete" label="Incomplete" {...props} />
      <Indicator kind="not-started" label="Not started" {...props} />
      <Indicator kind="pending" label="Pending" {...props} />
      <Indicator kind="unknown" label="Unknown" {...props} />
      <Indicator kind="informative" label="Informative" {...props} />
    </div>
  );
};

DefaultWithSize20.args = {
  align: 'top',
  autoAlign: true,
  compact: false,
  size: 20,
};

/*
 * This story will:
 * - Be excluded from the docs page
 * - Removed from the sidebar navigation
 * - Still be a tested variant
 */
DefaultWithSize20.tags = ['!dev', '!autodocs'];
DefaultWithSize20.argTypes = sharedArgTypes;
