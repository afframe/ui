'use client';
import { OperationalTag, Tooltip } from '@carbon/react';
import {
  useId,
  type ButtonHTMLAttributes,
  type ComponentType,
  type ReactNode,
  type Ref,
} from 'react';
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

// `type` is the tag colour on OperationalTag, and Carbon's Tooltip takes the
// child's `aria-describedby` in place of its own, which would drop the tooltip.
type AccentTagButtonAttributes = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  | 'onClick'
  | 'children'
  | 'className'
  | 'type'
  | 'disabled'
  | 'id'
  | 'aria-describedby'
>;

export interface AccentTagProps extends AccentTagButtonAttributes {
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
  /** The tag button; also used in `aria-labelledby` when the accent is announced. */
  id?: string;
  ref?: Ref<HTMLButtonElement>;
}

const noop = () => {};

/**
 * A clickable Carbon OperationalTag with a tooltip and a coloured strip on
 * its inline-start edge. Always a button, so the tooltip is keyboard
 * reachable. `className`, `ref` and other attributes go to the tag button,
 * as on Carbon's IconButton; the root is Carbon's Tooltip wrapper.
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
  id,
  ...rest
}: AccentTagProps) {
  const strings = resolveMessages(defaultAccentTagMessages, messages);
  const generatedId = useId();
  const tagId = id ?? `${generatedId}-tag`;
  const accentId = `${generatedId}-accent`;
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
          {...rest}
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
