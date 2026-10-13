'use client';

import {
  previewCandidate__Decorator as CanaryDecorator,
  pkg,
} from '@carbon/ibm-products';

// Same as scroll-gradient.ts: the canary setting runs where the component is
// imported, and the local binding keeps bundlers from skipping this module.
pkg._silenceWarnings(true);
pkg.component.Decorator = true;
pkg._silenceWarnings(false);

export const previewCandidate__Decorator = CanaryDecorator;
