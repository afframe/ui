import { render, screen } from '@testing-library/react';
import { useRef, useState } from 'react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { AfframeProvider } from '../../provider/AfframeProvider.js';
import { defaultRemoveModalMessages, RemoveModal } from './RemoveModal.js';
import type { RemoveModalProps } from './RemoveModal.js';

type HarnessProps = Partial<Omit<RemoveModalProps, 'open' | 'onClose'>> & {
  onClose?: () => void;
  useLauncherRef?: boolean;
};

function Harness({
  onClose,
  useLauncherRef = true,
  onConfirm = () => undefined,
  ...props
}: HarnessProps) {
  const [open, setOpen] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button ref={launcherRef} type="button" onClick={() => setOpen(true)}>
        Open
      </button>
      <RemoveModal
        resourceName="Invoice 2026-001"
        onConfirm={onConfirm}
        {...props}
        {...(useLauncherRef ? { launcherRef } : {})}
        open={open}
        onClose={() => {
          onClose?.();
          setOpen(false);
        }}
      />
    </>
  );
}

const renderHarness = (props: HarnessProps = {}) =>
  render(
    <AfframeProvider>
      <Harness {...props} />
    </AfframeProvider>
  );

const active = () => document.activeElement;
const launcher = () => screen.getByRole('button', { name: 'Open' });
const dialogRole = () => screen.queryByRole('alertdialog');

async function openByKeyboard() {
  launcher().focus();
  await userEvent.keyboard('{Enter}');
  await vi.waitFor(() => expect(dialogRole()).not.toBeNull());
}

const until = (check: () => void) => vi.waitFor(check, { timeout: 2000 });
// Carbon puts the danger description inside the danger button, so its
// accessible name is the description followed by the button text.
const dangerButton = (text: string, description = 'Danger') =>
  screen.getByRole<HTMLButtonElement>('button', {
    name: `${description} ${text}`,
  });
const closeIcon = (name = 'Close') =>
  screen.getByLabelText(name, { selector: 'button' });

test('opens as an alertdialog described by its body, Cancel focused', async () => {
  renderHarness();
  await openByKeyboard();
  const dialog = screen.getByRole('alertdialog');
  expect(dialog.getAttribute('aria-describedby')).toBeTruthy();
  const description = document.getElementById(
    dialog.getAttribute('aria-describedby') ?? ''
  );
  expect(description?.textContent).toContain(
    'Deleting Invoice 2026-001 is permanent'
  );
  expect(
    screen.getByRole('heading', { name: 'Delete Invoice 2026-001?' })
  ).toBeTruthy();
  await until(() =>
    expect(active()).toBe(screen.getByRole('button', { name: 'Cancel' }))
  );
});

test('keyboard happy path: Tab to Delete, Enter confirms and closes, focus returns', async () => {
  const onConfirm = vi.fn();
  const onClose = vi.fn();
  renderHarness({ onConfirm, onClose });
  await openByKeyboard();
  const cancel = screen.getByRole('button', { name: 'Cancel' });
  await until(() => expect(active()).toBe(cancel));
  await userEvent.tab();
  const confirm = dangerButton('Delete');
  expect(active()).toBe(confirm);
  await userEvent.keyboard('{Enter}');
  expect(onConfirm).toHaveBeenCalledTimes(1);
  await until(() => expect(onClose).toHaveBeenCalledTimes(1));
  await until(() => expect(dialogRole()).toBeNull());
  await until(() => expect(active()).toBe(launcher()));
});

test('Escape and the close icon close; Cancel too', async () => {
  const onClose = vi.fn();
  renderHarness({ onClose });
  await openByKeyboard();
  await until(() =>
    expect(active()).toBe(screen.getByRole('button', { name: 'Cancel' }))
  );
  await userEvent.keyboard('{Escape}');
  await until(() => expect(dialogRole()).toBeNull());
  await until(() => expect(active()).toBe(launcher()));

  await openByKeyboard();
  await userEvent.click(closeIcon());
  await until(() => expect(dialogRole()).toBeNull());

  await openByKeyboard();
  await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
  await until(() => expect(dialogRole()).toBeNull());
  expect(onClose).toHaveBeenCalledTimes(3);
});

test('focus stays in the dialog while tabbing', async () => {
  renderHarness();
  await openByKeyboard();
  const dialog = screen.getByRole('alertdialog');
  for (let index = 0; index < 6; index += 1) {
    await userEvent.tab();
    const element = active();
    // Past the last control the browser may move focus out of the page
    // (body); it never lands on the page behind the modal.
    expect(element === document.body || dialog.contains(element)).toBe(true);
    expect(element).not.toBe(launcher());
  }
});

test('focus falls back to the element focused before opening', async () => {
  renderHarness({ useLauncherRef: false });
  await openByKeyboard();
  await userEvent.keyboard('{Escape}');
  await until(() => expect(active()).toBe(launcher()));
});

