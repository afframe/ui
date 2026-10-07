'use client';
// Internal create and edit flow shared by CreateModal, CreateSidePanel,
// EditSidePanel, EditTearsheet and EditFullPage: submit, cancel, dirty state,
// discard confirmation, error display and focus return. Not exported.
import { InlineNotification, Modal, usePrefix } from '@carbon/react';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import type { FormEvent, KeyboardEvent, ReactNode, RefObject } from 'react';

export interface CreateEditFlowMessages {
  cancel: string;
  /** Alert text for a rejected submit, unless `errorText` is set. */
  submitError: string;
  /**
   * Alert text from the rejection reason, for apps that show details. Not
   * set by default: raw error messages may not suit users.
   */
  errorText?: (error: unknown) => string;
  /** Text next to the spinner in the primary button while submitting. */
  submitting: string;
  /** Accessible name of the error icon in the submit error notification. */
  errorIconDescription: string;
  discardTitle: string;
  discardBody: string;
  discard: string;
  keepEditing: string;
  /** Close button of the discard dialog. */
  closeIconDescription: string;
}

export const defaultCreateEditFlowMessages: CreateEditFlowMessages = {
  cancel: 'Cancel',
  submitError: 'The changes could not be saved. Try again.',
  submitting: 'Saving',
  errorIconDescription: 'Error',
  discardTitle: 'Discard changes?',
  discardBody: 'Your changes will be lost.',
  discard: 'Discard',
  keepEditing: 'Keep editing',
  closeIconDescription: 'Close',
};

export interface CreateEditFlowOptions {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void | Promise<void>;
  isDirty?: boolean;
  confirmDiscard?: boolean;
  launcherRef?: RefObject<HTMLElement | null>;
  messages: CreateEditFlowMessages;
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

/**
 * State and handlers for one create or edit surface. `requestClose` is what
 * Escape, the close icon, Cancel and an overlay click call.
 */
export function useCreateEditFlow({
  open,
  onClose,
  onSubmit,
  isDirty = false,
  confirmDiscard = true,
  launcherRef,
  messages,
}: CreateEditFlowOptions) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCount, setErrorCount] = useState(0);
  const [discardOpen, setDiscardOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  // Refs, not state: IBM's SidePanel calls `onRequestClose` from a window
  // keydown listener that can hold an older render's callback, and that
  // Escape arrives before the discard dialog's own cancel event.
  const submittingRef = useRef(false);
  const discardRef = useRef(false);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const discardReturnRef = useRef<HTMLElement | null>(null);
  // Last focused element in the form: IBM's tearsheet has already dropped
  // focus to the body when its close request arrives.
  const lastFocusRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);
  const openRef = useRef(open);
  // Bumped on every open: a submit from an earlier session never closes this one.
  const sessionRef = useRef(0);
  const discardTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );
  // Read after an await: the render that started the submit may be stale.
  const cancelFocusRef = useRef<(() => void) | null>(null);
  const onCloseRef = useRef(onClose);
  useLayoutEffect(() => {
    onCloseRef.current = onClose;
  });

  // Layout effect: runs before the surface's own effects move focus inside.
  useLayoutEffect(() => {
    openRef.current = open;
    if (open && !wasOpenRef.current) {
      sessionRef.current += 1;
      cancelFocusRef.current?.();
      const active = document.activeElement;
      returnFocusRef.current =
        focusable(active) && active !== document.body ? active : null;
    }
    if (!open && wasOpenRef.current) {
      // A parent-driven close leaves no discard dialog, busy state or error.
      clearTimeout(discardTimerRef.current);
      discardRef.current = false;
      submittingRef.current = false;
      setDiscardOpen(false);
      setSubmitting(false);
      setError(null);
      const remembered = returnFocusRef.current;
      returnFocusRef.current = null;
      // A tick later: a native dialog restores focus on close itself.
      const target = focusable(remembered)
        ? remembered
        : (launcherRef?.current ?? null);
      cancelFocusRef.current?.();
      cancelFocusRef.current = focusable(target)
        ? focusWhenPossible(target)
        : null;
      if (!focusable(target) && document.activeElement instanceof HTMLElement)
        document.activeElement.blur();
    }
    wasOpenRef.current = open;
  }, [open, launcherRef]);

  useEffect(() => () => cancelFocusRef.current?.(), []);

  // After a rejected submit: the first invalid field, else the notification.
  useEffect(() => {
    if (errorCount === 0) return;
    const form = formRef.current;
    const target =
      form?.querySelector('[aria-invalid="true"]') ??
      form?.querySelector(errorSelector) ??
      null;
    if (focusable(target)) target.focus();
  }, [errorCount]);

  const close = useCallback(() => {
    setError(null);
    onCloseRef.current();
  }, []);

  const requestClose = useCallback(() => {
    if (submittingRef.current || discardRef.current) return;
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

  const submit = useCallback(async () => {
    if (submittingRef.current) return;
    const session = sessionRef.current;
    const current = () => openRef.current && session === sessionRef.current;
    setError(null);
    try {
      const result: unknown = onSubmit();
      // Any thenable, not only a native Promise.
      if (
        typeof (result as PromiseLike<void> | undefined)?.then === 'function'
      ) {
        submittingRef.current = true;
        setSubmitting(true);
        await result;
      }
    } catch (reason) {
      if (!current()) return;
      submittingRef.current = false;
      setSubmitting(false);
      setError(messages.errorText?.(reason) ?? messages.submitError);
      setErrorCount((count) => count + 1);
      return;
    }
    if (!current()) return;
    submittingRef.current = false;
    setSubmitting(false);
    close();
  }, [onSubmit, close, messages]);

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
    requestClose,
    submit,
    submitting,
    error,
    discardOpen: open && discardOpen,
    confirmDiscard: confirm,
    keepEditing,
    formRef,
    lastFocusRef,
  };
}

