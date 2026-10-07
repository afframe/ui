'use client';

export type ChatModule = typeof import('@carbon/ai-chat');

/**
 * Runs `importer` once and shares its promise. A rejected import is dropped,
 * so the next call tries again.
 */
export function createLoader<T>(importer: () => Promise<T>): () => Promise<T> {
  let pending: Promise<T> | undefined;
  return () => {
    pending ??= importer().catch((error: unknown) => {
      pending = undefined;
      throw error;
    });
    return pending;
  };
}

// @carbon/ai-chat defines custom elements when its module loads, which fails
// on the server, so it loads in the browser only.
export const loadChat = createLoader(() => import('@carbon/ai-chat'));
