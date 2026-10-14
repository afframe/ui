import { render, screen, waitFor } from '@testing-library/react';
import { createRef, useRef, useState } from 'react';
import { afterEach, expect, test, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { AfframeProvider, TextInput } from '../../index.js';
import {
  englishLeft,
  expectBusyPrimary,
  expectFocusedErrorAlert,
  sentinelMessages,
} from '../FlowParts/flowTestUtils.js';
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
  expectBusyPrimary(defaults.save, defaults.pending);
  // Escape while busy asks first; the success closes that dialog too.
  await userEvent.keyboard('{Escape}');
  await screen.findByRole('alertdialog');
  expect(onClose).not.toHaveBeenCalled();
  resolve();
  await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
});

test('while busy, Cancel stays enabled; Discard leaves and drops the result', async () => {
  let resolve: () => void = () => undefined;
  const onClose = vi.fn();
  render(
    <Harness
      onClose={onClose}
      onSubmit={() =>
        new Promise<void>((done) => {
          resolve = done;
        })
      }
    />
  );
  await mounted();
  await userEvent.click(screen.getByRole('button', { name: defaults.save }));
  const cancel = screen.getByRole('button', { name: defaults.cancel });
  expect(cancel.hasAttribute('disabled')).toBe(false);
  await userEvent.click(cancel);
  await userEvent.click(await screen.findByRole('button', { name: 'Discard' }));
  expect(onClose).toHaveBeenCalledTimes(1);
  resolve();
  await new Promise((done) => setTimeout(done, 50));
  expect(onClose).toHaveBeenCalledTimes(1);
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
    defaults.error
  );
  expect(onClose).not.toHaveBeenCalled();
  await expectFocusedErrorAlert();
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
  await waitFor(() => expect(document.body.textContent).toContain(s.pending));
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

test('ref and rest props reach the form', () => {
  const ref = createRef<HTMLFormElement>();
  render(
    <AfframeProvider>
      <EditFullPage
        ref={ref}
        data-testid="root"
        title="Customer"
        label="Customers"
        onClose={() => undefined}
        onSubmit={() => undefined}>
        <input aria-label="Name" />
      </EditFullPage>
    </AfframeProvider>
  );
  const form = screen.getByRole('form', { name: 'Customer' });
  expect(screen.getByTestId('root')).toBe(form);
  expect(ref.current).toBe(form);
  expect(screen.getByText('Customers')).toBeTruthy();
});

test('a description node renders as given, not inside a paragraph', async () => {
  const list = (
    <ul>
      <li>One rule</li>
    </ul>
  );
  render(
    <AfframeProvider>
      <EditFullPage
        title="Customer"
        description={list}
        onClose={() => undefined}
        onSubmit={() => undefined}>
        <input aria-label="Name" />
      </EditFullPage>
    </AfframeProvider>
  );
  const item = await screen.findByText('One rule');
  expect(item.closest('p')).toBeNull();
});

// Below Carbon's md breakpoint the two buttons share the width.
test.each([320, 375])('at %ipx both buttons stay on screen', async (width) => {
  await page.viewport(width, 640);
  try {
    render(<Harness />);
    const cancel = screen
      .getByRole('button', { name: defaults.cancel })
      .getBoundingClientRect();
    const save = screen
      .getByRole('button', { name: defaults.save })
      .getBoundingClientRect();
    expect(cancel.left).toBeGreaterThanOrEqual(0);
    expect(save.right).toBeLessThanOrEqual(width);
    expect(Math.round(cancel.width)).toBe(Math.round(save.width));
  } finally {
    await page.viewport(1024, 768);
  }
});

test('a rejection under the discard dialog closes it and focuses the alert', async () => {
  let reject: (reason: unknown) => void = () => undefined;
  render(
    <Harness
      onSubmit={() =>
        new Promise<void>((_, fail) => {
          reject = fail;
        })
      }
    />
  );
  await mounted();
  await userEvent.click(screen.getByRole('button', { name: defaults.save }));
  await userEvent.keyboard('{Escape}');
  await screen.findByRole('alertdialog');
  reject(new Error('Duplicate'));
  await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
  const alert = screen.getByRole('alert');
  await waitFor(() => expect(document.activeElement).toBe(alert));
  await new Promise((done) => setTimeout(done, 300));
  expect(document.activeElement).toBe(alert);
});

test('the busy primary button fits a narrow screen', async () => {
  await page.viewport(375, 768);
  try {
    render(<Harness onSubmit={() => new Promise<void>(() => undefined)} />);
    await mounted();
    await userEvent.click(screen.getByRole('button', { name: defaults.save }));
    expectBusyPrimary(defaults.save, defaults.pending);
  } finally {
    await page.viewport(1024, 768);
  }
});

/** The page in a region of viewport height, as the docs ask of the app. */
function renderInRegion(fields: number) {
  render(
    <AfframeProvider>
      <div style={{ blockSize: '100dvh' }}>
        <EditFullPage
          title="Record A"
          onSubmit={() => undefined}
          onClose={() => undefined}>
          {Array.from({ length: fields }, (_, index) => (
            <TextInput
              key={index}
              id={`field-${index + 1}`}
              labelText={`Field ${index + 1}`}
            />
          ))}
        </EditFullPage>
      </div>
    </AfframeProvider>
  );
  const bar = document.querySelector('.afframe-edit-full-page-actions');
  if (!bar) throw new Error('No action bar');
  return () => bar.getBoundingClientRect().bottom;
}

test('a short form keeps the action bar at the bottom of the region', () => {
  const barBottom = renderInRegion(2);
  expect(barBottom()).toBeCloseTo(window.innerHeight, 0);
  // Carbon's form items grow (flex: 1 1 auto); the free space must not spread them.
  const box = (n: number) => {
    const field = document.getElementById(`field-${n}`);
    if (!field) throw new Error(`No field ${n}`);
    return field.getBoundingClientRect();
  };
  expect(box(2).top - box(1).bottom).toBeLessThan(64);
});

test('a long form scrolls under a sticky action bar', async () => {
  const barBottom = renderInRegion(30);
  try {
    const end = document.documentElement.scrollHeight - window.innerHeight;
    expect(end).toBeGreaterThan(0);
    expect(barBottom()).toBeCloseTo(window.innerHeight, 0);
    for (const top of [end / 2, end]) {
      window.scrollTo(0, top);
      await new Promise((resolve) => requestAnimationFrame(resolve));
      expect(barBottom()).toBeCloseTo(window.innerHeight, 0);
    }
  } finally {
    window.scrollTo(0, 0);
  }
});
