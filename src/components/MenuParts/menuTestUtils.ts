// Test helpers for the OverflowMenu and TableToolbarMenu wrappers. Not shipped.
import { screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, vi } from 'vitest';
import { userEvent } from 'vitest/browser';

/** A Carbon icon button, named by its tooltip (aria-labelledby). */
export function iconButton(name: string): HTMLButtonElement {
  const tooltip = screen.getByText(name, { selector: '[role="tooltip"] *' });
  const id = tooltip.closest('[role="tooltip"]')?.id;
  const button = document.querySelector(`button[aria-labelledby="${id}"]`);
  if (!(button instanceof HTMLButtonElement)) throw new Error(name);
  return button;
}

/** Enter opens the menu, ArrowDown moves to the second item, Enter runs it. */
export async function runSecondItem(trigger: HTMLElement, second: string) {
  trigger.focus();
  await userEvent.keyboard('{Enter}');
  await vi.waitFor(() =>
    expect(document.activeElement?.getAttribute('role')).toBe('menuitem')
  );
  await userEvent.keyboard('{ArrowDown}');
  await vi.waitFor(() =>
    expect(document.activeElement?.textContent).toBe(second)
  );
  await userEvent.keyboard('{Enter}');
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
