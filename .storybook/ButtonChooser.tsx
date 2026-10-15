import { ChooserTable, docsLink as link } from './chooser';

// Which button or action menu fits a task. Every docs page of the family
// shows this one table, so the guidance lives here and not in each MDX page.

const rows = [
  ['One action with a text label', link('Button', 'components-button')],
  [
    <>
      One action shown as an icon only. Use it instead of{' '}
      <code>Button hasIconOnly</code>
    </>,
    link('IconButton', 'components-iconbutton'),
  ],
  [
    'Two or three actions that close a form or a step, side by side',
    link('ButtonSet', 'components-buttonset'),
  ],
  [
    'One main action with related actions in a menu',
    link('ComboButton', 'components-combobutton'),
  ],
  [
    'A labelled menu of actions, none of them the main one',
    link('MenuButton', 'components-menubutton'),
  ],
  [
    'Actions on a row, card or tile, behind an icon',
    link('OverflowMenu', 'components-overflowmenu'),
  ],
  [
    'Copy a value shown next to the button',
    link('CopyButton', 'components-copybutton'),
  ],
  [
    'Show code or a long value with its own copy button',
    link('CodeSnippet', 'components-codesnippet'),
  ],
];

export function ButtonChooser() {
  return <ChooserTable head={['Task', 'Component']} rows={rows} />;
}
