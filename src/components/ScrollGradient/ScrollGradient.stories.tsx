/**
 * Copyright IBM Corp. 2024, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2024, 2024
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, ScrollGradient from @afframe/ui cast to a props type (IBM types it ref-only), title Components/ScrollGradient, source tag, scss styles replaced by scroll-gradient-story.css, scrollable-region-focusable a11y rule disabled on both stories. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ComponentType, CSSProperties, ReactNode } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { ScrollGradient as IbmScrollGradient } from '../../index.js';
import mdx from './ScrollGradient.mdx';
import './scroll-gradient-story.css';

const ScrollGradient = IbmScrollGradient as ComponentType<{
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}>;

const storyCopy =
  'Use case specific content to display in the ScrollGradient component. Use case specific content to display in the ScrollGradient component. Use case specific content to display in the ScrollGradient component. ';

const storyChildren = (
  <div style={{ padding: 16 }}>
    <p>{storyCopy}</p>
    <p>{storyCopy}</p>
    <p>{storyCopy}</p>
    <p>{storyCopy}</p>
    <p>{storyCopy}</p>
    <p>{storyCopy}</p>
  </div>
);

export default {
  title: 'Components/ScrollGradient',
  component: ScrollGradient,
  tags: ['ibm-products'],
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof ScrollGradient>;

const style = {
  width: '100%',
  height: '100%',
};

const Template: StoryFn<typeof ScrollGradient> = (args) => {
  return (
    <div className="templateContainer">
      <ScrollGradient style={style} className={'myScrollGradient'} {...args} />
    </div>
  );
};

const TemplateBothAxis: StoryFn<typeof ScrollGradient> = (args) => {
  return (
    <div className="templateContainer-sm">
      <ScrollGradient style={style} className={'myScrollGradient'} {...args} />
    </div>
  );
};

export const scrollGradientVertical = Template.bind({});
scrollGradientVertical.args = {
  children: storyChildren,
};

export const scrollGradientXAndYAxis = TemplateBothAxis.bind({});
scrollGradientXAndYAxis.args = {
  children: <div style={{ width: '1500px' }}>{storyChildren}</div>,
};

const scrollableRegionFocusable = {
  a11y: {
    config: { rules: [{ id: 'scrollable-region-focusable', enabled: false }] },
  },
};
scrollGradientVertical.parameters = scrollableRegionFocusable;
scrollGradientXAndYAxis.parameters = scrollableRegionFocusable;
