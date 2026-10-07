/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and icons from @afframe/ui, story styles in CSS, deprecated TableSlugRow dropped from subcomponents, AILabel callout styles from AILabel/ailabel-story.css, docs page is DataTable.mdx, visually hidden text in empty header cells and expanded row heading h6 to h3 (axe empty-table-header, heading-order). Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { Fragment } from 'react';
import { FolderOpen, Folders, View } from '../../../icons.js';
import {
  AILabel,
  AILabelActions,
  AILabelContent,
  Button,
  DataTable,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableDecoratorRow,
  TableExpandHeader,
  TableExpandRow,
  TableExpandedRow,
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
import '../../AILabel/ailabel-story.css';
import './datatable-story.css';

export default {
  title: 'Components/DataTable/WithAILabel',
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

const columnAILabelHeaders = [
  {
    key: 'name',
    header: 'Name',
  },
  {
    key: 'protocol',
    header: 'Protocol',
  },
  {
    key: 'port',
    header: 'Port',
  },
  {
    key: 'rule',
    header: 'Rule',
  },
  {
    key: 'attached_groups',
    header: 'Attached groups',
    decorator: (
      <AILabel
        className="ai-label-container"
        autoAlign={false}
        align="bottom-right">
        <AILabelContent>
          <div>
            <p className="secondary">AI Explained</p>
            <h2 className="ai-label-heading">84%</h2>
            <p className="secondary bold">Confidence score</p>
            <p className="secondary">
              Lorem ipsum dolor sit amet, di os consectetur adipiscing elit, sed
              do eiusmod tempor incididunt ut fsil labore et dolore magna
              aliqua.
            </p>
            <hr />
            <p className="secondary">Model type</p>
            <p className="bold">Foundation model</p>
          </div>
          <AILabelActions>
            <IconButton kind="ghost" label="View">
              <View />
            </IconButton>
            <IconButton kind="ghost" label="Open Folder">
              <FolderOpen />
            </IconButton>
            <IconButton kind="ghost" label="Folders">
              <Folders />
            </IconButton>
            <Button>View details</Button>
          </AILabelActions>
        </AILabelContent>
      </AILabel>
    ),
  },
  {
    key: 'status',
    header: 'Status',
  },
];

const aiLabel = (
  <AILabel className="ai-label-container">
    <AILabelContent>
      <div>
        <p className="secondary">AI Explained</p>
        <h2 className="ai-label-heading">84%</h2>
        <p className="secondary bold">Confidence score</p>
        <p className="secondary">
          Lorem ipsum dolor sit amet, di os consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut fsil labore et dolore magna aliqua.
        </p>
        <hr />
        <p className="secondary">Model type</p>
        <p className="bold">Foundation model</p>
      </div>
      <AILabelActions>
        <IconButton kind="ghost" label="View">
          <View />
        </IconButton>
        <IconButton kind="ghost" label="Open Folder">
          <FolderOpen />
        </IconButton>
        <IconButton kind="ghost" label="Folders">
          <Folders />
        </IconButton>
        <Button>View details</Button>
      </AILabelActions>
    </AILabelContent>
  </AILabel>
);

export const AILabelWithSelection: StoryFn<DataTableStoryArgs> = (args) => (
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
              <th scope="col">
                <span className="cds--visually-hidden">Row decorator</span>
              </th>
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
            {rows.map((row, i) => (
              <TableRow {...getRowProps({ row })}>
                {i === 3 || i === 4 || i === 1 ? (
                  <TableDecoratorRow decorator={aiLabel} />
                ) : (
                  <TableCell />
                )}
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

export const AILabelWithRadioSelection: StoryFn<DataTableStoryArgs> = (
  args
) => (
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
                <span className="cds--visually-hidden">Row decorator</span>
              </th>
              <th scope="col">
                <span className="cds--visually-hidden">Row decorator</span>
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
            {rows.map((row, i) => (
              <TableRow {...getRowProps({ row })}>
                {i === 3 || i === 4 || i === 1 ? (
                  <TableDecoratorRow decorator={aiLabel} />
                ) : (
                  <TableCell />
                )}
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

AILabelWithRadioSelection.args = { radio: true };
AILabelWithRadioSelection.argTypes = {
  radio: { table: { readonly: true } },
};

export const AILabelWithSelectionAndExpansion: StoryFn<DataTableStoryArgs> = (
  args
) => (
  <DataTable rows={rows} headers={headers} {...args}>
    {({
      rows,
      headers,
      getHeaderProps,
      getRowProps,
      getExpandedRowProps,
      getExpandHeaderProps,
      getSelectionProps,
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
              <th scope="col">
                <span className="cds--visually-hidden">Row decorator</span>
              </th>
              <TableExpandHeader
                enableToggle={true}
                {...getExpandHeaderProps()}
              />
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
            {rows.map((row, i) => (
              <Fragment key={row.id}>
                <TableExpandRow {...getRowProps({ row })}>
                  {i === 3 || i === 4 || i === 1 ? (
                    <TableDecoratorRow decorator={aiLabel} />
                  ) : (
                    <TableDecoratorRow decorator={null} />
                  )}
                  <TableSelectRow
                    {...(getSelectionProps({ row }) as TableSelectRowProps)}
                  />
                  {row.cells.map((cell) => (
                    <TableCell {...getCellProps({ cell })}>
                      {cell.value}
                    </TableCell>
                  ))}
                </TableExpandRow>
                <TableExpandedRow
                  colSpan={headers.length + 3}
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

export const AILabelWithExpansion: StoryFn<DataTableStoryArgs> = (args) => (
  <DataTable rows={rows} headers={headers} {...args}>
    {({
      rows,
      headers,
      getHeaderProps,
      getRowProps,
      getExpandedRowProps,
      getExpandHeaderProps,
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
              <th scope="col">
                <span className="cds--visually-hidden">Row decorator</span>
              </th>
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
            {rows.map((row, i) => (
              <Fragment key={row.id}>
                <TableExpandRow {...getRowProps({ row })}>
                  {i === 3 || i === 4 || i === 1 ? (
                    <TableDecoratorRow decorator={aiLabel} />
                  ) : (
                    <TableDecoratorRow decorator={null} />
                  )}
                  {row.cells.map((cell) => (
                    <TableCell {...getCellProps({ cell })}>
                      {cell.value}
                    </TableCell>
                  ))}
                </TableExpandRow>
                <TableExpandedRow
                  colSpan={headers.length + 2}
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

AILabelWithExpansion.argTypes = { radio: { control: false } };

export const ColumnAILabelWithSelectionAndExpansion: StoryFn<
  DataTableStoryArgs
> = (args) => (
  <DataTable rows={rows} headers={columnAILabelHeaders} {...args}>
    {({
      rows,
      headers,
      getHeaderProps,
      getRowProps,
      getExpandedRowProps,
      getExpandHeaderProps,
      getSelectionProps,
      getTableProps,
      getTableContainerProps,
      getCellProps,
    }) => (
      <TableContainer
        title="DataTable"
        description="With expansion"
        className="ai-label-column-table"
        {...getTableContainerProps()}>
        <Table {...getTableProps()} aria-label="sample table">
          <TableHead>
            <TableRow>
              <TableExpandHeader
                enableToggle={true}
                {...getExpandHeaderProps()}
              />
              <TableSelectAll
                {...(getSelectionProps() as TableSelectAllProps)}
              />
              {headers.map((header) => (
                <TableHeader
                  {...(getHeaderProps({
                    header,
                  }) as TableHeaderProps)}>
                  {header.header}
                </TableHeader>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              return (
                <Fragment key={row.id}>
                  <TableExpandRow {...getRowProps({ row })}>
                    <TableSelectRow
                      {...(getSelectionProps({ row }) as TableSelectRowProps)}
                    />
                    {row.cells.map((cell) => {
                      return (
                        <TableCell {...getCellProps({ cell })}>
                          {cell.value}
                        </TableCell>
                      );
                    })}
                  </TableExpandRow>
                  <TableExpandedRow
                    colSpan={headers.length + 2}
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
      </TableContainer>
    )}
  </DataTable>
);

export const ColumnAILabelSort: StoryFn<DataTableStoryArgs> = (args) => (
  <DataTable rows={rows} headers={columnAILabelHeaders} {...args}>
    {({
      rows,
      headers,
      getHeaderProps,
      getRowProps,
      getTableProps,
      getCellProps,
    }) => (
      <TableContainer
        title="DataTable"
        description="With sorting"
        className="ai-label-column-table">
        <Table {...getTableProps()} aria-label="sample table">
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableHeader
                  {...(getHeaderProps({
                    header,
                    isSortable: args.isSortable,
                  }) as TableHeaderProps)}>
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

ColumnAILabelSort.args = { isSortable: true };
ColumnAILabelSort.argTypes = {
  isSortable: { table: { readonly: true } },
  radio: { control: false },
};

export const FullTableAI: StoryFn<DataTableStoryArgs> = (args) => (
  <DataTable rows={rows} headers={headers} {...args}>
    {({
      rows,
      headers,
      getHeaderProps,
      getRowProps,
      getTableProps,
      getCellProps,
    }) => (
      <TableContainer
        decorator={aiLabel}
        aiEnabled
        title="DataTable"
        description="AI, full table"
        className="ai-label-column-table">
        <Table {...getTableProps()} aria-label="sample table">
          <TableHead>
            <TableRow>
              {headers.map((header) => (
                <TableHeader
                  {...(getHeaderProps({
                    header,
                    isSortable: args.isSortable,
                  }) as TableHeaderProps)}>
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

FullTableAI.args = { isSortable: true };
FullTableAI.argTypes = {
  isSortable: { table: { readonly: true } },
  radio: { control: false },
};
