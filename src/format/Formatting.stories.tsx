import type { Meta, StoryObj } from '@storybook/react-vite';
import { afframeA11y } from '../../.storybook/afframeA11y.js';
import './Formatting.stories.css';
import mdx from './Formatting.mdx';
import {
  formatAmount,
  formatDate,
  formatDateRange,
  formatNumber,
  getDateRangePreset,
  roundAmount,
} from './index.js';

const meta = {
  title: 'Getting Started/Formatting',
  tags: ['afframe'],
  parameters: {
    ...afframeA11y,
    docs: {
      page: mdx,
    },
  },
} satisfies Meta;

export default meta;

const now = new Date('2026-10-06T22:30:00Z');
// Each row runs the real function, so the page shows today's output.
const examples: [string, () => unknown][] = [
  ['formatAmount(1234.5)', () => formatAmount(1234.5)],
  ['formatAmount(-0.004)', () => formatAmount(-0.004)],
  [
    "formatAmount(1234.5, { currency: 'EUR', locale: 'en-GB' })",
    () => formatAmount(1234.5, { currency: 'EUR', locale: 'en-GB' }),
  ],
  ['roundAmount(1.005)', () => roundAmount(1.005)],
  ['formatNumber(1234567.891)', () => formatNumber(1234567.891)],
  [
    'formatNumber(1234567.891, { maximumFractionDigits: 3 })',
    () => formatNumber(1234567.891, { maximumFractionDigits: 3 }),
  ],
  [
    "formatDate(new Date('2026-10-06T22:30:00Z'))",
    () => formatDate(new Date('2026-10-06T22:30:00Z')),
  ],
  ["formatDate('2026-10-07')", () => formatDate('2026-10-07')],
  [
    "formatDate('2026-10-07T10:05:00Z', { dateStyle: 'medium', timeStyle: 'short' })",
    () =>
      formatDate('2026-10-07T10:05:00Z', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
  ],
  [
    "formatDate('2026-10-07', { dateStyle: 'long' })",
    () => formatDate('2026-10-07', { dateStyle: 'long' }),
  ],
  [
    "formatDateRange('2026-10-01', '2026-10-31')",
    () => formatDateRange('2026-10-01', '2026-10-31'),
  ],
  [
    "getDateRangePreset('thisMonth', { now })",
    () => JSON.stringify(getDateRangePreset('thisMonth', { now })),
  ],
];

export const Examples: StoryObj<typeof meta> = {
  render: () => (
    <table className="demo-format-table">
      <caption>Calls and their output; now is 7 October 2026 in Prague</caption>
      <thead>
        <tr>
          <th scope="col">Call</th>
          <th scope="col">Output</th>
        </tr>
      </thead>
      <tbody>
        {examples.map(([call, run]) => (
          <tr key={call}>
            <td>
              <code>{call}</code>
            </td>
            <td>
              <code>{String(run())}</code>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
};
