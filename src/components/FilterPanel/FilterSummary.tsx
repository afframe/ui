'use client';
/**
 * Copyright IBM Corp. 2024, 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2024, 2025
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: from the filter summary of tanstack-carbon react/filterPanel (src/Example/FilterPanel.tsx); tags built from FilterPanel groups and value, text from messages, measured with createOverflowHandler instead of a hidden copy, focus kept on the tags after a dismiss, empty root while nothing is applied. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */
import {
  Button,
  DismissibleTag,
  OperationalTag,
  Popover,
  PopoverContent,
  usePrefix,
} from '@carbon/react';
import { createOverflowHandler } from '@carbon/utilities';
import { useId, useLayoutEffect, useRef, useState } from 'react';
import type { ComponentPropsWithoutRef, Ref } from 'react';
import { flushSync } from 'react-dom';
import { resolveMessages } from '../../messages.js';
import { useMergedRefs } from '../FlowParts/refs.js';
import type { FilterPanelProps } from './FilterPanel.js';
import { defaultFilterTagMessages, filterTags } from './value.js';
import type { FilterTag } from './value.js';

export interface FilterSummaryMessages {
  /** Accessible name of the summary group. */
  selectedFilters: string;
  /** Text of one tag; `value` is the option label or the formatted value. */
  tagLabel: (groupLabel: string, value: string) => string;
  /** Name of a tag's dismiss button; `label` is the tag text. */
  removeFilter: (label: string) => string;
  clearFilters: string;
  /** Name of the "+N" tag that opens the hidden tags. */
  moreFilters: (count: number) => string;
  /**
   * Date range value; `start` and `end` are formatted days, `null` when
   * missing. `range` is both ends formatted together, `null` unless both are set.
   */
  dateRangeValue: (
    start: string | null,
    end: string | null,
    range: string | null
  ) => string;
  /** Slider value: its upper bound. */
  atMostValue: (value: string) => string;
}

export const defaultFilterSummaryMessages: FilterSummaryMessages = {
  selectedFilters: 'Selected filters',
  tagLabel: (groupLabel, value) => `${groupLabel}: ${value}`,
  removeFilter: (label) => `Remove filter ${label}`,
  clearFilters: 'Clear filters',
  moreFilters: (count) => `${count} more filters`,
  dateRangeValue: defaultFilterTagMessages.dateRange,
  atMostValue: (value) => `up to ${value}`,
};

const isTag = (item: Element) => !item.hasAttribute('data-offset');

// Focuses the dismiss button of the tag at `index`, else of the last tag,
// else the first fallback that exists.
function focusShownTag(
  tags: Element[],
  prefix: string,
  index: number,
  fallbacks: (HTMLElement | null)[]
) {
  const buttons = tags.flatMap((tag) => [
    ...tag.querySelectorAll<HTMLButtonElement>(`.${prefix}--tag__close-icon`),
  ]);
  (
    buttons[Math.min(index, buttons.length - 1)] ?? fallbacks.find(Boolean)
  )?.focus();
}

type PendingFocus = { in: 'line' | 'popover'; index: number };

interface Settle {
  container: Element;
  popover: Element | null;
  more: HTMLElement | null;
  root: HTMLElement | null;
  prefix: string;
  pending: PendingFocus | null;
  setHidden: (count: number) => void;
}

// Takes the hidden count from the DOM, then moves focus after a dismiss: in
// the line to the shown tag in its place or the root; in the popover to the
// next hidden tag, "+N" or the root.
function settle({
  container,
  popover,
  more,
  root,
  prefix,
  pending,
  setHidden,
}: Settle) {
  const tags = [...container.children].filter(isTag);
  const count = tags.filter((tag) => tag.hasAttribute('data-hidden')).length;
  flushSync(() => setHidden(count));
  if (pending?.in === 'line') {
    const shown = tags.filter((tag) => !tag.hasAttribute('data-hidden'));
    focusShownTag(shown, prefix, pending.index, [root]);
  } else if (pending) {
    const listed = [...(popover?.children ?? [])];
    focusShownTag(listed, prefix, pending.index, [
      count > 0 ? more : null,
      root,
    ]);
  }
}

export interface FilterSummaryProps
  extends
    Pick<FilterPanelProps, 'groups' | 'value' | 'onChange'>,
    Omit<ComponentPropsWithoutRef<'div'>, 'onChange' | 'children'> {
  /** Ref to the root `div`. */
  ref?: Ref<HTMLDivElement>;
  messages?: Partial<FilterSummaryMessages>;
}

/**
 * The applied filters as one line of dismissible tags, a "+N" tag that opens
 * the rest in a popover, then Clear filters, as in tanstack-carbon's filter
 * panel example. Controlled; renders an empty root while nothing is applied.
 */
