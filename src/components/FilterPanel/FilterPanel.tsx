'use client';
import {
  Accordion,
  AccordionItem,
  Button,
  Checkbox,
  DismissibleTag,
  Search,
  usePrefix,
} from '@carbon/react';
import { useId, useRef, useState } from 'react';
import { resolveMessages } from '../../messages.js';

/** One checkbox in a filter group. `value` is stored in `FilterPanelValue`. */
export interface FilterPanelOption {
  value: string;
  label: string;
}

/** A group of checkbox options, shown as one accordion item. */
export interface FilterPanelGroup {
  id: string;
  label: string;
  options: readonly FilterPanelOption[];
  /** Shows a search field that narrows the options by label. */
  searchable?: boolean;
  /** Opens the accordion item on first render. */
  defaultOpen?: boolean;
}

/** Selected option values per group id. A missing group has nothing selected. */
export type FilterPanelValue = Readonly<Record<string, readonly string[]>>;

export interface FilterPanelMessages {
  title: string;
  /** Accordion heading of a group; `count` is the number of selected options. */
  groupTitle: (label: string, count: number) => string;
  resultCount: (count: number) => string;
  selectedFilters: string;
  clearAll: string;
  removeFilter: (label: string) => string;
  searchLabel: (groupLabel: string) => string;
  searchPlaceholder: string;
  clearSearch: string;
  noMatches: string;
}

export const defaultFilterPanelMessages: FilterPanelMessages = {
  title: 'Filters',
  groupTitle: (label, count) => (count > 0 ? `${label} (${count})` : label),
  resultCount: (count) => (count === 1 ? '1 result' : `${count} results`),
  selectedFilters: 'Selected filters',
  clearAll: 'Clear all',
  removeFilter: (label) => `Remove filter ${label}`,
  searchLabel: (groupLabel) => `Search ${groupLabel}`,
  searchPlaceholder: 'Search',
  clearSearch: 'Clear search',
  noMatches: 'No matching options',
};

export interface FilterPanelProps {
  groups: readonly FilterPanelGroup[];
  value: FilterPanelValue;
  onChange: (value: FilterPanelValue) => void;
  /** Number of results with the current filters; shown and announced when set. */
  resultCount?: number;
  messages?: Partial<FilterPanelMessages>;
  className?: string;
}

/** Number of selected options across all groups; values matching no option are ignored. */
export function countFilterPanelSelections(
  groups: readonly FilterPanelGroup[],
  value: FilterPanelValue
): number {
  return groups.reduce(
    (sum, group) =>
      sum +
      group.options.filter((option) => value[group.id]?.includes(option.value))
        .length,
    0
  );
}

function setGroup(
  value: FilterPanelValue,
  groupId: string,
  selected: readonly string[]
): FilterPanelValue {
  return Object.fromEntries([
    ...Object.entries(value).filter(([key]) => key !== groupId),
    ...(selected.length > 0 ? [[groupId, selected]] : []),
  ]);
}

/** A side panel of checkbox filter groups with a dismissible summary. Controlled. */
export function FilterPanel({
  groups,
  value,
  onChange,
  resultCount,
  messages,
  className,
}: FilterPanelProps) {
  const text = resolveMessages(defaultFilterPanelMessages, messages);
  const prefix = usePrefix();
  const id = useId();
  const titleRef = useRef<HTMLHeadingElement>(null);
  const tagsRef = useRef<HTMLUListElement>(null);
  const [search, setSearch] = useState<Record<string, string>>({});

  const selected = groups.flatMap((group) =>
    group.options
      .filter((option) => value[group.id]?.includes(option.value))
      .map((option) => ({ group, option }))
  );

  const toggle = (groupId: string, optionValue: string, checked: boolean) => {
    const current = value[groupId] ?? [];
    const next = checked
      ? [...current, optionValue]
      : current.filter((item) => item !== optionValue);
    onChange(setGroup(value, groupId, next));
  };

  // Removing the focused tag would drop focus to the page, so focus moves to
  // the next tag, else the previous one, else the panel title first.
  const remove = (index: number, groupId: string, optionValue: string) => {
    const buttons = tagsRef.current?.querySelectorAll('button');
    const target = buttons?.[index + 1] ?? buttons?.[index - 1];
    (target ?? titleRef.current)?.focus();
    toggle(groupId, optionValue, false);
  };

  const clearAll = () => {
    titleRef.current?.focus();
    onChange({});
  };

  const classes = ['afframe-filter-panel', className].filter(Boolean).join(' ');

  return (
    <section className={classes} aria-labelledby={`${id}-title`}>
      <div className="afframe-filter-panel-header">
        <h2
          id={`${id}-title`}
          ref={titleRef}
          tabIndex={-1}
          className="afframe-filter-panel-title">
          {text.title}
        </h2>
        {resultCount !== undefined && (
          <p role="status" className="afframe-filter-panel-count">
            {text.resultCount(resultCount)}
          </p>
        )}
      </div>
      {selected.length > 0 && (
        <div className="afframe-filter-panel-summary">
          <ul
            ref={tagsRef}
            aria-label={text.selectedFilters}
            className="afframe-filter-panel-tags">
            {selected.map(({ group, option }, index) => (
              <li key={`${group.id}:${option.value}`}>
                <DismissibleTag
                  size="md"
                  type="high-contrast"
                  text={option.label}
                  title={text.removeFilter(option.label)}
                  dismissTooltipLabel={text.removeFilter(option.label)}
                  onClose={() => remove(index, group.id, option.value)}
                />
              </li>
            ))}
          </ul>
          <Button kind="ghost" size="sm" onClick={clearAll}>
            {text.clearAll}
          </Button>
        </div>
      )}
      <Accordion>
        {groups.map((group, groupIndex) => {
          const groupSelected = value[group.id] ?? [];
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
                      toggle(group.id, option.value, checked)
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
    </section>
  );
}
