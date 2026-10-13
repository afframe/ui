import { spacing } from '@carbon/layout';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { afframeA11y } from '../../../.storybook/afframeA11y.js';
import { g100, unstable_metadata, white } from '../../tokens.js';
import mdx from './Tokens.mdx';
import './Tokens.stories.css';

const meta = {
  title: 'Elements/Tokens',
  tags: ['carbon'],
  parameters: {
    ...afframeA11y,
    docs: {
      page: mdx,
    },
  },
} satisfies Meta;

export default meta;

type Theme = Record<string, unknown>;
const camel = (name: string) =>
  name.replace(/-([a-z0-9])/gi, (_, part: string) => part.toUpperCase());

// Every color token of Carbon's v11 set, grouped by its first word
// (background, layer, field, border, text, ...), in Carbon's order.
const colorGroups = new Map<string, string[]>();
for (const { name, type } of unstable_metadata.v11) {
  if (type !== 'color' || !(camel(name) in white)) continue;
  const group = name.split('-')[0] ?? name;
  colorGroups.set(group, [...(colorGroups.get(group) ?? []), name]);
}

const value = (theme: Theme, name: string) => String(theme[camel(name)]);

export const Default: StoryObj<typeof meta> = {
  render: () => (
    <div className="demo-token-groups">
      {[...colorGroups].map(([group, names]) => (
        <table key={group} className="demo-token-table">
          <caption>{group}</caption>
          <thead>
            <tr>
              <th scope="col">CSS custom property</th>
              <th scope="col">JavaScript</th>
              <th scope="col">Light (white)</th>
              <th scope="col">Dark (g100)</th>
              <th scope="col">Current theme</th>
            </tr>
          </thead>
          <tbody>
            {names.map((name) => (
              <tr key={name}>
                <td>
                  <code>--cds-{name}</code>
                </td>
                <td>
                  <code>{camel(name)}</code>
                </td>
                <td>
                  <code>{value(white, name)}</code>
                </td>
                <td>
                  <code>{value(g100, name)}</code>
                </td>
                <td>
                  <span
                    className="demo-token-swatch"
                    style={{ background: `var(--cds-${name})` }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ))}
    </div>
  ),
};

export const Spacing: StoryObj<typeof meta> = {
  render: () => (
    <table className="demo-token-table">
      <caption>Spacing scale</caption>
      <thead>
        <tr>
          <th scope="col">CSS custom property</th>
          <th scope="col">Value</th>
          <th scope="col">Size</th>
        </tr>
      </thead>
      <tbody>
        {spacing.map((size, i) => {
          const name = `--cds-spacing-${String(i + 1).padStart(2, '0')}`;
          return (
            <tr key={name}>
              <td>
                <code>{name}</code>
              </td>
              <td>
                <code>{size}</code>
              </td>
              <td>
                <span
                  className="demo-token-bar"
                  style={{ inlineSize: `var(${name})` }}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  ),
};
