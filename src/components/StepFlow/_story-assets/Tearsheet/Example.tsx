/**
 * Copyright IBM Corp. 2025, 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2025, 2025
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: IBM's Tearsheet With Steps example on Afframe's Tearsheet (IBM's preview__Tearsheet) through the ported StepTearsheet, the step actions passed as its actions slot (the footer) instead of as a child, components and the step flow from @afframe/ui, form values read as strings, the unused container ref dropped, the disabled-state helpers shortened (same results), the influencer builder without its unused showIntro argument (the caller checks it). The intro screen labels its button Next: Carbon's published step context starts totalSteps at 1, IBM's internal one at undefined. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useEffect, useState } from 'react';
import {
  Button,
  CodeSnippet,
  Heading,
  ProgressIndicator,
  ProgressStep,
  RadioTile,
  Section,
  StepGroup,
  StepProvider,
  TextInput,
  TileGroup,
  useStepContext,
} from '../../../../index.js';
import type { StepContextType } from '../../../../index.js';
import { StepTearsheet } from './StepTearsheet.js';
import { StepActions } from '../StepActions.js';

const introExample = true;

const useStepFocus = (stepPrimaryFocus: string) => {
  useEffect(() => {
    document.querySelector<HTMLElement>(stepPrimaryFocus)?.focus();
  }, [stepPrimaryFocus]);
};

function Step1() {
  const { setFormState, formState } = useStepContext();
  const email = String(formState.email ?? '');
  useStepFocus('#email');
  return (
    <Section className="step-container">
      <Heading className="step-heading">Step 1</Heading>
      <TextInput
        id="email"
        onChange={(e) => {
          setFormState((prev) => ({ ...prev, email: e.target.value }));
        }}
        labelText="Email"
        value={email}
      />
    </Section>
  );
}

function Step2() {
  const { setFormState, formState } = useStepContext();
  const city = String(formState.city ?? '');
  const state = String(formState.state ?? '');
  useStepFocus('#city');
  return (
    <Section className="step-container">
      <Heading className="step-heading">Step 2</Heading>
      <div className="step-form-items">
        <TextInput
          id="city"
          onChange={(e) => {
            setFormState((prev) => ({ ...prev, city: e.target.value }));
          }}
          labelText="City"
          value={city}
        />
        <TextInput
          id="state"
          onChange={(e) => {
            setFormState((prev) => ({ ...prev, state: e.target.value }));
          }}
          labelText="State"
          value={state}
        />
      </div>
    </Section>
  );
}

function Step3() {
  // Example showing how to get step state via hook
  const { formState } = useStepContext();
  return (
    <Section className="step-container">
      <Heading className="step-heading">Step 3</Heading>
      <div>
        Form state
        <CodeSnippet type="multi">
          {JSON.stringify(formState, null, 2)}
        </CodeSnippet>
      </div>
    </Section>
  );
}

const buildCustomInfluencer = (
  { currentStep, handleGoToStep }: StepContextType,
  includeIntro: boolean,
  selectedFlow: string
) => (
  <div className="tearsheet-stories__dummy-content-block">
    {includeIntro && <h6 className="selected-intro-option">{selectedFlow}</h6>}
    <ProgressIndicator
      vertical
      onChange={(stepIndex) => handleGoToStep(stepIndex + 1)}>
      <ProgressStep
        complete={currentStep > 1}
        current={currentStep === 1}
        label="Step 1"
        secondaryLabel="Optional label"
      />
      <ProgressStep
        complete={currentStep > 2}
        current={currentStep === 2}
        label="Step 2"
      />
      <ProgressStep
        current={currentStep === 3}
        label="Step 3"
        complete={currentStep > 3}
      />
      {includeIntro && selectedFlow === 'plus' && (
        <ProgressStep current={currentStep === 4} label="Plus only step" />
      )}
    </ProgressIndicator>
  </div>
);

const PlusOnly = () => <>This step only renders for plus flows.</>;

export const Example = () => {
  const [open, setOpen] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [selectedFlow, setSelectedFlow] = useState('standard');

  // fallow-ignore-next-line complexity -- IBM's example, one guard per step
  const handleNextDisabledState = (
    formState: StepContextType['formState'],
    currentStep: number
  ) => {
    if (showIntro) {
      return false;
    }
    if (!formState.email && currentStep === 1) {
      return true;
    }
    return (!formState.city || !formState.state) && currentStep === 2;
  };

  const handleBackDisabledState = (currentStep: number) =>
    showIntro || (currentStep === 1 && !introExample);

  return (
    <StepProvider>
      <div>
        <Button onClick={() => setOpen(true)}>{open ? 'Close' : 'Open'}</Button>
        <StepTearsheet
          influencer={
            !showIntro
              ? (state) =>
                  buildCustomInfluencer(state, introExample, selectedFlow)
              : null
          }
          open={open}
          onClose={() => setOpen(false)}
          title="Tearsheet title"
          hasCloseIcon={false}
          selectorPrimaryFocus="#email"
          actions={
            <div className="c4p--step-actions__button-container my-custom-action-set">
              <StepActions
                buttonRenderer={({
                  currentStep,
                  handleNext,
                  totalSteps,
                  handleGoToStep,
                  setFormState,
                  handlePrevious,
                  formState,
                }) => (
                  <>
                    <Button
                      className="step-action-button step-action-button__cancel"
                      kind="ghost"
                      onClick={() => {
                        setOpen(false);
                        if (introExample) {
                          setShowIntro(true);
                        }
                      }}
                      size="xl">
                      Cancel
                    </Button>
                    <Button
                      className="step-action-button"
                      kind="secondary"
                      onClick={() => {
                        if (currentStep === 1 && introExample) {
                          setShowIntro(true);
                          return;
                        }
                        handlePrevious();
                      }}
                      disabled={handleBackDisabledState(currentStep)}
                      size="xl">
                      Back
                    </Button>
                    <Button
                      disabled={handleNextDisabledState(formState, currentStep)}
                      size="xl"
                      className="step-action-button"
                      onClick={() => {
                        if (showIntro) {
                          setShowIntro(false);
                          return;
                        }
                        if (currentStep === totalSteps) {
                          // submit
                          setOpen(false);
                          handleGoToStep(1);
                          setFormState({});
                          if (introExample) {
                            setShowIntro(true);
                          }
                        } else {
                          handleNext();
                        }
                      }}>
                      {!showIntro && currentStep === totalSteps
                        ? 'Submit'
                        : 'Next'}
                    </Button>
                  </>
                )}
              />
            </div>
          }>
          {showIntro && (
            <TileGroup
              valueSelected={selectedFlow}
              defaultSelected="standard"
              legend="Choose create flow"
              name="radio tile group"
              onChange={(a) => setSelectedFlow(String(a))}>
              <RadioTile
                className="custom-intro-tile"
                id="radio-tile-1"
                value="standard">
                Standard
              </RadioTile>
              <RadioTile
                className="custom-intro-tile"
                id="radio-tile-2"
                value="premium">
                Premium
              </RadioTile>
              <RadioTile
                className="custom-intro-tile"
                id="radio-tile-3"
                value="plus">
                Plus
              </RadioTile>
            </TileGroup>
          )}
          {/* Steps */}
          {!showIntro && (
            <StepGroup>
              <Step1 />
              <Step2 />
              <Step3 />
              {introExample && selectedFlow === 'plus' && <PlusOnly />}
            </StepGroup>
          )}
        </StepTearsheet>
      </div>
    </StepProvider>
  );
};
