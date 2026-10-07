'use client';
// Afframe RemoveModal: confirms a delete or remove action (Carbon "Delete and
// remove" pattern). Written for Afframe; IBM's deprecated RemoveModal was a
// behaviour reference only.
import { Modal, TextInput, usePrefix } from '@carbon/react';
import { useEffect, useId, useRef, useState } from 'react';
import type { ReactNode, RefObject } from 'react';
import { resolveMessages } from '../../messages.js';
import { ModalError } from '../ModalParts/ModalFeedback.js';
import { defaultModalPartsMessages } from '../ModalParts/messages.js';
import type { ModalPartsMessages } from '../ModalParts/messages.js';
import { useModalBase } from '../ModalParts/useModalBase.js';

export type RemoveModalKind = 'delete' | 'remove';

export interface RemoveModalMessages extends ModalPartsMessages {
  /** Default heading. */
  title: (kind: RemoveModalKind, name: string) => string;
  /** Default body text. */
  body: (kind: RemoveModalKind, name: string) => string;
  /** Danger button text. */
  confirm: (kind: RemoveModalKind) => string;
  /** Label of the typed confirmation field. */
  typeToConfirm: (phrase: string) => string;
  /** Shown under the field when the typed text does not match. */
  mismatch: string;
  /** Screen reader description of the danger button. */
  dangerDescription: string;
}

export const defaultRemoveModalMessages: RemoveModalMessages = {
  ...defaultModalPartsMessages,
  title: (kind, name) => `${kind === 'delete' ? 'Delete' : 'Remove'} ${name}?`,
  body: (kind, name) =>
    kind === 'delete'
      ? `Deleting ${name} is permanent and cannot be undone.`
      : `${name} will be removed. It can be added again later.`,
  confirm: (kind) => (kind === 'delete' ? 'Delete' : 'Remove'),
  typeToConfirm: (phrase) => `Type ${phrase} to confirm`,
  mismatch: 'The text does not match.',
  dangerDescription: 'Danger',
};

export interface RemoveModalProps {
  open: boolean;
  onClose: () => void;
  /** Element that gets focus back on close (default: the element focused before opening). */
  launcherRef?: RefObject<HTMLElement | null>;
  messages?: Partial<RemoveModalMessages>;
  className?: string;
  /** Name of the thing being deleted or removed. */
  resourceName: string;
  /** Runs the action; a rejected promise keeps the dialog open with an alert. */
  onConfirm: () => void | Promise<void>;
  /** Changes the default title and button text only. Default `delete`. */
  kind?: RemoveModalKind;
  title?: string;
  body?: ReactNode;
  /** `true`: the user types `resourceName`; a string: the user types that phrase. */
  confirmByTyping?: boolean | string;
  /** Small label above the title. */
  label?: string;
}

export function RemoveModal({
  open,
  onClose,
  launcherRef,
  messages,
  className,
  resourceName,
  onConfirm,
  kind = 'delete',
  title,
  body,
  confirmByTyping = false,
  label,
}: RemoveModalProps) {
  const text = resolveMessages(defaultRemoveModalMessages, messages);
  const prefix = usePrefix();
  const inputId = useId();
  const modalRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const phrase =
    typeof confirmByTyping === 'string'
      ? confirmByTyping
      : confirmByTyping
        ? resourceName
        : undefined;
  const [typed, setTyped] = useState('');
  const [blurred, setBlurred] = useState(false);
  const [openedFor, setOpenedFor] = useState(open);
  if (openedFor !== open) {
    setOpenedFor(open);
    if (open) {
      setTyped('');
      setBlurred(false);
    }
  }

  const dialog = useModalBase({
    open,
    onClose,
    launcherRef,
    initialFocus: () =>
      phrase === undefined
        ? modalRef.current?.querySelector<HTMLElement>(
            `.${prefix}--modal-footer .${prefix}--btn--secondary`
          )
        : inputRef.current,
  });

  // An empty phrase would match without typing: keep the action disabled.
  const emptyPhrase = phrase === '';
  useEffect(() => {
    if (open && emptyPhrase) {
      console.warn(
        'RemoveModal: confirmByTyping resolved to an empty phrase; the confirm button stays disabled.'
      );
    }
  }, [open, emptyPhrase]);
  const matches = phrase === undefined || (!emptyPhrase && typed === phrase);
  const confirm = async () => {
    if (!matches || dialog.pending) return;
    if (await dialog.run(onConfirm)) onClose();
  };

  return (
    <Modal
      ref={modalRef}
      open={open}
      size="sm"
      danger
      alert
      preventCloseOnClickOutside
      className={['afframe-remove-modal', className].filter(Boolean).join(' ')}
      modalHeading={title ?? text.title(kind, resourceName)}
      {...(label === undefined ? {} : { modalLabel: label })}
      primaryButtonText={text.confirm(kind)}
      secondaryButtonText={text.cancel}
      primaryButtonDisabled={!matches}
      dangerDescription={text.dangerDescription}
      closeButtonLabel={text.closeIconDescription}
      loadingStatus={dialog.pending ? 'active' : 'inactive'}
      loadingDescription={text.pending}
      loadingIconDescription={text.pending}
      launcherButtonRef={dialog.returnFocusRef}
      onRequestClose={dialog.requestClose}
      onRequestSubmit={() => void confirm()}>
      <div ref={dialog.bodyRef} tabIndex={-1} className="afframe-modal-body">
        {body ?? <p>{text.body(kind, resourceName)}</p>}
        {phrase !== undefined && (
          <TextInput
            ref={inputRef}
            id={inputId}
            labelText={text.typeToConfirm(phrase)}
            value={typed}
            autoComplete="off"
            invalid={blurred && typed !== '' && typed !== phrase}
            invalidText={text.mismatch}
            disabled={dialog.pending}
            onChange={(event) => {
              setTyped(event.target.value);
              setBlurred(false);
            }}
            onBlur={() => setBlurred(true)}
          />
        )}
        <ModalError
          show={dialog.failed}
          title={text.genericError}
          iconDescription={text.errorIconDescription}
        />
      </div>
    </Modal>
  );
}
