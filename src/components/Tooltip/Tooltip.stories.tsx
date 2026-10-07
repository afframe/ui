/**
 * Copyright IBM Corp. 2016, 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2025
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, Tooltip and Button from @afframe/ui, icons from @afframe/ui/icons, story styles as plain CSS, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useRef, useEffect } from 'react';
import type { CSSProperties } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { OverflowMenuVertical } from '../../icons.js';
import { Button, Tooltip } from '../../index.js';
import type { Popover, TooltipProps } from '../../index.js';
import mdx from './Tooltip.mdx';
import './story.css';

// Stories set only some props through args.
type TooltipStoryArgs = Partial<TooltipProps<typeof Popover>>;

export default {
  title: 'Components/Tooltip',
  tags: ['carbon'],
  component: Tooltip,
  parameters: {
    controls: {
      hideNoControlsWarning: true,
    },
    layout: 'centered',
    docs: {
      page: mdx,
    },
  },
  argTypes: {
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
    highContrast: {
      table: {
        disable: true,
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
  },
  decorators: [
    (Story, context) => {
      if (context.name.toLowerCase().includes('auto align')) {
        return <Story />;
      }
      return (
        <div className="sb-tooltip-story">
          <Story />
        </div>
      );
    },
  ],
} satisfies Meta;

// Note: autoAlign is used here only to make tooltips visible in StackBlitz,
// autoAlign is in preview and not part of the actual implementation.
export const Default: StoryFn<TooltipStoryArgs> = (args) => {
  const label = 'Options';
  return (
    <Tooltip autoAlign label={label} closeOnActivation={false} {...args}>
      <button className="sb-tooltip-trigger" type="button">
        <OverflowMenuVertical />
      </button>
    </Tooltip>
  );
};

export const Alignment: StoryFn<TooltipStoryArgs> = (args) => {
  return (
    <Tooltip label="Tooltip alignment" align="bottom-left" {...args}>
      <Button>This button has a tooltip</Button>
    </Tooltip>
  );
};

const autoAlignStoryContainerStyle: CSSProperties = {
  display: 'grid',
  placeItems: 'center',
  width: '200vw',
  minWidth: '1200px',
  height: '200vh',
  minHeight: '1200px',
};

export const ExperimentalAutoAlign: StoryFn<TooltipStoryArgs> = (args) => {
  const ref = useRef<HTMLButtonElement>(null);
  const tooltipLabel =
    'Scroll the container up, down, left or right to observe how the tooltip will automatically change its position in attempt to stay within the viewport. This works on initial render in addition to on scroll.';

  useEffect(() => {
    ref?.current?.scrollIntoView({ block: 'center', inline: 'center' });
  });
  return (
    <div style={autoAlignStoryContainerStyle}>
      <Tooltip label={tooltipLabel} align="top" autoAlign {...args}>
        <Button ref={ref}>This button has a tooltip</Button>
      </Tooltip>
    </div>
  );
};

// Note: autoAlign is used here only to make tooltips visible in StackBlitz,
// autoAlign is in preview and not part of the actual implementation.
export const Duration: StoryFn<TooltipStoryArgs> = (args) => {
  return (
    <Tooltip
      autoAlign
      label="Label one"
      enterDelayMs={0}
      leaveDelayMs={300}
      {...args}>
      <Button>This button has a tooltip</Button>
    </Tooltip>
  );
};
