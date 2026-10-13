'use client';

import { FeatureFlags, GlobalTheme } from '@carbon/react';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useCarbonTheme } from '../theme/use-afframe-theme.js';
import { wrapTabInModalDialog } from './wrapTabInModalDialog.js';

export interface AfframeProviderProps {
  /** The app, or the part of it that uses Afframe UI components. */
  children?: ReactNode;
}

/**
 * Turns on the Carbon feature flags in React (docs/feature-flags.md) and keeps
 * Carbon's `GlobalTheme` in step with `data-afframe-theme`, so `useTheme()`
 * reports `white` or `g100`. Also keeps Tab inside modal dialogs.
 */
export function AfframeProvider({ children }: AfframeProviderProps) {
  useEffect(() => {
    // A listener per provider, not the shared function: addEventListener
    // drops a duplicate, and a nested provider unmounting would remove it.
    // The defaultPrevented guard makes nested providers wrap once.
    const listener = (event: KeyboardEvent) => wrapTabInModalDialog(event);
    document.addEventListener('keydown', listener);
    return () => document.removeEventListener('keydown', listener);
  }, []);
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
