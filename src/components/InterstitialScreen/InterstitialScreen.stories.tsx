/**
 * Copyright IBM Corp. 2024, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2024, 2024
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, InterstitialScreen, InterstitialScreenView, Button and ButtonSet from @afframe/ui, plain CSS file, literal c4p prefix, clamp written inline, launcher ref cast, step values defaulted and handleGotoStep called with ?. for the optional types, title Components/InterstitialScreen. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useRef, useState, type ComponentProps, type RefObject } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { ArrowRight } from '../../icons.js';
import {
  Button,
  ButtonSet,
  InterstitialScreen,
  InterstitialScreenView,
} from '../../index.js';
import mdx from './InterstitialScreen.mdx';
import { InterstitialScreenViewModule } from './_story-assets/InterstitialScreenViewModule/InterstitialScreenViewModule.js';
import './interstitial-screen-story.css';

type ContentConfig = Parameters<
  NonNullable<ComponentProps<typeof InterstitialScreen.Body>['contentRenderer']>
>[0];
type FooterProps = ComponentProps<typeof InterstitialScreen.Footer>;
type ActionButtonConfig = Parameters<
  NonNullable<FooterProps['actionButtonRenderer']>
>[0];

const useLauncherRef = () =>
  useRef<HTMLButtonElement>(null) as RefObject<HTMLButtonElement>;

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const storyClass = 'interstitial-stories';

// cspell:words Terminé Partiel Actuel valide

const blockClass = 'c4p--interstitial-screen';

export default {
  title: 'Components/InterstitialScreen',
  component: InterstitialScreen,
  tags: ['autodocs', 'Onboarding', 'ibm-products'],
  subcomponents: {
    Header: InterstitialScreen.Header,
    Body: InterstitialScreen.Body,
    Footer: InterstitialScreen.Footer,
    InterstitialScreenView: InterstitialScreenView,
  },
  decorators: [
    (Story) => {
      return (
        <div className={`${storyClass}__viewport`}>
          <Story />
        </div>
      );
    },
  ],
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof InterstitialScreen>;
const translations: Record<string, string> = {
  'carbon.progress-step.complete': 'Terminé',
  'carbon.progress-step.incomplete': 'Partiel',
  'carbon.progress-step.current': 'Actuel',
  'carbon.progress-step.invalid': 'Non valide',
};

const getMultipleContent = () => {
  return (
    <>
      <InterstitialScreenView
        stepTitle="Step 1"
        translateWithId={(id: string) => translations[id] ?? id}>
        <InterstitialScreenViewModule
          size="md"
          title="Use case-specific heading 1"
          description="Use case-specific content that explains the concept. Use case-specific content that explains the concept. Use case-specific content that explains the concept. Use case-specific content that explains the concept."
        />
      </InterstitialScreenView>
      <InterstitialScreenView
        stepTitle="Step 2"
        translateWithId={(id: string) => translations[id] ?? id}>
        <InterstitialScreenViewModule
          size="md"
          title="Use case-specific heading 2"
          description="Use case-specific content that explains the concept. Use case-specific content that explains the concept. Use case-specific content that explains the concept. Use case-specific content that explains the concept."
        />
      </InterstitialScreenView>
      <InterstitialScreenView
        stepTitle="Step 3"
        translateWithId={(id: string) => translations[id] ?? id}>
        <InterstitialScreenViewModule
          size="md"
          title="Use case-specific heading 3"
          description="Use case-specific content that explains the concept. Use case-specific content that explains the concept. Use case-specific content that explains the concept. Use case-specific content that explains the concept."
        />
      </InterstitialScreenView>
      <InterstitialScreenView
        stepTitle="Step 4"
        translateWithId={(id: string) => translations[id] ?? id}>
        <InterstitialScreenViewModule
          size="md"
          title="Use case-specific heading 4"
          description="Use case-specific content that explains the concept. Use case-specific content that explains the concept. Use case-specific content that explains the concept. Use case-specific content that explains the concept."
        />
      </InterstitialScreenView>
      <InterstitialScreenView
        stepTitle="Step 5"
        translateWithId={(id: string) => translations[id] ?? id}>
        <InterstitialScreenViewModule
          size="md"
          title="Use case-specific heading 5"
          description="Use case-specific content that explains the concept. Use case-specific content that explains the concept. Use case-specific content that explains the concept. Use case-specific content that explains the concept."
        />
      </InterstitialScreenView>
    </>
  );
};

const getSingleContent = (
  { disableActionButton }: ContentConfig,
  includeDisableButton?: boolean,
  isFullScreen?: boolean
) => {
  return (
    <>
      <InterstitialScreenView stepTitle="Step 1">
        <InterstitialScreenViewModule
          className={isFullScreen ? 'GenericView' : ''}
          title="Use case-specific heading"
          description="Use case-specific content that explains the concept. Use case-specific content that explains the concept. Use case-specific content that explains the concept. Use case-specific content that explains the concept."
          disableActionButton={
            includeDisableButton ? disableActionButton : null
          }
        />
      </InterstitialScreenView>
    </>
  );
};

/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * | STORIES | * * * * * * * * * * * * * * */
/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

