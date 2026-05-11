export const AUTH_STATE_CHANGED_EVENT = 'quickstop:auth-state-changed';

export const notifyAuthStateChanged = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(AUTH_STATE_CHANGED_EVENT));
  }
};

