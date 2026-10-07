'use client';
// Afframe LogoutTile: who is signed in and the log-out action, for a profile
// panel. Written for Afframe; the logout parts of
// @carbon-labs/wc-global-header were a behaviour reference only.
import { Logout } from '@carbon/icons-react';
import { Button, InlineLoading, Layer, Tile } from '@carbon/react';
import { useLayoutEffect, useRef, useState } from 'react';
import { resolveMessages } from '../../messages.js';

export interface LogoutTileMessages {
  /** Text of the log-out button. */
  logOut: string;
  /** Line naming the signed-in user. */
  signedInAs: (name: string) => string;
  /** Shown in the button while logging out. */
  loggingOut: string;
}

export const defaultLogoutTileMessages: LogoutTileMessages = {
  logOut: 'Log out',
  signedInAs: (name) => `Signed in as ${name}`,
  loggingOut: 'Logging out',
};

interface LogoutTileBaseProps {
  /** Shown in the "Signed in as" line; falls back to `userEmail`. */
  userName?: string;
  /** Shown under the name. */
  userEmail?: string;
  /** Disables the button and shows the loading text. */
  loading?: boolean;
  messages?: Partial<LogoutTileMessages>;
  className?: string;
}

export type LogoutTileProps = LogoutTileBaseProps &
  (
    | {
        /** Runs the log-out; a promise keeps the tile loading until it settles. */
        onLogout: () => void | Promise<void>;
        href?: never;
      }
    | {
        /** Sign-out URL: the button is a link, no function needed. */
        href: string;
        onLogout?: never;
      }
  );

export function LogoutTile({
  userName,
  userEmail,
  loading = false,
  onLogout,
  href,
  messages,
  className,
}: LogoutTileProps) {
  const text = resolveMessages(defaultLogoutTileMessages, messages);
  const [pending, setPending] = useState(false);
  const busy = loading || pending;
  const tileRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // A disabled button drops focus to the page: keep it on the tile instead.
  useLayoutEffect(() => {
    if (busy && document.activeElement === buttonRef.current) {
      tileRef.current?.focus();
    }
  }, [busy]);

  const logout = async () => {
    if (busy || !onLogout) return;
    setPending(true);
    try {
      await onLogout();
    } catch {
      // The app reports its own errors; the tile only ends the loading state.
    } finally {
      setPending(false);
    }
  };

  // An empty string counts as missing.
  const shownName = userName || undefined;
  const shownEmail = userEmail || undefined;
  const name = shownName ?? shownEmail;
  return (
    <Layer>
      <Tile
        ref={tileRef}
        tabIndex={-1}
        aria-busy={busy}
        className={['afframe-logout-tile', className]
          .filter(Boolean)
          .join(' ')}>
        {name !== undefined && (
          <p className="afframe-logout-tile-name">{text.signedInAs(name)}</p>
        )}
        {shownName !== undefined && shownEmail !== undefined && (
          <p className="afframe-logout-tile-email">{shownEmail}</p>
        )}
        <Button
          ref={buttonRef}
          kind="tertiary"
          size="md"
          className="afframe-logout-tile-button"
          disabled={busy}
          {...(busy ? {} : { renderIcon: Logout })}
          // Carbon renders a disabled `href` Button as a disabled <button>,
          // so the busy link form cannot be activated.
          {...(href === undefined
            ? { onClick: () => void logout() }
            : { href })}>
          {busy ? <InlineLoading description={text.loggingOut} /> : text.logOut}
        </Button>
      </Tile>
    </Layer>
  );
}
