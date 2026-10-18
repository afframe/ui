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
 * Modified by Afframe in 2026: from tanstack-carbon react/filterPanel FilterPanel.tsx (toolbar filter button and the no-results empty state); groups built from column meta and the core rows, column filters merged with the grid's other filters, aria-expanded and a count in the button name, focus to the panel title on open and to the button on Close, Apply and Clear, an inline panel in a grid layout without animation, text from messages. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */
import { Filter } from '@carbon/icons-react';
import { IconButton } from '@carbon/react';
import type {
  Column,
  ReactTable,
  Row,
  RowData,
  StockFeatures,
} from '@tanstack/react-table';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { ReactNode, RefObject } from 'react';
import { resolveMessages } from '../../messages.js';
import {
  defaultFilterFlyoutMessages,
  LiveStatus,
  type FilterFlyoutMessages,
} from '../FilterPanel/FilterFlyout.js';
import {
  FilterPanel,
  type FilterPanelProps,
} from '../FilterPanel/FilterPanel.js';
import type { FilterSummaryMessages } from '../FilterPanel/FilterSummary.js';
import { countFilterPanelSelections } from '../FilterPanel/value.js';
import type {
  FilterPanelFieldValue,
  FilterPanelGroup,
  FilterPanelValue,
} from '../FilterPanel/value.js';
import type { DataGridColumnFilter, DataGridColumnMeta } from './DataGrid.js';

/** Settings of the filter panel that `dataGridFilterPanel` adds. */
export interface DataGridFilterPanelSettings extends Pick<
  FilterPanelProps,
  'updateMethod' | 'layout' | 'headingLevel'
> {
  /** Opens the panel on first render. */
  defaultOpen?: boolean;
  /** Panel text, and the toolbar button's name in `toggle`. */
  messages?: Partial<FilterFlyoutMessages>;
  /** Text of the grid's own FilterSummary. */
  summaryMessages?: Partial<FilterSummaryMessages>;
}

type GridColumn<TData extends RowData> = Column<StockFeatures, TData>;
interface AnyColumnDef {
  meta?: unknown;
  filterFn?: unknown;
  columns?: AnyColumnDef[];
}

const filterOf = (meta: unknown) =>
  (meta as DataGridColumnMeta | undefined)?.filter;

const filterFnNames = {
  checkbox: 'inOptions',
  multiselect: 'inOptions',
  radio: 'inOptions',
  select: 'inOptions',
  text: 'includesString',
  number: 'weakEquals',
  dateRange: 'inDayRange',
  slider: 'lessThanOrEqualTo',
} as const;

/** Sets the filter function of the panel's columns that have none. */
export function withFilterFns<TColumns>(columns: TColumns): TColumns {
  const map = (defs: AnyColumnDef[]): AnyColumnDef[] =>
    defs.map((def) => {
      const filter = filterOf(def.meta);
      return {
        ...def,
        ...(def.columns && { columns: map(def.columns) }),
        ...(filter &&
          !('filterFn' in def) && {
            filterFn: filterFnNames[filter.variant ?? 'checkbox'],
          }),
      };
    });
  return map(columns as AnyColumnDef[]) as TColumns;
}

const collator = new Intl.Collator(undefined, { numeric: true });

// From the core rows, not the faceted ones: facets are narrowed by the other
// columns' filters, so a selected option and its tag would vanish.
function cellValues<TData extends RowData>(
  rows: Row<StockFeatures, TData>[],
  columnId: string
): unknown[] {
  return rows
    .flatMap((row) => {
      const value = row.getValue(columnId);
      return Array.isArray(value) ? value : [value];
    })
    .filter((value) => value != null && value !== '');
}

function optionsOf(values: unknown[]) {
  return [...new Set(values.map(String))]
    .sort(collator.compare)
    .map((value) => ({ value, label: value }));
}

const optionVariants = new Set([
  undefined,
  'checkbox',
  'radio',
  'select',
  'multiselect',
]);

// fallow-ignore-next-line complexity -- slider bounds and options default per variant from the data
function groupOf(
  id: string,
  label: string,
  filter: DataGridColumnFilter,
  values: () => unknown[]
): FilterPanelGroup | undefined {
  const base = { ...filter, id, label: filter.label ?? label };
  if (base.variant === 'slider') {
    const numbers = values().filter((value) => typeof value === 'number');
    const some = numbers.length > 0;
    // reduce, not Math.min(...): a spread of every row can overflow the stack.
    const min =
      base.min ?? (some ? numbers.reduce((a, b) => Math.min(a, b)) : undefined);
    const max =
      base.max ?? (some ? numbers.reduce((a, b) => Math.max(a, b)) : undefined);
    // Carbon's Slider needs both bounds: no numbers, no group.
    return min === undefined || max === undefined
      ? undefined
      : { ...base, min, max };
  }
  if (optionVariants.has(base.variant) && 'options' in base === false)
    return { ...base, options: optionsOf(values()) } as FilterPanelGroup;
  return base as FilterPanelGroup;
}

