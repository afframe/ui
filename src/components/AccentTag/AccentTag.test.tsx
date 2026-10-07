import { OperationalTag } from '@carbon/react';
import { render, screen } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { AccentTag, type AccentTagColor } from './AccentTag.js';

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

function tooltipOf(button: HTMLElement) {
  const id = button.getAttribute('aria-describedby') ?? '';
  return document.getElementById(id);
}

test('Tab focuses the tag, the tooltip shows, Escape hides it and focus stays', async () => {
  render(<AccentTag text="Overdue" accent="red" tooltip="Due 30. 9. 2026" />);
  const tag = screen.getByRole('button', { name: 'Overdue' });
  const tooltip = tooltipOf(tag);
  expect(tooltip).toHaveTextContent('Due 30. 9. 2026');
  expect(tooltip).toHaveAttribute('role', 'tooltip');
  await userEvent.tab();
  expect(document.activeElement).toBe(tag);
  await vi.waitFor(() =>
    expect(tooltip).toHaveAttribute('aria-hidden', 'false')
  );
  await expect.poll(() => tooltip?.checkVisibility()).toBe(true);
  await userEvent.keyboard('{Escape}');
  await vi.waitFor(() =>
    expect(tooltip).toHaveAttribute('aria-hidden', 'true')
  );
  expect(document.activeElement).toBe(tag);
});

test('Enter and Space call onClick', async () => {
  const onClick = vi.fn();
  render(
    <AccentTag
      text="Paid"
      accent="green"
      tooltip="Paid in full"
      onClick={onClick}
    />
  );
  await userEvent.tab();
  await userEvent.keyboard('{Enter}');
  await userEvent.keyboard(' ');
  expect(onClick).toHaveBeenCalledTimes(2);
});

test('disabled blocks focus and activation', async () => {
  const onClick = vi.fn();
  render(
    <AccentTag
      text="Draft"
      accent="gray"
      tooltip="Not sent"
      onClick={onClick}
      disabled
    />
  );
  const tag = screen.getByRole('button', { name: 'Draft' });
  expect(tag).toBeDisabled();
  await userEvent.tab();
  expect(document.activeElement).not.toBe(tag);
  tag.click();
  expect(onClick).not.toHaveBeenCalled();
});

test('without onClick the tag is still a focusable button', async () => {
  render(<AccentTag text="Info" accent="blue" tooltip="More" />);
  await userEvent.tab();
  expect(document.activeElement).toBe(
    screen.getByRole('button', { name: 'Info' })
  );
});

// Measured heights (Chromium, Carbon 1.117): OperationalTag sm 19.98 px,
// md 24, lg 32. sm is under the 24 px target, so AccentTag drops it.
test('OperationalTag sm is under 24 px; AccentTag md and lg meet it', () => {
  const { container } = render(
    <>
      <OperationalTag text="Small" size="sm" />
      <AccentTag text="Medium" accent="blue" tooltip="md" />
      <AccentTag text="Large" accent="blue" tooltip="lg" size="lg" />
    </>
  );
  const [sm, md, lg] = [...container.querySelectorAll('button')].map(
    (button) => button.getBoundingClientRect().height
  );
  expect(sm).toBeLessThan(24);
  expect(md).toBeGreaterThanOrEqual(24);
  expect(lg).toBeGreaterThanOrEqual(32);
});

test('accentLabel and announceAccent add the accent to the name', () => {
  render(
    <>
      <AccentTag
        text="Acme"
        accent="red"
        tooltip="Customer"
        accentLabel="Blocked"
      />
      <AccentTag
        text="Birch"
        accent="cool-gray"
        tooltip="Customer"
        announceAccent
      />
      <AccentTag
        text="Cedar"
        accent="teal"
        tooltip="Customer"
        announceAccent
        messages={{ accentLabel: (color) => `Barva ${color}` }}
      />
    </>
  );
  expect(screen.getByRole('button', { name: 'Acme Blocked' })).toBeVisible();
  expect(
    screen.getByRole('button', { name: 'Birch Cool gray accent' })
  ).toBeVisible();
  expect(
    screen.getByRole('button', { name: 'Cedar Barva teal' })
  ).toBeVisible();
  expect(screen.getByText('Blocked')).not.toBeVisible();
});

test('the accent is decorative by default', () => {
  const { container } = render(
    <AccentTag text="Acme" accent="red" tooltip="Customer" />
  );
  expect(screen.getByRole('button', { name: 'Acme' })).not.toHaveAttribute(
    'aria-labelledby'
  );
  expect(container.querySelector('[hidden]')).toBeNull();
});

test('every accent draws a 4 px inline-start strip in its own colour', () => {
  render(
    <>
      {accents.map((accent) => (
        <AccentTag
          key={accent}
          text={accent}
          accent={accent}
          tooltip={accent}
        />
      ))}
    </>
  );
  const colors = accents.map((accent) => {
    const style = getComputedStyle(
      screen.getByRole('button', { name: accent })
    );
    expect(style.borderInlineStartWidth).toBe('4px');
    expect(style.borderInlineEndWidth).toBe('1px');
    return style.borderInlineStartColor;
  });
  // gray, cool-gray and warm-gray differ only slightly but are distinct values.
  expect(new Set(colors).size).toBe(accents.length);
});

test('the tooltip opens on hover and stays open while it is hovered', async () => {
  render(<AccentTag text="Overdue" accent="red" tooltip="Due 30. 9. 2026" />);
  const tag = screen.getByRole('button', { name: 'Overdue' });
  const tooltip = tooltipOf(tag);
  if (!tooltip) throw new Error('missing tooltip');
  await userEvent.hover(tag);
  await vi.waitFor(() =>
    expect(tooltip).toHaveAttribute('aria-hidden', 'false')
  );
  await expect.poll(() => tooltip.checkVisibility()).toBe(true);
  // The role="tooltip" wrapper has no box of its own; hover its content.
  const content = tooltip.querySelector('.cds--popover-content') ?? tooltip;
  await userEvent.hover(content);
  await new Promise((resolve) => setTimeout(resolve, 500));
  expect(tooltip).toHaveAttribute('aria-hidden', 'false');
});
