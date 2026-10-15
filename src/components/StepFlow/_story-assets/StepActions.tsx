/**
 * Copyright IBM Corp. 2025, 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2025, 2025
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: the step flow and its StepContextType from @afframe/ui, the unused className prop dropped. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ReactNode } from 'react';
import { useStepContext } from '../../../index.js';
import type { StepContextType } from '../../../index.js';

export interface StepActionsProps {
  buttonRenderer: (stepData: StepContextType) => ReactNode;
}

/**
 * This is an alternative approach to creating your own component and using the `useStepContext` hook.
 * @example <StepActions buttonRenderer={(stepData) => <><Button /><Button /><Button /></>}/>
 *
 * In the example above, you can see how to retrieve the step data in order to update your buttons
 * (disabled states, changing text, ie Next to Submit, etc.).
 */
export const StepActions = ({ buttonRenderer }: StepActionsProps) => {
  const data = useStepContext();
  return buttonRenderer(data);
};

StepActions.displayName = 'StepActions';
