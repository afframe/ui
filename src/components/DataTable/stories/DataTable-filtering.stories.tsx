/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, story styles in CSS, TableToolbarAction story rendered with the v11 toolbar menu, unused imports removed. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { useState } from 'react';
import { action } from 'storybook/actions';
import {
  Button,
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  TableToolbarMenu,
  TableToolbarAction,
} from '../../../index.js';
import type { TableHeaderProps, TableToolbarProps } from '../../../index.js';
import { dataTableArgs, dataTableArgTypes, rows, headers } from './shared.js';
import { withV11OverflowMenu } from '../../../../.storybook/templates/withV11OverflowMenu.js';
import type { DataTableStoryArgs } from './shared.js';
import mdx from '../DataTable.mdx';
import TableToolbarFilter from './examples/TableToolbarFilter.js';
import './datatable-story.css';

export default {
  title: 'Components/DataTable/Filtering',
  component: DataTable,
  tags: ['carbon'],
  subcomponents: {
    TableToolbar,
    TableToolbarContent,
    TableToolbarSearch,
    TableToolbarMenu,
    TableToolbarAction,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableHeader,
    TableRow,
  },
  argTypes: dataTableArgTypes,
  args: dataTableArgs,
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta;

export const Default: StoryFn<DataTableStoryArgs> = (args) => {
  const [renderedRows, setRenderedRows] = useState(rows);

  const handleTableFilter = (selectedCheckboxes: string[]) => {
    setRenderedRows([]);

    for (let i = 0; i < selectedCheckboxes.length; i++) {
      // Filter the items inside the rows list
      const filteredRows = rows.filter((row) => {
        return Object.values(row).some((value) =>
          String(value)
            .toLowerCase()
            .includes((selectedCheckboxes[i] as string).toLowerCase())
        );
      });

      setRenderedRows((prevData) => {
        // Filter out duplicate rows
        const uniqueRows = filteredRows.filter((row) => {
          return !prevData.some((prevRow) => {
            return Object.keys(row).every((key) => {
              return (
                row[key as keyof typeof row] ===
                prevRow[key as keyof typeof prevRow]
              );
            });
          });
        });
        return [...prevData, ...uniqueRows];
      });
    }
  };

  const handleOnResetFilter = () => {
    setRenderedRows(rows);
  };

  return (
    <DataTable rows={renderedRows} headers={headers} {...args}>
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
        <TableContainer title="DataTable" description="With filtering">
          <TableToolbar {...(getToolbarProps() as Partial<TableToolbarProps>)}>
            <TableToolbarContent>
              {/* pass in `onInputChange` change here to make filtering work */}
              <TableToolbarSearch
                onChange={(evt, value) => {
                  action(`TableToolbarSearch - onChange ${value}`)(evt);
                  onInputChange(evt);
                }}
              />
              <TableToolbarFilter
                onApplyFilter={handleTableFilter}
                onResetFilter={handleOnResetFilter}
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
};

Default.decorators = [withV11OverflowMenu];
