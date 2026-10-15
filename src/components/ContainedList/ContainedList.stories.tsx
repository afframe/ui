/**
 * Copyright IBM Corp. 2022
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2022
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: aria-required-children disabled on WithPersistentSearch, argTypes typed, TypeScript, components and icons from @afframe/ui, source tag, inline spacing as Carbon spacing tokens, story names unified, items are example customers. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import type { ArgTypes, Meta, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { Add, Apple, Close, Fish, Strawberry, Wheat } from '../../icons.js';
import {
  Button,
  ContainedList,
  ContainedListItem,
  ExpandableSearch,
  OverflowMenu,
  OverflowMenuItem,
  Search,
  Tag,
} from '../../index.js';
import { WithLayer as WithLayerTemplate } from '../../../.storybook/templates/WithLayer/index.js';
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

const customers = [
  'Lakeside Furniture',
  'Acme Trading',
  'Birch Studio',
  'Cedar Logistics',
  'Delta Foods',
];

const customerDetails = [
  { name: 'Lakeside Furniture', invoices: '2 open invoices', terms: 'Net 30' },
  { name: 'Acme Trading', invoices: '1 open invoice', terms: 'Net 14' },
  {
    name: 'Birch Studio',
    invoices: 'No open invoices',
    terms: 'Due on receipt',
  },
];

const sharedArgs = {
  className: '',
  isInset: false,
  kind: 'on-page' as const,
  label: 'Customers',
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
        {customers.map((customer) => (
          <ContainedListItem key={`${i}-${customer}`}>
            {customer}
          </ContainedListItem>
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
        <ContainedListItem>Lakeside Furniture</ContainedListItem>
        <ContainedListItem>Acme Trading</ContainedListItem>
        <ContainedListItem>Birch Studio</ContainedListItem>
        <ContainedListItem>Cedar Logistics</ContainedListItem>
      </ContainedList>
      <ContainedList {...args} kind="disclosed">
        <ContainedListItem>Lakeside Furniture</ContainedListItem>
        <ContainedListItem>Acme Trading</ContainedListItem>
        <ContainedListItem>Birch Studio</ContainedListItem>
        <ContainedListItem>Cedar Logistics</ContainedListItem>
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
      <ContainedListItem onClick={onClick}>
        Lakeside Furniture
      </ContainedListItem>
      <ContainedListItem onClick={onClick} disabled>
        Acme Trading
      </ContainedListItem>
      <ContainedListItem onClick={onClick}>Birch Studio</ContainedListItem>
      <ContainedListItem onClick={onClick}>Cedar Logistics</ContainedListItem>
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
      <ContainedListItem action={itemAction}>
        Lakeside Furniture
      </ContainedListItem>
      <ContainedListItem action={itemAction} disabled>
        Acme Trading
      </ContainedListItem>
      <ContainedListItem action={itemAction}>Birch Studio</ContainedListItem>
      <ContainedListItem action={itemAction}>Cedar Logistics</ContainedListItem>
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
    const results = customers.filter((listItem) =>
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
    const results = customers.filter((listItem) =>
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
        Lakeside Furniture
      </ContainedListItem>
      <ContainedListItem action={itemAction} onClick={onClick}>
        Acme Trading
      </ContainedListItem>
      <ContainedListItem action={itemAction} onClick={onClick}>
        Birch Studio
      </ContainedListItem>
      <ContainedListItem action={itemAction} onClick={onClick}>
        Cedar Logistics
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
          <span>Customers</span>
          <Tag size="sm" role="status" aria-label="4 items in list">
            4
          </Tag>
        </div>
      }>
      <ContainedListItem>Lakeside Furniture</ContainedListItem>
      <ContainedListItem>Acme Trading</ContainedListItem>
      <ContainedListItem>Birch Studio</ContainedListItem>
      <ContainedListItem>Cedar Logistics</ContainedListItem>
    </ContainedList>
  );
};

WithListTitleDecorators.args = { ...sharedArgs };
WithListTitleDecorators.argTypes = sharedArgTypes;
WithListTitleDecorators.parameters = customLabelParameters;

export const WithIcons: StoryFn<typeof ContainedList> = (args) => {
  return (
    <ContainedList {...args}>
      <ContainedListItem renderIcon={Apple}>
        Lakeside Furniture
      </ContainedListItem>
      <ContainedListItem renderIcon={Wheat}>Acme Trading</ContainedListItem>
      <ContainedListItem renderIcon={Strawberry}>
        Birch Studio
      </ContainedListItem>
      <ContainedListItem renderIcon={Fish}>Cedar Logistics</ContainedListItem>
    </ContainedList>
  );
};

WithIcons.args = { ...sharedArgs };
WithIcons.argTypes = sharedArgTypes;
WithIcons.parameters = sharedParameters;

export const WithLayer: StoryFn<typeof ContainedList> = (args) => {
  return (
    <WithLayerTemplate>
      <ContainedList {...args}>
        <ContainedListItem>Lakeside Furniture</ContainedListItem>
        <ContainedListItem>Acme Trading</ContainedListItem>
      </ContainedList>
    </WithLayerTemplate>
  );
};

WithLayer.args = { ...sharedArgs };
WithLayer.argTypes = sharedArgTypes;
WithLayer.parameters = sharedParameters;

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
        {customers.slice(0, 3).map((customer) => (
          <ContainedListItem
            key={customer}
            action={
              <OverflowMenu flipped size="lg" ariaLabel={`${customer} options`}>
                <OverflowMenuItem itemText="View details" />
                <OverflowMenuItem itemText="Edit" />
                <OverflowMenuItem itemText="Remove" isDelete hasDivider />
              </OverflowMenu>
            }>
            {customer}
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
        {customerDetails.map(({ name, invoices }) => (
          <ContainedListItem key={name}>
            {name}
            <br />
            <span className={`${prefix}--label ${prefix}--label--no-margin`}>
              {invoices}
            </span>
          </ContainedListItem>
        ))}
      </ContainedList>
      <ContainedList {...args}>
        {customerDetails.map(({ name, invoices, terms }) => (
          <ContainedListItem key={name}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                columnGap: 'var(--cds-spacing-05)',
              }}>
              <span>{name}</span>
              <span>{invoices}</span>
              <span>{terms}</span>
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
