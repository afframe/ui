import { Button, TextInput } from '@afframe/ui';

export default function DarkPage() {
  return (
    <main style={{ padding: 'var(--cds-spacing-07)' }}>
      <h1>Dark theme</h1>
      <TextInput id="name" labelText="Name" placeholder="Jane Doe" />
      <Button>Save</Button>
    </main>
  );
}
