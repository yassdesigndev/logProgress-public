import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const container = document.getElementById('root');
if (!container) throw new Error('Failed to find the root element');

const root = createRoot(container);

// Remove any height constraints when in PWA mode
if (window.matchMedia('(display-mode: standalone)').matches) {
  document.documentElement.style.height = '100%';
  document.body.style.height = '100%';
  document.body.style.overflowY = 'auto';
  document.body.style.WebkitOverflowScrolling = 'touch';
}

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);