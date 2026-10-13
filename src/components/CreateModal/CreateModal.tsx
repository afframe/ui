'use client';
import { Modal } from '@carbon/react';
import type { ReactNode, RefObject } from 'react';
import { resolveMessages } from '../../messages.js';
import { DiscardDialog, FlowError, FlowForm } from '../FlowParts/FlowParts.js';
import { defaultCreateEditFlowMessages } from '../FlowParts/messages.js';
import type { CreateEditFlowMessages } from '../FlowParts/messages.js';
import { useFlow } from '../FlowParts/useFlow.js';

export interface CreateModalMessages extends CreateEditFlowMessages {
  /** Primary button. */
  create: string;
}

export const defaultCreateModalMessages: CreateModalMessages = {
  ...defaultCreateEditFlowMessages,
  submitting: 'Creating',
  create: 'Create',
};

export interface CreateModalProps {
  open: boolean;
  /** Called after a successful submit, Discard, or a close of a clean form. */
  onClose: () => void;
  /** A returned promise keeps the modal busy until it settles. */
  onSubmit: () => void | Promise<void>;
  title: string;
  subtitle?: ReactNode;
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

/** A small create form in a Carbon modal. Controlled by `open`. */
export function CreateModal({
  open,
  onClose,
  onSubmit,
  title,
  subtitle,
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
}: CreateModalProps) {
  const text = resolveMessages(defaultCreateModalMessages, messages);
  const flow = useFlow<HTMLFormElement>({
    open,
    onClose,
    isDirty,
    confirmDiscard,
    launcherRef,
    messages: { error: text.submitError, errorText: text.errorText },
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
        open={open}
        size={size}
        className={['afframe-create-modal', className]
          .filter(Boolean)
          .join(' ')}
        modalHeading={title}
        primaryButtonText={text.create}
        secondaryButtonText={text.cancel}
        closeButtonLabel={text.closeIconDescription}
        primaryButtonDisabled={submitDisabled}
        loadingStatus={flow.pending ? 'active' : 'inactive'}
        loadingDescription={text.submitting}
        loadingIconDescription={text.submitting}
        onRequestClose={flow.requestClose}
        onRequestSubmit={() => {
          if (!submitDisabled && !flow.pending) void submit();
        }}>
        {subtitle && (
          <p className="afframe-create-modal-subtitle">{subtitle}</p>
        )}
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
