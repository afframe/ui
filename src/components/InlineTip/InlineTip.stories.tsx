/**
 * Copyright IBM Corp. 2023, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2023, 2023
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, InlineTip components from @afframe/ui, plain CSS file, class string written inline instead of classnames, image URL resolved with new URL, story args typed for the action and media selectors, typed casts for the button and link, props built instead of null, tags. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ComponentProps,
  ComponentType,
} from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import {
  previewCandidate__InlineTip as InlineTip,
  previewCandidate__InlineTipButton as InlineTipButton,
  previewCandidate__InlineTipLink as InlineTipLink,
} from '../../index.js';
import mdx from './InlineTip.mdx';
import './inline-tip-story.css';

const InlineTipImage = new URL(
  './storybook_assets/inline-tip-image.png',
  import.meta.url
).href;

// The story controls pick the action and the media by name; the template turns
// them into the real props.
type InlineTipArgs = Omit<
  ComponentProps<typeof InlineTip>,
  'action' | 'renderMedia'
> & {
  action: 'None' | '<InlineTipButton>' | '<InlineTipLink>';
  renderMedia: 'None' | 'Render a static image';
};

// IBM types the button and link props without the DOM attributes they forward
// at runtime (onClick, href, target).
const ActionButton = InlineTipButton as ComponentType<
  ComponentProps<typeof InlineTipButton> &
    ButtonHTMLAttributes<HTMLButtonElement>
>;
const ActionLink = InlineTipLink as ComponentType<
  ComponentProps<typeof InlineTipLink> & AnchorHTMLAttributes<HTMLAnchorElement>
>;

export default {
  title: 'Preview Candidate/Onboarding/InlineTip',
  component: InlineTip,
  tags: ['autodocs', 'Onboarding', 'ibm-products'],
  parameters: {
    layout: 'padded',
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    action: {
      options: ['None', '<InlineTipButton>', '<InlineTipLink>'],
      control: { type: 'radio' },
    },
    renderMedia: {
      options: ['None', 'Render a static image'],
      control: { type: 'radio' },
    },
    narrow: {
      control: false,
    },
  },
} satisfies Meta<typeof InlineTip>;

const defaultProps: Partial<InlineTipArgs> = {
  children: (
    // 'Use case-specific content that explains the concept or adds context. Use case-specific content that explains the concept or adds context. Use case-specific content that explains the concept or adds context.',
    <ul>
      <li>
        Use <b>case-specific</b> content that explains the concept or adds
        context.
      </li>
      <li>
        Use case-specific <i>content that</i> explains the concept or adds
        context.
      </li>
      <li>
        Use case-specific content that explains the concept or adds context.
      </li>
    </ul>
  ),
  closeIconDescription: 'Close',
  collapseButtonLabel: 'Read less',
  collapsible: false,
  action: 'None',
  expandButtonLabel: 'Read more',
  renderMedia: 'None',
  onClick: () => {
    action(`Clicked the tertiary button`)();
  },
  onClose: () => {
    action(`Clicked the close button`)();
  },
  title: 'Use case-specific heading',
  withLeftGutter: false,
};

const Template: StoryFn<InlineTipArgs> = (args) => {
  const { renderMedia, action: componentAction, ...rest } = args;
  const { narrow } = rest;

  const selectedMedia = (function () {
    switch (renderMedia) {
      case 'Render a static image':
        return { renderMedia: () => <img alt="" src={InlineTipImage} /> };

      default:
        return {};
    }
  })();
  const selectedAction = (function () {
    switch (componentAction) {
      case '<InlineTipButton>':
        return {
          action: (
            <ActionButton
              onClick={() => {
                action(`Clicked the action button`)();
              }}>
              Click me
            </ActionButton>
          ),
        };
      case '<InlineTipLink>':
        return {
          action: (
            <ActionLink
              href="https://www.ibm.com"
              onClick={() => {
                action('Clicked the link')();
              }}
              target="_blank">
              Learn more
            </ActionLink>
          ),
        };
      default:
        return {};
    }
  })();

  return (
    <div
      className={
        narrow ? 'storybook--inline-tip-narrow' : 'storybook--inline-tip-wide'
      }>
      <InlineTip {...rest} {...selectedMedia} {...selectedAction} />
    </div>
  );
};

export const inlineTip: StoryFn<InlineTipArgs> = Template.bind({});
inlineTip.args = {
  narrow: false,
  ...defaultProps,
};

export const inlineTipNarrow: StoryFn<InlineTipArgs> = Template.bind({});
inlineTipNarrow.args = {
  narrow: true,
  ...defaultProps,
};
