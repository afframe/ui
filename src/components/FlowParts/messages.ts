// Strings shared by the nine Afframe dialogs and flows. Internal: each
// component spreads one set of defaults into its own messages object.

/** Base of CreateModal, CreateSidePanel, EditSidePanel, EditTearsheet and EditFullPage. */
export interface CreateEditFlowMessages {
  cancel: string;
  /** Alert text for a rejected submit, unless `errorText` is set. */
  submitError: string;
  /**
   * Alert text from the rejection reason, for apps that show details. Not
   * set by default: raw error messages may not suit users.
   */
  errorText?: (error: unknown) => string;
  /** Text next to the spinner in the primary button while submitting. */
  submitting: string;
  /** Accessible name of the error icon in the submit error notification. */
  errorIconDescription: string;
  discardTitle: string;
  discardBody: string;
  discard: string;
  keepEditing: string;
  /** Close button of the discard dialog. */
  closeIconDescription: string;
}

export const defaultCreateEditFlowMessages: CreateEditFlowMessages = {
  cancel: 'Cancel',
  submitError: 'The changes could not be saved. Try again.',
  submitting: 'Saving',
  errorIconDescription: 'Error',
  discardTitle: 'Discard changes?',
  discardBody: 'Your changes will be lost.',
  discard: 'Discard',
  keepEditing: 'Keep editing',
  closeIconDescription: 'Close',
};

/** Base of RemoveModal, ImportModal, ExportModal and APIKeyModal. */
export interface ModalPartsMessages {
  /** Secondary button that closes the dialog. */
  cancel: string;
  /** Text next to the spinner in the primary button while an action runs. */
  pending: string;
  /** Alert shown when an action fails. */
  genericError: string;
  /** Accessible name of the icon in the error alert. */
  errorIconDescription: string;
  /** Accessible name of the close icon in the dialog header. */
  closeIconDescription: string;
}

export const defaultModalPartsMessages: ModalPartsMessages = {
  cancel: 'Cancel',
  pending: 'Working',
  genericError: 'Something went wrong. Try again.',
  errorIconDescription: 'Error',
  closeIconDescription: 'Close',
};
