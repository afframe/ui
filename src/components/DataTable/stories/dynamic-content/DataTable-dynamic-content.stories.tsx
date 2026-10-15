/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and icons from @afframe/ui, story styles in CSS, docs page and source tag added, expanded row heading h6 to h3 (axe heading-order), empty-table-header off, no-results state with IBM Products NotFoundEmptyState, inline spacing as Carbon spacing tokens, prop getter keys passed directly instead of spread, invoice example data. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import './story.css';

import type { Meta, StoryFn } from '@storybook/react-vite';
import { Component, Fragment, useState } from 'react';
import type { ReactNode } from 'react';
import { action } from 'storybook/actions';
import { Download, Save, TrashCan } from '../../../../icons.js';
import {
  DataTable,
  NotFoundEmptyState,
  Table,
  TableBatchAction,
  TableBatchActions,
  TableBody,
  TableCell,
  TableContainer,
  TableExpandHeader,
  TableExpandRow,
  TableExpandedRow,
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
  preview__IconIndicator as IconIndicator,
  formatAmount,
  formatDate,
} from '../../../../index.js';
import type {
  TableHeaderProps,
  TableToolbarSearchProps,
  TableSelectAllProps,
  TableSelectRowProps,
  TableToolbarProps,
} from '../../../../index.js';
import {
  batchActionClick,
  dataTableArgs,
  dataTableArgTypes,
  headers,
  rows,
} from '../shared.js';
import type { DataTableStoryArgs } from '../shared.js';
import mdx from '../../DataTable.mdx';

type DynamicRow = { id: string; [key: string]: ReactNode };
type DynamicHeader = { key: string; header: string };

// Shared invoice rows; this story shows status as an IconIndicator.
const statusIndicator: Record<string, ReactNode> = {
  Draft: <IconIndicator kind="not-started" label="Draft" />,
  Sent: <IconIndicator kind="in-progress" label="Sent" />,
  Paid: <IconIndicator kind="succeeded" label="Paid" />,
  Overdue: <IconIndicator kind="failed" label="Overdue" />,
};

const initialRows: DynamicRow[] = rows.map((row) => ({
  ...row,
  status: statusIndicator[row.status],
}));

type DynamicRowsProps = {
  args: DataTableStoryArgs;
  searchValue: string;
  onSearchChange: NonNullable<TableToolbarSearchProps['onChange']>;
};

const insertInRandomPosition = (array: DynamicRow[], element: DynamicRow) => {
  const index = Math.floor(Math.random() * (array.length + 1));
  return [...array.slice(0, index), element, ...array.slice(index)];
};

// Defined outside Default so React never remounts it on re-render
class DynamicRows extends Component<
  DynamicRowsProps,
  { rows: DynamicRow[]; headers: DynamicHeader[]; id: number }
