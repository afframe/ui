'use client';
import { TagSet, usePrefix as useProductsPrefix } from '@carbon/ibm-products';
import { ChevronDown } from '@carbon/icons-react';
import { Button, IconButton } from '@carbon/react';
import { useCallback, useMemo, useRef, useState } from 'react';
import type { ComponentPropsWithoutRef, ReactNode, Ref } from 'react';
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
function focusShownTag(root: HTMLElement | null, index: number) {
  const shown = [
    ...(root?.querySelectorAll<HTMLButtonElement>(
      '[class$="--tag__close-icon"]'
    ) ?? []),
  ].filter((button) => !button.closest('[aria-hidden="true"]'));
  (shown[index] ?? root)?.focus();
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
  const productsPrefix = useProductsPrefix();
  const rootRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs(rootRef, ref);
  const clearRef = useRef<HTMLButtonElement>(null);
  const [overflowCount, setOverflowCount] = useState(0);
  const [multiline, setMultiline] = useState(false);
  const { tagLabel, removeFilter } = text;

  const tags = useMemo(() => {
    const selected = groups.flatMap((group) =>
      group.options
        .filter((option) => value[group.id]?.includes(option.value))
        .map((option) => ({ group, option }))
    );
    const last = selected.length - 1;
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
          // TagSet keys its tags by position, so after a dismiss the focused
          // button stays in place and shows the next tag. Only the last tag
          // moves focus: to the tag before it, else to the root.
          if (index === last) focusShownTag(rootRef.current, index - 1);
          const rest = value[group.id]?.filter((item) => item !== option.value);
          onChange(setGroup(value, group.id, rest ?? []));
        },
      };
    });
  }, [groups, value, onChange, tagLabel, removeFilter]);

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
  const measurementOffset =
    (clearRef.current?.offsetWidth ?? 0) + (overflowCount > 0 ? 48 : 0);

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
              onOverflowTagChange={onOverflowTagChange}
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
                onClick={() => setMultiline(overflowCount > 0 && !multiline)}
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
