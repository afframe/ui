/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2023
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { Callout, Link } from '../../index.js';
import mdx from './Notification.mdx';

export default {
  title: 'Components/Notifications/Callout',
  component: Callout,
  tags: ['carbon'],
  parameters: {
    docs: {
      page: mdx,
    },
  },
  args: {
    kind: 'info',
    lowContrast: false,
    statusIconDescription: 'notification',
  },
  argTypes: {
    kind: {
      options: ['info', 'warning'],
      control: { type: 'select' },
    },
  },
} satisfies Meta<typeof Callout>;

export const Default: StoryFn<typeof Callout> = (args) => (
  <Callout
    title="Notification title"
    subtitle="Subtitle text goes here"
    {...args}
  />
);

Default.args = {
  subtitle: 'Subtitle text goes here',
  title: 'Notification title',
};

export const WithInteractiveElements: StoryFn<typeof Callout> = (args) => (
  <Callout {...args}>
    <div className="cds--inline-notification__subtitle">
      Additional text can describe the notification, or a link to{' '}
      <Link inline href="#" aria-describedby={args.titleId}>
        learn more
      </Link>
    </div>
  </Callout>
);

WithInteractiveElements.args = {
  kind: 'info',
  lowContrast: true,
  statusIconDescription: 'notification',
  title: 'Notification title',
  titleId: 'callout-title-interactive',
};

WithInteractiveElements.parameters = {
  controls: {
    include: ['kind', 'lowContrast', 'statusIconDescription', 'title'],
  },
};
