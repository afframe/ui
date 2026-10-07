/**
 * Copyright IBM Corp. 2024, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2024, 2024
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, components and icons from @afframe/ui, propTypes dropped, margin as a logical inline style. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ReactNode } from 'react';
import { UserAvatar } from '../../../icons.js';
import {
  Header,
  HeaderContainer,
  HeaderGlobalAction,
  HeaderGlobalBar,
  HeaderMenuButton,
  HeaderMenuItem,
  HeaderName,
  HeaderSideNavItems,
  SideNav,
  SideNavItems,
  SkipToContent,
  Theme,
} from '../../../index.js';

export const UiShell = ({ children }: { children?: ReactNode }) => {
  return (
    <>
      <Theme theme="g100">
        <HeaderContainer
          render={({ isSideNavExpanded, onClickSideNavExpand }) => (
            <Header aria-label="IBM Product">
              <SkipToContent />
              <HeaderMenuButton
                aria-label={isSideNavExpanded ? 'Close menu' : 'Open menu'}
                onClick={onClickSideNavExpand}
                isCollapsible
                isActive={isSideNavExpanded}
              />
              <HeaderName href="/" prefix="IBM">
                Product
              </HeaderName>
              <SideNav
                aria-label="Side navigation"
                expanded={isSideNavExpanded}
                isPersistent={false}>
                <SideNavItems>
                  <HeaderSideNavItems>
                    {/* You can add more items here if needed */}
                    <HeaderMenuItem href="/repos">Repositories</HeaderMenuItem>
                  </HeaderSideNavItems>
                </SideNavItems>
              </SideNav>
              <HeaderGlobalBar style={{ marginRight: '1rem' }}>
                <HeaderGlobalAction
                  aria-label="User Avatar"
                  tooltipAlignment="end">
                  <UserAvatar size={20} />
                </HeaderGlobalAction>
              </HeaderGlobalBar>
            </Header>
          )}
        />
      </Theme>
      {children}
    </>
  );
};
