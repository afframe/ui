'use client';
import { usePrefix as useProductsPrefix } from '@carbon/ibm-products';
import { Close } from '@carbon/icons-react';
import {
  Accordion,
  AccordionItem,
  Button,
  ButtonSet,
  Checkbox,
  IconButton,
  Search,
  usePrefix,
} from '@carbon/react';
import { useId, useRef, useState } from 'react';
import type { ComponentPropsWithoutRef, Ref } from 'react';
import { resolveMessages } from '../../messages.js';
import { checkedValues, sameFilterValue, setGroupValue } from './value.js';
import type { FilterPanelGroup, FilterPanelValue } from './value.js';

export { countFilterPanelSelections } from './value.js';
export type {
  FilterPanelGroup,
  FilterPanelOption,
  FilterPanelValue,
} from './value.js';

export interface FilterPanelMessages {
  title: string;
  /** Accordion heading of a group; `count` is the number of selected options. */
  groupTitle: (label: string, count: number) => string;
  resultCount: (count: number) => string;
  searchLabel: (groupLabel: string) => string;
  searchPlaceholder: string;
  clearSearch: string;
  noMatches: string;
  /** Batch update: applies the draft. */
  apply: string;
  /** Batch update: discards the draft. */
  cancel: string;
  /** Label of the close button, shown when `onClose` is set. */
  close: string;
}

export const defaultFilterPanelMessages: FilterPanelMessages = {
  title: 'Filters',
  groupTitle: (label, count) => (count > 0 ? `${label} (${count})` : label),
  resultCount: (count) => (count === 1 ? '1 result' : `${count} results`),
  searchLabel: (groupLabel) => `Search ${groupLabel}`,
  searchPlaceholder: 'Search',
  clearSearch: 'Clear search',
  noMatches: 'No matching options',
  apply: 'Apply',
  cancel: 'Cancel',
  close: 'Close filter panel',
};

export interface FilterPanelProps extends Omit<
  ComponentPropsWithoutRef<'section'>,
  'onChange' | 'children'
> {
  /** Ref to the root `section`. */
  ref?: Ref<HTMLElement>;
  groups: readonly FilterPanelGroup[];
  value: FilterPanelValue;
  /** Called per toggle (`instant`) or on Apply (`batch`). */
  onChange: (value: FilterPanelValue) => void;
  /**
   * `instant` applies every toggle; `batch` keeps a draft until Apply, with
   * Apply and Cancel at the bottom. Default `instant`.
   */
  updateMethod?: 'batch' | 'instant';
  /** Batch update: called after Cancel restores the applied value. Keeps Cancel enabled. */
  onCancel?: () => void;
  /** Shows a close button in the title row; in batch update it discards the draft first. */
  onClose?: () => void;
  /** Number of results with the applied `value`; shown and announced when set. */
  resultCount?: number;
  messages?: Partial<FilterPanelMessages>;
  /** Level of the title heading. Default 2. */
  headingLevel?: 2 | 3;
  className?: string;
}

/** A side panel of checkbox filter groups, applied per toggle or in a batch. Controlled. */
// fallow-ignore-next-line complexity -- one render covers both update methods, search per group and the optional close button and count
export function FilterPanel({
  groups,
  value,
  onChange,
  updateMethod = 'instant',
  onCancel,
  onClose,
  resultCount,
  messages,
  headingLevel = 2,
  className,
  ref,
  ...rest
}: FilterPanelProps) {
  const text = resolveMessages(defaultFilterPanelMessages, messages);
  const prefix = usePrefix();
  const productsPrefix = useProductsPrefix();
  const id = useId();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const [search, setSearch] = useState<Record<string, string>>({});
  const batch = updateMethod === 'batch';

  // The draft follows an outside `value` change. Compared by content, so an
  // inline `value` object does not reset the draft on every render.
  const [applied, setApplied] = useState(value);
  const [draft, setDraft] = useState(value);
  if (!sameFilterValue(groups, applied, value)) {
    setApplied(value);
    setDraft(value);
  }
  const shown = batch ? draft : value;
  const dirty = batch && !sameFilterValue(groups, draft, value);

  const toggle = (
    group: FilterPanelGroup,
    optionValue: string,
    checked: boolean
  ) => {
    const current = checkedValues(shown[group.id]);
    const next = setGroupValue(
      shown,
      group,
      checked
        ? [...current, optionValue]
        : current.filter((item) => item !== optionValue)
    );
    if (batch) setDraft(next);
    else onChange(next);
  };

  // Apply and Cancel disable themselves, which would drop focus to the page.
  // The title takes it first, so a caller that moves focus on the callback
  // (the flyout returning it to its button) still wins.
  const apply = () => {
    titleRef.current?.focus();
    onChange(draft);
  };

  const cancel = () => {
    titleRef.current?.focus();
    setDraft(value);
    onCancel?.();
  };

  const close = () => {
    setDraft(value);
    onClose?.();
  };

  const classes = ['afframe-filter-panel', className].filter(Boolean).join(' ');
  const Heading = headingLevel === 3 ? 'h3' : 'h2';
  // IBM ActionSet (ibm-products 2.100.0, not exported) renders this markup
  // for two buttons in a medium set; its classes give the 64 px buttons.
  const actionSet = `${productsPrefix}--action-set`;
  const actionButton = `${actionSet}__action-button ${actionSet}__action-button--expressive`;

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
      <Accordion>
        {groups.map((group, groupIndex) => {
          if (group.variant && group.variant !== 'checkbox') return null;
          const groupSelected = checkedValues(shown[group.id]);
          const query = (search[group.id] ?? '').trim().toLowerCase();
          const options = query
            ? group.options.filter((option) =>
                option.label.toLowerCase().includes(query)
              )
            : group.options;
          return (
            <AccordionItem
              key={group.id}
              title={text.groupTitle(group.label, groupSelected.length)}
              open={group.defaultOpen ?? false}>
              {group.searchable && (
                <Search
                  id={`${id}-${groupIndex}-search`}
                  size="sm"
                  labelText={text.searchLabel(group.label)}
                  placeholder={text.searchPlaceholder}
                  closeButtonLabelText={text.clearSearch}
                  value={search[group.id] ?? ''}
                  onChange={(event) =>
                    setSearch({ ...search, [group.id]: event.target.value })
                  }
                  className="afframe-filter-panel-search"
                />
              )}
              <fieldset className="afframe-filter-panel-options">
                <legend className={`${prefix}--visually-hidden`}>
                  {group.label}
                </legend>
                {options.map((option) => (
                  <Checkbox
                    key={option.value}
                    id={`${id}-${groupIndex}-${group.options.indexOf(option)}`}
                    labelText={option.label}
                    checked={groupSelected.includes(option.value)}
                    onChange={(_event, { checked }) =>
                      toggle(group, option.value, checked)
                    }
                  />
                ))}
                {options.length === 0 && (
                  <p className="afframe-filter-panel-empty">{text.noMatches}</p>
                )}
              </fieldset>
            </AccordionItem>
          );
        })}
      </Accordion>
      {batch && (
        <ButtonSet
          className={`${actionSet} ${actionSet}--row-double ${actionSet}--md afframe-filter-panel-actions`}>
          <Button
            kind="secondary"
            isExpressive
            disabled={!dirty && !onCancel}
            onClick={cancel}
            className={actionButton}>
            {text.cancel}
          </Button>
          <Button
            kind="primary"
            isExpressive
            disabled={!dirty}
            onClick={apply}
            className={actionButton}>
            {text.apply}
          </Button>
        </ButtonSet>
      )}
    </section>
  );
}
