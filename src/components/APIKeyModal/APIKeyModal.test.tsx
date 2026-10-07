import { render, screen } from '@testing-library/react';
import { useRef, useState } from 'react';
import { afterEach, expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { AfframeProvider } from '../../provider/AfframeProvider.js';
import { APIKeyModal, defaultAPIKeyModalMessages } from './APIKeyModal.js';
import type { APIKeyModalProps } from './APIKeyModal.js';

afterEach(() => {
  vi.restoreAllMocks();
});

const KEY = 'ak_live_9f8e7d6c5b4a';

type HarnessProps = Partial<Omit<APIKeyModalProps, 'open' | 'onClose'>> & {
  onClose?: () => void;
};

function Harness({ onClose, ...props }: HarnessProps) {
  const [open, setOpen] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button ref={launcherRef} type="button" onClick={() => setOpen(true)}>
        Open
      </button>
      <APIKeyModal
        // Test props mix both modes; each test passes a valid combination.
        {...({
          onGenerate: () => Promise.resolve(KEY),
          ...props,
          launcherRef,
          open,
          onClose: () => {
            onClose?.();
            setOpen(false);
          },
        } as APIKeyModalProps)}
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
const until = (check: () => void) => vi.waitFor(check, { timeout: 2000 });
const nameField = () =>
  screen.getByRole<HTMLInputElement>('textbox', { name: 'Name' });
const button = (name: string) =>
  screen.getByRole<HTMLButtonElement>('button', { name });
const keyField = () =>
  screen.getByLabelText<HTMLInputElement>('API key', { selector: 'input' });
const status = () => {
  const region = document.querySelector('.afframe-api-key-modal [role=status]');
  if (!region) throw new Error('no status region');
  return region;
};

async function open(focus: () => HTMLElement = nameField) {
  launcher().focus();
  await userEvent.keyboard('{Enter}');
  await until(() => expect(screen.queryByRole('dialog')).not.toBeNull());
  await until(() => expect(active()).toBe(focus()));
}

async function generateByKeyboard(name = 'CI pipeline') {
  await userEvent.keyboard(name);
  await userEvent.tab();
  await userEvent.tab();
  expect(active()).toBe(button('Generate'));
  await userEvent.keyboard('{Enter}');
  await until(() => expect(active()).toBe(keyField()));
}

test('keyboard happy path: name, Generate, key hidden until toggled, Done closes', async () => {
  const onGenerate = vi.fn(() => Promise.resolve(KEY));
  renderHarness({ onGenerate });
  await open();
  expect(
    screen.getByRole('dialog', { name: 'Generate an API key' })
  ).toBeTruthy();
  expect(nameField().getAttribute('autocomplete')).toBe('off');
  expect(button('Generate').disabled).toBe(true);
  await generateByKeyboard();
  expect(onGenerate).toHaveBeenCalledWith('CI pipeline');

  const field = keyField();
  expect(field.value).toBe(KEY);
  expect(field.type).toBe('password');
  expect(field.readOnly).toBe(true);
  expect(field.getAttribute('autocomplete')).toBe('off');
  // The key is in the input's value property only, never in the markup.
  expect(document.body.outerHTML).not.toContain(KEY);
  expect(screen.getByText(/Store this key now in a safe place/).id).toBe(
    field.getAttribute('aria-describedby')
  );

  await userEvent.tab();
  const toggle = screen.getByLabelText('Show key', { selector: 'button' });
  expect(active()).toBe(toggle);
  await userEvent.keyboard('{Enter}');
  expect(field.type).toBe('text');
  expect(screen.getByLabelText('Hide key', { selector: 'button' })).toBe(
    toggle
  );
  expect(document.body.outerHTML).not.toContain(KEY);

  await userEvent.tab();
  await userEvent.tab();
  expect(active()).toBe(button('Done'));
  await userEvent.keyboard('{Enter}');
  await until(() => expect(screen.queryByRole('dialog')).toBeNull());
  await until(() => expect(active()).toBe(launcher()));
});

test('copy writes the key to the clipboard and announces it; failure is announced', async () => {
  const writeText = vi
    .spyOn(navigator.clipboard, 'writeText')
    .mockResolvedValueOnce(undefined)
    .mockRejectedValueOnce(new Error('denied'));
  renderHarness();
  await open();
  await generateByKeyboard();
  const copy = screen.getByLabelText('Copy key', { selector: 'button' });
  await userEvent.click(copy);
  expect(writeText).toHaveBeenCalledWith(KEY);
  await until(() => expect(status().textContent).toBe('Copied'));
  await userEvent.click(copy);
  await until(() =>
    expect(status().textContent).toBe(
      'The key could not be copied. Select it and copy it by hand.'
    )
  );
});

test('download creates a Blob URL, clicks a link and revokes the URL', async () => {
  const create = vi.spyOn(URL, 'createObjectURL');
  const revoke = vi.spyOn(URL, 'revokeObjectURL');
  const links: HTMLAnchorElement[] = [];
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
    this: HTMLAnchorElement
  ) {
    links.push(this);
  });
  renderHarness({
    showDownload: true,
    downloadFileName: 'ci-key',
    downloadFileType: 'json',
  });
  await open();
  await generateByKeyboard();
  await userEvent.click(button('Download'));
  expect(create).toHaveBeenCalledTimes(1);
  const blob = create.mock.calls[0]?.[0] as Blob;
  expect(blob.type).toBe('application/json');
  expect(JSON.parse(await blob.text())).toEqual({
    name: 'CI pipeline',
    apiKey: KEY,
  });
  expect(links[0]?.download).toBe('ci-key.json');
  const url = create.mock.results[0]?.value as string;
  expect(links[0]?.href).toBe(url);
  await until(() => expect(revoke).toHaveBeenCalledWith(url));
});

