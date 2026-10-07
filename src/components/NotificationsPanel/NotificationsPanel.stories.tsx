/**
 * Copyright IBM Corp. 2020, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2020, 2024
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, story styles in CSS, the c4p prefix as a literal, crypto.randomUUID instead of uuidv4, inline StoryDocsPage argType dropped, illustrationTheme arg set to its default, preventDefault dropped from the header action clicks (typed without an event). Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { useEffect, useRef, useState } from 'react';
import { action } from 'storybook/actions';
import {
  Button,
  Header,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderName,
  HeaderPanel,
  NotificationsPanel,
} from '../../index.js';
import type { NotificationsPanelProps } from '../../index.js';
import { Close, Notification, Switcher, User } from '../../icons.js';
import { UnreadNotificationBell } from './preview-components/UnreadNotificationBell.js';
import data from './NotificationsPanel_data.js';
import type { NotificationData } from './NotificationsPanel_data.js';
import mdx from './NotificationsPanel.mdx';
import './notifications-panel-story.css';

// The data and dateTimeLocale controls hold indexes that Storybook maps to
// values before the story renders.
type StoryArgs = Omit<NotificationsPanelProps, 'data' | 'dateTimeLocale'> & {
  data: number;
  dateTimeLocale: number;
};

const storyBlockClass = `c4p--notifications-panel__story`;

const dataOptions: Record<string, NotificationData[]> = {
  'Sample data set': data,
  'Empty data set': [],
};

const dateTimeLocaleOptions: Record<string, string | undefined> = {
  undefined: undefined,
  bg: 'bg',
  cs: 'cs',
  'da-DK': 'da-DK',
  'de-CH': 'de-CH',
  de: 'de',
  'en-AU': 'en-AU',
  'en-GB': 'en-GB',
  'en-US': 'en-US',
  'en-ZA': 'en-ZA',
  'es-ES': 'es-ES',
  es: 'es',
  et: 'et',
  fi: 'fi',
  'fr-CA': 'fr-CA',
  'fr-CH': 'fr-CH',
  fr: 'fr',
  hu: 'hu',
  it: 'it',
  ja: 'ja',
  lv: 'lv',
  'nl-BE': 'nl-BE',
  'nl-NL': 'nl-NL',
  no: 'no',
  pl: 'pl',
  'pt-BR': 'pt-BR',
  'pt-PT': 'pt-PT',
  'ru-UA': 'ru-UA',
  ru: 'ru',
  sk: 'sk',
  sl: 'sl',
  th: 'th',
  tr: 'tr',
  'uk-UA': 'uk-UA',
  vi: 'vi',
};

export default {
  title: 'Components/NotificationsPanel',
  component: NotificationsPanel,
  tags: ['ibm-products'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    data: {
      control: { type: 'select', labels: Object.keys(dataOptions) },
      options: Object.values(dataOptions).map((_k, i) => i),
      mapping: Object.values(dataOptions),
    },
    dateTimeLocale: {
      control: { type: 'select', labels: Object.keys(dateTimeLocaleOptions) },
      options: Object.values(dateTimeLocaleOptions).map((_k, i) => i),
      mapping: Object.values(dateTimeLocaleOptions),
    },
    dateTimeStyle: {
      options: ['long', 'short', 'narrow'],
      control: { type: 'radio' },
    },
  },
} satisfies Meta;

const defaultProps: StoryArgs = {
  data: 0,
  dateTimeLocale: 0,
  dateTimeStyle: 'long',
  illustrationTheme: 'light',
  open: true,
  onDoNotDisturbChange: action('Toggled "Do not disturb"'),
  onViewAllClick: action('Clicked "View all"'),
  onSettingsClick: action('Clicked gear icon'),
};

// Create a new notification.
const newNotification = (): NotificationData => {
  // Pick a random notification from the existing data set.
  const random = Math.floor(Math.random() * data.length);
  const notification = { ...data[random] };
  // Update dynamic data.
  notification.id = crypto.randomUUID();
  notification.timestamp = new Date();
  notification.unread = true;

  return notification;
};

const Template: StoryFn<StoryArgs> = (args) => {
  const { data, open, ...rest } = args as unknown as NotificationsPanelProps;
  const [notificationsData, setNotificationsData] = useState(data);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const [userOpen, setUserOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(open);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const userActionRef = useRef<HTMLButtonElement>(null);
  const notificationActionRef = useRef<HTMLButtonElement>(null);
  const switcherActionRef = useRef<HTMLButtonElement>(null);

  const markAllAsUnread = () => {
    const tempData = [...notificationsData];
    tempData.forEach((element) => (element.unread = false));
    setNotificationsData(tempData);
  };

  // Every time data is added or removed, check for unread notifications.
  useEffect(() => {
    const hasUnread = notificationsData.find(
      (notification) => notification.unread === true
    );
    setHasUnreadNotifications(!!hasUnread);
  }, [notificationsData]);

  // Every time the panel is opened, mark all notifications as unread.
  useEffect(() => {
    if (notificationsOpen) {
      markAllAsUnread();
    }
  }, [notificationsOpen]);

  // After changing `data` from the Storybook control.
  useEffect(() => {
    setNotificationsData(data);
  }, [data]);
  // After changing `open` from the Storybook control.
  useEffect(() => {
    setNotificationsOpen(open);
  }, [open]);

  const addNewNotification = () => {
    const notification = newNotification();
    setNotificationsData((data) => [...data, { ...notification }]);
  };

  return (
    <div className={`${storyBlockClass}--full-height`}>
      <Header
        aria-label="IBM Cloud Pak"
        className={`${storyBlockClass}--header`}>
        <HeaderName
          href="/"
          prefix="IBM"
          onClick={(e) => {
            e.preventDefault();
          }}>
          Cloud Pak
        </HeaderName>
        <HeaderGlobalBar>
          {/**
           *
           * User account
           *
           */}
          <HeaderGlobalAction
            ref={userActionRef}
            aria-label={userOpen ? 'Close user account' : 'Open user account'}
            isActive={userOpen}
            onClick={() => {
              setUserOpen((prevState) => !prevState);
              setNotificationsOpen(false);
              setSwitcherOpen(false);
              setTimeout(() => {
                userActionRef?.current?.focus();
              }, 0);
            }}>
            {userOpen ? <Close size={20} /> : <User size={20} />}
          </HeaderGlobalAction>
          <HeaderPanel expanded={userOpen}>
            <div className={`${storyBlockClass}__header-panel`}>
              User account
              <br />
              example panel
            </div>
          </HeaderPanel>
          {/**
           *
           * Notifications
           *
           */}
          <HeaderGlobalAction
            ref={notificationActionRef}
            aria-label={
              notificationsOpen ? 'Close notifications' : 'Open notifications'
            }
            aria-expanded={notificationsOpen}
            isActive={notificationsOpen}
            onClick={() => {
              markAllAsUnread();
              setNotificationsOpen((prevState) => !prevState);
              setUserOpen(false);
              setSwitcherOpen(false);
            }}>
            {notificationsOpen ? (
              <Close size={20} />
            ) : hasUnreadNotifications ? (
              <UnreadNotificationBell />
            ) : (
              <Notification size={20} />
            )}
          </HeaderGlobalAction>
          <NotificationsPanel
            triggerButtonRef={notificationActionRef}
            data={notificationsData}
            open={notificationsOpen}
            onClickOutside={() => {
              action('Clicked outside')();
              setNotificationsOpen(false);
            }}
            onDismissAllNotifications={() => {
              action('Clicked "Dismiss all"')();
              setNotificationsData([]);
            }}
            onDismissSingleNotification={({ id }) => {
              const deletedItem = notificationsData.find((item) => item.id);
              action('Clicked "Dismiss notification"')(deletedItem);

              let tempData = [...notificationsData];
              tempData = tempData.filter((item) => item.id !== id);
              setNotificationsData(tempData);
            }}
            {...rest}
          />
          {/**
           *
           * App switcher
           *
           */}
          <HeaderGlobalAction
            ref={switcherActionRef}
            aria-label={switcherOpen ? 'Close switcher' : 'Open switcher'}
            isActive={switcherOpen}
            onClick={() => {
              setSwitcherOpen((prevState) => !prevState);
              setUserOpen(false);
              setNotificationsOpen(false);
              setTimeout(() => {
                switcherActionRef?.current?.focus();
              }, 0);
            }}>
            {switcherOpen ? <Close size={20} /> : <Switcher size={20} />}
          </HeaderGlobalAction>
          <HeaderPanel expanded={switcherOpen}>
            <div className={`${storyBlockClass}__header-panel`}>
              App switcher
              <br />
              example panel
            </div>
          </HeaderPanel>
        </HeaderGlobalBar>
      </Header>
      <main>
        <div className={`${storyBlockClass}__add`}>
          <Button onClick={addNewNotification}>Add new notification</Button>
        </div>
      </main>
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  ...defaultProps,
};
// IBM renders each notification as role="button" around its own dismiss button.
Default.parameters = {
  a11y: { config: { rules: [{ id: 'nested-interactive', enabled: false }] } },
};
