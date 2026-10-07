/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, visually hidden text in the empty radio header cell (axe empty-table-header). Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import {
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableSelectAll,
  TableSelectRow,
} from '../../../index.js';
import type {
  TableHeaderProps,
  TableSelectAllProps,
  TableSelectRowProps,
} from '../../../index.js';
import { dataTableArgs, dataTableArgTypes, rows, headers } from './shared.js';
import type { DataTableStoryArgs } from './shared.js';
import mdx from '../DataTable.mdx';

export default {
  title: 'Components/DataTable/Selection',
  component: DataTable,
  tags: ['carbon'],
  args: { ...dataTableArgs, radio: false },
  argTypes: {
    ...dataTableArgTypes,
    radio: {
      control: 'boolean',
      description: 'Use radio selection instead of multi-selection.',
    },
  },
  subcomponents: {
    TableSelectAll,
    TableSelectRow,
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
    },
  },
} satisfies Meta;

export const Default: StoryFn<DataTableStoryArgs> = (args) => (
  <DataTable rows={rows} headers={headers} {...args}>
    {({
      rows,
      headers,
      getHeaderProps,
      getRowProps,
      getSelectionProps,
      getTableProps,
      getTableContainerProps,
      getCellProps,
    }) => (
      <TableContainer
        title="DataTable"
        description="With selection"
        {...getTableContainerProps()}>
        <Table {...getTableProps()} aria-label="sample table">
          <TableHead>
            <TableRow>
              {args.radio ? (
                <th scope="col">
                  <span className="cds--visually-hidden">Selection</span>
                </th>
              ) : (
                <TableSelectAll
                  {...(getSelectionProps() as TableSelectAllProps)}
                />
              )}
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
              <TableRow
                {...getRowProps({ row })}
                onClick={(evt) => {
                  action('TableRow onClick')(evt);
                }}>
                <TableSelectRow
                  {...(getSelectionProps({ row }) as TableSelectRowProps)}
                  onChange={action('TableSelectRow - onChange')}
                />
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

export const WithRadioSelection: StoryFn<DataTableStoryArgs> = (args) => (
  <DataTable rows={rows} headers={headers} {...args}>
    {({
      rows,
      headers,
      getHeaderProps,
      getRowProps,
      getSelectionProps,
      getTableProps,
      getTableContainerProps,
      getCellProps,
    }) => (
      <TableContainer
        title="DataTable"
        description="With radio selection"
        {...getTableContainerProps()}>
        <Table {...getTableProps()} aria-label="sample table">
          <TableHead>
            <TableRow>
              <th scope="col">
                <span className="cds--visually-hidden">Selection</span>
              </th>
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
                <TableSelectRow
                  {...(getSelectionProps({ row }) as TableSelectRowProps)}
                />
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

WithRadioSelection.args = { radio: true };
WithRadioSelection.argTypes = {
  radio: { table: { readonly: true } },
};

export const WithSelectionAndSorting: StoryFn<DataTableStoryArgs> = (args) => (
  <DataTable rows={rows} headers={headers} {...args}>
    {({
      rows,
      headers,
      getHeaderProps,
      getRowProps,
      getSelectionProps,
      getTableProps,
      getTableContainerProps,
      getCellProps,
    }) => (
      <TableContainer
        title="DataTable"
        description="With selection"
        {...getTableContainerProps()}>
        <Table {...getTableProps()} aria-label="sample table">
          <TableHead>
            <TableRow>
              <TableSelectAll
                {...(getSelectionProps() as TableSelectAllProps)}
              />
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
                <TableSelectRow
                  {...(getSelectionProps({ row }) as TableSelectRowProps)}
                />
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

WithSelectionAndSorting.args = { isSortable: true };
WithSelectionAndSorting.argTypes = {
  isSortable: { table: { readonly: true } },
};
