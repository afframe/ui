/**
 * Copyright IBM Corp. 2021, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2021, 2024
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, Cascade and Column from @afframe/ui, plain CSS file, the MDX page replaces the docs page component, keys added to the grid columns, tags. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ComponentProps, ReactNode } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { Cascade, Column } from '../../index.js';
import mdx from './Cascade.mdx';
import './cascade-story.css';

export default {
  title: 'Utilities/Cascade',
  component: Cascade,
  tags: ['autodocs', 'ibm-products'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof Cascade>;

const DefaultTemplate: StoryFn<ComponentProps<typeof Cascade>> = (args) => {
  return (
    <Cascade {...args}>
      <div className="box" />
      <div className="box" />
      <div className="box" />
      <div className="box" />
      <div className="box" />
      <div className="box" />
      <div className="box" />
      <div className="box" />
    </Cascade>
  );
};

const GridTemplate: StoryFn<ComponentProps<typeof Cascade>> = (args) => {
  const getBoxes = (row: number) => {
    const boxes: ReactNode[] = [];
    for (let i = 0; i < 4; i++) {
      boxes.push(
        <Column key={`${row}-${i}`} lg={4}>
          <div className="grid-box" />
        </Column>
      );
    }
    return boxes;
  };

  return (
    <Cascade {...args}>
      {getBoxes(0)}
      {getBoxes(1)}
    </Cascade>
  );
};

export const WithoutGrid: StoryFn<ComponentProps<typeof Cascade>> =
  DefaultTemplate.bind({});
WithoutGrid.args = {};

export const WithGrid: StoryFn<ComponentProps<typeof Cascade>> =
  GridTemplate.bind({});
WithGrid.args = {
  grid: true,
};
