'use client';
import {
  FluidTimePicker as CarbonFluidTimePicker,
  type FluidTimePickerProps as CarbonFluidTimePickerProps,
} from '@carbon/react';
import { forwardRef, type InputHTMLAttributes } from 'react';
import { useTimeMask, type TimeMaskProps } from '../TimePicker/useTimeMask.js';

// Carbon passes these on to the input but leaves them out of its type.
type InputProps = Pick<
  InputHTMLAttributes<HTMLInputElement>,
  'onFocus' | 'onCompositionEnd' | 'pattern' | 'maxLength'
>;

export type FluidTimePickerProps = CarbonFluidTimePickerProps &
  InputProps &
  TimeMaskProps;

/**
 * Carbon's `FluidTimePicker`, 24-hour `hh:mm` by default, with typing masked
 * to the system time format.
 */
export const FluidTimePicker = forwardRef<
  HTMLInputElement,
  FluidTimePickerProps
>(function FluidTimePicker(props, ref) {
  // A new input drops the mask's listener when inputMask turns false.
  return (
    <CarbonFluidTimePicker
      key={props.inputMask === false ? 'plain' : 'masked'}
      {...useTimeMask(props)}
      ref={ref}
    />
  );
});
FluidTimePicker.displayName = 'FluidTimePicker';
