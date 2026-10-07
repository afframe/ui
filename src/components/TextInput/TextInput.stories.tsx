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

import type { ChangeEvent, ComponentProps, MouseEvent } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { WithLayer } from '../../../.storybook/templates/WithLayer/index.js';
import { FolderOpen, Folders, View } from '../../icons.js';
import {
  AILabel,
  AILabelActions,
  AILabelContent,
  Button,
  IconButton,
  TextInput,
  TextInputSkeleton,
} from '../../index.js';
import mdx from './TextInput.mdx';

type TextInputStoryArgs = Omit<
  ComponentProps<typeof TextInput>,
  'onChange' | 'onClick'
> & {
  defaultWidth: number;
  onChange?: (data: { value: string }) => void;
  onClick?: (data: { value: string }) => void;
};

const getTextInputStoryArgs = ({
  defaultWidth,
  onChange,
  onClick,
  ...textInputArgs
}: TextInputStoryArgs) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange?.({
      value: event.target.value,
    });
  };
  const handleClick = (event: MouseEvent<HTMLElement>) => {
    onClick?.({
      value: (event.target as HTMLInputElement).value,
    });
  };

  return {
    defaultWidth,
    textInputArgs: {
      ...textInputArgs,
      onChange: handleChange,
      onClick: handleClick,
    },
  };
};

export default {
  title: 'Components/TextInput',
  component: TextInput,
  tags: ['carbon'],
  parameters: {
    docs: {
      page: mdx,
    },
  },
  subcomponents: {
    TextInputSkeleton,
  },
  args: {
    className: 'input-test-class',
    id: 'text-input-1',
    placeholder: 'Placeholder text',
    invalid: false,
    invalidText: 'Error message goes here',
    disabled: false,
    labelText: 'Label text',
    helperText: 'Helper text',
    warn: false,
    warnText:
      'Warning message that is really long can wrap to more lines but should not be excessively long.',
    size: 'md',
    readOnly: false,
    inline: false,
    hideLabel: false,
    enableCounter: false,
    maxCount: 10,
    type: 'text',
    defaultWidth: 300,
    defaultValue: '',
  },
  argTypes: {
    className: {
      control: {
        type: 'text',
      },
    },
    defaultValue: {
      control: {
        type: 'text',
      },
    },
    placeholder: {
      control: {
        type: 'text',
      },
    },
    invalid: {
      control: {
        type: 'boolean',
      },
    },
    invalidText: {
      control: {
        type: 'text',
      },
    },
    disabled: {
      control: {
        type: 'boolean',
      },
    },
    labelText: {
      control: {
        type: 'text',
      },
    },
    helperText: {
      control: {
        type: 'text',
      },
    },
    warn: {
      control: {
        type: 'boolean',
      },
    },
    warnText: {
      control: {
        type: 'text',
      },
    },
    value: {
      control: {
        type: 'text',
      },
    },
    onChange: {
      action: 'onChange',
    },
    onClick: {
      action: 'onClick',
    },
    size: {
      options: ['xs', 'sm', 'md', 'lg'],
      control: {
        type: 'select',
      },
    },
    type: {
      control: {
        type: 'text',
      },
    },
    id: {
      control: { type: 'text' },
    },
    readOnly: {
      control: {
        type: 'boolean',
      },
    },
    inline: {
      control: {
        type: 'boolean',
      },
    },
    hideLabel: {
      control: {
        type: 'boolean',
      },
    },
    enableCounter: {
      control: {
        type: 'boolean',
      },
    },
    maxCount: {
      control: {
        type: 'number',
      },
    },
    light: {
      table: {
        disable: true,
      },
    },
    slug: {
      table: {
        disable: true,
      },
    },
    defaultWidth: {
      control: { type: 'range', min: 300, max: 800, step: 50 },
    },
  },
} satisfies Meta;

export const Default: StoryFn<TextInputStoryArgs> = (args) => {
  const { defaultWidth, textInputArgs } = getTextInputStoryArgs(args);

  return (
    <div style={{ width: defaultWidth }}>
      <TextInput {...textInputArgs} />
    </div>
  );
};

