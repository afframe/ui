import '@afframe/ui/charts.css';
import { TextInput } from '@afframe/ui';
import { ChatElementsDemo, ChatWithElements } from './chat-elements-demo';

// The chart chat element, on its own and inside the chat. The payloads
// and the chat's function props live in the 'use client' demo next to this
// page. scripts/check-example.mjs asserts that the Charts and ECharts
// JavaScript stays out of this route's script tags (it loads lazily).
export default function ChatElementsPage() {
  return (
    <main style={{ padding: 'var(--cds-spacing-07)' }}>
      <h1>Chat elements</h1>
      <TextInput id="question" labelText="Question" />
      <ChatElementsDemo />
      <ChatWithElements />
    </main>
  );
}
