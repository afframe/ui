/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2023
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, CheckmarkFilled from @afframe/ui/icons, class prefix inlined, `value` passed by spread (missing from Carbon StructuredListInput types), source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { WithLayer } from '../../../.storybook/templates/WithLayer/index.js';
import { CheckmarkFilled } from '../../icons.js';
import {
  StructuredListBody,
  StructuredListCell,
  StructuredListHead,
  StructuredListInput,
  StructuredListRow,
  StructuredListSkeleton,
  StructuredListWrapper,
} from '../../index.js';
import mdx from './StructuredList.mdx';

const defaultArgs = {
  'aria-label': 'Service status',
  isCondensed: false,
  isFlush: false,
  selection: false,
};

const defaultArgTypes = {
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
  isFlush: {
    control: {
      type: 'boolean',
    },
  },
  selection: {
    table: { readonly: true },
  },
} satisfies Meta<typeof StructuredListWrapper>['argTypes'];

const defaultControls = ['aria-label', 'isCondensed', 'isFlush'];

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
  title: 'Components/StructuredList',
  component: StructuredListWrapper,
  subcomponents: {
    StructuredListHead,
    StructuredListBody,
    StructuredListRow,
    StructuredListInput,
    StructuredListCell,
  },
  tags: ['carbon'],
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof StructuredListWrapper>;

export const Default: StoryFn<typeof StructuredListWrapper> = (args) => {
  return (
    <StructuredListWrapper {...args}>
      <StructuredListHead>
        <StructuredListRow head>
          <StructuredListCell head>Service</StructuredListCell>
          <StructuredListCell head>Status</StructuredListCell>
          <StructuredListCell head>Description</StructuredListCell>
        </StructuredListRow>
      </StructuredListHead>
      <StructuredListBody>
        <StructuredListRow>
          <StructuredListCell noWrap>API gateway</StructuredListCell>
          <StructuredListCell>Online</StructuredListCell>
          <StructuredListCell>
            Routes and secures application traffic across environments.
          </StructuredListCell>
        </StructuredListRow>
        <StructuredListRow>
          <StructuredListCell noWrap>Data warehouse</StructuredListCell>
          <StructuredListCell>Maintenance</StructuredListCell>
          <StructuredListCell>
            Scheduled maintenance begins Friday at 22:00 UTC.
          </StructuredListCell>
        </StructuredListRow>
      </StructuredListBody>
    </StructuredListWrapper>
  );
};

Default.args = { ...defaultArgs };

Default.parameters = {
  controls: {
    include: defaultControls,
  },
};
Default.argTypes = { ...defaultArgTypes };
const structuredListBodyRowGenerator = (numRows: number) => {
  return selectionRows.slice(0, numRows).map((row, i) => (
    <StructuredListRow key={`row-${i}`} id={`row-${i}`}>
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
      <StructuredListCell>
        <CheckmarkFilled
          className="cds--structured-list-svg"
          aria-label="select an option">
          <title>select an option</title>
        </CheckmarkFilled>
      </StructuredListCell>
    </StructuredListRow>
  ));
};

export const Selection: StoryFn<typeof StructuredListWrapper> = (args) => {
  return (
    <StructuredListWrapper {...args}>
      <StructuredListHead>
        <StructuredListRow head>
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

export const InitialSelection: StoryFn<typeof StructuredListWrapper> = (
  args
) => {
  return (
    <StructuredListWrapper key={args.selectedInitialRow} {...args}>
      <StructuredListHead>
        <StructuredListRow head>
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
      rules: [{ id: 'aria-required-children', enabled: false }],
    },
  },
  controls: {
    include: selectionControls,
  },
};

InitialSelection.args = {
  ...selectionArgs,
  selectedInitialRow: 'row-2',
};
InitialSelection.argTypes = {
  ...selectionArgTypes,
  selectedInitialRow: {
    control: {
      type: 'select',
    },
    options: ['row-0', 'row-1', 'row-2', 'row-3'],
  },
};
InitialSelection.parameters = {
  a11y: {
    config: {
      rules: [{ id: 'aria-required-children', enabled: false }],
    },
  },
  controls: {
    include: [...selectionControls, 'selectedInitialRow'],
  },
};

export const WithBackgroundLayer: StoryFn<typeof StructuredListWrapper> = (
  args
) => {
  return (
    <WithLayer>
      <StructuredListWrapper {...args}>
        <StructuredListHead>
          <StructuredListRow head>
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
      rules: [{ id: 'aria-required-children', enabled: false }],
    },
  },
  controls: {
    include: selectionControls,
  },
};

export const Skeleton: StoryFn<typeof StructuredListSkeleton> = (args) => (
  <StructuredListSkeleton {...args} />
);

Skeleton.decorators = [
  (story) => <div style={{ width: '800px' }}>{story()}</div>,
];

Skeleton.args = {
  rowCount: 5,
};

Skeleton.parameters = {
  controls: {
    include: ['rowCount'],
  },
};

Skeleton.argTypes = {
  rowCount: {
    control: {
      type: 'number',
      min: 1,
      max: 10,
    },
  },
};