export const Inline: StoryFn<TextInputStoryArgs> = (args) => {
  const { defaultWidth, textInputArgs } = getTextInputStoryArgs(args);

  return (
    <div style={{ width: defaultWidth }}>
      <TextInput inline {...textInputArgs} />
    </div>
  );
};

Inline.args = {
  defaultWidth: 450,
  inline: true,
};

Inline.parameters = {
  controls: {
    exclude: ['inline'],
  },
};

export const ReadOnly: StoryFn<TextInputStoryArgs> = (args) => {
  const { defaultWidth, textInputArgs } = getTextInputStoryArgs(args);

  return (
    <div style={{ width: defaultWidth }}>
      <TextInput {...textInputArgs} />
    </div>
  );
};

ReadOnly.args = {
  defaultValue: "This is read only, you can't type more.",
  readOnly: true,
};

ReadOnly.parameters = {
  controls: {
    exclude: [
      'readOnly',
      'disabled',
      'invalid',
      'invalidText',
      'warn',
      'warnText',
      'enableCounter',
      'maxCount',
      'value',
    ],
  },
};

export const _WithLayer: StoryFn<TextInputStoryArgs> = (args) => {
  const { defaultWidth, textInputArgs } = getTextInputStoryArgs(args);

  return (
    <WithLayer>
      {(layer) => (
        <div style={{ width: defaultWidth }}>
          <TextInput {...textInputArgs} id={`text-input-${layer}`} />
        </div>
      )}
    </WithLayer>
  );
};

export const withAILabel: StoryFn<TextInputStoryArgs> = (args) => {
  const { defaultWidth, textInputArgs } = getTextInputStoryArgs(args);
  const aiLabel = (
    <AILabel className="ai-label-container">
      <AILabelContent>
        <div>
          <p className="secondary">AI Explained</p>
          <h2 className="ai-label-heading">84%</h2>
          <p className="secondary bold">Confidence score</p>
          <p className="secondary">
            Lorem ipsum dolor sit amet, di os consectetur adipiscing elit, sed
            do eiusmod tempor incididunt ut fsil labore et dolore magna aliqua.
          </p>
          <hr />
          <p className="secondary">Model type</p>
          <p className="bold">Foundation model</p>
        </div>
        <AILabelActions>
          <IconButton kind="ghost" label="View">
            <View />
          </IconButton>
          <IconButton kind="ghost" label="Open Folder">
            <FolderOpen />
          </IconButton>
          <IconButton kind="ghost" label="Folders">
            <Folders />
          </IconButton>
          <Button>View details</Button>
        </AILabelActions>
      </AILabelContent>
    </AILabel>
  );
  return (
    <div style={{ width: defaultWidth }}>
      <TextInput
        {...textInputArgs}
        type="text"
        labelText="Text input label"
        helperText="Optional help text"
        id="text-input-ai-label"
        decorator={aiLabel}
      />
    </div>
  );
};

export const Skeleton: StoryFn<
  Required<Pick<ComponentProps<typeof TextInputSkeleton>, 'hideLabel' | 'size'>>
> = ({ hideLabel, size }) => (
  <TextInputSkeleton hideLabel={hideLabel} size={size} />
);

Skeleton.parameters = {
  controls: {
    include: ['hideLabel', 'size'],
  },
};

// Hidden Test-Only Story. This story tests for a bug where the invalid-text would overlap with components below it. #19960
export const TestInvalidTextNoOverlap: StoryFn<TextInputStoryArgs> = (args) => {
  return (
    <div style={{ width: args.defaultWidth }}>
      <TextInput
        labelText="test invalid text, the invalid text should not overlap"
        invalid
        invalidText="invalid text, this should not overlap with the component below"
        id="text-input-1"
        type="text"
      />
      <TextInput labelText="test label" id="text-input-2" type="text" />
    </div>
  );
};

/*
 * This story will:
 * - Be excluded from the docs page
 * - Removed from the sidebar navigation
 * - Still be a tested variant
 */
TestInvalidTextNoOverlap.tags = ['!dev', '!autodocs'];

// Carbon sets aria-errormessage on the invalid input without a live region
// or aria-describedby for the message.
TestInvalidTextNoOverlap.parameters = {
  a11y: {
    config: { rules: [{ id: 'aria-valid-attr-value', enabled: false }] },
  },
};
