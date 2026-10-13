'use client';
// The engine behind the nine Afframe dialogs and flows: an action with busy
// and error state, close requests, dirty-state discard confirmation, initial
// focus, error focus and focus return. Not exported.
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import type { KeyboardEvent, RefObject } from 'react';

export interface FlowOptions {
  open: boolean;
  onClose: () => void;
  /** Focus target on close; else the element focused before opening. */
  launcherRef?: RefObject<HTMLElement | null> | undefined;
  /** Alert text of a rejected action; `errorText` builds it from the reason instead. */
  messages: {
    error: string;
    errorText?: ((reason: unknown) => string) | undefined;
  };
  isDirty?: boolean;
  /** Ask before discarding a dirty surface. Default true. */
  confirmDiscard?: boolean;
  /** Focus target on open; default the first form control in `containerRef`. */
  initialFocus?: () => HTMLElement | null | undefined;
}

export interface Flow<T extends HTMLElement = HTMLElement> {
  /**
   * The form or dialog body: initial focus, focus while pending, error
   * focus. Give it tabIndex -1 so it can hold focus while pending.
   */
  containerRef: RefObject<T | null>;
  /** True while an action runs: buttons are disabled and closing waits. */
  pending: boolean;
  /** Text of the error alert after a rejected action, else null. */
  error: string | null;
  /** Runs an action; resolves true when it succeeded in the same session. */
  run: (action: () => unknown) => Promise<boolean>;
  /** What Escape, the close icon, Cancel and an overlay click call. */
  requestClose: () => void;
  /** Calls `onClose` at once. */
  close: () => void;
  clearError: () => void;
  discardOpen: boolean;
  confirmDiscard: () => void;
  keepEditing: () => void;
  /** Last focused element in the form, set by FlowForm. */
  lastFocusRef: RefObject<HTMLElement | null>;
}

/** The first enabled form control; the default primary focus target. */
export const firstControlSelector =
  'input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled])';

const errorSelector = '[data-afframe-flow-error]';

const focusable = (element: Element | null): element is HTMLElement =>
  element instanceof HTMLElement && element.isConnected;

/**
 * Focuses `target` once it can take focus: a closing native dialog keeps the
 * page inert until its exit animation ends, and a reopened parent dialog
 * (EditTearsheet) drops focus to the body. Keeps restoring while focus sits
 * on the body, for 1.5 s; stops as soon as focus is elsewhere.
 */
function focusWhenPossible(target: HTMLElement): () => void {
  const until = performance.now() + 1500;
  let landed = false;
  let frame = 0;
  // A click anywhere means the user has moved on.
  const stop = () => {
    clearTimeout(timer);
    cancelAnimationFrame(frame);
    document.removeEventListener('pointerdown', stop, true);
  };
  const attempt = () => {
    if (!target.isConnected) return stop();
    const active = document.activeElement;
    // After landing, only a drop to the body is undone; anything else is the
    // user moving on.
    if (landed && active !== target && active !== document.body) return stop();
    if (active !== target) target.focus();
    landed ||= document.activeElement === target;
    if (performance.now() < until) frame = requestAnimationFrame(attempt);
    else stop();
  };
  document.addEventListener('pointerdown', stop, true);
  const timer = setTimeout(attempt);
  return stop;
}

