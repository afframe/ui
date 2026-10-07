// Public entry of @afframe/ui. Carbon components are re-exported by name;
// aliases and unstable parts are left out, `preview__` components without a
// stable twin are in. IBM Products components that Carbon v12 moves into core
// use their core names, the rest keep IBM's names. Of the names both packages
// export, `ComboButton` is Carbon's and `usePrefix` is IBM Products'.
export { AfframeProvider } from './provider/index.js';
export type { AfframeTheme } from './provider/index.js';

// Actions
export {
  Button,
  PrimaryButton,
  SecondaryButton,
  DangerButton,
  ButtonSet,
  ButtonSkeleton,
  ButtonKinds,
  ButtonSizes,
  ButtonTooltipAlignments,
  ButtonTooltipPositions,
  IconButton,
  IconButtonKinds,
  ComboButton,
  MenuButton,
  Copy,
  CopyButton,
} from '@carbon/react';
export type {
  ButtonProps,
  ButtonBaseProps,
  ButtonSkeletonProps,
  IconButtonProps,
  ComboButtonProps,
  MenuButtonProps,
  CopyProps,
  CopyButtonProps,
} from '@carbon/react';

// Forms
export {
  Form,
  FormGroup,
  FormItem,
  FormLabel,
  FormContext,
  TextInput,
  TextInputSkeleton,
  PasswordInput,
  ControlledPasswordInput,
  TextArea,
  TextAreaSkeleton,
  NumberInput,
  NumberInputSkeleton,
  validateNumberSeparators,
  Select,
  SelectItem,
  SelectItemGroup,
  SelectSkeleton,
  ComboBox,
  Dropdown,
  DropdownSkeleton,
  MultiSelect,
  FilterableMultiSelect,
  Checkbox,
  CheckboxGroup,
  CheckboxSkeleton,
  InlineCheckbox,
  RadioButton,
  RadioButtonGroup,
  RadioButtonSkeleton,
  Toggle,
  ToggleSkeleton,
  ToggleSmallSkeleton,
  Search,
  ExpandableSearch,
  SearchSkeleton,
  DatePicker,
  DatePickerInput,
  DatePickerSkeleton,
  preview__DatePicker,
  TimePicker,
  TimePickerSelect,
  FileUploader,
  FileUploaderButton,
  FileUploaderDropContainer,
  FileUploaderItem,
  FileUploaderSkeleton,
  Filename,
  Slider,
  SliderSkeleton,
} from '@carbon/react';
export type {
  FormProps,
  FormGroupProps,
  FormItemProps,
  FormLabelProps,
  TextInputProps,
  TextInputSkeletonProps,
  PasswordInputProps,
  ControlledPasswordInputProps,
  TextAreaProps,
  TextAreaSkeletonProps,
  NumberInputProps,
  NumberInputSkeletonProps,
  SelectProps,
  SelectItemProps,
  SelectItemGroupProps,
  SelectSkeletonProps,
  ComboBoxProps,
  ListBoxProps,
  ListBoxFieldProps,
  ListBoxMenuProps,
  ListBoxMenuIconProps,
  ListBoxMenuItemProps,
  ListBoxSelectionProps,
  DropdownProps,
  MultiSelectProps,
  FilterableMultiSelectProps,
  CheckboxProps,
  CheckboxGroupProps,
  InlineCheckboxProps,
  RadioButtonProps,
  RadioButtonGroupProps,
  RadioButtonSkeletonProps,
  ToggleProps,
  ToggleSkeletonProps,
  ToggleSmallSkeletonProps,
  SearchProps,
  SearchSkeletonProps,
  DatePickerProps,
  DatePickerInputProps,
  DatePickerSkeletonProps,
  TimePickerProps,
  TimePickerSelectProps,
  FileUploaderProps,
  FileUploaderButtonProps,
  FileUploaderDropContainerProps,
  FileUploaderItemProps,
  FileUploaderSkeletonProps,
  FilenameProps,
  SliderProps,
  SliderSkeletonProps,
} from '@carbon/react';

