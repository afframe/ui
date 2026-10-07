'use client';
import { ChatContainer, MessageResponseTypes } from '@afframe/ui';
import type { ChatInstance } from '@afframe/ui';

// A canned reply, no network. A function prop, so it lives in a client file.
async function customSendMessage(
  _request: unknown,
  _options: unknown,
  instance: ChatInstance
) {
  await instance.messaging.addMessage({
    output: {
      generic: [
        { response_type: MessageResponseTypes.TEXT, text: 'Canned reply.' },
      ],
    },
  });
}

export function ChatDemo() {
  return <ChatContainer messaging={{ customSendMessage }} />;
}
