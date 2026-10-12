'use client';
import {
  TableToolbarMenu as CarbonTableToolbarMenu,
  type TableToolbarMenuProps as CarbonTableToolbarMenuProps,
} from '@carbon/react';
import { withMenuShape } from '../MenuParts/menuShape.js';

export type TableToolbarMenuProps = CarbonTableToolbarMenuProps & {
  /** Names the trigger and the menu. Given, the menu renders as Carbon's newer menu. */
  label?: string;
};

/**
 * Carbon's `TableToolbarMenu`; `label`, `menuAlignment` or MenuItem children
 * switch on its newer menu, where each `TableToolbarAction` renders a `MenuItem`.
 */
export function TableToolbarMenu(props: TableToolbarMenuProps) {
  return withMenuShape(props, <CarbonTableToolbarMenu {...props} />);
}