// Fluid forms
export {
  FluidForm,
  FluidComboBox,
  FluidComboBoxSkeleton,
  FluidDatePicker,
  FluidDatePickerInput,
  FluidDatePickerSkeleton,
  FluidDropdown,
  FluidDropdownSkeleton,
  FluidMultiSelect,
  FluidMultiSelectSkeleton,
  FluidNumberInput,
  FluidNumberInputSkeleton,
  FluidPasswordInput,
  FluidSearch,
  FluidSearchSkeleton,
  FluidSelect,
  FluidSelectSkeleton,
  FluidTextArea,
  FluidTextAreaSkeleton,
  FluidTextInput,
  FluidTextInputSkeleton,
  FluidTimePicker,
  FluidTimePickerSelect,
  FluidTimePickerSkeleton,
} from '@carbon/react';
export type {
  FluidFormProps,
  FluidComboBoxProps,
  FluidComboBoxSkeletonProps,
  FluidDatePickerProps,
  FluidDatePickerSkeletonProps,
  FluidDropdownProps,
  FluidDropdownSkeletonProps,
  FluidMultiSelectProps,
  FluidMultiSelectSkeletonProps,
  FluidPasswordInputProps,
  FluidSearchProps,
  FluidSearchSkeletonProps,
  FluidSelectProps,
  FluidSelectSkeletonProps,
  FluidTextAreaProps,
  FluidTextAreaSkeletonProps,
  FluidTextInputProps,
  FluidTextInputSkeletonProps,
  FluidTimePickerProps,
  FluidTimePickerSelectProps,
  FluidTimePickerSkeletonProps,
} from '@carbon/react';

// Data display
export {
  DataTable,
  DataTableSkeleton,
  Table,
  TableActionList,
  TableBatchAction,
  TableBatchActions,
  TableBody,
  TableCell,
  TableContainer,
  TableDecoratorRow,
  TableExpandHeader,
  TableExpandRow,
  TableExpandedRow,
  TableHead,
  TableHeader,
  TableRow,
  TableSelectAll,
  TableSelectRow,
  TableToolbar,
  TableToolbarAction,
  TableToolbarContent,
  TableToolbarMenu,
  TableToolbarSearch,
  StructuredListBody,
  StructuredListCell,
  StructuredListHead,
  StructuredListInput,
  StructuredListRow,
  StructuredListSkeleton,
  StructuredListWrapper,
  Tag,
  DismissibleTag,
  OperationalTag,
  SelectableTag,
  TagSkeleton,
  Tile,
  ClickableTile,
  ExpandableTile,
  SelectableTile,
  RadioTile,
  TileGroup,
  TileAboveTheFoldContent,
  TileBelowTheFoldContent,
  Accordion,
  AccordionItem,
  AccordionSkeleton,
  CodeSnippet,
  CodeSnippetSkeleton,
  OrderedList,
  UnorderedList,
  ListItem,
  ContainedList,
  ContainedListItem,
  AspectRatio,
  TreeView,
  TreeNode,
} from '@carbon/react';
export type {
  DataTableHeader,
  DataTableProps,
  DataTableRenderProps,
  DataTableRow,
  DataTableSkeletonProps,
  TableBatchActionProps,
  TableBatchActionsProps,
  TableBodyProps,
  TableCellProps,
  TableContainerProps,
  TableDecoratorRowProps,
  TableExpandHeaderProps,
  TableExpandRowProps,
  TableExpandedRowProps,
  TableHeadProps,
  TableHeaderProps,
  TableRowProps,
  TableSelectAllProps,
  TableSelectRowProps,
  TableToolbarProps,
  TableToolbarActionProps,
  TableToolbarMenuProps,
  TableToolbarSearchProps,
  StructuredListBodyProps,
  StructuredListCellProps,
  StructuredListHeadProps,
  StructuredListInputProps,
  StructuredListRowProps,
  StructuredListSkeletonProps,
  StructuredListWrapperProps,
  TagProps,
  DismissibleTagProps,
  OperationalTagProps,
  SelectableTagProps,
  TagSkeletonProps,
  TileProps,
  ClickableTileProps,
  ExpandableTileProps,
  SelectableTileProps,
  RadioTileProps,
  TileGroupProps,
  TileAboveTheFoldContentProps,
  TileBelowTheFoldContentProps,
  AccordionProps,
  AccordionItemProps,
  AccordionSkeletonProps,
  CodeSnippetProps,
  CodeSnippetSkeletonProps,
  OrderedListProps,
  UnorderedListProps,
  ListItemProps,
  ContainedListProps,
  AspectRatioProps,
  TreeViewProps,
  TreeNodeProps,
} from '@carbon/react';

