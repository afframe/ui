'use client';
// The members of `preview__DatePicker`: the Afframe picker with Carbon's
// input and skeleton.
import { preview__DatePicker as carbon } from '@carbon/react';

export { DatePicker, type DatePickerProps } from './PreviewDatePicker.js';
export const DatePickerInput = carbon.DatePickerInput;
export const DatePickerSkeleton = carbon.DatePickerSkeleton;
export type DatePickerInputProps = carbon.DatePickerInputProps;
export type DatePickerSkeletonProps = carbon.DatePickerSkeletonProps;
