import type { Meta, StoryObj } from '@storybook/react-vite';
import { afframeA11y } from '../../../.storybook/afframeA11y.js';
import { formatTokenName, g100, white } from '../../tokens.js';
import mdx from './Tokens.mdx';
import './Tokens.stories.css';

const sample = [
  'background',
  'layer01',
  'textPrimary',
  'interactive',
  'borderSubtle01',
  'focus',
] as const;

const meta = {
  title: 'Elements/Tokens',
  tags: ['afframe'],
  parameters: {
    ...afframeA11y,
    docs: {
      page: mdx,
    },
  },
} satisfies Meta;

export default meta;

export const Default: StoryObj<typeof meta> = {
  render: () => (
    <table className="demo-token-table">
      <caption>Sample of color tokens</caption>
      <thead>
        <tr>
          <th scope="col">JavaScript</th>
          <th scope="col">CSS custom property</th>
          <th scope="col">Light (white)</th>
          <th scope="col">Dark (g100)</th>
          <th scope="col">Current theme</th>
        </tr>
      </thead>
      <tbody>
        {sample.map((token) => {
          const property = `--cds-${formatTokenName(token)}`;
          return (
            <tr key={token}>
              <td>
                <code>{token}</code>
              </td>
              <td>
                <code>{property}</code>
              </td>
              <td>
                <code>{white[token]}</code>
              </td>
              <td>
                <code>{g100[token]}</code>
              </td>
              <td>
                <span
                  className="demo-token-swatch"
                  style={{ background: `var(${property})` }}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  ),
};
