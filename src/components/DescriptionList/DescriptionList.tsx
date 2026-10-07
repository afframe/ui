import {
  StructuredListBody,
  StructuredListCell,
  StructuredListRow,
  StructuredListWrapper,
} from '@carbon/react';
import {
  Children,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';
import { resolveMessages } from '../../messages.js';

export interface DescriptionListMessages {
  /** Visually hidden text in place of an empty description. */
  emptyValue: string;
}

export const defaultDescriptionListMessages: DescriptionListMessages = {
  emptyValue: 'No value',
};

export interface DescriptionListItemProps {
  term: ReactNode;
  /** The description. Empty (`null`, `undefined`, `false`, `''`) shows a placeholder. */
  children?: ReactNode;
}

interface DescriptionListBaseProps {
  /** Convenience for `DescriptionListItem` children. */
  items?: { term: ReactNode; description: ReactNode }[];
  children?: ReactNode;
  /** Cell padding and type size, after IBM's set. */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Rule between rows. */
  border?: boolean;
  /** `horizontal` puts the term beside the description, `vertical` above it. */
  orientation?: 'horizontal' | 'vertical';
  messages?: Partial<DescriptionListMessages>;
  className?: string;
}

export type DescriptionListProps = DescriptionListBaseProps &
  (
    | { 'aria-label': string; 'aria-labelledby'?: never }
    | { 'aria-labelledby': string; 'aria-label'?: never }
  );

// Set by DescriptionList on each item: a server component has no context.
interface InternalItemProps extends DescriptionListItemProps {
  emptyValue?: string;
}

function isEmpty(value: ReactNode) {
  return (
    value === null || value === undefined || value === false || value === ''
  );
}

/**
 * One term and its description: a StructuredList row whose term cell is a
 * row header, so a screen reader reads the term with the description.
 */
export function DescriptionListItem(props: DescriptionListItemProps) {
  const {
    term,
    children,
    emptyValue = defaultDescriptionListMessages.emptyValue,
  } = props as InternalItemProps;
  return (
    <StructuredListRow className="afframe-description-list-row">
      <StructuredListCell
        role="rowheader"
        className="afframe-description-list-term">
        {term}
      </StructuredListCell>
      <StructuredListCell className="afframe-description-list-description">
        {isEmpty(children) ? (
          <>
            <span
              aria-hidden="true"
              className="afframe-description-list-empty"
            />
            <span className="afframe-description-list-empty-text">
              {emptyValue}
            </span>
          </>
        ) : (
          children
        )}
      </StructuredListCell>
    </StructuredListRow>
  );
}

/**
 * A key and value list on Carbon's StructuredList. Server-safe: no
 * directive, no hooks.
 */
export function DescriptionList({
  items,
  children,
  size = 'md',
  border = false,
  orientation = 'horizontal',
  messages,
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: DescriptionListProps) {
  const text = resolveMessages(defaultDescriptionListMessages, messages);
  const rows =
    items === undefined
      ? children
      : items.map(({ term, description }, index) => (
          <DescriptionListItem key={index} term={term}>
            {description}
          </DescriptionListItem>
        ));
  const classes = [
    'afframe-description-list',
    `afframe-description-list-${size}`,
    `afframe-description-list-${orientation}`,
    border ? 'afframe-description-list-border' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <StructuredListWrapper
      className={classes}
      // Carbon defaults aria-label to an English string; empty suppresses it.
      aria-label={ariaLabel ?? ''}
      {...(ariaLabelledBy === undefined
        ? {}
        : { 'aria-labelledby': ariaLabelledBy })}>
      <StructuredListBody className="afframe-description-list-body">
        {Children.map(rows, (row) =>
          isValidElement(row) && row.type === DescriptionListItem
            ? cloneElement(row as ReactElement<InternalItemProps>, {
                emptyValue: text.emptyValue,
              })
            : row
        )}
      </StructuredListBody>
    </StructuredListWrapper>
  );
}
