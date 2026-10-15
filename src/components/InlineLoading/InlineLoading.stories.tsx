/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, source tag, inline spacing as Carbon spacing tokens, Default story first, Finished and Error stories, UxExample renamed to Submitting, Afframe example data, onSuccess description with the component name as code. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { useState } from 'react';
import { action } from 'storybook/actions';
import { Button, ButtonSet, InlineLoading } from '../../index.js';
import mdx from './InlineLoading.mdx';

export default {
  title: 'Components/InlineLoading',
  component: InlineLoading,
  tags: ['carbon'],
  // Carbon's text names the component as a bare <InlineLoading> tag, which the
  // props table renders as a DOM element and React logs as wrong casing.
  argTypes: {
    onSuccess: {
      description:
        'Provide an optional handler to be invoked when `InlineLoading` is successful',
    },
  },
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

export const Default: StoryFn<typeof InlineLoading> = (args) => (
  <InlineLoading {...args} />
);

Default.args = {
  description: 'Saving invoice',
  iconDescription: 'Saving',
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

export const Finished: StoryFn<typeof InlineLoading> = (args) => (
  <InlineLoading {...args} />
);

Finished.args = {
  description: 'Invoice saved',
  status: 'finished',
  onSuccess: action('onSuccess'),
  'aria-live': 'assertive',
};

Finished.argTypes = { ...sharedArgTypes };

export const Error: StoryFn<typeof InlineLoading> = (args) => (
  <InlineLoading {...args} />
);

Error.args = {
  description: 'Invoice not saved',
  status: 'error',
  'aria-live': 'assertive',
};

Error.parameters = {
  controls: {
    exclude: ['successDelay'],
  },
};

Error.argTypes = { ...sharedArgTypes };

export const Submitting: StoryFn<typeof InlineLoading> = () => {
  function MockSubmission({
    children,
  }: {
    children: (state: MockSubmissionState) => React.ReactNode;
  }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [description, setDescription] = useState('Saving invoice');
    const [ariaLive, setAriaLive] = useState<'off' | 'assertive'>('off');
    const handleSubmit = () => {
      setIsSubmitting(true);
      setAriaLive('assertive');

      // Instead of making a real request, we mock it with a timer
      setTimeout(() => {
        setIsSubmitting(false);
        setSuccess(true);
        setDescription('Invoice saved');

        // To make submittable again, we reset the state after a bit so the user gets completion feedback
        setTimeout(() => {
          setSuccess(false);
          setDescription('Saving invoice');
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
        <ButtonSet style={{ width: '300px' }}>
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
            <Button onClick={handleSubmit}>Save</Button>
          )}
        </ButtonSet>
      )}
    </MockSubmission>
  );
};
