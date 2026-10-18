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
 * Modified by Afframe in 2026: from tanstack-carbon react/filterPanel FilterColumn (FilterPanel.tsx) and WithFilterableMultiSelect.tsx; one field per FilterPanel group variant on the value helpers instead of column filters, group labels and useId ids, radio, date range and slider added, text from messages. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */
import {
  Checkbox,
  DatePickerInput,
  Dropdown,
  FilterableMultiSelect,
  MultiSelect,
  NumberInput,
  RadioButton,
  Search,
  Slider,
  TextInput,
  usePrefix,
} from '@carbon/react';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  civilDateToLocalDate,
  formatNumber,
  localDateToCivilDate,
} from '../../format/index.js';
import type { CivilDate } from '../../format/index.js';
import { DatePicker } from '../DatePicker/index.js';
import type { FilterPanelMessages } from './FilterPanel.js';
import { checkedValues, isoDay, selectedOptions } from './value.js';
import type {
  FilterPanelFieldValue,
  FilterPanelGroup,
  FilterPanelOption,
} from './value.js';

type Variant = NonNullable<FilterPanelGroup['variant']>;
type GroupOf<V extends Variant> = Extract<FilterPanelGroup, { variant?: V }>;

interface FieldProps<G extends FilterPanelGroup = FilterPanelGroup> {
  group: G;
  field: FilterPanelFieldValue | undefined;
  /** `undefined` or an empty value removes the group's filter. */
  onChange: (field: FilterPanelFieldValue | undefined) => void;
  /** Unique per panel and group. */
  id: string;
  text: FilterPanelMessages;
  /** Accordion layout: the item title names the group, so labels are visually hidden. */
  hideLabel: boolean;
}

function GroupFieldset({
  legend,
  hideLabel,
  children,
}: {
  legend: string;
  hideLabel: boolean;
  children: ReactNode;
}) {
  const prefix = usePrefix();
  return (
    <fieldset className="afframe-filter-panel-fieldset">
      <legend
        className={
          hideLabel
            ? `${prefix}--visually-hidden`
            : `${prefix}--label afframe-filter-panel-legend`
        }>
        {legend}
      </legend>
      {children}
    </fieldset>
  );
}

function useOptionSearch(
  { label, options, searchable }: GroupOf<'checkbox' | 'radio'>,
  id: string,
  text: FilterPanelMessages
) {
  const [query, setQuery] = useState('');
  const needle = query.trim().toLowerCase();
  const shown = needle
    ? options.filter((option) => option.label.toLowerCase().includes(needle))
    : options;
  const search = searchable && (
    <Search
      id={`${id}-search`}
      size="sm"
      labelText={text.searchLabel(label)}
      placeholder={text.searchPlaceholder}
      closeButtonLabelText={text.clearSearch}
      value={query}
      onChange={(event) => setQuery(event.target.value)}
      className="afframe-filter-panel-search"
    />
  );
  const empty = shown.length === 0 && (
    <p className="afframe-filter-panel-empty">{text.noMatches}</p>
  );
  return { search, empty, shown };
}

function CheckboxField(props: FieldProps<GroupOf<'checkbox'>>) {
  const { group, field, onChange, id, text, hideLabel } = props;
  const { search, empty, shown } = useOptionSearch(group, id, text);
  const selected = checkedValues(field);
  return (
    <GroupFieldset legend={group.label} hideLabel={hideLabel}>
      {search}
      <div className="afframe-filter-panel-options">
        {shown.map((option) => (
          <Checkbox
            key={option.value}
            id={`${id}-${group.options.indexOf(option)}`}
            labelText={option.label}
            checked={selected.includes(option.value)}
            onChange={(_event, { checked }) =>
              onChange(
                checked
                  ? [...selected, option.value]
                  : selected.filter((item) => item !== option.value)
              )
            }
          />
        ))}
        {empty}
      </div>
    </GroupFieldset>
  );
}