test('the key is cleared on close and not in the DOM after reopening', async () => {
  renderHarness();
  await open();
  await generateByKeyboard();
  await userEvent.keyboard('{Escape}');
  await until(() => expect(screen.queryByRole('dialog')).toBeNull());
  await until(() => expect(active()).toBe(launcher()));
  expect(document.body.outerHTML).not.toContain(KEY);
  await open();
  expect(nameField().value).toBe('');
  expect(
    [...document.querySelectorAll('input')].some((input) => input.value === KEY)
  ).toBe(false);
  expect(document.body.textContent).not.toContain(KEY);
});

test('pending and rejection: stays on the name step with an alert', async () => {
  let reject: (error: Error) => void = () => undefined;
  const onGenerate = vi.fn(
    () =>
      new Promise<string>((_, fail) => {
        reject = fail;
      })
  );
  const onClose = vi.fn();
  renderHarness({ onGenerate, onClose });
  await open();
  await userEvent.keyboard('CI');
  await userEvent.click(button('Generate'));
  await until(() =>
    expect(screen.getAllByText('Working').length).toBeGreaterThan(0)
  );
  await userEvent.keyboard('{Escape}');
  expect(onClose).not.toHaveBeenCalled();
  reject(new Error('quota'));
  const alert = await screen.findByText('Something went wrong. Try again.');
  expect(alert.closest('[role=alert]')).not.toBeNull();
  expect(nameField().value).toBe('CI');
  await until(() => expect(active()).toBe(button('Generate')));
  await userEvent.click(screen.getByLabelText('Close', { selector: 'button' }));
  await until(() => expect(onClose).toHaveBeenCalledTimes(1));
});

test('steps: Next and Previous move focus with the content, then the name step', async () => {
  const onGenerate = vi.fn(() => Promise.resolve(KEY));
  renderHarness({
    onGenerate,
    steps: [
      { title: 'Scope', content: <p>Read-only access.</p> },
      { title: 'Expiry', content: <p>Never expires.</p>, valid: false },
    ],
  });
  const body = () => {
    const element = document.querySelector<HTMLElement>(
      '.afframe-api-key-modal .afframe-modal-body'
    );
    if (!element) throw new Error('no body');
    return element;
  };
  await open(body);
  expect(screen.getByRole('heading', { name: 'Scope' })).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Cancel' })).toBeTruthy();
  await userEvent.click(button('Next'));
  await until(() => expect(active()).toBe(body()));
  expect(screen.getByRole('heading', { name: 'Expiry' })).toBeTruthy();
  expect(button('Next').disabled).toBe(true);
  await userEvent.click(button('Previous'));
  expect(screen.getByRole('heading', { name: 'Scope' })).toBeTruthy();
  expect(screen.queryByRole('dialog')).not.toBeNull();
});

test('steps: valid steps lead to the name field', async () => {
  renderHarness({ steps: [{ title: 'Scope', content: <p>Read-only.</p> }] });
  launcher().focus();
  await userEvent.keyboard('{Enter}');
  await screen.findByRole('dialog');
  await userEvent.click(await screen.findByRole('button', { name: 'Next' }));
  await until(() => expect(active()).toBe(nameField()));
  expect(button('Previous')).toBeTruthy();
});

test('edit mode saves the name and closes', async () => {
  const onSave = vi.fn();
  renderHarness({ mode: 'edit', onSave, apiKeyName: 'Old name' });
  await open();
  expect(screen.getByRole('dialog', { name: 'Edit API key' })).toBeTruthy();
  expect(nameField().value).toBe('Old name');
  await userEvent.clear(nameField());
  expect(button('Save').disabled).toBe(true);
  await userEvent.keyboard('New name');
  await userEvent.click(button('Save'));
  expect(onSave).toHaveBeenCalledWith('New name');
  await until(() => expect(screen.queryByRole('dialog')).toBeNull());
});

