import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import './index.css'
import App from './App.jsx'
import { AUTH_STATE_CHANGED_EVENT } from './features/auth/authSession'
import { applyAccessibilityPreferences, getStoredSettingsForUser } from './features/accessibility/accessibilitySettings'

const applyStoredAccessibilitySettings = () => {
  if (typeof document === 'undefined') return;

  const userDataRaw = localStorage.getItem('userData');
  if (!userDataRaw) {
    applyAccessibilityPreferences();
    return;
  }

  try {
    const userData = JSON.parse(userDataRaw);
    if (!userData?.id) {
      applyAccessibilityPreferences();
      return;
    }

    applyAccessibilityPreferences(getStoredSettingsForUser(userData.id));
  } catch (error) {
    console.error('No se pudo resolver la cuenta activa para accesibilidad:', error);
    applyAccessibilityPreferences();
  }
};

window.addEventListener(AUTH_STATE_CHANGED_EVENT, applyStoredAccessibilitySettings);


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
