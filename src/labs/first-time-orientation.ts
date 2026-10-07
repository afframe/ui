'use client';
// @carbon-labs/react-first-time-orientation exports; see the Labs note in src/index.ts.
// The package has no entry point yet, so the module is imported by path. It
// keeps its es/index.js import, so only the types come from the deep paths.
import {
  WelcomeInterstitial as WelcomeInterstitialValue,
  PersonalizationInterstitial as PersonalizationInterstitialValue,
} from '@carbon-labs/react-first-time-orientation/es/index.js';
import type { WelcomeInterstitial as WelcomeInterstitialType } from '@carbon-labs/react-first-time-orientation/es/components/WelcomeInterstitial.js';
import type { PersonalizationInterstitial as PersonalizationInterstitialType } from '@carbon-labs/react-first-time-orientation/es/components/PersonalizationInterstitial.js';

export const WelcomeInterstitial: typeof WelcomeInterstitialType =
  WelcomeInterstitialValue;
export const PersonalizationInterstitial: typeof PersonalizationInterstitialType =
  PersonalizationInterstitialValue;
