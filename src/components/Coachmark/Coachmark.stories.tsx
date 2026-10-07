/**
 * Copyright IBM Corp. 2024, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2024, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, Coachmark from @afframe/ui, next/ stories only, plain CSS file, literal c4p prefix, control false for control null, Button label prop dropped, title Components/Coachmark. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { Crossroads } from '../../icons.js';
import {
  Button,
  Coachmark,
  CoachmarkBeacon,
  CoachmarkTagline,
  Theme,
} from '../../index.js';
import mdx from './Coachmark.mdx';
import './coachmark-story.css';

export default {
  title: 'Components/Coachmark',
  component: Coachmark,
  subcomponents: {
    CoachmarkContent: Coachmark.Content,
    CoachmarkContentHeader: Coachmark.ContentHeader,
    CoachmarkContentBody: Coachmark.ContentBody,
    CoachmarkBeacon,
    CoachmarkTagline,
  },
  tags: ['autodocs', 'Onboarding', 'ibm-products'],
  argTypes: {
    children: {
      control: false,
    },
    onClose: {
      control: false,
    },
    align: {
      options: [
        'top',
        'top-left',
        'top-right',
        'bottom',
        'bottom-left',
        'bottom-right',
        'left',
        'left-bottom',
        'left-top',
        'right',
        'right-bottom',
        'right-top',
      ],
      control: { type: 'select' },
    },
    className: {
      control: false,
    },
  },
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof Coachmark>;

type CarbonTheme = 'white' | 'g10' | 'g90' | 'g100';

//fetching theme
function useCarbonTheme() {
  const [themeValue, setThemeValue] = useState(() =>
    document.documentElement.getAttribute('data-carbon-theme')
  );

  useEffect(() => {
    const target = document.documentElement;

    // function to read the current theme
    const readTheme = () => {
      const newTheme = target.getAttribute('data-carbon-theme');
      setThemeValue((prev) => (prev !== newTheme ? newTheme : prev));
    };

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'data-carbon-theme'
        ) {
          readTheme();
        }
      }
    });

    observer.observe(target, {
      attributes: true,
      attributeFilter: ['data-carbon-theme'],
    });

    //fallback - check readTheme in every 200ms
    const interval = setInterval(readTheme, 200);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  return themeValue;
}

//Tooltip variant
const TooltipTemplate: StoryFn<typeof Coachmark> = (args, context) => {
  const sbDocs = context.viewMode !== 'docs';
  const observedTheme = useCarbonTheme();
  const carbonTheme = (sbDocs ? observedTheme : 'white') as CarbonTheme;
  const [isOpen, setIsOpen] = useState(true);
  const beaconButtonRef = useRef<HTMLButtonElement>(null);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleBeaconClick = () => {
    setIsOpen((isOpen) => !isOpen);
  };

  return (
    <Theme theme={carbonTheme}>
      <main>
        <Coachmark
          position={{ x: 151, y: 155 }}
          open={isOpen}
          onClose={handleClose}
          launcherButtonRef={beaconButtonRef}
          {...args}>
          <CoachmarkBeacon
            label="Show information"
            buttonProps={{
              onClick: handleBeaconClick,
              id: 'CoachmarkBtn',
              ref: beaconButtonRef,
            }}></CoachmarkBeacon>
          <Coachmark.Content>
            <Coachmark.ContentHeader closeIconDescription="Close"></Coachmark.ContentHeader>
            <Coachmark.ContentBody>
              <h2>Hello World</h2>
              <p>this is a description test</p>
              <Button
                size="sm"
                className="coachmark-done-button"
                onClick={action('Done button clicked')}>
                Done
              </Button>
            </Coachmark.ContentBody>
          </Coachmark.Content>
        </Coachmark>
      </main>
    </Theme>
  );
};

//Floating variant
const FloatingTemplate: StoryFn<typeof Coachmark> = (args, context) => {
  const sbDocs = context.viewMode !== 'docs';
  const observedTheme = useCarbonTheme();
  const carbonTheme = (sbDocs ? observedTheme : 'white') as CarbonTheme;
  const [isOpen, setIsOpen] = useState(true);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleButtonClick = () => {
    setIsOpen((isOpen) => !isOpen);
  };
  return (
    <Theme theme={carbonTheme}>
      <main style={{ marginLeft: '100px' }}>
        <Coachmark
          open={isOpen}
          onClose={handleClose}
          floating={true}
          selectorPrimaryFocus=".c4p--coachmark__next--content-header--drag-icon"
          launcherButtonRef={triggerButtonRef}
          {...args}>
          <Button
            id="CoachmarkBtn"
            kind="tertiary"
            size="md"
            renderIcon={Crossroads}
            onClick={handleButtonClick}
            ref={triggerButtonRef}>
            Show information
          </Button>
          <Coachmark.Content>
            <Coachmark.ContentHeader
              closeIconDescription="Close"
              dragIconDescription="Drag"
              dragAriaLabel="Coachmark is being dragged"></Coachmark.ContentHeader>
            <Coachmark.ContentBody>
              <h2>Hello World</h2>
              <p>this is a description test</p>
              <Button size="sm" onClick={action('Done button clicked')}>
                Done
              </Button>
            </Coachmark.ContentBody>
          </Coachmark.Content>
        </Coachmark>
      </main>
    </Theme>
  );
};

export const Tooltip: StoryFn<typeof Coachmark> = TooltipTemplate.bind({});
Tooltip.args = {
  align: 'top',
};

export const Floating: StoryFn<typeof Coachmark> = FloatingTemplate.bind({});
Floating.args = {
  align: 'bottom',
};
