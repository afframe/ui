'use client';
// Afframe LogoutBanner: an inline notice at the top of the shell that the
// session is ending or has ended. Written for Afframe; the session expiry
// notice of @carbon-labs/wc-global-header was a behaviour reference only.
import { ActionableNotification, FeatureFlags } from '@carbon/react';
import { useEffect } from 'react';
import { resolveMessages } from '../../messages.js';

export interface LogoutBannerMessages {
  /** Text of the `expiring` banner. */
  expiring: (minutes: number) => string;
  /** Text of the `signed-out` banner. */
  signedOut: string;
  /** Action of the `expiring` banner. */
  staySignedIn: string;
  /** Action of the `signed-out` banner. */
  signIn: string;
  /** Accessible name of the close button. */
  closeIconDescription: string;
  /** Status icon text of the `expiring` banner. */
  expiringIconDescription: string;
  /** Status icon text of the `signed-out` banner. */
  signedOutIconDescription: string;
}

export const defaultLogoutBannerMessages: LogoutBannerMessages = {
  expiring: (minutes) =>
    `Your session ends in ${minutes} ${minutes === 1 ? 'minute' : 'minutes'}.`,
  signedOut: 'You have been signed out.',
  staySignedIn: 'Stay signed in',
  signIn: 'Sign in',
  closeIconDescription: 'Close',
  expiringIconDescription: 'Warning',
  signedOutIconDescription: 'Information',
};

export type LogoutBannerVariant = 'expiring' | 'signed-out';

interface LogoutBannerBaseProps {
  /** `expiring`: called by the "Stay signed in" action. */
  onStaySignedIn?: () => void;
  /** `signed-out`: called by the "Sign in" action. */
  onSignIn?: () => void;
  /** Shows the close button; the app removes the banner. */
  onDismiss?: () => void;
  messages?: Partial<LogoutBannerMessages>;
  className?: string;
}

export type LogoutBannerProps = LogoutBannerBaseProps &
  (
    | {
        variant: 'expiring';
        /** Whole minutes left. The app owns the clock; the banner never ticks. */
        minutesLeft: number;
      }
    | { variant: 'signed-out'; minutesLeft?: never }
  );

/** Whole minutes left: rounded up, at least 0 (a non-number counts as 0). */
function wholeMinutes(minutes: number | undefined) {
  return Number.isFinite(minutes) ? Math.max(0, Math.ceil(minutes ?? 0)) : 0;
}

export function LogoutBanner({
  variant,
  minutesLeft,
  onStaySignedIn,
  onSignIn,
  onDismiss,
  messages,
  className,
}: LogoutBannerProps) {
  const text = resolveMessages(defaultLogoutBannerMessages, messages);
  const expiring = variant === 'expiring';
  const minutes = wholeMinutes(minutesLeft);
  const invalidMinutes = expiring && minutes !== minutesLeft;
  useEffect(() => {
    if (invalidMinutes) {
      console.warn(
        `LogoutBanner: minutesLeft should be a non-negative whole number; got ${String(minutesLeft)}, showing ${minutes}.`
      );
    }
  }, [invalidMinutes, minutesLeft, minutes]);
  const action = expiring ? onStaySignedIn : onSignIn;
  return (
    // Without the flag Carbon adds two tabbable "Focus sentinel" links, which
    // only make sense for its alertdialog role.
    <FeatureFlags enableFocusWrapWithoutSentinels>
      <ActionableNotification
        className={['afframe-logout-banner', className]
          .filter(Boolean)
          .join(' ')}
        inline
        lowContrast={false}
        kind={expiring ? 'warning' : 'info'}
        role={expiring ? 'status' : 'alert'}
        title={expiring ? text.expiring(minutes) : text.signedOut}
        statusIconDescription={
          expiring
            ? text.expiringIconDescription
            : text.signedOutIconDescription
        }
        {...(action === undefined
          ? {}
          : {
              actionButtonLabel: expiring ? text.staySignedIn : text.signIn,
              onActionButtonClick: action,
            })}
        hasFocus={false}
        hideCloseButton={onDismiss === undefined}
        closeOnEscape={onDismiss !== undefined}
        aria-label={text.closeIconDescription}
        // The app owns visibility: returning false keeps Carbon from hiding
        // the banner on its own.
        onClose={() => {
          onDismiss?.();
          return false;
        }}
      />
    </FeatureFlags>
  );
}
