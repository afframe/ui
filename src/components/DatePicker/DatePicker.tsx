'use client';
import {
  DatePicker as CarbonDatePicker,
  type DatePickerProps as CarbonDatePickerProps,
} from '@carbon/react';
import { forwardRef } from 'react';
import { useDateField, type DateFieldProps } from './dateField.js';

export type DatePickerProps = CarbonDatePickerProps & DateFieldProps;

/**
 * Carbon's `DatePicker` in the system date format (`defaultDateFormat`):
 * typed dates are masked and parsed strictly, and an incomplete or impossible
 * date stays as typed with the input marked invalid.
 */
export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  function DatePicker(
    {
      inputMask,
      messages,
      dateFormat,
      parseDate,
      onChange,
      children,
      ...props
    },
    ref
  ) {
    const field = useDateField({
      name: 'DatePicker',
      children,
      dateFormat,
      allowInput: props.allowInput,
      inputMask,
      messages,
      value: props.value,
      hasOnChange: onChange !== undefined,
    });
    const parser = parseDate ?? field.parseDate;
    return (
      <CarbonDatePicker
        {...props}
        ref={ref}
        dateFormat={field.dateFormat}
        {...(parser && { parseDate: parser })}
        onChange={(dates, dateString, instance, data) => {
          field.pickerChanged(dates, instance);
          onChange?.(dates, dateString, instance, data);
        }}>
        {field.children}
      </CarbonDatePicker>
    );
  }
);
DatePicker.displayName = 'DatePicker';
