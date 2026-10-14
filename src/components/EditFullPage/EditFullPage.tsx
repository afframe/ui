'use client';
import { Button, ButtonSet } from '@carbon/react';
import { useEffect, useId } from 'react';
import type { FormHTMLAttributes, ReactNode, Ref, RefObject } from 'react';
import { resolveMessages } from '../../messages.js';
import {
  DiscardDialog,
  FlowButtonLabel,
  FlowDescription,
  FlowError,
  FlowForm,
  FlowStatus,
} from '../FlowParts/FlowParts.js';
import type { FlowFormOwnAttribute } from '../FlowParts/FlowParts.js';
import { defaultFormFlowMessages } from '../FlowParts/messages.js';
import type { DiscardMessages, FlowMessages } from '../FlowParts/messages.js';
import { isCloseEscape, useFlow } from '../FlowParts/useFlow.js';

export interface EditFullPageMessages extends FlowMessages, DiscardMessages {
  /** Primary button. */
  save: string;
}

export const defaultEditFullPageMessages: EditFullPageMessages = {
  ...defaultFormFlowMessages,
  save: 'Save',
};

interface EditFullPageOwnProps {
  /** Leaves edit mode: after a successful submit, Discard, or Cancel on a clean form. */
  onClose: () => void;
  /** A returned promise keeps the page busy until it settles. */
  onSubmit: () => void | Promise<void>;
  /** Page heading; also names the form. */
  title: string;
  /** Level of the title heading. Default 2. */
  headingLevel?: 2 | 3;
  /** Small text above the title. */
  label?: ReactNode;
  /** Text under the title. */
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

/** The rest go to the `form`. */
export interface EditFullPageProps
  extends
    EditFullPageOwnProps,
    Omit<
      FormHTMLAttributes<HTMLFormElement>,
      keyof EditFullPageOwnProps | FlowFormOwnAttribute | 'aria-labelledby'
    > {
  /** The `form`. */
  ref?: Ref<HTMLFormElement> | undefined;
}

/** A page-level edit form with a sticky Cancel and Save bar. */
export function EditFullPage({
  onClose,
  onSubmit,
  title,
  headingLevel = 2,
  label,
  description,
  submitDisabled = false,
  isDirty = false,
  confirmDiscard = true,
  warnOnLeave = true,
  launcherRef,
  messages,
  children,
  className,
  ...rest
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
    closeWhilePending: true,
    messages: { error: text.error, errorText: text.errorText },
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
          {...rest}
          flow={flow}
          onSubmit={() => void submit()}
          submitDisabled={submitDisabled}
          aria-labelledby={`${id}-title`}
          className={['afframe-edit-full-page', className]
            .filter(Boolean)
            .join(' ')}>
          <div className="afframe-edit-full-page-body">
            {label && <p className="afframe-edit-full-page-label">{label}</p>}
            <Heading
              id={`${id}-title`}
              className="afframe-edit-full-page-title">
              {title}
            </Heading>
            <FlowDescription
              description={description}
              className="afframe-edit-full-page-description"
            />
            {children}
            <FlowError
              error={flow.error}
              iconDescription={text.errorIconDescription}
            />
          </div>
          <ButtonSet className="afframe-edit-full-page-actions">
            <Button kind="secondary" onClick={flow.requestClose}>
              {text.cancel}
            </Button>
            <Button
              kind="primary"
              type="submit"
              disabled={submitDisabled || flow.pending}>
              <FlowButtonLabel label={text.save} busy={flow.pending} />
            </Button>
          </ButtonSet>
        </FlowForm>
        {/* Outside the form: its aria-busy may hold back announcements. */}
        <FlowStatus message={flow.pending ? text.pending : ''} />
      </div>
      <DiscardDialog flow={flow} messages={text} />
    </>
  );
}
