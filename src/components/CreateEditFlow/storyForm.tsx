// Demo form and play functions shared by the create and edit stories.
// Story-only: not shipped, not exported from the package.
import { useState } from 'react';
import { expect, screen, userEvent, waitFor } from 'storybook/test';
import { TextInput } from '../../index.js';
import { defaultCreateEditFlowMessages } from './CreateEditFlow.js';

const duplicateError = 'A customer with this name already exists.';

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

export const rejectSubmit = () => Promise.reject(new Error(duplicateError));
export const pendingSubmit = () => new Promise<void>(() => undefined);

/** Clicks the primary button. */
export const clickPrimary = (name: string) => async () => {
  await userEvent.click(await screen.findByRole('button', { name }));
};

/** Clicks the primary button and waits for the error notification. */
export const playRejected = (name: string) => async () => {
  await clickPrimary(name)();
  await screen.findByText(defaultCreateEditFlowMessages.submitError, {
    selector: '.cds--inline-notification__title',
  });
};

/** Types into Email, then Cancel opens the discard dialog. */
export const playDirty = async () => {
  await userEvent.type(
    await screen.findByRole('textbox', { name: 'Email' }),
    'billing@example.com'
  );
  await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
  await screen.findByRole('alertdialog');
};

/**
 * WCAG 2.4.11: focuses a field that sits under the sticky action bar and
 * checks the field is what is painted at its centre.
 */
export const playFocusNotObscured = (label: string) => async () => {
  const field = await screen.findByRole('textbox', { name: label });
  // Let the surface's own initial focus land first.
  await waitFor(() =>
    expect(document.activeElement).toBeInstanceOf(HTMLInputElement)
  );
  await Promise.all(
    document.getAnimations().map((animation) => animation.finished)
  );
  await new Promise((resolve) => setTimeout(resolve, 50));
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
