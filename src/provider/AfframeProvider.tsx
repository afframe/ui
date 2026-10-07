'use client';

import { pkg } from '@carbon/ibm-products';
import { FeatureFlags } from '@carbon/react';
import type { ReactNode } from 'react';

// Module scope: IBM's canary gate decides at first render, and a settings-only
// module could be dropped by bundlers through `sideEffects`.
pkg._silenceWarnings(true);
pkg.component.ScrollGradient = true;
pkg.component.Decorator = true;
pkg._silenceWarnings(false);

/** Value of the `data-afframe-theme` attribute the consumer sets on `<html>`. */
export type AfframeTheme = 'light' | 'dark' | 'system';

/** Turns on the Carbon v12 feature flags in React (docs/feature-flags.md). */
export function AfframeProvider({ children }: { children?: ReactNode }) {
  return (
    <FeatureFlags
      enableV12Release
      enableDialogElement
      enablePresence
      enableEnhancedFileUploader
      enableTreeviewControllable>
      {children}
    </FeatureFlags>
  );
}
