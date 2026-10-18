'use client';
import {
  FluidDatePicker as CarbonFluidDatePicker,
  type DatePickerProps as CarbonDatePickerProps,
  type FluidDatePickerProps as CarbonFluidDatePickerProps,
} from '@carbon/react';
import { forwardRef } from 'react';
import { useDateField, type DateFieldProps } from '../DatePicker/dateField.js';

// Carbon's Fluid picker passes every other prop to its DatePicker; its types
// list only its own.
export type FluidDatePickerProps = CarbonFluidDatePickerProps &
  Omit<CarbonDatePickerProps, keyof CarbonFluidDatePickerProps> &
  DateFieldProps;

/**
 * Carbon's `FluidDatePicker` in the system date format, masked like the
 * Afframe `DatePicker`: Carbon's Fluid picker renders Carbon's own
 * `DatePicker`, so it needs its own wrapper.
 */
export const FluidDatePicker = forwardRef<
  HTMLInputElement,
  FluidDatePickerProps
>(function FluidDatePicker(
  { inputMask, messages, dateFormat, parseDate, onChange, children, ...props },
  ref
) {
  const field = useDateField({
    name: 'FluidDatePicker',
    children,
    dateFormat,
    allowInput: props.allowInput,
    inputMask,
    messages,
    value: props.value,
    hasOnChange: onChange !== undefined,
  });
  const parser = parseDate ?? field.parseDate;
  const carbonProps = {
    ...props,
    dateFormat: field.dateFormat,
    ...(parser && { parseDate: parser }),
    onChange: ((dates, dateString, instance, data) => {
      field.pickerChanged(dates, instance);
      onChange?.(dates, dateString, instance, data);
    }) satisfies CarbonDatePickerProps['onChange'],
  };
  return (
    <CarbonFluidDatePicker {...carbonProps} ref={ref}>
      {field.children}
    </CarbonFluidDatePicker>
  );
});
FluidDatePicker.displayName = 'FluidDatePicker';
