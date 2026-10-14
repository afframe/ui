import {
  cleanup,
  render,
  screen,
  waitFor,
  within,
} from '@testing-library/react';
import { TextInput } from '@carbon/react';
import { createRef, useRef, useState } from 'react';
import { afterEach, expect, test, vi } from 'vitest';
import { page, userEvent } from 'vitest/browser';
import { AfframeProvider } from '../../index.js';
import {
  englishLeft,
  sentinelMessages,
  tabbables,
  settleAndCleanup,
} from '../FlowParts/flowTestUtils.js';
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

test('the nav switches the form shown; values survive the switch', async () => {
  const onFormChange = vi.fn();
  render(<Harness onFormChange={onFormChange} />);
  await launch();
  const items = within(nav()).getAllByRole('button');
  expect(items.map((item) => item.textContent)).toEqual(['Part A', 'Part B']);
  expect(items[0]?.getAttribute('aria-current')).toBe('step');
  expect(screen.queryByRole('textbox', { name: 'Field C' })).toBeNull();
  await userEvent.type(fieldA(), 'kept');
  items[1]?.focus();
  await userEvent.keyboard('{Enter}');
  // Focus stays on the step.
  expect(active()).toBe(items[1]);
  expect(items[1]?.getAttribute('aria-current')).toBe('step');
  // Carbon's step handles Enter and the native click; the form changes once.
  expect(onFormChange).toHaveBeenCalledTimes(1);
  expect(onFormChange).toHaveBeenCalledWith(1);
  // Forms have no order: no step reads as complete, only the shown one as current.
  expect(
    document.querySelectorAll('.cds--progress-step--complete')
  ).toHaveLength(0);
  expect(
    [...document.querySelectorAll('.cds--progress-step--current')].map(
      (step) => step.textContent
    )
  ).toEqual(['Part B']);
  expect(screen.getByRole('textbox', { name: 'Field C' })).toBeTruthy();
  expect(screen.queryByRole('textbox', { name: 'Field A' })).toBeNull();
  await userEvent.click(items[0] as HTMLElement);
  expect((fieldA() as HTMLInputElement).value).toBe('kept');
});

test('an invalid form has a named marker; Save focuses it and does not submit', async () => {
  const onSubmit = vi.fn();
  render(<Harness invalidB onSubmit={onSubmit} />);
  await launch();
  expect(
    within(nav()).getByRole('button', {
      name: `Part B ${defaults.sectionInvalid('Part B')}`,
    })
  ).toBeTruthy();
  const save = screen.getByRole('button', { name: defaults.save });
  expect(save.hasAttribute('disabled')).toBe(false);
  await userEvent.click(save);
  expect(onSubmit).not.toHaveBeenCalled();
  await waitFor(() =>
    expect(active()).toBe(screen.getByRole('heading', { name: 'Part B' }))
  );
  expect(screen.getByRole('textbox', { name: 'Field C' })).toBeTruthy();
});

test('a rejected submit with a field marked invalid in a hidden form shows that form and focuses the field', async () => {
  function Rejecting() {
    const [invalid, setInvalid] = useState(false);
    return (
      <AfframeProvider>
        <EditTearsheet
          open
          title="Sheet D"
          onClose={() => undefined}
          onSubmit={() => {
            setInvalid(true);
            return Promise.reject(new Error('Taken'));
          }}>
          <EditTearsheetForm id="d-one" title="One">
            <label>
              One field
              <input />
            </label>
          </EditTearsheetForm>
          <EditTearsheetForm id="d-two" title="Two">
            <label>
              Two field
              <input aria-invalid={invalid || undefined} />
            </label>
          </EditTearsheetForm>
        </EditTearsheet>
      </AfframeProvider>
    );
  }
  render(<Rejecting />);
  await userEvent.click(
    await screen.findByRole('button', { name: defaults.save })
  );
  await waitFor(() =>
    expect(active()).toBe(screen.getByRole('textbox', { name: 'Two field' }))
  );
});