// Navigation and UI shell
export {
  Header,
  HeaderContainer,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderMenu,
  HeaderMenuButton,
  HeaderMenuItem,
  HeaderName,
  HeaderNavigation,
  HeaderPanel,
  HeaderSideNavItems,
  SkipToContent,
  Content,
  SideNav,
  SideNavDetails,
  SideNavDivider,
  SideNavFooter,
  SideNavHeader,
  SideNavIcon,
  SideNavItem,
  SideNavItems,
  SideNavLink,
  SideNavLinkText,
  SideNavMenu,
  SideNavMenuItem,
  SideNavSwitcher,
  Switcher,
  SwitcherDivider,
  SwitcherItem,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbSkeleton,
  Tabs,
  Tab,
  TabList,
  TabListVertical,
  TabPanel,
  TabPanels,
  TabContent,
  TabsVertical,
  TabsSkeleton,
  IconTab,
  ContentSwitcher,
  Switch,
  IconSwitch,
  Pagination,
  PaginationSkeleton,
  PaginationNav,
  Menu,
  MenuItem,
  MenuItemDivider,
  MenuItemGroup,
  MenuItemRadioGroup,
  MenuItemSelectable,
  useContextMenu,
  OverflowMenu,
  OverflowMenuItem,
  Link,
} from '@carbon/react';
export type {
  HeaderProps,
  HeaderContainerProps,
  HeaderGlobalActionProps,
  HeaderMenuProps,
  HeaderMenuButtonProps,
  HeaderMenuItemProps,
  HeaderNameProps,
  HeaderNavigationProps,
  HeaderPanelProps,
  HeaderSideNavItemsProps,
  SkipToContentProps,
  SideNavProps,
  SideNavDetailsProps,
  SideNavFooterProps,
  SideNavHeaderProps,
  SideNavIconProps,
  SideNavItemProps,
  SideNavItemsProps,
  SideNavLinkProps,
  SideNavLinkTextProps,
  SideNavMenuProps,
  SideNavMenuItemProps,
  SideNavSwitcherProps,
  BaseSwitcherProps,
  SwitcherDividerProps,
  SwitcherItemProps,
  BreadcrumbProps,
  BreadcrumbItemProps,
  BreadcrumbSkeletonProps,
  TabsProps,
  TabProps,
  TabListProps,
  TabListVerticalProps,
  TabPanelProps,
  TabPanelsProps,
  TabContentProps,
  TabsVerticalProps,
  IconTabProps,
  ContentSwitcherProps,
  SwitchProps,
  PaginationProps,
  PaginationSkeletonProps,
  PaginationNavProps,
  PaginationItemProps,
  PaginationOverflowProps,
  DirectionButtonProps,
  MenuProps,
  MenuItemProps,
  MenuItemDividerProps,
  MenuItemGroupProps,
  MenuItemRadioGroupProps,
  MenuItemSelectableProps,
  ContextMenuProps,
  OverflowMenuProps,
  OverflowMenuItemProps,
  LinkProps,
} from '@carbon/react';

// Overlays
export {
  Modal,
  ComposedModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalPresence,
  ComposedModalPresence,
  withModalPresence,
  withComposedModalPresence,
  Popover,
  PopoverContent,
  Tooltip,
  DefinitionTooltip,
  Toggletip,
  ToggletipActions,
  ToggletipButton,
  ToggletipContent,
  ToggletipLabel,
} from '@carbon/react';
export type {
  ModalProps,
  ComposedModalProps,
  ModalHeaderProps,
  ModalBodyProps,
  ModalFooterProps,
  ModalPresenceProps,
  ComposedModalPresenceProps,
  PopoverProps,
  PopoverBaseProps,
  PopoverContentProps,
  TooltipProps,
  DefinitionTooltipProps,
  ToggletipProps,
  ToggletipBaseProps,
  ToggleTipActionsProps,
  ToggleTipButtonProps,
  ToggletipButtonBaseProps,
  ToggletipContentProps,
} from '@carbon/react';

