/**
 * Copyright IBM Corp. 2024, 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2024, 2025
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: SelectableTag from @afframe/ui, Checkmark from the icons entry, literal c4p prefix, plain CSS file, class string written inline, prop types and template comments removed, disable button type declared here. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { forwardRef, useEffect, type HTMLAttributes } from 'react';
import { Checkmark } from '../../../../icons.js';
import { SelectableTag } from '../../../../index.js';
import './interstitial-screen-view-module.css';

const blockClass = 'c4p--interstitial-screen-view-module';
const componentName = 'InterstitialScreenViewModule';

type DisableButtonConfig = {
  skip?: boolean;
  back?: boolean;
  next?: boolean;
  start?: boolean;
};

export interface InterstitialScreenViewModuleProps extends Omit<
  HTMLAttributes<HTMLElement>,
  'title'
> {
  /**
   * Provide an optional class to be applied to the containing node.
   */
  className?: string;
  /**
   * The description of this component.
   */
  description: string;
  /**
   * Passed through to the section element, as in the upstream story.
   */
  size?: string;
  /**
   * The title of this component.
   */
  title: string;
  /**
   *
   * @param value This is callback to disable any action button dynamically
   * @returns void
   */
  disableActionButton?: ((value: DisableButtonConfig) => void) | null;
}

/**
 * View module to help in building interstitial screen views.
 */
export const InterstitialScreenViewModule = forwardRef<
  HTMLElement,
  InterstitialScreenViewModuleProps
>(({ className, title, description, disableActionButton, ...rest }, ref) => {
  useEffect(() => {
    disableActionButton?.({
      start: true,
    });
  }, []);

  const handleOnChange = (selected: boolean) => {
    disableActionButton?.({ start: !selected });
  };
  return (
    <section
      {
        // Pass through any other property values as HTML attributes.
        ...rest
      }
      className={className ? `${blockClass} ${className}` : blockClass}
      ref={ref}>
      <h1 className={`${blockClass}--heading`}>{title}</h1>
      <p className={`${blockClass}--body`}>{description}</p>

      {disableActionButton && (
        <SelectableTag
          renderIcon={Checkmark}
          text="Enable Get Started"
          className={`${blockClass}--enableTag`}
          onChange={handleOnChange}
        />
      )}
    </section>
  );
});

InterstitialScreenViewModule.displayName = componentName;
