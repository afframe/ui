/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2023
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, source tag, glossary text, status icon description left to Carbon's default. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { InlineNotification } from '../../index.js';
import mdx from './Notification.mdx';

export default {
  title: 'Components/Notifications/InlineNotification',
  component: InlineNotification,
  tags: ['carbon'],
  parameters: {
    docs: {
      page: mdx,
    },
    controls: {
      exclude: ['actionButtonLabel', 'aria-label'],
    },
  },
  args: {
    kind: 'error',
    lowContrast: false,
    hideCloseButton: false,
    ['aria-label']: 'closes notification',
    onClose: action('onClose'),
    onCloseButtonClick: action('onCloseButtonClick'),
  },
} satisfies Meta<typeof InlineNotification>;

export const Default: StoryFn<typeof InlineNotification> = (args) => (
  <InlineNotification {...args} />
);

Default.argTypes = {
  onClose: {
    action: 'onClose',
  },
  onCloseButtonClick: {
    action: 'onCloseButtonClick',
  },
};
Default.args = {
  title: 'Invoice export failed',
  subtitle:
    '3 of 120 invoices were not exported. Check the customer tax IDs and try again.',
};
