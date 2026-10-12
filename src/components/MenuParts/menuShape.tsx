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
 * Whether the caller uses the 1.0.x shape: a `label` prop, or MenuItem children
 * placed directly or in one Fragment.
 */
export function usesNewerMenu(props: {
  children?: ReactNode;
  label?: unknown;
}): boolean {
  return props.label !== undefined || hasMenuItems(props.children);
}

/**
 * Renders `menu` with `enable-v12-overflowmenu` on when `newer` is set. That
 * shape works only in Carbon's newer menu; the flag changes no look, because
 * Carbon gates the v12 look on `enable-v12-release`.
 */
export function withMenuShape(
  newer: boolean,
  menu: ReactElement
): ReactElement {
  if (!newer) return menu;
  return <FeatureFlags enableV12Overflowmenu>{menu}</FeatureFlags>;
}