// Feedback
export {
  ActionableNotification,
  InlineNotification,
  ToastNotification,
  StaticNotification,
  Callout,
  NotificationActionButton,
  NotificationButton,
  Loading,
  InlineLoading,
  ProgressBar,
  ProgressIndicator,
  ProgressStep,
  ProgressIndicatorSkeleton,
  SkeletonIcon,
  SkeletonPlaceholder,
  SkeletonText,
  IconSkeleton,
  ErrorBoundary,
  ErrorBoundaryContext,
} from '@carbon/react';
export type {
  ActionableNotificationProps,
  InlineNotificationProps,
  ToastNotificationProps,
  StaticNotificationProps,
  CalloutProps,
  NotificationActionButtonProps,
  NotificationButtonProps,
  NotificationIconProps,
  LoadingProps,
  InlineLoadingProps,
  ProgressBarProps,
  ProgressIndicatorProps,
  ProgressStepProps,
  ProgressIndicatorSkeletonProps,
  SkeletonIconProps,
  SkeletonPlaceholderProps,
  SkeletonTextProps,
  IconSkeletonProps,
  ErrorBoundaryProps,
  PortalProps,
} from '@carbon/react';

// AI
export {
  AILabel,
  AILabelActions,
  AILabelContent,
  AISkeletonIcon,
  AISkeletonPlaceholder,
  AISkeletonText,
} from '@carbon/react';
export type {
  AILabelProps,
  AISkeletonIconProps,
  AISkeletonPlaceholderProps,
  AISkeletonTextProps,
} from '@carbon/react';

// Layout and theme
export {
  Grid,
  Column,
  ColumnHang,
  FlexGrid,
  Row,
  GridSettings,
  Layer,
  useLayer,
  Stack,
  HStack,
  VStack,
  Section,
  Heading,
  Theme,
  GlobalTheme,
  ThemeContext,
  useTheme,
  usePrefersDarkScheme,
  FeatureFlags,
  useFeatureFlag,
  useFeatureFlags,
  PrefixContext,
  // The plain name is kept for IBM Products' usePrefix.
  usePrefix as useCarbonPrefix,
} from '@carbon/react';
export type {
  GridProps,
  ColumnProps,
  ColumnBaseProps,
  ColumnHangProps,
  RowProps,
  LayerProps,
  LayerBaseProps,
  StackProps,
  SectionProps,
  GlobalThemeProps,
  FeatureFlagsProps,
} from '@carbon/react';

// Preview
export {
  preview__IconIndicator,
  preview__ShapeIndicator,
  preview__ChatButton,
  preview__ChatButtonSkeleton,
} from '@carbon/react';
export type {
  IconIndicatorProps,
  ShapeIndicatorProps,
  ChatButtonProps,
  ChatButtonSkeletonProps,
} from '@carbon/react';