// fallow-ignore-next-line complexity -- one engine for nine surfaces; each branch is a documented focus or close rule
export function useFlow<T extends HTMLElement = HTMLDivElement>({
  open,
  onClose,
  launcherRef,
  messages,
  isDirty = false,
  confirmDiscard = true,
  initialFocus,
}: FlowOptions): Flow<T> {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCount, setErrorCount] = useState(0);
  const [discardOpen, setDiscardOpen] = useState(false);
  const containerRef = useRef<T>(null);
  // Refs, not state: IBM's SidePanel calls `onRequestClose` from a window
  // keydown listener that can hold an older render's callback, and that
  // Escape arrives before the discard dialog's own cancel event.
  const pendingRef = useRef(false);
  const discardRef = useRef(false);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const discardReturnRef = useRef<HTMLElement | null>(null);
  // Last focused element in the form: IBM's tearsheet has already dropped
  // focus to the body when its close request arrives.
  const lastFocusRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);
  // Bumped on every open, close and unmount: the result of an action started
  // in an earlier session is dropped.
  const sessionRef = useRef(0);
  const discardTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  const cancelFocusRef = useRef<(() => void) | null>(null);
  // Read after an await or in a later effect: the render that started it may
  // be stale.
  const onCloseRef = useRef(onClose);
  const messagesRef = useRef(messages);
  const initialFocusRef = useRef(initialFocus);
  useLayoutEffect(() => {
    onCloseRef.current = onClose;
    messagesRef.current = messages;
    initialFocusRef.current = initialFocus;
  });

  // Layout effect: runs before the surface's own effects move focus inside.
  // fallow-ignore-next-line complexity -- open and close resets with the focus return rule
  useLayoutEffect(() => {
    if (open === wasOpenRef.current) return;
    wasOpenRef.current = open;
    sessionRef.current += 1;
    // A parent-driven close or a reopen leaves no discard dialog, busy state
    // or error.
    clearTimeout(discardTimerRef.current);
    discardRef.current = false;
    pendingRef.current = false;
    setDiscardOpen(false);
    setPending(false);
    setError(null);
    cancelFocusRef.current?.();
    cancelFocusRef.current = null;
    if (open) {
      const active = document.activeElement;
      returnFocusRef.current =
        focusable(active) && active !== document.body ? active : null;
      return;
    }
    const launcher = launcherRef?.current ?? null;
    const remembered = returnFocusRef.current;
    returnFocusRef.current = null;
    const target = focusable(launcher)
      ? launcher
      : focusable(remembered)
        ? remembered
        : null;
    // Retried: a native dialog restores focus on close itself, later.
    if (target) cancelFocusRef.current = focusWhenPossible(target);
    else if (document.activeElement instanceof HTMLElement)
      document.activeElement.blur();
  }, [open, launcherRef]);

  useEffect(
    () => () => {
      sessionRef.current += 1;
      cancelFocusRef.current?.();
    },
    []
  );

  // The native dialog focuses its first control (the close icon); move focus
  // to the surface's target, after Carbon's and IBM's own effects ran.
  useEffect(() => {
    if (!open) return;
    const focus = () => {
      const target =
        initialFocusRef.current?.() ??
        containerRef.current?.querySelector(firstControlSelector) ??
        null;
      if (focusable(target) && document.activeElement !== target)
        target.focus();
    };
    focus();
    // Again after the browser's own dialog focus, unless the user has
    // already moved into the content.
    const frame = requestAnimationFrame(() => {
      if (!containerRef.current?.contains(document.activeElement)) focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [open]);

  // A disabled button loses focus; park it on the container while pending.
  useEffect(() => {
    if (!pending) return;
    const active = document.activeElement;
    if (
      !active ||
      active === document.body ||
      (active instanceof HTMLButtonElement && active.disabled)
    )
      containerRef.current?.focus();
  }, [pending]);

  // After a rejected action: the first invalid field, else the alert.
  useEffect(() => {
    if (errorCount === 0) return;
    const container = containerRef.current;
    const target =
      container?.querySelector('[aria-invalid="true"]') ??
      container?.querySelector(errorSelector) ??
      null;
    if (focusable(target)) target.focus();
  }, [errorCount]);

  const close = useCallback(() => {
    setError(null);
    onCloseRef.current();
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const requestClose = useCallback(() => {
    if (pendingRef.current || discardRef.current) return;
    if (isDirty && confirmDiscard) {
      const active = document.activeElement;
      discardReturnRef.current =
        focusable(active) && active !== document.body
          ? active
          : lastFocusRef.current;
      discardRef.current = true;
      // Next task: opened inside an Escape keydown, the new dialog would get
      // that same key's cancel event and close at once.
      discardTimerRef.current = setTimeout(() => setDiscardOpen(true));
      return;
    }
    close();
  }, [isDirty, confirmDiscard, close]);

  const run = useCallback(async (action: () => unknown) => {
    if (pendingRef.current) return false;
    const session = sessionRef.current;
    const current = () => session === sessionRef.current;
    setError(null);
    try {
      const result = action();
      // Any thenable, not only a native Promise; a sync result never shows
      // as pending.
      if (
        typeof (result as PromiseLike<unknown> | undefined)?.then === 'function'
      ) {
        pendingRef.current = true;
        setPending(true);
        await result;
      }
    } catch (reason) {
      if (!current()) return false;
      pendingRef.current = false;
      setPending(false);
      const { error: text, errorText } = messagesRef.current;
      setError(errorText?.(reason) ?? text);
      setErrorCount((count) => count + 1);
      return false;
    }
    if (!current()) return false;
    pendingRef.current = false;
    setPending(false);
    return true;
  }, []);

  const confirm = useCallback(() => {
    discardRef.current = false;
    setDiscardOpen(false);
    close();
  }, [close]);

  const keepEditing = useCallback(() => {
    // Cleared a task later: Chromium groups a dialog opened without user
    // activation with the one under it, so the same Escape also cancels the
    // parent surface, which must not reopen this dialog.
    setTimeout(() => {
      discardRef.current = false;
    });
    setDiscardOpen(false);
    const target = discardReturnRef.current;
    discardReturnRef.current = null;
    cancelFocusRef.current?.();
    cancelFocusRef.current = focusable(target)
      ? focusWhenPossible(target)
      : null;
  }, []);

  return {
    containerRef,
    pending,
    error,
    run,
    requestClose,
    close,
    clearError,
    discardOpen: open && discardOpen,
    confirmDiscard: confirm,
    keepEditing,
    lastFocusRef,
  };
}

/**
 * An Escape that should close the surface: not already handled (a field or
 * Carbon control called preventDefault) and not from inside an expanded
 * control or an open listbox or menu, which Escape closes first.
 */
export function isCloseEscape(event: KeyboardEvent<HTMLElement>): boolean {
  if (event.key !== 'Escape' || event.defaultPrevented) return false;
  const target = event.target;
  return !(
    target instanceof Element &&
    target.closest('[aria-expanded="true"], [role="listbox"], [role="menu"]')
  );
}
