'use client';
import { tabbable } from 'tabbable';

/**
 * Keeps Tab inside the modal dialog that has focus. Chromium lets Tab leave a
 * native modal dialog for the browser's own controls (w3c/html#1514); this
 * wraps instead. Bubble phase on `document`: React handlers run first, and one
 * that calls `preventDefault` wins.
 */
// fallow-ignore-next-line complexity -- each guard is one case the browser default must keep
export function wrapTabInModalDialog(event: KeyboardEvent) {
  if (
    event.key !== 'Tab' ||
    event.defaultPrevented ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey
  )
    return;
  const origin = event.composedPath()[0];
  if (origin instanceof Node && origin.getRootNode() instanceof ShadowRoot)
    return;
  const target = event.target;
  if (!(target instanceof Element)) return;
  // Everything outside the top modal dialog is inert, so the dialog around
  // the focused element is the top one; document order is not top-layer order.
  const dialog = target.closest('dialog[open]');
  // Selector engines without `:modal` (jsdom) throw on it.
  try {
    if (!dialog?.matches(':modal')) return;
  } catch {
    return;
  }
  const stops = tabbable(dialog);
  const first = stops[0];
  const last = stops[stops.length - 1];
  if (!first || !last) {
    event.preventDefault();
    return;
  }
  // By position, so focus on a non-tabbable element (the dialog itself, a
  // content wrapper with tabIndex -1) still wraps.
  const side = event.shiftKey
    ? Node.DOCUMENT_POSITION_PRECEDING
    : Node.DOCUMENT_POSITION_FOLLOWING;
  if (stops.some((stop) => target.compareDocumentPosition(stop) & side)) return;
  event.preventDefault();
  (event.shiftKey ? last : first).focus();
}
