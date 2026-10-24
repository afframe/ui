import { ChooserTable, docsLink as link } from './chooser';

// Which form field fits a task, and which prop names each field uses. Every
// docs page of the family shows these two tables, so the guidance lives here
// and not in each MDX page. Prop names: Carbon 1.119, IBM Products 2.101.0
// and Labs TagInput type definitions.

const fieldRows = [
  [
    'One line of text',
    [link('TextInput', 'components-textinput')],
    link('FluidTextInput', 'components-fluid-inputs-fluidtextinput'),
  ],
  [
    'A password',
    [link('PasswordInput', 'components-passwordinput')],
    link('FluidPasswordInput', 'components-fluid-inputs-fluidpasswordinput'),
  ],
  [
    'Several lines of text',
    [link('TextArea', 'components-textarea')],
    link('FluidTextArea', 'components-fluid-inputs-fluidtextarea'),
  ],
  [
    'An amount of money',
    [link('AmountInput', 'components-amountinput')],
    'None',
  ],
  [
    'A count, quantity or percentage',
    [link('NumberInput', 'components-numberinput')],
    link('FluidNumberInput', 'components-fluid-inputs-fluidnumberinput'),
  ],
  [
    'A value in a range, picked by dragging',
    [link('Slider', 'components-slider')],
    'None',
  ],
  [
    'Search a page or a list',
    [link('Search', 'components-search')],
    link('FluidSearch', 'components-fluid-inputs-fluidsearch'),
  ],
  [
    'Search behind an icon that opens on click, where space is short',
    [link('ExpandableSearch', 'components-search')],
    'None',
  ],
  [
    'Search with scopes the user picks first',
    [link('previewCandidate__SearchBar', 'preview-previewcandidate-searchbar')],
    'None',
  ],
  [
    'Filter the rows of a data table',
    [link('TableToolbarSearch', 'components-datatable-filtering')],
    'None',
  ],
  [
    'Pick one of a few options, all shown',
    [link('RadioButton', 'components-radiobutton')],
    'None',
  ],
  [
    'Pick one option from a native list',
    [link('Select', 'components-select')],
    link('FluidSelect', 'components-fluid-inputs-fluidselect'),
  ],
  [
    'Pick one option from a styled list',
    [link('Dropdown', 'components-dropdown')],
    link('FluidDropdown', 'components-fluid-inputs-fluiddropdown'),
  ],
  [
    'Pick one option from a long list, typing to filter',
    [link('ComboBox', 'components-combobox')],
    link('FluidComboBox', 'components-fluid-inputs-fluidcombobox'),
  ],
  [
    'Pick several options from a list',
    [
      link('MultiSelect', 'components-multiselect'),
      ', ',
      link('FilterableMultiSelect', 'components-multiselect'),
    ],
    link('FluidMultiSelect', 'components-fluid-inputs-fluidmultiselect'),
  ],
  [
    'Pick several options, each on or off, saved with the form',
    [link('Checkbox', 'components-checkbox')],
    'None',
  ],
  [
    'Turn a setting on or off, effective at once',
    [link('Toggle', 'components-toggle')],
    'None',
  ],
  [
    'Free-form labels the user types',
    [link('TagInput', 'components-taginput')],
    'None',
  ],
  [
    'Edit one value in place, on a page that shows it',
    [link('EditInPlace', 'components-editinplace')],
    'None',
  ],
  [
    'A date or a time',
    [
      link('DatePicker', 'components-datepicker'),
      ', ',
      link('TimePicker', 'components-timepicker'),
    ],
    [
      link('FluidDatePicker', 'components-fluid-inputs-fluiddatepicker'),
      ', ',
      link('FluidTimePicker', 'components-fluid-inputs-fluidtimepicker'),
    ],
  ],
  [
    'Attach files to a form',
    [link('FileUploader', 'components-fileuploader')],
    'None',
  ],
  [
    'Import records from a file, in a dialog',
    [link('ImportModal', 'components-task-dialogs-importmodal')],
    'None',
  ],
  [
    'The form around the fields',
    [link('Form', 'components-form')],
    link('FluidForm', 'components-fluid-inputs-fluidform'),
  ],
  [
    'A group of related fields under one legend',
    [link('FormGroup', 'components-formgroup')],
    'None',
  ],
  [
    'A label for a control of your own',
    [link('FormLabel', 'components-formlabel')],
    'None',
  ],
];

const code = (...names: string[]) =>
  names.flatMap((name, i) => [i > 0 && ', ', <code key={name}>{name}</code>]);

const propRows = [
  [
    'Label',
    code('labelText'),
    'TextInput, PasswordInput, TextArea, Select, Checkbox, RadioButton, Toggle, Slider, Search, DatePickerInput, TimePicker, TagInput, EditInPlace, previewCandidate__SearchBar and the fluid twins of these',
  ],
  ['Label', code('label'), 'NumberInput, FluidNumberInput, AmountInput'],
  [
    'Label',
    code('titleText'),
    'Dropdown, ComboBox, MultiSelect, FilterableMultiSelect and their fluid twins',
  ],
  [
    'Group legend',
    code('legendText'),
    'CheckboxGroup, RadioButtonGroup, FormGroup',
  ],
  [
    'Title and description',
    code('labelTitle', 'labelDescription'),
    'FileUploader',
  ],
  [
    'Text in the closed field before a choice (not the label)',
    code('label'),
    'Dropdown, MultiSelect and their fluid twins',
  ],
  [
    'Text in the empty field',
    code('placeholder'),
    'TextInput, TextArea, Search, ComboBox, FilterableMultiSelect and their fluid twins',
  ],
  [
    'Text in the empty field, clear button label',
    code('placeholderText', 'clearButtonLabelText'),
    'previewCandidate__SearchBar (Search uses placeholder, closeButtonLabelText)',
  ],
  [
    'Warning state',
    code('warn', 'warnText'),
    'Every field with a warning state but TimePicker',
  ],
  [
    'Warning state',
    code('warning', 'warningText'),
    'TimePicker (FluidTimePicker uses warn)',
  ],
  [
    'Height',
    code('size'),
    'Standard fields; fluid fields have one fixed height',
  ],
  [
    'Compact menu items',
    code('isCondensed'),
    'FluidDropdown, FluidComboBox, FluidMultiSelect',
  ],
];

export function FieldChooser() {
  return (
    <>
      <ChooserTable
        caption="Which field"
        head={['Task', 'Component', 'Fluid twin']}
        rows={fieldRows}
      />
      <ChooserTable
        caption="Field props"
        head={['Meaning', 'Prop', 'Fields']}
        rows={propRows}
      />
    </>
  );
}
