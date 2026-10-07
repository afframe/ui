/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, source tag, inline spacing as Carbon spacing tokens. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { useState } from 'react';
import { action } from 'storybook/actions';
import { Button, InlineLoading } from '../../index.js';
import mdx from './InlineLoading.mdx';

export default {
  title: 'Components/InlineLoading',
  component: InlineLoading,
  tags: ['carbon'],
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof InlineLoading>;

const sharedArgTypes = {
  description: {
    control: {
      type: 'text',
    },
  },
  iconDescription: {
    control: {
      type: 'text',
    },
  },
  successDelay: {
    control: {
      type: 'number',
    },
  },
  status: {
    options: ['inactive', 'active', 'error', 'finished'],
    control: {
      type: 'select',
    },
  },
  onSuccess: {
    action: 'onSuccess',
  },
  'aria-live': {
    control: {
      type: 'text',
    },
  },
} as const;

interface MockSubmissionState {
  handleSubmit: () => void;
  isSubmitting: boolean;
  success: boolean;
  description: string;
  ariaLive: 'off' | 'assertive';
}

export const UxExample: StoryFn<typeof InlineLoading> = () => {
  function MockSubmission({
    children,
  }: {
    children: (state: MockSubmissionState) => React.ReactNode;
  }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [description, setDescription] = useState('Submitting...');
    const [ariaLive, setAriaLive] = useState<'off' | 'assertive'>('off');
    const handleSubmit = () => {
      setIsSubmitting(true);
      setAriaLive('assertive');

      // Instead of making a real request, we mock it with a timer
      setTimeout(() => {
        setIsSubmitting(false);
        setSuccess(true);
        setDescription('Submitted!');

        // To make submittable again, we reset the state after a bit so the user gets completion feedback
        setTimeout(() => {
          setSuccess(false);
          setDescription('Submitting...');
          setAriaLive('off');
        }, 1500);
      }, 2000);
    };

    return children({
      handleSubmit,
      isSubmitting,
      success,
      description,
      ariaLive,
    });
  }

  return (
    <MockSubmission>
      {({ handleSubmit, isSubmitting, success, description, ariaLive }) => (
        <div style={{ display: 'flex', width: '300px' }}>
          <Button kind="secondary" disabled={isSubmitting || success}>
            Cancel
          </Button>
          {isSubmitting || success ? (
            <InlineLoading
              style={{ marginLeft: 'var(--cds-spacing-05)' }}
              description={description}
              status={success ? 'finished' : 'active'}
              aria-live={ariaLive}
            />
          ) : (
            <Button onClick={handleSubmit}>Submit</Button>
          )}
        </div>
      )}
    </MockSubmission>
  );
};

export const Default: StoryFn<typeof InlineLoading> = (args) => (
  <InlineLoading {...args} />
);

Default.args = {
  description: 'Loading',
  iconDescription: 'Loading data...',
  status: 'active',
  onSuccess: action('onSuccess'),
  'aria-live': 'assertive',
};

Default.parameters = {
  controls: {
    exclude: ['successDelay'],
  },
};

Default.argTypes = { ...sharedArgTypes };