function RadioField(props: FieldProps<GroupOf<'radio'>>) {
  const { group, field, onChange, id, text, hideLabel } = props;
  const { search, empty, shown } = useOptionSearch(group, id, text);
  return (
    <GroupFieldset legend={group.label} hideLabel={hideLabel}>
      {search}
      <div className="afframe-filter-panel-options">
        <RadioButton
          id={`${id}-all`}
          name={id}
          value=""
          labelText={text.allOption}
          checked={field === undefined}
          onChange={() => onChange(undefined)}
        />
        {shown.map((option) => (
          <RadioButton
            key={option.value}
            id={`${id}-${group.options.indexOf(option)}`}
            name={id}
            value={option.value}
            labelText={option.label}
            checked={field === option.value}
            onChange={() => onChange(option.value)}
          />
        ))}
        {empty}
      </div>
    </GroupFieldset>
  );
}

const optionText = (option: FilterPanelOption | null) => option?.label ?? '';

// Carbon's ListBox message ids (ListBoxMenuIcon, ListBoxSelection).
const listBoxText = (text: FilterPanelMessages) => (messageId: string) =>
  ({
    'open.menu': text.openMenu,
    'close.menu': text.closeMenu,
    'clear.all': text.clearSelection,
    'clear.selection': text.clearSelection,
  })[messageId] ?? messageId;

function SelectField(props: FieldProps<GroupOf<'select'>>) {
  const { group, field, onChange, id, text, hideLabel } = props;
  // '' is no filter: setGroupValue removes it.
  const all = { value: '', label: text.allOption };
  return (
    // autoAlign keeps the menu inside a scrolling panel or flyout.
    <Dropdown<FilterPanelOption | null>
      id={id}
      titleText={group.label}
      hideLabel={hideLabel}
      label={text.selectPlaceholder}
      items={[all, ...group.options]}
      itemToString={optionText}
      // null, not undefined: Dropdown is controlled only with a defined item.
      // A value that matches no option shows the placeholder.
      selectedItem={
        field === undefined ? all : (selectedOptions(group, field)[0] ?? null)
      }
      onChange={({ selectedItem }) => onChange(selectedItem?.value)}
      translateWithId={listBoxText(text)}
      autoAlign
    />
  );
}

function MultiSelectField(props: FieldProps<GroupOf<'multiselect'>>) {
  const { group, field, onChange, id, text, hideLabel } = props;
  const shared = {
    id,
    titleText: group.label,
    hideLabel,
    items: [...group.options],
    itemToString: optionText,
    // The same objects as `items`, so the menu marks them selected.
    selectedItems: [...selectedOptions(group, field)],
    onChange: ({
      selectedItems,
    }: {
      selectedItems: FilterPanelOption[] | null;
    }) => onChange((selectedItems ?? []).map((option) => option.value)),
    translateWithId: listBoxText(text),
    autoAlign: true,
  };
  return group.searchable ? (
    <FilterableMultiSelect<FilterPanelOption>
      {...shared}
      placeholder={text.multiselectPlaceholder}
      // Carbon's label also holds a hidden selection count, which would end
      // up in the input's name; MultiSelect is named by the label alone.
      inputProps={{ 'aria-label': group.label }}
    />
  ) : (
    <MultiSelect<FilterPanelOption>
      {...shared}
      label={text.multiselectPlaceholder}
    />
  );
}

function TextField(props: FieldProps<GroupOf<'text'>>) {
  const { group, field, onChange, id, text, hideLabel } = props;
  const stored = typeof field === 'string' ? field : '';
  // The filter is the trimmed text; the input keeps the spaces as typed
  // until the value changes from outside (Clear, a tag).
  const [typed, setTyped] = useState(stored);
  return (
    <TextInput
      id={id}
      labelText={group.label}
      hideLabel={hideLabel}
      placeholder={group.placeholder ?? text.textPlaceholder(group.label)}
      value={typed.trim() === stored ? typed : stored}
      onChange={(event) => {
        setTyped(event.target.value);
        onChange(event.target.value.trim());
      }}
    />
  );
}

