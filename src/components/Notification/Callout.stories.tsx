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
    title="Bank sync in progress"
    subtitle="New payments appear here within a few minutes."
    {...args}
  />
);

Default.args = {
  subtitle: 'New payments appear here within a few minutes.',
  title: 'Bank sync in progress',
};

export const WithInteractiveElements: StoryFn<typeof Callout> = (args) => (
  <Callout {...args}>
    <div className="cds--inline-notification__subtitle">
      New payments appear here within a few minutes.{' '}
      <Link inline href="#" aria-describedby={args.titleId}>
        View bank accounts
      </Link>
    </div>
  </Callout>
);

WithInteractiveElements.args = {
  kind: 'info',
  lowContrast: true,
  title: 'Bank sync in progress',
  titleId: 'callout-title-interactive',
};

WithInteractiveElements.parameters = {
  controls: {
    include: ['kind', 'lowContrast', 'statusIconDescription', 'title'],
  },
};
