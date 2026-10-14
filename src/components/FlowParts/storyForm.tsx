// Demo form, harness, stories and play functions shared by the create and
// edit stories. Story-only: not shipped, not exported from the package.
import { useRef, useState } from 'react';
import type { ComponentType, ReactNode, RefObject } from 'react';
import { expect, screen, userEvent, waitFor } from 'storybook/test';
import { Button, TextInput } from '../../index.js';
import { defaultFormFlowMessages } from './messages.js';

const duplicateError = 'A customer with this name already exists.';

/** Country-neutral example record shared by the create and edit stories. */
export const exampleCustomer = {
  name: 'Lakeside Furniture',
  email: 'billing@example.com',
  billingEmail: 'accounts@example.com',
} as const;

/** Name and Email fields; `extraFields` adds Note fields for a long form. */
export function useCustomerForm(
  idPrefix: string,
  initialName = '',
  extraFields = 0
) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState('');
  const fields = (
    <>
      <TextInput
        id={`${idPrefix}-name`}
        labelText="Name"
        value={name}
        onChange={(event) => setName(event.target.value)}
      />
      <TextInput
        id={`${idPrefix}-email`}
        labelText="Email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />
      {Array.from({ length: extraFields }, (_, index) => (
        <TextInput
          key={index}
          id={`${idPrefix}-note-${index + 1}`}
          labelText={`Note ${index + 1}`}
        />
      ))}
    </>
  );
  return {
    fields,
    isDirty: name !== initialName || email !== '',
    submitDisabled: name.trim() === '',
  };
}

const rejectSubmit = () => Promise.reject(new Error(duplicateError));
const pendingSubmit = () => new Promise<void>(() => undefined);

/** Clicks the primary button. */
const clickPrimary = (name: string) => async () => {
  await userEvent.click(await screen.findByRole('button', { name }));
};

/**
 * Waits for the surface's own initial focus and its entrance animation. IBM
 * SidePanel refocuses its primary target once its slide-in ends, which would
 * take focus from anything a play moved it to before.
 */
const settleAnimations = async () => {
  await Promise.all(
    document.getAnimations().map((animation) => animation.finished)
  );
  await new Promise((resolve) => setTimeout(resolve, 50));
};

const settleOpen = async () => {
  await waitFor(() =>
    expect(document.activeElement).toBeInstanceOf(HTMLInputElement)
  );
  await settleAnimations();
};

/** Clicks the primary button once open; the error alert takes focus. */
const playRejected = (name: string) => async () => {
  await settleOpen();
  await clickPrimary(name)();
  const title = await screen.findByText(defaultFormFlowMessages.error, {
    selector: '.cds--inline-notification__title',
  });
  const alert = title.closest('[role="alert"]');
  await waitFor(() => expect(document.activeElement).toBe(alert));
  // Still there once every animation has ended.
  await settleAnimations();
  await expect(document.activeElement).toBe(alert);
};

/** Types into Email, then Cancel opens the discard dialog. */
const playDirty = async () => {
  await userEvent.type(
    await screen.findByRole('textbox', { name: 'Email' }),
    exampleCustomer.email
  );
  await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
  await screen.findByRole('alertdialog');
};

/**
 * WCAG 2.4.11: focuses a field that sits under the sticky action bar and
 * checks the field is what is painted at its centre.
 */
const playFocusNotObscured = (label: string) => async () => {
  const field = await screen.findByRole('textbox', { name: label });
  await settleOpen();
  field.focus();
  await expect(document.activeElement).toBe(field);
  await new Promise((resolve) => requestAnimationFrame(resolve));
  const box = field.getBoundingClientRect();
  const hit = document.elementFromPoint(
    box.left + box.width / 2,
    box.top + box.height / 2
  );
  await expect(hit === field || field.contains(hit)).toBe(true);
};

/** Story args that drive the demo form, not the component. */
export interface FlowHarnessArgs {
  initialName?: string | undefined;
  extraFields?: number | undefined;
}

/** Keeps the harness args out of the controls table. */
export const flowHarnessArgTypes = {
  initialName: { table: { disable: true } },
  extraFields: { table: { disable: true } },
} as const;

interface FlowSurfaceProps {
  open: boolean;
  onClose: () => void;
  launcherRef?: RefObject<HTMLElement | null>;
  isDirty?: boolean;
  submitDisabled?: boolean;
  children?: ReactNode;
}

interface FlowHarnessProps<P extends FlowSurfaceProps> {
  surface: ComponentType<P>;
  args: P & FlowHarnessArgs;
  idPrefix: string;
  launcher: string;
  layout: (fields: ReactNode) => ReactNode;
}

// Owns the open state and the demo form; the other props come from the story
// args. Opens with the args' `open`; the launcher reopens it.
function FlowHarness<P extends FlowSurfaceProps>({
  surface: Surface,
  args,
  idPrefix,
  launcher,
  layout,
}: FlowHarnessProps<P>) {
  const { initialName, extraFields, ...props } = args;
  const [open, setOpen] = useState(args.open);
  const form = useCustomerForm(idPrefix, initialName, extraFields);
  const launcherRef = useRef<HTMLButtonElement>(null);
  return (
    <>
      <Button ref={launcherRef} onClick={() => setOpen(true)}>
        {launcher}
      </Button>
      <Surface
        {...(props as P)}
        open={open}
        onClose={() => setOpen(false)}
        launcherRef={launcherRef}
        isDirty={form.isDirty}
        submitDisabled={form.submitDisabled}>
        {layout(form.fields)}
      </Surface>
    </>
  );
}

/**
 * Story render of an overlay create or edit component. `layout` places the
 * demo fields; default as the only children.
 */
export function flowRender<P extends FlowSurfaceProps>(
  surface: ComponentType<P>,
  idPrefix: string,
  launcher: string,
  layout: (fields: ReactNode) => ReactNode = (fields) => fields
) {
  return function FlowStory(args: P & FlowHarnessArgs) {
    return (
      <FlowHarness
        surface={surface}
        args={args}
        idPrefix={idPrefix}
        launcher={launcher}
        layout={layout}
      />
    );
  };
}

/**
 * The stories every create and edit component has. `primary` names the
 * submit button; `initialName` fills Name where the form starts empty.
 */
export function flowStories(
  primary: string,
  longFormFields: number,
  initialName?: string
) {
  const named = initialName === undefined ? {} : { initialName };
  return {
    WithError: {
      args: { ...named, onSubmit: rejectSubmit },
      play: playRejected(primary),
    },
    Dirty: { args: named, play: playDirty },
    Submitting: {
      args: { ...named, onSubmit: pendingSubmit },
      play: clickPrimary(primary),
    },
    LongForm: { args: { extraFields: longFormFields } },
    // Test only: its play leaves focus on the last field.
    FocusNotObscured: {
      args: { extraFields: longFormFields },
      tags: ['!dev', '!autodocs'],
      play: playFocusNotObscured(`Note ${longFormFields}`),
    },
  };
}
