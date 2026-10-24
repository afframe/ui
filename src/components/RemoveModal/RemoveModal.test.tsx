import { render, screen } from '@testing-library/react';
import { createRef, useRef, useState } from 'react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { AfframeProvider } from '../../provider/AfframeProvider.js';
import { defaultRemoveModalMessages, RemoveModal } from './RemoveModal.js';
import type { RemoveModalProps } from './RemoveModal.js';
import { until } from '../../testUtils.js';

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
        title="Delete Invoice 2026-001?"
        description="Deleting Invoice 2026-001 is permanent and cannot be undone."
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
    'Deleting "Invoice 2026-001" is permanent'
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
    expect(dialog.contains(element)).toBe(true);
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
    name: 'Type "Invoice 2026-001" to confirm',
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
  const input = screen.getByRole('textbox', {
    name: 'Type "DELETE" to confirm',
  });
  await userEvent.type(input, 'DELETE');
  expect(dangerButton('Remove').disabled).toBe(false);
});

test('the name is bold and quoted in the description and the field label', async () => {
  renderHarness({ confirmByTyping: true });
  await openByKeyboard();
  const input = screen.getByRole('textbox', {
    name: 'Type "Invoice 2026-001" to confirm',
  });
  const label = document.querySelector(`label[for="${input.id}"]`);
  expect(label?.querySelector('strong')?.textContent).toBe('Invoice 2026-001');
  const body = screen.getByText((_, element) =>
    element?.tagName === 'P'
      ? element.textContent ===
        'Deleting "Invoice 2026-001" is permanent and cannot be undone.'
      : false
  );
  const strong = body.querySelector('strong');
  if (!strong) throw new Error('no bold name');
  expect(strong.textContent).toBe('Invoice 2026-001');
  expect(Number(getComputedStyle(strong).fontWeight)).toBeGreaterThanOrEqual(
    600
  );
});

test('a custom label gets the phrase bold; quotes already there are kept', async () => {
  renderHarness({
    confirmByTyping: 'DELETE',
    description: 'Type "DELETE" below.',
    resourceName: 'DELETE',
    messages: { typeToConfirm: (phrase) => `Enter ${phrase}` },
  });
  await openByKeyboard();
  const input = screen.getByRole('textbox', { name: 'Enter "DELETE"' });
  const label = document.querySelector(`label[for="${input.id}"]`);
  expect(label?.querySelector('strong')?.textContent).toBe('DELETE');
  expect(screen.getByText('DELETE', { selector: 'p strong' })).toBeTruthy();
  expect(document.body.textContent).toContain('Type "DELETE" below.');
});

test('the bold goes to the quoted or whole-word occurrence, not a substring', async () => {
  renderHarness({
    confirmByTyping: 'Type',
    resourceName: 'pro',
    description: 'Removing the project pro is permanent.',
  });
  await openByKeyboard();
  const input = screen.getByRole('textbox', { name: 'Type "Type" to confirm' });
  const label = document.querySelector(`label[for="${input.id}"]`);
  expect(label?.textContent).toBe('Type "Type" to confirm');
  expect(label?.querySelector('strong')?.previousSibling?.textContent).toBe(
    'Type "'
  );
  const body = screen.getByText('pro', { selector: 'p strong' }).parentElement;
  expect(body?.textContent).toBe('Removing the project "pro" is permanent.');
});

test('typographic quotes around the name are kept, not doubled', async () => {
  renderHarness({
    confirmByTyping: true,
    description: 'Faktura „Invoice 2026-001“ bude smazána.',
    messages: { typeToConfirm: (phrase) => `Napište „${phrase}“` },
  });
  await openByKeyboard();
  const input = screen.getByRole('textbox', {
    name: 'Napište „Invoice 2026-001“',
  });
  const label = document.querySelector(`label[for="${input.id}"]`);
  expect(label?.querySelector('strong')?.textContent).toBe('Invoice 2026-001');
  const body = screen.getByText('Invoice 2026-001', {
    selector: 'p strong',
  }).parentElement;
  expect(body?.textContent).toBe('Faktura „Invoice 2026-001“ bude smazána.');
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
  // The dialog body takes the error focus with no ring, not the alert; with
  // no text field the next Tab reaches Cancel.
  await until(() =>
    expect(active()?.classList.contains('afframe-modal-body')).toBe(true)
  );
  expect(getComputedStyle(active() as Element).outlineStyle).toBe('none');
  expect(screen.getByRole('alert').hasAttribute('tabindex')).toBe(false);
  await userEvent.tab();
  expect(active()).toBe(screen.getByRole('button', { name: 'Cancel' }));
  expect(onClose).not.toHaveBeenCalled();
});

test('reopened after a parent close while pending, Escape closes it', async () => {
  const onClose = vi.fn();
  function Parent() {
    const [open, setOpen] = useState(false);
    return (
      <AfframeProvider>
        <button type="button" onClick={() => setOpen(true)}>
          Open
        </button>
        <button type="button" onClick={() => setOpen(false)}>
          Parent close
        </button>
        <RemoveModal
          open={open}
          title="Delete it?"
          description="Gone for good."
          onConfirm={() => new Promise<void>(() => undefined)}
          onClose={() => {
            onClose();
            setOpen(false);
          }}
        />
      </AfframeProvider>
    );
  }
  render(<Parent />);
  await openByKeyboard();
  await userEvent.click(dangerButton('Delete'));
  screen.getByRole('button', { name: 'Parent close', hidden: true }).click();
  await until(() => expect(dialogRole()).toBeNull());
  await openByKeyboard();
  await userEvent.keyboard('{Escape}');
  expect(onClose).toHaveBeenCalledTimes(1);
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
    title: 'Heading',
    description: 'Body',
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
  await until(() => expect(screen.getByText('[[error]]')).toBeTruthy());
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
  expect(visible).toContain('[[error]]');
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

test('ref and rest props reach the root', async () => {
  const ref = createRef<HTMLDivElement>();
  render(
    <AfframeProvider>
      <RemoveModal
        ref={ref}
        data-testid="root"
        open
        title="Delete Invoice 2026-001?"
        description="Deleting it is permanent."
        resourceName="Invoice 2026-001"
        onClose={() => undefined}
        onConfirm={() => undefined}
      />
    </AfframeProvider>
  );
  const root = await screen.findByTestId('root');
  expect(ref.current).toBe(root);
  expect(root.classList).toContain('afframe-remove-modal');
  // The internal ref still works: Cancel gets the initial focus.
  await until(() =>
    expect(active()).toBe(screen.getByRole('button', { name: 'Cancel' }))
  );
});

test('resourceName is needed only to confirm by typing', async () => {
  const noop = () => undefined;
  // Type-level: `confirmByTyping` true requires the name it asks for.
  // @ts-expect-error resourceName is missing
  const typed: RemoveModalProps = {
    open: true,
    confirmByTyping: true,
    title: 'T',
    description: 'D',
    onClose: noop,
    onConfirm: noop,
  };
  void typed;
  render(
    <AfframeProvider>
      <RemoveModal
        open
        title="Delete the draft?"
        description="Deleting it is permanent."
        onClose={noop}
        onConfirm={noop}
      />
    </AfframeProvider>
  );
  await until(() =>
    expect(active()).toBe(screen.getByRole('button', { name: 'Cancel' }))
  );
  expect(screen.queryByRole('textbox')).toBeNull();
});