// fallow-ignore-next-line complexity -- one render: the overflow effect, the tag line, the "+N" popover and Clear filters
export function FilterSummary({
  groups,
  value,
  onChange,
  messages,
  className,
  ref,
  ...rest
}: FilterSummaryProps) {
  const text = resolveMessages(defaultFilterSummaryMessages, messages);
  const prefix = usePrefix();
  const rootRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs(rootRef, ref);
  const containerRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<PendingFocus | null>(null);
  const keepOpen = useRef(false);
  const popoverId = useId();
  const [hidden, setHidden] = useState(0);
  const [open, setOpen] = useState(false);
  if (open && hidden === 0) setOpen(false);

  const tags = filterTags(groups, value, {
    tagLabel: text.tagLabel,
    dateRange: text.dateRangeValue,
    upTo: text.atMostValue,
  });
  // Labels too: a new text changes the tag widths.
  const layoutKey = tags.map((tag) => `${tag.key}\n${tag.label}`).join('\n');

  // The handler reads the container's children once, so it is created again
  // whenever the tags change. Its onChange only fires when the hidden set
  // differs from its own previous one, which starts empty, so a frame queued
  // after its first update reads the outcome from the DOM.
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) {
      // The last tag went with its focused button.
      if (pendingFocus.current) rootRef.current?.focus();
      pendingFocus.current = null;
      return;
    }
    const handler = createOverflowHandler({
      container,
      maxVisibleItems: 10,
      gap: parseFloat(getComputedStyle(container).columnGap) || 0,
      onChange: (_, hiddenItems) => setHidden(hiddenItems.length),
    });
    const frame = requestAnimationFrame(() => {
      const pending = pendingFocus.current;
      pendingFocus.current = null;
      settle({
        container,
        popover: popoverRef.current,
        more: moreRef.current,
        root: rootRef.current,
        prefix,
        pending,
        setHidden,
      });
    });
    return () => {
      cancelAnimationFrame(frame);
      handler.disconnect();
    };
  }, [layoutKey, prefix]);

  const dismiss = (tag: FilterTag, focus: PendingFocus) => {
    pendingFocus.current = focus;
    if (focus.in === 'popover') {
      // The dismissed button leaves the DOM within this event, so Carbon's
      // focusout and click-outside checks see it outside the popover.
      keepOpen.current = true;
      setTimeout(() => {
        keepOpen.current = false;
      });
    }
    onChange(tag.without());
  };

  const closePopover = () => {
    if (keepOpen.current) return;
    // The list unmounts on close; focus inside it goes back to "+N".
    if (popoverRef.current?.contains(document.activeElement)) {
      moreRef.current?.focus();
    }
    setOpen(false);
  };

  const tagProps = (tag: FilterTag) => ({
    type: 'gray' as const,
    size: 'md' as const,
    text: tag.label,
    // Carbon names the dismiss button with `title`, or with
    // `dismissTooltipLabel` when the tag text is truncated.
    title: text.removeFilter(tag.label),
    dismissTooltipLabel: text.removeFilter(tag.label),
  });

  // Hidden tags are always the last ones.
  const hiddenTags = tags.slice(tags.length - hidden);

  return (
    <div
      role="group"
      aria-label={text.selectedFilters}
      tabIndex={-1}
      {...rest}
      ref={mergedRef}
      className={['afframe-filter-summary', className]
        .filter(Boolean)
        .join(' ')}>
      {tags.length > 0 && (
        <>
          <div ref={containerRef} className="afframe-filter-summary-tags">
            {tags.map((tag, index) => (
              <DismissibleTag
                key={tag.key}
                {...tagProps(tag)}
                onClose={() => dismiss(tag, { in: 'line', index })}
              />
            ))}
            {/* Hidden until the overflow handler measures, so "+0" never
                paints; it measures hidden items with a display override. */}
            <span data-offset {...(hidden === 0 && { 'data-hidden': '' })}>
              <Popover
                open={open && hidden > 0}
                isTabTip
                align="bottom-end"
                autoAlign
                onRequestClose={closePopover}>
                <OperationalTag
                  ref={moreRef}
                  type="gray"
                  size="md"
                  text={`+${hidden}`}
                  aria-label={text.moreFilters(hidden)}
                  aria-expanded={open}
                  aria-controls={popoverId}
                  onClick={() => (open ? closePopover() : setOpen(true))}
                />
                <PopoverContent id={popoverId}>
                  <div
                    ref={popoverRef}
                    className="afframe-filter-summary-popover">
                    {open &&
                      hiddenTags.map((tag, index) => (
                        <DismissibleTag
                          key={tag.key}
                          {...tagProps(tag)}
                          onClose={() => dismiss(tag, { in: 'popover', index })}
                        />
                      ))}
                  </div>
                </PopoverContent>
              </Popover>
            </span>
          </div>
          <Button
            kind="ghost"
            size="sm"
            onClick={() => {
              rootRef.current?.focus();
              onChange({});
            }}>
            {text.clearFilters}
          </Button>
        </>
      )}
    </div>
  );
}
