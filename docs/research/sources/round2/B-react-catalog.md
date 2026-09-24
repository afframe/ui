# B · @carbon/react 1.117.0 catalog
Retrieved: 2026-09-24

Sources for every export name: `docs/research/sources/round2/react-exports.json` (365 total: 274 stable/base names + 91 `preview_`/`unstable_` duplicates of 43 unique preview groups). Cross-checked against `<npm pack>/carbon-react-1.117.0/package/{lib,es}/index.js` and per-component `lib/components/**/*.js` for `@deprecated` JSDoc. Grouped so that sub-parts (e.g. `TableRow`, `TableCell`) roll up under their parent (`DataTable`). All 365 raw names are accounted for across the groups below (verify: `jq -r '.all[]' react-exports.json | wc -l` = 365).

## Summary (counts, notable gaps)

- 365 raw exports -> ~140 groups after rolling up sub-components, skeletons, and preview/unstable duplicates into one row each.
- By kind: components ~150 (raw names, before grouping), hooks 9 (`useContextMenu`, `useFeatureFlag`, `useFeatureFlags`, `useIdPrefix`, `useLayer`, `usePrefersDarkScheme`, `usePrefix`, `useTheme`, plus preview-only `useLayoutDirection`), utilities 3 (`validateNumberSeparators`, `withComposedModalPresence`, `withModalPresence`), context/provider ~6 (`FormContext`, `PrefixContext`, `ThemeContext`, `ErrorBoundaryContext`, `ClassPrefix`, `IdPrefix`), type/constant ~8 (`ButtonKinds`, `ButtonSizes`, `ButtonTooltipAlignments`, `ButtonTooltipPositions`, `IconButtonKinds`, `GridSettings`, `ColumnHang`).
- Maturity: the package ships 43 distinct preview features, each exported twice (once as `preview_X`, once as `unstable_X` -- functionally identical aliases per `es/index.js`, e.g. `AILabel as preview__Slug, AILabel as unstable__Slug`). Two preview names (`preview__Slug`/`unstable__Slug`, `preview__SlugActions`, `preview__SlugContent`) are pure renames: the source re-exports the already-stable `AILabel`/`AILabelActions`/`AILabelContent` under the deprecated "Slug" name for backward compatibility -- confirmed in `lib/index.js`: `AILabel as preview__Slug, AILabelActions as preview__SlugActions, AILabelContent as preview__SlugContent`.
- `preview__DatePicker` maps to `next_exports` (the v12-track DatePicker rewrite) and `preview__Dialog` maps to `Dialog_exports` (native `<dialog>`-backed component gated by feature flag `enable-dialog-element`, default false, per `feature-flags.json`).
- Deprecated JSDoc (`@deprecated`) found inside 41 component source trees (props/subparts, not always the whole component): AILabel, Accordion, Button, Checkbox, CheckboxGroup, ComboBox, ComposedModal, ContentSwitcher, DataTable, DatePicker, DatePickerInput, Dialog, Dropdown, FeatureFlags, FileUploader, FluidMultiSelect, ListBox (internal, not exported), Loading, Menu, Modal, MultiSelect, Notification, NumberInput, OverflowMenu, PageHeader, Pagination, Popover, RadioButton, RadioButtonGroup, RadioTile, Search, Select, Slider, Tag, TextArea, TextInput, Tile, TimePicker, Tooltip, TreeView, UIShell (Header family). Most are deprecated *props* (e.g. a renamed callback), not deprecated components -- see "Deprecated and legacy exports" below for the clear cases.
- Gap: the 16 IBM-Products-migrated components slated for v12 core (ActionSet, NotificationsPanel, BigNumber, FullPageError, Coachmark, OptionsTile, InterstitialScreen, Guidebanner, Resizer, ScrollGradient, SidePanel, EditInPlace, Tearsheet, TagOverflow, UserAvatar, TruncatedText) exist as source directories/Sass partials (confirmed: `scss/components/` lists `TagOverflow`, `Tearsheet`, `guidebanner`, `interstitial-screen`, `full-page-error`, `options-tile`, `page-header`, etc.) but are **not** in `react-exports.json`'s runtime export list -- they ship no JS component yet in 1.117.0.
- Storybook: react.carbondesignsystem.com is confirmed live and is Carbon's official React Storybook (round-1 verified), but it is a client-rendered SPA -- `WebFetch` could not resolve individual `?path=/docs/...` deep links to confirm exact per-component slugs in this session. Links below use the base domain only; per-component paths are marked "(unverified deep link)".

