import { ChooserTable, docsLink as link } from './chooser';

// Which date or time component fits a task. Every docs page of the family
// shows this one table, so the guidance lives here and not in each MDX page.

const rows = [
  [
    'Enter a date or a date range in a form, typed or picked from a calendar',
    link('DatePicker', 'components-datepicker'),
  ],
  [
    'A date or a date range in a fluid form',
    link('FluidDatePicker', 'components-fluid-inputs-fluiddatepicker'),
  ],
  [
    'Open the calendar from another control, such as a button',
    link('ControlledDatePicker', 'components-controlleddatepicker'),
  ],
  ['Enter a time of day', link('TimePicker', 'components-timepicker')],
  [
    'A time of day in a fluid form',
    link('FluidTimePicker', 'components-fluid-inputs-fluidtimepicker'),
  ],
  [
    'Show events in a month, week or day view. An event calendar, not a picker',
    link('Calendar', 'components-calendar'),
  ],
];

export function DateChooser() {
  return <ChooserTable head={['Task', 'Component']} rows={rows} />;
}
