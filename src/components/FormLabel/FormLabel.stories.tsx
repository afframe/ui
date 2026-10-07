/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2023
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, unused Tooltip import removed, story styles as plain CSS, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ComponentProps } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import {
  ActionableNotification,
  FormLabel,
  Toggletip,
  ToggletipButton,
  ToggletipContent,
} from '../../index.js';
import { Information } from '../../icons.js';
import './form-label-stories.css';
import mdx from './FormLabel.mdx';

type FormLabelStoryArgs = ComponentProps<typeof FormLabel> & {
  label: string;
};

export default {
  title: 'Components/FormLabel',
  component: FormLabel,
  tags: ['carbon'],
  args: {
    label: 'Form label',
  },
  argTypes: {
    label: {
      control: { type: 'text' },
      table: {
        category: 'story controls',
      },
    },
    id: {
      control: { type: 'text' },
    },
  },
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<FormLabelStoryArgs>;

export const Default: StoryFn<FormLabelStoryArgs> = ({ label, ...args }) => {
  return <FormLabel {...args}>{label}</FormLabel>;
};

export const WithToggletip: StoryFn<
  FormLabelStoryArgs & {
    align: NonNullable<ComponentProps<typeof Toggletip>['align']>;
  }
> = ({ align, label, ...formLabelArgs }) => {
  return (
    <>
      <div className="form-wrapper">
        <FormLabel {...formLabelArgs}>{label}</FormLabel>
        <Toggletip align={align}>
          <ToggletipButton label="Show information">
            <Information />
          </ToggletipButton>
          <ToggletipContent>
            This can be used to provide more information about a field.
          </ToggletipContent>
        </Toggletip>
      </div>
      <ActionableNotification
        kind="info"
        hideCloseButton
        lowContrast
        inline
        className="notification"
        aria-label="Accessibility note on form labels"
        actionButtonLabel="Accessibility button note on form labels"
        title="Accessibility note">
        <p>
          <strong>Note:</strong>
          &nbsp; It is not recommended to include interactive items, such as
          links or tooltips, inside a form label for accessibility reasons. For
          this reason, we place the tooltip and toggletip as sibling components
          rather than children. You can read more about this &nbsp;
          <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label#accessibility_concerns">
            here
          </a>
          &nbsp; and &nbsp;
          <a href="https://css-tricks.com/html-inputs-and-labels-a-love-story/#aa-dont-put-interactive-elements-inside-labels">
            here
          </a>
          .
        </p>
      </ActionableNotification>
    </>
  );
};

WithToggletip.args = {
  label: 'Form label with Toggletip',
  align: 'bottom',
};

WithToggletip.argTypes = {
  align: {
    control: { type: 'select' },
    options: [
      'top',
      'top-start',
      'top-end',
      'bottom',
      'bottom-start',
      'bottom-end',
      'left',
      'left-start',
      'left-end',
      'right',
      'right-start',
      'right-end',
    ],
  },
};
