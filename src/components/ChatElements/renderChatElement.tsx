'use client';
import type { ChatInstance, RenderUserDefinedState } from '@carbon/ai-chat';
import type { ReactNode } from 'react';
import { resolveMessages } from '../../messages.js';
import { ChatChart } from './ChatChart.js';
import {
  defaultChatElementsMessages,
  type ChatChartMessages,
} from './messages.js';
import {
  chatElementGuards,
  chatElementTypes,
  isChatElementType,
  type ChatChartData,
  type ChatElementType,
} from './payloads.js';
import { ElementError, ElementLoading } from './states.js';

export interface RenderChatElementOptions {
  /** The element types to render; others return `null`. Default: all. */
  elements?: readonly ChatElementType[];
  /** String overrides per element. */
  messages?: {
    chart?: Partial<ChatChartMessages>;
  };
}

type Messages = NonNullable<RenderChatElementOptions['messages']>;

const messageKey = {
  'afframe-chart': 'chart',
} as const satisfies Record<ChatElementType, keyof Messages>;

const payloadKeys: Record<ChatElementType, readonly string[]> = {
  'afframe-chart': [
    'engine',
    'chart_type',
    'title',
    'summary',
    'data',
    'option',
  ],
};

function userDefinedType(item: unknown): unknown {
  if (typeof item !== 'object' || item === null) return undefined;
  const data = (item as { user_defined?: unknown }).user_defined;
  return typeof data === 'object' && data !== null
    ? (data as { user_defined_type?: unknown }).user_defined_type
    : undefined;
}

/**
 * `renderUserDefinedResponse` for the chat: draws `user_defined` items whose
 * `user_defined_type` is an Afframe chat element. Returns `null` for any
 * other item, so an app can chain its own renderer after it.
 */
export function renderChatElement(
  state: RenderUserDefinedState,
  _instance?: ChatInstance,
  options: RenderChatElementOptions = {}
): ReactNode {
  const { elements = chatElementTypes, messages = {} } = options;
  const item = state.messageItem;
  const type = userDefinedType(item ?? state.partialItems?.[0]);
  if (!isChatElementType(type) || !elements.includes(type)) return null;
  const own = messages[messageKey[type]];
  const text = resolveMessages(defaultChatElementsMessages, own);
  // Streaming: the item is complete only once `messageItem` is set.
  if (!item) return <ElementLoading label={text.loading} />;
  // Only the payload's own fields pass: a payload cannot set component
  // props such as className or messages.
  const data = (item as { user_defined: Record<string, unknown> }).user_defined;
  const payload = Object.fromEntries(
    payloadKeys[type]
      .filter((key) => Object.hasOwn(data, key))
      .map((key) => [key, data[key]])
  );
  if (!chatElementGuards[type](payload))
    return <ElementError title={text.invalid(type)} />;
  return (
    <ChatChart
      {...(payload as unknown as ChatChartData)}
      messages={messages.chart}
    />
  );
}
