/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2023
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, source tag, title under Components (upstream Elements/Grid), story styles as plain CSS. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import './Grid.stories.css';

import type { ArgTypes, Decorator, Meta, StoryFn } from '@storybook/react-vite';
import type { ComponentProps } from 'react';
import { Column, ColumnHang, Grid, GridSettings } from '../../index.js';
import mdx from './Grid.mdx';

type GridArgs = ComponentProps<typeof Grid>;

const defaultArgs = {
  align: 'center',
  as: 'div',
  condensed: false,
  fullWidth: false,
  narrow: false,
  withRowGap: false,
} satisfies GridArgs;

const sharedArgTypes = {
  align: {
    control: 'radio',
    options: ['start', 'center', 'end'],
  },
  as: {
    control: 'text',
  },
  children: {
    control: false,
  },
  className: {
    control: false,
  },
  condensed: {
    control: 'boolean',
  },
  fullWidth: {
    control: 'boolean',
  },
  narrow: {
    control: 'boolean',
  },
  withRowGap: {
    control: 'boolean',
  },
} satisfies ArgTypes;

export default {
  title: 'Components/Grid',
  component: Grid,
  subcomponents: {
    Column,
  },
  tags: ['carbon'],
  args: defaultArgs,
  argTypes: sharedArgTypes,
  parameters: {
    docs: {
      page: mdx,
    },
  },
  decorators: [
    ((Story) => {
      return (
        <div className="sb-css-grid-container">
          <Story />
        </div>
      );
    }) satisfies Decorator,
  ],
} satisfies Meta<typeof Grid>;

export const Default: StoryFn<GridArgs> = (args) => {
  return (
    <div className="sb-css-grid-container">
      <Grid {...args}>
        <Column sm={4} />
        <Column sm={4} />
        <Column sm={4} />
        <Column sm={4} />
      </Grid>
    </div>
  );
};

export const WithRowGap: StoryFn<GridArgs> = (args) => {
  return (
    <div className="sb-css-grid-container">
      <Grid {...args}>
        <Column sm={4} md={4} lg={4} />
        <Column sm={4} md={4} lg={4} />
        <Column sm={4} md={4} lg={4} />
        <Column sm={4} md={4} lg={4} />
        <Column sm={4} md={4} lg={4} />
        <Column sm={4} md={4} lg={4} />
        <Column sm={4} md={4} lg={4} />
        <Column sm={4} md={4} lg={4} />
      </Grid>
    </div>
  );
};

WithRowGap.args = {
  withRowGap: true,
};

WithRowGap.argTypes = {
  ...sharedArgTypes,
  withRowGap: {
    ...sharedArgTypes.withRowGap,
    table: {
      readonly: true,
    },
  },
};

export const Narrow: StoryFn<GridArgs> = (args) => {
  return (
    <div className="sb-css-grid-container">
      <Grid {...args}>
        <Column sm={4} />
        <Column sm={4} />
        <Column sm={4} />
        <Column sm={4} />
      </Grid>
    </div>
  );
};

Narrow.args = {
  narrow: true,
};

Narrow.argTypes = {
  ...sharedArgTypes,
  narrow: {
    ...sharedArgTypes.narrow,
    table: {
      readonly: true,
    },
  },
};

export const Condensed: StoryFn<GridArgs> = (args) => {
  return (
    <div className="sb-css-grid-container">
      <Grid {...args}>
        <Column sm={4} />
        <Column sm={4} />
        <Column sm={4} />
        <Column sm={4} />
      </Grid>
    </div>
  );
};

Condensed.args = {
  condensed: true,
};

Condensed.argTypes = {
  ...sharedArgTypes,
  condensed: {
    ...sharedArgTypes.condensed,
    table: {
      readonly: true,
    },
  },
};

