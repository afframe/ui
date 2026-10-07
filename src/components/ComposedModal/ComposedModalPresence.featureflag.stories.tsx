/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, the inner FeatureFlags wrapper, feature flag annotation and ClassPrefix wrapper removed (Afframe turns the flags on globally and its styles compile them), story stylesheet dropped, source tag, `size: null` arg dropped (no size is the default), ModalFooter gets children={null} (its type requires children), inline spacing as Carbon spacing tokens. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useRef, useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import {
  Button,
  ComposedModal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  TextInput,
} from '../../index.js';
import type {
  ComposedModalProps,
  ModalFooterProps,
  ModalHeaderProps,
} from '../../index.js';

// Header and footer controls; the meta args give each one a value.
interface ComposedModalStoryControls {
  label: NonNullable<ModalHeaderProps['label']>;
  title: ModalHeaderProps['title'];
  iconDescription?: ModalHeaderProps['iconDescription'];
  primaryButtonText: NonNullable<ModalFooterProps['primaryButtonText']>;
  secondaryButtonText: NonNullable<ModalFooterProps['secondaryButtonText']>;
}

type ComposedModalStoryArgs = Omit<
  Partial<ComposedModalProps>,
  keyof ComposedModalStoryControls
> &
  ComposedModalStoryControls;

export default {
  title: 'Components/ComposedModal/Feature Flags',
  component: ComposedModal,
  tags: ['carbon', '!autodocs'],
  subcomponents: {
    ModalHeader,
    ModalBody,
    ModalFooter,
  },
  parameters: {
    controls: {
      exclude: [
        'containerClassName',
        'launcherButtonRef',
        'selectorPrimaryFocus',
        'selectorsFloatingMenus',
      ],
    },
  },
  argTypes: {
    danger: { control: 'boolean' },
    isFullWidth: { control: 'boolean' },
    size: { control: 'radio', options: ['xs', 'sm', 'md', 'lg'] },
    preventCloseOnClickOutside: { control: 'boolean' },
    'aria-label': { control: 'text' },
    label: { control: 'text' },
    title: { control: 'text' },
    primaryButtonText: { control: 'text' },
    secondaryButtonText: { control: 'text' },
    onClose: { action: 'onClose' },
    onKeyDown: { action: 'onKeyDown' },
  },
  args: {
    danger: false,
    isFullWidth: false,
    preventCloseOnClickOutside: false,
    'aria-label': 'Modal content',
    label: 'Account resources',
    title: 'Add a custom domain',
    primaryButtonText: 'Add',
    secondaryButtonText: 'Cancel',
  },
} satisfies Meta;

export const EnablePresence: StoryFn<ComposedModalStoryArgs> = (args) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(true);
  const {
    iconDescription,
    label = 'Account resources',
    title = 'Add a custom domain',
    primaryButtonText = 'Add',
    secondaryButtonText = 'Cancel',
    ...modalArgs
  } = args;
  return (
    <>
      <Button ref={buttonRef} onClick={() => setOpen(true)}>
        Launch composed modal
      </Button>
      <ComposedModal
        {...modalArgs}
        open={open}
        launcherButtonRef={buttonRef}
        onClose={() => setOpen(false)}>
        <ModalHeader
          label={label}
          title={title}
          {...(iconDescription ? { iconDescription } : {})}
        />
        <ModalBody>
          <p style={{ marginBottom: 'var(--cds-spacing-05)' }}>
            Custom domains direct requests for your apps in this Cloud Foundry
            organization to a URL that you own. A custom domain can be a shared
            domain, a shared subdomain, or a shared domain and host.
          </p>
          <TextInput
            data-modal-primary-focus
            id="text-input-1"
            labelText="Domain name"
            placeholder="e.g. github.com"
            style={{ marginBottom: 'var(--cds-spacing-05)' }}
          />
          <Select id="select-1" defaultValue="us-south" labelText="Region">
            <SelectItem value="us-south" text="US South" />
            <SelectItem value="us-east" text="US East" />
          </Select>
        </ModalBody>
        <ModalFooter
          primaryButtonText={primaryButtonText}
          secondaryButtonText={secondaryButtonText}
          children={null}
        />
      </ComposedModal>
    </>
  );
};
EnablePresence.storyName = 'enable-presence';
