import { composeStories } from '@storybook/react-vite';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { statusIconKinds, statusShapeKinds, statusTagColors } from './kinds.js';
import {
  defaultStatusIndicatorMessages,
  StatusIndicator,
} from './StatusIndicator.js';
import * as stories from './StatusIndicator.stories.js';

// The unit project has no MDX loader; the stories file imports its docs page.
vi.mock('./StatusIndicator.mdx', () => ({ default: () => null }));

const label = defaultStatusIndicatorMessages.kindLabel;

test('renders every kind of both variants on the server', () => {
  for (const kind of statusIconKinds) {
    for (const appearance of ['indicator', 'tag'] as const) {
      const html = renderToStaticMarkup(
        <StatusIndicator kind={kind} appearance={appearance} />
      );
      expect(html).toContain('<svg');
      expect(html).toContain(label('icon', kind));
    }
  }
  for (const kind of statusShapeKinds) {
    for (const appearance of ['indicator', 'tag'] as const) {
      const html = renderToStaticMarkup(
        <StatusIndicator variant="shape" kind={kind} appearance={appearance} />
      );
      expect(html).toContain('<svg');
      expect(html).toContain(label('shape', kind));
    }
  }
});

test('every kind has a visible label', () => {
  render(
    <>
      {statusIconKinds.map((kind) => (
        <StatusIndicator key={`icon-${kind}`} kind={kind} />
      ))}
      {statusShapeKinds.map((kind) => (
        <StatusIndicator key={`shape-${kind}`} variant="shape" kind={kind} />
      ))}
    </>
  );
  const labels = [
    ...statusIconKinds.map((kind) => label('icon', kind)),
    ...statusShapeKinds.map((kind) => label('shape', kind)),
  ];
  for (const text of labels) {
    expect(text).toMatch(/^[A-Z]/);
    for (const element of screen.getAllByText(text)) {
      expect(element).toBeVisible();
    }
  }
});

test('compact mode names the glyph and is reachable with Tab', async () => {
  render(
    <>
      <StatusIndicator kind="failed" compact />
      <StatusIndicator variant="shape" kind="critical" compact />
    </>
  );
  const icon = screen.getByRole('button', { name: 'Failed' });
  const shape = screen.getByRole('button', { name: 'Critical' });
  expect(icon).toHaveClass('cds--icon-indicator__button');
  await userEvent.tab();
  expect(document.activeElement).toBe(icon);
  await userEvent.tab();
  expect(document.activeElement).toBe(shape);
  // 24 px minimum target from _status-indicator.scss.
  expect(icon.getBoundingClientRect().height).toBeGreaterThanOrEqual(24);
  expect(icon.getBoundingClientRect().width).toBeGreaterThanOrEqual(24);
});

test('the non-compact indicator is text, not focusable', () => {
  const { container } = render(<StatusIndicator kind="pending" />);
  expect(container.querySelector('button, [tabindex]')).toBeNull();
  expect(container.textContent).toBe('Pending');
});

test('messages.kindLabel and label override the default text', () => {
  render(
    <>
      <StatusIndicator
        kind="succeeded"
        messages={{ kindLabel: (variant, kind) => `${variant}:${kind}` }}
      />
      <StatusIndicator variant="shape" kind="draft" label="Rough draft" />
    </>
  );
  expect(screen.getByText('icon:succeeded')).toBeVisible();
  expect(screen.getByText('Rough draft')).toBeVisible();
});

test('tag appearance: every kind has a colour and a glyph', () => {
  expect(Object.keys(statusTagColors.icon).sort()).toEqual(
    [...statusIconKinds].sort()
  );
  expect(Object.keys(statusTagColors.shape).sort()).toEqual(
    [...statusShapeKinds].sort()
  );
  const { container } = render(
    <>
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
    </>
  );
  const tags = container.querySelectorAll('.cds--tag');
  expect(tags).toHaveLength(statusIconKinds.length + statusShapeKinds.length);
  const kinds = [
    ...statusIconKinds.map((kind) => statusTagColors.icon[kind]),
    ...statusShapeKinds.map((kind) => statusTagColors.shape[kind]),
  ];
  tags.forEach((tag, index) => {
    expect(tag.tagName).toBe('DIV');
    expect(tag).toHaveClass(`cds--tag--${kinds[index]}`);
    expect(tag.querySelector('svg')).not.toBeNull();
  });
});

