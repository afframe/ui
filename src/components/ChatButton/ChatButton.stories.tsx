/**
 * Copyright IBM Corp. 2022, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2022, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui (preview__ChatButton), icons from @afframe/ui icons, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ArgTypes, Meta, StoryFn } from '@storybook/react-vite';
import { Add } from '../../icons.js';
import {
  preview__ChatButton as ChatButton,
  preview__ChatButtonSkeleton as ChatButtonSkeleton,
} from '../../index.js';
import type { ChatButtonProps } from '../../index.js';

type ChatButtonStoryArgs = Omit<ChatButtonProps, 'renderIcon'> & {
  renderIcon?: string;
};

const icons: Record<string, typeof Add> = {
  Add,
};

// Only passes renderIcon when an icon is chosen (exactOptionalPropertyTypes).
const iconProps = (renderIcon?: string) => {
  const icon = renderIcon ? icons[renderIcon] : undefined;
  return icon ? { renderIcon: icon } : {};
};

const sizeArgType = {
  options: ['sm', 'md', 'lg'],
  control: { type: 'select' as const },
};

// `isQuickAction` sets `kind="ghost"` and `size="sm"`
const hideWhenQuickAction = { if: { arg: 'isQuickAction', truthy: false } };

const chatButtonArgTypes: Partial<ArgTypes<ChatButtonStoryArgs>> = {
  children: {
    control: { type: 'text' },
  },
  className: {
    control: { type: 'text' },
  },
  disabled: {
    control: { type: 'boolean' },
  },
  isQuickAction: {
    control: { type: 'boolean' },
  },
  isSelected: {
    control: { type: 'boolean' },
  },
  kind: {
    options: ['primary', 'secondary', 'tertiary', 'ghost', 'danger'],
    control: { type: 'select' },
    ...hideWhenQuickAction,
  },
  onClick: {
    action: 'onClick',
  },
  renderIcon: {
    options: ['Add', 'None'],
    control: { type: 'select' },
  },
  size: { ...sizeArgType, ...hideWhenQuickAction },
};

export default {
  title: 'Preview/preview__ChatButton',
  component: ChatButton,
  subcomponents: { ChatButtonSkeleton },
  tags: ['carbon'],
} satisfies Meta<typeof ChatButton>;

export const Default: StoryFn<ChatButtonStoryArgs> = (args) => {
  const { renderIcon, ...rest } = args;
  return <ChatButton {...rest} {...iconProps(renderIcon)} />;
};

Default.args = {
  children: 'Ask AI',
  className: '',
  disabled: false,
  isQuickAction: false,
  isSelected: false,
  kind: 'primary',
  renderIcon: 'Add',
  size: 'lg',
};

Default.argTypes = chatButtonArgTypes;

Default.parameters = {
  controls: {
    include: Object.keys(chatButtonArgTypes),
  },
};

export const Skeleton: StoryFn<typeof ChatButtonSkeleton> = (args) => (
  <ChatButtonSkeleton {...args} />
);

Skeleton.args = {
  size: 'lg',
};

Skeleton.argTypes = {
  size: sizeArgType,
};

Skeleton.parameters = {
  controls: {
    include: ['size'],
  },
};
