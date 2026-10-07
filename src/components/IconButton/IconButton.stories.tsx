/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, IconButton from @afframe/ui, icons from @afframe/ui/icons, source tag, inline spacing as Carbon spacing tokens. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { Edit, Notification } from '../../icons.js';
import { IconButton } from '../../index.js';
import type { IconButtonProps } from '../../index.js';
import mdx from './IconButton.mdx';

type IconButtonStoryArgs = IconButtonProps & {
  alignDeprecated?: IconButtonProps['align'];
};

const alignOptions = [
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
];

const deprecatedAlignOptions = [
  'top-left',
  'top-right',
  'bottom-left',
  'bottom-right',
  'left-bottom',
  'left-top',
  'right-bottom',
  'right-top',
];

export default {
  title: 'Components/IconButton',
  component: IconButton,
  tags: ['carbon'],
  parameters: {
    controls: {
      hideNoControlsWarning: true,
      exclude: ['children'],
    },
    docs: {
      page: mdx,
    },
    layout: 'centered',
  },
} satisfies Meta<IconButtonStoryArgs>;

export const Default: StoryFn<IconButtonStoryArgs> = (args) => {
  const { align, alignDeprecated, defaultOpen, ...rest } = args;
  const resolvedAlign = alignDeprecated || align;
  return (
    <div style={{ margin: 'var(--cds-spacing-09)' }}>
      <IconButton
        key={defaultOpen ? 'open' : 'closed'}
        {...(resolvedAlign ? { align: resolvedAlign } : {})}
        defaultOpen={defaultOpen ?? false}
        {...rest}>
        <Edit />
      </IconButton>
    </div>
  );
};

Default.args = {
  align: 'bottom',
  autoAlign: false,
  closeOnActivation: true,
  defaultOpen: true,
  disabled: false,
  dropShadow: false,
  enterDelayMs: 100,
  highContrast: true,
  isSelected: false,
  label: 'Custom label',
  kind: 'primary',
  leaveDelayMs: 100,
  size: 'lg',
};

Default.argTypes = {
  align: {
    options: alignOptions,
    control: {
      type: 'select',
    },
  },
  alignDeprecated: {
    name: 'align (deprecated)',
    options: deprecatedAlignOptions,
    control: {
      type: 'select',
    },
    table: {
      category: 'Deprecated',
    },
  },
  autoAlign: {
    control: {
      type: 'boolean',
    },
  },
  closeOnActivation: {
    control: {
      type: 'boolean',
    },
  },
  defaultOpen: {
    control: {
      type: 'boolean',
    },
  },
  disabled: {
    control: {
      type: 'boolean',
    },
  },
  dropShadow: {
    control: {
      type: 'boolean',
    },
  },
  enterDelayMs: {
    control: {
      type: 'number',
      min: 0,
    },
  },
  highContrast: {
    control: {
      type: 'boolean',
    },
  },
  isSelected: {
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
    control: {
      type: 'select',
    },
    options: ['primary', 'secondary', 'ghost', 'tertiary'],
  },
  leaveDelayMs: {
    control: {
      type: 'number',
      min: 0,
    },
  },
  size: {
    control: {
      type: 'select',
    },
    options: ['xs', 'sm', 'md', 'lg'],
  },
};

Default.parameters = {
  controls: {
    exclude: ['badgeCount', 'children'],
  },
};

export const withBadgeIndicator: StoryFn<IconButtonStoryArgs> = (args) => {
  return (
    <div style={{ margin: 'var(--cds-spacing-09)' }}>
      {/* The label comes from args (upstream also hardcodes one that args override). */}
      <IconButton autoAlign {...args} kind="ghost" size="lg">
        <Notification />
      </IconButton>
    </div>
  );
};

withBadgeIndicator.args = {
  align: 'bottom',
  autoAlign: true,
  badgeCount: 4,
  closeOnActivation: true,
  disabled: false,
  dropShadow: false,
  enterDelayMs: 100,
  highContrast: true,
  isSelected: false,
  kind: 'ghost',
  label: 'Notifications',
  leaveDelayMs: 100,
  size: 'lg',
};
withBadgeIndicator.argTypes = {
  ...Default.argTypes,
  badgeCount: {
    control: {
      type: 'number',
      min: 0,
    },
  },
  kind: {
    ...Default.argTypes.kind,
    control: false,
  },
  size: {
    ...Default.argTypes.size,
    control: false,
  },
};
withBadgeIndicator.parameters = {
  controls: {
    exclude: ['children'],
  },
};
