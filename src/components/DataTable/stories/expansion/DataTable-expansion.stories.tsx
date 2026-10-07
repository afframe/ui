/**
 * Copyright IBM Corp. 2016, 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2025
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, story styles in CSS, expanded row heading h6 to h3 (axe heading-order), empty-table-header off for Default. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { Fragment } from 'react';
import { action } from 'storybook/actions';
import {
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableExpandHeader,
  TableExpandRow,
  TableExpandedRow,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../../index.js';
import type { TableHeaderProps } from '../../../../index.js';
import { dataTableArgs, dataTableArgTypes, rows, headers } from '../shared.js';
import type { DataTableStoryArgs } from '../shared.js';
import mdx from '../../DataTable.mdx';
import './DataTable-expansion-story.css';

export default {
  title: 'Components/DataTable/Expansion',
  component: DataTable,
  tags: ['carbon'],
  args: dataTableArgs,
  argTypes: dataTableArgTypes,
  subcomponents: {
    TableExpandHeader,
    TableExpandRow,
    TableExpandedRow,
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
      getExpandHeaderProps,
      getRowProps,
      getExpandedRowProps,
      getTableProps,
      getTableContainerProps,
      getCellProps,
    }) => (
      <TableContainer
        title="DataTable"
        description="With expansion"
        {...getTableContainerProps()}>
        <Table {...getTableProps()} aria-label="sample table">
          <TableHead>
            <TableRow>
              <TableExpandHeader {...getExpandHeaderProps()} />
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
              <Fragment key={row.id}>
                <TableExpandRow
                  {...getRowProps({ row })}
                  // TableExpandRow types omit onClick; it reaches the row.
                  {...{ onClick: action('onClick') }}>
                  {row.cells.map((cell) => (
                    <TableCell {...getCellProps({ cell })}>
                      {cell.value}
                    </TableCell>
                  ))}
                </TableExpandRow>
                <TableExpandedRow
                  colSpan={headers.length + 1}
                  className="demo-expanded-td"
                  {...getExpandedRowProps({ row })}>
                  <h3>Expandable row content</h3>
                  <div>Description here</div>
                </TableExpandedRow>
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )}
  </DataTable>
);

Default.parameters = {
  a11y: {
    config: {
      // TableExpandHeader without enableToggle renders an empty th (upstream).
      rules: [{ id: 'empty-table-header', enabled: false }],
    },
  },
};

export const BatchExpansion: StoryFn<DataTableStoryArgs> = (args) => (
  <DataTable {...args} rows={rows} headers={headers}>
    {({
      rows,
      headers,
      getHeaderProps,
      getExpandHeaderProps,
      getRowProps,
      getExpandedRowProps,
      getTableProps,
      getTableContainerProps,
      getCellProps,
    }) => (
      <TableContainer
        title="DataTable"
        description="With batch expansion"
        {...getTableContainerProps()}>
        <Table {...getTableProps()} aria-label="sample table">
          <TableHead>
            <TableRow>
              <TableExpandHeader
                enableToggle={true}
                {...getExpandHeaderProps()}
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
              <Fragment key={row.id}>
                <TableExpandRow {...getRowProps({ row })}>
                  {row.cells.map((cell) => (
                    <TableCell {...getCellProps({ cell })}>
                      {cell.value}
                    </TableCell>
                  ))}
                </TableExpandRow>
                <TableExpandedRow
                  colSpan={headers.length + 1}
                  className="demo-expanded-td"
                  {...getExpandedRowProps({ row })}>
                  <h3>Expandable row content</h3>
                  <div>Description here</div>
                </TableExpandedRow>
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )}
  </DataTable>
);

export const BatchExpansionMultipleTables: StoryFn<DataTableStoryArgs> = (
  args
) => (
  <>
    <DataTable {...args} rows={rows} headers={headers}>
      {({
        rows,
        headers,
        getHeaderProps,
        getExpandHeaderProps,
        getRowProps,
        getExpandedRowProps,
        getTableProps,
        getTableContainerProps,
        getCellProps,
      }) => (
        <TableContainer
          title="DataTable"
          description="With batch expansion"
          {...getTableContainerProps()}>
          <Table {...getTableProps()} aria-label="sample table">
            <TableHead>
              <TableRow>
                <TableExpandHeader
                  enableToggle={true}
                  {...getExpandHeaderProps()}
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
                <Fragment key={row.id}>
                  <TableExpandRow {...getRowProps({ row })}>
                    {row.cells.map((cell) => (
                      <TableCell {...getCellProps({ cell })}>
                        {cell.value}
                      </TableCell>
                    ))}
                  </TableExpandRow>
                  <TableExpandedRow
                    colSpan={headers.length + 1}
                    className="demo-expanded-td"
                    {...getExpandedRowProps({ row })}>
                    <h3>Expandable row content</h3>
                    <div>Description here</div>
                  </TableExpandedRow>
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </DataTable>
    <DataTable {...args} rows={rows} headers={headers}>
      {({
        rows,
        headers,
        getHeaderProps,
        getExpandHeaderProps,
        getRowProps,
        getExpandedRowProps,
        getTableProps,
        getTableContainerProps,
        getCellProps,
      }) => (
        <TableContainer
          title="DataTable"
          description="With batch expansion"
          {...getTableContainerProps()}>
          <Table {...getTableProps()} aria-label="sample table">
            <TableHead>
              <TableRow>
                <TableExpandHeader
                  enableToggle={true}
                  {...getExpandHeaderProps()}
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
                <Fragment key={row.id}>
                  <TableExpandRow {...getRowProps({ row })}>
                    {row.cells.map((cell) => (
                      <TableCell {...getCellProps({ cell })}>
                        {cell.value}
                      </TableCell>
                    ))}
                  </TableExpandRow>
                  <TableExpandedRow
                    colSpan={headers.length + 1}
                    className="demo-expanded-td"
                    {...getExpandedRowProps({ row })}>
                    <h3>Expandable row content</h3>
                    <div>Description here</div>
                  </TableExpandedRow>
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </DataTable>
  </>
);
/*
 * This story will:
 * - Be excluded from the docs page
 * - Removed from the sidebar navigation
 * - Still be a tested variant and available at direct url
 */
BatchExpansionMultipleTables.tags = ['!dev', '!autodocs'];
