'use client';
import {
  EnvironmentSwitcher,
  Header,
  HeaderGlobalBar,
  HeaderName,
  HelpMenu,
  LogoutBanner,
} from '@afframe/ui';
import { useState } from 'react';

const environments = [
  { id: 'staging', label: 'Staging' },
  { id: 'production', label: 'Production', production: true },
];

// The function props of the shell components live in this client file:
// functions cannot cross from the server page.
export function ShellHeader() {
  const [environment, setEnvironment] = useState('staging');
  return (
    <Header aria-label="Example">
      <HeaderName href="/" prefix="Afframe">
        Example
      </HeaderName>
      <HeaderGlobalBar>
        <EnvironmentSwitcher
          environments={environments}
          value={environment}
          onChange={setEnvironment}
        />
        <HelpMenu
          items={[
            { id: 'docs', label: 'Documentation', href: '/afframe' },
            { type: 'divider' },
            {
              id: 'feedback',
              label: 'Send feedback',
              onSelect: () => console.log('feedback'),
            },
          ]}
        />
      </HeaderGlobalBar>
    </Header>
  );
}

export function ExpiringBanner() {
  return (
    <LogoutBanner
      variant="expiring"
      minutesLeft={5}
      onStaySignedIn={() => console.log('stay signed in')}
    />
  );
}
