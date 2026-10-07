import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { AfframeProvider } from '../../provider/AfframeProvider.js';
import { LogoutBanner } from './LogoutBanner.js';
import type { LogoutBannerProps } from './LogoutBanner.js';

afterEach(cleanup);

const renderBanner = (props: LogoutBannerProps) =>
  render(
    <AfframeProvider>
      <LogoutBanner {...props} />
    </AfframeProvider>
  );

test('expiring: a polite status with the minutes and a stay action', async () => {
  const onStaySignedIn = vi.fn();
  renderBanner({ variant: 'expiring', minutesLeft: 5, onStaySignedIn });
  const banner = screen.getByRole('status');
  expect(banner.textContent).toContain('Your session ends in 5 minutes.');
  expect(screen.queryByRole('alert')).toBeNull();
  await userEvent.click(screen.getByRole('button', { name: 'Stay signed in' }));
  expect(onStaySignedIn).toHaveBeenCalledOnce();
  // No close button and no focus sentinels without onDismiss.
  expect(screen.getAllByRole('button')).toHaveLength(1);
  expect(screen.queryByRole('link')).toBeNull();
});

test('does not steal focus when it appears', () => {
  const outside = document.createElement('button');
  document.body.append(outside);
  outside.focus();
  renderBanner({ variant: 'expiring', minutesLeft: 3, onStaySignedIn() {} });
  expect(document.activeElement).toBe(outside);
  outside.remove();
});

test('signed-out: an alert with a sign-in action', async () => {
  const onSignIn = vi.fn();
  renderBanner({ variant: 'signed-out', onSignIn });
  expect(screen.getByRole('alert').textContent).toContain(
    'You have been signed out.'
  );
  await userEvent.click(screen.getByRole('button', { name: 'Sign in' }));
  expect(onSignIn).toHaveBeenCalledOnce();
});

test('the text changes only with the minute count', () => {
  const { rerender } = renderBanner({ variant: 'expiring', minutesLeft: 2 });
  const banner = screen.getByRole('status');
  expect(banner.textContent).toContain('2 minutes');
  rerender(
    <AfframeProvider>
      <LogoutBanner variant="expiring" minutesLeft={1} />
    </AfframeProvider>
  );
  expect(screen.getByRole('status')).toBe(banner);
  expect(banner.textContent).toContain('Your session ends in 1 minute.');
});

test('onDismiss shows the close button; close and Escape call it, the app removes the banner', async () => {
  const onDismiss = vi.fn();
  renderBanner({ variant: 'expiring', minutesLeft: 4, onDismiss });
  await userEvent.click(screen.getByRole('button', { name: 'Close' }));
  expect(onDismiss).toHaveBeenCalledOnce();
  // Carbon would hide itself; the app owns visibility, so it stays.
  expect(screen.getByRole('status')).toBeInTheDocument();
  screen.getByRole('button', { name: 'Close' }).focus();
  await userEvent.keyboard('{Escape}');
  expect(onDismiss).toHaveBeenCalledTimes(2);
});

test('messages replace every English string', () => {
  renderBanner({
    variant: 'expiring',
    minutesLeft: 7,
    onStaySignedIn() {},
    onDismiss() {},
    messages: {
      expiring: (minutes) => `X-expiring-${minutes}`,
      staySignedIn: 'X-stay',
      closeIconDescription: 'X-close',
      expiringIconDescription: 'X-warning',
    },
  });
  expect(screen.getByRole('status').textContent).toContain('X-expiring-7');
  expect(screen.getByRole('button', { name: 'X-stay' })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'X-close' })).toBeInTheDocument();
  expect(screen.getByTitle('X-warning')).toBeInTheDocument();
  cleanup();
  renderBanner({
    variant: 'signed-out',
    onSignIn() {},
    messages: {
      signedOut: 'X-out',
      signIn: 'X-sign-in',
      signedOutIconDescription: 'X-info',
    },
  });
  expect(screen.getByRole('alert').textContent).toContain('X-out');
  expect(screen.getByRole('button', { name: 'X-sign-in' })).toBeInTheDocument();
  expect(screen.getByTitle('X-info')).toBeInTheDocument();
});

test.each([
  [2.2, 'Your session ends in 3 minutes.'],
  [-1, 'Your session ends in 0 minutes.'],
  [Number.NaN, 'Your session ends in 0 minutes.'],
])(
  'minutesLeft %s is shown as whole minutes with a warning',
  (minutesLeft, shown) => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    renderBanner({ variant: 'expiring', minutesLeft });
    expect(screen.getByRole('status').textContent).toContain(shown);
    expect(warn).toHaveBeenCalledOnce();
    warn.mockRestore();
  }
);

test('a whole minute count does not warn', () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  renderBanner({ variant: 'expiring', minutesLeft: 4 });
  expect(warn).not.toHaveBeenCalled();
  warn.mockRestore();
});
