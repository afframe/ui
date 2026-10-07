import { render, screen, waitFor } from '@testing-library/react';
import { useRef, useState } from 'react';
import { expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { AfframeProvider } from '../../index.js';
import {
  englishLeft,
  sentinelMessages,
  tabbables,
} from '../CreateEditFlow/flowTestUtils.js';
import {
  EditSidePanel,
  defaultEditSidePanelMessages,
} from './EditSidePanel.js';
import type { EditSidePanelProps } from './EditSidePanel.js';

const defaults = defaultEditSidePanelMessages;
const primary = defaults.save;

type HarnessProps = Partial<
  Pick<
    EditSidePanelProps,
    'onSubmit' | 'submitDisabled' | 'isDirty' | 'messages' | 'onClose'
  >
>;

function Harness({ onClose, ...props }: HarnessProps) {
  const [open, setOpen] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);
  return (
    <AfframeProvider>
      <button type="button" ref={launcherRef} onClick={() => setOpen(true)}>
        Launch
      </button>
      <EditSidePanel
        open={open}
        title="Panel A"
        formTitle="Form A"
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
      </EditSidePanel>
    </AfframeProvider>
  );
}

const active = () => document.activeElement;
const fieldA = () => screen.getByRole('textbox', { name: 'Field A' });
const fieldB = () => screen.getByRole('textbox', { name: 'Field B' });
const launcher = () => screen.getByRole('button', { name: 'Launch' });

async function launch() {
  await userEvent.click(launcher());
  await waitFor(() => expect(active()).toBe(fieldA()));
}

test('opens on the first field and Escape closes back to the launcher', async () => {
  const onClose = vi.fn();
  render(<Harness onClose={onClose} />);
  expect(screen.queryByRole('form')).toBeNull();
  await launch();
  expect(screen.getByRole('form', { name: 'Form A' })).toBeTruthy();
  await userEvent.keyboard('{Escape}');
  expect(onClose).toHaveBeenCalledTimes(1);
  await waitFor(() => expect(active()).toBe(launcher()));
});

test('Tab stays inside the panel and Shift+Tab wraps', async () => {
  render(<Harness />);
  await launch();
  await userEvent.tab();
  expect(active()).toBe(fieldB());
  const order = tabbables(fieldA().closest('.afframe-flow-side-panel'));
  const first = order[0];
  const last = order[order.length - 1];
  last?.focus();
  await userEvent.tab();
  expect(active()).toBe(first);
  await userEvent.tab({ shift: true });
  expect(active()).toBe(last);
});

test('dirty: Escape asks first; Escape again keeps editing; Discard closes', async () => {
  const onClose = vi.fn();
  render(<Harness isDirty onClose={onClose} />);
  await launch();
  await userEvent.keyboard('{Escape}');
  const keep = await screen.findByRole('button', {
    name: defaults.keepEditing,
  });
  await waitFor(() => expect(active()).toBe(keep));
  await userEvent.keyboard('{Escape}');
  await waitFor(() => expect(active()).toBe(fieldA()));
  expect(onClose).not.toHaveBeenCalled();
  expect(screen.queryByRole('alertdialog')).toBeNull();

  await userEvent.click(screen.getByRole('button', { name: defaults.cancel }));
  await userEvent.click(
    await screen.findByRole('button', { name: defaults.discard })
  );
  expect(onClose).toHaveBeenCalledTimes(1);
  await waitFor(() => expect(active()).toBe(launcher()));
});

test('submitDisabled blocks Enter and the primary button', async () => {
  const onSubmit = vi.fn();
  render(<Harness submitDisabled onSubmit={onSubmit} />);
  await launch();
  await userEvent.keyboard('{Enter}');
  const button = screen.getByRole('button', { name: primary });
  expect(button.hasAttribute('disabled')).toBe(true);
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
  expect(screen.getAllByText(defaults.submitting).length).toBeGreaterThan(0);
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
  await userEvent.click(screen.getByRole('button', { name: primary }));
  expect((await screen.findByRole('alert')).textContent).toContain(
    defaults.submitError
  );
  expect(onClose).not.toHaveBeenCalled();
  expect(screen.getByRole('form')).toBeTruthy();
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
  await launch();
  await userEvent.click(screen.getByRole('button', { name: s.save }));
  await screen.findByRole('alert');
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
  await launch();
  await userEvent.click(screen.getByRole('button', { name: s.save }));
  await waitFor(() =>
    expect(document.body.textContent).toContain(s.submitting)
  );
  expect(englishLeft(defaults)).toEqual([]);
});
