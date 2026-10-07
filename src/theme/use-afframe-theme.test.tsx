import { act, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import { useAfframeTheme, useCarbonTheme } from './use-afframe-theme.js';

function Probe() {
  return (
    <p>
      {useAfframeTheme()} {useCarbonTheme()}
    </p>
  );
}

function setTheme(theme: string | undefined) {
  if (theme === undefined) delete document.documentElement.dataset.afframeTheme;
  else document.documentElement.dataset.afframeTheme = theme;
}

afterEach(() => {
  setTheme(undefined);
  vi.unstubAllGlobals();
});

function stubDarkPreference(matches: boolean) {
  const listeners = new Set<() => void>();
  const media = {
    matches,
    addEventListener: (_: string, listener: () => void) =>
      listeners.add(listener),
    removeEventListener: (_: string, listener: () => void) =>
      listeners.delete(listener),
  };
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => media)
  );
  return {
    change(next: boolean) {
      media.matches = next;
      for (const listener of listeners) listener();
    },
  };
}

test('no attribute gives light and white', () => {
  render(<Probe />);
  expect(screen.getByText('light white')).toBeTruthy();
});

test('light gives light and white', () => {
  setTheme('light');
  render(<Probe />);
  expect(screen.getByText('light white')).toBeTruthy();
});

test('dark gives dark and g100', () => {
  setTheme('dark');
  render(<Probe />);
  expect(screen.getByText('dark g100')).toBeTruthy();
});

test('system follows prefers-color-scheme', () => {
  const preference = stubDarkPreference(true);
  setTheme('system');
  render(<Probe />);
  expect(screen.getByText('dark g100')).toBeTruthy();
  act(() => preference.change(false));
  expect(screen.getByText('light white')).toBeTruthy();
});

test('re-renders when the attribute changes', async () => {
  render(<Probe />);
  expect(screen.getByText('light white')).toBeTruthy();
  setTheme('dark');
  expect(await screen.findByText('dark g100')).toBeTruthy();
  setTheme('light');
  expect(await screen.findByText('light white')).toBeTruthy();
});
