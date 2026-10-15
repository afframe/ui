'use client';
import { preview__DatePicker as carbon } from '@carbon/react';
import { useDateField, type DateFieldProps } from './dateField.js';

export type DatePickerProps = carbon.DatePickerProps & DateFieldProps;

/**
 * Carbon's `preview__DatePicker.DatePicker` in the system date format, with
 * the typing mask. Carbon's preview keeps no typed text (it controls its
 * inputs from the selected date), so the wrapper holds the text and marks an
 * incomplete or impossible date invalid on blur.
 */
export function DatePicker({
  inputMask,
  messages,
  dateFormat,
  onChange,
  children,
  ...props
}: DatePickerProps) {
  const field = useDateField({
    name: 'preview__DatePicker',
    children,
    dateFormat,
    allowInput: props.allowInput,
    inputMask,
    messages,
    value: props.value,
    restoreText: false,
    controlText: true,
  });
  return (
    <carbon.DatePicker
      {...props}
      dateFormat={field.dateFormat}
      onChange={(dates) => {
        field.pickerChanged(dates);
        onChange?.(dates);
      }}>
      {field.children}
    </carbon.DatePicker>
  );
}
DatePicker.displayName = 'DatePicker';