export const FullWidth: StoryFn<GridArgs> = (args) => {
  return (
    <div className="sb-css-grid-container">
      <Grid {...args}>
        <Column sm={4} />
        <Column sm={4} />
        <Column sm={4} />
        <Column sm={4} />
      </Grid>
    </div>
  );
};

FullWidth.args = {
  fullWidth: true,
};

FullWidth.argTypes = {
  ...sharedArgTypes,
  fullWidth: {
    ...sharedArgTypes.fullWidth,
    table: {
      readonly: true,
    },
  },
};

export const Responsive: StoryFn<GridArgs> = (args) => {
  return (
    <div className="sb-css-grid-container">
      <Grid {...args}>
        <Column sm={2} md={4} lg={6}>
          <p>Small: Span 2 of 4</p>
          <p>Medium: Span 4 of 8</p>
          <p>Large: Span 6 of 16</p>
        </Column>
        <Column sm={2} md={2} lg={3}>
          <p>Small: Span 2 of 4</p>
          <p>Medium: Span 2 of 8</p>
          <p>Large: Span 3 of 16</p>
        </Column>
        <Column sm={0} md={2} lg={3}>
          <p>Small: Span 0 of 4</p>
          <p>Medium: Span 2 of 8</p>
          <p>Large: Span 3 of 16</p>
        </Column>
        <Column sm={0} md={0} lg={4}>
          <p>Small: Span 0 of 4</p>
          <p>Medium: Span 0 of 8</p>
          <p>Large: Span 4 of 16</p>
        </Column>
        <Column sm="25%" md="50%" lg="75%">
          <p>Small: Span 25%</p>
          <p>Medium: Span 50%</p>
          <p>Large: Span 75%</p>
        </Column>
      </Grid>
    </div>
  );
};

export const Subgrid: StoryFn<GridArgs> = (args) => {
  return (
    <div className="sb-css-grid-container">
      <Grid {...args}>
        <Column sm={2} md={4} lg={3}>
          <p>Small: Span 2 of 4</p>
          <p>Medium: Span 4 of 8</p>
          <p>Large: Span 3 of 16</p>
        </Column>
        <Column sm={2} md={4} lg={10}>
          <p>Small: Span 2 of 4</p>
          <p>Medium: Span 4 of 8</p>
          <p>Large: Span 10 of 16</p>
          <Grid className="example">
            <Column sm={1} md={1} lg={2}>
              <p>sm={1}</p> <p>md={1}</p> <p>lg={2}</p>
            </Column>
            <Column sm={1} md={1} lg={2}>
              <p>sm={1}</p> <p>md={1}</p> <p>lg={2}</p>
            </Column>
            <Column sm={0} md={1} lg={1}>
              <p>sm={0}</p> <p>md={1}</p> <p>lg={1}</p>
            </Column>
            <Column sm={0} md={1} lg={1}>
              <p>sm={0}</p> <p>md={1}</p> <p>lg={1}</p>
            </Column>
            <Column sm={0} md={0} lg={1}>
              <p>sm={0}</p> <p>md={0}</p> <p>lg={1}</p>
            </Column>
            <Column sm={0} md={0} lg={1}>
              <p>sm={0}</p> <p>md={0}</p> <p>lg={1}</p>
            </Column>
            <Column sm={0} md={0} lg={1}>
              <p>sm={0}</p> <p>md={0}</p> <p>lg={1}</p>
            </Column>
            <Column sm={0} md={0} lg={1}>
              <p>sm={0}</p> <p>md={0}</p> <p>lg={1}</p>
            </Column>
          </Grid>
        </Column>
        <Column sm={0} md={0} lg={3}>
          <p>Small: Span 0 of 4</p>
          <p>Medium: Span 0 of 8</p>
          <p>Large: Span 3 of 16</p>
        </Column>
      </Grid>

      <h5>Wide</h5>
      <Grid>
        <Column sm={4} md={4} lg={4} />
        <Column sm={4} md={4} lg={4} />
        <Column sm={4} md={4} lg={4} />
        <Column sm={4} md={4} lg={4} />
        <Column sm={4} md={8} lg={16}>
          <Grid>
            <Column sm={4} md={4} lg={4} />
            <Column sm={4} md={4} lg={4} />
            <Column sm={4} md={4} lg={4} />
            <Column sm={4} md={4} lg={4} />
          </Grid>
        </Column>
      </Grid>
      <h5>Narrow</h5>
      <Grid narrow>
        <Column sm={4} md={4} lg={4} />
        <Column sm={4} md={4} lg={4} />
        <Column sm={4} md={4} lg={4} />
        <Column sm={4} md={4} lg={4} />
        <Column sm={4} md={8} lg={16}>
          <Grid narrow>
            <Column sm={4} md={4} lg={4} />
            <Column sm={4} md={4} lg={4} />
            <Column sm={4} md={4} lg={4} />
            <Column sm={4} md={4} lg={4} />
          </Grid>
        </Column>
      </Grid>
      <h5>Condensed</h5>
      <Grid condensed>
        <Column sm={4} md={4} lg={4} />
        <Column sm={4} md={4} lg={4} />
        <Column sm={4} md={4} lg={4} />
        <Column sm={4} md={4} lg={4} />
        <Column sm={4} md={8} lg={16}>
          <Grid condensed>
            <Column sm={4} md={4} lg={4} />
            <Column sm={4} md={4} lg={4} />
            <Column sm={4} md={4} lg={4} />
            <Column sm={4} md={4} lg={4} />
          </Grid>
        </Column>
      </Grid>
    </div>
  );
};