## Catalog (by category)

Kind legend: C = component, H = hook, U = utility, X = context/provider, T = type/constant.

### Actions

| Group | Exports | Kind | Maturity | Storybook | Tag | Reason |
|---|---|---|---|---|---|---|
| Button | Button, ButtonKinds, ButtonSizes, ButtonSkeleton, ButtonTooltipAlignments, ButtonTooltipPositions, PrimaryButton, SecondaryButton, DangerButton | C, T | stable | react.carbondesignsystem.com (unverified deep link) | core | primary action primitive used everywhere in forms/toolbars |
| ButtonSet | ButtonSet | C | stable | react.carbondesignsystem.com (unverified deep link) | core | groups action buttons in dialogs/forms |
| IconButton | IconButton, IconButtonKinds | C, T | stable | react.carbondesignsystem.com (unverified deep link) | core | compact toolbar/table-row actions |
| ComboButton | ComboButton | C | stable | react.carbondesignsystem.com (unverified deep link) | optional | split-button pattern, useful in admin toolbars if needed |
| CopyButton / Copy | CopyButton, Copy | C | stable | react.carbondesignsystem.com (unverified deep link) | optional | copy-to-clipboard affordance for code/IDs in admin/settings views |

### Forms / Inputs

| Group | Exports | Kind | Maturity | Storybook | Tag | Reason |
|---|---|---|---|---|---|---|
| Checkbox | Checkbox, CheckboxGroup, CheckboxSkeleton, InlineCheckbox | C | stable (deprecated props found) | react.carbondesignsystem.com (unverified deep link) | core | standard form control for every settings/admin screen |
| ComboBox | ComboBox | C | stable (deprecated prop found) | react.carbondesignsystem.com (unverified deep link) | core | typeahead single-select, common in data-heavy forms |
| ControlledPasswordInput / PasswordInput | ControlledPasswordInput, PasswordInput | C | stable | react.carbondesignsystem.com (unverified deep link) | core | login/credential forms |
| DatePicker | DatePicker, DatePickerInput, DatePickerSkeleton | C | stable (deprecated props); v12-track rewrite in preview | react.carbondesignsystem.com (unverified deep link) | core | scheduling, filters, forms across a business platform |
| FluidDatePicker (preview) | preview__FluidDatePicker, preview__FluidDatePickerInput, preview__FluidDatePickerSkeleton (+ unstable_ aliases) | C | preview (`preview_`/`unstable_` prefix) | react.carbondesignsystem.com (unverified deep link) | optional | fluid/dense form variant, adopt once out of preview |
| next DatePicker (preview) | preview__DatePicker (= `next_exports`) (+ unstable_ alias) | C | preview, v12-track | react.carbondesignsystem.com (unverified deep link) | reference | v12 rewrite of DatePicker; track before committing to stable API |
| Dropdown | Dropdown, DropdownSkeleton | C | stable (deprecated prop) | react.carbondesignsystem.com (unverified deep link) | core | single-select control used throughout forms/filters |
| FluidDropdown (preview) | preview__FluidDropdown, preview__FluidDropdownSkeleton (+ unstable_) | C | preview | react.carbondesignsystem.com (unverified deep link) | optional | fluid form-field variant |
| FileUploader | FileUploader, FileUploaderButton, FileUploaderDropContainer, FileUploaderItem, FileUploaderSkeleton, Filename | C | stable (deprecated props); flag `enable-enhanced-file-uploader` (default false) | react.carbondesignsystem.com (unverified deep link) | core | document/attachment upload, common in business platforms |
| FilterableMultiSelect / MultiSelect | FilterableMultiSelect, MultiSelect | C | stable (deprecated props) | react.carbondesignsystem.com (unverified deep link) | core | multi-value filters/selects |
| FluidMultiSelect (preview) | preview__FluidMultiSelect, preview__FluidMultiSelectSkeleton (+ unstable_) | C | preview (deprecated prop also found inside) | react.carbondesignsystem.com (unverified deep link) | optional | fluid multi-select variant |
| Form | Form, FluidForm, FormContext, FormGroup, FormItem, FormLabel | C, X | stable | react.carbondesignsystem.com (unverified deep link) | core | base layout/context for every form in the platform |
| FluidComboBox (preview) | preview__FluidComboBox, preview__FluidComboBoxSkeleton (+ unstable_) | C | preview | react.carbondesignsystem.com (unverified deep link) | optional | fluid combo box variant |
| FluidNumberInput (preview) | preview__FluidNumberInput, preview__FluidNumberInputSkeleton (+ unstable_) | C | preview | react.carbondesignsystem.com (unverified deep link) | optional | fluid numeric input variant |
| FluidPasswordInput | FluidPasswordInput | C | stable | react.carbondesignsystem.com (unverified deep link) | optional | fluid-density password field |
| FluidSearch (preview) | preview__FluidSearch, preview__FluidSearchSkeleton (+ unstable_) | C | preview | react.carbondesignsystem.com (unverified deep link) | optional | fluid search field variant |
| FluidSelect (preview) | preview__FluidSelect, preview__FluidSelectSkeleton (+ unstable_) | C | preview | react.carbondesignsystem.com (unverified deep link) | optional | fluid select variant |
| FluidTextArea (preview) | preview__FluidTextArea, preview__FluidTextAreaSkeleton (+ unstable_) | C | preview | react.carbondesignsystem.com (unverified deep link) | optional | fluid textarea variant |
| FluidTextInput (preview) | preview__FluidTextInput, preview__FluidTextInputSkeleton (+ unstable_) | C | preview | react.carbondesignsystem.com (unverified deep link) | optional | fluid text input variant |
| FluidTimePicker (preview) | preview__FluidTimePicker, preview__FluidTimePickerSelect, preview__FluidTimePickerSkeleton (+ unstable_) | C | preview | react.carbondesignsystem.com (unverified deep link) | optional | fluid time picker variant |
| NumberInput | NumberInput, NumberInputSkeleton | C | stable (deprecated props) | react.carbondesignsystem.com (unverified deep link) | core | numeric entry (quantities, amounts) in forms/tables |
| RadioButton / RadioButtonGroup | RadioButton, RadioButtonGroup, RadioButtonSkeleton | C | stable (deprecated props) | react.carbondesignsystem.com (unverified deep link) | core | exclusive-choice control |
| Search | Search, SearchSkeleton, ExpandableSearch | C | stable (deprecated prop) | react.carbondesignsystem.com (unverified deep link) | core | search-as-you-type input for tables/nav |
| Select | Select, SelectItem, SelectItemGroup, SelectSkeleton | C | stable (deprecated prop) | react.carbondesignsystem.com (unverified deep link) | core | native-backed select, forms |
| Slider | Slider, SliderSkeleton | C | stable (deprecated props) | react.carbondesignsystem.com (unverified deep link) | optional | numeric range input, useful for settings/thresholds |
| Switch (form control) | Switch | C | stable | react.carbondesignsystem.com (unverified deep link) | core | used inside ContentSwitcher/IconSwitch; toggle-like control |
| TextArea | TextArea, TextAreaSkeleton | C | stable (deprecated prop) | react.carbondesignsystem.com (unverified deep link) | core | multi-line text entry |
| TextInput | TextInput, TextInputSkeleton | C | stable (deprecated prop) | react.carbondesignsystem.com (unverified deep link) | core | base text entry, most-used form field |
| TimePicker | TimePicker, TimePickerSelect | C | stable (deprecated props) | react.carbondesignsystem.com (unverified deep link) | core | scheduling forms |
| Toggle | Toggle, ToggleSkeleton, ToggleSmallSkeleton | C | stable | react.carbondesignsystem.com (unverified deep link) | core | boolean settings switches (admin/settings screens) |

