import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // VitePWA genera el archivo sw.js
    navigator.serviceWorker.register('/sw.js').then(registration => {
      console.log('SW registrado con éxito:', registration);
    }).catch(error => {
      console.error('Fallo en el registro del SW:', error);
    });
  });
}
