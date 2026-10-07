/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, visible overflow column header text (axe empty-table-header), TableToolbarAction stories rendered with the v11 toolbar menu, v12 toolbar menu story with a play test. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ArgTypes, Meta, StoryFn, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import {
  Button,
  DataTable,
  MenuItem,
  MenuItemDivider,
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
import { withV11OverflowMenu } from '../../../../.storybook/templates/withV11OverflowMenu.js';
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

export const Default: StoryFn<ToolbarStoryArgs> = ({ persistent, ...args }) => (
  <DataTable rows={rows} headers={headers} {...args}>
    {({
      rows,
      headers,
      getHeaderProps,
      getRowProps,
      getTableProps,
      getToolbarProps,
      onInputChange,
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
              onChange={onInputChange}
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
            {rows.map((row) => (
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
      </TableContainer>
    )}
  </DataTable>
);

Default.args = { persistent: false };
Default.argTypes = sharedArgTypes;
Default.decorators = [withV11OverflowMenu];
// The v11 toolbar menu opens on Enter and moves focus to its first item.
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
}) => (
  <DataTable rows={rows} headers={headers} {...args}>
    {({
      rows,
      headers,
      getHeaderProps,
      getRowProps,
      getTableProps,
      getToolbarProps,
      onInputChange,
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
              onChange={onInputChange}
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
            {rows.map((row) => (
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
      </TableContainer>
    )}
  </DataTable>
);

PersistentToolbar.args = { persistent: true };
PersistentToolbar.argTypes = {
  ...sharedArgTypes,
  persistent: { table: { readonly: true } },
};
PersistentToolbar.decorators = [withV11OverflowMenu];

export const SmallPersistentToolbar: StoryFn<ToolbarStoryArgs> = ({
  persistent,
  ...args
}) => (
  <DataTable rows={rows} headers={headers} {...args}>
    {({
      rows,
      headers,
      getHeaderProps,
      getRowProps,
      getTableProps,
      getToolbarProps,
      onInputChange,
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
              onChange={onInputChange}
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
        <Table {...getTableProps()} size={args.size} aria-label="sample table">
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
            {rows.map((row) => (
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
      </TableContainer>
    )}
  </DataTable>
);

SmallPersistentToolbar.args = { persistent: true, size: 'sm' };
SmallPersistentToolbar.argTypes = {
  ...sharedArgTypes,
  persistent: { table: { readonly: true } },
};
SmallPersistentToolbar.decorators = [withV11OverflowMenu];

export const WithOverflowMenu: StoryFn<ToolbarStoryArgs> = ({
  persistent,
  ...args
}) => (
  <DataTable rows={rows} headers={headers} {...args}>
    {({
      rows,
      headers,
      getHeaderProps,
      getRowProps,
      getTableProps,
      getToolbarProps,
      onInputChange,
      getCellProps,
    }) => (
      <TableContainer title="DataTable" description="With overflow menu">
        <TableToolbar
          {...(getToolbarProps() as Partial<TableToolbarProps>)}
          aria-label="data table toolbar">
          <TableToolbarContent>
            <TableToolbarSearch
              onChange={onInputChange}
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
            {rows.map((row) => (
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
      </TableContainer>
    )}
  </DataTable>
);

WithOverflowMenu.argTypes = {
  ...sharedArgTypes,
  overflowMenuOnHover: {
    control: 'boolean',
    description: 'Only show row overflow menus on hover.',
  },
};
WithOverflowMenu.args = { overflowMenuOnHover: false, persistent: false };
WithOverflowMenu.decorators = [withV11OverflowMenu];

// `TableToolbarMenu` types omit `label`, which the v12 overflow menu reads
// for its accessible name, so it is passed through a spread.
const toolbarMenuLabel = { label: 'Settings' };

/**
 * Toolbar menu under the v12 flags: `MenuItem` children and a `label` on
 * `TableToolbarMenu` instead of `TableToolbarAction`.
 */
export const ToolbarMenuWithMenuItems: StoryObj<
  ToolbarStoryArgs & { onAction: (label: string) => void }
> = {
  args: { persistent: false, onAction: fn() },
  argTypes: { ...sharedArgTypes, onAction: { control: false } },
  render: ({ persistent, onAction, ...args }) => (
    <DataTable rows={rows} headers={headers} {...args}>
      {({
        rows,
        headers,
        getHeaderProps,
        getRowProps,
        getTableProps,
        getToolbarProps,
        onInputChange,
        getTableContainerProps,
        getCellProps,
      }) => (
        <TableContainer
          title="DataTable"
          description="With a v12 toolbar menu"
          {...getTableContainerProps()}>
          <TableToolbar
            {...(getToolbarProps() as Partial<TableToolbarProps>)}
            aria-label="data table toolbar">
            <TableToolbarContent>
              <TableToolbarSearch
                onChange={onInputChange}
                persistent={persistent}
              />
              <TableToolbarMenu {...toolbarMenuLabel}>
                <MenuItem
                  label="Action 1"
                  onClick={() => onAction('Action 1')}
                />
                <MenuItem
                  label="Action 2"
                  onClick={() => onAction('Action 2')}
                />
                <MenuItemDivider />
                <MenuItem
                  label="Action 3"
                  onClick={() => onAction('Action 3')}
                />
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
              {rows.map((row) => (
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
        </TableContainer>
      )}
    </DataTable>
  ),
  play: async ({ args, canvasElement }) => {
    const body = within(canvasElement.ownerDocument.body);
    const trigger = toolbarMenuTrigger(canvasElement);

    await userEvent.click(trigger);
    const menu = await body.findByRole('menu', { name: 'Settings' });
    const items = within(menu).getAllByRole('menuitem');
    await expect(items.map((item) => item.textContent)).toEqual([
      'Action 1',
      'Action 2',
      'Action 3',
    ]);
    await userEvent.click(items[1] as HTMLElement);
    await expect(args.onAction).toHaveBeenCalledWith('Action 2');

    trigger.focus();
    await userEvent.keyboard('{Enter}');
    await waitFor(() =>
      expect(body.getByRole('menuitem', { name: 'Action 1' })).toHaveFocus()
    );
    await userEvent.keyboard('{ArrowDown}{Enter}');
    await expect(args.onAction).toHaveBeenLastCalledWith('Action 2');
  },
};