// IBM Products: migrated components under their Carbon v12 core names
export {
  preview__AddSelect as AddSelect,
  SingleAddSelect,
  MultiAddSelect,
  previewCandidate__BigNumber as BigNumber,
  preview__Coachmark as Coachmark,
  preview__CoachmarkBeacon as CoachmarkBeacon,
  preview__CoachmarkTagline as CoachmarkTagline,
  previewCandidate__ConditionBuilder as ConditionBuilder,
  EditInPlace,
  FullPageError,
  previewCandidate__Guidebanner as Guidebanner,
  previewCandidate__GuidebannerElement as GuidebannerElement,
  previewCandidate__GuidebannerElementButton as GuidebannerElementButton,
  previewCandidate__GuidebannerElementLink as GuidebannerElementLink,
  InterstitialScreen,
  InterstitialScreenView,
  NotificationsPanel,
  // A namespace: render <PageHeader.Root>, a bare <PageHeader> renders nothing.
  preview__PageHeader as PageHeader,
  // Canary gated: enabled in the AfframeProvider module.
  ScrollGradient,
  SidePanel,
  TagOverflow,
  preview__Tearsheet as Tearsheet,
  preview__TruncatedText as TruncatedText,
  UserAvatar,
} from '@carbon/ibm-products';
export type {
  preview__AddSelectProps as AddSelectProps,
  AddSelectComponentType,
  AddSelectBodyProps,
  AddSelectRowProps,
  AddSelectContextType,
  SingleAddSelectProps,
  MultiAddSelectProps,
  BigNumberProps,
  CoachmarkPropsNext as CoachmarkProps,
  CoachmarkBeaconPropsNext as CoachmarkBeaconProps,
  CoachmarkTaglineProps,
  CoachmarkComponent,
  CoachmarkContentProps,
  ContentBodyProps as CoachmarkContentBodyProps,
  ContentHeaderProps as CoachmarkContentHeaderProps,
  ConditionBuilderProps,
  ConditionBuilderState,
  EditInplaceProps,
  FullPageErrorProps,
  GuidebannerProps,
  GuidebannerElementProps,
  GuidebannerElementButtonProps,
  GuidebannerElementLinkProps,
  InterstitialScreenProps,
  InterstitialScreenComponent,
  InterstitialScreenBodyProps,
  InterstitialScreenFooterProps,
  InterstitialScreenHeaderProps,
  NotificationsPanelProps,
  SidePanelProps,
  TagOverflowProps,
  preview__TearsheetProps as TearsheetProps,
  TearsheetComponentType,
  StackContextType,
  TearsheetBodyProps,
  TearsheetFooterProps,
  TearsheetHeaderProps,
  TearsheetHeaderActionItemProps,
  TearsheetHeaderActionsProps,
  TearsheetHeaderContentProps,
  TearsheetNavigationBarProps,
  TearsheetScrollButtonProps,
  MainContentProps,
  SummaryContentProps,
  InfluencerProps,
  TruncatedTextProps,
} from '@carbon/ibm-products';

// PageHeader types come from the namespace behind the PageHeader export.
import type { preview__PageHeader } from '@carbon/ibm-products';
export type PageHeaderProps = preview__PageHeader.PageHeaderProps;
export type PageHeaderBreadcrumbBarProps =
  preview__PageHeader.PageHeaderBreadcrumbBarProps;
export type PageHeaderContentProps = preview__PageHeader.PageHeaderContentProps;
export type PageHeaderContentPageActionsProps =
  preview__PageHeader.PageHeaderContentPageActionsProps;
export type PageHeaderContentTextProps =
  preview__PageHeader.PageHeaderContentTextProps;
export type PageHeaderTabBarProps = preview__PageHeader.PageHeaderTabBarProps;
export type PageHeaderHeroImageProps =
  preview__PageHeader.PageHeaderHeroImageProps;
export type PageHeaderScrollButtonProps =
  preview__PageHeader.PageHeaderScrollButtonProps;
export type PageHeaderTagOverflowProps =
  preview__PageHeader.PageHeaderTagOverflowProps;
export type PageHeaderBreadcrumbOverflowProps =
  preview__PageHeader.PageHeaderBreadcrumbOverflowProps;
export type PageHeaderBreadcrumbPageActionsProps =
  preview__PageHeader.PageHeaderBreadcrumbPageActionsProps;
export type PageHeaderBreadcrumbPageActionItem =
  preview__PageHeader.PageHeaderBreadcrumbPageActionItem;

