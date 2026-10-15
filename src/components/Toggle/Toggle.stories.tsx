/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2023
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, unused Skeleton args dropped, source tag, inline spacing as Carbon spacing tokens, label and toggled controls, SmallToggle renamed Small and built from Default's args, Disabled and ReadOnly stories, Afframe example data. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { useArgs } from 'storybook/preview-api';
import { Toggle, ToggleSkeleton, VStack } from '../../index.js';
import type { ToggleProps } from '../../index.js';
import mdx from './Toggle.mdx';

export default {
  title: 'Components/Toggle',
  component: Toggle,
  tags: ['carbon'],
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof Toggle>;

export const Default: StoryFn<Partial<ToggleProps>> = (args) => {
  const [, updateArgs] = useArgs();
  return (
    <Toggle
      id="toggle-3"
      {...args}
      onToggle={(toggled) => {
        updateArgs({ toggled });
        args.onToggle?.(toggled);
      }}
    />
  );
};

Default.args = {
  labelText: 'Send reminders',
  labelA: 'Off',
  labelB: 'On',
  toggled: true,
};

Default.argTypes = {
  className: {
    control: false,
  },
  defaultToggled: {
    control: false,
  },
  disabled: {
    control: {
      type: 'boolean',
    },
  },
  hideLabel: {
    control: {
      type: 'boolean',
    },
  },
  id: {
    control: false,
  },
  labelA: {
    control: {
      type: 'text',
    },
  },
  labelB: {
    control: {
      type: 'text',
    },
  },
  labelText: {
    control: {
      type: 'text',
    },
  },
  onClick: {
    control: false,
  },
  onToggle: {
    control: false,
  },
  readOnly: {
    control: {
      type: 'boolean',
    },
  },
  size: {
    options: ['sm', 'md'],
    control: { type: 'select' },
  },
  toggled: {
    control: {
      type: 'boolean',
    },
  },
};

export const Small = Default.bind({});
Small.args = { ...Default.args, id: 'toggle-2', size: 'sm' };
Small.argTypes = Default.argTypes;

export const Disabled = Default.bind({});
Disabled.args = { ...Default.args, disabled: true };
Disabled.argTypes = Default.argTypes;

export const ReadOnly = Default.bind({});
ReadOnly.args = { ...Default.args, readOnly: true };
ReadOnly.argTypes = Default.argTypes;

export const WithAccessibleLabels: StoryFn = () => {
  return (
    <VStack gap={7}>
      <Toggle id="toggle-4" labelText="Send reminders" />

      <Toggle id="toggle-5" labelText="Send reminders" hideLabel />

      <div>
        <div
          id="toggle-6-label"
          style={{ marginBlockEnd: 'var(--cds-spacing-03)' }}>
          Send reminders (labelled by a div)
        </div>
        <Toggle aria-labelledby="toggle-6-label" id="toggle-6" />
      </div>

      <div>
        <label
          id="toggle-7-label"
          htmlFor="toggle-7"
          style={{ display: 'block', marginBlockEnd: 'var(--cds-spacing-03)' }}>
          Send reminders (labelled by a label)
        </label>
        <Toggle aria-labelledby="toggle-7-label" id="toggle-7" />
      </div>
    </VStack>
  );
};

export const Skeleton: StoryFn<typeof ToggleSkeleton> = (args) => {
  return (
    <div>
      <ToggleSkeleton {...args} />
    </div>
  );
};

Skeleton.parameters = {
  controls: { include: ['className'] },
};
