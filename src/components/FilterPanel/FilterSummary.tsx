'use client';
/**
 * Copyright IBM Corp. 2022, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2022, 2024
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: from FilterSummary of @carbon/ibm-products@2.100.0; dismissible tags built from FilterPanel groups and value, text from messages, Clear filters measured after layout, focus kept on the tags after a dismiss, empty root while nothing is selected, no enter animation or resize collapse. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */
import { TagSet, usePrefix as useProductsPrefix } from '@carbon/ibm-products';
import { ChevronDown } from '@carbon/icons-react';
import { Button, IconButton, usePrefix } from '@carbon/react';
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type {
  ComponentPropsWithoutRef,
  ReactNode,
  Ref,
  RefObject,
} from 'react';
import { resolveMessages } from '../../messages.js';
import { useMergedRefs } from '../FlowParts/refs.js';
import { setGroup } from './FilterPanel.js';
import type { FilterPanelProps } from './FilterPanel.js';

export interface FilterSummaryMessages {
  /** Accessible name of the summary group. */
  selectedFilters: string;
  /** Text of one tag. */
  tagLabel: (groupLabel: string, optionLabel: string) => string;
  /** Name of a tag's dismiss button; `label` is the tag text. */
  removeFilter: (label: string) => string;
  clearFilters: string;
  /** Button that shows every tag on several lines, shown while tags overflow. */
  viewAll: string;
  /** Link in the "+N" popover to the dialog of all tags (over 10 hidden tags). */
  showAllTags: string;
  allTagsModalTitle: string;
  allTagsModalSearchLabel: string;
  allTagsModalSearchPlaceholder: string;
}

export const defaultFilterSummaryMessages: FilterSummaryMessages = {
  selectedFilters: 'Selected filters',
  tagLabel: (groupLabel, optionLabel) => `${groupLabel}: ${optionLabel}`,
  removeFilter: (label) => `Remove filter ${label}`,
  clearFilters: 'Clear filters',
  viewAll: 'View all',
  showAllTags: 'View all tags',
  allTagsModalTitle: 'All tags',
  allTagsModalSearchLabel: 'Search all tags',
  allTagsModalSearchPlaceholder: 'Search all tags',
};

// TagSet also renders a hidden copy of every tag for measuring.
function focusShownTag(
  root: HTMLElement | null,
  prefix: string,
  index: number
) {
  const shown = [
    ...(root?.querySelectorAll<HTMLButtonElement>(
      `.${prefix}--tag__close-icon`
    ) ?? []),
  ].filter((button) => !button.closest('[aria-hidden="true"]'));
  (shown[Math.min(index, shown.length - 1)] ?? root)?.focus();
}

// TagSet lays out new tags in its own renders, which may remove the focused
// button after a dismiss or a collapse (the last tag, one in "+N", a tag that
// no longer fits, View all once nothing overflows). Focus then falls to the
// body; `refocus` puts it back. The next key or pointer press ends the watch.
function useRefocusWhenLost(rootRef: RefObject<HTMLElement | null>) {
  const refocus = useRef<(() => void) | null>(null);
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new MutationObserver(() => {
      const active = document.activeElement;
      if (active && active !== document.body) return;
      refocus.current?.();
    });
    observer.observe(root, { childList: true, subtree: true });
    const end = () => {
      refocus.current = null;
    };
    document.addEventListener('keydown', end, true);
    document.addEventListener('pointerdown', end, true);
    return () => {
      observer.disconnect();
      document.removeEventListener('keydown', end, true);
      document.removeEventListener('pointerdown', end, true);
    };
  }, [rootRef]);
  return refocus;
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
 * The applied filters as one line of dismissible tags with a "+N" overflow,
 * then Clear filters, as IBM's Datagrid shows them above the table.
 * Controlled; renders an empty root while nothing is selected.
 */
