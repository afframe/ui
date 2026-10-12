/**
 * Copyright IBM Corp. 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2023
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui (preview_Layout), title uses the export name preview_Layout, LayoutConstraint subcomponent dropped (@carbon/react does not export it), ids on the TextInputs (required by the types), source tag, "size" typo in a Tag label fixed. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useId } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import {
  Accordion,
  AccordionItem,
  Button,
  HStack,
  preview_Layout as Layout,
  Tag,
  TextInput,
  VStack,
} from '../../index.js';
import type { LayoutProps } from '../../index.js';
import mdx from './Layout.mdx';

export default {
  title: 'Preview/preview_Layout',
  component: Layout,
  tags: ['carbon'],
  args: {
    density: 'normal',
    size: 'md',
  },
  argTypes: {
    density: {
      control: 'radio',
      description:
        'Specify the density of components within the layout context.',
      options: ['condensed', 'normal'],
    },
    size: {
      control: 'select',
      description: 'Specify the size of components within the layout context.',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
  },
  parameters: {
    controls: {
      include: ['density', 'size'],
    },
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof Layout>;

// Demo renders twice per story, so the required input ids come from useId.
const Demo = () => {
  const id = useId();
  return (
    <VStack gap={6}>
      <HStack>
        <TextInput
          id={`${id}-md`}
          labelText="<TextInput />"
          placeholder="Placeholder"
        />
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <Button>&lt;Button /&gt;</Button>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <Tag>&lt;Tag /&gt;</Tag>
        </div>
        <TextInput
          id={`${id}-sm`}
          labelText='<TextInput size="sm" />'
          size="sm"
          placeholder="Placeholder"
        />
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <Button size="sm">&lt;Button size=&quot;sm&quot; /&gt;</Button>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end' }}>
          <Tag size="sm">&lt;Tag size=&quot;sm&quot; /&gt;</Tag>
        </div>
      </HStack>
      <Accordion>
        <AccordionItem title="<AccordionItem />">Content</AccordionItem>
      </Accordion>
    </VStack>
  );
};

export const Default: StoryFn<LayoutProps> = (args) => {
  return (
    <VStack gap={10}>
      <h1>Layout demo</h1>
      <div>
        <h2>Outside of &lt;Layout&gt;</h2>
        <br />
        <Demo />
      </div>
      <div>
        <h2>Inside of &lt;Layout&gt;</h2>
        <br />
        <Layout {...args}>
          <Demo />
        </Layout>
      </div>
    </VStack>
  );
};