// fallow-ignore-next-line complexity -- optional min, max and step spread only when set (exactOptionalPropertyTypes)
function NumberField(props: FieldProps<GroupOf<'number'>>) {
  const { group, field, onChange, id, hideLabel } = props;
  return (
    <NumberInput
      id={id}
      label={group.label}
      hideLabel={hideLabel}
      hideSteppers
      allowEmpty
      {...(group.min !== undefined && { min: group.min })}
      {...(group.max !== undefined && { max: group.max })}
      {...(group.step !== undefined && { step: group.step })}
      value={typeof field === 'number' ? field : ''}
      onChange={(_event, { value }) =>
        onChange(value === '' ? undefined : Number(value))
      }
    />
  );
}

const toLocalDate = (day: string | null | undefined) => {
  const valid = isoDay(day);
  return valid === null ? undefined : civilDateToLocalDate(valid as CivilDate);
};

interface RangePicker {
  clear: (triggerChange: boolean) => void;
  formatDate: (date: Date, format: string) => string;
  parseDate: (text: string, format: string) => Date | undefined;
  isEnabled: (date: Date) => boolean;
  selectedDates: Date[];
  config: { dateFormat: string; errorHandler: (error: Error) => void };
}

const pickerOf = (input: HTMLElement | null) =>
  (input as { _flatpickr?: RangePicker } | null)?._flatpickr;

/** The day typed into an input, parsed strictly and enabled; else `null`. */
function typedDay(picker: RangePicker, text: string) {
  const { config } = picker;
  const { errorHandler } = config;
  // flatpickr reports text it cannot parse through errorHandler.
  config.errorHandler = () => {};
  try {
    const date = picker.parseDate(text, config.dateFormat);
    return date &&
      picker.formatDate(date, config.dateFormat) === text &&
      picker.isEnabled(date)
      ? localDateToCivilDate(date)
      : null;
  } finally {
    config.errorHandler = errorHandler;
  }
}