const defaultProps = {
  headerTitle: 'Use case-specific title',
  headerSubTitle: 'Use case-specific sub title',
  ariaLabel: 'Interstitial Screen',
};
export const Modal: StoryFn = () => {
  const [showInterstitialScreen, setShowInterstitialScreen] = useState(true);
  const launcherButtonRef = useLauncherRef();
  return (
    <>
      <Button
        onClick={() => {
          setShowInterstitialScreen(true);
        }}
        ref={launcherButtonRef}>
        Show Interstitial modal
      </Button>

      <InterstitialScreen
        open={showInterstitialScreen}
        onClose={() => {
          setShowInterstitialScreen(false);
        }}
        ariaLabel={defaultProps.ariaLabel}
        launcherButtonRef={launcherButtonRef}>
        <InterstitialScreen.Header
          headerTitle={defaultProps.headerTitle}
          headerSubTitle={defaultProps.headerSubTitle}
          hideProgressIndicator={true}></InterstitialScreen.Header>
        <InterstitialScreen.Body
          contentRenderer={(internalConfig: ContentConfig) => {
            return getSingleContent(internalConfig, true);
          }}
        />
        <InterstitialScreen.Footer />
      </InterstitialScreen>
    </>
  );
};

export const ModalWithMultipleSteps: StoryFn = () => {
  const [showInterstitialScreen, setShowInterstitialScreen] = useState(true);
  const launcherButtonRef = useLauncherRef();
  return (
    <>
      <Button
        onClick={() => {
          setShowInterstitialScreen(true);
        }}
        ref={launcherButtonRef}>
        Show Interstitial modal
      </Button>

      <InterstitialScreen
        open={showInterstitialScreen}
        onClose={() => {
          setShowInterstitialScreen(false);
        }}
        ariaLabel={defaultProps.ariaLabel}
        launcherButtonRef={launcherButtonRef}>
        <InterstitialScreen.Header
          headerTitle={defaultProps.headerTitle}
          headerSubTitle={
            defaultProps.headerSubTitle
          }></InterstitialScreen.Header>
        <InterstitialScreen.Body contentRenderer={() => getMultipleContent()} />
        <InterstitialScreen.Footer />
      </InterstitialScreen>
    </>
  );
};

