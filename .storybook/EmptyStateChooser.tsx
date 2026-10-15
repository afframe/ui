import { ChooserTable, docsLink as link } from './chooser';

// Which empty or error state fits a task. Every docs page of the family
// shows this one table, so the guidance lives here and not in each MDX page.

const rows = [
  [
    'Nothing has been created yet',
    link('NoDataEmptyState', 'components-empty-states-nodataemptystate'),
  ],
  [
    'A search or a filter matches nothing',
    link('NotFoundEmptyState', 'components-empty-states-notfoundemptystate'),
  ],
  [
    'Content could not be loaded',
    link('ErrorEmptyState', 'components-empty-states-erroremptystate'),
  ],
  [
    'The user has no access',
    link(
      'UnauthorizedEmptyState',
      'components-empty-states-unauthorizedemptystate'
    ),
  ],
  [
    'No tags yet',
    link('NoTagsEmptyState', 'components-empty-states-notagsemptystate'),
  ],
  [
    'No notifications',
    link(
      'NotificationsEmptyState',
      'components-empty-states-notificationsemptystate'
    ),
  ],
  [
    'Any other cause, with a custom picture',
    link('EmptyState', 'components-empty-states-emptystate'),
  ],
  [
    'The whole page fails: 403, 404 or 500',
    link('FullPageError', 'components-fullpageerror'),
  ],
  [
    'Catch a render error and show one of the above as the fallback',
    link('ErrorBoundary', 'utilities-errorboundary'),
  ],
];

export function EmptyStateChooser() {
  return <ChooserTable head={['Task', 'Component']} rows={rows} />;
}
