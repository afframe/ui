'use client';
import {
  OverflowMenu as CarbonOverflowMenu,
  type OverflowMenuProps as CarbonOverflowMenuProps,
} from '@carbon/react';
import { forwardRef } from 'react';
import { usesNewerMenu, withMenuShape } from '../MenuParts/menuShape.js';

export type OverflowMenuProps = CarbonOverflowMenuProps & {
  /** Names the trigger and the menu. Given, the menu renders as Carbon's newer menu. */
  label?: string;
  /** Where the newer menu opens; the v11 menu ignores it. */
  menuAlignment?: 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end';
};

/**
 * Carbon's `OverflowMenu`; `label` or MenuItem children switch on its newer
 * menu.
 */
export const OverflowMenu = forwardRef<HTMLDivElement, OverflowMenuProps>(
  function OverflowMenu(props, ref) {
    const newer = usesNewerMenu(props);
    // The v11 menu would pass menuAlignment on to the DOM.
    const v11Props = { ...props };
    delete v11Props.menuAlignment;
    return withMenuShape(
      newer,
      <CarbonOverflowMenu {...(newer ? props : v11Props)} ref={ref} />
    );
  }
);
OverflowMenu.displayName = 'OverflowMenu';
