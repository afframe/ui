'use client';
import { OperationalTag, Tooltip } from '@carbon/react';
import { useId, type ComponentType, type ReactNode } from 'react';
import { resolveMessages } from '../../messages.js';

/** Carbon's tag colours. */
export type AccentTagColor =
  | 'red'
  | 'magenta'
  | 'purple'
  | 'blue'
  | 'cyan'
  | 'teal'
  | 'green'
  | 'gray'
  | 'cool-gray'
  | 'warm-gray';

export interface AccentTagMessages {
  /** Accent text added to the accessible name when `announceAccent` is set. */
  accentLabel: (color: AccentTagColor) => string;
}

const colorNames: Record<AccentTagColor, string> = {
  red: 'Red',
  magenta: 'Magenta',
  purple: 'Purple',
  blue: 'Blue',
  cyan: 'Cyan',
  teal: 'Teal',
  green: 'Green',
  gray: 'Gray',
  'cool-gray': 'Cool gray',
  'warm-gray': 'Warm gray',
};

export const defaultAccentTagMessages: AccentTagMessages = {
  accentLabel: (color) => `${colorNames[color]} accent`,
};

export interface AccentTagProps {
  text: string;
  /** Colour of the start-edge strip. */
  accent: AccentTagColor;
  /** Tooltip content, shown on hover and keyboard focus. No interactive content. */
  tooltip: ReactNode;
  onClick?: () => void;
  /** `md` (24 px) or `lg` (32 px). Carbon's `sm` is under the 24 px target, so it is not offered. */
  size?: 'md' | 'lg';
  disabled?: boolean;
  renderIcon?: ComponentType | object;
  /** Text for what the accent means, added to the accessible name. */
  accentLabel?: string;
  /** Adds `messages.accentLabel(accent)` to the name when `accentLabel` is not set. */
  announceAccent?: boolean;
  messages?: Partial<AccentTagMessages>;
  className?: string;
}

const noop = () => {};

/**
 * A clickable Carbon OperationalTag with a tooltip and a coloured strip on
 * its inline-start edge. Always a button, so the tooltip is keyboard
 * reachable.
 */
export function AccentTag({
  text,
  accent,
  tooltip,
  onClick = noop,
  size = 'md',
  disabled = false,
  renderIcon,
  accentLabel,
  announceAccent = false,
  messages,
  className,
}: AccentTagProps) {
  const strings = resolveMessages(defaultAccentTagMessages, messages);
  const id = useId();
  const tagId = `${id}-tag`;
  const accentId = `${id}-accent`;
  const accentText =
    accentLabel ?? (announceAccent ? strings.accentLabel(accent) : undefined);
  const classes = [
    'afframe-accent-tag',
    `afframe-accent-tag-${accent}`,
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <>
      <Tooltip description={tooltip} align="bottom-start">
        <OperationalTag
          id={tagId}
          text={text}
          type="gray"
          size={size}
          disabled={disabled}
          onClick={onClick}
          className={classes}
          {...(renderIcon === undefined ? {} : { renderIcon })}
          {...(accentText === undefined
            ? {}
            : { 'aria-labelledby': `${tagId} ${accentId}` })}
        />
      </Tooltip>
      {accentText === undefined ? null : (
        <span id={accentId} hidden>
          {accentText}
        </span>
      )}
    </>
  );
}
