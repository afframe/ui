'use client';
// useInputMask attaches DOM listeners and keeps refs, so the module is
// client-only; applyMaskEdit and the specs are pure.
export {
  applyMaskEdit,
  type MaskEdit,
  type MaskState,
} from './applyMaskEdit.js';
export {
  dateMaskSpec,
  timeMaskSpec,
  type DateMaskOptions,
  type MaskPart,
  type MaskPartKind,
  type MaskSpec,
  type TimeMaskOptions,
} from './spec.js';
export { useInputMask, type InputMaskProps } from './useInputMask.js';
