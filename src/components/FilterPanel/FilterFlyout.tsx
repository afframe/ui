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
import type {
  FilterPanelMessages,
  FilterPanelProps,
  FilterPanelValue,
} from './FilterPanel.js';

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
      | 'groups'
      | 'value'
      | 'onChange'
      | 'updateMethod'
      | 'resultCount'
      | 'headingLevel'
    >,
    Omit<ComponentPropsWithoutRef<'div'>, 'onChange' | 'children'> {
  /** Ref to the root `div` (Carbon's Popover). */
  ref?: Ref<HTMLDivElement>;
  /** Opens the flyout on first render. */
  defaultOpen?: boolean;
  messages?: Partial<FilterFlyoutMessages>;
}

/**
 * A toolbar button that opens a `FilterPanel` in a popover. Controlled. In
 * batch update Apply applies and closes; Cancel, Escape and a click outside
 * close and discard the draft.
 */
export function FilterFlyout({
  groups,
  value,
  onChange,
  updateMethod = 'instant',
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
  // PopoverContent stays mounted while closed, so a batch panel gets a new
  // key per opening to start from the applied value.
  const [opening, setOpening] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rootRef = useMergedRefs(wrapperRef, ref);
  const contentId = useId();

  const closeToTrigger = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

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
    closeToTrigger();
  };

  const applyAndClose = (next: FilterPanelValue) => {
    onChange(next);
    closeToTrigger();
  };

  const toggleOpen = () => {
    if (!open && updateMethod === 'batch') setOpening(opening + 1);
    setOpen(!open);
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
      // Carbon also closes on a click whose target a re-render has just
      // removed from the document; such a click leaves focus inside.
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
        onClick={toggleOpen}>
        {text.toggle(countFilterPanelSelections(groups, value))}
      </Button>
      <PopoverContent id={contentId} className="afframe-filter-flyout-content">
        <FilterPanel
          key={opening}
          groups={groups}
          value={value}
          updateMethod={updateMethod}
          onChange={updateMethod === 'batch' ? applyAndClose : onChange}
          onCancel={closeToTrigger}
          {...(resultCount !== undefined ? { resultCount } : {})}
          {...(headingLevel !== undefined ? { headingLevel } : {})}
          messages={text}
        />
      </PopoverContent>
    </Popover>
  );
}
