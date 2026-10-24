// Test helpers shared by component tests. Not shipped.
import { screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, vi } from 'vitest';
import { page } from 'vitest/browser';

/** A Carbon icon button, named by its tooltip (aria-labelledby). */
export function iconButton(name: string): HTMLButtonElement {
  const tooltip = screen.getByText(name, { selector: '[role="tooltip"] *' });
  const id = tooltip.closest('[role="tooltip"]')?.id;
  const button = document.querySelector(`button[aria-labelledby="${id}"]`);
  if (!(button instanceof HTMLButtonElement)) throw new Error(name);
  return button;
}

/** Fails the test on any console.error (a prop type warning, a React error). */
export function failOnConsoleError() {
  let spy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    spy = vi.spyOn(console, 'error');
  });
  afterEach(() => {
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
}

/** Retries a check until it passes, for steps slower than the default 1 s. */
export const until = (check: () => void, timeout = 2000) =>
  vi.waitFor(check, { timeout });

/** Waits for finite animations; a spinner runs forever, a cancelled one rejects. */
export const settleAnimations = () =>
  Promise.allSettled(
    document
      .getAnimations()
      .filter(
        (animation) => animation.effect?.getTiming().iterations !== Infinity
      )
      .map((animation) => animation.finished)
  );

/** Screenshots the whole body (portals included) once the font has loaded. */
export async function snapshot(name: string) {
  await document.fonts.load('400 14px "IBM Plex Sans"');
  await document.fonts.ready;
  await expect
    .element(page.elementLocator(document.body))
    .toMatchScreenshot(name);
}
