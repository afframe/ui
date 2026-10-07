/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and icons from @afframe/ui, the WithFeatureFlags decorator removed (enable-v12-release turns enable-v12-dynamic-floating-styles on globally), story styles from story.css, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { OverflowMenuVertical } from '../../icons.js';
import { Tooltip } from '../../index.js';
import type { Popover, TooltipProps } from '../../index.js';
import './story.css';

export default {
  title: 'Components/Tooltip/Feature Flag',
  component: Tooltip,
  tags: ['carbon', '!autodocs'],
} satisfies Meta<typeof Tooltip>;

export const FloatingStyles: StoryFn<Partial<TooltipProps<typeof Popover>>> = (
  args
) => {
  const tooltipLabel = 'Options';
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}>
      <Tooltip label={tooltipLabel} align={args.align ?? 'bottom'}>
        <button className="sb-tooltip-trigger" type="button">
          <OverflowMenuVertical />
        </button>
      </Tooltip>
    </div>
  );
};

FloatingStyles.args = {
  align: 'bottom',
};

FloatingStyles.argTypes = {
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
    control: {
      type: 'select',
    },
  },
  label: {
    control: {
      type: 'text',
    },
  },
  description: {
    control: {
      type: 'text',
    },
  },
  highContrast: {
    table: {
      disable: true,
    },
  },
};
