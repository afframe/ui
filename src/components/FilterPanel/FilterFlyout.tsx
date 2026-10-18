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
 * Modified by Afframe in 2026: from tanstack-carbon react/filterFlyout FilterFlyout.tsx (tab-tip Popover with an icon trigger, two-column fields, Clear and Apply); FilterPanel as the content, a text trigger option, the count in the trigger name, a draft discarded on Escape and a click outside, Escape rules for menus and the calendar, a live region for the result count, text from messages. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */
import { Filter } from '@carbon/icons-react';
import {
  Button,
  IconButton,
  Popover,
  PopoverContent,
  usePrefix,
} from '@carbon/react';
import { useId, useRef, useState } from 'react';
import type { ComponentPropsWithoutRef, KeyboardEvent, Ref } from 'react';
import { resolveMessages } from '../../messages.js';
import { pickerOf } from '../DatePicker/dateField.js';
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
  /** Trigger name, and the tooltip of the icon trigger; `count` is the number of selected options. */
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
      | 'layout'
      | 'resultCount'
      | 'headingLevel'
    >,
    Omit<ComponentPropsWithoutRef<'div'>, 'onChange' | 'children'> {
  /** Ref to the root `div` (Carbon's Popover). */
  ref?: Ref<HTMLDivElement>;
  /** Opens the flyout on first render. */
  defaultOpen?: boolean;
  /** `icon` is a ghost icon button with the text as its tooltip; `text` a ghost button with icon and text. Default `icon`. */
  trigger?: 'icon' | 'text';
  messages?: Partial<FilterFlyoutMessages>;
}

/** A date field in `root` has its calendar open (flatpickr puts it on `body`). */
const hasOpenCalendar = (root: Element | null) =>
  Array.from(root?.querySelectorAll('input') ?? []).some((input) =>
    // Carbon closes the calendar on Escape by its class only, so isOpen lags.
    pickerOf(input)?.calendarContainer?.classList.contains('open')
  );

/** Escape that an open menu or date calendar inside `root` closes first. */
const isInnerEscape = (root: Element, target: EventTarget) =>
  (target instanceof Element &&
    target.closest('[role="combobox"][aria-expanded="true"]') !== null) ||
  hasOpenCalendar(root);

// A component, not an element: with autoAlign Carbon's Popover makes every
// element child its anchor through a ref, and the last one would win.
export function LiveStatus({ text }: { text: string }) {
  const prefix = usePrefix();
  return (
    <p role="status" className={`${prefix}--visually-hidden`}>
      {text}
    </p>
  );
}

/**
 * A toolbar button that opens a `FilterPanel` in a tab-tip popover. Controlled.
 * In batch update Apply and Clear apply and close; Escape and a click outside
 * close and discard the draft.
 */
// fallow-ignore-next-line complexity -- optional props passed through to the panel, both triggers and the Escape rules
export function FilterFlyout({
  groups,
  value,
  onChange,
  updateMethod = 'batch',
  layout,
  resultCount,
  headingLevel,
  defaultOpen = false,
  trigger = 'icon',
  messages,
  className,
  ref,
  onKeyDownCapture: onKeyDownCaptureProp,
  ...rest
}: FilterFlyoutProps) {
  const text = resolveMessages(defaultFilterFlyoutMessages, messages);
  const [open, setOpen] = useState(defaultOpen);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentId = useId();

  const closeToTrigger = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  // Carbon closes on Escape only from inside the content, and Carbon's
  // Search swallows Escape. Capturing it here also covers the trigger, lets a
  // search with text, an open menu or an open calendar take it first, and
  // always returns focus.
  const onKeyDownCapture = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDownCaptureProp?.(event);
    if (!open || event.key !== 'Escape') return;
    const target = event.target;
    const isSearch =
      target instanceof HTMLInputElement && target.type === 'search';
    if (isSearch && target.value) return;
    event.preventDefault();
    // preventDefault also keeps Carbon's window handler from closing.
    if (isInnerEscape(event.currentTarget, target)) return;
    // FilterableMultiSelect takes Escape with its menu closed to clear its
    // selection and refocus its input, which would undo the focus return.
    event.stopPropagation();
    closeToTrigger();
  };

  const applyAndClose = (next: FilterPanelValue) => {
    onChange(next);
    closeToTrigger();
  };

  const toggleOpen = () => setOpen(!open);

  const label = text.toggle(countFilterPanelSelections(groups, value));
  const triggerProps = {
    ref: triggerRef,
    kind: 'ghost' as const,
    'aria-expanded': open,
    'aria-controls': contentId,
    onClick: toggleOpen,
  };
  const classes = ['afframe-filter-flyout', className]
    .filter(Boolean)
    .join(' ');

  return (
    <Popover
      {...rest}
      as="div"
      open={open}
      isTabTip
      align="bottom-end"
      autoAlign
      ref={ref}
      // A click into a date input that opens the calendar reaches the window
      // targeted at body, which Carbon takes as a click outside. flatpickr
      // closes the calendar on the mousedown of a real outside click first.
      onRequestClose={() => {
        if (!hasOpenCalendar(document.getElementById(contentId)))
          setOpen(false);
      }}
      onKeyDownCapture={onKeyDownCapture}
      className={classes}>
      {trigger === 'text' ? (
        <Button {...triggerProps} renderIcon={Filter}>
          {label}
        </Button>
      ) : (
        <IconButton {...triggerProps} label={label} align="bottom-end">
          <Filter />
        </IconButton>
      )}
      {/* Announces the count after Apply closes the flyout; while it is open
          the panel's own status speaks. */}
      <LiveStatus
        text={
          open || resultCount === undefined ? '' : text.resultCount(resultCount)
        }
      />
      <PopoverContent id={contentId} className="afframe-filter-flyout-content">
        {open && (
          <FilterPanel
            groups={groups}
            value={value}
            updateMethod={updateMethod}
            onChange={updateMethod === 'batch' ? applyAndClose : onChange}
            {...(layout !== undefined ? { layout } : {})}
            {...(resultCount !== undefined ? { resultCount } : {})}
            {...(headingLevel !== undefined ? { headingLevel } : {})}
            messages={text}
          />
        )}
      </PopoverContent>
    </Popover>
  );
}
