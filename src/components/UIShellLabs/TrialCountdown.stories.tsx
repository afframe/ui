/**
 * Copyright IBM Corp. 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2025
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, Labs UI shell components, Carbon components and icons from @afframe/ui (styles ship in the package CSS, so the ui-shell.scss import is dropped), title under Components/UI Shell/Labs, source tag. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ComponentProps } from 'react';
import type { Meta, StoryFn } from '@storybook/react-vite';
import { Share, ShoppingCart, User } from '../../icons.js';
import {
  Button,
  Header,
  HeaderPopover,
  HeaderPopoverButton,
  HeaderPopoverContent,
  Link,
  TrialCountdown,
} from '../../index.js';
import mdx from './TrialCountdown.mdx';

export default {
  title: 'Components/UI Shell/Labs/TrialCountdown',
  component: TrialCountdown,
  tags: ['labs'],
  parameters: {
    docs: {
      page: mdx,
    },
  },
} satisfies Meta<typeof TrialCountdown>;

/**
 * Story for TrialCountdown
 * @param {object} args Storybook args that control component props
 * @returns {React.ReactElement} The JSX for the story
 */
export const Default: StoryFn = (args) => (
  <Header aria-label="IBM Platform Name">
    <HeaderPopover align="bottom">
      <HeaderPopoverButton label="Trial Countdown" as={Button} kind="ghost">
        <TrialCountdown {...(args as ComponentProps<typeof TrialCountdown>)} />
      </HeaderPopoverButton>
      <HeaderPopoverContent>
        <p>Your trial ends on May 13, 2025</p>
        <Link href="#" renderIcon={Share}>
          Invite team members
        </Link>
        <Link href="#" renderIcon={User}>
          Contact sales
        </Link>
        <Button size="sm" renderIcon={ShoppingCart}>
          Buy
        </Button>
      </HeaderPopoverContent>
    </HeaderPopover>
  </Header>
);

Default.args = {
  count: 30,
  text: 'Trial days left',
  warning: false,
};

Default.argTypes = {
  isSideNavExpanded: { table: { disable: true } },
  isSwitcherExpanded: { table: { disable: true } },
  render: { table: { disable: true } },
};
