/**
 * Copyright IBM Corp. 2022
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2022
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: aria-required-children disabled on WithPersistentSearch, argTypes typed, TypeScript, components and icons from @afframe/ui, source tag, inline spacing as Carbon spacing tokens, UsageExamples rendered with the v11 overflow menu (OverflowMenuItem children), v12 overflow menu story with a play test. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import type { ArgTypes, Meta, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Add, Apple, Close, Fish, Strawberry, Wheat } from '../../icons.js';
import {
  Button,
  ContainedList,
  ContainedListItem,
  ExpandableSearch,
  MenuItem,
  MenuItemDivider,
  OverflowMenu,
  OverflowMenuItem,
  Search,
  Tag,
} from '../../index.js';
import { WithLayer } from '../../../.storybook/templates/WithLayer/index.js';
import { withV11OverflowMenu } from '../../../.storybook/templates/withV11OverflowMenu.js';
import mdx from './ContainedList.mdx';

export default {
  title: 'Components/ContainedList',
  component: ContainedList,
  tags: ['carbon'],
  subcomponents: { ContainedListItem },
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof ContainedList>;

const sharedArgs = {
  className: '',
  isInset: false,
  kind: 'on-page' as const,
  label: 'List title',
  size: 'lg' as const,
};

const sharedArgTypes: ArgTypes = {
  className: {
    control: 'text',
  },
  isInset: {
    control: 'boolean',
  },
  kind: {
    control: 'select',
    options: ['on-page', 'disclosed'],
  },
  label: {
    control: 'text',
  },
  size: {
    control: 'select',
    options: ['sm', 'md', 'lg', 'xl'],
  },
};

const sharedParameters = {
  controls: {
    include: Object.keys(sharedArgTypes),
  },
};

const customLabelParameters = {
  controls: {
    include: Object.keys(sharedArgTypes).filter((name) => name !== 'label'),
  },
};

const DefaultStory: StoryFn<typeof ContainedList> = (args) => (
  <>
    {[...Array(4)].map((_, i) => (
      <ContainedList key={i} {...args}>
        {[...Array(8)].map((_, j) => (
          <ContainedListItem key={`${i}-${j}`}>List item</ContainedListItem>
        ))}
      </ContainedList>
    ))}
  </>
);

export const Default = DefaultStory.bind({});

Default.args = {
  ...sharedArgs,
};
Default.argTypes = sharedArgTypes;
Default.parameters = sharedParameters;

export const Disclosed: StoryFn<typeof ContainedList> = (args) => {
  return (
    <>
      <ContainedList {...args} kind="disclosed">
        <ContainedListItem>List item</ContainedListItem>
        <ContainedListItem>List item</ContainedListItem>
        <ContainedListItem>List item</ContainedListItem>
        <ContainedListItem>List item</ContainedListItem>
      </ContainedList>
      <ContainedList {...args} kind="disclosed">
        <ContainedListItem>List item</ContainedListItem>
        <ContainedListItem>List item</ContainedListItem>
        <ContainedListItem>List item</ContainedListItem>
        <ContainedListItem>List item</ContainedListItem>
      </ContainedList>
    </>
  );
};

Disclosed.args = {
  ...sharedArgs,
  kind: 'disclosed',
};
Disclosed.argTypes = {
  ...sharedArgTypes,
  kind: {
    ...sharedArgTypes.kind,
    table: { readonly: true },
  },
};
Disclosed.parameters = sharedParameters;

export const WithInteractiveItems: StoryFn<typeof ContainedList> = (args) => {
  const onClick = action('onClick (ContainedListItem)');

  return (
    <ContainedList {...args}>
      <ContainedListItem onClick={onClick}>List item</ContainedListItem>
      <ContainedListItem onClick={onClick} disabled>
        List item
      </ContainedListItem>
      <ContainedListItem onClick={onClick}>List item</ContainedListItem>
      <ContainedListItem onClick={onClick}>List item</ContainedListItem>
    </ContainedList>
  );
};

WithInteractiveItems.args = { ...sharedArgs };
WithInteractiveItems.argTypes = sharedArgTypes;
WithInteractiveItems.parameters = sharedParameters;

export const WithActions: StoryFn<typeof ContainedList> = (args) => {
  const itemAction = (
    <Button
      kind="ghost"
      iconDescription="Dismiss"
      hasIconOnly
      renderIcon={Close}
      aria-label="Dismiss"
    />
  );

  return (
    <ContainedList {...args} action={''}>
      <ContainedListItem action={itemAction}>List item</ContainedListItem>
      <ContainedListItem action={itemAction} disabled>
        List item
      </ContainedListItem>
      <ContainedListItem action={itemAction}>List item</ContainedListItem>
      <ContainedListItem action={itemAction}>List item</ContainedListItem>
    </ContainedList>
  );
};

WithActions.args = { ...sharedArgs };
WithActions.argTypes = sharedArgTypes;
WithActions.parameters = sharedParameters;

export const WithExpandableSearch: StoryFn<typeof ContainedList> = (args) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const listItems = [
      'List item 1',
      'List item 2',
      'List item 3',
      'List item 4',
    ];

    const results = listItems.filter((listItem) =>
      listItem.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  }, [searchTerm]);

  return (
    <ContainedList
      {...args}
      action={
        <ExpandableSearch
          placeholder="Filter"
          labelText="Search"
          value={searchTerm}
          onChange={handleChange}
          closeButtonLabelText="Clear search input"
          size="lg"
        />
      }>
      {searchResults.map((listItem, key) => (
        <ContainedListItem key={key}>{listItem}</ContainedListItem>
      ))}
    </ContainedList>
  );
};

WithExpandableSearch.args = { ...sharedArgs };
WithExpandableSearch.argTypes = sharedArgTypes;
WithExpandableSearch.parameters = sharedParameters;

export const WithPersistentSearch: StoryFn<typeof ContainedList> = (args) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const listItems = [
      'List item 1',
      'List item 2',
      'List item 3',
      'List item 4',
    ];

    const results = listItems.filter((listItem) =>
      listItem.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  }, [searchTerm]);

  return (
    <ContainedList {...args} action={''}>
      <Search
        placeholder="Filter"
        value={searchTerm}
        onChange={handleChange}
        closeButtonLabelText="Clear search input"
        size="lg"
        labelText="Filter search"
      />
      {searchResults.map((listItem, key) => (
        <ContainedListItem key={key}>{listItem}</ContainedListItem>
      ))}
    </ContainedList>
  );
};

WithPersistentSearch.args = { ...sharedArgs };
WithPersistentSearch.argTypes = sharedArgTypes;
WithPersistentSearch.parameters = {
  ...sharedParameters,
  a11y: {
    config: { rules: [{ id: 'aria-required-children', enabled: false }] },
  },
};

export const WithInteractiveItemsAndActions: StoryFn<typeof ContainedList> = (
  args
) => {
  const onClick = action('onClick (ContainedListItem)');
  const itemAction = (
    <Button
      kind="ghost"
      iconDescription="Dismiss"
      hasIconOnly
      renderIcon={Close}
      aria-label="Dismiss"
    />
  );

  return (
    <ContainedList {...args} action={''}>
      <ContainedListItem action={itemAction} onClick={onClick}>
        List item
      </ContainedListItem>
      <ContainedListItem action={itemAction} onClick={onClick}>
        List item
      </ContainedListItem>
      <ContainedListItem action={itemAction} onClick={onClick}>
        List item
      </ContainedListItem>
      <ContainedListItem action={itemAction} onClick={onClick}>
        List item
      </ContainedListItem>
    </ContainedList>
  );
};

WithInteractiveItemsAndActions.args = { ...sharedArgs };
WithInteractiveItemsAndActions.argTypes = sharedArgTypes;
WithInteractiveItemsAndActions.parameters = sharedParameters;

export const WithListTitleDecorators: StoryFn<typeof ContainedList> = (
  args
) => {
  return (
    <ContainedList
      {...args}
      label={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <span>List title</span>
          <Tag size="sm" role="status" aria-label="4 items in list">
            4
          </Tag>
        </div>
      }>
      <ContainedListItem>List item</ContainedListItem>
      <ContainedListItem>List item</ContainedListItem>
      <ContainedListItem>List item</ContainedListItem>
      <ContainedListItem>List item</ContainedListItem>
    </ContainedList>
  );
};

WithListTitleDecorators.args = { ...sharedArgs };
WithListTitleDecorators.argTypes = sharedArgTypes;
WithListTitleDecorators.parameters = customLabelParameters;

export const WithIcons: StoryFn<typeof ContainedList> = (args) => {
  return (
    <ContainedList {...args}>
      <ContainedListItem renderIcon={Apple}>List item</ContainedListItem>
      <ContainedListItem renderIcon={Wheat}>List item</ContainedListItem>
      <ContainedListItem renderIcon={Strawberry}>List item</ContainedListItem>
      <ContainedListItem renderIcon={Fish}>List item</ContainedListItem>
    </ContainedList>
  );
};

WithIcons.args = { ...sharedArgs };
WithIcons.argTypes = sharedArgTypes;
WithIcons.parameters = sharedParameters;

export const _WithLayer: StoryFn<typeof ContainedList> = (args) => {
  return (
    <WithLayer>
      <ContainedList {...args}>
        <ContainedListItem>List item</ContainedListItem>
        <ContainedListItem>List item</ContainedListItem>
      </ContainedList>
    </WithLayer>
  );
};

_WithLayer.args = { ...sharedArgs };
_WithLayer.argTypes = sharedArgTypes;
_WithLayer.parameters = sharedParameters;

export const UsageExamples: StoryFn<typeof ContainedList> = (args) => {
  const prefix = 'cds';

  return (
    <>
      <ContainedList
        {...args}
        action={
          <Button
            hasIconOnly
            iconDescription="Add"
            renderIcon={Add}
            tooltipPosition="left"
          />
        }>
        {[...Array(3)].map((_, i) => (
          <ContainedListItem
            key={i}
            action={
              <OverflowMenu flipped size="lg" ariaLabel="List item options">
                <OverflowMenuItem itemText="View details" />
                <OverflowMenuItem itemText="Edit" />
                <OverflowMenuItem itemText="Remove" isDelete hasDivider />
              </OverflowMenu>
            }>
            List item
          </ContainedListItem>
        ))}
      </ContainedList>
      <ContainedList
        {...args}
        action={
          <Button
            hasIconOnly
            iconDescription="Add"
            renderIcon={Add}
            tooltipPosition="left"
            kind="ghost"
          />
        }>
        {[...Array(3)].map((_, i) => (
          <ContainedListItem key={i}>
            List item
            <br />
            <span className={`${prefix}--label ${prefix}--label--no-margin`}>
              Description text
            </span>
          </ContainedListItem>
        ))}
      </ContainedList>
      <ContainedList {...args}>
        {[...Array(3)].map((_, i) => (
          <ContainedListItem key={i}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                columnGap: 'var(--cds-spacing-05)',
              }}>
              <span>List item</span>
              <span>List item details</span>
              <span>List item details</span>
            </div>
          </ContainedListItem>
        ))}
      </ContainedList>
    </>
  );
};

UsageExamples.args = { ...sharedArgs };
UsageExamples.argTypes = sharedArgTypes;
UsageExamples.parameters = sharedParameters;
UsageExamples.decorators = [withV11OverflowMenu];

// `OverflowMenu` types omit `label`, which the v12 overflow menu reads for its
// accessible name, so it is passed through a spread.
const overflowMenuLabel = { label: 'List item options' };

/**
 * Overflow menus under the v12 flags: `MenuItem` children and a `label` on
 * `OverflowMenu` instead of `OverflowMenuItem`.
 */
