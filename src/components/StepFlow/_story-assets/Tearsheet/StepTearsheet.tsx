/**
 * Copyright IBM Corp. 2025, 2025
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2025, 2025
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: renders Afframe's Tearsheet (IBM's preview__Tearsheet) in place of IBM's stable Tearsheet, which Afframe does not export: the title in the header content, hasCloseIcon as the header's close button, the influencer in Tearsheet.Influencer, the children in the body's main content, and an actions slot for the footer, because this Tearsheet renders only its own parts as children. Step flow and StepContextType from @afframe/ui. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ReactNode } from 'react';
import { Tearsheet, useStepContext } from '../../../../index.js';
import type { StepContextType } from '../../../../index.js';

interface Props {
  children?: ReactNode;
  actions?: ReactNode;
  influencer?: ((a: StepContextType) => ReactNode) | null;
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  hasCloseIcon?: boolean;
  closeIconDescription?: string;
  selectorPrimaryFocus: string;
}

export const StepTearsheet = ({
  children,
  actions,
  open,
  onClose,
  influencer,
  title,
  hasCloseIcon,
  closeIconDescription = 'Close',
  selectorPrimaryFocus,
}: Props) => {
  const state = useStepContext();
  const influencerContent = influencer?.(state) || null;

  return (
    <Tearsheet
      className="step-tearsheet"
      open={open}
      onClose={onClose}
      selectorPrimaryFocus={selectorPrimaryFocus}>
      <Tearsheet.Header
        hideCloseButton={!hasCloseIcon}
        closeIconDescription={closeIconDescription}>
        <Tearsheet.HeaderContent title={title} />
      </Tearsheet.Header>
      {/* An empty influencer still reserves its column. */}
      {influencerContent && (
        <Tearsheet.Influencer>{influencerContent}</Tearsheet.Influencer>
      )}
      <Tearsheet.Body>
        <Tearsheet.MainContent>{children}</Tearsheet.MainContent>
      </Tearsheet.Body>
      <Tearsheet.Footer>{actions}</Tearsheet.Footer>
    </Tearsheet>
  );
};
