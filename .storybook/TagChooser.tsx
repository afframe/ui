import { ChooserTable, docsLink as link } from './chooser';

// Which tag component fits a task. Every docs page of the family shows this
// one table, so the guidance lives here and not in each MDX page.

const rows = [
  [
    'Label, filter or categorise an item. The Tag page covers the operational, dismissible and selectable tags',
    link('Tag', 'components-tag'),
  ],
  [
    'A category whose colour carries meaning, with a tooltip',
    link('AccentTag', 'components-accenttag'),
  ],
  [
    'Many tags in a row, the rest behind +N',
    link('TagSet', 'components-tagset'),
  ],
  [
    'Any items in a row, the rest behind +N',
    link('TagOverflow', 'components-tagoverflow'),
  ],
];

export function TagChooser() {
  return <ChooserTable head={['Task', 'Component']} rows={rows} />;
}
