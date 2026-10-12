/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2023
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, source tag, inner FeatureFlags wrapper written as a decorator. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { ActionableNotification, FeatureFlags } from '../../index.js';

export default {
  title: 'Components/Notifications/Actionable/Feature Flag',
  component: ActionableNotification,
  tags: ['carbon', '!autodocs'],
  decorators: [
    (Story) => (
      <FeatureFlags enableFocusWrapWithoutSentinels>
        <Story />
      </FeatureFlags>
    ),
  ],
  args: {
    kind: 'error',
    lowContrast: false,
    hideCloseButton: false,
    ['aria-label']: 'closes notification',
    statusIconDescription: 'notification',
    onClose: action('onClose'),
    onCloseButtonClick: action('onCloseButtonClick'),
  },
} satisfies Meta<typeof ActionableNotification>;

export const FocusWrapWithoutSentinels: StoryFn<
  typeof ActionableNotification
> = (args) => <ActionableNotification {...args} />;

FocusWrapWithoutSentinels.parameters = {
  controls: {
    exclude: ['aria-label', 'hasFocus'],
  },
};
FocusWrapWithoutSentinels.argTypes = {
  onActionButtonClick: {
    action: 'onActionButtonClick',
  },
  onClose: {
    action: 'onClose',
  },
  onCloseButtonClick: {
    action: 'onCloseButtonClick',
  },
};
FocusWrapWithoutSentinels.args = {
  actionButtonLabel: 'Action',
  inline: false,
  title: 'Notification title',
  subtitle: 'Subtitle text goes here',
};
