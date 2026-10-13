'use client';
// The parts the nine Afframe dialogs and flows render around `useFlow`: the
// form, the error alert, the polite live region and the discard dialog.
import { InlineNotification, Modal, usePrefix } from '@carbon/react';
import { useEffect, useRef } from 'react';
import type { FormEvent, KeyboardEvent, ReactNode } from 'react';
import type { CreateEditFlowMessages } from './messages.js';
import type { Flow } from './useFlow.js';

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

export interface FlowFormProps {
  flow: Flow<HTMLFormElement>;
  /** Called on Enter in a single-line input and on a submit button. */
  onSubmit: () => void;
  submitDisabled?: boolean;
  className?: string;
  children?: ReactNode;
  'aria-labelledby'?: string;
  'aria-label'?: string;
}

/**
 * The form around a surface's fields. Enter in a single-line input submits
 * once unless `submitDisabled` or an action is pending; `aria-busy` while
 * pending.
 */
export function FlowForm({
  flow,
  onSubmit,
  submitDisabled = false,
  className,
  children,
  ...rest
}: FlowFormProps) {
  const submit = () => {
    if (!submitDisabled && !flow.pending) onSubmit();
  };
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
    submit();
  };
  return (
    <form
      {...rest}
      ref={flow.containerRef}
      noValidate
      aria-busy={flow.pending || undefined}
      className={['afframe-create-edit-form', className]
        .filter(Boolean)
        .join(' ')}
      onKeyDown={onKeyDown}
      onFocus={(event) => {
        if (event.target instanceof HTMLElement)
          flow.lastFocusRef.current = event.target;
      }}
      onSubmit={(event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        submit();
      }}>
      {children}
    </form>
  );
}

/** The error alert; focusable for error focus. Render it inside `containerRef`. */
export function FlowError({
  error,
  iconDescription,
}: {
  error: string | null;
  iconDescription: string;
}) {
  if (error === null) return null;
  return (
    <div
      data-afframe-flow-error=""
      tabIndex={-1}
      className="afframe-flow-error">
      <InlineNotification
        kind="error"
        role="alert"
        lowContrast
        hideCloseButton
        title={error}
        statusIconDescription={iconDescription}
      />
    </div>
  );
}

/** Mounted empty with the dialog; its text changes are announced politely. */
export function FlowStatus({
  message,
  visible = false,
}: {
  message: string;
  visible?: boolean;
}) {
  const prefix = usePrefix();
  return (
    <p
      role="status"
      className={
        visible ? 'afframe-flow-status' : `${prefix}--visually-hidden`
      }>
      {message}
    </p>
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
  flow: Pick<Flow, 'discardOpen' | 'keepEditing' | 'confirmDiscard'>;
  messages: Pick<
    CreateEditFlowMessages,
    | 'discardTitle'
    | 'discardBody'
    | 'discard'
    | 'keepEditing'
    | 'closeIconDescription'
  >;
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
