import { Button, DatePickerInput } from '@carbon/react';
import { render, screen } from '@testing-library/react';
import { createRef, useState } from 'react';
import { afterEach, expect, test, vi } from 'vitest';
import { userEvent } from 'vitest/browser';
import {
  ControlledDatePicker,
  type ControlledDatePickerHandle,
  type ControlledDatePickerProps,
} from './ControlledDatePicker.js';

type PickerProps = Omit<ControlledDatePickerProps, 'children'>;

function Single(props: PickerProps) {
  return (
    <ControlledDatePicker datePickerType="single" {...props}>
      <DatePickerInput id="due" labelText="Due date" placeholder="mm/dd/yyyy" />
    </ControlledDatePicker>
  );
}

// A caller that owns the state, with a button that opens the calendar.
function WithButton(props: PickerProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Pick a date</Button>
      <Single
        {...props}
        open={open}
        onOpenChange={(next) => {
          props.onOpenChange?.(next);
          setOpen(next);
        }}
      />
    </>
  );
}

function calendars() {
  return [...document.querySelectorAll<HTMLElement>('.flatpickr-calendar')];
}

function isOpen() {
  return calendars().some((calendar) => calendar.classList.contains('open'));
}

// Carbon destroys the flatpickr calendar (appended to <body>) on unmount.
afterEach(() => {
  expect(calendars()).toHaveLength(0);
});

test('a button opens a controlled picker; Escape closes it and focus stays in the input', async () => {
  const onOpenChange = vi.fn();
  const { unmount } = render(<WithButton onOpenChange={onOpenChange} />);
  const input = screen.getByLabelText('Due date');
  await userEvent.click(screen.getByRole('button', { name: 'Pick a date' }));
  await vi.waitFor(() => expect(isOpen()).toBe(true));
  // The button set the state itself: no change is reported for it.
  expect(onOpenChange).not.toHaveBeenCalled();
  await userEvent.click(input);
  expect(document.activeElement).toBe(input);
  await userEvent.keyboard('{Escape}');
  await vi.waitFor(() => expect(isOpen()).toBe(false));
  expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false);
  expect(document.activeElement).toBe(input);
  unmount();
});

test('Escape inside the calendar closes it and returns focus to the input', async () => {
  const onOpenChange = vi.fn();
  const { unmount } = render(<Single onOpenChange={onOpenChange} />);
  const input = screen.getByLabelText('Due date');
  await userEvent.click(input);
  await vi.waitFor(() => expect(isOpen()).toBe(true));
  await expect
    .poll(() =>
      document
        .querySelector('.flatpickr-calendar.open .today')
        ?.checkVisibility({ visibilityProperty: true })
    )
    .toBe(true);
  // Carbon moves focus from the input to today's date on Tab.
  await userEvent.keyboard('{Tab}');
  expect(document.activeElement).toHaveClass('today');
  expect(document.activeElement?.closest('.flatpickr-calendar')).not.toBeNull();
  await userEvent.keyboard('{Escape}');
  await vi.waitFor(() => expect(isOpen()).toBe(false));
  expect(document.activeElement).toBe(input);
  expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
  unmount();
});

test('uncontrolled: the user opens and closes it, onOpenChange reports both', async () => {
  const onOpenChange = vi.fn();
  const { unmount } = render(<Single onOpenChange={onOpenChange} />);
  await userEvent.click(screen.getByLabelText('Due date'));
  await vi.waitFor(() => expect(isOpen()).toBe(true));
  expect(onOpenChange).toHaveBeenLastCalledWith(true);
  await userEvent.keyboard('{Escape}');
  await vi.waitFor(() => expect(isOpen()).toBe(false));
  expect(onOpenChange.mock.calls).toEqual([[true], [false]]);
  // Arrow Down in the input opens it again.
  await userEvent.keyboard('{ArrowDown}');
  await vi.waitFor(() => expect(isOpen()).toBe(true));
  expect(onOpenChange).toHaveBeenLastCalledWith(true);
  unmount();
});

