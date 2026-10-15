// Test helpers for the create and edit components. Not shipped.
import { cleanup, screen, waitFor, within } from '@testing-library/react';
import { expect } from 'vitest';
import { userEvent } from 'vitest/browser';

/** The confirm button of the dialog that asks before closing a clean form while it saves. */
export async function leavePendingButton(): Promise<HTMLElement> {
  const dialog = await screen.findByRole('alertdialog');
  expect(dialog.textContent).toContain('Stop waiting?');
  return within(dialog).getByRole('button', { name: 'Stop waiting' });
}

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
 * A busy primary button: named by its label alone, disabled, Carbon's
 * InlineLoading with the label inside its box, hidden from assistive tech,
 * in Carbon's loading look (transparent), and the busy text announced in
 * the polite live region.
 */
export function expectBusyPrimary(label: string, announcement: string) {
  const button = screen.getByRole('button', { name: label });
  expect(button.hasAttribute('disabled')).toBe(true);
  const loading = button.querySelector('.cds--inline-loading');
  if (!loading) throw new Error('No InlineLoading in the busy button');
  expect(loading.getAttribute('aria-hidden')).toBe('true');
  expect(loading.querySelector('.cds--inline-loading__text')?.textContent).toBe(
    label
  );
  // Carbon's background transition, ended at once.
  for (const animation of button.getAnimations()) animation.finish();
  expect(getComputedStyle(button).backgroundColor).toBe('rgba(0, 0, 0, 0)');
  const outer = button.getBoundingClientRect();
  for (const part of [
    loading.querySelector('svg'),
    loading.querySelector('.cds--inline-loading__text'),
  ]) {
    if (!part) throw new Error('No spinner or text in the InlineLoading');
    const inner = part.getBoundingClientRect();
    expect(inner.left).toBeGreaterThanOrEqual(outer.left);
    expect(inner.right).toBeLessThanOrEqual(outer.right);
    expect(inner.top).toBeGreaterThanOrEqual(outer.top);
    expect(inner.bottom).toBeLessThanOrEqual(outer.bottom);
  }
  expect(screen.getByRole('status').textContent).toBe(announcement);
}

/**
 * After a rejected action: focus on the form around `firstField` with no
 * ring, not on the alert, which spans the column the fields sit in. The
 * next Tab reaches `firstField`.
 */
export async function expectErrorFocusAtStart(firstField: HTMLElement) {
  const start = firstField.closest('form');
  if (!start) throw new Error('The field is not in a form');
  const alert = await screen.findByRole('alert');
  await waitFor(() => expect(document.activeElement).toBe(start));
  expect(alert.hasAttribute('data-afframe-flow-error')).toBe(true);
  expect(alert.hasAttribute('tabindex')).toBe(false);
  expect(getComputedStyle(start).outlineStyle).toBe('none');
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
  await userEvent.tab();
  expect(document.activeElement).toBe(firstField);
}
