/**
 * Copyright IBM Corp. 2024, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2024, 2024
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, previewCandidate__Decorator from @afframe/ui cast to a props type (IBM types it ref-only), source tag, scss styles dropped, the empty controls on className and setLabelTitle replaced by disabled controls. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ComponentType } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { previewCandidate__Decorator } from '../../index.js';
import mdx from './Decorator.mdx';

type DecoratorProps = {
  hideIcon?: boolean;
  label?: string;
  score?: number | null;
  scoreThresholds?: number[];
  setLabelTitle?: (
    score: number | null | undefined,
    scoreThresholds: number[],
    magnitude: string
  ) => string;
  small?: boolean;
  theme?: 'light' | 'dark' | null;
  truncateValue?:
    'end' | 'start' | { maxLength: number; front: number; back: number };
  value: string;
  valueTitle?: string;
};

const Decorator = previewCandidate__Decorator as ComponentType<DecoratorProps>;

const scoreOptions = {
  '-1 (less than 0 is 0)': -1,
  '0 ': 0,
  '1 ': 1,
  '2 ': 2,
  '3 ': 3,
  '4 ': 4,
  '5 ': 5,
  '6 ': 6,
  '7 ': 7,
  '8 ': 8,
  '9 ': 9,
  '10 ': 10,
  '11 (greater than 10 is 10)': 11,
  'NaN; treated as "Unknown"': null,
};

export default {
  title: 'Preview Candidate/Decorator',
  component: Decorator,
  tags: ['ibm-products'],
  parameters: {
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    // For internal use only.
    kind: { table: { disable: true } },
    className: { control: { disable: true } },
    setLabelTitle: { control: { disable: true } },
    score: {
      control: {
        type: 'select',
        labels: Object.keys(scoreOptions),
      },
      mapping: Object.values(scoreOptions),
      options: Object.values(scoreOptions).map((_k, i) => i),
    },
    theme: {
      control: {
        type: 'select',
        labels: ['use default', 'light', 'dark'],
      },
      mapping: {
        0: null,
        1: 'light',
        2: 'dark',
      },
      options: [0, 1, 2],
    },
    truncateValue: {
      control: {
        type: 'select',
        labels: {
          0: 'No truncation',
          1: '"end"',
          2: '"start"',
          3: '{ maxLength:20, front:9, back:10 }',
        },
      },
      mapping: {
        0: undefined,
        1: 'end',
        2: 'start',
        3: { maxLength: 20, front: 9, back: 10 },
      },
      options: [0, 1, 2, 3],
    },
  },
  args: {
    theme: 0,
    truncateValue: 0,
  },
} satisfies Meta;

const Template: StoryFn<DecoratorProps> = (args) => {
  if (args.truncateValue) {
    return (
      <>
        <div style={{ padding: '0 0 1rem' }}>With limited width.</div>
        <div
          style={{
            maxWidth: '16rem',
            padding: '3px',
            outline: '2px dashed #999',
          }}>
          <Decorator {...args} value="Very long value to show truncation" />
        </div>
      </>
    );
  }

  return <Decorator {...args} />;
};

export const Default = Template.bind({});
Default.storyName = 'Decorator';
Default.args = {
  hideIcon: false,
  label: 'IP',
  score: 5,
  scoreThresholds: [0, 4, 7, 10],
  setLabelTitle: (score, scoreThresholds, magnitude) => {
    if (typeof score !== 'number') {
      return 'Unknown score';
    }
    return `"${magnitude}" magnitude. Score ${score} out of ${
      scoreThresholds[scoreThresholds.length - 1]
    }`;
  },
  small: false,
  value: '192.168.0.50',
  valueTitle: '',
};
