/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, title Components/Add and select/SingleAddSelect, story styles imported as plain CSS instead of the styles parameter, the Overview story left out (the docs page takes its name in IBM's Storybook too), docs page converted to MDX, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import mdx from './SingleAddSelectPatterns.mdx';
import { SingleAddSelectDefaultPreview } from './example/preview-components/SingleAddSelectDefault/SingleAddSelectDefault.js';
import { SingleAddSelectWithHierarchyPreview } from './example/preview-components/SingleAddSelectWithHierarchy/SingleAddSelectWithHierarchy.js';
import { AddSingleItemFromHierarchyPreview } from './example/preview-components/AddSingleItemFromHierarchy/AddSingleItemFromHierarchy.js';
import './story-styles.css';

export default {
  title: 'Components/Add and select/SingleAddSelect',
  tags: ['ibm-products'],
  parameters: {
    // IBM's Storybook centres every story.
    layout: 'centered',
    docs: {
      page: mdx,
    },
  },
} satisfies Meta;

type Story = StoryObj;

// IBM nests the column rowgroups inside a rowgroup (docs/feature-flags.md).
const nestedRowgroups = {
  a11y: {
    config: {
      rules: [
        { id: 'aria-required-children', enabled: false },
        { id: 'aria-required-parent', enabled: false },
      ],
    },
  },
};

export const Default: Story = {
  render: (_args, context) => (
    <SingleAddSelectDefaultPreview initialOpen={context.viewMode !== 'docs'} />
  ),
};

export const WithHierarchy: Story = {
  name: 'With Hierarchy',
  parameters: nestedRowgroups,
  render: (_args, context) => (
    <SingleAddSelectWithHierarchyPreview
      initialOpen={context.viewMode !== 'docs'}
    />
  ),
};

export const WithHierarchyAndSidePanel: Story = {
  name: 'With Hierarchy and Side Panel',
  parameters: nestedRowgroups,
  render: (_args, context) => (
    <AddSingleItemFromHierarchyPreview
      initialOpen={context.viewMode !== 'docs'}
    />
  ),
};
