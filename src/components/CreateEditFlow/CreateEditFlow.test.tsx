import { act, render, screen, waitFor } from '@testing-library/react';
import { useEffect, useRef, useState } from 'react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { AfframeProvider } from '../../index.js';
import {
  defaultCreateEditFlowMessages,
  DiscardDialog,
  FlowError,
  FlowForm,
  useCreateEditFlow,
  wrapTabInDialog,
} from './CreateEditFlow.js';
import type { CreateEditFlowMessages } from './CreateEditFlow.js';

const messages = defaultCreateEditFlowMessages;

function Surface({
  open,
  onClose,
  onSubmit,
  isDirty = false,
  confirmDiscard,
  launcherRef,
  submitDisabled,
  windowEscape = false,
  surfaceMessages = messages,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void | Promise<void>;
  isDirty?: boolean;
  confirmDiscard?: boolean;
  launcherRef?: React.RefObject<HTMLElement | null>;
  submitDisabled?: boolean;
  windowEscape?: boolean;
  surfaceMessages?: CreateEditFlowMessages;
}) {
  const flow = useCreateEditFlow({
    open,
    onClose,
    onSubmit,
    isDirty,
    ...(confirmDiscard === undefined ? {} : { confirmDiscard }),
    ...(launcherRef ? { launcherRef } : {}),
    messages: surfaceMessages,
  });
  const { requestClose } = flow;
  // Like IBM SidePanel: a window Escape listener that calls requestClose.
  useEffect(() => {
    if (!open || !windowEscape) return;
    const listener = (event: KeyboardEvent) => {
      if (event.key === 'Escape') requestClose();
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [open, windowEscape, requestClose]);
  if (!open) return null;
  return (
    <>
      <FlowForm
        flow={flow}
        aria-label="Surface"
        {...(submitDisabled ? { submitDisabled } : {})}>
        <label>
          Name
          <input name="name" />
        </label>
        <textarea aria-label="Notes" />
        <FlowError error={flow.error} messages={messages} />
        <button type="button" onClick={requestClose}>
          Close
        </button>
        <button type="button" onClick={() => void flow.submit()}>
          {flow.submitting ? 'Busy' : 'Save'}
        </button>
      </FlowForm>
      <DiscardDialog flow={flow} messages={messages} />
    </>
  );
}

function Harness(props: {
  onSubmit?: () => void | Promise<void>;
  onClose?: () => void;
  isDirty?: boolean;
  confirmDiscard?: boolean;
  submitDisabled?: boolean;
  windowEscape?: boolean;
  removeLauncher?: boolean;
  closeRef?: { current: () => void };
  surfaceMessages?: CreateEditFlowMessages;
}) {
  const [open, setOpen] = useState(false);
  if (props.closeRef) props.closeRef.current = () => setOpen(false);
  const [launcherShown, setLauncherShown] = useState(true);
  const launcherRef = useRef<HTMLButtonElement>(null);
  return (
    <AfframeProvider>
      {launcherShown && (
        <button type="button" onClick={() => setOpen(true)}>
          Open
        </button>
      )}
      <button type="button" ref={launcherRef}>
        Fallback
      </button>
      <div data-testid="blank">Blank area</div>
      <Surface
        open={open}
        launcherRef={launcherRef}
        onSubmit={props.onSubmit ?? (() => undefined)}
        onClose={() => {
          props.onClose?.();
          if (props.removeLauncher) setLauncherShown(false);
          setOpen(false);
        }}
        {...(props.isDirty === undefined ? {} : { isDirty: props.isDirty })}
        {...(props.confirmDiscard === undefined
          ? {}
          : { confirmDiscard: props.confirmDiscard })}
        {...(props.submitDisabled ? { submitDisabled: true } : {})}
        {...(props.windowEscape ? { windowEscape: true } : {})}
        {...(props.surfaceMessages
          ? { surfaceMessages: props.surfaceMessages }
          : {})}
      />
    </AfframeProvider>
  );
}

const active = () => document.activeElement;

async function openSurface() {
  const launcher = screen.getByRole('button', { name: 'Open' });
  launcher.focus();
  await userEvent.click(launcher);
  return launcher;
}

test('sync submit closes and returns focus to the element that opened it', async () => {
  const onClose = vi.fn();
  render(<Harness onClose={onClose} />);
  const launcher = await openSurface();
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(onClose).toHaveBeenCalledTimes(1);
  await waitFor(() => expect(active()).toBe(launcher));
});

test('Enter in a single-line input submits once; not in a textarea or when disabled', async () => {
  const onSubmit = vi.fn(() => new Promise<void>(() => undefined));
  const { unmount } = render(<Harness onSubmit={onSubmit} />);
  await openSurface();
  await userEvent.click(screen.getByRole('textbox', { name: 'Notes' }));
  await userEvent.keyboard('{Enter}');
  expect(onSubmit).not.toHaveBeenCalled();
  await userEvent.click(screen.getByRole('textbox', { name: 'Name' }));
  await userEvent.keyboard('{Enter}');
  await userEvent.keyboard('{Enter}');
  expect(onSubmit).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('form').getAttribute('aria-busy')).toBe('true');
  unmount();

  const blocked = vi.fn();
  render(<Harness onSubmit={blocked} submitDisabled />);
  await openSurface();
  await userEvent.click(screen.getByRole('textbox', { name: 'Name' }));
  await userEvent.keyboard('{Enter}');
  expect(blocked).not.toHaveBeenCalled();
});

test('async submit is busy, ignores close requests, then closes', async () => {
  let resolve: () => void = () => undefined;
  const onClose = vi.fn();
  const onSubmit = () =>
    new Promise<void>((done) => {
      resolve = done;
    });
  render(<Harness onSubmit={onSubmit} onClose={onClose} />);
  await openSurface();
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(screen.getByRole('button', { name: 'Busy' })).toBeTruthy();
  expect(screen.getByRole('form').getAttribute('aria-busy')).toBe('true');
  await userEvent.click(screen.getByRole('button', { name: 'Close' }));
  expect(onClose).not.toHaveBeenCalled();
  resolve();
  await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
});

test('rejected submit keeps the surface open and focuses the alert', async () => {
  const onClose = vi.fn();
  const { unmount } = render(
    <Harness
      onClose={onClose}
      onSubmit={() => Promise.reject(new Error('Name is taken'))}
    />
  );
  await openSurface();
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  const alert = await screen.findByRole('alert');
  expect(alert.textContent).toContain(messages.submitError);
  expect(alert.textContent).not.toContain('Name is taken');
  expect(onClose).not.toHaveBeenCalled();
  await waitFor(() =>
    expect(active()?.hasAttribute('data-afframe-flow-error')).toBe(true)
  );
  unmount();

  render(<Harness onSubmit={() => Promise.reject(new Error(''))} />);
  await openSurface();
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect((await screen.findByRole('alert')).textContent).toContain(
    messages.submitError
  );
});

test('rejected submit focuses the first invalid field', async () => {
  render(
    <Harness
      onSubmit={() => {
        screen
          .getByRole('textbox', { name: 'Name' })
          .setAttribute('aria-invalid', 'true');
        throw new Error('Invalid');
      }}
    />
  );
  await openSurface();
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  await waitFor(() =>
    expect(active()).toBe(screen.getByRole('textbox', { name: 'Name' }))
  );
});

test('requestClose on a clean surface closes; confirmDiscard false skips the dialog', async () => {
  const onClose = vi.fn();
  const { unmount } = render(<Harness onClose={onClose} />);
  await openSurface();
  await userEvent.click(screen.getByRole('button', { name: 'Close' }));
  expect(onClose).toHaveBeenCalledTimes(1);
  unmount();

  const skip = vi.fn();
  render(<Harness onClose={skip} isDirty confirmDiscard={false} />);
  await openSurface();
  await userEvent.click(screen.getByRole('button', { name: 'Close' }));
  expect(skip).toHaveBeenCalledTimes(1);
});

test('dirty: Escape opens the discard dialog over the surface; Escape again only closes it', async () => {
  const onClose = vi.fn();
  render(<Harness onClose={onClose} isDirty windowEscape />);
  await openSurface();
  const name = screen.getByRole('textbox', { name: 'Name' });
  await userEvent.click(name);
  await userEvent.keyboard('{Escape}');
  const dialog = await screen.findByRole('alertdialog');
  expect(dialog.textContent).toContain(messages.discardTitle);
  const keep = screen.getByRole('button', { name: messages.keepEditing });
  await waitFor(() => expect(active()).toBe(keep));

  await userEvent.keyboard('{Escape}');
  await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
  expect(onClose).not.toHaveBeenCalled();
  await waitFor(() => expect(active()).toBe(name));
});

test('Keep editing returns focus to the field; Discard calls onClose', async () => {
  const onClose = vi.fn();
  render(<Harness onClose={onClose} isDirty />);
  await openSurface();
  const name = screen.getByRole('textbox', { name: 'Name' });
  await userEvent.click(name);
  await userEvent.click(screen.getByRole('button', { name: 'Close' }));
  await userEvent.click(
    await screen.findByRole('button', { name: messages.keepEditing })
  );
  expect(onClose).not.toHaveBeenCalled();
  await waitFor(() =>
    expect(active()).toBe(screen.getByRole('button', { name: 'Close' }))
  );

  await userEvent.click(screen.getByRole('button', { name: 'Close' }));
  await userEvent.click(
    await screen.findByRole('button', { name: messages.discard })
  );
  expect(onClose).toHaveBeenCalledTimes(1);
});

test('focus falls back to launcherRef when the opening element is gone', async () => {
  render(<Harness removeLauncher />);
  await openSurface();
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  await waitFor(() =>
    expect(active()).toBe(screen.getByRole('button', { name: 'Fallback' }))
  );
});

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

test('a parent close resets the discard dialog; Close works after reopening', async () => {
  const closeRef: { current: () => void } = { current: () => undefined };
  render(<Harness isDirty closeRef={closeRef} />);
  await openSurface();
  await userEvent.click(screen.getByRole('button', { name: 'Close' }));
  await screen.findByRole('alertdialog');
  act(() => closeRef.current());
  await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
  await openSurface();
  await userEvent.click(screen.getByRole('button', { name: 'Close' }));
  expect(await screen.findByRole('alertdialog')).toBeTruthy();
});

test('a parent close cancels a discard dialog that was about to open', async () => {
  const closeRef: { current: () => void } = { current: () => undefined };
  render(<Harness isDirty closeRef={closeRef} />);
  await openSurface();
  act(() => {
    screen.getByRole('button', { name: 'Close' }).click();
    closeRef.current();
  });
  await pause(100);
  expect(screen.queryByRole('alertdialog')).toBeNull();
});

test('a parent close during a pending submit: no late onClose, and the next open works', async () => {
  let resolve: () => void = () => undefined;
  const onClose = vi.fn();
  const closeRef: { current: () => void } = { current: () => undefined };
  render(
    <Harness
      closeRef={closeRef}
      onClose={onClose}
      onSubmit={() =>
        new Promise<void>((done) => {
          resolve = done;
        })
      }
    />
  );
  await openSurface();
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  act(() => closeRef.current());
  await act(async () => resolve());
  expect(onClose).not.toHaveBeenCalled();
  await openSurface();
  expect(screen.getByRole('form').getAttribute('aria-busy')).toBeNull();
  await userEvent.click(screen.getByRole('button', { name: 'Close' }));
  expect(onClose).toHaveBeenCalledTimes(1);
});

test('focus return stops once the user clicks elsewhere', async () => {
  render(<Harness />);
  const launcher = await openSurface();
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  await waitFor(() => expect(active()).toBe(launcher));
  await userEvent.click(screen.getByTestId('blank'));
  await pause(300);
  expect(active()).toBe(document.body);
});

test('any thenable counts as an async submit', async () => {
  const thenable = { then: () => undefined };
  render(<Harness onSubmit={() => thenable as unknown as Promise<void>} />);
  await openSurface();
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(screen.getByRole('button', { name: 'Busy' })).toBeTruthy();
});

test('Tab wrap counts a radio group by its active stop and skips inert content', async () => {
  render(
    <div onKeyDown={wrapTabInDialog}>
      <dialog open>
        <button type="button">First</button>
        <input type="radio" name="r" aria-label="A" />
        <input type="radio" name="r" aria-label="B" defaultChecked />
        <input type="radio" name="r" aria-label="C" />
        <div inert>
          <button type="button">Hidden</button>
        </div>
      </dialog>
    </div>
  );
  const b = screen.getByRole('radio', { name: 'B' });
  b.focus();
  await userEvent.tab();
  expect(active()).toBe(screen.getByRole('button', { name: 'First' }));
  await userEvent.tab({ shift: true });
  expect(active()).toBe(b);
});

test('errorText shows the details of a rejection', async () => {
  render(
    <Harness
      surfaceMessages={{
        ...messages,
        errorText: (error) =>
          error instanceof Error ? `Details: ${error.message}` : 'none',
      }}
      onSubmit={() => Promise.reject(new Error('Name is taken'))}
    />
  );
  await openSurface();
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect((await screen.findByRole('alert')).textContent).toContain(
    'Details: Name is taken'
  );
});
