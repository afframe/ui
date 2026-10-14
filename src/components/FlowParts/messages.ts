// Strings shared by the nine Afframe dialogs and flows. Internal: each
// component spreads these defaults into its own messages object and sets
// `pending` and `error` itself.

/** Base of the messages of all nine dialogs and flows. */
export interface FlowMessages {
  /** Secondary button that closes the surface. */
  cancel: string;
  /** Accessible name of the close icon (and of the discard dialog's close icon). */
  closeIconDescription: string;
  /**
   * Busy text announced while an action runs. The task modals and
   * EditTearsheet also show it in the primary button; the other create and
   * edit flows keep the button's label and add a spinner.
   */
  pending: string;
  /** Alert text for a failed action, unless `errorText` is set. */
  error: string;
  /**
   * Alert text from the rejection reason, for apps that show details. Not
   * set by default: raw error messages may not suit users.
   */
  errorText?: (reason: unknown) => string;
  /** Accessible name of the icon in the error alert. */
  errorIconDescription: string;
}

/** The discard dialog of CreateModal, the side panels, EditTearsheet and EditFullPage. */
export interface DiscardMessages {
  discardTitle: string;
  discardBody: string;
  discard: string;
  keepEditing: string;
}

const defaultFlowMessages: Omit<FlowMessages, 'pending' | 'error'> = {
  cancel: 'Cancel',
  closeIconDescription: 'Close',
  errorIconDescription: 'Error',
};

const defaultDiscardMessages: DiscardMessages = {
  discardTitle: 'Discard changes?',
  discardBody: 'Your changes will be lost.',
  discard: 'Discard',
  keepEditing: 'Keep editing',
};

/** Defaults of the create and edit flows. */
export const defaultFormFlowMessages: FlowMessages & DiscardMessages = {
  ...defaultFlowMessages,
  ...defaultDiscardMessages,
  pending: 'Saving',
  error: 'The changes could not be saved. Try again.',
};

/** Defaults of the task modals. */
export const defaultTaskModalMessages: FlowMessages = {
  ...defaultFlowMessages,
  pending: 'Working',
  error: 'Something went wrong. Try again.',
};
