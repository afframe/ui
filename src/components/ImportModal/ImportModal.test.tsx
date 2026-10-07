import { render, screen } from '@testing-library/react';
import { useRef, useState } from 'react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { AfframeProvider } from '../../provider/AfframeProvider.js';
import { formatFileSize } from '../ModalParts/fileSize.js';
import { defaultImportModalMessages, ImportModal } from './ImportModal.js';
import type { ImportModalProps } from './ImportModal.js';

type HarnessProps = Partial<Omit<ImportModalProps, 'open' | 'onClose'>> & {
  onClose?: () => void;
};

function Harness({
  onClose,
  onImport = () => undefined,
  ...props
}: HarnessProps) {
  const [open, setOpen] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button ref={launcherRef} type="button" onClick={() => setOpen(true)}>
        Open
      </button>
      <ImportModal
        onImport={onImport}
        {...props}
        launcherRef={launcherRef}
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
const until = (check: () => void) => vi.waitFor(check, { timeout: 2000 });
const drop = () =>
  screen.getByRole('button', {
    name: 'Drag and drop a file here or click to browse',
  });
const importButton = () =>
  screen.getByRole<HTMLButtonElement>('button', { name: 'Import' });
const fileInput = () => {
  const input = document.querySelector<HTMLInputElement>('input[type=file]');
  if (!input) throw new Error('no file input');
  return input;
};
const status = () => {
  const region = document.querySelector('.afframe-import-modal [role=status]');
  if (!region) throw new Error('no status region');
  return region;
};
const csv = (name = 'report.csv', size = 1500) =>
  new File(['x'.repeat(size)], name, { type: 'text/csv' });

function dropFiles(files: File[]) {
  const transfer = new DataTransfer();
  for (const file of files) transfer.items.add(file);
  drop().dispatchEvent(
    new DragEvent('drop', { dataTransfer: transfer, bubbles: true })
  );
}

async function openByKeyboard() {
  launcher().focus();
  await userEvent.keyboard('{Enter}');
  await until(() => expect(screen.queryByRole('dialog')).not.toBeNull());
  await until(() => expect(active()).toBe(drop()));
}

test('opens with focus on the drop area; Enter and Space open the file picker', async () => {
  renderHarness();
  await openByKeyboard();
  expect(screen.getByRole('dialog', { name: 'Import' })).toBeTruthy();
  const opened = vi.fn((event: Event) => event.preventDefault());
  fileInput().addEventListener('click', opened);
  await userEvent.keyboard('{Enter}');
  expect(opened).toHaveBeenCalledTimes(1);
  await userEvent.keyboard(' ');
  expect(opened).toHaveBeenCalledTimes(2);
});

test('keyboard happy path: add a file, Tab to Import, Enter imports and closes', async () => {
  const onImport = vi.fn();
  renderHarness({ onImport, accept: ['.csv'], maxFileSize: 5_000 });
  await openByKeyboard();
  expect(importButton().disabled).toBe(true);
  expect(screen.getByText('Accepted: .csv. Maximum size: 5 kB.')).toBeTruthy();
  const file = csv();
  await userEvent.upload(fileInput(), file);
  await until(() => expect(status().textContent).toBe('report.csv added.'));
  expect(screen.getByText('report.csv')).toBeTruthy();
  expect(screen.getByText(formatFileSize(1500))).toBeTruthy();
  expect(importButton().disabled).toBe(false);
  // Focus order from the drop area: the row's remove button, Cancel, Import.
  drop().focus();
  await userEvent.tab();
  expect(active()).toBe(
    screen.getByRole('button', { name: 'Remove file - report.csv' })
  );
  await userEvent.tab();
  await userEvent.tab();
  expect(active()).toBe(importButton());
  await userEvent.keyboard('{Enter}');
  expect(onImport).toHaveBeenCalledWith([file]);
  await until(() => expect(screen.queryByRole('dialog')).toBeNull());
  await until(() => expect(active()).toBe(launcher()));
});

test('rejects the wrong type and a file that is too large, on the item', async () => {
  renderHarness({
    accept: ['.csv', 'application/json'],
    maxFileSize: 1000,
    multiple: true,
  });
  await openByKeyboard();
  await userEvent.upload(fileInput(), [
    new File(['x'], 'tool.exe', { type: 'application/octet-stream' }),
    csv('big.csv', 2000),
    new File(['{}'], 'data', { type: 'application/json' }),
  ]);
  const alerts = await screen.findAllByRole('alert');
  const texts = alerts.map((alert) => alert.textContent);
  expect(texts).toContain(
    'tool.exe is not an accepted file type. Use .csv, application/json.'
  );
  expect(texts).toContain(`big.csv is larger than ${formatFileSize(1000)}.`);
  expect(status().textContent).toBe('data added.');
  expect(importButton().disabled).toBe(true);

  // Removing the invalid rows enables Import; focus goes to the drop area.
  await userEvent.click(
    screen.getByRole('button', { name: 'Remove file - tool.exe' })
  );
  expect(active()).toBe(drop());
  await userEvent.click(
    screen.getByRole('button', { name: 'Remove file - big.csv' })
  );
  expect(importButton().disabled).toBe(false);
});

test('multiple files are listed; a file with the same name replaces the row', async () => {
  const onImport = vi.fn();
  renderHarness({ multiple: true, onImport });
  await openByKeyboard();
  await userEvent.upload(fileInput(), [csv('a.csv'), csv('b.csv')]);
  await until(() =>
    expect(status().textContent).toBe('a.csv added. b.csv added.')
  );
  await userEvent.upload(fileInput(), [csv('a.csv', 10)]);
  expect(screen.getAllByRole('listitem')).toHaveLength(2);
  await userEvent.click(importButton());
  expect(onImport.mock.calls[0]?.[0].map((file: File) => file.name)).toEqual([
    'b.csv',
    'a.csv',
  ]);
});

test('without multiple, a new file replaces the old one', async () => {
  renderHarness();
  await openByKeyboard();
  await userEvent.upload(fileInput(), csv('a.csv'));
  await userEvent.upload(fileInput(), csv('b.csv'));
  expect(screen.getAllByRole('listitem')).toHaveLength(1);
  expect(screen.getByText('b.csv')).toBeTruthy();
});

test('URL path: field and button only with onImportUrl; rejection shows an alert', async () => {
  const onImportUrl = vi
    .fn<(url: string) => Promise<void>>()
    .mockRejectedValueOnce(new Error('404'))
    .mockResolvedValueOnce(undefined);
  renderHarness({ onImportUrl });
  await openByKeyboard();
  const field = screen.getByRole('textbox', { name: 'Or import from a URL' });
  const urlButton = screen.getByRole<HTMLButtonElement>('button', {
    name: 'Import from URL',
  });
  expect(urlButton.disabled).toBe(true);
  await userEvent.tab();
  expect(active()).toBe(field);
  await userEvent.keyboard('https://example.com/a.csv');
  expect(importButton().disabled).toBe(false);
  await userEvent.tab();
  expect(active()).toBe(urlButton);
  await userEvent.keyboard('{Enter}');
  expect(onImportUrl).toHaveBeenCalledWith('https://example.com/a.csv');
  // Carbon's TextInput also renders an empty counter alert; find by text.
  const alert = await screen.findByText('The import failed. Try again.');
  expect(alert.closest('[role=alert]')).not.toBeNull();
  await until(() => expect(active()).toBe(urlButton));
  await userEvent.keyboard('{Enter}');
  await until(() => expect(screen.queryByRole('dialog')).toBeNull());
});

test('no URL field without onImportUrl', async () => {
  renderHarness();
  await openByKeyboard();
  expect(screen.queryByRole('textbox')).toBeNull();
});

test('pending: Escape ignored; rejection keeps it open; Escape and close icon close', async () => {
  let reject: (error: Error) => void = () => undefined;
  const onImport = vi.fn(
    () =>
      new Promise<void>((_, fail) => {
        reject = fail;
      })
  );
  const onClose = vi.fn();
  renderHarness({ onImport, onClose });
  await openByKeyboard();
  await userEvent.upload(fileInput(), csv());
  await userEvent.click(importButton());
  await until(() =>
    expect(screen.getAllByText('Working').length).toBeGreaterThan(0)
  );
  await userEvent.keyboard('{Escape}');
  expect(onClose).not.toHaveBeenCalled();
  reject(new Error('no'));
  expect((await screen.findByRole('alert')).textContent).toContain(
    'The import failed. Try again.'
  );
  expect(screen.getByRole('dialog')).toBeTruthy();
  await userEvent.keyboard('{Escape}');
  await until(() => expect(onClose).toHaveBeenCalledTimes(1));
  await until(() => expect(active()).toBe(launcher()));
  await openByKeyboard();
  await userEvent.click(screen.getByLabelText('Close', { selector: 'button' }));
  await until(() => expect(onClose).toHaveBeenCalledTimes(2));
});

test('focus stays in the dialog while tabbing', async () => {
  renderHarness({ onImportUrl: () => undefined });
  await openByKeyboard();
  const dialog = screen.getByRole('dialog');
  for (let index = 0; index < 8; index += 1) {
    await userEvent.tab();
    const element = active();
    expect(element === document.body || dialog.contains(element)).toBe(true);
  }
});

test('overridden messages replace every English default', async () => {
  const messages = Object.fromEntries(
    Object.entries(defaultImportModalMessages).map(([key, value]) => [
      key,
      typeof value === 'function' ? () => `[[${key}]]` : `[[${key}]]`,
    ])
  );
  renderHarness({
    messages,
    accept: ['.csv'],
    maxFileSize: 1000,
    multiple: true,
    onImportUrl: () => Promise.reject(new Error('no')),
  });
  launcher().focus();
  await userEvent.keyboard('{Enter}');
  const dialog = await screen.findByRole('dialog');
  await userEvent.upload(fileInput(), [
    csv('a.csv', 10),
    csv('big.csv', 2000),
    new File(['x'], 'x.exe'),
  ]);
  await userEvent.type(
    screen.getByRole('textbox', { name: '[[urlLabel]]' }),
    'https://example.com'
  );
  await userEvent.click(screen.getByRole('button', { name: '[[urlButton]]' }));
  await until(() => expect(screen.getByText('[[importFailed]]')).toBeTruthy());
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
    .replace(/\[\[\w+\]\]/g, '')
    .replace(/(a|big|x)\.(csv|exe)/g, '');
  for (const word of [
    'Import',
    'Cancel',
    'Close',
    'Drag',
    'Add file',
    'Accepted',
    'URL',
    'example.com/file',
    'Remove',
    'larger',
    'accepted',
    'added',
    'failed',
    'Error',
    'Uploading',
  ])
    expect(visible).not.toContain(word);
  expect(visible).toContain('kB');
});

test('a file without a MIME type is checked by its extension against MIME rules', async () => {
  renderHarness({ accept: ['application/json', 'text/csv'] });
  await openByKeyboard();
  // Dropped, not uploaded: the upload helper infers a MIME type from the name.
  const file = new File(['{}'], 'data.json');
  expect(file.type).toBe('');
  dropFiles([file]);
  await until(() => expect(status().textContent).toBe('data.json added.'));
  expect(importButton().disabled).toBe(false);
});

test('single mode: dropping several files keeps the first and says the rest were ignored', async () => {
  renderHarness();
  await openByKeyboard();
  dropFiles([csv('a.csv'), csv('b.csv'), csv('c.csv')]);
  await until(() =>
    expect(status().textContent).toBe(
      'a.csv added. Only one file can be imported; 2 other files were ignored.'
    )
  );
  expect(
    screen.getByText(
      'Only one file can be imported; 2 other files were ignored.',
      { selector: 'p:not([role=status])' }
    )
  ).toBeTruthy();
  expect(screen.getAllByRole('listitem')).toHaveLength(1);
});
