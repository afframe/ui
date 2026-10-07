'use client';
import {
  ChatChart,
  ChatContainer,
  MessageResponseTypes,
  renderChatElement,
} from '@afframe/ui';
import type { ChatChartTabularData, ChatInstance } from '@afframe/ui';

// Fixed payloads. Each chart engine loads with import() when its element
// renders, so this route ships none of its JavaScript up front.
const chart: ChatChartTabularData = {
  chart_type: 'bar',
  title: 'Revenue',
  summary: 'Revenue by quarter: Q1 12, Q2 18, Q3 9.',
  data: [
    { group: 'Q1', value: 12 },
    { group: 'Q2', value: 18 },
    { group: 'Q3', value: 9 },
  ],
};

export function ChatElementsDemo() {
  return (
    <div data-afframe-extra="chat-elements">
      <ChatChart {...chart} />
    </div>
  );
}

// A canned reply with a chart element, no network. Function props, so they
// live in this client file.
async function customSendMessage(
  _request: unknown,
  _options: unknown,
  instance: ChatInstance
) {
  await instance.messaging.addMessage({
    output: {
      generic: [
        {
          response_type: MessageResponseTypes.USER_DEFINED,
          user_defined: { user_defined_type: 'afframe-chart', ...chart },
        },
      ],
    },
  });
}

export function ChatWithElements() {
  return (
    <ChatContainer
      messaging={{ customSendMessage }}
      renderUserDefinedResponse={renderChatElement}
    />
  );
}