### Data display

| Group | Exports | Kind | Maturity | Storybook | Tag | Reason |
|---|---|---|---|---|---|---|
| DataTable | DataTable, DataTableSkeleton, Table, TableActionList, TableBatchAction, TableBatchActions, TableBody, TableCell, TableContainer, TableDecoratorRow, TableExpandHeader, TableExpandRow, TableExpandedRow, TableHead, TableHeader, TableRow, TableSelectAll, TableSelectRow, TableSlugRow (deprecated name for AI-slug row), TableToolbar, TableToolbarAction, TableToolbarContent, TableToolbarMenu, TableToolbarSearch | C | stable (deprecated props; `TableSlugRow` is a deprecated legacy name) | react.carbondesignsystem.com (unverified deep link) | core | primary component for admin/dashboard record lists; largest single group (24 raw exports) |
| StructuredList | StructuredListBody, StructuredListCell, StructuredListHead, StructuredListInput, StructuredListRow, StructuredListSkeleton, StructuredListWrapper | C | stable | react.carbondesignsystem.com (unverified deep link) | core | simple key/value or record display, lighter than DataTable |
| Tag | Tag, TagSkeleton, DismissibleTag, OperationalTag, SelectableTag | C | stable (deprecated props) | react.carbondesignsystem.com (unverified deep link) | core | status/label chips for filters, table cells, settings |
| Tile | Tile, TileAboveTheFoldContent, TileBelowTheFoldContent, TileGroup, ClickableTile, ExpandableTile, RadioTile, SelectableTile | C | stable (deprecated props) | react.carbondesignsystem.com (unverified deep link) | core | card/tile layout for dashboards and pickers |
| TreeView | TreeView, TreeNode | C | stable (deprecated props); flag `enable-treeview-controllable` (default false) | react.carbondesignsystem.com (unverified deep link) | optional | hierarchical navigation (org charts, nested settings) |
| CodeSnippet | CodeSnippet, CodeSnippetSkeleton | C | stable | react.carbondesignsystem.com (unverified deep link) | optional | show config/API payloads, useful for admin/dev tooling |
| List | OrderedList, UnorderedList, ListItem | C | stable | react.carbondesignsystem.com (unverified deep link) | core | basic content list primitive |
| ContainedList | ContainedList, ContainedListItem | C | stable | react.carbondesignsystem.com (unverified deep link) | core | boxed list pattern for settings/menus |
| AspectRatio | AspectRatio | C | stable | react.carbondesignsystem.com (unverified deep link) | optional | media/dashboard tile sizing helper |