test('nameRequired false allows an empty name; focus stays in the dialog', async () => {
  renderHarness({ nameRequired: false });
  await open();
  expect(button('Generate').disabled).toBe(false);
  const dialog = screen.getByRole('dialog');
  for (let index = 0; index < 6; index += 1) {
    await userEvent.tab();
    const element = active();
    expect(element === document.body || dialog.contains(element)).toBe(true);
  }
});

test('overridden messages replace every English default', async () => {
  vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('x'));
  const messages = Object.fromEntries(
    Object.keys(defaultAPIKeyModalMessages).map((key) => [key, `[[${key}]]`])
  );
  renderHarness({ messages, showDownload: true });
  launcher().focus();
  await userEvent.keyboard('{Enter}');
  const dialog = await screen.findByRole('dialog');
  await userEvent.type(
    screen.getByRole('textbox', { name: '[[nameLabel]]' }),
    'CI'
  );
  await userEvent.click(screen.getByRole('button', { name: '[[generate]]' }));
  const copy = await screen.findByLabelText('[[copy]]', { selector: 'button' });
  await userEvent.click(copy);
  await until(() => expect(status().textContent).toBe('[[copyFailed]]'));
  const visible = [
    dialog.textContent ?? '',
    ...[...dialog.querySelectorAll('[aria-label],[title],[placeholder]')].map(
      (element) =>
        ['aria-label', 'title', 'placeholder']
          .map((name) => element.getAttribute(name) ?? '')
          .join(' ')
    ),
  ]
    .join(' ')
    .replace(/\[\[\w+\]\]/g, '');
  for (const word of [
    'API',
    'key',
    'Key',
    'Generate',
    'Copy',
    'Store',
    'Download',
    'Done',
    'Close',
    'Show',
  ])
    expect(visible, visible).not.toContain(word);
});

test('a key that resolves after the parent closed the dialog is dropped', async () => {
  let resolve: (key: string) => void = () => undefined;
  const props = {
    onClose: () => undefined,
    onGenerate: () =>
      new Promise<string>((done) => {
        resolve = done;
      }),
  };
  // Without the provider the closed Carbon modal stays mounted, so a stored
  // key would still be in the document.
  const { rerender } = render(<APIKeyModal {...props} open />);
  await userEvent.type(nameField(), 'CI');
  await userEvent.click(button('Generate'));
  rerender(<APIKeyModal {...props} open={false} />);
  resolve(KEY);
  await new Promise((done) => setTimeout(done, 50));
  expect(
    [...document.querySelectorAll('input')].some((input) => input.value === KEY)
  ).toBe(false);
});

test('an empty key counts as a failure', async () => {
  renderHarness({ onGenerate: () => Promise.resolve('') });
  await open();
  await userEvent.keyboard('CI');
  await userEvent.click(button('Generate'));
  const alert = await screen.findByText('Something went wrong. Try again.');
  expect(alert.closest('[role=alert]')).not.toBeNull();
  expect(screen.queryByLabelText('API key', { selector: 'input' })).toBeNull();
});

test('the copy button feedback matches the announcement when copying fails', async () => {
  vi.spyOn(navigator.clipboard, 'writeText').mockRejectedValue(new Error('x'));
  renderHarness();
  await open();
  await generateByKeyboard();
  const copy = screen.getByLabelText('Copy key', { selector: 'button' });
  await userEvent.click(copy);
  const failed = 'The key could not be copied. Select it and copy it by hand.';
  await until(() => expect(status().textContent).toBe(failed));
  expect(screen.getByLabelText(failed, { selector: 'button' })).toBe(copy);
  expect(document.body.textContent).not.toContain('Copied');
});

test('download: the link is in the document while clicked; the URL lives about a second', async () => {
  const revoke = vi.spyOn(URL, 'revokeObjectURL');
  const connected: boolean[] = [];
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
    this: HTMLAnchorElement
  ) {
    connected.push(this.isConnected);
  });
  renderHarness({ showDownload: true });
  await open();
  await generateByKeyboard();
  await userEvent.click(button('Download'));
  expect(connected).toEqual([true]);
  expect(document.querySelector('a[download]')).toBeNull();
  await new Promise((done) => setTimeout(done, 300));
  expect(revoke).not.toHaveBeenCalled();
  await vi.waitFor(() => expect(revoke).toHaveBeenCalledTimes(1), {
    timeout: 2000,
  });
});

test('generate mode requires onGenerate (type check)', () => {
  const element = (
    // @ts-expect-error onGenerate is required in generate mode
    <APIKeyModal open={false} onClose={() => undefined} />
  );
  expect(element).toBeTruthy();
});
