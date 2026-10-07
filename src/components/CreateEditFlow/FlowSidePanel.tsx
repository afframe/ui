'use client';
// Internal side panel on the shared flow, used by CreateSidePanel and
// EditSidePanel. Not exported.
import { SidePanel } from '@carbon/ibm-products';
import { InlineLoading } from '@carbon/react';
import { useId } from 'react';
import type { ComponentProps, ReactNode, RefObject } from 'react';
import {
  DiscardDialog,
  firstControlSelector,
  FlowError,
  FlowForm,
  isCloseEscape,
  useCreateEditFlow,
  useInitialFocus,
} from './CreateEditFlow.js';
import type { CreateEditFlowMessages } from './CreateEditFlow.js';

type SidePanelProps = ComponentProps<typeof SidePanel>;

export interface FlowSidePanelMessages extends CreateEditFlowMessages {
  /** Close icon of the panel. */
  closePanel: string;
}

/** Props both side panels share; the docs pages list them. */
export interface FlowSidePanelBaseProps {
  open: boolean;
  /** Called after a successful submit, Discard, or a close of a clean form. */
  onClose: () => void;
  /** A returned promise keeps the panel busy until it settles. */
  onSubmit: () => void | Promise<void>;
  /** Panel heading. */
  title: string;
  subtitle?: ReactNode;
  /** Heading of the form inside the panel; names the form. */
  formTitle: string;
  formDescription?: ReactNode;
  /** Default `md`. */
  size?: SidePanelProps['size'];
  /** Default `right`. */
  placement?: 'left' | 'right';
  /** Pushes the page content aside instead of covering it with an overlay. */
  slideIn?: boolean;
  /** CSS selector of the page content that `slideIn` pushes aside. */
  pageContentSelector?: string;
  /** An AI label or another decorator next to the close icon. */
  decorator?: ReactNode;
  submitDisabled?: boolean;
  /** Ask before discarding a dirty form. Default true. */
  confirmDiscard?: boolean;
  /** Focus target on close when the element that opened the panel is gone. */
  launcherRef?: RefObject<HTMLElement | null>;
  children?: ReactNode;
  className?: string;
}

const primaryFocusSelector = firstControlSelector
  .split(', ')
  .map((selector) => `.afframe-create-edit-form ${selector}`)
  .join(', ');

export function FlowSidePanel({
  open,
  onClose,
  onSubmit,
  title,
  subtitle,
  formTitle,
  formDescription,
  size = 'md',
  placement = 'right',
  slideIn = false,
  pageContentSelector,
  decorator,
  submitDisabled = false,
  isDirty = false,
  confirmDiscard = true,
  launcherRef,
  children,
  className,
  primaryLabel,
  text,
}: FlowSidePanelBaseProps & {
  isDirty?: boolean;
  primaryLabel: string;
  text: FlowSidePanelMessages;
}) {
  const id = useId();
  const flow = useCreateEditFlow({
    open,
    onClose,
    onSubmit,
    isDirty,
    confirmDiscard,
    ...(launcherRef ? { launcherRef } : {}),
    messages: text,
  });
  useInitialFocus(open, flow.formRef);

  const actions = [
    {
      kind: 'primary',
      // Cast kept: ActionSet types `label` as a string but renders any node
      // as the button content. Its own `loading` flag adds an InlineLoading
      // with no text and an English icon name, so the label carries ours.
      label: (flow.submitting ? (
        <InlineLoading
          description={text.submitting}
          iconDescription={text.submitting}
        />
      ) : (
        primaryLabel
      )) as unknown as string,
      disabled: submitDisabled || flow.submitting,
      onClick: () => void flow.submit(),
    },
    {
      kind: 'secondary',
      label: text.cancel,
      disabled: flow.submitting,
      onClick: flow.requestClose,
    },
  ] satisfies SidePanelProps['actions'];

  return (
    <>
      {/* IBM SidePanel ignores Escape when it slides in; handled here. */}
      <div
        className="afframe-flow-side-panel-root"
        onKeyDown={(event) => {
          if (slideIn && isCloseEscape(event)) flow.requestClose();
        }}>
        <SidePanel
          open={open}
          title={title}
          {...(subtitle ? { subtitle } : {})}
          size={size}
          placement={placement}
          includeOverlay={!slideIn}
          {...(slideIn
            ? {
                slideIn: true as const,
                selectorPageContent: pageContentSelector ?? '',
              }
            : { slideIn: false as const })}
          {...(decorator ? { decorator } : {})}
          selectorPrimaryFocus={primaryFocusSelector}
          closeIconDescription={text.closePanel}
          onRequestClose={flow.requestClose}
          actions={actions}
          className={['afframe-flow-side-panel', className]
            .filter(Boolean)
            .join(' ')}>
          <FlowForm
            flow={flow}
            submitDisabled={submitDisabled}
            aria-labelledby={`${id}-form-title`}>
            <h3
              id={`${id}-form-title`}
              className="afframe-flow-side-panel-title">
              {formTitle}
            </h3>
            {formDescription && (
              <p className="afframe-flow-side-panel-description">
                {formDescription}
              </p>
            )}
            {children}
            <FlowError error={flow.error} messages={text} />
          </FlowForm>
        </SidePanel>
      </div>
      <DiscardDialog flow={flow} messages={text} />
    </>
  );
}