### Navigation

| Group | Exports | Kind | Maturity | Storybook | Tag | Reason |
|---|---|---|---|---|---|---|
| Header / UIShell | Header, HeaderContainer, HeaderGlobalAction, HeaderGlobalBar, HeaderMenu, HeaderMenuButton, HeaderMenuItem, HeaderName, HeaderNavigation, HeaderPanel, HeaderSideNavItems, SkipToContent | C | stable (deprecated props in UIShell family) | react.carbondesignsystem.com (unverified deep link) | core | top app shell for a business platform |
| SideNav | SideNav, SideNavDetails, SideNavDivider, SideNavFooter, SideNavHeader, SideNavIcon, SideNavItem, SideNavItems, SideNavLink, SideNavLinkText, SideNavMenu, SideNavMenuItem, SideNavSwitcher | C | stable | react.carbondesignsystem.com (unverified deep link) | core | primary left-nav for admin/dashboard shells |
| Switcher | Switcher, SwitcherDivider, SwitcherItem | C | stable | react.carbondesignsystem.com (unverified deep link) | optional | app-switcher pattern, useful once multiple platform apps exist |
| Breadcrumb | Breadcrumb, BreadcrumbItem, BreadcrumbSkeleton | C | stable | react.carbondesignsystem.com (unverified deep link) | core | location context in nested admin/settings pages |
| Tabs | Tabs, TabsSkeleton, TabsVertical, Tab, TabContent, TabList, TabListVertical, TabPanel, TabPanels, IconTab | C | stable | react.carbondesignsystem.com (unverified deep link) | core | in-page section navigation, common in settings/detail views |
| ContentSwitcher | ContentSwitcher, IconSwitch | C | stable (deprecated prop) | react.carbondesignsystem.com (unverified deep link) | core | compact view toggling (table/list/grid switch, etc.) |
| Pagination | Pagination, PaginationNav, PaginationSkeleton | C | stable (deprecated props); preview rewrite also exists | react.carbondesignsystem.com (unverified deep link) | core | required for any table/list of records |
| Pagination (preview rewrite) | preview_Pagination, preview_PageSelector (+ unstable_ aliases) | C | preview | react.carbondesignsystem.com (unverified deep link) | reference | next-gen pagination API; watch before adopting over stable Pagination |
| Menu | Menu, MenuButton, MenuItem, MenuItemDivider, MenuItemGroup, MenuItemRadioGroup, MenuItemSelectable | C | stable (deprecated props) | react.carbondesignsystem.com (unverified deep link) | core | context/dropdown menus for row actions, toolbars |
| OverflowMenu | OverflowMenu, OverflowMenuItem | C | stable (deprecated props); v12 rewrite in preview, flag `enable-v12-overflowmenu` (default false) | react.carbondesignsystem.com (unverified deep link) | core | row-level "more actions" pattern in tables |
| OverflowMenuV2 (preview) | preview_OverflowMenuV2 (+ unstable_) | C | preview, v12-gated | react.carbondesignsystem.com (unverified deep link) | reference | v12 replacement for OverflowMenu; track for migration timing |
| Link | Link | C | stable | react.carbondesignsystem.com (unverified deep link) | core | styled anchor, used everywhere |

