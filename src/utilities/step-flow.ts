'use client';
// @carbon/utilities-react marks none of its modules 'use client', and the step
// flow is React context, so this module does it for a server component.
export {
  StepProvider,
  StepGroup,
  useStepContext,
  type StepContextType,
} from '@carbon/utilities-react';
