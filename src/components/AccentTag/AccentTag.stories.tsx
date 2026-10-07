import { Tag as TagIcon } from '@carbon/icons-react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { afframeA11y } from '../../../.storybook/afframeA11y.js';
import { AccentTag, type AccentTagColor } from './AccentTag.js';
import mdx from './AccentTag.mdx';

const accents: AccentTagColor[] = [
  'red',
  'magenta',
  'purple',
  'blue',
  'cyan',
  'teal',
  'green',
  'gray',
  'cool-gray',
  'warm-gray',
];

const meta = {
  title: 'Components/Accent Tag',
  component: AccentTag,
  tags: ['afframe'],
  args: {
    text: 'Acme Trading',
    accent: 'blue',
    tooltip: 'Customer since 2021',
  },
  parameters: {
    ...afframeA11y,
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof AccentTag>;

export default meta;

type Story = StoryObj<typeof meta>;

const row = { display: 'flex', flexWrap: 'wrap', gap: '0.5rem' } as const;

// Tab once focuses the tag and opens its tooltip.
export const Default: Story = {
  render: (args) => (
    <div style={{ paddingBlockEnd: '4rem' }}>
      <AccentTag {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const tag = within(canvasElement).getByRole('button', {
      name: 'Acme Trading',
    });
    await userEvent.tab();
    await expect(document.activeElement).toBe(tag);
    const tooltip = document.getElementById(
      tag.getAttribute('aria-describedby') ?? ''
    );
    await waitFor(() =>
      expect(tooltip).toHaveAttribute('aria-hidden', 'false')
    );
  },
};

export const Accents: Story = {
  render: () => (
    <div style={row}>
      {accents.map((accent) => (
        <AccentTag
          key={accent}
          text={accent}
          accent={accent}
          tooltip={accent}
          announceAccent
        />
      ))}
    </div>
  ),
};

export const WithIcon: Story = {
  args: { renderIcon: TagIcon, size: 'lg', accentLabel: 'Key customer' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Dark: Story = {
  ...Accents,
  globals: { theme: 'dark' },
};
