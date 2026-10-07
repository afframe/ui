/**
 * Copyright IBM Corp. 2023, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2023, 2024
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, Guidebanner components from @afframe/ui, plain CSS file, theme argType dropped, typed casts for the element button and link, title Components/Guidebanner. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import {
  Fragment,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ComponentProps,
  type ComponentType,
  type ReactElement,
} from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import {
  Guidebanner,
  GuidebannerElement,
  GuidebannerElementButton,
  GuidebannerElementLink,
} from '../../index.js';
import mdx from './Guidebanner.mdx';
import './guidebanner-story.css';

// IBM types the element button and link props without the DOM attributes they
// forward at runtime (onClick, href, target).
const ElementButton = GuidebannerElementButton as ComponentType<
  ComponentProps<typeof GuidebannerElementButton> &
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'>
>;
const ElementLink = GuidebannerElementLink as ComponentType<
  ComponentProps<typeof GuidebannerElementLink> &
    AnchorHTMLAttributes<HTMLAnchorElement>
>;

const storyClass = 'guidebanner-stories';

export default {
  title: 'Components/Guidebanner',
  component: Guidebanner,
  tags: ['autodocs', 'Onboarding', 'ibm-products'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    children: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof Guidebanner>;

const defaultProps = {
  onClose: () => action('onClose()')(),
  title: 'Page-related heading that can stand on its own',
  withLeftGutter: false,
};

const DefaultButtonLarge = () => (
  <ElementButton
    type="primary"
    onClick={() => {
      action('GuidebannerElementButton.onClick() (type="primary")')();
    }}>
    Show Me
  </ElementButton>
);

const DefaultButtonSmall = () => (
  <ElementButton
    onClick={() => {
      action('GuidebannerElementButton.onClick()')();
    }}>
    Click me
  </ElementButton>
);

const DefaultLink = () => (
  <ElementLink
    href="https://www.ibm.com"
    target="_blank"
    onClick={() => {
      action('GuidebannerElementLink.onClick()')();
    }}>
    Learn more
  </ElementLink>
);

const Template: StoryFn<ComponentProps<typeof Guidebanner>> = ({
  children,
  ...rest
}) => {
  // Normally GuidebannerElement are listed directly as children of Guidebanner,
  // but as a story we have to wrap the JSX in a Fragment.
  // To feed them here, we point to the list of GuidebannerElements directly.
  const childArray = (children as ReactElement<{ children: ReactElement[] }>)
    .props.children;
  return (
    <div className={`${storyClass}__viewport`}>
      <Guidebanner {...rest}>{childArray}</Guidebanner>
    </div>
  );
};

export const collapsible: StoryFn<ComponentProps<typeof Guidebanner>> =
  Template.bind({});
collapsible.args = {
  ...defaultProps,
  collapsible: true,
  open: true,
  children: (
    <Fragment>
      <GuidebannerElement
        title="Use-case specific heading"
        description="Use-case specific content related to the heading that explains the concept or adds context. Use-case specific content related to the heading that explains the concept or adds context."
        button={<DefaultButtonLarge />}
      />
      <GuidebannerElement
        title="Use-case specific heading"
        description="Use-case specific content related to the heading that explains the concept or adds context. Use-case specific content related to the heading that explains the concept or adds context. Use-case specific content related to the heading that explains the concept or adds context."
        button={<DefaultButtonSmall />}
      />
      <GuidebannerElement
        title="Use-case specific heading"
        description="Use-case specific content related to the heading that explains the concept or adds context."
        button={<DefaultButtonSmall />}
      />
      <GuidebannerElement
        title="Use-case specific heading"
        description="Use-case specific content related to the heading that explains the concept or adds context. Use-case specific content related to the heading that explains the concept or adds context."
        button={<DefaultLink />}
      />
      <GuidebannerElement
        title="Use-case specific heading"
        description="Use-case specific content related to the heading that explains the concept or adds context."
        button={<DefaultLink />}
      />
    </Fragment>
  ),
};

export const manyInsights: StoryFn<ComponentProps<typeof Guidebanner>> =
  Template.bind({});
manyInsights.args = {
  ...defaultProps,
  collapsible: true,
  open: false,
  children: (
    <Fragment>
      <GuidebannerElement
        title="Use-case specific heading"
        description="Use-case specific content related to the heading that explains the concept or adds context. Use-case specific content related to the heading that explains the concept or adds context."
        button={<DefaultButtonLarge />}
      />
      <GuidebannerElement
        title="Use-case specific heading"
        description="Use-case specific content related to the heading that explains the concept or adds context. Use-case specific content related to the heading that explains the concept or adds context. Use-case specific content related to the heading that explains the concept or adds context."
        button={<DefaultButtonSmall />}
      />
      <GuidebannerElement
        title="Use-case specific heading"
        description="Use-case specific content related to the heading that explains the concept or adds context."
        button={<DefaultButtonSmall />}
      />
      <GuidebannerElement
        title="Use-case specific heading"
        description="Use-case specific content related to the heading that explains the concept or adds context. Use-case specific content related to the heading that explains the concept or adds context."
        button={<DefaultLink />}
      />
      <GuidebannerElement
        title="Use-case specific heading"
        description="Use-case specific content related to the heading that explains the concept or adds context."
        button={<DefaultLink />}
      />
    </Fragment>
  ),
};

export const fewInsights: StoryFn<ComponentProps<typeof Guidebanner>> =
  Template.bind({});
fewInsights.args = {
  ...defaultProps,
  collapsible: true,
  open: false,
  children: (
    <Fragment>
      <GuidebannerElement
        title="Use-case specific heading"
        description="Use-case specific content related to the heading that explains the concept or adds context. Use-case specific content related to the heading that explains the concept or adds context."
        button={<DefaultButtonLarge />}
      />
      <GuidebannerElement
        title="Use-case specific heading"
        description="Use-case specific content related to the heading that explains the concept or adds context."
        button={<DefaultLink />}
      />
    </Fragment>
  ),
};
