// Test helpers shared by component tests. Not shipped.
import { screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, vi } from 'vitest';

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