// IBM Products: other components by IBM's names
export {
  EmptyState,
  ErrorEmptyState,
  NoDataEmptyState,
  NoTagsEmptyState,
  NotFoundEmptyState,
  NotificationsEmptyState,
  UnauthorizedEmptyState,
  TagSet,
  ProductiveCard,
  ExpressiveCard,
  Checklist,
  Cascade,
  previewCandidate__GetStartedCard,
  previewCandidate__InlineTip,
  previewCandidate__InlineTipButton,
  previewCandidate__InlineTipLink,
  previewCandidate__Toolbar,
  previewCandidate__ToolbarButton,
  previewCandidate__ToolbarGroup,
  previewCandidate__SearchBar,
  // Canary gated: enabled in the AfframeProvider module.
  previewCandidate__Decorator,
  previewCandidate__TruncatedList,
  previewCandidate__NonLinearReading,
  // IBM Products' usePrefix ('c4p'); Carbon's is useCarbonPrefix.
  usePrefix,
  StackProvider,
} from '@carbon/ibm-products';
export type {
  EmptyStateProps,
  ErrorEmptyStateProps,
  NoDataEmptyStateProps,
  NoTagsEmptyStateProps,
  NotFoundEmptyStateProps,
  NotificationsEmptyStateProps,
  UnauthorizedEmptyStateProps,
  TagSetProps,
  ProductiveCardProps,
  ExpressiveCardProps,
  ChecklistProps,
  CascadeProps,
  GetStartedCardProps,
  InlineTipProps,
  InlineTipButtonProps,
  InlineTipLinkProps,
  ToolbarProps,
  ToolbarButtonProps,
  ToolbarGroupProps,
  SearchBarProps,
  TruncatedListProps,
  NonLinearReadingProps,
} from '@carbon/ibm-products';

// Carbon Labs, one 'use client' module per Labs package in src/labs/, so a
// Next.js route that uses one Labs component ships only that package's
// JavaScript. No Labs package marks its modules 'use client', so these modules
// do it for them and keep them usable from a React server component. Labs
// names are IBM's; where one clashes with Carbon, Carbon keeps the name and the
// Labs export ends in `Labs`. `@carbon-labs/utilities` is a dependency only:
// its usePrefix and PrefixContext clash and are not exported.
//
// Several Labs packages ship an index.d.ts with extension-less relative paths,
// which `moduleResolution: nodenext` cannot follow, so their exports type as
// `any`. Their component modules are re-exported from the deep `es/` paths,
// which are the same modules the package index loads. Where the deep path does
// not resolve at run time, the value comes from the package entry and its type
// from the deep declaration file.
export * from './labs/ui-shell.js';
export * from './labs/whats-new.js';
export * from './labs/first-time-orientation.js';
export * from './labs/calendar.js';
export * from './labs/tag-input.js';
export * from './labs/theme-settings.js';
export * from './labs/processing.js';
export * from './labs/resizer.js';
export * from './labs/text-highlighter.js';
// Plain data, kept out of the client module so server components can read it.
export { themeSets } from '@carbon-labs/react-theme-settings/es/components/theme-settings-consts.js';

// IBM Products feature flags (SidePanel reads enableSidepanelResizer).
export {
  preview__FeatureFlags,
  preview__useFeatureFlag,
  preview__useFeatureFlags,
} from '@carbon/ibm-products';

// Left out on purpose: TearsheetNarrow, TearsheetPresence and
// withTearsheetPresence (Tearsheet has both built in), pkg (Afframe sets it),
// IBM's ComboButton, the legacy PageHeader and stable Tearsheet, deprecated
// components and the Datagrid family.

// Afframe components, formatting, theme hooks, messages and the extras. One
// module per family, so a route ships only the 'use client' families it uses.
export * from './components/DataGrid/index.js';
export * from './components/FilterPanel/index.js';
export * from './components/Amount/index.js';
export * from './components/AmountInput/index.js';
export * from './components/Charts/index.js';
export * from './components/ECharts/index.js';
export * from './components/AIChat/index.js';
export * from './format/index.js';
export * from './theme/index.js';
export * from './messages.js';

export * from './components/CreateModal/index.js';
export * from './components/CreateSidePanel/index.js';
export * from './components/EditSidePanel/index.js';
export * from './components/EditTearsheet/index.js';
export * from './components/EditFullPage/index.js';
export * from './components/RemoveModal/index.js';
export * from './components/ImportModal/index.js';
export * from './components/ExportModal/index.js';
export * from './components/APIKeyModal/index.js';
export * from './components/StatusIndicator/index.js';
export * from './components/DescriptionList/index.js';
export * from './components/AccentTag/index.js';

export * from './components/EnvironmentSwitcher/index.js';
export * from './components/LogoutBanner/index.js';
export * from './components/LogoutTile/index.js';
export * from './components/HelpMenu/index.js';
export * from './components/ChatElements/index.js';

export * from './components/ControlledDatePicker/index.js';
