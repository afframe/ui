/**
 * Copyright IBM Corp. 2023, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2023, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, ComboButton and Menu parts from @afframe/ui, icons from @afframe/ui/icons, source tag, inline spacing as Carbon spacing tokens, story names per ADR 0019, example labels from the Afframe glossary, Disabled story. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ArgTypes, Meta, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { ComboButton, MenuItem, MenuItemDivider } from '../../index.js';
import type { ComboButtonProps } from '../../index.js';
import { CopyFile, Export } from '../../icons.js';
import mdx from './ComboButton.mdx';

const sharedArgs: Partial<ComboButtonProps> = {
  disabled: false,
  label: 'Send invoice',
  menuAlignment: 'bottom',
  size: 'lg',
  tooltipAlignment: 'top',
};

const sharedArgTypes: Partial<ArgTypes<ComboButtonProps>> = {
  disabled: {
    control: 'boolean',
  },
  label: {
    control: 'text',
  },
  menuAlignment: {
    control: 'select',
    options: [
      'top',
      'top-start',
      'top-end',
      'bottom',
      'bottom-start',
      'bottom-end',
    ],
  },
  onClick: {
    action: 'onClick',
  },
  size: {
    control: 'radio',
    options: ['xs', 'sm', 'md', 'lg'],
  },
  tooltipAlignment: {
    control: 'select',
    options: [
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
    ],
  },
};

const sharedParameters = {
  controls: {
    include: Object.keys(sharedArgTypes),
  },
};

export default {
  title: 'Components/ComboButton',
  tags: ['carbon'],
  component: ComboButton,
  subcomponents: {
    MenuItem,
    MenuItemDivider,
  },
  decorators: [
    (Story) => (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      page: mdx,
    },
    layout: 'centered',
  },
} satisfies Meta<typeof ComboButton>;

export const Default: StoryFn<typeof ComboButton> = (args) => {
  return (
    <ComboButton {...args}>
      <MenuItem
        label="Send reminder with payment details and a QR code"
        onClick={action('onClick')}
      />
      <MenuItem label="Download PDF" onClick={action('onClick')} />
      <MenuItem label="Duplicate" disabled onClick={action('onClick')} />
      <MenuItemDivider />
      <MenuItem
        label="Delete invoice"
        kind="danger"
        onClick={action('onClick')}
      />
    </ComboButton>
  );
};

Default.args = sharedArgs;
Default.argTypes = sharedArgTypes;
Default.parameters = sharedParameters;

export const AutoAlign: StoryFn<typeof ComboButton> = (args) => (
  <div style={{ width: '5000px', height: '5000px' }}>
    <div
      style={{
        position: 'absolute',
        bottom: 'var(--cds-spacing-06)',
      }}>
      <ComboButton {...args}>
        <MenuItem label="Send reminder with payment details and a QR code" />
        <MenuItem label="Download PDF" />
        <MenuItem label="Duplicate" disabled />
      </ComboButton>
    </div>{' '}
  </div>
);

AutoAlign.args = sharedArgs;
AutoAlign.argTypes = sharedArgTypes;
AutoAlign.parameters = sharedParameters;

export const WithDanger: StoryFn<typeof ComboButton> = (args) => {
  return (
    <ComboButton {...args}>
      <MenuItem label="Send reminder" />
      <MenuItem label="Download PDF" />
      <MenuItem label="Duplicate" />
      <MenuItemDivider />
      <MenuItem label="Delete invoice" kind="danger" />
    </ComboButton>
  );
};

WithDanger.args = sharedArgs;
WithDanger.argTypes = sharedArgTypes;
WithDanger.parameters = sharedParameters;

export const WithIcons: StoryFn<typeof ComboButton> = (args) => {
  return (
    <ComboButton {...args}>
      <MenuItem label="Duplicate" renderIcon={CopyFile} />
      <MenuItem label="Download PDF" renderIcon={Export} />
    </ComboButton>
  );
};

WithIcons.args = {
  ...sharedArgs,
};
WithIcons.argTypes = sharedArgTypes;
WithIcons.parameters = sharedParameters;

export const Disabled: StoryFn<typeof ComboButton> = Default.bind({});
Disabled.args = { ...sharedArgs, disabled: true };
Disabled.argTypes = sharedArgTypes;
Disabled.parameters = sharedParameters;
