/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, Popover, Checkbox and RadioButton parts from @afframe/ui, icons from @afframe/ui/icons, story styles as plain CSS, `story` decorators moved to `decorators`, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useState, useEffect, useRef } from 'react';
import type { CSSProperties } from 'react';
import type { ArgTypes, Meta, StoryFn } from '@storybook/react-vite';
import { Checkbox as CheckboxIcon, Settings } from '../../icons.js';
import {
  Checkbox,
  Popover,
  PopoverContent,
  RadioButton,
  RadioButtonGroup,
} from '../../index.js';
import type { PopoverProps } from '../../index.js';
import mdx from './Popover.mdx';
import './story.css';

// Stories set only some props through args.
type PopoverStoryArgs = Partial<PopoverProps<'span'>>;

const prefix = 'cds';

export default {
  title: 'Components/Popover',
  tags: ['carbon'],
  component: Popover,
  subcomponents: {
    PopoverContent,
  },
  parameters: {
    controls: {
      hideNoControlsWarning: true,
      exclude: ['relative'],
    },
    docs: {
      page: mdx,
    },
  },
} satisfies Meta;

const DefaultStory: StoryFn<PopoverStoryArgs> = (props) => {
  // align, caret, dropShadow and highContrast reach Popover through the props spread.
  const { open } = props;
  const [isOpen, setIsOpen] = useState(open ?? false);

  return (
    <Popover {...props} open={isOpen} onRequestClose={() => setIsOpen(false)}>
      <button
        className="playground-trigger"
        aria-label="Checkbox"
        type="button"
        aria-expanded={isOpen}
        onClick={() => {
          setIsOpen(!isOpen);
        }}>
        <CheckboxIcon />
      </button>
      <PopoverContent className="p-3">
        <h2 className="popover-title">Available storage</h2>
        <p className="popover-details">
          This server has 150 GB of block storage remaining.
        </p>
      </PopoverContent>
    </Popover>
  );
};

export const TabTip: StoryFn<PopoverStoryArgs> = (args) => {
  const [open, setOpen] = useState(true);
  const [openTwo, setOpenTwo] = useState(false);
  const align = document?.dir === 'rtl' ? 'bottom-right' : 'bottom-left';
  const alignTwo = document?.dir === 'rtl' ? 'bottom-left' : 'bottom-right';
  return (
    <div className="popover-tabtip-story" style={{ display: 'flex' }}>
      <Popover
        align={align}
        open={open}
        isTabTip
        onRequestClose={() => setOpen(false)}
        {...args}>
        <button
          aria-label="Settings"
          type="button"
          aria-expanded={open}
          onClick={() => {
            setOpen(!open);
          }}>
          <Settings />
        </button>
        <PopoverContent className="p-3">
          <RadioButtonGroup
            style={{ alignItems: 'flex-start', flexDirection: 'column' }}
            legendText="Row height 1"
            name="radio-button-group"
            defaultSelected="small">
            <RadioButton labelText="Small" value="small" id="radio-small" />
            <RadioButton labelText="Large" value="large" id="radio-large" />
          </RadioButtonGroup>
          <hr />
          <fieldset className={`${prefix}--fieldset`}>
            <legend className={`${prefix}--label`}>Edit columns</legend>
            <Checkbox defaultChecked labelText="Name" id="checkbox-label-1" />
            <Checkbox defaultChecked labelText="Type" id="checkbox-label-2" />
            <Checkbox
              defaultChecked
              labelText="Location"
              id="checkbox-label-3"
            />
          </fieldset>
        </PopoverContent>
      </Popover>

      <Popover
        open={openTwo}
        isTabTip
        align={alignTwo}
        onRequestClose={() => setOpenTwo(false)}
        {...args}>
        <button
          aria-label="Settings"
          type="button"
          aria-expanded={open}
          onClick={() => {
            setOpenTwo(!openTwo);
          }}>
          <Settings />
        </button>
        <PopoverContent className="p-3">
          <RadioButtonGroup
            style={{ alignItems: 'flex-start', flexDirection: 'column' }}
            legendText="Row height 2"
            name="radio-button-group-2"
            defaultSelected="small-2">
            <RadioButton labelText="Small" value="small-2" id="radio-small-2" />
            <RadioButton labelText="Large" value="large-2" id="radio-large-2" />
          </RadioButtonGroup>
          <hr />
          <fieldset className={`${prefix}--fieldset`}>
            <legend className={`${prefix}--label`}>Testing</legend>
            <Checkbox defaultChecked labelText="Name" id="checkbox-label-8" />
            <Checkbox defaultChecked labelText="Type" id="checkbox-label-9" />
            <Checkbox
              defaultChecked
              labelText="Location"
              id="checkbox-label-10"
            />
          </fieldset>
        </PopoverContent>
      </Popover>
    </div>
  );
};

