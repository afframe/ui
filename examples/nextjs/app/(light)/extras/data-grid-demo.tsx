'use client';
import { DataGrid, dataGridSorting } from '@afframe/ui';

const data = [
  { quarter: 'Q1', revenue: 12 },
  { quarter: 'Q2', revenue: 18 },
  { quarter: 'Q3', revenue: 9 },
];

// Column definitions hold functions once a feature reads them, so the grid's
// options live in a client file.
export function DataGridDemo() {
  return (
    <DataGrid
      title="Revenue"
      options={{
        features: dataGridSorting,
        columns: [
          { accessorKey: 'quarter', header: 'Quarter' },
          { accessorKey: 'revenue', header: 'Revenue' },
        ],
        data,
      }}
    />
  );
}
