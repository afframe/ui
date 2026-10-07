'use client';
// Afframe HelpMenu: a header action opening a panel of help links and
// actions. Written for Afframe; the help menu of
// @carbon-labs/wc-global-header was a behaviour reference only.
import { Help, Launch } from '@carbon/icons-react';
import type { CarbonIconType } from '@carbon/icons-react';
import {
  HeaderPanel,
  Switcher,
  SwitcherDivider,
  SwitcherItem,
  usePrefix,
} from '@carbon/react';
import { useId } from 'react';
import type { ComponentType, ReactNode } from 'react';
import { resolveMessages } from '../../messages.js';
import { cloneAction, HeaderAction, useHeaderPanel } from './useHeaderPanel.js';
import type { HeaderPanelActionProps } from './useHeaderPanel.js';

export interface HelpMenuMessages {
  /** Accessible name of the action (and its tooltip). */
  label: string;
  /** Hidden text after an external link's label. */
  opensInNewTab: string;
  /** Accessible name of the list of items. */
  panelLabel: string;
}

export const defaultHelpMenuMessages: HelpMenuMessages = {
  label: 'Help',
  opensInNewTab: '(opens in a new tab)',
  panelLabel: 'Help links',
};

export type HelpMenuItem =
  | {
      type?: 'item';
      id: string;
      label: string;
      /** Secondary text under the label. */
      description?: string;
      /** Makes the item a link. */
      href?: string;
      /** Called on selection; an item without `href` is a button. */
      onSelect?: () => void;
      /** Opens `href` in a new tab. */
      external?: boolean;
      icon?: CarbonIconType;
    }
  | { type: 'divider' };

export interface HelpMenuProps extends HeaderPanelActionProps {
  items: HelpMenuItem[];
  /** Accessible name of the action; default `messages.label`. */
  label?: string;
  messages?: Partial<HelpMenuMessages>;
}

// SwitcherItem passes `as`, `id` and `aria-describedby` on to its element; its
// types do not list them. Same component, so Switcher still clones it.
const Item = SwitcherItem as unknown as ComponentType<{
  as?: 'button';
  type?: 'button';
  id: string;
  href?: string;
  target?: string;
  rel?: string;
  'aria-labelledby': string;
  'aria-describedby'?: string;
  onClick: () => void;
  children: ReactNode;
}>;

export function HelpMenu(props: HelpMenuProps) {
  return props.presentation === 'content' ? (
    <HelpMenuContent {...props} />
  ) : (
    <HelpMenuPanel {...props} />
  );
}

interface ItemsProps {
  items: HelpMenuItem[];
  label: string;
  opensInNewTab: string;
  /** Whether the items are in the tab order. */
  expanded: boolean;
  /** After an item's onSelect; `leaves` when a link takes focus with it. */
  onSelected?: (leaves: boolean) => void;
}

function HelpMenuItems({
  items,
  label,
  opensInNewTab,
  expanded,
  onSelected,
}: ItemsProps) {
  const baseId = useId();
  const prefix = usePrefix();
  return (
    <Switcher aria-label={label} expanded={expanded}>
      {items.map((item, index) => {
        if (item.type === 'divider') {
          return <SwitcherDivider key={`divider-${index}`} />;
        }
        const id = `${baseId}-${item.id}`;
        const external = item.external === true && !!item.href;
        const Icon = item.icon;
        return (
          <Item
            key={item.id}
            id={id}
            aria-labelledby={
              external ? `${id}-label ${id}-new-tab` : `${id}-label`
            }
            {...(item.description === undefined
              ? {}
              : { 'aria-describedby': `${id}-description` })}
            {...(item.href === undefined
              ? { as: 'button', type: 'button' }
              : { href: item.href })}
            {...(external
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
            onClick={() => {
              item.onSelect?.();
              // A link that leaves the page takes focus with it.
              onSelected?.(!!item.href && !external);
            }}>
            {Icon && <Icon size={16} className="afframe-help-menu-icon" />}
            <span className="afframe-help-menu-text">
              <span id={`${id}-label`}>{item.label}</span>
              {item.description !== undefined && (
                <span
                  id={`${id}-description`}
                  className="afframe-help-menu-description">
                  {item.description}
                </span>
              )}
            </span>
            {external && (
              <>
                <Launch size={16} className="afframe-help-menu-icon" />
                <span
                  id={`${id}-new-tab`}
                  className={`${prefix}--visually-hidden`}>
                  {opensInNewTab}
                </span>
              </>
            )}
          </Item>
        );
      })}
    </Switcher>
  );
}

// Body only: the container owns open state, Escape, outside press and focus.
function HelpMenuContent({ items, messages, className }: HelpMenuProps) {
  const text = resolveMessages(defaultHelpMenuMessages, messages);
  return (
    <div className={['afframe-help-menu', className].filter(Boolean).join(' ')}>
      <HelpMenuItems
        items={items}
        label={text.panelLabel}
        opensInNewTab={text.opensInNewTab}
        expanded
      />
    </div>
  );
}

function HelpMenuPanel({
  items,
  label,
  messages,
  className,
  renderAction,
  ...openProps
}: HelpMenuProps) {
  const text = resolveMessages(defaultHelpMenuMessages, messages);
  const prefix = usePrefix();
  const { isOpen, close, panelProps, actionProps } = useHeaderPanel({
    ...openProps,
    initialFocus: (panel) =>
      panel.querySelector<HTMLElement>(`.${prefix}--switcher__item-link`),
  });

  return (
    <>
      {renderAction ? (
        cloneAction(renderAction, actionProps)
      ) : (
        <HeaderAction
          {...actionProps}
          aria-label={label ?? text.label}
          isActive={isOpen}
          tooltipAlignment="end">
          <Help size={20} />
        </HeaderAction>
      )}
      <HeaderPanel
        {...panelProps}
        expanded={isOpen}
        addFocusListeners={false}
        className={['afframe-help-menu', className].filter(Boolean).join(' ')}>
        {/* A wrapper, not Switcher itself: HeaderPanel's own outside-click
            handler runs only for a direct Switcher child. */}
        <div>
          <HelpMenuItems
            items={items}
            label={text.panelLabel}
            opensInNewTab={text.opensInNewTab}
            expanded={isOpen}
            onSelected={(leaves) => close(!leaves)}
          />
        </div>
      </HeaderPanel>
    </>
  );
}
