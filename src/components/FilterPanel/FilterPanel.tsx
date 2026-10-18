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
 * Modified by Afframe in 2026: from tanstack-carbon react/filterPanel FilterPanel.tsx (header, fields and Clear and Apply button set); controlled value with a draft per group, batch or instant update, flat or accordion layout, heading level, result count, focus to the title after Apply and Clear, text from messages, no panel animation. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */
import { Close } from '@carbon/icons-react';
import {
  Accordion,
  AccordionItem,
  Button,
  ButtonSet,
  IconButton,
  Layer,
} from '@carbon/react';
import { useId, useRef, useState } from 'react';
import type { ComponentPropsWithoutRef, Ref } from 'react';
import { resolveMessages } from '../../messages.js';
import { FilterField } from './fields.js';
import {
  countFilterPanelSelections,
  sameFilterValue,
  setGroupValue,
} from './value.js';
import type {
  FilterPanelFieldValue,
  FilterPanelGroup,
  FilterPanelValue,
} from './value.js';

export { countFilterPanelSelections } from './value.js';
export type { FilterPanelGroup, FilterPanelValue } from './value.js';

export interface FilterPanelMessages {
  title: string;
  /** Accordion heading of a group; `count` is the number of selected options, 1 for another set field. */
  groupTitle: (label: string, count: number) => string;
  resultCount: (count: number) => string;
  searchLabel: (groupLabel: string) => string;
  searchPlaceholder: string;
  clearSearch: string;
  noMatches: string;
  selectPlaceholder: string;
  multiselectPlaceholder: string;
  textPlaceholder: (groupLabel: string) => string;
  dateStart: string;
  dateEnd: string;
  /** Caption before the slider's minimum. */
  sliderMin: string;
  /** Caption before the slider's upper bound. */
  sliderMax: string;
  /** Batch update: applies the draft. */
  apply: string;
  /** Removes every filter. */
  clear: string;
  /** Label of the close button, shown when `onClose` is set. */
  close: string;
  /** Dropdown and multiselect menu button. */
  openMenu: string;
  closeMenu: string;
  /** Multiselect button that clears its selection. */
  clearSelection: string;
}

export const defaultFilterPanelMessages: FilterPanelMessages = {
  title: 'Filter',
  groupTitle: (label, count) => (count > 0 ? `${label} (${count})` : label),
  resultCount: (count) => (count === 1 ? '1 result' : `${count} results`),
  searchLabel: (groupLabel) => `Search ${groupLabel}`,
  searchPlaceholder: 'Search',
  clearSearch: 'Clear search',
  noMatches: 'No matching options',
  selectPlaceholder: 'Choose an option',
  multiselectPlaceholder: 'Choose options',
  textPlaceholder: (groupLabel) => `Filter ${groupLabel}`,
  dateStart: 'Start date',
  dateEnd: 'End date',
  sliderMin: 'Min',
  sliderMax: 'Max',
  apply: 'Apply',
  clear: 'Clear',
  close: 'Close',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  clearSelection: 'Clear all selected items',
};

export interface FilterPanelProps extends Omit<
  ComponentPropsWithoutRef<'section'>,
  'onChange' | 'children'
> {
  /** Ref to the root `section`. */
  ref?: Ref<HTMLElement>;
  groups: readonly FilterPanelGroup[];
  value: FilterPanelValue;
  /** Called on Apply and Clear (`batch`) or per change (`instant`). */
  onChange: (value: FilterPanelValue) => void;
  /**
   * `batch` keeps a draft until Apply, with Clear and Apply at the bottom;
   * `instant` applies every change, with Clear only. Default `batch`.
   */
  updateMethod?: 'batch' | 'instant';
  /** `flat` shows each group as a section; `accordion` as an accordion item. Default `flat`. */
  layout?: 'flat' | 'accordion';
  /** Shows a close button in the title row; in batch update it discards the draft first. */
  onClose?: () => void;
  /** Number of results with the applied `value`; shown and announced when set. */
  resultCount?: number;
  messages?: Partial<FilterPanelMessages>;
  /** Level of the title heading. Default 2. */
  headingLevel?: 2 | 3;
  className?: string;
}

const only = (value: FilterPanelValue, id: string): FilterPanelValue =>
  value[id] === undefined ? {} : { [id]: value[id] };

