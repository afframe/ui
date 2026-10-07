import * as ibm from '@carbon/ibm-products';
import * as calendar from '@carbon-labs/react-calendar';
import * as firstTimeOrientation from '@carbon-labs/react-first-time-orientation/es/index.js';
import * as processing from '@carbon-labs/react-processing';
import * as resizer from '@carbon-labs/react-resizer';
import * as tagInput from '@carbon-labs/react-tag-input';
import * as textHighlighter from '@carbon-labs/react-text-highlighter';
import * as themeSettings from '@carbon-labs/react-theme-settings';
import * as uiShell from '@carbon-labs/react-ui-shell';
import * as whatsNew from '@carbon-labs/react-whats-new';
import * as carbon from '@carbon/react';
import { expect, expectTypeOf, test } from 'vitest';
import * as icons from './icons.js';
import * as ui from './index.js';
import type {
  AccentTagMessages,
  AccentTagProps,
  APIKeyModalMessages,
  APIKeyModalProps,
  BaseSwitcherProps,
  ButtonBaseProps,
  ChatChartData,
  ChatChartDatum,
  ChatChartEChartsData,
  ChatChartMessages,
  ChatChartProps,
  ChatChartTabularData,
  ChatChartType,
  ChatElementsMessages,
  ChatElementType,
  ColumnBaseProps,
  ContextMenuProps,
  ControlledDatePickerHandle,
  ControlledDatePickerProps,
  ControlledPasswordInputProps,
  CreateModalMessages,
  CreateModalProps,
  CreateSidePanelMessages,
  CreateSidePanelProps,
  DataTableHeader,
  DataTableRow,
  DescriptionListItemProps,
  DescriptionListMessages,
  DescriptionListProps,
  DirectionButtonProps,
  EditFullPageMessages,
  EditFullPageProps,
  EditSidePanelMessages,
  EditSidePanelProps,
  EditTearsheetFormProps,
  EditTearsheetMessages,
  EditTearsheetProps,
  EnvironmentOption,
  EnvironmentSwitcherMessages,
  EnvironmentSwitcherProps,
  ExportModalMessages,
  ExportModalProps,
  HeaderPanelActionProps,
  HelpMenuItem,
  HelpMenuMessages,
  HelpMenuProps,
  ImportModalMessages,
  ImportModalProps,
  LayerBaseProps,
  ListBoxFieldProps,
  ListBoxMenuIconProps,
  ListBoxMenuItemProps,
  ListBoxMenuProps,
  ListBoxProps,
  ListBoxSelectionProps,
  LogoutBannerMessages,
  LogoutBannerProps,
  LogoutBannerVariant,
  LogoutTileMessages,
  LogoutTileProps,
  NotificationIconProps,
  PaginationItemProps,
  PaginationOverflowProps,
  PopoverBaseProps,
  PortalProps,
  RemoveModalMessages,
  RemoveModalProps,
  RenderChatElementOptions,
  StatusIndicatorMessages,
  StatusIndicatorProps,
  ToggletipBaseProps,
  ToggletipButtonBaseProps,
} from './index.js';
import * as pictograms from './pictograms.js';
import * as tokens from './tokens.js';

test('defines every main entry export', () => {
  const undefinedNames = Object.entries(ui)
    .filter(([, value]) => value === undefined)
    .map(([name]) => name);
  expect(undefinedNames).toEqual([]);
  expect(Object.keys(ui).length).toBeGreaterThan(250);
});

test("exports IBM Products' usePrefix and Carbon's as useCarbonPrefix", () => {
  expect(ui.usePrefix).toBe(ibm.usePrefix);
  expect(ui.useCarbonPrefix).toBe(carbon.usePrefix);
});

test("exports Carbon's ComboButton, not IBM Products'", () => {
  expect(ui.ComboButton).toBe(carbon.ComboButton);
});

test.each([
  ['AddSelect', ibm.preview__AddSelect],
  ['BigNumber', ibm.previewCandidate__BigNumber],
  ['Coachmark', ibm.preview__Coachmark],
  ['ConditionBuilder', ibm.previewCandidate__ConditionBuilder],
  ['EditInPlace', ibm.EditInPlace],
  ['FullPageError', ibm.FullPageError],
  ['Guidebanner', ibm.previewCandidate__Guidebanner],
  ['InterstitialScreen', ibm.InterstitialScreen],
  ['NotificationsPanel', ibm.NotificationsPanel],
  ['PageHeader', ibm.preview__PageHeader],
  ['Resizer', resizer.Resizer],
  ['ScrollGradient', ibm.ScrollGradient],
  ['SidePanel', ibm.SidePanel],
  ['TagOverflow', ibm.TagOverflow],
  ['Tearsheet', ibm.preview__Tearsheet],
  ['TruncatedText', ibm.preview__TruncatedText],
  ['UserAvatar', ibm.UserAvatar],
] as const)('exports %s as its backing component', (name, backing) => {
  expect(backing).toBeDefined();
  expect(ui[name]).toBe(backing);
});

