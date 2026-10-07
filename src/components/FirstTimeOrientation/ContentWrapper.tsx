/**
 * Copyright IBM Corp. 2023, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2023, 2023
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: copied from the package source as a story helper (the package publishes no JavaScript for it), React imports as named imports. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { forwardRef, type PropsWithChildren, type ReactNode } from 'react';

interface ContentWrapperProps extends PropsWithChildren {
  /**
   * Provide the contents of the InterstitialScreenView.
   */
  children?: ReactNode;

  /**
   * Optional class name for this component.
   */
  className?: string;

  /**
   * The label to pass to the ProgressStep component.
   */
  stepTitle: string;

  /**
   * Optional method that takes in a message id and returns an internationalized string.
   */
  translateWithId?: (id: string) => string;
}
/**
 * An Onboarding component intended to be used as the child elements of the InterstitialScreen component.
 */
export const ContentWrapper = forwardRef<HTMLDivElement, ContentWrapperProps>(
  (
    {
      children,
      className,
      stepTitle,
      // Collect any other property values passed in.
      ...rest
    },
    ref
  ) => {
    return (
      <div
        aria-label={stepTitle}
        {
          // Pass through any other property values as HTML attributes.
          ...rest
        }
        className={className}
        ref={ref}>
        {children}
      </div>
    );
  }
);

ContentWrapper.displayName = 'ContentWrapper';
