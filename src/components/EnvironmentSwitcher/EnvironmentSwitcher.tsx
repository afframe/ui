'use client';
// Afframe EnvironmentSwitcher: a header action naming the current environment
// and a panel to switch it. Written for Afframe; the environment switcher of
// @carbon-labs/wc-global-header was a behaviour reference only.
import { ArrowsHorizontal } from '@carbon/icons-react';
import {
  HeaderPanel,
  RadioButton,
  RadioButtonGroup,
  Tag,
  usePrefix,
} from '@carbon/react';
import { useId, useRef, useState } from 'react';
import type { FocusEvent, KeyboardEvent, MouseEvent } from 'react';
import { resolveMessages } from '../../messages.js';
import {
  cloneAction,
  HeaderAction,
  useHeaderPanel,
} from '../HelpMenu/useHeaderPanel.js';
import type { HeaderPanelActionProps } from '../HelpMenu/useHeaderPanel.js';

export interface EnvironmentSwitcherMessages {
  /** Accessible name of the panel. */
  label: string;
  /** Legend of the list of environments. */
  panelHeading: string;
  /** Accessible name of the action and its tooltip. */
  currentEnvironment: (label: string) => string;
  /** Tag text on a production environment. */
  productionTag: string;
  /** Announced after a switch. */
  switched: (label: string) => string;
}

export const defaultEnvironmentSwitcherMessages: EnvironmentSwitcherMessages = {
  label: 'Switch environment',
  panelHeading: 'Environments',
  currentEnvironment: (label) => `Environment: ${label}`,
  productionTag: 'Production',
  switched: (label) => `Switched to ${label}`,
};

export interface EnvironmentOption {
  id: string;
  label: string;
  description?: string;
  /** Marks the environment with a red production tag. */
  production?: boolean;
}

export interface EnvironmentSwitcherProps extends HeaderPanelActionProps {
  environments: EnvironmentOption[];
  /** Id of the current environment; the app owns it. */
  value: string;
  /** Called once with the chosen id when the user switches. */
  onChange: (id: string) => void;
  /** Accessible name of the action; default `messages.currentEnvironment(current label)`. */
  label?: string;
  /** The panel opens but no environment can be chosen. */
  disabled?: boolean;
  messages?: Partial<EnvironmentSwitcherMessages>;
}

export function EnvironmentSwitcher(props: EnvironmentSwitcherProps) {
  return props.presentation === 'content' ? (
    <EnvironmentSwitcherContent {...props} />
  ) : (
    <EnvironmentSwitcherPanel {...props} />
  );
}

/** Switches to `id` (if it is not the current one) and announces it. */
function useSwitch({
  environments,
  value,
  onChange,
  disabled,
  switched,
}: Pick<EnvironmentSwitcherProps, 'environments' | 'value' | 'onChange'> & {
  disabled: boolean;
  switched: (label: string) => string;
}) {
  const [announcement, setAnnouncement] = useState('');
  const switchTo = (id: string) => {
    if (disabled || id === value) return;
    onChange(id);
    const chosen = environments.find((environment) => environment.id === id);
    setAnnouncement(switched(chosen?.label ?? id));
  };
  return { announcement, switchTo };
}

interface BodyProps {
  environments: EnvironmentOption[];
  heading: string;
  productionTag: string;
  disabled: boolean;
  /** The checked radio. */
  selected: string;
  /** An arrow key moved the selection. */
  onMove: (id: string) => void;
  /** Enter, Space or a click on a radio. */
  onCommit: (id: string) => void;
  onBlur?: (event: FocusEvent<HTMLDivElement>) => void;
}

// Arrows only move the selection; Enter, Space or a click commits.
function EnvironmentList({
  environments,
  heading,
  productionTag,
  disabled,
  selected,
  onMove,
  onCommit,
  onBlur,
}: BodyProps) {
  const name = useId();
  // Set by an arrow key: the click the browser then fires only moves the draft.
  const arrowMove = useRef(false);
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLInputElement;
    if (target.type !== 'radio') return;
    arrowMove.current = event.key.startsWith('Arrow');
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onCommit(target.value);
    }
  };
  const onClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLInputElement;
    if (target.type !== 'radio') return;
    // Arrow keys also fire a click on the newly checked radio: skip those.
    // Pointer, script and screen reader activation (no pointerdown) commit.
    if (arrowMove.current) arrowMove.current = false;
    else onCommit(target.value);
  };

  return (
    // Events bubble from the radios; the radios stay native.
    <div
      className="afframe-environment-switcher-body"
      onPointerDown={() => {
        arrowMove.current = false;
      }}
      onKeyDown={onKeyDown}
      onClick={onClick}
      onBlur={onBlur}>
      <RadioButtonGroup
        name={name}
        legendText={heading}
        orientation="vertical"
        disabled={disabled}
        valueSelected={selected}
        onChange={(id) => onMove(String(id))}>
        {environments.map((environment) => (
          <RadioButton
            key={environment.id}
            id={`${name}-${environment.id}`}
            value={environment.id}
            labelText={
              <span className="afframe-environment-switcher-option">
                <span>
                  {environment.label}
                  {environment.production && (
                    <Tag
                      type="red"
                      size="sm"
                      className="afframe-environment-switcher-tag">
                      {productionTag}
                    </Tag>
                  )}
                </span>
                {environment.description !== undefined && (
                  <span className="afframe-environment-switcher-description">
                    {environment.description}
                  </span>
                )}
              </span>
            }
          />
        ))}
      </RadioButtonGroup>
    </div>
  );
}

