/**
 * Copyright IBM Corp. 2024, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2024, 2024
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, source tag, story styles as a plain CSS file, template literals around props dropped, TODO comments dropped. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { FullPageError, Link } from '../../index.js';
import mdx from './FullPageError.mdx';
import { Breadcrumbs } from './preview-components/Breadcrumbs.js';
import { UiShell } from './preview-components/UiShell.js';
import './FullPageError-story.css';

export default {
  title: 'Components/FullPageError',
  component: FullPageError,
  tags: ['ibm-products'],
  argTypes: {
    kind: {
      control: {
        type: 'select',
      },
      options: ['403', '404', 'custom'],
    },
  },
  parameters: {
    layout: 'fullscreen',
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof FullPageError>;

const defaultProps = {
  kind: 'custom',
  title: '[Error title]',
  label: 'Error ###',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
} as const;

const Template: StoryFn<typeof FullPageError> = (args) => {
  const storyClass = 'full-page-error-stories';
  return (
    <div className={`${storyClass}__viewport`}>
      <UiShell>
        <div className={`${storyClass}__offset`}>
          <div className={`${storyClass}__breadcrumb-container`}>
            <Breadcrumbs className={`${storyClass}__breadcrumb`} />
          </div>
          <FullPageError
            title={args.title}
            label={args.label}
            description={args.description}
            {...(args.kind ? { kind: args.kind } : {})}>
            <Link size="lg" href={'/'}>
              – Forwarding Link 1
            </Link>
            <br />
            <Link size="lg" href={'/'}>
              – Forwarding Link 1
            </Link>
          </FullPageError>
        </div>
      </UiShell>
    </div>
  );
};

export const fullPageError = Template.bind({});
fullPageError.storyName = 'Default';
fullPageError.args = {
  ...defaultProps,
};
export const fullPageError403 = Template.bind({});
fullPageError403.storyName = '403';
fullPageError403.args = {
  ...defaultProps,
  title: 'Access denied',
  label: 'Error 403',
  description:
    'You are not authorized to access the requested page. Please verify that you are logged in to the hosting environment and your access permissions are correct.',
  kind: '403',
};
export const fullPageError404 = Template.bind({});
fullPageError404.storyName = '404';
fullPageError404.args = {
  ...defaultProps,
  title: 'Page not found',
  label: 'Error 404',
  description:
    'The page you requested has moved or is unavailable, or the specified URL is not valid. Please check the URL or search the site for the requested content.',
  kind: '404',
};
