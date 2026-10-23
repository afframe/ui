import '@afframe/ui/styles.css';
import { AfframeProvider } from '@afframe/ui';
import { createRoot } from 'react-dom/client';
import { App } from './App';

createRoot(document.getElementById('root')!).render(
  <AfframeProvider>
    <App />
  </AfframeProvider>
);
