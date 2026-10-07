import { render, screen } from '@testing-library/react';
import { useRef, useState } from 'react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { AfframeProvider } from '../../provider/AfframeProvider.js';
import { defaultExportModalMessages, ExportModal } from './ExportModal.js';
import type { ExportModalProps } from './ExportModal.js';

type HarnessProps = Partial<Omit<ExportModalProps, 'open' | 'onClose'>> & {
  onClose?: () => void;
};

const formats = [
  { extension: 'csv', description: 'Spreadsheet' },
  { extension: '.xlsx', description: 'Excel workbook' },
  { extension: 'pdf' },
];

function Harness({
  onClose,
  onExport = () => undefined,
  ...props
}: HarnessProps) {
  const [open, setOpen] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <button ref={launcherRef} type="button" onClick={() => setOpen(true)}>
        Open
      </button>
      <ExportModal
        filename="invoices-2026"
        formats={formats}
        onExport={onExport}
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
const until = (check: () => void, timeout = 2000) =>
  vi.waitFor(check, { timeout });
const nameField = () =>
  screen.getByRole<HTMLInputElement>('textbox', { name: 'File name' });
const exportButton = () =>
  screen.getByRole<HTMLButtonElement>('button', { name: 'Export' });
const radio = (name: string) =>
  screen.getByRole<HTMLInputElement>('radio', { name });

async function openByKeyboard() {
  launcher().focus();
  await userEvent.keyboard('{Enter}');
  await until(() => expect(screen.queryByRole('dialog')).not.toBeNull());
  await until(() => expect(active()).toBe(nameField()));
}

test('keyboard happy path: rename, arrow to a format, export, success announced, closes', async () => {
  const onExport = vi.fn();
  const onClose = vi.fn();
  renderHarness({ onExport, onClose });
  await openByKeyboard();
  expect(screen.getByRole('dialog', { name: 'Export' })).toBeTruthy();
  expect(nameField().value).toBe('invoices-2026');
  expect(radio('Spreadsheet (.csv)').checked).toBe(true);
  await userEvent.keyboard('{ControlOrMeta>}a{/ControlOrMeta}q3-invoices');
  await userEvent.tab();
  expect(active()).toBe(radio('Spreadsheet (.csv)'));
  await userEvent.keyboard('{ArrowDown}');
  expect(active()).toBe(radio('Excel workbook (.xlsx)'));
  expect(radio('Excel workbook (.xlsx)').checked).toBe(true);
  await userEvent.keyboard('{ArrowDown}');
  expect(radio('.pdf').checked).toBe(true);
  await userEvent.keyboard('{ArrowUp}');
  await userEvent.tab();
  await userEvent.tab();
  expect(active()).toBe(exportButton());
  await userEvent.keyboard('{Enter}');
  expect(onExport).toHaveBeenCalledWith({
    filename: 'q3-invoices',
    extension: '.xlsx',
  });
  const status = await screen.findByText('q3-invoices.xlsx was exported.');
  expect(status.getAttribute('role')).toBe('status');
  expect(onClose).not.toHaveBeenCalled();
  await until(() => expect(onClose).toHaveBeenCalledTimes(1), 4000);
  await until(() => expect(active()).toBe(launcher()));
});

test('closeOnSuccess false keeps the dialog open after success', async () => {
  const onClose = vi.fn();
  renderHarness({ onClose, closeOnSuccess: false });
  await openByKeyboard();
  await userEvent.click(exportButton());
  await screen.findByText('invoices-2026.csv was exported.');
  await new Promise((resolve) => setTimeout(resolve, 1800));
  expect(onClose).not.toHaveBeenCalled();
  expect(exportButton().disabled).toBe(true);
});

test('filename validation: empty, forbidden characters and a custom rule', async () => {
  renderHarness({
    validate: (name) => (name === 'con' ? 'Reserved name.' : undefined),
  });
  await openByKeyboard();
  await userEvent.clear(nameField());
  const message = 'Enter a name without these characters: \\ / : * ? " < > |';
  expect(screen.getByText(message)).toBeTruthy();
  expect(exportButton().disabled).toBe(true);
  await userEvent.type(nameField(), 'a/b');
  expect(screen.getByText(message)).toBeTruthy();
  expect(exportButton().disabled).toBe(true);
  await userEvent.clear(nameField());
  await userEvent.type(nameField(), 'con');
  expect(screen.getByText('Reserved name.')).toBeTruthy();
  await userEvent.clear(nameField());
  await userEvent.type(nameField(), 'report');
  expect(exportButton().disabled).toBe(false);
});

test('read-only name when not editable', async () => {
  renderHarness({ filenameEditable: false });
  await openByKeyboard();
  expect(nameField().readOnly).toBe(true);
});

test('password: toggle name changes, required, sent with the request, never in an attribute', async () => {
  const onExport = vi.fn();
  renderHarness({ onExport, password: { required: true } });
  await openByKeyboard();
  const field = screen.getByLabelText<HTMLInputElement>('Password', {
    selector: 'input',
  });
  expect(field.type).toBe('password');
  expect(exportButton().disabled).toBe(true);
  const show = screen.getByLabelText('Show password', { selector: 'button' });
  await userEvent.click(show);
  expect(field.type).toBe('text');
  expect(screen.getByLabelText('Hide password', { selector: 'button' })).toBe(
    show
  );
  await userEvent.click(show);
  expect(field.type).toBe('password');
  await userEvent.click(field);
  await userEvent.tab();
  expect(screen.getByText('Enter a password.')).toBeTruthy();
  await userEvent.type(field, 's3cret-value');
  expect(screen.getByRole('dialog').outerHTML).not.toContain('s3cret-value');
  await userEvent.click(exportButton());
  expect(onExport).toHaveBeenCalledWith({
    filename: 'invoices-2026',
    extension: 'csv',
    password: 's3cret-value',
  });
});

test('pending: Escape ignored; rejection keeps it open with an alert', async () => {
  let reject: (error: Error) => void = () => undefined;
  const onExport = vi.fn(
    () =>
      new Promise<void>((_, fail) => {
        reject = fail;
      })
  );
  const onClose = vi.fn();
  renderHarness({ onExport, onClose });
  await openByKeyboard();
  await userEvent.click(exportButton());
  await until(() =>
    expect(screen.getAllByText('Exporting').length).toBeGreaterThan(0)
  );
  await userEvent.keyboard('{Escape}');
  expect(onClose).not.toHaveBeenCalled();
  reject(new Error('no'));
  const alert = await screen.findByText('Something went wrong. Try again.');
  expect(alert.closest('[role=alert]')).not.toBeNull();
  await until(() => expect(active()).toBe(exportButton()));
  await userEvent.keyboard('{Escape}');
  await until(() => expect(onClose).toHaveBeenCalledTimes(1));
  await until(() => expect(active()).toBe(launcher()));
  await openByKeyboard();
  await userEvent.click(screen.getByLabelText('Close', { selector: 'button' }));
  await until(() => expect(onClose).toHaveBeenCalledTimes(2));
});

test('focus stays in the dialog while tabbing; reopening resets the form', async () => {
  renderHarness({ password: true });
  await openByKeyboard();
  const dialog = screen.getByRole('dialog');
  for (let index = 0; index < 8; index += 1) {
    await userEvent.tab();
    const element = active();
    expect(element === document.body || dialog.contains(element)).toBe(true);
  }
  await userEvent.clear(nameField());
  await userEvent.type(nameField(), 'changed');
  await userEvent.keyboard('{Escape}');
  await until(() => expect(screen.queryByRole('dialog')).toBeNull());
  await openByKeyboard();
  expect(nameField().value).toBe('invoices-2026');
});

test('overridden messages replace every English default', async () => {
  const messages = Object.fromEntries(
    Object.entries(defaultExportModalMessages).map(([key, value]) => [
      key,
      typeof value === 'function' ? () => `[[${key}]]` : `[[${key}]]`,
    ])
  );
  let reject: (error: Error) => void = () => undefined;
  renderHarness({
    messages,
    password: { required: true },
    onExport: () =>
      new Promise<void>((_, fail) => {
        reject = fail;
      }),
  });
  launcher().focus();
  await userEvent.keyboard('{Enter}');
  const dialog = await screen.findByRole('dialog');
  const field = screen.getByLabelText<HTMLInputElement>('[[passwordLabel]]', {
    selector: 'input',
  });
  await userEvent.click(field);
  await userEvent.tab();
  await userEvent.type(field, 'pw');
  await userEvent.clear(
    screen.getByRole('textbox', { name: '[[filenameLabel]]' })
  );
  await userEvent.type(
    screen.getByRole('textbox', { name: '[[filenameLabel]]' }),
    'ok'
  );
  await userEvent.click(screen.getByRole('button', { name: '[[export]]' }));
  await until(() =>
    expect(screen.getAllByText('[[exporting]]').length).toBeGreaterThan(0)
  );
  reject(new Error('no'));
  await screen.findByText('[[genericError]]');
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
    'Export',
    'File name',
    'Format',
    'Password',
    'password',
    'Cancel',
    'Close',
    'Something',
    'Error',
  ])
    expect(visible, visible).not.toContain(word);
});