test('ref lands on the root in every appearance', () => {
  const icon = createRef<HTMLDivElement>();
  const shape = createRef<HTMLDivElement>();
  const tag = createRef<HTMLDivElement>();
  render(
    <>
      <StatusIndicator ref={icon} kind="failed" />
      <StatusIndicator ref={shape} variant="shape" kind="critical" />
      <StatusIndicator ref={tag} kind="failed" appearance="tag" />
    </>
  );
  expect(icon.current).toHaveClass('afframe-status-indicator');
  expect(icon.current?.firstElementChild).toHaveClass('cds--icon-indicator');
  expect(shape.current).toHaveClass('afframe-status-indicator');
  expect(shape.current?.firstElementChild).toHaveClass('cds--shape-indicator');
  expect(tag.current).toHaveClass('cds--tag');
});

test('indicator appearance: className, ref and rest props share one div', () => {
  const ref = createRef<HTMLDivElement>();
  render(
    <StatusIndicator
      ref={ref}
      kind="pending"
      className="row-status"
      id="status-1"
      data-testid="status"
      aria-describedby="status-help"
    />
  );
  const root = screen.getByTestId('status');
  expect(root.tagName).toBe('DIV');
  expect(root).toBe(ref.current);
  expect(root).toHaveClass('afframe-status-indicator', 'row-status');
  expect(root).toHaveAttribute('id', 'status-1');
  expect(root).toHaveAttribute('aria-describedby', 'status-help');
  expect(root.querySelector('.row-status')).toBeNull();
});

test('tag appearance: rest props land on the tag', () => {
  render(
    <StatusIndicator
      kind="pending"
      appearance="tag"
      id="status-2"
      data-testid="status-tag"
      aria-describedby="status-help"
    />
  );
  const tag = screen.getByTestId('status-tag');
  expect(tag).toHaveClass('cds--tag');
  expect(tag).toHaveAttribute('id', 'status-2');
  expect(tag).toHaveAttribute('aria-describedby', 'status-help');
});

test('tag appearance with onClick stays a div, not a button', () => {
  const ref = createRef<HTMLDivElement>();
  const { container } = render(
    <StatusIndicator
      ref={ref}
      kind="pending"
      appearance="tag"
      onClick={vi.fn()}
    />
  );
  expect(container.querySelector('button')).toBeNull();
  expect(ref.current).toBeInstanceOf(HTMLDivElement);
  expect(ref.current).toHaveClass('cds--tag');
});

test('server markup keeps id and data attributes in both appearances', () => {
  for (const appearance of ['indicator', 'tag'] as const) {
    const html = renderToStaticMarkup(
      <StatusIndicator
        kind="failed"
        appearance={appearance}
        id={`status-${appearance}`}
        data-testid="status"
      />
    );
    expect(html).toContain(`id="status-${appearance}"`);
    expect(html).toContain('data-testid="status"');
  }
});

test('a kind in both lists has one tag colour', () => {
  const shared = statusIconKinds.filter((kind) =>
    (statusShapeKinds as readonly string[]).includes(kind)
  );
  expect(shared.length).toBeGreaterThan(0);
  for (const kind of shared) {
    expect(statusTagColors.icon[kind]).toBe(
      statusTagColors.shape[kind as (typeof statusShapeKinds)[number]]
    );
  }
});

test('the Default story renders one indicator from its args', async () => {
  const { Default } = composeStories(stories);
  const { container } = render(<Default kind="failed" appearance="tag" />);
  expect(container.querySelectorAll('.cds--tag--red')).toHaveLength(1);
});