export type CreateEditFlow = ReturnType<typeof useCreateEditFlow>;

const textInputTypes = new Set([
  'text',
  'email',
  'number',
  'password',
  'search',
  'tel',
  'url',
  'date',
  'time',
  'datetime-local',
  'month',
  'week',
]);

const tabbableSelector =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * A Tab stop: rendered, not inert, and for a radio group only its active
 * radio (the checked one, else the first).
 */
function isTabStop(element: HTMLElement, root: Element): boolean {
  if (element.getClientRects().length === 0 || element.closest('[inert]'))
    return false;
  if (!(element instanceof HTMLInputElement) || element.type !== 'radio')
    return true;
  if (!element.name) return true;
  const group = [
    ...root.querySelectorAll<HTMLInputElement>(
      `input[type="radio"][name="${CSS.escape(element.name)}"]`
    ),
  ];
  return element === (group.find((radio) => radio.checked) ?? group[0]);
}

/**
 * Keeps Tab inside the modal dialog the event came from: Chromium lets Tab
 * leave a native modal dialog for the browser's own controls.
 */
export function wrapTabInDialog(event: KeyboardEvent<HTMLElement>) {
  if (event.key !== 'Tab' || !(event.target instanceof Element)) return;
  const dialog = event.target.closest('dialog');
  if (!dialog) return;
  const tabbables = [
    ...dialog.querySelectorAll<HTMLElement>(tabbableSelector),
  ].filter((element) => isTabStop(element, dialog));
  const first = tabbables[0];
  const last = tabbables[tabbables.length - 1];
  if (!first || !last) return;
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
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

/** Focuses the primary focus target once the surface is open. */
export function useInitialFocus(
  open: boolean,
  containerRef: RefObject<HTMLElement | null>,
  selector?: string
) {
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      const container = containerRef.current;
      const target =
        (selector ? container?.querySelector(selector) : null) ??
        container?.querySelector(firstControlSelector) ??
        null;
      if (focusable(target)) target.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [open, containerRef, selector]);
}

