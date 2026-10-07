import { Button, TextHighlighter, TextInput } from '@afframe/ui';

// A server component: TextHighlighter is a Carbon Labs component, so this
// proves the Labs exports work from one ('use client' in src/labs/).
export default function LightPage() {
  return (
    <main style={{ padding: 'var(--cds-spacing-07)' }}>
      <h1>Light theme</h1>
      <TextInput id="name" labelText="Name" placeholder="Jane Doe" />
      <Button>Save</Button>
      <TextHighlighter kind="mark" type="primary">
        Highlighted text
      </TextHighlighter>
    </main>
  );
}
