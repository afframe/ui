/**
 * Copyright IBM Corp. 2024, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2024, 2024
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, Breadcrumb from @afframe/ui instead of the unexported BreadcrumbWithOverflow (no overflow menu), propTypes dropped, invoice crumbs with links to #. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import { Breadcrumb, BreadcrumbItem } from '../../../index.js';

const crumbs = ['Billing', 'Invoices', 'Invoice 2026-001'].map(
  (label, idx) => ({ href: '#', id: `id-${idx}`, label })
);

export const Breadcrumbs = ({ className }: { className?: string }) => {
  return (
    <Breadcrumb {...(className ? { className } : {})} aria-label="Breadcrumbs">
      {crumbs.map(({ id, href, label }) => (
        <BreadcrumbItem key={id} href={href}>
          {label}
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
};