export const UsageExamplesWithMenuItems: StoryFn<typeof ContainedList> = (
  args
) => (
  <ContainedList
    {...args}
    action={
      <Button
        hasIconOnly
        iconDescription="Add"
        renderIcon={Add}
        tooltipPosition="left"
      />
    }>
    {[...Array(3)].map((_, i) => (
      <ContainedListItem
        key={i}
        action={
          <OverflowMenu {...overflowMenuLabel}>
            <MenuItem label="View details" />
            <MenuItem label="Edit" />
            <MenuItemDivider />
            <MenuItem label="Remove" kind="danger" />
          </OverflowMenu>
        }>
        List item
      </ContainedListItem>
    ))}
  </ContainedList>
);

UsageExamplesWithMenuItems.args = { ...sharedArgs };
UsageExamplesWithMenuItems.argTypes = sharedArgTypes;
UsageExamplesWithMenuItems.parameters = sharedParameters;

// The v12 menu opens on Enter and moves focus to its first item.
UsageExamplesWithMenuItems.play = async ({ canvasElement }) => {
  const [firstItem] = within(canvasElement).getAllByRole('listitem');
  within(firstItem as HTMLElement)
    .getByRole('button')
    .focus();
  await userEvent.keyboard('{Enter}');
  const body = within(canvasElement.ownerDocument.body);
  await body.findByRole('menu', { name: 'List item options' });
  await waitFor(() =>
    expect(body.getByRole('menuitem', { name: 'View details' })).toHaveFocus()
  );
  await userEvent.keyboard('{ArrowDown}');
  await expect(body.getByRole('menuitem', { name: 'Edit' })).toHaveFocus();
  await userEvent.keyboard('{Escape}');
};
