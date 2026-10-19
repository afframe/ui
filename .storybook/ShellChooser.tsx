import { ChooserTable, docsLink as link } from './chooser';

// Which shell or header part fits a task. The Carbon shell, Labs shell and
// NotificationsPanel pages show this one table, so the guidance lives here.

const rows = [
  [
    'An app header and side nav built from Carbon parts',
    [
      link('Header', 'components-ui-shell-header'),
      link('SideNav', 'components-ui-shell-sidenav'),
    ],
  ],
  [
    'The Labs shell: header popovers, overflow panel, multi-level side nav',
    [
      link('UIShell examples', 'components-ui-shell-examples'),
      link('SideNavLabs', 'components-ui-shell-sidenavlabs'),
    ],
  ],
  [
    'A panel of app links from a header action',
    [
      link('HeaderPanel', 'components-ui-shell-header'),
      link('Switcher', 'components-ui-shell-header'),
    ],
  ],
  [
    'Help links from the header',
    link('HelpMenu', 'components-ui-shell-helpmenu'),
  ],
  [
    'Switch between environments',
    link('EnvironmentSwitcher', 'components-ui-shell-environmentswitcher'),
  ],
  [
    'Notifications from the header bell',
    link('NotificationsPanel', 'components-ui-shell-notificationspanel'),
  ],
  [
    'The signed-in user and sign out',
    [
      link('Profile', 'components-ui-shell-profile'),
      link('LogoutTile', 'components-ui-shell-logouttile'),
    ],
  ],
  [
    'Days left in a trial',
    link('TrialCountdown', 'components-ui-shell-trialcountdown'),
  ],
  [
    'The session is ending or has ended',
    link('LogoutBanner', 'components-ui-shell-logoutbanner'),
  ],
  [
    'Any other message that needs a decision',
    link(
      'ActionableNotification',
      'components-notifications-actionablenotification'
    ),
  ],
];

export function ShellChooser() {
  return <ChooserTable head={['Task', 'Component']} rows={rows} />;
}