test('a field marked invalid in a hidden form a render after the error still gets the focus', async () => {
  function Rejecting() {
    const [invalid, setInvalid] = useState(false);
    return (
      <AfframeProvider>
        <EditTearsheet
          open
          title="Sheet H"
          onClose={() => undefined}
          onSubmit={() => {
            setTimeout(() => setInvalid(true), 50);
            return Promise.reject(new Error('Taken'));
          }}>
          <EditTearsheetForm id="h-one" title="One">
            <label>
              One field
              <input />
            </label>
          </EditTearsheetForm>
          <EditTearsheetForm id="h-two" title="Two">
            <label>
              Two field
              <input aria-invalid={invalid || undefined} />
            </label>
          </EditTearsheetForm>
        </EditTearsheet>
      </AfframeProvider>
    );
  }
  render(<Rejecting />);
  await userEvent.click(
    await screen.findByRole('button', { name: defaults.save })
  );
  await waitFor(() =>
    expect(active()).toBe(screen.getByRole('textbox', { name: 'Two field' }))
  );
});

test('a rejected submit with invalid fields in the shown and a hidden form focuses the shown one', async () => {
  function Rejecting() {
    const [invalid, setInvalid] = useState(false);
    return (
      <AfframeProvider>
        <EditTearsheet
          open
          title="Sheet G"
          onClose={() => undefined}
          onSubmit={() => {
            setInvalid(true);
            return Promise.reject(new Error('Taken'));
          }}>
          <EditTearsheetForm id="g-one" title="One">
            <label>
              One field
              <input aria-invalid={invalid || undefined} />
            </label>
          </EditTearsheetForm>
          <EditTearsheetForm id="g-two" title="Two">
            <label>
              Two field
              <input aria-invalid={invalid || undefined} />
            </label>
          </EditTearsheetForm>
        </EditTearsheet>
      </AfframeProvider>
    );
  }
  render(<Rejecting />);
  await userEvent.click(
    within(
      await screen.findByRole('navigation', { name: defaults.sectionsNavLabel })
    ).getByRole('button', { name: 'Two' })
  );
  await userEvent.click(screen.getByRole('button', { name: defaults.save }));
  await screen.findByRole('alert');
  await waitFor(() =>
    expect(active()).toBe(screen.getByRole('textbox', { name: 'Two field' }))
  );
  expect(currentItem()).toBe('Two');
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
  // Escape while busy asks first; the success closes that dialog too.
  await userEvent.keyboard('{Escape}');
  await screen.findByRole('alertdialog');
  expect(onClose).not.toHaveBeenCalled();
  resolve();
  await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  await waitFor(() => expect(screen.queryByRole('alertdialog')).toBeNull());
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
    defaults.error
  );
  expect(onClose).not.toHaveBeenCalled();
});

test.each(['wide', 'narrow'] as const)(
  '%s: the error alert lines up with the fields',
  async (variant) => {
    // Wider than Carbon's lg breakpoint, where the wide fields take 8 of 16 columns.
    await page.viewport(1280, 800);
    try {
      render(
        <AfframeProvider>
          <EditTearsheet
            open
            variant={variant}
            title="Sheet F"
            onClose={() => undefined}
            onSubmit={() => Promise.reject(new Error('Conflict'))}>
            <EditTearsheetForm id="f-one" title="One">
              <TextInput id="f-name" labelText="Name" />
            </EditTearsheetForm>
          </EditTearsheet>
        </AfframeProvider>
      );
      await userEvent.click(
        await screen.findByRole('button', { name: defaults.save })
      );
      // TextInput has an alert of its own, for its character counter.
      const alert = await waitFor(() => {
        const node = document.querySelector('[data-afframe-flow-error]');
        if (!node) throw new Error('No error alert');
        return node.getBoundingClientRect();
      });
      const field = screen
        .getByRole('textbox', { name: 'Name' })
        .getBoundingClientRect();
      expect(Math.abs(alert.left - field.left)).toBeLessThanOrEqual(1);
      expect(Math.abs(alert.width - field.width)).toBeLessThanOrEqual(1);
    } finally {
      await page.viewport(1024, 768);
    }
  }
);

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
  expect(
    screen.getByRole('button', { name: 'Part B zzInvalid Part B' })
  ).toBeTruthy();
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
  await waitFor(() => expect(document.body.textContent).toContain(s.pending));
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
    .find((item) => item.getAttribute('aria-current') === 'step')?.textContent;

