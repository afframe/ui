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

import { useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { Popover, PopoverContent } from '../../index.js';
import type { PopoverProps } from '../../index.js';
import { Checkbox as CheckboxIcon } from '../../icons.js';
import './story.css';

export default {
  title: 'Components/Popover/Feature Flag',
  component: Popover,
  tags: ['carbon', '!autodocs'],
} satisfies Meta<typeof Popover>;

export const FloatingStyles: StoryFn<Partial<PopoverProps<'span'>>> = (
  args
) => {
  const [open, setOpen] = useState(true);

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}>
      <Popover open={open} align={args.align ?? 'bottom'}>
        <div className="playground-trigger">
          <CheckboxIcon
            onClick={() => {
              setOpen(!open);
            }}
          />
        </div>
        <PopoverContent className="p-3">
          <div>
            <p className="popover-title">This popover uses autoAlign</p>
            <p className="popover-details">
              Scroll the container up, down, left or right to observe how the
              popover will automatically change its position in attempt to stay
              within the viewport. This works on initial render in addition to
              on scroll.
            </p>
          </div>
        </PopoverContent>
      </Popover>
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
};
