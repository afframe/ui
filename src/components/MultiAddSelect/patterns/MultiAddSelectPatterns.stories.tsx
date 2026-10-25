/**
 * Copyright IBM Corp. 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, title Components/Add and Select/MultiAddSelect Pattern, story styles imported as plain CSS from the SingleAddSelect pattern folder instead of the styles parameter, centred layout as in IBM's Storybook, the Overview story left out (the docs page takes its name in IBM's Storybook too), docs page converted to MDX, source tag, story names from the export names where no other characters are needed (ADR 0019). Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import mdx from './MultiAddSelectPatterns.mdx';
import { MultiAddSelectDefault } from './example/preview-components/MultiAddSelectDefault/MultiAddSelectDefault.js';
import { MultiAddSelectWithHierarchyPreview } from './example/preview-components/MultiAddSelectWithHierarchy/MultiAddSelectWithHierarchy.js';
import { MultiAddSelectWithModifiers } from './example/preview-components/MultiAddSelectWithModifiers/MultiAddSelectWithModifiers.js';
import { NonHierarchicalWithPeekInsideItemPreview } from './example/preview-components/NonHierarchicalWithPeekInsideItem/NonHierarchicalWithPeekInsideItem.js';
import { MultiAddSelectWithHierarchyNoSelectAllPreview } from './example/preview-components/MultiAddSelectWithHierarchyNoSelectAll/MultiAddSelectWithHierarchyNoSelectAll.js';
import { MultiSelectWithBulkActionsPreview } from './example/preview-components/MultiSelectWithBulkActions/MultiSelectWithBulkActions.js';
import { MultiAddSelectWithGlobalActionsPreview } from './example/preview-components/MultiAddSelectWithGlobalActions/MultiAddSelectWithGlobalActions.js';
import { MultiAddSelectWithColumnActionsPreview } from './example/preview-components/MultiAddSelectWithColumnActions/MultiAddSelectWithColumnActions.js';
import { MultiSelectWithScrollPreview } from './example/preview-components/MultiSelectWithScroll/MultiSelectWithScroll.js';
import { MultiAddSelectWithDataTablePreview } from './example/preview-components/MultiAddSelectWithDataTable/MultiAddSelectWithDataTable.js';
import '../../SingleAddSelect/patterns/story-styles.css';

export default {
  title: 'Components/Add and Select/MultiAddSelect Pattern',
  tags: ['ibm-products'],
  parameters: {
    // IBM's Storybook centres every story.
    layout: 'centered',
    // IBM nests the column rowgroups inside a rowgroup and puts the search
    // and the DataTable inside the grid (docs/feature-flags.md).
    a11y: {
      config: {
        rules: [
          { id: 'aria-required-children', enabled: false },
          { id: 'aria-required-parent', enabled: false },
        ],
      },
    },
    docs: {
      page: mdx,
    },
  },
} satisfies Meta;

type Story = StoryObj;

export const Default: Story = {
  render: (_args, context) => (
    <MultiAddSelectDefault initialOpen={context.viewMode !== 'docs'} />
  ),
};

export const WithHierarchy: Story = {
  render: (_args, context) => (
    <MultiAddSelectWithHierarchyPreview
      initialOpen={context.viewMode !== 'docs'}
    />
  ),
};

export const WithModifiers: Story = {
  render: (_args, context) => (
    <MultiAddSelectWithModifiers initialOpen={context.viewMode !== 'docs'} />
  ),
};

export const NonHierarchicalWithPeekInsideItem: Story = {
  name: 'Non-Hierarchical with Peek Inside Item',
  render: (_args, context) => (
    <NonHierarchicalWithPeekInsideItemPreview
      initialOpen={context.viewMode !== 'docs'}
    />
  ),
};

export const WithHierarchyNoSelectAll: Story = {
  name: 'With Hierarchy (No Select All)',
  render: (_args, context) => (
    <MultiAddSelectWithHierarchyNoSelectAllPreview
      initialOpen={context.viewMode !== 'docs'}
    />
  ),
};

export const WithModifiersAndBulkActions: Story = {
  render: (_args, context) => (
    <MultiSelectWithBulkActionsPreview
      initialOpen={context.viewMode !== 'docs'}
    />
  ),
};

export const WithGlobalActions: Story = {
  render: (_args, context) => (
    <MultiAddSelectWithGlobalActionsPreview
      initialOpen={context.viewMode !== 'docs'}
    />
  ),
};

export const WithColumnActions: Story = {
  render: (_args, context) => (
    <MultiAddSelectWithColumnActionsPreview
      initialOpen={context.viewMode !== 'docs'}
    />
  ),
};

export const WithScroll: Story = {
  name: 'With Scroll (progressive loading)',
  render: (_args, context) => (
    <MultiSelectWithScrollPreview initialOpen={context.viewMode !== 'docs'} />
  ),
};

export const WithDataTable: Story = {
  render: (_args, context) => (
    <MultiAddSelectWithDataTablePreview
      initialOpen={context.viewMode !== 'docs'}
    />
  ),
};
