'use client';
import type {
  ChatContainer as IbmChatContainer,
  ChatCustomElement as IbmChatCustomElement,
} from '@carbon/ai-chat';
import { InlineNotification, SkeletonPlaceholder } from '@carbon/react';
import { useEffect, useState } from 'react';
import type { ComponentProps, ComponentType } from 'react';
import { resolveMessages } from '../../messages.js';
import { loadChat } from './chat-loader.js';
import type { ChatModule } from './chat-loader.js';

export interface AIChatMessages {
  /** Shown when the chat's code fails to load. */
  loadError: string;
}

export const defaultAIChatMessages: AIChatMessages = {
  loadError: 'The chat could not load. Reload the page to try again.',
};

interface AfframeChatProps {
  /** Overrides for Afframe's own strings; the chat's are IBM's `strings`. */
  messages?: Partial<AIChatMessages>;
}

type ChatState<P> =
  | { status: 'loading' }
  | { status: 'failed' }
  | { status: 'loaded'; Component: ComponentType<P> };

// Loads the chat after the first render. A failed load shows the error; the
// next mount tries again.
function useChatComponent<P>(
  pick: (chat: ChatModule) => ComponentType<P>
): ChatState<P> {
  const [state, setState] = useState<ChatState<P>>({ status: 'loading' });
  useEffect(() => {
    let live = true;
    loadChat().then(
      (chat) => {
        if (live) setState({ status: 'loaded', Component: pick(chat) });
      },
      () => {
        if (live) setState({ status: 'failed' });
      }
    );
    return () => {
      live = false;
    };
  }, [pick]);
  return state;
}

function LoadError({
  messages,
}: {
  messages: Partial<AIChatMessages> | undefined;
}) {
  const text = resolveMessages(defaultAIChatMessages, messages);
  return (
    <InlineNotification
      kind="error"
      lowContrast
      hideCloseButton
      title={text.loadError}
    />
  );
}

// The wrapper only marks the chat; it takes no box, so the chat and its
// skeleton size against the app's own layout (flex, grid, height: 100%).
const wrapperStyle = { display: 'contents' } as const;

const pickContainer = (chat: ChatModule) => chat.ChatContainer;
const pickCustomElement = (chat: ChatModule) => chat.ChatCustomElement;

export type ChatContainerComponentProps = ComponentProps<
  typeof IbmChatContainer
> &
  AfframeChatProps;
export type ChatCustomElementComponentProps = ComponentProps<
  typeof IbmChatCustomElement
> &
  AfframeChatProps;

/**
 * IBM's ChatContainer, loaded in the browser after the first render. A Carbon
 * skeleton holds its place until then, an error if the load fails.
 */
export function ChatContainer({
  messages,
  ...props
}: ChatContainerComponentProps) {
  const chat = useChatComponent(pickContainer);
  return (
    <div data-afframe-extra="ai-chat" style={wrapperStyle}>
      {chat.status === 'loaded' ? (
        <chat.Component {...props} />
      ) : chat.status === 'failed' ? (
        <LoadError messages={messages} />
      ) : (
        <SkeletonPlaceholder />
      )}
    </div>
  );
}

/**
 * IBM's ChatCustomElement, loaded in the browser after the first render. The
 * skeleton takes `className`, so it has the size the chat will have.
 */
export function ChatCustomElement({
  messages,
  ...props
}: ChatCustomElementComponentProps) {
  const chat = useChatComponent(pickCustomElement);
  return (
    <div data-afframe-extra="ai-chat" style={wrapperStyle}>
      {chat.status === 'loaded' ? (
        <chat.Component {...props} />
      ) : chat.status === 'failed' ? (
        <LoadError messages={messages} />
      ) : (
        <SkeletonPlaceholder className={props.className} />
      )}
    </div>
  );
}