// fallow-ignore-next-line complexity -- IBM's FilterSummary render: tags, Clear filters and View all only while tags overflow, with their widths for TagSet
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
  const productsPrefix = useProductsPrefix();
  const rootRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs(rootRef, ref);
  const clearRef = useRef<HTMLButtonElement>(null);
  const [overflowCount, setOverflowCount] = useState(0);
  const [multiline, setMultiline] = useState(false);
  const [clearWidth, setClearWidth] = useState(0);
  const { tagLabel, removeFilter } = text;
  const refocus = useRefocusWhenLost(rootRef);

  const tags = useMemo(() => {
    const selected = groups.flatMap((group) =>
      group.options
        .filter((option) => value[group.id]?.includes(option.value))
        .map((option) => ({ group, option }))
    );
    return selected.map(({ group, option }, index) => {
      const label = tagLabel(group.label, option.label);
      return {
        label,
        type: 'gray' as const,
        size: 'md',
        // Carbon names the dismiss button with `title`, or with
        // `dismissTooltipLabel` when the tag text is truncated.
        title: removeFilter(label),
        dismissTooltipLabel: removeFilter(label),
        onClose: () => {
          // TagSet keys its tags by position, so the focused button usually
          // stays and shows the next tag; else the tag in its place, the last
          // shown tag, or the root.
          refocus.current = () => focusShownTag(rootRef.current, prefix, index);
          const rest = value[group.id]?.filter((item) => item !== option.value);
          onChange(setGroup(value, group.id, rest ?? []));
        },
      };
    });
  }, [groups, value, onChange, tagLabel, removeFilter, refocus, prefix]);

  const onOverflowTagChange = useCallback((overflow: ReactNode) => {
    setOverflowCount(Array.isArray(overflow) ? overflow.length : 0);
  }, []);

  const clearFilters = () => {
    rootRef.current?.focus();
    setMultiline(false);
    onChange({});
  };

  const block = `${productsPrefix}--filter-summary`;
  const hasTags = tags.length > 0;
  useLayoutEffect(() => {
    setClearWidth(clearRef.current?.offsetWidth ?? 0);
  }, [hasTags, text.clearFilters]);
  // IBM's classes only while there are tags: its bar has a fixed height.
  const classes = [
    'afframe-filter-summary',
    hasTags && block,
    hasTags && multiline && `${block}__expanded`,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  // As IBM's FilterSummary: TagSet leaves room for Clear filters and, while
  // tags overflow, the 48 px View all button.
  const measurementOffset = clearWidth + (overflowCount > 0 ? 48 : 0);

  return (
    <div
      role="group"
      aria-label={text.selectedFilters}
      tabIndex={-1}
      {...rest}
      ref={mergedRef}
      className={classes}>
      {hasTags && (
        <>
          <div>
            <TagSet
              key={multiline ? 'multiline' : 'single'}
              tags={tags}
              overflowType="tag"
              multiline={multiline}
              containingElementRef={rootRef}
              measurementOffset={measurementOffset}
              // A multiline TagSet reports no overflow. Keeping the one-line
              // count keeps View all mounted, and focused, as it collapses.
              {...(!multiline && { onOverflowTagChange })}
              showAllTagsLabel={text.showAllTags}
              allTagsModalTitle={text.allTagsModalTitle}
              allTagsModalSearchLabel={text.allTagsModalSearchLabel}
              allTagsModalSearchPlaceholderText={
                text.allTagsModalSearchPlaceholder
              }
              className={`${block}__clear-button-inline`}
            />
          </div>
          <Button
            ref={clearRef}
            kind="ghost"
            size="sm"
            onClick={clearFilters}
            className={`${block}__clear-all-button`}>
            {text.clearFilters}
          </Button>
          {(overflowCount > 0 || multiline) && (
            <div className={`${block}__view-all--wrapper`}>
              <IconButton
                kind="ghost"
                size="sm"
                align="left"
                label={text.viewAll}
                aria-expanded={multiline}
                onClick={() => {
                  if (multiline)
                    refocus.current = () => rootRef.current?.focus();
                  setMultiline(!multiline);
                }}
                className={`${block}__view-all--trigger`}>
                <ChevronDown
                  className={`${block}__view-all--chevron${multiline ? ` ${block}__view-all--chevron-multiline` : ''}`}
                />
              </IconButton>
            </div>
          )}
        </>
      )}
    </div>
  );
}
