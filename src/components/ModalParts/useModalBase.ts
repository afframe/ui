'use client';
// Behaviour shared by the Afframe modals: async actions with pending and
// failed state, close requests that wait for a running action, focus on open,
// focus during and after an action, and focus return on close.
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { RefObject } from 'react';

export interface ModalBaseOptions {
  open: boolean;
  onClose: () => void;
  launcherRef?: RefObject<HTMLElement | null> | undefined;
  /** Returns the element that takes focus when the dialog opens. */
  initialFocus: () => HTMLElement | null | undefined;
}

export interface ModalBase {
  /** True while an action runs: buttons are disabled and closing waits. */
  pending: boolean;
  /** True after the last action rejected, until the next one starts. */
  failed: boolean;
  /** Runs an action; resolves true when it succeeded and the dialog did not close or reopen meanwhile. */
  run: (action: () => void | Promise<void>) => Promise<boolean>;
  /** Clears the failed state. */
  clearFailure: () => void;
  /** Calls `onClose` unless an action is running. */
  requestClose: () => void;
  /** Ref for the dialog content wrapper (`tabIndex={-1}`); focus parks here while pending. */
  bodyRef: RefObject<HTMLDivElement | null>;
  /** Pass to Carbon's `launcherButtonRef`: the launcher, else the element focused before opening. */
  returnFocusRef: RefObject<HTMLElement | null>;
}

const isDisabled = (element: Element) =>
  element instanceof HTMLButtonElement && element.disabled;

export function useModalBase({
  open,
  onClose,
  launcherRef,
  initialFocus,
}: ModalBaseOptions): ModalBase {
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const mounted = useRef(true);
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const focusedBeforeOpen = useRef<HTMLElement | null>(null);
  const focusedBeforeAction = useRef<HTMLElement | null>(null);
  const initialFocusRef = useRef(initialFocus);
  initialFocusRef.current = initialFocus;

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  // Layout effect: runs before Carbon moves focus into the dialog.
  // Bumped on every open and close: results of an action started in an
  // earlier generation are dropped.
  const generation = useRef(0);
  useLayoutEffect(() => {
    generation.current += 1;
    setPending(false);
    setFailed(false);
    if (!open) return;
    const active = document.activeElement;
    focusedBeforeOpen.current =
      active instanceof HTMLElement && active !== document.body ? active : null;
  }, [open]);

  // The native dialog focuses its first control (the close icon); move focus
  // to the element the dialog names, after Carbon's own effects ran.
  useEffect(() => {
    if (!open) return;
    const focus = () => {
      const target = initialFocusRef.current();
      if (target && document.activeElement !== target) target.focus();
    };
    focus();
    // Second try after the browser's own dialog focus, unless the user has
    // already moved into the content.
    const frame = requestAnimationFrame(() => {
      if (!bodyRef.current?.contains(document.activeElement)) focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);

  // A disabled button loses focus; park it on the content while pending.
  useEffect(() => {
    if (!pending) return;
    const active = document.activeElement;
    if (!active || active === document.body || isDisabled(active)) {
      bodyRef.current?.focus();
    }
  }, [pending]);

  // After a failure, return focus to the control that started the action.
  useEffect(() => {
    if (!failed) return;
    const previous = focusedBeforeAction.current;
    if (previous?.isConnected && !isDisabled(previous)) previous.focus();
  }, [failed]);

  const run = useCallback(async (action: () => void | Promise<void>) => {
    const active = document.activeElement;
    focusedBeforeAction.current = active instanceof HTMLElement ? active : null;
    const started = generation.current;
    const current = () => mounted.current && generation.current === started;
    setFailed(false);
    setPending(true);
    try {
      await action();
      if (!current()) return false;
      setPending(false);
      return true;
    } catch {
      if (current()) {
        setPending(false);
        setFailed(true);
      }
      return false;
    }
  }, []);

  const clearFailure = useCallback(() => setFailed(false), []);

  const requestClose = useCallback(() => {
    if (!pending) onClose();
  }, [pending, onClose]);

  // Read at close time: the launcher if it is still in the document, else the
  // element focused before the dialog opened, else nothing (the browser
  // default, the document body).
  const returnFocusRef = useMemo(
    () =>
      ({
        get current() {
          const launcher = launcherRef?.current;
          if (launcher?.isConnected) return launcher;
          const before = focusedBeforeOpen.current;
          return before?.isConnected ? before : null;
        },
      }) as RefObject<HTMLElement | null>,
    [launcherRef]
  );

  return {
    pending,
    failed,
    run,
    clearFailure,
    requestClose,
    bodyRef,
    returnFocusRef,
  };
}
