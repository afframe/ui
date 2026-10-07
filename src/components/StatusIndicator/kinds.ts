import type {
  IconIndicatorProps,
  ShapeIndicatorProps,
  TagProps,
} from '@carbon/react';

// Carbon types `ShapeIndicatorKind` as `string`, and neither kind list is
// exported from the barrel, so the lists live here (copied from
// `@carbon/react` 1.117 IconIndicator and ShapeIndicator) and are checked
// against Carbon's prop types.
export const statusIconKinds = [
  'failed',
  'caution-major',
  'caution-minor',
  'undefined',
  'succeeded',
  'normal',
  'in-progress',
  'incomplete',
  'not-started',
  'pending',
  'unknown',
  'informative',
] as const satisfies readonly IconIndicatorProps['kind'][];

export const statusShapeKinds = [
  'failed',
  'critical',
  'high',
  'medium',
  'low',
  'cautious',
  'undefined',
  'stable',
  'informative',
  'incomplete',
  'draft',
] as const satisfies readonly ShapeIndicatorProps['kind'][];

export type StatusIndicatorIconKind = (typeof statusIconKinds)[number];
export type StatusIndicatorShapeKind = (typeof statusShapeKinds)[number];
export type StatusIndicatorVariant = 'icon' | 'shape';

type TagColor = NonNullable<TagProps<'div'>['type']>;

// Tag colour per kind for `appearance="tag"`. Carbon tags have no orange or
// yellow, so the warning kinds use magenta and warm gray; the glyph, not
// the colour, tells them apart.
export const statusTagColors: {
  icon: Record<StatusIndicatorIconKind, TagColor>;
  shape: Record<StatusIndicatorShapeKind, TagColor>;
} = {
  icon: {
    failed: 'red',
    'caution-major': 'magenta',
    'caution-minor': 'warm-gray',
    undefined: 'purple',
    succeeded: 'green',
    normal: 'green',
    'in-progress': 'blue',
    incomplete: 'blue',
    'not-started': 'gray',
    pending: 'cool-gray',
    unknown: 'gray',
    informative: 'cyan',
  },
  shape: {
    failed: 'red',
    critical: 'red',
    high: 'magenta',
    medium: 'warm-gray',
    low: 'cyan',
    cautious: 'warm-gray',
    undefined: 'purple',
    stable: 'green',
    informative: 'blue',
    incomplete: 'blue',
    draft: 'gray',
  },
};
