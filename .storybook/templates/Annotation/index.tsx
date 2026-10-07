/**
 * Copyright IBM Corp. 2023
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2023
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, icons from @afframe/ui/icons, no classnames or PropTypes, plain CSS, only the background and layer types. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ReactNode } from 'react';
import { Layers } from '../../../src/icons.js';
import './Annotation.css';

const prefix = 'carbon-storybook-template';

const types = {
  background: { icon: Layers },
  layer: { icon: Layers },
};

interface AnnotationProps {
  /** The story to be rendered with this annotation. */
  children?: ReactNode;
  /** Additional css class names. */
  className?: string;
  /** The annotation. */
  text?: ReactNode;
  /** The kind of annotation. */
  type: keyof typeof types;
}

function Annotation({ className, type, text, children }: AnnotationProps) {
  const Icon = types[type].icon;
  const classes = [
    className,
    `${prefix}--annotation`,
    `${prefix}--annotation--${type}`,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      <div className={`${prefix}--annotation__label`}>
        <Icon />
        {text}
      </div>
      <div className={`${prefix}--annotation__content`}>{children}</div>
    </div>
  );
}

export { Annotation };
