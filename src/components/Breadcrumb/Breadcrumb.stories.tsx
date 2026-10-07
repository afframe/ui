/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, source tag, OverflowMenu stories rendered with the v11 overflow menu (OverflowMenuItem children), v12 overflow menu story with a play test. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ArgTypes, Meta, StoryFn } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbSkeleton,
  MenuItem,
  OverflowMenu,
  OverflowMenuItem,
} from '../../index.js';
import { withV11OverflowMenu } from '../../../.storybook/templates/withV11OverflowMenu.js';
import mdx from './Breadcrumb.mdx';

export default {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  subcomponents: {
    BreadcrumbItem,
    BreadcrumbSkeleton,
  },
  tags: ['carbon'],
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof Breadcrumb>;

const sharedArgs = {
  noTrailingSlash: false,
  'aria-label': 'Breadcrumb container',
  size: 'md' as const,
};

const sharedArgTypes = {
  className: {
    control: false,
  },
  children: {
    control: false,
  },
  size: {
    control: { type: 'select' },
    options: ['sm', 'md'],
  },
  noTrailingSlash: {
    control: { type: 'boolean' },
    description: 'Removes the trailing slash from the breadcrumb',
  },
  'aria-label': {
    control: { type: 'text' },
    description: 'Specifies the label for the breadcrumb container',
  },
} satisfies ArgTypes;

export const Default: StoryFn<typeof Breadcrumb> = (args) => (
  <Breadcrumb {...args}>
    <BreadcrumbItem>
      <a href="/#">Breadcrumb 1</a>
    </BreadcrumbItem>
    <BreadcrumbItem href="#">Breadcrumb 2</BreadcrumbItem>
    <BreadcrumbItem href="#">Breadcrumb 3</BreadcrumbItem>
    <BreadcrumbItem href="#">Breadcrumb 4</BreadcrumbItem>
  </Breadcrumb>
);

Default.args = { ...sharedArgs };

Default.argTypes = {
  ...sharedArgTypes,
};

export const BreadcrumbWithOverflowMenu: StoryFn<typeof Breadcrumb> = (
  args
) => (
  <Breadcrumb {...args} noTrailingSlash>
    <BreadcrumbItem>
      <a href="/#">Breadcrumb 1</a>
    </BreadcrumbItem>
    <BreadcrumbItem href="#">Breadcrumb 2</BreadcrumbItem>
    <BreadcrumbItem data-floating-menu-container>
      <OverflowMenu align="bottom" aria-label="Overflow menu in a breadcrumb">
        <OverflowMenuItem itemText="Breadcrumb 3" />
        <OverflowMenuItem itemText="Breadcrumb 4" />
      </OverflowMenu>
    </BreadcrumbItem>
    <BreadcrumbItem href="#">Breadcrumb 5</BreadcrumbItem>
    <BreadcrumbItem isCurrentPage>Breadcrumb 6</BreadcrumbItem>
  </Breadcrumb>
);

BreadcrumbWithOverflowMenu.args = { ...sharedArgs };

BreadcrumbWithOverflowMenu.argTypes = {
  ...sharedArgTypes,
};

BreadcrumbWithOverflowMenu.decorators = [withV11OverflowMenu];

// `OverflowMenu` types omit `label`, which the v12 overflow menu reads for its
// accessible name, so it is passed through a spread.
const overflowMenuLabel = { label: 'Overflow menu in a breadcrumb' };

/**
 * Overflow menu under the v12 flags: `MenuItem` children and a `label` on
 * `OverflowMenu` instead of `OverflowMenuItem`.
 */
export const BreadcrumbWithMenuItems: StoryFn<typeof Breadcrumb> = (args) => (
  <Breadcrumb {...args} noTrailingSlash>
    <BreadcrumbItem>
      <a href="/#">Breadcrumb 1</a>
    </BreadcrumbItem>
    <BreadcrumbItem href="#">Breadcrumb 2</BreadcrumbItem>
    <BreadcrumbItem data-floating-menu-container>
      <OverflowMenu {...overflowMenuLabel}>
        <MenuItem label="Breadcrumb 3" />
        <MenuItem label="Breadcrumb 4" />
      </OverflowMenu>
    </BreadcrumbItem>
    <BreadcrumbItem href="#">Breadcrumb 5</BreadcrumbItem>
    <BreadcrumbItem isCurrentPage>Breadcrumb 6</BreadcrumbItem>
  </Breadcrumb>
);

BreadcrumbWithMenuItems.args = { ...sharedArgs };

BreadcrumbWithMenuItems.argTypes = {
  ...sharedArgTypes,
};

// The v12 menu opens on Enter and moves focus to its first item.
BreadcrumbWithMenuItems.play = async ({ canvasElement }) => {
  within(canvasElement).getByRole('button').focus();
  await userEvent.keyboard('{Enter}');
  const body = within(canvasElement.ownerDocument.body);
  await body.findByRole('menu', { name: 'Overflow menu in a breadcrumb' });
  await waitFor(() =>
    expect(body.getByRole('menuitem', { name: 'Breadcrumb 3' })).toHaveFocus()
  );
  await userEvent.keyboard('{ArrowDown}');
  await expect(
    body.getByRole('menuitem', { name: 'Breadcrumb 4' })
  ).toHaveFocus();
  await userEvent.keyboard('{Escape}');
};

export const BreadcrumbWithOverflowMenuSizeSmall: StoryFn<typeof Breadcrumb> = (
  args
) => (
  <Breadcrumb {...args} noTrailingSlash>
    <BreadcrumbItem>
      <a href="/#">Breadcrumb 1</a>
    </BreadcrumbItem>
    <BreadcrumbItem href="#">Breadcrumb 2</BreadcrumbItem>
    <BreadcrumbItem data-floating-menu-container>
      <OverflowMenu align="bottom" aria-label="Overflow menu in a breadcrumb">
        <OverflowMenuItem itemText="Breadcrumb 3" />
        <OverflowMenuItem itemText="Breadcrumb 4" />
      </OverflowMenu>
    </BreadcrumbItem>
    <BreadcrumbItem href="#">Breadcrumb 5</BreadcrumbItem>
    <BreadcrumbItem isCurrentPage>Breadcrumb 6</BreadcrumbItem>
  </Breadcrumb>
);

BreadcrumbWithOverflowMenuSizeSmall.argTypes = {
  ...sharedArgTypes,
};

BreadcrumbWithOverflowMenuSizeSmall.decorators = [withV11OverflowMenu];

/*
 * This story will:
 * - Be excluded from the docs page
 * - Removed from the sidebar navigation
 * - Still be a tested variant
 */
BreadcrumbWithOverflowMenuSizeSmall.tags = ['!dev', '!autodocs'];

BreadcrumbWithOverflowMenuSizeSmall.args = {
  size: 'sm',
};

export const Skeleton: StoryFn<typeof BreadcrumbSkeleton> = (args) => {
  return <BreadcrumbSkeleton {...args} />;
};

Skeleton.args = {
  items: 3,
};

Skeleton.parameters = {
  controls: { exclude: ['aria-label'] },
};

Skeleton.argTypes = {
  ...sharedArgTypes,
  items: {
    description: 'Specify the number of items',
    table: {
      defaultValue: { summary: '3' },
    },
  },
};

export const BreadcrumbWithOverflowVisualSnapshots: StoryFn<
  typeof Breadcrumb
> = (args) => (
  <Breadcrumb {...args} noTrailingSlash>
    <BreadcrumbItem>
      <a href="/#">Breadcrumb 1</a>
    </BreadcrumbItem>
    <BreadcrumbItem href="#">Breadcrumb 2</BreadcrumbItem>
    <BreadcrumbItem data-floating-menu-container>
      <OverflowMenu align="bottom" aria-label="Overflow menu in a breadcrumb">
        <OverflowMenuItem itemText="Breadcrumb 3" />
        <OverflowMenuItem itemText="Breadcrumb 4" />
      </OverflowMenu>
    </BreadcrumbItem>
    <BreadcrumbItem href="#">Breadcrumb 5</BreadcrumbItem>
    <BreadcrumbItem isCurrentPage>Breadcrumb 6</BreadcrumbItem>
  </Breadcrumb>
);

BreadcrumbWithOverflowVisualSnapshots.argTypes = {
  ...sharedArgTypes,
};

BreadcrumbWithOverflowVisualSnapshots.decorators = [withV11OverflowMenu];

BreadcrumbWithOverflowVisualSnapshots.play = async ({ canvas, userEvent }) => {
  await userEvent.click(canvas.getByRole('button'));
};

BreadcrumbWithOverflowVisualSnapshots.tags = ['!dev', '!autodocs'];
