/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and icons from @afframe/ui, the WithFeatureFlags decorator removed (enable-v12-release turns enable-v12-dynamic-floating-styles on globally), source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ArgTypes, Meta, StoryFn } from '@storybook/react-vite';
import { Information } from '../../icons.js';
import {
  Button,
  Link,
  ToggletipLabel,
  Toggletip,
  ToggletipButton,
  ToggletipContent,
  ToggletipActions,
} from '../../index.js';
import type { ToggletipProps } from '../../index.js';

type ToggletipStoryArgs = {
  align: ToggletipProps<'span'>['align'];
  bodyText: string;
  buttonLabel: string;
  buttonText: string;
  defaultOpen: boolean;
  labelText: string;
  linkText: string;
};

const args: ToggletipStoryArgs = {
  align: 'bottom',
  bodyText:
    'Scroll the container up, down, left or right to observe how the Toggletip will automatically change its position in attempt to stay within the viewport. This works on initial render in addition to on scroll.',
  buttonLabel: 'Show information',
  buttonText: 'Button',
  defaultOpen: true,
  labelText: 'Toggletip label',
  linkText: 'Link action',
};

export default {
  title: 'Components/Toggletip/Feature Flag',
  component: Toggletip,
  tags: ['carbon', '!autodocs'],
} satisfies Meta<typeof Toggletip>;

export const FloatingStyles: StoryFn<ToggletipStoryArgs> = (args) => {
  const {
    align,
    bodyText,
    buttonLabel,
    buttonText,
    defaultOpen,
    labelText,
    linkText,
  } = args;

  return (
    <div>
      <ToggletipLabel>{labelText}</ToggletipLabel>
      <Toggletip
        key={defaultOpen ? 'open' : 'closed'}
        {...(align !== undefined ? { align } : {})}
        defaultOpen={defaultOpen}>
        <ToggletipButton label={buttonLabel}>
          <Information />
        </ToggletipButton>
        <ToggletipContent>
          <p>{bodyText}</p>
          <ToggletipActions>
            <Link href="#">{linkText}</Link>
            <Button size="sm">{buttonText}</Button>
          </ToggletipActions>
        </ToggletipContent>
      </Toggletip>
    </div>
  );
};

FloatingStyles.args = args;

const floatingStylesArgTypes: Partial<ArgTypes<ToggletipStoryArgs>> = {
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
  bodyText: {
    control: 'text',
    table: {
      category: 'ToggletipContent',
    },
  },
  buttonLabel: {
    control: 'text',
    table: {
      category: 'ToggletipButton',
    },
  },
  buttonText: {
    control: 'text',
    table: {
      category: 'ToggletipActions',
    },
  },
  defaultOpen: {
    control: 'boolean',
  },
  labelText: {
    control: 'text',
    table: {
      category: 'ToggletipLabel',
    },
  },
  linkText: {
    control: 'text',
    table: {
      category: 'ToggletipActions',
    },
  },
};

FloatingStyles.argTypes = floatingStylesArgTypes;

FloatingStyles.parameters = {
  controls: {
    include: Object.keys(floatingStylesArgTypes),
  },
};
