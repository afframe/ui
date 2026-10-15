/**
 * Copyright IBM Corp. 2025, 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2025, 2025
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: copied from IBM Products' Step flows stories, TypeScript, title by the module name, carbon tag, story names unified, the tearsheet story on Afframe's Tearsheet (preview__Tearsheet) through the step tearsheet example of the Tearsheet page, because IBM's renders the stable Tearsheet that Afframe does not export, scss styles replaced by step-flow-story.css. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useRef, useState } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { Button, StepGroup, StepProvider } from '../../index.js';
import { TearsheetWithSteps } from '../Tearsheet/_story-assets/StepTearsheet.js';
import { SidePanelExample } from './_story-assets/SidePanelExample.js';
import mdx from './StepFlow.mdx';
import '../Tearsheet/tearsheet-story.css';
import './step-flow-story.css';

export default {
  title: 'Utilities/StepFlow',
  component: StepGroup,
  tags: ['carbon'],
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof StepGroup>;

export const Default: StoryFn = () => {
  const [open, setOpen] = useState(false);
  const launcherButtonRef = useRef<HTMLButtonElement>(null);
  return (
    <StepProvider>
      <Button
        onClick={() => setOpen(true)}
        ref={launcherButtonRef}
        aria-haspopup="dialog">
        Open
      </Button>
      <TearsheetWithSteps
        open={open}
        setOpen={setOpen}
        launcherButtonRef={launcherButtonRef}
      />
    </StepProvider>
  );
};

export const SidePanel: StoryFn = () => <SidePanelExample />;
