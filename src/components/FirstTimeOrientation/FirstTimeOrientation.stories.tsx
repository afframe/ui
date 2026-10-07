/**
 * Copyright IBM Corp. 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2025
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, ContentWrapper copied into the story folder (the package publishes no JavaScript for it), the removed interstitialAriaLabel prop renamed to IBM's ariaLabel, the pkg flag dropped (InterstitialScreen is released in IBM Products), the component Sass import dropped (the styles ship in the package CSS), story styles converted from SCSS to plain CSS, the heading-order a11y rule disabled (fixed h3 in the Labs WelcomeInterstitial), source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import {
  Button,
  InterstitialScreen,
  PersonalizationInterstitial,
  WelcomeInterstitial,
} from '../../index.js';
import { ContentWrapper } from './ContentWrapper.js';
import mdx from './FirstTimeOrientation.mdx';
import './first-time-orientation-story.css';

export default {
  title: 'Patterns/FirstTimeOrientation',
  tags: ['labs'],
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta;

export const FirstTimeOrientationStory: StoryFn = () => {
  const [showInterstitialModal, setShowInterstitialModal] = useState(true);

  const defaultProps = {
    headerTitle: 'Welcome to your sandbox, Jack!',
    ariaLabel: 'Interstitial Screen',
  };

  return (
    <div className="storyBody">
      <Button
        onClick={() => {
          setShowInterstitialModal(true);
        }}>
        Show Interstitial modal
      </Button>
      <InterstitialScreen
        open={showInterstitialModal}
        onClose={() => {
          setShowInterstitialModal(false);
        }}
        ariaLabel={defaultProps.ariaLabel}
        isFullScreen={false}>
        <InterstitialScreen.Header
          headerTitle={defaultProps.headerTitle}></InterstitialScreen.Header>
        <InterstitialScreen.Body
          contentRenderer={() => {
            return (
              <>
                <ContentWrapper stepTitle="Welcome">
                  <WelcomeInterstitial />
                </ContentWrapper>
                <ContentWrapper stepTitle="Tailor your experience">
                  <PersonalizationInterstitial />
                </ContentWrapper>
              </>
            );
          }}
        />
        <InterstitialScreen.Footer />
      </InterstitialScreen>
    </div>
  );
};
FirstTimeOrientationStory.storyName = 'First-time orientation';
// The Labs WelcomeInterstitial renders a fixed h3 below the InterstitialScreen
// header, so a heading level is skipped.
FirstTimeOrientationStory.parameters = {
  a11y: { config: { rules: [{ id: 'heading-order', enabled: false }] } },
};
