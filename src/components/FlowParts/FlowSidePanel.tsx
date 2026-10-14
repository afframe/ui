'use client';
// Internal side panel on the shared flow, used by CreateSidePanel and
// EditSidePanel. Not exported.
import { SidePanel } from '@carbon/ibm-products';
import type {
  ComponentProps,
  HTMLAttributes,
  ReactNode,
  Ref,
  RefObject,
} from 'react';
import {
  DiscardDialog,
  FlowButtonLabel,
  FlowError,
  FlowForm,
  FlowStatus,
} from './FlowParts.js';
import type { DiscardMessages, FlowMessages } from './messages.js';
import { useObjectRef } from './refs.js';
import { firstControlSelector, isCloseEscape, useFlow } from './useFlow.js';

type SidePanelProps = ComponentProps<typeof SidePanel>;

export type FlowSidePanelMessages = FlowMessages & DiscardMessages;

interface FlowSidePanelOwnProps {
  open: boolean;
  /** Called after a successful submit, Discard, or a close of a clean form. */
  onClose: () => void;
  /** A returned promise keeps the panel busy until it settles. */
  onSubmit: () => void | Promise<void>;
  /** Panel heading; also names the panel and its form. */
  title: string;
  /** Small text above the title. A string: IBM SidePanel renders only strings here. */
  label?: string;
  /** Text under the title. */
  description?: ReactNode;
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
  /** Focus target on close; default the element focused before opening. */
  launcherRef?: RefObject<HTMLElement | null>;
  children?: ReactNode;
  className?: string;
}

/**
 * Props both side panels share; the docs pages list them. The rest go to
 * IBM's `aside`, which sets `aria-label`, `onKeyDown` and the animation
 * handlers itself.
 */
export interface FlowSidePanelBaseProps
  extends
    FlowSidePanelOwnProps,
    Omit<
      HTMLAttributes<HTMLElement>,
      | keyof FlowSidePanelOwnProps
      | 'aria-label'
      | 'onKeyDown'
      | 'onAnimationStart'
      | 'onAnimationEnd'
    > {
  /** The panel's `aside`; null while closed. */
  ref?: Ref<HTMLElement> | undefined;
  /** Default IBM's literal `c4p--side-panel`; IBM types it without `undefined`. */
  id?: string;
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
  label,
  description,
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
  ref,
  primaryLabel,
  text,
  ...rest
}: FlowSidePanelBaseProps & {
  isDirty?: boolean;
  primaryLabel: string;
  text: FlowSidePanelMessages;
}) {
  // IBM uses its ref as an object (focus trap, exit animation).
  const panelRef = useObjectRef<HTMLElement>(ref);
  const flow = useFlow<HTMLFormElement>({
    open,
    onClose,
    isDirty,
    confirmDiscard,
    launcherRef,
    messages: { error: text.error, errorText: text.errorText },
  });
  const submit = async () => {
    if (await flow.run(onSubmit)) flow.close();
  };

  const actions = [
    {
      kind: 'primary',
      // Cast kept: ActionSet types `label` as a string but renders any node
      // as the button content. Its own `loading` flag adds an InlineLoading
      // that IBM pins to the button's edge, with an English icon name.
      label: (
        <FlowButtonLabel label={primaryLabel} busy={flow.pending} />
      ) as unknown as string,
      disabled: submitDisabled || flow.pending,
      onClick: () => void submit(),
    },
    {
      kind: 'secondary',
      label: text.cancel,
      disabled: flow.pending,
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
          {...rest}
          // IBM types its ref as a div; the node is its aside.
          ref={panelRef as RefObject<HTMLDivElement>}
          open={open}
          title={title}
          {...(label ? { labelText: label } : {})}
          {...(description ? { subtitle: description } : {})}
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
          closeIconDescription={text.closeIconDescription}
          onRequestClose={flow.requestClose}
          actions={actions}
          className={['afframe-flow-side-panel', className]
            .filter(Boolean)
            .join(' ')}>
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
          {/* Outside the form: its aria-busy may hold back announcements. */}
          <FlowStatus message={flow.pending ? text.pending : ''} />
        </SidePanel>
      </div>
      <DiscardDialog flow={flow} messages={text} />
    </>
  );
}
