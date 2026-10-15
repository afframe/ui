import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { afframeA11y } from '../../../.storybook/afframeA11y.js';
import {
  statusIconKinds,
  statusShapeKinds,
  type StatusIndicatorIconKind,
  type StatusIndicatorShapeKind,
} from './kinds.js';
import {
  StatusIndicator,
  type StatusIndicatorProps,
} from './StatusIndicator.js';
import mdx from './StatusIndicator.mdx';

const meta = {
  title: 'Components/StatusIndicator',
  component: StatusIndicator,
  tags: ['afframe'],
  args: {
    kind: 'succeeded',
    variant: 'icon',
    appearance: 'indicator',
    compact: false,
  },
  argTypes: {
    kind: {
      control: 'select',
      options: [...new Set([...statusIconKinds, ...statusShapeKinds])],
    },
    variant: { control: 'inline-radio', options: ['icon', 'shape'] },
    appearance: { control: 'inline-radio', options: ['indicator', 'tag'] },
    size: { control: 'inline-radio', options: [16, 20] },
    textSize: { control: 'inline-radio', options: [12, 14] },
  },
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

// One indicator from the controls. `kind` offers both lists, so a kind the
// variant lacks falls back to `failed` (in both lists), and the size control
// of the other variant is dropped.
const Playground = (args: StatusIndicatorProps) => {
  const { variant, kind, size, textSize, ...common } = args;
  if (variant === 'shape') {
    const shapeKind = (statusShapeKinds as readonly string[]).includes(kind)
      ? (kind as StatusIndicatorShapeKind)
      : 'failed';
    return (
      <StatusIndicator
        {...common}
        variant="shape"
        kind={shapeKind}
        {...(textSize === undefined ? {} : { textSize })}
      />
    );
  }
  const iconKind = (statusIconKinds as readonly string[]).includes(kind)
    ? (kind as StatusIndicatorIconKind)
    : 'failed';
  return (
    <StatusIndicator
      {...common}
      kind={iconKind}
      {...(size === undefined ? {} : { size })}
    />
  );
};

export const Default: Story = { render: Playground };

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
  tags: ['!dev', '!autodocs'],
  render: () => (
    <div style={{ display: 'grid', gap: '2rem' }}>
      <IconGrid />
      <ShapeGrid />
      <TagRow />
    </div>
  ),
  globals: { theme: 'dark' },
};
