import { LogoutBanner, LogoutTile, TextInput } from '@afframe/ui';
import { ExpiringBanner, ShellHeader } from './shell-demo';

// The shell header components: the header with its function props lives in
// the 'use client' demo next to this page. LogoutTile in its href form and the
// signed-out LogoutBanner take serializable props only, so this server
// component renders them directly.
export default function ShellPage() {
  return (
    <>
      <ShellHeader />
      <main style={{ padding: 'var(--cds-spacing-07)', marginTop: '3rem' }}>
        <h1>Shell</h1>
        <TextInput id="workspace" labelText="Workspace" />
        <ExpiringBanner />
        <LogoutBanner variant="signed-out" />
        <LogoutTile href="/auth/sign-out" userName="Sample User" />
      </main>
    </>
  );
}
