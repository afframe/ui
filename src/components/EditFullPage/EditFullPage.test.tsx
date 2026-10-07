import { render, screen, waitFor } from '@testing-library/react';
import { useRef, useState } from 'react';
import { afterEach, expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { AfframeProvider } from '../../index.js';
import {
  englishLeft,
  sentinelMessages,
} from '../CreateEditFlow/flowTestUtils.js';
import { defaultEditFullPageMessages, EditFullPage } from './EditFullPage.js';
import type { EditFullPageProps } from './EditFullPage.js';

afterEach(() => {
  vi.restoreAllMocks();
});

const defaults = defaultEditFullPageMessages;

type HarnessProps = Partial<
  Pick<
    EditFullPageProps,
    | 'onSubmit'
    | 'submitDisabled'
    | 'isDirty'
    | 'messages'
    | 'onClose'
    | 'headingLevel'
    | 'warnOnLeave'
  >
> & { extra?: boolean };

function Harness({ onClose, ...props }: HarnessProps) {
  const [editing, setEditing] = useState(true);
  const launcherRef = useRef<HTMLButtonElement>(null);
  return (
    <AfframeProvider>
      <button type="button" ref={launcherRef} onClick={() => setEditing(true)}>
        Edit
      </button>
      {editing && (
        <EditFullPage
          title="Record A"
          launcherRef={launcherRef}
          onSubmit={props.onSubmit ?? (() => undefined)}
          onClose={() => {
            onClose?.();
            setEditing(false);
          }}
          {...(props.headingLevel ? { headingLevel: props.headingLevel } : {})}
          {...(props.warnOnLeave === false ? { warnOnLeave: false } : {})}
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
          {props.extra && (
            <>
              <input
                aria-label="Guarded"
                onKeyDown={(event) => {
                  if (event.key === 'Escape') event.preventDefault();
                }}
              />
              <div aria-expanded="true">
                <input aria-label="Combo" />
              </div>
            </>
          )}
        </EditFullPage>
      )}
    </AfframeProvider>
  );
}

const active = () => document.activeElement;
const fieldA = () => screen.getByRole('textbox', { name: 'Field A' });
const launcher = () => screen.getByRole('button', { name: 'Edit' });

async function mounted() {
  await waitFor(() => expect(active()).toBe(fieldA()));
}

test('a form named by its heading (level 2, or 3), not a main landmark', async () => {
  const { unmount } = render(<Harness />);
  await mounted();
  const form = screen.getByRole('form', { name: 'Record A' });
  expect(form.querySelector('h2')?.textContent).toBe('Record A');
  expect(screen.queryByRole('main')).toBeNull();
  unmount();
  render(<Harness headingLevel={3} />);
  expect(
    screen.getByRole('heading', { level: 3, name: 'Record A' })
  ).toBeTruthy();
});

test('Escape and Cancel on a clean form leave edit mode and focus the launcher', async () => {
  const onClose = vi.fn();
  render(<Harness onClose={onClose} />);
  await mounted();
  await userEvent.keyboard('{Escape}');
  expect(onClose).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole('form')).toBeNull();
  await waitFor(() => expect(active()).toBe(launcher()));
  await userEvent.click(launcher());
  await mounted();
  await userEvent.click(screen.getByRole('button', { name: defaults.cancel }));
  expect(onClose).toHaveBeenCalledTimes(2);
});

test('dirty: Escape asks first; Escape again keeps editing; Discard leaves', async () => {
  const onClose = vi.fn();
  render(<Harness isDirty onClose={onClose} />);
  await mounted();
  await userEvent.keyboard('{Escape}');
  const keep = await screen.findByRole('button', {
    name: defaults.keepEditing,
  });
  await waitFor(() => expect(active()).toBe(keep));
  await userEvent.keyboard('{Escape}');
  await waitFor(() => expect(active()).toBe(fieldA()));
  expect(onClose).not.toHaveBeenCalled();

  await userEvent.click(screen.getByRole('button', { name: defaults.cancel }));
  await userEvent.click(
    await screen.findByRole('button', { name: defaults.discard })
  );
  expect(onClose).toHaveBeenCalledTimes(1);
});

