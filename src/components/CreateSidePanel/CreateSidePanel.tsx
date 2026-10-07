'use client';
import { resolveMessages } from '../../messages.js';
import { defaultCreateEditFlowMessages } from '../CreateEditFlow/CreateEditFlow.js';
import { FlowSidePanel } from '../CreateEditFlow/FlowSidePanel.js';
import type {
  FlowSidePanelBaseProps,
  FlowSidePanelMessages,
} from '../CreateEditFlow/FlowSidePanel.js';

export interface CreateSidePanelMessages extends FlowSidePanelMessages {
  /** Primary button. */
  create: string;
}

export const defaultCreateSidePanelMessages: CreateSidePanelMessages = {
  ...defaultCreateEditFlowMessages,
  submitting: 'Creating',
  create: 'Create',
  closePanel: 'Close panel',
};

export interface CreateSidePanelProps extends FlowSidePanelBaseProps {
  /** Unsaved input; Escape, Cancel, the close icon and an overlay click then ask first. */
  isDirty?: boolean;
  messages?: Partial<CreateSidePanelMessages>;
}

/** A create form in an IBM side panel. Controlled by `open`. */
export function CreateSidePanel({ messages, ...props }: CreateSidePanelProps) {
  const text = resolveMessages(defaultCreateSidePanelMessages, messages);
  return <FlowSidePanel {...props} primaryLabel={text.create} text={text} />;
}
