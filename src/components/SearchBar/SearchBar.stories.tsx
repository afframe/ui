/**
 * Copyright IBM Corp. 2024, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2024, 2024
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, previewCandidate__SearchBar from @afframe/ui, source tag, scss styles dropped, button-name a11y rule disabled on Scopes and UnsortedScopes. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { previewCandidate__SearchBar } from '../../index.js';
import mdx from './SearchBar.mdx';

const SearchBar = previewCandidate__SearchBar;

type Scope = { id: string; text: string };

export default {
  title: 'Preview Candidate/SearchBar',
  component: SearchBar,
  tags: ['ibm-products'],
  argTypes: {
    value: { control: { disable: true } },
    onChange: { control: { disable: true } },
    className: { control: { disable: true } },
    hideScopesLabel: { control: { disable: true } },
    onSubmit: { control: { disable: true } },
    scopeToString: { control: { disable: true } },
    scopes: { control: { disable: true } },
    scopesTypeLabel: { control: { disable: true } },
    selectedScopes: { control: { disable: true } },
    sortItems: { control: { disable: true } },
    titleText: { control: { disable: true } },
    translateWithId: { control: { disable: true } },
  },
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof SearchBar>;

const scopes: Scope[] = [
  {
    id: 'scope-2',
    text: 'Scope 2',
  },
  {
    id: 'scope-1',
    text: 'Scope 1',
  },
  {
    id: 'scope-3',
    text: 'Scope 3',
  },
];

const defaultProps = {
  clearButtonLabelText: 'Clear',
  placeholderText: 'Search...',
  submitLabel: 'Search',
  labelText: 'Label text',
  onChange: (newVal: string) => action('onChange')(newVal),
  onSubmit: (newVal: string) => action('onSubmit')(newVal),
};

const DefaultTemplate: StoryFn<typeof SearchBar> = ({ ...args }) => {
  return <SearchBar {...args} />;
};

const ScopesTemplate: StoryFn<typeof SearchBar> = ({ ...args }) => {
  return <SearchBar {...args} />;
};

export const Default = DefaultTemplate.bind({});
Default.args = {
  ...defaultProps,
};

export const InitialValue = DefaultTemplate.bind({});
InitialValue.args = {
  ...defaultProps,
  value: 'Initial value',
};

export const Scopes = ScopesTemplate.bind({});
Scopes.args = {
  ...defaultProps,
  scopes,
  scopesTypeLabel: 'Scopes',
  scopeToString: (item: string | object) => (item ? (item as Scope).text : ''),
};

export const UnsortedScopes = ScopesTemplate.bind({});
UnsortedScopes.args = {
  ...defaultProps,
  scopes,
  scopesTypeLabel: 'Scopes',
  sortItems: (items: readonly unknown[]) => items as unknown[],
  scopeToString: (item: string | object) => (item ? (item as Scope).text : ''),
};

export const SelectedScopes = DefaultTemplate.bind({});
SelectedScopes.args = {
  ...defaultProps,
  scopes,
  scopesTypeLabel: 'Scopes',
  selectedScopes: scopes.slice(0, 1),
  scopeToString: (item: string | object) => (item ? (item as Scope).text : ''),
};

// IBM's SearchBar gives the scopes MultiSelect no title text, so the toggle
// button has no accessible name until a scope is selected.
const buttonNameParameters = {
  a11y: { config: { rules: [{ id: 'button-name', enabled: false }] } },
};
Scopes.parameters = buttonNameParameters;
UnsortedScopes.parameters = buttonNameParameters;
