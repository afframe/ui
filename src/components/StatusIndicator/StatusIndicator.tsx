import {
  preview__IconIndicator as IconIndicator,
  preview__ShapeIndicator as ShapeIndicator,
  Tag,
} from '@carbon/react';
import type { ComponentPropsWithoutRef, Ref } from 'react';
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
  /** Lands on the root: the Afframe `div` around Carbon's indicator, or the `Tag`. */
  className?: string;
  /** Lands on the root: the Afframe `div` around Carbon's indicator, or the `Tag`. */
  ref?: Ref<HTMLDivElement>;
}

// Carbon's `Tag` reads `title` as its deprecated close-button label and never
// sets it on the root, so it is left out.
type StatusIndicatorRootProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'children' | 'title'
>;

/**
 * Other `div` props (`id`, `data-*`, `aria-*`, handlers) land on the root, as
 * `className` and `ref` do.
 */
export type StatusIndicatorProps = StatusIndicatorCommonProps &
  StatusIndicatorRootProps &
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
 * The root is an Afframe `div` around Carbon's indicator, or the `Tag` with
 * `appearance="tag"`; `className`, `ref` and other props land on it.
 * Server-safe: no directive, no hooks.
 */
export function StatusIndicator(props: StatusIndicatorProps) {
  const {
    appearance = 'indicator',
    compact = false,
    messages,
    label: labelProp,
    className: classNameProp,
    ref,
    variant = 'icon',
    kind,
    size,
    textSize,
    ...rest
  } = props;
  const text = resolveMessages(defaultStatusIndicatorMessages, messages);
  const label = labelProp ?? text.kindLabel(variant, kind);
  const className = ['afframe-status-indicator', classNameProp]
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
    // Carbon types `id` and `ref` without `undefined`. `as="div"` keeps the
    // root a div: Carbon's `Tag` turns into a `button` when given `onClick`.
    const { id, ...tagRest } = rest;
    return (
      <Tag
        as="div"
        {...tagRest}
        {...(id === undefined ? {} : { id })}
        {...(ref === undefined ? {} : { ref })}
        className={`${className} afframe-status-indicator-tag`}
        type={type}>
        <span className="afframe-status-indicator-tag-content">
          {glyph}
          {label}
        </span>
      </Tag>
    );
  }

  // Carbon's indicators drop every prop but `className` and `ref`, so the
  // wrapper is the only root that can take the rest.
  return (
    <div ref={ref} {...rest} className={className}>
      {props.variant === 'shape' ? (
        <ShapeIndicator
          kind={props.kind}
          label={label}
          compact={compact}
          {...(textSize === undefined ? {} : { textSize })}
        />
      ) : (
        <IconIndicator
          kind={props.kind}
          label={label}
          compact={compact}
          {...(size === undefined ? {} : { size })}
        />
      )}
    </div>
  );
}
