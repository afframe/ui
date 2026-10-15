import { AnchorMdx } from '@storybook/addon-docs/blocks';
import type { ReactNode } from 'react';
import { ChooserTable } from './chooser';

// Which dialog or flow fits a task. Every docs page of the family shows this
// one table, so the guidance lives here and not in each MDX page. AnchorMdx
// turns `?path=` links into manager navigation, as links written in MDX are.

const docs = (id: string) => `?path=/docs/${id}--overview`;

const rows: [task: string, size: string, surface: string, ...ReactNode[]][] = [
  [
    'Create a record with one to three fields',
    'Small',
    'Modal',
    link('CreateModal', 'components-create-and-edit-createmodal'),
  ],
  [
    'Create a record next to the page it belongs to',
    'Medium',
    'Side panel',
    link('CreateSidePanel', 'components-create-and-edit-createsidepanel'),
  ],
  [
    'Edit a few fields next to the page',
    'Medium',
    'Side panel',
    link('EditSidePanel', 'components-create-and-edit-editsidepanel'),
  ],
  [
    'Edit a long record in sections',
    'Large',
    'Tearsheet',
    link('EditTearsheet', 'components-create-and-edit-edittearsheet'),
  ],
  [
    'Edit a record on its own page',
    'Full page',
    'Page',
    link('EditFullPage', 'components-create-and-edit-editfullpage'),
  ],
  [
    'Confirm a delete or remove',
    'Small',
    'Modal',
    link('RemoveModal', 'components-task-dialogs-removemodal'),
  ],
  [
    'Import records from a file',
    'Small',
    'Modal',
    link('ImportModal', 'components-task-dialogs-importmodal'),
  ],
  [
    'Export records to a file',
    'Small',
    'Modal',
    link('ExportModal', 'components-task-dialogs-exportmodal'),
  ],
  [
    'Generate or edit an API key',
    'Small',
    'Modal',
    link('APIKeyModal', 'components-task-dialogs-apikeymodal'),
  ],
  [
    'Show product, version and licence details',
    'Small',
    'Modal',
    link('AboutModal', 'components-task-dialogs-aboutmodal'),
  ],
  [
    'Pick items from a list or a hierarchy',
    'Large',
    'Inline or tearsheet',
    link('AddSelect', 'components-addselect'),
    ', ',
    link('SingleAddSelect', 'components-singleaddselect'),
    ', ',
    link('MultiAddSelect', 'components-multiaddselect'),
  ],
  [
    'Any other short task or message, from props',
    'Extra small to large',
    'Modal',
    link('Modal', 'components-modal'),
  ],
  [
    'A modal with your own header, body and footer',
    'Extra small to large',
    'Modal',
    link('ComposedModal', 'components-composedmodal'),
  ],
  [
    'A native dialog with your own layout',
    'Any',
    'Dialog',
    link('preview__Dialog', 'preview-preview-dialog'),
  ],
  [
    'A large task of your own, in steps or tabs',
    'Large',
    'Tearsheet',
    link('preview__Tearsheet', 'components-tearsheet'),
  ],
  [
    'Your own content next to the page',
    'Medium',
    'Side panel',
    link('SidePanel', 'components-sidepanel'),
  ],
];

function link(name: string, id: string) {
  return (
    <AnchorMdx key={name} href={docs(id)}>
      <code>{name}</code>
    </AnchorMdx>
  );
}

export function DialogChooser() {
  return (
    <ChooserTable
      head={['Task', 'Size', 'Surface', 'Component']}
      rows={rows.map(([task, size, surface, ...component]) => [
        task,
        size,
        surface,
        component,
      ])}
    />
  );
}

/** Which of the three AddSelect exports to use; shown on all three pages. */
export function AddSelectGuidance() {
  return (
    <ul>
      <li>
        {link('AddSelect', 'components-addselect')}: start here. It is IBM's
        composable successor, a preview in IBM Products 2.100.0, and moves into
        Carbon v12 core (
        <AnchorMdx href="https://github.com/carbon-design-system/carbon/issues/22920">
          carbon issue #22920
        </AnchorMdx>
        ). You build the picker from its parts. It has no tearsheet and no
        built-in modifiers, sort or filter.
      </li>
      <li>
        {link('SingleAddSelect', 'components-singleaddselect')} and{' '}
        {link('MultiAddSelect', 'components-multiaddselect')}: stable,
        ready-made tearsheet flows with modifiers, sort and filter built in. IBM
        deprecates them upstream, with no deprecation marker in 2.100.0. Use
        them until you migrate to <code>AddSelect</code>.
      </li>
    </ul>
  );
}
