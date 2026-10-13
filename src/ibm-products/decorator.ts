'use client';

import {
  previewCandidate__Decorator as CanaryDecorator,
  pkg,
} from '@carbon/ibm-products';

// Same as scroll-gradient.ts: the export's initializer turns the canary
// setting on, so no bundler can keep one without the other.
function enable() {
  pkg._silenceWarnings(true);
  pkg.component.Decorator = true;
  pkg._silenceWarnings(false);
  return CanaryDecorator;
}

export const previewCandidate__Decorator = enable();
