'use client';
import { useLayoutEffect } from 'react';
import type { RefObject } from 'react';

/** The custom property the side panel styles read for their top edge. */
const headerOffsetProperty = '--afframe-side-panel-offset';

/** Bottom edge of the first element matching `selector`; 0 when none or scrolled away. */
function measureHeaderOffset(selector: string): number {
  const header = document.querySelector(selector);
  return header ? Math.max(0, header.getBoundingClientRect().bottom) : 0;
}

/**
 * While `active`, sets `headerOffsetProperty` on `target` to the bottom edge
 * of the page header, so a fixed surface starts below it. IBM SidePanel
 * reserves a fixed 3rem for a UI Shell header; a real header can be any
 * height, or absent.
 */
export function useHeaderOffset(
  target: RefObject<HTMLElement | null>,
  active: boolean,
  selector: string
) {
  useLayoutEffect(() => {
    const node = target.current;
    if (!active || !node) return;
    const update = () =>
      node.style.setProperty(
        headerOffsetProperty,
        `${measureHeaderOffset(selector)}px`
      );
    update();
    const header = document.querySelector(selector);
    const observer = new ResizeObserver(update);
    if (header) observer.observe(header);
    window.addEventListener('resize', update);
    // A header that is not fixed moves with whatever scrolls.
    window.addEventListener('scroll', update, { capture: true, passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
      // The property stays: the panel's exit animation still reads it.
    };
  }, [target, active, selector]);
}
