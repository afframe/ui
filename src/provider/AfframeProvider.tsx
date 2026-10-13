'use client';

import { FeatureFlags, GlobalTheme } from '@carbon/react';
import type { ReactNode } from 'react';
import { useCarbonTheme } from '../theme/use-afframe-theme.js';

export interface AfframeProviderProps {
  /** The app, or the part of it that uses Afframe UI components. */
  children?: ReactNode;
}

/**
 * Turns on the Carbon feature flags in React (docs/feature-flags.md) and keeps
 * Carbon's `GlobalTheme` in step with `data-afframe-theme`, so `useTheme()`
 * reports `white` or `g100`.
 */
export function AfframeProvider({ children }: AfframeProviderProps) {
  // GlobalTheme clones its child with its own ref, so its child is ours, not
  // the app's.
  return (
    <GlobalTheme theme={useCarbonTheme()}>
      <FeatureFlags
        enableDialogElement
        enableFocusWrapWithoutSentinels
        enablePresence
        enableEnhancedFileUploader
        enableTreeviewControllable>
        {children}
      </FeatureFlags>
    </GlobalTheme>
  );
}
