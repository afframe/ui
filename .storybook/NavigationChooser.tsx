import { ChooserTable, docsLink as link } from './chooser';

// Which navigation component fits a task. Every docs page of the family shows
// this one table, so the guidance lives here and not in each MDX page.

const rows = [
  [
    'Move between related views at the same level of a page',
    link('Tabs', 'components-tabs'),
  ],
  [
    'Switch between alternate views of the same content, in the same space',
    link('ContentSwitcher', 'components-contentswitcher'),
  ],
  [
    'Show and hide sections of a page, stacked under their headings',
    link('Accordion', 'components-accordion'),
  ],
  [
    'Show where the page sits in a hierarchy and go back up a level',
    link('Breadcrumb', 'components-breadcrumb'),
  ],
  [
    'Go to another page or resource, inline in text or on its own',
    link('Link', 'components-link'),
  ],
  [
    'Split a long list or table into pages, with a choice of page size',
    link('Pagination', 'components-pagination'),
  ],
  [
    'Page through a set of pages by number',
    link('PaginationNav', 'components-paginationnav'),
  ],
  [
    'Navigation across the whole app, in a side panel',
    link('SideNav', 'components-ui-shell-sidenav'),
  ],
];

export function NavigationChooser() {
  return <ChooserTable head={['Task', 'Component']} rows={rows} />;
}
