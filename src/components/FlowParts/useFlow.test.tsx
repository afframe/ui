import { act, render, screen, waitFor } from '@testing-library/react';
import { useEffect, useRef, useState } from 'react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { AfframeProvider } from '../../index.js';
import { DiscardDialog, FlowError, FlowForm } from './FlowParts.js';
import { leavePendingButton } from './flowTestUtils.js';
import {
  defaultFormFlowMessages,
  defaultLeavePendingMessages as leave,
} from './messages.js';
import type { DiscardMessages, FlowMessages } from './messages.js';
import { useFlow } from './useFlow.js';

const messages = defaultFormFlowMessages;

function Surface({
  open,
  onClose,
  onSubmit,
  isDirty = false,
  confirmDiscard,
  closeWhilePending,
  launcherRef,
  submitDisabled,
  windowEscape = false,
  disableWhilePending = false,
  surfaceMessages = messages,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void | Promise<void>;
  isDirty?: boolean;
  confirmDiscard?: boolean;
  closeWhilePending?: boolean;
  launcherRef?: React.RefObject<HTMLElement | null>;
  submitDisabled?: boolean;
  windowEscape?: boolean;
  disableWhilePending?: boolean;
  surfaceMessages?: FlowMessages & DiscardMessages;
}) {
  const flow = useFlow<HTMLFormElement>({
    open,
    onClose,
    isDirty,
    ...(confirmDiscard === undefined ? {} : { confirmDiscard }),
    ...(closeWhilePending ? { closeWhilePending } : {}),
    launcherRef,
    messages: {
      error: surfaceMessages.error,
      errorText: surfaceMessages.errorText,
    },
  });
  const submit = async () => {
    if (await flow.run(onSubmit)) flow.close();
  };
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
        onSubmit={() => void submit()}
        aria-label="Surface"
        {...(submitDisabled ? { submitDisabled } : {})}>
        <label>
          Name
          <input name="name" />
        </label>
        <textarea aria-label="Notes" />
        <FlowError
          error={flow.error}
          iconDescription={messages.errorIconDescription}
        />
        <button type="button" onClick={requestClose}>
          Close
        </button>
        <button
          type="button"
          disabled={disableWhilePending && flow.pending}
          onClick={() => void submit()}>
          {flow.pending ? 'Busy' : 'Save'}
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
  closeWhilePending?: boolean;
  submitDisabled?: boolean;
  windowEscape?: boolean;
  disableWhilePending?: boolean;
  removeLauncher?: boolean;
  noLauncherRef?: boolean;
  closeRef?: { current: () => void };
  surfaceMessages?: FlowMessages & DiscardMessages;
  /** onClose leaves the surface mounted, as EditFullPage. */
  keepOpen?: boolean;
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
        {...(props.noLauncherRef ? {} : { launcherRef })}
        onSubmit={props.onSubmit ?? (() => undefined)}
        onClose={() => {
          props.onClose?.();
          if (props.removeLauncher) setLauncherShown(false);
          if (!props.keepOpen) setOpen(false);
        }}
        {...(props.isDirty === undefined ? {} : { isDirty: props.isDirty })}
        {...(props.confirmDiscard === undefined
          ? {}
          : { confirmDiscard: props.confirmDiscard })}
        {...(props.closeWhilePending ? { closeWhilePending: true } : {})}
        {...(props.submitDisabled ? { submitDisabled: true } : {})}
        {...(props.windowEscape ? { windowEscape: true } : {})}
        {...(props.disableWhilePending ? { disableWhilePending: true } : {})}
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

test('sync submit closes and returns focus to launcherRef', async () => {
  const onClose = vi.fn();
  render(<Harness onClose={onClose} />);
  await openSurface();
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(onClose).toHaveBeenCalledTimes(1);
  await waitFor(() =>
    expect(active()).toBe(screen.getByRole('button', { name: 'Fallback' }))
  );
});

test('without launcherRef, focus returns to the element that opened it', async () => {
  render(<Harness noLauncherRef />);
  const launcher = await openSurface();
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
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

test('without closeWhilePending, close requests wait for a pending submit', async () => {
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

test('focus stays in the form while the clicked button is disabled by pending', async () => {
  render(
    <Harness
      onSubmit={() => new Promise<void>(() => undefined)}
      disableWhilePending
    />
  );
  await openSurface();
  screen.getByRole('button', { name: 'Save' }).focus();
  await userEvent.keyboard('{Enter}');
  const busy = screen.getByRole('button', { name: 'Busy' });
  expect(busy.hasAttribute('disabled')).toBe(true);
  const form = screen.getByRole('form');
  await waitFor(() => expect(active()).toBe(form));
  // Not a tab stop, and no focus ring on the form itself.
  expect(form.tabIndex).toBe(-1);
  expect(getComputedStyle(form).outlineStyle).toBe('none');
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
  expect(alert.textContent).toContain(messages.error);
  expect(alert.textContent).not.toContain('Name is taken');
  expect(onClose).not.toHaveBeenCalled();
  await waitFor(() => expect(active()).toBe(alert));
  expect(alert.hasAttribute('data-afframe-flow-error')).toBe(true);
  unmount();

  render(<Harness onSubmit={() => Promise.reject(new Error(''))} />);
  await openSurface();
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect((await screen.findByRole('alert')).textContent).toContain(
    messages.error
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

test('focus goes to launcherRef when the opening element is gone', async () => {
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
  render(<Harness noLauncherRef />);
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

/** An action the test settles by hand. */
function deferred() {
  let resolve: () => void = () => undefined;
  let reject: (reason: unknown) => void = () => undefined;
  const promise = new Promise<void>((done, fail) => {
    resolve = done;
    reject = fail;
  });
  return {
    promise,
    resolve: () => resolve(),
    reject: (r: unknown) => reject(r),
  };
}

async function closeWhileBusy(onClose: () => void) {
  const action = deferred();
  render(
    <Harness
      closeWhilePending
      onClose={onClose}
      onSubmit={() => action.promise}
    />
  );
  await openSurface();
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  await userEvent.click(screen.getByRole('button', { name: 'Close' }));
  await screen.findByRole('alertdialog');
  return action;
}

test('closeWhilePending: a clean surface asks to stop waiting; Keep waiting keeps the action', async () => {
  const onClose = vi.fn();
  const action = await closeWhileBusy(onClose);
  const dialog = screen.getByRole('alertdialog');
  expect(dialog.textContent).toContain(leave.leavePendingTitle);
  expect(dialog.textContent).toContain(leave.leavePendingBody);
  expect(dialog.textContent).not.toContain(messages.discardTitle);
  await userEvent.click(
    screen.getByRole('button', { name: leave.keepWaiting })
  );
  await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
  expect(screen.getByRole('form').getAttribute('aria-busy')).toBe('true');
  expect(onClose).not.toHaveBeenCalled();
  await act(async () => action.resolve());
  await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
});

test('closeWhilePending: a success closes the dialog and then the surface', async () => {
  const onClose = vi.fn();
  const action = await closeWhileBusy(onClose);
  await act(async () => action.resolve());
  await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
});

test('closeWhilePending: a failure closes the dialog and focuses the alert', async () => {
  const onClose = vi.fn();
  const action = await closeWhileBusy(onClose);
  await act(async () => action.reject(new Error('Nope')));
  await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
  const alert = screen.getByRole('alert');
  await waitFor(() => expect(active()).toBe(alert));
  // Not taken back by the closing dialog.
  await pause(300);
  expect(active()).toBe(alert);
  expect(onClose).not.toHaveBeenCalled();
});

test('closeWhilePending: a dirty surface keeps the discard text', async () => {
  const action = deferred();
  render(<Harness closeWhilePending isDirty onSubmit={() => action.promise} />);
  await openSurface();
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  await userEvent.click(screen.getByRole('button', { name: 'Close' }));
  const dialog = await screen.findByRole('alertdialog');
  expect(dialog.textContent).toContain(messages.discardTitle);
  expect(dialog.textContent).toContain(messages.discardBody);
  expect(dialog.textContent).not.toContain(leave.leavePendingTitle);
  expect(
    screen.getByRole('button', { name: messages.keepEditing })
  ).toBeTruthy();
  expect(screen.getByRole('button', { name: messages.discard })).toBeTruthy();
});

test('closeWhilePending: Close closes at once and ignores the result', async () => {
  const onClose = vi.fn();
  const action = await closeWhileBusy(onClose);
  await userEvent.click(await leavePendingButton());
  expect(onClose).toHaveBeenCalledTimes(1);
  await act(async () => action.resolve());
  await pause(50);
  expect(onClose).toHaveBeenCalledTimes(1);
});

test('closeWhilePending with confirmDiscard false closes at once', async () => {
  const onClose = vi.fn();
  const action = deferred();
  render(
    <Harness
      closeWhilePending
      confirmDiscard={false}
      onClose={onClose}
      onSubmit={() => action.promise}
    />
  );
  await openSurface();
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  await userEvent.click(screen.getByRole('button', { name: 'Close' }));
  expect(onClose).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole('alertdialog')).toBeNull();
  await act(async () => action.reject(new Error('late')));
  await pause(50);
  expect(onClose).toHaveBeenCalledTimes(1);
});

test('closeWhilePending: after Discard on a surface that stays open, Save waits for the abandoned action', async () => {
  const onClose = vi.fn();
  const action = deferred();
  const onSubmit = vi.fn(() => action.promise);
  render(
    <Harness keepOpen closeWhilePending onClose={onClose} onSubmit={onSubmit} />
  );
  await openSurface();
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  await userEvent.click(screen.getByRole('button', { name: 'Close' }));
  await userEvent.click(await leavePendingButton());
  expect(onClose).toHaveBeenCalledTimes(1);
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(onSubmit).toHaveBeenCalledTimes(1);
  await act(async () => action.resolve());
  expect(onClose).toHaveBeenCalledTimes(1);
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  expect(onSubmit).toHaveBeenCalledTimes(2);
});

test('rejected submit skips an invalid field that is not rendered', async () => {
  render(
    <Harness
      onSubmit={() => {
        const name = screen.getByRole('textbox', { name: 'Name' });
        name.setAttribute('aria-invalid', 'true');
        name.style.display = 'none';
        screen
          .getByRole('textbox', { name: 'Notes' })
          .setAttribute('aria-invalid', 'true');
        throw new Error('Invalid');
      }}
    />
  );
  await openSurface();
  await userEvent.click(screen.getByRole('button', { name: 'Save' }));
  await waitFor(() =>
    expect(active()).toBe(screen.getByRole('textbox', { name: 'Notes' }))
  );
});
