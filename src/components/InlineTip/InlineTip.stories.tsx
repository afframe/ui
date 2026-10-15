/**
 * Copyright IBM Corp. 2023, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2023, 2023
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, InlineTip components from @afframe/ui, plain CSS file, class string written inline instead of classnames, image URL resolved with new URL, story args typed for the action and media selectors, typed casts for the button and link, props built instead of null, tags, story names unified, invoice example data, action link to #, Close hides the tip and a Show tip again button restores it, autodocs and Onboarding tags dropped. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useEffect, useRef, useState } from 'react';
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ComponentProps,
  ComponentType,
} from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { fn } from 'storybook/test';
import {
  Button,
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
  title: 'Preview/previewCandidate__InlineTip',
  component: InlineTip,
  tags: ['ibm-products'],
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
  children: 'Filter by due date to see which invoices need a reminder.',
  closeIconDescription: 'Close',
  collapseButtonLabel: 'Read less',
  collapsible: false,
  action: 'None',
  expandButtonLabel: 'Read more',
  renderMedia: 'None',
  onClick: fn(),
  onClose: fn(),
  title: 'Find overdue invoices',
  withLeftGutter: false,
};

const Template: StoryFn<InlineTipArgs> = (args) => {
  const { renderMedia, action: componentAction, onClose, ...rest } = args;
  const { narrow } = rest;
  // IBM leaves hiding to the app. Focus moves only after Close or Show tip
  // again, never on the first render, so the docs page keeps its focus.
  const [open, setOpen] = useState(true);
  const toggled = useRef(false);
  const tipRef = useRef<HTMLDivElement>(null);
  const showAgainRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!toggled.current) return;
    if (open) tipRef.current?.querySelector<HTMLElement>('button')?.focus();
    else showAgainRef.current?.focus();
  }, [open]);
  const toggle = (next: boolean) => {
    toggled.current = true;
    setOpen(next);
  };

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
              Show me
            </ActionButton>
          ),
        };
      case '<InlineTipLink>':
        return {
          action: (
            <ActionLink
              href="#"
              onClick={() => {
                action('Clicked the link')();
              }}>
              Show me
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
      {open ? (
        <InlineTip
          ref={tipRef}
          {...rest}
          {...selectedMedia}
          {...selectedAction}
          onClose={() => {
            onClose?.();
            toggle(false);
          }}
        />
      ) : (
        <Button kind="ghost" ref={showAgainRef} onClick={() => toggle(true)}>
          Show tip again
        </Button>
      )}
    </div>
  );
};

export const Default: StoryFn<InlineTipArgs> = Template.bind({});
Default.args = {
  narrow: false,
  ...defaultProps,
};

export const Narrow: StoryFn<InlineTipArgs> = Template.bind({});
Narrow.args = {
  narrow: true,
  ...defaultProps,
};
