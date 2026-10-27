import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Could not find the #root element in index.html');
}

createRoot(rootElement).render(
  // StrictMode is temporarily omitted while troubleshooting the reported
  // effect-cleanup error. It can be re-enabled after the issue is resolved.
  <App />
);