test('exports the subcomponents of the migrated compound components', () => {
  expect(ui.PageHeader.Root).toBeDefined();
  expect(ui.Tearsheet.Body).toBeDefined();
  expect(ui.Coachmark.Content).toBeDefined();
  expect(ui.AddSelect.Body).toBeDefined();
});

test("does not export IBM Products' prefixed names of the migrated components", () => {
  const prefixed = Object.keys(ui).filter((name) =>
    /^(preview__(PageHeader|Tearsheet|AddSelect|Coachmark|TruncatedText)|previewCandidate__(BigNumber|ConditionBuilder|Guidebanner|Coachmark))/.test(
      name
    )
  );
  expect(prefixed).toEqual([]);
  expect('pkg' in ui).toBe(false);
});

// Carbon keeps these names; the Labs versions end in `Labs`.
const labsAliases: Record<string, string> = {
  SideNav: 'SideNavLabs',
  SideNavItems: 'SideNavItemsLabs',
  SideNavLink: 'SideNavLinkLabs',
  SideNavMenu: 'SideNavMenuLabs',
  SideNavMenuItem: 'SideNavMenuItemLabs',
  HeaderContainer: 'HeaderContainerLabs',
};

const labsExports = Object.entries({
  ...uiShell,
  ...calendar,
  ...tagInput,
  ...themeSettings,
  ...whatsNew,
  ...firstTimeOrientation,
  ...processing,
  ...resizer,
  ...textHighlighter,
}).map(([name, value]) => [labsAliases[name] ?? name, value] as const);

test('covers every Labs runtime export', () => {
  expect(labsExports).toHaveLength(41);
});

test.each(labsExports)('exports Labs %s', (name, value) => {
  expect(value).toBeDefined();
  expect(ui[name as keyof typeof ui]).toBe(value);
});

test('keeps the Carbon UI shell names and the Labs ones with a Labs suffix', () => {
  expect(ui.SideNav).toBe(carbon.SideNav);
  expect(ui.SideNavItems).toBe(carbon.SideNavItems);
  expect(ui.SideNavLink).toBe(carbon.SideNavLink);
  expect(ui.SideNavMenu).toBe(carbon.SideNavMenu);
  expect(ui.SideNavMenuItem).toBe(carbon.SideNavMenuItem);
  expect(ui.HeaderContainer).toBe(carbon.HeaderContainer);
  expect(ui.SideNavLabs).toBe(uiShell.SideNav);
  expect(ui.SideNavItemsLabs).toBe(uiShell.SideNavItems);
  expect(ui.SideNavLinkLabs).toBe(uiShell.SideNavLink);
  expect(ui.SideNavMenuLabs).toBe(uiShell.SideNavMenu);
  expect(ui.SideNavMenuItemLabs).toBe(uiShell.SideNavMenuItem);
  expect(ui.HeaderContainerLabs).toBe(uiShell.HeaderContainer);
});

test('does not export the Labs utilities or the packages left out', () => {
  expect(ui.usePrefix).toBe(ibm.usePrefix);
  expect(ui.PrefixContext).toBe(carbon.PrefixContext);
  expect('settings' in ui).toBe(false);
  for (const name of [
    'AnimatedHeader',
    'BaseTile',
    'HeaderAction',
    'HeaderTitle',
    'watsonXAnimatedLight',
    'RegistrationFlow',
    'DoDont',
  ]) {
    expect(name in ui).toBe(false);
  }
});

test('exports icons, pictograms and tokens with Carbon names', () => {
  expect(icons.ArrowRight).toBeDefined();
  expect(pictograms.AiEthics).toBeDefined();
  expect(tokens.g100.background).toBe('#161616');
  expect(tokens.durationFast01).toBe('70ms');
});

test('exports the DataTable header and row types', () => {
  expectTypeOf<DataTableHeader>().toHaveProperty('key');
  expectTypeOf<DataTableRow<[string]>>().toHaveProperty('cells');
});

