/**
 * Copyright IBM Corp. 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2025
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: Carbon's internal useDocumentLang, taken out of the NumberInput and DatePicker stories into one shared module, TypeScript. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { useSyncExternalStore } from 'react';

// Carbon does not export this hook. Stories of locale-dependent components
// read the same language Carbon reads, so they follow `<html lang>` too.
function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['lang'],
  });
  return () => observer.disconnect();
}

/** The `<html>` lang, else the browser language; updates when lang changes. */
export function useDocumentLang() {
  return useSyncExternalStore(
    subscribe,
    () => document.documentElement.lang || window.navigator.language || ''
  );
}