> {
  state = {
    rows: initialRows,
    headers: headers,
    id: 0,
  };

  handleOnHeaderAdd = () => {
    const length = this.state.headers.length;
    const header = {
      key: `header_${length}`,
      header: `Header ${length}`,
    };
    this.setState((state) => ({
      rows: state.rows.map((row) => ({ ...row, [header.key]: header.header })),
      headers: state.headers.concat(header),
    }));
  };

  handleOnRowAdd = () => {
    this.setState((state) => {
      const { id: _id, rows } = state;
      const id = _id + 1;
      const row: DynamicRow = {
        id: '' + id,
        name: `INV-2026-${String(100 + id).padStart(4, '0')}`,
        protocol: 'Birch Studio',
        port: formatAmount(1000 + id * 10),
        rule: id % 2 === 0 ? 'Net 30' : 'Net 14',
        attached_groups: formatDate('2026-10-28'),
        status: statusIndicator.Draft,
      };
      state.headers
        .filter((header) => row[header.key] === undefined)
        .forEach((header) => {
          row[header.key] = header.header;
        });
      return { id, rows: insertInRandomPosition(rows, row) };
    });
  };

  render() {
    const { args, searchValue, onSearchChange } = this.props;

    const filteredRows = this.state.rows.filter((row) => {
      const q = searchValue.trim().toLowerCase();
      if (!q) return true;
      return Object.values(row).some(
        (v) => typeof v === 'string' && v.toLowerCase().includes(q)
      );
    });
    const showEmptyState = filteredRows.length === 0;

    return (
      <DataTable
        {...args}
        rows={showEmptyState ? [] : filteredRows}
        headers={this.state.headers}>
        {({
          rows,
          headers,
          getExpandHeaderProps,
          getHeaderProps,
          getSelectionProps,
          getToolbarProps,
          getBatchActionProps,
          getRowProps,
          getExpandedRowProps,
          selectedRows,
          getTableProps,
          getTableContainerProps,
          getCellProps,
        }) => {
          const batchActionProps = getBatchActionProps();
          return (
            <TableContainer
              title="DataTable"
              description="Use the toolbar menu to add rows and headers"
              {...getTableContainerProps()}>
              <TableToolbar
                {...(getToolbarProps() as Partial<TableToolbarProps>)}>
                <TableBatchActions {...getBatchActionProps()}>
                  <TableBatchAction
                    renderIcon={TrashCan}
                    iconDescription="Delete the selected rows"
                    onClick={batchActionClick(
                      selectedRows,
                      action('Batch action click')
                    )}
                    tabIndex={batchActionProps.shouldShowBatchActions ? 0 : -1}>
                    Delete
                  </TableBatchAction>
                  <TableBatchAction
                    renderIcon={Save}
                    iconDescription="Save the selected rows"
                    onClick={batchActionClick(
                      selectedRows,
                      action('Batch action click')
                    )}
                    tabIndex={batchActionProps.shouldShowBatchActions ? 0 : -1}>
                    Save
                  </TableBatchAction>
                  <TableBatchAction
                    renderIcon={Download}
                    iconDescription="Download the selected rows"
                    onClick={batchActionClick(
                      selectedRows,
                      action('Batch action click')
                    )}
                    tabIndex={batchActionProps.shouldShowBatchActions ? 0 : -1}>
                    Download
                  </TableBatchAction>
                </TableBatchActions>
                <TableToolbarContent
                  aria-hidden={batchActionProps.shouldShowBatchActions}>
                  <TableToolbarSearch
                    tabIndex={batchActionProps.shouldShowBatchActions ? -1 : 0}
                    value={searchValue}
                    onChange={onSearchChange}
                  />
                  <TableToolbarMenu
                    tabIndex={batchActionProps.shouldShowBatchActions ? -1 : 0}>
                    <TableToolbarAction onClick={this.handleOnRowAdd}>
                      Add row
                    </TableToolbarAction>
                    <TableToolbarAction onClick={this.handleOnHeaderAdd}>
                      Add header
                    </TableToolbarAction>
                  </TableToolbarMenu>
                </TableToolbarContent>
              </TableToolbar>
              <Table {...getTableProps()} aria-label="sample table">
                <TableHead>
                  <TableRow>
                    <TableExpandHeader {...getExpandHeaderProps()} />
                    {args.radio ? (
                      <th scope="col" />
                    ) : (
                      <TableSelectAll
                        {...(getSelectionProps() as TableSelectAllProps)}
                      />
                    )}
                    {headers.map((header) => {
                      const { key, ...headerProps } = getHeaderProps({
                        header,
                      });
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
                    : rows.map((row) => {
                        const { key, ...rowProps } = getRowProps({ row });
                        return (
                          <Fragment key={key}>
                            <TableExpandRow {...rowProps}>
                              <TableSelectRow
                                {...(getSelectionProps({
                                  row,
                                }) as TableSelectRowProps)}
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
                            </TableExpandRow>
                            <TableExpandedRow
                              colSpan={headers.length + 3}
                              className="demo-expanded-td"
                              {...getExpandedRowProps({ row })}>
                              <h3>Expandable row content</h3>
                              <div>Description here</div>
                            </TableExpandedRow>
                          </Fragment>
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
                      onClick: () => onSearchChange('', ''),
                    }}
                  />
                </div>
              )}
            </TableContainer>
          );
        }}
      </DataTable>
    );
  }
}

export default {
  title: 'Components/DataTable/Dynamic',
  component: DataTable,
  tags: ['carbon'],
  args: dataTableArgs,
  argTypes: dataTableArgTypes,
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta;

export const Default: StoryFn<DataTableStoryArgs> = (args) => {
  const [searchValue, setSearchValue] = useState('');
  return (
    <DynamicRows
      args={args}
      searchValue={searchValue}
      onSearchChange={(_evt, value = '') => setSearchValue(value)}
    />
  );
};

Default.args = {
  size: 'lg',
  useStaticWidth: false,
  useZebraStyles: false,
  isSortable: false,
  locale: 'en',
  radio: false,
};

Default.parameters = {
  a11y: {
    config: {
      // TableExpandHeader without enableToggle renders an empty th (upstream).
      rules: [{ id: 'empty-table-header', enabled: false }],
    },
  },
};

Default.argTypes = {
  size: {
    control: 'select',
    options: ['xs', 'sm', 'md', 'lg', 'xl'],
    description: 'Change the row height of table',
  },
  useStaticWidth: {
    control: 'boolean',
    description: 'If true, will use a width of "auto" instead of 100%',
  },
  useZebraStyles: {
    control: 'boolean',
    description: 'Add zebra striping to rows',
  },
  isSortable: {
    control: 'boolean',
    description: 'Specify if the rows are sortable',
  },
  locale: {
    description: 'Provide a string for the current locale',
  },
  radio: {
    description: 'Use radio-selection instead of multi-selection',
  },
};
