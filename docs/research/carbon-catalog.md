# Carbon ecosystem catalog for a React design system

Retrieved 2026-09-24 · Sources: 6 research lanes (A v11 vs v12, B @carbon/react, C IBM Products, D Labs and extensions, E templates and patterns, F org triage) plus one adversarial verification pass (V), all in `docs/research/sources/round2/`. V overrides A to D wherever they disagree; every corrected or refuted lane claim is replaced by the verified fact here.
Tags (analysis for Hleb, not decisions):
- `core`: directly serves a React, latest-Carbon business-platform design system.
- `optional`: useful depending on a later decision (the decision is named).
- `reference`: worth learning from or copying ideas, not shipping.
- `out`: not for Afframe UI (other framework, IBM-internal, archived, marketing-only, deprecated, dead).

(unverified) = not confirmed from a primary source. Path shorthands as in V: `R` = `<npm pack>/carbon-react-1.117.0/package`, `S` = `.../carbon-styles-1.116.0/package`, `P` = `.../carbon-ibm-products-2.99.0/package`.

---

## 1. Summary

| Source | Items | core | optional | reference | out |
|---|---|---|---|---|---|
| @carbon/react 1.117.0 (groups, sections 2.2 to 2.9) | 69 groups from 365 exports | 57 | 8 | 0 | 4 |
| Foundation packages (section 3) | 12 (upgrade tagged in section 6) | 10 | 1 | 0 | 0 |
| IBM Products 2.99.0 (groups, section 4.1) | 36 groups from 151 exports; plus 44 deprecated exports in 4.2, all out | 17 | 15 | 2 | 2 |
| Carbon Labs (section 5) | 26 rows covering 35 packages | 1 | 16 | 4 | 5 |
| Extensions and tooling (section 6) | 21 rows | 4 | 5 | 4 | 8 |
| Org repos (section 8) | 121 repos | 4 | 8 | 20 | 89 (lane F row tags) |

