import { render, screen, waitFor } from '@testing-library/react';
import { useRef, useState } from 'react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { AfframeProvider } from '../../index.js';
import {
  englishLeft as englishCreateLeft,
  sentinelMessages,
} from '../CreateEditFlow/flowTestUtils.js';
import { CreateModal, defaultCreateModalMessages } from './CreateModal.js';
import type { CreateModalProps } from './CreateModal.js';

type HarnessProps = Partial<
  Pick<
    CreateModalProps,
    'onSubmit' | 'submitDisabled' | 'isDirty' | 'messages' | 'onClose'
  >
> & { startOpen?: boolean };

function Harness({ startOpen = false, onClose, ...props }: HarnessProps) {
  const [open, setOpen] = useState(startOpen);
  const launcherRef = useRef<HTMLButtonElement>(null);
  return (
    <AfframeProvider>
      <button type="button" ref={launcherRef} onClick={() => setOpen(true)}>
        Launch
      </button>
      <CreateModal
        open={open}
        title="Item A"
        launcherRef={launcherRef}
        onSubmit={props.onSubmit ?? (() => undefined)}
        onClose={() => {
          onClose?.();
          setOpen(false);
        }}
        {...(props.submitDisabled ? { submitDisabled: true } : {})}
        {...(props.isDirty ? { isDirty: true } : {})}
        {...(props.messages ? { messages: props.messages } : {})}>
        <label>
          Field A
          <input />
        </label>
        <label>
          Field B
          <input />
        </label>
      </CreateModal>
    </AfframeProvider>
  );
}

const active = () => document.activeElement;
const fieldA = () => screen.getByRole('textbox', { name: 'Field A' });
const fieldB = () => screen.getByRole('textbox', { name: 'Field B' });

async function launch() {
  const launcher = screen.getByRole('button', { name: 'Launch' });
  await userEvent.click(launcher);
  await waitFor(() => expect(active()).toBe(fieldA()));
  return launcher;
}

test('opens on the first field and closes with Escape back to the launcher', async () => {
  const onClose = vi.fn();
  render(<Harness onClose={onClose} />);
  expect(screen.queryByRole('dialog')).toBeNull();
  const launcher = await launch();
  expect(screen.getByRole('dialog', { name: 'Item A' })).toBeTruthy();
  await userEvent.keyboard('{Escape}');
  expect(onClose).toHaveBeenCalledTimes(1);
  await waitFor(() => expect(active()).toBe(launcher));
});

test('Tab stays inside the modal and Shift+Tab wraps', async () => {
  render(<Harness />);
  await launch();
  await userEvent.tab();
  expect(active()).toBe(fieldB());
  const create = screen.getByRole('button', { name: 'Create' });
  const close = document.querySelector(
    '.afframe-create-modal .cds--modal-close'
  );
  await userEvent.tab();
  await userEvent.tab();
  expect(active()).toBe(create);
  await userEvent.tab();
  expect(active()).toBe(close);
  await userEvent.tab({ shift: true });
  expect(active()).toBe(create);
});

test('dirty: Escape asks first; Keep editing returns to the field; Discard closes', async () => {
  const onClose = vi.fn();
  render(<Harness isDirty onClose={onClose} />);
  await launch();
  await userEvent.keyboard('{Escape}');
  const keep = await screen.findByRole('button', { name: 'Keep editing' });
  await waitFor(() => expect(active()).toBe(keep));
  await userEvent.keyboard('{Escape}');
  await waitFor(() => expect(active()).toBe(fieldA()));
  expect(onClose).not.toHaveBeenCalled();
  expect(screen.getByRole('dialog', { name: 'Item A' })).toBeTruthy();

  await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
  await userEvent.click(await screen.findByRole('button', { name: 'Discard' }));
  expect(onClose).toHaveBeenCalledTimes(1);
  await waitFor(() =>
    expect(active()).toBe(screen.getByRole('button', { name: 'Launch' }))
  );
});

test('submitDisabled blocks Enter and the primary button', async () => {
  const onSubmit = vi.fn();
  render(<Harness submitDisabled onSubmit={onSubmit} />);
  await launch();
  await userEvent.keyboard('{Enter}');
  const create = screen.getByRole('button', { name: 'Create' });
  expect(create.hasAttribute('disabled')).toBe(true);
  expect(onSubmit).not.toHaveBeenCalled();
});

test('Enter submits once; async submit is busy, then closes', async () => {
  let resolve: () => void = () => undefined;
  const onSubmit = vi.fn(
    () =>
      new Promise<void>((done) => {
        resolve = done;
      })
  );
  const onClose = vi.fn();
  render(<Harness onSubmit={onSubmit} onClose={onClose} />);
  await launch();
  await userEvent.keyboard('{Enter}');
  await userEvent.keyboard('{Enter}');
  expect(onSubmit).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('form').getAttribute('aria-busy')).toBe('true');
  expect(screen.getAllByText('Creating').length).toBeGreaterThan(0);
  await userEvent.keyboard('{Escape}');
  expect(onClose).not.toHaveBeenCalled();
  resolve();
  await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
});

test('a rejected submit stays open with an alert and no onClose', async () => {
  const onClose = vi.fn();
  render(
    <Harness
      onClose={onClose}
      onSubmit={() => Promise.reject(new Error('Duplicate'))}
    />
  );
  await launch();
  await userEvent.click(screen.getByRole('button', { name: 'Create' }));
  expect((await screen.findByRole('alert')).textContent).toContain(
    defaultCreateModalMessages.submitError
  );
  expect(onClose).not.toHaveBeenCalled();
  expect(screen.getByRole('dialog', { name: 'Item A' })).toBeTruthy();
});

const s = sentinelMessages(defaultCreateModalMessages);
const englishLeft = () => englishCreateLeft(defaultCreateModalMessages);

test('messages replace every visible string and accessible name', async () => {
  render(
    <Harness
      isDirty
      messages={s}
      onSubmit={() => Promise.reject(new Error(''))}
    />
  );
  await launch();
  await userEvent.click(screen.getByRole('button', { name: s.create }));
  await screen.findByRole('alert');
  expect(englishLeft()).toEqual([]);
  await userEvent.click(screen.getByRole('button', { name: s.cancel }));
  await screen.findByRole('button', { name: s.keepEditing });
  expect(englishLeft()).toEqual([]);
});

test('messages replace the busy state strings too', async () => {
  render(
    <Harness messages={s} onSubmit={() => new Promise<void>(() => undefined)} />
  );
  await launch();
  await userEvent.click(screen.getByRole('button', { name: s.create }));
  await waitFor(() =>
    expect(document.body.textContent).toContain(s.submitting)
  );
  expect(englishLeft()).toEqual([]);
});