### Overlays

| Group | Exports | Kind | Maturity | Storybook | Tag | Reason |
|---|---|---|---|---|---|---|
| Modal | Modal, ModalBody, ModalFooter, ModalHeader, ModalWrapper, ModalPresence, withModalPresence | C, U | stable (deprecated props) | react.carbondesignsystem.com (unverified deep link) | core | primary dialog pattern for forms/confirmations |
| ComposedModal | ComposedModal, ComposedModalPresence, withComposedModalPresence | C, U | stable (deprecated props) | react.carbondesignsystem.com (unverified deep link) | core | composable modal building block used under Modal |
| Dialog (preview, native `<dialog>`) | preview__Dialog (+ unstable_) | C | preview; flag `enable-dialog-element` (default false); deprecated props also found inside source | react.carbondesignsystem.com (unverified deep link) | reference | native-element-backed dialog track; watch before adopting |
| Popover | Popover, PopoverContent | C | stable (deprecated prop) | react.carbondesignsystem.com (unverified deep link) | core | positioned overlay primitive (menus, pickers) |
| Tooltip | Tooltip, DefinitionTooltip | C | stable (deprecated props) | react.carbondesignsystem.com (unverified deep link) | core | inline help text throughout forms/tables |
| Toggletip | Toggletip, ToggletipActions, ToggletipButton, ToggletipContent, ToggletipLabel | C | stable | react.carbondesignsystem.com (unverified deep link) | core | click-triggered contextual help/actions |

### Feedback / Notifications

| Group | Exports | Kind | Maturity | Storybook | Tag | Reason |
|---|---|---|---|---|---|---|
| Notification | ActionableNotification, InlineNotification, ToastNotification, NotificationActionButton, NotificationButton, Callout, StaticNotification | C | stable (deprecated props) | react.carbondesignsystem.com (unverified deep link) | core | system messages, form validation, async status in any business app |
| Loading | Loading, InlineLoading | C | stable (deprecated prop) | react.carbondesignsystem.com (unverified deep link) | core | async/loading state, used across data-fetching UI |
| ProgressBar / ProgressIndicator | ProgressBar, ProgressIndicator, ProgressIndicatorSkeleton, ProgressStep | C | stable | react.carbondesignsystem.com (unverified deep link) | core | multi-step forms/wizards, upload progress |
| Skeleton primitives | SkeletonIcon, SkeletonPlaceholder, SkeletonText, IconSkeleton | C | stable | react.carbondesignsystem.com (unverified deep link) | core | loading placeholders paired with most components' own `*Skeleton` |
| ErrorBoundary | ErrorBoundary, ErrorBoundaryContext | C, X | stable | react.carbondesignsystem.com (unverified deep link) | core | app-level error containment, important for a production platform |

### AI

| Group | Exports | Kind | Maturity | Storybook | Tag | Reason |
|---|---|---|---|---|---|---|
| AILabel | AILabel, AILabelActions, AILabelContent | C | stable (renamed from "Slug"; deprecated prop found) | react.carbondesignsystem.com (unverified deep link) | core | AI-generated-content affordance; directly relevant to platform AI features |
| AISkeleton | AISkeletonIcon, AISkeletonPlaceholder, AISkeletonText | C | stable | react.carbondesignsystem.com (unverified deep link) | core | loading state for AI-label/AI-content regions |
| ChatButton (preview) | preview__ChatButton, preview__ChatButtonSkeleton (+ unstable_) | C | preview | react.carbondesignsystem.com (unverified deep link) | optional | chat-entry-point affordance, relevant if platform adds an AI chat surface |
| IconIndicator / ShapeIndicator (preview) | preview__IconIndicator, preview__ShapeIndicator (+ unstable_) | C | preview | react.carbondesignsystem.com (unverified deep link) | optional | AI-state indicator primitives, pairs with AILabel |
| "Slug" legacy aliases (deprecated name) | preview__Slug, preview__SlugActions, preview__SlugContent (+ unstable_) | C | deprecated alias of AILabel/AILabelActions/AILabelContent | react.carbondesignsystem.com (unverified deep link) | out | pure back-compat re-export of AILabel under the old "Slug" name; use AILabel directly |

