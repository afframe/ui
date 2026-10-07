import { TextInput } from '@afframe/ui';
import { ChatDemo } from './chat-demo';

// The AI chat without the chat element renderers: scripts/check-example.mjs
// asserts that no Charts, ECharts or data grid JavaScript ships here. The
// function props of the chat live in the 'use client' demo next to this page.
export default function ChatPage() {
  return (
    <main style={{ padding: 'var(--cds-spacing-07)' }}>
      <h1>Chat</h1>
      <TextInput id="topic" labelText="Topic" />
      <ChatDemo />
    </main>
  );
}
