/**
 * Copyright IBM Corp. 2016, 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2016, 2023
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: a TypeScript copy of the Labs UI shell's internal useMatchMedia hook for the stories (the package does not export it), comments shortened, an eslint-disable comment for a plugin this repo does not use removed. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useCallback, useSyncExternalStore } from 'react';

// Whether the media query matches; false during server rendering.
export function useMatchMedia(mediaQueryString: string): boolean {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const mediaQueryList = window.matchMedia(mediaQueryString);
      mediaQueryList.addEventListener('change', onStoreChange);
      return () => mediaQueryList.removeEventListener('change', onStoreChange);
    },
    [mediaQueryString]
  );

  const getSnapshot = () => window.matchMedia(mediaQueryString).matches;
  const getServerSnapshot = () => false;

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
