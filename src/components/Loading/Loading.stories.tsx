/**
 * Copyright IBM Corp. 2016, 2026
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2026
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { useEffect, useRef, useState } from 'react';
import { Button, Loading, Modal } from '../../index.js';
import mdx from './Loading.mdx';

export default {
  title: 'Components/Loading',
  component: Loading,
  tags: ['carbon'],
  parameters: {
    docs: {
      page: mdx,
    },
    // The id prop is deprecated and should be remove in the next major release
    controls: {
      exclude: ['id'],
    },
  },
} satisfies Meta<typeof Loading>;

export const Default: StoryFn<typeof Loading> = (args) => {
  return <Loading className={'some-class'} {...args} />;
};

Default.args = {
  active: true,
  withOverlay: false,
  small: false,
  description: 'Loading account settings',
};

const sharedArgTypes = {
  active: {
    control: {
      type: 'boolean',
    },
  },
  withOverlay: {
    control: {
      type: 'boolean',
    },
  },
  small: {
    control: {
      type: 'boolean',
    },
  },
  description: {
    control: {
      type: 'text',
    },
  },
} as const;

Default.argTypes = { ...sharedArgTypes };

const OVERLAY_LOADING_DURATION_MS = 2000;

const useStartLoading = () => {
  const [isActive, setIsActive] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  const startLoading = () => {
    clearTimeout(timeoutRef.current);
    setIsActive(true);
    timeoutRef.current = setTimeout(
      () => setIsActive(false),
      OVERLAY_LOADING_DURATION_MS
    );
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return { isActive, startLoading };
};

export const OverlayLoading: StoryFn<typeof Loading> = (args) => {
  const { isActive, startLoading } = useStartLoading();

  return (
    <main>
      <Button onClick={startLoading}>Start</Button>
      <Loading {...args} active={isActive} withOverlay />
    </main>
  );
};

OverlayLoading.argTypes = {
  small: sharedArgTypes.small,
  description: sharedArgTypes.description,
};

export const OverlayLoadingBehindModal: StoryFn<typeof Loading> = (args) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const launcherButtonRef = useRef<HTMLButtonElement>(null);

  const { isActive: isLoadingActive, startLoading } = useStartLoading();

  return (
    <main>
      <Button ref={launcherButtonRef} onClick={() => setIsModalOpen(true)}>
        Open modal
      </Button>
      <Modal
        open={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        onRequestSubmit={startLoading}
        launcherButtonRef={launcherButtonRef}
        modalHeading="Account settings"
        primaryButtonText="Save"
        secondaryButtonText="Cancel">
        <p>
          Select <strong>Save</strong> to trigger a two second loading state
          behind this modal. The overlay is the layer below, so it leaves focus
          alone. Focus stays on <strong>Save</strong> and Tab keeps cycling
          through the modal instead of moving to the overlay.
        </p>
      </Modal>
      <Loading {...args} active={isLoadingActive} withOverlay />
    </main>
  );
};

OverlayLoadingBehindModal.storyName = 'Overlay Loading Behind Modal';

OverlayLoadingBehindModal.argTypes = {
  small: sharedArgTypes.small,
  description: sharedArgTypes.description,
};
