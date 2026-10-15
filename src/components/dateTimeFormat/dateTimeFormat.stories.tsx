/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: copied from IBM Products' Date Time Format stories, TypeScript, dateTimeFormat and components from @afframe/ui, title by the export name, carbon tag, story names unified (Default, no storyName), the absolute style lists built by one helper, the time field a masked TimePicker with seconds instead of a TextInput with input guards, Dropdown label set (a required prop), scss styles replaced by date-time-format-story.css. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useMemo, useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import {
  DatePicker,
  DatePickerInput,
  Dropdown,
  TimePicker,
  dateTimeFormat,
} from '../../index.js';
import mdx from './dateTimeFormat.mdx';
import './date-time-format-story.css';

interface Option {
  label: string;
  value: string;
}

const localeOptions: Option[] = [
  { label: 'en-US / English (United States)', value: 'en-US' },
  { label: 'af-ZA / Afrikaans (South Africa)', value: 'af-ZA' },
  { label: 'de-DE / German (Germany)', value: 'de-DE' },
  { label: 'el-GR / Greek (Greece)', value: 'el-GR' },
  { label: 'en-GB / English (United Kingdom)', value: 'en-GB' },
  { label: 'en-IN / English (India)', value: 'en-IN' },
  { label: 'es-ES / Spanish (Spain)', value: 'es-ES' },
  { label: 'fr-CH / French (Switzerland)', value: 'fr-CH' },
  { label: 'fr-FR / French (France)', value: 'fr-FR' },
  { label: 'hi-IN / Hindi (India)', value: 'hi-IN' },
  { label: 'it-IT / Italian (Italy)', value: 'it-IT' },
  { label: 'ja-JP / Japanese (Japan)', value: 'ja-JP' },
  { label: 'ml-IN / Malayalam (India)', value: 'ml-IN' },
  { label: 'nl-NL / Dutch (Netherlands)', value: 'nl-NL' },
  { label: 'sv-SE / Swedish (Sweden)', value: 'sv-SE' },
  { label: 'zh-Hans / Chinese (Simplified)', value: 'zh-Hans' },
  { label: 'zh-Hant / Chinese (Traditional)', value: 'zh-Hant' },
];

const formatOptions: Option[] = [
  { label: 'Relative', value: 'relative' },
  { label: 'Absolute time', value: 'absolute-time' },
  { label: 'Absolute date', value: 'absolute-date' },
  { label: 'Absolute date and time', value: 'absolute-date-time' },
  { label: 'Date and time tooltip', value: 'absolute-tooltip' },
];

const outputStyles = ['full', 'long', 'medium', 'short'] as const;

const pad = (value: number) => String(value).padStart(2, '0');

const formatDateInputValue = (date: Date) =>
  `${pad(date.getMonth() + 1)}/${pad(date.getDate())}/${date.getFullYear()}`;

