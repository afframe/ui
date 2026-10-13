'use client';

import {
  ScrollGradient as CanaryScrollGradient,
  pkg,
} from '@carbon/ibm-products';

// IBM renders a placeholder for a canary component until its setting is on.
// The export's own initializer turns it on, so a bundler that keeps the export
// keeps the setting, whether it skips whole modules or single statements.
function enable() {
  pkg._silenceWarnings(true);
  pkg.component.ScrollGradient = true;
  pkg._silenceWarnings(false);
  return CanaryScrollGradient;
}

export const ScrollGradient = enable();
