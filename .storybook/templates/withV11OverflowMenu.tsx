import type { Decorator } from '@storybook/react-vite';
import { FeatureFlags } from '../../src/index.js';

// v12 flags that FeatureFlags has no named prop for.
const v12FlagsWithoutProps = {
  'enable-v12-structured-list-visible-icons': true,
  'enable-v12-toggle-reduced-label-spacing': true,
};

/**
 * Renders `OverflowMenu` with `OverflowMenuItem` children, including DataTable
 * `TableToolbarAction`, with its v11 behaviour. Under `enable-v12-overflowmenu`
 * the menu only focuses items that register with it, and `OverflowMenuItem`
 * never does, so the items cannot be reached or activated with the keyboard
 * (carbon issue #23260, fixed by PR #23375, not in a stable release yet).
 * `enable-v12-release` forces every v12 flag on, so it is turned off here and
 * the other v12 flags are turned back on.
 */
export const withV11OverflowMenu: Decorator = (Story) => (
  <FeatureFlags
    enableV12Release={false}
    enableV12Overflowmenu={false}
    enableV12TileDefaultIcons
    enableV12TileRadioIcons
    enableV12DynamicFloatingStyles
    enableFocusWrapWithoutSentinels
    flags={v12FlagsWithoutProps}>
    <Story />
  </FeatureFlags>
);