// fallow-ignore-next-line complexity -- end-only ranges: the picker holds no dates, the field owns End
function DateRangeField(props: FieldProps<GroupOf<'dateRange'>>) {
  const { group, field, onChange, id, text, hideLabel } = props;
  const [start, end] =
    typeof field === 'object' ? [isoDay(field[0]), isoDay(field[1])] : [];
  // flatpickr's range keeps its first date in Start, so an end-only range is
  // no picker date: the field writes and reads End, and merges a start
  // picked later.
  const endOnly = !start && end ? end : null;
  const { minDate, maxDate } = group;
  // Carbon sets the picker's dates on every new value object and redraws on
  // new bounds, which overwrites text kept invalid: same days, same Dates.
  const value = useMemo(
    () =>
      endOnly ? [] : [start, end].flatMap((day) => toLocalDate(day) ?? []),
    [start, end, endOnly]
  );
  const min = useMemo(() => toLocalDate(minDate), [minDate]);
  const max = useMemo(() => toLocalDate(maxDate), [maxDate]);
  const latest = useRef(onChange);
  useEffect(() => {
    latest.current = onChange;
  });
  const startInput = () => document.getElementById(`${id}-start`);
  const endInput = () =>
    document.getElementById(`${id}-end`) as HTMLInputElement | null;
  const writeEnd = (picker: RangePicker | undefined, day: string) => {
    const input = endInput();
    const date = toLocalDate(day);
    if (input && picker && date) {
      input.value = picker.formatDate(date, picker.config.dateFormat);
    }
  };
  // The calendar a day is picked from belongs to the input focused last.
  const lastFocused = useRef<'start' | 'end'>('start');
  const keepEndText = useRef(false);
  const wasEndOnly = useRef(endOnly);
  // A layout effect runs before Carbon's value effect. Emptied here without
  // a change event, the picker gives Carbon no dates to clear, so its
  // clear() does not report an empty range (flatpickr index.js:819) nor
  // start the range plugin's End-emptying timer (rangePlugin.js:106-110).
  useLayoutEffect(() => {
    const picker = pickerOf(startInput());
    if (endOnly && picker?.selectedDates.length) picker.clear(false);
    // From end-only to no range: nothing else empties End.
    if (wasEndOnly.current && !endOnly && !start && !keepEndText.current) {
      const input = endInput();
      if (input) input.value = '';
    }
    keepEndText.current = false;
    wasEndOnly.current = endOnly;
  });
  useEffect(() => {
    const focusStart = () => (lastFocused.current = 'start');
    const focusEnd = () => (lastFocused.current = 'end');
    const from = startInput();
    const to = endInput();
    from?.addEventListener('focus', focusStart);
    to?.addEventListener('focus', focusEnd);
    return () => {
      from?.removeEventListener('focus', focusStart);
      to?.removeEventListener('focus', focusEnd);
    };
  }, [id]);
  useEffect(() => {
    if (!endOnly) return;
    // Carbon creates its picker again right after mount (its start-input ref
    // sets state), and that empties both inputs: write End after it.
    queueMicrotask(() => writeEnd(pickerOf(startInput()), endOnly));
    const input = endInput();
    // The range plugin applies End only on Enter, and only with a picker
    // date (rangePlugin.js:55): leaving End applies it here. blur, not
    // change: the mask edits the value without input events.
    const leave = () => {
      const picker = pickerOf(startInput());
      if (!input || !picker) return;
      if (input.value === '') return latest.current(undefined);
      const day = typedDay(picker, input.value);
      if (day === endOnly) return;
      // Text that is no day removes the end, as the picker does for a range,
      // and stays as typed, marked invalid.
      if (day === null) keepEndText.current = true;
      latest.current(day === null ? undefined : [null, day]);
    };
    input?.addEventListener('blur', leave);
    return () => input?.removeEventListener('blur', leave);
    // Once per end-only day, not per render, so text typed into End stays.
  }, [endOnly, id]);
  return (
    <GroupFieldset legend={group.label} hideLabel={hideLabel}>
      <DatePicker
        datePickerType="range"
        // [] empties both inputs on Clear; Dates, not ISO text, because
        // flatpickr parses text in the picker's display format.
        value={value}
        {...(min && { minDate: min })}
        {...(max && { maxDate: max })}
        onChange={(dates, _text, picker) => {
          const [from, to] = dates.map(localDateToCivilDate);
          if (endOnly && from && !to) {
            if (lastFocused.current === 'end') {
              // A new end typed or picked from End: still end-only.
              picker.clear(false);
              writeEnd(picker, from);
              onChange([null, from]);
              return;
            }
            if (from <= endOnly) {
              onChange([from, endOnly]);
              return;
            }
          }
          onChange([from ?? null, to ?? null]);
        }}>
        <DatePickerInput id={`${id}-start`} labelText={text.dateStart} />
        <DatePickerInput id={`${id}-end`} labelText={text.dateEnd} />
      </DatePicker>
    </GroupFieldset>
  );
}

function SliderField(props: FieldProps<GroupOf<'slider'>>) {
  const { group, field, onChange, id, text, hideLabel } = props;
  const value = typeof field === 'number' ? field : group.max;
  return (
    <GroupFieldset legend={group.label} hideLabel={hideLabel}>
      <Slider
        id={id}
        labelText={group.label}
        hideLabel
        min={group.min}
        max={group.max}
        {...(group.step !== undefined && { step: group.step })}
        value={value}
        onChange={({ value: next }) => onChange(next)}
      />
      <div className="afframe-filter-panel-slider-range">
        <span>
          {text.sliderMin}: {formatNumber(group.min)}
        </span>
        <span>
          {text.sliderMax}: {formatNumber(value)}
        </span>
      </div>
    </GroupFieldset>
  );
}

const fields: {
  [V in Variant]: (props: FieldProps<GroupOf<V>>) => ReactNode;
} = {
  checkbox: CheckboxField,
  radio: RadioField,
  select: SelectField,
  multiselect: MultiSelectField,
  text: TextField,
  number: NumberField,
  dateRange: DateRangeField,
  slider: SliderField,
};

/** The field of one filter group, by its variant (default `checkbox`). */
export function FilterField(props: FieldProps) {
  const Field = fields[props.group.variant ?? 'checkbox'] as (
    props: FieldProps
  ) => ReactNode;
  return <Field {...props} />;
}
