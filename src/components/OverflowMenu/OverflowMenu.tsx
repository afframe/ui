'use client';
import {
  OverflowMenu as CarbonOverflowMenu,
  type OverflowMenuProps as CarbonOverflowMenuProps,
} from '@carbon/react';
import { forwardRef } from 'react';
import { withMenuShape } from '../MenuParts/menuShape.js';

export type OverflowMenuProps = CarbonOverflowMenuProps & {
  /** Names the trigger and the menu. Given, the menu renders as Carbon's newer menu. */
  label?: string;
  /** Where the newer menu opens. Given, the menu renders as Carbon's newer menu. */
  menuAlignment?: 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
};

/**
 * Carbon's `OverflowMenu`; `label`, `menuAlignment` or MenuItem children
 * switch on its newer menu.
 */
export const OverflowMenu = forwardRef<HTMLDivElement, OverflowMenuProps>(
  function OverflowMenu(props, ref) {
    return withMenuShape(props, <CarbonOverflowMenu {...props} ref={ref} />);
  }
);
OverflowMenu.displayName = 'OverflowMenu';
