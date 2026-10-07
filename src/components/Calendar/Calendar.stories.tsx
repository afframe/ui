/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: Calendar and Tag from @afframe/ui (styles ship in the package CSS, so the calendar.scss import is dropped), CalendarView and the renderCell argument typed from the component props instead of the internal types file, `as any` casts and unused renderCell arguments removed, the g10 theme and background globals dropped (Afframe themes come from the toolbar), source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ComponentProps, KeyboardEvent, MouseEvent } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Calendar, Tag } from '../../index.js';
import mdx from './Calendar.mdx';

type CalendarProps = ComponentProps<typeof Calendar>;
type CalendarView = NonNullable<CalendarProps['views']>[number];
type RenderCellArgs = Parameters<NonNullable<CalendarProps['renderCell']>>[0];

const defaultViews: CalendarView[] = [
  'month',
  'week',
  'workWeek',
  'day',
  'threeDays',
];

const meta: Meta<typeof Calendar> = {
  title: 'Components/Calendar',
  component: Calendar,
  tags: ['labs'],
  argTypes: {
    views: {
      control: {
        type: 'check',
        options: defaultViews,
      },
      description: 'Select enabled views (at least one required)',
    },
    defaultView: {
      control: { type: 'select' },
      options: defaultViews,
    },
    weekStartsOn: {
      control: { type: 'select' },
      options: [0, 1, 2, 3, 4, 5, 6], // 0=Sun, 1=Mon...
      description: 'Force start of week day (overrides locale)',
    },
    region: {
      control: 'text',
      description: 'Locale (e.g. en-US, fr-FR)',
    },
    initialDate: {
      control: 'date',
    },
    toolbar: { control: 'boolean' },
    stickyHeader: { control: 'boolean' },
    rtl: { control: 'boolean' },
    scrollToCurrentTime: { control: 'boolean' },
  },
  parameters: {
    layout: 'fullscreen',
    docs: { page: mdx },
  },
};

export default meta;

type Story = StoryObj<typeof Calendar>;

// Basic calendar without events
const renderBasicCalendar = (args: CalendarProps) => {
  const currentViews =
    args.views && args.views.length > 0
      ? args.views
      : (['month'] as CalendarView[]);

  const dateValue = args.initialDate ? new Date(args.initialDate) : new Date();

  return (
    <div style={{ height: '100vh' }}>
      <Calendar
        {...args}
        views={currentViews}
        initialDate={dateValue}
        key={`${args.defaultView}-${args.weekStartsOn}`}
      />
    </div>
  );
};

// Calendar with events
const renderCalendarWithEvents = (args: CalendarProps) => {
  const currentViews =
    args.views && args.views.length > 0
      ? args.views
      : (['month'] as CalendarView[]);

  const dateValue = args.initialDate ? new Date(args.initialDate) : new Date();

  const handleEventClick = (date: Date, event: MouseEvent | KeyboardEvent) => {
    event.stopPropagation();
    alert(
      `Event clicked on: ${date.toDateString()} at ${date.toLocaleTimeString()}`
    );
  };

  const renderCell = ({ view, start, isToday }: RenderCellArgs) => {
    const eventStartTime = 10;

    if (view === 'month') {
      if (!isToday) {
        return null;
      }
    } else {
      if (!isToday || start.getHours() !== eventStartTime) {
        return null;
      }
    }

    return (
      <Tag
        className="calendar-event-tag"
        type="blue"
        title="10:00 AM - Team Meeting"
        size="sm"
        onClick={(e: MouseEvent) => handleEventClick(start, e)}
        onKeyDown={(e: KeyboardEvent) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleEventClick(start, e);
          }
        }}
        style={{ cursor: 'pointer' }}>
        10:00 AM - Team Meeting
      </Tag>
    );
  };

  return (
    <div style={{ height: '100vh' }}>
      <Calendar
        {...args}
        views={currentViews}
        initialDate={dateValue}
        renderCell={renderCell}
        key={`${args.defaultView}-${args.weekStartsOn}`}
      />
    </div>
  );
};

export const Default: Story = {
  render: renderBasicCalendar,
  args: {
    views: ['month', 'week', 'day'],
    defaultView: 'month',
    toolbar: true,
    stickyHeader: true,
    region: 'en-US',
    weekStartsOn: 0,
  },
};

export const WeekStartsMonday: Story = {
  render: renderBasicCalendar,
  args: {
    ...Default.args,
    views: ['month', 'week'],
    weekStartsOn: 1,
  },
};

export const AllViews: Story = {
  render: renderBasicCalendar,
  args: {
    ...Default.args,
    views: defaultViews,
  },
};

export const WithEvents: Story = {
  parameters: {
    // Labs leaves the row header of the time grid's first half-row empty (week and day views).
    a11y: { config: { rules: [{ id: 'empty-table-header', enabled: false }] } },
  },
  render: renderCalendarWithEvents,
  args: {
    views: defaultViews,
    defaultView: 'week',
    toolbar: true,
    stickyHeader: true,
    region: 'en-US',
    weekStartsOn: 0,
  },
};