export const WithCustomActionButtons: StoryFn = () => {
  const [showInterstitialScreen, setShowInterstitialScreen] = useState(true);
  const launcherButtonRef = useLauncherRef();
  return (
    <>
      <Button
        onClick={() => {
          setShowInterstitialScreen(true);
        }}
        ref={launcherButtonRef}>
        Show Interstitial modal
      </Button>

      <InterstitialScreen
        open={showInterstitialScreen}
        onClose={() => {
          setShowInterstitialScreen(false);
        }}
        ariaLabel={defaultProps.ariaLabel}
        launcherButtonRef={launcherButtonRef}>
        <InterstitialScreen.Header
          headerTitle={defaultProps.headerTitle}
          headerSubTitle={
            defaultProps.headerSubTitle
          }></InterstitialScreen.Header>
        <InterstitialScreen.Body contentRenderer={() => getMultipleContent()} />
        <InterstitialScreen.Footer
          actionButtonRenderer={({
            handleGotoStep,
            progStep = 0,
            stepCount = 0,
          }: ActionButtonConfig) => {
            return (
              <ButtonSet>
                <Button
                  className={`${blockClass}--skip-btn`}
                  kind="ghost"
                  size="lg"
                  title={'Explore on my own'}
                  onClick={() => setShowInterstitialScreen(false)}>
                  Explore on my own
                </Button>

                {progStep > 0 && (
                  <Button
                    className={`${blockClass}--prev-btn`}
                    kind="secondary"
                    size="lg"
                    title={'Previous'}
                    onClick={() => {
                      const progStepFloor = 0;
                      const progStepCeil = stepCount - 1;
                      const targetStep = clamp(
                        progStep - 1,
                        progStepFloor,
                        progStepCeil
                      );
                      handleGotoStep?.(targetStep);
                    }}>
                    Previous
                  </Button>
                )}

                {progStep < stepCount - 1 && (
                  <Button
                    className={`${blockClass}--next-btn`}
                    renderIcon={ArrowRight}
                    size="lg"
                    title={'Next'}
                    onClick={() => {
                      const progStepFloor = 0;
                      const progStepCeil = stepCount - 1;
                      const targetStep = clamp(
                        progStep + 1,
                        progStepFloor,
                        progStepCeil
                      );
                      handleGotoStep?.(targetStep);
                    }}>
                    Next
                  </Button>
                )}

                {progStep === stepCount - 1 && (
                  <Button
                    className={`${blockClass}--start-btn`}
                    renderIcon={ArrowRight}
                    size="lg"
                    title={'Start'}
                    onClick={() => setShowInterstitialScreen(false)}>
                    Start
                  </Button>
                )}
              </ButtonSet>
            );
          }}
        />
      </InterstitialScreen>
    </>
  );
};
export const WithAsynchronousActionCallback: StoryFn = () => {
  const [showInterstitialScreen, setShowInterstitialScreen] = useState(true);
  const launcherButtonRef = useLauncherRef();

  const onAction: FooterProps['onAction'] = async (actionType) => {
    if (actionType !== 'skip') {
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1500);
      });
    }
  };
  return (
    <>
      <Button
        onClick={() => {
          setShowInterstitialScreen(true);
        }}
        ref={launcherButtonRef}>
        Show Interstitial modal
      </Button>

      <InterstitialScreen
        open={showInterstitialScreen}
        onClose={() => {
          setShowInterstitialScreen(false);
        }}
        ariaLabel={defaultProps.ariaLabel}
        launcherButtonRef={launcherButtonRef}>
        <InterstitialScreen.Header
          headerTitle={defaultProps.headerTitle}
          headerSubTitle={
            defaultProps.headerSubTitle
          }></InterstitialScreen.Header>
        <InterstitialScreen.Body contentRenderer={() => getMultipleContent()} />
        <InterstitialScreen.Footer onAction={onAction} />
      </InterstitialScreen>
    </>
  );
};
export const fullScreen: StoryFn = () => {
  const [showInterstitialScreen, setShowInterstitialScreen] = useState(true);
  const launcherButtonRef = useLauncherRef();

  return (
    <>
      <Button
        onClick={() => {
          setShowInterstitialScreen(true);
        }}
        ref={launcherButtonRef}>
        Show Interstitial full screen
      </Button>
      <InterstitialScreen
        open={showInterstitialScreen}
        onClose={() => {
          setShowInterstitialScreen(false);
        }}
        isFullScreen={true}
        ariaLabel={defaultProps.ariaLabel}
        launcherButtonRef={launcherButtonRef}>
        <InterstitialScreen.Header
          headerTitle={defaultProps.headerTitle}
          headerSubTitle={
            defaultProps.headerSubTitle
          }></InterstitialScreen.Header>
        <InterstitialScreen.Body
          contentRenderer={(internalConfig: ContentConfig) => {
            return getSingleContent(internalConfig, true, true);
          }}
        />
        <InterstitialScreen.Footer />
      </InterstitialScreen>
    </>
  );
};

export const fullScreenWithMultipleSteps: StoryFn = () => {
  const [showInterstitialScreen, setShowInterstitialScreen] = useState(true);
  const launcherButtonRef = useLauncherRef();

  return (
    <>
      <Button
        onClick={() => {
          setShowInterstitialScreen(true);
        }}
        ref={launcherButtonRef}>
        Show Interstitial full screen
      </Button>
      <InterstitialScreen
        open={showInterstitialScreen}
        onClose={() => {
          setShowInterstitialScreen(false);
        }}
        isFullScreen={true}
        ariaLabel={defaultProps.ariaLabel}
        launcherButtonRef={launcherButtonRef}>
        <InterstitialScreen.Header
          headerTitle={defaultProps.headerTitle}
          headerSubTitle={
            defaultProps.headerSubTitle
          }></InterstitialScreen.Header>
        <InterstitialScreen.Body contentRenderer={() => getMultipleContent()} />
        <InterstitialScreen.Footer />
      </InterstitialScreen>
    </>
  );
};
