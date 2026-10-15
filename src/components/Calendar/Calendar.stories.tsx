/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: Calendar and Tag from @afframe/ui (styles ship in the package CSS, so the calendar.scss import is dropped), CalendarView and the renderCell argument typed from the component props instead of the internal types file, `as any` casts and unused renderCell arguments removed, the g10 theme and background globals dropped (Afframe themes come from the toolbar), source tag, props table built from Labs' CalendarProps because docgen finds none. Apache-2.0 text: LICENSES/Apache-2.0.txt.
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
  // Docgen finds no props on the Labs re-export, so the props table is
  // built here; descriptions are from Labs' CalendarProps.
  argTypes: {
    ref: { table: { disable: true } },
    innerRef: { table: { disable: true } },
    containerRef: { table: { disable: true } },
    launcherRef: { table: { disable: true } },
    initialDate: {
      control: 'date',
      description: 'Initial value (defaults to today).',
      table: { type: { summary: 'Date | string | number' } },
    },
    getCurrentDate: {
      control: false,
      description:
        'The "now" value used for current-time indicator/highlight (defaults to new Date()).',
      table: { type: { summary: '() => Date' } },
    },
    onNavigate: {
      control: false,
      description: 'Called whenever navigation changes the "selected date".',
      table: { type: { summary: '(nextDate: Date) => void' } },
    },
    defaultView: {
      control: { type: 'select' },
      options: defaultViews,
      description: "Initial view (defaults to 'month').",
      table: { type: { summary: 'CalendarView' } },
    },
    onViewChange: {
      control: false,
      description: 'Trigger when view changes.',
      table: { type: { summary: '(nextView: CalendarView) => void' } },
    },
    views: {
      control: {
        type: 'check',
        options: defaultViews,
      },
      description: 'Allowed views (defaults to all). At least one is required.',
      table: {
        type: {
          summary: "('month' | 'week' | 'day' | 'threeDays' | 'workWeek')[]",
        },
      },
    },
    toolbar: {
      control: 'boolean',
      description: 'Show/hide toolbar (defaults to true).',
      table: { type: { summary: 'boolean' } },
    },
    rtl: {
      control: 'boolean',
      description: 'Right-to-left layout (defaults to false).',
      table: { type: { summary: 'boolean' } },
    },
    scrollToCurrentTime: {
      control: 'boolean',
      description:
        'Auto-scroll the time grid to "now" when entering today view (defaults to true).',
      table: { type: { summary: 'boolean' } },
    },
    region: {
      control: 'text',
      description:
        "Locale tag, e.g. 'en-US', 'ar', 'fr-FR' (defaults to browser locale).",
      table: { type: { summary: 'string' } },
    },
    formats: {
      control: false,
      description: 'Formatting rules for headers/labels.',
      table: { type: { summary: 'CalendarFormats' } },
    },
    weekStartsOn: {
      control: { type: 'select' },
      options: [0, 1, 2, 3, 4, 5, 6],
      description:
        "The index of the day that the week starts on (0 - Sunday, 1 - Monday, etc.). If not provided, it defaults to the locale's start day.",
      table: { type: { summary: '0 | 1 | 2 | 3 | 4 | 5 | 6' } },
    },
    renderCell: {
      control: false,
      description:
        'Optional slot to render cell contents (events, etc.). Called for every visible cell in all views.',
      table: {
        type: {
          summary:
            '(args: { view, date, start, end, isToday, isCurrentTimeSlot }) => ReactNode',
        },
      },
    },
    className: {
      control: false,
      description: 'Optional className passthrough.',
      table: { type: { summary: 'string' } },
    },
    stickyHeader: {
      control: 'boolean',
      description: 'Makes the header sticky.',
      table: { type: { summary: 'boolean' } },
    },
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