interface FilterPanelState {
  groups: FilterPanelGroup[];
  value: FilterPanelValue;
  messages: FilterFlyoutMessages;
  onChange: (value: FilterPanelValue) => void;
  open: boolean;
  setOpen: (open: boolean, focus: 'title' | 'trigger') => void;
  triggerRef: RefObject<HTMLButtonElement | null>;
  panelId: string;
}

/**
 * The panel's groups and value from the table's columns and column filters,
 * and its open state; `undefined` unless a column has `meta.filter` and
 * column filtering is registered.
 */
// fallow-ignore-next-line complexity -- open-state focus effect and the feature and column checks
export function useFilterPanel<TData extends RowData>(
  table: ReactTable<StockFeatures, TData>,
  label: (column: GridColumn<TData>) => string,
  settings: DataGridFilterPanelSettings | undefined
): FilterPanelState | undefined {
  const [open, setOpenState] = useState(settings?.defaultOpen ?? false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const focusTitle = useRef(false);
  const panelId = useId();
  useEffect(() => {
    if (!open || !focusTitle.current) return;
    focusTitle.current = false;
    const title = document
      .getElementById(panelId)
      ?.getAttribute('aria-labelledby');
    if (title) document.getElementById(title)?.focus();
  }, [open, panelId]);

  const filtering = 'columnFilteringFeature' in table._features;
  const leafColumns = table.getAllLeafColumns();
  const coreRows = table.getCoreRowModel();
  // Scans every core row: once per data or column change, not per render.
  const { ids, groups } = useMemo(() => {
    const columns = filtering
      ? leafColumns.filter((column) => filterOf(column.columnDef.meta))
      : [];
    return {
      // Every filter column, also one without a group: its filter stays
      // under the panel's Clear.
      ids: new Set(columns.map((column) => column.id)),
      groups: columns.flatMap((column) => {
        const group = groupOf(
          column.id,
          label(column),
          filterOf(column.columnDef.meta) as DataGridColumnFilter,
          () => cellValues(coreRows.flatRows, column.id)
        );
        return group ? [group] : [];
      }),
    };
  }, [filtering, leafColumns, coreRows, label]);
  if (ids.size === 0) return undefined;
  const value: FilterPanelValue = Object.fromEntries(
    table.state.columnFilters
      .filter((filter) => ids.has(filter.id))
      .map((filter) => [filter.id, filter.value as FilterPanelFieldValue])
  );
  return {
    groups,
    value,
    messages: resolveMessages(defaultFilterFlyoutMessages, settings?.messages),
    // Filters on the other columns stay.
    onChange: (next) =>
      table.setColumnFilters((previous) => [
        ...previous.filter((filter) => !ids.has(filter.id)),
        ...Object.entries(next).map(([id, item]) => ({ id, value: item })),
      ]),
    open,
    setOpen: (next, focus) => {
      setOpenState(next);
      if (focus === 'title') focusTitle.current = true;
      else triggerRef.current?.focus();
    },
    triggerRef,
    panelId,
  };
}

/** The toolbar button that opens and closes the panel. */
export function FilterPanelTrigger({ panel }: { panel: FilterPanelState }) {
  const { open } = panel;
  return (
    <IconButton
      ref={panel.triggerRef}
      kind="ghost"
      label={panel.messages.toggle(
        countFilterPanelSelections(panel.groups, panel.value)
      )}
      aria-expanded={open}
      // The panel is not in the DOM while closed.
      {...(open && { 'aria-controls': panel.panelId })}
      className={[
        'afframe-data-grid-filter-trigger',
        open && 'afframe-data-grid-filter-trigger--open',
      ]
        .filter(Boolean)
        .join(' ')}
      onClick={() => panel.setOpen(!open, 'title')}>
      <Filter />
    </IconButton>
  );
}

/**
 * The panel beside the table and pagination, and a status that announces
 * the result count while the panel is closed (the panel's own speaks while
 * it is open).
 */
// fallow-ignore-next-line complexity -- optional panel settings passed through, and the open state
export function FilterPanelLayout({
  panel,
  settings,
  resultCount,
  children,
}: {
  panel: FilterPanelState;
  settings: DataGridFilterPanelSettings | undefined;
  resultCount: number;
  children: ReactNode;
}) {
  const { open } = panel;
  const { updateMethod = 'batch', layout, headingLevel } = settings ?? {};
  return (
    <div
      className={[
        'afframe-data-grid-filter-layout',
        open && 'afframe-data-grid-filter-layout--open',
      ]
        .filter(Boolean)
        .join(' ')}>
      {open && (
        <FilterPanel
          id={panel.panelId}
          className="afframe-data-grid-filter-panel"
          groups={panel.groups}
          value={panel.value}
          // Batch Apply and Clear close the panel, as upstream.
          onChange={(next) => {
            panel.onChange(next);
            if (updateMethod === 'batch') panel.setOpen(false, 'trigger');
          }}
          onClose={() => panel.setOpen(false, 'trigger')}
          resultCount={resultCount}
          messages={panel.messages}
          updateMethod={updateMethod}
          {...(layout && { layout })}
          {...(headingLevel && { headingLevel })}
        />
      )}
      <div className="afframe-data-grid-filter-main">{children}</div>
      <LiveStatus text={open ? '' : panel.messages.resultCount(resultCount)} />
    </div>
  );
}