test('a success that resolves after the parent closed the dialog is dropped', async () => {
  let resolve: () => void = () => undefined;
  const onClose = vi.fn();
  const props = {
    filename: 'invoices-2026',
    formats,
    onClose,
    onExport: () =>
      new Promise<void>((done) => {
        resolve = done;
      }),
  };
  const { rerender } = render(
    <AfframeProvider>
      <ExportModal {...props} open />
    </AfframeProvider>
  );
  await userEvent.click(await screen.findByRole('button', { name: 'Export' }));
  rerender(
    <AfframeProvider>
      <ExportModal {...props} open={false} />
    </AfframeProvider>
  );
  resolve();
  await new Promise((done) => setTimeout(done, 1800));
  expect(onClose).not.toHaveBeenCalled();
});

test('closing before the success delay ends calls onClose once', async () => {
  const onClose = vi.fn();
  renderHarness({ onClose });
  await openByKeyboard();
  await userEvent.click(exportButton());
  await screen.findByText('invoices-2026.csv was exported.');
  await userEvent.keyboard('{Escape}');
  await new Promise((done) => setTimeout(done, 1800));
  expect(onClose).toHaveBeenCalledTimes(1);
});

test('when the formats change and lose the selected one, the first is selected', async () => {
  const onExport = vi.fn();
  const props = { filename: 'report', onClose: () => undefined, onExport };
  const { rerender } = render(
    <AfframeProvider>
      <ExportModal {...props} formats={formats} open />
    </AfframeProvider>
  );
  await userEvent.click(await screen.findByText('.pdf'));
  expect(radio('.pdf').checked).toBe(true);
  rerender(
    <AfframeProvider>
      <ExportModal
        {...props}
        formats={[{ extension: 'json' }, { extension: 'csv' }]}
        open
      />
    </AfframeProvider>
  );
  expect(radio('.json').checked).toBe(true);
  await userEvent.click(exportButton());
  expect(onExport).toHaveBeenCalledWith({
    filename: 'report',
    extension: 'json',
  });
});
