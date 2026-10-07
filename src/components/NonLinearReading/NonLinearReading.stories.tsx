/**
 * Copyright IBM Corp. 2023, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2023, 2024
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, previewCandidate__NonLinearReading and Theme from @afframe/ui, plain CSS file, the gradient wrapper uses the Theme component for the g100 theme, unused args parameter removed, tags. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import {
  previewCandidate__NonLinearReading as NonLinearReading,
  Theme,
} from '../../index.js';
import mdx from './NonLinearReading.mdx';
import './non-linear-reading-story.css';

const storyClass = 'non-linear-reading-stories';

export default {
  title: 'Preview Candidate/Onboarding/NonLinearReading',
  component: NonLinearReading,
  tags: ['autodocs', 'Onboarding', 'ibm-products'],
  parameters: {
    layout: 'padded',
    docs: {
      page: mdx,
    },
  },
  argTypes: {
    definition: {
      table: {
        disable: true,
      },
    },
    theme: {
      control: false,
    },
  },
} satisfies Meta<typeof NonLinearReading>;

// As a standalone component, each "story" is meaningless:
// just a pill for a keyword, expanding to show its definition.
// Should always be shown in context with surrounding text.

export const SingleLevel: StoryFn<typeof NonLinearReading> = () => {
  return (
    <div className={`${storyClass}__viewport`}>
      XDR Connect’s correlation
      <NonLinearReading
        definition={
          <>
            This is a technical component that uses a set of rules to process
            alerts from your{' '}
            <a href="https://www.ibm.com/" target="_blank" rel="noreferrer">
              sources
            </a>
            , and streamline threat analysis.
          </>
        }>
        engine,
      </NonLinearReading>{' '}
      creates a case by processing data from alerts across multiple security
      tools.
    </div>
  );
};

export const MultipleLevel: StoryFn<typeof NonLinearReading> = () => {
  return (
    <div className={`${storyClass}__viewport`}>
      Findings are created by the alerts{' '}
      <NonLinearReading
        definition={
          <>
            We examine the alerts from each source, and{' '}
            <NonLinearReading
              definition="Correlation allows us to identify connections between common
                  observables, tactics, and techniques, and to remove any
                  duplicate data, thereby streamlining the investigation for
                  you.">
              correlate
            </NonLinearReading>{' '}
            them together with{' '}
            <a href="https://www.ibm.com/" target="_blank" rel="noreferrer">
              rules
            </a>
            . While a case can contain multiple alerts, a single finding can
            only be created from a single alert. So, when you select a finding,
            you can drill right down to the raw data behind it: the payload. We
            also use our
            <NonLinearReading
              definition="
                  Our threat intelligence service contains an enrichment
                  capability. During the enrichment process, we add context that
                  is used to establish the severity of artifacts associated with
                  a finding. This is what determines the severity of the finding
                  itself. Bear in mind that each case can have multiple
                  findings, and every finding will have its own severity.
                ">
              threat intelligence service
            </NonLinearReading>
            to establish the severity of the artifacts.
          </>
        }>
        ingested
      </NonLinearReading>{' '}
      from your own security systems. The findings here are confirmed findings
      that have been created from alerts ingested from your own sources, before
      being enriched to create cases.
    </div>
  );
};

export const WithGradientBackground: StoryFn<typeof NonLinearReading> = () => {
  return (
    <div className={`${storyClass}__viewport`}>
      <Theme theme="g100" className="gradient-bg">
        XDR Connect’s correlation
        <NonLinearReading
          definition={
            <>
              This is a technical component that uses a set of rules to process
              alerts from your{' '}
              <a href="https://www.ibm.com/" target="_blank" rel="noreferrer">
                sources
              </a>
              , and streamline threat analysis.
            </>
          }
          theme="dark">
          engine,
        </NonLinearReading>{' '}
        creates a case by processing data from alerts across multiple security
        tools.
      </Theme>
    </div>
  );
};
