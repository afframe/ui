'use client';
import { Modal } from '@carbon/react';
import type { HTMLAttributes, ReactNode, Ref, RefObject } from 'react';
import { resolveMessages } from '../../messages.js';
import { DiscardDialog, FlowError, FlowForm } from '../FlowParts/FlowParts.js';
import { defaultFormFlowMessages } from '../FlowParts/messages.js';
import type { DiscardMessages, FlowMessages } from '../FlowParts/messages.js';
import { useFlow } from '../FlowParts/useFlow.js';
import type { ModalRootAttribute } from '../FlowParts/refs.js';

export interface CreateModalMessages extends FlowMessages, DiscardMessages {
  /** Primary button. */
  create: string;
}

export const defaultCreateModalMessages: CreateModalMessages = {
  ...defaultFormFlowMessages,
  pending: 'Creating',
  create: 'Create',
};

interface CreateModalOwnProps {
  open: boolean;
  /** Called after a successful submit, Discard, or a close of a clean form. */
  onClose: () => void;
  /** A returned promise keeps the modal busy until it settles. */
  onSubmit: () => void | Promise<void>;
  /** Modal heading; also names the form. */
  title: string;
  /** Small text above the title. */
  label?: ReactNode;
  /** Text above the form. */
  description?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /** Element focused on open; defaults to `[data-modal-primary-focus]`, else the first form control. */
  selectorPrimaryFocus?: string;
  submitDisabled?: boolean;
  isDirty?: boolean;
  /** Ask before discarding a dirty form. Default true. */
  confirmDiscard?: boolean;
  /** Focus target on close; default the element focused before opening. */
  launcherRef?: RefObject<HTMLElement | null>;
  messages?: Partial<CreateModalMessages>;
  children?: ReactNode;
  className?: string;
}

/** The rest go to Carbon Modal's root `div`. */
export interface CreateModalProps
  extends
    CreateModalOwnProps,
    Omit<
      HTMLAttributes<HTMLDivElement>,
      keyof CreateModalOwnProps | ModalRootAttribute
    > {
  /** Carbon Modal's root `div`; null while closed. */
  ref?: Ref<HTMLDivElement> | undefined;
  // Carbon types it without `undefined`.
  id?: string;
}

/** A small create form in a Carbon modal. Controlled by `open`. */
export function CreateModal({
  open,
  onClose,
  onSubmit,
  title,
  label,
  description,
  size = 'md',
  selectorPrimaryFocus = '[data-modal-primary-focus]',
  submitDisabled = false,
  isDirty = false,
  confirmDiscard = true,
  launcherRef,
  messages,
  children,
  className,
  ...rest
}: CreateModalProps) {
  const text = resolveMessages(defaultCreateModalMessages, messages);
  const flow = useFlow<HTMLFormElement>({
    open,
    onClose,
    isDirty,
    confirmDiscard,
    launcherRef,
    messages: { error: text.error, errorText: text.errorText },
    initialFocus: (): HTMLElement | null | undefined =>
      flow.containerRef.current?.querySelector<HTMLElement>(
        selectorPrimaryFocus
      ),
  });
  const submit = async () => {
    if (await flow.run(onSubmit)) flow.close();
  };

  return (
    <>
      <Modal
        {...rest}
        open={open}
        size={size}
        className={['afframe-create-modal', className]
          .filter(Boolean)
          .join(' ')}
        modalHeading={title}
        {...(label ? { modalLabel: label } : {})}
        primaryButtonText={text.create}
        secondaryButtonText={text.cancel}
        closeButtonLabel={text.closeIconDescription}
        primaryButtonDisabled={submitDisabled}
        loadingStatus={flow.pending ? 'active' : 'inactive'}
        loadingDescription={text.pending}
        loadingIconDescription={text.pending}
        onRequestClose={flow.requestClose}
        onRequestSubmit={() => {
          if (!submitDisabled && !flow.pending) void submit();
        }}>
        {description && (
          <p className="afframe-create-modal-description">{description}</p>
        )}
        <FlowForm
          flow={flow}
          onSubmit={() => void submit()}
          submitDisabled={submitDisabled}
          aria-label={title}>
          {children}
          <FlowError
            error={flow.error}
            iconDescription={text.errorIconDescription}
          />
        </FlowForm>
      </Modal>
      <DiscardDialog flow={flow} messages={text} />
    </>
  );
}
