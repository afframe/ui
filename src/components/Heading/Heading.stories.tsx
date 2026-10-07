/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2023
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import type { ComponentProps } from 'react';
import { Heading, Section } from '../../index.js';
import mdx from './Heading.mdx';

type HeadingStoryArgs = Pick<ComponentProps<typeof Section>, 'as' | 'level'>;

export default {
  title: 'Components/Heading',
  component: Heading,
  subcomponents: {
    Section,
  },
  tags: ['carbon'],
  args: {
    as: 'section',
    level: 2,
  },
  argTypes: {
    as: {
      control: { type: 'text' },
      description:
        'Provide an alternative tag or component to use instead of the default <section> element',
      table: {
        category: 'Section',
      },
    },
    level: {
      control: {
        type: 'select',
      },
      description: 'Overrides the level of the section',
      options: [1, 2, 3, 4, 5, 6],
      table: {
        category: 'Section',
      },
    },
  },
  parameters: {
    docs: {
      page: mdx,
    },
    controls: {
      exclude: ['children', 'className'],
    },
  },
} satisfies Meta<ComponentProps<typeof Heading> & HeadingStoryArgs>;

export const Default: StoryFn<HeadingStoryArgs> = (args) => {
  return (
    <>
      <Heading>Project overview</Heading>
      <Section as={args.as} level={args.level}>
        <Heading>Delivery milestones</Heading>
        <Section>
          <Heading>Release readiness</Heading>
        </Section>
      </Section>
    </>
  );
};

export const CustomLevel: StoryFn<HeadingStoryArgs> = (args) => {
  return (
    <>
      <Heading>Project overview</Heading>
      <Section as={args.as} level={args.level}>
        <Heading>Release readiness</Heading>
        <Section>
          <Heading>Final approvals</Heading>
        </Section>
      </Section>
    </>
  );
};

CustomLevel.args = {
  level: 5,
};

// The story skips heading levels on purpose to show a custom Section level.
CustomLevel.parameters = {
  a11y: { config: { rules: [{ id: 'heading-order', enabled: false }] } },
};
