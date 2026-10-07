'use client';
// Strings shared by RemoveModal, ImportModal, ExportModal and APIKeyModal.
// Internal: each dialog spreads these defaults into its own messages object.

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
