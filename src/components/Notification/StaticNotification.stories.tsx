/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2023
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, source tag, inline spacing as Carbon spacing tokens. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { CodeSnippet, StaticNotification } from '../../index.js';
import mdx from './StaticNotification.mdx';

export default {
  title: 'Deprecated/preview__StaticNotification',
  component: StaticNotification,
  tags: ['carbon'],
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof StaticNotification>;

export const Default: StoryFn<typeof StaticNotification> = () => (
  <>
    <StaticNotification title="StaticNotification has been renamed to Callout" />

    <div
      style={{
        marginLeft: 'var(--cds-spacing-03)',
        marginTop: 'var(--cds-spacing-07)',
      }}>
      <p style={{ marginBottom: 'var(--cds-spacing-05)' }}>
        Run the following codemod to automatically update usages in your
        project:
      </p>
      <CodeSnippet type="single" feedback="Copied to clipboard">
        npx @carbon/upgrade migrate refactor-to-callout --write
      </CodeSnippet>
    </div>
  </>
);
