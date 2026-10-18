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
 * Modified by Afframe in 2026: from the filter summary of tanstack-carbon react/filterPanel (src/Example/FilterPanel.tsx); tags built from FilterPanel groups and value, text from messages, the overflow from IBM Products TagOverflow, empty root while nothing is applied. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */
import { TagOverflow } from '@carbon/ibm-products';
import type { TagOverflowProps } from '@carbon/ibm-products';
import { Button } from '@carbon/react';
import { useRef } from 'react';
import type { ComponentPropsWithoutRef, Ref } from 'react';
import { resolveMessages } from '../../messages.js';
import { useMergedRefs } from '../FlowParts/refs.js';
import type { FilterPanelProps } from './FilterPanel.js';
import { filterTags } from './value.js';

export interface FilterSummaryMessages {
  /** Accessible name of the summary group. */
  selectedFilters: string;
  /** Text of one tag; `value` is the option label or the formatted value. */
  tagLabel: (groupLabel: string, value: string) => string;
  /** Name of a tag's dismiss button; `label` is the tag text. */
  removeFilter: (label: string) => string;
  clearFilters: string;
  /** Link in the "+N" popover that opens all tags in a modal. */
  showAllFilters: string;
  /** Title of the all tags modal. */
  allFiltersTitle: string;
  /** Label of the search field in the all tags modal. */
  searchFiltersLabel: string;
  searchFiltersPlaceholder: string;
  /**
   * Date range value; `start` and `end` are formatted days, `end` is `null`
   * when missing. `range` is both ends formatted together, `null` without an end.
   */
  dateRangeValue: (
    start: string,
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
  showAllFilters: 'View all',
  allFiltersTitle: 'All filters',
  searchFiltersLabel: 'Search filters',
  searchFiltersPlaceholder: 'Search filters',
  dateRangeValue: (start, _end, range) => range ?? `from ${start}`,
  atMostValue: (value) => `up to ${value}`,
};

type SummaryItem = TagOverflowProps['items'][number] & {
  title: string;
  dismissTooltipLabel: string;
};

export interface FilterSummaryProps
  extends
    Pick<FilterPanelProps, 'groups' | 'value' | 'onChange'>,
    Omit<ComponentPropsWithoutRef<'div'>, 'onChange' | 'children'> {
  /** Ref to the root `div`. */
  ref?: Ref<HTMLDivElement>;
  messages?: Partial<FilterSummaryMessages>;
}

/**
 * The applied filters as one line of dismissible tags in IBM Products
 * TagOverflow, with a "+N" tag that opens the rest in a popover, then Clear
 * filters, as in tanstack-carbon's filter panel example. Controlled; renders
 * an empty root while nothing is applied.
 */
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
  const rootRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs(rootRef, ref);

  const items: SummaryItem[] = filterTags(groups, value, text).map((tag) => ({
    id: tag.key,
    label: tag.label,
    tagType: 'gray',
    // Carbon names the dismiss button with `title`, or with
    // `dismissTooltipLabel` when the tag text is truncated.
    title: text.removeFilter(tag.label),
    dismissTooltipLabel: text.removeFilter(tag.label),
    onClose: () => {
      rootRef.current?.focus();
      onChange(tag.without());
    },
  }));

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
      {items.length > 0 && (
        <>
          <TagOverflow
            className="afframe-filter-summary-tags"
            items={items}
            maxVisible={10}
            overflowType="tag"
            autoAlign
            showAllTagsLabel={text.showAllFilters}
            allTagsModalTitle={text.allFiltersTitle}
            allTagsModalAriaLabel={text.allFiltersTitle}
            allTagsModalSearchLabel={text.searchFiltersLabel}
            allTagsModalSearchPlaceholderText={text.searchFiltersPlaceholder}
          />
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
