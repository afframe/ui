'use client';
import {
  useEffect,
  useRef,
  type ChangeEvent,
  type CompositionEvent,
  type FocusEvent,
} from 'react';
import {
  applyMaskEdit,
  normalizeMaskValue,
  type MaskState,
} from './applyMaskEdit.js';
import type { MaskSpec } from './spec.js';

export interface InputMaskProps {
  onFocus: (event: FocusEvent<HTMLInputElement>) => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onCompositionEnd: (event: CompositionEvent<HTMLInputElement>) => void;
  inputMode: 'numeric';
  autoComplete: 'off';
  placeholder: string;
  pattern: string;
}

function write(input: HTMLInputElement, next: MaskState, inputType: string) {
  if (input.value !== next.value) {
    // The prototype setter bypasses React's value tracker; through the
    // instance setter React would treat the input event below as no change
    // and skip onChange.
    Object.getOwnPropertyDescriptor(
      HTMLInputElement.prototype,
      'value'
    )?.set?.call(input, next.value);
    input.setSelectionRange(next.selectionStart, next.selectionEnd);
    input.dispatchEvent(new InputEvent('input', { bubbles: true, inputType }));
  } else {
    input.setSelectionRange(next.selectionStart, next.selectionEnd);
  }
}

const caretOf = (input: HTMLInputElement) =>
  input.selectionStart ?? input.value.length;

const stateOf = (input: HTMLInputElement): MaskState => ({
  value: input.value,
  selectionStart: caretOf(input),
  selectionEnd: input.selectionEnd ?? caretOf(input),
});

const dataOf = (event: InputEvent) =>
  event.data ?? event.dataTransfer?.getData('text/plain') ?? null;

function listenerFor(
  input: HTMLInputElement,
  spec: { current: MaskSpec },
  enabled: { current: boolean }
) {
  return (event: InputEvent) => {
    if (event.isComposing || !enabled.current) return;
    const next = applyMaskEdit(
      stateOf(input),
      { inputType: event.inputType, data: dataOf(event) },
      spec.current
    );
    if (!next) return;
    event.preventDefault();
    write(input, next, event.inputType);
  };
}

function normalized(input: HTMLInputElement, spec: MaskSpec): MaskState {
  const { value, caret } = normalizeMaskValue(
    input.value,
    caretOf(input),
    spec
  );
  return { value, selectionStart: caret, selectionEnd: caret };
}

/**
 * Masks typing in a text input to `spec`. Spread the result on the input;
 * a consumer's own `onFocus`, `onChange` or `onCompositionEnd` must call the
 * mask's handler first. `enabled: false` stops the native listener, which
 * outlives the spread props on an input that stays mounted.
 */
export function useInputMask(spec: MaskSpec, enabled = true): InputMaskProps {
  const specRef = useRef(spec);
  const enabledRef = useRef(enabled);
  const attached = useRef<{
    input: HTMLInputElement;
    listener: (event: InputEvent) => void;
  }>(null);

  useEffect(() => {
    specRef.current = spec;
    enabledRef.current = enabled;
  });

  const detach = () => {
    const current = attached.current;
    current?.input.removeEventListener('beforeinput', current.listener);
    attached.current = null;
  };
  useEffect(() => detach, []);

  return {
    // React's onBeforeInput comes from `textInput` and never reports deletes
    // or an inputType, so the native event is needed. A ref would not reach
    // the input either: Carbon's DatePicker clones its inputs with its own.
    onFocus: (event) => {
      const input = event.currentTarget;
      if (attached.current?.input === input) return;
      detach();
      const listener = listenerFor(input, specRef, enabledRef);
      input.addEventListener('beforeinput', listener);
      attached.current = { input, listener };
    },
    onChange: (event) => {
      if ((event.nativeEvent as InputEvent).isComposing) return;
      const input = event.currentTarget;
      const next = normalized(input, spec);
      if (next.value === input.value) return;
      // The instance setter keeps React's tracker in step; no event follows.
      input.value = next.value;
      input.setSelectionRange(next.selectionStart, next.selectionEnd);
    },
    onCompositionEnd: (event) => {
      const input = event.currentTarget;
      write(input, normalized(input, spec), 'insertCompositionText');
    },
    inputMode: 'numeric',
    autoComplete: 'off',
    placeholder: spec.placeholder,
    pattern: spec.pattern,
  };
}
