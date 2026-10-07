/**
 * Copyright IBM Corp. 2023, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2023, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, ComboButton and Menu parts from @afframe/ui, icons from @afframe/ui/icons, source tag, inline spacing as Carbon spacing tokens. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ArgTypes, Meta, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { ComboButton, MenuItem, MenuItemDivider } from '../../index.js';
import type { ComboButtonProps } from '../../index.js';
import { CopyFile, Export } from '../../icons.js';
import mdx from './ComboButton.mdx';

const sharedArgs: Partial<ComboButtonProps> = {
  disabled: false,
  label: 'Primary action',
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
        label="Second action with a long label description"
        onClick={action('onClick')}
      />
      <MenuItem label="Third action" onClick={action('onClick')} />
      <MenuItem label="Fourth action" disabled onClick={action('onClick')} />
      <MenuItemDivider />
      <MenuItem
        label="Danger action"
        kind="danger"
        onClick={action('onClick')}
      />
    </ComboButton>
  );
};

Default.args = sharedArgs;
Default.argTypes = sharedArgTypes;
Default.parameters = sharedParameters;

export const ExperimentalAutoAlign: StoryFn<typeof ComboButton> = (args) => (
  <div style={{ width: '5000px', height: '5000px' }}>
    <div
      style={{
        position: 'absolute',
        bottom: 'var(--cds-spacing-06)',
      }}>
      <ComboButton {...args}>
        <MenuItem label="Second action with a long label description" />
        <MenuItem label="Third action" />
        <MenuItem label="Fourth action" disabled />
      </ComboButton>
    </div>{' '}
  </div>
);

ExperimentalAutoAlign.args = sharedArgs;
ExperimentalAutoAlign.argTypes = sharedArgTypes;
ExperimentalAutoAlign.parameters = sharedParameters;

export const WithDanger: StoryFn<typeof ComboButton> = (args) => {
  return (
    <ComboButton {...args}>
      <MenuItem label="Second action with a long label description" />
      <MenuItem label="Third action" />
      <MenuItem label="Fourth action" />
      <MenuItemDivider />
      <MenuItem label="Danger action" kind="danger" />
    </ComboButton>
  );
};

WithDanger.args = sharedArgs;
WithDanger.argTypes = sharedArgTypes;
WithDanger.parameters = sharedParameters;

export const WithIcons: StoryFn<typeof ComboButton> = (args) => {
  return (
    <ComboButton {...args}>
      <MenuItem label="Save as a copy" renderIcon={CopyFile} />
      <MenuItem label="Export" renderIcon={Export} />
    </ComboButton>
  );
};

WithIcons.args = {
  ...sharedArgs,
  label: 'Save record',
};
WithIcons.argTypes = sharedArgTypes;
WithIcons.parameters = sharedParameters;
