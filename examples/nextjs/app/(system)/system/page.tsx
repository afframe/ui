import { Button, TextInput } from '@afframe/ui';

export default function SystemPage() {
  return (
    <main style={{ padding: 'var(--cds-spacing-07)' }}>
      <h1>System theme</h1>
      <TextInput id="name" labelText="Name" placeholder="Jane Doe" />
      <Button>Save</Button>
    </main>
  );
}
