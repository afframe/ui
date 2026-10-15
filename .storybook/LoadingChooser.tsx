import { ChooserTable, docsLink as link } from './chooser';

// Which loading or progress component fits a task. Every docs page of the
// family shows this one table, so the guidance lives here and not in each
// MDX page.

const rows = [
  [
    'A whole region or page is blocked while it loads',
    link('Loading', 'components-loading'),
  ],
  [
    'A small part of the page is busy after an action, such as a save',
    link('InlineLoading', 'components-inlineloading'),
  ],
  [
    'A long task, with a known or an unknown end',
    link('ProgressBar', 'components-progressbar'),
  ],
  ['An answer is being generated', link('Processing', 'components-processing')],
  [
    "The layout is known before the content arrives. A component's own Skeleton export, such as DataTableSkeleton, comes first",
    [
      link('SkeletonText', 'components-skeletons-skeletontext'),
      ', ',
      link('SkeletonPlaceholder', 'components-skeletons-skeletonplaceholder'),
      ', ',
      link('SkeletonIcon', 'components-skeletons-skeletonicon'),
    ],
  ],
  [
    'AI-generated content is loading',
    link('AISkeleton', 'components-skeletons-aiskeleton'),
  ],
  [
    'Show the steps of a task and where the user is',
    link('ProgressIndicator', 'components-progressindicator'),
  ],
];

export function LoadingChooser() {
  return <ChooserTable head={['Task', 'Component']} rows={rows} />;
}