export interface FlowFormProps {
  flow: CreateEditFlow;
  submitDisabled?: boolean;
  className?: string;
  children?: ReactNode;
  'aria-labelledby'?: string;
  'aria-label'?: string;
}

/**
 * The form around a surface's fields. Enter in a single-line input submits
 * once unless `submitDisabled` or a submit is pending; `aria-busy` while
 * submitting.
 */
export function FlowForm({
  flow,
  submitDisabled = false,
  className,
  children,
  ...rest
}: FlowFormProps) {
  const onKeyDown = (event: KeyboardEvent<HTMLFormElement>) => {
    const target = event.target;
    if (
      event.key !== 'Enter' ||
      event.repeat ||
      event.nativeEvent.isComposing ||
      !(target instanceof HTMLInputElement) ||
      !textInputTypes.has(target.type)
    )
      return;
    event.preventDefault();
    if (!submitDisabled && !flow.submitting) void flow.submit();
  };
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!submitDisabled && !flow.submitting) void flow.submit();
  };
  return (
    <form
      {...rest}
      ref={flow.formRef}
      noValidate
      aria-busy={flow.submitting || undefined}
      className={['afframe-create-edit-form', className]
        .filter(Boolean)
        .join(' ')}
      onKeyDown={onKeyDown}
      onFocus={(event) => {
        if (event.target instanceof HTMLElement)
          flow.lastFocusRef.current = event.target;
      }}
      onSubmit={onSubmit}>
      {children}
    </form>
  );
}

/** The submit error, an alert above the footer. Focusable for error focus. */
export function FlowError({
  error,
  messages,
}: {
  error: string | null;
  messages: CreateEditFlowMessages;
}) {
  if (error === null) return null;
  return (
    <div
      data-afframe-flow-error=""
      tabIndex={-1}
      className="afframe-create-edit-error">
      <InlineNotification
        kind="error"
        role="alert"
        lowContrast
        hideCloseButton
        title={error}
        statusIconDescription={messages.errorIconDescription}
      />
    </div>
  );
}

/**
 * "Discard changes?" over the parent surface. Render it as a sibling of the
 * surface, never inside it: keys inside it must not reach the surface's own
 * React handlers (IBM SidePanel traps Tab and closes on Escape).
 */
export function DiscardDialog({
  flow,
  messages,
}: {
  flow: CreateEditFlow;
  messages: CreateEditFlowMessages;
}) {
  const prefix = usePrefix();
  const ref = useRef<HTMLDivElement>(null);
  const { discardOpen } = flow;
  // The dialog element ignores Carbon's selectorPrimaryFocus.
  useEffect(() => {
    if (!discardOpen) return;
    const frame = requestAnimationFrame(() => {
      const keep = ref.current?.querySelector<HTMLElement>(
        `.${prefix}--modal-footer .${prefix}--btn--secondary`
      );
      keep?.focus();
    });
    return () => cancelAnimationFrame(frame);
  }, [discardOpen, prefix]);
  return (
    // Escape stays here: IBM SidePanel also listens on window.
    <div
      ref={ref}
      className="afframe-create-edit-discard"
      onKeyDown={(event) => {
        if (event.key === 'Escape') event.stopPropagation();
        wrapTabInDialog(event);
      }}>
      <Modal
        open={discardOpen}
        danger
        alert
        size="xs"
        preventCloseOnClickOutside
        modalHeading={messages.discardTitle}
        primaryButtonText={messages.discard}
        secondaryButtonText={messages.keepEditing}
        closeButtonLabel={messages.closeIconDescription}
        onRequestClose={flow.keepEditing}
        onSecondarySubmit={flow.keepEditing}
        onRequestSubmit={flow.confirmDiscard}>
        <p>{messages.discardBody}</p>
      </Modal>
    </div>
  );
}
