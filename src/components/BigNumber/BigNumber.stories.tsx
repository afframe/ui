/**
 * Copyright IBM Corp. 2024, 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2024, 2025
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, BigNumber, Button and Edit from @afframe/ui, size options as literals, title Components/BigNumber, source tag, scss styles dropped. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { Edit } from '../../icons.js';
import { BigNumber, Button } from '../../index.js';
import mdx from './BigNumber.mdx';

const numericOptions = {
  '-123 ': -123,
  '0 ': 0,
  '12 ': 12,
  '345 ': 345,
  '6789 ': 6789,
  '12345.678 ': 12345.678,
  '678901.2456 ': 678901.2456,
  '1000000 ': 1000000,
  '2345678 ': 2345678,
  '90123456 ': 90123456,
  '789012345 ': 789012345,
  '6789012345 ': 6789012345,
  'null ': null,
  'undefined ': undefined,
};

const iconButtonOptions = {
  'undefined ': null,
  'Example <Button> ': (
    <Button
      renderIcon={Edit}
      iconDescription="Icon Description"
      kind="ghost"
      size={'sm'}
      hasIconOnly
      onClick={action('Button.onClick()')}
      tooltipPosition="bottom"
    />
  ),
};

export default {
  title: 'Components/BigNumber',
  component: BigNumber,
  tags: ['ibm-products'],
  argTypes: {
    forceShowTotal: {
      options: [true, false],
      control: { type: 'boolean' },
    },
    iconButton: {
      control: { type: 'select', labels: Object.keys(iconButtonOptions) },
      options: Object.values(iconButtonOptions).map((_k, i) => i),
      mapping: Object.values(iconButtonOptions),
    },
    loading: {
      options: [true, false],
      control: { type: 'boolean' },
    },
    locale: {
      options: [
        'bg',
        'cs',
        'da-DK',
        'de-CH',
        'de',
        'en-AU',
        'en-GB',
        'en-US',
        'en-ZA',
        'es-ES',
        'es',
        'et',
        'fi',
        'fr-CA',
        'fr-CH',
        'fr',
        'hu',
        'it',
        'ja',
        'lv',
        'nl-BE',
        'nl-NL',
        'no',
        'pl',
        'pt-BR',
        'pt-PT',
        'ru-UA',
        'ru',
        'sk',
        'sl',
        'th',
        'tr',
        'uk-UA',
        'vi',
      ],
      control: { type: 'select' },
    },
    percentage: {
      options: [true, false],
      control: { type: 'boolean' },
    },
    size: {
      options: ['default', 'lg', 'xl'],
      control: { type: 'radio' },
    },
    total: {
      control: { type: 'select', labels: Object.keys(numericOptions) },
      options: Object.values(numericOptions).map((_k, i) => i),
      mapping: Object.values(numericOptions),
    },
    trending: {
      options: [true, false],
      control: { type: 'boolean' },
    },
    truncate: {
      options: [true, false],
      control: { type: 'boolean' },
    },
    value: {
      control: { type: 'select', labels: Object.keys(numericOptions) },
      options: Object.values(numericOptions).map((_k, i) => i),
      mapping: Object.values(numericOptions),
    },
  },
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof BigNumber>;

const defaultProps = {
  forceShowTotal: false,
  fractionDigits: 1,
  iconButton: 0,
  label: 'Label',
  loading: false,
  locale: 'en-US',
  percentage: false,
  size: 'default' as const,
  tooltipDescription: '',
  total: 13,
  trending: false,
  truncate: true,
  value: 5,
};

const Template: StoryFn<typeof BigNumber> = (args) => {
  return <BigNumber {...args} />;
};

export const bigNumber = Template.bind({});
bigNumber.args = {
  ...defaultProps,
};
