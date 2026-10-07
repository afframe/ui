/**
 * Copyright IBM Corp. 2024, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2024, 2024
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, previewCandidate__GetStartedCard and useCarbonPrefix from @afframe/ui, icons from the icons entry, image URL resolved with new URL, tags. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ComponentProps } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { ArrowRight, Crossroads, Time, SkillLevelBasic } from '../../icons.js';
import {
  previewCandidate__GetStartedCard as GetStartedCard,
  useCarbonPrefix,
} from '../../index.js';
import mdx from './GetStartedCard.mdx';

const abstractImage = new URL(
  './_story-assets/abstract-image.svg',
  import.meta.url
).href;

type GetStartedCardArgs = ComponentProps<typeof GetStartedCard>;
type IconProps = Record<string, unknown>;

const defaultProps = {
  label: 'Label',
  title: 'Title',
  metadata: [
    {
      id: '1',
      icon: (props?: IconProps) => <Time size={16} {...props} />,
      iconDescription: '2 mins',
    },
    {
      id: '2',
      icon: (props?: IconProps) => <SkillLevelBasic size={16} {...props} />,
      iconDescription: 'Beginner',
    },
  ],
  footerActionIcon: (props?: IconProps) => (
    <ArrowRight size={16} {...props}></ArrowRight>
  ),
  onClick: action('on click'),
};

export default {
  title: 'Preview Candidate/Onboarding/GetStartedCard',
  component: GetStartedCard,
  tags: ['autodocs', 'Onboarding', 'ibm-products'],
  parameters: {
    docs: {
      page: mdx,
    },
  },
  decorators: [
    (Story) => {
      const carbonPrefix = useCarbonPrefix();
      return <div className={`${carbonPrefix}--grid`}>{Story()}</div>;
    },
  ],
} satisfies Meta<typeof GetStartedCard>;

const Template: StoryFn<GetStartedCardArgs> = (opts) => {
  const { children, ...args } = opts;
  return (
    <GetStartedCard
      label="Prepare your data"
      title="Generate synthetic Tabular data"
      {...args}>
      {children}
    </GetStartedCard>
  );
};

export const Default: StoryFn<GetStartedCardArgs> = Template.bind({});
Default.args = {
  ...defaultProps,
  pictogram: (props?: IconProps) => <Crossroads size={32} {...props} />,
};

export const withSequence: StoryFn<GetStartedCardArgs> = Template.bind({});
withSequence.args = {
  ...defaultProps,
  sequence: 3,
};

export const withMediaAndPictogram: StoryFn<GetStartedCardArgs> = Template.bind(
  {}
);
withMediaAndPictogram.args = {
  ...defaultProps,
  pictogram: (props?: IconProps) => <Crossroads size={32} {...props} />,
  media: <img src={abstractImage} alt="abstract Image" />,
};

export const withMediaAndSequence: StoryFn<GetStartedCardArgs> = Template.bind(
  {}
);
withMediaAndSequence.args = {
  ...defaultProps,
  sequence: 3,
  media: <img src={abstractImage} alt="abstract Image" />,
};

export const withDisabled: StoryFn<GetStartedCardArgs> = Template.bind({});
withDisabled.args = {
  ...defaultProps,
  sequence: 3,
  disabled: true,
};
