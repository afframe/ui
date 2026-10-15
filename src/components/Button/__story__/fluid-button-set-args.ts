/**
 * Copyright IBM Corp. 2024, 2024
 *
 * This source code is licensed under the Apache-2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * SPDX-FileCopyrightText: Copyright IBM Corp. 2024, 2024
 * SPDX-License-Identifier: Apache-2.0
 *
 * Modified by Afframe in 2026: TypeScript, example labels from the Afframe glossary. Apache-2.0 text: LICENSES/Apache-2.0.txt.
 */

import type { ButtonProps } from '../../../index.js';

export interface FluidButton {
  label: string;
  kind: NonNullable<ButtonProps<'button'>['kind']>;
  key: number;
}

const btn = (
  label: string,
  kind: FluidButton['kind'],
  key: number
): FluidButton => {
  return {
    label,
    kind,
    key,
  };
};

const primary = btn('Save', 'primary', 1);
const danger = btn('Delete invoice', 'danger', 2);
const secondary = btn('Cancel', 'secondary', 3);
// Upstream passes 'secondary 2', which is not a ButtonKind.
const secondary2 = btn(
  'Save as draft',
  'secondary 2' as FluidButton['kind'],
  4
);
const tertiary = btn('Send invoice', 'tertiary', 5);
const dangerGhost = btn('Discard draft', 'danger--ghost', 6);
const ghost = btn('Back', 'ghost', 7);

const fluidButtonSets = [
  { label: 'None', mapping: [] },
  { label: 'One button', mapping: [primary] },
  { label: 'A danger button', mapping: [danger] },
  { label: 'A ghost button', mapping: [ghost] },
  { label: 'Two buttons', mapping: [secondary, primary] },
  { label: 'Two buttons with one ghost', mapping: [ghost, primary] },
  { label: 'Three buttons', mapping: [secondary, secondary2, primary] },
  {
    label: 'Three buttons with one ghost',
    mapping: [ghost, secondary, primary],
  },
  {
    label: 'Three buttons with one danger',
    mapping: [ghost, secondary, danger],
  },
  {
    label: 'Four buttons',
    mapping: [tertiary, secondary, secondary2, primary],
  },
  {
    label: 'Four buttons with one ghost',
    mapping: [ghost, secondary, secondary2, primary],
  },
  {
    label: 'Four buttons with danger ghost',
    mapping: [dangerGhost, secondary, secondary2, danger],
  },
];

export const fluidButtonOptions = fluidButtonSets.map((_, i) => i);

export const fluidButtonLabels = fluidButtonSets.reduce<Record<number, string>>(
  (acc, val, i) => {
    acc[i] = val.label;
    return acc;
  },
  {}
);

export const fluidButtonMapping = fluidButtonSets.reduce<
  Record<number, FluidButton[]>
>((acc, val, i) => {
  acc[i] = val.mapping;
  return acc;
}, {});