export const SubgridWithRowGap: StoryFn<GridArgs> = (args) => (
  <Grid {...args}>
    <Column sm={4} md={8} lg={16}>
      <Grid withRowGap>
        {/* Nested subgrid with row gap */}
        <Column sm={4} md={4} lg={8} />
        <Column sm={4} md={4} lg={8} />
        <Column sm={4} md={4} lg={8} />
        <Column sm={4} md={4} lg={8} />
      </Grid>
    </Column>
    <Column sm={4} md={8} lg={16}>
      <Grid withRowGap narrow>
        {/* Nested subgrid with row gap */}
        <Column sm={4} md={4} lg={8} />
        <Column sm={4} md={4} lg={8} />
        <Column sm={4} md={4} lg={8} />
        <Column sm={4} md={4} lg={8} />
      </Grid>
    </Column>
    <Column sm={4} md={8} lg={16}>
      <Grid withRowGap condensed>
        {/* Nested subgrid with row gap */}
        <Column sm={4} md={4} lg={8} />
        <Column sm={4} md={4} lg={8} />
        <Column sm={4} md={4} lg={8} />
        <Column sm={4} md={4} lg={8} />
      </Grid>
    </Column>
  </Grid>
);

SubgridWithRowGap.args = {
  withRowGap: true,
};

SubgridWithRowGap.argTypes = {
  ...sharedArgTypes,
  withRowGap: {
    ...sharedArgTypes.withRowGap,
    table: {
      readonly: true,
    },
  },
};

