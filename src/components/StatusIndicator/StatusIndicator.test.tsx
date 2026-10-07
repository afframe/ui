import { render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { statusIconKinds, statusShapeKinds, statusTagColors } from './kinds.js';
import {
  defaultStatusIndicatorMessages,
  StatusIndicator,
} from './StatusIndicator.js';

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
