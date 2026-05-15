import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import './index.css'
import App from './App.jsx'

const applyStoredAccessibilitySettings = () => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  let storageKey = 'quickstop:settings:v1';
  const userDataRaw = localStorage.getItem('userData');

  if (userDataRaw) {
    try {
      const userData = JSON.parse(userDataRaw);
      if (userData?.id) {
        storageKey = `quickstop:settings:user:${userData.id}`;
      }
    } catch (error) {
      console.error('No se pudo resolver la cuenta activa para accesibilidad:', error);
    }
  }

  const raw = localStorage.getItem(storageKey) ?? localStorage.getItem('quickstop:settings:v1');
  if (!raw) return;

  try {
    const parsed = JSON.parse(raw);
    const accessibility = parsed?.accessibility ?? parsed;
    if (!accessibility) return;

    root.classList.toggle('qs-high-contrast', !!accessibility.highContrast);
    root.classList.toggle('qs-reduced-motion', !!accessibility.reducedMotion);
    root.classList.toggle('qs-dark-mode', !!accessibility.darkMode);
    root.classList.toggle('qs-dyslexia', !!accessibility.dyslexiaFont);

    root.classList.remove('qs-text-normal', 'qs-text-large', 'qs-text-xlarge');
    root.classList.remove('qs-buttons-normal', 'qs-buttons-large', 'qs-buttons-xlarge');
    root.classList.remove('qs-line-spacing-normal', 'qs-line-spacing-relaxed');

    if (accessibility.textScale === 'large') {
      root.classList.add('qs-text-large');
    } else if (accessibility.textScale === 'xlarge') {
      root.classList.add('qs-text-xlarge');
    } else {
      root.classList.add('qs-text-normal');
    }

    if (accessibility.buttonSize === 'large') {
      root.classList.add('qs-buttons-large');
    } else if (accessibility.buttonSize === 'xlarge') {
      root.classList.add('qs-buttons-xlarge');
    } else {
      root.classList.add('qs-buttons-normal');
    }

    if (accessibility.lineSpacing === 'relaxed') {
      root.classList.add('qs-line-spacing-relaxed');
    } else {
      root.classList.add('qs-line-spacing-normal');
    }
  } catch (error) {
    console.error('No se pudieron aplicar los ajustes de accesibilidad:', error);
  }
};

applyStoredAccessibilitySettings();

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
