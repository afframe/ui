/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2023
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, source tag, story styles as plain CSS, inline spacing as Carbon spacing tokens, story names unified. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import './Layer-story.css';
import type { ArgTypes, Meta, StoryFn } from '@storybook/react-vite';
import { Layer, useLayer } from '../../index.js';
import mdx from './Layer.mdx';

interface LayerStoryArgs {
  label: string;
  level?: 0 | 1 | 2;
}

export default {
  title: 'Layout/Layer',
  component: Layer,
  tags: ['carbon'],
  parameters: {
    controls: {
      hideNoControlsWarning: true,
    },
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof Layer>;

const contentArgTypes = {
  label: {
    control: { type: 'text' },
  },
} satisfies ArgTypes;

const contentParameters = {
  controls: {
    include: ['label'],
  },
};

export const Default: StoryFn<LayerStoryArgs> = ({ label }) => {
  function TestComponent() {
    return <div className="example-layer-test-component">{label}</div>;
  }

  return (
    <>
      <TestComponent />
      <Layer>
        <TestComponent />
        <Layer>
          <TestComponent />
        </Layer>
      </Layer>
    </>
  );
};

Default.args = {
  label: 'Workspace settings',
};
Default.argTypes = contentArgTypes;
Default.parameters = contentParameters;

export const WithBackground: StoryFn<LayerStoryArgs> = ({ label }) => {
  function TestComponent() {
    return (
      <div className="example-layer-test-component-no-background">{label}</div>
    );
  }

  return (
    <>
      <TestComponent />
      <Layer withBackground>
        <TestComponent />
        <Layer withBackground>
          <TestComponent />
        </Layer>
      </Layer>
    </>
  );
};

WithBackground.args = {
  label: 'Workspace settings',
};
WithBackground.argTypes = contentArgTypes;
WithBackground.parameters = contentParameters;

export const CustomLevel: StoryFn<LayerStoryArgs> = ({ label, level }) => {
  function TestComponent() {
    return <div className="example-layer-test-component">{label}</div>;
  }

  return (
    <Layer level={level}>
      <TestComponent />
    </Layer>
  );
};

CustomLevel.args = {
  label: 'Workspace settings',
  level: 2,
};
CustomLevel.argTypes = {
  ...contentArgTypes,
  level: {
    control: { type: 'select' },
    options: [0, 1, 2],
  },
};
CustomLevel.parameters = {
  controls: {
    include: ['label', 'level'],
  },
};

export const UseLayer: StoryFn<LayerStoryArgs> = ({ label }) => {
  function ExampleComponent() {
    const { level } = useLayer();
    return (
      <div
        style={{
          padding: 'var(--cds-spacing-05)',
          background: 'var(--cds-layer)',
        }}>
        {label}: {level}
      </div>
    );
  }

  return (
    <>
      <ExampleComponent />
      <Layer>
        <ExampleComponent />
      </Layer>
    </>
  );
};

UseLayer.args = {
  label: 'Current layer level',
};
UseLayer.argTypes = contentArgTypes;
UseLayer.parameters = contentParameters;
