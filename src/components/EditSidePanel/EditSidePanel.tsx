'use client';
import { resolveMessages } from '../../messages.js';
import { defaultCreateEditFlowMessages } from '../CreateEditFlow/CreateEditFlow.js';
import { FlowSidePanel } from '../CreateEditFlow/FlowSidePanel.js';
import type {
  FlowSidePanelBaseProps,
  FlowSidePanelMessages,
} from '../CreateEditFlow/FlowSidePanel.js';

export interface EditSidePanelMessages extends FlowSidePanelMessages {
  /** Primary button. */
  save: string;
}

export const defaultEditSidePanelMessages: EditSidePanelMessages = {
  ...defaultCreateEditFlowMessages,
  save: 'Save',
  closePanel: 'Close panel',
};

export interface EditSidePanelProps extends FlowSidePanelBaseProps {
  /**
   * Unsaved changes; Escape, Cancel, the close icon and an overlay click then
   * ask first. Default false: compare the field state with the saved values.
   */
  isDirty?: boolean;
  messages?: Partial<EditSidePanelMessages>;
}

/** An edit form for an existing record in an IBM side panel. Controlled by `open`. */
export function EditSidePanel({ messages, ...props }: EditSidePanelProps) {
  const text = resolveMessages(defaultEditSidePanelMessages, messages);
  return <FlowSidePanel {...props} primaryLabel={text.save} text={text} />;
}
