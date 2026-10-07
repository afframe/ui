'use client';
import { InlineNotification, SkeletonPlaceholder } from '@carbon/react';

/** Placeholder while an engine loads or a payload streams. */
export function ElementLoading({ label }: { label: string }) {
  return (
    <div className="afframe-chat-element__loading" aria-busy="true">
      <SkeletonPlaceholder />
      <span className="cds--visually-hidden">{label}</span>
    </div>
  );
}

/** Shown instead of an element whose payload failed its guard. */
export function ElementError({ title }: { title: string }) {
  return (
    <InlineNotification
      kind="error"
      lowContrast
      hideCloseButton
      title={title}
    />
  );
}
