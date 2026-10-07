import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { AfframeProvider } from '../../provider/AfframeProvider.js';
import { LogoutTile } from './LogoutTile.js';
import type { LogoutTileProps } from './LogoutTile.js';

afterEach(cleanup);

const renderTile = (props: LogoutTileProps) =>
  render(
    <AfframeProvider>
      <LogoutTile {...props} />
    </AfframeProvider>
  );

const focusable = (root: HTMLElement) =>
  [
    ...root.querySelectorAll<HTMLElement>(
      'a[href], button, input, select, textarea, [tabindex]'
    ),
  ].filter((element) => element.tabIndex >= 0 && !element.matches(':disabled'));

test('shows the user and one log-out button, the only interactive element', async () => {
  const onLogout = vi.fn();
  const { container } = renderTile({
    userName: 'Sample User',
    userEmail: 'user@example.com',
    onLogout,
  });
  expect(screen.getByText('Signed in as Sample User')).toBeInTheDocument();
  expect(screen.getByText('user@example.com')).toBeInTheDocument();
  const button = screen.getByRole('button', { name: 'Log out' });
  expect(focusable(container)).toEqual([button]);
  // The tile text is not a click target.
  await userEvent.click(screen.getByText('Signed in as Sample User'));
  expect(onLogout).not.toHaveBeenCalled();
  await userEvent.click(button);
  expect(onLogout).toHaveBeenCalledOnce();
  expect(button.getBoundingClientRect().height).toBeGreaterThanOrEqual(24);
});

test('falls back to the email as the name', () => {
  renderTile({ userEmail: 'user@example.com', onLogout() {} });
  expect(screen.getByText('Signed in as user@example.com')).toBeInTheDocument();
});

test('an empty userName falls back to the email', () => {
  renderTile({ userName: '', userEmail: 'user@example.com', onLogout() {} });
  expect(screen.getByText('Signed in as user@example.com')).toBeInTheDocument();
  expect(screen.getAllByText(/user@example.com/)).toHaveLength(1);
});

test('busy href form: a disabled button, no link to activate', () => {
  renderTile({ href: '/auth/sign-out', loading: true });
  expect(screen.queryByRole('link')).toBeNull();
  const button = screen.getByRole('button', { name: /Logging out/ });
  expect(button).toBeDisabled();
  expect(button).not.toHaveAttribute('href');
});

test('loading prop: disabled button with the loading text, tile busy', () => {
  renderTile({ userName: 'Sample User', loading: true, onLogout() {} });
  const button = screen.getByRole('button', { name: /Logging out/ });
  expect(button).toBeDisabled();
  expect(button.closest('[aria-busy="true"]')).not.toBeNull();
});

test('async onLogout: loading while pending, focus kept on the tile, a second press is ignored', async () => {
  let finish = () => {};
  const onLogout = vi.fn(
    () =>
      new Promise<void>((resolve) => {
        finish = resolve;
      })
  );
  renderTile({ userName: 'Sample User', onLogout });
  const button = screen.getByRole('button', { name: 'Log out' });
  button.focus();
  await userEvent.keyboard('{Enter}');
  await vi.waitFor(() => expect(button).toBeDisabled());
  const tile = button.closest<HTMLElement>('[aria-busy]');
  expect(tile).toHaveAttribute('aria-busy', 'true');
  expect(document.activeElement).toBe(tile);
  await userEvent.click(button, { force: true });
  expect(onLogout).toHaveBeenCalledOnce();
  finish();
  await vi.waitFor(() =>
    expect(screen.getByRole('button', { name: 'Log out' })).toBeEnabled()
  );
  expect(tile).toHaveAttribute('aria-busy', 'false');
});

test('a rejected onLogout ends the loading state', async () => {
  renderTile({ onLogout: () => Promise.reject(new Error('offline')) });
  await userEvent.click(screen.getByRole('button', { name: 'Log out' }));
  await vi.waitFor(() =>
    expect(screen.getByRole('button', { name: 'Log out' })).toBeEnabled()
  );
});

test('href form: a link to the sign-out URL', () => {
  renderTile({ userName: 'Sample User', href: '/auth/sign-out' });
  expect(screen.getByRole('link', { name: 'Log out' })).toHaveAttribute(
    'href',
    '/auth/sign-out'
  );
  expect(screen.queryByRole('button')).toBeNull();
});

test('messages replace every English string', () => {
  renderTile({
    userName: 'Sample User',
    onLogout() {},
    messages: {
      logOut: 'X-log-out',
      signedInAs: (name) => `X-signed-in-${name}`,
    },
  });
  expect(screen.getByText('X-signed-in-Sample User')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'X-log-out' })).toBeInTheDocument();
  cleanup();
  renderTile({
    loading: true,
    onLogout() {},
    messages: { loggingOut: 'X-busy' },
  });
  expect(screen.getByRole('button', { name: /X-busy/ })).toBeDisabled();
});