/** The draft with the groups whose applied value changed from `from` to `to`. */
function rebase(
  groups: readonly FilterPanelGroup[],
  draft: FilterPanelValue,
  from: FilterPanelValue,
  to: FilterPanelValue
): FilterPanelValue {
  return groups.reduce(
    (next, group) =>
      sameFilterValue(groups, only(from, group.id), only(to, group.id))
        ? next
        : setGroupValue(next, group, to[group.id]),
    draft
  );
}

/**
 * A side panel of filter fields, one per group, applied in a batch on Apply
 * or per change. Controlled.
 */
// fallow-ignore-next-line complexity -- both update methods, both layouts and the optional close button and count
export function FilterPanel({
  groups,
  value,
  onChange,
  updateMethod = 'batch',
  layout = 'flat',
  onClose,
  resultCount,
  messages,
  headingLevel = 2,
  className,
  ref,
  ...rest
}: FilterPanelProps) {
  const text = resolveMessages(defaultFilterPanelMessages, messages);
  const id = useId();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const batch = updateMethod === 'batch';

  // An outside `value` change reaches only the groups it changed; the others
  // keep their draft. Compared by content, so an inline `value` object does
  // not reset the draft on every render.
  const [applied, setApplied] = useState(value);
  const [draft, setDraft] = useState(value);
  if (!sameFilterValue(groups, applied, value)) {
    setApplied(value);
    setDraft(rebase(groups, draft, applied, value));
  }
  const shown = batch ? draft : value;
  const isEmpty = (filters: FilterPanelValue) =>
    sameFilterValue(groups, filters, {});
  const canApply = batch && !sameFilterValue(groups, draft, value);
  const canClear = !isEmpty(value) || (batch && !isEmpty(draft));

  const change = (
    group: FilterPanelGroup,
    field: FilterPanelFieldValue | undefined
  ) => {
    const next = setGroupValue(shown, group, field);
    if (batch) setDraft(next);
    else onChange(next);
  };

  // Apply and Clear disable themselves, which would drop focus to the page.
  // The title takes it first, so a caller that moves focus on the callback
  // (the flyout returning it to its button) still wins.
  const apply = () => {
    titleRef.current?.focus();
    onChange(draft);
  };

  const clear = () => {
    titleRef.current?.focus();
    setDraft({});
    onChange({});
  };

  const close = () => {
    setDraft(value);
    onClose?.();
  };

  const classes = ['afframe-filter-panel', className].filter(Boolean).join(' ');
  const Heading = headingLevel === 3 ? 'h3' : 'h2';
  const accordion = layout === 'accordion';

  const field = (group: FilterPanelGroup, index: number) => (
    <FilterField
      group={group}
      field={shown[group.id]}
      onChange={(next) => change(group, next)}
      id={`${id}-${index}`}
      text={text}
      hideLabel={accordion}
    />
  );

  return (
    <section
      aria-labelledby={`${id}-title`}
      {...rest}
      ref={ref}
      className={classes}>
      <div className="afframe-filter-panel-header">
        <div className="afframe-filter-panel-heading">
          <Heading
            id={`${id}-title`}
            ref={titleRef}
            tabIndex={-1}
            className="afframe-filter-panel-title">
            {text.title}
          </Heading>
          {resultCount !== undefined && (
            <p role="status" className="afframe-filter-panel-count">
              {text.resultCount(resultCount)}
            </p>
          )}
        </div>
        {onClose && (
          <IconButton
            kind="ghost"
            align="bottom-end"
            label={text.close}
            onClick={close}
            className="afframe-filter-panel-close">
            <Close />
          </IconButton>
        )}
      </div>
      {/* Fields take the next layer's colours, as upstream. */}
      <Layer className="afframe-filter-panel-fields">
        {accordion ? (
          <Accordion>
            {groups.map((group, index) => (
              <AccordionItem
                key={group.id}
                title={text.groupTitle(
                  group.label,
                  countFilterPanelSelections([group], shown)
                )}
                open={group.defaultOpen ?? false}>
                {field(group, index)}
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          groups.map((group, index) => (
            <div key={group.id} className="afframe-filter-panel-group">
              {field(group, index)}
            </div>
          ))
        )}
      </Layer>
      <ButtonSet className="afframe-filter-panel-actions">
        <Button
          kind="secondary"
          disabled={!canClear}
          onClick={clear}
          className="afframe-filter-panel-action">
          {text.clear}
        </Button>
        {batch && (
          <Button
            kind="primary"
            disabled={!canApply}
            onClick={apply}
            className="afframe-filter-panel-action">
            {text.apply}
          </Button>
        )}
      </ButtonSet>
    </section>
  );
}
