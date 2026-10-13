/**
 * Ref callback for the field a modal story opens on. Under
 * `enable-dialog-element` Carbon skips `data-modal-primary-focus`, and the
 * native dialog focuses its first focusable element unless one carries the
 * `autofocus` attribute; React's `autoFocus` prop does not render it.
 */
export const autofocus = (element: HTMLElement | null) =>
  element?.setAttribute('autofocus', '');