test('submitDisabled blocks Enter and Save', async () => {
  const onSubmit = vi.fn();
  render(<Harness submitDisabled onSubmit={onSubmit} />);
  await mounted();
  await userEvent.keyboard('{Enter}');
  expect(
    screen.getByRole('button', { name: defaults.save }).hasAttribute('disabled')
  ).toBe(true);
  expect(onSubmit).not.toHaveBeenCalled();
});

test('Enter submits once; async submit is busy, then leaves', async () => {
  let resolve: () => void = () => undefined;
  const onSubmit = vi.fn(
    () =>
      new Promise<void>((done) => {
        resolve = done;
      })
  );
  const onClose = vi.fn();
  render(<Harness onSubmit={onSubmit} onClose={onClose} />);
  await mounted();
  await userEvent.keyboard('{Enter}');
  await userEvent.keyboard('{Enter}');
  expect(onSubmit).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('form').getAttribute('aria-busy')).toBe('true');
  expect(screen.getAllByText(defaults.submitting).length).toBeGreaterThan(0);
  await userEvent.keyboard('{Escape}');
  expect(onClose).not.toHaveBeenCalled();
  resolve();
  await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
});

test('a rejected submit stays with an alert and no onClose', async () => {
  const onClose = vi.fn();
  render(
    <Harness
      onClose={onClose}
      onSubmit={() => Promise.reject(new Error('Conflict'))}
    />
  );
  await mounted();
  await userEvent.click(screen.getByRole('button', { name: defaults.save }));
  expect((await screen.findByRole('alert')).textContent).toContain(
    defaults.submitError
  );
  expect(onClose).not.toHaveBeenCalled();
});

function beforeunloadCalls(spy: { mock: { calls: unknown[][] } }) {
  return spy.mock.calls.filter(([type]) => type === 'beforeunload').length;
}

test('beforeunload is registered only while dirty', async () => {
  const add = vi.spyOn(window, 'addEventListener');
  const remove = vi.spyOn(window, 'removeEventListener');
  const { rerender, unmount } = render(<Harness />);
  expect(beforeunloadCalls(add)).toBe(0);
  rerender(<Harness isDirty />);
  expect(beforeunloadCalls(add)).toBe(1);
  rerender(<Harness />);
  expect(beforeunloadCalls(remove)).toBe(1);
  rerender(<Harness isDirty />);
  expect(beforeunloadCalls(add)).toBe(2);
  unmount();
  expect(beforeunloadCalls(remove)).toBe(2);

  render(<Harness isDirty warnOnLeave={false} />);
  expect(beforeunloadCalls(add)).toBe(2);
});

test('messages replace every visible string and accessible name', async () => {
  const s = sentinelMessages(defaults);
  render(
    <Harness
      isDirty
      messages={s}
      onSubmit={() => Promise.reject(new Error(''))}
    />
  );
  await mounted();
  await userEvent.click(screen.getByRole('button', { name: s.save }));
  await screen.findByRole('alert');
  // "Edit" is the harness launcher, not a message.
  expect(englishLeft(defaults)).toEqual([]);
  await userEvent.click(screen.getByRole('button', { name: s.cancel }));
  await screen.findByRole('button', { name: s.keepEditing });
  expect(englishLeft(defaults)).toEqual([]);
});

test('messages replace the busy state strings too', async () => {
  const s = sentinelMessages(defaults);
  render(
    <Harness messages={s} onSubmit={() => new Promise<void>(() => undefined)} />
  );
  await mounted();
  await userEvent.click(screen.getByRole('button', { name: s.save }));
  await waitFor(() =>
    expect(document.body.textContent).toContain(s.submitting)
  );
  expect(englishLeft(defaults)).toEqual([]);
});

test('Escape works from Save; not when handled or inside an expanded control', async () => {
  const onClose = vi.fn();
  render(<Harness extra onClose={onClose} />);
  await mounted();
  screen.getByRole('textbox', { name: 'Guarded' }).focus();
  await userEvent.keyboard('{Escape}');
  screen.getByRole('textbox', { name: 'Combo' }).focus();
  await userEvent.keyboard('{Escape}');
  expect(onClose).not.toHaveBeenCalled();
  screen.getByRole('button', { name: defaults.save }).focus();
  await userEvent.keyboard('{Escape}');
  expect(onClose).toHaveBeenCalledTimes(1);
});
