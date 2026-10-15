import { ChooserTable, docsLink as link } from './chooser';

// Which card or tile fits a task. Every docs page of the family shows this
// one table, so the guidance lives here and not in each MDX page.

const rows = [
  [
    'A plain container, or a selectable or expandable area',
    link('Tile', 'components-tile'),
  ],
  [
    "New card layouts with Carbon's next card, a preview whose API may still change",
    link('preview__Card', 'preview-preview-card'),
  ],
  [
    "IBM's product card with actions and an overflow menu",
    link('ProductiveCard', 'components-cards-productivecard'),
  ],
  [
    "IBM's card with a large media area",
    link('ExpressiveCard', 'components-cards-expressivecard'),
  ],
];

export function CardChooser() {
  return <ChooserTable head={['Task', 'Component']} rows={rows} />;
}
