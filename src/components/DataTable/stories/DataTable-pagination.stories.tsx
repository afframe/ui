/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, story styles in CSS, TableToolbarAction story rendered with the v11 toolbar menu. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ArgTypes, Meta, StoryFn } from '@storybook/react-vite';
import { useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { action } from 'storybook/actions';
import {
  Button,
  DataTable,
  Pagination,
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
import type { TableHeaderProps, TableToolbarProps } from '../../../index.js';
import { dataTableArgs, dataTableArgTypes, headers } from './shared.js';
import { withV11OverflowMenu } from '../../../../.storybook/templates/withV11OverflowMenu.js';
import type { DataTableStoryArgs } from './shared.js';
import mdx from '../DataTable.mdx';
import './datatable-story.css';

export default {
  title: 'Components/DataTable/Pagination',
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
    Pagination,
  },
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta;

// Generate more rows for pagination demo
const generateRows = (count: number) => {
  const protocols = ['HTTP', 'HTTPS', 'TCP', 'UDP'];
  const rules = ['Round robin', 'DNS delegation', 'Least connections'];
  const statuses = ['Active', 'Starting', 'Disabled'];
  const ports = [80, 443, 3000, 8080, 8443];

  return Array.from({ length: count }, (_, i) => ({
    id: `load-balancer-${i + 1}`,
    name: `Load Balancer ${i + 1}`,
    protocol: protocols[i % protocols.length],
    port: ports[i % ports.length],
    rule: rules[i % rules.length],
    attached_groups: `VM Group ${i + 1}`,
    status: statuses[i % statuses.length],
  }));
};

const sharedArgTypes = {
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
} satisfies ArgTypes;

const sharedArgs: Partial<DataTableStoryArgs> = {
  size: 'lg',
  stickyHeader: false,
  useStaticWidth: false,
  useZebraStyles: false,
};

export const Default: StoryFn<DataTableStoryArgs> = (args) => {
  const allRows = useMemo(() => generateRows(100), []);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchValue, setSearchValue] = useState('');
  const paginationSize = args.size === 'xl' ? 'lg' : args.size;

  const filteredRows = allRows.filter((row) => {
    const search = searchValue.trim().toLowerCase();

    if (search === '') {
      return true;
    }

    return Object.values(row).some((value) =>
      String(value).toLowerCase().includes(search)
    );
  });

  const handlePaginationChange = ({
    page,
    pageSize,
  }: {
    page: number;
    pageSize: number;
  }) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const handleSearchChange = (event: '' | ChangeEvent<HTMLInputElement>) => {
    action('toolbar search input')(event);
    setSearchValue((event as ChangeEvent<HTMLInputElement>).target.value);
    setPage(1);
  };

  // Calculate the rows to display for the current page
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedRows = filteredRows.slice(startIndex, endIndex);

  return (
    <>
      <DataTable rows={paginatedRows} headers={headers} {...args}>
        {({
          rows,
          headers,
          getHeaderProps,
          getRowProps,
          getTableProps,
          getToolbarProps,
          getCellProps,
        }) => (
          <TableContainer
            title="Load Balancers"
            description="Paginated data table with persistent toolbar">
            <TableToolbar
              {...(getToolbarProps() as Partial<TableToolbarProps>)}>
              <TableToolbarContent>
                <TableToolbarSearch onChange={handleSearchChange} persistent />
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
            <Table {...getTableProps()} aria-label="paginated table">
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
      <Pagination
        page={page}
        pageSize={pageSize}
        pageSizes={[10, 20, 30, 40, 50]}
        totalItems={filteredRows.length}
        onChange={handlePaginationChange}
        size={paginationSize}
      />
    </>
  );
};

Default.args = sharedArgs;
Default.argTypes = sharedArgTypes;
Default.decorators = [withV11OverflowMenu];
