/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and icons from @afframe/ui, source tag, inline spacing as Carbon spacing tokens, IconTab and TabsSkeleton listed as subcomponents. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ArgTypes, Meta, StoryFn } from '@storybook/react-vite';
import { useState } from 'react';
import type { ComponentProps, ReactElement } from 'react';
import {
  Button,
  Checkbox,
  Column,
  Grid,
  IconTab,
  Layer,
  RadioButton,
  RadioButtonGroup,
  Stack,
  Tab,
  TabList,
  TabListVertical,
  TabPanel,
  TabPanels,
  Tabs,
  TabsSkeleton,
  TabsVertical,
  TextInput,
} from '../../index.js';
import {
  Dashboard,
  Activity,
  CloudMonitoring,
  Settings,
  IbmWatsonDiscovery,
  Notification,
  Chat,
  Task,
  Restart,
} from '../../icons.js';
import mdx from './Tabs.mdx';

// Story args always carry size, so the stories pass it through as a defined value.
type TabListSize = NonNullable<ComponentProps<typeof TabList>['size']>;
type TabListArgs = Omit<ComponentProps<typeof TabList>, 'size'> & {
  size: TabListSize;
  dismissable?: boolean;
};
type TabProps = ComponentProps<typeof Tab>;
type DefaultArgs = TabListArgs &
  Pick<
    ComponentProps<typeof Tabs>,
    'defaultSelectedIndex' | 'onChange' | 'onTabCloseRequest' | 'selectedIndex'
  > &
  Pick<TabProps, 'disabled' | 'onClick' | 'onKeyDown' | 'secondaryLabel'> & {
    as?: TabProps['as'];
    renderIcon?: TabProps['renderIcon'];
    tabClassName?: string;
    tabPanelClassName?: string;
  };
interface IconStoryArgs {
  badgeIndicator?: boolean;
  defaultOpen?: boolean;
  enterDelayMs?: number;
  iconTabClassName?: string;
  iconTabDisabled?: boolean;
  iconTabLabel: string;
  leaveDelayMs?: number;
  size: TabListSize;
}
type VerticalArgs = ComponentProps<typeof TabsVertical> &
  Pick<
    ComponentProps<typeof TabListVertical>,
    'activation' | 'aria-label' | 'className' | 'scrollIntoView'
  > & {
    size: NonNullable<ComponentProps<typeof TabListVertical>['size']>;
  };
interface SkeletonArgs {
  contained?: boolean;
  skeletonClassName?: string;
}
type TabsChangeEvent = { selectedIndex: number };
interface TabItem {
  label: string;
  panel: ReactElement;
  disabled?: boolean;
}

// Upstream passes each arg as a prop; under exactOptionalPropertyTypes an unset
// arg (undefined) does not fit Carbon's optional props, so unset ones are dropped.
const defined = <T extends object>(props: T) =>
  Object.fromEntries(
    Object.entries(props).filter(([, value]) => value !== undefined)
  ) as { [K in keyof T]?: Exclude<T[K], undefined> };

const lineTabsSizeArgType = {
  size: {
    control: { type: 'select' },
    options: ['sm', 'md'],
    description: 'Specify the size of the tabs',
    table: {
      category: 'TabList',
    },
  },
} satisfies ArgTypes;

const tabsSizeArgType = {
  size: {
    control: { type: 'select' },
    options: ['sm', 'md', 'lg'],
    description: 'Specify the size of the tabs',
    table: {
      category: 'TabList',
    },
  },
} satisfies ArgTypes;

const containedTabsSizeArgs = {
  size: 'lg',
} satisfies TabListArgs;

const lineTabsSizeArgs = {
  size: 'md',
} satisfies TabListArgs;

const iconStoriesArgs = {
  badgeIndicator: false,
  defaultOpen: false,
  iconTabClassName: '',
  iconTabDisabled: false,
  iconTabLabel: 'New Notifications',
} satisfies Partial<IconStoryArgs>;

const tabsArgTypes = {
  tabsChildren: {
    control: false,
    description:
      'Provide child elements to be rendered inside the `Tabs`. These elements should render either `TabsList` or `TabsPanels`',
    name: 'children',
    table: {
      category: 'Tabs',
    },
  },
  defaultSelectedIndex: {
    control: { type: 'number' },
    description:
      'Specify which content tab should be initially selected when the component is first rendered',
    table: {
      category: 'Tabs',
      defaultValue: {
        summary: '0',
      },
    },
  },
  dismissable: {
    control: { type: 'boolean' },
    description: 'Whether the rendered Tab children should be dismissable.',
    table: {
      category: 'Tabs',
    },
  },
  onChange: {
    action: 'onChange',
    description:
      'Provide an optional function which is called whenever the state of the `Tabs` changes',
    table: {
      category: 'Tabs',
    },
  },
  onTabCloseRequest: {
    action: 'onTabCloseRequest',
    description:
      'If specifying the `onTabCloseRequest` prop, provide a callback function responsible for removing the tab when close button is pressed on one of the Tab elements',
    table: {
      category: 'Tabs',
    },
  },
  selectedIndex: {
    control: { type: 'number' },
    description:
      'Control which content panel is currently selected. This puts the component in a controlled mode and should be used along with `onChange`',
    table: {
      category: 'Tabs',
    },
  },
} satisfies ArgTypes;

