import { useLayoutEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { afframeA11y } from '../../../.storybook/afframeA11y.js';
import mdx from './Typography.mdx';
import './Typography.stories.css';

const meta = {
  title: 'Elements/Typography',
  tags: ['carbon'],
  parameters: {
    ...afframeA11y,
    docs: {
      page: mdx,
    },
  },
} satisfies Meta;

export default meta;

// Carbon's type sets as its Type sets page lists them; fluid paragraph and
// quotation join the expressive set. Older aliases (body-short, body-long,
// productive-heading), the deprecated caption tokens and the helper-text
// tokens are left out.
const sets = {
  Productive: [
    'body-compact-01',
    'body-01',
    'heading-compact-01',
    'heading-01',
    'heading-03',
    'heading-04',
    'heading-05',
    'heading-06',
    'heading-07',
  ],
  Expressive: [
    'body-compact-02',
    'body-02',
    'heading-compact-02',
    'heading-02',
    'fluid-heading-03',
    'fluid-heading-04',
    'fluid-heading-05',
    'fluid-heading-06',
    'fluid-paragraph-01',
    'fluid-quotation-01',
    'fluid-quotation-02',
    'fluid-display-01',
    'fluid-display-02',
    'fluid-display-03',
    'fluid-display-04',
  ],
  Utility: [
    'code-01',
    'code-02',
    'label-01',
    'label-02',
    'legal-01',
    'legal-02',
  ],
};

const properties = ['font-size', 'font-weight', 'line-height'] as const;

const sample = 'Faktura 2026-0142: 1 234,50 Kč, splatnost 07.10.2026';

// Theme classes declare the custom properties, so the values are read where
// the sample renders, from the same properties it uses.
function TokenRow({ token }: { token: string }) {
  const sampleRef = useRef<HTMLSpanElement>(null);
  const [values, setValues] = useState<string[]>([]);
  useLayoutEffect(() => {
    if (!sampleRef.current) return;
    const style = getComputedStyle(sampleRef.current);
    setValues(
      properties.map(
        (property) =>
          style.getPropertyValue(`--cds-${token}-${property}`).trim() ||
          'inherited'
      )
    );
  }, [token]);
  return (
    <tr>
      <td>
        <code>{token}</code>
      </td>
      <td>
        <code>{values.join(' / ')}</code>
      </td>
      <td>
        <span
          ref={sampleRef}
          style={{
            fontFamily: `var(--cds-${token}-font-family, inherit)`,
            fontSize: `var(--cds-${token}-font-size)`,
            fontWeight: `var(--cds-${token}-font-weight)`,
            lineHeight: `var(--cds-${token}-line-height)`,
            letterSpacing: `var(--cds-${token}-letter-spacing)`,
          }}>
          {sample}
        </span>
      </td>
    </tr>
  );
}

export const Default: StoryObj<typeof meta> = {
  render: () => (
    <div className="demo-type-sets">
      {Object.entries(sets).map(([set, tokens]) => (
        <table key={set} className="demo-type-table">
          <caption>{set}</caption>
          <thead>
            <tr>
              <th scope="col">Token</th>
              <th scope="col">Size, weight, line height</th>
              <th scope="col">Sample</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((token) => (
              <TokenRow key={token} token={token} />
            ))}
          </tbody>
        </table>
      ))}
    </div>
  ),
};
