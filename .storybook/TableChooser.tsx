import { ChooserTable, docsLink as link } from './chooser';

// Which table or filter component fits a task. Every docs page of the family
// shows this one table, so the guidance lives here and not in each MDX page.

const rows = [
  [
    'Compose a table from Carbon table parts',
    link('DataTable', 'components-datatable-basic'),
  ],
  [
    'A ready grid with sorting, filtering, paging, selection, resizing, pinned columns, inline edit and virtual scroll',
    link('DataGrid', 'components-datagrid'),
  ],
  [
    'A loading placeholder for a table',
    link('DataTableSkeleton', 'components-datatable-skeleton'),
  ],
  [
    'Filter by checkbox groups, in a side panel or a toolbar popover',
    link('FilterPanel', 'components-filterpanel'),
  ],
  [
    'Build rules from properties, operators and values',
    link('ConditionBuilder', 'components-conditionbuilder'),
  ],
];

export function TableChooser() {
  return <ChooserTable head={['Task', 'Component']} rows={rows} />;
}