const tabListArgTypes = {
  activation: {
    control: { type: 'select' },
    options: ['automatic', 'manual'],
    description:
      'Specify whether the content tab should be activated automatically or manually',
    table: {
      category: 'TabList',
      defaultValue: {
        summary: 'automatic',
      },
    },
  },
  tabListChildren: {
    control: false,
    description:
      'Provide child elements to be rendered inside `ContentTabs`. These elements should render a `ContentTab`',
    name: 'children',
    table: {
      category: 'TabList',
    },
  },
  'aria-label': {
    control: { type: 'text' },
    description:
      'Provide an accessible label to be read when a user interacts with this component',
    table: {
      category: 'TabList',
    },
  },
  className: {
    control: { type: 'text' },
    description:
      'Specify an optional className to be added to the container node',
    table: {
      category: 'TabList',
    },
  },
  contained: {
    control: { type: 'boolean' },
    description: 'Specify whether component is contained type',
    table: {
      category: 'TabList',
      defaultValue: {
        summary: 'false',
      },
    },
  },
  fullWidth: {
    control: { type: 'boolean' },
    description:
      'Used for tabs within a grid, this makes it so tabs span the full container width and have the same width. Only available on contained tabs with <9 children',
    table: {
      category: 'TabList',
      defaultValue: {
        summary: 'false',
      },
    },
  },
  iconSize: {
    control: { type: 'select' },
    options: ['default', 'lg'],
    description: 'If using `IconTab`, specify the size of the icon being used.',
    table: {
      category: 'TabList',
    },
  },
  leftOverflowButtonProps: {
    control: { type: 'object' },
    description: 'Provide the props that describe the left overflow button',
    table: {
      category: 'TabList',
    },
  },
  rightOverflowButtonProps: {
    control: { type: 'object' },
    description: 'Provide the props that describe the right overflow button',
    table: {
      category: 'TabList',
    },
  },
  scrollDebounceWait: {
    control: { type: 'number' },
    description:
      'Optionally provide a delay (in milliseconds) passed to the lodash debounce of the onScroll handler. This will impact the responsiveness of scroll arrow buttons rendering when scrolling to the first or last tab.',
    table: {
      category: 'TabList',
      defaultValue: {
        summary: '200',
      },
    },
  },
  scrollIntoView: {
    control: { type: 'boolean' },
    description:
      'Choose whether to automatically scroll to newly selected tabs on component rerender',
    table: {
      category: 'TabList',
    },
  },
} satisfies ArgTypes;

const iconStoriesArgTypes = {
  badgeIndicator: {
    description: '**Experimental**: Display an empty dot badge on the Tab.',
    control: {
      type: 'boolean',
    },
    table: {
      category: 'IconTab',
    },
  },
  iconTabChildren: {
    control: false,
    description:
      'Provide an icon to be rendered inside `IconTab` as the visual label for Tab.',
    name: 'children',
    table: {
      category: 'IconTab',
    },
  },
  iconTabClassName: {
    control: { type: 'text' },
    description: 'Specify an optional className to be added to your Tab',
    name: 'className',
    table: {
      category: 'IconTab',
    },
  },
  defaultOpen: {
    control: { type: 'boolean' },
    description:
      'Specify whether the tooltip for the icon should be open when it first renders',
    table: {
      category: 'IconTab',
      defaultValue: {
        summary: 'false',
      },
    },
  },
  iconTabDisabled: {
    control: { type: 'boolean' },
    description: 'Specify whether your IconTab is disabled.',
    name: 'disabled',
    table: {
      category: 'IconTab',
    },
  },
  enterDelayMs: {
    control: { type: 'number' },
    description:
      'Specify the duration in milliseconds to delay before displaying the tooltip for the icon.',
    table: {
      category: 'IconTab',
    },
  },
  iconTabLabel: {
    control: { type: 'text' },
    description: 'Provide the label to be rendered inside the Tooltip.',
    name: 'label',
    table: {
      category: 'IconTab',
    },
  },
  leaveDelayMs: {
    control: { type: 'number' },
    description:
      'Specify the duration in milliseconds to delay before hiding the tooltip',
    table: {
      category: 'IconTab',
    },
  },
} satisfies ArgTypes;

const tabArgTypes = {
  as: {
    control: { type: 'text' },
    description:
      'Provide a custom element to render instead of the default button',
    table: {
      category: 'Tab',
      defaultValue: {
        summary: 'button',
      },
    },
  },
  tabChildren: {
    control: false,
    description: 'Provide child elements to be rendered inside `Tab`.',
    name: 'children',
    table: {
      category: 'Tab',
    },
  },
  tabClassName: {
    control: { type: 'text' },
    description: 'Specify an optional className to be added to your Tab',
    name: 'className',
    table: {
      category: 'Tab',
    },
  },
  disabled: {
    control: { type: 'boolean' },
    description: 'Whether your Tab is disabled.',
    table: {
      category: 'Tab',
    },
  },
  onClick: {
    action: 'onClick',
    description:
      'Provide a handler that is invoked when a user clicks on the control',
    table: {
      category: 'Tab',
    },
  },
  onKeyDown: {
    action: 'onKeyDown',
    description:
      'Provide a handler that is invoked on the key down event for the control',
    table: {
      category: 'Tab',
    },
  },
  renderButton: {
    control: false,
    table: {
      disable: true,
    },
  },
  renderIcon: {
    control: false,
    description: 'A component used to render an icon.',
    table: {
      category: 'Tab',
    },
  },
  secondaryLabel: {
    control: { type: 'text' },
    description:
      'An optional label to render under the primary tab label. Only useful for contained tabs.',
    table: {
      category: 'Tab',
    },
  },
} satisfies ArgTypes;

const tabPanelsArgTypes = {
  tabPanelsChildren: {
    control: false,
    description: 'Provide child elements to be rendered inside `TabPanels`.',
    name: 'children',
    table: {
      category: 'TabPanels',
    },
  },
} satisfies ArgTypes;

