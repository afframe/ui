import { ChooserTable, docsLink as link } from './chooser';

// Which amount or number component fits a task. Every docs page of the
// family shows this one table, so the guidance lives here and not in each
// MDX page.

const rows = [
  [
    'An amount of money in text or a table cell',
    link('Amount', 'components-amount'),
  ],
  ['A headline figure, shortened', link('BigNumber', 'components-bignumber')],
  ['Type an amount', link('AmountInput', 'components-amountinput')],
  [
    'Format an amount or a number in code',
    <>
      {link('formatAmount', 'getting-started-formatting')} /{' '}
      {link('formatNumber', 'getting-started-formatting')}
    </>,
  ],
];

export function NumberChooser() {
  return <ChooserTable head={['Task', 'Component']} rows={rows} />;
}
