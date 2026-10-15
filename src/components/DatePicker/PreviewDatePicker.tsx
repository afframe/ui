'use client';
import { preview__DatePicker as carbon } from '@carbon/react';
import { Children, cloneElement, isValidElement, type ReactNode } from 'react';
import {
  datePlaceholder,
  defaultDatePattern,
  fromFlatpickrFormat,
  toFlatpickrFormat,
} from '../../format/index.js';

export type DatePickerProps = carbon.DatePickerProps;

/**
 * Carbon's `preview__DatePicker.DatePicker` in the system date format, with
 * the matching placeholder. Carbon's preview takes no typed date (it fills
 * its inputs from the selected date), so it has no typing mask.
 */
export function DatePicker({
  dateFormat = toFlatpickrFormat(defaultDatePattern),
  children,
  ...props
}: DatePickerProps) {
  const pattern = fromFlatpickrFormat(dateFormat);
  const placeholder = pattern && datePlaceholder(pattern);
  return (
    <carbon.DatePicker {...props} dateFormat={dateFormat}>
      {placeholder
        ? Children.toArray(children as ReactNode).map((child, index) =>
            index < 2 &&
            isValidElement<carbon.DatePickerInputProps>(child) &&
            child.props.placeholder === undefined
              ? cloneElement(child, { placeholder })
              : child
          )
        : children}
    </carbon.DatePicker>
  );
}
DatePicker.displayName = 'DatePicker';
