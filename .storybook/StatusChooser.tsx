import { ChooserTable, docsLink as link } from './chooser';

// Which status component fits a task. Every docs page of the family shows
// this one table, so the guidance lives here and not in each MDX page.

const rows = [
  [
    'Show the state of an item in app code, with labels from messages',
    link('StatusIndicator', 'components-statusindicator'),
  ],
  [
    "Carbon's preview parts that StatusIndicator builds on",
    [
      link('IconIndicator', 'preview-preview-iconindicator'),
      ', ',
      link('ShapeIndicator', 'preview-preview-shapeindicator'),
    ],
  ],
  ['A category, not a state', link('Tag', 'components-tag')],
  [
    'Show the steps of a task',
    link('ProgressIndicator', 'components-progressindicator'),
  ],
];

export function StatusChooser() {
  return <ChooserTable head={['Task', 'Component']} rows={rows} />;
}
