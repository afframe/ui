import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { afframeA11y } from '../../../.storybook/afframeA11y.js';
import { statusIconKinds, statusShapeKinds } from './kinds.js';
import { StatusIndicator } from './StatusIndicator.js';
import mdx from './StatusIndicator.mdx';

const meta = {
  title: 'Components/Status Indicator',
  component: StatusIndicator,
  tags: ['afframe'],
  args: { kind: 'succeeded' },
  parameters: {
    ...afframeA11y,
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof StatusIndicator>;

export default meta;

type Story = StoryObj<typeof meta>;

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(10rem, 1fr))',
  gap: '1rem',
};

const IconGrid = () => (
  <div style={grid}>
    {statusIconKinds.map((kind) => (
      <StatusIndicator key={kind} kind={kind} />
    ))}
  </div>
);

const ShapeGrid = () => (
  <div style={grid}>
    {statusShapeKinds.map((kind) => (
      <StatusIndicator key={kind} variant="shape" kind={kind} />
    ))}
  </div>
);

const TagRow = () => (
  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
    {statusIconKinds.map((kind) => (
      <StatusIndicator key={kind} kind={kind} appearance="tag" />
    ))}
    {statusShapeKinds.map((kind) => (
      <StatusIndicator
        key={kind}
        variant="shape"
        kind={kind}
        appearance="tag"
      />
    ))}
  </div>
);

export const Icon: Story = { render: IconGrid };

export const Shape: Story = { render: ShapeGrid };

export const Compact: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', padding: '0.25rem' }}>
      <StatusIndicator kind="failed" compact />
      <StatusIndicator kind="caution-major" compact />
      <StatusIndicator kind="succeeded" compact />
      <StatusIndicator variant="shape" kind="critical" compact />
      <StatusIndicator variant="shape" kind="stable" compact />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const failed = within(canvasElement).getByRole('button', {
      name: 'Failed',
    });
    await userEvent.tab();
    await expect(document.activeElement).toBe(failed);
    await userEvent.keyboard('{Escape}');
    await expect(document.activeElement).toBe(failed);
  },
};

export const AsTag: Story = { render: TagRow };

export const Dark: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <IconGrid />
      <ShapeGrid />
      <TagRow />
    </div>
  ),
  globals: { theme: 'dark' },
};