const tabPanelArgTypes = {
  tabPanelChildren: {
    control: false,
    description: 'Provide child elements to be rendered inside `TabPanel`.',
    name: 'children',
    table: {
      category: 'TabPanel',
    },
  },
  tabPanelClassName: {
    control: { type: 'text' },
    description: 'Specify an optional className to be added to TabPanel.',
    name: 'className',
    table: {
      category: 'TabPanel',
    },
  },
} satisfies ArgTypes;

const tabsSkeletonArgTypes = {
  skeletonClassName: {
    control: { type: 'text' },
    description: 'Specify an optional className to add.',
    name: 'className',
    table: {
      category: 'TabsSkeleton',
    },
  },
} satisfies ArgTypes;

const tabListVerticalArgTypes = {
  activation: {
    ...tabListArgTypes.activation,
    table: {
      category: 'TabListVertical',
      defaultValue: {
        summary: 'automatic',
      },
    },
  },
  tabListVerticalChildren: {
    control: false,
    description:
      'Provide child elements to be rendered inside `ContentTabs`. These elements should render a `ContentTab`',
    name: 'children',
    table: {
      category: 'TabListVertical',
    },
  },
  'aria-label': {
    ...tabListArgTypes['aria-label'],
    table: {
      category: 'TabListVertical',
    },
  },
  className: {
    ...tabListArgTypes.className,
    table: {
      category: 'TabListVertical',
    },
  },
  scrollIntoView: {
    ...tabListArgTypes.scrollIntoView,
    table: {
      category: 'TabListVertical',
    },
  },
  size: {
    control: { type: 'select' },
    options: ['sm', 'md', 'lg', 'xl'],
    description: 'Specify the size of the tabs.',
    table: {
      category: 'TabListVertical',
    },
  },
} satisfies ArgTypes;

const tabsVerticalArgTypes = {
  tabsVerticalChildren: {
    control: false,
    description:
      'Provide child elements to be rendered inside the `TabsVertical`. These elements should render either `TabsListVertical` or `TabsPanels`',
    name: 'children',
    table: {
      category: 'TabsVertical',
    },
  },
  defaultSelectedIndex: {
    ...tabsArgTypes.defaultSelectedIndex,
    table: {
      category: 'TabsVertical',
      defaultValue: {
        summary: '0',
      },
    },
  },
  height: {
    control: { type: 'text' },
    description:
      'Option to set a height style only if using vertical variation',
    table: {
      category: 'TabsVertical',
    },
  },
  onChange: {
    ...tabsArgTypes.onChange,
    table: {
      category: 'TabsVertical',
    },
  },
  selectedIndex: {
    ...tabsArgTypes.selectedIndex,
    table: {
      category: 'TabsVertical',
    },
  },
} satisfies ArgTypes;

