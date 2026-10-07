import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { useRef, useState } from 'react';
import { afterEach, expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import { AfframeProvider } from '../../index.js';
import {
  englishLeft,
  sentinelMessages,
  tabbables,
  settleAndCleanup,
} from '../CreateEditFlow/flowTestUtils.js';
import {
  defaultEditTearsheetMessages,
  EditTearsheet,
  EditTearsheetForm,
} from './EditTearsheet.js';
import type {
  EditTearsheetMessages,
  EditTearsheetProps,
} from './EditTearsheet.js';

afterEach(settleAndCleanup);

const defaults = defaultEditTearsheetMessages;

type HarnessProps = Partial<
  Pick<
    EditTearsheetProps,
    | 'onSubmit'
    | 'submitDisabled'
    | 'isDirty'
    | 'messages'
    | 'onClose'
    | 'onFormChange'
  >
> & { invalidB?: boolean };

function Harness({ onClose, invalidB = false, ...props }: HarnessProps) {
  const [open, setOpen] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);
  return (
    <AfframeProvider>
      <button type="button" ref={launcherRef} onClick={() => setOpen(true)}>
        Launch
      </button>
      <EditTearsheet
        open={open}
        title="Sheet A"
        launcherRef={launcherRef}
        onSubmit={props.onSubmit ?? (() => undefined)}
        onClose={() => {
          onClose?.();
          setOpen(false);
        }}
        {...(props.onFormChange ? { onFormChange: props.onFormChange } : {})}
        {...(props.submitDisabled ? { submitDisabled: true } : {})}
        {...(props.isDirty ? { isDirty: true } : {})}
        {...(props.messages ? { messages: props.messages } : {})}>
        <EditTearsheetForm id="form-a" title="Part A">
          <label>
            Field A
            <input />
          </label>
          <label>
            Field B
            <input />
          </label>
        </EditTearsheetForm>
        <EditTearsheetForm id="form-b" title="Part B" invalid={invalidB}>
          <label>
            Field C
            <input />
          </label>
        </EditTearsheetForm>
      </EditTearsheet>
    </AfframeProvider>
  );
}

const active = () => document.activeElement;
const fieldA = () => screen.getByRole('textbox', { name: 'Field A' });
const launcher = () => screen.getByRole('button', { name: 'Launch' });
const nav = () =>
  screen.getByRole('navigation', { name: defaults.sectionsNavLabel });

async function launch() {
  await userEvent.click(launcher());
  await waitFor(() => expect(active()).toBe(fieldA()));
}

test('opens on the first field and Escape closes back to the launcher', async () => {
  const onClose = vi.fn();
  render(<Harness onClose={onClose} />);
  await launch();
  await userEvent.keyboard('{Escape}');
  expect(onClose).toHaveBeenCalledTimes(1);
  await waitFor(() => expect(active()).toBe(launcher()));
});

test('the nav lists the forms; choosing one focuses its heading', async () => {
  const onFormChange = vi.fn();
  render(<Harness onFormChange={onFormChange} />);
  await launch();
  const items = within(nav()).getAllByRole('button');
  expect(items.map((item) => item.textContent)).toEqual(['Part A', 'Part B']);
  expect(items[0]?.getAttribute('aria-current')).toBe('true');
  items[1]?.focus();
  await userEvent.keyboard('{Enter}');
  expect(active()).toBe(screen.getByRole('heading', { name: 'Part B' }));
  expect(items[1]?.getAttribute('aria-current')).toBe('true');
  expect(onFormChange).toHaveBeenCalledWith(1);
});

test('an invalid form has a named marker; Save focuses it and does not submit', async () => {
  const onSubmit = vi.fn();
  render(<Harness invalidB onSubmit={onSubmit} />);
  await launch();
  expect(
    within(nav()).getByRole('img', { name: defaults.sectionInvalid('Part B') })
  ).toBeTruthy();
  const save = screen.getByRole('button', { name: defaults.save });
  expect(save.hasAttribute('disabled')).toBe(false);
  await userEvent.click(save);
  expect(onSubmit).not.toHaveBeenCalled();
  expect(active()).toBe(screen.getByRole('heading', { name: 'Part B' }));
});

test('Tab stays inside the tearsheet and Shift+Tab wraps', async () => {
  render(<Harness />);
  await launch();
  const order = tabbables(fieldA().closest('dialog'));
  const first = order[0];
  const last = order[order.length - 1];
  expect(last).toBe(screen.getByRole('button', { name: defaults.save }));
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

  await userEvent.click(screen.getByRole('button', { name: defaults.cancel }));
  await userEvent.click(
    await screen.findByRole('button', { name: defaults.discard })
  );
  expect(onClose).toHaveBeenCalledTimes(1);
  await waitFor(() => expect(active()).toBe(launcher()));
});

