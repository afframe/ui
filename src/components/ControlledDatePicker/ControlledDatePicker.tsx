'use client';
import { DatePicker, type DatePickerProps } from '@carbon/react';
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type KeyboardEvent,
  type Ref,
} from 'react';

/** The part of flatpickr's instance this component uses. */
export interface ControlledDatePickerCalendar {
  readonly isOpen: boolean;
  open: () => void;
  close: () => void;
}

/** What Carbon's `DatePicker` ref holds: the flatpickr instance, once created. */
export interface ControlledDatePickerHandle {
  readonly calendar: ControlledDatePickerCalendar | null;
}

export interface ControlledDatePickerProps extends DatePickerProps {
  /** Whether the calendar is open. Given: controlled; omitted: the picker opens and closes itself. */
  open?: boolean;
  /** Called when the user opens or closes the calendar (click, Arrow Down, Escape, a selected date, a click outside). */
  onOpenChange?: (open: boolean) => void;
  /** Carbon's handle: `ref.current.calendar` is the flatpickr instance. */
  ref?: Ref<ControlledDatePickerHandle>;
}

type Hook = NonNullable<DatePickerProps['onOpen']>;

/**
 * Carbon's classic (flatpickr) `DatePicker` with a controlled `open` prop.
 * It drives flatpickr's own `open()` and `close()` through the instance on
 * Carbon's ref and reports user actions through `onOpenChange`. A controlled
 * picker returns to `open` when the caller does not take the change.
 */
export function ControlledDatePicker({
  open,
  onOpenChange,
  onOpen,
  onClose,
  ref,
  ...props
}: ControlledDatePickerProps) {
  const handle = useRef<ControlledDatePickerHandle>(null);
  useImperativeHandle(ref, () => ({
    get calendar() {
      return handle.current?.calendar ?? null;
    },
  }));
  const controlled = open !== undefined;
  // The open state as the caller last saw it: the prop when controlled, the
  // last reported state otherwise. A hook reports only a change from it.
  const seen = useRef(open ?? false);
  const latest = useRef({ controlled, onOpenChange });
  // A user action on a controlled picker: re-render, then sync to the prop.
  const [syncCount, setSyncCount] = useState(0);

  useEffect(() => {
    latest.current = { controlled, onOpenChange };
    if (controlled) seen.current = open;
  });

  const report = useCallback((next: boolean) => {
    const { controlled, onOpenChange } = latest.current;
    if (seen.current !== next) {
      if (!controlled) seen.current = next;
      onOpenChange?.(next);
    }
    if (controlled) setSyncCount((count) => count + 1);
  }, []);

  const handleOpen = useCallback<Hook>(
    (...args) => {
      onOpen?.(...args);
      report(true);
    },
    [onOpen, report]
  );

  const handleClose = useCallback<Hook>(
    (...args) => {
      onClose?.(...args);
      report(false);
    },
    [onClose, report]
  );

  useEffect(() => {
    const sync = () => {
      const calendar = handle.current?.calendar;
      if (!calendar) return;
      // Uncontrolled: a rebuilt instance starts closed, so the last
      // reported state follows it and the next open is reported.
      if (open === undefined) {
        seen.current = calendar.isOpen;
        return;
      }
      if (open && !calendar.isOpen) calendar.open();
      if (!open && calendar.isOpen) calendar.close();
    };
    sync();
    // Carbon recreates the flatpickr instance after its first render and
    // when the props below change; check again once that has settled.
    const frame = requestAnimationFrame(sync);
    return () => cancelAnimationFrame(frame);
  }, [
    open,
    syncCount,
    props.datePickerType,
    props.readOnly,
    props.closeOnSelect,
    props.nextMonthAriaLabel,
    props.prevMonthAriaLabel,
  ]);

  // Carbon handles Escape in the date input by hiding the calendar without
  // closing flatpickr. Close it, so the state and onOpenChange follow.
  const { onKeyDown } = props as {
    onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    const calendar = handle.current?.calendar;
    if (event.key === 'Escape' && calendar?.isOpen) calendar.close();
  };

  // Carbon spreads unknown props on its wrapper div.
  const wrapperProps = { onKeyDown: handleKeyDown } as object;

  return (
    <DatePicker
      {...props}
      {...wrapperProps}
      onOpen={handleOpen}
      onClose={handleClose}
      // Carbon types its ref as the wrapper div; it holds { calendar }.
      ref={handle as unknown as Ref<HTMLDivElement>}
    />
  );
}
