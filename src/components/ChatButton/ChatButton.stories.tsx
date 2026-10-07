/**
 * Copyright IBM Corp. 2022
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2022
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components from @afframe/ui (preview__ChatButton), icons from @afframe/ui icons, story styles converted from SCSS to plain CSS, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { Meta, StoryFn } from '@storybook/react-vite';
import { Add } from '../../icons.js';
import {
  preview__ChatButton as ChatButton,
  preview__ChatButtonSkeleton as ChatButtonSkeleton,
} from '../../index.js';
import './chat-button-story.css';

export default {
  title: 'Preview/preview__ChatButton',
  component: ChatButton,
  tags: ['carbon'],
  parameters: {},
} satisfies Meta<typeof ChatButton>;

export const Default: StoryFn<typeof ChatButton> = () => (
  <div className="test-button">
    <div className="test-button-sizes">
      <h3>Sizes</h3>
      <br />
      <ChatButton size="sm" renderIcon={Add}>
        Primary
      </ChatButton>
      <ChatButton size="md" renderIcon={Add}>
        Primary
      </ChatButton>
      <ChatButton size="lg" renderIcon={Add}>
        Primary
      </ChatButton>
      <br />
      <br />
      <ChatButton size="sm">Primary</ChatButton>
      <ChatButton size="md">Primary</ChatButton>
      <ChatButton size="lg">Primary</ChatButton>
    </div>
    <div className="test-button-kinds">
      <h3>Kinds</h3>
      <br />
      <ChatButton kind="primary" renderIcon={Add}>
        Primary
      </ChatButton>
      <ChatButton kind="secondary" renderIcon={Add}>
        Secondary
      </ChatButton>
      <ChatButton kind="tertiary" renderIcon={Add}>
        Tertiary
      </ChatButton>
      <ChatButton kind="ghost" renderIcon={Add}>
        Ghost
      </ChatButton>
      <ChatButton kind="danger" renderIcon={Add}>
        Danger
      </ChatButton>
      <br />
      <br />
      <ChatButton kind="primary">Primary</ChatButton>
      <ChatButton kind="secondary">Secondary</ChatButton>
      <ChatButton kind="tertiary">Tertiary</ChatButton>
      <ChatButton kind="ghost">Ghost</ChatButton>
      <ChatButton kind="danger">Danger</ChatButton>
    </div>
    <div className="test-button-quick-action">
      <h3>Quick action</h3>
      <br />
      <ChatButton isQuickAction renderIcon={Add}>
        Quick action
      </ChatButton>
      <ChatButton isSelected isQuickAction renderIcon={Add}>
        Selected and Enabled
      </ChatButton>
      <ChatButton disabled isSelected isQuickAction renderIcon={Add}>
        Selected and Disabled
      </ChatButton>
      <ChatButton disabled isQuickAction renderIcon={Add}>
        Disabled
      </ChatButton>
      <br />
      <br />
      <ChatButton isQuickAction>Quick action</ChatButton>
      <ChatButton isSelected isQuickAction>
        Selected and Enabled
      </ChatButton>
      <ChatButton disabled isSelected isQuickAction>
        Selected and Disabled
      </ChatButton>
      <ChatButton disabled isQuickAction>
        Disabled
      </ChatButton>
    </div>

    <div className="test-button-skeleton">
      <h3>Skeleton</h3>
      <br />
      <ChatButtonSkeleton size="sm" />
      <ChatButtonSkeleton size="md" />
      <ChatButtonSkeleton />
    </div>
  </div>
);