// Body only: the container owns open state, Escape, outside press and focus.
function EnvironmentSwitcherContent({
  environments,
  value,
  onChange,
  disabled = false,
  messages,
  className,
}: EnvironmentSwitcherProps) {
  const text = resolveMessages(defaultEnvironmentSwitcherMessages, messages);
  const prefix = usePrefix();
  const { announcement, switchTo } = useSwitch({
    environments,
    value,
    onChange,
    disabled,
    switched: text.switched,
  });
  const [draft, setDraft] = useState(value);
  // A new `value` replaces the draft.
  const [draftFor, setDraftFor] = useState(value);
  if (draftFor !== value) {
    setDraftFor(value);
    setDraft(value);
  }

  return (
    <div
      className={['afframe-environment-switcher', className]
        .filter(Boolean)
        .join(' ')}>
      <EnvironmentList
        environments={environments}
        heading={text.panelHeading}
        productionTag={text.productionTag}
        disabled={disabled}
        selected={draft}
        onMove={setDraft}
        onCommit={switchTo}
        onBlur={(event) => {
          // Leaving without a commit drops the moved selection, so the
          // container shows the current environment when it opens again.
          if (!event.currentTarget.contains(event.relatedTarget as Node)) {
            setDraft(value);
          }
        }}
      />
      <span role="status" className={`${prefix}--visually-hidden`}>
        {announcement}
      </span>
    </div>
  );
}

function EnvironmentSwitcherPanel({
  environments,
  value,
  onChange,
  label,
  disabled = false,
  messages,
  className,
  renderAction,
  ...openProps
}: EnvironmentSwitcherProps) {
  const text = resolveMessages(defaultEnvironmentSwitcherMessages, messages);
  const prefix = usePrefix();
  const { announcement, switchTo } = useSwitch({
    environments,
    value,
    onChange,
    disabled,
    switched: text.switched,
  });
  const [draft, setDraft] = useState(value);
  const { isOpen, close, panelProps, actionProps } = useHeaderPanel({
    ...openProps,
    initialFocus: (panel) =>
      panel.querySelector<HTMLElement>('input:checked') ??
      panel.querySelector<HTMLElement>('input'),
  });
  // Each opening starts from the current environment, and a new `value`
  // while open replaces the draft.
  const [draftFor, setDraftFor] = useState({ isOpen, value });
  if (draftFor.isOpen !== isOpen || draftFor.value !== value) {
    setDraftFor({ isOpen, value });
    if (isOpen) setDraft(value);
  }
  const current = environments.find((environment) => environment.id === value);
  const actionName = label ?? text.currentEnvironment(current?.label ?? value);

  return (
    <>
      {renderAction ? (
        cloneAction(renderAction, actionProps)
      ) : (
        <HeaderAction
          {...actionProps}
          aria-label={actionName}
          isActive={isOpen}
          tooltipAlignment="end"
          className="afframe-environment-switcher-action">
          <ArrowsHorizontal size={20} />
          <span
            aria-hidden="true"
            className="afframe-environment-switcher-current">
            {current?.label ?? value}
          </span>
        </HeaderAction>
      )}
      <HeaderPanel
        {...panelProps}
        {...{ 'aria-label': text.label, role: 'region' }}
        expanded={isOpen}
        addFocusListeners={false}
        className={['afframe-environment-switcher', className]
          .filter(Boolean)
          .join(' ')}>
        <EnvironmentList
          environments={environments}
          heading={text.panelHeading}
          productionTag={text.productionTag}
          disabled={disabled}
          selected={isOpen ? draft : value}
          onMove={setDraft}
          onCommit={(id) => {
            if (disabled) return;
            switchTo(id);
            close(true);
          }}
        />
      </HeaderPanel>
      <span role="status" className={`${prefix}--visually-hidden`}>
        {announcement}
      </span>
    </>
  );
}
