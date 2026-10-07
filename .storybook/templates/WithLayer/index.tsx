/**
 * Copyright IBM Corp. 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2023
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, Layer from @afframe/ui, no PropTypes. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ReactNode } from 'react';
import { Layer } from '../../../src/index.js';
import { Annotation } from '../Annotation/index.js';

interface WithLayerProps {
  /**
   * The component demo to be rendered on all layers.
   * Can be either a node or a function that receives the layer
   * index as a parameter and returns the child for that layer.
   */
  children?: ReactNode | ((layer: 0 | 1 | 2) => ReactNode);
}

function WithLayer({ children }: WithLayerProps) {
  function renderChild(layer: 0 | 1 | 2) {
    return typeof children === 'function' ? children(layer) : children;
  }

  return (
    <Annotation type="background" text="$background">
      {renderChild(0)}
      <Layer withBackground>
        <Annotation type="layer" text="$layer-01">
          {renderChild(1)}
          <Layer withBackground>
            <Annotation type="layer" text="$layer-02">
              {renderChild(2)}
            </Annotation>
          </Layer>
        </Annotation>
      </Layer>
    </Annotation>
  );
}

export { WithLayer };
