import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { AudioProvider } from './contexts/audio-context';
import BackgroundMusic from './components/BackgroundMusic';
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <AudioProvider>
        <BackgroundMusic />
        <App />
      </AudioProvider>
    </HelmetProvider>
  </React.StrictMode>
);