test('exports the stable button variants and ControlledPasswordInput', () => {
  expect(ui.PrimaryButton).toBeDefined();
  expect(ui.SecondaryButton).toBeDefined();
  expect(ui.DangerButton).toBeDefined();
  expect(ui.ControlledPasswordInput).toBeDefined();
});

test('exports the sub-part props types', () => {
  expectTypeOf<BaseSwitcherProps>().not.toBeAny();
  expectTypeOf<ButtonBaseProps>().not.toBeAny();
  expectTypeOf<ColumnBaseProps>().not.toBeAny();
  expectTypeOf<ContextMenuProps>().not.toBeAny();
  expectTypeOf<ControlledPasswordInputProps>().not.toBeAny();
  expectTypeOf<DirectionButtonProps>().not.toBeAny();
  expectTypeOf<LayerBaseProps>().not.toBeAny();
  expectTypeOf<ListBoxProps>().not.toBeAny();
  expectTypeOf<ListBoxFieldProps>().not.toBeAny();
  expectTypeOf<ListBoxMenuProps>().not.toBeAny();
  expectTypeOf<ListBoxMenuIconProps>().not.toBeAny();
  expectTypeOf<ListBoxMenuItemProps>().not.toBeAny();
  expectTypeOf<ListBoxSelectionProps>().not.toBeAny();
  expectTypeOf<NotificationIconProps>().not.toBeAny();
  expectTypeOf<PaginationItemProps>().not.toBeAny();
  expectTypeOf<PaginationOverflowProps>().not.toBeAny();
  expectTypeOf<PopoverBaseProps>().not.toBeAny();
  expectTypeOf<PortalProps>().not.toBeAny();
  expectTypeOf<ToggletipBaseProps>().not.toBeAny();
  expectTypeOf<ToggletipButtonBaseProps>().not.toBeAny();
});

test('exports the format helpers', () => {
  expect(ui.useAfframeTheme).toBeTypeOf('function');
  expect(ui.useCarbonTheme).toBeTypeOf('function');
  expect(ui.resolveMessages).toBeTypeOf('function');
  expect(ui.formatAmount).toBeTypeOf('function');
});

test.each([
  ['CreateModal', ui.CreateModal, ui.defaultCreateModalMessages],
  ['CreateSidePanel', ui.CreateSidePanel, ui.defaultCreateSidePanelMessages],
  ['EditSidePanel', ui.EditSidePanel, ui.defaultEditSidePanelMessages],
  ['EditTearsheet', ui.EditTearsheet, ui.defaultEditTearsheetMessages],
  ['EditFullPage', ui.EditFullPage, ui.defaultEditFullPageMessages],
  ['RemoveModal', ui.RemoveModal, ui.defaultRemoveModalMessages],
  ['ImportModal', ui.ImportModal, ui.defaultImportModalMessages],
  ['ExportModal', ui.ExportModal, ui.defaultExportModalMessages],
  ['APIKeyModal', ui.APIKeyModal, ui.defaultAPIKeyModalMessages],
  ['StatusIndicator', ui.StatusIndicator, ui.defaultStatusIndicatorMessages],
  ['DescriptionList', ui.DescriptionList, ui.defaultDescriptionListMessages],
  ['AccentTag', ui.AccentTag, ui.defaultAccentTagMessages],
] as const)(
  'exports the create, edit and modal component %s and its default messages',
  (_name, component, messages) => {
    expect(component).toBeTypeOf('function');
    expect(messages).toBeTypeOf('object');
  }
);

