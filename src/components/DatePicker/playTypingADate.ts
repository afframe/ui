import { expect, userEvent, within } from 'storybook/test';

/**
 * The play test of the "Typing A Date" stories: the mask pads and separates,
 * and an impossible date stays as typed with the input invalid.
 */
export async function playTypingADate(canvasElement: HTMLElement) {
  const input =
    within(canvasElement).getByLabelText<HTMLInputElement>('Due date');
  await userEvent.type(input, '01102026');
  await expect(input).toHaveValue('01.10.2026');
  await userEvent.clear(input);
  await userEvent.type(input, '1.1.2026');
  await expect(input).toHaveValue('01.01.2026');
  await userEvent.clear(input);
  await userEvent.type(input, '31022026');
  // A click outside blurs the input and closes a calendar.
  await userEvent.click(document.body);
  await expect(input).toHaveValue('31.02.2026');
  await expect(input).toHaveAttribute('aria-invalid', 'true');
}