### Layout

| Group | Exports | Kind | Maturity | Storybook | Tag | Reason |
|---|---|---|---|---|---|---|
| Grid | Grid, FlexGrid, Row, Column, ColumnHang, GridSettings | C, T | stable | react.carbondesignsystem.com (unverified deep link) | core | page/dashboard layout grid (wraps `@carbon/grid` CSS) |
| Layer | Layer, useLayer | C, H | stable | react.carbondesignsystem.com (unverified deep link) | core | background-contrast layering token system used by nearly every component |
| Stack | Stack, HStack, VStack | C | stable | react.carbondesignsystem.com (unverified deep link) | core | flexbox spacing helper, common in forms/toolbars |
| Section / Heading | Section, Heading | C | stable | react.carbondesignsystem.com (unverified deep link) | core | semantic heading-level helpers for accessible page structure |
| Content | Content | C | stable | react.carbondesignsystem.com (unverified deep link) | optional | UIShell main-content wrapper |
| Layout (preview) | preview_Layout, preview_LayoutDirection, useLayoutDirection/preview_useLayoutDirection (+ unstable_) | C, H | preview | react.carbondesignsystem.com (unverified deep link) | optional | density/direction-aware layout primitives (RTL support) |

### Utilities

| Group | Exports | Kind | Maturity | Storybook | Tag | Reason |
|---|---|---|---|---|---|---|
| Theme | Theme, GlobalTheme, ThemeContext, useTheme, usePrefersDarkScheme | C, X, H | stable | react.carbondesignsystem.com (unverified deep link) | core | theme switching (white/g10/g90/g100), required for any themed platform |
| Prefix | ClassPrefix, PrefixContext, usePrefix | C, X, H | stable | react.carbondesignsystem.com (unverified deep link) | optional | CSS class prefix customization, relevant only if Afframe rebrands class names |
| IdPrefix | IdPrefix, useIdPrefix | C, H | stable | react.carbondesignsystem.com (unverified deep link) | optional | generated-id namespacing, relevant for multi-instance embeds |
| FeatureFlags | FeatureFlags, useFeatureFlag, useFeatureFlags, preview_FeatureFlags/unstable_FeatureFlags, preview_useFeatureFlag(s)/unstable_useFeatureFlag(s) | C, H | stable (deprecated usage patterns flagged in source) | react.carbondesignsystem.com (unverified deep link) | core | needed to opt into v12 flags (`enable-v12-release` etc.) and preview features |
| useContextMenu | useContextMenu | H | stable | react.carbondesignsystem.com (unverified deep link) | optional | right-click context menu hook, useful for admin/data-table interactions |
| validateNumberSeparators | validateNumberSeparators | U | stable | react.carbondesignsystem.com (unverified deep link) | optional | locale-aware number parsing helper for NumberInput |
| Text (preview) | preview_Text, preview_TextDirection (+ unstable_) | C | preview | react.carbondesignsystem.com (unverified deep link) | optional | direction-aware text primitive (RTL/i18n support) |
| PageHeader (preview) | preview__PageHeader (+ unstable_) | C | preview (deprecated prop in source) | react.carbondesignsystem.com (unverified deep link) | optional | detail-page header pattern, useful for admin/record-detail screens |
| Card (preview) | preview__Card | C | preview (`preview_`-only, no `unstable_` alias found for Card) | react.carbondesignsystem.com (unverified deep link) | core | generic content card, broadly useful for dashboards |

## Foundation packages

