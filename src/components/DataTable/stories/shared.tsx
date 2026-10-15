/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, story args type, invoice example data. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ArgTypes } from '@storybook/react-vite';
import { formatAmount, formatDate } from '../../../index.js';
import { paymentTermItems } from '../../../../.storybook/exampleData.js';
import type { DataTableProps } from '../../../index.js';

export type DataTableStoryArgs = Required<
  Pick<
    DataTableProps<unknown, unknown[]>,
    | 'isSortable'
    | 'locale'
    | 'overflowMenuOnHover'
    | 'radio'
    | 'size'
    | 'stickyHeader'
    | 'useStaticWidth'
    | 'useZebraStyles'
  >
>;

export const dataTableArgs: Partial<DataTableStoryArgs> = {
  isSortable: false,
  locale: 'en',
  size: 'lg',
  stickyHeader: false,
  useStaticWidth: false,
  useZebraStyles: false,
};

export const dataTableArgTypes = {
  filterRows: { control: false },
  headers: { control: false },
  isSortable: {
    control: 'boolean',
    description: 'Enable sorting for the table headers.',
  },
  locale: {
    control: 'text',
    description: 'Provide a locale for the table.',
  },
  rows: { control: false },
  size: {
    control: 'select',
    options: ['xs', 'sm', 'md', 'lg', 'xl'],
    description: 'Change the row height of the table.',
  },
  sortRow: { control: false },
  stickyHeader: {
    control: 'boolean',
    description: 'Keep the table header visible while scrolling.',
  },
  translateWithId: { control: false },
  useStaticWidth: {
    control: 'boolean',
    description: 'Use a width of auto instead of 100%.',
  },
  useZebraStyles: {
    control: 'boolean',
    description: 'Add zebra striping to the table rows.',
  },
} satisfies ArgTypes;

// Amounts share one digit-group width and due dates one month, so Carbon's
// string sort orders the formatted cells correctly.
const paymentTerm = (id: string) =>
  paymentTermItems.find((item) => item.id === id)?.text ?? id;

export const rows = [
  {
    id: 'a',
    name: 'INV-2026-0045',
    protocol: 'Lakeside Furniture',
    port: formatAmount(4800),
    rule: paymentTerm('net-30'),
    attached_groups: formatDate('2026-10-07'),
    status: 'Paid',
  },
  {
    id: 'b',
    name: 'INV-2026-0042',
    protocol: 'Acme Trading',
    port: formatAmount(1250),
    rule: paymentTerm('net-14'),
    attached_groups: formatDate('2026-10-14'),
    status: 'Sent',
  },
  {
    id: 'c',
    name: 'INV-2026-0043',
    protocol: 'Birch Studio',
    port: formatAmount(9990),
    rule: paymentTerm('due-on-receipt'),
    attached_groups: formatDate('2026-10-02'),
    status: 'Overdue',
  },
  {
    id: 'd',
    name: 'INV-2026-0047',
    protocol: 'Cedar Logistics',
    port: formatAmount(3600),
    rule: paymentTerm('net-30'),
    attached_groups: formatDate('2026-10-21'),
    status: 'Draft',
  },
  {
    id: 'e',
    name: 'INV-2026-0044',
    protocol: 'Delta Foods',
    port: formatAmount(7250),
    rule: paymentTerm('end-of-month'),
    attached_groups: formatDate('2026-10-31'),
    status: 'Sent',
  },
  {
    id: 'f',
    name: 'INV-2026-0046',
    protocol: 'Acme Trading',
    port: formatAmount(2480),
    rule: paymentTerm('net-7'),
    attached_groups: formatDate('2026-10-09'),
    status: 'Overdue',
  },
];

export const headers = [
  {
    key: 'name',
    header: 'Invoice',
  },
  {
    key: 'protocol',
    header: 'Customer',
  },
  {
    key: 'port',
    header: 'Amount',
  },
  {
    key: 'rule',
    header: 'Payment terms',
  },
  {
    key: 'attached_groups',
    header: 'Due date',
  },
  {
    key: 'status',
    header: 'Status',
  },
];

export const batchActionClick =
  <T,>(selectedRows: T[], onClick: (rows: T[]) => void = () => {}) =>
  () =>
    onClick(selectedRows);
