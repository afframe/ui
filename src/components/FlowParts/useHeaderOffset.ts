'use client';
import { useLayoutEffect } from 'react';
import type { RefObject } from 'react';

/** The custom property the side panel styles read for their top edge. */
const headerOffsetProperty = '--afframe-side-panel-offset';

/**
 * Bottom edge of the first element matching `selector`, within the viewport;
 * 0 when none or scrolled away.
 */
function measureHeaderOffset(selector: string): number {
  const header = document.querySelector(selector);
  if (!header) return 0;
  const { bottom } = header.getBoundingClientRect();
  return Math.min(Math.max(bottom, 0), window.innerHeight);
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
    const update = () => {
      const value = `${measureHeaderOffset(selector)}px`;
      if (node.style.getPropertyValue(headerOffsetProperty) !== value)
        node.style.setProperty(headerOffsetProperty, value);
    };
    let frame = 0;
    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        update();
      });
    };
    update();
    const header = document.querySelector(selector);
    const observer = new ResizeObserver(schedule);
    if (header) observer.observe(header);
    window.addEventListener('resize', schedule);
    // A header that is not fixed moves with whatever scrolls.
    window.addEventListener('scroll', schedule, {
      capture: true,
      passive: true,
    });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', schedule);
      window.removeEventListener('scroll', schedule, true);
      // The property stays: the panel's exit animation still reads it.
    };
  }, [target, active, selector]);
}
