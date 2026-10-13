'use client';

import {
  ScrollGradient as CanaryScrollGradient,
  pkg,
} from '@carbon/ibm-products';

// IBM renders a placeholder for a canary component until its setting is on.
// Module scope, beside the export: the setting runs whenever the component is
// imported, with or without AfframeProvider. A local binding, not a re-export,
// so bundlers cannot skip this module through `sideEffects`.
pkg._silenceWarnings(true);
pkg.component.ScrollGradient = true;
pkg._silenceWarnings(false);

export const ScrollGradient = CanaryScrollGradient;