| Package | Version | What it provides | Pulled in transitively by @carbon/react? |
|---|---|---|---|
| @carbon/styles | 1.116.0 | Sass source for every component (`scss/components/<name>`), plus `_colors.scss`, `_layout.scss`, `_motion.scss`, `_spacing.scss`, `_theme.scss`, `_themes.scss`, `_zone.scss`, `_feature-flags.scss`, `_reset.scss`, `grid/`, `type/`, `utilities/`, `compat/`, `fonts/`. Confirmed dir listing includes the 16 not-yet-exported IBM-Products component partials (Tearsheet, TagOverflow, guidebanner, etc.), so Sass is ahead of the JS export surface. | Yes -- `@carbon/react/package.json` dependency `"@carbon/styles": "^1.116.0"` |
| @carbon/icons-react | 11.89.0 | React icon components. 2,643 individual `.js` files under `es/` in the installed copy (includes filled/outline/size/color variants and a `watson-health/` subdirectory; this is a raw file count, not a deduplicated "distinct icon" count). | Yes -- dependency `"@carbon/icons-react": "^11.89.0"` |
| @carbon/pictograms-react | 11.111.0 | React pictogram components (larger illustrative icons). Not present in the installed `pkg/rt/node_modules` snapshot used for this research, so file/count could not be verified directly; version confirmed via `00-inventory.json`. | No -- not a listed dependency of `@carbon/react` 1.117.0 (confirmed absent from its `package.json` dependencies) |
| @carbon/layout | 11.60.0 | Spacing/layout Sass tokens and breakpoint values, consumed by `@carbon/styles`. | Yes -- direct dependency `"@carbon/layout": "^11.60.0"` |
| @carbon/grid | 11.63.0 | CSS Grid/Flexbox grid system Sass; the React `Grid`/`FlexGrid`/`Row`/`Column` components in `@carbon/react` wrap this. | Not a direct dependency of `@carbon/react`'s package.json (it is consumed via `@carbon/styles`); version confirmed via `00-inventory.json` |
| @carbon/type | 11.68.0 | Typography Sass tokens/mixins, consumed by `@carbon/styles`. | Indirect, via `@carbon/styles` |
| @carbon/motion | 11.53.0 | Motion/easing-curve tokens, used by animated components (Modal, Notification, etc.). | Yes -- direct dependency `"@carbon/motion": "^11.53.0"` |
| @carbon/themes | 11.82.0 | Theme token definitions (white, g10, g90, g100) consumed by `@carbon/styles`/`_theme.scss`. | Indirect, via `@carbon/styles` |
| @carbon/colors | 11.59.0 | Raw color palette tokens underlying themes. | Indirect, via `@carbon/themes`/`@carbon/styles` |
| @carbon/utilities | 0.26.0 | Newer general-purpose Sass/CSS utilities package. | Yes -- direct dependency `"@carbon/utilities": "^0.26.0"` |
| @carbon/upgrade | 11.46.0 | Codemod/migration CLI tool for upgrading between Carbon versions (dev tool, not a runtime dependency). | No -- not a dependency of `@carbon/react` |
| @carbon/feature-flags | 1.10.0 | The flag registry (`enable-v11-release`, `enable-v12-release`, `enable-dialog-element`, etc., 17 flags total per `feature-flags.json`) that gates preview/v12 behavior inside `@carbon/react`. | Yes -- direct dependency `"@carbon/feature-flags": "^1.10.0"` |

Other confirmed `@carbon/react` runtime dependencies (non-Carbon foundation, for context): `@floating-ui/react` (Popover/Tooltip positioning), `downshift` (ComboBox/Dropdown/MultiSelect keyboard/a11y logic), `flatpickr` (DatePicker engine), `motion` (animation library, formerly Framer Motion), `tabbable`, `es-toolkit`, `react-fast-compare`, `classnames`, `copy-to-clipboard`, `invariant`. Peer dependencies: `react`/`react-dom` `^16.8.6 || ^17.0.1 || ^18.2.0 || ^19.0.0`, `react-is`, `sass ^1.33.0`.

## Deprecated and legacy exports