test('Tab moves focus to the selected date; days and the calendar are named', async () => {
  const { unmount } = render(<Single open value="10/15/2026" />);
  await vi.waitFor(() => expect(isOpen()).toBe(true));
  const calendar = document.querySelector('.flatpickr-calendar.open');
  expect(calendar).toHaveAttribute('role', 'application');
  expect(calendar).toHaveAttribute('aria-label', 'calendar-container');
  await expect
    .poll(() =>
      calendar
        ?.querySelector('.selected')
        ?.checkVisibility({ visibilityProperty: true })
    )
    .toBe(true);
  // Opening through `open` does not move focus.
  expect(document.activeElement).toBe(document.body);
  screen.getByLabelText('Due date').focus();
  await userEvent.keyboard('{Tab}');
  const day = screen.getByRole('button', {
    name: 'Thursday, October 15, 2026',
  });
  expect(day).toHaveClass('selected');
  expect(document.activeElement).toBe(day);
  // The month arrows are images named by Carbon's labels, not buttons.
  expect(screen.getByRole('img', { name: 'Next month' })).toBeVisible();
  expect(screen.getByRole('img', { name: 'Previous month' })).toBeVisible();
  expect(screen.queryByRole('button', { name: 'Next month' })).toBeNull();
  unmount();
});

test('controlled: a user action does not change the state by itself', async () => {
  const onOpenChange = vi.fn();
  const { rerender, unmount } = render(
    <Single open={false} onOpenChange={onOpenChange} />
  );
  // One click opens flatpickr twice (focus, then click): both are reported.
  await userEvent.click(screen.getByLabelText('Due date'));
  await vi.waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(true));
  await vi.waitFor(() => expect(isOpen()).toBe(false));
  expect(onOpenChange.mock.calls.every(([open]) => open)).toBe(true);
  onOpenChange.mockClear();

  rerender(<Single open onOpenChange={onOpenChange} />);
  await vi.waitFor(() => expect(isOpen()).toBe(true));
  await userEvent.keyboard('{Escape}');
  await vi.waitFor(() => expect(onOpenChange).toHaveBeenLastCalledWith(false));
  // The caller kept open: the calendar opens again.
  await vi.waitFor(() => expect(isOpen()).toBe(true));
  expect(onOpenChange).toHaveBeenCalledOnce();

  rerender(<Single open={false} onOpenChange={onOpenChange} />);
  await vi.waitFor(() => expect(isOpen()).toBe(false));
  expect(onOpenChange).toHaveBeenCalledOnce();
  unmount();
});

test('open on mount opens the calendar and the ref holds the flatpickr instance', async () => {
  const ref = createRef<ControlledDatePickerHandle>();
  const { unmount } = render(<Single open ref={ref} />);
  await vi.waitFor(() => expect(isOpen()).toBe(true));
  expect(ref.current?.calendar?.isOpen).toBe(true);
  unmount();
});

test('range mode: open drives the one calendar of both inputs', async () => {
  const onOpenChange = vi.fn();
  function Range({ open }: { open: boolean }) {
    return (
      <ControlledDatePicker
        datePickerType="range"
        open={open}
        onOpenChange={onOpenChange}>
        <DatePickerInput id="from" labelText="From" placeholder="mm/dd/yyyy" />
        <DatePickerInput id="to" labelText="To" placeholder="mm/dd/yyyy" />
      </ControlledDatePicker>
    );
  }
  const { rerender, unmount } = render(<Range open={false} />);
  expect(isOpen()).toBe(false);
  screen.getByLabelText('To').focus();
  await vi.waitFor(() => expect(isOpen()).toBe(true));
  await userEvent.keyboard('{Escape}');
  await vi.waitFor(() => expect(isOpen()).toBe(false));
  onOpenChange.mockClear();
  rerender(<Range open />);
  await vi.waitFor(() => expect(isOpen()).toBe(true));
  // Opening through `open` leaves focus where it is.
  expect(document.activeElement).toBe(screen.getByLabelText('To'));
  expect(calendars()).toHaveLength(1);
  await userEvent.click(screen.getByLabelText('To'));
  expect(isOpen()).toBe(true);
  rerender(<Range open={false} />);
  await vi.waitFor(() => expect(isOpen()).toBe(false));
  expect(onOpenChange).not.toHaveBeenCalled();
  unmount();
});

test('onOpen and onClose still reach the caller', async () => {
  const onOpen = vi.fn();
  const onClose = vi.fn();
  const { rerender, unmount } = render(
    <Single open onOpen={onOpen} onClose={onClose} />
  );
  await vi.waitFor(() => expect(onOpen).toHaveBeenCalled());
  rerender(<Single open={false} onOpen={onOpen} onClose={onClose} />);
  await vi.waitFor(() => expect(onClose).toHaveBeenCalled());
  unmount();
});

test("a caller's onKeyDown still runs", async () => {
  const onKeyDown = vi.fn();
  const props = { onKeyDown } as PickerProps;
  const { unmount } = render(<Single {...props} />);
  await userEvent.click(screen.getByLabelText('Due date'));
  await userEvent.keyboard('{Escape}');
  expect(onKeyDown).toHaveBeenCalled();
  expect(isOpen()).toBe(false);
  unmount();
});