- Newest installable Carbon for React is `@carbon/react` 1.117.0 (2026-09-23); npm `latest` = `next` = 1.117.0; no v12 package or tag exists. v12 today is the `enable-v12-release` flag family inside 1.117.0 plus a v12 Storybook that brands itself "@carbon/react v2.x". (V row 1; https://registry.npmjs.org/@carbon%2freact)
- v12 dated GitHub milestones (targets, not commitments): v12-alpha 2026-10-31, v12-rc.0 2026-11-12, v12-beta 2026-12-31, v12-stable 2027-03-31; `docs/release-schedule.md` still says TBD. (V row 4a; https://github.com/carbon-design-system/carbon/milestones)
- Full v12 styling needs the React flag AND a Sass build with `enable-v12-release: true`; the precompiled `css/styles.min.css` is v11-styled. The root flag also restyles form fields (rounded, fully bordered text-input and list-box), which `docs/migration/v12.md` does not document. (V rows 2b, 2c)
- The 17 components moving from IBM Products into core (PageHeader added 2026-09-24, #23209) are not in the published JS, flag on or off. Today: 15 via `@carbon/ibm-products` root exports (PageHeader as `preview__PageHeader`), Resizer via `@carbon-labs/react-resizer`, ActionSet not publicly exported. (V rows 3a, 3d)
- Of the 91 prefixed `@carbon/react` exports: 47 unique suffixes (44 `preview_`/`unstable_` pairs + 3 `preview_`-only); 31 are aliases of stable exports, only 16 are genuinely preview. (V rows 5b, 5d)
- IBM Products 2.99.0: 151 exports (10 `preview__`, 26 `previewCandidate__`); 35 unprefixed exports carry a whole-component deprecation marker, plus 9 prefixed exports that are themselves the deprecated implementations. (V row 6a and table)
- Datagrid component is `@deprecated` (runtime details point to tanstack-carbon); its 20 hooks carry no marker. The upstream direction is TanStack Table + core `DataTable`, shown in `tanstack-carbon` examples. (V row 6b)
- Peer caps pin the v11 majors: ibm-products peers `@carbon/react ^1.115.0` (excludes 2.x); `@carbon/ai-chat` peers `@carbon/web-components >=2.54.0 <3.0.0` (required, not optional). (V rows 8b, 10h)
- Best code sources for pages and blocks: `carbon-react-router-starter` (Apache-2.0, React 19, shell + dashboard + welcome sections) and `tanstack-carbon` (about 23 React table patterns; no license reported by GitHub). (E; carbon-reference.md 5.2)
- Lane tag counts disagree in places (F summary vs F rows; D vs F on charts, stylelint, tanstack-carbon). This catalog assigns one tag per item and lists the conflicts in section 9.

## 2. @carbon/react 1.117.0

Source for every name: `docs/research/sources/round2/react-exports.json` (365 total: 274 base + 91 prefixed). Maturity "stable" = unprefixed export. "v12" column: what `enable-v12-release` changes for the group (V rows 2b, 10a; `docs/migration/v12.md`). Storybook: https://react.carbondesignsystem.com (deep links unverified). Many stable groups carry deprecated props (not whole-component deprecation); check per prop before use (B, deprecated section).

### 2.1 Alias reality of `preview_` / `unstable_`

| Kind | Suffixes | Names | What to import instead |
|---|---|---|---|
| Aliases of stable Fluid fields | 22 (FluidComboBox, FluidDatePicker(+Input), FluidDropdown, FluidMultiSelect, FluidNumberInput, FluidSearch, FluidSelect, FluidTextArea, FluidTextInput, FluidTimePicker(+Select) and skeletons) | `preview__Fluid*`, `unstable__Fluid*` | base `Fluid*` names |
| Aliases of FeatureFlags | 3 | `preview_FeatureFlags`, `preview_useFeatureFlag(s)` + `unstable_` | `FeatureFlags`, `useFeatureFlag(s)` |
| Aliases of AISkeleton | 3 | `preview__AiSkeletonIcon/Placeholder/Text` + `unstable_` | `AISkeletonIcon/Placeholder/Text` |
| Aliases of AILabel (old "Slug" name) | 3 | `preview__Slug`, `preview__SlugActions`, `preview__SlugContent` + `unstable_` | `AILabel`, `AILabelActions`, `AILabelContent` |
| Genuinely preview-only | 16 | Layout, LayoutDirection, useLayoutDirection, Text, TextDirection, OverflowMenuV2 (deprecated), Pagination, PageSelector, Card, ChatButton, ChatButtonSkeleton, DatePicker (next), Dialog, IconIndicator, ShapeIndicator, PageHeader | the prefixed name (no stable twin) |
| `preview_`-only (no `unstable_` alias) | 3 of the above | `preview__Card`, `preview__DatePicker`, `preview__Dialog` | same |

Evidence: `R/es/index.js:255` (V rows 5b to 5e).

### 2.2 Actions

| Group | Exports | Maturity | v12 | Tag | Reason |
|---|---|---|---|---|---|
| Button | Button, ButtonSet, ButtonSkeleton, ButtonKinds, ButtonSizes, ButtonTooltipAlignments, ButtonTooltipPositions, PrimaryButton, SecondaryButton, DangerButton | stable | none listed | core | primary action everywhere |
| IconButton | IconButton, IconButtonKinds | stable | none listed | core | toolbar and row actions |
| ComboButton | ComboButton | stable | floating styles (`enable-v12-dynamic-floating-styles`) | core | split button; replacement for deprecated ibm-products ComboButton (V row 10f) |
| Copy | CopyButton, Copy | stable | none listed | core | copy IDs and codes in admin views |

### 2.3 Forms and inputs

| Group | Exports | Maturity | v12 | Tag | Reason |
|---|---|---|---|---|---|
| Form | Form, FluidForm, FormContext, FormGroup, FormItem, FormLabel | stable | label/decorator placement: dev warning in v11, dev error under v12 | core | base of every form |
| TextInput | TextInput, TextInputSkeleton, PasswordInput, ControlledPasswordInput | stable | root flag: rounded, fully bordered field (`S/scss/components/text-input/_text-input.scss:54-56`) | core | most-used field |
| TextArea | TextArea, TextAreaSkeleton | stable | none listed (not in the root-flag grep list of V row 2b) | core | multi-line entry |
| NumberInput | NumberInput, NumberInputSkeleton, validateNumberSeparators | stable | root-flag-gated Sass (grep only) | core | amounts, quantities |
| Select | Select, SelectItem, SelectItemGroup, SelectSkeleton | stable | root-flag-gated Sass (grep only) | core | native select |
| ComboBox / Dropdown / MultiSelect | ComboBox, Dropdown, DropdownSkeleton, MultiSelect, FilterableMultiSelect | stable | list-box restyle (`_list-box.scss:105-107`), floating styles | core | single and multi select, filters |
| Checkbox | Checkbox, CheckboxGroup, CheckboxSkeleton, InlineCheckbox | stable | none listed | core | settings, tables |
| RadioButton | RadioButton, RadioButtonGroup, RadioButtonSkeleton | stable | none listed | core | exclusive choice |
| Toggle / Switch | Toggle, ToggleSkeleton, ToggleSmallSkeleton, Switch | stable | `enable-v12-toggle-reduced-label-spacing` (Sass only) | core | boolean settings |
| Search | Search, SearchSkeleton, ExpandableSearch | stable | root-flag-gated Sass (grep only) | core | table and nav search |
| DatePicker | DatePicker, DatePickerInput, DatePickerSkeleton | stable (flatpickr) | root-flag-gated Sass (grep only) | core | dates in forms and filters |
| DatePicker (next) | `preview__DatePicker` | preview, v12 track, Temporal-based, `preview_`-only (V row 5f) | is the v12 date picker | optional | decision: adopt Temporal-based picker (polyfill about 20 kB gz where no native Temporal) before v12 |
| TimePicker | TimePicker, TimePickerSelect | stable | none listed | core | scheduling |
| FileUploader | FileUploader, FileUploaderButton, FileUploaderDropContainer, FileUploaderItem, FileUploaderSkeleton, Filename | stable; flag `enable-enhanced-file-uploader` | none listed | core | attachments |
| Slider | Slider, SliderSkeleton | stable | none listed | core | thresholds, ranges |
| Fluid fields | FluidComboBox, FluidDatePicker, FluidDatePickerInput, FluidDropdown, FluidMultiSelect, FluidNumberInput, FluidPasswordInput, FluidSearch, FluidSelect, FluidTextArea, FluidTextInput, FluidTimePicker, FluidTimePickerSelect + skeletons | stable (base export); `preview__`/`unstable__` names are legacy aliases (V row 5d) | fluid-* partials root-flag-gated (grep only) | core | dense forms in modals and tearsheets (https://carbondesignsystem.com/patterns/fluid-styles/) |

### 2.4 Data display

| Group | Exports | Maturity | v12 | Tag | Reason |
|---|---|---|---|---|---|
| DataTable | DataTable, DataTableSkeleton, Table, TableActionList, TableBatchAction(s), TableBody, TableCell, TableContainer, TableDecoratorRow, TableExpandHeader, TableExpandRow, TableExpandedRow, TableHead, TableHeader, TableRow, TableSelectAll, TableSelectRow, TableToolbar, TableToolbarAction, TableToolbarContent, TableToolbarMenu, TableToolbarSearch | stable | decorators outside sortable header buttons (dev error under v12) | core | table markup that tanstack-carbon layers on TanStack |
| TableSlugRow | TableSlugRow | legacy "Slug" name | none | out | use TableDecoratorRow / AILabel naming |
| StructuredList | StructuredListWrapper, StructuredListHead, StructuredListBody, StructuredListRow, StructuredListCell, StructuredListInput, StructuredListSkeleton | stable | `enable-v12-structured-list-visible-icons` (Sass only) | core | key/value and light record lists |
| Tag | Tag, TagSkeleton, DismissibleTag, OperationalTag, SelectableTag | stable | not pill-shaped under root flag (`S/scss/components/tag/_tag.scss:49` vs `:61`) | core | status and filter chips |
| Tile | Tile, TileGroup, ClickableTile, ExpandableTile, RadioTile, SelectableTile, TileAboveTheFoldContent, TileBelowTheFoldContent | stable; flag `enable-tile-contrast` (optional) | `enable-v12-tile-default-icons`, `enable-v12-tile-radio-icons` | core | dashboard and picker tiles |
| Accordion | Accordion, AccordionItem, AccordionSkeleton | stable (deprecated props) | none listed | core | settings sections, FAQ, filter groups (missing from lane B; added from react-exports.json) |
| TreeView | TreeView, TreeNode | stable; flag `enable-treeview-controllable` | none listed | optional | decision: hierarchical data in the platform (org units, account trees) |
| CodeSnippet | CodeSnippet, CodeSnippetSkeleton | stable | none listed | core | API keys, payloads, CLI snippets |
| Lists | OrderedList, UnorderedList, ListItem, ContainedList, ContainedListItem | stable | none listed | core | content and settings lists |
| AspectRatio | AspectRatio | stable | none listed | core | media and card sizing |
| Card (preview) | `preview__Card` | preview, `preview_`-only | none | optional | IBM Products' composable Card moved into core (#22867, 2026-08-12); upstream plans it as the successor of ProductiveCard/ExpressiveCard (ibm-products #9308, ADR 0007 proposed) |
| IconIndicator / ShapeIndicator | `preview__IconIndicator`, `preview__ShapeIndicator` (+ `unstable_`) | preview | none | core | status pattern; named replacement for deprecated ibm-products StatusIcon (V table) |

### 2.5 Navigation and shell

| Group | Exports | Maturity | v12 | Tag | Reason |
|---|---|---|---|---|---|
| UI Shell header | Header, HeaderContainer, HeaderGlobalAction, HeaderGlobalBar, HeaderMenu, HeaderMenuButton, HeaderMenuItem, HeaderName, HeaderNavigation, HeaderPanel, HeaderSideNavItems, SkipToContent, Content | stable | none listed | core | app shell (https://carbondesignsystem.com/patterns/global-header/) |
| SideNav | SideNav, SideNavDetails, SideNavDivider, SideNavFooter, SideNavHeader, SideNavIcon, SideNavItem, SideNavItems, SideNavLink, SideNavLinkText, SideNavMenu, SideNavMenuItem, SideNavSwitcher | stable | none listed | core | left navigation |
| Switcher | Switcher, SwitcherDivider, SwitcherItem | stable | none listed | core | app switcher across several Afframe apps |
| Breadcrumb | Breadcrumb, BreadcrumbItem, BreadcrumbSkeleton | stable | none listed | core | location in nested pages |
| Tabs | Tabs, TabsVertical, Tab, IconTab, TabList, TabListVertical, TabPanel, TabPanels, TabContent, TabsSkeleton | stable | none listed | core | detail and settings sections |
| ContentSwitcher | ContentSwitcher, IconSwitch | stable | none listed | core | view toggles |
| Pagination | Pagination, PaginationNav, PaginationSkeleton | stable | stable Pagination is the v12 path (page select built in) | core | every list |
| Pagination (preview) | `preview_Pagination`, `preview_PageSelector` (+ `unstable_`) | preview | removed in v12 major; 1.117.0 exports them flag on or off (V row 2b) | out | removed in v12 |
| Menu | Menu, MenuButton, MenuItem, MenuItemDivider, MenuItemGroup, MenuItemRadioGroup, MenuItemSelectable, useContextMenu | stable | rounded corners, padding; root flag read directly in Menu/MenuItem | core | row and toolbar menus |
| OverflowMenu | OverflowMenu, OverflowMenuItem | stable | `enable-v12-overflowmenu`: Menu-based children (`MenuItem`), codemod exists | core | row "more actions" |
| OverflowMenuV2 | `preview_OverflowMenuV2` (+ `unstable_`) | deprecated wrapper (V row 10a) | renders OverflowMenu under the flag | out | use OverflowMenu + flag |
| Link | Link | stable | none listed | core | links |
| PageHeader (preview) | `preview__PageHeader` (+ `unstable_`) | preview | none | core | page header; ibm-products also ships `preview__PageHeader` and deprecates its legacy PageHeader in its favour |

### 2.6 Overlays

| Group | Exports | Maturity | v12 | Tag | Reason |
|---|---|---|---|---|---|
| Modal | Modal, ModalHeader, ModalBody, ModalFooter, ModalWrapper, ModalPresence, withModalPresence | stable; flag `enable-dialog-element` switches it to native `<dialog>`; `enable-presence` | none listed | core | confirmations, short forms |
| ComposedModal | ComposedModal, ComposedModalPresence, withComposedModalPresence | stable; same flags | none listed | core | composable modal |
| Dialog (preview) | `preview__Dialog` | preview, `preview_`-only; always native `<dialog>`, not flag-gated (V row 5g) | none | optional | decision: native-dialog primitive vs Modal + `enable-dialog-element` |
| Popover | Popover, PopoverContent | stable | caret removed, radius, 4px gap; floating styles | core | overlay primitive |
| Tooltip | Tooltip, DefinitionTooltip | stable | caret removed, radius | core | inline help |
| Toggletip | Toggletip, ToggletipActions, ToggletipButton, ToggletipContent, ToggletipLabel | stable | caret removed, radius | core | click help |

### 2.7 Feedback

| Group | Exports | Maturity | v12 | Tag | Reason |
|---|---|---|---|---|---|
| Notification | ActionableNotification, InlineNotification, ToastNotification, StaticNotification, Callout, NotificationActionButton, NotificationButton | stable | none listed | core | messages and validation |
| Loading | Loading, InlineLoading | stable | none listed | core | async state |
| Progress | ProgressBar, ProgressIndicator, ProgressIndicatorSkeleton, ProgressStep | stable | ProgressBar radius and transform animation (root flag) | core | wizards, uploads |
| Skeletons | SkeletonIcon, SkeletonPlaceholder, SkeletonText, IconSkeleton | stable | `utilities/_skeleton` root-flag-gated (grep only) | core | loading placeholders |
| ErrorBoundary | ErrorBoundary, ErrorBoundaryContext | stable | none | core | app-level error containment |

### 2.8 AI

| Group | Exports | Maturity | v12 | Tag | Reason |
|---|---|---|---|---|---|
| AILabel | AILabel, AILabelActions, AILabelContent | stable | must render outside `label`/`legend` (dev error under v12) | core | mark AI-generated content |
| AISkeleton | AISkeletonIcon, AISkeletonPlaceholder, AISkeletonText | stable | none | core | AI loading state |
| ChatButton | `preview__ChatButton`, `preview__ChatButtonSkeleton` (+ `unstable_`) | preview | none | optional | decision: chat surface in the platform |
| Legacy aliases | `preview__Slug*`, `preview__AiSkeleton*` (+ `unstable_`) | aliases | none | out | import the stable names |

### 2.9 Layout, theme, utilities

| Group | Exports | Maturity | v12 | Tag | Reason |
|---|---|---|---|---|---|
| Grid | Grid, FlexGrid, Row, Column, ColumnHang, GridSettings | stable; flag `enable-css-grid` (legacy) | none | core | page grid |
| Layer | Layer, useLayer | stable | none | core | contrast layering |
| Stack | Stack, HStack, VStack | stable | none | core | spacing |
| Section / Heading | Section, Heading | stable | none | core | heading levels |
| Theme | Theme, GlobalTheme, ThemeContext, useTheme, usePrefersDarkScheme | stable | none | core | theme zones and switching |
| FeatureFlags | FeatureFlags, useFeatureFlag, useFeatureFlags | stable (the `flags` prop is deprecated; codemod `featureflag-deprecate-flags-prop`) | the React switch for v12 | core | opt into v12 and other flags |
| Prefix | ClassPrefix, PrefixContext, usePrefix | stable | none | optional | decision: custom class prefix (D5 Sass path) |
| IdPrefix | IdPrefix, useIdPrefix | stable | none | optional | decision: multiple Carbon instances on one page |
| Layout / Text (preview) | `preview_Layout`, `preview_LayoutDirection`, `preview_useLayoutDirection`, `preview_Text`, `preview_TextDirection` (+ `unstable_`) | preview | none | optional | decision: RTL and density-aware layout |

### 2.10 Feature flags (`@carbon/feature-flags` 1.10.0, 18 flags)

| Flag | Default | Surface | Tag |
|---|---|---|---|
| `enable-v12-release` (root; also enables `enable-focus-wrap-without-sentinels`) | false | React + Sass (both needed) | core |
| `enable-v12-overflowmenu`, `enable-v12-tile-default-icons`, `enable-v12-tile-radio-icons`, `enable-v12-dynamic-floating-styles` | false | React (tile-radio also Sass) | core |
| `enable-v12-structured-list-visible-icons`, `enable-v12-toggle-reduced-label-spacing` | false | Sass only (React `flags` prop accepts them but has no effect, V row 10i) | core |
| `enable-dialog-element`, `enable-presence`, `enable-focus-wrap-without-sentinels`, `enable-enhanced-file-uploader`, `enable-treeview-controllable` | false | React (+ Sass for dialog, presence) | optional (decision per flag) |
| `enable-tile-contrast`, `enable-css-grid` | false | Sass / React | optional |
| `enable-css-custom-properties` (placeholder description), `enable-v11-release` (true, bookkeeping), `enable-experimental-tile-contrast`, `enable-experimental-focus-wrap-without-sentinels` (deprecated aliases) | mixed | n/a | out |

Source: `feature-flags.json`; A flags table; `R/lib/components/FeatureFlags/index.d.ts:20-25`.

## 3. Foundation packages

| Package | Version | Provides | Pulled in by @carbon/react | Tag |
|---|---|---|---|---|
| @carbon/styles | 1.116.0 | Sass for every component, themes, grid, type, reset; precompiled `css/styles.min.css` (v11-styled). Sass partials of all 16 migrating components are `@use`d from `scss/components/_index.scss`, so their CSS ships even though the JS does not (V row 3b) | yes (`^1.116.0`) | core |
| @carbon/feature-flags | 1.10.0 | 18 flags, JS and Sass | yes | core |
| @carbon/icons-react | 11.89.0 | React icons (2,643 files, not a distinct-icon count) | yes | core |
| @carbon/pictograms-react | 11.111.0 | React pictograms | no | core |
| @carbon/themes | 11.82.0 | white, g10, g90, g100 tokens | via styles | core |
| @carbon/colors | 11.59.0 | palette (DTCG-sourced) | via themes | core |
| @carbon/layout | 11.60.0 | spacing, breakpoints | yes | core |
| @carbon/grid | 11.63.0 | grid Sass | via styles (not a direct dep, B) | core |
| @carbon/type | 11.68.0 | type tokens | via styles | core |
| @carbon/motion | 11.53.0 | motion tokens; custom-surface API new in 11.53.0 | yes | core |
| @carbon/utilities | 0.26.0 | utilities incl. `date-picker` (Temporal) primitives | yes | optional (decision: Temporal date picker) |
| @carbon/upgrade | 11.46.0 | codemods (listed in section 6) | no | see section 6 |

Other runtime deps of @carbon/react: `@floating-ui/react`, `downshift`, `flatpickr`, `motion`, `tabbable`, `es-toolkit`. Peers: React 16.8.6 to 19, `react-is`, `sass ^1.33.0`. (B, `R/package.json`) IBM Telemetry runs at install time (`postinstall`), opt-out; nothing ships at runtime (carbon-reference.md 3.4; D13). `@carbon/web-components` 2.x is `out` on its own but becomes a required transitive peer if `@carbon/ai-chat` is adopted (section 6).

## 4. IBM Products 2.99.0

`@carbon/ibm-products` 2.99.0 (npm latest 2026-09-16; next 2.99.0-rc.0). 151 exports: 115 unprefixed, 10 `preview__`, 26 `previewCandidate__` (`ibm-products-exports.json`). PDLC order: Draft (not exported) -> `previewCandidate__` -> `preview__` -> Stable (unprefixed); `preview__` is closer to stable and "available to use in production" (V row 7; https://github.com/carbon-design-system/ibm-products/blob/main/docs/guides/COMPONENT_STATUS_DEFINITIONS.md). The canary `pkg.component.*` mechanism is deprecated (`P/lib/global/js/package-settings.js:139`); whether prefixed exports bypass the canary gate at render time is (unverified). Setup: peers `@carbon/react ^1.115.0`, grid, layout, motion, themes, type; deps include `react-table ^7.8.0`, `react-window`, `@carbon-labs/react-resizer ^0.25.0`, `@dnd-kit/*`; styles from `@carbon/ibm-products-styles` (`^2.95.0`); default prefix `c4p` (C, Setup). Storybook: https://ibm-products.carbondesignsystem.com/

### 4.1 Components (non-deprecated or replacement status)

| Group | Exports | Maturity | Moving to @carbon/react v12 | Tag | Reason |
|---|---|---|---|---|---|
| Tearsheet | Tearsheet, TearsheetNarrow, TearsheetPresence, withTearsheetPresence, `preview__Tearsheet` | stable + preview twin | yes | core | large task panels |
| SidePanel | SidePanel | stable | yes | core | detail and edit panels |
| CreateFullPage | CreateFullPage, CreateFullPageStep | stable in 2.99.0; deprecated on main (#9900) | no | core | full-page create wizard |
| CreateTearsheet | CreateTearsheet, CreateTearsheetStep, CreateTearsheetDivider, CreateTearsheetNarrow | stable in 2.99.0; deprecated on main (#9900) | no | core | create flow in tearsheet |
| EditInPlace | EditInPlace | stable | yes | core | inline edit |
| EmptyState family | EmptyState, ErrorEmptyState, NoDataEmptyState, NoTagsEmptyState, NotFoundEmptyState, NotificationsEmptyState, UnauthorizedEmptyState, getEmptyState | stable (`EmptyState` `v2` prop deprecated) | no | core | empty and error states |
| FullPageError | FullPageError | stable | yes | core | 403/404/other error pages; replaces HTTPError* |
| NotificationsPanel | NotificationsPanel | stable | yes | core | notification center |
| UserAvatar | UserAvatar | stable | yes | core | avatars; replaces UserProfileImage |
| TagSet | TagSet | stable | no | core | tag lists with overflow |
| TagOverflow | TagOverflow | default-off canary (render gating unverified) | yes | core | tag overflow |
| Saving | Saving | stable in 2.99.0; deprecated on main (#9888) | no | core | save-state indicator |
| ProductiveCard / ExpressiveCard | ProductiveCard, ExpressiveCard | stable | no | core | dashboard and content cards |
| PageHeader (new) | `preview__PageHeader` | preview | yes (#23209, merged 2026-09-24); core's old `preview__PageHeader` is the deprecated `PageHeaderDeprecated` | core | replacement for deprecated PageHeader |
| TruncatedText | `preview__TruncatedText` | preview | yes | core | replacement for deprecated StringFormatter |
| BigNumber | `previewCandidate__BigNumber` | previewCandidate | yes | core | KPI numbers (only source in the org) |
| Coachmark (new) | `preview__Coachmark`, `preview__CoachmarkBeacon`, `preview__CoachmarkTagline`, `useCoachmark`, BEACON_KIND, COACHMARK_ALIGNMENT, COACHMARK_OVERLAY_KIND | preview (from `components/Coachmark/next`) | yes | optional | decision: guided tours |
| InterstitialScreen | InterstitialScreen, InterstitialScreenView | stable | yes | optional | decision: welcome / first-run screens |
| OptionsTile | OptionsTile | stable | yes | optional | decision: settings tiles with expandable options |
| ScrollGradient | ScrollGradient | exported but default-off canary: renders a placeholder unless `pkg.component.ScrollGradient = true` (V row 3d) | yes | optional | decision: accept canary opt-in |
| Guidebanner | `previewCandidate__Guidebanner`, `previewCandidate__GuidebannerElement`, `...ElementButton`, `...ElementLink` | previewCandidate | yes | optional | decision: in-page guidance banners |
| AddSelect | `preview__AddSelect`, SingleAddSelect, MultiAddSelect, AddSelectData | preview + stable | no | optional | decision: entity pickers |
| ConditionBuilder | `previewCandidate__ConditionBuilder`, ConditionBuilderContext | previewCandidate | no | optional | decision: advanced rule/filter builder |
| Decorator | `previewCandidate__Decorator` | previewCandidate | no | optional | decision: decorator chips on fields |
| InlineTip | `previewCandidate__InlineTip`, `...Button`, `...Link` | previewCandidate | no | optional | decision: contextual tips |
| GetStartedCard | `previewCandidate__GetStartedCard` | previewCandidate | no | optional | decision: onboarding |
| Toolbar | `previewCandidate__Toolbar`, `...Button`, `...Group` | previewCandidate | no | optional | decision: generic toolbars beyond TableToolbar |
| Lists | `previewCandidate__TruncatedList`, `previewCandidate__NonLinearReading` | previewCandidate | no | optional | decision: long list and glossary UX |
| SearchBar | `previewCandidate__SearchBar` | previewCandidate | no | optional | decision: scoped search bar |
| Cascade, Checklist | Cascade, Checklist | stable | no | optional | decision: onboarding / setup checklists |
| AboutModal | AboutModal | stable | no | optional | decision: product "about" dialog |
| WebTerminal | WebTerminal, WebTerminalContentWrapper, WebTerminalProvider, useWebTerminal | stable in 2.99.0; deprecated on main (#9890) | no | reference | niche console surface |
| ActionBar | ActionBar | default-off canary | no (ActionSet migrates; not public in ibm-products) | reference | small utility inside headers |
| Settings | `pkg`, `usePrefix`, StackProvider, `preview__FeatureFlags`, `preview__useFeatureFlag(s)` | stable / preview | n/a | core (pkg, usePrefix) | required to configure any ibm-products component |
| Datagrid hooks | useDatagrid + 19 more `use*`, getAutoSizedColumnWidth | no marker, but serve only the deprecated Datagrid (V row 6b) | no | out | deprecated in effect |
| FilterPanelLabel, NavItem, NavList, DescriptionListBody/Cell/Row, EditTearsheetForm | as named | no marker, children of deprecated parents | no | out | parent deprecated |

Migrated set status today (V row 3d, updated 2026-09-24): 15 of 17 are ibm-products root exports (PageHeader, added by #23209, as `preview__PageHeader`); BigNumber and Guidebanner only as `previewCandidate__`, Coachmark and TruncatedText only as `preview__`; ActionSet is an internal module (`P/lib/components/ActionSet`); Resizer ships as `@carbon-labs/react-resizer`. `@carbon/react` 1.117.0 contains only type files for BigNumber (`R/lib/index.d.ts:10`, type-only `preview__BigNumberProps`).

### 4.2 Deprecated components and replacements (source of truth: V)

Markers: J = JSDoc "This component is deprecated", R = runtime `.deprecated` warning, B = bare `@deprecated`. Replacement text is quoted from source where it exists. Paths under `P/lib/components/`.

| Component | Marker | Replacement (per source) | Evidence |
|---|---|---|---|
| APIKeyModal | J+R | "Generate An API Key pattern" | APIKeyModal/APIKeyModal.js:31,226 |
| ComboButton (+ ComboButtonItem, no own marker) | R | Carbon's `ComboButton` (@carbon/react) | ComboButton/ComboButton.js:73-75 |
| CreateModal | J+R | "Create Modal pattern" | CreateModal/CreateModal.js:35,74 |
| CreateSidePanel | J+R | "CreateSidePanel true pattern" (sic) | CreateSidePanel/CreateSidePanel.js:31,78 |
| Datagrid | B+R | migration docs at tanstack-carbon | Datagrid/Datagrid/Datagrid.js:32,60 |
| DecoratorDualButton, DecoratorLink, DecoratorSingleButton | J+R | none stated (`previewCandidate__Decorator` exists, not linked) | DecoratorDualButton.js:27,45 etc. |
| DescriptionList | J+R | none stated | DescriptionList/DescriptionList.js:34,52 |
| EditFullPage, EditSidePanel, EditTearsheet, EditTearsheetNarrow, EditUpdateCards | J+R | none stated ("will be removed in the next major version") | EditFullPage.js:27,44; EditSidePanel.js:25,74; EditTearsheet.js:37,116; EditTearsheetNarrow.js:27,43; EditUpdateCards.js:28,66 |
| EmptyStateV2 | B+R | Carbon empty-states pattern; `EmptyState` remains | EmptyStates/EmptyStateV2.deprecated.js:32,66-68 |
| ExportModal | J+R | "Export Modal pattern" | ExportModal/ExportModal.js:30,147 |
| FilterPanel, FilterPanelAccordion, FilterPanelAccordionItem, FilterPanelCheckbox, FilterPanelCheckboxWithOverflow, FilterPanelGroup, FilterPanelSearch | J+R | none stated | FilterPanel/**:28-62 |
| HTTPError403, HTTPError404, HTTPErrorOther | R | FullPageError; codemod `npx @carbon/upgrade migrate ibm-products-update-http-errors --write` | HTTPErrors/*/*.js:51 |
| ImportModal | J+R | "Import and Upload pattern" | ImportModal/ImportModal.js:30,185 |
| Nav | J+R | none stated (UI Shell is the core equivalent, inference) | Nav/Nav.js:29,108 |
| PageHeader | J+R | `preview__PageHeader` | PageHeader/PageHeader.js:41,397 |
| RemoveModal | J+R | "Delete and remove pattern" | RemoveModal/RemoveModal.js:24,83 |
| StatusIcon | J+R | "Icon Indicator from Carbon" (in 1.117.0 only `preview__IconIndicator`) | StatusIcon/StatusIcon.js:36,296 |
| StatusIndicator, StatusIndicatorStep | J+R | none stated | StatusIndicator/*.js:34,52 / 31,46 |
| StringFormatter | J+R | TruncatedText (`preview__TruncatedText`) | StringFormatter/StringFormatter.js:40,95 |
| UserProfileImage | J+R | UserAvatar | UserProfileImage/UserProfileImage.js:26,114 |
| `previewCandidate__Coachmark`, `...CoachmarkBeacon`, `...CoachmarkButton`, `...CoachmarkFixed`, `...CoachmarkOverlayElement(s)`, `...CoachmarkStack` (7) | J+R | none stated; inferred successor `preview__Coachmark*` | Coachmark*/…; `P/es/index.js:75,161` |
| `previewCandidate__DataSpreadsheet` | J+R | "AG Grid, TanStack Table, or Carbon DataTable" | DataSpreadsheet/DataSpreadsheet.js:53,574 |
| `previewCandidate__DelimitedList` | J+R | none stated | DelimitedList/DelimitedList.js:34,47 |

Totals: 35 unprefixed (29 with the J phrase) + 9 prefixed. All tagged `out` as components; patterns they name are catalogued in 4.3. Datagrid timeline: deprecated in v2.54.0 (2024-11-20), sev1/sev2 fixes in v2, removal in v4 (date TBD) (carbon-reference.md 5.2). Issue #4977 (react-table v8) closed 2024-11-25 as not_planned (V row 6b).

### 4.3 Patterns

| Pattern | Built from (current, non-deprecated) | Docs | Tag |
|---|---|---|---|
| Create flows | CreateFullPage, CreateTearsheet(Narrow) (deprecated on ibm-products main, #9900); modal and side-panel variants as patterns only | `packages/ibm-products/src/patterns/Create*`; https://carbondesignsystem.com/community/patterns/create-flows | core |
| Edit | EditInPlace; other Edit* deprecated, no replacement | https://carbondesignsystem.com/community/patterns/edit-pattern | core |
| Remove / delete | Modal (danger) per pattern | `src/patterns/DeleteAndRemove`; https://carbondesignsystem.com/community/patterns/remove-pattern | core |
| Import / export | FileUploader, Modal per pattern | `src/patterns/ImportAndUpload`, `ExportModal`; community import/export pages | core |
| Empty states | EmptyState family | https://carbondesignsystem.com/patterns/empty-states-pattern/ | core |
| Errors | FullPageError | Storybook "FullPageError" | core |
| Notifications | NotificationsPanel | https://carbondesignsystem.com/patterns/notification-pattern/ | core |
| Saving | Saving (deprecated on ibm-products main, #9888) | `src/patterns/Saving` | core |
| Onboarding | `preview__Coachmark*`, InterstitialScreen, Guidebanner | `src/patterns/Coachmark*` | optional |
| Generate an API key | Modal/Tearsheet per pattern | `src/patterns/GenerateAnAPIKey` | optional |
| Add / select data | `preview__AddSelect` | `src/patterns/AddSelect` | optional |
| Date/time format | guidance (StringFormatter deprecated) | `src/patterns/DateTimeFormat` | reference |
| Web terminal, Carousel, Cascade | WebTerminal, Cascade | `src/patterns/*` | reference |

### 4.4 Examples

56 per-component example apps under `examples/carbon-for-ibm-products/<Name>/src` (one minimal app each), plus `example-gallery`, `prefix-example`, `react-16-example`, `react-17-example`. Tag: `reference` (C; `org-trees.json`). `@carbon/ibm-products-web-components` is `out` (Lit).

## 5. Carbon Labs

Monorepo https://github.com/carbon-design-system/carbon-labs, Storybook https://labs.carbondesignsystem.com, all 0.x, Apache-2.0. No public graduation policy (unverified); only observed graduation signal is `react-resizer` used by ibm-products. Versions and dates from `00-inventory.json` `latest_published` (D).

| Package | What | Version (published) | Tag | Reason |
|---|---|---|---|---|
| @carbon-labs/react-resizer | resizable split bar | 0.25.0 (2026-06-02) | core | ibm-products dependency; Resizer is on the v12 migration list |
| @carbon-labs/react-ui-shell | alternative UI shell | 0.106.0 (2026-08-20) | optional | decision: core UI Shell vs Labs shell |
| @carbon-labs/react-date-picker | date picker variant | 0.12.0 (2026-09-18) | optional | decision: date picker track; v12-stable milestone has "Graduate Labs DatePicker to Core" (V row 4a) |
| @carbon-labs/react-calendar | calendar | 0.11.0 (2026-05-18) | optional | decision: full calendar view needed |
| @carbon-labs/react-tag-input | tag input field | 0.6.0 (2026-08-12) | optional | decision: tag entry control |
| @carbon-labs/react-theme-settings | theme switcher panel | 0.30.0 (2026-05-15) | optional | decision: user-facing theme settings (used by carbon-react-router-starter) |
| @carbon-labs/react-style-picker | style/theme picker; a `@lit/react` wrapper of `wc-style-picker`, so it ships the WC runtime (Lit, `@carbon/web-components` <3); `@lit/react` is a devDependency the consumer must install; close event not mapped to a prop (updated 2026-09-24, round 3) | 0.27.0 (2026-09-21) | optional | same decision; stays on v11 behaviour under React `<FeatureFlags>` (round3 V3 rows 2d, 10) |
| @carbon-labs/react-whats-new | "what's new" panel | 0.28.0 (2026-06-02) | optional | decision: release notes in product |
| @carbon-labs/react-first-time-orientation | onboarding overlay | 0.21.0 (2026-05-15) | optional | decision: guided tours (vs Coachmark) |
| @carbon-labs/react-registration-flow | multi-step registration | 0.2.0 (2026-07-29) | optional | decision: signup flow; very young |
| @carbon-labs/react-processing | processing state | 0.21.0 (2026-06-02) | optional | decision vs core Loading/Progress |
| @carbon-labs/react-text-highlighter | search-match highlight | 0.23.0 (2026-05-15) | optional | decision: search result UX |
| @carbon-labs/react-animated-header | animated header | 0.61.0 (2026-08-25) | optional | decision: visual fit |
| @carbon-labs/utilities | shared helpers | 0.28.0 (2026-05-15) | optional | transitive of Labs packages |
| @carbon-labs/vscode-snippets | SCSS snippets | 0.5.0 (2026-05-14) | optional | editor productivity |
| @carbon-labs/wc-wysiwyg | rich-text editor (WC) | 0.3.0 (2026-09-24) | out (S14) | rich text not needed |
| @carbon-labs/wc-empty-state, @carbon-labs/wc-ai-tag, @carbon-labs/wc-global-header | WC only. wc-empty-state: partial overlap with IBM Products EmptyState (gap: multi-action slots), and that family is removed at v12 per https://github.com/carbon-design-system/carbon/issues/22473. wc-ai-tag (`labs.status` draft): a clickable tag in a tooltip with a colored start edge, not an AI badge; partial overlap with `OperationalTag` + `Tooltip`; no runtime React wrapper ships (types only) and the bare import is broken. wc-global-header: partial overlap with UI Shell + `react-ui-shell`; its only React wrapper is the IBM Hybrid iPaaS header, bound to IBM backend endpoints (updated 2026-09-24, round 3) | 0.22.0 / 0.27.0 / 0.95.0 | optional | treatment in `docs/scope.md` 2.6 (round3 V3 rows 2a, 3a, 3b, 5a, 5b) |
| @carbon-labs/react-plane-stack-3d | 3D visualization (three.js); React, peers `react ^18.0.0` (updated 2026-09-24, round 3) | 0.10.0 (2026-09-03) | reference | niche, heavy dependency; out (`[H]` S20, 2026-09-24: React 18 peer only; `docs/scope.md` I51) |
| @carbon-labs/primitives | framework-agnostic date-picker state machines ("other", neither React nor WC); transitive dependency of `react-date-picker` and `wc-date-picker`; calls a global `Temporal` with no polyfill dependency; core's copy lives in `@carbon/utilities/date-picker` (PR https://github.com/carbon-design-system/carbon/pull/22728) (updated 2026-09-24, round 3) | 0.6.0 (2026-09-18) | reference | not consumed directly (round3 V3 rows 7, 12h) |
| @carbon-labs/mdx-components | docs MDX; React (imports `react`) (updated 2026-09-24, round 3) | 0.29.0 (2026-07-29) | reference | docs authoring; included under the Labs rule (`docs/scope.md` I52; round3 L row, V3 row 1a) |
| @carbon-labs/network-graph | graph viz (web component) (updated 2026-09-24, round 3) | 0.9.0 (2024-06-27) | reference | dead since 2024-06-27; successor `wc-network-graph` is private; stays out (round3 V3 row 1b) |
| @carbon-labs/react-split-panel | split panel | 0.22.0 | out | "DEPRECATED, use @carbon-labs/react-resizer" |
| @carbon-labs/ai-chat | chat (WC); `labs.status` preview and a Labs preview candidate (PR https://github.com/carbon-design-system/carbon-labs/pull/1228), not superseded; 24 element folders (chart, diagram, formula, carousel and others) (updated 2026-09-24, round 3) | 0.39.0 (2026-06-02) | out | partial overlap with `@carbon/ai-chat` (distinct project, V row 8a), feature diff not done (unverified); `@carbon/ai-chat` is used as the result of the overlap rule (round3 V3 row 2e) |
| @carbon-labs/wc-date-picker, wc-resizer, wc-style-picker | WC twins. wc-date-picker: partial overlap with `react-date-picker` (only the WC has a controllable `open`). wc-resizer: partial overlap with `react-resizer` (React has one drag handle; the WC adds grid, panel and 2D pivot handle). wc-style-picker: full overlap, it is the runtime inside `react-style-picker` (updated 2026-09-24, round 3) | 0.16.0 / 0.5.0 / 0.36.0 | out | React counterparts cover them fully or partly; gaps in `docs/scope.md` 2.6 (round3 V3 rows 2b, 2c, 2d) |
| @carbon-labs/react-example-button, wc-example-button, web-components-example-button | scaffolds | various | out | boilerplate |
| @carbon-labs/ai-extended-button, ai-feedback, ai-prompt-tuning, ai-ux-control | dead AI experiments | last 2023-11 to 2024-06 | out | abandoned rc/canary |

Package count: 36 published `@carbon-labs/*` packages: 18 React, 16 web components (Lit / `@carbon/web-components`), 2 other (`primitives`, `vscode-snippets`); one React package, `react-style-picker`, is a `@lit/react` wrapper of a web component (round3 `labs-tech.json`; V3 row 1a). D's 38 is not confirmed. The rows above cover 35; the 36th, `@carbon-labs/ai-tag` (last 0.8.0, 2025-07-09), is superseded by `wc-ai-tag` (V3 row 12f) (updated 2026-09-24, round 3).

## 6. Extensions and dev tooling

| Item | What | React path | Version / activity | License | Tag | Reason |
|---|---|---|---|---|---|---|
| @carbon/ai-chat (+ @carbon/ai-chat-components) | AI chat framework | Lit web components wrapped via `@lit/react`; required peer `@carbon/web-components >=2.54.0 <3.0.0` (V row 8b) | 1.21.0 (2026-09-21) / 1.11.0 | Apache-2.0 | optional | decision: chat surface, accepting the WC runtime and the `<3.0.0` cap |
| @carbon/charts + @carbon/charts-react | dataviz, D3 + TS | dedicated React package | 1.27.20 (2026-09-16) | Apache-2.0 | core | the only maintained Carbon charting for dashboards |
| @carbon/charts-angular / -vue / -svelte | wrappers | none | stale `latest` | Apache-2.0 | out | other frameworks |
| @carbon/echarts-theme (+ echarts-toolbar 0.4.0) | ECharts theme | via any ECharts React wrapper | 0.7.0 (2026-09-03) | Apache-2.0 | optional | decision: ECharts for chart types Carbon Charts lacks |
| carbon-vega-theme | Vega theme | theme spec | pushed 2024-06-17 | unclear | out | stale, niche |
| tanstack-carbon | examples: DataTable markup on TanStack Table | React examples, pins `@tanstack/react-table ^8.20.1` per example | pushed 2026-09-07 | none reported by GitHub | reference | pattern source for the table layer; not a package; no LICENSE file of its own, reuse ruled by Hleb (S4) |
| @tanstack/react-table (+ table-core, react-virtual) | headless table and virtualization | React | 9.2.4 / 3.14.13 | MIT | core | [H] TanStack tables; v8 vs v9 is D7 |
| generate-pattern | CLI scaffolding tanstack-carbon patterns and tearsheet-step-flow | CLI | pushed 2024-12-04 | (unverified) | reference | model for an Afframe block CLI |
| stylelint-plugin-carbon-tokens | token-usage lint with autofix | n/a | 5.0.6 (2026-06-03), Carbon v11 only, stylelint 16/17 | conflict: MIT in package.json/README, Apache-2.0 in LICENSE file and tarball (V row 9b) | core | enforces tokens-only styling; in the carbon-design-system org, single npm maintainer (V row 9c) |
| @carbon/cli-plugin-stylelint | old stylelint plugin | n/a | 0.0.24 (2020) | Apache-2.0 | out | dead |
| @carbon/upgrade | codemods (`npx @carbon/upgrade migrate <name> --write`; list via `migrate list`): `enable-v12-release`, `enable-v12-overflowmenu`, `enable-v12-tile-default-icons`, `enable-v12-tile-radio-icons`, `enable-v12-structured-list-visible-icons`, `featureflag-deprecate-flags-prop`, `ibm-products-update-http-errors` | n/a | 11.46.0 (2026-09-23) | Apache-2.0 | core | v12 flag codemods, ibm-products HTTPError migration; 11.46.0 contains the `enable-v12-release` codemod (checked 2026-09-24; was unverified) |
| carbon-mcp | MCP server for Carbon docs and codegen | n/a | issue repo pushed 2026-09-01; server access-gated (IBMid) | not stated | optional | decision: AI-assisted dev with gated access |
| devtools | browser extension + component-list/utilities | n/a | pushed 2026-06-17 | Apache-2.0 | optional | dev-time inspection |
| icons-motion (`@carbon/icons-motion`) | animated icons | React | pushed 2026-07-27 | (unverified) | optional | decision: motion polish |
| carbon-utils-position | positioning helper | DOM | 1.3.0 (2024) | MIT | out | Floating UI already in @carbon/react |
| @carbon/element-styles | attribute-based styles for native HTML | CSS | 0.3.13 | Apache-2.0 | reference | markdown content styling idea |
| @carbon/agentic-renderer | A2UI/GenUI renderer on `cds-*` elements | WC | 0.1.0 (2026-09-15) | (unverified) | reference | npm description only (carbon-reference.md 5.5) |
| carbon-addons-iot-react | IoT product components | React | 5.18.2, no dedicated maintainer | Apache-2.0 | out | README says migrate away |
| ibm-security | security product components | React | moved to ibm-cloud-cognitive | Apache-2.0 | out | product-specific |
| carbon-addons-cloud(-react/-vanilla), carbon-addons-data-viz-react | old add-ons | mixed | deprecated or archived | mixed | out | superseded |
| carbon-react-native | React Native | native | 9.0.7 | Apache-2.0 | out | not web |

## 7. Templates, starters, examples, patterns

### 7.1 Starters and examples

| Name | Contents | Stack | Activity | Tag | Reason |
|---|---|---|---|---|---|
| carbon-react-router-starter | CommonHeader, Nav, Footer, ProfilePanel, page layout, routes, i18n (en/de), theme utils; pages Welcome (sections), Dashboard (NumberTiles, URLParameters, Visualizations), NotFound | React 19, react-router 8, Vite 8, Express 5 SSR, `@carbon/react ^1.73`, `@carbon/ibm-products ^2.74`, `@carbon-labs/react-theme-settings` | pushed 2026-09-23 | reference | Apache-2.0 (GitHub license API): code to adapt for shell, dashboard, sections |
| tanstack-carbon `react/*` | ai-label, batch-actions, column-alignment, customizeColumns, dynamic-nested-rows, editableCells, filterFlyout, filterPanel, globalFilter, infiniteScroll, mix-and-match, nestedRows, pagination, resizing, row-actions, row-click, row-settings, rowExpansion, selectable-nested-rows, sortable, sticky-columns, tabbed-header, virtual, community | React + TanStack v8 | pushed 2026-09-07 | reference | table block source; reuse ruled by Hleb (S4) |
| carbon/examples/light-dark-mode | theme toggle | Next.js | tracks carbon | reference | theme toggle block |
| carbon/examples/custom-theme | Sass theme overrides | Vite | tracks carbon | reference | token override recipe |
| carbon/examples/nextjs, vite | minimal integration | Next.js / Vite | tracks carbon | reference | build integration check |
| carbon/examples/class-prefix, id-prefix | prefix utilities | Vite | tracks carbon | reference | prefix recipes |
| carbon/examples/v10-token-compat-in-v11, codesandbox-styles | compat, fixtures | Vite | tracks carbon | out | not needed from a v11 start |
| sandboxes | StackBlitz matrix React 16 to 19, one v12-flag preset | Vite | pushed 2026-09-14 | reference | repro matrix |
| carbon-tutorial-nextjs `v11-next-step-5` branch | landing page + DataTable repo list page | Next 13, React 18, `@carbon/react ^1.35` | old | reference | list page idea |
| carbon-nextjs-template | header + one page | Next 12, React 17 | 2023 | out | stale |
| gatsby-theme-carbon, gatsby-starter-carbon-theme | doc-site theme | Gatsby | active / 2024 | out | not an app framework |
| carbon-for-ibm-dotcom-nextjs-template / -test | ibm.com React templates | Next.js | archived | out | discontinued React package |

### 7.2 carbondesignsystem.com patterns (guidance only, no runnable code)

| Pattern | Components | Link | Tag |
|---|---|---|---|
| Forms | text input, select, checkbox, radio, toggle, etc. | https://carbondesignsystem.com/patterns/forms-pattern/ | core |
| Login | Button, Link, TextInput | https://carbondesignsystem.com/patterns/login-pattern/ | core |
| Global header | UI Shell, Breadcrumb | https://carbondesignsystem.com/patterns/global-header/ | core |
| Empty states | Button, DataTable, Tile | https://carbondesignsystem.com/patterns/empty-states-pattern/ | core |
| Notifications | Notification, Modal, UI Shell | https://carbondesignsystem.com/patterns/notification-pattern/ | core |
| Dashboards (data viz) | @carbon/charts, Tile, Grid | https://carbondesignsystem.com/data-visualization/dashboards/ | core |
| Common actions, Dialogs, Disclosures, Disabled states, Read-only states, Loading, Filtering, Search, Status indicators, Fluid styles, Overflow content | per page | https://carbondesignsystem.com/patterns/ | reference |
| Text toolbar | flagged "not currently available for production use" | https://carbondesignsystem.com/patterns/text-toolbar-pattern/ | optional (decision: rich text) |
| Carbon for AI guidelines | AILabel | https://carbondesignsystem.com/guidelines/carbon-for-ai/ | reference |
| Community chatbot pattern | conversational UI | https://carbondesignsystem.com/community/patterns/chatbot/overview/ | optional (decision: chat) |
| Community create/edit/remove/import/export/API-key patterns | see 4.3 | https://carbondesignsystem.com/community/patterns/ | reference (lanes C and E disagree, section 9) |

### 7.3 Carbon for IBM.com sections and blocks (concept only)

`carbon-for-ibm-dotcom` ships Lit web components only; `@carbon/ibmdotcom-react` source was removed from `main` and peers React 16/17 (E; carbon-reference.md 4). No code import; naming and composition ideas only.

| Item | Afframe concept | Tag |
|---|---|---|
| masthead, dotcom-shell, footer, global-banner | marketing site chrome | reference |
| leadspace (+block, +with-search) | hero section | reference |
| content-block family, content-group, content-item(-row), content-section | content sections | reference |
| card, card-group, card-section-*, feature-card | card sections | reference |
| cta, cta-block, cta-section | CTA section | reference |
| pricing-table | pricing section | reference |
| feature-section, tabs-extended(-media), callout-quote, quote, logo-grid, link-list(-section) | feature, tabs, testimonial, logos, links | reference |
| filter-panel, search, search-with-typeahead | redundant with core | out |
| video/audio players, lightbox, countdown, star-rating, promo/in-page banners, locale-modal, leaving-ibm, back-to-top, etc. | marketing furniture | out |

## 8. Org repos

121 repos in https://github.com/carbon-design-system (`org-repos.json`); 35 have `archived: true` in the JSON. Lane F row tags: 4 core, 8 optional, 20 reference, 89 out (88 + `carbon-components-react` tagged "legacy/archived"). F's own summary (5/14/10/92) does not match its rows.

Non-out repos with this catalog's tag (where it differs from F, F's tag is in brackets):

| Repo | Tag | Note |
|---|---|---|
| carbon | core | @carbon/react, styles, icons, upgrade |
| ibm-products | core | section 4 |
| carbon-labs | core (package-level tags in section 5) | section 5 |
| carbon-ai-chat | optional [core] | WC runtime peer |
| carbon-charts | core [optional] | charts for dashboards |
| stylelint-plugin-carbon-tokens | core [optional] | token lint, license conflict |
| carbon-mcp | optional | gated |
| carbon-echarts-theme | optional | ECharts path |
| icons-motion | optional | polish |
| devtools | optional [reference] | dev inspection |
| carbon-for-products-design-kit | optional | decision: IBM Products parity in Figma |
| carbon-react-router-starter | reference [optional] | adapt code, not a dependency |
| carbon-nextjs-template | out [optional] | stale (E) |
| tanstack-carbon, generate-pattern, sandboxes, carbon-sandbox, carbon-element-styles | reference | patterns and recipes |
| carbon-for-ibm-dotcom | reference | concept only |
| carbon-website, carbon-platform, carbon-icons, rfcs, roadmap, carbon-design-kit | reference | docs and governance |
| carbon-tutorial-1, carbon-tutorial-2, carbon-tutorial-next | reference | tutorials |
| carbon-addons-iot-react, ibm-security, carbon-utils-position, tailwind-preset-carbon | out [reference] | product-specific, superseded or archived |

Full 121-row table: `docs/research/carbon-org-repos.md`.

## 9. Open questions

- Whether v12-alpha (due 2026-10-31) is published to npm, and under which version or tag; `@carbon/react` 2.x naming is inferred from the Storybook brand only. (V, still open)
- When ibm-products widens `@carbon/react ^1.115.0` and when `@carbon/ai-chat` widens `@carbon/web-components <3.0.0`. (V)
- Full content of the undocumented v12 form-field restyle (only text-input and list-box read line by line). (V)
- ibm-products CSS is compiled with the v12 flag off, so v12-styled core next to ibm-products components may look mismatched (unverified).
- Whether prefixed ibm-products exports bypass the deprecated canary gate; whether TagOverflow is canary-gated at render. (V)
- Which Coachmark generation the @carbon/react migration copy is based on. (V)
- License of `stylelint-plugin-carbon-tokens` (MIT field vs Apache-2.0 file) and of `tanstack-carbon` (none reported). (V row 9b; carbon-reference.md 5.2)
- Tag conflicts between lanes, resolved here as shown in section 8: carbon-ai-chat (D core, F core; here optional because of the WC peer), carbon-charts (D core, F optional), stylelint plugin (D core, F optional), tanstack-carbon (D optional, E core, F reference), carbon-react-router-starter (E core, F optional).
- Lane E tags community create/edit/remove/import/export pages "out (site tooling meta-pages)"; lane C reads them as product workflow patterns. Not re-fetched here.
- Labs package count: resolved, 36 (18 React / 16 web components / 2 other; round3 V3 row 1a) (updated 2026-09-24, round 3). F archived count: 24 (F text) vs 35 (JSON).

## 10. Sources

- Lane files: `docs/research/sources/round2/{A-v11-vs-v12,B-react-catalog,C-ibm-products,D-labs-extensions,E-templates-patterns,V-verify}.md`; lane F became `docs/research/carbon-org-repos.md`
- Ground truth: `docs/research/sources/round2/{react-exports,ibm-products-exports,feature-flags,org-repos,org-trees}.json`; `docs/research/sources/round1/00-inventory.json`; unpacked tarballs under `<npm pack>/`
- Round 1: `docs/research/carbon-reference.md`
- https://registry.npmjs.org/@carbon%2freact · https://registry.npmjs.org/@carbon%2fai-chat · https://registry.npmjs.org/stylelint-plugin-carbon-tokens
- https://github.com/carbon-design-system/carbon/milestones · https://github.com/carbon-design-system/carbon/blob/main/docs/release-schedule.md · https://github.com/carbon-design-system/carbon/blob/main/docs/migration/v12.md · https://github.com/carbon-design-system/carbon/blob/main/docs/feature-flags.md · https://github.com/carbon-design-system/carbon/blob/main/packages/react/product-migrated-components.mjs
- https://v12-react.carbondesignsystem.com · https://react.carbondesignsystem.com · https://ibm-products.carbondesignsystem.com/ · https://labs.carbondesignsystem.com
- https://github.com/carbon-design-system/ibm-products/blob/main/docs/guides/COMPONENT_STATUS_DEFINITIONS.md · https://github.com/carbon-design-system/ibm-products/pull/6419 · https://github.com/carbon-design-system/ibm-products/issues/4977
- https://github.com/carbon-design-system/carbon-labs · https://github.com/carbon-design-system/carbon-ai-chat · https://github.com/carbon-design-system/carbon-charts · https://github.com/carbon-design-system/tanstack-carbon · https://github.com/carbon-design-system/generate-pattern · https://github.com/carbon-design-system/stylelint-plugin-carbon-tokens · https://github.com/carbon-design-system/carbon-react-router-starter · https://github.com/carbon-design-system/carbon-for-ibm-dotcom · https://github.com/carbon-design-system/sandboxes
- https://carbondesignsystem.com/patterns/ · https://carbondesignsystem.com/data-visualization/dashboards/ · https://carbondesignsystem.com/community/patterns/ · https://carbondesignsystem.com/guidelines/carbon-for-ai/
