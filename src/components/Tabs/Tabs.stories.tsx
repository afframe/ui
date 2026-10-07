/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and icons from @afframe/ui, source tag, inline spacing as Carbon spacing tokens. Apache-2.0 text: LICENSES/Apache-2.0.txt.
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
type IconTabArgs = Omit<ComponentProps<typeof IconTab>, 'label'> & {
  size: TabListSize;
};
type VerticalArgs = ComponentProps<typeof TabsVertical> & {
  size: NonNullable<ComponentProps<typeof TabListVertical>['size']>;
};
type TabsChangeEvent = { selectedIndex: number };
interface TabItem {
  label: string;
  panel: ReactElement;
  disabled?: boolean;
}

const lineTabsSizeArgType = {
  size: {
    control: { type: 'select' },
    options: ['sm', 'md'],
    description: 'Specify the size of the tabs',
  },
} satisfies ArgTypes;

const tabsSizeArgType = {
  size: {
    control: { type: 'select' },
    options: ['sm', 'md', 'lg'],
    description: 'Specify the size of the tabs',
  },
} satisfies ArgTypes;

const containedTabsSizeArgs = {
  size: 'lg',
} satisfies TabListArgs;

const lineTabsSizeArgs = {
  size: 'md',
} satisfies TabListArgs;

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
  },
  tags: ['carbon'],
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    light: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<ComponentProps<typeof Tabs> & { light?: boolean }>;

export const Default: StoryFn<TabListArgs> = (args) => {
  return (
    <Tabs onTabCloseRequest={() => {}}>
      <TabList {...args}>
        <Tab>Dashboard</Tab>
        <Tab>Monitoring</Tab>
        <Tab>Activity</Tab>
        <Tab>Settings</Tab>
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

Default.args = {
  contained: false,
  dismissable: false,
  ...lineTabsSizeArgs,
  scrollDebounceWait: 200,
};

Default.argTypes = {
  activation: {
    control: { type: 'select' },
    options: ['automatic', 'manual'],
  },
  contained: {
    control: {
      type: 'boolean',
    },
  },
  dismissable: {
    control: false,
  },
  iconSize: {
    control: { type: 'select' },
    options: ['default', 'lg'],
  },
  leftOverflowButtonProps: {
    control: {
      type: 'object',
    },
  },
  rightOverflowButtonProps: {
    control: {
      type: 'object',
    },
  },
  scrollDebounceWait: {
    control: {
      type: 'number',
    },
  },
  scrollIntoView: {
    control: {
      type: 'boolean',
    },
  },
  ...lineTabsSizeArgType,
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

export const DismissableWithIcons: StoryFn<TabListArgs> = ({
  contained,
  size,
}) => {
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
        <TabList contained={contained ?? false} size={size}>
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

export const Manual: StoryFn = () => {
  return (
    <Tabs>
      <TabList activation="manual">
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

export const Icon20Only: StoryFn<IconTabArgs> = (args) => {
  return (
    <Tabs>
      <TabList iconSize="lg">
        <IconTab label="Analyze" disabled>
          <IbmWatsonDiscovery size={20} aria-label="Analyze" />
        </IconTab>
        <IconTab label="Activity">
          <Activity size={20} aria-label="Activity" />
        </IconTab>
        <IconTab label="New Notifications" {...args}>
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

Icon20Only.argTypes = {
  badgeIndicator: {
    description: '**Experimental**: Display an empty dot badge on the Tab.',
    control: {
      type: 'boolean',
    },
  },
};

export const IconOnly: StoryFn<IconTabArgs> = (args) => {
  return (
    <Tabs>
      <TabList iconSize="default" size={args.size}>
        <IconTab label="Analyze" disabled>
          <IbmWatsonDiscovery aria-label="Analyze" />
        </IconTab>
        <IconTab label="Activity">
          <Activity aria-label="Activity" />
        </IconTab>
        <IconTab label="New Notifications" {...args}>
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
  badgeIndicator: {
    description: '**Experimental**: Display an empty dot badge on the Tab.',
    control: {
      type: 'boolean',
    },
  },
};
IconOnly.args = lineTabsSizeArgs;

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

export const ContainedWithSecondaryLabels: StoryFn = () => {
  return (
    <Tabs>
      <TabList contained>
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

export const ContainedWithSecondaryLabelsAndIcons: StoryFn = () => {
  return (
    <Tabs>
      <TabList contained>
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
  const { size, ...tabsVerticalArgs } = args;
  return (
    <TabsVertical {...tabsVerticalArgs}>
      <TabListVertical size={size}>
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
  height: '',
  size: 'xl',
};

Vertical.argTypes = {
  height: {
    control: {
      type: 'text',
    },
  },
  size: {
    control: { type: 'select' },
    options: ['sm', 'md', 'lg', 'xl'],
    description: 'Specify the size of the vertical tabs',
  },
};

Vertical.parameters = {
  controls: {
    exclude: ['dismissable'],
  },
};

export const Skeleton: StoryFn = () => {
  return (
    <div style={{ maxWidth: '100%' }}>
      <TabsSkeleton />
    </div>
  );
};

export const Icon20OnlyVisualSnapshots: StoryFn<IconTabArgs> = (args) => {
  return (
    <Tabs>
      <TabList iconSize="lg">
        <IconTab label="Analyze" disabled>
          <IbmWatsonDiscovery size={20} aria-label="Analyze" />
        </IconTab>
        <IconTab label="Activity">
          <Activity size={20} aria-label="Activity" />
        </IconTab>
        <IconTab label="New Notifications" {...args}>
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

Icon20OnlyVisualSnapshots.argTypes = {
  badgeIndicator: {
    description: '**Experimental**: Display an empty dot badge on the Tab.',
    control: {
      type: 'boolean',
    },
  },
};

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

export const IconOnlyVisualSnapshots: StoryFn<IconTabArgs> = (args) => {
  return (
    <Tabs>
      <TabList iconSize="default">
        <IconTab label="Analyze" disabled>
          <IbmWatsonDiscovery aria-label="Analyze" />
        </IconTab>
        <IconTab label="Activity">
          <Activity aria-label="Activity" />
        </IconTab>
        <IconTab label="New Notifications" {...args}>
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

IconOnlyVisualSnapshots.argTypes = {
  badgeIndicator: {
    description: '**Experimental**: Display an empty dot badge on the Tab.',
    control: {
      type: 'boolean',
    },
  },
};

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