export const MixedGutterModes: StoryFn<GridArgs> = (args) => {
  return (
    <div className="sb-css-grid-container">
      <Grid {...args}>
        <Column span={8}>
          <Grid>
            <Column span={8}>
              <Grid narrow>
                <Column>
                  <ColumnHang>Text</ColumnHang>
                </Column>
                <Column>
                  <ColumnHang>Text</ColumnHang>
                </Column>
                <Column>
                  <ColumnHang>Text</ColumnHang>
                </Column>
                <Column>
                  <ColumnHang>Text</ColumnHang>
                </Column>
                <Column span={4}>
                  <Grid>
                    <Column>Text</Column>
                    <Column>Text</Column>
                    <Column span={2}>
                      <Grid condensed>
                        <Column>
                          <ColumnHang>Text</ColumnHang>
                        </Column>
                        <Column>
                          <ColumnHang>Text</ColumnHang>
                        </Column>
                      </Grid>
                    </Column>
                  </Grid>
                </Column>
              </Grid>
            </Column>
          </Grid>
        </Column>
      </Grid>
      <Grid {...args} narrow>
        <Column span={8}>
          <Grid>
            <Column span={4} />
            <Column span={4}>
              <Grid narrow>
                <Column>
                  <ColumnHang>Text</ColumnHang>
                </Column>
                <Column>
                  <ColumnHang>Text</ColumnHang>
                </Column>
                <Column>
                  <ColumnHang>Text</ColumnHang>
                </Column>
                <Column>
                  <ColumnHang>Text</ColumnHang>
                </Column>
              </Grid>
            </Column>
          </Grid>
        </Column>
      </Grid>
    </div>
  );
};

export const GridStartEnd: StoryFn<GridArgs> = (args) => {
  return (
    <div className="sb-css-grid-container">
      <Grid {...args}>
        <Column
          sm={{ span: 1, start: 4 }}
          md={{ span: 2, start: 7 }}
          lg={{ span: 4, start: 13 }}>
          span, start
        </Column>
        <Column
          sm={{ span: 2, end: 5 }}
          md={{ span: 4, end: 9 }}
          lg={{ span: 8, end: 17 }}>
          span, end
        </Column>
        <Column
          sm={{ start: 1, end: 4 }}
          md={{ start: 3, end: 9 }}
          lg={{ start: 5, end: 17 }}>
          start, end
        </Column>
      </Grid>
    </div>
  );
};

export const Offset: StoryFn<GridArgs> = (args) => {
  return (
    <div className="sb-css-grid-container">
      <Grid {...args}>
        <Column
          sm={{ span: 1, offset: 3 }}
          md={{ span: 2, offset: 6 }}
          lg={{ span: 4, offset: 12 }}
        />
        <Column
          sm={{ span: 2, offset: 2 }}
          md={{ span: 4, offset: 4 }}
          lg={{ span: 8, offset: 8 }}
        />
        <Column
          sm={{ span: 3, offset: 1 }}
          md={{ span: 6, offset: 2 }}
          lg={{ span: 12, offset: 4 }}
        />
        <Column sm={{ span: 4 }} md={{ span: 8 }} lg={{ span: 16 }} />
        <Column
          sm={{ span: '25%', offset: 1 }}
          md={{ span: '50%', offset: 2 }}
          lg={{ span: '75%', offset: 4 }}
        />
      </Grid>
    </div>
  );
};

type GridSettingsArgs = GridArgs & { subgrid: boolean };

export const WithGridSettings: StoryFn<GridSettingsArgs> = (args) => {
  return (
    <div className="sb-css-grid-container">
      <GridSettings mode="css-grid" subgrid={args.subgrid}>
        <Grid>
          <Column sm={4} md={4} lg={4}>
            <p>Column 1</p>
          </Column>
          <Column sm={4} md={4} lg={4}>
            <p>Column 2</p>
          </Column>
          <Column sm={4} md={4} lg={4}>
            <p>Column 3</p>
          </Column>
          <Column sm={4} md={4} lg={4}>
            <p>Column 4</p>
          </Column>
        </Grid>
      </GridSettings>
    </div>
  );
};

WithGridSettings.args = {
  subgrid: false,
};

WithGridSettings.argTypes = {
  subgrid: {
    control: 'boolean',
    description: 'If true, will specify whether subgrid should be enabled',
  },
  align: {
    control: false,
  },
  condensed: {
    control: false,
  },
  fullWidth: {
    control: false,
  },
  narrow: {
    control: false,
  },
  withRowGap: {
    control: false,
  },
};

WithGridSettings.parameters = {
  controls: {
    include: ['subgrid'],
  },
};
