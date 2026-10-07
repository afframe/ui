/**
 * Copyright IBM Corp. 2022, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2022, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, no PropTypes, source tag, title under Components (upstream Elements/FlexGrid), story styles as plain CSS. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import './FlexGrid.stories.css';
import type { ArgTypes, Meta, StoryFn } from '@storybook/react-vite';
import type { ComponentProps, ReactNode } from 'react';
import { Column, FlexGrid, Row } from '../../index.js';
import mdx from './FlexGrid.mdx';

type FlexGridArgs = ComponentProps<typeof FlexGrid>;

function DemoContent({ children }: { children?: ReactNode }) {
  return (
    <div className="outside">
      <div className="inside">{children}</div>
    </div>
  );
}

const args = {
  align: 'center',
  condensed: false,
  fullWidth: false,
  narrow: false,
  withRowGap: false,
} satisfies FlexGridArgs;

const argTypes = {
  align: {
    control: { type: 'select' },
    options: ['start', 'center', 'end'],
  },
  condensed: {
    control: { type: 'boolean' },
  },
  fullWidth: {
    control: { type: 'boolean' },
  },
  narrow: {
    control: { type: 'boolean' },
  },
  withRowGap: {
    control: { type: 'boolean' },
  },
} satisfies ArgTypes;

const gridContainerControls = ['align', 'fullWidth', 'withRowGap'];

export default {
  title: 'Components/FlexGrid',
  component: FlexGrid,
  subcomponents: {
    Row,
    Column,
  },
  tags: ['carbon'],
  decorators: [(storyFn) => <div id="templates">{storyFn()}</div>],
  parameters: {
    controls: {
      include: Object.keys(argTypes),
    },
    docs: {
      page: mdx,
    },
  },
  args,
  argTypes,
} satisfies Meta<FlexGridArgs>;

export const AutoColumns: StoryFn<FlexGridArgs> = (args) => {
  return (
    <div id="templates">
      <FlexGrid {...args}>
        <Row>
          <Column>
            <DemoContent>Span 25%</DemoContent>
          </Column>
          <Column>
            <DemoContent>Span 25%</DemoContent>
          </Column>
          <Column>
            <DemoContent>Span 25%</DemoContent>
          </Column>
          <Column>
            <DemoContent>Span 25%</DemoContent>
          </Column>
        </Row>
      </FlexGrid>
    </div>
  );
};

export const ResponsiveGrid: StoryFn<FlexGridArgs> = (args) => {
  return (
    <div id="templates">
      <FlexGrid {...args}>
        <Row>
          <Column sm={2} md={4} lg={6}>
            <DemoContent>
              <p>Small: Span 2 of 4</p>
              <p>Medium: Span 4 of 8</p>
              <p>Large: Span 6 of 16</p>
            </DemoContent>
          </Column>
          <Column sm={2} md={2} lg={3}>
            <DemoContent>
              <p>Small: Span 2 of 4</p>
              <p>Medium: Span 2 of 8</p>
              <p>Large: Span 3 of 16</p>
            </DemoContent>
          </Column>
          <Column sm={0} md={2} lg={3}>
            <DemoContent>
              <p>Small: Span 0 of 4</p>
              <p>Medium: Span 2 of 8</p>
              <p>Large: Span 3 of 16</p>
            </DemoContent>
          </Column>
        </Row>
      </FlexGrid>
    </div>
  );
};

export const Offset: StoryFn<FlexGridArgs> = (args) => {
  return (
    <div id="templates">
      <FlexGrid {...args}>
        <Row>
          <Column sm={{ span: 1, offset: 3 }}>
            <DemoContent>Small: offset 3</DemoContent>
          </Column>
          <Column sm={{ span: 2, offset: 2 }}>
            <DemoContent>Small: offset 2</DemoContent>
          </Column>
          <Column sm={{ span: 3, offset: 1 }}>
            <DemoContent>Small: offset 1</DemoContent>
          </Column>
          <Column sm={{ span: 4, offset: 0 }}>
            <DemoContent>Small: offset 0</DemoContent>
          </Column>
        </Row>
      </FlexGrid>
    </div>
  );
};

export const Condensed: StoryFn<FlexGridArgs> = (args) => {
  return (
    <div id="templates">
      <FlexGrid {...args}>
        <Row>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
        </Row>
      </FlexGrid>
    </div>
  );
};

Condensed.args = {
  condensed: true,
};

Condensed.argTypes = {
  condensed: {
    table: { readonly: true },
  },
};

Condensed.parameters = {
  controls: {
    include: [...gridContainerControls, 'condensed'],
  },
};

export const CondensedColumns: StoryFn<FlexGridArgs> = (args) => {
  return (
    <div id="templates">
      <FlexGrid {...args}>
        <Row>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
        </Row>
        <Row condensed>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
        </Row>
        <Row>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
        </Row>
      </FlexGrid>
    </div>
  );
};

CondensedColumns.parameters = {
  controls: {
    include: gridContainerControls,
  },
};

export const Narrow: StoryFn<FlexGridArgs> = (args) => {
  return (
    <div id="templates">
      <FlexGrid {...args}>
        <Row>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
        </Row>
      </FlexGrid>
    </div>
  );
};

Narrow.args = {
  narrow: true,
};

Narrow.argTypes = {
  narrow: {
    table: { readonly: true },
  },
};

Narrow.parameters = {
  controls: {
    include: [...gridContainerControls, 'narrow'],
  },
};

export const NarrowColumns: StoryFn<FlexGridArgs> = (args) => {
  return (
    <div id="templates">
      <FlexGrid {...args}>
        <Row>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
        </Row>
        <Row narrow>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
        </Row>
        <Row>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
        </Row>
      </FlexGrid>
    </div>
  );
};

NarrowColumns.parameters = {
  controls: {
    include: gridContainerControls,
  },
};

export const FullWidth: StoryFn<FlexGridArgs> = (args) => {
  return (
    <div id="templates">
      <FlexGrid {...args}>
        <Row>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
        </Row>
      </FlexGrid>
    </div>
  );
};

FullWidth.args = {
  fullWidth: true,
};

FullWidth.argTypes = {
  fullWidth: {
    table: { readonly: true },
  },
};

export const MixedGutterModes: StoryFn<FlexGridArgs> = (args) => {
  return (
    <div id="templates">
      <FlexGrid {...args}>
        <Row>
          <Column>
            <DemoContent>Wide</DemoContent>
          </Column>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
        </Row>
        <Row narrow>
          <Column>
            <DemoContent>Narrow</DemoContent>
          </Column>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
        </Row>
        <Row condensed>
          <Column>
            <DemoContent>Condensed</DemoContent>
          </Column>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
        </Row>
      </FlexGrid>
    </div>
  );
};

MixedGutterModes.parameters = {
  controls: {
    include: gridContainerControls,
  },
};

export const Default: StoryFn<FlexGridArgs> = (args) => {
  return (
    <div id="templates">
      <FlexGrid {...args}>
        <Row>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
          <Column>
            <DemoContent>1/4</DemoContent>
          </Column>
        </Row>
      </FlexGrid>
    </div>
  );
};

export const WithRowGap: StoryFn<FlexGridArgs> = (args) => {
  return (
    <div id="templates">
      <FlexGrid {...args}>
        <Row>
          <Column sm={4} md={4} lg={4}>
            <DemoContent>Row 1, Col 1</DemoContent>
          </Column>
          <Column sm={4} md={4} lg={4}>
            <DemoContent>Row 1, Col 2</DemoContent>
          </Column>
          <Column sm={4} md={4} lg={4}>
            <DemoContent>Row 1, Col 3</DemoContent>
          </Column>
          <Column sm={4} md={4} lg={4}>
            <DemoContent>Row 1, Col 4</DemoContent>
          </Column>
        </Row>
        <Row>
          <Column sm={4} md={4} lg={4}>
            <DemoContent>Row 2, Col 1</DemoContent>
          </Column>
          <Column sm={4} md={4} lg={4}>
            <DemoContent>Row 2, Col 2</DemoContent>
          </Column>
          <Column sm={4} md={4} lg={4}>
            <DemoContent>Row 2, Col 3</DemoContent>
          </Column>
          <Column sm={4} md={4} lg={4}>
            <DemoContent>Row 2, Col 4</DemoContent>
          </Column>
        </Row>
      </FlexGrid>
    </div>
  );
};

WithRowGap.args = {
  withRowGap: true,
};

WithRowGap.argTypes = {
  withRowGap: {
    table: { readonly: true },
  },
};
