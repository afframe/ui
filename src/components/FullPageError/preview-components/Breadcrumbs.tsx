/**
 * Copyright IBM Corp. 2024, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2024, 2024
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, Breadcrumb from @afframe/ui instead of the unexported BreadcrumbWithOverflow (no overflow menu), propTypes dropped. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { Breadcrumb, BreadcrumbItem } from '../../../index.js';

const makeCrumbs = (n: number) =>
  Array.from(Array(n)).map((_, idx) => ({
    href: '/#',
    id: `id-${idx}`,
    label: `Link ${idx}`,
  }));

export const Breadcrumbs = ({ className }: { className?: string }) => {
  const breadcrumbs = makeCrumbs(4);

  return (
    <Breadcrumb {...(className ? { className } : {})} aria-label="Breadcrumbs">
      {breadcrumbs.map(({ id, href, label }) => (
        <BreadcrumbItem key={id} href={href}>
          {label}
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
};
