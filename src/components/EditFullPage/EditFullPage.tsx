'use client';
import { Button, ButtonSet, InlineLoading } from '@carbon/react';
import { useEffect, useId } from 'react';
import type { ReactNode, RefObject } from 'react';
import { resolveMessages } from '../../messages.js';
import { DiscardDialog, FlowError, FlowForm } from '../FlowParts/FlowParts.js';
import { defaultCreateEditFlowMessages } from '../FlowParts/messages.js';
import type { CreateEditFlowMessages } from '../FlowParts/messages.js';
import { isCloseEscape, useFlow } from '../FlowParts/useFlow.js';

export interface EditFullPageMessages extends CreateEditFlowMessages {
  /** Primary button. */
  save: string;
}

export const defaultEditFullPageMessages: EditFullPageMessages = {
  ...defaultCreateEditFlowMessages,
  save: 'Save',
};

export interface EditFullPageProps {
  /** Leaves edit mode: after a successful submit, Discard, or Cancel on a clean form. */
  onClose: () => void;
  /** A returned promise keeps the page busy until it settles. */
  onSubmit: () => void | Promise<void>;
  title: string;
  /** Level of the title heading. Default 2. */
  headingLevel?: 2 | 3;
  description?: ReactNode;
  submitDisabled?: boolean;
  isDirty?: boolean;
  /** Ask before discarding a dirty form. Default true. */
  confirmDiscard?: boolean;
  /** Ask the browser to confirm leaving the page while dirty. Default true. */
  warnOnLeave?: boolean;
  /** Focus target after leaving edit mode, for example the Edit button. */
  launcherRef?: RefObject<HTMLElement | null>;
  messages?: Partial<EditFullPageMessages>;
  children?: ReactNode;
  className?: string;
}

/** A page-level edit form with a sticky Cancel and Save bar. */
export function EditFullPage({
  onClose,
  onSubmit,
  title,
  headingLevel = 2,
  description,
  submitDisabled = false,
  isDirty = false,
  confirmDiscard = true,
  warnOnLeave = true,
  launcherRef,
  messages,
  children,
  className,
}: EditFullPageProps) {
  const text = resolveMessages(defaultEditFullPageMessages, messages);
  const id = useId();
  const flow = useFlow<HTMLFormElement>({
    open: true,
    onClose: () => {
      onClose();
      // The app usually unmounts the page; focus the launcher once it is back.
      setTimeout(() => launcherRef?.current?.focus());
    },
    isDirty,
    confirmDiscard,
    messages: { error: text.submitError, errorText: text.errorText },
  });
  const submit = async () => {
    if (await flow.run(onSubmit)) flow.close();
  };

  // Only while dirty; the browser shows its own text, which cannot be set.
  useEffect(() => {
    if (!warnOnLeave || !isDirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [warnOnLeave, isDirty]);

  const Heading = headingLevel === 3 ? 'h3' : 'h2';

  return (
    <>
      {/* The form container, so Escape from Cancel and Save counts too. */}
      <div
        className="afframe-edit-full-page-root"
        onKeyDown={(event) => {
          if (isCloseEscape(event)) flow.requestClose();
        }}>
        <FlowForm
          flow={flow}
          onSubmit={() => void submit()}
          submitDisabled={submitDisabled}
          aria-labelledby={`${id}-title`}
          className={['afframe-edit-full-page', className]
            .filter(Boolean)
            .join(' ')}>
          <div className="afframe-edit-full-page-body">
            <Heading
              id={`${id}-title`}
              className="afframe-edit-full-page-title">
              {title}
            </Heading>
            {description && (
              <p className="afframe-edit-full-page-description">
                {description}
              </p>
            )}
            {children}
            <FlowError
              error={flow.error}
              iconDescription={text.errorIconDescription}
            />
          </div>
          <ButtonSet className="afframe-edit-full-page-actions">
            <Button
              kind="secondary"
              disabled={flow.pending}
              onClick={flow.requestClose}>
              {text.cancel}
            </Button>
            <Button
              kind="primary"
              type="submit"
              disabled={submitDisabled || flow.pending}>
              {flow.pending ? (
                <InlineLoading
                  description={text.submitting}
                  iconDescription={text.submitting}
                />
              ) : (
                text.save
              )}
            </Button>
          </ButtonSet>
        </FlowForm>
      </div>
      <DiscardDialog flow={flow} messages={text} />
    </>
  );
}