- `preview__Slug` / `unstable__Slug` / `preview__SlugActions` / `preview__SlugContent` (+ `unstable_` equivalents): confirmed pure re-exports of `AILabel`/`AILabelActions`/`AILabelContent` under the old "Slug" name (`AILabel as preview__Slug` in `lib/index.js`). Use `AILabel` directly; the Slug names exist only for backward compatibility during the Slug-to-AILabel rename.
- `TableSlugRow`: kept as a DataTable sub-export under the legacy "Slug" name even though the corresponding top-level component was renamed to AILabel; file is `DataTable/TableSlugRow.js`.
- `OverflowMenu` (stable) vs `OverflowMenuV2` (preview, gated by `enable-v12-overflowmenu`, default false): the v2 rewrite exists but is not yet the default; both are exported today.
- `Pagination` (stable) vs `preview_Pagination`/`preview_PageSelector`: a next-gen pagination API exists in preview alongside the stable one.
- `preview__DatePicker` = `next_exports`, a v12-track DatePicker rewrite, exported alongside the stable `DatePicker`.
- `preview__Dialog` = `Dialog_exports`, gated by feature flag `enable-dialog-element` (default false); contains its own internal `@deprecated` JSDoc on at least one prop, i.e. it is a preview feature that is itself already mid-revision.
- Components with `@deprecated` JSDoc found on one or more props/sub-parts (not whole-component deprecations unless noted): AILabel, Accordion, Button, Checkbox, CheckboxGroup, ComboBox, ComposedModal, ContentSwitcher, DataTable, DatePicker, DatePickerInput, Dialog(preview), Dropdown, FeatureFlags, FileUploader, FluidMultiSelect, Loading, Menu, Modal, MultiSelect, Notification, NumberInput, OverflowMenu, PageHeader(preview), Pagination, Popover, RadioButton, RadioButtonGroup, RadioTile, Search, Select, Slider, Tag, TextArea, TextInput, Tile, TimePicker, Tooltip, TreeView, and the UIShell/Header family. Exact deprecated prop names were not individually enumerated for all 41 in this pass (budget); flagged here as "check before using that specific prop."
- `ListBox` shows `@deprecated` markers in source but is an internal, non-exported implementation detail behind ComboBox/Dropdown/MultiSelect/Select -- not part of the public API surface, listed here only because it surfaced in the same grep.

## Open questions

- Exact per-component Storybook deep-link slugs (e.g. `?path=/docs/components-button--overview` vs some other convention) were not individually confirmed; `WebFetch` against react.carbondesignsystem.com returned only a generic client-rendered shell ("storybook - Storybook") in this session, insufficient to verify per-story paths. All Storybook links in this catalog point to the base domain only.
- @carbon/pictograms-react was not present in the local installed-package snapshot (`pkg/rt/node_modules`), so its icon/pictogram count could not be verified locally; only its npm version is confirmed.
- @carbon/icons-react's 2,643-file count is a raw `es/*.js` file count in the installed copy, not a de-duplicated "how many distinct icons" figure (each icon can have Filled/16/20/24/32 size variants as separate files); a precise distinct-icon count was not computed within budget.
- The exact list of deprecated prop names (vs. whole-component deprecation) was not enumerated per component; only presence/absence of `@deprecated` JSDoc per component directory was checked.
- @carbon/grid is not a direct `package.json` dependency of `@carbon/react` 1.117.0 in the unpacked source (only `@carbon/styles`, `@carbon/layout`, `@carbon/motion`, `@carbon/utilities`, `@carbon/feature-flags`, `@carbon/icons-react` are direct deps); its inclusion is inferred to be indirect via `@carbon/styles`, not independently confirmed by reading `@carbon/styles`'s own package.json in this pass.

## Sources

- docs/research/sources/round2/react-exports.json (365 export names, ground truth for this file)
- docs/research/sources/round2/feature-flags.json (17 flags, @carbon/feature-flags 1.10.0)
- <npm pack>/carbon-react-1.117.0/package/package.json (dependencies/peerDependencies)
- <npm pack>/carbon-react-1.117.0/package/lib/index.js and es/index.js (export aliasing, preview/unstable mapping)
- <npm pack>/carbon-react-1.117.0/package/lib/components/**/*.js (`@deprecated` JSDoc grep)
- <npm pack>/carbon-styles-1.116.0/package/scss/components (Sass component directory listing)
- docs/research/sources/round1/00-inventory.json (npm versions for foundation packages)
- <npm pack>/rt/node_modules/@carbon/icons-react/es (installed icon file count)
- https://react.carbondesignsystem.com (base domain confirmed reachable; per-component deep links unverified this session)
- docs/research/carbon-reference.md (round 1, sections 3.3, 3.6, Storybook/docs-hosting notes -- used for context only, not re-verified)
