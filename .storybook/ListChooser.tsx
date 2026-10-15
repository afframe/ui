import { ChooserTable, docsLink as link } from './chooser';

// Which list component fits a task. Every docs page of the family shows this
// one table, so the guidance lives here and not in each MDX page.

const rows = [
  [
    'Label and value pairs',
    link('DescriptionList', 'components-descriptionlist'),
  ],
  [
    'Rows with columns, optionally selectable',
    link('StructuredList', 'components-structuredlist'),
  ],
  [
    'Items with actions or search in a container',
    link('ContainedList', 'components-containedlist'),
  ],
  ['Steps in order', link('OrderedList', 'components-orderedlist')],
  ['Items in no order', link('UnorderedList', 'components-unorderedlist')],
  [
    'A long list behind "View more"',
    link(
      'previewCandidate__TruncatedList',
      'preview-previewcandidate-truncatedlist'
    ),
  ],
  [
    'One line cut with an ellipsis',
    link('TruncatedText', 'components-truncatedtext'),
  ],
  ['Nested items', link('TreeView', 'components-treeview')],
];

export function ListChooser() {
  return <ChooserTable head={['Task', 'Component']} rows={rows} />;
}