TabTip.parameters = {
  controls: {
    exclude: ['align', 'autoAlign', 'caret', 'highContrast'],
  },
};

export const Default: StoryFn<PopoverStoryArgs> = DefaultStory.bind({});

Default.args = {
  caret: true,
  dropShadow: true,
  highContrast: false,
  open: true,
};
Default.parameters = {
  controls: {
    exclude: ['isTabTip'],
  },
};

Default.argTypes = {
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
  border: {
    control: {
      type: 'boolean',
    },
  },
  caret: {
    control: {
      type: 'boolean',
    },
  },
  dropShadow: {
    control: {
      type: 'boolean',
    },
  },
  highContrast: {
    control: {
      type: 'boolean',
    },
  },
  open: {
    control: {
      type: 'boolean',
    },
  },
};

// Upstream sets this on the removed `story` annotation; Storybook reads `decorators`.
Default.decorators = [
  (story) => <div className="mt-10 flex justify-center">{story()}</div>,
];

const autoAlignArgTypes: Partial<ArgTypes<PopoverStoryArgs>> = {
  caret: {
    control: {
      type: 'boolean',
    },
  },
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

const autoAlignStoryContainerStyle: CSSProperties = {
  display: 'grid',
  placeItems: 'center',
  width: '200vw',
  minWidth: '1200px',
  height: '200vh',
  minHeight: '1200px',
};

export const ExperimentalAutoAlign: StoryFn<PopoverStoryArgs> = (args) => {
  const [open, setOpen] = useState(true);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    ref?.current?.scrollIntoView({ block: 'center', inline: 'center' });
  });

  return (
    <div style={autoAlignStoryContainerStyle}>
      <Popover
        open={open}
        align="top"
        autoAlign
        ref={ref}
        onRequestClose={() => setOpen(false)}
        {...args}>
        <button
          className="playground-trigger"
          aria-label="Checkbox"
          type="button"
          aria-expanded={open}
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

ExperimentalAutoAlign.argTypes = autoAlignArgTypes;
ExperimentalAutoAlign.parameters = {
  controls: {
    exclude: ['autoAlign', 'highContrast', 'isTabTip'],
  },
};
export const ExperimentalAutoAlignBoundary: StoryFn<PopoverStoryArgs> = (
  args
) => {
  const [open, setOpen] = useState(true);
  const ref = useRef<HTMLSpanElement>(null);
  const [boundary, setBoundary] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    ref?.current?.scrollIntoView({ block: 'center', inline: 'center' });
  });

  return (
    <div
      style={{
        display: 'grid',
        placeItems: 'center',
        overflow: 'scroll',
        width: '800px',
        height: '500px',
        border: '1px',
        borderStyle: 'dashed',
        borderColor: 'var(--cds-border-strong, #8d8d8d)',
        margin: '0 auto',
      }}
      ref={setBoundary}>
      <div
        style={{
          width: '2100px',
          height: '1px',
          placeItems: 'center',
        }}
      />
      <div style={{ placeItems: 'center', height: '32px', width: '32px' }}>
        <Popover
          open={open}
          align="top"
          autoAlign
          {...(boundary ? { autoAlignBoundary: boundary } : {})}
          onRequestClose={() => setOpen(false)}
          ref={ref}
          {...args}>
          <button
            className="playground-trigger"
            aria-label="Checkbox"
            type="button"
            aria-expanded={open}
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
                popover will automatically change its position in attempt to
                stay within the viewport. This works on initial render in
                addition to on scroll.
              </p>
            </div>
          </PopoverContent>
        </Popover>
        <div
          style={{
            height: '1000px',
            width: '1px',
            placeItems: 'center',
          }}
        />
      </div>
    </div>
  );
};

ExperimentalAutoAlignBoundary.argTypes = autoAlignArgTypes;
ExperimentalAutoAlignBoundary.parameters = {
  controls: {
    exclude: ['autoAlign', 'highContrast', 'isTabTip'],
  },
};

export const TabTipExperimentalAutoAlign: StoryFn<PopoverStoryArgs> = () => {
  const [open, setOpen] = useState(true);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    ref?.current?.scrollIntoView({ block: 'center', inline: 'center' });
  });

  return (
    <div style={autoAlignStoryContainerStyle}>
      <Popover open={open} align="bottom-right" autoAlign ref={ref} isTabTip>
        <div className="playground-trigger">
          <CheckboxIcon
            onClick={() => {
              setOpen(!open);
            }}
          />
        </div>
        <PopoverContent className="p-3">
          <div>
            <p className="popover-title">
              This popover uses autoAlign with isTabTip
            </p>
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
