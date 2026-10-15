'use client';
import { Filter } from '@carbon/icons-react';
import { Button, Popover, PopoverContent } from '@carbon/react';
import { useId, useRef, useState } from 'react';
import type { ComponentPropsWithoutRef, KeyboardEvent, Ref } from 'react';
import { resolveMessages } from '../../messages.js';
import { useMergedRefs } from '../FlowParts/refs.js';
import {
  countFilterPanelSelections,
  defaultFilterPanelMessages,
  FilterPanel,
} from './FilterPanel.js';
import type { FilterPanelMessages, FilterPanelProps } from './FilterPanel.js';

export interface FilterFlyoutMessages extends FilterPanelMessages {
  /** Toggle button text; `count` is the number of selected options. */
  toggle: (count: number) => string;
}

export const defaultFilterFlyoutMessages: FilterFlyoutMessages = {
  ...defaultFilterPanelMessages,
  toggle: (count) => (count > 0 ? `Filter (${count})` : 'Filter'),
};

export interface FilterFlyoutProps
  extends
    Pick<
      FilterPanelProps,
      'groups' | 'value' | 'onChange' | 'resultCount' | 'headingLevel'
    >,
    Omit<ComponentPropsWithoutRef<'div'>, 'onChange' | 'children'> {
  /** Ref to the root `div` (Carbon's Popover). */
  ref?: Ref<HTMLDivElement>;
  /** Opens the flyout on first render. */
  defaultOpen?: boolean;
  messages?: Partial<FilterFlyoutMessages>;
}

/** A toolbar button that opens a `FilterPanel` in a popover. Controlled. */
export function FilterFlyout({
  groups,
  value,
  onChange,
  resultCount,
  headingLevel,
  defaultOpen = false,
  messages,
  className,
  ref,
  onKeyDownCapture: onKeyDownCaptureProp,
  ...rest
}: FilterFlyoutProps) {
  const text = resolveMessages(defaultFilterFlyoutMessages, messages);
  const [open, setOpen] = useState(defaultOpen);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rootRef = useMergedRefs(wrapperRef, ref);
  const contentId = useId();

  // Carbon closes on Escape only from inside the content, and Carbon's
  // Search swallows Escape. Capturing it here also covers the toggle button,
  // lets a search with text clear first, and always returns focus.
  const onKeyDownCapture = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDownCaptureProp?.(event);
    if (!open || event.key !== 'Escape') return;
    const target = event.target;
    const isSearch =
      target instanceof HTMLInputElement && target.type === 'search';
    if (isSearch && target.value) return;
    event.preventDefault();
    setOpen(false);
    triggerRef.current?.focus();
  };

  const classes = ['afframe-filter-flyout', className]
    .filter(Boolean)
    .join(' ');

  return (
    <Popover
      {...rest}
      as="div"
      open={open}
      align="bottom-end"
      autoAlign
      caret={false}
      ref={rootRef}
      // Carbon also closes on a click whose target a filter change has just
      // removed (a dismissed tag, Clear all); those leave focus inside.
      onRequestClose={() => {
        if (!wrapperRef.current?.contains(document.activeElement)) {
          setOpen(false);
        }
      }}
      onKeyDownCapture={onKeyDownCapture}
      className={classes}>
      <Button
        ref={triggerRef}
        kind="ghost"
        renderIcon={Filter}
        aria-expanded={open}
        aria-controls={contentId}
        onClick={() => setOpen(!open)}>
        {text.toggle(countFilterPanelSelections(groups, value))}
      </Button>
      <PopoverContent id={contentId} className="afframe-filter-flyout-content">
        <FilterPanel
          groups={groups}
          value={value}
          onChange={onChange}
          {...(resultCount !== undefined ? { resultCount } : {})}
          {...(headingLevel !== undefined ? { headingLevel } : {})}
          messages={text}
        />
      </PopoverContent>
    </Popover>
  );
}
