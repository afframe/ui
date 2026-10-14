// Test helpers for the create and edit components. Not shipped.
import { cleanup, screen, waitFor } from '@testing-library/react';
import { expect } from 'vitest';

/**
 * afterEach for EditTearsheet: lets running exit animations finish, then
 * unmounts. IBM Products' own Tearsheet `usePresence` (2.100.0) awaits
 * `animation.finished` without a catch, so unmounting a closing tearsheet
 * mid-animation leaves an unhandled AbortError. The local patch covers only
 * Carbon's copy in `@carbon/react`.
 */
export async function settleAndCleanup() {
  // Finite ones only: a spinner (InlineLoading) runs forever.
  await Promise.allSettled(
    document
      .getAnimations()
      .filter(
        (animation) =>
          animation.effect?.getComputedTiming().endTime !== Infinity
      )
      .map((animation) => animation.finished)
  );
  cleanup();
}

/** A message object of sentinel strings (`zz0`, `zz1`, ...) for every key. */
export function sentinelMessages<M extends object>(defaults: M): M {
  return Object.fromEntries(
    Object.keys(defaults).map((key, index) => [key, `zz${index}`])
  ) as M;
}

/** The default strings still found in the page text or any `aria-label`. */
export function englishLeft(defaults: object): string[] {
  const labels = [...document.querySelectorAll('[aria-label]')].map(
    (element) => element.getAttribute('aria-label') ?? ''
  );
  const haystack = [document.body.textContent ?? '', ...labels].join('\n');
  return Object.values(defaults).filter(
    (value): value is string =>
      typeof value === 'string' && haystack.includes(value)
  );
}

/** Focusable elements reachable with Tab inside `container`, in DOM order. */
export function tabbables(container: Element | null): HTMLElement[] {
  if (!container) return [];
  return [
    ...container.querySelectorAll<HTMLElement>(
      'a[href], button, input, select, textarea, [tabindex]'
    ),
  ].filter(
    (element) =>
      element.tabIndex >= 0 &&
      !element.hasAttribute('disabled') &&
      element.getClientRects().length > 0
  );
}

/**
 * A busy primary button: named by its label alone, disabled, its spinner
 * inside its box, and the busy text announced in the polite live region.
 */
export function expectBusyPrimary(label: string, announcement: string) {
  const button = screen.getByRole('button', { name: label });
  expect(button.hasAttribute('disabled')).toBe(true);
  const spinner = button.querySelector('svg');
  if (!spinner) throw new Error('No spinner in the busy button');
  const outer = button.getBoundingClientRect();
  const inner = spinner.getBoundingClientRect();
  expect(inner.left).toBeGreaterThanOrEqual(outer.left);
  expect(inner.right).toBeLessThanOrEqual(outer.right);
  expect(inner.top).toBeGreaterThanOrEqual(outer.top);
  expect(inner.bottom).toBeLessThanOrEqual(outer.bottom);
  expect(screen.getByRole('status').textContent).toBe(announcement);
}

/**
 * After a rejected action: focus and its ring on the alert itself, which
 * spans the column the fields sit in.
 */
export async function expectFocusedErrorAlert() {
  const alert = await screen.findByRole('alert');
  await waitFor(() => expect(document.activeElement).toBe(alert));
  expect(alert.hasAttribute('data-afframe-flow-error')).toBe(true);
  expect(getComputedStyle(alert).outlineStyle).not.toBe('none');
  const column = alert.parentElement;
  if (!column) throw new Error('The alert has no parent');
  const style = getComputedStyle(column);
  const inner =
    column.clientWidth -
    parseFloat(style.paddingInlineStart) -
    parseFloat(style.paddingInlineEnd);
  expect(
    Math.abs(alert.getBoundingClientRect().width - inner)
  ).toBeLessThanOrEqual(1);
}
