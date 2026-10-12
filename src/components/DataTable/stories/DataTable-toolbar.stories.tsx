/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, visible overflow column header text (axe empty-table-header), keyboard play test on the row overflow menu, no-results state with IBM Products NotFoundEmptyState, inline spacing as Carbon spacing tokens, upstream v12 overflow menu branches removed, Afframe story for the 1.0.1 toolbar menu items added. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ArgTypes, Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { action } from 'storybook/actions';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { afframeA11y } from '../../../../.storybook/afframeA11y.js';
import {
  Button,
  DataTable,
  MenuItem,
  MenuItemDivider,
  NotFoundEmptyState,
  OverflowMenu,
  OverflowMenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarAction,
  TableToolbarContent,
  TableToolbarMenu,
  TableToolbarSearch,
} from '../../../index.js';
import mdx from '../DataTable.mdx';
import { dataTableArgs, dataTableArgTypes, headers, rows } from './shared.js';
import type { DataTableStoryArgs } from './shared.js';
import type { TableHeaderProps, TableToolbarProps } from '../../../index.js';

type ToolbarStoryArgs = DataTableStoryArgs & { persistent: boolean };

function toolbarMenuTrigger(canvasElement: HTMLElement) {
  return within(canvasElement)
    .getByLabelText('data table toolbar')
    .querySelector('button[aria-haspopup="true"]') as HTMLButtonElement;
}

type ToolbarSize = NonNullable<TableToolbarProps['size']>;

