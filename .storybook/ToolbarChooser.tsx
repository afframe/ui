import { ChooserTable, docsLink as link } from './chooser';

// Which toolbar or action row fits a task. Every docs page of the family
// shows this one table, so the guidance lives here and not in each MDX page.

const rows = [
  [
    'A row of icon actions that moves into an overflow menu as the width shrinks',
    link('ActionBar', 'utilities-actionbar'),
  ],
  [
    'A tool bar of grouped controls with arrow-key focus, horizontal or vertical',
    link('previewCandidate__Toolbar', 'preview-previewcandidate-toolbar'),
  ],
  [
    'Actions, search and batch actions above a data table',
    link('TableToolbar', 'components-datatable-toolbar'),
  ],
  [
    'Page title, breadcrumbs, page actions and tabs at the top of a page',
    link('PageHeader', 'components-pageheader'),
  ],
];

export function ToolbarChooser() {
  return <ChooserTable head={['Task', 'Component']} rows={rows} />;
}
