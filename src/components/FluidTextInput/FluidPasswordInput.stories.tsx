/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and icons from @afframe/ui, source tag, plain CSS story styles; typed args. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import {
  FluidPasswordInput,
  type FluidPasswordInputProps,
} from '../../index.js';
import './test.css';
import mdx from './FluidPasswordInput.mdx';

export default {
  title: 'Components/Fluid Components/FluidPasswordInput',
  tags: ['carbon'],
  component: FluidPasswordInput,
  parameters: {
    docs: {
      page: mdx,
    },
    controls: {
      exclude: ['isPassword'],
    },
  },
} satisfies Meta<typeof FluidPasswordInput>;

export const Default: StoryFn<
  FluidPasswordInputProps & { defaultWidth?: number }
> = (args) => {
  const { defaultWidth, ...passwordInputArgs } = args;
  return (
    <div style={{ width: defaultWidth }}>
      <FluidPasswordInput {...passwordInputArgs} />
    </div>
  );
};

Default.args = {
  className: '',
  defaultWidth: 300,
  disabled: false,
  id: 'input-1',
  invalid: false,
  invalidText:
    'Error message that is really long can wrap to more lines but should not be excessively long.',
  labelText: 'Label',
  placeholder: 'Placeholder text',
  readOnly: false,
  showPasswordLabel: 'Show password',
  hidePasswordLabel: 'Hide password',
  warn: false,
  warnText:
    'Warning message that is really long can wrap to more lines but should not be excessively long.',
};

Default.argTypes = {
  defaultWidth: {
    control: { type: 'range', min: 300, max: 800, step: 50 },
  },
  className: {
    control: {
      type: 'text',
    },
  },
  showPasswordLabel: {
    control: 'text',
    description: '"Show password" tooltip text on password visibility toggle',
  },
  hidePasswordLabel: {
    control: 'text',
    description: '"Hide password" tooltip text on password visibility toggle',
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
  id: {
    control: 'text',
  },
  onChange: {
    action: 'onChange',
  },
  onClick: {
    action: 'onClick',
  },
  onTogglePasswordVisibility: {
    action: 'onTogglePasswordVisibility',
    description:
      'Callback function that is called whenever the toggle password visibility button is clicked `(evt) => void`',
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
  readOnly: {
    control: 'boolean',
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
};