const formatTimeInputValue = (date: Date) =>
  `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

const isValidTimeInput = (value: string) => /^\d{2}:\d{2}:\d{2}$/.test(value);

const parseDateTime = (dateValue: string, timeValue: string) => {
  const [month = '01', day = '01', year = '1970'] = dateValue.split('/');
  const [hours = '00', minutes = '00', seconds = '00'] = timeValue.split(':');

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hours),
    Number(minutes),
    Number(seconds)
  );
};

// Each style of one absolute formatter, under IBM's lower-case labels.
const absoluteStyles = (
  format: (
    timestamp: Date,
    options: { locale: string; style?: (typeof outputStyles)[number] }
  ) => string,
  timestamp: Date,
  locale: string
) => ({
  default: format(timestamp, { locale }),
  ...Object.fromEntries(
    outputStyles.map((style) => [style, format(timestamp, { locale, style })])
  ),
});

// fallow-ignore-next-line complexity -- IBM's story, one branch per format
const getOutputValues = (
  timestamp: Date,
  locale: string,
  selectedFormat: string
): Record<string, string> => {
  const { absolute, relative } = dateTimeFormat;
  switch (selectedFormat) {
    case 'relative':
      return {
        Default: relative.format(timestamp, { locale }),
        Long: relative.format(timestamp, { locale, style: 'long' }),
        Short: relative.format(timestamp, { locale, style: 'short' }),
        Narrow: relative.format(timestamp, { locale, style: 'narrow' }),
      };
    case 'absolute-date':
      return absoluteStyles(absolute.formatDate, timestamp, locale);
    case 'absolute-time':
      return absoluteStyles(absolute.formatTime, timestamp, locale);
    case 'absolute-tooltip':
      return {
        Tooltip: absolute.format(timestamp, { locale, style: 'long' }),
      };
    default:
      return absoluteStyles(absolute.format, timestamp, locale);
  }
};

const DateTimeFormatDemo = () => {
  const [initialDate] = useState(() => new Date());
  const [dateValue, setDateValue] = useState(formatDateInputValue(initialDate));
  const [timeValue, setTimeValue] = useState(formatTimeInputValue(initialDate));
  const [locale, setLocale] = useState(localeOptions[0] as Option);
  const [selectedFormat, setSelectedFormat] = useState(
    formatOptions[0] as Option
  );

  const timestamp = useMemo(
    () => parseDateTime(dateValue, timeValue),
    [dateValue, timeValue]
  );

  const outputValues = useMemo(
    () => getOutputValues(timestamp, locale.value, selectedFormat.value),
    [timestamp, locale, selectedFormat]
  );

  return (
    <div className="date-time-format-story">
      <div className="date-time-format-story__panel">
        <div className="date-time-format-story__controls">
          <DatePicker
            datePickerType="single"
            value={dateValue}
            onChange={(selectedDates) => {
              if (selectedDates?.[0]) {
                setDateValue(formatDateInputValue(selectedDates[0]));
              }
            }}>
            <DatePickerInput
              id="date-time-format-date"
              labelText="Date"
              placeholder="mm/dd/yyyy"
            />
          </DatePicker>
          <TimePicker
            id="date-time-format-time"
            labelText="Time"
            seconds
            value={timeValue}
            onChange={(event) => setTimeValue(event.target.value)}
            onBlur={() => {
              if (!isValidTimeInput(timeValue)) {
                setTimeValue(formatTimeInputValue(new Date()));
              }
            }}
          />
          <Dropdown
            id="date-time-format-locale"
            titleText="Locale"
            label="Locale"
            items={localeOptions}
            itemToString={(item) => item?.label ?? ''}
            selectedItem={locale}
            onChange={({ selectedItem }) => {
              if (selectedItem) {
                setLocale(selectedItem);
              }
            }}
          />
          <Dropdown
            id="date-time-format-format"
            titleText="Format"
            label="Format"
            items={formatOptions}
            itemToString={(item) => item?.label ?? ''}
            selectedItem={selectedFormat}
            onChange={({ selectedItem }) => {
              if (selectedItem) {
                setSelectedFormat(selectedItem);
              }
            }}
          />
        </div>

        <div>
          <p className="date-time-format-story__output-label">Output</p>
          <div className="date-time-format-story__output-panel">
            {Object.entries(outputValues).map(([styleName, value]) => (
              <div
                key={styleName}
                className="date-time-format-story__output-group">
                <div className="date-time-format-story__output-name">
                  {styleName}
                </div>
                <div className="date-time-format-story__output-value">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default {
  title: 'Utilities/dateTimeFormat',
  component: DateTimeFormatDemo,
  tags: ['carbon'],
  parameters: {
    docs: {
      page: mdx,
    },
    layout: 'fullscreen',
  },
} satisfies Meta<typeof DateTimeFormatDemo>;

export const Default: StoryFn = () => <DateTimeFormatDemo />;
