/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and icons from @afframe/ui, unused imports removed, no-results state with IBM Products NotFoundEmptyState, inline spacing as Carbon spacing tokens, prop getter keys passed directly instead of spread. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { Download, Save, TrashCan } from '../../../icons.js';
import {
  Button,
  DataTable,
  NotFoundEmptyState,
  Table,
  TableBatchAction,
  TableBatchActions,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableSelectAll,
  TableSelectRow,
  TableToolbar,
  TableToolbarAction,
  TableToolbarContent,
  TableToolbarSearch,
  TableToolbarMenu,
} from '../../../index.js';
import type {
  TableHeaderProps,
  TableSelectAllProps,
  TableSelectRowProps,
  TableToolbarProps,
} from '../../../index.js';
import {
  batchActionClick,
  dataTableArgs,
  dataTableArgTypes,
  rows,
  headers,
} from './shared.js';
import type { DataTableStoryArgs } from './shared.js';
import mdx from '../DataTable.mdx';

export default {
  title: 'Components/DataTable/Batch Actions',
  component: DataTable,
  tags: ['carbon'],
  args: dataTableArgs,
  argTypes: dataTableArgTypes,
  subcomponents: {
    TableBatchAction,
    TableBatchActions,
    TableToolbar,
    TableToolbarAction,
    TableToolbarContent,
    TableToolbarSearch,
    TableToolbarMenu,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableHeader,
    TableRow,
  },
  parameters: {
    docs: {
      page: mdx,
      source: {
        type: 'code',
      },
    },
  },
} satisfies Meta;

export const Default: StoryFn<DataTableStoryArgs> = (args) => {
  const [searchValue, setSearchValue] = useState('');

  const filteredRows = rows.filter((row) => {
    const search = searchValue.trim().toLowerCase();
    if (search === '') return true;
    return Object.values(row).some((val) =>
      String(val).toLowerCase().includes(search)
    );
  });

  const showEmptyState = filteredRows.length === 0;

  return (
    <DataTable
      rows={showEmptyState ? [] : filteredRows}
      headers={headers}
      {...args}>
      {({
        rows: tableRows,
        headers: tableHeaders,
        getHeaderProps,
        getRowProps,
        getSelectionProps,
        getToolbarProps,
        getBatchActionProps,
        selectedRows,
        getTableProps,
        getTableContainerProps,
        getCellProps,
      }) => {
        const batchActionProps = getBatchActionProps();

        return (
          <TableContainer
            title="DataTable"
            description="With batch actions"
            {...getTableContainerProps()}>
            <TableToolbar
              {...(getToolbarProps() as Partial<TableToolbarProps>)}>
              <TableBatchActions {...batchActionProps}>
                <TableBatchAction
                  tabIndex={batchActionProps.shouldShowBatchActions ? 0 : -1}
                  renderIcon={TrashCan}
                  onClick={batchActionClick(
                    selectedRows,
                    action('Batch action click')
                  )}>
                  Delete
                </TableBatchAction>
                <TableBatchAction
                  tabIndex={batchActionProps.shouldShowBatchActions ? 0 : -1}
                  renderIcon={Save}
                  onClick={batchActionClick(
                    selectedRows,
                    action('Batch action click')
                  )}>
                  Save
                </TableBatchAction>
                <TableBatchAction
                  tabIndex={batchActionProps.shouldShowBatchActions ? 0 : -1}
                  renderIcon={Download}
                  onClick={batchActionClick(
                    selectedRows,
                    action('Batch action click')
                  )}>
                  Download
                </TableBatchAction>
              </TableBatchActions>
              <TableToolbarContent
                aria-hidden={batchActionProps.shouldShowBatchActions}>
                <TableToolbarSearch
                  tabIndex={batchActionProps.shouldShowBatchActions ? -1 : 0}
                  value={searchValue}
                  onChange={(evt, value = '') => {
                    action('TableToolbarSearch - onChange')(evt);
                    setSearchValue(value);
                  }}
                />
                <TableToolbarMenu
                  tabIndex={batchActionProps.shouldShowBatchActions ? -1 : 0}>
                  <TableToolbarAction onClick={() => alert('Alert 1')}>
                    Action 1
                  </TableToolbarAction>
                  <TableToolbarAction onClick={() => alert('Alert 2')}>
                    Action 2
                  </TableToolbarAction>
                  <TableToolbarAction onClick={() => alert('Alert 3')}>
                    Action 3
                  </TableToolbarAction>
                </TableToolbarMenu>
                <Button
                  tabIndex={batchActionProps.shouldShowBatchActions ? -1 : 0}
                  onClick={action('Add new row')}
                  kind="primary">
                  Add new
                </Button>
              </TableToolbarContent>
            </TableToolbar>
            <Table {...getTableProps()} aria-label="sample table">
              <TableHead>
                <TableRow>
                  <TableSelectAll
                    {...(getSelectionProps() as TableSelectAllProps)}
                  />
                  {tableHeaders.map((header) => {
                    const { key, ...headerProps } = getHeaderProps({ header });
                    return (
                      <TableHeader
                        key={key}
                        {...(headerProps as TableHeaderProps)}>
                        {header.header}
                      </TableHeader>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {showEmptyState
                  ? null
                  : tableRows.map((row) => {
                      const { key, ...rowProps } = getRowProps({ row });
                      return (
                        <TableRow key={key} {...rowProps}>
                          <TableSelectRow
                            {...(getSelectionProps({
                              row,
                            }) as TableSelectRowProps)}
                            onChange={action('TableSelectRow - onChange')}
                          />
                          {row.cells.map((cell) => {
                            const { key, ...cellProps } = getCellProps({
                              cell,
                            });
                            return (
                              <TableCell key={key} {...cellProps}>
                                {cell.value}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
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
        );
      }}
    </DataTable>
  );
};

Default.args = {
  isSortable: false,
  locale: 'en',
  overflowMenuOnHover: true,
  size: 'lg',
  stickyHeader: false,
  useStaticWidth: false,
  useZebraStyles: false,
};

Default.argTypes = {
  locale: {
    control: 'text',
    description: 'Provide a string for the current locale',
  },
  overflowMenuOnHover: {
    control: 'boolean',
    description:
      'Specify whether the overflow menu (if it exists) should be shown always, or only on hover',
  },
  size: {
    control: 'select',
    options: ['xs', 'sm', 'md', 'lg', 'xl'],
    description: 'Change the row height of table',
  },
  stickyHeader: {
    control: 'boolean',
    description:
      'Specify whether the header should be sticky. Still in preview: may not work with every combination of table props',
  },
  useStaticWidth: {
    control: 'boolean',
    description: 'If true, will use a width of "auto" instead of 100%',
  },
  useZebraStyles: {
    control: 'boolean',
    description: 'Add zebra striping to rows',
  },
};