export default {
  title: 'Components/DataTable/Toolbar',
  component: DataTable,
  tags: ['carbon'],
  args: dataTableArgs,
  argTypes: dataTableArgTypes,
  subcomponents: {
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableHeader,
    TableBody,
    TableCell,
  },
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta;

const sharedArgTypes = {
  ...dataTableArgTypes,
  persistent: { control: { type: 'boolean' } },
} satisfies ArgTypes;

export const Default: StoryFn<ToolbarStoryArgs> = ({ persistent, ...args }) => {
  const [searchValue, setSearchValue] = useState('');

  const filteredRows = rows.filter((row) => {
    const q = searchValue.trim().toLowerCase();
    if (!q) return true;
    return Object.values(row).some((v) => String(v).toLowerCase().includes(q));
  });

  const showEmptyState = filteredRows.length === 0;

  return (
    <DataTable
      rows={showEmptyState ? [] : filteredRows}
      headers={headers}
      {...args}>
      {({
        rows,
        headers,
        getHeaderProps,
        getRowProps,
        getTableProps,
        getToolbarProps,
        getTableContainerProps,
        getCellProps,
      }) => (
        <TableContainer
          title="DataTable"
          description="With toolbar"
          {...getTableContainerProps()}>
          <TableToolbar
            {...(getToolbarProps() as Partial<TableToolbarProps>)}
            aria-label="data table toolbar">
            <TableToolbarContent>
              <TableToolbarSearch
                value={searchValue}
                onChange={(evt, value = '') => {
                  action('TableToolbarSearch - onChange')(evt);
                  setSearchValue(value);
                }}
                persistent={persistent}
              />
              <TableToolbarMenu>
                <TableToolbarAction onClick={action('Action 1 Click')}>
                  Action 1
                </TableToolbarAction>
                <TableToolbarAction onClick={action('Action 2 Click')}>
                  Action 2
                </TableToolbarAction>
                <TableToolbarAction onClick={action('Action 3 Click')}>
                  Action 3
                </TableToolbarAction>
              </TableToolbarMenu>
              <Button onClick={action('Button click')}>Primary Button</Button>
            </TableToolbarContent>
          </TableToolbar>
          <Table {...getTableProps()} aria-label="sample table">
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableHeader
                    {...(getHeaderProps({ header }) as TableHeaderProps)}>
                    {header.header}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {showEmptyState
                ? null
                : rows.map((row) => (
                    <TableRow {...getRowProps({ row })}>
                      {row.cells.map((cell) => (
                        <TableCell {...getCellProps({ cell })}>
                          {cell.value}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
          {showEmptyState && (
            <div
              style={{
                padding: 'var(--cds-spacing-07) var(--cds-spacing-05)',
              }}>
              <NotFoundEmptyState
                illustrationDescription="Not found illustration"
                title="No results match the current search"
                subtitle="Clear the search field to see all results, or try a different search term."
                action={{
                  text: 'Clear search',
                  kind: 'tertiary',
                  onClick: () => setSearchValue(''),
                }}
              />
            </div>
          )}
        </TableContainer>
      )}
    </DataTable>
  );
};

Default.args = { persistent: false };
Default.argTypes = sharedArgTypes;
// The toolbar menu opens on Enter and moves focus to its first item.
Default.play = async ({ canvasElement }) => {
  toolbarMenuTrigger(canvasElement).focus();
  await userEvent.keyboard('{Enter}');
  const body = within(canvasElement.ownerDocument.body);
  await waitFor(() =>
    expect(body.getByRole('menuitem', { name: 'Action 1' })).toHaveFocus()
  );
  await userEvent.keyboard('{Escape}');
};

export const PersistentToolbar: StoryFn<ToolbarStoryArgs> = ({
  persistent,
  ...args
}) => {
  const [searchValue, setSearchValue] = useState('');

  const filteredRows = rows.filter((row) => {
    const q = searchValue.trim().toLowerCase();
    if (!q) return true;
    return Object.values(row).some((v) => String(v).toLowerCase().includes(q));
  });

  const showEmptyState = filteredRows.length === 0;

  return (
    <DataTable
      rows={showEmptyState ? [] : filteredRows}
      headers={headers}
      {...args}>
      {({
        rows,
        headers,
        getHeaderProps,
        getRowProps,
        getTableProps,
        getToolbarProps,
        getTableContainerProps,
        getCellProps,
      }) => (
        <TableContainer
          title="DataTable"
          description="With toolbar"
          {...getTableContainerProps()}>
          <TableToolbar
            {...(getToolbarProps() as Partial<TableToolbarProps>)}
            aria-label="data table toolbar">
            <TableToolbarContent>
              <TableToolbarSearch
                value={searchValue}
                onChange={(evt, value = '') => {
                  action('TableToolbarSearch - onChange')(evt);
                  setSearchValue(value);
                }}
                persistent={persistent}
              />
              <TableToolbarMenu>
                <TableToolbarAction onClick={action('Action 1 Click')}>
                  Action 1
                </TableToolbarAction>
                <TableToolbarAction onClick={action('Action 2 Click')}>
                  Action 2
                </TableToolbarAction>
                <TableToolbarAction onClick={action('Action 3 Click')}>
                  Action 3
                </TableToolbarAction>
              </TableToolbarMenu>
              <Button onClick={action('Button click')}>Primary Button</Button>
            </TableToolbarContent>
          </TableToolbar>
          <Table {...getTableProps()} aria-label="sample table">
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableHeader
                    {...(getHeaderProps({ header }) as TableHeaderProps)}>
                    {header.header}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {showEmptyState
                ? null
                : rows.map((row) => (
                    <TableRow {...getRowProps({ row })}>
                      {row.cells.map((cell) => (
                        <TableCell {...getCellProps({ cell })}>
                          {cell.value}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
          {showEmptyState && (
            <div
              style={{
                padding: 'var(--cds-spacing-07) var(--cds-spacing-05)',
              }}>
              <NotFoundEmptyState
                illustrationDescription="Not found illustration"
                title="No results match the current search"
                subtitle="Clear the search field to see all results, or try a different search term."
                action={{
                  text: 'Clear search',
                  kind: 'tertiary',
                  onClick: () => setSearchValue(''),
                }}
              />
            </div>
          )}
        </TableContainer>
      )}
    </DataTable>
  );
};

PersistentToolbar.args = { persistent: true };
PersistentToolbar.argTypes = {
  ...sharedArgTypes,
  persistent: { table: { readonly: true } },
};

export const SmallPersistentToolbar: StoryFn<ToolbarStoryArgs> = ({
  persistent,
  ...args
}) => {
  const [searchValue, setSearchValue] = useState('');

  const filteredRows = rows.filter((row) => {
    const q = searchValue.trim().toLowerCase();
    if (!q) return true;
    return Object.values(row).some((v) => String(v).toLowerCase().includes(q));
  });

  const showEmptyState = filteredRows.length === 0;

  return (
    <DataTable
      rows={showEmptyState ? [] : filteredRows}
      headers={headers}
      {...args}>
      {({
        rows,
        headers,
        getHeaderProps,
        getRowProps,
        getTableProps,
        getToolbarProps,
        getTableContainerProps,
        getCellProps,
      }) => (
        <TableContainer
          title="DataTable"
          description="With toolbar"
          {...getTableContainerProps()}>
          <TableToolbar
            {...(getToolbarProps() as Partial<TableToolbarProps>)}
            aria-label="data table toolbar"
            size={args.size as ToolbarSize}>
            <TableToolbarContent>
              <TableToolbarSearch
                value={searchValue}
                onChange={(evt, value = '') => {
                  action('TableToolbarSearch - onChange')(evt);
                  setSearchValue(value);
                }}
                persistent={persistent}
                size={args.size as ToolbarSize}
              />
              <TableToolbarMenu size={args.size as ToolbarSize}>
                <TableToolbarAction onClick={action('Action 1 Click')}>
                  Action 1
                </TableToolbarAction>
                <TableToolbarAction onClick={action('Action 2 Click')}>
                  Action 2
                </TableToolbarAction>
                <TableToolbarAction onClick={action('Action 3 Click')}>
                  Action 3
                </TableToolbarAction>
              </TableToolbarMenu>
              <Button onClick={action('Button click')}>Primary Button</Button>
            </TableToolbarContent>
          </TableToolbar>
          <Table
            {...getTableProps()}
            size={args.size}
            aria-label="sample table">
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableHeader
                    {...(getHeaderProps({ header }) as TableHeaderProps)}>
                    {header.header}
                  </TableHeader>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {showEmptyState
                ? null
                : rows.map((row) => (
                    <TableRow {...getRowProps({ row })}>
                      {row.cells.map((cell) => (
                        <TableCell {...getCellProps({ cell })}>
                          {cell.value}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
          {showEmptyState && (
            <div
              style={{
                padding: 'var(--cds-spacing-07) var(--cds-spacing-05)',
              }}>
              <NotFoundEmptyState
                illustrationDescription="Not found illustration"
                title="No results match the current search"
                subtitle="Clear the search field to see all results, or try a different search term."
                action={{
                  text: 'Clear search',
                  kind: 'tertiary',
                  onClick: () => setSearchValue(''),
                }}
              />
            </div>
          )}
        </TableContainer>
      )}
    </DataTable>
  );
};

SmallPersistentToolbar.args = { persistent: true, size: 'sm' };
SmallPersistentToolbar.argTypes = {
  ...sharedArgTypes,
  persistent: { table: { readonly: true } },
};

export const WithOverflowMenu: StoryFn<ToolbarStoryArgs> = ({
  persistent,
  ...args
}) => {
  const [searchValue, setSearchValue] = useState('');

  const filteredRows = rows.filter((row) => {
    const q = searchValue.trim().toLowerCase();
    if (!q) return true;
    return Object.values(row).some((v) => String(v).toLowerCase().includes(q));
  });

  const showEmptyState = filteredRows.length === 0;

  return (
    <DataTable
      rows={showEmptyState ? [] : filteredRows}
      headers={headers}
      {...args}>
      {({
        rows,
        headers,
        getHeaderProps,
        getRowProps,
        getTableProps,
        getToolbarProps,
        getCellProps,
      }) => (
        <TableContainer title="DataTable" description="With overflow menu">
          <TableToolbar
            {...(getToolbarProps() as Partial<TableToolbarProps>)}
            aria-label="data table toolbar">
            <TableToolbarContent>
              <TableToolbarSearch
                value={searchValue}
                onChange={(evt, value = '') => {
                  action('TableToolbarSearch - onChange')(evt);
                  setSearchValue(value);
                }}
                persistent={persistent}
              />
              <TableToolbarMenu>
                <TableToolbarAction onClick={action('Action 1 Click')}>
                  Action 1
                </TableToolbarAction>
                <TableToolbarAction onClick={action('Action 2 Click')}>
                  Action 2
                </TableToolbarAction>
                <TableToolbarAction onClick={action('Action 3 Click')}>
                  Action 3
                </TableToolbarAction>
              </TableToolbarMenu>
              <Button onClick={action('Button click')}>Primary Button</Button>
            </TableToolbarContent>
          </TableToolbar>
          <Table {...getTableProps()} aria-label="sample table">
            <TableHead>
              <TableRow>
                {headers.map((header) => (
                  <TableHeader
                    {...(getHeaderProps({ header }) as TableHeaderProps)}>
                    {header.header}
                  </TableHeader>
                ))}
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {showEmptyState
                ? null
                : rows.map((row) => (
                    <TableRow {...getRowProps({ row })}>
                      {row.cells.map((cell) => (
                        <TableCell {...getCellProps({ cell })}>
                          {cell.value}
                        </TableCell>
                      ))}
                      <TableCell className="cds--table-column-menu">
                        <OverflowMenu size="sm" flipped>
                          <OverflowMenuItem itemText="Stop app" />
                          <OverflowMenuItem itemText="Restart app" />
                          <OverflowMenuItem itemText="Rename app" />
                        </OverflowMenu>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
          {showEmptyState && (
            <div
              style={{
                padding: 'var(--cds-spacing-07) var(--cds-spacing-05)',
              }}>
              <NotFoundEmptyState
                illustrationDescription="Not found illustration"
                title="No results match the current search"
                subtitle="Clear the search field to see all results, or try a different search term."
                action={{
                  text: 'Clear search',
                  kind: 'tertiary',
                  onClick: () => setSearchValue(''),
                }}
              />
            </div>
          )}
        </TableContainer>
      )}
    </DataTable>
  );
};

WithOverflowMenu.argTypes = {
  ...sharedArgTypes,
  overflowMenuOnHover: {
    control: 'boolean',
    description: 'Only show row overflow menus on hover.',
  },
};
WithOverflowMenu.args = { overflowMenuOnHover: false, persistent: false };
// A row menu opens on Enter, moves focus with the arrow keys and returns focus
// to its trigger on Escape.
WithOverflowMenu.play = async ({ canvasElement }) => {
  const body = within(canvasElement.ownerDocument.body);
  const trigger = canvasElement.querySelector(
    '.cds--table-column-menu button[aria-haspopup="true"]'
  ) as HTMLButtonElement;

  trigger.focus();
  await userEvent.keyboard('{Enter}');
  await waitFor(() =>
    expect(body.getByRole('menuitem', { name: 'Stop app' })).toHaveFocus()
  );
  await userEvent.keyboard('{ArrowDown}');
  await expect(
    body.getByRole('menuitem', { name: 'Restart app' })
  ).toHaveFocus();
  await userEvent.keyboard('{Escape}');
  await waitFor(() => expect(trigger).toHaveFocus());
};

// Afframe: the 1.0.x shape, `label` and MenuItem children. The Afframe
// TableToolbarMenu turns on Carbon's newer menu for it, so the keyboard works.
export const MenuItemsFrom101: StoryObj<typeof TableToolbarMenu> = {
  name: 'Toolbar menu items from 1.0.1',
  tags: ['afframe'],
  parameters: { ...afframeA11y },
  render: () => (
    <TableToolbar aria-label="data table toolbar">
      <TableToolbarContent>
        <TableToolbarMenu label="Settings">
          <MenuItem label="Action 1" onClick={action('Action 1')} />
          <MenuItem label="Action 2" onClick={action('Action 2')} />
          <MenuItemDivider />
          <MenuItem label="Action 3" onClick={action('Action 3')} />
        </TableToolbarMenu>
      </TableToolbarContent>
    </TableToolbar>
  ),
  play: async ({ canvasElement }) => {
    const trigger = toolbarMenuTrigger(canvasElement);
    trigger.focus();
    await userEvent.keyboard('{Enter}');
    // The menu renders in a portal on the body.
    const body = within(canvasElement.ownerDocument.body);
    await waitFor(() =>
      expect(body.getByRole('menuitem', { name: 'Action 1' })).toHaveFocus()
    );
    await userEvent.keyboard('{ArrowDown}');
    await expect(
      body.getByRole('menuitem', { name: 'Action 2' })
    ).toHaveFocus();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};