test('exports the create, edit and modal parts and types', () => {
  expect(ui.EditTearsheetForm).toBeTypeOf('function');
  expect(ui.DescriptionListItem).toBeTypeOf('function');
  expectTypeOf<CreateModalProps>().not.toBeAny();
  expectTypeOf<CreateModalMessages>().not.toBeAny();
  expectTypeOf<CreateSidePanelProps>().not.toBeAny();
  expectTypeOf<CreateSidePanelMessages>().not.toBeAny();
  expectTypeOf<EditSidePanelProps>().not.toBeAny();
  expectTypeOf<EditSidePanelMessages>().not.toBeAny();
  expectTypeOf<EditTearsheetProps>().not.toBeAny();
  expectTypeOf<EditTearsheetFormProps>().not.toBeAny();
  expectTypeOf<EditTearsheetMessages>().not.toBeAny();
  expectTypeOf<EditFullPageProps>().not.toBeAny();
  expectTypeOf<EditFullPageMessages>().not.toBeAny();
  expectTypeOf<RemoveModalProps>().not.toBeAny();
  expectTypeOf<RemoveModalMessages>().not.toBeAny();
  expectTypeOf<ImportModalProps>().not.toBeAny();
  expectTypeOf<ImportModalMessages>().not.toBeAny();
  expectTypeOf<ExportModalProps>().not.toBeAny();
  expectTypeOf<ExportModalMessages>().not.toBeAny();
  expectTypeOf<APIKeyModalProps>().not.toBeAny();
  expectTypeOf<APIKeyModalMessages>().not.toBeAny();
  expectTypeOf<StatusIndicatorProps>().not.toBeAny();
  expectTypeOf<StatusIndicatorMessages>().not.toBeAny();
  expectTypeOf<DescriptionListProps>().not.toBeAny();
  expectTypeOf<DescriptionListItemProps>().not.toBeAny();
  expectTypeOf<DescriptionListMessages>().not.toBeAny();
  expectTypeOf<AccentTagProps>().not.toBeAny();
  expectTypeOf<AccentTagMessages>().not.toBeAny();
});

test.each([
  [
    'EnvironmentSwitcher',
    ui.EnvironmentSwitcher,
    ui.defaultEnvironmentSwitcherMessages,
  ],
  ['LogoutBanner', ui.LogoutBanner, ui.defaultLogoutBannerMessages],
  ['LogoutTile', ui.LogoutTile, ui.defaultLogoutTileMessages],
  ['HelpMenu', ui.HelpMenu, ui.defaultHelpMenuMessages],
  ['ChatChart', ui.ChatChart, ui.defaultChatChartMessages],
] as const)(
  'exports the header and chat component %s and its default messages',
  (_name, component, messages) => {
    expect(component).toBeTypeOf('function');
    expect(messages).toBeTypeOf('object');
  }
);

test('exports the header and chat parts and types', () => {
  expect(ui.renderChatElement).toBeTypeOf('function');
  expect(ui.defaultChatElementsMessages).toBeTypeOf('object');
  expect(ui.chatElementTypes).toEqual(['afframe-chart']);
  expect(ui.chatChartTypes).toEqual([
    'bar',
    'line',
    'area',
    'pie',
    'donut',
    'scatter',
  ]);
  expect(ui.isChatChartData).toBeTypeOf('function');
  // @carbon/ai-chat renders carousels, tables and code natively.
  for (const name of ['ChatTable', 'ChatCode', 'ChatCarousel']) {
    expect(name in ui).toBe(false);
  }
  expectTypeOf<EnvironmentSwitcherProps>().not.toBeAny();
  expectTypeOf<EnvironmentSwitcherMessages>().not.toBeAny();
  expectTypeOf<EnvironmentOption>().not.toBeAny();
  expectTypeOf<LogoutBannerProps>().not.toBeAny();
  expectTypeOf<LogoutBannerMessages>().not.toBeAny();
  expectTypeOf<LogoutBannerVariant>().not.toBeAny();
  expectTypeOf<LogoutTileProps>().not.toBeAny();
  expectTypeOf<LogoutTileMessages>().not.toBeAny();
  expectTypeOf<HelpMenuProps>().not.toBeAny();
  expectTypeOf<HelpMenuMessages>().not.toBeAny();
  expectTypeOf<HelpMenuItem>().not.toBeAny();
  expectTypeOf<HeaderPanelActionProps>().not.toBeAny();
  expectTypeOf<ChatChartProps>().not.toBeAny();
  expectTypeOf<ChatChartMessages>().not.toBeAny();
  expectTypeOf<ChatChartData>().not.toBeAny();
  expectTypeOf<ChatChartDatum>().not.toBeAny();
  expectTypeOf<ChatChartEChartsData>().not.toBeAny();
  expectTypeOf<ChatChartTabularData>().not.toBeAny();
  expectTypeOf<ChatChartType>().not.toBeAny();
  expectTypeOf<ChatElementsMessages>().not.toBeAny();
  expectTypeOf<ChatElementType>().not.toBeAny();
  expectTypeOf<RenderChatElementOptions>().not.toBeAny();
});

test('exports ControlledDatePicker and its types', () => {
  expect(ui.ControlledDatePicker).toBeTypeOf('function');
  expectTypeOf<ControlledDatePickerProps>().not.toBeAny();
  expectTypeOf<ControlledDatePickerHandle>().not.toBeAny();
});
