import {
  preview__IconIndicator as IconIndicator,
  preview__ShapeIndicator as ShapeIndicator,
  Tag,
} from '@carbon/react';
import { resolveMessages } from '../../messages.js';
import {
  statusTagColors,
  type StatusIndicatorIconKind,
  type StatusIndicatorShapeKind,
  type StatusIndicatorVariant,
} from './kinds.js';

export interface StatusIndicatorMessages {
  /** Visible label (or tooltip and accessible name in compact mode) per kind. */
  kindLabel: (
    variant: StatusIndicatorVariant,
    kind: StatusIndicatorIconKind | StatusIndicatorShapeKind
  ) => string;
}

const iconLabels: Record<StatusIndicatorIconKind, string> = {
  failed: 'Failed',
  'caution-major': 'Major caution',
  'caution-minor': 'Minor caution',
  undefined: 'Undefined',
  succeeded: 'Succeeded',
  normal: 'Normal',
  'in-progress': 'In progress',
  incomplete: 'Incomplete',
  'not-started': 'Not started',
  pending: 'Pending',
  unknown: 'Unknown',
  informative: 'Informative',
};

const shapeLabels: Record<StatusIndicatorShapeKind, string> = {
  failed: 'Failed',
  critical: 'Critical',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  cautious: 'Cautious',
  undefined: 'Undefined',
  stable: 'Stable',
  informative: 'Informative',
  incomplete: 'Incomplete',
  draft: 'Draft',
};

export const defaultStatusIndicatorMessages: StatusIndicatorMessages = {
  kindLabel: (variant, kind) =>
    variant === 'shape'
      ? shapeLabels[kind as StatusIndicatorShapeKind]
      : iconLabels[kind as StatusIndicatorIconKind],
};

interface StatusIndicatorCommonProps {
  /** Visible label. Defaults to `messages.kindLabel(variant, kind)`. */
  label?: string;
  /** Shows only the glyph; the label moves to a tooltip and stays the accessible name. Ignored with `appearance="tag"`. */
  compact?: boolean;
  /** `tag` renders the status as a non-interactive Carbon `Tag`. */
  appearance?: 'indicator' | 'tag';
  messages?: Partial<StatusIndicatorMessages>;
  className?: string;
}

export type StatusIndicatorProps = StatusIndicatorCommonProps &
  (
    | {
        variant?: 'icon';
        kind: StatusIndicatorIconKind;
        /** Glyph size of the icon indicator. */
        size?: 16 | 20;
        textSize?: never;
      }
    | {
        variant: 'shape';
        kind: StatusIndicatorShapeKind;
        /** Label text size of the shape indicator. */
        textSize?: 12 | 14;
        size?: never;
      }
  );

/**
 * One status: Carbon's preview icon or shape indicator, or a Carbon `Tag`.
 * Server-safe: no directive, no hooks.
 */
export function StatusIndicator(props: StatusIndicatorProps) {
  const { appearance = 'indicator', compact = false, messages } = props;
  const text = resolveMessages(defaultStatusIndicatorMessages, messages);
  const variant = props.variant ?? 'icon';
  const label = props.label ?? text.kindLabel(variant, props.kind);
  const className = ['afframe-status-indicator', props.className]
    .filter(Boolean)
    .join(' ');

  if (appearance === 'tag') {
    // The glyph is a child element, not `renderIcon`: a server component
    // cannot pass a function to Carbon's client `Tag`.
    const glyph =
      props.variant === 'shape' ? (
        <ShapeIndicator kind={props.kind} label="" />
      ) : (
        <IconIndicator kind={props.kind} label="" />
      );
    const type =
      props.variant === 'shape'
        ? statusTagColors.shape[props.kind]
        : statusTagColors.icon[props.kind];
    return (
      <Tag className={`${className} afframe-status-indicator-tag`} type={type}>
        <span className="afframe-status-indicator-tag-content">
          {glyph}
          {label}
        </span>
      </Tag>
    );
  }

  if (props.variant === 'shape') {
    return (
      <ShapeIndicator
        className={className}
        kind={props.kind}
        label={label}
        compact={compact}
        {...(props.textSize === undefined ? {} : { textSize: props.textSize })}
      />
    );
  }
  return (
    <IconIndicator
      className={className}
      kind={props.kind}
      label={label}
      compact={compact}
      {...(props.size === undefined ? {} : { size: props.size })}
    />
  );
}