test('typed confirmation: input focused, Delete disabled until the exact phrase', async () => {
  const onConfirm = vi.fn();
  renderHarness({ onConfirm, confirmByTyping: true });
  await openByKeyboard();
  const input = screen.getByRole('textbox', {
    name: 'Type Invoice 2026-001 to confirm',
  });
  await until(() => expect(active()).toBe(input));
  expect(input.getAttribute('autocomplete')).toBe('off');
  const confirm = dangerButton('Delete');
  expect(confirm.disabled).toBe(true);

  await userEvent.keyboard('invoice 2026-001');
  expect(confirm.disabled).toBe(true);
  expect(screen.queryByText('The text does not match.')).toBeNull();
  await userEvent.tab();
  expect(screen.getByText('The text does not match.')).toBeTruthy();

  await userEvent.clear(input);
  await userEvent.type(input, 'Invoice 2026-001');
  expect(confirm.disabled).toBe(false);
  expect(dangerButton('Delete')).toBe(confirm);
  await userEvent.tab();
  await userEvent.tab();
  expect(active()).toBe(confirm);
  await userEvent.keyboard('{Enter}');
  expect(onConfirm).toHaveBeenCalledTimes(1);
  await until(() => expect(dialogRole()).toBeNull());
});

test('typed confirmation with a custom phrase', async () => {
  renderHarness({ confirmByTyping: 'DELETE', kind: 'remove' });
  await openByKeyboard();
  const input = screen.getByRole('textbox', { name: 'Type DELETE to confirm' });
  await userEvent.type(input, 'DELETE');
  expect(dangerButton('Remove').disabled).toBe(false);
});

test('pending: buttons disabled, Escape ignored; rejection keeps it open with an alert', async () => {
  let reject: (error: Error) => void = () => undefined;
  const onConfirm = vi.fn(
    () =>
      new Promise<void>((_, fail) => {
        reject = fail;
      })
  );
  const onClose = vi.fn();
  renderHarness({ onConfirm, onClose });
  await openByKeyboard();
  await until(() =>
    expect(active()).toBe(screen.getByRole('button', { name: 'Cancel' }))
  );
  await userEvent.tab();
  await userEvent.keyboard('{Enter}');
  await until(() =>
    expect(screen.getAllByText('Working').length).toBeGreaterThan(0)
  );
  const dialog = screen.getByRole('alertdialog');
  expect(
    (screen.getByRole('button', { name: 'Cancel' }) as HTMLButtonElement)
      .disabled
  ).toBe(true);
  await until(() => expect(dialog.contains(active())).toBe(true));
  await userEvent.keyboard('{Escape}');
  await userEvent.keyboard('{Escape}');
  expect(onClose).not.toHaveBeenCalled();
  expect(dialogRole()).not.toBeNull();

  reject(new Error('Server said no'));
  await until(() => expect(screen.getByRole('alert')).toBeTruthy());
  expect(screen.getByRole('alert').textContent).toContain(
    'Something went wrong. Try again.'
  );
  expect(dialogRole()).not.toBeNull();
  await until(() => expect(active()).toBe(dangerButton('Delete')));
  expect(onClose).not.toHaveBeenCalled();
});

test('overridden messages replace every English default', async () => {
  const messages = Object.fromEntries(
    Object.entries(defaultRemoveModalMessages).map(([key, value]) => [
      key,
      typeof value === 'function' ? () => `[[${key}]]` : `[[${key}]]`,
    ])
  );
  renderHarness({
    messages,
    confirmByTyping: true,
    onConfirm: () => Promise.reject(new Error('no')),
  });
  await openByKeyboard();
  const input = screen.getByRole('textbox', { name: '[[typeToConfirm]]' });
  await userEvent.type(input, 'nope');
  await userEvent.tab();
  await userEvent.clear(input);
  await userEvent.type(input, 'Invoice 2026-001');
  await userEvent.click(dangerButton('[[confirm]]', '[[dangerDescription]]'));
  await until(() => expect(screen.getByText('[[genericError]]')).toBeTruthy());
  await userEvent.clear(input);
  await userEvent.type(input, 'x');
  await userEvent.tab();
  const dialog = screen.getByRole('alertdialog');
  const english = [
    'Delete',
    'Remove',
    'Cancel',
    'Close',
    'Working',
    'Something went wrong',
    'Type ',
    'does not match',
    'Danger',
    'permanent',
    'Error',
  ];
  const visible = [
    dialog.textContent ?? '',
    ...[...dialog.querySelectorAll('[aria-label],[title]')].map(
      (element) =>
        `${element.getAttribute('aria-label') ?? ''} ${element.getAttribute('title') ?? ''}`
    ),
  ].join(' ');
  const leftover = visible.replace(/\[\[\w+\]\]/g, '');
  for (const word of english) expect(leftover).not.toContain(word);
  expect(visible).toContain('[[mismatch]]');
  expect(visible).toContain('[[genericError]]');
  expect(visible).toContain('[[dangerDescription]]');
});

test('works without AfframeProvider (classic Carbon modal)', async () => {
  const onClose = vi.fn();
  render(<Harness onClose={onClose} />);
  await openByKeyboard();
  await until(() =>
    expect(active()).toBe(screen.getByRole('button', { name: 'Cancel' }))
  );
  await userEvent.keyboard('{Escape}');
  await until(() => expect(onClose).toHaveBeenCalledTimes(1));
  await until(() => expect(active()).toBe(launcher()));
});

test('an empty confirmation phrase keeps the confirm button disabled and warns', async () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  renderHarness({ confirmByTyping: '' });
  await openByKeyboard();
  expect(dangerButton('Delete').disabled).toBe(true);
  expect(warn).toHaveBeenCalledWith(
    expect.stringContaining('RemoveModal: confirmByTyping')
  );
  warn.mockRestore();
});