export default {
  title: 'Components/Tabs',
  component: Tabs,
  subcomponents: {
    TabsVertical,
    TabList,
    TabListVertical,
    Tab,
    TabPanels,
    TabPanel,
    IconTab,
    TabsSkeleton,
  },
  tags: ['carbon'],
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
    // `light` is deprecated
    light: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<ComponentProps<typeof Tabs> & { light?: boolean }>;

export const Default: StoryFn<DefaultArgs> = (args) => {
  const {
    activation,
    as,
    className,
    contained,
    defaultSelectedIndex,
    disabled,
    dismissable,
    fullWidth,
    iconSize,
    leftOverflowButtonProps,
    onChange,
    onClick,
    onKeyDown,
    onTabCloseRequest,
    renderIcon,
    rightOverflowButtonProps,
    scrollDebounceWait,
    scrollIntoView,
    secondaryLabel,
    selectedIndex,
    size,
    tabClassName,
    tabPanelClassName,
  } = args;

  return (
    <Tabs
      {...defined({
        defaultSelectedIndex,
        dismissable,
        onChange,
        onTabCloseRequest,
        selectedIndex,
      })}>
      <TabList
        {...defined({
          activation,
          'aria-label': args['aria-label'],
          className,
          contained,
          fullWidth,
          iconSize,
          leftOverflowButtonProps,
          rightOverflowButtonProps,
          scrollDebounceWait,
          scrollIntoView,
        })}
        size={size}>
        <Tab
          {...defined({
            as,
            className: tabClassName,
            disabled,
            onClick,
            onKeyDown,
            renderIcon,
            secondaryLabel,
          })}>
          Dashboard
        </Tab>
        <Tab>Monitoring</Tab>
        <Tab>Activity</Tab>
        <Tab>Settings</Tab>
      </TabList>
      <TabPanels>
        <TabPanel {...defined({ className: tabPanelClassName })}>
          Tab Panel 1
        </TabPanel>
        <TabPanel>Tab Panel 2</TabPanel>
        <TabPanel>Tab Panel 3</TabPanel>
        <TabPanel>Tab Panel 4</TabPanel>
      </TabPanels>
    </Tabs>
  );
};

Default.args = {
  defaultSelectedIndex: 0,
  contained: false,
  dismissable: false,
  ...lineTabsSizeArgs,
  scrollDebounceWait: 200,
};

Default.argTypes = {
  ...tabsArgTypes,
  ...tabListArgTypes,
  ...lineTabsSizeArgType,
  ...tabArgTypes,
  ...tabPanelsArgTypes,
  ...tabPanelArgTypes,
};

export const Dismissable: StoryFn<TabListArgs> = (args) => {
  const tabs: TabItem[] = [
    {
      label: 'Dashboard',
      panel: <TabPanel key={0}>Dashboard</TabPanel>,
    },
    {
      label: 'Monitoring',
      panel: <TabPanel key={1}>Monitoring</TabPanel>,
    },
    {
      label: 'Activity',
      panel: <TabPanel key={2}>Activity</TabPanel>,
    },
    {
      label: 'Settings',
      panel: <TabPanel key={3}>Settings</TabPanel>,
      disabled: true,
    },
  ];
  const [renderedTabs, setRenderedTabs] = useState(tabs);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleTabChange = (evt: TabsChangeEvent) => {
    setSelectedIndex(evt.selectedIndex);
  };

  const handleCloseTabRequest = (tabIndex: number) => {
    if (renderedTabs[tabIndex]?.disabled) {
      return;
    }
    const selectedTab = renderedTabs[selectedIndex];

    const filteredTabs = renderedTabs.filter((_, index) => index !== tabIndex);
    if (tabIndex === selectedIndex) {
      const defaultTabIndex = filteredTabs.findIndex((tab) => !tab.disabled);
      setSelectedIndex(defaultTabIndex);
    } else {
      setSelectedIndex(filteredTabs.indexOf(selectedTab as TabItem));
    }
    setRenderedTabs(filteredTabs);
  };

  const resetTabs = () => {
    setRenderedTabs(tabs);
  };

  return (
    <>
      <Button
        style={{ marginBottom: 'var(--cds-spacing-09)' }}
        onClick={resetTabs}>
        Reset
      </Button>
      <Tabs
        selectedIndex={selectedIndex}
        onChange={handleTabChange}
        dismissable
        onTabCloseRequest={handleCloseTabRequest}>
        <TabList size={args.size}>
          {renderedTabs.map((tab, index) => (
            <Tab key={index} disabled={tab.disabled ?? false}>
              {tab.label}
            </Tab>
          ))}
        </TabList>
        <TabPanels>{renderedTabs.map((tab) => tab.panel)}</TabPanels>
      </Tabs>
    </>
  );
};

Dismissable.argTypes = lineTabsSizeArgType;
Dismissable.args = lineTabsSizeArgs;

// Carbon renders the close button of a dismissable tab inside the tablist.
Dismissable.parameters = {
  a11y: {
    config: { rules: [{ id: 'aria-required-children', enabled: false }] },
  },
};

export const DismissableContained: StoryFn<TabListArgs> = (args) => {
  const tabs: TabItem[] = [
    {
      label: 'Dashboard',
      panel: <TabPanel key={0}>Dashboard</TabPanel>,
    },
    {
      label: 'Monitoring',
      panel: <TabPanel key={1}>Monitoring</TabPanel>,
    },
    {
      label: 'Activity',
      panel: <TabPanel key={2}>Activity</TabPanel>,
    },
    {
      label: 'Settings',
      panel: <TabPanel key={3}>Settings</TabPanel>,
      disabled: true,
    },
  ];
  const [renderedTabs, setRenderedTabs] = useState(tabs);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleTabChange = (evt: TabsChangeEvent) => {
    setSelectedIndex(evt.selectedIndex);
  };

  const handleCloseTabRequest = (tabIndex: number) => {
    if (renderedTabs[tabIndex]?.disabled) {
      return;
    }
    const selectedTab = renderedTabs[selectedIndex];

    const filteredTabs = renderedTabs.filter((_, index) => index !== tabIndex);
    if (tabIndex === selectedIndex) {
      const defaultTabIndex = filteredTabs.findIndex((tab) => !tab.disabled);
      setSelectedIndex(defaultTabIndex);
    } else {
      setSelectedIndex(filteredTabs.indexOf(selectedTab as TabItem));
    }
    setRenderedTabs(filteredTabs);
  };

  const resetTabs = () => {
    setRenderedTabs(tabs);
  };

  return (
    <>
      <Button
        style={{ marginBottom: 'var(--cds-spacing-09)' }}
        onClick={resetTabs}>
        Reset
      </Button>
      <Tabs
        selectedIndex={selectedIndex}
        onChange={handleTabChange}
        dismissable
        onTabCloseRequest={handleCloseTabRequest}>
        <TabList contained size={args.size}>
          {renderedTabs.map((tab, index) => (
            <Tab key={index} disabled={tab.disabled ?? false}>
              {tab.label}
            </Tab>
          ))}
        </TabList>
        <TabPanels>{renderedTabs.map((tab) => tab.panel)}</TabPanels>
      </Tabs>
    </>
  );
};

DismissableContained.argTypes = tabsSizeArgType;
DismissableContained.args = containedTabsSizeArgs;

// Carbon renders the close button of a dismissable tab inside the tablist.
DismissableContained.parameters = {
  a11y: {
    config: { rules: [{ id: 'aria-required-children', enabled: false }] },
  },
};

export const DismissableWithIcons: StoryFn<TabListArgs> = ({ size }) => {
  const tabs: TabItem[] = [
    {
      label: 'Dashboard',
      panel: <TabPanel key={0}>Dashboard</TabPanel>,
    },
    {
      label: 'Monitoring',
      panel: <TabPanel key={1}>Monitoring</TabPanel>,
    },
    {
      label: 'Activity',
      panel: <TabPanel key={2}>Activity</TabPanel>,
    },
    {
      label: 'Settings',
      panel: <TabPanel key={3}>Settings</TabPanel>,
      disabled: true,
    },
  ];
  const [renderedTabs, setRenderedTabs] = useState(tabs);

  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleTabChange = (evt: TabsChangeEvent) => {
    setSelectedIndex(evt.selectedIndex);
  };

  const handleCloseTabRequest = (tabIndex: number) => {
    if (renderedTabs[tabIndex]?.disabled) {
      return;
    }
    const selectedTab = renderedTabs[selectedIndex];

    const filteredTabs = renderedTabs.filter((_, index) => index !== tabIndex);
    if (tabIndex === selectedIndex) {
      const defaultTabIndex = filteredTabs.findIndex((tab) => !tab.disabled);
      setSelectedIndex(defaultTabIndex);
    } else {
      setSelectedIndex(filteredTabs.indexOf(selectedTab as TabItem));
    }
    setRenderedTabs(filteredTabs);
  };

  const resetTabs = () => {
    setRenderedTabs(tabs);
  };

  const icons = [Dashboard, CloudMonitoring, Settings, Activity];

  return (
    <>
      <Button
        style={{ marginBottom: 'var(--cds-spacing-09)' }}
        onClick={resetTabs}>
        Reset
      </Button>
      <Tabs
        selectedIndex={selectedIndex}
        onChange={handleTabChange}
        dismissable
        onTabCloseRequest={handleCloseTabRequest}>
        <TabList size={size}>
          {renderedTabs.map((tab, index) => (
            <Tab
              key={index}
              disabled={tab.disabled ?? false}
              renderIcon={icons[index] as (typeof icons)[number]}>
              {tab.label}
            </Tab>
          ))}
        </TabList>
        <TabPanels>{renderedTabs.map((tab) => tab.panel)}</TabPanels>
      </Tabs>
    </>
  );
};

DismissableWithIcons.argTypes = lineTabsSizeArgType;
DismissableWithIcons.args = lineTabsSizeArgs;

// Carbon renders the close button of a dismissable tab inside the tablist.
DismissableWithIcons.parameters = {
  a11y: {
    config: { rules: [{ id: 'aria-required-children', enabled: false }] },
  },
};

export const WithIcons: StoryFn<TabListArgs> = (args) => {
  return (
    <Tabs>
      <TabList activation="manual" size={args.size}>
        <Tab renderIcon={Dashboard}>Dashboard</Tab>
        <Tab renderIcon={CloudMonitoring}>Monitoring</Tab>
        <Tab renderIcon={Activity}>Activity</Tab>
        <Tab renderIcon={IbmWatsonDiscovery}>Analyze</Tab>
        <Tab disabled renderIcon={Settings}>
          Settings
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel>Tab Panel 1</TabPanel>
        <TabPanel>
          <form style={{ margin: 'var(--cds-spacing-07)' }}>
            <legend className={`cds--label`}>Validation example</legend>
            <Checkbox id="cb" labelText="Accept privacy policy" />
            <Button
              style={{
                marginTop: 'var(--cds-spacing-05)',
                marginBottom: 'var(--cds-spacing-05)',
              }}
              type="submit">
              Submit
            </Button>
            <TextInput
              type="text"
              labelText="Text input label"
              helperText="Optional help text"
              id="text-input-1"
            />
          </form>
        </TabPanel>
        <TabPanel>Tab Panel 3</TabPanel>
        <TabPanel>Tab Panel 4</TabPanel>
        <TabPanel>Tab Panel 5</TabPanel>
      </TabPanels>
    </Tabs>
  );
};

WithIcons.argTypes = lineTabsSizeArgType;
WithIcons.args = lineTabsSizeArgs;

export const Manual: StoryFn<TabListArgs> = (args) => {
  return (
    <Tabs>
      <TabList activation="manual" size={args.size}>
        <Tab>Dashboard</Tab>
        <Tab>Monitoring</Tab>
        <Tab title="Tab label 4">Activity</Tab>
        <Tab>Analyze</Tab>
        <Tab disabled>Settings</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>Tab Panel 1</TabPanel>
        <TabPanel>
          <form style={{ margin: 'var(--cds-spacing-07)' }}>
            <legend className={`cds--label`}>Validation example</legend>
            <Checkbox id="cb" labelText="Accept privacy policy" />
            <Button
              style={{
                marginTop: 'var(--cds-spacing-05)',
                marginBottom: 'var(--cds-spacing-05)',
              }}
              type="submit">
              Submit
            </Button>
            <TextInput
              type="text"
              labelText="Text input label"
              helperText="Optional help text"
              id="text-input-1"
            />
          </form>
        </TabPanel>
        <TabPanel>Tab Panel 3</TabPanel>
        <TabPanel>Tab Panel 4</TabPanel>
        <TabPanel>Tab Panel 5</TabPanel>
      </TabPanels>
    </Tabs>
  );
};

Manual.argTypes = lineTabsSizeArgType;
Manual.args = lineTabsSizeArgs;

export const Icon20Only: StoryFn<IconStoryArgs> = ({
  badgeIndicator,
  defaultOpen,
  enterDelayMs,
  iconTabClassName,
  iconTabDisabled,
  iconTabLabel,
  leaveDelayMs,
}) => {
  return (
    <Tabs>
      <TabList iconSize="lg">
        <IconTab label="Analyze" disabled>
          <IbmWatsonDiscovery size={20} aria-label="Analyze" />
        </IconTab>
        <IconTab label="Activity">
          <Activity size={20} aria-label="Activity" />
        </IconTab>
        <IconTab
          {...defined({
            badgeIndicator,
            className: iconTabClassName,
            defaultOpen,
            disabled: iconTabDisabled,
            enterDelayMs,
            leaveDelayMs,
          })}
          label={iconTabLabel}>
          <Notification size={20} aria-label="Notification" />
        </IconTab>
        <IconTab label="Chat">
          <Chat size={20} aria-label="Chat" />
        </IconTab>
      </TabList>
      <TabPanels>
        <TabPanel>Tab Panel 1</TabPanel>
        <TabPanel>Tab Panel 2</TabPanel>
        <TabPanel>Tab Panel 3</TabPanel>
        <TabPanel>Tab Panel 4</TabPanel>
      </TabPanels>
    </Tabs>
  );
};

Icon20Only.argTypes = iconStoriesArgTypes;
Icon20Only.args = iconStoriesArgs;

export const IconOnly: StoryFn<IconStoryArgs> = ({
  badgeIndicator,
  defaultOpen,
  enterDelayMs,
  iconTabClassName,
  iconTabDisabled,
  iconTabLabel,
  leaveDelayMs,
  size,
}) => {
  return (
    <Tabs>
      <TabList iconSize="default" size={size}>
        <IconTab label="Analyze" disabled>
          <IbmWatsonDiscovery aria-label="Analyze" />
        </IconTab>
        <IconTab label="Activity">
          <Activity aria-label="Activity" />
        </IconTab>
        <IconTab
          {...defined({
            badgeIndicator,
            className: iconTabClassName,
            defaultOpen,
            disabled: iconTabDisabled,
            enterDelayMs,
            leaveDelayMs,
          })}
          label={iconTabLabel}>
          <Notification aria-label="Notification" />
        </IconTab>
        <IconTab label="Chat">
          <Chat aria-label="Chat" />
        </IconTab>
      </TabList>
      <TabPanels>
        <TabPanel>Tab Panel 1</TabPanel>
        <TabPanel>Tab Panel 2</TabPanel>
        <TabPanel>Tab Panel 3</TabPanel>
        <TabPanel>Tab Panel 4</TabPanel>
      </TabPanels>
    </Tabs>
  );
};

IconOnly.argTypes = {
  ...lineTabsSizeArgType,
  ...iconStoriesArgTypes,
};
IconOnly.args = {
  ...lineTabsSizeArgs,
  ...iconStoriesArgs,
};

export const Contained: StoryFn<TabListArgs> = (args) => {
  return (
    <Tabs>
      <TabList contained size={args.size}>
        <Tab>Dashboard</Tab>
        <Tab>Monitoring</Tab>
        <Tab>Activity</Tab>
        <Tab>Analyze</Tab>
        <Tab disabled>Settings</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>Tab Panel 1</TabPanel>
        <TabPanel>
          <Layer>
            <form style={{ margin: 'var(--cds-spacing-07)' }}>
              <legend className={`cds--label`}>Validation example</legend>
              <Checkbox id="cb" labelText="Accept privacy policy" />
              <Button
                style={{
                  marginTop: 'var(--cds-spacing-05)',
                  marginBottom: 'var(--cds-spacing-05)',
                }}
                type="submit">
                Submit
              </Button>
              <TextInput
                type="text"
                labelText="Text input label"
                helperText="Optional help text"
                id="text-input-2"
              />
            </form>
          </Layer>
        </TabPanel>
        <TabPanel>Tab Panel 3</TabPanel>
        <TabPanel>Tab Panel 4</TabPanel>
        <TabPanel>Tab Panel 5</TabPanel>
      </TabPanels>
    </Tabs>
  );
};

Contained.argTypes = tabsSizeArgType;
Contained.args = containedTabsSizeArgs;

export const ContainedWithIcons: StoryFn<TabListArgs> = (args) => {
  return (
    <Tabs>
      <TabList contained size={args.size}>
        <Tab renderIcon={Dashboard}>Dashboard</Tab>
        <Tab renderIcon={CloudMonitoring}>Monitoring</Tab>
        <Tab renderIcon={Activity}>Activity</Tab>
        <Tab renderIcon={IbmWatsonDiscovery}>Analyze</Tab>
        <Tab disabled renderIcon={Settings}>
          Settings
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel>Tab Panel 1</TabPanel>
        <TabPanel>
          <Layer>
            <form style={{ margin: 'var(--cds-spacing-07)' }}>
              <legend className={`cds--label`}>Validation example</legend>
              <Checkbox id="cb" labelText="Accept privacy policy" />
              <Button
                style={{
                  marginTop: 'var(--cds-spacing-05)',
                  marginBottom: 'var(--cds-spacing-05)',
                }}
                type="submit">
                Submit
              </Button>
              <TextInput
                type="text"
                labelText="Text input label"
                helperText="Optional help text"
                id="text-input-3"
              />
            </form>
          </Layer>
        </TabPanel>
        <TabPanel>Tab Panel 3</TabPanel>
        <TabPanel>Tab Panel 4</TabPanel>
        <TabPanel>Tab Panel 5</TabPanel>
      </TabPanels>
    </Tabs>
  );
};

ContainedWithIcons.argTypes = tabsSizeArgType;
ContainedWithIcons.args = containedTabsSizeArgs;

export const ContainedWithSecondaryLabels: StoryFn<TabListArgs> = (args) => {
  return (
    <Tabs>
      <TabList contained size={args.size}>
        <Tab secondaryLabel="(21/25)">Engage</Tab>
        <Tab secondaryLabel="(12/16)">Analyze</Tab>
        <Tab secondaryLabel="(0/7)">Remediate</Tab>
        <Tab secondaryLabel="(4/12)">Assets</Tab>
        <Tab disabled secondaryLabel="(0/10)">
          Monitoring
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel>Tab Panel 1</TabPanel>
        <TabPanel>
          <Layer>
            <form style={{ margin: 'var(--cds-spacing-07)' }}>
              <legend className={`cds--label`}>Validation example</legend>
              <Checkbox id="cb" labelText="Accept privacy policy" />
              <Button
                style={{
                  marginTop: 'var(--cds-spacing-05)',
                  marginBottom: 'var(--cds-spacing-05)',
                }}
                type="submit">
                Submit
              </Button>
              <TextInput
                type="text"
                labelText="Text input label"
                helperText="Optional help text"
                id="text-input-4"
              />
            </form>
          </Layer>
        </TabPanel>
        <TabPanel>Tab Panel 3</TabPanel>
        <TabPanel>Tab Panel 4</TabPanel>
        <TabPanel>Tab Panel 5</TabPanel>
      </TabPanels>
    </Tabs>
  );
};

ContainedWithSecondaryLabels.argTypes = tabsSizeArgType;
ContainedWithSecondaryLabels.args = containedTabsSizeArgs;

export const ContainedWithSecondaryLabelsAndIcons: StoryFn<TabListArgs> = (
  args
) => {
  return (
    <Tabs>
      <TabList contained size={args.size}>
        <Tab renderIcon={Task} secondaryLabel="(21/25)">
          Engage
        </Tab>
        <Tab renderIcon={IbmWatsonDiscovery} secondaryLabel="(12/16)">
          Analyze
        </Tab>
        <Tab renderIcon={Restart} disabled secondaryLabel="(0/7)">
          Remediate
        </Tab>
        <Tab renderIcon={Dashboard} secondaryLabel="(4/12)">
          Assets
        </Tab>
        <Tab renderIcon={CloudMonitoring} secondaryLabel="(1/23)">
          Monitoring
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel>Tab Panel 1</TabPanel>
        <TabPanel>
          <Layer>
            <form style={{ margin: 'var(--cds-spacing-07)' }}>
              <legend className={`cds--label`}>Validation example</legend>
              <Checkbox id="cb" labelText="Accept privacy policy" />
              <Button
                style={{
                  marginTop: 'var(--cds-spacing-05)',
                  marginBottom: 'var(--cds-spacing-05)',
                }}
                type="submit">
                Submit
              </Button>
              <TextInput
                type="text"
                labelText="Text input label"
                helperText="Optional help text"
                id="text-input-5"
              />
            </form>
          </Layer>
        </TabPanel>
        <TabPanel>Tab Panel 3</TabPanel>
        <TabPanel>Tab Panel 4</TabPanel>
        <TabPanel>Tab Panel 5</TabPanel>
      </TabPanels>
    </Tabs>
  );
};

ContainedWithSecondaryLabelsAndIcons.argTypes = tabsSizeArgType;
ContainedWithSecondaryLabelsAndIcons.args = containedTabsSizeArgs;

export const ContainedFullWidth: StoryFn<TabListArgs> = (args) => {
  return (
    <Grid condensed>
      <Column lg={16} md={8} sm={4}>
        <Tabs>
          <TabList contained fullWidth size={args.size}>
            <Tab>TLS</Tab>
            <Tab>Origin</Tab>
            <Tab disabled>Rate limiting</Tab>
            <Tab>WAF</Tab>
            <Tab>IP Firewall</Tab>
            <Tab>Firewall rules</Tab>
            <Tab>Range</Tab>
            <Tab>Mutual TLS</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>Tab Panel 1</TabPanel>
            <TabPanel>
              <Layer>
                <form style={{ margin: 'var(--cds-spacing-07)' }}>
                  <legend className={`cds--label`}>Validation example</legend>
                  <Checkbox id="cb" labelText="Accept privacy policy" />
                  <Button
                    style={{
                      marginTop: 'var(--cds-spacing-05)',
                      marginBottom: 'var(--cds-spacing-05)',
                    }}
                    type="submit">
                    Submit
                  </Button>
                  <TextInput
                    type="text"
                    labelText="Text input label"
                    helperText="Optional help text"
                    id="text-input-6"
                  />
                </form>
              </Layer>
            </TabPanel>
            <TabPanel>Tab Panel 3</TabPanel>
            <TabPanel>Tab Panel 4</TabPanel>
            <TabPanel>Tab Panel 5</TabPanel>
            <TabPanel>Tab Panel 6</TabPanel>
            <TabPanel>Tab Panel 7</TabPanel>
            <TabPanel>Tab Panel 8</TabPanel>
          </TabPanels>
        </Tabs>
      </Column>
    </Grid>
  );
};

export const Vertical: StoryFn<VerticalArgs> = (args) => {
  const {
    activation,
    className,
    defaultSelectedIndex,
    height,
    onChange,
    scrollIntoView,
    selectedIndex,
    size,
  } = args;

  return (
    <TabsVertical
      {...defined({ defaultSelectedIndex, height, onChange, selectedIndex })}>
      <TabListVertical
        {...defined({
          activation,
          'aria-label': args['aria-label'],
          className,
          scrollIntoView,
        })}
        size={size}>
        <Tab>Dashboard</Tab>
        <Tab>
          Extra long label that will go two lines then truncate when it goes
          beyond the Tab length
        </Tab>
        <Tab>Activity</Tab>
        <Tab>Analyze</Tab>
        <Tab>Investigate </Tab>
        <Tab>Learn</Tab>
        <Tab disabled>Settings</Tab>
      </TabListVertical>
      <TabPanels>
        <TabPanel>Tab Panel 1</TabPanel>
        <TabPanel>
          <Layer>
            <form style={{ margin: 'var(--cds-spacing-07)' }}>
              <Stack gap={7}>
                <TextInput id="one" labelText="First Name" />
                <TextInput id="three" labelText="Middle Initial" />
                <TextInput id="two" labelText="Last Name" />
                <RadioButtonGroup
                  legendText="Radio button heading"
                  name="formgroup-default-radio-button-group"
                  defaultSelected="radio-1">
                  <RadioButton
                    labelText="Option 1"
                    value="radio-1"
                    id="radio-1"
                  />
                  <RadioButton
                    labelText="Option 2"
                    value="radio-2"
                    id="radio-2"
                  />
                  <RadioButton
                    labelText="Option 3"
                    value="radio-3"
                    id="radio-3"
                  />
                </RadioButtonGroup>
                <Checkbox labelText={`Checkbox one`} id="checkbox-label-1" />
                <Checkbox labelText={`Checkbox two`} id="checkbox-label-2" />
                <Button>Submit</Button>
              </Stack>
            </form>
          </Layer>
        </TabPanel>
        <TabPanel>Tab Panel 3</TabPanel>
        <TabPanel>Tab Panel 4</TabPanel>
        <TabPanel>Tab Panel 5</TabPanel>
        <TabPanel>Tab Panel 6</TabPanel>
        <TabPanel>Tab Panel 7</TabPanel>
      </TabPanels>
    </TabsVertical>
  );
};

Vertical.args = {
  defaultSelectedIndex: 0,
  height: '',
  size: 'xl',
};

Vertical.argTypes = {
  ...tabsVerticalArgTypes,
  ...tabListVerticalArgTypes,
};

Vertical.parameters = {
  controls: {
    exclude: ['dismissable'],
  },
};

export const Skeleton: StoryFn<SkeletonArgs> = ({
  skeletonClassName,
  ...args
}) => {
  return (
    <div style={{ maxWidth: '100%' }}>
      <TabsSkeleton
        {...defined({
          contained: args.contained,
          className: skeletonClassName,
        })}
      />
    </div>
  );
};

Skeleton.argTypes = {
  ...tabsSkeletonArgTypes,
  contained: {
    control: { type: 'boolean' },
    description: 'Provide the type of Tab',
    table: {
      category: 'TabsSkeleton',
    },
  },
};
Skeleton.args = {
  contained: false,
  skeletonClassName: '',
};

export const Icon20OnlyVisualSnapshots: StoryFn<IconStoryArgs> = ({
  badgeIndicator,
  defaultOpen,
  enterDelayMs,
  iconTabClassName,
  iconTabDisabled,
  iconTabLabel,
  leaveDelayMs,
}) => {
  return (
    <Tabs>
      <TabList iconSize="lg">
        <IconTab label="Analyze" disabled>
          <IbmWatsonDiscovery size={20} aria-label="Analyze" />
        </IconTab>
        <IconTab label="Activity">
          <Activity size={20} aria-label="Activity" />
        </IconTab>
        <IconTab
          {...defined({
            badgeIndicator,
            className: iconTabClassName,
            defaultOpen,
            disabled: iconTabDisabled,
            enterDelayMs,
            leaveDelayMs,
          })}
          label={iconTabLabel}>
          <Notification size={20} aria-label="Notification" />
        </IconTab>
        <IconTab label="Chat">
          <Chat size={20} aria-label="Chat" />
        </IconTab>
      </TabList>
      <TabPanels>
        <TabPanel>Tab Panel 1</TabPanel>
        <TabPanel>Tab Panel 2</TabPanel>
        <TabPanel>Tab Panel 3</TabPanel>
        <TabPanel>Tab Panel 4</TabPanel>
      </TabPanels>
    </Tabs>
  );
};

Icon20OnlyVisualSnapshots.argTypes = iconStoriesArgTypes;
Icon20OnlyVisualSnapshots.args = iconStoriesArgs;

Icon20OnlyVisualSnapshots.play = async ({ userEvent }) => {
  await userEvent.keyboard('{Tab}');
};

Icon20OnlyVisualSnapshots.tags = ['!dev', '!autodocs'];

// Carbon renders the icon tab tooltip inside the tablist once a tab has focus.
Icon20OnlyVisualSnapshots.parameters = {
  a11y: {
    config: { rules: [{ id: 'aria-required-children', enabled: false }] },
  },
};

export const IconOnlyVisualSnapshots: StoryFn<IconStoryArgs> = ({
  badgeIndicator,
  defaultOpen,
  enterDelayMs,
  iconTabClassName,
  iconTabDisabled,
  iconTabLabel,
  leaveDelayMs,
}) => {
  return (
    <Tabs>
      <TabList iconSize="default">
        <IconTab label="Analyze" disabled>
          <IbmWatsonDiscovery aria-label="Analyze" />
        </IconTab>
        <IconTab label="Activity">
          <Activity aria-label="Activity" />
        </IconTab>
        <IconTab
          {...defined({
            badgeIndicator,
            className: iconTabClassName,
            defaultOpen,
            disabled: iconTabDisabled,
            enterDelayMs,
            leaveDelayMs,
          })}
          label={iconTabLabel}>
          <Notification aria-label="Notification" />
        </IconTab>
        <IconTab label="Chat">
          <Chat aria-label="Chat" />
        </IconTab>
      </TabList>
      <TabPanels>
        <TabPanel>Tab Panel 1</TabPanel>
        <TabPanel>Tab Panel 2</TabPanel>
        <TabPanel>Tab Panel 3</TabPanel>
        <TabPanel>Tab Panel 4</TabPanel>
      </TabPanels>
    </Tabs>
  );
};

IconOnlyVisualSnapshots.argTypes = iconStoriesArgTypes;
IconOnlyVisualSnapshots.args = iconStoriesArgs;

IconOnlyVisualSnapshots.play = async ({ userEvent }) => {
  await userEvent.keyboard('{Tab}');
};

IconOnlyVisualSnapshots.tags = ['!dev', '!autodocs'];

// Carbon renders the icon tab tooltip inside the tablist once a tab has focus.
IconOnlyVisualSnapshots.parameters = {
  a11y: {
    config: { rules: [{ id: 'aria-required-children', enabled: false }] },
  },
};

ContainedFullWidth.argTypes = tabsSizeArgType;
ContainedFullWidth.args = containedTabsSizeArgs;
