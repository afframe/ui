import { ChooserTable, docsLink as link } from './chooser';

// Which notification component fits a task. Every docs page of the family
// shows this one table, so the guidance lives here and not in each MDX page.

const rows = [
  [
    'A message in context that stays until the user closes it',
    link('InlineNotification', 'components-notifications-inlinenotification'),
  ],
  [
    'A short-lived, app-level message',
    link('ToastNotification', 'components-notifications-toastnotification'),
  ],
  [
    'A message that needs a decision',
    link(
      'ActionableNotification',
      'components-notifications-actionablenotification'
    ),
  ],
  [
    'Static information the user cannot close',
    link('Callout', 'components-notifications-callout'),
  ],
  [
    'An onboarding hint',
    link('InlineTip', 'preview-previewcandidate-inlinetip'),
  ],
];

export function NotificationChooser() {
  return <ChooserTable head={['Task', 'Component']} rows={rows} />;
}
