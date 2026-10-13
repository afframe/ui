/**
 * Copyright IBM Corp. 2020
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2020
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, pkg.prefix as the 'c4p' literal, source tag, scss styles replaced by about-modal-story.css, opacity style hack removed, logos replaced by Carbon pictograms, IBM title, copyright and legal text replaced by neutral placeholders, getTitle branch fixed, link and content helpers shortened, propTypes assignment dropped, keyboard play test added, story names unified, play test asserts the provider's Tab wrap. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useState, type ComponentType } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { AboutModal, Button, Link, type AboutModalProps } from '../../index.js';
import { Application, Apps, Cloud, Software } from '../../pictograms.js';
import mdx from './AboutModal.mdx';
import './about-modal-story.css';

const blockClass = 'c4p--about-modal';

type StoryArgs = Omit<
  AboutModalProps,
  'additionalInfo' | 'content' | 'links' | 'title'
> & {
  additionalInfo: number;
  content: number;
  links: number;
  title: number;
};

export default {
  title: 'Components/Task Dialogs/AboutModal',
  component: AboutModal as unknown as ComponentType<StoryArgs>,
  tags: ['ibm-products'],
  parameters: {
    docs: {
      page: mdx,
    },
    layout: 'padded',
  },
  argTypes: {
    additionalInfo: {
      control: {
        type: 'select',
        labels: {
          0: 'no additional info',
          1: 'powered by logos',
        },
      },
      options: [0, 1],
    },
    links: {
      control: {
        type: 'select',
        labels: { 0: 'none', 1: 'one link', 2: 'two links', 3: 'three links' },
      },
      options: [0, 1, 2, 3],
    },
    content: {
      control: {
        type: 'select',
        labels: {
          0: 'no content',
          1: 'short content',
          2: 'medium content',
          3: 'long content',
        },
      },
      options: [0, 1, 2, 3],
    },
    logo: {
      control: false,
    },
    open: {
      control: false,
    },
    title: {
      control: {
        type: 'select',
        labels: {
          0: 'short title',
          1: 'long title',
          2: 'short title with formatting',
        },
      },
      options: [0, 1, 2],
    },
  },
} satisfies Meta<StoryArgs>;

const getTitle = (value: number) => {
  if (value === 0) {
    return <>Product name</>;
  } else if (value === 1) {
    return <>Product name example that is longer than one line</>;
  }
  return (
    <>
      Example <span style={{ fontWeight: 600 }}>Product name</span>
    </>
  );
};

const getLinks = (value: number) =>
  Array.from({ length: value }, (_, index) => (
    <Link href="#" key={`link${index + 1}`}>
      Link action
    </Link>
  ));

const shortContent =
  'This product contains proprietary notices and copyright information, the terms of which must be observed and followed.';

const mediumContent = `${shortContent} The licence agreement that came with the product sets out how it may be used. Third-party components it includes are listed in the product documentation, each with its own licence terms.`;

const getContent = (value: number) =>
  [
    null,
    shortContent,
    mediumContent,
    `${mediumContent} ${mediumContent} ${mediumContent} ${mediumContent}`,
  ][value];

const getAdditionalInfo = (value: number) =>
  value === 0 ? null : (
    <>
      <p className={`${blockClass}__footer-label`}>Powered by</p>
      <Apps
        aria-label="First technology logo"
        className={`${blockClass}__stories--tech-logo`}
      />
      <Cloud
        aria-label="Second technology logo"
        className={`${blockClass}__stories--tech-logo`}
      />
      <Software
        aria-label="Third technology logo"
        className={`${blockClass}__stories--tech-logo`}
      />
    </>
  );

const Template: StoryFn<StoryArgs> = (args, context) => {
  const { title, content, additionalInfo, links } = args;
  const [open, setOpen] = useState(context.viewMode !== 'docs');

  return (
    <main>
      <Button onClick={() => setOpen(true)}>{'Open Modal'}</Button>
      <AboutModal
        {...args}
        title={getTitle(title)}
        links={getLinks(links)}
        additionalInfo={getAdditionalInfo(additionalInfo)}
        content={getContent(content)}
        onClose={() => setOpen(false)}
        logo={
          <Application
            aria-label="Example product logo"
            className={`${blockClass}__stories--logo`}
          />
        }
        modalAriaLabel="About this product"
        open={open}
      />
    </main>
  );
};

const commonArgs = {
  copyrightText: 'Copyright © Example Company 2020, 2026',
  closeIconDescription: 'Close',
  version: 'Version 0.0.0',
};

export const Default = Template.bind({});
Default.args = {
  additionalInfo: 0,
  content: 0,
  links: 0,
  title: 1,
  ...commonArgs,
};

export const WithAdditionalContent = Template.bind({});
WithAdditionalContent.args = {
  additionalInfo: 1,
  content: 2,
  links: 3,
  title: 2,
  ...commonArgs,
};
// AfframeProvider wraps Tab in modal dialogs: Tab from the last link returns
// to the close button.
WithAdditionalContent.play = async ({ canvasElement }) => {
  const doc = canvasElement.ownerDocument;
  const dialog = await within(doc.body).findByRole('dialog', {
    name: 'About this product',
  });
  const close = within(dialog).getByRole('button', { name: 'Close' });
  await waitFor(() => expect(close).toHaveFocus());
  for (const link of within(dialog).getAllByRole('link')) {
    await userEvent.tab();
    await expect(link).toHaveFocus();
  }
  await userEvent.tab();
  await expect(close).toHaveFocus();
};
