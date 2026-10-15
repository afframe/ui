'use client';
import {
  TimePicker as CarbonTimePicker,
  type TimePickerProps as CarbonTimePickerProps,
} from '@carbon/react';
import { forwardRef } from 'react';
import { useTimeMask, type TimeMaskProps } from './useTimeMask.js';

export type TimePickerProps = CarbonTimePickerProps & TimeMaskProps;

/**
 * Carbon's `TimePicker`, 24-hour `hh:mm` by default, with typing masked to
 * the system time format.
 */
export const TimePicker = forwardRef<HTMLInputElement, TimePickerProps>(
  function TimePicker(props, ref) {
    // A new input drops the mask's listener when inputMask turns false.
    return (
      <CarbonTimePicker
        key={props.inputMask === false ? 'plain' : 'masked'}
        {...useTimeMask(props)}
        ref={ref}
      />
    );
  }
);
TimePicker.displayName = 'TimePicker';
