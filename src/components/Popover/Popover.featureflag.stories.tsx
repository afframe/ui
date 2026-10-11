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

import { useEffect, useState } from 'react';
import type { ArgTypes, Meta, StoryFn } from '@storybook/react-vite';
import { Popover, PopoverContent } from '../../index.js';
import type { PopoverProps } from '../../index.js';
import { Checkbox as CheckboxIcon } from '../../icons.js';
import './story.css';

type PopoverStoryArgs = Partial<PopoverProps<'span'>>;

const args: PopoverStoryArgs = {
  align: 'bottom',
  alignmentAxisOffset: 0,
  backgroundToken: 'layer',
  border: false,
  caret: true,
  dropShadow: true,
  highContrast: false,
  open: true,
};

const argTypes: Partial<ArgTypes<PopoverStoryArgs>> = {
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
    control: { type: 'select' },
  },
  alignmentAxisOffset: {
    control: { type: 'number' },
  },
  backgroundToken: {
    options: ['layer', 'background'],
    control: { type: 'select' },
  },
  border: {
    control: { type: 'boolean' },
  },
  caret: {
    control: { type: 'boolean' },
  },
  dropShadow: {
    control: { type: 'boolean' },
  },
  highContrast: {
    control: { type: 'boolean' },
  },
  onRequestClose: {
    action: 'onRequestClose',
  },
  open: {
    control: { type: 'boolean' },
  },
};

export default {
  title: 'Components/Popover/Feature Flag',
  component: Popover,
  tags: ['carbon', '!autodocs'],
  args,
  argTypes,
  parameters: {
    controls: {
      include: Object.keys(argTypes),
    },
  },
} satisfies Meta<typeof Popover>;

export const FloatingStyles: StoryFn<PopoverStoryArgs> = (args) => {
  const { onRequestClose, open: openArg = false, ...popoverProps } = args;
  const [open, setOpen] = useState(openArg);

  useEffect(() => {
    setOpen(openArg);
  }, [openArg]);

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
      }}>
      <Popover
        {...popoverProps}
        open={open}
        onRequestClose={() => {
          onRequestClose?.();
          setOpen(false);
        }}>
        <button
          className="playground-trigger"
          aria-label="Checkbox"
          aria-expanded={open}
          type="button"
          onClick={() => {
            setOpen(!open);
          }}>
          <CheckboxIcon />
        </button>
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
