/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2023
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and useFeatureFlag from @afframe/ui, the WithFeatureFlags decorator removed (Afframe turns the flags on globally), unused second argument of the row generator dropped, `value` passed by spread (missing from Carbon StructuredListInput types), source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { WithLayer } from '../../../.storybook/templates/WithLayer/index.js';
import {
  StructuredListBody,
  StructuredListCell,
  StructuredListHead,
  StructuredListInput,
  StructuredListRow,
  StructuredListWrapper,
  useFeatureFlag,
} from '../../index.js';

const selectionArgs = {
  'aria-label': 'Deployment environments',
  isCondensed: false,
  selection: true,
};

const selectionArgTypes = {
  'aria-label': {
    control: {
      type: 'text',
    },
  },
  isCondensed: {
    control: {
      type: 'boolean',
    },
  },
  selection: {
    table: { readonly: true },
  },
} satisfies Meta<typeof StructuredListWrapper>['argTypes'];

const selectionControls = ['aria-label', 'isCondensed'];

const selectionRows = [
  {
    environment: 'Production',
    region: 'Frankfurt',
    purpose: 'Runs customer-facing services',
  },
  {
    environment: 'Staging',
    region: 'Dallas',
    purpose: 'Validates releases before deployment',
  },
  {
    environment: 'Development',
    region: 'London',
    purpose: 'Supports feature development and integration',
  },
  {
    environment: 'Disaster recovery',
    region: 'Sydney',
    purpose: 'Provides a standby recovery environment',
  },
];

export default {
  title: 'Components/StructuredList/Feature Flag',
  component: StructuredListWrapper,
  subcomponents: {
    StructuredListHead,
    StructuredListBody,
    StructuredListRow,
    StructuredListInput,
    StructuredListCell,
  },
  tags: ['carbon', '!autodocs'],
} satisfies Meta<typeof StructuredListWrapper>;

const structuredListBodyRowGenerator = (numRows: number) => {
  return selectionRows.slice(0, numRows).map((row, i) => (
    <StructuredListRow key={`row-${i}`} selection>
      <StructuredListCell>{row.environment}</StructuredListCell>
      <StructuredListCell>{row.region}</StructuredListCell>
      <StructuredListCell>{row.purpose}</StructuredListCell>
      <StructuredListInput
        id={`row-${i}`}
        // `value` reaches the input element but is missing from Carbon's types.
        {...{ value: `row-${i}` }}
        title={`row-${i}`}
        name="row-0"
        aria-label={`row-${i}`}
      />
    </StructuredListRow>
  ));
};

export const Selection: StoryFn<typeof StructuredListWrapper> = (args) => {
  return (
    <StructuredListWrapper {...args}>
      <StructuredListHead>
        <StructuredListRow head selection>
          <StructuredListCell head>Environment</StructuredListCell>
          <StructuredListCell head>Region</StructuredListCell>
          <StructuredListCell head>Purpose</StructuredListCell>
        </StructuredListRow>
      </StructuredListHead>
      <StructuredListBody>
        {structuredListBodyRowGenerator(4)}
      </StructuredListBody>
    </StructuredListWrapper>
  );
};

Selection.args = { ...selectionArgs };
Selection.argTypes = { ...selectionArgTypes };
Selection.parameters = {
  a11y: {
    config: {
      rules: [
        { id: 'aria-required-children', enabled: false },
        { id: 'empty-table-header', enabled: false },
      ],
    },
  },
  controls: {
    include: selectionControls,
  },
};

export const WithBackgroundLayer: StoryFn<typeof StructuredListWrapper> = (
  args
) => {
  const v12StructuredRadioIcons = useFeatureFlag(
    'enable-v12-structured-list-visible-icons'
  );
  return (
    <WithLayer>
      <StructuredListWrapper {...args}>
        <StructuredListHead>
          <StructuredListRow head>
            {v12StructuredRadioIcons && (
              <StructuredListCell head></StructuredListCell>
            )}
            <StructuredListCell head>Environment</StructuredListCell>
            <StructuredListCell head>Region</StructuredListCell>
            <StructuredListCell head>Purpose</StructuredListCell>
          </StructuredListRow>
        </StructuredListHead>
        <StructuredListBody>
          {structuredListBodyRowGenerator(4)}
        </StructuredListBody>
      </StructuredListWrapper>
    </WithLayer>
  );
};

WithBackgroundLayer.args = { ...selectionArgs };
WithBackgroundLayer.argTypes = { ...selectionArgTypes };
WithBackgroundLayer.parameters = {
  a11y: {
    config: {
      rules: [
        { id: 'aria-required-children', enabled: false },
        { id: 'empty-table-header', enabled: false },
      ],
    },
  },
  controls: {
    include: selectionControls,
  },
};
