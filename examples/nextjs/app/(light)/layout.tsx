import '@afframe/ui/styles.css';
import { AfframeProvider, type AfframeTheme } from '@afframe/ui';
import type { ReactNode } from 'react';

const theme: AfframeTheme = 'light';

export default function LightLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-afframe-theme={theme}>
      <body>
        <AfframeProvider>{children}</AfframeProvider>
      </body>
    </html>
  );
}
