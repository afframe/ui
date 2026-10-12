'use client';
// Shared by the OverflowMenu and TableToolbarMenu wrappers. Internal.
import {
  FeatureFlags,
  MenuItem,
  MenuItemDivider,
  MenuItemGroup,
  MenuItemRadioGroup,
  MenuItemSelectable,
} from '@carbon/react';
import {
  Children,
  Fragment,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';

const menuParts: unknown[] = [
  MenuItem,
  MenuItemDivider,
  MenuItemGroup,
  MenuItemRadioGroup,
  MenuItemSelectable,
];

const isMenuPart = (node: ReactNode) =>
  isValidElement(node) && menuParts.includes(node.type);

function hasMenuItems(children: ReactNode): boolean {
  return Children.toArray(children).some(
    (child) =>
      isMenuPart(child) ||
      (isValidElement<{ children?: ReactNode }>(child) &&
        child.type === Fragment &&
        Children.toArray(child.props.children).some(isMenuPart))
  );
}

/**
 * Renders `menu` with `enable-v12-overflowmenu` on when the caller uses the
 * 1.0.1 shape: a `label` or `menuAlignment` prop, or MenuItem children placed
 * directly or in one Fragment.
 */
// That shape only works in Carbon's newer menu, which v12 makes the default.
// The flag is scoped to this one menu: the v12 look is gated on
// enable-v12-release, not on this flag. `menuAlignment` counts because the v11
// menu passes it on to the DOM.
export function withMenuShape(
  props: { children?: ReactNode; label?: unknown; menuAlignment?: unknown },
  menu: ReactElement
): ReactElement {
  const newer =
    props.label !== undefined ||
    props.menuAlignment !== undefined ||
    hasMenuItems(props.children);
  if (!newer) return menu;
  return <FeatureFlags enableV12Overflowmenu>{menu}</FeatureFlags>;
}
