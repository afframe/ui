/**
 * Copyright IBM Corp. 2024, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2024, 2024
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, ScrollGradient from @afframe/ui cast to a props type (IBM types it ref-only), title Components/ScrollGradient, source tag, scss styles replaced by scroll-gradient-story.css, story names unified, invoice example data, scroll element named and focusable through getScrollElementRef. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ComponentType, CSSProperties, ReactNode } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { ScrollGradient as IbmScrollGradient } from '../../index.js';
import mdx from './ScrollGradient.mdx';
import './scroll-gradient-story.css';

const ScrollGradient = IbmScrollGradient as ComponentType<{
  children?: ReactNode;
  className?: string;
  color?: string;
  getScrollElementRef?: (element: HTMLElement | null) => void;
  style?: CSSProperties;
}>;

const customers = [
  'Lakeside Furniture',
  'Northwind Traders',
  'Bluebell Bakery',
  'Harbor Logistics',
  'Summit Office Supplies',
];

const storyChildren = (
  <div style={{ padding: 16 }}>
    {Array.from({ length: 20 }, (_, index) => (
      <p key={index}>
        Invoice 2026-{String(index + 1).padStart(3, '0')},{' '}
        {customers[index % customers.length]}
      </p>
    ))}
  </div>
);

// The scroll element is IBM's inner div, so only this callback can make it
// keyboard reachable and give it a name.
const nameScrollElement = (element: HTMLElement | null) => {
  if (!element) return;
  element.tabIndex = 0;
  element.setAttribute('role', 'region');
  element.setAttribute('aria-label', 'Invoices');
};

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
      <ScrollGradient
        style={style}
        className={'myScrollGradient'}
        getScrollElementRef={nameScrollElement}
        {...args}
      />
    </div>
  );
};

const TemplateBothAxis: StoryFn<typeof ScrollGradient> = (args) => {
  return (
    <div className="templateContainer-sm">
      <ScrollGradient
        style={style}
        className={'myScrollGradient'}
        getScrollElementRef={nameScrollElement}
        {...args}
      />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  children: storyChildren,
};

export const XAndYAxis = TemplateBothAxis.bind({});
XAndYAxis.args = {
  children: <div style={{ width: '1500px' }}>{storyChildren}</div>,
};
