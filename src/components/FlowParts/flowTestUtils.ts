// Test helpers for the create and edit components. Not shipped.
import { cleanup, screen } from '@testing-library/react';
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
