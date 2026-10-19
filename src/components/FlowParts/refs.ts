'use client';
// Ref helpers for the dialog roots and the header actions (React 19 passes `ref` as a plain prop).
// Carbon's useMergedRefs is not public.
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { Ref, RefCallback, RefObject } from 'react';

/** Sets one ref to `node`; returns what undoes it. */
function assignRef<T>(ref: Ref<T> | undefined, node: T): () => void {
  if (typeof ref === 'function') {
    const cleanup = ref(node);
    return typeof cleanup === 'function' ? cleanup : () => ref(null);
  }
  if (ref) {
    ref.current = node;
    return () => {
      ref.current = null;
    };
  }
  return () => undefined;
}

/** One callback ref for several refs; stable while the refs are. */
export function useMergedRefs<T>(
  ...refs: (Ref<T> | undefined)[]
): RefCallback<T> {
  return useMemo(
    () => (node: T) => {
      const cleanups = refs.map((ref) => assignRef(ref, node));
      return () => cleanups.forEach((cleanup) => cleanup());
    },
    refs
  );
}

/**
 * An object ref that also sets `ref`. For components that read their ref as
 * an object (IBM SidePanel's focus trap and exit animation), so a consumer
 * callback ref cannot replace it. Created once: IBM lists it in effect deps.
 */
export function useObjectRef<T>(ref: Ref<T> | undefined): RefObject<T | null> {
  const latest = useRef(ref);
  // Set during render: IBM's node attaches before this component's effects run.
  latest.current = ref;
  const [state] = useState(() => {
    let value: T | null = null;
    let bound: Ref<T> | undefined;
    let undo: (() => void) | undefined;
    const bind = () => {
      undo?.();
      bound = latest.current;
      undo = value === null ? undefined : assignRef(bound, value);
    };
    return {
      object: {
        get current() {
          return value;
        },
        set current(node: T | null) {
          value = node;
          bind();
        },
      },
      rebind: () => {
        if (value !== null && bound !== latest.current) bind();
      },
    };
  });
  useLayoutEffect(state.rebind, [ref, state]);
  return state.object;
}

/**
 * Attributes Carbon's Modal and ComposedModal set on their root after the
 * rest props, and `aria-label`, which they put on the inner dialog instead.
 */
export type ModalRootAttribute =
  'children' | 'aria-label' | 'role' | 'onKeyDown' | 'onBlur' | 'aria-hidden';
