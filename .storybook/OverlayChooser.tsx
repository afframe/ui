import { ChooserTable, docsLink as link } from './chooser';

// Which tooltip or popover fits a task. Every docs page of the family shows
// this one table, so the guidance lives here and not in each MDX page.

const rows = [
  [
    'A short label or hint for a control, often icon-only, shown on hover or focus',
    link('Tooltip', 'components-tooltip'),
  ],
  [
    'Explain a term or phrase inside running text',
    link('DefinitionTooltip', 'components-definitiontooltip'),
  ],
  [
    'More information opened by click, Enter or Space, with links or actions inside; closes on Escape',
    link('Toggletip', 'components-toggletip'),
  ],
  [
    <>
      Custom floating content whose open state the app controls, such as a
      settings panel. It does not close itself on Escape; the app closes it in
      <code>onRequestClose</code>
    </>,
    link('Popover', 'components-popover'),
  ],
];

export function OverlayChooser() {
  return <ChooserTable head={['Task', 'Component']} rows={rows} />;
}
