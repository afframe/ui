# Accent demo notes

Method: `dist/styles.css` grep per component, then a screenshot diff of each demo element between two accents (blue vs purple, animations off). Static state only, plus clicked states for data-table (row selected), datepicker (open) and modal (open). Not covered: hover and keyboard focus, dark mode.

## Follows the accent (verified by screenshot diff)

| Component                                                | Token it reads                                         |
| -------------------------------------------------------- | ------------------------------------------------------ |
| Button primary, IconButton primary, modal primary button | `--cds-button-primary` (+ `-hover`, `-active`)         |
| Button ghost                                             | `--cds-link-primary` (text)                            |
| Link, Breadcrumb links                                   | `--cds-link-primary`, `--cds-link-primary-hover`       |
| TextInput                                                | `--cds-focus` (focus ring only, no static change)      |
| Tabs (selected underline)                                | `--cds-border-interactive`                             |
| ProgressIndicator, ProgressBar, Loading                  | `--cds-interactive`                                    |
| DatePicker selected day                                  | `--cds-button-primary`, `--cds-highlight`              |
| DataTable batch action bar                               | `--cds-background-brand` (shown after selecting a row) |

## Does not follow (token it reads)

| Component                                        | Token(s)                                                                       |
| ------------------------------------------------ | ------------------------------------------------------------------------------ |
| Button secondary                                 | `--cds-button-secondary`                                                       |
| Button tertiary                                  | `--cds-button-tertiary`, `--cds-button-focus-color`                            |
| Toggle (on)                                      | `--cds-support-success`                                                        |
| Checkbox (checked)                               | `--cds-icon-primary`                                                           |
| RadioButton (checked)                            | `--cds-icon-primary`                                                           |
| Slider thumb and handle                          | `--cds-layer-selected-inverse`                                                 |
| Tag blue                                         | `--cds-tag-background-blue`, `--cds-tag-color-blue`, `--cds-tag-border-blue`   |
| Inline, toast and actionable notification (info) | `--cds-background-inverse`, `--cds-support-info`, `--cds-support-info-inverse` |
| OverflowMenu                                     | `--cds-layer`, `--cds-focus` (focus only)                                      |
| Dropdown, ComboBox, selected item                | `--cds-layer-selected`                                                         |
| MultiSelect selected tags                        | `--cds-text-inverse` / tag tokens (neutral)                                    |
| Search, NumberInput                              | `--cds-field`, `--cds-focus` (focus only)                                      |
| Pagination                                       | `--cds-icon-primary`, `--cds-border-subtle`, `--cds-layer-hover`               |
| ContentSwitcher                                  | no accent token found in the selected rule (neutral inverse look)              |
| Accordion                                        | `--cds-focus` (focus only), `--cds-layer-hover`                                |
| SelectableTile (selected)                        | `--cds-layer-selected-inverse`, `--cds-icon-primary`                           |
| ClickableTile                                    | `--cds-layer-hover`, `--cds-icon-primary`                                      |
| DataTable selected row                           | `--cds-layer-selected`, `--cds-border-subtle-selected`                         |

Components that read only `--cds-focus` do change on keyboard focus (ring); statically they look the same.

To extend: add an entry to `src/Demos.tsx`, run the page, diff screenshots per `[data-demo=<id>]` between two accents, then add the row here.