test('submitDisabled blocks Enter and Save', async () => {
  const onSubmit = vi.fn();
  render(<Harness submitDisabled onSubmit={onSubmit} />);
  await launch();
  await userEvent.keyboard('{Enter}');
  const save = screen.getByRole('button', { name: defaults.save });
  expect(save.hasAttribute('disabled')).toBe(true);
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
      onSubmit={() => Promise.reject(new Error('Conflict'))}
    />
  );
  await launch();
  await userEvent.click(screen.getByRole('button', { name: defaults.save }));
  expect((await screen.findByRole('alert')).textContent).toContain(
    defaults.submitError
  );
  expect(onClose).not.toHaveBeenCalled();
});

test('messages replace every visible string and accessible name', async () => {
  const s: EditTearsheetMessages = {
    ...sentinelMessages(defaults),
    sectionInvalid: (title) => `zzInvalid ${title}`,
  };
  const english = {
    ...defaults,
    sectionInvalid: defaults.sectionInvalid('Part B'),
  };
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
  expect(englishLeft(english)).toEqual([]);
  await userEvent.click(screen.getByRole('button', { name: s.cancel }));
  await screen.findByRole('button', { name: s.keepEditing });
  expect(englishLeft(english)).toEqual([]);
  cleanup();
  render(<Harness invalidB messages={s} />);
  await launch();
  expect(screen.getByRole('img', { name: 'zzInvalid Part B' })).toBeTruthy();
  expect(englishLeft(english)).toEqual([]);
});

test('messages replace the busy state strings too', async () => {
  const s: EditTearsheetMessages = {
    ...sentinelMessages(defaults),
    sectionInvalid: (title) => `zzInvalid ${title}`,
  };
  render(
    <Harness messages={s} onSubmit={() => new Promise<void>(() => undefined)} />
  );
  await launch();
  await userEvent.click(screen.getByRole('button', { name: s.save }));
  await waitFor(() =>
    expect(document.body.textContent).toContain(s.submitting)
  );
  expect(
    englishLeft({
      ...defaults,
      sectionInvalid: defaults.sectionInvalid('Part B'),
    })
  ).toEqual([]);
});

function Sheet({ open, forms }: { open: boolean; forms: string[] }) {
  return (
    <AfframeProvider>
      <EditTearsheet
        open={open}
        title="Sheet B"
        onClose={() => undefined}
        onSubmit={() => undefined}>
        {forms.map((title) => (
          <EditTearsheetForm key={title} id={`sheet-${title}`} title={title}>
            <label>
              {`${title} field`}
              <input />
            </label>
          </EditTearsheetForm>
        ))}
        <p>Not a form</p>
      </EditTearsheet>
    </AfframeProvider>
  );
}

const currentItem = () =>
  within(nav())
    .getAllByRole('button')
    .find((item) => item.getAttribute('aria-current') === 'true')?.textContent;

test('the nav ignores children that are not forms, with a warning', async () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  render(<Sheet open forms={['One', 'Two']} />);
  await screen.findByRole('navigation', { name: defaults.sectionsNavLabel });
  expect(
    within(nav())
      .getAllByRole('button')
      .map((item) => item.textContent)
  ).toEqual(['One', 'Two']);
  expect(warn).toHaveBeenCalled();
  warn.mockRestore();
});

test('the current nav item resets on open and stays in range when forms shrink', async () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  const { rerender } = render(<Sheet open forms={['One', 'Two']} />);
  await screen.findByRole('navigation', { name: defaults.sectionsNavLabel });
  await userEvent.click(within(nav()).getByRole('button', { name: 'Two' }));
  expect(currentItem()).toBe('Two');
  rerender(<Sheet open forms={['One']} />);
  expect(currentItem()).toBe('One');
  rerender(<Sheet open forms={['One', 'Two']} />);
  await userEvent.click(within(nav()).getByRole('button', { name: 'Two' }));
  rerender(<Sheet open={false} forms={['One', 'Two']} />);
  await waitFor(() => expect(screen.queryByRole('navigation')).toBeNull());
  rerender(<Sheet open forms={['One', 'Two']} />);
  await screen.findByRole('navigation', { name: defaults.sectionsNavLabel });
  expect(currentItem()).toBe('One');
  warn.mockRestore();
});
