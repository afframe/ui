'use client';
// Afframe RemoveModal: confirms a delete or remove action (Carbon "Delete and
// remove" pattern). Written for Afframe; IBM's deprecated RemoveModal was a
// behaviour reference only.
import { Modal, TextInput, usePrefix } from '@carbon/react';
import { useEffect, useId, useRef, useState } from 'react';
import type { HTMLAttributes, ReactNode, Ref, RefObject } from 'react';
import { resolveMessages } from '../../messages.js';
import { FlowDescription, FlowError } from '../FlowParts/FlowParts.js';
import { defaultTaskModalMessages } from '../FlowParts/messages.js';
import type { FlowMessages } from '../FlowParts/messages.js';
import { useMergedRefs } from '../FlowParts/refs.js';
import type { ModalRootAttribute } from '../FlowParts/refs.js';
import { useFlow } from '../FlowParts/useFlow.js';

export type RemoveModalKind = 'delete' | 'remove';

export interface RemoveModalMessages extends FlowMessages {
  /** Danger button text. */
  confirm: (kind: RemoveModalKind) => string;
  /** Label of the typed confirmation field; the phrase in it renders bold. */
  typeToConfirm: (phrase: string) => string;
  /** Shown under the field when the typed text does not match. */
  mismatch: string;
  /** Screen reader description of the danger button. */
  dangerDescription: string;
}

export const defaultRemoveModalMessages: RemoveModalMessages = {
  ...defaultTaskModalMessages,
  confirm: (kind) => (kind === 'delete' ? 'Delete' : 'Remove'),
  typeToConfirm: (phrase) => `Type "${phrase}" to confirm`,
  mismatch: 'The text does not match.',
  dangerDescription: 'Danger',
};

interface RemoveModalOwnProps {
  open: boolean;
  onClose: () => void;
  /** Focus target on close; default the element focused before opening. */
  launcherRef?: RefObject<HTMLElement | null>;
  messages?: Partial<RemoveModalMessages>;
  className?: string;
  /** Runs the action; a rejected promise keeps the dialog open with an alert. */
  onConfirm: () => void | Promise<void>;
  /** Picks the danger button text. Default `delete`. */
  kind?: RemoveModalKind;
  /** Modal heading. */
  title: string;
  /** Small text above the title. */
  label?: ReactNode;
  /**
   * What happens to the resource; a string renders as a paragraph, with
   * `resourceName` in it bold and in quotes.
   */
  description: ReactNode;
}

/** `resourceName` is required only when the user types it to confirm. */
type RemoveModalConfirmProps =
  | {
      /** The user types `resourceName` to confirm. */
      confirmByTyping: true;
      /** Name of the thing being deleted or removed. */
      resourceName: string;
    }
  | {
      /** A string: the user types that phrase to confirm. */
      confirmByTyping?: false | string;
      /** Name of the thing being deleted or removed. */
      resourceName?: string;
    };

/** The rest go to Carbon Modal's root `div`. */
interface RemoveModalBaseProps
  extends
    RemoveModalOwnProps,
    Omit<
      HTMLAttributes<HTMLDivElement>,
      | keyof RemoveModalOwnProps
      | 'confirmByTyping'
      | 'resourceName'
      | ModalRootAttribute
    > {
  /** Carbon Modal's root `div`; null while closed. */
  ref?: Ref<HTMLDivElement> | undefined;
  // Carbon types it without `undefined`.
  id?: string;
}

export type RemoveModalProps = RemoveModalBaseProps & RemoveModalConfirmProps;

const isQuoted = (before: string, after: string) =>
  /["“„«‘‚']$/.test(before) && /^["”“»’‘']/.test(after);
const isWord = (before: string, after: string) =>
  !/[\p{L}\p{N}_]$/u.test(before) && !/^[\p{L}\p{N}_]/u.test(after);

// The name is bold so the user sees what to type; the quotes stay outside the
// bold text so they do not read as part of it. A quoted occurrence wins, then
// a whole word: "Type" in `Type "Type" to confirm`, "pro" not in "project".
// No such occurrence: no bold.
function emphasize(text: string, name: string | undefined): ReactNode {
  if (!name) return text;
  const occurrences: number[] = [];
  for (let at = text.indexOf(name); at >= 0; at = text.indexOf(name, at + 1))
    occurrences.push(at);
  const split = (at: number) =>
    [text.slice(0, at), text.slice(at + name.length)] as const;
  const at =
    occurrences.find((index) => isQuoted(...split(index))) ??
    occurrences.find((index) => isWord(...split(index)));
  if (at === undefined) return text;
  const [before, after] = split(at);
  const quote = isQuoted(before, after) ? '' : '"';
  return (
    <>
      {before}
      {quote}
      <strong>{name}</strong>
      {quote}
      {after}
    </>
  );
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
  label,
  description,
  confirmByTyping = false,
  ref,
  ...rest
}: RemoveModalProps) {
  const text = resolveMessages(defaultRemoveModalMessages, messages);
  const prefix = usePrefix();
  const inputId = useId();
  const modalRef = useRef<HTMLDivElement>(null);
  const rootRef = useMergedRefs(modalRef, ref);
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

  const dialog = useFlow({
    open,
    onClose,
    launcherRef,
    messages: { error: text.error, errorText: text.errorText },
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
    if (await dialog.run(onConfirm)) dialog.close();
  };

  return (
    <Modal
      {...rest}
      ref={rootRef}
      open={open}
      size="sm"
      danger
      alert
      preventCloseOnClickOutside
      className={['afframe-remove-modal', className].filter(Boolean).join(' ')}
      modalHeading={title}
      {...(label ? { modalLabel: label } : {})}
      primaryButtonText={text.confirm(kind)}
      secondaryButtonText={text.cancel}
      primaryButtonDisabled={!matches}
      dangerDescription={text.dangerDescription}
      closeButtonLabel={text.closeIconDescription}
      loadingStatus={dialog.pending ? 'active' : 'inactive'}
      loadingDescription={text.pending}
      loadingIconDescription={text.pending}
      onRequestClose={dialog.requestClose}
      onRequestSubmit={() => void confirm()}>
      <div
        ref={dialog.containerRef}
        tabIndex={-1}
        className="afframe-modal-body">
        <FlowDescription
          description={
            typeof description === 'string' && description !== '' ? (
              <p>{emphasize(description, resourceName)}</p>
            ) : (
              description
            )
          }
        />
        {phrase !== undefined && (
          <TextInput
            ref={inputRef}
            id={inputId}
            labelText={emphasize(text.typeToConfirm(phrase), phrase)}
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
        <FlowError
          error={dialog.error}
          iconDescription={text.errorIconDescription}
        />
      </div>
    </Modal>
  );
}
