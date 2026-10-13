import { render, screen, waitFor, within } from '@testing-library/react';
import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { tabbable } from 'tabbable';
import { afterEach, expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { settleAndCleanup } from '../components/FlowParts/flowTestUtils.js';
import {
  EditTearsheet,
  EditTearsheetForm,
  Modal,
  TextInput,
} from '../index.js';
import { AfframeProvider } from './AfframeProvider.js';

afterEach(settleAndCleanup);

const active = () => document.activeElement;

/** A native dialog opened with showModal(), or show() when not modal. */
function NativeDialog({
  modal = true,
  children,
}: {
  modal?: boolean;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (modal) dialog?.showModal();
    else dialog?.show();
    return () => dialog?.close();
  }, [modal]);
  return (
    <dialog ref={ref} aria-label="Test dialog">
      {children}
    </dialog>
  );
}

test('counts a radio group by its active stop and skips inert content', async () => {
  render(
    <AfframeProvider>
      <NativeDialog>
        <button type="button">First</button>
        <input type="radio" name="r" aria-label="A" />
        <input type="radio" name="r" aria-label="B" defaultChecked />
        <input type="radio" name="r" aria-label="C" />
        <div inert>
          <button type="button">Hidden</button>
        </div>
      </NativeDialog>
    </AfframeProvider>
  );
  const b = screen.getByRole('radio', { name: 'B' });
  b.focus();
  await userEvent.tab();
  expect(active()).toBe(screen.getByRole('button', { name: 'First' }));
  await userEvent.tab({ shift: true });
  expect(active()).toBe(b);
});

test('wraps a Carbon Modal both ways', async () => {
  render(
    <AfframeProvider>
      <Modal
        open
        modalHeading="Rename"
        primaryButtonText="Save"
        secondaryButtonText="Cancel">
        <TextInput id="name" labelText="Name" />
      </Modal>
    </AfframeProvider>
  );
  const dialog = await screen.findByRole('dialog');
  const stops = tabbable(dialog);
  const first = stops[0];
  const last = stops[stops.length - 1];
  last?.focus();
  await userEvent.tab();
  expect(active()).toBe(first);
  await userEvent.tab({ shift: true });
  expect(active()).toBe(last);
});

function DirtyTearsheet() {
  const [open, setOpen] = useState(true);
  return (
    <EditTearsheet
      open={open}
      title="Customer"
      isDirty
      onClose={() => setOpen(false)}
      onSubmit={() => undefined}>
      <EditTearsheetForm id="general" title="General">
        <TextInput id="customer-name" labelText="Name" />
      </EditTearsheetForm>
    </EditTearsheet>
  );
}

test('wraps inside a discard dialog over an EditTearsheet', async () => {
  render(
    <AfframeProvider>
      <DirtyTearsheet />
    </AfframeProvider>
  );
  await userEvent.click(await screen.findByRole('button', { name: 'Cancel' }));
  const discard = await screen.findByRole('alertdialog');
  const keep = within(discard).getByRole('button', { name: 'Keep editing' });
  await waitFor(() => expect(active()).toBe(keep));
  const stops = tabbable(discard);
  for (let index = 0; index < stops.length + 1; index += 1) {
    await userEvent.tab();
    expect(discard.contains(active())).toBe(true);
  }
});

test('leaves a non-modal dialog alone', async () => {
  render(
    <AfframeProvider>
      <NativeDialog modal={false}>
        <button type="button">Only</button>
      </NativeDialog>
      <button type="button">After</button>
    </AfframeProvider>
  );
  screen.getByRole('button', { name: 'Only' }).focus();
  await userEvent.tab();
  expect(active()).toBe(screen.getByRole('button', { name: 'After' }));
});

test('nested providers wrap once', async () => {
  render(
    <AfframeProvider>
      <AfframeProvider>
        <NativeDialog>
          <button type="button">First</button>
          <button type="button">Last</button>
        </NativeDialog>
      </AfframeProvider>
    </AfframeProvider>
  );
  const first = screen.getByRole('button', { name: 'First' });
  const focus = vi.spyOn(first, 'focus');
  screen.getByRole('button', { name: 'Last' }).focus();
  await userEvent.tab();
  expect(active()).toBe(first);
  expect(focus).toHaveBeenCalledTimes(1);
});

test('wraps from focus parked on a content wrapper after the last stop', async () => {
  render(
    <AfframeProvider>
      <NativeDialog>
        <button type="button">Close</button>
        <div tabIndex={-1} data-testid="body">
          Working
        </div>
        <button type="button" disabled>
          Save
        </button>
      </NativeDialog>
    </AfframeProvider>
  );
  screen.getByTestId('body').focus();
  await userEvent.tab();
  expect(active()).toBe(screen.getByRole('button', { name: 'Close' }));
  screen.getByTestId('body').focus();
  await userEvent.tab({ shift: true });
  expect(active()).toBe(screen.getByRole('button', { name: 'Close' }));
});

test('without the provider Tab is not wrapped', async () => {
  render(
    <NativeDialog>
      <button type="button">First</button>
      <button type="button">Last</button>
    </NativeDialog>
  );
  screen.getByRole('button', { name: 'Last' }).focus();
  await userEvent.tab();
  expect(active()).not.toBe(screen.getByRole('button', { name: 'First' }));
});