test('the nav ignores children that are not forms, with a warning', async () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  render(<Sheet open forms={['One', 'Two']} />);
  await screen.findByRole('navigation', { name: defaults.sectionsNavLabel });
  expect(
    within(nav())
      .getAllByRole('button')
      .map((item) => item.textContent)
  ).toEqual(['One', 'Two']);
  expect(warn).toHaveBeenCalledWith(expect.stringContaining('EditTearsheet:'));
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

test('ref and rest props reach the root', async () => {
  const ref = createRef<HTMLDivElement>();
  render(
    <AfframeProvider>
      <EditTearsheet
        ref={ref}
        data-testid="root"
        open
        title="Customer"
        onClose={() => undefined}
        onSubmit={() => undefined}>
        <EditTearsheetForm id="ref-general" title="General">
          <input aria-label="Name" />
        </EditTearsheetForm>
      </EditTearsheet>
    </AfframeProvider>
  );
  const root = await screen.findByTestId('root');
  expect(ref.current).toBe(root);
  expect(root.classList).toContain('afframe-edit-tearsheet');
});

test('narrow: a trigger opens the nav in a panel; choosing a form closes it; Escape closes only the panel', async () => {
  const onClose = vi.fn();
  render(
    <AfframeProvider>
      <EditTearsheet
        open
        variant="narrow"
        title="Sheet E"
        headerActions={<button type="button">Header action</button>}
        decorator={<span>Decorator</span>}
        onClose={onClose}
        onSubmit={() => undefined}>
        <EditTearsheetForm id="e-one" title="One">
          <input aria-label="One field" />
        </EditTearsheetForm>
        <EditTearsheetForm id="e-two" title="Two">
          <input aria-label="Two field" />
        </EditTearsheetForm>
      </EditTearsheet>
    </AfframeProvider>
  );
  expect(
    await screen.findByRole('button', { name: 'Header action' })
  ).toBeTruthy();
  expect(screen.getByText('Decorator')).toBeTruthy();
  const trigger = document.querySelector<HTMLElement>(
    '.afframe-edit-tearsheet-sections-trigger'
  );
  if (!trigger) throw new Error('no trigger');
  // Named by its tooltip, which this query library does not resolve.
  expect(
    document.getElementById(trigger.getAttribute('aria-labelledby') ?? '')
      ?.textContent
  ).toBe(defaults.openSections);
  await userEvent.click(trigger);
  await userEvent.click(
    within(await screen.findByRole('navigation')).getByRole('button', {
      name: 'Two',
    })
  );
  expect(screen.getByRole('textbox', { name: 'Two field' })).toBeTruthy();
  await waitFor(() => expect(screen.queryByRole('navigation')).toBeNull());
  await waitFor(() => expect(active()).toBe(trigger));
  // The nav sits in the closed panel; the hidden form's field is skipped.
  expect(
    tabbables(trigger.closest('dialog')).map(
      (element) => element.textContent || element.className.split(' ')[0]
    )
  ).toEqual([
    'cds--modal-close',
    'Header action',
    'afframe-edit-tearsheet-sections-trigger',
    '',
    'Cancel',
    'Save',
  ]);
  await userEvent.click(trigger);
  await screen.findByRole('navigation');
  await userEvent.keyboard('{Escape}');
  await waitFor(() => expect(screen.queryByRole('navigation')).toBeNull());
  await waitFor(() => expect(active()).toBe(trigger));
  expect(onClose).not.toHaveBeenCalled();
});
