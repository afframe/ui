import * as type from '@carbon/type';
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

// Carbon's current type sets; the older bodyShort, bodyLong and
// productiveHeading names are aliases and left out.
const sets = {
  Utility: [
    'caption01',
    'label01',
    'label02',
    'helperText01',
    'helperText02',
    'legal01',
    'legal02',
    'code01',
    'code02',
  ],
  Body: ['bodyCompact01', 'bodyCompact02', 'body01', 'body02'],
  Heading: [
    'headingCompact01',
    'headingCompact02',
    'heading01',
    'heading02',
    'heading03',
    'heading04',
    'heading05',
    'heading06',
    'heading07',
  ],
  Expressive: [
    'fluidHeading03',
    'fluidHeading04',
    'fluidHeading05',
    'fluidHeading06',
    'fluidParagraph01',
    'fluidQuotation01',
    'fluidQuotation02',
    'fluidDisplay01',
    'fluidDisplay02',
    'fluidDisplay03',
    'fluidDisplay04',
  ],
};

const kebab = (name: string) =>
  name.replace(/([a-z])([A-Z0-9])/g, '$1-$2').toLowerCase();

type TypeStyle = {
  fontSize?: string;
  fontWeight?: number | string;
  lineHeight?: number | string;
  letterSpacing?: number | string;
};
const styleOf = (name: string) =>
  (type as unknown as Record<string, TypeStyle>)[name] ?? {};

const sample = 'Faktura 2026-0142: 1 234,50 Kč, splatnost 07.10.2026';

export const Default: StoryObj<typeof meta> = {
  render: () => (
    <div className="demo-type-sets">
      {Object.entries(sets).map(([set, names]) => (
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
            {names.map((name) => {
              const token = kebab(name);
              const { fontSize, fontWeight, lineHeight } = styleOf(name);
              return (
                <tr key={name}>
                  <td>
                    <code>{token}</code>
                  </td>
                  <td>
                    <code>
                      {fontSize} / {fontWeight} / {lineHeight}
                    </code>
                  </td>
                  <td>
                    <span
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
            })}
          </tbody>
        </table>
      ))}
    </div>
  ),
};
