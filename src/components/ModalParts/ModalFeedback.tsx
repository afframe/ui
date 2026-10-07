'use client';
// The error alert and the polite live region every Afframe modal renders
// inside its content (outside a modal dialog nothing is announced).
import { InlineNotification, usePrefix } from '@carbon/react';

export function ModalError({
  show,
  title,
  iconDescription,
}: {
  show: boolean;
  title: string;
  iconDescription: string;
}) {
  if (!show) return null;
  return (
    <InlineNotification
      className="afframe-modal-error"
      kind="error"
      role="alert"
      lowContrast
      hideCloseButton
      title={title}
      statusIconDescription={iconDescription}
    />
  );
}

/** Mounted empty with the dialog; its text changes are announced politely. */
export function ModalStatus({
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
        visible ? 'afframe-modal-status' : `${prefix}--visually-hidden`
      }>
      {message}
    </p>
  );
}
