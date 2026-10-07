/**
 * Copyright IBM Corp. 2025, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2025, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, preview__ShapeIndicator from @afframe/ui, source tag, unused import dropped, inline spacing as Carbon spacing tokens. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ComponentProps } from 'react';
import type { ArgTypes, Meta, StoryFn } from '@storybook/react-vite';
import { preview__ShapeIndicator as Indicator } from '../../index.js';
import mdx from './ShapeIndicator.mdx';

type IndicatorArgs = Omit<ComponentProps<typeof Indicator>, 'kind' | 'label'>;

export default {
  title: 'Preview/StatusIndicators/preview__ShapeIndicator',
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
  label: {
    control: {
      type: 'text',
    },
  },
  kind: {
    control: false,
  },
  shapeDescription: {
    control: {
      type: 'text',
    },
  },
  textSize: {
    control: {
      type: 'select',
    },
    options: [12, 14],
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
      <Indicator kind="critical" label="Critical" {...props} />
      <Indicator kind="high" label="High" {...props} />
      <Indicator kind="medium" label="Medium" {...props} />
      <Indicator kind="low" label="Low" {...props} />
      <Indicator kind="cautious" label="Cautious" {...props} />
      <Indicator kind="undefined" label="Undefined" {...props} />
      <Indicator kind="stable" label="Stable" {...props} />
      <Indicator kind="informative" label="Informative" {...props} />
      <Indicator kind="incomplete" label="Incomplete" {...props} />
      <Indicator kind="draft" label="Draft" {...props} />
    </div>
  );
};

Default.args = {
  align: 'right',
  autoAlign: false,
  compact: false,
  shapeDescription: 'Shape',
  textSize: 12,
};

Default.argTypes = sharedArgTypes;

export const DefaultWithTextSize14: StoryFn<IndicatorArgs> = (props) => {
  return (
    <div
      style={{
        display: 'flex',
        flexFlow: 'column',
        rowGap: 'var(--cds-spacing-03)',
      }}>
      <Indicator kind="failed" label="Failed" {...props} />
      <Indicator kind="critical" label="Critical" {...props} />
      <Indicator kind="high" label="High" {...props} />
      <Indicator kind="medium" label="Medium" {...props} />
      <Indicator kind="low" label="Low" {...props} />
      <Indicator kind="cautious" label="Cautious" {...props} />
      <Indicator kind="undefined" label="Undefined" {...props} />
      <Indicator kind="stable" label="Stable" {...props} />
      <Indicator kind="informative" label="Informative" {...props} />
      <Indicator kind="incomplete" label="Incomplete" {...props} />
      <Indicator kind="draft" label="Draft" {...props} />
    </div>
  );
};

DefaultWithTextSize14.args = {
  align: 'right',
  autoAlign: false,
  compact: false,
  shapeDescription: 'Shape',
  textSize: 14,
};

/*
 * This story will:
 * - Be excluded from the docs page
 * - Removed from the sidebar navigation
 * - Still be a tested variant
 */
DefaultWithTextSize14.tags = ['!dev', '!autodocs'];

DefaultWithTextSize14.argTypes = sharedArgTypes;
